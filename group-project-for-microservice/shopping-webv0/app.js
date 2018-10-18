var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHsb = require('express-handlebars');
var logger = require('morgan');
// this is for data validation
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var MySQLStore = require('express-mysql-session')(session);

var expressValidator = require('express-validator');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var mysql = require('mysql');
var app = express();
require('dotenv').config();
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', expressHsb({defaultLayout:'layout', extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator([]));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

///session persistent
var options = {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database : 'customer'
};
var sessionStore = new MySQLStore(options);
///////////i added something here
app.use(session({
    secret: 'keyboard cataliasotn',
    resave: false,//load the page session//save ssession once
    store:sessionStore,//data pertaining the user session,persist until we log out of
    saveUninitialized: false,//cookie
    //cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());




app.use('/', indexRouter);
app.use('/users', usersRouter);
////////////authentication
passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log(password);
        console.log(username);
        return done(null, false);//if false is replced with a 'string ' it is considered always successful

    }
));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
