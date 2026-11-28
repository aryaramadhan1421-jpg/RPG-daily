/* V8.4 — Permanent monthly history. No expiry, no automatic deletion.
   Archive and active history are part of the same game-state transaction. */
(function(){'use strict';
const dateRE=/^\d{4}-\d{2}-\d{2}$/;
const monthRE=/^\d{4}-\d{2}$/;
const marker='{"systemRpgNativeState":1}';
let blocked=false,warned=false;
function dateOf(e,kind){return kind==='logs'?e?.dateStr:e?.date;}
function months(s){return s?.history?.permanentArchive?.months||{};}
function validArchive(s){const a=s?.history?.permanentArchive;if(a==null)return true;return !!(a.version===1&&a.months&&typeof a.months==='object'&&!Array.isArray(a.months)&&Object.entries(a.months).every(([m,b])=>monthRE.test(m)&&b&&Array.isArray(b.logs)&&Array.isArray(b.growthEvents)));}
function archive(s,day){
 if(!s?.history||!dateRE.test(day||''))return;
 const h=s.history;
 if(!h.permanentArchive)h.permanentArchive={version:1,months:{}};
 const a=h.permanentArchive;if(!validArchive(s))throw Error('Unsupported history archive');
 const current=day.slice(0,7);
 for(const kind of ['logs','growthEvents']){
  if(!Array.isArray(h[kind]))continue;
  const keep=[],grouped=new Map();
  for(const e of h[kind]){const d=dateOf(e,kind),m=dateRE.test(d||'')?d.slice(0,7):null;
   if(!m||m>=current){keep.push(e);continue;}
   if(!grouped.has(m))grouped.set(m,[]);grouped.get(m).push(e);
  }
  for(const [m,items] of grouped){const b=a.months[m]||(a.months[m]={logs:[],growthEvents:[]});
   if(!Array.isArray(b[kind]))throw Error('Invalid history archive month');
   // Retain every record, even if an older save contains repeated identifiers.
   b[kind]=kind==='logs'?[...items,...b[kind]]:[...b[kind],...items];
  }
  if(grouped.size)h[kind]=keep;
 }
}
function keys(s){return Object.keys(months(s)).filter(m=>monthRE.test(m)).sort();}
function arrays(s,kind,month){const h=s?.history||{},a=months(s),k=keys(s);const active=Array.isArray(h[kind])?h[kind]:[];
 const archived=(kind==='logs'?k.reverse():k).filter(m=>!month||m===month).map(m=>a[m]?.[kind]).filter(Array.isArray);
 return kind==='logs'?[active,...archived]:[...archived,active];
}
function records(s,kind,month){return arrays(s,kind,month).flat().filter(e=>!month||String(dateOf(e,kind)||'').slice(0,7)===month);}
function onDate(s,kind,day){return records(s,kind,String(day).slice(0,7)).filter(e=>dateOf(e,kind)===day);}
function count(s,kind){return arrays(s,kind).reduce((n,a)=>n+a.length,0);}
function findLog(s,predicate){for(const a of arrays(s,'logs')){const i=a.findIndex(predicate);if(i!==-1)return {array:a,index:i,entry:a[i]};}return null;}
function listMonths(s){return [...new Set([...keys(s),...(s?.history?.logs||[]).map(e=>String(e?.dateStr||'').slice(0,7)),...(s?.history?.journals||[]).map(e=>String(e?.dateStr||'').slice(0,7))])].filter(m=>monthRE.test(m)).sort().reverse();}
function validRaw(raw){if(typeof raw!=='string'||!raw)return false;try{const s=JSON.parse(raw);return !!(s?.player&&typeof s.player==='object'&&Array.isArray(s.quests)&&s.quests.every(q=>q&&typeof q==='object'&&q.id!=null)&&validArchive(s));}catch(_){return false;}}
function notice(e){console.error('SYSTEM RPG storage:',e);if(warned)return;warned=true;setTimeout(()=>{try{let lang=localStorage.getItem('system_rpg_lang');alert(lang==='ja'?'保存に失敗しました。データを消去せず、空き容量とバックアップを確認してください。':lang==='en'?'Save failed. Do not clear app data. Check storage and your backup.':'Penyimpanan gagal. Jangan hapus data aplikasi. Periksa kapasitas dan backup.');}catch(_){}},0);}
function protect(e){blocked=true;notice(e);}
function read(key){const raw=localStorage.getItem(key);if(raw!==marker)return raw;
 try{const full=window.AndroidBridge?.loadLargeState?.();if(!validRaw(full))throw Error('Native state unavailable');return full;}catch(e){protect(e);throw e;}}
function nativeWrite(raw){if(window.AndroidBridge?.saveLargeState?.(raw)!==true)throw Error('Native storage commit failed');}
function write(key,raw,restore=false){if(blocked&&!restore)throw Error('Storage locked to protect existing save');if(typeof raw!=='string'||!raw||(restore&&!validRaw(raw)))throw Error('Invalid game state');
 const old=localStorage.getItem(key);
 if(old===marker){nativeWrite(raw);blocked=false;warned=false;return 'native';}
 try{localStorage.setItem(key,raw);blocked=false;warned=false;return 'local';}
 catch(e){if(!window.AndroidBridge?.saveLargeState)throw e;
  // Write the full state atomically first. A failed pointer write leaves the prior local state intact.
  nativeWrite(raw);localStorage.setItem(key,marker);blocked=false;warned=false;return 'native';}
}
window.V84History={archive,records,onDate,count,findLog,listMonths,read,write,notice,protect,validRaw,marker,isBlocked:()=>blocked};
})();
