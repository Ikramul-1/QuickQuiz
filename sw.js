const CACHE_NAME = 'quickquiz-cache-v1';
const urlsToCache = [
    '/index.html',
    '/style.css',
    '/script.js',
    '/modules/papaparse.min.js',
    '/img/favicon.ico',
    'questions/elements_questions.csv',
    'questions/geography_questions.csv',
    'questions/history_questions.csv',
    'questions/literature_questions.csv',
    'questions/meme_questions.csv',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                cache.addAll(urlsToCache);
            }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});