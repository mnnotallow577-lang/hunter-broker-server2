// Hunter Broker price + candle server. Zero dependencies. Node 18+.
// All prices are SIMULATED (generated here). One feed is shared by every device.
const http=require("http"),fs=require("fs"),path=require("path"),url=require("url");
const E=require("./engine.js");
const PORT=+process.env.PORT||8080,API_KEY=process.env.API_KEY||"",DATA=process.env.DATA_DIR||path.join(__dirname,"data");
const PUB=path.join(__dirname,"public"),STATE=path.join(DATA,"state.json");
const FIELDS=["mode","until","age","lo","hi","dr","imp","pc","tr","vm","ld","rev","pbT","pbD","fd","sn","ss","sl","mp","s","pay","pay5"];
const round=(v,d)=>Number(v.toFixed(d));
/* ---- state: load / save ---- */
function load(){try{const o=JSON.parse(fs.readFileSync(STATE,"utf8"));if(Date.now()/1000-o.t>6*3600)return false;
  for(const k in o.pairs){const a=E.assets[k];if(!a)continue;const r=o.pairs[k];Object.assign(a,r.st);E.ticks[k]=r.p.map((p,i)=>({t:r.t-(r.p.length-1)+i,p}))}
  console.log("restored state from disk");return true}catch(e){return false}}
function save(){try{fs.mkdirSync(DATA,{recursive:true});const o={t:Math.floor(Date.now()/1000),pairs:{}};
  for(const k in E.ticks){const a=E.assets[k],keep=E.ticks[k].slice(-21600),st={};FIELDS.forEach(f=>{if(a[f]!==undefined)st[f]=a[f]});o.pairs[k]={t:keep[keep.length-1].t,p:keep.map(x=>round(x.p,a.d+2)),st}}
  const tmp=STATE+".tmp";fs.writeFile(tmp,JSON.stringify(o),err=>{if(!err)fs.rename(tmp,STATE,()=>{})})}catch(e){console.error("save failed",e.message)}}
if(!load())E.list.forEach(a=>E.ensure(a.n));
E.list.forEach(a=>E.ensure(a.n));
/* ---- live loop ---- */
setInterval(()=>E.advance(),250);
setInterval(()=>{for(const a of E.list){if(!E.ticks[a.n])continue;const t=a.mode==="up"?38:a.mode==="down"?62:50;a.s=Math.round(Math.min(70,Math.max(30,a.s+(t-a.s)*.15+(Math.random()+Math.random()+Math.random()-1.5)*3)))}},2500);
let paySlot=Math.floor(Date.now()/300000);
const clients=new Set();
function payMap(){const m={};E.list.forEach(a=>m[a.n]=[a.pay,a.pay5]);return m}
setInterval(()=>{const s=Math.floor(Date.now()/300000);if(s===paySlot)return;paySlot=s;
  E.list.forEach(a=>{if(Math.random()<.65){const d=(Math.random()<.5?-1:1)*(1+Math.floor(Math.random()*6))/100;a.pay=Math.max(a.pmin,Math.min(a.pmax,Math.round((a.pay+d)*100)/100));a.pay5=Math.max(a.pmin-.02,Math.min(a.pmax,Math.round((a.pay+(Math.random()-.4)*.04)*100)/100))}});
  const m="event: pay\ndata: "+JSON.stringify(payMap())+"\n\n";clients.forEach(c=>c.res.write(m))},1000);
setInterval(save,5*60*1000);
setInterval(()=>{if(!clients.size)return;clients.forEach(c=>{const p={},s={};c.pairs.forEach(k=>{const arr=E.ticks[k];if(!arr)return;const l=arr[arr.length-1];p[k]=[l.t,round(l.p,E.assets[k].d+2)];s[k]=E.assets[k].s});c.res.write("data: "+JSON.stringify({p,s})+"\n\n")})},250);
/* ---- helpers ---- */
const meta=a=>{const t=E.ticks[a.n]||[],f=t[0],l=t[t.length-1];return{n:a.n,full:a.full,cat:a.cat,otc:a.otc,d:a.d,pip:a.pip,pay:a.pay,pay5:a.pay5,price:l?round(l.p,a.d+2):null,chg:f?round((l.p-f.p)/f.p*100,3):0,s:a.s}};
function findIdx(arr,t){let lo=0,hi=arr.length;while(lo<hi){const m=(lo+hi)>>1;if(arr[m].t<t)lo=m+1;else hi=m}return lo}
function ticksResp(k,seconds,before){const a=E.assets[k];let arr=E.ticks[k];seconds=Math.max(60,Math.min(seconds||10800,28800));
  if(before){if(before-seconds<arr[0].t&&arr.length<30000){E.backfill(k);arr=E.ticks[k]}
    const hi=findIdx(arr,before),lo=findIdx(arr,before-seconds);if(hi<=lo)return{pair:k,t0:0,d:a.d,p:[]};
    return run(arr.slice(lo,hi),k,a)}
  return run(arr.slice(-seconds),k,a)}
