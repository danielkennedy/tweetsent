var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
var _ = require('underscore');
var Analyzer = require('../lib/Analyzer');

describe('Analyzer', function(){
  describe('#startup', function () {
    it('should throw an error if alchemy_access_key is empty', function () {
      var config = {
        "alchemy_access_key" : ""
      };
      expect(function () {
        var analyzer = new Analyzer(config);
      }).to.throw(/config must provide alchemy_access_key/);
    });
  });
  describe('#analyzeTweets', function () {
    before(function () {
      this.config = {
        "alchemy_access_key" : "2e561529c1f3b8f446fc2d0903504cee42b8026e"
      };
      this.tweets = [
        {id:0, created_at: '123', text: 'good',   retweet_count: 0, user: {screen_name: 'aaa', followers_count: 900}},// rank == 900
        {id:1, created_at: '123', text: 'abc',    retweet_count: 0, user: {screen_name: 'bbb', followers_count: 800}},// rank == 800
        {id:2, created_at: '123', text: 'abc',    retweet_count: 0, user: {screen_name: 'ccc', followers_count: 700}},// rank == 700
        {id:3, created_at: '123', text: 'bad',    retweet_count: 9, user: {screen_name: 'ddd', followers_count: 600}},// rank == 1500
        {id:4, created_at: '123', text: 'abc',    retweet_count: 0, user: {screen_name: 'eee', followers_count: 500}},// rank == 500
        {id:5, created_at: '123', text: 'abc',    retweet_count: 0, user: {screen_name: 'fff', followers_count: 400}},// rank == 400
        {id:6, created_at: '123', text: 'ok',     retweet_count: 9, user: {screen_name: 'ggg', followers_count: 300}},// rank == 1200
        {id:7, created_at: '123', text: 'abc',    retweet_count: 0, user: {screen_name: 'hhh', followers_count: 200}},// rank == 200
        {id:8, created_at: '123', text: 'decent', retweet_count: 9, user: {screen_name: 'iii', followers_count: 100}} // rank == 1000
      ];
      this.analyzer = new Analyzer(this.config);
    });
    it('should be a function', function () {
      this.analyzer.analyzeTweets.should.be.a('function');
    });
    // FIXME: NEED A MOCK RESPONSE!
    it('should add sentiment object to tweet', function (done) {
      this.analyzer.analyzeTweets(this.tweets, function (err, tweets) {
        _.each(tweets, function (tweet) {
          tweet.should.have.property('sentiment');
          tweet.sentiment.should.have.property('type');
          tweet.sentiment.should.have.property('score');
        });
        done();
      })
    });
    it('should set score to zero when status is not OK');
  });
});

