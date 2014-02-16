# LSD.js - Local Storage, Distributed

## Introduction

LSD.js is a JavaScript library that combines a bunch of browser hacks to give HTML5 apps the ability to have **unbounded** local storage, with the ability to **share** this storage between disparate apps even on different domains, and when offline.

This is especially important for mobile devices, but strangely, even though most modern desktop browsers are capable of local storage up to a significant quota of the user's free disk space, local storage (WebSQL) is sadly limited to **50MB** on iOS Safari, and **200MB** on more recent versions of the Android browser.

LSD.js works by sharding data intelligently across subdomains / domains, dynamically creating iframes and using cross-domain messaging to store and retrieve the data in each "shard". This is based on a sharding function provided by the developer to hash keys, in order to exploit data locality specific to the needs of their application.

Data locality is important, as LSD.js is capable of storing GBs of data, which would hardly fit in most mobile devices' memory - especially since an iframe, which is a full nested browsing context, is needed for each "shard". Hence, for performance, it "pages" shards in and out as needed, loading and unloading iframes, and making sure data is garbage collected, based on a LRU cache of configurable size.

For example, the library which caches map tiles in our [demo app](http://lsdjs.info/map_demo.html) hashes keys based on locality in rectangular regions, and configures the LRU cache to have a limit of 4 since that represents the worst case scenario, when the region of interest is at the intersection of 4 of these rectangular regions.

LSD.js leverages the best option between `IndexedDB`, `WebSQL` and `localStorage` depending on browser, and is built on top of `crossforage.js`, which we built for cross-domain local storage in the context of a single domain.

## Offline Map Cache Demo

#### [Offline Map Cache Demo](http://lsdjs.info/map_demo.html)

## Use Cases

### Online / Offline Travel Apps

This is a key use case, and the itch-to-scratch problem we originally wanted to solve. We created another two reusable libraries to showcase the possibilities with LSD.js - one is a drop-in replacement for the popular map library [Leaflet](http://leafletjs.com/), and the other is for Yelp.

Both libraries transparently cache any downloaded map tiles / info in the unlimited shared local storage, and add API functions to precache selected regions.

Map tiles and POI info are key things almost every travel app needs. Even if locally cached in a native app, this data is usually siloed and only available to that one app. With LSD.js, any developer who uses these libraries automatically take advantage of any data already downloaded offline, saving bandwidth and disk space.

### Offline Github Repo Viewer / Issue Triager

### Wikipedia (Subset) Offline

## API Documentation

[To be filled when we've had more sleep!]

## Dependencies
* `crossforage.js` (Cross-domain localforage - written by us alongside LSD.js. May be split into own repo when more mature.)
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
