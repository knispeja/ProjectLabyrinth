var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    isAdmin: Boolean
});

mongoose.model('User', UserSchema);