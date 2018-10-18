var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHsb = require('express-handlebars');
var logger = require('morgan');
// this is for data validation and authentication
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
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

///////////CREATE A FUNCTION TO CONTROL AND HIDE INFORMATION IN THE HEADER LIKE LOGIN AND LOG OUT
//GLOBAL VARIABLE
//PASSTHROUGH EVERY VIEW automatically
app.use(function(req,res,next){
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
////////////authentication######compare the password and username fit in the data local passport compare
//authenticate the login#####
passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log(password);
        console.log(username);
        //must compare with db passwaord and name
        //return done(null, 'default string is success');
        //return done(null, false);//if false is replced with a 'string ' it is considered always successful
        const db = require('./db');
        db.query('SELECT id, password FROM new_user WHERE username = ?',[username],function(error,results, fields){
            if(error){
                //done(error)
                done(error);};//done is from passport taken care of by passport
            if(results.length === 0){//must be ===
                return done(null,false);//tell the user the authentication is unsuccessful
                //********must add return
            }else{
                const hash = results[0].password.toString();
                //database passwordonly 46
                //new hash is longer thaa60
                console.log(hash);
                //password is original password
                console.log(password);
                bcrypt.compare(password,hash,function(err,response){
                    if(response === true){ //database must be 1000
                        console.log("match");
                        return done(null,'safdadf');
                    }else{
                        console.log("notmatch");
                        return done(null,false);}
                });
            }
            //const hash = results[0].password.toString().substring(0,46);
            //return done(null,'sajfldad'); //any string indicating this is successfulcle login
        })
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
