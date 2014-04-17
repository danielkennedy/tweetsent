var Twitter = require('twit');
var Alchemy = require('alchemy-api');
var async = require('async');
var _ = require('underscore');

module.exports = function (settings) {
  var self = this;
  var config = settings || {
  };
  var since_id = 0;
  var datasource = {
    tweets: []
  };
  var twitter = new Twitter({
    consumer_key:  config.twitter_consumer_key,
    consumer_secret: config.twitter_consumer_secret,
    access_token:  config.twitter_access_token,
    access_token_secret: config.twitter_access_token_secret
  });
  self.reduceTweets = function (tweets, onDone) {
    if (_.isArray(tweets)) {
      // Sort by impact:
      tweets = _.sortBy(tweets, function (tweet) {
        var rank = tweet.followers + (tweet.retweets * 100);
        return rank;
      });
      // Truncate, if necessary:
      tweets = _.last(tweets, config.twitter_max_tweets);
      // Store tweets in DB:
      onDone(null, tweets);
    } else {
      onDone(new Error('tweets must be an array'));
    }
  };
  self.filterTweets = function (tweets, onDone) {
    if (_.isArray(tweets)) {
      // Filter invalid tweets
      tweets = _.filter(tweets, function (tweet) {
        return _.every(['text','name','time','followers','retweets'], function (key) {
          return _.has(tweet, key);
        });
      });
      // Filter out blacklisted authors:
      tweets = _.reject(tweets, function (tweet) {
        return _.contains(config.twitter_author_blacklist, tweet.name);
      });
      onDone(null, tweets);
    } else {
      onDone(new Error('tweets must be an array'));
    }
  };
  self.getTweets = function (onDone) {
    var tweets = [];
    twitter.get('search/tweets', {
      q: config.twitter_search_string,
      since_id: since_id
    }, function (err, reply) {
      // Update the id from which to start next time:
      if (err === null) {
        if (reply.statuses) {
          since_id = _.last(reply.statuses).id;
          _.each(reply.statuses, function (tweet) {
            tweets.push({
              text: tweet.text,
              name: tweet.user.screen_name,
              time: tweet.created_at,
              followers: tweet.user.followers_count,
              retweets:  tweet.retweet_count
            });
          });
          self.filterTweets(tweets, function (err, filtered) {
            if (err === null) {
              self.reduceTweets(filtered, function (err, reduced) {
                  onDone(err, reduced);
              });
            } else {
              onDone(err, tweets);
            }
          });
        }
      } else {
        console.error('Twitter error:', err);
        onDone(err, tweets);
      }
    });
  };
};

