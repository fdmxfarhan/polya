var express = require('express');
var path = require('path');
var router = express.Router();
var bodyparser = require('body-parser');
const multer = require('multer');
const mail = require('../config/mail');
const { ensureAuthenticated } = require('../config/auth');
const User = require('../models/User');
const Class = require('../models/Class');
const mkdirp = require('mkdirp');

router.use(bodyparser.urlencoded({ extended: true }));

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const dir = 'public/files/' + Date.now().toString();
        mkdirp(dir, err => cb(err, dir));
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});

var upload = multer({ storage: storage });
var uploadFields = []
for(var i=0; i<200; i++){
    uploadFields.push({name: `fileQuestion${i}`, maxCount: 1})
    uploadFields.push({name: `fileAnswer${i}`, maxCount: 1})
}

router.post('/save-deck', ensureAuthenticated, upload.fields(uploadFields), (req, res, next) => {
    console.log(req.body)
    var {numberOfCards, classID, deckIndex} = req.body;
    deckIndex = parseInt(deckIndex);
    Class.findById(classID, (err, cls) => {
        cards = [];
        var decks = cls.decks;
        for(var i=0; i<numberOfCards+1; i++)
        {
            if(req.body[`type${i}`] == 'text'){
                var qname = req.body[`question${i}`]
                var aname = req.body[`answer${i}`]
                if(qname && aname){
                    cards.push({
                        type: 'text',
                        question: qname,
                        answer: aname,
                    });
                }
            }
            else if(req.body[`type${i}`] == 'picture'){
                var qname = req.files[`fileQuestion${i}`];
                var aname = req.files[`fileAnswer${i}`];
                if(qname && aname){
                    cards.push({
                        type: 'picture',
                        question: qname[0].destination.slice(6) + '/' + qname[0].originalname,
                        answer: aname[0].destination.slice(6) + '/' + aname[0].originalname,
                    });
                }
                else if(qname){
                    var aname = req.body[`answer${i}`];
                    if(qname != '' && aname != ''){
                        cards.push({
                            type: 'picture',
                            question: qname[0].destination.slice(6) + '/' + qname[0].originalname,
                            answer: aname,
                        });
                    }
                }
                else if(aname){
                    var qname = req.body[`question${i}`];
                    if(qname != '' && aname != ''){
                        cards.push({
                            type: 'picture',
                            question: qname,
                            answer: aname[0].destination.slice(6) + '/' + aname[0].originalname,
                        });
                    }
                }
                else{
                    var qname = req.body[`question${i}`];
                    var aname = req.body[`answer${i}`];
                    if(qname && aname){
                        if(qname != '' && aname != ''){
                            cards.push({
                                type: 'picture',
                                question: qname,
                                answer: aname,
                            });
                        }
                    }
                }
                // else cards.push(decks[deckIndex].cards[i])
            }
            // else cards.push(decks[deckIndex].cards[i])
        }
        console.log(cards);
        decks[deckIndex].cards = cards;
        Class.updateMany({_id: classID}, {$set: {decks}}, (err) => {
            req.flash('success_msg', 'تغییرات با موفقیت ثبت شد');
            res.redirect(`/dashboard/edit-deck?classID=${classID}&deckIndex=${deckIndex}`)
        })
    })
    // if(typeof(question) == 'string' && typeof(answer) == 'string'){
    //     question = [question];
    //     answer = [answer];
    //     type = [type];
    // }
    // for (let i = 0; i < question.length; i++) {
    //     if(question[i] == '' && answer[i] == ''){
    //         question.splice(i, 1);
    //         answer.splice(i, 1);
    //         type.splice(i, 1);
    //         i--;
    //     }
    // }
    // Class.findById(classID, (err, cls) => {
    //     var decks = cls.decks;
    //     decks[deckIndex].question = question;
    //     decks[deckIndex].answer = answer;
    //     decks[deckIndex].type = type;
    //     Class.updateMany({_id: classID}, {$set: {decks}}, (err) => {
    //         req.flash('success_msg', 'تغییرات با موفقیت ثبت شد');
    //         res.redirect(`/dashboard/edit-deck?classID=${classID}&deckIndex=${deckIndex}`)
    //     })
    // })
});


module.exports = router;