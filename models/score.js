const mongoose = require('mongoose');

let ScoreSchema = new mongoose.Schema({
    score: Number,
    userId: String,
    name: String,
    date: String
});

//add the schema to mongo
let Score = mongoose.model('Score', ScoreSchema);
module.exports = Score;