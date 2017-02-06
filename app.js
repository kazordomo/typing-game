let express = require('express');
// let bodyParser = require('body-parser');
// let mongoose = require('mongoose');
// let session = require('express-session');
// let MongoStore = require('connect-mongo')(session);
let app = express();

// mongodb connection
// this will also create the database when running it the first time
// mongoose.connect("mongodb://localhost:27017/typingGame");
// let db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
//
// //schemas
// let TypingWordsSchema = new mongoose.Schema({
//     word: String
// });
//
// let Word = mongoose.model('Word', TypingWordsSchema);
//
// //insert default values
// let hej     = new Word({ word: 'hej' });
// let jag     = new Word({ word: 'jag' });
// let kanske  = new Word({ word: 'kanske' });
// let kunskap = new Word({ word: 'kunskap' });
// let utifrån = new Word({ word: 'utifrån' });
// let vet     = new Word({ word: 'vet' });
// let badhus  = new Word({ word: 'badhus' });
// let inte    = new Word({ word: 'inte' });
// let många   = new Word({ word: 'många' });
// let dator   = new Word({ word: 'dator' });
// let snygg   = new Word({ word: 'snygg' });
// let flera   = new Word({ word: 'flera' });
// let vill    = new Word({ word: 'vill' });
// let omgång  = new Word({ word: 'omgång' });
//
// let words = function(res){
//     return function(err, data){
//         if (err){
//             console.log('error occured');
//             return;
//         }
//         res.send('My ninjas are:\n');
//         console.log(data);
//     }
//
//     Word.find({},'word',words(res));
// }
//
// words();
//
// // parse incoming requests
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + '/public'));

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
