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
        console.log("Query: " + req.body.query);
        mongoose.model('Maze').find({"title": req.body.query}, function (err, mazes) {
            if(err) {console.log(err);}
            res.format({
                json: function () {
                    res.json({reply: mazes});
                }
            });
        });
    });

module.exports = router;