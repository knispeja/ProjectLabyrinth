var mongoose = require('mongoose');
var ArticleSchema = new mongoose.Schema({
    title: String,
    image: Buffer,
    text: String,
    dateTime: Date

});
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
var UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    isAdmin: Boolean

});

mongoose.model('Article', ArticleSchema);
mongoose.model('Maze', MazeSchema);
mongoose.model('User', UserSchema);