const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const favicon = require('serve-favicon');
const config = require('./config');
const app = express();

//heroku
app.set('port', (process.env.PORT || 3000));

mongoose.connect(config.mongoURI);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

// use sessions for tracking user login
app.use(session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

app.use(function (req, res, next) {
    // store the userId. all the views can access the currentUser.
    res.locals.currentUser = req.session.userId;
    next();
});

//parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public folder
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

// view engine setup
app.set('view engine', 'pug');
//login/register and main view
app.set('views', __dirname + '/views');

// include routes
// app.use('/', routes);
require('./routes/api').apiRoutes(app);
require('./routes/auth')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(app.get('port'), () =>
    console.log('Node app is running on port', app.get('port')));
