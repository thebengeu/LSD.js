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
  var shardStores;
  var shardLengths = {};

  var cacheLimit = 4;

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

  var getShardStore = function (shardId) {
    var shardStore = shardStores.get(shardId, false);
    if (!shardStore) {
      shardStore = new crossforage(shardIdToDomain(shardId), '/crossforage.html');
      shardStores.put(shardId, shardStore);
    }
    return shardStore;
  };

  var clear = function (shardId) {
    getShardStore(shardId).clear(function () {
      shardStores.remove(shardId).unload();
      delete shardLengths[shardId];
      delete shards[shardId];
      localforage.removeItem(shardId);
      localforage.setItem('__LSD_SHARDS__', shards);
    });
  };

  return {
    // options: {
    //   shardingFunction: [Function] (Required)
    //   shardIdToDomain: [Function] (Optional)
    // }
    init: function (options, callback) {
      var options = options || {};

      // initialize shard store cache
      cacheLimit = options.cacheLimit || cacheLimit;
      shardStores = new LRUCache(cacheLimit);
      shardStores.shift = function() {
        var entry = LRUCache.prototype.shift.call(this);
        entry.value.unload();
        return entry;
      };

      shardingFunction = options.shardingFunction;
      shardIdToDomain = options.shardIdToDomain || shardIdToDomain;
      localforage.getItem('__LSD_SHARDS__', function (value) {
        shards = value || {};
        var counter = Object.keys(shards).length;
        for (var shardId in shards) {
          localforage.getItem(shardId, function (length) {
            shardLengths[shardId] = length || 0;
            if (!--counter && callback) {
              callback();
            }
          });
        }
      });
    },
    getShards: function () {
      return shards;
    },
    getShardLengths: function () {
      return shardLengths;
    },
    getShardStores: function () {
      return shardStores;
    },
    getCacheLimit: function () {
      return cacheLimit;
    },
    setCacheLimit: function (limit) {
      cacheLimit = limit;
    },
    getShardStore: getShardStore,
    getItem: function (key, callback) {
      var shardId = shardingFunction(key);
      var shard = shards[shardId];
      if (shard) {
        getShardStore(shardId).getItem(key, callback);
      } else if (callback) {
        callback(null);
      }
    },
    setItem: function (key, value, callback) {
      var shardId = shardingFunction(key);
      if (!shards[shardId]) {
        shards[shardId] = true;
        localforage.setItem('__LSD_SHARDS__', shards);

        // store length
        localforage.setItem(shardId, 0);
        shardLengths[shardId] = 0;
      }
      getShardStore(shardId).setItem(key, value, function (newShardLength) {
        shardLengths[shardId] = newShardLength;
        localforage.setItem(shardId, newShardLength);
        if (callback) {
          callback();
        }
      });
    },
    removeItem: function (key, callback) {
      var shardId = shardingFunction(key);
      var shard = shards[shardId];
      if (shard) {
        getShardStore(shardId).removeItem(key, function (newShardLength) {
          shardLengths[shardId] = newShardLength;
          localforage.setItem(shardId, newShardLength);
          if (callback) {
            callback();
          }
        });
      } else if (callback) {
        callback();
      }
    },
    clear: function () {
      for (var shardId in shards) {
        clear(shardId);
      }
    }
  };
}));
