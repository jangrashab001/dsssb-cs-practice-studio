const CORE='dsssb-cs-studio-core-v2',PDF='dsssb-cs-studio-papers-v1',FILES=['./','./index.html','./style.css','./app.js','./data.js','./cube-net.svg','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CORE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('dsssb-cs-studio-core-')&&k!==CORE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url),base=new URL('./',self.location.href);if(e.request.method!=='GET'||u.origin!==base.origin)return;
const rel=u.pathname.slice(base.pathname.length);
if(/^(papers|sources|books)\//.test(rel)){e.respondWith(caches.open(PDF).then(c=>c.match(e.request,{ignoreSearch:true})).then(r=>r||fetch(e.request)));return;}
if(rel===''||rel==='index.html'){e.respondWith(fetch(e.request).then(r=>{if(r.ok&&!r.redirected&&r.headers.get('content-type')?.includes('text/html')){const copy=r.clone();caches.open(CORE).then(c=>c.put('./index.html',copy));}return r;}).catch(()=>caches.match('./index.html')));return;}
if(FILES.some(f=>f.replace('./','')===rel))e.respondWith(caches.open(CORE).then(c=>c.match(e.request,{ignoreSearch:true})).then(r=>r||fetch(e.request)));
});
