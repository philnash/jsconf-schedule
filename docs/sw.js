importScripts('/js/serviceworker-cache-polyfill.js');

const currentCache = 'jsconf-schedule-2017-v2';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches
      .open(currentCache)
      .then(function(cache) {
        return cache.addAll([
          '/',
          '/style/app.css',
          '/js/app.js',
          '/images/header.svg'
        ]);
      })
      .then(function() {
        self.skipWaiting();
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    deleteOldCaches([currentCache]).then(function() {
      self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);
  if (url.pathname.match(/^\/((js|style|images)\/|manifest.json$)/)) {
    event.respondWith(returnFromCacheOrFetch(event.request, currentCache));
  }
  if (
    event.request.mode === 'navigate' ||
    event.request.headers.get('Accept').indexOf('text/html') !== -1
  ) {
    // cache then network
    event.respondWith(cacheThenNetwork(event.request, currentCache));
  }
});

function cacheAllIn(paths, cacheName) {
  return caches.open(cacheName).then(function(cache) {
    return cache.addAll(paths);
  });
}

function deleteOldCaches(currentCaches) {
  return caches.keys().then(function(names) {
    return Promise.all(
      names
        .filter(function(name) {
          return currentCaches.indexOf(name) === -1;
        })
        .map(function(name) {
          return caches.delete(name);
        })
    );
  });
}

function openCacheAndMatchRequest(cacheName, request) {
  var cachePromise = caches.open(cacheName);
  var matchPromise = cachePromise.then(function(cache) {
    return cache.match(request);
  });
  return [cachePromise, matchPromise];
}

function cacheSuccessfulResponse(cache, request, response) {
  if (response.ok) {
    cache.put(request, response.clone()).then(function() {
      return response;
    });
  }
  return response;
}

function returnFromCacheOrFetch(request, cacheName) {
  return Promise.all(
    openCacheAndMatchRequest(cacheName, request)
  ).then(function(responses) {
    var cache = responses[0];
    var cacheResponse = responses[1];
    // return the cached response if we have it, otherwise the result of the fetch.
    return (
      cacheResponse ||
      fetch(request).then(function(fetchResponse) {
        // Cache the updated file and then return the response
        cacheSuccessfulResponse(cache, request, fetchResponse);
        return fetchResponse;
      })
    );
  });
}

function cacheThenNetwork(request, cacheName) {
  return Promise.all(
    openCacheAndMatchRequest(cacheName, request)
  ).then(function(responses) {
    var cache = responses[0];
    var cacheResponse = responses[1];
    if (cacheResponse) {
      // If it's in the cache then start a fetch to update the cache, but
      // return the cached response
      fetch(request)
        .then(function(fetchResponse) {
          return cacheSuccessfulResponse(cache, request, fetchResponse);
        })
        .then(refresh)
        .catch(function(err) {
          // Offline/network failure, but nothing to worry about
        });
      return cacheResponse;
    } else {
      // If it's not in the cache then start a fetch.
      // I don't think the app can get here, as we cache the index, the CSS and
      // the JS. I'm willing to be proved wrong though.
      return fetch(request).then(function(fetchResponse) {
        cacheSuccessfulResponse(cache, request, fetchResponse);
        return fetchResponse;
      });
    }
  });
}

function refresh(response) {
  return self.clients.matchAll().then(function(clients) {
    clients.forEach(function(client) {
      var message = {
        type: 'refresh',
        url: response.url,
        eTag: response.headers.get('ETag')
      };
      client.postMessage(JSON.stringify(message));
    });
  });
}
