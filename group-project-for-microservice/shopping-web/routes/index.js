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
router.get('/customer/login', function(req, res, next) {
    console.log(req.user);
    console.log(req.isAuthenticated());
    res.render('index', { title: 'success' });
});
router.get('/customer/register', function(req, res, next){
  res.render('customer/register', {title:"register", balala: 'Registration'});
});
//
 router.post('/customer/register', function(req, res, next){
  const errors = req.validationErrors();
   if (errors) {
     console.log(`errors: ${JSON.stringify(errors)}`);
       res.render('customer/register', {
         title: 'Registration Fails!',
         errors: errors
       });
   }
     const email = req.body.email;
     const password = req.body.password;
     const username = req.body.username;
     const db = require('../db.js');
     bcrypt.hash(password, saltRounds, function(err, hash) {
         // Store hash in your password DB.
         db.query('INSERT INTO users (username, email, password) VALUES (?,?,?)',[username, email, hash],
             function(error, results, fields) {if (error) throw error});
         //res.render('customer/register', {title: 'Registration Success'});

         db.query('SELECT LAST_INSERT_ID() as user_id',function(error,result,fields){
             if(error) throw error;
             const user_id = result[0];
             console.log(result[0]);
             //login come from pasport
             req.login(user_id,function(error){
                 res.redirect('/');
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
//
// router.get('/customer/login', function(req, res, next){
//     res.redirect('/');
// });
// router.post('/customer/login', function(req, res, next){
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
//     db.query('INSERT INTO users (username, email, password) VALUES (?,?,?)',[username, email, password],
//         function(error, results, fields) {if (error) throw error});
//     //res.render('customer/register', {title: 'Registration Success'});
//     res.redirect('/login');
//     console.log("success!");
// });
router.post('/', function(req, res, next){
    const errors = req.validationErrors();
    if (errors) {
        console.log(`errors: ${JSON.stringify(errors)}`);
        res.render('customer/register', {
            title: 'Registration Fails!',
            errors: errors
        });
    }
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    const db = require('../db.js');

    db.query('INSERT INTO users (username, email, password) VALUES (?,?,?)',[username, email, password],
        function(error, results, fields) {if (error) throw error});
    //res.render('customer/register', {title: 'Registration Success'});
    //res.redirect('/login');
    db.query('SELECT LAST_INSERT_ID() as user_id',function(error,result,fields){
        if(error) throw error;
        const user_id = result[0];
        console.log(result[0]);
        //login come from pasport
        req.login(user_id,function(error){
            res.render('customer/login', {title: 'Registration Success'});
        });
        //res.render('customer/login', {title: 'Registration Success'});
    });
    //res.render('customer/login', {title: 'Registration Success'});
    console.log("success!");
});
//this is to confirm the passport
//each time store
passport.serializeUser(function(user_id, done) {
    done(null, user_id);
});
//each time fetch
passport.deserializeUser(function(user_id, done) {
//no erro variable
    //done(err, user_id);
    done(null, user_id);
});
module.exports = router;
