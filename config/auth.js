module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg', 'دسترسی مجاز نیست لطفا ابتدا وارد شوید!');
        res.redirect('/users/login');
    }
}