var mongoose = require('mongoose');
var ArticleSchema = new mongoose.Schema({
    title: String,
    image: Buffer,
    text: String,
    dateTime: Date

});

mongoose.model('Article', ArticleSchema);