/* SYSTEM RPG — Weekly Insights & Hunter Chronicle (offline, read-only analytics).
 * Historical events are read from existing Daily Evaluation records. No XP,
 * HP, Streak, Raid damage, currency, or Quest state is computed or modified here.
 * Immutable Chronicle snapshots are stored only after all seven daily results
 * are verified, and only for a week that has ended.
 */
(function () {
    'use strict';
    const cap = (n,lo,hi) => Math.min(hi,Math.max(lo,n));
    const number = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : NaN);
    const safeText = (v) => String(v == null ? '' : v).replace(/[&<>"']/g,
        ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    const dict = {
        id: {
            insights:'📊 Insight Mingguan',chronicle:'📜 Hunter Chronicle',
            previous:'Minggu sebelumnya',next:'Minggu berikutnya',current:'Minggu berjalan',closed:'Minggu selesai',
            completed:'Habits selesai',scheduled:'Habits terjadwal',average:'Rata-rata penyelesaian',
            activeDays:'Hari dengan Habits',targetDays:'Hari target Streak tercapai',
            bestDay:'Hari terbaik',missing:'Belum ada catatan',noTasks:'Tidak ada Habits',
            protected:'Streak terlindungi',broken:'Target Streak tidak tercapai',
            estimated:'Perkiraan dari data lama',partial:'Data belum lengkap',
            coverage:'Hari tercatat',notes:'Ringkasan hanya memakai evaluasi yang tersimpan. Hari yang tidak tercatat tidak dianggap gagal.',
            legacy:'Ada catatan lama yang belum terverifikasi. Angkanya ditandai sebagai perkiraan.',
            top:'Habits paling konsisten',snapNote:'Berdasarkan snapshot Quest yang tersedia saja.',
            topNone:'Belum ada snapshot Quest yang cukup untuk menghitung konsistensi per Habit.',
            missingStory:'Chronicle hanya dibuat setelah minggu berakhir dan tujuh evaluasi harian tersedia serta terverifikasi. Riwayat yang hilang tidak akan dikarang.',
            noStoryCurrent:'Minggu ini masih berjalan. Chronicle akan siap setelah evaluasi minggu selesai.',
            archived:'Arsip mingguan tersimpan',archiveHint:'Cerita disusun dari catatan nyata. Angka Streak historis tidak ditebak.',
            victory:'Mengalahkan Boss',challenge:'Challenge Clear',normal:'Normal Clear',raid:'Progress Raid',
            noRaid:'Riwayat kemenangan Raid tidak tersedia untuk minggu ini.',
            ready:'Tersedia',notReady:'Belum tersedia',
            storyGood:'Api yang Tetap Menyala',storyMedium:'Melangkah Menembus Jurang',storyLow:'Sang Hunter yang Bangkit Kembali',storyRest:'Minggu Persiapan yang Tenang',
            storyLead:'Sepanjang minggu ini, sang Hunter menuntaskan {done} dari {total} Habits yang dijadwalkan pada {days} hari aktif.',
            storyStreak:'Target Streak tercapai pada {met} hari, dengan {shield} hari terlindungi oleh Streak Freeze.',
            storyBossWin:'Dalam Raid melawan {boss}, Hunter mencapai {result}.',
            storyBossAttempt:'Hunter menghadapi {boss} dan mencatat {damage} damage dalam Raid minggu itu.',
            storyEnd:'Catatan ini menjadi saksi usaha yang benar-benar dilakukan, bukan kesempurnaan yang dibayangkan.'
        },
        en: {
            insights:'📊 Weekly Habit Insights',chronicle:'📜 Hunter Chronicle',previous:'Previous week',next:'Next week',current:'Current week',closed:'Completed week',
            completed:'Habits completed',scheduled:'Habits scheduled',average:'Average completion',activeDays:'Scheduled days',targetDays:'Streak target met',
            bestDay:'Best day',missing:'No record',noTasks:'No scheduled Habits',protected:'Streak protected',broken:'Streak target missed',
            estimated:'Estimated from older data',partial:'Incomplete data',coverage:'Days recorded',
            notes:'Only saved evaluations are included. Missing days are not counted as failures.',
            legacy:'Some old results cannot be verified. Their figures are marked as estimates.',
            top:'Most consistent Habits',snapNote:'Based only on available Quest snapshots.',
            topNone:'Not enough Quest snapshots to calculate per-Habit consistency.',
            missingStory:'A Chronicle is written only after the week has ended and all seven daily evaluations are verified. Missing history is never invented.',
            noStoryCurrent:'This week is still in progress. The Chronicle is available once the week is evaluated.',
            archived:'Weekly archive saved',archiveHint:'This story uses recorded facts; historical streak length is never guessed.',
            victory:'Defeated Boss',challenge:'Challenge Clear',normal:'Normal Clear',raid:'Raid progress',noRaid:'No confirmed raid result for this week.',
            ready:'Available',notReady:'Not available',storyGood:'The Steady Flame',storyMedium:'Steps Through the Abyss',storyLow:'The Hunter Who Returned',storyRest:'A Week of Quiet Preparation',
            storyLead:'This week, the Hunter completed {done} of {total} scheduled Habits across {days} active days.',
            storyStreak:'The Streak target was met on {met} days, with {shield} days protected by Streak Freeze.',
            storyBossWin:'In the raid against {boss}, the Hunter achieved {result}.',
            storyBossAttempt:'The Hunter faced {boss}, recording {damage} damage in that week’s raid.',
            storyEnd:'These pages honor the effort actually recorded, not imagined perfection.'
        },
        ja: {
            insights:'📊 週間習慣分析',chronicle:'📜 ハンター年代記',previous:'前の週',next:'次の週',current:'今週',closed:'終了した週',
            completed:'完了した習慣',scheduled:'予定された習慣',average:'平均達成率',activeDays:'習慣のある日',targetDays:'連続記録の目標達成日',
            bestDay:'最も良かった日',missing:'記録なし',noTasks:'予定なし',protected:'連続記録を保護',broken:'目標未達成',
            estimated:'旧データから推定',partial:'データ不足',coverage:'記録のある日',
            notes:'保存済みの日次評価のみを使用します。記録のない日は失敗として数えません。',
            legacy:'古い評価には未確認のデータが含まれます。推定値として表示します。',
            top:'最も継続できた習慣',snapNote:'利用可能なクエスト記録のみを使用しています。',
            topNone:'習慣別の継続率を計算するための記録がまだ足りません。',
            missingStory:'週が終了し、7日分の評価がすべて確認できた場合にのみ年代記を作成します。不明な記録は創作しません。',
            noStoryCurrent:'今週は進行中です。週の評価が終わると年代記が作られます。',
            archived:'週間記録を保存済み',archiveHint:'実際の記録に基づく物語です。過去の連続日数は推測しません。',
            victory:'ボス討伐',challenge:'チャレンジ達成',normal:'通常クリア',raid:'レイド進捗',noRaid:'この週のレイド結果は確認できません。',
            ready:'利用可能',notReady:'未作成',storyGood:'消えない炎',storyMedium:'深淵を進む一歩',storyLow:'再び立ち上がるハンター',storyRest:'静かな準備の週',
            storyLead:'今週、ハンターは{days}日の活動日で、予定された{total}件の習慣のうち{done}件を達成した。',
            storyStreak:'連続記録の目標は{met}日達成し、{shield}日はストリークフリーズに守られた。',
            storyBossWin:'{boss}とのレイドでは、{result}を達成した。',
            storyBossAttempt:'ハンターは{boss}に挑み、この週のレイドで{damage}ダメージを記録した。',
            storyEnd:'この物語には、想像上の完璧さではなく実際の努力だけが刻まれる。'
        }
    };
    function lang() {const value=typeof v6UiLang==='function'?v6UiLang():((typeof gameState!=='undefined'&&gameState.language)||'id');return dict[value]?value:'id';}
    function txt(key) {return (dict[lang()]||dict.id)[key]||dict.id[key]||key;}
    function fmt(s,vars) {return s.replace(/\{(\w+)\}/g,(_,k)=>String(vars[k]??''));}
    function localDay(key) {const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(key||''));return m?new Date(+m[1],+m[2]-1,+m[3],12):null;}
    function dateKey(d) {return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
    function addDays(key,amount) {const d=localDay(key);if(!d)return '';d.setDate(d.getDate()+amount);return dateKey(d);}
    function weekKey(key) {const d=localDay(key);if(!d)return '';d.setDate(d.getDate()-((d.getDay()+6)%7));return dateKey(d);}
    function today() {return dateKey(new Date());}
    function dateLabel(key,opts) {const d=localDay(key);return d?new Intl.DateTimeFormat({id:'id-ID',en:'en-US',ja:'ja-JP'}[lang()],opts||{day:'numeric',month:'short'}).format(d):String(key);}
    function validEval(e) {
        if(!e||typeof e!=='object')return false;
        const done=number(e.doneCount),total=number(e.totalDaily);
        return Number.isInteger(done)&&Number.isInteger(total)&&total>=0&&done>=0&&done<=total;
    }
    function buildWeek(start,source) {
        const evaluated=(source&&source.history&&source.history.evaluations)||{};
        const snaps=(source&&source.dailyScheduleSnapshots)||{};
        const list=[],habitCounts=new Map();
        let done=0,total=0,activeDays=0,metDays=0,protectedDays=0,missingDays=0,estimatedDays=0,verifiedDays=0,bestDate=null,bestPct=-1;
        for(let i=0;i<7;i++) {
            const key=addDays(start,i),e=evaluated[key];
            if(!validEval(e)) {missingDays++;list.push({date:key,kind:'missing',done:0,total:0,pct:0});continue;}
            const d=number(e.doneCount),t=number(e.totalDaily),pct=t?Math.round(10000*d/t)/100:0;
            // Legacy/manual evaluations without streak status cannot support a certified Chronicle.
            const estimated=!!e.estimated || !['completed','protected','broken','no_quests'].includes(e.streakStatus);
            if(estimated)estimatedDays++;else verifiedDays++;
            done+=d;total+=t;if(t>0) {activeDays++;if(pct>bestPct){bestPct=pct;bestDate=key;}}
            if(e.streakStatus==='completed')metDays++;
            if(e.streakStatus==='protected')protectedDays++;
            list.push({date:key,kind:t===0?'rest':estimated?'estimated':'recorded',done:d,total:t,pct,streakStatus:e.streakStatus||''});
            const snap=snaps[key];
            if(!estimated&&snap&&Array.isArray(snap.questIds)&&Array.isArray(snap.completedIds)) {
                const completed=new Set(snap.completedIds.map(String));
                for(const id of new Set(snap.questIds.map(String))) {
                    const c=habitCounts.get(id)||{id,scheduled:0,completed:0};c.scheduled++;if(completed.has(id))c.completed++;habitCounts.set(id,c);
                }
            }
        }
        return {week:start,days:list,done,total,average:total?Math.round(10000*done/total)/100:null,activeDays,metDays,protectedDays,
            missingDays,estimatedDays,verifiedDays,bestDate,bestPct:bestPct<0?null:bestPct,
            complete:missingDays===0&&estimatedDays===0,habitCounts:[...habitCounts.values()]};
    }
    function archiveRaid(start,source) {
        const archive=source&&source.v7Raid&&source.v7Raid.archive;
        const r=archive&&archive[start];
        if(!r||typeof r!=='object')return null;
        return {bossId:String(r.bossId||''),won:!!r.won,challenge:!!r.challenge,damage:Math.max(0,Number(r.damage)||0)};
    }
    function snapshot(summary,source) {
        const {week,done,total,average,activeDays,metDays,protectedDays,bestDate,bestPct}=summary;
        return {version:1,week,done,total,average,activeDays,metDays,protectedDays,bestDate,bestPct,raid:archiveRaid(week,source)};
    }
    // Does not save or alter progression. Caller persists this together with the normal game save.
    function captureClosedWeeks(date) {
        if(typeof gameState==='undefined'||!gameState||!gameState.history)return false;
        const h=gameState.history,evals=h.evaluations;
        if(!evals||typeof evals!=='object')return false;
        const current=weekKey(date||today());
        const weeks=new Set(Object.keys(evals).filter(k=>localDay(k)).map(weekKey));
        let changed=false;
        for(const start of weeks) {
            if(!start||start>=current)continue;
            if(h.chronicles&&Object.prototype.hasOwnProperty.call(h.chronicles,start))continue;
            const summary=buildWeek(start,gameState);
            if(!summary.complete)continue;
            if(!h.chronicles||typeof h.chronicles!=='object'||Array.isArray(h.chronicles))h.chronicles={};
            h.chronicles[start]=snapshot(summary,gameState);changed=true;
        }
        return changed;
    }
    // Match the collapsible panel contract used by index.html.
    let tab='insights',offset=0,expanded=false;
    function syncPanel() {
        const panel=document.getElementById('v7cj-panel');
        if(panel)panel.hidden=!expanded;
        for(const key of ['insights','chronicle']) {
            const btn=document.getElementById('v7cj-tab-'+key);
            if(btn)btn.setAttribute('aria-expanded',String(expanded&&tab===key));
        }
    }
    function setTab(next) {
        if(next!=='insights'&&next!=='chronicle')return;
        tab=next;expanded=true;
        if(tab==='chronicle'&&offset===0)offset=1;
        render();
    }
    function toggle(next) {
        if(next!=='insights'&&next!=='chronicle')return;
        if(expanded&&tab===next){expanded=false;syncPanel();return;}
        setTab(next);
    }
    function shiftWeek(steps){offset=cap(offset+steps,0,104);render();}
    function weekForOffset() {return addDays(weekKey(today()),-7*offset);}
    function render() {
        syncPanel();
        const root=document.getElementById('v7cj');if(!root||typeof gameState==='undefined'||!gameState)return;
        const wk=weekForOffset(),summary=buildWeek(wk,gameState),snap=gameState.history&&gameState.history.chronicles&&gameState.history.chronicles[wk];
        const tInsights=document.getElementById('v7cj-tab-insights'),tChronicle=document.getElementById('v7cj-tab-chronicle');
        if(tInsights){tInsights.textContent=txt('insights');}
        if(tChronicle){tChronicle.textContent=txt('chronicle');}
        const prev=document.getElementById('v7cj-prev'),next=document.getElementById('v7cj-next');
        if(prev){prev.textContent='‹ '+txt('previous');prev.disabled=offset>=104;}
        if(next){next.textContent=txt('next')+' ›';next.disabled=offset===0;}
        const head=document.getElementById('v7cj-week');
        if(head)head.textContent=`${dateLabel(wk)} – ${dateLabel(addDays(wk,6))} · ${offset===0?txt('current'):txt('closed')}`;
        const body=document.getElementById('v7cj-body');if(!body)return;
        if(tab==='insights') {
            const avg=summary.average===null?'—':summary.average+'%';
            const cards=[[txt('completed'),`${summary.done} / ${summary.total}`],[txt('average'),avg],
                [txt('activeDays'),String(summary.activeDays)],[txt('targetDays'),String(summary.metDays)],
                [txt('coverage'),`${7-summary.missingDays} / 7`],
                [txt('bestDay'),summary.bestDate?dateLabel(summary.bestDate,{weekday:'short',day:'numeric',month:'short'})+' · '+summary.bestPct+'%':'—']];
            const days=summary.days.map(d=>{
                const max=cap(d.pct,0,100);
                const label=d.kind==='missing'?txt('missing'):d.kind==='rest'?txt('noTasks'):`${d.done}/${d.total} · ${d.pct}%`;
                return `<div class="v7cj-day" title="${safeText(label)}"><span>${safeText(dateLabel(d.date,{weekday:'short'}))}</span>`+
                   `<div class="v7cj-bar-track"><div class="v7cj-bar ${d.kind==='estimated'?'v7cj-estimated':''}" style="height:${d.kind==='missing'||d.kind==='rest'?0:max}%"></div></div>`+
                   `<small>${d.kind==='missing'?'—':d.kind==='rest'?'·':Math.round(d.pct)+'%'}</small></div>`;
            }).join('');
            const snapList=summary.habitCounts.sort((a,b)=>b.completed/b.scheduled-a.completed/a.scheduled||b.completed-a.completed).slice(0,3);
            const questMap=new Map(((gameState&&gameState.quests)||[]).map(q=>[String(q.id),String(q.title||'')]));
            const top=snapList.length?snapList.map(item=>`<li>${safeText(questMap.get(item.id)||('Quest '+item.id.slice(0,10)))} <strong>${item.completed}/${item.scheduled}</strong></li>`).join(''):
                `<p class="v7cj-note">${safeText(txt('topNone'))}</p>`;
            body.innerHTML=`<div class="v7cj-stats">${cards.map(([k,v])=>`<div class="v7cj-stat"><small>${safeText(k)}</small><strong>${safeText(v)}</strong></div>`).join('')}</div>`+
                `<div class="v7cj-bars" aria-label="${safeText(txt('insights'))}">${days}</div>`+
                `${summary.missingDays?`<p class="v7cj-warning">⚠️ ${safeText(txt('partial'))}: ${summary.missingDays}/7</p>`:''}`+
                `${summary.estimatedDays?`<p class="v7cj-warning">⚠️ ${safeText(txt('legacy'))}</p>`:''}`+
                `<p class="v7cj-note">${safeText(txt('notes'))}</p>`+
                `<div class="v7cj-top"><strong>${safeText(txt('top'))}</strong><ul>${top}</ul><small>${safeText(txt('snapNote'))}</small></div>`;
        } else if(snap && snap.version===1) {
            const avg=snap.average===null?0:Number(snap.average)||0;
            const title=snap.total===0?txt('storyRest'):avg>=70?txt('storyGood'):avg>=40?txt('storyMedium'):txt('storyLow');
            const parts=[fmt(txt('storyLead'),{done:snap.done,total:snap.total,days:snap.activeDays}),
                fmt(txt('storyStreak'),{met:snap.metDays,shield:snap.protectedDays})];
            if(snap.raid&&snap.raid.bossId) {
                // Boss IDs are canonical game IDs; do not fabricate a boss if the archive lacks one.
                const boss=({'fenrir':'Fenrir Shade','golem':'Runebound Golem','hollow':'Hollow Knight',
                   'raven':'Raven Oracle','dragon':'Abyss Dragon','warden':'Abyssal Warden','queen':'Nocturne Queen',
                   'seraph':'Eclipse Seraph','void':'Void Sovereign','architect':'The First Architect'})[snap.raid.bossId]||snap.raid.bossId;
                parts.push(snap.raid.won?
                    fmt(txt('storyBossWin'),{boss,result:snap.raid.challenge?txt('challenge'):txt('normal')}):
                    fmt(txt('storyBossAttempt'),{boss,damage:snap.raid.damage}));
            }
            parts.push(txt('storyEnd'));
            body.innerHTML=`<article class="v7cj-story"><div class="v7cj-kicker">✦ ${safeText(txt('archived'))}</div>`+
                `<h4>${safeText(title)}</h4>${parts.map(p=>`<p>${safeText(p)}</p>`).join('')}`+
                `<div class="v7cj-story-meta">${safeText(`${snap.done}/${snap.total} · ${snap.average===null?'—':snap.average+'%'} · ${snap.metDays} ${txt('targetDays')}`)}</div>`+
                `<small>${safeText(txt('archiveHint'))}</small></article>`;
        } else {
            body.innerHTML=`<div class="v7cj-empty"><strong>📖 ${safeText(txt('notReady'))}</strong><p>${safeText(offset===0?txt('noStoryCurrent'):txt('missingStory'))}</p></div>`;
        }
        if (tab==='chronicle' && window.V7Growth) window.V7Growth.appendChronicle(body,wk);
    }
    function initialize() {
        try {const changed=captureClosedWeeks(today());if(changed&&typeof saveState==='function')saveState();render();}
        catch(e){console.warn('Chronicle/Insights unavailable:',e);}
    }
    window.V7Chronicle={buildWeek,captureClosedWeeks,render,setTab,toggle,shiftWeek,weekKey};
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize);
    else initialize();
})();
