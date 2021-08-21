const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Load User model
const User = require('../models/User');

module.exports = function(){
    passport.use(
        new LocalStrategy({ usernameField: 'username' , passwordField: 'password'}, function(username, password, done){
            //Match User
            User.findOne({idNumber: username})
                .then(user => {
                    if(!user){
                        return done(null,false, {message: 'کد ملی یافت نشد!'});
                    }
                    // Match password
                    bcrypt.compare(password, user.password, function(err, isMatch){
                        if(err) throw err;
                        if(isMatch){
                            return done(null, user);
                        }
                        else {
                            return done(null, false, {message: 'رمز عبور اشتباه میباشد!'});
                        }
                    });
                })
                .catch(err => console.log(err));

        })
    );
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done){
        User.findById(id,function(err, user){
            done(err, user);
        });
    });
    
}
