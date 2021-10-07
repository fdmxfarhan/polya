var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request = require('request');
const { ensureAuthenticated } = require('../config/auth');
const User = require('../models/User');
const Class = require('../models/Class');
const Payment = require('../models/Payment');
const prices = require('../config/prices');

var expires =  {
    month: 1000 * 60 * 60 * 24 * 30,
    semester: 1000 * 60 * 60 * 24 * 30 * 6,
    year: 1000 * 60 * 60 * 24 * 365,
    forever: 60 * 60 * 24 * 365 * 100,
}


router.get('/', (req, res, next) => {
    Payment.findOne({}, (err, payment) => {
        res.render(`success-pay`, { payment });
    });
})

router.get('/pay', ensureAuthenticated, function(req, res, next) {
    var {planType} = req.query;
    var newPayment = new Payment({
        userID: req.user._id,
        fullname: req.user.fullname,
        amount: prices[planType],
        description: `${planType} payment`,
        date: new Date(),
        payed: false,
        discount: 0,
        planType: planType,
    });
    newPayment.save().then(payment => {
        if (newPayment.amount == 0) {
            res.send('error: you cant pay ziro amount');
            return;
        }
        var options = {
            method: 'POST',
            url: 'https://api.idpay.ir/v1.1/payment',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': 'dec2b2aa-2cb5-47f4-8584-963dc313f363',
                'X-SANDBOX': 1,
            },
            body: {
                'order_id': payment._id,
                'amount': payment.amount,
                'name': payment.fullname,
                'email': payment.email,
                'desc': payment.description,
                'callback': 'http://185.141.107.167/payment/pay',
                'reseller': null,
            },
            json: true,
        };
        request(options, function(error, response, body) {
            if (error) console.log(error);
            res.redirect(body.link);
        });
    }).catch(err => {
        if (err) console.log(err);
    });
});

router.post('/pay', function(req, res, next) {
    Payment.findOne({ _id: req.body.order_id }, (err, payment) => {
        if (payment) {
            var options2 = {
                method: 'POST',
                url: 'https://api.idpay.ir/v1.1/payment/verify',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': 'dec2b2aa-2cb5-47f4-8584-963dc313f363',
                    // 'X-API-KEY': 'fe6a4553-cd95-4dff-af2e-80594c1c18c5',
                    'X-SANDBOX': 1,
                },
                body: {
                    'id': req.body.id,
                    'order_id': req.body.order_id,
                },
                json: true,
            };
            request(options2, function(error, response, body) {
                if (error) console.log(error);
                if (body.status == 100) {
                    Payment.updateMany({ _id: payment._id }, { $set: { payed: true, track_id: body.payment.track_id } }, (err, doc) => {
                        if (err) console.log(err);
                        Payment.findById(payment._id, (err, payment) => {
                            console.log(payment.planType)
                            console.log(expires[payment.planType])
                            User.updateMany({ _id: payment.userID }, {$set: {
                                planType: payment.planType, 
                                expirationDate: expires[payment.planType] + Date.now(),
                            }}, (err) => {
                                if (err) console.log(err)
                                res.render(`success-pay`, {
                                    payment
                                });
                            });
                        });
                        
                    });
                } else {
                    res.send('Error!!!!!!!!!!!');
                }
            });
        } else res.send('Error!!!!!!!!!!!');
    });
});

module.exports = router;