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
        console.log("Search query: " + req.body.query);

        var queryReg = new RegExp(req.body.query, 'i');
        mongoose.model('Maze').find({"title": queryReg}, function (err, mazes) {
            mongoose.model('Article').find({"title": queryReg}, function(err, articles) {
            if(err) {console.log(err);}
                res.json({
                    mazes: mazes,
                    articles: articles
                });
            });
        });
    });

module.exports = router;