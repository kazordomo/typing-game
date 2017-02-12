const express = require('express');
const router = express.Router();
const User = require('../models/user');
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
                return res.redirect('/game');
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
    return res.render('register', { title: 'SIgn Up' });
});

/*  ES6, THROWS ERROR. FIX PL0X
 ------------------------------------------------------------*/

// POST /register
// the view action is set to register, which handles the register and then redirects
// to the game view when done.
// router.post('/register', (req, res, next) => {
//     //check for null values, using the name="" from the view
//     if(req.body.email && req.body.name && req.body.password && req.body.confirmPassword) {
//         //confirm password
//         if(req.body.password !== req.body.confirmPassword) {
//             let err = new Error('Passwords do not match');
//             err.status = 400;
//             return next(err);
//         }
//
//         //create object with form input
//         let userData = {
//             email: req.body.email,
//             name: req.body.name,
//             password: req.body.password
//         }
//
//         //use the schemas 'create' method to insert document into Mongo
//         User.create(userData, (err, user) => {
//             if(err) {
//                 return next(err);
//             } else {
//                 //when registered -> logged in
//                 res.session.userId = user._id;
//                 return res.redirect('/game');
//             }
//         });
//     } else {
//         let err = new Error('All fields required');
//         err.status = 400;
//         return next(err);
//     }
// });

/*  REGULAR
 ------------------------------------------------------------*/
router.post('/register', function(req, res, next) {
    // check that all information has value
    if (req.body.email &&
        req.body.name &&
        req.body.password &&
        req.body.confirmPassword) {

        // confirm that user typed same password twice
        if (req.body.password !== req.body.confirmPassword) {
            var err = new Error('Passwords do not match');
            err.status = 400;
            return next(err);
        }

        // create object with form input
        var userData = {
            email: req.body.email,
            name: req.body.name,
            password: req.body.password
        };

        // use schema's 'create' method to insert document intro Mongo
        User.create(userData, function(error, user) {
            if (error) {
                return next(error);
            } else {
                //when they register, they are automatically logged in.
                req.session.userId = user._id;
                return res.redirect('/game');
            }
        });
    } else {
        var err = new Error('All fields required');
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
   return res.render('game', { title: 'Gamezone' });
});

module.exports = router;