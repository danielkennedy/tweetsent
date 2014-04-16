// TODO: Call API instead of using mongoose!
// TODO: Expect flattened tweets (simple passthru to API)
var _ = require('underscore');
var mongoose = require('mongoose');

module.exports = function (settings) {
  var self = this;
  var mongo_url = settings.mongo_url || 'mongodb://localhost/tweets';
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
  self.storeTweets = function (tweets, onDone) {
    // Take the list of tweets and save them in the database:
    _.each(tweets, function (tweet) {
      Tweet.create({
        tweet_text:      tweet.text,
        tweet_name:      tweet.user.screen_name,
        tweet_time:      tweet.created_at,
        tweet_followers: tweet.user.followers_count,
        tweet_retweets:  tweet.retweet_count,
        sentiment_type:  tweet.sentiment.type,
        sentiment_score: tweet.sentiment.score
      });
    });
    onDone(null, tweets);
  };
};