function run(sl,k,a){let st=0;for(let i=sl.length-1;i>0;i--){if(sl[i].t-sl[i-1].t!==1){st=i;break}}sl=sl.slice(st);return{pair:k,t0:sl.length?sl[0].t:0,d:a.d,p:sl.map(x=>round(x.p,a.d+2))}}
function candles(k,tf,limit,before){E.ensure(k);E.setTf(tf);let cs=E.candlesFor(k);const d=E.assets[k].d+2;
  const now=Math.floor(Date.now()/tf)*tf;if(before)cs=cs.filter(c=>c.t<before);cs=cs.slice(-limit);
  return cs.map(c=>({t:c.t,o:round(c.o,d),h:round(c.h,d),l:round(c.l,d),c:round(c.c,d),live:c.t===now}))}
function analysis(k,tf){E.setTf(tf);let all=E.candlesFor(k);for(let i=0;i<3&&all.length-1<60&&E.ticks[k].length<30000;i++){E.backfill(k);all=E.candlesFor(k)}const cs=all.slice(0,-1),a=E.assets[k],d=a.d+2,n=cs.length;if(n<60)return{error:"not enough history for this timeframe, try a smaller tf"};
  const cl=cs.map(c=>c.c),last=cs[n-1],price=E.price(k),rs=E.rsi(cl,14),e20=E.ema(cl,20),e50=E.ema(cl,50),at=E.atr(cs,14);
  const pats=E.scan(cs,n-9,n-1).map(p=>({candlesAgo:n-1-p.i,pattern:E.PN[p.k][1],bias:E.PN[p.k][2]>0?"bullish":E.PN[p.k][2]<0?"bearish":"neutral"}));
  const lv=E.levels(cs,n).map(g=>({price:round(g.m,d),touches:g.n}));
  return{pair:k,tf,t:Math.floor(Date.now()/1000),price:round(price,d),lastClosedCandle:{t:last.t,o:round(last.o,d),h:round(last.h,d),l:round(last.l,d),c:round(last.c,d)},
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
    if(p==="/api/pairs")return J({now:Math.floor(Date.now()/1000),pairs:E.list.map(meta)});
    if(p==="/api/prices"){const m={};E.list.forEach(a=>{const t=E.ticks[a.n];m[a.n]=round(t[t.length-1].p,a.d+2)});return J({t:Math.floor(Date.now()/1000),prices:m})}
    if(p==="/api/price"){if(!ok)return J({error:"unknown pair"},400);const t=E.ticks[k],l=t[t.length-1];return J({pair:k,t:l.t,price:round(l.p,E.assets[k].d+2)})}
    if(p==="/api/ticks"){if(!ok)return J({error:"unknown pair"},400);return J(ticksResp(k,+q.seconds,+q.before||0))}
    if(p==="/api/candles"){if(!ok)return J({error:"unknown pair"},400);const tf=+q.tf||60;if(tf<5||tf>14400)return J({error:"tf must be 5..14400 seconds"},400);return J({pair:k,tf,candles:candles(k,tf,Math.max(1,Math.min(+q.limit||200,2000)),+q.before||0)})}
    if(p==="/api/analysis"){if(!ok)return J({error:"unknown pair"},400);return J(analysis(k,+q.tf||60))}
    if(p==="/api/stream"){const ps=String(q.pairs||"").split(",").filter(x=>E.assets[x]);if(!ps.length)return J({error:"pairs required"},400);
      res.writeHead(200,{"Content-Type":"text/event-stream","Cache-Control":"no-cache","Connection":"keep-alive","Access-Control-Allow-Origin":"*","X-Accel-Buffering":"no"});
      res.write("retry: 2000\nevent: pay\ndata: "+JSON.stringify(payMap())+"\n\n");const c={res,pairs:ps};clients.add(c);req.on("close",()=>clients.delete(c));return}
    return J({error:"not found"},404)}catch(e){return J({error:e.message},500)}}
  let f=path.normalize(path.join(PUB,p==="/"?"index.html":p));if(f.indexOf(PUB)!==0){res.writeHead(403);return res.end()}
  fs.readFile(f,(err,b)=>{if(err){res.writeHead(404);return res.end("Not found")}res.writeHead(200,{"Content-Type":MIME[path.extname(f)]||"application/octet-stream","Cache-Control":p==="/sw.js"?"no-cache":"public, max-age=300"});res.end(b)})
}).listen(PORT,()=>console.log("Hunter Broker server on :"+PORT+(API_KEY?" (API key on)":" (open API)")));
process.on("SIGTERM",()=>{save();setTimeout(()=>process.exit(0),500)});
