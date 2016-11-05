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
        mongoose.model('Maze').find({}, function (err, mazes) {
            if (err) {
                return console.log(err); // CONSIDER: Might want to call next with error.  can add status code and error message.
            } else {
                res.format({
                    json: function () {
                        res.json(mazes);
                    }
                });
            }
        });
    })
    .post(function (req, res) { // CONSIDER: can add a next parameter for next middleware to run in the middleware chain
        mongoose.model('Maze').create({
            // TODO: add maze schema here
            // firstName: req.body.firstName,
            // lastName: req.body.lastName,
            // email: req.body.email,
            // homePhone: req.body.homePhone,
            // cellPhone: req.body.cellPhone,
            // birthDay: req.body.birthDay,
            // website: req.body.website,
            // address: req.body.address
        }, function (err, maze) {
            if (err) {
                res.send('Problem adding maze to db.'); // CONSIDER: Might want to call next with error.  can add status code and error message.
            } else {
                res.format({
                    json: function () {
                        res.json(maze);
                    }
                });
            }
        });
    });

// route middleware to validata :id
router.param('id', function (req, res, next, id) {
    mongoose.model('Maze').findById(id, function (err, maze) {
        if (err || maze === null) {
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
        mongoose.model('Maze').findById(req.id)
            .exec(
            function (err, maze) {
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
                    console.log(maze);
                    // res.status(204);
                    //res.format({
                    // json: function () {
                    res.json(maze);
                    //}
                    // });
                }
            }
            );
    })
    .put(function (req, res) {
        mongoose.model('Maze').findById(req.id, function (err, maze) {
            // TODO: add in the maze schema
            // contact.firstName = req.body.firstName;
            // contact.lastName = req.body.lastName;
            // contact.email = req.body.email;
            // contact.homePhone = req.body.homePhone;
            // contact.cellPhone = req.body.cellPhone;
            // contact.birthDay = req.body.birthDay;
            // contact.website = req.body.website;
            // contact.address = req.body.address;
            maze.save(function (err, maze) {
                if (err) {
                    res.send('Problem adding maze to db.'); // CONSIDER: Might want to call next with error.  can add status code and error message.
                } else {
                    res.format({
                        json: function () {
                            res.json(maze);
                        }
                    });
                }
            });
        });
    })
    .delete(function (req, res) {
        mongoose.model('Maze').findByIdAndRemove(req.id)
            .exec(
            function (err, maze) {
                if (err) {
                    res.status(404);
                    err = new Error('Issue deleting maze');
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