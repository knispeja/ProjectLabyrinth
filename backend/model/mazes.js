var mongoose = require('mongoose');

var RatingSchema = new mongoose.Schema({
    rating: Number,
    userID: Number
});
var MazeSchema = new mongoose.Schema({
    title: String,
    image: Buffer,
    text: String,
    dateTime: Date,
    userID: Number,
    ratings: [RatingSchema]
});

mongoose.model('Maze', MazeSchema);