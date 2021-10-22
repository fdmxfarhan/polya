var express = require('express');
var router = express.Router();

const { ensureAuthenticated } = require('../config/auth');
var Class = require('../models/Class');
var User = require('../models/User');
const dateConvert = require('../config/dateConvert');
const prices = require('../config/prices');

router.get('/', (req, res, next) => {
    res.render('home', {
        user: req.user,
    });
});
router.get('/pricing', (req, res, next) => {
    res.render('pricing', {
        user: req.user,
        prices,
        dateConvert,
    });
});
router.get('/search', (req, res, next) => {
    Class.find({public: true}, (err, classes) => {
        res.render('./class/search', {
            user: req.user,
            classes,
        })
    })
});
var searchClass = (cls, text) => {
    if(cls.title.search(text) != -1) return true;
    if(cls.creator.search(text) != -1) return true;
    if(cls.title.search(text) != -1) return true;
    if(cls.icon.search(text) != -1) return true;
    return false;
}
router.post('/search', (req, res, next) => {
    var {text} = req.body;
    Class.find({public: true}, (err, allClasses) => {
        classes = [];
        for(var i=0; i<allClasses.length; i++){
            if(searchClass(allClasses[i], text))
                classes.push(allClasses[i]);
        }
        res.render('./class/search', {
            user: req.user,
            classes,
            text,
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
        if(!classes[classID]) classesID.push(classID);
        classes[classID] = cls;
        User.updateMany({_id: req.user._id}, {$set: {classes, classesID}}, (err) => {
            res.redirect(`./dashboard/class-view?classID=${classID}`);
        })
    });
});

module.exports = router;
