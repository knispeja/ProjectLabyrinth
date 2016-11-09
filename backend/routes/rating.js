var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //need mongodb connection
    bodyParser = require('body-parser'), // parse info from POST data
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
    // GET all Mazes
    .get(function (req, res, next) {
        mongoose.model('Rating').find(
            {}, "rating userID mazeID",
            {sort:{dateTime: -1}}, // sort by datetime desc, can't sort by rating easily (it's an array)
            function (err, ratings) {
                if (err) {
                    return console.log(err);
                } else {
                    res.json(ratings);
                }
            }
        );
    })
    .post(function (req, res) {
        mongoose.model('Rating').create({
            rating: req.body.rating,
            userID: req.body.userID,
            mazeID: req.body.mazeID
        }, function (err, rating) {
            if (err) {
                res.send('Problem adding maze to db.');
            } else {
                res.json(rating);
            }
        });
    });
