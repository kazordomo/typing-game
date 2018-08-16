const _ = require('lodash');
const User = require('../models/user');
const mid = require('../middleware');

module.exports = router => {
    // GET /logout
    router.get('/logout', (req, res, next) => {
        if(!req.session)
            return;

        req.session.destroy((err) => {
            if(err)
                return next(err);
            else
                return res.redirect('/');
        });
    });
    
    // GET /login
    router.get('/login', mid.loggedOut, (req, res, next) =>
        res.render('login', { title: 'Login' }));
    
    // POST /login
    router.post('/login', async (req, res, next) => {
        //check to see if the email and password-fields are entered
        if(!req.body.email || !req.body.password) {
            let err = new Error('Email and password are required');
            err.status = 401;
            return next(err);
        }

        try {
            const user = await User.authenticate(req.body.email, req.body.password);
            req.session.userId = user._id;
            return res.redirect('game');
        } catch(error) {
            console.log(error);
            let err = new Error('Wrong email or password');
            err.status = 401;
            return next(err);
        }
    });
    
    // GET /register
    router.get('/register', mid.loggedOut, (req, res, next) =>
        res.render('register', { title: 'Sign Up' }));
    
    // POST /register
    router.post('/register', async (req, res, next) => {
        if(
            !req.body.email ||
            !req.body.name ||
            !req.body.password ||
            !req.body.confirmPassword
        ) {
            let err = new Error('All fields required');
            err.status = 400;
            return next(err);
        }
    
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

        try {
            const user = await User.create(userData);
            req.session.userId = user._id;
            res.redirect('/game');
        } catch(err) {
            return next(err);
        }
    });
}