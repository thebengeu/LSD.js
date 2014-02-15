/*global define*/

// LSD.js - Local Storage, Distributed.

(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else {
    // Browser globals
    root.LSD = factory();
  }
}(this, function () {
  'use strict';

  var shards;
  var shardStores = {};

  // shardingFunction returns shard id for given key
  var shardingFunction = function (key) {
    // Example sharding function that returns first letter of key as shard id.
    // Should never be used.
    return key[0];
  };

  var domainPrefix = window.location.protocol + '//';
  var domainSuffix = '.' + location.host;

  // Sensible default: using shardId subdomains of the domain serving LSD.js
  var shardIdToDomain = function (shardId) {
    return domainPrefix + shardId + domainSuffix;
  };

  return {
    // options: {
    //   shardingFunction: [Function] (Required)
    //   shardIdToDomain: [Function] (Optional)
    // }
    init: function (options, callback) {
      var options = options || {};
      shardingFunction = options.shardingFunction;
      shardIdToDomain = options.shardIdToDomain || shardIdToDomain;
      localforage.getItem('shards', function (value) {
        shards = value || {};
        if (callback) {
          callback();
        }
      });
    },
    getShards: function () {
      return shards;
    },
    getItem: function (key, callback) {
      var shardId = shardingFunction(key);
      var shard = shards[shardId];
      if (shard) {
        var shardStore = shardStores[shardId];
        if (!shardStore) {
          shardStore = shardStores[shardId] = new CrossDomainStorage(shardIdToDomain(shardId), '/LSD.html')
        }
        shardStore.getItem(key, callback);
      } else if (callback) {
        callback(null);
      }
    },
    setItem: function (key, value, callback) {
      var shardId = shardingFunction(key);
      var shard = shards[shardId];
      if (!shard) {
        shard = shards[shardId] = {
          length: 0
        };
      }
      var shardStore = shardStores[shardId];
      if (!shardStore) {
        shardStore = shardStores[shardId] = new CrossDomainStorage(shardIdToDomain(shardId), '/LSD.html')
      }
      shardStore.setItem(key, value, function () {
        shard.length += value.length;
        localforage.setItem('shards', shards);
        if (callback) {
          callback();
        }
      });
    },
    removeItem: function (key, callback) {
    },
    clear: function () {
    }
  };
}));
