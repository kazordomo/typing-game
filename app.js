const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const express = require('express');
const app = express();

// mongo connection
// this will also create the db when running it the first time
mongoose.connect("mongodb://localhost:27017/typing-game");
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

// ----------------- OVERKILL? ------------------

// use sessions for tracking user logins
app.use(session({
    secret: 'typethesecret',
    resave: true,
    saveUninitialized: false,
    //stoure our sessions in our db
    store: new MongoStore({
        mongooseConnection: db
    })
}));

app.use((req, res, next) => {
   //store the userId. the view can access the currentUser
    res.locals.currentUser = req.session.userId;
    next();
});

// ----------------------------------------------

//parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public folder
app.use(express.static(__dirname + '/public'));

// view enging setup
app.set('view engine', 'pug');
//login/register and main view
app.set('views', __dirname + '/views');

// include routes
const routes = require('./routes/index');
app.use('/', routes);

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

// listen on port 3000
app.listen(3000, function () {
    console.log('Express app listening on port 3000');
});
