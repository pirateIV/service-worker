const cacheName = "v1";

const cacheAssets = [
   "index.html",
   "/css/style.css",
   "/js/app.js",
   "/images/star-wars-logo.jpg",
];

// Call install event
self.addEventListener("install", (e) => {
   console.log("Service Worker: Installed");

   e.waitUntil(
      caches
         .open(cacheName)
         .then((cache) => {
            console.log("Caching files...");
            cache.addAll(cacheAssets);
         })
         .then(() => self.skipWaiting())
   );
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

   e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
