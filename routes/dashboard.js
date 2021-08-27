var express = require('express');
var router = express.Router();

const { ensureAuthenticated } = require('../config/auth');
var User = require('../models/User');
const mail = require('../config/mail');


router.get('/', ensureAuthenticated, (req, res, next) => {
    if(req.user.role == 'user')
    {
        res.render('./dashboard/user-dashboard', {
            user: req.user,
            login: req.query.login
        });
    }
    else if(req.user.role = 'admin')
    {
        res.render('./dashboard/admin-dashboard', {
            user: req.user,
            login: req.query.login,
        });
    }
});

router.get('/settings', ensureAuthenticated, (req, res, next) => {
    res.render('./dashboard/user-settings', {
        user: req.user,
    })
});

router.get('/users', ensureAuthenticated, (req, res, next) => {
    if(req.user.role == 'admin'){
        User.find({}, (err, users) => {
            res.render('./dashboard/admin-users', {
                user: req.user,
                users,
            });
        })
    }
    else res.send('Access Denied');
});

module.exports = router;
