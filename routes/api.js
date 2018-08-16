const moment = require('moment');
const _ = require('lodash');
const User = require('../models/user');
const Score = require('../models/score');
const today = moment().format("MMMM Do YY");

module.exports = router => {

    const getUserTitle = wpm => {
        switch(wpm) {
            case wpm <= 40:
                return 'the rookie';
            case wpm > 40 && wpm <= 65:
                return 'the average';
            case wpm > 65 && wpm <= 85:
                return 'the pro';
            case wpm > 85 && wpm <= 100:
                return 'the allstar';
            case wpm < 100:
                return 'the god';
        }
    }

    // GET /
    router.get('/', (req, res, next) => {
        if(req.session.userId)
            return res.redirect('game');

        return res.render('index', { title: 'Welcome' });
    });
    
    // GET /game
    router.get('/game', (req, res, next) => {
        let userId = req.session.userId;
        res.render('game', {title: 'GameZone', userId});
    });
    
    router.get('/score', (req, res, next) => {
        //TODO: asyn/await
        Score.find({}, (error, doc) => {
            //TODO: handle error...
            if(error)
                return error;

            const calculateTotalScore = arr =>
                _.reduce(_.map(arr, 'score'), (sum, n) => sum + n, 0);
    
            let score = {};
            let totalScore = calculateTotalScore(doc);
            let wpm = Math.round(totalScore / doc.length);
    
            score.topToday = _.filter(doc, row => row.date === today);
            score.topToday = _.orderBy(score.topToday, 'score', 'desc').slice(0, 10);
            score.topAll = _.orderBy(doc, 'score', 'desc').slice(0, 10);
            score.wpm = wpm ? wpm : 0;

            if(!req.session.userId)
                return res.send(score);
    
            let userScore = _.filter(doc, d => d.userId == req.session.userId);
            let userTotalScore = calculateTotalScore(userScore);

            score.userRightWords = userTotalScore;
            score.userTopFive = _.orderBy(userScore, 'score', 'desc').slice(0, 5);
            score.userWpm = Math.round(userTotalScore / userScore.length) ? 
                            Math.round(userTotalScore / userScore.length) : 0;
            score.userTitle = getUserTitle(score.userWpm);

            User.findById(req.session.userId, (error, user) => {
                if(error)
                    return next(error);
                else {
                    score.name = user.name;
                    user.save((error) => {
                        if(error)
                            return next(error);
                        else {
                            let calculateAccuracy = (rightWords, wrongWords) => {
                                return Math.round((rightWords / (rightWords + wrongWords)) * 100);
                            };

                            score.userGamesPlayed = user.gamesPlayed;
                            score.userWrongWords = user.wrongWords;
                            score.perfectGames = user.perfectGames;
                            score.userAccuracy = calculateAccuracy(score.userRightWords, score.userWrongWords);
                            User.find({}, (error, doc) => {
                                let totalRightWords = totalScore;
                                let totalWrongWords = _.reduce(_.map(doc, 'wrongWords'), (sum, n) => {
                                    return sum + n;
                                }, 0);
                                score.totalAccuracy = calculateAccuracy(totalRightWords, totalWrongWords);

                                res.send(score);
                            });
                        }
                    });
                }
            });
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
                user.wrongWords += req.body.wrong;
                user.gamesPlayed++;
                if(req.body.wrong === 0 && req.body.score)
                    user.perfectGames++;
    
                user.save((error) => {
                    if(error)
                        return next(error);
                    else {
                        Score.create(scoreData, (error) => {
                            if(error)
                                return next(error);
                            else {
                                //redirect to the get function to keep all the logic at the same place
                                //the get function is the one sending the data to our frontend
                                res.redirect('/score');
                            }
                        });
                    }
                });
            }
        });
    });
}
