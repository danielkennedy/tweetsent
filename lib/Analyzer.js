var Alchemy = require('alchemy-api');
var async = require('async');
var _ = require('underscore');

module.exports = function (settings) {
  var self = this;
  if (!_.has(settings, 'alchemy_access_key') || settings.alchemy_access_key.length === 0) {
    throw new Error('config must provide alchemy_access_key');
  }
  var alchemy = new Alchemy(settings.alchemy_access_key);
  self.analyzeTweets = function (tweets, onDone) {
    async.each(tweets, function (tweet, complete) {
      alchemy.sentiment(tweet.text, {}, function(err, response) {
        if (err === null) {
          if (response.status !== 'OK') {
            response.docSentiment = {};
          }
          // FIXME: Account for "mixed" in Alchemy response
          tweet.type = response.docSentiment.type || 'neutral',
          tweet.score = response.docSentiment.score || 0
        }
        complete(err);
      });
    }, function (err) {
      onDone(err, tweets);
    });
  };
};

