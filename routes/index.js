const express = require('express');
const moment = require('moment');
const _ = require('lodash');
const router = express.Router();
const User = require('../models/user');
const Score = require('../models/score');
const mid = require('../middleware');

let today = moment().startOf('day');

// GET /
router.get('/', (req, res, next) => {
    if(req.session.userId)
        return res.redirect('game');
    else
        return res.render('index', { title: 'Welcome' });
});

// GET /logout
router.get('/logout', (req, res, next) => {
    if (req.session) {
        //delete session object
        req.session.destroy((err) => {
            if(err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

// GET /login
//user the middleware exported from middleware/index.js
router.get('/login', mid.loggedOut, (req, res, next) => {
    return res.render('login', { title: 'Login' });
});

// POST /login
router.post('/login', (req, res, next) => {
    //check to see if the email and password-fields are entered
    if(req.body.email && req.body.password) {
        User.authenticate(req.body.email, req.body.password, (error, user) => {
            if(error || !user) {
                let err = new Error('Wrong email or password');
                err.status = 401;
                return next(err);
            } else {
                //give user a session. _id is the id mongo gave the user collection when created
                req.session.userId = user._id;
                return res.redirect('game');
            }
        });
    } else {
        let err = new Error('Email and password are required');
        //401 - unauthorized
        err.status = 401;
        return next(err);
    }
});

// GET /register
router.get('/register', mid.loggedOut, (req, res, next) => {
    return res.render('register', { title: 'Sign Up' });
});

// POST /register
router.post('/register', (req, res, next) => {
    // check that all information has value
    if (req.body.email &&
        req.body.name &&
        req.body.password &&
        req.body.confirmPassword) {

        // confirm that user typed same password twice
        if (req.body.password !== req.body.confirmPassword) {
            let err = new Error('Passwords do not match');
            err.status = 400;
            return next(err);
        }

        // create object with form input
        let userData = {
            email: req.body.email,
            name: req.body.name,
            password: req.body.password
        };

        // use schema's 'create' method to insert document into Mongo
        User.create(userData, (error, user) => {
            if (error) {
                return next(error);
            } else {
                //when they register, they are automatically logged in.
                req.session.userId = user._id;
                return res.redirect('game');
            }
        });
    } else {
        let err = new Error('All fields required');
        err.status = 400;
        return next(err);
    }
});

// GET /game
router.get('/game', (req, res, next) => {
    User.findById(req.session.userId).exec((error, user) => {
        if(error) {
            return next(error);
        } else {
            let userData = {
                name: user.name,
                email: user.email,
                session: req.session.userId
            }
            console.log(user);
            console.log(userData);
            res.render('game', {title: 'GameZone', user: userData});
        }
    });
    //user is for keeping track if logged in or not.
    // res.render('game', {title: 'GameZone', user: userData});
});

//TODO: add ajax to post without reloading the page
// POST /score
router.post('/leaderboard', (req, res, next) => {

    let submitScore = req.body.score;

    if(req.session.userId) {
        User.findById(req.session.userId)
            .exec(function(error, user) {
                if (error) {
                    return next(error);
                } else {
                    let scoreData = {
                        score: submitScore,
                        name: user.name,
                        date: today.toDate()
                    };

                    Score.create(scoreData, (error) => {
                        if (error) {
                            return next(error);
                        } else {
                            let score = {};
                            Score.find({}, (error, doc) => {
                                score.topToday = _.filter(doc, function (d) {
                                    return d.date == today.toDate();
                                });

                                score.topToday = _.orderBy(score.topToday, 'score', 'desc');
                                score.topAll = _.orderBy(doc, 'score', 'desc');

                                score.topToday = score.topToday.slice(0, 10);
                                score.topAll = score.topAll.slice(0, 10);

                                score.user = req.session.userId;

                                res.send(score);
                            });
                        }
                    });
                }
            });
    } else {
        res.redirect('game');
    }
});

router.get('/leaderboard', (req, res, next) => {

    //TODO: we don't need to have logic in here. remove it and just send the score collection.
    let score = {};
    Score.find({}, (error, doc) => {
        score.topToday = _.filter(doc, function (d) {
            return d.date == today.toDate();
        });

        score.topToday = _.orderBy(score.topToday, 'score', 'desc');
        score.topAll = _.orderBy(doc, 'score', 'desc');

        score.topToday = score.topToday.slice(0, 10);
        score.topAll = score.topAll.slice(0, 10);

        if (error)
            return next(error);
        else {
            res.send(score);
        }
    });
});

module.exports = router;