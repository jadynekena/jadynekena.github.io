// use a cacheName for cache versioning
var cacheName = 'v1:static';

var CURRENT_CACHES = {
  'post-message': 'post-message-cache-' + cacheName
};

var liste_des_caches = []


// during the install phase
self.addEventListener('install', function(event) {
    event.waitUntil(self.skipWaiting()); // Activate worker immediately
});


// when the browser fetches a url
self.addEventListener('fetch', function(event) {
    // either respond with the cached object or go ahead and fetch the actual url
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                // retrieve from cache
                return response;
            }
            // fetch as normal
            return fetch(event.request);
        })
    );
});










self.addEventListener('activate', function(event) {
  // Delete all caches that aren't named in CURRENT_CACHES.
  // While there is only one cache in this example, the same logic will handle the case where
  // there are multiple versioned caches.
  var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
    return CURRENT_CACHES[key];
  });

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            // If this cache name isn't present in the array of "expected" cache names, then delete it.
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      return clients.claim();
    }).then(function() {
      // After the activation and claiming is complete, send a message to each of the controlled
      // pages letting it know that it's active.
      // This will trigger navigator.serviceWorker.onmessage in each client.
      return self.clients.matchAll().then(function(clients) {
        return Promise.all(clients.map(function(client) {
          return client.postMessage('The service worker has activated and ' +
            'taken control.');
        }));
      });
    })
  );
});

















self.addEventListener('message', function(event) {
  //console.log('Handling message event:', JSON.stringify(event));
  var p = caches.open(CURRENT_CACHES['post-message']).then(function(cache) {
    switch (event.data.command) {
      // This command returns a list of the URLs corresponding to the Request objects
      // that serve as keys for the current cache.
      case 'keys':
        return cache.keys().then(function(requests) {
          var urls = requests.map(function(request) {
            return request.url;
          });

          return urls.sort();
        }).then(function(urls) {
          // event.ports[0] corresponds to the MessagePort that was transferred as part of the controlled page's
          // call to controller.postMessage(). Therefore, event.ports[0].postMessage() will trigger the onmessage
          // handler from the controlled page.
          // It's up to you how to structure the messages that you send back; this is just one example.
          event.ports[0].postMessage({
            error: null,
            urls: urls
          });
        });

      // This command adds a new request/response pair to the cache.
      case 'add':
        // If event.data.url isn't a valid URL, new Request() will throw a TypeError which will be handled
        // by the outer .catch().
        // Hardcode {mode: 'no-cors} since the default for new Requests constructed from strings is to require
        // CORS, and we don't have any way of knowing whether an arbitrary URL that a user entered supports CORS.
        var request = new Request(event.data.url, {mode: 'no-cors'});
        return fetch(request).then(function(response) {
          return cache.put(event.data.url, response);
        }).then(function() {
          event.ports[0].postMessage({
            error: null
          });
        });

      // This command removes a request/response pair from the cache (assuming it exists).
      case 'delete':
        return cache.delete(event.data.url).then(function(success) {
          event.ports[0].postMessage({
            error: success ? null : 'Item was not found in the cache.'
          });
        });

      default:
        // This will be handled by the outer .catch().
        throw Error('Unknown command: ' + event.data.command);
    }
  }).catch(function(error) {
    // If the promise rejects, handle it by returning a standardized error message to the controlled page.
    console.error('Message handling failed:', error);

    event.ports[0].postMessage({
      error: error.toString()
    });
  });

  // Beginning in Chrome 51, event is an ExtendableMessageEvent, which supports
  // the waitUntil() method for extending the lifetime of the event handler
  // until the promise is resolved.
  if ('waitUntil' in event) {
    event.waitUntil(p);
  }

  // Without support for waitUntil(), there's a chance that if the promise chain
  // takes "too long" to execute, the service worker might be automatically
  // stopped before it's complete.
});
