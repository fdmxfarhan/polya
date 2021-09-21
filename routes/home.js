var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/', (req, res, next) => {
    res.render('home', {
        user: req.user,
    });
});

router.get('/pricing', (req, res, next) => {
    res.render('pricing', {
        user: req.user,
    });
});


module.exports = router;
