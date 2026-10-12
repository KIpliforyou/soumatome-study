const CACHE='soumatome-v1';
const ASSETS=['/','/manifest.json'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{ e.waitUntil(self.clients.claim());});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET') return;
  e.respondWith(caches.match(req).then(cached=>{
    if(cached) return cached;
    return fetch(req).then(res=>{
      const copy=res.clone();
      if(req.url.startsWith(self.location.origin)) caches.open(CACHE).then(c=>c.put(req, copy));
      return res;
    }).catch(()=>cached);
  }));
});
