// Guarda la "carcasa" de la app para abrir sin red. Los datos viven en IndexedDB, no aquí.
const V = 'atnjuv-3b5f39615d';
const SHELL = ['./', 'index.html', 'app.js?v=3b5f39615d', 'styles.css?v=3b5f39615d', 'manifest.webmanifest', 'icon-192.png', 'logo.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // el servidor, Google y Drive van directo a la red
  if (u.pathname.endsWith('config.js')) return; // siempre la versión más reciente
  e.respondWith(fetch(e.request).then((r) => { const copy = r.clone(); caches.open(V).then((c) => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request).then((m) => m || caches.match('index.html'))));
});
