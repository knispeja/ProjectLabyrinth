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
        mongoose.model('Maze').find(
            {}, "title image text dateTime ratings",
            {sort:{dateTime: -1}}, // sort by datetime desc, can't sort by rating easily (it's an array)
            function (err, mazes) {
                if (err) {
                    return console.log(err);
                } else {
                    res.json(mazes);
                }
            }
        );
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
                res.json(maze);
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
            res.json({ message: err.status + ' ' + err });
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
                    res.json({ message: err.status + ' ' + err });
                } else {
                    res.json(maze);
                }
            }
            );
    })
    .put(function (req, res) {
        // console.log(JSON.stringify(req.body));
        mongoose.model('Maze').findById(req.id, function (err, maze) {
            maze.ratings.push({rating: req.body.rating, userID: req.body.userID});
            maze.save(function (err, maze) {
                if (err) {
                    res.send('Problem adding maze to db.'); // CONSIDER: Might want to call next with error.  can add status code and error message.
                } else {
                    res.json(maze);
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
                    res.json({ message: err.status + ' ' + err });
                } else {
                    res.status(204);
                    res.json(null);
                }
            }
            );
    });

module.exports = router;