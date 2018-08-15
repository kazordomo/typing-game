const _ = require('lodash');
const User = require('../models/user');
const mid = require('../middleware');

module.exports = router => {
    // GET /logout
    router.get('/logout', (req, res, next) => {
        if (req.session) {
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
    
        if (req.body.email &&
            req.body.name &&
            req.body.password &&
            req.body.confirmPassword) {
    
            if (req.body.password !== req.body.confirmPassword) {
                let err = new Error('Passwords do not match');
                err.status = 400;
                return next(err);
            }
    
            let userData = {
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
                gamesPlayed: 0,
                wrongWords: 0,
                perfectGames: 0
            };
    
            User.create(userData, (error, user) => {
                if (error) {
                    return next(error);
                } else {
                    req.session.userId = user._id;
                    res.redirect('/game');
                }
            });
        } else {
            let err = new Error('All fields required');
            err.status = 400;
            return next(err);
        }
    });
}