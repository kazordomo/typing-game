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
    router.get('/', (req, res) => {
        if(req.session.userId)
            return res.redirect('game');

        return res.render('index', { title: 'Welcome' });
    });
    
    // GET /game
    router.get('/game', (req, res) =>
        res.render('game', {title: 'GameZone', userId: req.session.userId}));
    
    // GET /score
    //TODO: refactor - minimize - moveout chunks
    router.get('/score', async (req, res) => {
        const scores = await Score.find({});

        const calculateTotalScore = arr =>
            _.reduce(_.map(arr, 'score'), (sum, n) => sum + n, 0);

        let score = {
            topToday: _.filter(scores, row => row.date === today),
            topToday: _.orderBy(score.topToday, 'score', 'desc').slice(0, 10),
            topAll: _.orderBy(scores, 'score', 'desc').slice(0, 10),
            wpm = scores.length ? calculateTotalScore(scores) : 0,
        }

        if(!req.session.userId)
            return res.send(score);

        let userScore = _.filter(scores, d => d.userId == req.session.userId);
        let userTotalScore = calculateTotalScore(userScore);

        score.userRightWords = userTotalScore;
        score.userTopFive = _.orderBy(userScore, 'score', 'desc').slice(0, 5);
        score.userWpm = Math.round(userTotalScore / userScore.length) ? 
                        Math.round(userTotalScore / userScore.length) : 0;
        score.userTitle = getUserTitle(score.userWpm);

        const user = await User.findById(req.session.userId); 
        score.name = user.name;

        await user.save();

        let calculateAccuracy = (rightWords, wrongWords) =>
            Math.round((rightWords / (rightWords + wrongWords)) * 100);

        score.userGamesPlayed = user.gamesPlayed;
        score.userWrongWords = user.wrongWords;
        score.perfectGames = user.perfectGames;
        score.userAccuracy = calculateAccuracy(score.userRightWords, score.userWrongWords);

        const users = await User.find({});
        let totalRightWords =  calculateTotalScore(scores);
        let totalWrongWords = _.reduce(_.map(users, 'wrongWords'), (sum, n) => sum + n, 0);
        score.totalAccuracy = calculateAccuracy(totalRightWords, totalWrongWords);

        res.send(score);
    });
    
    router.post('/score', async (req, res, next) => {
        let scoreData = {
            score: req.body.score,
            userId: req.session.userId,
            date: today
        };
    
        const user = User.findById(req.session.userId);
        scoreData.name = user.name;
        user.wrongWords += req.body.wrong;
        user.gamesPlayed++;
        if(req.body.wrong === 0 && req.body.score)
            user.perfectGames++;

        await user.save();
        await Score.create(scoreData);

        res.redirect('/score');
    });
}
