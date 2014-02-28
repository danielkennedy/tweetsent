var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
var _ = require('underscore');
var Store = require('../lib/Store');

describe('Store', function(){
  describe('#startup', function () {
    before(function () {
      this.config = {
        "host" : "localhost",
        "port" : 5432,
        "user" : "tweetsent",
        "pass" : "tweetsent",
        "name" : "tweetsent"
      };
    });
    it('should throw error if host is empty', function () {
      var config = this.config;
      config.host = '';
      expect(function () {
        var store = new Store(config);
      }).to.throw(/config must provide value for host/);
    });
    it('should throw error if port is empty', function () {
      var config = this.config;
      config.host = 'localhost';
      config.port = '';
      expect(function () {
        var store = new Store(config);
      }).to.throw(/config must provide value for port/);
    });
    it('should throw error if host is missing', function () {
      var config = this.config;
      delete config.host;
      expect(function () {
        var store = new Store(config);
      }).to.throw(/config must provide host/);
    });
    it('should throw error if port is missing', function () {
      var config = this.config;
      config.host = 'localhost';
      delete config.port;
      expect(function () {
        var store = new Store(config);
      }).to.throw(/config must provide port/);
    });
    it('should throw error if user is missing', function () {
      var config = this.config;
      config.port = 5432;
      delete config.user;
      expect(function () {
        var store = new Store(config);
      }).to.throw(/config must provide user/);
    });
    it('should throw error if pass is missing', function () {
      var config = this.config;
      config.user = 'tweetsent';
      delete config.pass;
      expect(function () {
        var store = new Store(config);
      }).to.throw(/config must provide pass/);
    });
    it('should throw error if name is missing', function () {
      var config = this.config;
      config.pass = 'tweetsent';
      delete config.name;
      expect(function () {
        var store = new Store(config);
      }).to.throw(/config must provide name/);
    });
  });
  describe('#storeTweets', function () {
    it('should callback with an error if connection fails');
    it('should callback with an error if any inserts fail');
  });
});

