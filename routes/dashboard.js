var express = require('express');
var router = express.Router();

const { ensureAuthenticated } = require('../config/auth');
var User = require('../models/User');
var Class = require('../models/Class');
const mail = require('../config/mail');
const bcrypt = require('bcryptjs');


router.get('/', ensureAuthenticated, (req, res, next) => {
    Class.find({$or: [{public: true}, {userID: req.user._id}]}, (err, classes) => {
        if(req.user.role == 'user')
        {
            if(classes.length > 0)
                res.redirect(`/dashboard/class-view?classID=${classes[0]._id}`)
            else{
                res.render('./dashboard/user-dashboard', {
                    user: req.user,
                    login: req.query.login,
                    classes
                });
            }
        }
        else if(req.user.role = 'admin')
        {
            User.find({}, (err, users) => {
                var numberOfDecks = 0;
                var numberOfFlashcards = 0;
                if(classes.length > 1)
                    numberOfDecks = classes.map(e => e.decks.length).reduce((a, b) => a+b);
                try {
                    numberOfFlashcards = classes.map(e => e.decks.map(d => d.cards.length).reduce((a,b) => a+b)).reduce((a, b) => a+b);
                } catch (error) {
                    numberOfFlashcards = 0;
                }
                res.render('./dashboard/admin-dashboard', {
                    user: req.user,
                    login: req.query.login,
                    classes,
                    users,
                    numberOfFlashcards,
                    numberOfDecks,
                });
            });
        }
    });
});

router.get('/settings', ensureAuthenticated, (req, res, next) => {
    Class.find({$or: [{public: true}, {userID: req.user._id}]}, (err, classes) => {
        res.render('./dashboard/user-settings', {
          user: req.user,
          classes,
        })
    })
});

