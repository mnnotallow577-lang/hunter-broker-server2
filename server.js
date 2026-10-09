// Hunter Broker price + candle server. Zero dependencies. Node 18+.
// All prices are SIMULATED. The market is a pure function of (pair, time): the same seeded random
// numbers are used every time, so a restart (or a free host that sleeps) rebuilds EXACTLY the same history.
const http=require("http"),fs=require("fs"),path=require("path"),url=require("url");
const E=require("./engine.js");
const PORT=+process.env.PORT||8080,API_KEY=process.env.API_KEY||"";
const PUB=path.join(__dirname,"public");
const round=(v,d)=>Number(v.toFixed(d));
const nowS=()=>Math.floor(Date.now()/1000);
const SEASON=+process.env.SEASON_DAYS>0?Math.round(+process.env.SEASON_DAYS*86400):7*86400; // price re-anchors near its base level every season (a "weekend gap")
const KEEP=21600,MAXBACK=7*86400,SEED=process.env.FEED_SEED||"hunter-1";
/* ---- deterministic generator ---- */
function mulberry(s){return function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hash(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
const RESET={mode:"",until:0,age:0,lo:0,hi:0,dr:0,imp:0,pc:0,tr:0,vm:1,ld:0,rev:0,pbT:0,pbD:0,fd:0,sn:0,ss:0,sl:5,mp:undefined};
function startSeason(a,si){Object.assign(a,RESET);a.rng=mulberry(hash(SEED+"|"+a.n+"|"+si));return a.p*(1+(a.rng()-.5)*.02)}
// simulate seconds [fromT..toT] of every season that overlaps; keeps ticks with t>=fromT. Leaves `a` in the state at toT.
function simSeasons(a,fromT,toT){const out=[];for(let si=Math.floor(fromT/SEASON);si<=Math.floor(toT/SEASON);si++){
  const t0=si*SEASON,end=Math.min(toT,t0+SEASON-1);let p=startSeason(a,si);
  for(let t=t0;t<=end;t++){if(t>t0){p=E.nextP(a,p,1,t);if(t%60===0&&a.rng()<a.gp)p=E.applyGap(a,p)}if(t>=fromT)out.push({t,p})}}
  return out}
function rebuild(a,now){E.ticks[a.n]=simSeasons(a,now-KEEP,now)}
const t0=Date.now();E.list.forEach(a=>rebuild(a,nowS()));
console.log("feed rebuilt in "+(Date.now()-t0)+" ms ("+E.list.length+" pairs, season "+SEASON/86400+" days)");
/* ---- live loop (one tick per second per pair, identical to what a rebuild would produce) ---- */
function liveStep(){const now=nowS();for(const a of E.list){const arr=E.ticks[a.n];let last=arr[arr.length-1];
  if(now-last.t>3600){rebuild(a,now);continue}
  while(last.t<now){const t1=last.t+1;let p;if(t1%SEASON===0)p=startSeason(a,t1/SEASON);else{p=E.nextP(a,last.p,1,t1);if(t1%60===0&&a.rng()<a.gp)p=E.applyGap(a,p)}last={t:t1,p};arr.push(last)}
  if(arr.length>KEEP+1800)arr.splice(0,arr.length-KEEP)}}
setInterval(liveStep,250);
setInterval(()=>{for(const a of E.list){const t=a.mode==="up"?38:a.mode==="down"?62:50;a.s=Math.round(Math.min(70,Math.max(30,a.s+(t-a.s)*.15+(Math.random()+Math.random()+Math.random()-1.5)*3)))}},2500);
let paySlot=Math.floor(Date.now()/300000);
const clients=new Set();
function payMap(){const m={};E.list.forEach(a=>m[a.n]=[a.pay,round(a.pay5,2)]);return m}
setInterval(()=>{const s=Math.floor(Date.now()/300000);if(s===paySlot)return;paySlot=s;
  E.list.forEach(a=>{if(Math.random()<.65){const d=(Math.random()<.5?-1:1)*(1+Math.floor(Math.random()*6))/100;a.pay=Math.max(a.pmin,Math.min(a.pmax,Math.round((a.pay+d)*100)/100));a.pay5=Math.max(a.pmin-.02,Math.min(a.pmax,Math.round((a.pay+(Math.random()-.4)*.04)*100)/100))}});
  const m="event: pay\ndata: "+JSON.stringify(payMap())+"\n\n";clients.forEach(c=>c.res.write(m))},1000);
setInterval(()=>{if(!clients.size)return;clients.forEach(c=>{const p={},s={};let any=false;c.pairs.forEach(k=>{const arr=E.ticks[k];if(!arr)return;const l=arr[arr.length-1];if(c.last[k]!==l.t){c.last[k]=l.t;p[k]=[l.t,round(l.p,E.assets[k].d+2)];any=true}s[k]=E.assets[k].s});if(any)c.res.write("data: "+JSON.stringify({p,s})+"\n\n")})},250);
/* ---- history on demand (older than what is kept in memory) ---- */
const cache=new Map();
function histRange(k,from,to){const a=E.assets[k],arr=E.ticks[k],now=nowS();from=Math.max(from,now-MAXBACK);if(to<from)return[];
  let old=[];if(from<arr[0].t){const key=k+"|"+from+"|"+Math.min(to,arr[0].t-1);old=cache.get(key);
    if(!old){const c=Object.assign({},a);old=simSeasons(c,from,Math.min(to,arr[0].t-1));cache.set(key,old);if(cache.size>24)cache.delete(cache.keys().next().value)}}
  let mem=[];if(to>=arr[0].t){const i0=Math.max(0,from-arr[0].t),i1=Math.min(arr.length,to-arr[0].t+1);mem=arr.slice(i0,i1)}
  return old.length?old.concat(mem):mem}
/* ---- responses ---- */
const meta=a=>{const t=E.ticks[a.n]||[],f=t[0],l=t[t.length-1];return{n:a.n,full:a.full,cat:a.cat,otc:a.otc,d:a.d,pip:a.pip,pay:a.pay,pay5:round(a.pay5,2),price:l?round(l.p,a.d+2):null,chg:f?round((l.p-f.p)/f.p*100,3):0,s:a.s}};
function ticksResp(k,seconds,before){const a=E.assets[k];seconds=Math.max(60,Math.min(seconds||10800,28800));
  const to=before?before-1:nowS();const sl=histRange(k,to-seconds+1,to);return run(sl,k,a)}
function run(sl,k,a){let st=0;for(let i=sl.length-1;i>0;i--){if(sl[i].t-sl[i-1].t!==1){st=i;break}}sl=sl.slice(st);return{pair:k,t0:sl.length?sl[0].t:0,d:a.d,p:sl.map(x=>round(x.p,a.d+2))}}
function withTicks(k,arr,fn){const saved=E.ticks[k];E.ticks[k]=arr;try{return fn()}finally{E.ticks[k]=saved}}
function candles(k,tf,limit,before){limit=Math.min(limit,Math.floor(MAXBACK/tf)-1);const now=nowS(),end=before?before-1:now,from=end-(limit+1)*tf;
  const arr=histRange(k,from,end);if(!arr.length)return[];E.setTf(tf);const cs=withTicks(k,arr,()=>E.candlesFor(k)),d=E.assets[k].d+2,live=Math.floor(now/tf)*tf;
  return cs.filter(c=>!before||c.t<before).slice(-limit).map(c=>({t:c.t,o:round(c.o,d),h:round(c.h,d),l:round(c.l,d),c:round(c.c,d),live:c.t===live}))}
function analysis(k,tf){const a=E.assets[k],d=a.d+2,now=nowS(),from=Math.max(now-MAXBACK,now-(120)*tf);const arr=histRange(k,from,now);E.setTf(tf);
  const all=withTicks(k,arr,()=>E.candlesFor(k)),cs=all.slice(0,-1),n=cs.length;if(n<60)return{error:"not enough history for this timeframe, try a smaller tf"};
  const cl=cs.map(c=>c.c),last=cs[n-1],price=E.price(k),rs=E.rsi(cl,14),e20=E.ema(cl,20),e50=E.ema(cl,50),at=E.atr(cs,14);
  const pats=E.scan(cs,n-9,n-1).map(p=>({candlesAgo:n-1-p.i,pattern:E.PN[p.k][1],bias:E.PN[p.k][2]>0?"bullish":E.PN[p.k][2]<0?"bearish":"neutral"}));
  const lv=E.levels(cs,n).map(g=>({price:round(g.m,d),touches:g.n}));
  return{pair:k,tf,t:now,price:round(price,d),lastClosedCandle:{t:last.t,o:round(last.o,d),h:round(last.h,d),l:round(last.l,d),c:round(last.c,d)},
   rsi14:round(rs[n-1],2),ema20:round(e20[n-1],d),ema50:round(e50[n-1],d),atr14:round(at[n-1],d),patterns:pats,
   resistance:lv.filter(x=>x.price>price).sort((x,y)=>x.price-y.price).slice(0,3),support:lv.filter(x=>x.price<=price).sort((x,y)=>y.price-x.price).slice(0,3),
   note:"Simulated feed. Raw analysis only; this is not trading advice."}}
function allowed(req,q){if(!API_KEY)return true;if(q.key===API_KEY||req.headers["x-api-key"]===API_KEY)return true;
  const o=req.headers.origin||req.headers.referer||"";try{return new URL(o).host===req.headers.host}catch(e){return false}}
const MIME={".html":"text/html; charset=utf-8",".js":"text/javascript",".json":"application/json",".webmanifest":"application/manifest+json",".png":"image/png",".txt":"text/plain",".css":"text/css"};
/* ---- http ---- */
http.createServer((req,res)=>{const u=url.parse(req.url,true),q=u.query,p=u.pathname;
  const J=(o,c)=>{res.writeHead(c||200,{"Content-Type":"application/json","Access-Control-Allow-Origin":"*","Cache-Control":"no-store"});res.end(JSON.stringify(o))};
  if(req.method==="OPTIONS"){res.writeHead(204,{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"x-api-key,content-type"});return res.end()}
  if(p==="/healthz")return J({ok:true,pairs:E.list.length,clients:clients.size});
  if(p.indexOf("/api/")===0){
    if(!allowed(req,q))return J({error:"API key required (x-api-key header or ?key=)"},401);
    const k=q.pair,ok=k&&E.assets[k];
    try{
    if(p==="/api/pairs")return J({now:nowS(),pairs:E.list.map(meta)});
    if(p==="/api/prices"){const m={};E.list.forEach(a=>{const t=E.ticks[a.n];m[a.n]=round(t[t.length-1].p,a.d+2)});return J({t:nowS(),prices:m})}
    if(p==="/api/price"){if(!ok)return J({error:"unknown pair"},400);const t=E.ticks[k],l=t[t.length-1];return J({pair:k,t:l.t,price:round(l.p,E.assets[k].d+2)})}
    if(p==="/api/ticks"){if(!ok)return J({error:"unknown pair"},400);return J(ticksResp(k,+q.seconds,+q.before||0))}
    if(p==="/api/candles"){if(!ok)return J({error:"unknown pair"},400);const tf=+q.tf||60;if(tf<5||tf>14400)return J({error:"tf must be 5..14400 seconds"},400);return J({pair:k,tf,candles:candles(k,tf,Math.max(1,Math.min(+q.limit||200,2000)),+q.before||0)})}
    if(p==="/api/analysis"){if(!ok)return J({error:"unknown pair"},400);return J(analysis(k,+q.tf||60))}
    if(p==="/api/stream"){const ps=String(q.pairs||"").split(",").filter(x=>E.assets[x]);if(!ps.length)return J({error:"pairs required"},400);
      res.writeHead(200,{"Content-Type":"text/event-stream","Cache-Control":"no-cache","Connection":"keep-alive","Access-Control-Allow-Origin":"*","X-Accel-Buffering":"no"});
      res.write("retry: 2000\nevent: pay\ndata: "+JSON.stringify(payMap())+"\n\n");const c={res,pairs:ps,last:{}};clients.add(c);req.on("close",()=>clients.delete(c));return}
    return J({error:"not found"},404)}catch(e){return J({error:e.message},500)}}
  let f=path.normalize(path.join(PUB,p==="/"?"index.html":p));if(f.indexOf(PUB)!==0){res.writeHead(403);return res.end()}
  fs.readFile(f,(err,b)=>{if(err){res.writeHead(404);return res.end("Not found")}res.writeHead(200,{"Content-Type":MIME[path.extname(f)]||"application/octet-stream","Cache-Control":p==="/sw.js"?"no-cache":"public, max-age=300"});res.end(b)})
}).listen(PORT,()=>console.log("Hunter Broker server on :"+PORT+(API_KEY?" (API key on)":" (open API)")));
