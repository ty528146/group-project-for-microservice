var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var passport = require('passport');
const saltRounds = 10;
/* GET home page. */

router.get('/', function(req, res, next) {
    console.log(req.user);
    console.log(req.isAuthenticated());
    res.redirect('/shopping');
});
router.get('/shopping', function(req, res, next) {
    res.render('index', { title: 'Quick Shopping' });
});
router.get('/profile',authenticationMiddleware(),function(req,res,next){
    res.render('customer/profile', {title:"register"});
});
router.get('/login/fail',authenticationMiddleware(),function(req,res,next){
    res.redirect('/');
});
router.get('/register/fail',authenticationMiddleware(),function(req,res,next){
    res.render('index', { title: 'registration fails' });
});
router.get('/customer/login',authenticationMiddleware(), function(req, res, next) {
    console.log(req.user);
    console.log(req.isAuthenticated());
    res.render('index', { title: 'success' });
});
router.get('/customer/register', function(req, res, next){
  res.render('customer/register', {title:"register", balala: 'Registration'});
});
//
router.get('/logout',function(req,res,next){
    req.logout();//only log out at the app need to clear the session in our database as well
    req.session.destroy();
    res.redirect('/');
})
 router.post('/customer/register', function(req, res, next){
     //req.checkBody('username','username should be 3-100 characters long').len(3,100);
     req.checkBody('email','email should be 3-100 characters long').len(3,100);
     req.checkBody('email','email should be valid').isEmail();
     req.checkBody('password','email should be 3-100 characters long').len(3,100);
     req.checkBody('repassword','email should be 3-100 characters long').equals(req.body.password);
  const errors = req.validationErrors();
   if (errors) {
     //console.log(`errors: ${JSON.stringify(errors)}`);
       res.render('customer/register', {
         title: 'Registration Fails!',
          errors: errors
        });
      // res.redirect('/register/fail');
   }
     const email = req.body.email;
     const password = req.body.password;
     const username = req.body.username;
     const db = require('../db.js');
     bcrypt.hash(password, saltRounds, function(err, hash) {
         console.log(hash);
         // Store hash in your password DB.
         db.query('INSERT INTO new_user (username, email, password) VALUES (?,?,?)',[username, email, hash],
             function(error, results, fields) {if (error) throw error});
         //res.render('customer/register', {title: 'Registration Success'});

         db.query('SELECT LAST_INSERT_ID() as user_id',function(error,result,fields){
             if(error) throw error;
             const user_id = result[0];
             console.log(result[0]);
             //login come from pasport
             req.login(user_id,function(error){
                 res.redirect('/');
                 //prompt('succesfully register!');
             });
             //res.render('customer/login', {title: 'Registration Success'});
         });
         //res.render('customer/login', {title: 'Registration Success'});
         console.log("success!");
     });
     // db.query('INSERT INTO users (username, email, password) VALUES (?,?,?)',[username, email, password],
     //     function(error, results, fields) {if (error) throw error});
     // //res.render('customer/register', {title: 'Registration Success'});
     // res.redirect('/');
 });

////////////////////////////////
//this is acturally login page post

router.post('/',passport.authenticate('local',{
    successRedirect:'/profile',
    failureRedirect:'/login/fail'
}));
////////////////////////////////
// router.post('/', function(req, res, next){
//     const errors = req.validationErrors();
//     if (errors) {
//         console.log(`errors: ${JSON.stringify(errors)}`);
//         res.render('customer/register', {
//             title: 'Registration Fails!',
//             errors: errors
//         });
//     }
//     const email = req.body.email;
//     const password = req.body.password;
//     const username = req.body.username;
//     const db = require('../db.js');
//
//     db.query('INSERT INTO user_new (username, email, password) VALUES (?,?,?)',[username, email, password],
//         function(error, results, fields) {if (error) throw error});
//     //res.render('customer/register', {title: 'Registration Success'});
//     //res.redirect('/login');
//     db.query('SELECT LAST_INSERT_ID() as user_id',function(error,result,fields){
//         if(error) throw error;

//         const user_id = result[0];
//         console.log(result[0]);
//         //login come from pasport
//         req.login(user_id,function(error){
//             res.render('customer/login', {title: 'Registration Success'});
//         });
//         //res.render('customer/login', {title: 'Registration Success'});
//     });
//     //res.render('customer/login', {title: 'Registration Success'});
//     console.log("success!");
// });
//this is to confirm the passport
//each time store login will use this
passport.serializeUser(function(user_id, done) {
    done(null, user_id);
});
//each time fetch
passport.deserializeUser(function(user_id, done) {
//no erro variable
    //done(err, user_id);
    done(null, user_id);
});
//this is when author is authenticated after login which is a middleware will be used in
function authenticationMiddleware () {
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()) return next();
        res.redirect('/')
    }
}
module.exports = router;
