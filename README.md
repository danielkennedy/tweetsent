tweetsent
=========
Tweetsent is a simple, configurable Twitter bot designed to provide sentiment
analysis for tweets. It uses a simple mashup of three modules:

- [Twit](https://github.com/ttezel/twit) to query Twitter's REST service
- [Alchemy](https://github.com/framingeinstein/node-alchemy) to perform sentiment analysis
- [Mongoose](https://github.com/LearnBoost/mongoose) to store the results in a Mongo Database

_An important note about the Alchemy API: Free access is limited to 1,000 requests/day._

## Features
- Highest impact: In order to provide the maximum benefit of its usage, tweetsent 
does some simple calculations (based on the number of followers and retweets) to include only
tweets with the highest impact for analysis. If, for example, the bot retrieves 100 tweets 
during one interval, it will only select the `twitter_max_tweets` number for analysis.
- No repetition: Each interval, the bot tracks where it left off, and will only request new
tweets for analysis.

## Dependencies
You'll need:
- [Twitter API](https://apps.twitter.com/) credentials
- [Alchemy API](http://www.alchemyapi.com/api/register.html) key

## Installation
  $ git clone git@github.com:danielkennedy/tweetsent.git
  $ cd tweetsent
  $ npm install

## Configuration
Remember that free usage of the Alchemy API is limited to 1,000 requests/day. That means
you'll need to strike a balance between up-to-date data (frequent intervals) and tweet
volume (max tweets). I like to set `twitter_max_tweets` to `2` and `twitter_request_interval` to `3`.

  $ cp config.js.sample config.js
  $ vim config.js

## Operation
  $ node bot

