/* SYSTEM RPG — Growth Experience. Presentation, record of genuine level events.
   No changes to XP, passive effects, currency, Quest, rank thresholds or Raid. */
(function(){
'use strict';
const STATS=['STR','INT','WIS','CHR'];
const COLORS={STR:'#fb7185',INT:'#22d3ee',WIS:'#c084fc',CHR:'#fbbf24'};
const MILESTONES=[10,20,30,50];
const T={
 id:{section:'⚔️ Perkembangan Hunter',next:'Target Berikutnya',level:'Hunter Level',remaining:'XP lagi',streak:'Milestone Streak',days:'hari',attribute:'Perkembangan Atribut',gallery:'Galeri Pencapaian',earned:'Terbuka',locked:'Belum terbuka',rank:'Rank',new:'Pencapaian baru',continue:'Lanjutkan',statUp:'ATRIBUT MENINGKAT',growth:'Riwayat Perkembangan',none:'Belum ada kenaikan level tercatat sejak update ini.',hp:'Max HP',xp:'EXP Berikutnya',passive:'Efek pasif sekarang',from:'Dari',to:'menjadi',rankAwaken:'RANK AWAKENING',perfect:'Pencapaian tersimpan sebagai progres, bukan hadiah tambahan.',lvAch:'Hunter Lv.',statAch:'Lv. Atribut',close:'Tutup'},
 en:{section:'⚔️ Hunter Growth',next:'Next Milestone',level:'Hunter Level',remaining:'XP remaining',streak:'Streak Milestone',days:'days',attribute:'Attribute Growth',gallery:'Achievement Gallery',earned:'Unlocked',locked:'Locked',rank:'Rank',new:'New achievement',continue:'Continue',statUp:'ATTRIBUTE LEVEL UP',growth:'Growth History',none:'No level-up events recorded since this update.',hp:'Max HP',xp:'Next EXP Target',passive:'Current passive effect',from:'From',to:'to',rankAwaken:'RANK AWAKENING',perfect:'Achievement saved as progress, not an extra reward.',lvAch:'Hunter Lv.',statAch:'Attribute Lv.',close:'Close'},
 ja:{section:'⚔️ ハンターの成長',next:'次の目標',level:'ハンターレベル',remaining:'残りXP',streak:'連続記録の節目',days:'日',attribute:'能力の成長',gallery:'実績ギャラリー',earned:'解除済み',locked:'未解除',rank:'ランク',new:'新たな実績',continue:'続ける',statUp:'能力レベルアップ',growth:'成長の記録',none:'この更新以降のレベルアップ記録はありません。',hp:'最大HP',xp:'次の必要EXP',passive:'現在のパッシブ効果',from:'前',to:'後',rankAwaken:'ランク覚醒',perfect:'実績は記録のみで、追加報酬はありません。',lvAch:'ハンターLv.',statAch:'能力Lv.',close:'閉じる'}
};
function lang(){try {const l=(typeof v6UiLang==='function'?v6UiLang(): (window.gameState?.language||document.documentElement.lang||'id'));return T[l]?l:'id';}catch(_){return 'id';}}
function t(k){return T[lang()][k]||T.id[k]||k;}
function esc(x){return String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function player(){return typeof gameState!=='undefined'&&gameState&&gameState.player?gameState.player:null;}
function history(){if(typeof gameState==='undefined'||!gameState)return null;if(!gameState.history||typeof gameState.history!=='object')gameState.history={};if(!Array.isArray(gameState.history.growthEvents))gameState.history.growthEvents=[];return gameState.history.growthEvents;}
function rank(p){try{return getPlayerRank(p.level,p.stats).rankCode||getPlayerRank(p.level,p.stats).title||'E';}catch(_){return 'E';}}
function snapshot(p){if(!p)return null;return {level:Number(p.level)||1,xp:Number(p.xp)||0,maxHp:Number(p.maxHp)||100,stats:Object.fromEntries(STATS.map(k=>[k,Number(p.stats?.[k])||1])),rank:rank(p)};}
function at(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
let latest=null;
function capture(a,b){
 if(!a||!b)return null;
 const log=history();if(!log)return null;
 const changes=[];
 if(b.level>a.level)changes.push({type:'hunter',from:a.level,to:b.level,id:'hunter:'+b.level});
 for(const k of STATS)if(b.stats[k]>a.stats[k])changes.push({type:'stat',stat:k,from:a.stats[k],to:b.stats[k],id:'stat:'+k+':'+b.stats[k]});
 if(a.rank!==b.rank)changes.push({type:'rank',from:a.rank,to:b.rank,id:'rank:'+b.rank});
 const fresh=changes.filter(c=>!log.some(r=>r&&r.id===c.id));
 if(!fresh.length)return null;
 const date=at(),timestamp=new Date().toISOString();
 fresh.forEach(c=>log.push({...c,date,timestamp}));
 // The existing saveState() persists this log alongside the normal state. Keep bounded.
 if(log.length>250)log.splice(0,log.length-250);
 latest={before:a,after:b,changes:fresh};
 return latest;
}
function safeToShow(){
 if(typeof gameState==='undefined'||gameState?.pendingDailyReport)return false;
 const sp=document.getElementById('system-splash-screen');
 if(sp&&!sp.classList.contains('hidden')&&sp.style.display!=='none')return false;
 const msg=document.getElementById('modal-system-msg');
 if(msg&&!msg.classList.contains('hidden'))return false;
 return !document.body.classList.contains('sysrpg-tutorial-active');
}
function statText(k,l){
 try{
  const p=typeof getAttributePassives==='function'?getAttributePassives():null;
  if(p)return k==='STR'?`+${p.bonusMaxHp} Max HP`:
   k==='INT'?`+${(p.intXpBonus*100).toFixed(1)}% XP`:
   k==='WIS'?`−${(p.wisDmgReduce*100).toFixed(1)}% HP penalty`:
   `${Math.round(p.chrShopDiscount*100)}% Shop discount`;
 }catch(_){}
 return `Lv.${l}`;
}
function summary(evt){const b=evt.before,a=evt.after,changes=evt.changes;
 const parts=[];
 if(a.level>b.level){parts.push(`<div class="v7-growth-row">${esc(t('level'))}: <strong>${b.level} → ${a.level}</strong><small>${esc(t('xp'))}: ${typeof getRequiredXP==='function'?getRequiredXP(a.level):'—'} XP</small></div>`);}
 if(a.maxHp!==b.maxHp)parts.push(`<div class="v7-growth-row">❤️ ${esc(t('hp'))}: <strong>${b.maxHp} → ${a.maxHp}</strong></div>`);
 for(const c of changes.filter(c=>c.type==='stat'))parts.push(`<div class="v7-growth-row" style="border-color:${COLORS[c.stat]}"><strong>${c.stat} Lv.${c.from} → Lv.${c.to}</strong><small>${esc(t('passive'))}: ${esc(statText(c.stat,c.to))}</small></div>`);
 for(const c of changes.filter(c=>c.type==='rank'))parts.push(`<div class="v7-growth-row">🏆 ${esc(t('rankAwaken'))}: <strong>${esc(c.from)} → ${esc(c.to)}</strong></div>`);
 return parts.join('');
}
function decorateLevelModal(){
 const el=document.getElementById('v7-growth-level-summary');
 if(!el)return;
 if(!latest){el.textContent='';return;}
 const isRank=latest.changes.some(c=>c.type==='rank');
 el.innerHTML=(isRank?'<div class="v7-growth-rank-sword" aria-hidden="true">⚔️ ✦</div>':'')+summary(latest);
 const card=document.querySelector('#modal-levelup .system-card');
 if(card){card.classList.toggle('v7-growth-rank-awakening',isRank);card.style.borderColor=isRank?'#fbbf24':'var(--cyan-400)';}
}
function toast(evt){
 if(!safeToShow())return;
 const old=document.getElementById('v7-growth-toast');if(old)old.remove();
 const el=document.createElement('section');el.id='v7-growth-toast';el.className='v7-growth-toast';el.setAttribute('role','status');
 el.innerHTML=`<strong>✨ ${esc(t('statUp'))}</strong>${summary(evt)}<button type="button">${esc(t('close'))}</button>`;
 document.body.appendChild(el);el.querySelector('button').onclick=()=>el.remove();
}
function onReward(evt,options={}){if(options.silent)return; latest=evt;if(!evt.changes.some(c=>c.type==='hunter')){setTimeout(()=>toast(evt),550);} }
let open=false;
function toggle(){open=!open;const d=document.getElementById('v7-growth-details'),b=document.getElementById('v7-growth-toggle');if(d)d.hidden=!open;if(b)b.setAttribute('aria-expanded',String(open));render();}
function achievementCards(p){
 const r=rank(p),log=history()||[];
 const has=(id)=>log.some(c=>c.id===id);
 const raidArchive=(typeof gameState!=='undefined'&&gameState.v7Raid&&gameState.v7Raid.archive)||{};
 const defeated=Object.values(raidArchive).filter(r=>r&&r.won===true);
 const arr=[
 {name:'Hunter Lv.10',ok:p.level>=10},{name:'Hunter Lv.20',ok:p.level>=20},
 {name:'Rank D',ok:r!=='E'},{name:'Rank C',ok:['C','B','A','S','NATIONAL'].includes(r)},
 ...STATS.map(k=>({name:k+' Lv.10',ok:p.stats[k]>=10})),
 {name:'🔥 Streak 7',ok:Number(p.streak)>=7||(Number(p.longestStreak)||0)>=7},
 {name:'🔥 Streak 30',ok:Number(p.streak)>=30||(Number(p.longestStreak)||0)>=30},
 {name:'🐉 First Boss Clear',ok:defeated.length>=1},
 {name:'🐉 5 Weekly Victories',ok:defeated.length>=5}
 ];
 return `<div class="v7-growth-row"><strong>🏅 ${esc(t('gallery'))}</strong><small>${esc(t('perfect'))}</small><div class="v7-growth-grid">${arr.map(x=>`<div class="v7-growth-badge" data-locked="${!x.ok}"><strong>${esc(x.ok?'🏆':'🔒')} ${esc(x.name)}</strong>${esc(x.ok?t('earned'):t('locked'))}</div>`).join('')}</div></div>`;
}
function render(){
 const p=player();if(!p)return;
 // Attribute Evolution is visual only: no extra passive, bonus, or Level computation.
 const names={id:{STR:'Vanguard',INT:'Scholar',WIS:'Sage',CHR:'Envoy'},en:{STR:'Vanguard',INT:'Scholar',WIS:'Sage',CHR:'Envoy'},ja:{STR:'守護者',INT:'学者',WIS:'賢者',CHR:'使者'}};
 for(const k of STATS){
   const v=document.getElementById('stat-'+k+'-val');
   const card=v?.closest('.stat-box');if(!card)continue;
   const upgraded=Number(p.stats[k])>=10;
   card.classList.toggle('v7-growth-evolved',upgraded);
   card.style.setProperty('--v7-growth-stat-color',COLORS[k]);
   let flair=card.querySelector('.v7-growth-stat-title');
   if(upgraded){if(!flair){flair=document.createElement('small');flair.className='v7-growth-stat-title';v.parentElement.appendChild(flair);}flair.textContent='✦ '+names[lang()][k];}
   else if(flair)flair.remove();
 }
 const button=document.getElementById('v7-growth-toggle');if(button)button.firstChild.textContent=t('section')+' ';
 const m=document.getElementById('v7-growth-milestones'),a=document.getElementById('v7-growth-achievements');if(!m||!a)return;
 let needed=0;try{needed=getRequiredXP(p.level);}catch(_){needed=0;}
 const current=Math.max(0,Number(p.xp)||0),pct=needed?Math.min(100,Math.round(current/needed*100)):0;
 const next=[7,14,30,60,100,365].find(x=>x>(Number(p.streak)||0))||365;
 const milestones=[`<div class="v7-growth-row"><strong>🎯 ${esc(t('next'))}: ${esc(t('level'))} ${p.level+1}</strong><small>${esc(Math.max(0,needed-current))} ${esc(t('remaining'))}</small><div class="v7-growth-bar"><span style="width:${pct}%"></span></div></div>`,
 `<div class="v7-growth-row">🔥 ${esc(t('streak'))}: <strong>${p.streak||0}/${next} ${esc(t('days'))}</strong><div class="v7-growth-bar"><span style="width:${Math.min(100,Math.round((Number(p.streak)||0)/next*100))}%"></span></div></div>`];
 const k=STATS.filter(x=>Number(p.stats[x])<10).sort((x,y)=>Number(p.stats[y])-Number(p.stats[x]))[0];
 if(k)milestones.push(`<div class="v7-growth-row">✨ ${esc(t('attribute'))}: <strong>${k} Lv.${p.stats[k]}/10</strong></div>`);
 m.innerHTML=milestones.join('');a.innerHTML=achievementCards(p);
}
function appendChronicle(container,week){
 if(!container||!week)return;
 const log=history()||[];
 const first=new Date(week+'T00:00:00'),end=new Date(first);end.setDate(end.getDate()+7);
 const entries=log.filter(x=>x?.timestamp&&new Date(x.timestamp)>=first&&new Date(x.timestamp)<end);
 const old=container.querySelector('#v7-growth-chronicle');if(old)old.remove();
 const area=document.createElement('section');area.className='v7-growth-chronicle';area.id='v7-growth-chronicle';
 area.innerHTML=`<strong>✨ ${esc(t('growth'))}</strong>${entries.length?'<ul>'+entries.map(e=>`<li>${esc(e.date)} · ${esc(e.type==='stat'?e.stat+' Lv.'+e.from+' → '+e.to:e.type==='rank'?'Rank '+e.from+' → '+e.to:'Hunter Lv.'+e.from+' → '+e.to)}</li>`).join('')+'</ul>':`<p>${esc(t('none'))}</p>`}`;
 container.appendChild(area);
}
window.V7Growth={snapshot,capture,onReward,render,toggle,decorateLevelModal,appendChronicle};
})();
