const mongoose = require('mongoose');

let TopAllSchema = new mongoose.Schema({
    score: Number,
    date: { type: Date, default: Date.now }
});

//add the schema to mongo
let TopAll = mongoose.model('TopAll', TopAllSchema);
module.exports = TopAll;