router.get('/users', ensureAuthenticated, (req, res, next) => {
    if(req.user.role == 'admin'){
        Class.find({$or: [{public: true}, {userID: req.user._id}]}, (err, classes) => {
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
    var public = true;
    if(req.user.role == 'user') public = false;
    if(title && iconElement){
        var newClass = new Class({
            userID: req.user._id, 
            creator: req.user.fullname, 
            title: title,
            icon: iconElement,
            deck: [],
            createDate: Date.now(),
            public,
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
        Class.find({$or: [{public: true}, {userID: req.user._id}]}, (err, classes) => {
            Class.findById(classID, (err, cls) => {
                for(var i=0; i<cls.decks.length; i++){
                    cls.decks[i].percent = Math.floor(((cls.decks[i].cards.map(e => e.score).filter(e => typeof(e) != 'undefined').length)/cls.decks[i].cards.length) *100);
                    if(typeof(cls.decks[i].percent) != 'number' || isNaN(cls.decks[i].percent)) cls.decks[i].percent = 0;
                }
                var studiedCards = 0;
                try {
                    studiedCards = cls.decks.map(e => e.cards.map(c => c.score).filter(c => typeof(c) != 'undefined').length).reduce((a, b) => a+b);
                } catch (error) {}
                var numberOfCards = 0;
                try {
                    numberOfCards = cls.decks.map(e => e.cards.length).reduce((a, b) => a+b);
                } catch (error) {}

                res.render('./dashboard/class-view', {
                    user: req.user,
                    cls,
                    classes,
                    studiedCards,
                    numberOfCards
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
        if(cls.decks.length > 1) locked = true;
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
    var {classID, deckIndex, questionNum} = req.query;
    if(!questionNum) questionNum = 0
    else questionNum = parseInt(questionNum)
    Class.find({$or: [{public: true}, {userID: req.user._id}]}, (err, classes) => {
        Class.findById(classID, (err, cls) => {
            var deck = cls.decks[deckIndex];
            if(deck.locked && req.user.role != 'admin') res.redirect(`/pricing`);
            else{
                    res.render('./dashboard/deck-view', {
                    user: req.user,
                    cls,
                    deck,
                    classes,
                    deckIndex,
                    questionNum,
                    cards: deck.cards
                });
            }
        });
    });
});

router.get('/edit-deck', ensureAuthenticated, (req, res, next) => {
    var {classID, deckIndex} = req.query;
    deckIndex = parseInt(deckIndex);
    Class.find({$or: [{public: true}, {userID: req.user._id}]}, (err, classes) => {
        Class.findById(classID, (err, cls) => {
            var deck = cls.decks[deckIndex];
            console.log(deck.cards);
            res.render('./dashboard/edit-deck', {
                user: req.user,
                cls,
                deck,
                classes,
                deckIndex,
                classID,
                cards: deck.cards
            });
        });
    });
});

router.post('/save-deck', ensureAuthenticated, (req, res, next) => {
    console.log(req.body);
    var {classID, deckIndex, question, answer, type} = req.body;
    deckIndex = parseInt(deckIndex);
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

router.get('/score-card', ensureAuthenticated, (req, res, next) => {
    var {classID, deckIndex, questionNum, score} = req.query;
    deckIndex = parseInt(deckIndex);
    Class.findById(classID, (err, cls) => {
        var decks = cls.decks;
        decks[deckIndex].cards[questionNum].score = parseInt(score)
        
        Class.updateMany({_id: classID}, {$set: {decks}}, (err) => {
            res.redirect(`/dashboard/deck-view?classID=${classID}&deckIndex=${deckIndex}&questionNum=${parseInt(questionNum)+1}`);
        })
    });
})

router.post('/settings', ensureAuthenticated, (req, res, next) => {
    const { firstName, lastName, email} = req.body;
    User.updateMany({_id: req.user._id}, {$set: {firstName, lastName, email, fullname: firstName + ' ' + lastName}}, (err) => {
        res.redirect('/dashboard/settings')
    })
})

router.post('/change-password', ensureAuthenticated, (req, res, next) => {
    const { password, confirm} = req.body;
    if(password == confirm){
        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(password, salt, (err, hash) => {
            if(err) throw err;
            User.updateMany({_id: req.user._id}, {$set: {password: hash}}, (err) => {
                res.redirect('/dashboard/settings')
            })
        }));
    }
})

router.get('/make-admin', ensureAuthenticated, (req, res, next) => {
    var {userID} = req.query;
    if(req.user.role == 'admin'){
        User.updateMany({_id: userID}, {$set: {role: 'admin'}}, (err) => {
            res.redirect('/dashboard/users');
        })
    }
})

router.get('/make-user', ensureAuthenticated, (req, res, next) => {
    var {userID} = req.query;
    if(req.user.role == 'admin'){
        User.updateMany({_id: userID}, {$set: {role: 'user'}}, (err) => {
            res.redirect('/dashboard/users');
        })
    }
})

router.get('/delete-user', ensureAuthenticated, (req, res, next) => {
    if(req.user.role == 'admin'){
        User.deleteOne({_id: req.query.userID}, (err) => {
            req.flash('success_msg', 'کاربر با موفقیت حذف شد');
            res.redirect('/dashboard/users');
        });
    }
});

router.post('/add-user', ensureAuthenticated, (req, res, next) => {
    const { firstName, lastName, email, password, confirm} = req.body;
    const role = 'user', card = 0;
    const ipAddress = req.connection.remoteAddress;
    let errors = [];
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
        res.redirect('/dashboard/users')
    }
    else{
        const fullname = firstName + ' ' + lastName;
        // validation passed
        User.findOne({ email: email})
            .then(user =>{
            if(user){
                // user exist
                errors.push({msg: 'پست الکترونیکی قبلا ثبت شده است.'});
                res.redirect('/dashboard/users')
            }
            else {
                const newUser = new User({firstName, lastName, email, password, role, card, fullname});
                // Hash password
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                    .then(user => {
                        res.redirect('/dashboard/users')
                    }).catch(err => console.log(err));
                }));
                console.log(newUser);
            }
        });
    }  
});

module.exports = router;



