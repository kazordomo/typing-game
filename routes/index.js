const express = reuiqre('express');
const router = express.Router();
const User = require('../models/user');
//the index.js file is called automatically from the folder.
const mid = require('../middleware');

// GET /login
router.get('/login', mid.loggedOut, (req, res, next) => {
    return res.render('login', {title: 'Log in'});
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
                //CHANGE THE ROUTE
                return res.redirect('/profile');
            }
        });
    } else {
        let err = new Error('Email and password are required');
        //401 - unauthorized
        err.status = 401;
        return next(err);
    }
});

// POST /register
router.post('register', (req, res, next) => {
    //check for null values
    if(req.body.email, req.body.name, req.body.password, req.body.confirmPassword) {
        //confirm password
        if(req.body.password !== req.body.confirmPassword) {
            let err = new Error('Passwords do not match');
            err.status = 400;
            return next(err);
        }

        //create object with form input
        let userData = {
            email: req.body.email,
            name: req.body.name,
            password: req.body.password
        }

        //use the schemas 'create' method to insert document into Mongo
        User.create(userData, (err, user) => {
            if(err) {
                return next(err);
            } else {
                //when registered -> logged in
                res.session.userId = user._id;
                //CHANGE ROUTE
                return res.redirect('/profile');
            }
        });
    } else {
        let err = new Error('All fields required');
        err.status = 400;
        return next(err);
    }
});

//GET /
router.get('/', (req, res, next) => {
    return res.render('index', { title: 'Type' });
});

module.exports = router;