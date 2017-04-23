const mongoose = require('mongoose');

let ScoreSchema = new mongoose.Schema({
    score: Number,
    userId: String,
    date: Date
});

//add the schema to mongo
let Score = mongoose.model('Score', ScoreSchema);
module.exports = Score;