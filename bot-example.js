// Example Telegram bot for the Hunter Broker price API. Zero dependencies. Node 18+.
// Run:  BOT_TOKEN=123:abc API_URL=https://your-server.com API_KEY=yourkey node bot-example.js
// IMPORTANT: the feed is SIMULATED. The "demo signal" below is a toy rule for practice and testing,
// it has no ability to predict real markets (including Quotex). Do not present it as real trading advice.
const TOKEN=process.env.BOT_TOKEN,API=(process.env.API_URL||"http://localhost:8080").replace(/\/+$/,""),KEY=process.env.API_KEY||"";
if(!TOKEN){console.error("Set BOT_TOKEN (from @BotFather)");process.exit(1)}
const TG="https://api.telegram.org/bot"+TOKEN,NOTE="\n\n(Simulated demo feed, not real market data or advice.)";
const api=async p=>{const r=await fetch(API+p,{headers:KEY?{"x-api-key":KEY}:{}});if(!r.ok)throw new Error("API "+r.status);return r.json()};
const tg=(m,b)=>fetch(TG+"/"+m,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(b)}).then(r=>r.json());
const norm=s=>s.toLowerCase().replace(/[^a-z0-9]/g,"");
let pairs=[];
async function loadPairs(){pairs=(await api("/api/pairs")).pairs.map(p=>p.n)}
function parse(text){const t=text.trim().split(/\s+/).slice(1);let tf=60;const last=t[t.length-1]||"";const m=last.match(/^(\d+)([smh])$/i);
  if(m){tf=+m[1]*({s:1,m:60,h:3600}[m[2].toLowerCase()]);t.pop()}
  const want=norm(t.join(""));const pair=pairs.find(p=>norm(p)===want)||pairs.find(p=>norm(p)===want+"otc");return{pair,tf}}
function demoSignal(a){let score=0;const why=[];
  if(a.rsi14<30){score++;why.push("RSI "+a.rsi14+" (oversold)")}if(a.rsi14>70){score--;why.push("RSI "+a.rsi14+" (overbought)")}
  if(a.price>a.ema20&&a.ema20>a.ema50){score++;why.push("price above EMA20 above EMA50")}if(a.price<a.ema20&&a.ema20<a.ema50){score--;why.push("price below EMA20 below EMA50")}
  const p=a.patterns[0];if(p&&p.candlesAgo<=1){if(p.bias==="bullish"){score++;why.push(p.pattern)}if(p.bias==="bearish"){score--;why.push(p.pattern)}}
  return{side:score>=2?"CALL (up)":score<=-2?"PUT (down)":"NO TRADE",why}}
async function handle(msg){const text=msg.text||"",chat=msg.chat.id,cmd=text.split(/[\s@]/)[0].toLowerCase();
  const say=t=>tg("sendMessage",{chat_id:chat,text:t});
  try{
  if(cmd==="/start"||cmd==="/help")return say("Hunter Broker demo bot\n/pairs\n/price EURUSD\n/candles EURUSD 1m\n/analysis USDIDR 1m\n/signal EURUSD 1m (toy demo rule)"+NOTE);
  if(cmd==="/pairs"){await loadPairs();return say(pairs.join(", "))}
  const {pair,tf}=parse(text);if(!pair)return say("Pair not found. Try /pairs");
  if(cmd==="/price"){const r=await api("/api/price?pair="+encodeURIComponent(pair));return say(pair+": "+r.price+NOTE)}
  if(cmd==="/candles"){const r=await api("/api/candles?pair="+encodeURIComponent(pair)+"&tf="+tf+"&limit=5");return say(pair+" "+tf+"s\n"+r.candles.map(c=>`${new Date(c.t*1000).toISOString().slice(11,19)} O${c.o} H${c.h} L${c.l} C${c.c}`).join("\n")+NOTE)}
  if(cmd==="/analysis"){const a=await api("/api/analysis?pair="+encodeURIComponent(pair)+"&tf="+tf);if(a.error)return say(a.error);return say(`${pair} ${tf}s\nprice ${a.price}\nRSI14 ${a.rsi14}\nEMA20 ${a.ema20}  EMA50 ${a.ema50}\nATR14 ${a.atr14}\nPatterns: ${a.patterns.map(p=>p.pattern+" ("+p.candlesAgo+" ago)").join(", ")||"none"}\nResistance: ${a.resistance.map(x=>x.price).join(", ")||"-"}\nSupport: ${a.support.map(x=>x.price).join(", ")||"-"}`+NOTE)}
  if(cmd==="/signal"){const a=await api("/api/analysis?pair="+encodeURIComponent(pair)+"&tf="+tf);if(a.error)return say(a.error);const s=demoSignal(a);return say(`${pair} ${tf}s: ${s.side}\n${s.why.join("; ")||"no confirming conditions"}`+NOTE)}
  }catch(e){return say("Error: "+e.message)}}
(async()=>{await loadPairs();console.log("Bot running. Pairs:",pairs.length);let off=0;
  for(;;){try{const r=await tg("getUpdates",{offset:off,timeout:30});for(const u of r.result||[]){off=u.update_id+1;if(u.message&&u.message.text&&u.message.text.startsWith("/"))handle(u.message)}}catch(e){await new Promise(r=>setTimeout(r,3000))}}})();
