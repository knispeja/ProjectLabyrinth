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
    // GET all Ratings
    .get(function (req, res, next) {
        mongoose.model('Rating').find({}, function (err, ratings) {
            if (err) {
                return console.log(err); // CONSIDER: Might want to call next with error.  can add status code and error message.
            } else {
                res.format({
                    json: function () {
                        res.json(ratings);
                    }
                });
            }
        });
    })
    .post(function (req, res) { // CONSIDER: can add a next parameter for next middleware to run in the middleware chain
        mongoose.model('Rating').create({
            // TODO: add Rating schema here
            // firstName: req.body.firstName,
            // lastName: req.body.lastName,
            // email: req.body.email,
            // homePhone: req.body.homePhone,
            // cellPhone: req.body.cellPhone,
            // birthDay: req.body.birthDay,
            // website: req.body.website,
            // address: req.body.address
        }, function (err, rating) {
            if (err) {
                res.send('Problem adding rating to db.'); // CONSIDER: Might want to call next with error.  can add status code and error message.
            } else {
                res.format({
                    json: function () {
                        res.json(rating);
                    }
                });
            }
        });
    });

// route middleware to validata :id
router.param('id', function (req, res, next, id) {
    mongoose.model('Rating').findById(id, function (err, rating) {
        if (err || rating === null) {
            res.status(404);
            err = new Error('Not Found');
            err.status = 404;
            res.format({
                // html: function(){
                //     next(err);
                // },
                json: function () {
                    res.json({ message: err.status + ' ' + err });
                }
            });
        } else {
            // once validation is done, save new id in the req
            req.id = id;
            next();
        }
    });
});

// CHALLENGE:  Implement these API endpoints before next class
router.route('/:id')
    .get(function (req, res) {
        mongoose.model('Rating').findById(req.id)
            .exec(
            function (err, rating) {
                if (err) {
                    res.status(404);
                    err = new Error('GET error, problem finding data');
                    err.status = 404;
                    res.format({
                        json: function () {
                            res.json({ message: err.status + ' ' + err });
                        }
                    });
                } else {
                    console.log(rating);
                    // res.status(204);
                    //res.format({
                    // json: function () {
                    res.json(rating);
                    //}
                    // });
                }
            }
            );
    })
    .put(function (req, res) {
        mongoose.model('Rating').findById(req.id, function (err, rating) {
            // TODO: add in the rating schema
            // contact.firstName = req.body.firstName;
            // contact.lastName = req.body.lastName;
            // contact.email = req.body.email;
            // contact.homePhone = req.body.homePhone;
            // contact.cellPhone = req.body.cellPhone;
            // contact.birthDay = req.body.birthDay;
            // contact.website = req.body.website;
            // contact.address = req.body.address;
            rating.save(function (err, rating) {
                if (err) {
                    res.send('Problem adding rating to db.'); // CONSIDER: Might want to call next with error.  can add status code and error message.
                } else {
                    res.format({
                        json: function () {
                            res.json(rating);
                        }
                    });
                }
            });
        });
    })
    .delete(function (req, res) {
        mongoose.model('Rating').findByIdAndRemove(req.id)
            .exec(
            function (err, rating) {
                if (err) {
                    res.status(404);
                    err = new Error('Issue deleting rating');
                    err.status = 404;
                    res.format({
                        json: function () {
                            res.json({ message: err.status + ' ' + err });
                        }
                    });
                } else {
                    res.status(204);
                    res.format({
                        json: function () {
                            res.json(null);
                        }
                    });
                }
            }
            );
    });

module.exports = router;