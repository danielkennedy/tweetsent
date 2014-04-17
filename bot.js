#!/usr/bin/env node
var config = require('./config');
var async = require('async');
var moment = require('moment');
var Bot = require('./lib/Bot');
var Analyzer = require('./lib/Analyzer');
var Store = require('./lib/Store');

var bot = new Bot(config);
var analyzer = new Analyzer(config);
var store = new Store(config);

var now, start, delay;

now = start = moment();

var loop = function (onComplete) {
  start = moment();
  async.waterfall([
    bot.getTweets,
    analyzer.analyzeTweets,
    store.storeTweets
  ], function (err, tweets) {
    if (err === null) {
      console.log('Stored', tweets.length, 'tweets', tweets);
    }
    // Start again in (request_interval - elapsed) seconds
    now = moment();
    delay = ((config.twitter_request_interval * 60) - now.diff(start, 'seconds'));
    console.log('Waterfall took', now.diff(start, 'seconds'), 'seconds?');
    console.log('Start again in', delay, 'seconds?');
    setTimeout(loop, (delay * 1000));
  });
};

loop();

/*
loop(function (err, tweets) {
  if (err === null) {
    console.log('Stored', tweets.length, 'tweets', tweets);
  }
  // Start again in (request_interval - elapsed) seconds
  now = moment();
  delay = ((config.twitter_request_interval * 60) - now.diff(start, 'seconds'));
  console.log('Waterfall took', now.diff(start, 'seconds'), 'seconds?');
  console.log('Start again in', delay, 'seconds?');
  start = moment();
  setTimeout(loop, delay);
});
*/
