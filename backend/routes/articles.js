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
    // GET all Articles
    .get(function (req, res, next) {
        mongoose.model('Article').find({}, function (err, articles) {
            if (err) {
                return console.log(err); 
            } else {
                res.format({
                    json: function () {
                        res.json(articles);
                    }
                });
            }
        });
    })
    .post(function (req, res) { 
        mongoose.model('Article').create({
            title: req.body.title,
            image: req.body.image,
            text: req.body.text,
            dateTime: req.body.dateTime
        }, function (err, article) {
            if (err) {
                res.send('Problem adding article to db.'); 
            } else {
                res.format({
                    json: function () {
                        res.json(article);
                    }
                });
            }
        });
    });

// route middleware to validata :id
router.param('id', function (req, res, next, id) {
    mongoose.model('Article').findById(id, function (err, article) {
        if (err || article === null) {
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
router.route('/:id/')
    .get(function (req, res) {
        mongoose.model('Article').findById(req.id)
            .exec(
            function (err, article) {
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
                    res.json(article);
                }
            }
            );
    })
    .put(function (req, res) {
        mongoose.model('Article').findById(req.id, function (err, article) {
            // TODO: add in the article schema
            article.title = req.body.title
                || article.title;
            article.image = req.body.image
                || article.image;
            article.text = req.body.text
                || article.text;
            article.dateTime = req.body.dateTime
                || article.dateTime;
            article.save(function (err, article) {
                if (err) {
                    res.send('Problem adding article to db.'); // CONSIDER: Might want to call next with error.  can add status code and error message.
                } else {
                    res.format({
                        json: function () {
                            res.json(article);
                        }
                    });
                }
            });
        });
    })
    .delete(function (req, res) {
        mongoose.model('Article').findByIdAndRemove(req.id)
            .exec(
            function (err, article) {
                if (err) {
                    res.status(404);
                    err = new Error('Issue deleting article');
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