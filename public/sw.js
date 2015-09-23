importScripts('/js/serviceworker-cache-polyfill.js');

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('jsconf-schedule-2015-v1').then(function(cache){
      return cache.addAll([
        '/',
        '/style/app.css',
        '/js/app.js'
      ]);
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
