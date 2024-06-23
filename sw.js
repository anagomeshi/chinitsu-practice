var CACHE_NAME = 'chinitsu-practice-v1';
var urlsToCache = [
    '/',
    '/img/check.svg',
    '/img/s1.png',
    '/img/s2.png',
    '/img/s3.png',
    '/img/s4.png',
    '/img/s5.png',
    '/img/s6.png',
    '/img/s7.png',
    '/img/s8.png',
    '/img/s9.png',
    '/img/setting.svg',
    '/img/time-attack.svg',
    '/script.js',
    '/style.css'
];

// インストール処理
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
                return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting();
});

// アクティベート処理
self.addEventListener('activate', function(event) {
    var cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function(){
            return self.clients.claim();
        })
    );
});

// リソースフェッチ時のキャッシュロード処理
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches
            .match(event.request)
            .then(function(response) {
                return response || fetch(event.request);
            })
    );
});
