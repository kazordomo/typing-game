const mongoose = require('mongoose');

let ScoreSchema = new mongoose.Schema({
    score: Number,
    name: String,
    date: { type: Date, default: Date.now }
});

//add the schema to mongo
let Score = mongoose.model('Score', ScoreSchema);
module.exports = Score;