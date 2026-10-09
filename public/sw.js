const C="hunter-broker-v5",F=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
// App files open instantly from the cache (even while a sleeping server wakes up) and refresh in the background.
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;if(new URL(r.url).pathname.indexOf("/api/")===0)return;
  e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp)).catch(()=>{})}return res}).catch(()=>hit||caches.match("./index.html"));return hit||net}))});
