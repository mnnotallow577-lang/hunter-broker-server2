// Hunter Broker price engine (simulated prices). Generated from the web app code.
module.exports=(function(){
let rngf=Math.random;
const A=(n,full,cat,p,d,v,pay,otc)=>({n,full,cat,p,d,v,pay,otc:!!otc,wp:otc?.03:.015,gp:otc?.03:.015,pbT:0,pbD:0,fd:0,sn:0,ss:0,sl:5,mp:undefined,sw:otc?.015:.008,ar:otc?.15:.05,tw:otc?.75:1,ld:0,rev:0,pay5:Math.round(Math.max(.5,pay-.01+rngf()*.04)*100)/100,pmin:otc?.80:cat==='Exotic'?.74:.76,pmax:otc?.95:cat==='Exotic'?.86:.90,pip:d>=5||d===4?1e-4:.01,tr:0,vm:1,s:50,mode:"",until:0,age:0,lo:0,hi:0,dr:0,imp:0,pc:0,vT:1,wv:0,pb:0,rts:0,mid2:0,mv:0});
const R=(n,full,cat,p,d,v,pay)=>A(n,full,cat,p,d,v,pay,false);
const O=(n,full,p,d,v,pay)=>A(n+" (OTC)",full+" OTC","OTC",p,d,v*1.8,pay,true);
const list=[
R("EUR/USD","Euro / US Dollar","Major",1.1730,5,1.0e-5,.84),
R("GBP/USD","British Pound / US Dollar","Major",1.3401,5,1.2e-5,.80),
R("USD/JPY","US Dollar / Japanese Yen","Major",155.56,3,1.2e-5,.88),
R("AUD/USD","Australian Dollar / US Dollar","Major",.6620,5,1.2e-5,.85),
R("USD/CHF","US Dollar / Swiss Franc","Major",.7943,5,1.1e-5,.85),
R("USD/CAD","US Dollar / Canadian Dollar","Major",1.3771,5,1.0e-5,.86),
R("NZD/USD","New Zealand Dollar / US Dollar","Major",.5775,5,1.3e-5,.85),
R("EUR/GBP","Euro / British Pound","Minor",.8752,5,.8e-5,.85),
R("EUR/JPY","Euro / Japanese Yen","Cross",182.46,3,1.4e-5,.85),
R("GBP/JPY","British Pound / Japanese Yen","Cross",208.46,3,1.8e-5,.84),
R("EUR/CHF","Euro / Swiss Franc","Cross",.9316,5,.8e-5,.83),
R("AUD/JPY","Australian Dollar / Japanese Yen","Cross",102.98,3,1.5e-5,.84),
R("CAD/JPY","Canadian Dollar / Japanese Yen","Cross",112.96,3,1.4e-5,.83),
R("CHF/JPY","Swiss Franc / Japanese Yen","Cross",195.85,3,1.3e-5,.82),
R("GBP/CHF","British Pound / Swiss Franc","Cross",1.0644,5,1.3e-5,.82),
R("EUR/AUD","Euro / Australian Dollar","Cross",1.7719,5,1.2e-5,.82),
R("EUR/CAD","Euro / Canadian Dollar","Cross",1.6154,5,1.1e-5,.82),
R("AUD/CAD","Australian Dollar / Canadian Dollar","Cross",.9117,5,1.0e-5,.81),
R("USD/SGD","US Dollar / Singapore Dollar","Exotic",1.2899,5,.8e-5,.80),
R("USD/ZAR","US Dollar / South African Rand","Exotic",16.7578,4,1.6e-5,.78),
O("USD/MXN","US Dollar / Mexican Peso",17.6040,4,1.4e-5,.95),
O("USD/EGP","US Dollar / Egyptian Pound",52.9480,4,.6e-5,.93),
O("USD/IDR","US Dollar / Indonesian Rupiah",17847.91,2,.7e-5,.92),
O("NZD/CAD","New Zealand Dollar / Canadian Dollar",.80869,5,2.2e-5,.90),
O("USD/BDT","US Dollar / Bangladeshi Taka",122.50,3,.3e-5,.91),
O("USD/INR","US Dollar / Indian Rupee",88.50,3,.4e-5,.90),
O("USD/PKR","US Dollar / Pakistani Rupee",281.20,3,.3e-5,.90),
O("USD/BRL","US Dollar / Brazilian Real",5.4500,4,1.5e-5,.93),
O("USD/TRY","US Dollar / Turkish Lira",47.80,4,.8e-5,.92),
O("USD/NGN","US Dollar / Nigerian Naira",1520.00,2,.6e-5,.90),
O("USD/COP","US Dollar / Colombian Peso",4050.00,2,1.2e-5,.92),
O("USD/DZD","US Dollar / Algerian Dinar",131.20,3,.5e-5,.90),
O("USD/ARS","US Dollar / Argentine Peso",1450.00,2,.7e-5,.90),
O("USD/PHP","US Dollar / Philippine Peso",58.20,3,.6e-5,.90),
O("EUR/USD","Euro / US Dollar",1.1730,5,1.0e-5,.86),
O("GBP/USD","British Pound / US Dollar",1.3401,5,1.2e-5,.86),
O("USD/JPY","US Dollar / Japanese Yen",155.56,3,1.2e-5,.86),
O("AUD/USD","Australian Dollar / US Dollar",.6620,5,1.2e-5,.86),
O("AUD/CAD","Australian Dollar / Canadian Dollar",.9117,5,1.0e-5,.88),
O("AUD/CHF","Australian Dollar / Swiss Franc",.5258,5,1.1e-5,.88),
O("AUD/NZD","Australian Dollar / New Zealand Dollar",1.1463,5,.9e-5,.87),
O("EUR/NZD","Euro / New Zealand Dollar",2.0312,5,1.3e-5,.87),
O("GBP/NZD","British Pound / New Zealand Dollar",2.3205,5,1.5e-5,.86),
O("CAD/CHF","Canadian Dollar / Swiss Franc",.5768,5,1.0e-5,.86),
O("NZD/CHF","New Zealand Dollar / Swiss Franc",.4587,5,1.1e-5,.86),
O("NZD/JPY","New Zealand Dollar / Japanese Yen",89.84,3,1.4e-5,.86)];
const C=(n,full,cat,p,d,v,pay)=>A(n+" (OTC)",full+" OTC",cat,p,d,v,pay,true);
list.push(C("Bitcoin","Bitcoin / US Dollar","Crypto",84500,2,2.5e-5,.72),C("Ethereum","Ethereum / US Dollar","Crypto",2400,2,3e-5,.78),C("Litecoin","Litecoin / US Dollar","Crypto",95,2,2.6e-5,.74),C("Dogecoin","Dogecoin / US Dollar","Crypto",.32,4,3.2e-5,.76),C("Solana","Solana / US Dollar","Crypto",180,2,3e-5,.74),C("Gold","Gold / US Dollar","Commodity",4100,2,1.4e-5,.80),C("Silver","Silver / US Dollar","Commodity",58,3,2.2e-5,.78),C("Platinum","Platinum / US Dollar","Commodity",1550,2,1.5e-5,.76),C("Brent Oil","Brent Crude Oil","Commodity",80,3,2e-5,.76));
const assets={};list.forEach(a=>assets[a.n]=a);
let cur="USD/IDR (OTC)",tf=60;
function rnd(){return rngf()+rngf()+rngf()-1.5}
const rnd2=rf=>rf()+rf()+rf()-1.5;
/* intraday session volatility (UTC hours): quiet Asian morning, active London / NY overlap */
function sessVol(t){const h=(((t||0)/3600)%24+24)%24,g=(m,s)=>Math.exp(-((h-m)*(h-m))/(2*s*s));
  return .55+.45*Math.min(1.15,g(8,3)+.8*g(14.5,3.5)+.35*g(21,3))}
/* OTC-style regime engine: range -> squeeze -> breakout/trend -> range ... */
function newRegime(a,p){
  const rf=a.rng||Math.random;
  const sd=p*a.v*7.7,r=rf(),pm=a.mode,o=a.otc;let m;
  if(!pm)m="range";
  else if(pm==="range")m=r<(o?.34:.5)?"trend":r<(o?.46:.65)?"sq":"range";
  else if(pm==="sq")m=r<.55?"trend":"range";
  else m=r<.5?"range":r<.62?"sq":"trend";
  if(m==="trend"){
    let dir;
    if(pm==="up"||pm==="down")dir=a.dr>0?-1:1;
    else{dir=p>(a.lo+a.hi)/2?1:-1;if(rf()<.35)dir=-dir}
    a.dr=dir*p*a.v*(.08+rf()*.14)*a.tw;a.imp=20+rf()*50;a.until=(o?150:300)+rf()*(o?330:900);a.mode=dir>0?"up":"down";
    a.rts=8+Math.floor(rf()*35);a.vT=1.15+(o?.35:.2)*rf();a.wv=0;a.pb=0;
  }else{
    const hw=sd*(m==="sq"?1.5+rf()*1.5:(o?2.2:3)+rf()*(o?3.6:5)),mid=p+(rf()-.5)*hw*.8;
    a.lo=mid-hw;a.hi=mid+hw;a.dr=0;a.until=m==="sq"?100+rf()*180:(o?240+rf()*480:600+rf()*1800);a.mode=m;
    a.vT=m==="sq"?.5:.85+rf()*.3;a.mid2=mid+(rf()-.5)*hw*.4;a.mv=(rf()<.5?-1:1)*hw*.0008*(.5+rf());a.rts=0;a.wv=0;a.pb=0;
  }
  a.age=0}
function minuteEnd(a,p){
  const rf=a.rng||Math.random;
  if(a.mp!==undefined){const d=p-a.mp,sg=d>0?1:d<0?-1:0;
    if(a.fd){if(sg===a.fd){a.pbT=50+Math.floor(rf()*10);a.pbD=-a.fd*p*a.v*.24;a.mp=p;return}a.fd=0}
    if(sg&&sg===a.ss)a.sn++;else{a.sn=sg?1:0;a.ss=sg;if(sg)a.sl=3+Math.floor(rf()*5)}
    if(a.ss&&a.sn>=a.sl){a.pbT=45+Math.floor(rf()*20);a.pbD=-a.ss*p*a.v*.18;a.fd=a.ss;a.sn=0;a.ss=0}}
  a.mp=p}
function nextP(a,p,s,t){
  const rf=a.rng||Math.random;
  if(s<1)return p+p*a.v*a.vm*(a.otc?.6:.4)*rnd2(rf)*2;
  if(t===undefined)t=Math.floor(Date.now()/1000);
  if(t%60===0)minuteEnd(a,p);
  if(!a.mode||a.age>=a.until)newRegime(a,p);
  a.age+=1;
  const u=p*a.v*sessVol(t);
  a.vm+=(a.vT-a.vm)*.004;
  if(rf()<.0018)a.vm=Math.min(2.6,a.vm*(1.5+rf()*.7));
  if(rf()<.0018)a.vm=Math.max(.55,a.vm*.65);
  a.tr=a.tr*.97+rnd2(rf)*.1;
  let q=p+u*a.vm*(a.mode==="sq"?.5:1)*(a.pbT>0?.5:1)*rnd2(rf)*2;
  if(rf()<.005)q+=(rf()<.5?-1:1)*u*a.vm*(2.5+rf()*4);
  if(a.pbT>0){a.pbT-=1;q+=a.pbD}
  if(a.rev){q+=a.rev*.6;a.rev*=.35;if(Math.abs(a.rev)<u*.2)a.rev=0}
  else if(rf()<a.sw){const z=(rf()<.5?-1:1)*u*a.vm*(2.5+rf()*4.5);q+=z;a.rev=-z*.85}
  q-=a.ld*a.ar;
  if(a.mode==="up"||a.mode==="down"){
    /* impulse / pullback waves inside a trend */
    if(a.wv>0){a.wv-=1;if(a.wv<=0&&rf()<(a.otc?.7:.6))a.pb=8+Math.floor(rf()*20)}
    else if(a.pb===0)a.wv=25+Math.floor(rf()*70);
    if(a.pb>0)a.pb-=1;
    let drift=a.dr*(a.imp>0?2.5:1);
    if(a.rts>0){a.rts-=1;drift*=.25}
    if(a.pb>0)drift=-drift*.55;
    q+=(a.pbT>0?0:drift)+u*a.tr*.6*a.tw;a.imp-=1}
  else{
    const hi=a.hi,lo=a.lo;
    /* wandering midpoint: zigzag drift inside the range */
    a.mid2+=a.mv;
    if(a.mid2>lo+(hi-lo)*.75)a.mv=-Math.abs(a.mv);
    else if(a.mid2<lo+(hi-lo)*.25)a.mv=Math.abs(a.mv);
    q+=(a.mid2-q)*.004+((hi+lo)/2-q)*.0012+u*a.tr*.5*a.tw;
    if(a.pc>0){a.pc-=1;if(q>hi)q-=(q-hi)*.3;else if(q<lo)q+=(lo-q)*.3}
    else if(q>hi){if(rf()<a.wp)a.pc=10;else q=hi-(q-hi)*.7}
    else if(q<lo){if(rf()<a.wp)a.pc=10;else q=lo+(lo-q)*.7}}
  a.ld=q-p;return q}
let ver=0;function applyGap(a,p){const rf=a.rng||Math.random;const j=(rf()<.5?-1:1)*p*a.v*7.7*(.6+rf()*1.0);if(a.mode==="range"||a.mode==="sq"){a.lo+=j;a.hi+=j;a.mid2+=j}return p+j}
const ticks={},HN=10800;
function ensure(k){if(ticks[k])return;const a=assets[k],now=Math.floor(Date.now()/1000);let p=a.p;const arr=[];
  for(let i=HN;i>=0;i--){p=nextP(a,p,1,now-i);if((now-i)%60===0&&rngf()<a.gp)p=applyGap(a,p);arr.push({t:now-i,p})}ticks[k]=arr}
function backfill(k){const arr=ticks[k],a=assets[k],n=14400,t0=arr[0].t,tmp=Object.assign({},a,{mode:"",age:0,until:0,tr:0,vm:1,ld:0,rev:0,pc:0,imp:0,vT:1,wv:0,pb:0,rts:0,mid2:0,mv:0});let p=arr[0].p;const ch=[];
  for(let i=0;i<n;i++){p=nextP(tmp,p,1,t0-n+i);if((t0-n+i)%60===0&&rngf()<a.gp)p=applyGap(tmp,p);ch.push({t:t0-n+i,p})}
  const sh=arr[0].p-ch[n-1].p;ch.forEach(x=>{x.p+=sh});ticks[k]=ch.concat(arr);ver++}
function advance(){const now=Math.floor(Date.now()/1000);
  for(const k in ticks){const a=assets[k],arr=ticks[k];let last=arr[arr.length-1],pushed=false;
    if(now-last.t>7200)last={t:now-7200,p:last.p};
    while(last.t<now){const t1=last.t+1;let np=nextP(a,last.p,1,t1);if(t1%60===0&&rngf()<a.gp)np=applyGap(a,np);last={t:t1,p:np};arr.push(last);pushed=true}
    if(!pushed)last.p=nextP(a,last.p,.5);
    if(arr.length>100000)arr.splice(0,arr.length-100000)}ver++}
function candlesFor(k){ensure(k);const out=[],a=assets[k];let b=-1,c=null;
  for(const x of ticks[k]){const bk=Math.floor(x.t/tf);
    if(bk!==b){b=bk;const o=(c&&Math.abs(x.p-c.c)<x.p*a.v*4)?c.c:x.p;c={t:bk*tf,o,h:Math.max(o,x.p),l:Math.min(o,x.p),c:x.p};out.push(c)}
    else{if(x.p>c.h)c.h=x.p;if(x.p<c.l)c.l=x.p;c.c=x.p}}
  return out}
function price(k){k=k||cur;ensure(k);const a=ticks[k];return a[a.length-1].p}
function toHA(cs){const o=[];let po=0,pc=0;cs.forEach((c,i)=>{const hc=(c.o+c.h+c.l+c.c)/4,ho=i?(po+pc)/2:(c.o+c.c)/2;po=ho;pc=hc;o.push({t:c.t,o:ho,c:hc,h:Math.max(c.h,ho,hc),l:Math.min(c.l,ho,hc)})});return o}
/* indicators */
function ema(c,n){const k=2/(n+1),o=[];let e=c[0];for(let i=0;i<c.length;i++){e=i?c[i]*k+e*(1-k):c[0];o.push(e)}return o}
function sma(c,n){const o=[];let s=0;for(let i=0;i<c.length;i++){s+=c[i];if(i>=n)s-=c[i-n];o.push(i>=n-1?s/n:null)}return o}
function boll(c,n,m){const mid=sma(c,n),up=[],lw=[];for(let i=0;i<c.length;i++){if(mid[i]==null){up.push(null);lw.push(null);continue}let v=0;for(let j=i-n+1;j<=i;j++)v+=(c[j]-mid[i])*(c[j]-mid[i]);const sd=Math.sqrt(v/n);up.push(mid[i]+m*sd);lw.push(mid[i]-m*sd)}return{mid,up,lw}}
function rsi(c,n){const o=[null];let ag=0,al=0;for(let i=1;i<c.length;i++){const d=c[i]-c[i-1],g=Math.max(d,0),l=Math.max(-d,0);if(i<=n){ag+=g/n;al+=l/n;o.push(i===n?(al===0?100:100-100/(1+ag/al)):null)}else{ag=(ag*(n-1)+g)/n;al=(al*(n-1)+l)/n;o.push(al===0?100:100-100/(1+ag/al))}}return o}
/* candlestick patterns */
const PN={dj:["Dj","Doji",0],ha:["H","Hammer",1],hm:["HM","Hanging Man",-1],ih:["IH","Inverted Hammer",1],ss:["SS","Shooting Star",-1],be:["BE","Bullish Engulfing",1],bre:["BE","Bearish Engulfing",-1],pl:["PL","Piercing Line",1],dc:["DC","Dark Cloud Cover",-1],bh:["Hr","Bullish Harami",1],brh:["Hr","Bearish Harami",-1],ms:["MS","Morning Star",1],es:["ES","Evening Star",-1],tws:["3W","Three White Soldiers",1],tbc:["3B","Three Black Crows",-1],mzu:["Mz","Bullish Marubozu",1],mzd:["Mz","Bearish Marubozu",-1],tt:["TT","Tweezer Top",-1],tb:["TB","Tweezer Bottom",1]};
function detect(cs,i,avg){
  const c=cs[i],b=cs[i-1],a=cs[i-2];
  const bd=x=>Math.abs(x.c-x.o),up=x=>x.c>x.o,dn=x=>x.c<x.o,mx=x=>Math.max(x.o,x.c),mn=x=>Math.min(x.o,x.c);
  const tr=cs[i-1].c-cs[i-6].c,dT=tr<-avg*.8,uT=tr>avg*.8;
  const B=bd(c),R=c.h-c.l,U=c.h-mx(c),L=mn(c)-c.l;
  if(R<=0)return null;
  if(dn(a)&&bd(a)>avg*.5&&bd(b)<bd(a)*.4&&up(c)&&c.c>(a.o+a.c)/2&&dT)return"ms";
  if(up(a)&&bd(a)>avg*.5&&bd(b)<bd(a)*.4&&dn(c)&&c.c<(a.o+a.c)/2&&uT)return"es";
  if(up(a)&&up(b)&&up(c)&&b.c>a.c&&c.c>b.c&&bd(a)>avg*.4&&bd(b)>avg*.4&&B>avg*.4&&b.o>a.o&&b.o<a.c&&c.o>b.o&&c.o<b.c)return"tws";
  if(dn(a)&&dn(b)&&dn(c)&&b.c<a.c&&c.c<b.c&&bd(a)>avg*.4&&bd(b)>avg*.4&&B>avg*.4&&b.o<a.o&&b.o>a.c&&c.o<b.o&&c.o>b.c)return"tbc";
  if(dn(b)&&up(c)&&c.o<=b.c&&c.c>=b.o&&B>bd(b)&&dT)return"be";
  if(up(b)&&dn(c)&&c.o>=b.c&&c.c<=b.o&&B>bd(b)&&uT)return"bre";
  if(dn(b)&&bd(b)>avg*.6&&up(c)&&c.o<b.c&&c.c>(b.o+b.c)/2&&c.c<b.o&&dT)return"pl";
  if(up(b)&&bd(b)>avg*.6&&dn(c)&&c.o>b.c&&c.c<(b.o+b.c)/2&&c.c>b.o&&uT)return"dc";
  if(dn(b)&&bd(b)>avg*.6&&up(c)&&mx(c)<mx(b)&&mn(c)>mn(b)&&B<bd(b)*.5&&dT)return"bh";
  if(up(b)&&bd(b)>avg*.6&&dn(c)&&mx(c)<mx(b)&&mn(c)>mn(b)&&B<bd(b)*.5&&uT)return"brh";
  if(uT&&up(b)&&dn(c)&&Math.abs(b.h-c.h)<avg*.08&&R>avg*.5)return"tt";
  if(dT&&dn(b)&&up(c)&&Math.abs(b.l-c.l)<avg*.08&&R>avg*.5)return"tb";
  if(B<=R*.1&&R>avg*.7)return"dj";
  if(B>0&&L>=B*2&&U<=B*.5&&R>avg*.6)return dT?"ha":uT?"hm":null;
  if(B>0&&U>=B*2&&L<=B*.5&&R>avg*.6)return dT?"ih":uT?"ss":null;
  if(B>=R*.92&&R>avg*1.6)return up(c)?"mzu":"mzd";
  return null}
function scan(cs,from,to){const out=[];for(let i=Math.max(16,from);i<=to;i++){let s=0;for(let j=i-14;j<i;j++)s+=cs[j].h-cs[j].l;const k=detect(cs,i,s/14);if(k)out.push({i,k})}return out}
/* support / resistance from swing pivots */
function levels(cs,end){const from=Math.max(0,end-400),pts=[];let s=0,cnt=0;
  for(let i=Math.max(from,end-50);i<end;i++){s+=cs[i].h-cs[i].l;cnt++}
  const tol=(s/Math.max(1,cnt))*.7;
  for(let i=from+3;i<end-3;i++){let ph=true,pl=true;
    for(let j=1;j<=3;j++){if(cs[i].h<=cs[i-j].h||cs[i].h<=cs[i+j].h)ph=false;if(cs[i].l>=cs[i-j].l||cs[i].l>=cs[i+j].l)pl=false}
    if(ph)pts.push(cs[i].h);if(pl)pts.push(cs[i].l)}
  pts.sort((x,y)=>x-y);const cl=[];
  pts.forEach(p=>{const g=cl[cl.length-1];if(g&&p-g.m<=tol){g.n++;g.m=(g.m*(g.n-1)+p)/g.n}else cl.push({m:p,n:1})});
  return cl.filter(g=>g.n>=2)}
/* ===== indicators ===== */
const CL=r=>r.map(c=>c.c),HI=r=>r.map(c=>c.h),LO=r=>r.map(c=>c.l),MD=r=>r.map(c=>(c.h+c.l)/2);
function smma(a,n){const o=[];let s=null;for(let i=0;i<a.length;i++){if(i<n-1){o.push(null);continue}if(s===null){let t=0;for(let j=i-n+1;j<=i;j++)t+=a[j];s=t/n}else s=(s*(n-1)+a[i])/n;o.push(s)}return o}
function shiftA(a,k){const o=new Array(a.length).fill(null);for(let i=k;i<a.length;i++)o[i]=a[i-k];return o}
function smaN(a,n){const o=[];for(let i=0;i<a.length;i++){let s=0,ok=i>=n-1;if(ok)for(let j=i-n+1;j<=i;j++){if(a[j]==null){ok=false;break}s+=a[j]}o.push(ok?s/n:null)}return o}
function trArr(r){return r.map((c,i)=>i?Math.max(c.h-c.l,Math.abs(c.h-r[i-1].c),Math.abs(c.l-r[i-1].c)):c.h-c.l)}
function atr(r,n){return smma(trArr(r),n)}
function hhA(a,n,i){let m=-Infinity;for(let j=Math.max(0,i-n+1);j<=i;j++)if(a[j]>m)m=a[j];return m}
function llA(a,n,i){let m=Infinity;for(let j=Math.max(0,i-n+1);j<=i;j++)if(a[j]<m)m=a[j];return m}
function supertrend(r,n,m){const a=atr(r,n),line=[],col=[];let fu=0,fl=0,tr=1;
  for(let i=0;i<r.length;i++){if(a[i]==null){line.push(null);col.push(0);continue}
    const hl=(r[i].h+r[i].l)/2,bu=hl+m*a[i],bl=hl-m*a[i];
    if(i===0||line[i-1]==null){fu=bu;fl=bl;tr=1}
    else{fu=(bu<fu||r[i-1].c>fu)?bu:fu;fl=(bl>fl||r[i-1].c<fl)?bl:fl;if(tr===1&&r[i].c<fl)tr=-1;else if(tr===-1&&r[i].c>fu)tr=1}
    line.push(tr===1?fl:fu);col.push(tr)}
  return{line,col}}
function psar(r){const st=.02,mx=.2,o=[null];let up=true,af=st,ep=r[0].h,sar=r[0].l;
  for(let i=1;i<r.length;i++){sar=sar+af*(ep-sar);
    if(up){sar=Math.min(sar,r[i-1].l,i>1?r[i-2].l:r[i-1].l);if(r[i].l<sar){up=false;sar=ep;ep=r[i].l;af=st}else if(r[i].h>ep){ep=r[i].h;af=Math.min(af+st,mx)}}
    else{sar=Math.max(sar,r[i-1].h,i>1?r[i-2].h:r[i-1].h);if(r[i].h>sar){up=true;sar=ep;ep=r[i].h;af=st}else if(r[i].l<ep){ep=r[i].l;af=Math.min(af+st,mx)}}
    o.push(sar)}
  return o}
function zigzag(r){const a=atr(r,14),pts=[];let dir=0,hi=r[0].h,hiI=0,lo=r[0].l,loI=0;
  for(let i=1;i<r.length;i++){const th=(a[i]||0)*2.5;if(!th)continue;
    if(r[i].h>hi&&dir>=0){hi=r[i].h;hiI=i}if(r[i].l<lo&&dir<=0){lo=r[i].l;loI=i}
    if(dir>=0&&hi-r[i].l>th&&hiI!==i){pts.push({i:hiI,p:hi});dir=-1;lo=r[i].l;loI=i}
    else if(dir<=0&&r[i].h-lo>th&&loI!==i){pts.push({i:loI,p:lo});dir=1;hi=r[i].h;hiI=i}}
  if(pts.length)pts.push(dir>0?{i:hiI,p:hi}:{i:loI,p:lo});return pts}
function macdA(c){const e1=ema(c,12),e2=ema(c,26),m=e1.map((v,i)=>v-e2[i]),s=ema(m,9);return{m,s,h:m.map((v,i)=>v-s[i])}}
function ndiff(a,b){return a.map((v,i)=>v==null||b[i]==null?null:v-b[i])}
function adxA(r){const n=14,pdm=[0],mdm=[0],tr=trArr(r);for(let i=1;i<r.length;i++){const up=r[i].h-r[i-1].h,dn=r[i-1].l-r[i].l;pdm.push(up>dn&&up>0?up:0);mdm.push(dn>up&&dn>0?dn:0)}
  const st=smma(tr,n),sp=smma(pdm,n),sm=smma(mdm,n),pdi=[],mdi=[],dx=[];
  for(let i=0;i<r.length;i++){if(st[i]==null||!st[i]){pdi.push(null);mdi.push(null);dx.push(null);continue}const p=100*sp[i]/st[i],m=100*sm[i]/st[i];pdi.push(p);mdi.push(m);dx.push(p+m?100*Math.abs(p-m)/(p+m):0)}
  const adx=new Array(r.length).fill(null);let s=null,k=0,acc=0;for(let i=0;i<r.length;i++){if(dx[i]==null)continue;if(s===null){acc+=dx[i];k++;if(k===n){s=acc/n;adx[i]=s}}else{s=(s*(n-1)+dx[i])/n;adx[i]=s}}
  return{adx,pdi,mdi}}
const IND={
 ma:["Moving Average (SMA 50)","o",r=>({lines:[{a:sma(CL(r),50),c:"#c58cd9"}]})],
 ema:["EMA 20","o",r=>({lines:[{a:ema(CL(r),20),c:"#e8d28a"}]})],
 bb:["Bollinger Bands","o",r=>{const b=boll(CL(r),20,2);return{lines:[{a:b.up,c:"#8aa6d6"},{a:b.lw,c:"#8aa6d6"},{a:b.mid,c:"#8aa6d6",dash:1}]}}],
 env:["Envelopes","o",r=>{const m=sma(CL(r),14);return{lines:[{a:m.map(v=>v&&v*1.0008),c:"#6fd0c4"},{a:m.map(v=>v&&v*.9992),c:"#6fd0c4"},{a:m,c:"#6fd0c4",dash:1}]}}],
 don:["Donchian channel","o",r=>{const H=HI(r),L=LO(r),u=r.map((_,i)=>i>=19?hhA(H,20,i):null),l=r.map((_,i)=>i>=19?llA(L,20,i):null);return{lines:[{a:u,c:"#e0a458"},{a:l,c:"#e0a458"},{a:u.map((v,i)=>v==null?null:(v+l[i])/2),c:"#e0a458",dash:1}]}}],
 kel:["Keltner channel","o",r=>{const m=ema(CL(r),20),a=atr(r,10);return{lines:[{a:m.map((v,i)=>a[i]==null?null:v+2*a[i]),c:"#b69cf0"},{a:m.map((v,i)=>a[i]==null?null:v-2*a[i]),c:"#b69cf0"},{a:m.map((v,i)=>a[i]==null?null:v),c:"#b69cf0",dash:1}]}}],
 sup:["Supertrend","o",r=>{const s=supertrend(r,10,3);return{lines:[{a:s.line,col:s.col,c:"#2fbf71",c2:"#e5533d"}]}}],
 sar:["Parabolic SAR","o",r=>({dots:psar(r)})],
 all:["Alligator","o",r=>{const m=MD(r);return{lines:[{a:shiftA(smma(m,13),8),c:"#4a7bd8"},{a:shiftA(smma(m,8),5),c:"#e5533d"},{a:shiftA(smma(m,5),3),c:"#2fbf71"}]}}],
 fra:["Fractal","o",r=>{const m=[];for(let i=2;i<r.length-2;i++){let up=true,dn=true;for(let j=1;j<=2;j++){if(r[i].h<=r[i-j].h||r[i].h<=r[i+j].h)up=false;if(r[i].l>=r[i-j].l||r[i].l>=r[i+j].l)dn=false}if(up)m.push({i,p:r[i].h,up:1});if(dn)m.push({i,p:r[i].l,up:0})}return{marks:m}}],
 ich:["Ichimoku Cloud","o",r=>{const H=HI(r),L=LO(r),mid=(n,i)=>i>=n-1?(hhA(H,n,i)+llA(L,n,i))/2:null,t=r.map((_,i)=>mid(9,i)),k=r.map((_,i)=>mid(26,i)),sa=t.map((v,i)=>v!=null&&k[i]!=null?(v+k[i])/2:null),sb=r.map((_,i)=>mid(52,i));return{lines:[{a:t,c:"#4a9fe0"},{a:k,c:"#e5533d"}],cloud:{a:shiftA(sa,26),b:shiftA(sb,26)}}}],
 zig:["Zig Zag","o",r=>({zig:zigzag(r)})],
 rsi:["RSI 14","p",r=>({lines:[{a:rsi(CL(r),14),c:"#d9a441"}],fixed:[0,100],lv:[30,70]})],
 macd:["MACD","p",r=>{const m=macdA(CL(r));return{lines:[{a:m.m,c:"#4a9fe0"},{a:m.s,c:"#e5533d"}],hist:m.h}}],
 sto:["Stochastic","p",r=>{const H=HI(r),L=LO(r),raw=r.map((c,i)=>{if(i<13)return null;const h=hhA(H,14,i),l=llA(L,14,i);return h===l?50:(c.c-l)/(h-l)*100}),k=smaN(raw,3);return{lines:[{a:k,c:"#4a9fe0"},{a:smaN(k,3),c:"#e5533d"}],fixed:[0,100],lv:[20,80]}}],
 cci:["CCI","p",r=>{const tp=r.map(c=>(c.h+c.l+c.c)/3),m=sma(tp,20),o=tp.map((v,i)=>{if(m[i]==null)return null;let d=0;for(let j=i-19;j<=i;j++)d+=Math.abs(tp[j]-m[i]);d/=20;return d?(v-m[i])/(.015*d):0});return{lines:[{a:o,c:"#d9a441"}],lv:[-100,100]}}],
 atr:["ATR","p",r=>({lines:[{a:atr(r,14),c:"#d9a441"}]})],
 mom:["Momentum","p",r=>{const c=CL(r);return{lines:[{a:c.map((v,i)=>i>=10?v-c[i-10]:null),c:"#d9a441"}],lv:[0]}}],
 ao:["Awesome Oscillator","p",r=>{const m=MD(r);return{hist:ndiff(sma(m,5),sma(m,34))}}],
 bull:["Bulls power","p",r=>{const e=ema(CL(r),13);return{hist:r.map((c,i)=>i>=12?c.h-e[i]:null)}}],
 bear:["Bears power","p",r=>{const e=ema(CL(r),13);return{hist:r.map((c,i)=>i>=12?c.l-e[i]:null)}}],
 dem:["DeMarker","p",r=>{const mx=r.map((c,i)=>i?Math.max(c.h-r[i-1].h,0):0),mn=r.map((c,i)=>i?Math.max(r[i-1].l-c.l,0):0),a=sma(mx,14),b=sma(mn,14);return{lines:[{a:a.map((v,i)=>v==null?null:(v+b[i]?v/(v+b[i]):.5)),c:"#d9a441"}],fixed:[0,1],lv:[.3,.7]}}],
 adx:["ADX","p",r=>{const x=adxA(r);return{lines:[{a:x.adx,c:"#d9a441"},{a:x.pdi,c:"#2fbf71"},{a:x.mdi,c:"#e5533d"}],lv:[25]}}],
 aro:["Aroon","p",r=>{const H=HI(r),L=LO(r),u=[],d=[];for(let i=0;i<r.length;i++){if(i<14){u.push(null);d.push(null);continue}let hi=-Infinity,lo=Infinity,hk=0,lk=0;for(let j=i-14;j<=i;j++){if(H[j]>=hi){hi=H[j];hk=i-j}if(L[j]<=lo){lo=L[j];lk=i-j}}u.push(100*(14-hk)/14);d.push(100*(14-lk)/14)}return{lines:[{a:u,c:"#2fbf71"},{a:d,c:"#e5533d"}],fixed:[0,100],lv:[50]}}]
};

return{list,assets,ticks,candlesFor,price,levels,scan,PN,IND,rsi,ema,sma,atr,nextP,applyGap,setTf:function(v){tf=v}}
})();