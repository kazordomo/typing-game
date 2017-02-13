const mongoose = require('mongoose');

let TopTodaySchema = new mongoose.Schema({
    score: Number
});

//add the schema to mongo
let TopToday = mongoose.model('TopToday', TopTodaySchema);
module.exports = TopToday;