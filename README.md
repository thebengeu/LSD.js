# LSD.js - Local Storage, Distributed

LSD.js is.. TODO Introduction

## Dependencies
* crossforage (Cross-domain localforage - written by us alongside LSD.js. Useful
  on its own if sharing just one domain's local storage, will be split into own
  repo when more mature.)
* [js-lru](https://github.com/rsms/js-lru)
* [localforage](https://github.com/mozilla/localForage) (Currently using
modified version until we're in a state to make proper pull requests.)

## Prior Work
* [Learning from XAuth: Cross-domain localStorage](http://www.nczonline.net/blog/2010/09/07/learning-from-xauth-cross-domain-localstorage/)
  by Nicholas C. Zakas. Explains how XAuth uses cross-domain messaging for
  read-only access to another domain's `localStorage`.
* [HTML5 Hard Disk Filler™ API](http://feross.org/fill-disk/) by
  [Feross](http://feross.org/). Abuses HTML5 `localStorage` to completely fill
  up Chrome, Safari, and IE users' hard disks.
* [localforage](https://hacks.mozilla.org/2014/02/localforage-offline-storage-improved/)
  by Mozilla. Provides a simple asynchronous localStorage-like API, loading the
  best driver between `IndexedDB`, `WebSQL` and `localStorage`. We adopted their
  API to be able to serve as a drop-in replacement, just `s/localforage/LSD`.
