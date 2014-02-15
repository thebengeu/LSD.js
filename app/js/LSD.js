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

  return {
    getItem: function (key, callback) {
    },
    setItem: function (key, value, callback) {
    },
    removeItem: function (key, callback) {
    },
    clear: function () {
    }
  };
}));
