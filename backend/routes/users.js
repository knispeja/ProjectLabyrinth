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
    // GET all users
    .get(function (req, res, next) {
        mongoose.model('User').find({}, function (err, users) {
            if (err) {
                return console.log(err); // CONSIDER: Might want to call next with error.  can add status code and error message.
            } else {
                res.json(users);
            }
        });
    })
    .post(function (req, res) { // CONSIDER: can add a next parameter for next middleware to run in the middleware chain

        // TODO: check if user email is already taken
        mongoose.model('User').create({
            email: req.body.email,
            password: req.body.password,
            isAdmin: false
        }, function (err, user) {
            if (err) {
                res.send('Problem adding user to db.'); // CONSIDER: Might want to call next with error.  can add status code and error message.
            } else {
                res.json(user);
            }
        });
    });

// route middleware to validata :id
router.param('id', function (req, res, next, id) {
    mongoose.model('User').findById(id, function (err, user) {
        if (err || user === null) {
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

// CHALLENGE:  Implement these API endpoints before next class
router.route('/:id')
    .get(function (req, res) {
        mongoose.model('User').findById(req.id)
            .exec(
            function (err, user) {
                if (err) {
                    res.status(404);
                    err = new Error('GET error, problem finding data');
                    err.status = 404;
                    res.json({ message: err.status + ' ' + err });
                } else {
                    res.json(user);
                }
            }
            );
    })
    .put(function (req, res) {
        mongoose.model('User').findById(req.id, function (err, user) {
            // TODO: add in the user schema
            user.email = req.body.email
                || user.email;
            user.password = req.body.password
                || user.password;
            user.isAdmin = req.body.isAdmin
                || user.isAdmin;
            user.save(function (err, user) {
                if (err) {
                    res.send('Problem adding user to db.'); // CONSIDER: Might want to call next with error.  can add status code and error message.
                } else {
                    res.json(user);
                }
            });
        });
    })
    .delete(function (req, res) {
        mongoose.model('User').findByIdAndRemove(req.id)
            .exec(
            function (err, user) {
                if (err) {
                    res.status(404);
                    err = new Error('Issue deleting user');
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