/* SYSTEM RPG V7 — Offline Weekly Boss / Codex / Cosmetics (no external dependencies)
 * All gameplay state lives inside gameState.v7Raid, alongside the existing V6 save.
 * Raid logic is deterministic and never changes Hunter HP, XP or streak.
 */
(function () {
    'use strict';
    const LEGACY_HIT = 10;
    const DAILY_POTENTIAL = 100;
    const DAMAGE_SCALE = 1000000;
    const ROSTER = Object.freeze([
        {id:'fenrir',name:'Fenrir Shade',epithet:'The Forgotten Beast',epithets:{"id":"Sang Binatang yang Terlupakan","en":"The Forgotten Beast","ja":"忘れられた獣"},tier:0,motif:{id:'sumpah yang terlupakan di bawah cahaya bulan',en:'a forgotten oath beneath the moon',ja:'月光の下に忘れられた誓い'}},
        {id:'golem',name:'Runebound Golem',epithet:'The Silent Sentinel',epithets:{"id":"Penjaga Sunyi","en":"The Silent Sentinel","ja":"静かなる番人"},tier:0,motif:{id:'rune yang menjaga gerbang sunyi',en:'runes guarding a silent gate',ja:'静かな門を守る古代のルーン'}},
        {id:'hollow',name:'Hollow Knight',epithet:'The Fallen Oathkeeper',epithets:{"id":"Penjaga Sumpah yang Jatuh","en":"The Fallen Oathkeeper","ja":"堕ちた誓いの守護者"},tier:1,motif:{id:'zirah dari janji yang telah dikhianati',en:'the armor of a broken promise',ja:'破られた約束の鎧'}},
        {id:'raven',name:'Raven Oracle',epithet:'The Keeper of Lost Prophecies',epithets:{"id":"Penjaga Ramalan yang Hilang","en":"The Keeper of Lost Prophecies","ja":"失われた予言の番人"},tier:1,motif:{id:'ramalan yang tersebar bersama bulu gagak',en:'prophecies scattered among black feathers',ja:'黒い羽根に散った予言'}},
        {id:'dragon',name:'Abyss Dragon',epithet:'The Devourer of Light',epithets:{"id":"Pemangsa Cahaya","en":"The Devourer of Light","ja":"光を喰らう者"},tier:2,motif:{id:'api yang menelan cahaya bintang',en:'a flame that consumes starlight',ja:'星明かりを飲み込む炎'}},
        {id:'warden',name:'Abyssal Warden',epithet:'The Eternal Jailer',epithets:{"id":"Sipir Abadi","en":"The Eternal Jailer","ja":"永遠の看守"},tier:2,motif:{id:'penjara tanpa jalan keluar',en:'a prison without an exit',ja:'出口のない監獄'}},
        {id:'queen',name:'Nocturne Queen',epithet:'The Sovereign of Silence',epithets:{"id":"Penguasa Keheningan","en":"The Sovereign of Silence","ja":"静寂の女王"},tier:3,motif:{id:'kerajaan yang telah melupakan nyanyiannya',en:'a kingdom that has forgotten its songs',ja:'歌を忘れた王国'}},
        {id:'seraph',name:'Eclipse Seraph',epithet:'The Fallen Light',epithets:{"id":"Cahaya yang Jatuh","en":"The Fallen Light","ja":"堕ちた光"},tier:3,motif:{id:'sayap yang menutupi fajar terakhir',en:'wings eclipsing the final dawn',ja:'最後の夜明けを覆う翼'}},
        {id:'void',name:'Void Sovereign',epithet:'The King Beyond the Veil',epithets:{"id":"Raja di Balik Tabir","en":"The King Beyond the Veil","ja":"帳の向こうの王"},tier:4,motif:{id:'takhta di luar cakrawala terakhir',en:'a throne beyond the last horizon',ja:'最後の地平線の向こうの玉座'}},
        {id:'architect',name:'The First Architect',epithet:'The Origin of the System',epithets:{"id":"Asal Mula SYSTEM","en":"The Origin of the System","ja":"SYSTEMの起源"},tier:4,motif:{id:'rancangan yang lebih tua dari SYSTEM itu sendiri',en:'blueprints older than the System itself',ja:'SYSTEMよりも古い設計図'}},
        {"id":"scorpion","name":"Crimson Scorpion","epithet":"Guardian of the Red Spring","epithets":{"id":"Penjaga Mata Air Merah","en":"Guardian of the Red Spring","ja":"赤い泉の守護者"},"tier":0,"color":"#f97366"},
        {"id":"frostrevenant","name":"Frost Revenant","epithet":"Keeper of the Frozen Road","epithets":{"id":"Penjaga Jalan Beku","en":"Keeper of the Frozen Road","ja":"凍った道の番人"},"tier":0,"color":"#7dd3fc"},
        {"id":"graveborn","name":"Graveborn Guardian","epithet":"Keeper of Lost Names","epithets":{"id":"Penjaga Nama yang Hilang","en":"Keeper of Lost Names","ja":"失われた名の守護者"},"tier":0,"color":"#a3e635"},
        {"id":"executioner","name":"Phantom Executioner","epithet":"Judge Without a Verdict","epithets":{"id":"Hakim Tanpa Putusan","en":"Judge Without a Verdict","ja":"判決なき裁き手"},"tier":1,"color":"#94a3b8"},
        {"id":"marionette","name":"Cursed Marionette","epithet":"Dancer of Broken Strings","epithets":{"id":"Penari Benang Patah","en":"Dancer of Broken Strings","ja":"切れた糸の踊り手"},"tier":1,"color":"#f0abfc"},
        {"id":"minotaur","name":"Dread Minotaur","epithet":"Guardian of the Broken Maze","epithets":{"id":"Penjaga Labirin Retak","en":"Guardian of the Broken Maze","ja":"壊れた迷宮の番人"},"tier":1,"color":"#fb923c"},
        {"id":"leviathan","name":"Leviathan","epithet":"Keeper of the Sunken City","epithets":{"id":"Penjaga Kota Tenggelam","en":"Keeper of the Sunken City","ja":"沈んだ街の守護者"},"tier":2,"color":"#22d3ee"},
        {"id":"hydra","name":"Obsidian Hydra","epithet":"Three Voices, One Memory","epithets":{"id":"Tiga Suara Satu Ingatan","en":"Three Voices, One Memory","ja":"三つの声、一つの記憶"},"tier":2,"color":"#a78bfa"},
        {"id":"devourer","name":"Soul Devourer","epithet":"Collector of Echoes","epithets":{"id":"Pengumpul Gema","en":"Collector of Echoes","ja":"残響の収集者"},"tier":2,"color":"#c084fc"},
        {"id":"behemoth","name":"Astral Behemoth","epithet":"Bearer of the Sky","epithets":{"id":"Pemikul Langit","en":"Bearer of the Sky","ja":"空を背負う者"},"tier":3,"color":"#818cf8"},
        {"id":"archangel","name":"Fallen Archangel","epithet":"Wings of the Dissenter","epithets":{"id":"Sayap Sang Pembangkang","en":"Wings of the Dissenter","ja":"異議を唱えた翼"},"tier":3,"color":"#fde68a"},
        {"id":"chronos","name":"Chronos Keeper","epithet":"Keeper of the Last Clock","epithets":{"id":"Penjaga Jam Terakhir","en":"Keeper of the Last Clock","ja":"最後の時計の守り手"},"tier":3,"color":"#5eead4"},
        {"id":"chaos","name":"Primordial Chaos","epithet":"Rift Before Dawn","epithets":{"id":"Retakan Sebelum Fajar","en":"Rift Before Dawn","ja":"夜明け以前の裂け目"},"tier":4,"color":"#f472b6"},
        {"id":"monarch","name":"Eternal Monarch","epithet":"Crown Without an Heir","epithets":{"id":"Mahkota Tanpa Pewaris","en":"Crown Without an Heir","ja":"継承者なき王冠"},"tier":4,"color":"#fbbf24"},
        {"id":"nameless","name":"The Nameless God","epithet":"The Unnamed Witness","epithets":{"id":"Saksi Tanpa Nama","en":"The Unnamed Witness","ja":"名もなき証人"},"tier":4,"color":"#e2e8f0"}
    ]);
    // Milestone frames cannot be purchased: earned from Hunter Rank alone.
    // E/D = Awakened, C/B = Arcane, A = Royal, S/National = Sovereign.
    const RANK_FRAMES = Object.freeze([
        {id:'frame_rank_awakened',kind:'frames',name:'Awakened Frame',css:'#e2e8f0',source:'rank',minRankIndex:0,rankLabel:'E–D',sigil:'✧'},
        {id:'frame_rank_arcane',kind:'frames',name:'Arcane Frame',css:'#2dd4bf',source:'rank',minRankIndex:2,rankLabel:'C–B',sigil:'✦'},
        {id:'frame_rank_royal',kind:'frames',name:'Royal Hunter Frame',css:'#c084fc',source:'rank',minRankIndex:4,rankLabel:'A',sigil:'◆'},
        {id:'frame_rank_sovereign',kind:'frames',name:'Sovereign Frame',css:'#fbbf24',source:'rank',minRankIndex:5,rankLabel:'S / National',sigil:'♛'}
    ]);
    const EXCHANGE = Object.freeze([
        {id:'frame_moon',kind:'frames',name:'Moonlit Frame',cost:18,css:'#22d3ee'},
        {id:'frame_eclipse',kind:'frames',name:'Eclipse Frame',cost:35,css:'#c084fc'},
        {id:'aura_shadow',kind:'auras',name:'Shadow Aura',cost:20,css:'#22d3ee'},
        {id:'aura_crimson',kind:'auras',name:'Crimson Aura',cost:30,css:'#fb7185'},
        {id:'aura_eclipse',kind:'auras',name:'Eclipse Aura',cost:0,css:'#c084fc',challengeOnly:true}
    ]);
    // Permanent Gold cosmetics; independent of 24-hour relics and Raid Crystal rewards.
    const GOLD_COLLECTION=Object.freeze([
        {id:'weapon_iron',kind:'weapons',name:'Iron Blade',cost:1500,css:'#d1d5db',shape:'M61 57 89 6 84 1 50 52Z'},
        {id:'weapon_frost',kind:'weapons',name:'Frost Fang',cost:3500,css:'#7dd3fc',shape:'M52 53 58 38 73 24 70 19 90 2 86 25 78 29 69 48 61 59Z'},
        {id:'weapon_crimson',kind:'weapons',name:'Crimson Fang',cost:7500,css:'#fb7185',shape:'M50 53 59 35 65 39 70 17 77 22 89 0 91 19 83 35 75 31 69 52 61 59Z'},
        {id:'weapon_monarch',kind:'weapons',name:"Monarch’s Blade",cost:15000,css:'#c084fc',shape:'M49 53 56 35 62 38 64 22 77 18 89 0 91 21 82 30 77 47 69 44 61 60Z'},
        {id:'frame_gold_luxury',kind:'frames',name:'Luxury Frame',cost:5000,css:'#fbbf24',sigil:'♛'},
        {id:'frame_gold_celestial',kind:'frames',name:'Celestial Frame',cost:12000,css:'#93c5fd',sigil:'✦'},
        {id:'aura_gold_ember',kind:'auras',name:'Solar Ember Aura',cost:7500,css:'#fb923c'},
        {id:'aura_gold_aurora',kind:'auras',name:'Aurora Veil',cost:16000,css:'#34d399'},
        {id:'fp_gold_rune',kind:'fingerprints',name:'Rune Scanner',cost:2500,css:'#a78bfa',sigil:'✧'},
        {id:'fp_gold_royal',kind:'fingerprints',name:'Royal Scanner',cost:20000,css:'#fbbf24',sigil:'♛'}
    ]);
    const COSMETIC_ITEMS=Object.freeze([...RANK_FRAMES,...EXCHANGE,...GOLD_COLLECTION]);
    const SLOT_BY_KIND={frames:'frame',auras:'aura',weapons:'weapon',fingerprints:'fingerprint'};
    const goldCost=item=>typeof getDiscountedShopCost==='function'?getDiscountedShopCost(item.cost):item.cost;
    const goldBalance=()=>Number(gameState.player?.gold);
    const goldLabel=n=>Number(n).toLocaleString(typeof v6UiLang==='function'&&v6UiLang()==='id'?'id-ID':typeof v6UiLang==='function'&&v6UiLang()==='ja'?'ja-JP':'en-US');
    const RANK_ORDER=['E-RANK','D-RANK','C-RANK','B-RANK','A-RANK','S-RANK','NATIONAL'];
    const getCosmetic=id=>COSMETIC_ITEMS.find(x=>x.id===id);
    const A = (value) => Array.isArray(value) ? value : [];
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const t = (id,en,ja) => typeof v6Text === 'function' ? v6Text(id,en,ja) : id;
    const localDate = (key) => { const a=String(key).split('-').map(Number); return new Date(a[0],a[1]-1,a[2],12); };
    const keyOf = (d) => typeof formatDateKey === 'function' ? formatDateKey(d) : `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const plusDays = (key,n) => {const d=localDate(key);d.setDate(d.getDate()+n);return keyOf(d);};
    function weekKey(dateKey) { const d=localDate(dateKey); d.setDate(d.getDate()-((d.getDay()+6)%7));return keyOf(d); }
    function tierForRank() {
        try {const code=getPlayerRank(gameState.player.level,gameState.player.stats).rankCode;
            return code==='NATIONAL'||code==='S-RANK'?4:code==='A-RANK'?3:code==='B-RANK'?2:code==='C-RANK'?1:0;
        } catch(_) {return 0;}
    }
    function rankIndex() {
        try {
            const player=gameState&&gameState.player;
            const rank=getPlayerRank(player.level,player.stats).rankCode;
            return Math.max(0,RANK_ORDER.indexOf(rank));
        } catch (_) {return 0;}
    }
    // Idempotent migration and on-rank-up grant. Never sell or revoke rank frames.
    // Commit the owned items and the equipped frame in one save transaction.
    function syncRankFrames() {
        const v=state(),eligible=RANK_FRAMES.filter(item=>rankIndex()>=item.minRankIndex);
        const previous=v.cosmetics.owned.frames;
        const newItems=eligible.filter(item=>!previous.includes(item.id));
        if(!newItems.length)return false;
        const oldOwned=previous.slice(),oldEquipped=v.cosmetics.equipped.frame;
        v.cosmetics.owned.frames=[...new Set([...previous,...newItems.map(x=>x.id)])];
        // Equip the newest milestone unless a Shop frame was intentionally selected.
        const wasRankFrame=RANK_FRAMES.some(item=>item.id===oldEquipped);
        if(!oldEquipped||wasRankFrame) v.cosmetics.equipped.frame=eligible[eligible.length-1].id;
        if(typeof saveState!=='function'||saveState()===false){
            v.cosmetics.owned.frames=oldOwned;
            v.cosmetics.equipped.frame=oldEquipped;
            return false;
        }
        return true;
    }
    function initialState() {return {version:1, defaultMode:'normal', raidCrystals:0, active:null, archive:{},
        lastBossId:null, seenBosses:[], questHitLedger:{}, cosmetics:{owned:{frames:[],auras:[]},equipped:{frame:null,aura:null}}, effects:'simple'};}
    function state() {
        if (!gameState.v7Raid || typeof gameState.v7Raid !== 'object' || Array.isArray(gameState.v7Raid)) gameState.v7Raid=initialState();
        const v=gameState.v7Raid;
        // Legacy defaultMode is retained for backup compatibility, not used for new raids.
        if (!v.archive || typeof v.archive!=='object' || Array.isArray(v.archive)) v.archive={};
        v.seenBosses=A(v.seenBosses);
        if(!v.questHitLedger || typeof v.questHitLedger!=='object' || Array.isArray(v.questHitLedger)) v.questHitLedger={};
        // Migrate recorded hits from older versions without granting a second attack.
        if(v.active && v.active.hits && typeof v.active.hits==='object')
            for(const key of Object.keys(v.active.hits)) v.questHitLedger[key]=v.active.week;
        if (!v.cosmetics || typeof v.cosmetics!=='object') v.cosmetics={owned:{frames:[],auras:[]},equipped:{frame:null,aura:null}};
        if (!v.cosmetics.owned) v.cosmetics.owned={frames:[],auras:[]};
        if (!v.cosmetics.equipped) v.cosmetics.equipped={frame:null,aura:null};
        v.cosmetics.owned.frames=A(v.cosmetics.owned.frames);
        v.cosmetics.owned.auras=A(v.cosmetics.owned.auras);
        for(const kind of ['weapons','fingerprints']){
            v.cosmetics.owned[kind]=A(v.cosmetics.owned[kind]);
            const slot=SLOT_BY_KIND[kind];
            if(!v.cosmetics.owned[kind].includes(v.cosmetics.equipped[slot])||getCosmetic(v.cosmetics.equipped[slot])?.kind!==kind)v.cosmetics.equipped[slot]=null;
        }
        v.raidCrystals=Math.max(0,Math.floor(Number(v.raidCrystals)||0));
        return v;
    }
    // Adaptive raid v2: each active calendar day offers up to 100 damage,
    // independent of how many Daily Quests are scheduled for that day.
    function planForDay(day) {
        const ids = [...new Set(A(gameState.quests)
            .filter(q => q && q.id != null && q.category === 'Daily Quest' && isQuestActiveOnDate(q,day))
            .map(q => String(q.id)))].sort();
        return {questIds:ids};
    }
    function plansForWeek(start) {
        const plans={};
        for(let i=0;i<7;i++) {
            const day=plusDays(start,i);
            plans[day]=planForDay(day);
        }
        return plans;
    }
    function raidPotential(plans) {
        return Object.values(plans||{}).filter(p=>p && Array.isArray(p.questIds) && p.questIds.length>0).length * DAILY_POTENTIAL;
    }
    function updateAdaptiveTargets(w) {
        if(!w || w.balanceVersion!==2)return false;
        // The weekly Boss HP/targets are locked at creation; future Quest edits
        // only change how the next day's 100 potential damage is distributed.
        // This prevents shrinking the weekly target by deleting Habits.
        w.projectedPotential=raidPotential(w.dayPlans);
        return false;
    }
    function refreshFuturePlans(dateKey) {
        const w=state().active;
        if(!w || w.closed || w.balanceVersion!==2 || w.week!==weekKey(dateKey))return false;
        let changed=false;
        // Today and previous dates are immutable. Edits affect TOMORROW onward.
        for(let i=0;i<7;i++) {
            const day=plusDays(w.week,i);
            if(day<=dateKey)continue;
            const next=planForDay(day),old=w.dayPlans[day];
            if(!old || JSON.stringify(old.questIds)!==JSON.stringify(next.questIds)) {
                w.dayPlans[day]=next;changed=true;
            }
        }
        return updateAdaptiveTargets(w) || changed;
    }
    function prepareSave() {
        // Called before app.js serializes gameState, not from raid saveState():
        // schedule edits are committed atomically with recalculated future capacity.
        return refreshFuturePlans(keyOf(new Date()));
    }
    function adaptiveHit(w,dateKey,id) {
        const plan=w.dayPlans && w.dayPlans[dateKey];
        if(!plan || !Array.isArray(plan.questIds))return 0;
        const index=plan.questIds.indexOf(String(id));
        if(index<0)return 0; // Added/edited today: eligible from next day.
        const count=plan.questIds.length;
        const totalUnits=DAILY_POTENTIAL*DAMAGE_SCALE;
        const base=Math.floor(totalUnits/count);
        const units=base+(index < totalUnits%count ? 1 : 0);
        return units/DAMAGE_SCALE;
    }
    function countsByBoss(v) {
        const counts={};
        for(const r of Object.values(v.archive)) if(r&&r.won) counts[r.bossId]=(counts[r.bossId]||0)+1;
        return counts;
    }
    function chooseBoss(v,week) {
        const tier=tierForRank();
        const ordinal=Math.floor(localDate(week).getTime()/604800000);
        const eligible=ROSTER.filter(b=>tier>0&&ordinal%5===0?b.tier<tier:b.tier===tier);
        const counts=countsByBoss(v);
        const alternatives=eligible.length>1?eligible.filter(b=>b.id!==v.lastBossId):eligible;
        const pool=alternatives.length?alternatives:eligible;
        // Prefer undiscovered / uncompleted stories; every qualified boss stays eligible.
        const unseen=pool.filter(b=>!v.seenBosses.includes(b.id)&&!Object.values(v.archive).some(r=>r&&r.bossId===b.id));
        const candidates=unseen.length?unseen:pool;
        const best=Math.min(...candidates.map(b=>counts[b.id]||0));
        const tie=candidates.filter(b=>(counts[b.id]||0)===best);
        const number=Array.from(week).reduce((x,ch)=>x*31+ch.charCodeAt(0),0);
        return tie[Math.abs(number)%tie.length];
    }
    function createWeek(v,key) {
        const b=chooseBoss(v,key);
        const dayPlans=plansForWeek(key);
        const potential=raidPotential(dayPlans);
        const maxDamage=Math.ceil(potential*.60);
        const w={week:key,bossId:b.id,rankTier:b.tier,balanceVersion:2,dayPlans,weekPotential:potential,
            maxDamage,normalTarget:Math.ceil(potential*.40),
            challengeTarget:maxDamage,mode:'adaptive',damage:0,hits:{},battleView:{seenHitKeys:[]},seen:false,closed:false};
        v.active=w;v.lastBossId=b.id;
        return w;
    }
    // Actual ledger determines eligibility, independently of optional animation.
    function normalCleared(w, damage=w.damage) { return w.maxDamage>0 && damage+1e-6>=w.normalTarget; }
    function modeCleared(w, damage=w.damage) { return w.maxDamage>0 && damage+1e-6>=w.challengeTarget; }
    function claimedTier(w) { return w.rewardTier || (w.mode==='challenge'?'challenge':'normal'); }
    function activeClaimable(v,w) {
        return !!(w && !w.closed && !v.archive[w.week] && !w.rewardClaimed && normalCleared(w));
    }
    function finalizeWeek(v) {
        const w=v.active;
        if(!w||w.closed||v.archive[w.week]) return false;
        const won=w.maxDamage>0&&w.damage+1e-6>=w.normalTarget;
        const challenge=won&&(w.rewardClaimed?claimedTier(w)==='challenge':modeCleared(w));
        // Reward stays pending until user claims it. No changes to Hunter HP/streak.
        const dayDamage={};
        for(const [hitKey,raw] of Object.entries(w.hits||{})) {
            const day=hitKey.split('|')[0];
            if(!/^\d{4}-\d{2}-\d{2}$/.test(day))continue;
            dayDamage[day]=Math.round(((dayDamage[day]||0)+Math.max(0,Number(raw)||0))*100)/100;
        }
        v.archive[w.week]={week:w.week,bossId:w.bossId,mode:w.mode,damage:w.damage,
            maxDamage:w.maxDamage,normalTarget:w.normalTarget,won,challenge,claimed:!won||w.rewardClaimed===true,
            gold:won?120:0,crystals:won?(challenge?10:6):0,
            hits:Object.keys(w.hits||{}).length,
            // Snapshot purely for historical statistics; never used in rewards.
            dayDamage,daysContributed:Object.keys(dayDamage).filter(k=>dayDamage[k]>0).length};
        w.closed=true;
        return true;
    }
    function advance(dateKey) {
        const v=state(),week=weekKey(dateKey||keyOf(new Date()));
        if (v.active && week < v.active.week) return false; // Device clock moved backwards.
        if (v.active && v.active.week===week) return refreshFuturePlans(dateKey||keyOf(new Date()));
        if (v.active) finalizeWeek(v);
        createWeek(v,week);
        return true;
    }
    function recordQuest(q,dateKey,credit=1) {
        if(!q ||q.category!=='Daily Quest'||!q.completed||q.id == null) return false;
        const today=keyOf(new Date());
        // The quest event must belong to today; no rewards for backdated edits.
        if(dateKey!==today || !isQuestActiveOnDate(q,dateKey)) return false;
        const v=state();advance(dateKey);
        const w=v.active;
        if(!w||w.week!==weekKey(dateKey)||w.closed||w.maxDamage<=0) return false;
        const hitKey=dateKey+'|'+String(q.id);
        // Two independent persistent guards protect against toggle/recheck, reordering,
        // reloading the app, and a partially migrated combat record.
        if (Object.prototype.hasOwnProperty.call(w.hits,hitKey) ||
            Object.prototype.hasOwnProperty.call(v.questHitLedger,hitKey)) return false;
        // If the weekly maximum was reached, don't create zero-damage queued attacks.
        if(w.rewardClaimed||modeCleared(w))return false;
        const hit=(w.balanceVersion===2?adaptiveHit(w,dateKey,q.id):LEGACY_HIT)*Math.max(0,Math.min(1,Number(credit)||0));
        if(hit<=0)return false;
        battleView(w); // Capture old hits as displayed BEFORE adding a new pending hit.
        const limit=w.maxDamage;
        const awarded=Math.max(0,Math.min(hit,limit-w.damage));
        w.hits[hitKey]=Math.round(awarded*DAMAGE_SCALE)/DAMAGE_SCALE;
        w.damage=Math.round(Math.min(limit,w.damage+awarded)*DAMAGE_SCALE)/DAMAGE_SCALE;
        v.questHitLedger[hitKey]=w.week;
        return true;
    }
    // Display-only progression. The authoritative combat ledger remains w.hits / w.damage.
    // Migration: Beta 05 already showed all existing HP reductions immediately, so
    // previously-recorded hits are treated as already displayed to avoid rewinding HP.
    function battleView(w) {
        if (!w || !w.hits || typeof w.hits !== 'object') return {seenHitKeys:[]};
        const allKeys=Object.keys(w.hits);
        if (!w.battleView || typeof w.battleView!=='object' || !Array.isArray(w.battleView.seenHitKeys))
            w.battleView={seenHitKeys:allKeys.slice()};
        const valid=new Set(allKeys), distinct=new Set();
        w.battleView.seenHitKeys=w.battleView.seenHitKeys.filter(key=>{
            if(typeof key!=='string'||!valid.has(key)||distinct.has(key))return false;
            distinct.add(key);return true;
        });
        return w.battleView;
    }
    function battleProgress(w) {
        const viewed=new Set(battleView(w).seenHitKeys);
        const max=Math.max(0,Number(w.maxDamage)||0);
        const recorded=Math.max(0,Math.min(max,Number(w.damage)||0));
        const pending=[];
        let tally=0;
        for(const [key,raw] of Object.entries(w.hits||{})) {
            const amount=Math.max(0,Number(raw)||0);
            const effective=Math.min(amount,Math.max(0,max-tally));
            tally+=effective;
            if(!viewed.has(key))pending.push({key,amount:effective});
        }
        const pendingDamage=pending.reduce((sum,h)=>sum+h.amount,0);
        const displayedDamage=Math.max(0,recorded-pendingDamage);
        return {pending,displayedDamage,recorded,max};
    }
    function commitSeenHits(w,keys) {
        // Save only the presentation checkpoint; never change w.damage, hits, rewards or HP.
        if(!w||w!==state().active)return false;
        const view=battleView(w),before=view.seenHitKeys.slice();
        const valid=new Set(Object.keys(w.hits||{}));
        for(const key of keys)if(valid.has(key)&&!view.seenHitKeys.includes(key))view.seenHitKeys.push(key);
        if(saveState()===false) {view.seenHitKeys=before;return false;}
        return true;
    }
    let activeBattle=null;
    let battleTimer=null;
    function cancelBattle() {
        if(battleTimer!==null){clearTimeout(battleTimer);battleTimer=null;}
        activeBattle=null;
        const arena=document.querySelector('.v7-replay-stage');
        if(arena)arena.classList.remove('v7-replay-active','v7-move-shadow','v7-move-phantom','v7-move-abyss','v7-visual-only-active','v7-final-blow');
        const action=document.getElementById('v7-watch-battle');if(action)action.disabled=false;
        const again=document.getElementById('v7-visual-replay');if(again)again.disabled=false;
    }
    function scheduleBattle(fn,ms){battleTimer=setTimeout(()=>{battleTimer=null;fn();},ms);}

function renderVictory(w,p) {
    if(!w || !p || !normalCleared(w,p.displayedDamage))return '';
    const challenge=w.rewardClaimed?claimedTier(w)==='challenge':modeCleared(w,p.displayedDamage);
    const b=ROSTER.find(x=>x.id===w.bossId);
    const label=challenge?t('✦ CHALLENGE CLEAR · BOSS DEFEATED!','✦ CHALLENGE CLEAR · BOSS DEFEATED!','✦ チャレンジ達成 · ボス撃破！'):
        t('⚔ NORMAL CLEAR','⚔ NORMAL CLEAR','⚔ 通常クリア');
    const desc=challenge?t('Boss berhasil dikalahkan sepenuhnya!','The Boss is fully defeated!','ボスを完全撃破！'):
        w.rewardClaimed?t('Raid selesai. Boss baru Senin.','Raid complete. New Boss Monday.','レイド終了。次のボスは月曜日。'):
        t('Klaim sekarang atau lanjutkan sampai HP Boss habis.','Claim now or continue until the Boss HP reaches zero.','今すぐ受け取るか、HPがゼロになるまで続けよう。');
    const gold=120,crystals=challenge?10:6;
    const bonus=challenge?`<div class="v7-victory-bonus">✨ ${esc(t('Eclipse Aura permanen saat Challenge Clear pertama.','Permanent Eclipse Aura on your first Challenge Clear.','初回達成でエクリプスオーラ。'))}</div>`:'';
    const provisional=p.pending.length>0?`<small class="v7-victory-pending">${esc(t('Masih ada serangan menunggu ditampilkan.','More queued attacks remain.','未再生の攻撃あり。'))}</small>`:'';
    return `<div class="v7-victory-card ${challenge?'v7-victory-challenge':''}" role="status" aria-live="polite">
      <div class="v7-victory-kicker">🏆 ${esc(t('HASIL RAID MINGGUAN','WEEKLY RAID RESULT','週間レイド結果'))}</div>
      <h3>${esc(label)}</h3>
      <div class="v7-victory-boss">${b?`<img src="bosses/${esc(b.id)}.webp" alt="" loading="lazy">`:''}<span>${esc(b?b.name:'Boss')}<small>${esc(desc)}</small></span></div>
      <div class="v7-victory-rewards">
        <div><strong>🪙 +${gold}</strong><small>Gold</small></div>
        <div><strong>💠 +${crystals}</strong><small>${esc(t('Kristal Raid','Raid Crystals','レイドクリスタル'))}</small></div>
      </div>${bonus}${provisional}
      <p class="v7-victory-info">${esc(t('Hadiah sekali per minggu. Klaim mengakhiri raid. Boss berikutnya muncul Senin.','One reward per week. Claiming ends the raid. The next Boss arrives Monday.','報酬は週に一度。受取でレイド終了。次のボスは月曜日。'))}</p>
    </div>`;
}
function paintVictory(w,p) {
    const slot=document.getElementById('v7-victory-slot');
    if(slot)slot.innerHTML=renderVictory(w,p);
}
    function damageLabel(n) {
        const value=Math.round((Number(n)||0)*100)/100;
        return Number.isInteger(value)?String(value):value.toFixed(2).replace(/0+$/,'').replace(/\.$/,'');
    }
    function paintBattleHP(w) {
        const p=battleProgress(w),remaining=p.max-p.displayedDamage;
        const label=document.getElementById('v7-boss-hp-number');
        const track=document.getElementById('v7-boss-hp-track');
        const bar=document.getElementById('v7-boss-hp-fill');
        const pending=document.getElementById('v7-pending-hits');
        if(label)label.textContent=damageLabel(remaining)+' / '+damageLabel(p.max);
        if(track)track.setAttribute('aria-valuenow',String(remaining));
        if(bar)bar.style.width=(p.max?100*remaining/p.max:0)+'%';
        if(pending)pending.textContent=p.pending.length+' '+t('serangan menunggu','attacks queued','未再生の攻撃');
        const arena=document.querySelector('.v7-boss-card');
        if(arena) {
            arena.classList.toggle('v7-enraged',normalCleared(w,p.displayedDamage)&&!w.rewardClaimed&&!modeCleared(w,p.displayedDamage));
            arena.classList.toggle('v7-defeated',modeCleared(w,p.displayedDamage));
        }
        paintVictory(w,p); // visual-only: never finalizes rewards or changes actual raid HP.
        return p;
    }
    function battleFrames(hits) {
        // 1-5: individual attacks; 6-15: compact combos; 16+: short montage.
        if(hits.length<=5)return hits.map(h=>[h]);
        const groups=hits.length<=15?5:6;
        const chunk=Math.ceil(hits.length/groups),frames=[];
        for(let i=0;i<hits.length;i+=chunk)frames.push(hits.slice(i,i+chunk));
        return frames;
    }
    const ATTACKS=[
        {name:()=>t('TEBASAN BAYANGAN','SHADOW SLASH','シャドウスラッシュ'),style:'v7-move-shadow'},
        {name:()=>t('SERANGAN BAYANGAN','PHANTOM STRIKE','ファントムストライク'),style:'v7-move-phantom'},
        {name:()=>t('PENGHANCUR JURANG','ABYSS BREAKER','アビスブレイカー'),style:'v7-move-abyss'}
    ];
    function playBattleFrame(session) {
        if(activeBattle!==session)return;
        const stage=document.querySelector('.v7-replay-stage');
        if(!stage || !stage.isConnected || document.hidden) {cancelBattle();return;}
        if(session.step>=session.frames.length) {
            cancelBattle();
            render(); // Final state and buttons; nothing further is charged.
            return;
        }
        const frame=session.frames[session.step];
        const move=ATTACKS[session.step%ATTACKS.length];
        stage.classList.remove('v7-replay-active','v7-move-shadow','v7-move-phantom','v7-move-abyss');
        void stage.offsetWidth; // restart CSS-only animations
        const name=document.getElementById('v7-attack-name');
        const impact=document.getElementById('v7-damage-float');
        if(name)name.textContent=move.name()+(frame.length>1?'  ×'+frame.length:'');
        if(impact)impact.textContent='';
        stage.classList.add('v7-replay-active',move.style);
        stage.classList.toggle('v7-visual-only-active',session.visualOnly);
        // Only decorative audio. The damage ledger is never touched by SoundFX.
        try { if(typeof SoundFX!=='undefined' && SoundFX.playBattleAttack) SoundFX.playBattleAttack(session.step%ATTACKS.length,'windup'); } catch (_) {}
        // The HP bar changes at impact, not on Quest completion or on button press.
        scheduleBattle(()=>{
            if(activeBattle!==session || document.hidden || !stage.isConnected){cancelBattle();return;}
            // Capture display progress for audio cues only. Raid math stays untouched.
            const beforeSoundProgress = battleProgress(session.week);
            if(!session.visualOnly && !commitSeenHits(session.week,frame.map(h=>h.key))){
                cancelBattle();render();return; // no lost or duplicate damage on save failure
            }
            const total=frame.reduce((sum,h)=>sum+h.amount,0);
            if(impact)impact.textContent=total>0?'−'+damageLabel(total):'';
            if(!session.visualOnly){
                const after=paintBattleHP(session.week);
                if(!modeCleared(session.week,beforeSoundProgress.displayedDamage)&&modeCleared(session.week,after.displayedDamage))stage.classList.add('v7-final-blow');
            }else if(session.step===session.frames.length-1&&modeCleared(session.week,battleProgress(session.week).displayedDamage)){stage.classList.add('v7-final-blow');}
            // SFX plays at the precise frame of visual HP impact; replay is still free.
            try { if(typeof SoundFX!=='undefined' && SoundFX.playBattleAttack) SoundFX.playBattleAttack(session.step%ATTACKS.length,'impact'); } catch (_) {}
            // Sound does NOT mutate game progress and is also available in free Replay.
            try {
                if(typeof SoundFX!=='undefined' && SoundFX.playBossReaction) {
                    const afterSoundProgress = session.visualOnly ? null : battleProgress(session.week);
                    const target = session.week.challengeTarget;
                    const crossedVictory = afterSoundProgress && beforeSoundProgress.displayedDamage < target && afterSoundProgress.displayedDamage >= target;
                    SoundFX.playBossReaction(session.week.bossId, crossedVictory ? 'defeat' : 'hit');
                }
            } catch (_) {}
            session.step++;
            scheduleBattle(()=>playBattleFrame(session),session.reduced?110:stage.classList.contains('v7-final-blow')?1150:760);
        },session.reduced?0:440);
    }
    function replay() {
        if(activeBattle)return false;
        const w=state().active;if(!w)return false;
        const progress=battleProgress(w);
        if(state().effects==='off')return progress.pending.length>0?skipBattle():false;
        const visualOnly=progress.pending.length===0;
        // Rewatch is visual-only. It never changes the viewed checkpoint or actual HP.
        const hits=visualOnly ? Object.entries(w.hits||{}).slice(-3).map(([key,amount])=>({key,amount:Number(amount)||0})) : progress.pending;
        if(!hits.length)return false;
        const reduced=state().effects==='off'||(typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches);
        const session={week:w,frames:battleFrames(hits),step:0,visualOnly,reduced};
        activeBattle=session;
        const btn=document.getElementById('v7-watch-battle');if(btn)btn.disabled=true;
        playBattleFrame(session);
        return true;
    }
    function replayVisual() {
        if(activeBattle || state().effects==='off')return false;
        const w=state().active;if(!w)return false;
        const alreadySeen=new Set(battleView(w).seenHitKeys);
        const hits=Object.entries(w.hits||{}).filter(([key])=>alreadySeen.has(key))
            .slice(-5).map(([key,amount])=>({key,amount:Number(amount)||0}));
        if(!hits.length)return false;
        const reduced=typeof matchMedia==='function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
        const session={week:w,frames:battleFrames(hits),step:0,visualOnly:true,reduced};
        activeBattle=session;
        const btn=document.getElementById('v7-visual-replay');if(btn)btn.disabled=true;
        playBattleFrame(session);
        return true;
    }
    function skipBattle() {
        const w=state().active;if(!w)return false;
        const pending=battleProgress(w).pending;
        if(!pending.length)return false;
        cancelBattle();
        if(!commitSeenHits(w,pending.map(h=>h.key)))return false;
        render();return true;
    }
    function pendingRewards() {return Object.values(state().archive).filter(r=>r&&r.won&&!r.claimed).sort((a,b)=>a.week.localeCompare(b.week));}
    function claim(week) {
        const v=state(), archived=v.archive[week], w=v.active;
        const live=!archived && w && w.week===week && activeClaimable(v,w);
        const full=live&&modeCleared(w);
        const r=live?{won:true,claimed:false,gold:120,crystals:full?10:6,challenge:full,bossId:w.bossId}:archived;
        if(activeBattle||!r||!r.won||r.claimed) return false;
        // No XP, streak, rank or battle buffs; gold and crystals only.
        if(!gameState.player||!Number.isFinite(Number(gameState.player.gold))) return false;
        const oldGold=gameState.player.gold,oldCrystals=v.raidCrystals;
        const hadAura=v.cosmetics.owned.auras.includes('aura_eclipse');
        r.claimed=true;
        const oldTier=live?w.rewardTier:undefined;
        if(live){w.rewardClaimed=true;w.rewardTier=r.challenge?'challenge':'normal';}
        gameState.player.gold=Number(gameState.player.gold)+r.gold;
        const oldReport=JSON.stringify(gameState.v8Report||null);
        V8Core.recordGold(gameState,r.gold);
        v.raidCrystals+=r.crystals;
        if(r.challenge && !hadAura) v.cosmetics.owned.auras.push('aura_eclipse');
        if(saveState() !== true) {
            gameState.v8Report=JSON.parse(oldReport);
            r.claimed=false;if(live){delete w.rewardClaimed;if(oldTier===undefined)delete w.rewardTier;else w.rewardTier=oldTier;}gameState.player.gold=oldGold;v.raidCrystals=oldCrystals;
            if(!hadAura)v.cosmetics.owned.auras=v.cosmetics.owned.auras.filter(id=>id!=='aura_eclipse');
            return false;
        }
        try{renderAll();render();}catch(e){console.error('Raid reward saved; refresh failed',e);}
        showClaimReward(r,r.challenge&&!hadAura);return true;
    }
    // No mode selector: claim the highest earned tier once, or keep fighting.
    function closeClaimDialog() {
        const el=document.getElementById('v7-claim-overlay');
        if(el){el.remove();const btn=document.querySelector('.v7-live-claim button, .v7-archive-reward-row button');if(btn)btn.focus();}
    }
    function claimDialog(html, reward=false) {
        closeClaimDialog();
        const el=document.createElement('div');el.id='v7-claim-overlay';el.className='v7-claim-overlay';
        el.innerHTML=`<section class="v7-claim-modal ${reward?'v7-claim-reveal':''}" role="dialog" aria-modal="true" aria-labelledby="v7-claim-title">${html}</section>`;
        document.body.appendChild(el);
        el.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();closeClaimDialog();}else if(e.key==='Tab'){const buttons=Array.from(el.querySelectorAll('button'));if(!buttons.length)return;const first=buttons[0],last=buttons[buttons.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
        const btn=el.querySelector('button');if(btn)btn.focus();
    }
    function requestClaim(week) {
        const v=state(),w=v.active;
        if(v.archive[week])return claim(week);
        if(!w||w.week!==week||!activeClaimable(v,w)||activeBattle)return false;
        if(modeCleared(w))return claim(week);
        // Only the Normal early exit requires confirmation.
        claimDialog(`<span class="v7-claim-tag">NORMAL CLEAR</span><h3 id="v7-claim-title">${esc(t('Akhiri Raid sekarang?','Finish this raid now?','今週のレイドを終了しますか？'))}</h3><p>${esc(t('Kamu akan menerima 120 Gold dan 6 Kristal Raid. Kesempatan Challenge minggu ini berakhir setelah klaim.','You will receive 120 Gold and 6 Raid Crystals. This week’s Challenge opportunity ends when you claim.','120ゴールドとレイドクリスタル6個を獲得。受取後は今週のチャレンジに挑戦できません。'))}</p><button type="button" class="v7-raid-btn" onclick="V7Raid.closeClaimDialog()">${esc(t('Lanjut bertarung','Keep fighting','戦闘を続ける'))}</button><button type="button" class="v7-raid-btn v7-claim-btn" onclick="V7Raid.confirmClaim('${esc(week)}')">${esc(t('Klaim Normal','Claim Normal','通常報酬を受取'))}</button>`);
        return true;
    }
    function confirmClaim(week){closeClaimDialog();return claim(week);}
    function showClaimReward(r,newAura) {
        const b=ROSTER.find(x=>x.id===r.bossId);
        claimDialog(`<span class="v7-claim-tag">${r.challenge?'✦ CHALLENGE CLEAR ✦':'⚔ NORMAL CLEAR'}</span><div class="v7-claim-chest" aria-hidden="true">🎁</div><div class="v7-claim-loot"><h3 id="v7-claim-title">${esc(t('HADIAH RAID DIPEROLEH!','RAID REWARD ACQUIRED!','レイド報酬獲得！'))}</h3>${b?`<p>${esc(b.name)}</p>`:''}<div class="v7-claim-items"><div>🪙 <strong>+${r.gold}</strong><small>Gold</small></div><div>💠 <strong>+${r.crystals}</strong><small>${esc(t('Kristal Raid','Raid Crystals','レイドクリスタル'))}</small></div></div>${newAura?`<p class="v7-claim-aura">✨ Eclipse Aura · ${esc(t('Terbuka permanen!','Permanently unlocked!','永久解放！'))}</p>`:''}<p>${esc(t('Hadiah tersimpan. Boss baru muncul Senin.','Reward saved. New Boss arrives Monday.','報酬を保存しました。次のボスは月曜日。'))}</p></div><button type="button" class="v7-raid-btn v7-claim-btn" onclick="V7Raid.closeClaimDialog()">${esc(t('Terima','Continue','閉じる'))}</button>`,true);
        try{if(typeof SoundFX!=='undefined')SoundFX.playLevelUp();}catch(_){}
    }
    function unlock(itemId) {
        const v=state(),item=EXCHANGE.find(x=>x.id===itemId);
        if(!item||item.challengeOnly||v.cosmetics.owned[item.kind].includes(itemId)||v.raidCrystals<item.cost) return false;
        v.raidCrystals-=item.cost;v.cosmetics.owned[item.kind].push(itemId);
        if(saveState()===false){v.raidCrystals+=item.cost;v.cosmetics.owned[item.kind]=v.cosmetics.owned[item.kind].filter(id=>id!==itemId);return false;}
        render();return true;
    }
    function requestGoldPurchase(id){
        const item=GOLD_COLLECTION.find(x=>x.id===id),v=state();
        if(!item||v.cosmetics.owned[item.kind].includes(id)||!Number.isFinite(goldBalance())||goldBalance()<goldCost(item))return false;
        const cost=goldCost(item);
        claimDialog(`<span class="v7-claim-tag">HUNTER COLLECTION</span><h3 id="v7-claim-title">${esc(item.name)}</h3>${cosmeticArt(item)}<p>${esc(t('Beli permanen dengan Gold? Tidak menambah Stat atau damage.','Purchase permanently with Gold? No stat or damage bonuses.','ゴールドで永久購入しますか？能力値・ダメージは増えません。'))}</p><p>🪙 ${goldLabel(cost)}</p><button type="button" class="v7-raid-btn" onclick="V7Raid.closeClaimDialog()">${esc(t('Batal','Cancel','キャンセル'))}</button><button type="button" class="v7-raid-btn v7-claim-btn" onclick="V7Raid.buyGold('${id}',${cost})">${esc(t('Beli','Buy','購入'))}</button>`);
        return true;
    }
    function buyGold(id,quotedCost){
        const item=GOLD_COLLECTION.find(x=>x.id===id),v=state();
        if(!item||v.cosmetics.owned[item.kind].includes(id))return false;
        const cost=goldCost(item),balance=goldBalance();
        if(!Number.isSafeInteger(cost)||cost<=0||!Number.isFinite(balance)||balance<cost||cost!==quotedCost){closeClaimDialog();renderShopExchange();return false;}
        const previousGold=gameState.player.gold,previousOwned=v.cosmetics.owned[item.kind].slice(),previousHistory=Array.isArray(gameState.redeemHistory)?gameState.redeemHistory.slice():gameState.redeemHistory;
        gameState.player.gold=balance-cost;v.cosmetics.owned[item.kind].push(id);
        if(typeof recordRedeemHistory==='function')recordRedeemHistory(item.name,cost,'cosmetic','Hunter Collection');
        let committed=false;
        try{committed=saveState()===true;}catch(e){console.error(e);}
        if(!committed){gameState.player.gold=previousGold;v.cosmetics.owned[item.kind]=previousOwned;gameState.redeemHistory=previousHistory;closeClaimDialog();if(typeof spawnFloatingReward==='function')spawnFloatingReward(t('Gagal menyimpan. Gold tidak dipotong.','Save failed. Gold was not deducted.','保存に失敗しました。ゴールドは消費されていません。'));return false;}
        try{renderAll();}catch(e){console.error('Cosmetic saved; refresh failed',e);}
        claimDialog(`<span class="v7-claim-tag">✦ HUNTER COLLECTION ✦</span><div class="v7-claim-loot"><h3 id="v7-claim-title">${esc(t('KOLEKSI BARU!','NEW COLLECTION ITEM!','新しいコレクション！'))}</h3>${cosmeticArt(item)}<p>${esc(item.name)}</p><p>${esc(t('Dimiliki permanen','Permanently owned','永久所持'))}</p></div><button type="button" class="v7-raid-btn v7-claim-btn" onclick="V7Raid.equipPurchased('${id}')">${esc(t('Pakai sekarang','Equip now','今すぐ装備'))}</button><button type="button" class="v7-raid-btn" onclick="V7Raid.closeClaimDialog()">${esc(t('Nanti','Later','後で'))}</button>`,true);
        try{if(typeof SoundFX!=='undefined')SoundFX.playLevelUp();}catch(_){}
        return true;
    }
    function equipPurchased(id){if(equip(id)){closeClaimDialog();return true;}return false;}
    function equip(itemId) {
        const v=state(),old={...v.cosmetics.equipped};
        if(itemId===null){v.cosmetics.equipped.frame=null;v.cosmetics.equipped.aura=null;}
        else {const item=getCosmetic(itemId); if(!item||!v.cosmetics.owned[item.kind].includes(itemId))return false;
            v.cosmetics.equipped[SLOT_BY_KIND[item.kind]]=itemId;}
        if(saveState()!==true){v.cosmetics.equipped=old;return false;}
        render();applyCosmetics();return true;
    }
    function unequip(slot) {
        if(!Object.values(SLOT_BY_KIND).includes(slot)) return false;
        const v=state(),old=v.cosmetics.equipped[slot];
        if(old===null) return false;
        v.cosmetics.equipped[slot]=null;
        if(saveState()!==true){v.cosmetics.equipped[slot]=old;return false;}
        render();return true;
    }
function openAppearance() {
    syncRankFrames();
    if(typeof switchTab==='function')switchTab('shop');
    const details=document.getElementById('v7-appearance-details');
    if(details)details.open=true;
    renderShopExchange();
    const area=details||document.getElementById('v7-hunter-appearance');
    if(area&&typeof area.scrollIntoView==='function')area.scrollIntoView({behavior:'smooth',block:'center'});
}

function collapseAppearance() {
    const details=document.getElementById('v7-appearance-details');
    if(details) details.open=false;
}

function applyCosmetics() {
    const v=state(),frame=getCosmetic(v.cosmetics.equipped.frame);
    const portrait=document.getElementById('player-portrait-btn');
    const awakening=document.getElementById('btn-fingerprint-auth');
    const logo=document.querySelector('#system-splash-screen .launcher-icon-box');
    for(const el of [portrait,awakening,logo]) if(el) {
        if(el.classList && typeof el.classList.toggle==='function') el.classList.toggle('v7-equipped-frame',!!frame);
        // CSS class owns the cosmetic; base inline styles stay intact.
        if(typeof el.style.setProperty==='function') el.style.setProperty('--v7-frame-color',frame?frame.css:'#22d3ee');
        if(el.dataset) {
            el.dataset.v7Frame=frame?frame.id:'';
            el.dataset.v7FrameOrigin=frame?frame.source||'shop':'';
        }
    }
    const icon=document.getElementById('v7-hunter-silhouette');
    const aura=getCosmetic(v.cosmetics.equipped.aura),weapon=getCosmetic(v.cosmetics.equipped.weapon),fingerprint=getCosmetic(v.cosmetics.equipped.fingerprint);
    if(awakening){awakening.classList.toggle('v72-scanner-equipped',!!fingerprint);awakening.dataset.v72Scanner=fingerprint?.id||'';awakening.style.setProperty('--v72-scanner-color',fingerprint?.css||'#22d3ee');}
    if(icon) {
        const blade=icon.querySelector&&icon.querySelector('.v7-sword-blade');
        if(blade){blade.setAttribute('d',weapon?.shape||'M61 57 89 6 84 1 50 52Z');blade.style.fill=weapon?.css||aura?.css||'#67e8f9';blade.style.stroke=weapon?'#f8fafc':'';blade.style.strokeWidth=weapon?'.65':'';blade.style.filter=weapon||aura?'drop-shadow(0 0 7px '+(weapon?.css||aura.css)+')':'';}
        if(typeof icon.style.setProperty==='function')icon.style.setProperty('--v7-aura-color',aura?aura.css:'#67e8f9');
        if(icon.dataset)icon.dataset.v7Aura=aura?.id||'';
        if(icon.classList && typeof icon.classList.toggle==='function')icon.classList.toggle('v7-aura-equipped',!!aura);
    }
}
function renderAppearance() {
    syncRankFrames();
    const root=document.getElementById('v7-hunter-appearance');
    if(!root)return;
    const v=state();
    applyCosmetics();
    const choices=[['frames','frame',t('Portrait Frame','Portrait Frame','ポートレートフレーム')],['auras','aura',t('Hunter Aura','Hunter Aura','ハンターオーラ')],['weapons','weapon',t('Skin Pedang','Weapon Skin','武器スキン')],['fingerprints','fingerprint',t('Skin Fingerprint','Fingerprint Skin','指紋スキン')]];
    const itemName=id=>{const item=getCosmetic(id);return item?item.name:t('Tidak dipakai','None','なし');};
    const frame=getCosmetic(v.cosmetics.equipped.frame);
    const aura=getCosmetic(v.cosmetics.equipped.aura);
    const preview=`<div class="v7-appearance-preview">
          <div class="v7-appearance-portrait ${frame?'v7-preview-equipped':'v7-preview-none'} ${frame&&frame.source==='rank'?'v7-portrait-rank':''}" data-frame-id="${esc(frame?.id||'')}" style="--v7-frame-color:${frame?frame.css:'#334155'}">
            <span class="v7-appearance-avatar" aria-hidden="true">${esc(frame?.sigil||'◈')}</span>
            <small>${esc(frame?frame.name:t('Tanpa Frame','No Frame','フレームなし'))}</small>
            ${frame?.source==='rank'?`<em>${esc(t('Hadiah Rank','Rank reward','ランク報酬'))} ${esc(frame.rankLabel)}</em>`:''}
          </div>
          <div class="v7-appearance-sword" style="--v7-aura-color:${aura?aura.css:'#67e8f9'}">
            <span class="v7-appearance-sword-icon" aria-hidden="true">⚔</span>
            <small>${esc(aura?aura.name:t('Tanpa Aura','No Aura','オーラなし'))}</small>
          </div>
        </div>`;
    const extraPreview=['weapon','fingerprint'].map(slot=>{const item=getCosmetic(v.cosmetics.equipped[slot]);return `<div class="v72-equipped-preview">${cosmeticArt(item|| (slot==='weapon'?{kind:'weapons',css:'#67e8f9',shape:'M61 57 89 6 84 1 50 52Z'}:{kind:'fingerprints',css:'#22d3ee'}))}<small>${esc(item?.name||(slot==='weapon'?t('Shadow Sword bawaan','Default Shadow Sword','標準シャドウソード'):t('Fingerprint bawaan','Default Fingerprint','標準指紋')))}</small></div>`;}).join('');
    const slots=choices.map(([kind,slot,title])=>{
        const current=v.cosmetics.equipped[slot];
        const owned=COSMETIC_ITEMS.filter(item=>item.kind===kind&&v.cosmetics.owned[kind].includes(item.id));
        const controls=owned.map(item=>{
            const active=item.id===current;
            return `<button type="button" class="v7-appearance-choice ${active?'is-active':''}"
                onclick="V7Raid.equip('${item.id}')" ${active?'disabled':''} aria-pressed="${active}">
                <span class="v7-choice-dot" style="--v7-choice-color:${item.css}"></span>${esc(item.name)}
                ${item.source==='rank'?`<span class="v7-appearance-earned">${esc(item.rankLabel)}</span>`:''} <small>${active?'✓':''}</small>
            </button>`;
        }).join('');
        return `<div class="v7-appearance-slot">
            <div class="v7-appearance-slot-title"><strong>${{frames:'🖼️',auras:'✨',weapons:'⚔️',fingerprints:'◉'}[kind]} ${esc(title)}</strong>
              <span>${esc(itemName(current))}</span></div>
            <div class="v7-appearance-choices">
              <button type="button" class="v7-appearance-choice ${!current?'is-active':''}"
                onclick="V7Raid.unequip('${slot}')" ${!current?'disabled':''} aria-pressed="${!current}">
                ${esc(t('Tanpa efek','None','なし'))} <small>${!current?'✓':''}</small></button>
              ${controls}
            </div>
            ${!owned.length?`<p class="v7-appearance-hint">${esc(t('Bingkai Rank terbuka saat naik Rank; Aura dan bingkai alternatif tersedia di Shop atau Challenge.','Rank frames unlock as you rank up; Auras and alternative frames come from Shop or Challenge.','ランクアップでフレームを解放。オーラと他のフレームはショップやチャレンジで入手できます。'))}</p>`:''}
        </div>`;
    }).join('');
    const next=RANK_FRAMES.find(item=>!v.cosmetics.owned.frames.includes(item.id));
    const reachedRank=RANK_ORDER[rankIndex()];
    const rankRoadmap=`<div class="v7-rank-frame-roadmap">
      <div class="v7-rank-frame-heading"><strong>🏆 ${esc(t('EVOLUSI BINGKAI RANK','RANK PORTRAIT EVOLUTION','ランク別ポートレート進化'))}</strong>
      <small>${esc(t('Rank sekarang','Current rank','現在のランク'))}: ${esc(reachedRank)}</small></div>
      <div class="v7-rank-frame-grid">${RANK_FRAMES.map(item=>{
          const owned=v.cosmetics.owned.frames.includes(item.id);
          return `<div class="v7-rank-frame-card ${owned?'v7-rank-frame-owned':'v7-rank-frame-locked'}" style="--v7-choice-color:${item.css}">
            <span class="v7-frame-mini" aria-hidden="true">${esc(item.sigil)}</span>
            <strong>${esc(item.name)}</strong><small>${esc(item.rankLabel)}</small><button type="button" class="v7-rank-preview-btn" onclick="V7Raid.previewCosmetic('${item.id}')">${esc(t('Lihat','View','見る'))}</button>
            <span>${owned?'✓ '+esc(t('Terbuka','Unlocked','解放済')):'🔒 '+esc(t('Terkunci','Locked','未解放'))}</span>
          </div>`;
      }).join('')}</div>
      <p class="v7-appearance-hint">${esc(next?
          t('Frame Rank terbuka otomatis saat persyaratan Level dan Stat tercapai. Frame lama tetap dimiliki.','Frames unlock automatically at the required level and stats; older frames remain yours.','レベルと能力値で自動解放します。'):
          t('Semua Frame Rank sudah terbuka! Kamu bebas mengganti Frame kapan saja.','All Rank Frames unlocked! Switch anytime.','ランクフレームをすべて解放しました。'))}</p>
    </div>`;
    root.innerHTML=preview+`<div class="v72-equipped-grid">${extraPreview}</div>`+rankRoadmap+slots+`<div class="v7-appearance-footer"><span>${esc(t('Kosmetik tidak menambah statistik atau damage.','Cosmetics never boost stats or damage.','見た目だけの変更です。'))}</span>
      <button type="button" class="v7-raid-btn" onclick="V7Raid.collapseAppearance()">${esc(t('Tutup Koleksi','Close Collection','コレクションを閉じる'))}</button></div>`;
    const photo=root.querySelector('.v7-appearance-avatar'),source=document.getElementById('player-portrait-render');if(photo&&source)photo.replaceChildren(...[...source.childNodes].map(n=>n.cloneNode(true)));
}
    function lore(b,i) {
        const lang = typeof v6UiLang === 'function' ? v6UiLang() : 'id';
        const chapters = window.V7Lore && window.V7Lore.chapters && window.V7Lore.chapters[b.id];
        if (chapters && chapters[i]) return chapters[i][lang === 'en' ? 1 : lang === 'ja' ? 2 : 0];
        return t('Fragmen cerita belum tersedia.','Story chapter is unavailable.','物語を読み込めません。');
    }
    let openStoryBossId = null,storyRenderKey=null;
    function closeBossStory() {
        openStoryBossId = null;storyRenderKey=null;
        const overlay=document.getElementById('v7-story-overlay');
        if(overlay)overlay.remove();
    }
    function openBossStory(id) {
        const b=ROSTER.find(x=>x.id===id);
        if(!b || typeof document==='undefined')return false;
        const v=state(),progress=bossProgress(b,v);
        if(!progress.met)return false; // Never reveal an undiscovered Boss.
        openStoryBossId=id;
        const old=document.getElementById('v7-story-overlay');
        const renderKey=JSON.stringify([id,progress.victories,typeof v6UiLang==='function'?v6UiLang():'id']);
        if(old&&storyRenderKey===renderKey)return true;
        const scroll=old?.querySelector('.v7-story-scroll')?.scrollTop||0;
        if(old)old.remove();storyRenderKey=renderKey;
        const overlay=document.createElement('div');
        overlay.id='v7-story-overlay';overlay.className='v7-story-overlay';
        overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');
        overlay.setAttribute('aria-label',t('Kisah Boss','Boss Story','ボスの物語'));
        const titles=[t('Pertemuan Pertama','First Encounter','初遭遇'),t('Sumpah yang Terungkap','First Victory','最初の勝利'),t('Ingatan yang Terkubur','Two Victories','二度の勝利'),t('Kebenaran Terakhir','Three Victories','三度の勝利')];
        const open=[true,progress.victories>=1,progress.victories>=2,progress.victories>=3];
        const chapters=titles.map((title,i)=>`<section class="v7-story-chapter ${open[i]?'':'v7-story-locked'}">
          <div class="v7-story-chapter-title"><span>${i+1}. ${esc(title)}</span><span>${open[i]?'📖':'🔒'}</span></div>
          ${open[i]?`${lore(b,i).split('\n\n').map(p=>`<p>${esc(p)}</p>`).join('')}`:`<p>${esc(t('Fragmen ini terbuka setelah','Unlock after','解放条件：'))} ${i===1?'1':i===2?'2':'3'} ${esc(t('kemenangan melawan Boss ini.','victories against this Boss.','回の勝利。'))}</p>`}
          </section>`).join('');
        overlay.innerHTML=`<div class="v7-story-reader" role="document">
          <header class="v7-story-reader-head"><div><small>${esc(t('ABYSS CODEX · ARSIP KISAH','ABYSS CODEX · STORY ARCHIVE','深淵の図鑑 · 物語の記録'))}</small>
            <h3>${esc(b.name)}</h3><span>${esc(b.epithets?t(b.epithets.id,b.epithets.en,b.epithets.ja):b.epithet)}</span></div>
            <button type="button" class="v7-story-close" aria-label="${esc(t('Tutup kisah','Close story','物語を閉じる'))}" onclick="V7Raid.closeBossStory()">✕</button></header>
          <div class="v7-story-scroll"><img src="bosses/${esc(b.id)}.webp" alt="${esc(b.name)}" class="v7-story-cover" loading="lazy">
          <p class="v7-story-intro">${esc(t('Kisah terbuka saat target Normal tercapai, tanpa menunggu Senin. Satu kemenangan per Boss per minggu. Fragmen berikutnya membutuhkan 2 dan 3 kemenangan.','Chapters unlock when the Normal target is reached, without waiting for Monday. One victory per Boss per week. Later chapters require 2 and 3 victories.','通常目標を達成すると月曜日を待たずに解放されます。勝利はボスごとに週1回。続編は2回と3回の勝利で解放されます。'))}</p>
          ${chapters}</div>
          <footer><button type="button" class="v7-raid-btn" onclick="V7Raid.closeBossStory()">${esc(t('Tutup Buku','Close Book','本を閉じる'))}</button></footer>
          </div>`;
        document.body.appendChild(overlay);
        overlay.querySelector('.v7-story-close')?.focus();
        const storyScroll=overlay.querySelector('.v7-story-scroll');if(storyScroll)storyScroll.scrollTop=scroll;
        return true;
    }
    if (typeof document!=='undefined' && typeof document.addEventListener==='function') document.addEventListener('keydown',event=>{
        if(event.key==='Escape' && openStoryBossId){closeBossStory();}
    });
    function bossProgress(b,v) {
        const history=Object.values(v.archive).filter(r=>r&&r.bossId===b.id);
        const live=v.active;
        const currentWin=!!(live&&live.bossId===b.id&&!v.archive[live.week]&&normalCleared(live));
        const victories=history.filter(r=>r.won).length+(currentWin?1:0);
        const met=history.length>0 || (v.active&&v.active.bossId===b.id);
        return {victories,met};
    }
    const button=(title,fn,variant='')=>`<button type="button" class="v7-raid-btn ${variant}" onclick="${fn}">${esc(title)}</button>`;
    function renderBoss() {
        const v=state(),w=v.active,b=w&&ROSTER.find(x=>x.id===w.bossId);
        if(!w||!b)return `<p>${esc(t('Raid belum tersedia.','Raid not available.','レイドはまだ利用できません。'))}</p>`;
        const p=battleProgress(w),remaining=Math.max(0,p.max-p.displayedDamage);
        const pct=p.max?remaining/p.max*100:0,normal=normalCleared(w,p.displayedDamage);
        const challenge=normal&&p.displayedDamage+1e-6>=w.challengeTarget;
        const attacks=Object.keys(w.hits||{}).length;
        const introduction = !v.seenBosses.includes(b.id) ?
            `<div class="v7-raid-panel v7-intro"><div class="v7-muted">${esc(t('PERTEMUAN PERTAMA','FIRST ENCOUNTER','初遭遇'))} · ${esc(b.epithets?t(b.epithets.id,b.epithets.en,b.epithets.ja):b.epithet)}</div>
             <h3>⚔️ ${esc(b.name)}</h3><p>${esc(t('Sebuah kisah baru terbuka di Abyss Codex. Baca sekarang atau lanjutkan pertarungan; ceritanya tidak akan hilang.','A new story has unlocked in the Abyss Codex. Read it now or continue; it will remain available.','深淵の図鑑に新しい物語が解放されました。今読んでも、後で読んでも消えません。'))}</p>
             <div class="v7-button-row">${button(t('📖 Baca Kisah','📖 Read Story','📖 物語を読む'), `V7Raid.openBossStory('${b.id}')`)}
             ${button(t('Lewati Intro','Skip Intro','登場演出をスキップ'), 'V7Raid.dismissEncounter()')}</div></div>` : '';
        return introduction + `<div class="v7-boss-card ${modeCleared(w,p.displayedDamage)?'v7-defeated':normal&&!w.rewardClaimed?'v7-enraged':''}">
            <div class="v7-muted">${esc(w.week)} · ${esc(t('RAID BEBAS','OPEN RAID','自由レイド'))}</div>
            <div class="v7-battle-arena ${b.color?'v82-new-boss':''}" style="--v82-boss-color:${b.color||'#a78bfa'};--v82-boss-speed:${3.1+b.tier*.4}s">
              <div class="v7-arena-title"><strong>🐉 ${esc(b.name)}</strong><small>${esc(b.epithets?t(b.epithets.id,b.epithets.en,b.epithets.ja):b.epithet)}</small><button type="button" class="v7-boss-story-link" onclick="V7Raid.openBossStory('${b.id}')">📖 ${esc(t('Baca Lore','Read Lore','物語を読む'))}</button></div>
              <div class="v7-replay-stage" aria-label="${esc(t('Arena pertarungan Weekly Boss','Weekly Boss battle arena','週間ボスの戦闘アリーナ'))}">
                <div class="v7-replay-hunter" id="v7-hunter-silhouette" aria-label="${esc(t('Hunter dengan satu Shadow Sword','Hunter with one Shadow Sword','シャドウソードを一本持つハンター'))}">
                  <svg viewBox="0 0 92 120" aria-hidden="true"><defs><linearGradient id="v7-hunter-armor" x1="0" x2="1"><stop stop-color="#111f35"/><stop offset=".48" stop-color="#2b3c56"/><stop offset="1" stop-color="#050a15"/></linearGradient><linearGradient id="v7-hunter-cloak" x1="0" x2="1"><stop stop-color="#16223a"/><stop offset="1" stop-color="#030712"/></linearGradient></defs><path d="M25 39Q16 52 12 88L3 117 34 105 50 108 82 120 73 70 63 40Z" fill="url(#v7-hunter-cloak)" stroke="#43536d" stroke-width="1.2"/><path d="M23 21Q23 2 43 4Q59 4 63 23L59 40 29 39Z" fill="#080d1b" stroke="#536680" stroke-width="1.5"/><path d="M34 26l22 0-6 7-11 0z" fill="#2b3b56"/><path d="M35 27l5 1-5 2zm15 1 5-1-1 3z" fill="#67e8f9" opacity=".8"/><path d="M26 41 58 39 66 72 54 83 25 80 20 65Z" fill="url(#v7-hunter-armor)" stroke="#5a7393" stroke-width="1.2"/><path d="M20 44l-8 12 17 4 9-17zm43 0 13 13-18 5-7-20z" fill="#1b2a45" stroke="#728da5" stroke-width="1"/><path d="M30 81 17 114 32 115 43 91 57 115 72 115 60 80Z" fill="#091226" stroke="#536a89" stroke-width="1"/><path d="M30 51l29 15M26 70l31 0" stroke="#67e8f9" stroke-opacity=".45" stroke-width="1.2"/><path class="v7-sword-blade" d="M61 57 89 6 84 1 50 52Z" fill="#67e8f9"/><path d="M49 50 65 65" stroke="#2a3550" stroke-width="6"/><path d="M46 47 67 68" stroke="#b5c9db" stroke-width="1.5"/></svg>
                </div>
                <div class="v7-boss-energy-field" aria-hidden="true"></div><div class="v7-replay-boss"><img src="bosses/${esc(b.id)}.webp" alt="${esc(b.name)}" loading="lazy"></div>
                <div class="v7-replay-slash slash-one"></div><div class="v7-replay-slash slash-two"></div><div class="v7-replay-slash slash-three"></div>
                <div class="v7-replay-impact" aria-hidden="true">✦</div>
                <div class="v7-damage-float" id="v7-damage-float" aria-live="off"></div>
                <div class="v7-attack-name" id="v7-attack-name">${esc(t('PEDANG BAYANGAN','SHADOW SWORD','シャドウソード'))}</div>
                <div class="v7-arena-hp">
                  <div class="v7-boss-hp-label"><span>❤️ ${esc(t('HP BOSS','BOSS HP','ボスHP'))}</span><b id="v7-boss-hp-number">${damageLabel(remaining)} / ${damageLabel(p.max)}</b></div>
                  <div class="v7-hp-track" id="v7-boss-hp-track" role="progressbar" aria-label="${esc(t('Sisa HP Boss','Boss HP remaining','ボスの残りHP'))}" aria-valuemin="0" aria-valuemax="${p.max}" aria-valuenow="${remaining}">
                    <div id="v7-boss-hp-fill" class="v7-boss-hp-remaining" style="width:${pct}%"></div>
                    <span class="v7-normal-marker" style="left:${p.max?100*(1-w.normalTarget/p.max):0}%"
                      title="${esc(t('Penanda target Normal Clear','Normal Clear threshold','通常クリアの目標'))}"></span>
                  </div>
                </div>
              </div>
            </div>
            <div id="v7-victory-slot">${renderVictory(w,p)}</div>
            ${activeClaimable(v,w)?`<div class="v7-live-claim">${button(modeCleared(w)?t('🎁 Klaim Challenge · 10 Kristal','🎁 Claim Challenge · 10 Crystals','🎁 チャレンジ報酬 · 10個'):t('🎁 Klaim Normal · 6 Kristal','🎁 Claim Normal · 6 Crystals','🎁 通常報酬 · 6個'),`V7Raid.requestClaim('${esc(w.week)}')`,'v7-claim-btn')+`<small class="v7-muted">${esc(t('Damage tercatat','Recorded damage','記録ダメージ'))}: ${damageLabel(w.damage)} / ${damageLabel(w.maxDamage)}</small>`}</div>`:w.rewardClaimed?`<p class="v7-live-claim">${esc(t('✓ Hadiah sudah diklaim · Boss baru Senin','✓ Reward claimed · New Boss Monday','✓ 受取済み・次のボスは月曜日'))}</p>`:''}
            <p class="v7-muted" id="v7-pending-hits">${p.pending.length} ${esc(t('serangan menunggu','attacks queued','未再生の攻撃'))}</p>
            <p class="v7-muted">${esc(t('Normal clear','Normal clear','通常クリア'))}${w.balanceVersion===2?' (40%)':''}: ${damageLabel(w.normalTarget)} ${esc(t('damage','damage','ダメージ'))} · ${esc(t('Challenge','Challenge','チャレンジ'))}${w.balanceVersion===2?' (100% HP)':''}: ${damageLabel(w.challengeTarget)} ${esc(t('damage','damage','ダメージ'))}</p>
            ${w.balanceVersion===2?`<p class="v7-muted">${esc(t('Setiap hari aktif: maksimal 100 damage, dibagi ke Habits yang dijadwalkan. Tambah/kurangi Quest berlaku mulai besok; target Boss tetap terkunci sampai Raid berikutnya.','Each active day: up to 100 damage, divided among scheduled habits. Quest edits apply from tomorrow; Boss targets stay locked for this week.','活動日ごとに最大100ダメージを習慣に分配します。クエスト編集は翌日から反映され、今週のボス目標は固定です。'))}</p>`:''}
            <p class="v7-result">${p.max===0?esc(t('Tidak ada Habits terjadwal saat minggu dimulai.','No habits scheduled at week start.','週の開始時点で予定された習慣はありません。')):
              p.pending.length?esc(t('⚔️ Serangan tersimpan. Tekan tombol untuk menyaksikan!','⚔️ Attacks saved. Tap to watch!','⚔️ 攻撃を保存しました。ボタンを押して戦闘を再生！')):
              challenge?esc(t('✨ CHALLENGE CLEAR!','✨ CHALLENGE CLEAR!','✨ チャレンジ達成！')):
              normal?esc(w.rewardClaimed?t('🏆 Raid selesai','🏆 Raid complete','🏆 レイド終了'):t('🔥 Normal tercapai · klaim atau lanjutkan Challenge','🔥 Normal reached · claim or continue Challenge','🔥 通常達成・受取またはチャレンジ継続')):
              esc(t('Selesaikan Habits untuk menyiapkan serangan.','Complete habits to queue attacks.','習慣達成で攻撃が貯まります。'))}</p>
            <div class="v7-button-row v7-battle-actions">
              ${p.pending.length?
                `<button type="button" id="v7-watch-battle" class="v7-raid-btn v7-watch-btn" onclick="V7Raid.replay()">${esc(t('▶ Saksikan Pertarungan','▶ Watch Battle','▶ バトルを見る'))} (${p.pending.length})</button>
                 <button type="button" class="v7-raid-btn v7-skip-btn" onclick="V7Raid.skipBattle()">${esc(t('Lewati animasi','Skip animation','演出をスキップ'))}</button>`:
                `<button type="button" id="v7-watch-battle" class="v7-raid-btn" disabled>${esc(attacks>0?t('✓ Semua serangan sudah digunakan','✓ All attacks already used','✓ 攻撃はすべて使用済み'):t('Belum ada serangan','No attacks yet','攻撃はまだありません'))}</button>`}
              <button type="button" id="v7-visual-replay" class="v7-raid-btn v7-replay-only"
                  onclick="V7Raid.replayVisual()" ${battleView(w).seenHitKeys.length && v.effects!=='off'?'':'disabled'}
                  title="${esc(t('Animasi saja. Tidak menambah damage atau reward.','Visual only. No extra damage or rewards.','演出のみ。ダメージや報酬は増えません。'))}">
                  ${esc(t('↻ Battle Replay','↻ Battle Replay','↻ バトルリプレイ'))}</button>
            </div>
            <p class="v7-muted v7-battle-rule">${esc(t('Satu Daily Quest memberi satu serangan per tanggal. Centang ulang tidak memberi serangan tambahan. Damage langsung tersimpan; HP Boss di layar berkurang saat benturan.','Each Daily Quest grants one attack per date. Rechecking never grants extra attacks. Damage saves immediately; visible Boss HP drops on impact.','各デイリークエストは1日に1回だけ攻撃できます。チェックし直しても攻撃は増えません。ダメージは即時保存され、演出時にHP表示が減少します。'))}</p>
        </div>`;
    }
    function renderCodex() {
        const v=state();
        const rows=ROSTER.map(b=>{
            const p=bossProgress(b,v),u=p.met;
            const locks=[u,p.victories>=1,p.victories>=2,p.victories>=3];
            return `<details class="v7-codex-row" data-raid-fold="codex-${b.id}"><summary>${u?'📖':'🔒'} ${esc(u?b.name:'???')} <small>${u?`· ${p.victories} ${esc(t('kemenangan','wins','勝'))}`:'· '+esc(t('Belum ditemukan','Undiscovered','未発見'))}</small></summary>
            ${u?`<p class="v7-muted">${esc(b.epithets?t(b.epithets.id,b.epithets.en,b.epithets.ja):b.epithet)}</p><p class="v7-muted">📖 ${locks.filter(Boolean).length}/4 ${esc(t('fragmen terbuka','chapters unlocked','解放済みの断片'))}</p><button type="button" class="v7-raid-btn v7-read-story-btn" onclick="V7Raid.openBossStory('${b.id}')">${esc(t('📖 Baca Kisah Lengkap','📖 Read Story','📖 物語を読む'))}</button>`:esc(t('Temui Boss ini dalam Weekly Raid untuk membuka Lore.','Encounter this boss to discover its lore.','ボスとの遭遇で解放。'))}</details>`;
        }).join('');
        return `<details class="v7-raid-panel v83-codex" data-raid-fold="codex-all"><summary class="font-display">📜 ${esc(t('KODEKS ABYSS','ABYSS CODEX','深淵の図鑑'))} <small>${ROSTER.filter(b=>bossProgress(b,v).met).length}/${ROSTER.length}</small></summary><div class="v83-codex-list">${rows}</div></details>`;
    }

function renderArchive() {
    const v=state(),rows=Object.values(v.archive).sort((a,b)=>b.week.localeCompare(a.week));
    const w=v.active, b=w&&ROSTER.find(x=>x.id===w.bossId);
    const live=w&&b&&!v.archive[w.week]?`<div class="v81-raid-current"><img src="bosses/${esc(b.id)}.webp" alt=""><div><small>${esc(t('Minggu berjalan','Current week','今週'))} · ${esc(w.week)}</small><strong>${esc(b.name)}</strong><p>${esc(normalCleared(w)?(modeCleared(w)&&(!w.rewardClaimed||claimedTier(w)==='challenge')?'Challenge Clear':'Normal Clear'):t('Dalam pertarungan','In progress','進行中'))} · ${Math.round(w.damage*100)/100}/${w.challengeTarget} DMG</p><p>${esc(w.rewardClaimed?t('Hadiah diklaim','Reward claimed','報酬受取済み'):t('Hadiah melalui panel Boss','Claim rewards in Boss panel','報酬はボス画面で受取'))}</p><button type="button" class="v7-raid-btn" onclick="V7Raid.openBossStory('${b.id}')">📖 ${esc(t('Baca kisah','Read story','物語を読む'))}</button></div></div>`:'';
    const summary=rows.map(r=>{const boss=ROSTER.find(b=>b.id===r.bossId);
        const status=r.challenge?t('✦ CHALLENGE CLEAR','✦ CHALLENGE CLEAR','✦ チャレンジ達成'):
            r.won?t('⚔ NORMAL CLEAR','⚔ NORMAL CLEAR','⚔ 通常クリア'):
            t('— BELUM SELESAI','— INCOMPLETE','— 未達成');
        return `<div class="v7-archive-row v7-archive-reward-row">
            <div class="v7-archive-summary"><strong>${esc(r.week)} · ${esc(boss?boss.name:'Boss')}</strong>
              <small>${r.damage}/${r.maxDamage} ${esc(t('DMG','DMG','ダメージ'))} · ${esc(status)}</small>
              ${r.won?`<small>🪙 +${r.gold} Gold · 💠 +${r.crystals} ${esc(t('Kristal Raid','Raid Crystals','レイドクリスタル'))} ${r.challenge?' · ✨ '+esc(t('Eclipse Aura (kemenangan pertama)','Eclipse Aura (first clear)','エクリプスオーラ（初回）')):''}</small>`:''}
              <details class="v7-battle-summary" data-raid-fold="archive-${esc(r.week)}"><summary>📊 ${esc(t('Rincian Pertarungan','Battle Summary','戦闘サマリー'))}</summary>
                <p>${esc(t('Quest berkontribusi','Contributing Quests','貢献クエスト'))}: <b>${Number(r.hits)||0}</b> · ${esc(t('Damage tercatat','Recorded Damage','記録ダメージ'))}: <b>${Number(r.damage)||0}</b></p>
                <p>${esc(t('Hari berkontribusi','Contributing Days','貢献日数'))}: <b>${Number.isFinite(Number(r.daysContributed))?Number(r.daysContributed):'—'}</b> · ${esc(t('Hadiah','Reward','報酬'))}: ${r.claimed?esc(t('Diklaim','Claimed','受取済み')):r.won?esc(t('Belum diklaim','Unclaimed','未受取')):esc(t('Tidak tersedia','Not available','なし'))}</p>
                ${r.dayDamage&&typeof r.dayDamage==='object'?`<ul>${Object.entries(r.dayDamage).sort((a,b)=>a[0].localeCompare(b[0])).map(([day,amount])=>`<li>${esc(day)} · ${Number(amount)||0} DMG</li>`).join('')}</ul>`:`<p class="v7-muted">${esc(t('Rincian harian tidak tersedia untuk Raid lama.','Daily breakdown unavailable for older raids.','古いレイドには日別データがありません。'))}</p>`}
              </details>
            </div>
            ${r.won&&!r.claimed?button(t('🎁 Klaim','🎁 Claim','🎁 受け取る'),`V7Raid.claim('${esc(r.week)}')`,'v7-claim-btn'):
             `<span class="v7-archive-status">${r.claimed&&r.won?esc(t('✓ Diklaim','✓ Claimed','受取済み')):'—'}</span>`}
        </div>`;
    }).join('');
    return `<div class="v7-raid-panel"><h3>🏆 ${esc(t('ARSIP RAID','RAID ARCHIVE','レイド履歴'))}</h3><p class="v7-muted">${esc(t('Hadiah setiap Raid dibayarkan sekali; klaim yang sudah dilakukan tetap tercatat.','Each raid reward is paid once; previous claims stay recorded.','各レイドの報酬は一度だけ受け取れます。受取済みの記録は保持されます。'))}</p>${live}${summary||`<p class="v7-muted">${esc(t('Belum ada minggu yang berakhir.','No completed weeks yet.','記録はありません。'))}</p>`}</div>`;
}
    // Preview is read-only: does not equip, spend Raid Crystals or modify save data.
    function cosmeticArt(item){
        const color=item.css||'#67e8f9';
        if(item.kind==='weapons')return `<div class="v72-art v72-weapon-art" style="--v72-color:${color}"><svg viewBox="0 0 98 82" aria-hidden="true"><g transform="translate(0 5)"><path d="${item.shape}" fill="${color}" stroke="#f8fafc" stroke-width=".7"/><path d="M45 49 66 65M53 58 38 76" stroke="#aab9cb" stroke-width="5" stroke-linecap="round"/><path d="M45 49 66 65" stroke="${color}" stroke-width="2"/></g></svg></div>`;
        if(item.kind==='fingerprints')return `<div class="v72-art v72-fingerprint-art ${item.id==='fp_gold_royal'?'v72-royal':''}" style="--v72-color:${color}"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="28" fill="none" stroke="${color}" stroke-dasharray="4 4"/><g transform="translate(14 14) scale(1.5)" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round"><path d="M2 12a10 10 0 0 1 18-6M5 19c1-3 1-5 1-7a6 6 0 0 1 12 0c0 3-.5 6-1 9M9 22c1-3 1-7 1-10a2 2 0 0 1 4 0c0 4 0 8-1 10M21 17c1-3 1-6 0-8"/></g></svg></div>`;
        return `<div class="v72-art ${item.kind==='frames'?'v72-frame-art':'v72-aura-art'}" style="--v72-color:${color}"><span>${esc(item.sigil||(item.kind==='frames'?'◈':'✦'))}</span></div>`;
    }
    function closeCosmeticPreview() {
        const overlay=document.getElementById('v7-cosmetic-preview-overlay');
        if(overlay) overlay.remove();
    }
    function previewCosmetic(id) {
        const item=getCosmetic(id);
        if(!item || typeof document==='undefined')return false;
        closeCosmeticPreview();
        const color=item.css||'#67e8f9';
        const isAura=item.kind==='auras';
        const illustration=['weapons','fingerprints'].includes(item.kind)?cosmeticArt(item):isAura?`<div class="v7-cosmetic-sample v7-sample-aura" data-preview-id="${esc(item.id)}" style="--v7-preview-color:${color}">
          <span class="v7-aura-wave"></span><span class="v7-aura-wave second"></span>
          <span class="v7-preview-hunter"><i class="v7-preview-hood"></i><i class="v7-preview-body"></i><i class="v7-preview-blade"></i></span>
          <span class="v7-aura-particle p1">✦</span><span class="v7-aura-particle p2">✧</span><span class="v7-aura-particle p3">✦</span>
        </div>`:`<div class="v7-cosmetic-sample v7-sample-frame" data-preview-id="${esc(item.id)}" style="--v7-preview-color:${color}">
          <div class="v81-frame-context"><div class="v81-frame-example"><span class="v7-frame-preview-frame v81-preview-photo" aria-hidden="true">◈</span><small>${esc(t('Foto Hunter','Hunter portrait','ハンター写真'))}</small></div><div class="v81-frame-example"><span class="v81-preview-fingerprint" aria-hidden="true">◉</span><small>${esc(t('Awakening','Awakening','覚醒'))}</small></div></div>
        </div>`;
        const overlay=document.createElement('div');overlay.id='v7-cosmetic-preview-overlay';overlay.className='v7-cosmetic-overlay';
        overlay.innerHTML=`<div class="v7-cosmetic-modal" role="dialog" aria-modal="true" aria-labelledby="v7-cosmetic-modal-heading">
          <div class="v7-cosmetic-modal-top"><h3 id="v7-cosmetic-modal-heading">${esc(item.name)}</h3>
          <button type="button" class="v7-raid-btn" onclick="V7Raid.closeCosmeticPreview()" aria-label="${esc(t('Tutup','Close','閉じる'))}">✕</button></div>
          ${illustration}<p class="v7-muted">${esc(item.kind==='weapons'?t('Skin mengubah bentuk dan warna pedang di pertarungan, tanpa mengubah damage.','Changes sword shape and color in battle, never damage.','戦闘中の剣の形と色を変更します。ダメージは変わりません。'):item.kind==='fingerprints'?t('Skin mengubah tampilan pemindai Awakening, tanpa mengubah durasi.','Changes the Awakening scanner appearance, not the duration.','覚醒スキャナーの見た目のみ変更します。'):isAura?t('Aura mengelilingi Hunter dan mewarnai Shadow Sword ketika bertarung.','The aura surrounds your Hunter and colors the Shadow Sword in battle.','オーラは戦闘中のハンターを包み、シャドウソードの色を変えます。'):t('Frame menghiasi avatar Hunter di Status dan layar Awakening.','This frame decorates the Hunter avatar in Status and Awakening.','フレームはステータスと覚醒画面のハンター像を飾ります。'))}</p>
          <p class="v7-muted">${esc(t('Pratinjau saja — tidak membeli atau memasang item.','Preview only — no purchase or equipment changes.','プレビューのみ。購入や装備の変更はありません。'))}</p>
          <button type="button" class="v7-raid-btn" onclick="V7Raid.closeCosmeticPreview()">${esc(t('Kembali ke Shop','Back to Shop','ショップへ戻る'))}</button>
        </div>`;
        overlay.addEventListener('click',e=>{if(e.target===overlay)closeCosmeticPreview();});
        document.body.appendChild(overlay);
        const photo=overlay.querySelector('.v81-preview-photo'),source=document.getElementById('player-portrait-render');if(photo&&source){photo.replaceChildren(...[...source.childNodes].map(n=>n.cloneNode(true)));}
        const scanner=overlay.querySelector('.v81-preview-fingerprint'),fp=document.getElementById('fp-svg-icon');if(scanner&&fp){const copy=fp.cloneNode(true);copy.removeAttribute('id');scanner.replaceChildren(copy);}
        overlay.querySelector('.v7-cosmetic-modal-top button')?.focus();
        return true;
    }
function renderGoldCollection(){
    const v=state(),term=(document.getElementById('shop-search-input')?.value||'').toLocaleLowerCase().trim();
    const sections=[{id:'armory',kinds:['weapons'],label:t('HUNTER ARMORY','HUNTER ARMORY','ハンター武器庫')},{id:'luxury',kinds:['frames','auras','fingerprints'],label:t('LUXURY COLLECTION','LUXURY COLLECTION','高級コレクション')}];
    return sections.map(section=>{
        const cards=GOLD_COLLECTION.filter(item=>section.kinds.includes(item.kind)&&(!term||(item.name+' '+item.kind+' '+section.label+' '+t('gold emas pedang bingkai aura fingerprint kosmetik','gold sword frame aura fingerprint cosmetic','ゴールド 剣 フレーム オーラ 指紋')).toLocaleLowerCase().includes(term))).map(item=>{
            const owned=v.cosmetics.owned[item.kind].includes(item.id),equipped=v.cosmetics.equipped[SLOT_BY_KIND[item.kind]]===item.id,cost=goldCost(item),canBuy=Number.isFinite(goldBalance())&&goldBalance()>=cost;
            const kindLabel={weapons:t('Skin pedang permanen','Permanent sword skin','永久武器スキン'),frames:t('Bingkai permanen','Permanent frame','永久フレーム'),auras:t('Aura permanen','Permanent aura','永久オーラ'),fingerprints:t('Skin fingerprint permanen','Permanent fingerprint skin','永久指紋スキン')}[item.kind];
            return `<div class="system-card v7-exchange-row v7-shop-item v72-gold-item">${cosmeticArt(item)}<div class="v7-shop-copy"><b>${esc(item.name)}</b><small>${esc(kindLabel)}</small><button type="button" class="v7-shop-preview-btn" data-cosmetic-preview="${item.id}">👁 ${esc(t('Lihat Preview','Preview item','プレビュー'))}</button></div><div class="v7-shop-action">${owned?`<button type="button" class="v7-shop-manage" onclick="V7Raid.openAppearance()">${esc(equipped?t('✓ Dipakai','✓ Equipped','装備中'):t('✓ Dimiliki · Atur','✓ Owned · Manage','所持 · 管理'))}</button>`:`<button type="button" class="v7-raid-btn v7-price-btn v72-gold-price" onclick="V7Raid.requestGoldPurchase('${item.id}')" ${canBuy?'':'disabled'}>🪙 ${goldLabel(cost)}${cost<item.cost?`<del>${goldLabel(item.cost)}</del>`:''}</button>`}</div></div>`;
        }).join('');
        return cards?`<details class="v7-shop-section v72-gold-section v81-shop-fold" data-shop-section="${section.id}"><summary class="v7-shop-heading"><strong>${esc(section.label)}</strong><span>🪙 ${goldLabel(goldBalance())}</span></summary><p class="v7-appearance-hint">${esc(t('Dibeli dengan Gold dari quest · Diskon CHR · Permanen, tanpa bonus Stat','Bought with quest Gold · CHR discount · Permanent, cosmetic only','クエストのゴールドで購入 · CHR割引 · 永久・見た目のみ'))}</p><div class="v7-shop-list">${cards}</div></details>`:'';
    }).join('');
}
function renderExchange() {
    const v=state();
    const term=(document.getElementById('shop-search-input')?.value||'').toLocaleLowerCase().trim();
    const cards=EXCHANGE.filter(item=>!term||(item.name+' '+item.kind+' '+t('raid kristal bingkai aura kosmetik','raid crystal frame aura cosmetic','レイド クリスタル フレーム オーラ コスメ')).toLocaleLowerCase().includes(term)).map(item=>{
        const owned=v.cosmetics.owned[item.kind].includes(item.id);
        const equipped=v.cosmetics.equipped[item.kind==='frames'?'frame':'aura']===item.id;
        const canBuy=!item.challengeOnly&&!owned&&v.raidCrystals>=item.cost;
        const action=owned?`<button type="button" class="v7-shop-manage" onclick="V7Raid.openAppearance()">${esc(equipped?t('✓ Dipakai','✓ Equipped','装備中'):t('✓ Dimiliki · Atur','✓ Owned · Manage','所持 · 管理'))}</button>`:
            item.challengeOnly?`<span class="v7-shop-locked">🔒 ${esc(t('Reward Challenge','Challenge reward','チャレンジ報酬'))}</span>`:
            `<button type="button" class="v7-raid-btn v7-price-btn" onclick="V7Raid.unlock('${item.id}')" ${canBuy?'':'disabled'}
              aria-label="${esc(t('Beli','Buy','購入'))} ${esc(item.name)}: ${item.cost} ${esc(t('Kristal Raid','Raid Crystals','レイドクリスタル'))}"
              title="${esc(canBuy?t('Beli kosmetik','Buy cosmetic','購入'):t('Raid Crystals belum cukup','Not enough Raid Crystals','クリスタル不足'))}">
              💠 ${item.cost}</button>`;
        return `<div class="system-card v7-exchange-row v7-shop-item">
            ${cosmeticArt(item)}
            <div class="v7-shop-copy"><b>${esc(item.name)}</b><small>${item.challengeOnly?esc(t('Challenge Clear pertama → klaim hadiah','First Challenge Clear → claim reward','初回チャレンジ達成→報酬を受け取る')):item.kind==='frames'?esc(t('Bingkai avatar & Awakening','Avatar & Awakening frame','フレーム')):esc(t('Efek Hunter & Shadow Sword','Hunter & Shadow Sword aura','オーラ'))}</small><button type="button" class="v7-shop-preview-btn" data-cosmetic-preview="${item.id}">👁 ${esc(t('Lihat Preview','Preview item','プレビュー'))}</button></div>
            <div class="v7-shop-action">${action}</div>
        </div>`;
    }).join('');
    if(!cards)return '';
    return `<details class="v7-shop-section v81-shop-fold" data-shop-section="raid"><summary class="v7-shop-heading"><strong>✨ ${esc(t('KOSMETIK RAID','RAID COSMETICS','レイド装飾'))}</strong><span>💠 ${v.raidCrystals}</span></summary>
        <div class="v7-shop-list">${cards}</div>
        <p class="v7-appearance-hint">${esc(t('Eksklusif Weekly Boss: Kristal Raid atau hadiah Challenge. Tidak dijual dengan Gold; efek visual saja.','Weekly Boss exclusive: Raid Crystals or Challenge rewards. Not sold for Gold; visual only.','週間ボス限定：レイドクリスタルまたはチャレンジ報酬。ゴールド購入不可。見た目のみ。'))}</p></details>`;
}
    function syncStaticLabels() {
        const labels={
            'v7-weekly-boss-tab-label':t('Weekly Boss','Weekly Boss','週間ボス'),
            'v7-appearance-heading':t('✨ PENAMPILAN HUNTER','✨ HUNTER APPEARANCE','✨ ハンターの外見'),
            'v7-appearance-subtitle':t('Atur Frame, Aura, Pedang, dan Fingerprint','Manage frames, auras, swords and fingerprint skins','フレーム・オーラ・剣・指紋スキンを管理'),
            'v7-appearance-label':t('KOLEKSI ▾','COLLECTION ▾','コレクション ▾'),
            'v81-relic-catalog-title':t('Katalog Relic','Relic catalog','レリック一覧')
        };
        for(const [id,label] of Object.entries(labels)){
            const el=document.getElementById(id);
            if(el && el.textContent!==label)el.textContent=label;
        }
        const pill=document.getElementById('v7-crystal-pill');
        if(pill)pill.title=t('Kristal Raid · Hadiah Weekly Boss','Raid Crystals · Weekly Boss rewards','レイドクリスタル · 週間ボス報酬');
    }
    document.addEventListener('click',e=>{const btn=e.target.closest?.('[data-cosmetic-preview]');if(btn){e.preventDefault();previewCosmetic(btn.dataset.cosmeticPreview);}});
    const shopFolds=new Map();let shopWasSearching=false;
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById('v7-cosmetic-preview-overlay'))closeCosmeticPreview();});
    function renderShopExchange() {
        const goldCollection=document.getElementById('v72-gold-collection');
        const shopExchange=document.getElementById('v7-shop-exchange');
        const searching=!!document.getElementById('shop-search-input')?.value.trim();
        if(!shopWasSearching)for(const root of [goldCollection,shopExchange])root?.querySelectorAll('details[data-shop-section]').forEach(d=>shopFolds.set(d.dataset.shopSection,d.open));
        shopWasSearching=searching;
        if(goldCollection)goldCollection.innerHTML=renderGoldCollection();
        if(shopExchange)shopExchange.innerHTML=renderExchange();
        for(const root of [goldCollection,shopExchange])root?.querySelectorAll('details[data-shop-section]').forEach(d=>d.open=searching||shopFolds.get(d.dataset.shopSection)===true);
        syncStaticLabels();
        renderAppearance();
        const crystalCounter=document.getElementById('header-raid-crystals');
        if(crystalCounter)crystalCounter.textContent=String(state().raidCrystals);
    }
    function render() {
        // V6 periodically refreshes the UI; do not replace the live battle DOM mid-strike.
        // Navigation explicitly calls cancelBattle(), so hidden/other tabs never auto-play.
        syncRankFrames();
        if(activeBattle) {renderShopExchange();return;}
        cancelBattle();
        const el=document.getElementById('v7-raid-content');if(!el)return;
        const v=state();
        const folds=new Set([...el.querySelectorAll("details[data-raid-fold][open]")].map(x=>x.dataset.raidFold));
        const rewards=pendingRewards();
        const banner=rewards.length?`<div class="v7-raid-panel">🎁 ${esc(t('Reward menunggu klaim','Rewards ready to claim','受け取り待ち報酬'))}: ${rewards.length}</div>`:'';
        el.innerHTML=`<div class="v7-raid-panel v7-header"><span>⚔️ SYSTEM RPG · ${esc(t('BOSS MINGGUAN','WEEKLY BOSS','週間ボス'))}</span><small>${esc(t('Offline • Boss tidak mengurangi HP Hunter','Offline • Boss does not attack Hunter HP','オフライン・ボスはハンターのHPを減らしません'))}</small></div>
          ${banner}${renderBoss()}
          ${renderArchive()}${renderCodex()}`;
        el.querySelectorAll("details[data-raid-fold]").forEach(x=>x.open=folds.has(x.dataset.raidFold));
        renderShopExchange();
        applyCosmetics();
        if(openStoryBossId)openBossStory(openStoryBossId);
    }
    function dismissEncounter() {
        const v=state(),id=v.active&&v.active.bossId;
        if(!id||v.seenBosses.includes(id))return false;
        v.seenBosses.push(id);
        if(saveState()===false){v.seenBosses.pop();return false;}
        render();return true;
    }
    window.V7Raid={requestGoldPurchase,buyGold,equipPurchased,goldCollection:GOLD_COLLECTION,openBossStory,closeBossStory,previewCosmetic,closeCosmeticPreview,state,advance,recordQuest,prepareSave,claim,requestClaim,confirmClaim,closeClaimDialog,unlock,equip,unequip,openAppearance,collapseAppearance,renderAppearance,syncStaticLabels,applyCosmetics,syncRankFrames,replay,replayVisual,skipBattle,cancelBattle,dismissEncounter,render,renderShopExchange,weekKey,
        roster:ROSTER,exchange:EXCHANGE,rankFrames:RANK_FRAMES};
    // Run after the V6 boot sequence, not before its gameState initialization.
    const didChange=advance(keyOf(new Date()));
    if(didChange && typeof saveState==='function')saveState();
    render();
    window.addEventListener('system-language-changed',render);
    if(typeof document.addEventListener==='function')document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelBattle();});
    window.addEventListener('pagehide',cancelBattle);

})();
