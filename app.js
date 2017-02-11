const mongoClient = require('mongodb').MongoClient;
const express = require('express');
const app = express();

// serve static files from /public
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

// error handler
// define as the last app.use callback
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// listen on port 3000
app.listen(3000, () => {
    console.log('Express app listening on port 3000');
});
