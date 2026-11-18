// Service worker: guarda la app para que abra sin conexión.
// Al publicar cambios, sube el número de versión para que los dispositivos se actualicen.
const VERSION = 'rumbo-v2';

const FILES = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/app.css',
  'js/app.js',
  'js/charts.js',
  'js/icons.js',
  'js/logic.js',
  'js/quick.js',
  'js/seed.js',
  'js/store.js',
  'js/ui.js',
  'js/util.js',
  'js/modules/finance.js',
  'js/modules/goals.js',
  'js/modules/habits.js',
  'js/modules/notes.js',
  'js/modules/tasks.js',
  'js/modules/training.js',
  'js/views/calendar.js',
  'js/views/settings.js',
  'js/views/space.js',
  'js/views/summary.js',
  'js/views/today.js',
  'js/views/welcome.js',
  'assets/fonts/bricolage-grotesque.woff2',
  'assets/fonts/instrument-sans.woff2',
  'assets/icons/favicon.svg',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Primero la red, para ver siempre la última versión; si no hay conexión, lo guardado.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('index.html'))),
  );
});
