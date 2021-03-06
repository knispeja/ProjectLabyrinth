var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //need mongodb connection
    bodyParser = require('body-parser'), // parse info from POST data
    cookieParser = require('cookie-parser');
    methodOverride = require('method-override'); // used to manipulate POST data


router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body == "object" && '_method' in req.body) {
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

// Ready to build API
router.route('/')
    .post(function (req, res) { // CONSIDER: can add a next parameter for next middleware to run in the middleware chain
        mongoose.model('User').findOne({ 'email': req.body.email }, 'password', function (err, user) {
            
            // Parse cookies
            console.log("Current user cookie: " + req.cookies.user);

            if (err) return console.log(err);
            if (user) {
                if (user.password === req.body.password) {
                    // correct username/password
                    res.cookie('user', req.body.email);
                    res.json({ "reply": true });
                    return;
                }
                else {
                    // incorrect password
                    res.json({ "reply": false});
                }
            }
            else {
                // invalid email
                res.json({ "reply": "NONE" });
                return;
            }
        });
    });

module.exports = router;