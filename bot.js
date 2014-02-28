#!/usr/bin/env node
var config = require('./config');
var async = require('async');
var Bot = require('./lib/Bot');
var Analyzer = require('./lib/Analyzer');
var Store = require('./lib/Store');

var bot = new Bot(config);
var analyzer = new Analyzer(config);
var store = new Store(config);

async.waterfall([
  bot.getTweets,
  analyzer.analyzeTweets,
  store.storeTweets
], function (err, stored) {
  console.log('Stored', stored.length, 'tweets');
});
