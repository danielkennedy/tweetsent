// TODO: Call API instead of using mongoose!
// TODO: Expect flattened tweets (simple passthru to API)
var _ = require('underscore');

module.exports = function (settings) {
  var self = this;

  self.storeTweets = function (tweets, onDone) {
    // FIXME: Send JSON PUT to gorest on pivotal
    // Take the list of tweets and save them in the database:
    _.each(tweets, function (tweet) {
/*
      Tweet.create({
        Text:      tweet.text,
        Author:    tweet.user.screen_name,
        Timestamp: tweet.created_at,
        Followers: tweet.user.followers_count,
        Retweets:  tweet.retweet_count,
        Sentiment: tweet.sentiment.type,
        Score:     tweet.sentiment.score
      });
*/
    });
    onDone(null, tweets);
  };
};

