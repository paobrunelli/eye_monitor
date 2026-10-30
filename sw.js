/*
 * Service worker di Monitor Occhi.
 *
 * - Guscio dell'app (HTML, manifest, icone): servito subito dalla cache e
 *   aggiornato in background (stale-while-revalidate). Dopo un aggiornamento
 *   del sito la nuova versione si vede al secondo avvio dell'app.
 * - File di MediaPipe (modulo JS, wasm, modello .task): cache-first, scaricati
 *   una sola volta dal CDN. Per averli offline basta avviare il monitoraggio
 *   una volta online dopo l'installazione, fino a "Occhi aperti".
 * - Tutto il resto passa in rete senza che il service worker lo tocchi.
 *
 * Per forzare la pulizia delle cache, incrementa VERSION.
 */
const VERSION = "v1";
const SHELL_CACHE = `eye-shell-${VERSION}`;
const RUNTIME_CACHE = `eye-runtime-${VERSION}`;

const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
];

const RUNTIME_HOSTS = ["cdn.jsdelivr.net", "storage.googleapis.com"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("eye-") && k !== SHELL_CACHE && k !== RUNTIME_CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  if (req.headers.has("range")) return;      // le risposte parziali non vanno in cache

  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }

  if (RUNTIME_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(req));
  }
});

async function staleWhileRevalidate(req) {
  const cache = await caches.open(SHELL_CACHE);
  // ignoreSearch: "?debug" deve trovare comunque index.html in cache
  const cached = await cache.match(req, { ignoreSearch: true });
  const network = fetch(req)
    .then((res) => {
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    })
    .catch(() => null);

  if (cached) {
    network.catch(() => {});                 // aggiornamento in background
    return cached;
  }
  const res = await network;
  if (res) return res;
  if (req.mode === "navigate") {
    const fallback = await cache.match("./index.html");
    if (fallback) return fallback;
  }
  return new Response("Offline", { status: 503, statusText: "Offline" });
}

async function cacheFirst(req) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(req);
  if (cached) return cached;
  const res = await fetch(req);
  if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
  return res;
}
