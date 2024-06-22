var CACHE_NAME = 'chinitsu-practice';
var urlsToCache = [
    '/',
    'https://osechi-1111.github.io/chintsu-practice/script.js',
    'https://osechi-1111.github.io/chintsu-practice/style.css'
];

// インストール処理
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
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
