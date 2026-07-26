// Minimal service worker - caches the app shell so Chronicle can be
// installed to the home screen and still opens (login screen) offline.
// Your actual data always comes from Google Drive, not from this cache.
const CACHE_NAME = 'chronicle-shell-v1';
const SHELL_FILES = [
    './',
    './index.html',
    './manifest.json',
    './favicon-32.png',
    './favicon-16.png',
    './apple-touch-icon.png',
    './icon-192.png',
    './icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(() => {})
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Network-first for everything (so you always get your latest code/data when online),
    // falling back to the cached app shell only when there's no connection.
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});
