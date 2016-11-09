var mongoose = require('mongoose');
var ArticleSchema = new mongoose.Schema({
    title: String,
    image: String,
    text: String,
    dateTime: Date
});

mongoose.model('Article', ArticleSchema);