const CACHE_NAME = 'lucky3-v2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);
    const isSameOrigin = url.origin === self.location.origin;
    const isNavigation = event.request.mode === 'navigate';

    if (!isSameOrigin) return;

    if (isNavigation) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', copy)).catch(() => { });
                    return response;
                })
                .catch(async () => {
                    const cached = await caches.match('./index.html');
                    return cached || caches.match('./');
                })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then(async (response) => {
            if (response) {
                fetch(event.request)
                    .then((networkResponse) => caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse)))
                    .catch(() => { });
                return response;
            }

            const networkResponse = await fetch(event.request);
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => { });
            return networkResponse;
        })
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
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
