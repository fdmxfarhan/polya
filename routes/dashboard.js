var express = require('express');
var router = express.Router();

const { ensureAuthenticated } = require('../config/auth');
var User = require('../models/User');
var Class = require('../models/Class');
const mail = require('../config/mail');


router.get('/', ensureAuthenticated, (req, res, next) => {
    Class.find({}, (err, classes) => {
        if(req.user.role == 'user')
        {
            res.render('./dashboard/user-dashboard', {
                user: req.user,
                login: req.query.login,
                classes
            });
        }
        else if(req.user.role = 'admin')
        {
            res.render('./dashboard/admin-dashboard', {
                user: req.user,
                login: req.query.login,
                classes
            });
        }
    });
});

router.get('/settings', ensureAuthenticated, (req, res, next) => {
    Class.find({}, (err, classes) => {
        res.render('./dashboard/user-settings', {
          user: req.user,
          classes,
        })
    })
});

router.get('/users', ensureAuthenticated, (req, res, next) => {
    if(req.user.role == 'admin'){
        Class.find({}, (err, classes) => {
            User.find({}, (err, users) => {
                res.render('./dashboard/admin-users', {
                    user: req.user,
                    users,
                    classes,
                });
            });
        });
    }
    else res.send('Access Denied');
});

router.post('/add-class', ensureAuthenticated, (req, res, next) => {
    var {title, iconElement} = req.body;
    if(title && iconElement){
        var newClass = new Class({
            userID: req.user._id, 
            creator: req.user.fullname, 
            title: title,
            icon: iconElement,
            deck: [],
            createDate: Date.now(),
        });
        newClass.save().then(doc => {
            res.redirect(`/dashboard/class-view?classID=${newClass._id}`);
        }).catch(err => {
            if(err) console.log(err);
        })

    }
});

router.get('/class-view', ensureAuthenticated, (req, res, next) => {
    var classID = req.query.classID;
    if(classID){
        Class.find({}, (err, classes) => {
            Class.findById(classID, (err, cls) => {
                res.render('./dashboard/class-view', {
                    user: req.user,
                    cls,
                    classes,
                });
            });
        });
    }
    else res.send('class not found');
});

router.post('/add-deck', ensureAuthenticated, (req, res, next) => {
    var {classID, title} = req.body;
    Class.findById(classID, (err, cls) => {
        var decks = cls.decks;
        var locked = false;
        if(cls.decks.length > 3) locked = true;
        decks.push({
            title: title,
            creationDate: Date.now(),
            percent: 0,
            locked: locked,
            cards: [],
        })
        Class.updateMany({_id: classID}, {$set: {decks}}, (err) => {
            res.redirect(`/dashboard/class-view?classID=${classID}`);
        })
    });
});

router.get('/delete-class', ensureAuthenticated, (req, res, next) => {
    var {classID} = req.query;
    Class.deleteMany({_id: classID}, (err) => {
        res.redirect('/dashboard');
    })
});

router.get('/remove-deck', ensureAuthenticated, (req, res, next) => {
    var {classID, deckIndex} = req.query;
    Class.findById(classID, (err, cls) => {
        var decks = cls.decks;
        decks.splice(deckIndex, 1);
        Class.updateMany({_id: classID}, {$set: {decks}}, (err) => {
            res.redirect(`/dashboard/class-view?classID=${classID}`);
        });
    });
});

router.get('/deck-view', ensureAuthenticated, (req, res, next) => {
    var {classID, deckIndex} = req.query;
    Class.find({}, (err, classes) => {
        Class.findById(classID, (err, cls) => {
            var deck = cls.decks[deckIndex];
            res.render('./dashboard/deck-view', {
                user: req.user,
                cls,
                deck,
                classes,
            });
        });
    });
});

router.get('/edit-deck', ensureAuthenticated, (req, res, next) => {
    var {classID, deckIndex} = req.query;
    Class.find({}, (err, classes) => {
        Class.findById(classID, (err, cls) => {
            var deck = cls.decks[deckIndex];
            console.log(deck);
            res.render('./dashboard/edit-deck', {
                user: req.user,
                cls,
                deck,
                classes,
                deckIndex,
                classID,
            });
        });
    });
});

router.post('/save-deck', ensureAuthenticated, (req, res, next) => {
    console.log(req.body);
    var {classID, deckIndex, question, answer, type} = req.body;
    if(typeof(question) == 'string' && typeof(answer) == 'string'){
        question = [question];
        answer = [answer];
        type = [type];
    }
    for (let i = 0; i < question.length; i++) {
        if(question[i] == '' && answer[i] == ''){
            question.splice(i, 1);
            answer.splice(i, 1);
            type.splice(i, 1);
            i--;
        }
    }
    Class.findById(classID, (err, cls) => {
        var decks = cls.decks;
        decks[deckIndex].question = question;
        decks[deckIndex].answer = answer;
        decks[deckIndex].type = type;
        Class.updateMany({_id: classID}, {$set: {decks}}, (err) => {
            req.flash('success_msg', 'تغییرات با موفقیت ثبت شد');
            res.redirect(`/dashboard/edit-deck?classID=${classID}&deckIndex=${deckIndex}`)
        })
    })
});


module.exports = router;



