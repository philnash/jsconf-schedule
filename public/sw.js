importScripts('/js/serviceworker-cache-polyfill.js');

const currentCache = 'jsconf-schedule-2015-v5';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(currentCache).then(function(cache){
      return cache.addAll([
        '/',
        '/style/app.css',
        '/js/app.js'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  var cacheWhitelist = [currentCache];

  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(keyList[i]);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
        console.log(event);
        if (response) {
          console.log('Returned cached request');
          return response;
        }
        console.log('Request wasn\'t cached');
        return fetch(event.request);
      }
    )
  );
});
