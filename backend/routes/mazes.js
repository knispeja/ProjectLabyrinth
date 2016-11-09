var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //need mongodb connection
    bodyParser = require('body-parser'), // parse info from POST data
    methodOverride = require('method-override'), // used to manipulate POST data
    fs = require('fs'); //used to translate image into buffer

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
    .post(function (req, res) {
        mongoose.model('Maze').create({
            title: req.body.title,
            image: req.body.image,
            text: req.body.text,
            dateTime: req.body.dateTime,
            userID: req.body.userID,
            ratings: req.body.ratings
        }, function (err, maze) {
            if (err) {
                res.send('Problem adding maze to db.');
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

router.route('/:id/')
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
            maze.title = req.body.title
                || maze.title;
            maze.image = req.body.image
                || maze.image;
            maze.text = req.body.text
                || maze.text;
            maze.dateTime = req.body.dateTime
                || maze.dateTime;
            maze.userID = req.body.userID
                || maze.userID;
            maze.ratings = req.body.ratings
                || maze.ratings;
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