const express = require('express');
const moment = require('moment');
const _ = require('lodash');
const router = express.Router();
const User = require('../models/user');
const Score = require('../models/score');
const mid = require('../middleware');

let today = moment().format("MMMM Do YY");

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
                console.log(user);
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
            password: req.body.password,
            gamesPlayed: 0
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
    res.render('game', {title: 'GameZone'});
});

router.get('/score', (req, res, next) => {
    Score.find({}, (error, doc) => {

        //-----LOGIC FOR AVAREGE WPM ALL USERS
        let totalScore = 0;
        for(let i = 0; i < doc.length; i++) {
            totalScore += doc[i].score;
        };
        let wpm = Math.round(totalScore / doc.length);
        //------------------------------------


        let score = {};
        score.topToday = _.filter(doc, function (d) {
            return d.date == today;
        });

        score.topToday = _.orderBy(doc, 'score', 'desc').slice(0, 10);
        score.topAll = _.orderBy(doc, 'score', 'desc').slice(0, 10);
        score.wpm = wpm;

        if(req.session.userId) {
            let userScore = _.filter(doc, function(d) {
                return d.userId == req.session.userId;
            });
            let userTotalScore = 0;
            for(let i = 0; i < userScore.length; i++) {
                userTotalScore += userScore[i].score;
            };

            score.userTopFive = _.orderBy(userScore, 'score', 'desc').slice(0, 5);
            score.userWpm = Math.round(userTotalScore / userScore.length);
            score.userTitle = '';
            if(score.userWpm <= 50) {
                score.userTitle = 'the rookie';
            } else if(score.userWpm > 50 && score.userWpm <= 75) {
                score.userTitle = 'the average';
            } else if(score.userWpm > 75 && score.userWpm <= 95) {
                score.userTitle = 'the pro'
            } else if(score.userWpm > 95 && score.userWpm <= 110) {
                score.userTitle = 'the allstar';
            } else if(score.userWpm < 110) {
                score.userTitle = 'the god';
            }

            User.findById(req.session.userId, (error, user) => {
                if(error)
                    return next(error);
                else {
                    score.name = user.name;
                    user.gamesPlayed++;
                    user.save((error) => {
                        if(error)
                            return next(error);
                        else {
                            score.userGamesPlayed = user.gamesPlayed;
                            console.log(score);
                            res.send(score);
                        }
                    });
                }
            });
        } else {
            res.send(score);
        }
    });
});

router.post('/score', (req, res, next) => {

    let scoreData = {
        score: req.body.score,
        userId: req.session.userId,
        date: today
};

    User.findById(req.session.userId, (error, user) => {
        if(error)
            return next(error);
        else {
            scoreData.name = user.name;

            Score.create(scoreData, (error) => {
                if(error)
                    return next(error);
                else {
                    res.redirect('/score');
                }
            });
        }
    });
});

module.exports = router;