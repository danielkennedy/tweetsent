var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
var _ = require('underscore');
var Bot = require('../lib/Bot');

describe('Bot', function(){
  before(function () {
    this.config = {
      "twitter_consumer_key" : "VALID",
      "twitter_consumer_secret" : "VALID",
      "twitter_access_token" : "VALID",
      "twitter_access_token_secret" : "VALID",
      "twitter_search_string" : "mySearchString",
      "twitter_author_blacklist" : ['anthony'],
      "twitter_request_interval" : 1, // In minutes?
      "twitter_max_tweets" : 6
    };
  });
  describe('#startup', function () {
    it('should only retrieve tweets with ids higher than since_id');
    it('should throw error if twitter_consumer_key is empty', function () {
      var config = this.config;
      config.twitter_consumer_key = '';
      expect(function () {
        var bot = new Bot(config);
      }).to.throw(/config must provide consumer_key/);
    });
    it('should throw error if twitter_consumer_secret is empty', function () {
      var config = this.config;
      config.twitter_consumer_key = 'VALID';
      config.twitter_consumer_secret = '';
      expect(function () {
        var bot = new Bot(config);
      }).to.throw(/config must provide consumer_secret/);
    });
    it('should throw error if twitter_access_token is empty', function () {
      var config = this.config;
      config.twitter_consumer_secret = 'VALID';
      config.twitter_access_token = '';
      expect(function () {
        var bot = new Bot(config);
      }).to.throw(/config must provide access_token/);
    });
    it('should throw error if twitter_access_token_secret is empty', function () {
      var config = this.config;
      config.twitter_access_token = 'VALID';
      config.twitter_access_token_secret = '';
      expect(function () {
        var bot = new Bot(config);
      }).to.throw(/config must provide access_token_secret/);
    });
    it('should throw error if twitter_search_string is empty');
    //config must provide consumer_secret
    it('should use default twitter_author_blacklist does not exist');
    it('should use default twitter_request_interval if empty');
    it('should use default twitter_max_tweets if empty');
  });
  describe('#reduceTweets', function () {
    before(function () {
      this.config.twitter_consumer_key = "VALID";
      this.config.twitter_consumer_secret = "VALID";
      this.config.twitter_access_token = "VALID";
      this.config.twitter_access_token_secret = "VALID";
      this.config.twitter_max_tweets = 4;
      this.tweets = [
        {id:0, created_at: '123', text: 'abc', retweet_count: 0, user: {screen_name: 'aaa', followers_count: 900}},// rank == 900
        {id:1, created_at: '123', text: 'abc', retweet_count: 0, user: {screen_name: 'bbb', followers_count: 800}},// rank == 800
        {id:2, created_at: '123', text: 'abc', retweet_count: 0, user: {screen_name: 'ccc', followers_count: 700}},// rank == 700
        {id:3, created_at: '123', text: 'abc', retweet_count: 9, user: {screen_name: 'ddd', followers_count: 600}},// rank == 1500
        {id:4, created_at: '123', text: 'abc', retweet_count: 0, user: {screen_name: 'eee', followers_count: 500}},// rank == 500
        {id:5, created_at: '123', text: 'abc', retweet_count: 0, user: {screen_name: 'fff', followers_count: 400}},// rank == 400
        {id:6, created_at: '123', text: 'abc', retweet_count: 9, user: {screen_name: 'ggg', followers_count: 300}},// rank == 1200
        {id:7, created_at: '123', text: 'abc', retweet_count: 0, user: {screen_name: 'hhh', followers_count: 200}},// rank == 200
        {id:8, created_at: '123', text: 'abc', retweet_count: 9, user: {screen_name: 'iii', followers_count: 100}} // rank == 1000
      ];
      this.bot = new Bot(this.config);
    });
    it('should be a function', function () {
      this.bot.reduceTweets.should.be.a('function');
    });
    it('should limit tweets to <= twitter_max_tweets', function (done) {
      var limit = this.config.twitter_max_tweets;
      this.bot.reduceTweets(this.tweets, function (err, tweets) {
        expect(tweets.length).to.equal(limit);
        done();
      });
    });
    it('should only process highest ranking tweets', function (done) {
      //var rank = tweet.user.followers_count + (tweet.retweet_count * 100);
      var limit = this.config.twitter_max_tweets;
      this.bot.reduceTweets(this.tweets, function (err, tweets) {
        expect(tweets.length).to.equal(limit);
        expect(tweets[0].user.screen_name).to.equal('aaa');
        expect(tweets[1].user.screen_name).to.equal('iii');
        expect(tweets[2].user.screen_name).to.equal('ggg');
        expect(tweets[3].user.screen_name).to.equal('ddd');
        done();
      });
    });
  });
  describe('#filterTweets', function () {
    before(function () {
      this.config.twitter_consumer_key = "VALID";
      this.config.twitter_consumer_secret = "VALID";
      this.config.twitter_access_token = "VALID";
      this.config.twitter_access_token_secret = "VALID";
      this.tweets = [
        {not_id:0, created_at: '123', text: 'abc', retweet_count: 7, user: {screen_name: 'bob', followers_count: 100}},
        {id:0, not_created_at: '123', text: 'abc', retweet_count: 6, user: {screen_name: 'joe', followers_count: 300}},
        {id:0, created_at: '123', not_text: 'abc', retweet_count: 6, user: {screen_name: 'joe', followers_count: 300}},
        {id:0, created_at: '123', text: 'abc', not_retweet_count: 7, user: {screen_name: 'bob', followers_count: 100}},
        {id:0, created_at: '123', text: 'abc', retweet_count: 7, not_user: {screen_name: 'bob', followers_count: 100}},
        {id:0, created_at: '123', text: 'abc', retweet_count: 7, user: {not_screen_name: 'bob', followers_count: 100}},
        {id:0, created_at: '123', text: 'abc', retweet_count: 7, user: {screen_name: 'bob', not_followers_count: 100}},
        {id:0, created_at: '123', text: 'abc', retweet_count: 7, user: {screen_name: 'anthony', followers_count: 100}},
        {id:0, created_at: '123', text: 'abc', retweet_count: 7, user: {screen_name: 'bob', followers_count: 100}}
      ];
      this.bot = new Bot(this.config);
    });
    it('should be a function', function () {
      this.bot.filterTweets.should.be.a('function');
    });
    it('should error if tweets is not an array', function (done) {
      var notArray = "NOT AN ARRAY";
      this.bot.filterTweets(notArray, function (err, tweets) {
        expect(err).to.be.an.instanceOf(Error);
        done();
      });
    });
    it('should remove tweets without required keys', function (done) {
      this.bot.filterTweets(this.tweets, function (err, tweets) {
        _.each(tweets, function (tweet) {
          expect(tweet.id).to.exist;
          expect(tweet.created_at).to.exist;
          expect(tweet.text).to.exist;
          expect(tweet.retweet_count).to.exist;
          expect(tweet.user).to.exist;
          expect(tweet.user.screen_name).to.exist;
          expect(tweet.user.followers_count).to.exist;
        });
        done();
      });
    });
    it('should remove tweet if author is blacklisted', function (done) {
      this.bot.filterTweets(this.tweets, function (err, tweets) {
        _.each(tweets, function (tweet) {
          expect(tweet.user.screen_name).to.not.equal('anthony');
        });
        done();
      });
    });
  });
  describe('#getTweets', function () {
    before(function () {
      // FIXME: FIGURE OUT HOW TO MOCK THIS!
      this.config = {
        "twitter_consumer_key" : "VALID",
        "twitter_consumer_secret" : "VALID",
        "twitter_access_token" : "VALID",
        "twitter_access_token_secret" : "VALID",
        "twitter_search_string" : "beer",
        "twitter_author_blacklist" : ['evil'],
        "twitter_request_interval" : 1, // In minutes?
        "twitter_max_tweets" : 6,
        "alchemy_access_key" : "VALID"
      };
      this.bot = new Bot(this.config);
    });
    it('should be a function', function () {
      this.bot.getTweets.should.be.a('function');
    });
    it('should callback with an array', function (done) {
      this.bot.getTweets(function (err, tweets) {
        expect(tweets).to.be.an.instanceOf(Array);
        done();
      });
    });
  });
});

