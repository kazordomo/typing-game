const moment = require('moment');
const _ = require('lodash');
const User = require('../models/user');
const Score = require('../models/score');
const today = moment().format("MMMM Do YY");

module.exports = router => {
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
        Score.find({}, (error, doc) => {
    
            let calculateTotalScore = (arr) => {
                return _.reduce(_.map(arr, 'score'), (sum, n) => {
                    return sum + n;
                }, 0);
            };
    
            let score = {};
            let totalScore = calculateTotalScore(doc);
            let wpm = Math.round(totalScore / doc.length);
    
            score.topToday = _.filter(doc, (d) => {
                return d.date == today;
            });
            score.topToday = _.orderBy(score.topToday, 'score', 'desc').slice(0, 10);
            score.topAll = _.orderBy(doc, 'score', 'desc').slice(0, 10);
            score.wpm = wpm ? wpm : 0;
    
            if(req.session.userId) {
                let userScore = _.filter(doc, function(d) {
                    return d.userId == req.session.userId;
                });
                let userTotalScore = calculateTotalScore(userScore);
    
                score.userRightWords = userTotalScore;
                score.userTopFive = _.orderBy(userScore, 'score', 'desc').slice(0, 5);
                score.userWpm = Math.round(userTotalScore / userScore.length) ? Math.round(userTotalScore / userScore.length) : 0;
                score.userTitle = 'the rookie';
    
                if(score.userWpm <= 40) {
                    score.userTitle = 'the rookie';
                } else if(score.userWpm > 40 && score.userWpm <= 65) {
                    score.userTitle = 'the average';
                } else if(score.userWpm > 65 && score.userWpm <= 85) {
                    score.userTitle = 'the pro'
                } else if(score.userWpm > 85 && score.userWpm <= 100) {
                    score.userTitle = 'the allstar';
                } else if(score.userWpm < 100) {
                    score.userTitle = 'the god';
                }
    
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
