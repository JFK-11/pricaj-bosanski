/* Pričaj bosanski: offline cache. Bump VERSION when files change. */
const VERSION = "pricaj-v7";
const PAGE = "./";   // the app page; never cache "index.html" (hosts like Netlify redirect it to "/")
const SHELL = [PAGE, "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./apple-touch-icon.png"];

// iOS/Safari refuse a redirected response for a page load, so always hand out a clean copy
async function clean(res){
  if (!res || !res.redirected) return res;
  const body = await res.blob();
  return new Response(body, {status: res.status, statusText: res.statusText, headers: res.headers});
}
async function store(key, res){
  if (!res || !res.ok) return;
  const c = await caches.open(VERSION);
  await c.put(key, await clean(res));
}

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await Promise.all(SHELL.map(async (u) => { const r = await fetch(u, {cache: "reload"}); if (r.ok) await c.put(u, await clean(r)); }));
    await self.skipWaiting();
  })());
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === "navigate"){
    e.respondWith((async () => {
      const hit = await caches.match(PAGE, {ignoreSearch: true});
      const net = fetch(PAGE, {cache: "no-cache"}).then(async (res) => { await store(PAGE, res.clone()); return clean(res); });
      if (hit){ e.waitUntil(net.catch(() => {})); return clean(hit); }
      try { return await net; } catch (err) { return new Response("Offline und noch nicht gespeichert. Bitte einmal mit Internet öffnen.", {status: 503, headers: {"Content-Type": "text/plain; charset=utf-8"}}); }
    })());
    return;
  }
  e.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    const res = await fetch(req);
    store(req, res.clone());
    return res;
  })());
});
