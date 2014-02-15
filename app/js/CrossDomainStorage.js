/*global define*/

// Starting point: http://www.nczonline.net/blog/2010/09/07/learning-from-xauth-cross-domain-localstorage/

(function (root, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else {
    // Browser globals
    root.CrossDomainStorage = factory();
  }
}(this, function () {
  'use strict';

  function CrossDomainStorage(origin, path) {
    this.origin = origin;
    this.path = path;
    this._iframe = null;
    this._iframeReady = false;
    this._queue = [];
    this._requests = {};
    this._id = 0;
  }

  CrossDomainStorage.prototype = {
    //restore constructor
    constructor: CrossDomainStorage,

    //public interface methods
    load: function () {
      var that = this;
      if (!this._iframe) {
        if (window.postMessage && window.JSON && window.localStorage) {
          this._iframe = document.createElement('iframe');
          this._iframe.style.cssText = 'position:absolute;width:1px;height:1px;left:-9999px;';
          document.body.appendChild(this._iframe);

          if (window.addEventListener) {
            this._iframe.addEventListener('load', function () {
              that._iframeLoaded();
            }, false);
            window.addEventListener('message', function (event) {
              that._handleMessage(event);
            }, false);
          } else if (this._iframe.attachEvent) {
            this._iframe.attachEvent('onload', function () {
              that._iframeLoaded();
            }, false);
            window.attachEvent('onmessage', function (event) {
              that._handleMessage(event);
            });
          }
        } else {
          throw new Error('Unsupported browser.');
        }
      }

      this._iframe.src = this.origin + this.path;
    },

    unload: function () {
      if (this._iframe) {
        document.body.removeChild(this._iframe);
      }
    },

    getItem: function (key, callback) {
      this._queueRequest({
        method: 'getItem',
        key: key
      }, function (data) {
        if (data.value) {
          var result = JSON.parse(data.value);
        }

        callback(result);
      });
    },

    setItem: function (key, value, callback) {
      try {
        value = JSON.stringify(value);
      } catch (e) {
        console.error("Couldn't convert value into a JSON string: ", value);
        callback(-1);
      }

      this._queueRequest({
        method: 'setItem',
        key: key,
        value: value
      }, function (data) {
        callback(data.length);
      });
    },

    removeItem: function (key, callback) {
      this._queueRequest({
        method: 'removeItem',
        key: key
      }, function (data) {
        callback(data.length);
      });
    },

    clear: function (callback) {
      this._queueRequest({
        method: 'clear'
      }, function () {
        callback();
      });
    },

    //private methods

    _queueRequest: function (request, callback) {
      request.id = ++this._id;
      var data = {
        request: request,
        callback: callback || function () {
        }
      };

      if (this._iframeReady) {
        this._sendRequest(data);
      } else {
        this._queue.push(data);
      }

      if (!this._iframe) {
        this.load();
      }
    },

    _sendRequest: function (data) {
      this._requests[data.request.id] = data;
      this._iframe.contentWindow.postMessage(JSON.stringify(data.request), this.origin);
    },

    _iframeLoaded: function () {
      this._iframeReady = true;

      if (this._queue.length) {
        for (var i = 0, len = this._queue.length; i < len; i++) {
          this._sendRequest(this._queue[i]);
        }
        this._queue = [];
      }
    },

    _handleMessage: function (event) {
      if (event.origin === this.origin) {
        var data = JSON.parse(event.data);
        this._requests[data.id].callback(data);
        delete this._requests[data.id];
      }
    }
  };

  return CrossDomainStorage;
}));
