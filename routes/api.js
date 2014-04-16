var _ = require('underscore');
var moment = require('moment');
var mongoose = require('mongoose');
var config = require('../config');
console.log('CONFIG:', config);
var mongo_url = config.mongo_url || 'mongodb://localhost/tweets';
console.log('Attempting Mongoose connection to', mongo_url);
mongoose.connect(mongo_url);

// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + mongo_url);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

var tweetSchema = mongoose.Schema({
  tweet_text:      String,
  tweet_name:      String,
  tweet_time:      Date,
  tweet_followers: Number,
  tweet_retweets:  Number,
  sentiment_type:  String,
  sentiment_score: Number
});

var Tweet = mongoose.model('Tweet', tweetSchema);

exports.create = function(req, res){
  var valid = _.every(['text','name','time','followers','retweets','type','score'], function (key) {
    return _.has(req.body, key);
  });
  if (valid) {
    Tweet.create({
      text:      req.body.text,
      name:      req.body.name,
      time:      req.body.time,
      followers: req.body.followers,
      retweets:  req.body.retweets,
      type:      req.body.type,
      score:     req.body.score
    }, function (err, tweet) {
      var code = 200;
      if (err) {
        code = 500;
      }
      res.send(code);
    });
  } else {
    res.send(400);
  }
};
exports.list = function(req, res){
  // If search params are present, use 'em. If not, return last tweet in DB.
  // FIXME: Date searching is broken!!!
  var search = {};
  if (_.has(req.query, 'from')) {
    // Try to convert "from" to a mongo date
    search.time = {};
    search.time["$gte"] = moment(req.query.from, "YYYY-MM-DD HH:mm")._d;
    //search.time["$gte"] = new Date(2014, 4, 15);
  }
  if (_.has(req.query, 'to')) {
    // Try to convert "to" to a mongo date
    if (!_.has(search, 'time')) {
      search.time = {};
      search.time["$gte"] = new Date(0);
    }
    search.time["$lte"] = moment(req.query.to, "YYYY-MM-DD HH:mm")._d;
  }
  Tweet.find(search, function (err, result) {
    var code = 200;
    if (err) {
      code = 500;
      result = [];
    } else if (result === null) {
      code = 404;
      result = [];
    }
    res.send(code, result);
  });
};
exports.read = function(req, res){
  Tweet.findById(req.params.id, function (err, result) {
    var code = 200;
    if (err) {
      code = 500;
      result = {};
    } else if (result === null) {
      code = 404;
      result = {};
    }
    res.send(code, result);
  });
};
exports.update = function(req, res){
  var update = _.pick(req.body, ['text','name','time','followers','retweets','type','score']);
  Tweet.findByIdAndUpdate(req.params.id, update, function (err, result) {
    var code = 200;
    if (err) {
      code = 500;
      result = req.body;
    } else if (result === null) {
      code = 404;
      result = update;
    }
    res.send(code, result);
  });
  res.send("respond with a resource");
};
exports.del = function(req, res){
  Tweet.findByIdAndRemove(req.params.id, function (err, result) {
    var code = 200;
    if (err) {
      code = 500;
    } else if (result === null) {
      code = 404;
    }
    res.send(code);
  })
};

