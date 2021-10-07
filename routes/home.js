var express = require('express');
var router = express.Router();

const { ensureAuthenticated } = require('../config/auth');
var Class = require('../models/Class');
var User = require('../models/User');
const dateConvert = require('../config/dateConvert');

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

router.get('/search', (req, res, next) => {
    Class.find({}, (err, classes) => {
        res.render('./class/search', {
            user: req.user,
            classes,
        })
    })
});

router.post('/search', (req, res, next) => {
    var {text} = req.body;
    Class.find({public: true}, (err, classes) => {
        res.render('./class/search', {
            user: req.user,
            classes,
        })
    })
});

router.get('/class-view', (req, res, next) => {
    var {classID} = req.query;
    Class.findById(classID, (err, cls) => {
        res.render('./class/class-view', {
            user: req.user,
            cls,
            dateConvert,
        });
    });
});

router.get('/study-class', (req, res, next) => {
    var {classID} = req.query;
    Class.findById(classID, (err, cls) => {
        var classes = req.user.classes;
        var classesID = req.user.classesID;
        if(!classes[classID]){
            classes[classID] = cls;
            classesID.push(classID);
        }
        User.updateMany({_id: req.user._id}, {$set: {classes, classesID}}, (err) => {
            res.redirect(`./dashboard/class-view?classID=${classID}`);
        })
    });
});


module.exports = router;
