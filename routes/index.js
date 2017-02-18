const express = require('express');
const moment = require('moment');
const router = express.Router();
const User = require('../models/user');
const Score = require('../models/score');
//the index.js file is called automatically from the folder.
const mid = require('../middleware');

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
                // return res.redirect('game');
                return res.render('game', { name: user.name });
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
                // return res.redirect('game');
                return res.render('game', { name: user.name });
            }
        });
    } else {
        let err = new Error('All fields required');
        err.status = 400;
        return next(err);
    }
});

// GET /
router.get('/', (req, res, next) => {
    return res.render('index', { title: 'Welcome' });
});

// GET /game
router.get('/game', (req, res, next) => {
    Score.find({}, (error, data) => {
        if(error)
            return next(error);
        else
            res.render('game', { title: 'Gamezone', scores: data });
    });
});

// POST /score
//post the score with help of the score-model.
router.post('/leaderboard', (req, res, next) => {
    let formatedDate = moment(Date.now()).format('YYYY-DD-MM');
    User.findById(req.session.userId)
        .exec(function(error, user) {
            if (error) {
                return next(error);
            } else {
                let scoreData = {
                    score: req.body.submitscore,
                    name: user.name,
                    date: formatedDate
                };

                Score.create(scoreData, (error) => {
                    if (error) {
                        return next(error);
                    } else {
                        Score.find({}, (error, data) => {
                            if(error)
                                return next(error);
                        });
                    }
                });
            }
        });
});

module.exports = router;