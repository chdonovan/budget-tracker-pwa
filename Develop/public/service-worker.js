const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1"
const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "manifest.webmanifest",
    "/css/styles.css",
    "/idb.js",
    "/index.js",
    "/icons/icon-72x72.png",
    "/icons/icon-96x96.png",
    "/icons/icon-128x128.png",
    "/icons/icon-144x144.png",
    "/icons/icon-152x152.png",
    "/icons/icon-192x192.png",
    "/icons/icon-384x384.png",
    "/icons/icon-512x612.png",
];

// install
self.addEventListener("install", function(evt){
    // pre cache img data
    evt.waitUntil(
        caches.open(DATA_CACHE_NAME).then((cache) => cache.add("/"))
    );

    // pre cache all static assets
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
    );

    // tells the browser to activate service worker once it has finished installing
    self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", function(evt){
    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("remove old cache data", key);
                        return caches.delete(key);
                    }
                })
            )
        })
    );
    self.clients.claim();
});