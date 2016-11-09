var mongoose = require('mongoose');

var MazeSchema = new mongoose.Schema({
    title: String,
    image: String,
    text: String,
    dateTime: Date
});

mongoose.model('Maze', MazeSchema);