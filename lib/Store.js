var async = require('async');
var request = require('request');
var _ = require('underscore');

module.exports = function (settings) {
  var self = this;

  self.storeTweets = function (tweets, onDone) {
    // Take the list of tweets and send them to the tweetboard API
    async.each(tweets, function (tweet, done) {
      request({
        method: 'POST',
        url: settings.tweetboard_url,
        json: tweet
      }, function (err, res, body) {
        //console.log('TWEETBOARD:', err, res.statusCode, body);
        done(err);
      });
    }, function (err) {
      //console.log('STORE:', err, tweets);
      onDone(err, tweets);
    });
  };
};

