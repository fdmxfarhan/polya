var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
var User = require('../models/User');
const bcrypt = require('bcryptjs');
const mail = require('../config/mail');
const passport = require('passport');

router.get('/register', (req, res, next) => {
    if(req.user)
        res.redirect('/dashboard');
    else
        res.render('register');
});

router.get('/login', (req, res, next) => {
    if(req.user)
        res.redirect('/dashboard');
    else
        res.render('login');
});
  
router.post('/register', (req, res, next) => {
    const { firstName, lastName, email, password, confirm} = req.body;
    const role = 'user', card = 0;
    const ipAddress = req.connection.remoteAddress;
    let errors = [];
    /// check required
    if(!firstName || !lastName || !email || !password || !confirm){
        errors.push({msg: 'لطفا موارد خواسته شده را کامل کنید!'});
    }
    /// check password match
    if(password !== confirm){
        errors.push({msg: 'تایید رمز عبور صحیح نمیباشد!'});
    }
    /// check password length
    if(password.length < 4){
        errors.push({msg: 'رمز عبور شما بسیار ضعیف میباشد!'});
    }
    ///////////send evreything 
    if(errors.length > 0 ){
        res.render('register', {  firstName, lastName, email, password, confirm, errors});
    }
    else{
        const fullname = firstName + ' ' + lastName;
        // validation passed
        User.findOne({ email: email})
            .then(user =>{
            if(user){
                // user exist
                errors.push({msg: 'کد ملی قبلا ثبت شده است.'});
                res.render('register', { firstName, lastName, email, password, confirm, errors });
            }
            else {
                const newUser = new User({firstName, lastName, email, password, role, card, fullname});
                // Hash password
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                    .then(user => {
                        passport.authenticate('local', {
                            successRedirect: '/dashboard?login=true',
                            failureRedirect: '/users/login',
                            failureFlash: true
                        })(req, res, next);
                    }).catch(err => console.log(err));
                }));
                console.log(newUser);
            }
        });
    }  
});
  
router.post('/login', function(req, res, next){
    const { email, password} = req.body;
    let errors = [];
    /// check required
    if(!email || !password){
      errors.push({msg: 'لطفا موارد خواسته شده را کامل کنید!'});
    }
    if(errors.length > 0 ){
      res.render('login', { errors, email, password});
    }
    passport.authenticate('local', {
      successRedirect: '/dashboard?login=true',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
});
  
// Logout handle
router.get('/logout', function(req, res, next){
    req.logOut();
    req.flash('success_msg', 'شما با موفقیت خارج شدید');
    res.redirect('/users/login');
});

module.exports = router;


