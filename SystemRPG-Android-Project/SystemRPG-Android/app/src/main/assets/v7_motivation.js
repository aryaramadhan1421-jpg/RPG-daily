/* SYSTEM RPG — Daily Motivation; presentation only. No HP, Quest, streak or Raid writes. */
(function () {
'use strict';
const KEY='system_rpg_motivation_view_v1';
const milestones=[7,14,30,60,100,365];
const copy={
 id:{heading:'DAILY HUNTER BRIEFING',sub:'Hari baru, satu langkah lebih maju.',streak:'Streak saat ini',goal:'Milestone berikutnya',start:'Mulai petualangan',later:'Lewati',mission:'Misi hari ini',missionText:'Pilih satu Quest yang paling mudah untuk dimulai. Centang hanya setelah benar-benar selesai.',comeback:'Kemarin terasa berat? Tidak apa-apa untuk memulai lagi dari satu langkah kecil.',milestone:'MILESTONE STREAK!',milestoneSub:'Konsistensimu membuahkan pencapaian baru.',days:'hari',noMilestone:'Teruskan langkahmu, satu hari pada satu waktu.'},
 en:{heading:'DAILY HUNTER BRIEFING',sub:'A new day, one step forward.',streak:'Current streak',goal:'Next milestone',start:'Begin adventure',later:'Skip',mission:'Today\'s mission',missionText:'Choose one easy Quest to start. Mark it complete only when it is truly done.',comeback:'Yesterday was tough? You can begin again with one small step.',milestone:'STREAK MILESTONE!',milestoneSub:'Your consistency has earned a new achievement.',days:'days',noMilestone:'Keep moving, one day at a time.'},
 ja:{heading:'デイリーハンターブリーフィング',sub:'新しい一日、小さな一歩。',streak:'現在の連続記録',goal:'次の節目',start:'冒険を始める',later:'スキップ',mission:'今日のミッション',missionText:'始めやすいクエストを一つ選ぼう。実際に完了したときだけチェックしてね。',comeback:'昨日は大変だった？ 今日も小さな一歩から始めよう。',milestone:'連続記録の節目！',milestoneSub:'続けてきた努力が実りました。',days:'日',noMilestone:'今日も一歩ずつ進もう。'}
};
function language(){try {let l=(window.gameState&&window.gameState.language)||document.documentElement.lang||localStorage.getItem('system_rpg_lang')||'id'; return copy[l]?l:'id';}catch(_){return 'id';}}
function state(){try{const x=JSON.parse(localStorage.getItem(KEY)||'{}');return x&&typeof x==='object'?x:{};}catch(_){return {};}}
function persist(x){try{localStorage.setItem(KEY,JSON.stringify(x));}catch(_){/* no gameplay mutation */}}
function dateKey(d){const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`;}
function pendingCore(){
 if(typeof gameState==='undefined'||!gameState||!gameState.player)return true;
 if(gameState.pendingDailyReport)return true;
 const sp=document.getElementById('system-splash-screen');
 if(sp&&sp.style.display!=='none'&&!sp.classList.contains('hidden')&&!sp.classList.contains('is-hidden'))return true;
 const systemModal=document.getElementById('modal-system-msg');
 if(systemModal&&!systemModal.classList.contains('hidden')&&getComputedStyle(systemModal).display!=='none')return true;
 return !!(document.body.classList.contains('sysrpg-tutorial-active')||document.getElementById('sysrpg-force-tutorial'));
}
function create(){
 let root=document.getElementById('v7-motivation-overlay');if(root)return root;
 root=document.createElement('div');root.id='v7-motivation-overlay';root.className='hidden';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label','Daily Hunter Briefing');
 root.innerHTML='<section class="v7-motivation-card"><div class="v7-motivation-kicker" id="v7-motivation-kicker"></div><div class="v7-motivation-icon" aria-hidden="true">⚔️</div><h2 id="v7-motivation-title"></h2><p id="v7-motivation-message"></p><div class="v7-motivation-stats"><div><small id="v7-motivation-streak-label"></small><strong id="v7-motivation-streak"></strong></div><div><small id="v7-motivation-goal-label"></small><strong id="v7-motivation-goal"></strong></div></div><div class="v7-motivation-mission"><strong id="v7-motivation-mission-label"></strong><p id="v7-motivation-mission-text"></p></div><div class="v7-motivation-actions"><button type="button" id="v7-motivation-skip"></button><button type="button" id="v7-motivation-start"></button></div></section>';
 document.body.appendChild(root);
 function close(){root.classList.add('hidden');root.style.display='none';}
 root.querySelector('#v7-motivation-skip').addEventListener('click',close);
 root.querySelector('#v7-motivation-start').addEventListener('click',()=>{close();if(typeof switchTab==='function')switchTab('quests');});
 return root;
}
function offer(){
 if(pendingCore())return false;
 const today=dateKey(new Date()),x=state();if(x.lastShown===today)return false;
 const lang=language(),t=copy[lang],streak=Math.max(0,Math.floor(Number(gameState.player.streak)||0));
 const newMilestone=milestones.find(n=>streak===n && !(x.milestones||[]).includes(n));
 const next=milestones.find(n=>n>streak);
 const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
 const report=gameState.history&&gameState.history.evaluations&&gameState.history.evaluations[dateKey(yesterday)];
 const hardYesterday=report&&Number(report.totalDaily)>0&&Number(report.pct)<Number(report.thresholdPct||80);
 const root=create();
 root.querySelector('#v7-motivation-kicker').textContent=newMilestone?t.milestone:t.heading;
 root.querySelector('#v7-motivation-title').textContent=newMilestone?t.milestoneSub:t.sub;
 root.querySelector('#v7-motivation-message').textContent=hardYesterday?t.comeback:t.noMilestone;
 root.querySelector('#v7-motivation-streak-label').textContent=t.streak;
 root.querySelector('#v7-motivation-streak').textContent=streak+' '+t.days;
 root.querySelector('#v7-motivation-goal-label').textContent=t.goal;
 root.querySelector('#v7-motivation-goal').textContent=next?next+' '+t.days:'★';
 root.querySelector('#v7-motivation-mission-label').textContent=t.mission;
 root.querySelector('#v7-motivation-mission-text').textContent=t.missionText;
 root.querySelector('#v7-motivation-skip').textContent=t.later;
 root.querySelector('#v7-motivation-start').textContent=t.start;
 root.classList.remove('hidden');root.style.display='flex';
 x.lastShown=today;
 if(newMilestone)x.milestones=[...new Set([...(x.milestones||[]),newMilestone])];
 persist(x);
 return true;
}
window.V7Motivation={offer};
})();
