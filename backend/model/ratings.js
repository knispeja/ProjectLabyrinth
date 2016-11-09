var mongoose = require('mongoose');

var RatingSchema = new mongoose.Schema({
    rating: Number,
    userID: String,
    mazeID: String
});

mongoose.model('Rating', RatingSchema);