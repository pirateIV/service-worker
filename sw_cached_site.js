const cacheName = "v2";

// Call install event
self.addEventListener("install", (e) => {
   console.log("Service Worker: Installed");
});

// Call activate event
self.addEventListener("activate", (e) => {
   // Remove unwanted caches
   e.waitUntil(
      caches.keys().then((cachNames) => {
         return Promise.all(
            cachNames.map((cache) => {
               if (cache !== cacheName) {
                  console.log("Service worker: Clearing old cache...");
                  caches.delete(cache);
               }
            })
         );
      })
   );
   console.log("Service Worker: Activated");
});

// Call fetch event
self.addEventListener("fetch", (e) => {
   console.log("Service Worker: Fetching");

   e.respondWith(
      fetch(e.request)
         .then((res) => {
            // Make copy/clone of response
            const resClone = res.clone();
            // Open cache
            caches.open(cacheName).then((cache) => {
               // Add the response to the cache
               cache.put(e.request, resClone);
            });
            return res;
         })
         .catch((err) => caches.match(e.request).then((res) => res))
   );
});
