// ==========================================
// MODULE BLOCK 1
// ==========================================

// ==========================================
// 1. WEB AUDIO API SYNTHESIZER + DUNGEON AMBIENT
// ==========================================
const SoundFX = {
    ctx: null,
    muted: false,
    ambientMode: 'none', // 'none' | 'synth' | 'rain'
    ambientNodes: [],
    ambientGain: null,

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    playClick() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.045);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
    },

    playUndo() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(620, now);
        osc.frequency.exponentialRampToValueAtTime(340, now + 0.11);

        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
    },

    playQuestComplete() {
        if (this.muted) return;
        this.init();
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            const now = this.ctx.currentTime + idx * 0.065;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.23);
        });
    },

    playLevelUp() {
        if (this.muted) return;
        this.init();
        const melody = [
            { f: 523.25, t: 0, d: 0.12 },
            { f: 659.25, t: 0.12, d: 0.12 },
            { f: 783.99, t: 0.24, d: 0.12 },
            { f: 1046.50, t: 0.36, d: 0.45 }
        ];
        melody.forEach(n => {
            const now = this.ctx.currentTime + n.t;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(n.f, now);

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(2400, now);

            gain.gain.setValueAtTime(0.14, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + n.d);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + n.d + 0.02);
        });
    },

    playCritical() {
        if (this.muted) return;
        this.init();
        const notes = [659.25, 880, 1174.66, 1567.98];
        notes.forEach((freq, idx) => {
            const now = this.ctx.currentTime + idx * 0.05;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.14, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.26);
        });
    },

    playCoin() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.setValueAtTime(1318.51, now + 0.07);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.31);
    },

    playDamage() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(95, now + 0.28);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.31);
    },

    // Offline Ambient Generator for Dungeon Mode
    startAmbient(mode) {
        this.stopAmbient();
        if (mode === 'none' || this.muted) return;
        this.init();

        const masterGain = this.ctx.createGain();
        masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(mode === 'synth' ? 0.14 : 0.18, this.ctx.currentTime + 1.2);
        masterGain.connect(this.ctx.destination);
        this.ambientGain = masterGain;

        if (mode === 'synth') {
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(240, this.ctx.currentTime);

            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();
            lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
            lfoGain.gain.setValueAtTime(95, this.ctx.currentTime);
            lfo.connect(lfoGain);
            lfoGain.connect(filter.frequency);
            lfo.start();
            this.ambientNodes.push(lfo);

            filter.connect(masterGain);

            const freqs = [55, 82.41, 110];
            const types = ['sawtooth', 'triangle', 'sine'];
            freqs.forEach((f, idx) => {
                const osc = this.ctx.createOscillator();
                const oscGain = this.ctx.createGain();
                osc.type = types[idx];
                osc.frequency.setValueAtTime(f, this.ctx.currentTime);
                osc.detune.setValueAtTime((idx - 1) * 6, this.ctx.currentTime);
                oscGain.gain.setValueAtTime(idx === 0 ? 0.45 : 0.35, this.ctx.currentTime);
                osc.connect(oscGain);
                oscGain.connect(filter);
                osc.start();
                this.ambientNodes.push(osc);
            });
        } else if (mode === 'rain') {
            const bufferSize = this.ctx.sampleRate * 3;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            let lastOut = 0.0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                data[i] = (lastOut + (0.04 * white)) / 1.04;
                lastOut = data[i];
                data[i] *= 2.8;
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            noise.loop = true;

            const bandpass = this.ctx.createBiquadFilter();
            bandpass.type = 'bandpass';
            bandpass.frequency.setValueAtTime(750, this.ctx.currentTime);
            bandpass.Q.setValueAtTime(0.65, this.ctx.currentTime);

            const highshelf = this.ctx.createBiquadFilter();
            highshelf.type = 'highshelf';
            highshelf.frequency.setValueAtTime(2200, this.ctx.currentTime);
            highshelf.gain.setValueAtTime(-6, this.ctx.currentTime);

            noise.connect(bandpass);
            bandpass.connect(highshelf);
            highshelf.connect(masterGain);
            noise.start();
            this.ambientNodes.push(noise);
        }
    },

    stopAmbient() {
        if (this.ambientNodes.length > 0) {
            this.ambientNodes.forEach(node => {
                try { node.stop(); node.disconnect(); } catch (e) {}
            });
            this.ambientNodes = [];
        }
        if (this.ambientGain) {
            try { this.ambientGain.disconnect(); } catch (e) {}
            this.ambientGain = null;
        }
    }
};

function updateAudioIcon() {
    const wrap = document.getElementById('icon-audio-wrap');
    const btn = document.getElementById('btn-audio-toggle');
    if (!wrap || !btn) return;
    if (SoundFX.muted) {
        btn.style.color = '#64748b';
        wrap.innerHTML = `<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`;
    } else {
        btn.style.color = '#22d3ee';
        wrap.innerHTML = `<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;
    }
}

function toggleAudio() {
    SoundFX.muted = !SoundFX.muted;
    updateAudioIcon();
    if (SoundFX.muted) {
        SoundFX.stopAmbient();
        if (typeof lofiIsPlaying !== 'undefined' && lofiIsPlaying && typeof stopAnimeLofi1Hour === 'function') {
            stopAnimeLofi1Hour();
        }
    } else {
        SoundFX.playClick();
        if (isDungeonRunning && SoundFX.ambientMode !== 'none') {
            SoundFX.startAmbient(SoundFX.ambientMode);
        }
    }
    saveState();
}

// ==========================================
// 2. SCREEN WAKE LOCK / KEEP SCREEN ON BRIDGE
// ==========================================
const ScreenWakeManager = {
    wakeLockSentinel: null,
    isActive: false,

    async enable() {
        this.isActive = true;
        this.updateBadge(true);

        try {
            if (window.AndroidBridge && typeof window.AndroidBridge.setKeepScreenOn === 'function') {
                window.AndroidBridge.setKeepScreenOn(true);
            }
        } catch (e) {}

        try {
            if ('wakeLock' in navigator) {
                this.wakeLockSentinel = await navigator.wakeLock.request('screen');
                this.wakeLockSentinel.addEventListener('release', () => {
                    if (this.isActive) this.updateBadge(false);
                });
            }
        } catch (err) {}
    },

    async disable() {
        this.isActive = false;
        this.updateBadge(false);

        try {
            if (window.AndroidBridge && typeof window.AndroidBridge.setKeepScreenOn === 'function') {
                window.AndroidBridge.setKeepScreenOn(false);
            }
        } catch (e) {}

        try {
            if (this.wakeLockSentinel) {
                await this.wakeLockSentinel.release();
                this.wakeLockSentinel = null;
            }
        } catch (err) {}
    },

    updateBadge(visible) {
        const badge = document.getElementById('wakelock-status-badge');
        if (!badge) return;
        if (visible) badge.classList.remove('hidden');
        else badge.classList.add('hidden');
    }
};

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && isDungeonRunning && ScreenWakeManager.isActive) {
        ScreenWakeManager.enable();
    }
});

// ==========================================
// 3. GAME STATE & DEFAULT DAILY HABITS
// ==========================================
const STORAGE_KEY = 'system_rpg_productivity_offline_v2';

const DEFAULT_DAILY_HABITS = [
    { id: 'dh_subuh', timeSlot: 'Pagi', title: 'Shalat Subuh', category: 'Daily Quest', stat: 'WIS', xp: 25, gold: 20, completed: false },
    { id: 'dh_dzikir_pagi', timeSlot: 'Pagi', title: 'Dzikir Pagi', category: 'Daily Quest', stat: 'WIS', xp: 20, gold: 15, completed: false },
    { id: 'dh_quran', timeSlot: 'Pagi', title: 'Baca Alquran dan Artinya', category: 'Daily Quest', stat: 'WIS', xp: 25, gold: 20, completed: false },
    { id: 'dh_duolingo', timeSlot: 'Pagi', title: 'Duolingo, Airlearn, Elevate', category: 'Daily Quest', stat: 'INT', xp: 25, gold: 20, completed: false },
    { id: 'dh_volingo', timeSlot: 'Pagi', title: 'Volingo', category: 'Daily Quest', stat: 'INT', xp: 20, gold: 15, completed: false },
    { id: 'dh_neuronation', timeSlot: 'Pagi', title: 'Neuronation', category: 'Daily Quest', stat: 'INT', xp: 20, gold: 15, completed: false },
    { id: 'dh_hiragana', timeSlot: 'Pagi', title: 'Tulis latihan hiragana katakan', category: 'Daily Quest', stat: 'INT', xp: 25, gold: 20, completed: false },
    { id: 'dh_baca_buku', timeSlot: 'Pagi', title: 'Baca buku', category: 'Daily Quest', stat: 'INT', xp: 25, gold: 20, trackingType: 'count', currentCount: 0, targetCount: 20, stepCount: 5, unit: 'hal', completed: false },
    { id: 'dh_minum_air', timeSlot: 'Pagi', title: 'Minum air putih', category: 'Daily Quest', stat: 'STR', xp: 20, gold: 15, trackingType: 'count', currentCount: 0, targetCount: 8, stepCount: 1, unit: 'gelas', completed: false },
    { id: 'dh_rapih', timeSlot: 'Pagi', title: 'Rapih rapih', category: 'Daily Quest', stat: 'WIS', xp: 15, gold: 15, completed: false },
    { id: 'dh_plank_pushup', timeSlot: 'Pagi', title: 'Plank 1 menit dan Push Up 10x', category: 'Daily Quest', stat: 'STR', xp: 25, gold: 20, completed: false },
    { id: 'dh_angkat_beban_pagi', timeSlot: 'Pagi', title: 'Angkat beban', category: 'Daily Quest', stat: 'STR', xp: 30, gold: 25, completed: false },
    { id: 'dh_olahraga_kardio', timeSlot: 'Pagi', title: 'Olahraga, senam, jalan atau aktivitas yang mengeluarkan keringat minimal 10 menit', category: 'Daily Quest', stat: 'STR', xp: 30, gold: 25, completed: false },
    { id: 'dh_jepang_volingo', timeSlot: 'Pagi', title: 'Belajar bahasa jepang 1 bab volingo', category: 'Daily Quest', stat: 'INT', xp: 25, gold: 20, completed: false },
    { id: 'dh_inggris_volingo', timeSlot: 'Pagi', title: 'Belajar bahasa inggris 1 bab volingo', category: 'Daily Quest', stat: 'INT', xp: 25, gold: 20, completed: false },
    { id: 'dh_sarapan', timeSlot: 'Pagi', title: 'Sarapan', category: 'Daily Quest', stat: 'STR', xp: 15, gold: 10, completed: false },
    { id: 'dh_mandi_pagi', timeSlot: 'Pagi', title: 'Mandi pagi', category: 'Daily Quest', stat: 'CHR', xp: 15, gold: 15, completed: false },
    { id: 'dh_skincare_pagi', timeSlot: 'Pagi', title: 'Skincare mosturizer dan sunscreen', category: 'Daily Quest', stat: 'CHR', xp: 20, gold: 15, completed: false },
    { id: 'dh_podcast_self', timeSlot: 'Siang', title: 'Podcast self improvement', category: 'Daily Quest', stat: 'WIS', xp: 20, gold: 15, completed: false },
    { id: 'dh_zuhur', timeSlot: 'Siang', title: 'Shalat Zuhur', category: 'Daily Quest', stat: 'WIS', xp: 20, gold: 15, completed: false },
    { id: 'dh_makan_siang', timeSlot: 'Siang', title: 'Makan siang', category: 'Daily Quest', stat: 'STR', xp: 15, gold: 10, completed: false },
    { id: 'dh_youtube_english', timeSlot: 'Siang', title: 'YouTube podcast english', category: 'Daily Quest', stat: 'INT', xp: 20, gold: 15, completed: false },
    { id: 'dh_brainstorm_gpt', timeSlot: 'Siang', title: 'Brainstorm dengan chatgpt, latihan berbicara bahasa inggris atau jepang', category: 'Daily Quest', stat: 'CHR', xp: 30, gold: 25, completed: false },
    { id: 'dh_belajar_karir', timeSlot: 'Siang', title: 'Belajar persiapan karir', category: 'Daily Quest', stat: 'INT', xp: 35, gold: 30, completed: false },
    { id: 'dh_ashar', timeSlot: 'Sore', title: 'Shalat Ashar', category: 'Daily Quest', stat: 'WIS', xp: 20, gold: 15, completed: false },
    { id: 'dh_dzikir_sore', timeSlot: 'Sore', title: 'Dzikir sore', category: 'Daily Quest', stat: 'WIS', xp: 20, gold: 15, completed: false },
    { id: 'dh_angkat_beban_sore', timeSlot: 'Sore', title: 'Angkat beban sore', category: 'Daily Quest', stat: 'STR', xp: 30, gold: 25, completed: false },
    { id: 'dh_mandi_sore', timeSlot: 'Sore', title: 'Mandi sore', category: 'Daily Quest', stat: 'CHR', xp: 15, gold: 15, completed: false },
    { id: 'dh_magrib', timeSlot: 'Malam', title: 'Shalat Magrib', category: 'Daily Quest', stat: 'WIS', xp: 20, gold: 15, completed: false },
    { id: 'dh_makan_malam', timeSlot: 'Malam', title: 'Makan malam', category: 'Daily Quest', stat: 'STR', xp: 15, gold: 10, completed: false },
    { id: 'dh_isya', timeSlot: 'Malam', title: 'Shalat Isya', category: 'Daily Quest', stat: 'WIS', xp: 20, gold: 15, completed: false },
    { id: 'dh_no_sugar', timeSlot: 'Malam', title: 'No sugar', category: 'Daily Quest', stat: 'STR', xp: 30, gold: 25, completed: false },
    { id: 'dh_plank_situp', timeSlot: 'Malam', title: 'Plank sit-up', category: 'Daily Quest', stat: 'STR', xp: 25, gold: 20, completed: false },
    { id: 'dh_skincare_malam', timeSlot: 'Malam', title: 'Gosok gigi facial wash moisturizer', category: 'Daily Quest', stat: 'CHR', xp: 20, gold: 15, completed: false }
];

const DEFAULT_RECOVERY_QUESTS = [
    { id: 'rec_walk', timeSlot: 'Sore', title: 'Jalan Santai 30 Menit', category: 'Recovery Quest', stat: 'WIS', xp: 15, gold: 10, hpHeal: 20, completed: false },
    { id: 'rec_sleep', timeSlot: 'Malam', title: 'Tidur Berkualitas 7–8 Jam', category: 'Recovery Quest', stat: 'STR', xp: 20, gold: 15, hpHeal: 25, completed: false },
    { id: 'rec_stretch', timeSlot: 'Pagi', title: 'Stretching 15 Menit', category: 'Recovery Quest', stat: 'STR', xp: 15, gold: 10, hpHeal: 15, completed: false }
];

const RELIC_DURATION_MS = 24 * 60 * 60 * 1000; // 24 Jam (Sementara)

const ARMORY_RELICS_CATALOG = [
    {
        id: 'rel_chronos',
        name: 'Chronos Hourglass (24 Jam)',
        slot: 'Tome/Tool',
        cost: 900,
        durationHours: 24,
        icon: '⏳',
        buffDesc: '[24 Jam] +15% EXP & +10% INT Stat XP dari semua aktivitas',
        xpBonus: 0.15,
        goldBonus: 0,
        statBonus: { INT: 0.10 }
    },
    {
        id: 'rel_grimoire',
        name: "Scholar's Grimoire (24 Jam)",
        slot: 'Tome/Tool',
        cost: 1000,
        durationHours: 24,
        icon: '📖',
        buffDesc: '[24 Jam] +12% EXP & +15% INT/WIS Stat XP saat belajar & fokus',
        xpBonus: 0.12,
        goldBonus: 0,
        statBonus: { INT: 0.15, WIS: 0.15 }
    },
    {
        id: 'rel_dumbbell',
        name: 'Iron Dumbbell Emblem (24 Jam)',
        slot: 'Accessory',
        cost: 950,
        durationHours: 24,
        icon: '🏋️',
        buffDesc: '[24 Jam] +25% STR Stat XP & +10 Max HP Sementara',
        xpBonus: 0,
        goldBonus: 0,
        bonusMaxHp: 10,
        statBonus: { STR: 0.25 }
    },
    {
        id: 'rel_coin_pouch',
        name: "Merchant's Coin Pouch (24 Jam)",
        slot: 'Relic',
        cost: 1100,
        durationHours: 24,
        icon: '💰',
        buffDesc: '[24 Jam] +20% Gold dari semua Quest & Dungeon +15% CHR Stat XP',
        xpBonus: 0,
        goldBonus: 0.20,
        statBonus: { CHR: 0.15 }
    }
];

const CYBER_AVATARS_CATALOG = [
    {
        id: 'av_shadow_monarch',
        name: 'Shadow Monarch',
        svg: `<svg viewBox="0 0 64 64" width="100%" height="100%"><defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#06b6d4"/><stop offset="100%" stop-color="#7c3aed"/></linearGradient></defs><rect width="64" height="64" fill="#090d16"/><circle cx="32" cy="32" r="26" fill="url(#g1)" opacity="0.22"/><path d="M18 48 C18 38, 46 38, 46 48" fill="#1e1b4b" stroke="#38bdf8" stroke-width="2"/><circle cx="32" cy="25" r="10" fill="#0f172a" stroke="#22d3ee" stroke-width="2"/><path d="M22 22 L32 13 L42 22" fill="none" stroke="#a855f7" stroke-width="2.2"/><circle cx="28.5" cy="25" r="1.8" fill="#00f0ff"/><circle cx="35.5" cy="25" r="1.8" fill="#00f0ff"/></svg>`
    },
    {
        id: 'av_cyber_knight',
        name: 'Cyber Paladin',
        svg: `<svg viewBox="0 0 64 64" width="100%" height="100%"><rect width="64" height="64" fill="#0a111e"/><polygon points="32,8 50,18 46,44 32,56 18,44 14,18" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/><path d="M22 26 H42 L39 33 H25 Z" fill="#00f0ff" opacity="0.85"/><path d="M32 12 V22 M26 17 H38" stroke="#fbbf24" stroke-width="2"/></svg>`
    },
    {
        id: 'av_arcane_sage',
        name: 'Arcane Scholar',
        svg: `<svg viewBox="0 0 64 64" width="100%" height="100%"><rect width="64" height="64" fill="#120b24"/><circle cx="32" cy="32" r="24" fill="none" stroke="#c084fc" stroke-width="1.5" stroke-dasharray="4 3"/><polygon points="32,12 48,38 16,38" fill="none" stroke="#22d3ee" stroke-width="2"/><circle cx="32" cy="30" r="6" fill="#a855f7"/><circle cx="32" cy="30" r="2.5" fill="#fde047"/></svg>`
    },
    {
        id: 'av_crimson_berserker',
        name: 'Crimson Vanguard',
        svg: `<svg viewBox="0 0 64 64" width="100%" height="100%"><rect width="64" height="64" fill="#180a12"/><path d="M16 16 L26 24 L20 34 Z M48 16 L38 24 L44 34 Z" fill="#f43f5e"/><circle cx="32" cy="33" r="13" fill="#0f172a" stroke="#fb7185" stroke-width="2.2"/><path d="M25 31 L30 34 L25 36 Z M39 31 L34 34 L39 36 Z" fill="#fda4af"/><path d="M26 42 H38" stroke="#f43f5e" stroke-width="2.2"/></svg>`
    },
    {
        id: 'av_emerald_ranger',
        name: 'Verdant Strider',
        svg: `<svg viewBox="0 0 64 64" width="100%" height="100%"><rect width="64" height="64" fill="#071713"/><path d="M32 10 L48 26 L42 50 H22 L16 26 Z" fill="#064e3b" stroke="#34d399" stroke-width="2"/><path d="M23 28 Q32 22 41 28 Q32 34 23 28 Z" fill="#6ee7b7"/><circle cx="32" cy="28" r="2.5" fill="#022c22"/></svg>`
    },
    {
        id: 'av_golden_sovereign',
        name: 'Solar Sovereign',
        svg: `<svg viewBox="0 0 64 64" width="100%" height="100%"><rect width="64" height="64" fill="#171207"/><circle cx="32" cy="32" r="22" fill="none" stroke="#fbbf24" stroke-width="2"/><path d="M18 24 L24 14 L32 21 L40 14 L46 24 Z" fill="#f59e0b" stroke="#fde68a" stroke-width="1.5"/><circle cx="32" cy="36" r="10" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/><circle cx="29" cy="35" r="1.6" fill="#fde047"/><circle cx="35" cy="35" r="1.6" fill="#fde047"/></svg>`
    }
];

const DEFAULT_STATE = {
    player: {
        name: 'Sung Jin-Woo',
        job: 'Shadow Monarch',
        level: 1,
        xp: 0,
        hp: 100,
        maxHp: 100,
        gold: 0,
        streak: 0,
        shields: 0,
        activeTitle: 't_novice',
        dungeonClears: 0,
        dungeonMinutesTotal: 0,
        longestStreak: 0,
        avatarType: 'svg',
        avatarId: 'av_shadow_monarch',
        avatarCustomDataUrl: null,
        stats: { STR: 1, INT: 1, WIS: 1, CHR: 1 },
        statXp: { STR: 0, INT: 0, WIS: 0, CHR: 0 }
    },
    tavern: {
        activeUntil: null,
        weekKey: null,
        usedThisWeek: false
    },
    streakThresholdPct: 80,
    armory: {
        owned: [],
        expiresAt: {},
        equipped: {
            'Tome/Tool': null,
            'Accessory': null,
            'Relic': null
        }
    },
    quests: [
        ...JSON.parse(JSON.stringify(DEFAULT_DAILY_HABITS)),
        {
            id: 'q_main_1',
            timeSlot: 'Fleksibel',
            title: 'Selesaikan Modul Utama Proyek / Target Mingguan',
            category: 'Main Quest',
            stat: 'INT',
            xp: 90,
            gold: 75,
            completed: false
        },
        {
            id: 'q_boss_1',
            timeSlot: 'Fleksibel',
            title: 'Presentasi Penting / Taklukkan Tantangan Terberat Minggu Ini',
            category: 'Boss Fight',
            stat: 'CHR',
            xp: 150,
            gold: 120,
            completed: false
        }
    ],
    shop: [
        {
            id: 's1',
            title: 'Minor Health Potion (+25% Max HP)',
            cost: 120,
            type: 'potion',
            healPct: 0.25,
            desc: 'Memulihkan 25% Max HP secara instan.'
        },
        {
            id: 's_elixir',
            title: 'Elixir of Vitality (+100% Max HP)',
            cost: 350,
            type: 'elixir',
            healPct: 1.0,
            desc: 'Memulihkan HP hingga penuh (100% Max HP) dalam kondisi darurat.'
        },
        {
            id: 's2',
            title: 'Kopi Favorit / Minuman Spesial',
            cost: 200,
            type: 'reward',
            desc: 'Reward dunia nyata untuk menyegarkan pikiran.'
        },
        {
            id: 's3',
            title: 'Streak Freeze (Pelindung Streak • Maks 2)',
            cost: 400,
            type: 'shield',
            desc: 'Otomatis menahan Streak saat terlewat (Maksimal stok 2 di inventori).'
        },
        {
            id: 's4',
            title: '1 Jam Main Game Tanpa Rasa Bersalah',
            cost: 300,
            type: 'reward',
            desc: 'Waktu santai bebas penalti setelah bekerja keras.'
        }
    ],
    history: {
        dailyCounts: {},
        logs: []
    },
    redeemHistory: [],
    customQuotes: [],
    lastOracleClaimDate: null,
    selectedDate: null,
    lastRealDate: null,
    muted: false,
    ambientMode: 'none'
};

const TITLES_CATALOG = [
    {
        id: 't_novice',
        name: 'Shadow Candidate',
        reqText: 'Gelar awal Hunter yang baru bangkit',
        buffText: 'Status Standar (1.0x)',
        xpBonus: 0,
        goldBonus: 0,
        checkUnlocked: () => true
    },
    {
        id: 't_wolf',
        name: 'Wolf Slayer',
        reqText: 'Capai Streak Harian minimal 7 Hari berturut-turut',
        buffText: '+10% Bonus Gold dari semua misi',
        xpBonus: 0,
        goldBonus: 0.10,
        checkUnlocked: (state) => state.player.streak >= 7
    },
    {
        id: 't_iron',
        name: 'Iron Will',
        reqText: 'Selesaikan minimal 5x Deep Focus Dungeon',
        buffText: '+10% Bonus XP dari semua misi',
        xpBonus: 0.10,
        goldBonus: 0,
        checkUnlocked: (state) => (state.player.dungeonClears || 0) >= 5
    },
    {
        id: 't_monarch',
        name: 'Monarch of Shadows',
        reqText: 'Capai Level 15 atau total Level atribut >= 60',
        buffText: '+15% XP & +15% Gold Permanen',
        xpBonus: 0.15,
        goldBonus: 0.15,
        checkUnlocked: (state) => {
            const s = state.player.stats;
            return state.player.level >= 15 || (s.STR + s.INT + s.WIS + s.CHR) >= 60;
        }
    }
];

const SYSTEM_QUOTES_CATALOG = [
    { text: "Kamu tidak naik ke level tujuanmu. Kamu jatuh ke level sistemmu.", author: "James Clear (Atomic Habits)", tag: "system" },
    { text: "Setiap tindakan yang kamu ambil adalah suara untuk tipe orang yang kamu inginkan.", author: "James Clear", tag: "system" },
    { text: "Kita adalah apa yang kita lakukan berulang kali. Keunggulan bukanlah tindakan, melainkan kebiasaan.", author: "Aristoteles", tag: "system" },
    { text: "Disiplin adalah memilih antara apa yang kamu inginkan sekarang dan apa yang paling kamu inginkan.", author: "Abraham Lincoln", tag: "system" },
    { text: "Orang yang menaklukkan dirinya sendiri adalah pejuang yang paling perkasa.", author: "Konfusius", tag: "system" },
    { text: "Mulailah dari tempatmu berada. Gunakan apa yang kamu miliki. Lakukan apa yang kamu bisa.", author: "Arthur Ashe", tag: "system" },
    { text: "Kemampuan untuk melakukan Deep Work semakin langka, dan pada saat yang sama semakin berharga.", author: "Cal Newport (Deep Work)", tag: "focus" },
    { text: "Pejuang yang sukses adalah manusia biasa dengan fokus setajam laser.", author: "Bruce Lee", tag: "focus" },
    { text: "Ketenangan pikiran adalah puncak dari penguasaan diri.", author: "Marcus Aurelius", tag: "focus" },
    { text: "Bukan karena waktu kita singkat, melainkan karena kita banyak menyia-nyiakannya.", author: "Seneca", tag: "focus" },
    { text: "Hambatan di jalan bukan penghalang jalan; hambatan itu sendiri adalah jalannya.", author: "Marcus Aurelius", tag: "recovery" },
    { text: "Jatuh tujuh kali, bangkit delapan kali.", author: "Pepatah Jepang (Nanakorobi Yaoki)", tag: "recovery" },
    { text: "Kesuksesan bukanlah akhir, kegagalan bukanlah hal yang fatal: keberanian untuk terus melangkah itulah yang terpenting.", author: "Winston Churchill", tag: "recovery" },
    { text: "Jangan berdoa untuk hidup yang mudah, berdoalah untuk kekuatan agar mampu menanggung hidup yang sulit.", author: "Bruce Lee", tag: "recovery" }
];

let currentOracleIndex = 0;

function getAllQuotesPool() {
    const custom = (gameState.customQuotes || []).map(q => ({
        text: q.text,
        author: q.author,
        tag: 'custom'
    }));
    return [...custom, ...SYSTEM_QUOTES_CATALOG];
}

function inferQuestTimeSlot(quest) {
    if (quest.timeSlot) return quest.timeSlot;
    const found = DEFAULT_DAILY_HABITS.find(d => d.title === quest.title);
    if (found && found.timeSlot) return found.timeSlot;
    return quest.category === 'Daily Quest' ? 'Pagi' : 'Fleksibel';
}

function initDemoHistory(state) {
    const today = new Date();
    const todayKey = formatDateKey(today);
    state.selectedDate = todayKey;
    state.lastRealDate = todayKey;
    state.lastStreakDate = null;
    state.history = {
        dailyCounts: {},
        logs: []
    };
    return state;
}

function formatDateKey(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function parseDateKey(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
}

function formatReadableDate(dateStr) {
    const d = parseDateKey(dateStr);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function getCurrentGameDateKey() {
    if (!gameState.selectedDate) {
        gameState.selectedDate = formatDateKey(new Date());
    }
    return gameState.selectedDate;
}

function recordActivityHistory(title, type, stat, xp, gold, questId = null) {
    if (!gameState.history) {
        gameState.history = { dailyCounts: {}, logs: [] };
    }
    const dateKey = getCurrentGameDateKey();
    gameState.history.dailyCounts[dateKey] = (gameState.history.dailyCounts[dateKey] || 0) + 1;

    gameState.history.logs.unshift({
        id: 'log_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
        questId: questId,
        title,
        type,
        stat,
        xp,
        gold,
        dateStr: dateKey
    });

    if (gameState.history.logs.length > 100) {
        gameState.history.logs = gameState.history.logs.slice(0, 100);
    }
}

let gameState = loadState();

// ==========================================
// SYSTEM ORACLE (MOTIVATIONAL QUOTES)
// ==========================================
function pickContextualOracleIndex() {
    const pool = getAllQuotesPool();
    if (pool.length === 0) return 0;

    let preferredTag = 'system';
    if (gameState.player.hp < 50 || gameState.player.streak === 0) {
        preferredTag = 'recovery';
    } else if (isDungeonRunning) {
        preferredTag = 'focus';
    }

    const matchingIndices = [];
    pool.forEach((q, idx) => {
        if (q.tag === preferredTag || q.tag === 'custom') matchingIndices.push(idx);
    });

    const todayKey = getCurrentGameDateKey();
    let hash = 0;
    for (let i = 0; i < todayKey.length; i++) {
        hash = (hash * 31 + todayKey.charCodeAt(i)) % 100000;
    }

    if (matchingIndices.length > 0) {
        return matchingIndices[hash % matchingIndices.length];
    }
    return hash % pool.length;
}

function renderOracle() {
    const pool = getAllQuotesPool();
    if (pool.length === 0) return;
    if (currentOracleIndex >= pool.length) currentOracleIndex = 0;

    const q = pool[currentOracleIndex];
    const textEl = document.getElementById('oracle-quote-text');
    const authorEl = document.getElementById('oracle-quote-author');
    const tagEl = document.getElementById('oracle-context-tag');
    const claimBtn = document.getElementById('btn-claim-oracle');

    if (textEl) textEl.textContent = `"${q.text}"`;
    if (authorEl) authorEl.textContent = `— ${q.author}`;
    if (tagEl) {
        const tagLabels = {
            system: 'DAILY DOCTRINE',
            focus: 'FOCUS PROTOCOL',
            recovery: 'IRON RESILIENCE',
            custom: 'PERSONAL DOCTRINE'
        };
        tagEl.textContent = tagLabels[q.tag] || 'DAILY DOCTRINE';
    }

    const todayStr = getCurrentGameDateKey();
    const claimedToday = gameState.lastOracleClaimDate === todayStr;
    if (claimBtn) {
        if (claimedToday) {
            claimBtn.textContent = '✓ Petuah Diterima Hari Ini';
            claimBtn.style.opacity = '0.6';
            claimBtn.disabled = true;
        } else {
            claimBtn.textContent = '✨ Terima Petuah (+5 XP / +5 G)';
            claimBtn.style.opacity = '1';
            claimBtn.disabled = false;
        }
    }
}

function nextOracleQuote() {
    SoundFX.playClick();
    const pool = getAllQuotesPool();
    if (pool.length <= 1) return;
    currentOracleIndex = (currentOracleIndex + 1) % pool.length;
    renderOracle();
}

function claimDailyOracle() {
    const todayStr = getCurrentGameDateKey();
    if (gameState.lastOracleClaimDate === todayStr) return;
    SoundFX.playQuestComplete();
    gameState.lastOracleClaimDate = todayStr;
    addRewards(5, 5, 'WIS', 10, true);
    spawnFloatingReward('📜 Petuah Diterima: +5 XP | +5 Gold | +10 WIS XP');
    saveState();
    renderOracle();
}

function openAddQuoteModal() {
    SoundFX.playClick();
    document.getElementById('custom-quote-text').value = '';
    document.getElementById('custom-quote-author').value = '';
    openModal('modal-add-quote');
}

function handleAddCustomQuote(e) {
    e.preventDefault();
    const text = document.getElementById('custom-quote-text').value.trim();
    const author = document.getElementById('custom-quote-author').value.trim();
    if (!text || !author) return;

    if (!Array.isArray(gameState.customQuotes)) gameState.customQuotes = [];
    gameState.customQuotes.unshift({ text, author });
    currentOracleIndex = 0;
    SoundFX.playQuestComplete();
    closeModal('modal-add-quote');
    saveState();
    renderOracle();
    spawnFloatingReward('📜 Kutipan Pribadi Ditambahkan!');
}

let currentQuestFilter = 'ALL';
let currentTimeSlotFilter = 'ALL';
let currentQuestStatusFilter = 'ALL';
let questSearchQuery = '';
let shopSearchQuery = '';
let showAllHistoryLogs = false;

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            SoundFX.muted = !!parsed.muted;
            SoundFX.ambientMode = parsed.ambientMode || 'none';
            if (!parsed.history) {
                parsed.history = { dailyCounts: {}, logs: [] };
                initDemoHistory(parsed);
            }
            const realToday = formatDateKey(new Date());
            if (!parsed.selectedDate) parsed.selectedDate = realToday;
            if (!parsed.lastRealDate) parsed.lastRealDate = realToday;
            if (!parsed.player.activeTitle) parsed.player.activeTitle = 't_novice';
            if (!Array.isArray(parsed.redeemHistory)) parsed.redeemHistory = [];
            if (!Array.isArray(parsed.customQuotes)) parsed.customQuotes = [];
            if (!parsed.history.slotCombosClaimed) parsed.history.slotCombosClaimed = {};
            if (!Array.isArray(parsed.history.journals)) parsed.history.journals = [];
            if (!parsed.reminders) {
                parsed.reminders = { enabled: false, times: { Pagi: '07:30', Sore: '16:30', Malam: '20:30' }, lastFired: {} };
            }
            if (!parsed.treasury) {
                parsed.treasury = { transactions: [], dailyBonusCounts: {} };
            }
            if (!parsed.grimoireBookmarks) {
                parsed.grimoireBookmarks = {};
            }
            if (typeof parsed.lastOracleClaimDate === 'undefined') parsed.lastOracleClaimDate = null;
            if (typeof parsed.player.dungeonClears !== 'number') parsed.player.dungeonClears = 0;
            if (typeof parsed.player.dungeonMinutesTotal !== 'number') {
                parsed.player.dungeonMinutesTotal = (parsed.player.dungeonClears || 0) * 25;
            }
            if (typeof parsed.player.longestStreak !== 'number') {
                parsed.player.longestStreak = parsed.player.streak || 0;
            }
            if ((parsed.player.streak || 0) > parsed.player.longestStreak) {
                parsed.player.longestStreak = parsed.player.streak;
            }
            if (!parsed.player.avatarType) parsed.player.avatarType = 'svg';
            if (!parsed.player.avatarId) parsed.player.avatarId = 'av_shadow_monarch';
            if (!parsed.player.job) {
                const foundAv = CYBER_AVATARS_CATALOG.find(a => a.id === parsed.player.avatarId);
                parsed.player.job = (parsed.player.avatarType !== 'custom' && foundAv) ? foundAv.name : 'Shadow Monarch';
            }
            if (typeof parsed.player.avatarCustomDataUrl === 'undefined') parsed.player.avatarCustomDataUrl = null;
            if (!parsed.tavern) {
                parsed.tavern = { activeUntil: null, weekKey: null, usedThisWeek: false };
            }
            if (!parsed.armory) {
                parsed.armory = { owned: [], expiresAt: {}, equipped: { 'Tome/Tool': null, 'Accessory': null, 'Relic': null } };
            }
            if (!parsed.armory.equipped) {
                parsed.armory.equipped = { 'Tome/Tool': null, 'Accessory': null, 'Relic': null };
            }
            if (!parsed.armory.expiresAt) {
                parsed.armory.expiresAt = {};
            }
            if (typeof parsed.streakThresholdPct !== 'number' || parsed.streakThresholdPct < 10 || parsed.streakThresholdPct > 100) {
                parsed.streakThresholdPct = 80;
            }
            if (Array.isArray(parsed.quests)) {
                parsed.quests = parsed.quests.filter(q => q.category !== 'Recovery Quest');
            }
            if (typeof parsed.player.shields !== 'number') parsed.player.shields = 0;
            if (parsed.player.shields > 2) parsed.player.shields = 2;
            if (!parsed.player.statXp) {
                parsed.player.statXp = { STR: 0, INT: 0, WIS: 0, CHR: 0 };
                ['STR', 'INT', 'WIS', 'CHR'].forEach(st => {
                    const oldVal = parsed.player.stats[st] || 10;
                    parsed.player.stats[st] = Math.max(1, Math.min(100, oldVal >= 10 ? (oldVal - 9) : oldVal));
                });
            }
            if (Array.isArray(parsed.quests)) {
                parsed.quests.forEach(q => {
                    if (!q.timeSlot) q.timeSlot = inferQuestTimeSlot(q);
                });
            }
            if (Array.isArray(parsed.shop)) {
                const s1Item = parsed.shop.find(s => s.id === 's1');
                if (s1Item && s1Item.title === 'Health Potion (+30 HP)') {
                    s1Item.title = 'Minor Health Potion (+25% Max HP)';
                    s1Item.cost = 120;
                    s1Item.healPct = 0.25;
                    s1Item.desc = 'Memulihkan 25% Max HP secara instan.';
                }
                if (!parsed.shop.some(s => s.id === 's_elixir' || s.type === 'elixir')) {
                    const s1Idx = parsed.shop.findIndex(s => s.id === 's1');
                    const elixirObj = {
                        id: 's_elixir',
                        title: 'Elixir of Vitality (+100% Max HP)',
                        cost: 350,
                        type: 'elixir',
                        healPct: 1.0,
                        desc: 'Memulihkan HP hingga penuh (100% Max HP) dalam kondisi darurat.'
                    };
                    if (s1Idx >= 0) parsed.shop.splice(s1Idx + 1, 0, elixirObj);
                    else parsed.shop.unshift(elixirObj);
                }
            }
            return parsed;
        }
    } catch (e) {
        console.error('Gagal memuat state:', e);
    }
    return initDemoHistory(JSON.parse(JSON.stringify(DEFAULT_STATE)));
}

function evaluateDailyTier(ratio, maxHp) {
    if (ratio >= 1.0) {
        return {
            rank: 'S-Rank (Perfect Clear)',
            penaltyRate: 0,
            rawDamage: 0,
            regenAmt: Math.round(maxHp * 0.15),
            resetStreak: false
        };
    } else if (ratio >= getStreakThresholdRatio()) {
        return {
            rank: 'A-Rank (Safe Clear)',
            penaltyRate: 0.10,
            rawDamage: Math.max(1, Math.round(maxHp * 0.10)),
            regenAmt: 0,
            resetStreak: false
        };
    } else if (ratio >= 0.5) {
        return {
            rank: 'B-Rank (Sluggish)',
            penaltyRate: 0.25,
            rawDamage: Math.max(1, Math.round(maxHp * 0.25)),
            regenAmt: 0,
            resetStreak: true
        };
    } else {
        return {
            rank: 'F-Rank (Critical Fail)',
            penaltyRate: 0.40,
            rawDamage: Math.max(1, Math.round(maxHp * 0.40)),
            regenAmt: 0,
            resetStreak: true
        };
    }
}

function checkRealDayRollover() {
    const realToday = formatDateKey(new Date());
    if (!gameState.lastRealDate) {
        gameState.lastRealDate = realToday;
        saveState();
        return;
    }

    if (gameState.lastRealDate !== realToday) {
        const prevDateObj = parseDateKey(gameState.lastRealDate);
        const todayDateObj = parseDateKey(realToday);
        const diffDays = Math.max(1, Math.round((todayDateObj - prevDateObj) / (1000 * 60 * 60 * 24)));

        const dailyQuests = gameState.quests.filter(q => q.category === 'Daily Quest' && isQuestActiveOnDate(q, gameState.lastRealDate));
        const doneCount = dailyQuests.filter(q => q.completed).length;
        const totalDaily = dailyQuests.length;
        const ratio = totalDaily > 0 ? (doneCount / totalDaily) : 1;
        const pct = Math.round(ratio * 100);

        // Reset semua Daily & Recovery Quest untuk hari baru
        gameState.quests.forEach(q => {
            if (q.category === 'Daily Quest') {
                q.completed = false;
                if (q.trackingType === 'count') q.currentCount = 0;
                delete q.lastReward;
            }
        });
        gameState.selectedDate = realToday;
        gameState.lastRealDate = realToday;
        gameState.lastStreakDate = null; // Wajib reset agar streak hari baru bisa naik

        // Jika melewati lebih dari 1 hari penuh tanpa buka aplikasi
        if (diffDays > 1) {
            const missedFullDays = diffDays - 1;
            const extraDamage = Math.round(gameState.player.maxHp * 0.40 * missedFullDays);
            if ((gameState.player.shields || 0) > 0 && gameState.player.streak > 0) {
                gameState.player.shields -= 1;
            } else {
                gameState.player.streak = 0;
            }
            takeDamage(extraDamage);
        }

        syncPlayerMaxHp();
        const tier = evaluateDailyTier(ratio, gameState.player.maxHp);

        if (tier.rawDamage > 0) {
            let shieldMsg = '';
            if (tier.resetStreak) {
                if ((gameState.player.shields || 0) > 0 && gameState.player.streak > 0) {
                    gameState.player.shields -= 1;
                    shieldMsg = ` 🛡️ Streak Shield aktif! Streak ${gameState.player.streak} hari tetap aman (sisa Shield: ${gameState.player.shields}).`;
                } else {
                    gameState.player.streak = 0;
                    shieldMsg = ` Streak di-reset ke 0 karena progres kemarin di bawah ${getStreakThresholdPct()}%.`;
                }
            } else {
                shieldMsg = ` Streak ${gameState.player.streak} hari tetap terjaga (≥${getStreakThresholdPct()}%), namun tidak ada regen HP.`;
            }
            takeDamage(tier.rawDamage);
            const { wisDmgReduce } = getAttributePassives();
            const actualDmg = Math.max(1, Math.round(tier.rawDamage * (1 - wisDmgReduce)));
            setTimeout(() => {
                showSystemModal(
                    `PERGANTIAN HARI // ${tier.rank.toUpperCase()}`,
                    `Selamat datang kembali! Kemarin progres Daily Habit ${pct}% (${doneCount}/${totalDaily}) • Penalti ${Math.round(tier.penaltyRate * 100)}% Max HP (-${actualDmg} HP).${shieldMsg} Semua Daily Habit telah di-reset untuk hari ini!`
                );
            }, 500);
        } else {
            const healAmt = Math.min(tier.regenAmt, gameState.player.maxHp - gameState.player.hp);
            gameState.player.hp += healAmt;
            setTimeout(() => {
                spawnFloatingReward(`🌅 S-Rank Perfect Clear (100%)!${healAmt > 0 ? ` Regen +${healAmt} HP (+15% Max HP)` : ' HP Penuh'} • Streak: ${gameState.player.streak} Hari`);
            }, 500);
        }

        saveState();
        if (typeof renderAll === 'function') {
            renderAll();
        }
    }
}

function saveState() {
    try {
        gameState.muted = SoundFX.muted;
        gameState.ambientMode = SoundFX.ambientMode;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
        if (typeof syncAndroidHomeWidget === 'function') {
            syncAndroidHomeWidget();
        }
    } catch (e) {
        console.error('Gagal menyimpan state:', e);
    }
}

// ==========================================
// 4. CORE RPG CALCULATIONS & RANKING
// ==========================================
function getRequiredXP(level) {
    return Math.round(250 * Math.pow(level, 1.35));
}

function getTodayDailyXpEarned() {
    const todayKey = getCurrentGameDateKey();
    const logs = (gameState.history && Array.isArray(gameState.history.logs)) ? gameState.history.logs : [];
    return logs
        .filter(l => l.dateStr === todayKey && l.type === 'Daily Quest')
        .reduce((sum, l) => sum + (l.xp || 0), 0);
}

const RANKS_CATALOG = [
    {
        minLevel: 1,
        rankCode: 'E-RANK',
        name: 'Novice',
        title: 'E-Rank • Novice',
        perkText: 'Fase Awal Kebangkitan (Base Status)',
        style: 'color: #cbd5e1; background: rgba(51,65,85,0.45); border: 1px solid #475569;',
        accentColor: '#94a3b8'
    },
    {
        minLevel: 5,
        rankCode: 'D-RANK',
        name: 'Awakened',
        title: 'D-Rank • Awakened',
        perkText: 'Kebiasaan Mulai Terbentuk (+5% Fokus Motivasi)',
        style: 'color: #60a5fa; background: rgba(37,99,235,0.22); border: 1px solid rgba(59,130,246,0.55);',
        accentColor: '#60a5fa'
    },
    {
        minLevel: 10,
        rankCode: 'C-RANK',
        name: 'Vanguard',
        title: 'C-Rank • Vanguard',
        perkText: 'Disiplin Konsisten & Penakluk Daily Quest',
        style: 'color: #34d399; background: rgba(16,185,129,0.2); border: 1px solid rgba(16,185,129,0.5);',
        accentColor: '#34d399'
    },
    {
        minLevel: 15,
        rankCode: 'B-RANK',
        name: 'Strategist',
        title: 'B-Rank • Strategist',
        perkText: 'Penguasaan Sistem & Eksekusi Deep Work',
        style: 'color: #67e8f9; background: rgba(6,182,212,0.2); border: 1px solid rgba(6,182,212,0.55);',
        accentColor: '#22d3ee'
    },
    {
        minLevel: 25,
        rankCode: 'A-RANK',
        name: 'Commander',
        title: 'A-Rank • Commander',
        perkText: 'Elit Produktivitas & Ketahanan Mental Tinggi',
        style: 'color: #d8b4fe; background: rgba(168,85,247,0.22); border: 1px solid rgba(168,85,247,0.55);',
        accentColor: '#c084fc'
    },
    {
        minLevel: 35,
        rankCode: 'S-RANK',
        name: 'Sovereign',
        title: 'S-Rank • Sovereign',
        perkText: 'Puncak Kekuatan Hunter (Shadow Monarch)',
        style: 'color: #fcd34d; background: rgba(245,158,11,0.22); border: 1px solid rgba(251,191,36,0.6); box-shadow: 0 0 10px rgba(251,191,36,0.25);',
        accentColor: '#fbbf24'
    }
];

function getPlayerRank(level) {
    let current = RANKS_CATALOG[0];
    let next = null;
    for (let i = 0; i < RANKS_CATALOG.length; i++) {
        if (level >= RANKS_CATALOG[i].minLevel) {
            current = RANKS_CATALOG[i];
            next = RANKS_CATALOG[i + 1] || null;
        }
    }
    return { ...current, next };
}

function openRankRoadmapModal() {
    SoundFX.playClick();
    const listEl = document.getElementById('rank-roadmap-list');
    if (!listEl) return;
    const curLvl = gameState.player.level;
    const currentRank = getPlayerRank(curLvl);

    listEl.innerHTML = RANKS_CATALOG.map((r, idx) => {
        const nextTier = RANKS_CATALOG[idx + 1];
        const rangeLabel = nextTier ? `Lv.${r.minLevel} – Lv.${nextTier.minLevel - 1}` : `Lv.${r.minLevel}+`;
        const isUnlocked = curLvl >= r.minLevel;
        const isCurrent = r.minLevel === currentRank.minLevel;

        const cardBorder = isCurrent
            ? 'background: rgba(168,85,247,0.16); border: 1px solid #c084fc; box-shadow: 0 0 12px rgba(168,85,247,0.2);'
            : (isUnlocked
                ? 'background: rgba(15,23,42,0.9); border: 1px solid #334155;'
                : 'background: rgba(2,6,23,0.65); border: 1px solid #1e293b; opacity: 0.62;');

        return `
            <div style="padding: 0.7rem 0.8rem; border-radius: 0.75rem; ${cardBorder}">
                <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-1-5">
                        <span style="font-size: 0.85rem;">${isCurrent ? '🔥' : (isUnlocked ? '✅' : '🔒')}</span>
                        <span class="font-display" style="font-weight: 800; font-size: 0.85rem; color: ${r.accentColor};">${r.title.toUpperCase()}</span>
                    </div>
                    <span class="font-display" style="font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 9999px; background: rgba(15,23,42,0.95); color: ${isUnlocked ? '#67e8f9' : '#64748b'}; border: 1px solid #334155;">
                        ${rangeLabel}
                    </span>
                </div>
                <p style="font-size: 11px; color: #cbd5e1; margin-top: 4px;">${r.perkText}</p>
                ${isCurrent ? `<span class="font-display" style="display: inline-block; margin-top: 4px; font-size: 9px; font-weight: 800; color: #34d399; text-transform: uppercase; letter-spacing: 0.06em;">★ RANK KAMU SAAT INI</span>` : ''}
            </div>
        `;
    }).join('');

    if (typeof applyAppLanguage === 'function') applyAppLanguage();
    openModal('modal-rank-roadmap');
}

function getStreakMultiplier() {
    const bonus = Math.min(gameState.player.streak * 0.05, 0.5);
    return +(1 + bonus).toFixed(2);
}

function getActiveTitleObj() {
    return TITLES_CATALOG.find(t => t.id === gameState.player.activeTitle) || TITLES_CATALOG[0];
}

const MAX_STAT_LEVEL = 100;

function getRequiredStatXP(statLevel) {
    return Math.max(100, statLevel * 100);
}

function getQuestStatXpGain(questOrCategory) {
    const cat = typeof questOrCategory === 'string' ? questOrCategory : (questOrCategory.category || 'Daily Quest');
    const baseXp = typeof questOrCategory === 'object' ? (questOrCategory.xp || 20) : 20;
    if (cat === 'Boss Fight') return 100;
    if (cat === 'Main Quest') return 50;
    if (baseXp >= 30) return 25;
    return 15;
}

function getStatTierInfo(maxStatVal) {
    if (maxStatVal < 20) return { cap: 20, tier: 'Rank E' };
    if (maxStatVal < 40) return { cap: 40, tier: 'Rank D' };
    if (maxStatVal < 60) return { cap: 60, tier: 'Rank C' };
    if (maxStatVal < 80) return { cap: 80, tier: 'Rank B' };
    return { cap: MAX_STAT_LEVEL, tier: 'Rank S' };
}

function getStreakThresholdPct() {
    const val = Number(typeof gameState !== 'undefined' && gameState ? gameState.streakThresholdPct : 80);
    if (!Number.isFinite(val) || val < 10 || val > 100) return 80;
    return Math.round(val);
}

function getStreakThresholdRatio() {
    return getStreakThresholdPct() / 100;
}

function updateStreakThreshold(rawVal) {
    let num = Math.round(Number(rawVal));
    if (!Number.isFinite(num)) num = 80;
    num = Math.max(10, Math.min(100, num));
    gameState.streakThresholdPct = num;

    // Recalculate today's streak credit immediately if quests are already checked
    const todayKey = getCurrentGameDateKey();
    const dailyQuests = gameState.quests.filter(item => item.category === 'Daily Quest' && isQuestActiveOnDate(item, todayKey));
    const doneCount = dailyQuests.filter(item => item.completed).length;
    const ratio = dailyQuests.length > 0 ? (doneCount / dailyQuests.length) : 0;

    if (ratio >= getStreakThresholdRatio() && dailyQuests.length > 0 && gameState.lastStreakDate !== todayKey) {
        gameState.player.streak = (gameState.player.streak || 0) + 1;
        if (gameState.player.streak > (gameState.player.longestStreak || 0)) {
            gameState.player.longestStreak = gameState.player.streak;
        }
        gameState.lastStreakDate = todayKey;
    } else if (ratio < getStreakThresholdRatio() && gameState.lastStreakDate === todayKey) {
        gameState.player.streak = Math.max(0, (gameState.player.streak || 1) - 1);
        gameState.lastStreakDate = null;
    }

    saveState();
    renderAll();
    syncSystemReminders();
    if (typeof SoundFX !== 'undefined' && SoundFX.playClick) SoundFX.playClick();
    spawnFloatingReward(`🎯 Target Minimal Streak diatur ke ${num}%!`);
}

function syncArmoryExpirations() {
    if (!gameState || !gameState.armory) return;
    if (!gameState.armory.expiresAt) gameState.armory.expiresAt = {};
    const now = Date.now();
    let changed = false;

    (gameState.armory.owned || []).forEach(id => {
        if (!gameState.armory.expiresAt[id]) {
            gameState.armory.expiresAt[id] = now + RELIC_DURATION_MS;
            changed = true;
        }
    });

    const validOwned = [];
    (gameState.armory.owned || []).forEach(id => {
        const exp = gameState.armory.expiresAt[id] || 0;
        if (exp > now) {
            validOwned.push(id);
        } else {
            delete gameState.armory.expiresAt[id];
            changed = true;
        }
    });
    gameState.armory.owned = validOwned;

    if (gameState.armory.equipped) {
        Object.keys(gameState.armory.equipped).forEach(slot => {
            const eqId = gameState.armory.equipped[slot];
            if (eqId && !validOwned.includes(eqId)) {
                gameState.armory.equipped[slot] = null;
                changed = true;
            }
        });
    }
    if (changed && typeof syncPlayerMaxHp === 'function') {
        syncPlayerMaxHp();
    }
}

function formatRemainingRelicTime(expiresAt) {
    const remMs = Math.max(0, expiresAt - Date.now());
    const totalMins = Math.ceil(remMs / 60000);
    const hrs = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    if (hrs > 0) return `${hrs}j ${mins}m`;
    return `${mins}m`;
}

function getEquippedRelics() {
    syncArmoryExpirations();
    const eq = (gameState.armory && gameState.armory.equipped) || {};
    return Object.values(eq)
        .filter(Boolean)
        .map(id => ARMORY_RELICS_CATALOG.find(r => r.id === id))
        .filter(Boolean);
}

function getRelicPassiveBonuses() {
    const relics = getEquippedRelics();
    let xpBonus = 0;
    let goldBonus = 0;
    let bonusMaxHp = 0;
    const statMult = { STR: 0, INT: 0, WIS: 0, CHR: 0 };

    relics.forEach(r => {
        xpBonus += (r.xpBonus || 0);
        goldBonus += (r.goldBonus || 0);
        bonusMaxHp += (r.bonusMaxHp || 0);
        if (r.statBonus) {
            Object.keys(r.statBonus).forEach(st => {
                if (statMult[st] !== undefined) statMult[st] += r.statBonus[st];
            });
        }
    });

    return { relics, xpBonus, goldBonus, bonusMaxHp, statMult };
}

function getAttributePassives() {
    const s = gameState.player.stats;
    const relicBuffs = getRelicPassiveBonuses();
    const bonusMaxHp = Math.max(0, (s.STR - 1) * 3) + relicBuffs.bonusMaxHp;
    const effectiveMaxHp = 100 + bonusMaxHp;
    const intXpBonus = Math.min(0.40, Math.max(0, (s.INT - 1) * 0.008));
    const wisDmgReduce = Math.min(0.40, Math.max(0, (s.WIS - 1) * 0.008));
    const chrShopDiscount = Math.min(0.25, Math.max(0, Math.floor((s.CHR - 1) / 2) * 0.01));
    return { bonusMaxHp, effectiveMaxHp, intXpBonus, wisDmgReduce, chrShopDiscount, relicBuffs };
}

function syncPlayerMaxHp() {
    const { effectiveMaxHp } = getAttributePassives();
    const oldMax = gameState.player.maxHp || 100;
    gameState.player.maxHp = effectiveMaxHp;
    if (effectiveMaxHp > oldMax) {
        gameState.player.hp = Math.min(effectiveMaxHp, gameState.player.hp + (effectiveMaxHp - oldMax));
    } else if (gameState.player.hp > effectiveMaxHp) {
        gameState.player.hp = effectiveMaxHp;
    }
}

function getHpCondition() {
    syncPlayerMaxHp();
    const ratio = gameState.player.maxHp > 0 ? (gameState.player.hp / gameState.player.maxHp) : 1;
    if (ratio >= getStreakThresholdRatio()) {
        return {
            label: 'PRIMA (+10%)',
            xpMod: 0.10,
            goldMod: 0.10,
            style: 'background: rgba(16,185,129,0.18); color: #34d399; border: 1px solid rgba(16,185,129,0.45);'
        };
    }
    if (ratio < 0.30) {
        return {
            label: 'FATIGUE (-20% EXP)',
            xpMod: -0.20,
            goldMod: -0.15,
            style: 'background: rgba(244,63,94,0.22); color: #fda4af; border: 1px solid rgba(244,63,94,0.55);'
        };
    }
    return {
        label: 'STABIL (1.0x)',
        xpMod: 0,
        goldMod: 0,
        style: 'background: rgba(56,189,248,0.15); color: #7dd3fc; border: 1px solid rgba(56,189,248,0.35);'
    };
}

function getDiscountedShopCost(baseCost) {
    const { chrShopDiscount } = getAttributePassives();
    return Math.max(5, Math.round(baseCost * (1 - chrShopDiscount)));
}

function addRewards(baseXp, baseGold, statType = null, statXpGain = 15, silentFloat = false) {
    const mult = getStreakMultiplier();
    const titleObj = getActiveTitleObj();
    const hpCond = getHpCondition();
    const passives = getAttributePassives();
    const relicBuffs = passives.relicBuffs;

    const totalXpMult = Math.max(0.25, mult + titleObj.xpBonus + hpCond.xpMod + passives.intXpBonus + relicBuffs.xpBonus);
    const totalGoldMult = Math.max(0.25, 1 + titleObj.goldBonus + hpCond.goldMod + relicBuffs.goldBonus);

    const finalXp = Math.round(baseXp * totalXpMult);
    const finalGold = Math.round(baseGold * totalGoldMult);

    const statBonusMult = (statType && relicBuffs.statMult[statType]) ? (1 + relicBuffs.statMult[statType]) : 1;
    const finalStatXpGain = Math.round(statXpGain * statBonusMult);

    gameState.player.xp += finalXp;
    gameState.player.gold += finalGold;

    let statLeveledUp = false;
    let newStatLvl = 1;
    if (statType && gameState.player.stats[statType] !== undefined) {
        if (!gameState.player.statXp) gameState.player.statXp = { STR: 0, INT: 0, WIS: 0, CHR: 0 };
        if (gameState.player.stats[statType] < MAX_STAT_LEVEL) {
            gameState.player.statXp[statType] = (gameState.player.statXp[statType] || 0) + finalStatXpGain;
            while (
                gameState.player.stats[statType] < MAX_STAT_LEVEL &&
                gameState.player.statXp[statType] >= getRequiredStatXP(gameState.player.stats[statType])
            ) {
                gameState.player.statXp[statType] -= getRequiredStatXP(gameState.player.stats[statType]);
                gameState.player.stats[statType] += 1;
                statLeveledUp = true;
                newStatLvl = gameState.player.stats[statType];
            }
            if (gameState.player.stats[statType] >= MAX_STAT_LEVEL) {
                gameState.player.stats[statType] = MAX_STAT_LEVEL;
                gameState.player.statXp[statType] = 0;
            }
        }
        syncPlayerMaxHp();
    }

    if (!silentFloat) {
        spawnFloatingReward(`+${finalXp} XP  |  +${finalGold} Gold${statType ? `  |  +${finalStatXpGain} ${statType} XP` : ''}`);
    }
    if (statLeveledUp && !silentFloat) {
        setTimeout(() => {
            spawnFloatingReward(`⚡ ${statType} NAIK KE LEVEL ${newStatLvl}!`);
        }, 450);
    }

    const prevRankTitle = getPlayerRank(gameState.player.level).title;
    let leveledUp = false;
    while (gameState.player.xp >= getRequiredXP(gameState.player.level)) {
        gameState.player.xp -= getRequiredXP(gameState.player.level);
        gameState.player.level += 1;
        syncPlayerMaxHp();
        gameState.player.hp = gameState.player.maxHp;
        leveledUp = true;
    }

    if (leveledUp) {
        setTimeout(() => {
            SoundFX.playLevelUp();
            const rank = getPlayerRank(gameState.player.level);
            const promoted = rank.title !== prevRankTitle;
            document.getElementById('levelup-new-lvl').textContent = `Level ${gameState.player.level}`;
            document.getElementById('levelup-new-rank').textContent = promoted
                ? `${rank.title} (🎉 RANK UP!)`
                : rank.title;
            openModal('modal-levelup');
        }, 400);
    }

    saveState();
    renderAll();

    return { finalXp, finalGold, statType, statXpGain: finalStatXpGain };
}

function revokeRewards(xpAmount, goldAmount, statType = null, statXpGain = 15) {
    gameState.player.gold = Math.max(0, gameState.player.gold - goldAmount);

    if (statType && gameState.player.stats[statType] !== undefined) {
        if (!gameState.player.statXp) gameState.player.statXp = { STR: 0, INT: 0, WIS: 0, CHR: 0 };
        let remStatXp = statXpGain;
        while (remStatXp > 0) {
            if ((gameState.player.statXp[statType] || 0) >= remStatXp) {
                gameState.player.statXp[statType] -= remStatXp;
                remStatXp = 0;
            } else if (gameState.player.stats[statType] > 1) {
                remStatXp -= (gameState.player.statXp[statType] || 0);
                gameState.player.stats[statType] -= 1;
                gameState.player.statXp[statType] = getRequiredStatXP(gameState.player.stats[statType]);
            } else {
                gameState.player.statXp[statType] = 0;
                remStatXp = 0;
            }
        }
        syncPlayerMaxHp();
    }

    let remainingToSubtract = xpAmount;
    while (remainingToSubtract > 0) {
        if (gameState.player.xp >= remainingToSubtract) {
            gameState.player.xp -= remainingToSubtract;
            remainingToSubtract = 0;
        } else if (gameState.player.level > 1) {
            remainingToSubtract -= gameState.player.xp;
            gameState.player.level -= 1;
            gameState.player.xp = getRequiredXP(gameState.player.level);
        } else {
            gameState.player.xp = 0;
            remainingToSubtract = 0;
        }
    }
}

function takeDamage(amount) {
    SoundFX.playDamage();
    syncPlayerMaxHp();
    const { wisDmgReduce } = getAttributePassives();
    const mitigatedDamage = Math.max(1, Math.round(amount * (1 - wisDmgReduce)));

    gameState.player.hp = Math.max(0, gameState.player.hp - mitigatedDamage);
    spawnFloatingReward(`⚠️ -${mitigatedDamage} HP!${mitigatedDamage < amount ? ` (WIS menahan ${amount - mitigatedDamage})` : ''}`);

    if (gameState.player.hp === 0) {
        const prevLevel = gameState.player.level;
        const levelLost = prevLevel > 1 ? 1 : 0;
        if (levelLost > 0) {
            gameState.player.level = prevLevel - 1;
            gameState.player.xp = 0;
        } else {
            gameState.player.xp = 0;
        }
        const lostGold = Math.floor(gameState.player.gold * 0.5);
        const prevStreak = gameState.player.streak || 0;

        gameState.player.gold = Math.max(0, gameState.player.gold - lostGold);
        gameState.player.streak = 0;
        gameState.lastStreakDate = null;
        gameState.player.hp = Math.round(gameState.player.maxHp * 0.5);

        const lvlMsg = levelLost > 0
            ? `Level turun (${prevLevel} → ${gameState.player.level})`
            : `Level bertahan di Lv.${gameState.player.level} (XP di-reset ke 0)`;

        showSystemModal(
            'KNOCKED OUT // HP = 0!',
            `Vitality habis total! Sistem memulihkan HP ke ${gameState.player.hp}/${gameState.player.maxHp} dengan penalti berat: ${lvlMsg}, -${lostGold} Gold (50%), dan Streak (${prevStreak} hari) di-reset ke 0. Selesaikan 100% Daily Quest atau beli Potion di Shop!`
        );
    }

    saveState();
    renderAll();
}

// ==========================================
// 5. UI RENDERING FUNCTIONS
// ==========================================
function renderAll() {
    renderOracle();
    renderStatus();
    populateDungeonLinkedQuests();
    renderHistory();
    renderQuests();
    renderShop();
    renderRedeemHistory();
    updateAudioIcon();
    updateAmbientButtonsUI();
    if (typeof renderReminderUI === 'function') renderReminderUI();
    if (typeof renderTreasury === 'function') renderTreasury();
    if (typeof renderGrimoireBookmarks === 'function') renderGrimoireBookmarks();
}

function renderStatus() {
    const p = gameState.player;
    const reqXp = getRequiredXP(p.level);
    const rank = getPlayerRank(p.level);
    const mult = getStreakMultiplier();

    document.getElementById('header-gold').textContent = p.gold;
    document.getElementById('header-streak').textContent = p.streak;
    const shieldWrap = document.getElementById('header-shield-wrap');
    const shieldCountEl = document.getElementById('header-shields');
    if (shieldWrap && shieldCountEl) {
        const shields = p.shields || 0;
        shieldCountEl.textContent = shields;
        if (shields > 0) shieldWrap.classList.remove('hidden');
        else shieldWrap.classList.add('hidden');
    }

    document.getElementById('player-name-display').textContent = p.name;
    const jobDisp = document.getElementById('player-job-display');
    if (jobDisp) jobDisp.textContent = p.job || 'Shadow Monarch';
    document.getElementById('player-level').textContent = p.level;

    const rankBadge = document.getElementById('player-rank-badge');
    rankBadge.textContent = rank.title;
    rankBadge.style.cssText = `font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 4px; cursor: pointer; ${rank.style}`;

    const rankNextLabel = document.getElementById('rank-next-label');
    const rankTargetLvl = document.getElementById('rank-target-lvl');
    const rankProgBar = document.getElementById('rank-progress-bar');
    if (rankNextLabel && rankTargetLvl && rankProgBar) {
        if (rank.next) {
            const lvlLeft = rank.next.minLevel - p.level;
            const spanTotal = Math.max(1, rank.next.minLevel - rank.minLevel);
            const spanDone = Math.max(0, p.level - rank.minLevel);
            const pctRank = Math.min(100, Math.max(8, Math.round((spanDone / spanTotal) * 100)));
            rankNextLabel.textContent = `${lvlLeft} Level lagi menuju ${rank.next.title.toUpperCase()}`;
            rankTargetLvl.textContent = `Lv.${p.level} / Lv.${rank.next.minLevel}`;
            rankProgBar.style.width = `${pctRank}%`;
        } else {
            rankNextLabel.textContent = '👑 RANK TERTINGGI TERCAPAI (S-RANK)';
            rankTargetLvl.textContent = `Lv.${p.level} (MAX)`;
            rankProgBar.style.width = '100%';
        }
    }

    const multBadge = document.getElementById('xp-multiplier-badge');
    if (mult > 1) {
        multBadge.textContent = `${mult}x XP`;
        multBadge.classList.remove('hidden');
    } else {
        multBadge.classList.add('hidden');
    }

    const hpCond = getHpCondition();
    const hpPct = Math.min(100, Math.round((p.hp / p.maxHp) * 100));
    document.getElementById('hp-text').textContent = `${p.hp} / ${p.maxHp}`;
    document.getElementById('hp-bar').style.width = `${hpPct}%`;
    const hpCondBadge = document.getElementById('hp-condition-badge');
    if (hpCondBadge) {
        hpCondBadge.textContent = hpCond.label;
        hpCondBadge.style.cssText = `font-size: 9px; font-weight: 700; padding: 1px 6px; border-radius: 4px; ${hpCond.style}`;
    }

    const xpPct = Math.min(100, Math.round((p.xp / reqXp) * 100));
    document.getElementById('xp-text').textContent = `${p.xp} / ${reqXp} XP`;
    document.getElementById('xp-bar').style.width = `${xpPct}%`;

    const maxCurrentStat = Math.max(p.stats.STR, p.stats.INT, p.stats.WIS, p.stats.CHR);
    const tierInfo = getStatTierInfo(maxCurrentStat);
    const scaleBadge = document.getElementById('stat-scale-badge');
    if (scaleBadge) {
        scaleBadge.textContent = `${tierInfo.tier} • Max Lv.${MAX_STAT_LEVEL}`;
    }

    if (!p.statXp) p.statXp = { STR: 0, INT: 0, WIS: 0, CHR: 0 };
    ['STR', 'INT', 'WIS', 'CHR'].forEach(stat => {
        const lvl = p.stats[stat] || 1;
        const curStatXp = p.statXp[stat] || 0;
        const reqStatXp = getRequiredStatXP(lvl);
        const isMax = lvl >= MAX_STAT_LEVEL;
        const barPct = isMax ? 100 : Math.min(100, Math.round((curStatXp / reqStatXp) * 100));
        document.getElementById(`stat-${stat}-val`).textContent = `Lv.${lvl}`;
        const xpLbl = document.getElementById(`stat-${stat}-xp`);
        if (xpLbl) xpLbl.textContent = isMax ? 'MAX LEVEL' : `${curStatXp} / ${reqStatXp} XP`;
        document.getElementById(`stat-${stat}-bar`).style.width = `${barPct}%`;
    });

    const passives = getAttributePassives();
    const pStrEl = document.getElementById('perk-STR-text');
    const pIntEl = document.getElementById('perk-INT-text');
    const pWisEl = document.getElementById('perk-WIS-text');
    const pChrEl = document.getElementById('perk-CHR-text');
    if (pStrEl) pStrEl.textContent = `Pasif: +${passives.bonusMaxHp} Max HP (Fisik & Vitality)`;
    if (pIntEl) pIntEl.textContent = `Pasif: +${(passives.intXpBonus * 100).toFixed(1)}% XP (Belajar & Fokus)`;
    if (pWisEl) pWisEl.textContent = `Pasif: -${(passives.wisDmgReduce * 100).toFixed(1)}% Damage Penalti (Mindfulness)`;
    if (pChrEl) pChrEl.textContent = `Pasif: Diskon Shop ${(passives.chrShopDiscount * 100).toFixed(0)}% (Relasi & Sosial)`;

    renderPlayerPortrait();
    updateRadarChart(p.stats, tierInfo.cap);
    renderAnalyticsMetrics();

    const activeTitle = getActiveTitleObj();
    const unlockedCount = TITLES_CATALOG.filter(t => t.checkUnlocked(gameState)).length;
    const titleNameEl = document.getElementById('active-title-name');
    const unlockedCountEl = document.getElementById('unlocked-titles-count');
    if (titleNameEl) titleNameEl.textContent = activeTitle.name;
    if (unlockedCountEl) unlockedCountEl.textContent = unlockedCount;
}

let currentRadarMode = 'ALL';

function setRadarChartMode(mode) {
    SoundFX.playClick();
    currentRadarMode = mode;
    const btnAll = document.getElementById('radar-toggle-all');
    const btn7d = document.getElementById('radar-toggle-7d');
    if (btnAll && btn7d) {
        if (mode === 'ALL') {
            btnAll.style.cssText = 'font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 0.4rem; background: rgba(6,182,212,0.25); color: #67e8f9; border: 1px solid rgba(34,211,238,0.5);';
            btn7d.style.cssText = 'font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 0.4rem; background: transparent; color: #94a3b8; border: 1px solid transparent;';
        } else {
            btn7d.style.cssText = 'font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 0.4rem; background: rgba(168,85,247,0.25); color: #e9d5ff; border: 1px solid rgba(192,132,252,0.55);';
            btnAll.style.cssText = 'font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 0.4rem; background: transparent; color: #94a3b8; border: 1px solid transparent;';
        }
    }
    const maxCurrentStat = Math.max(gameState.player.stats.STR, gameState.player.stats.INT, gameState.player.stats.WIS, gameState.player.stats.CHR);
    const tierInfo = getStatTierInfo(maxCurrentStat);
    updateRadarChart(gameState.player.stats, tierInfo.cap);
}

function getLast7DaysStatActivity() {
    const counts = { STR: 0, INT: 0, WIS: 0, CHR: 0 };
    const logs = (gameState.history && Array.isArray(gameState.history.logs)) ? gameState.history.logs : [];
    const baseDate = parseDateKey(getCurrentGameDateKey());
    const validDates = new Set();
    for (let i = 0; i < 7; i++) {
        const d = new Date(baseDate);
        d.setDate(baseDate.getDate() - i);
        validDates.add(formatDateKey(d));
    }
    logs.forEach(l => {
        if (validDates.has(l.dateStr) && l.stat && counts[l.stat] !== undefined) {
            counts[l.stat] += 1;
        }
    });
    return counts;
}

function updateRadarChart(stats, dynamicCap = 100) {
    const poly = document.getElementById('radar-data-poly');
    if (!poly) return;
    const cx = 120, cy = 92, maxR = 62;
    const subEl = document.getElementById('radar-mode-subtitle');

    let rSTR, rINT, rWIS, rCHR;
    if (currentRadarMode === '7D') {
        const counts = getLast7DaysStatActivity();
        const peak = Math.max(5, counts.STR, counts.INT, counts.WIS, counts.CHR);
        const norm7 = (v) => Math.min(1, Math.max(0.15, v / peak));
        rSTR = norm7(counts.STR) * maxR;
        rINT = norm7(counts.INT) * maxR;
        rWIS = norm7(counts.WIS) * maxR;
        rCHR = norm7(counts.CHR) * maxR;
        poly.setAttribute('fill', 'rgba(168, 85, 247, 0.26)');
        poly.setAttribute('stroke', '#c084fc');
        if (subEl) subEl.textContent = `Aktivitas 7 Hari (STR:${counts.STR} • INT:${counts.INT} • WIS:${counts.WIS} • CHR:${counts.CHR})`;
    } else {
        const maxVal = dynamicCap;
        const norm = (v) => Math.min(1, Math.max(0.15, v / maxVal));
        rSTR = norm(stats.STR) * maxR;
        rINT = norm(stats.INT) * maxR;
        rWIS = norm(stats.WIS) * maxR;
        rCHR = norm(stats.CHR) * maxR;
        poly.setAttribute('fill', 'rgba(0, 240, 255, 0.24)');
        poly.setAttribute('stroke', '#00f0ff');
        if (subEl) subEl.textContent = 'Distribusi Level Atribut (All-Time)';
    }

    const pSTR = `${cx},${(cy - rSTR).toFixed(1)}`;
    const pINT = `${(cx + rINT).toFixed(1)},${cy}`;
    const pWIS = `${cx},${(cy + rWIS).toFixed(1)}`;
    const pCHR = `${(cx - rCHR).toFixed(1)},${cy}`;

    poly.setAttribute('points', `${pSTR} ${pINT} ${pWIS} ${pCHR}`);
    document.getElementById('node-STR').setAttribute('cy', (cy - rSTR).toFixed(1));
    document.getElementById('node-INT').setAttribute('cx', (cx + rINT).toFixed(1));
    document.getElementById('node-WIS').setAttribute('cy', (cy + rWIS).toFixed(1));
    document.getElementById('node-CHR').setAttribute('cx', (cx - rCHR).toFixed(1));
}

function renderAnalyticsMetrics() {
    const p = gameState.player;
    if ((p.streak || 0) > (p.longestStreak || 0)) {
        p.longestStreak = p.streak;
    }
    const longestEl = document.getElementById('metric-longest-streak');
    if (longestEl) longestEl.textContent = `${p.longestStreak || p.streak || 0} Hari`;

    const totalMins = typeof p.dungeonMinutesTotal === 'number'
        ? p.dungeonMinutesTotal
        : ((p.dungeonClears || 0) * 25);
    const hoursEl = document.getElementById('metric-dungeon-hours');
    if (hoursEl) hoursEl.textContent = `${(totalMins / 60).toFixed(1)} Jam`;

    const rateEl = document.getElementById('metric-weekly-rate');
    if (rateEl) {
        const dailyQuests = gameState.quests.filter(q => q.category === 'Daily Quest' && isQuestActiveOnDate(q, getCurrentGameDateKey()));
        const totalDailyPerDay = Math.max(1, dailyQuests.length);
        const dailyCounts = (gameState.history && gameState.history.dailyCounts) || {};
        const baseDate = parseDateKey(getCurrentGameDateKey());
        const day = baseDate.getDay();
        const diffToMon = (day === 0 ? 6 : day - 1);
        const monday = new Date(baseDate);
        monday.setDate(baseDate.getDate() - diffToMon);

        let daysElapsed = diffToMon + 1;
        let completedSum = 0;
        for (let i = 0; i < daysElapsed; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            const key = formatDateKey(d);
            if (key === getCurrentGameDateKey()) {
                completedSum += dailyQuests.filter(q => q.completed).length;
            } else {
                completedSum += Math.min(totalDailyPerDay, dailyCounts[key] || 0);
            }
        }
        const targetSum = daysElapsed * totalDailyPerDay;
        const ratePct = Math.min(100, Math.round((completedSum / targetSum) * 100));
        rateEl.textContent = `${ratePct}%`;
    }
}

function renderPlayerPortrait() {
    const container = document.getElementById('player-portrait-render');
    if (!container || typeof gameState === 'undefined' || !gameState.player) return;

    const p = gameState.player;
    if (p.avatarType === 'custom' && p.avatarCustomDataUrl) {
        container.innerHTML = `<img src="${p.avatarCustomDataUrl}" alt="Hunter Avatar" style="width: 100%; height: 100%; object-fit: cover;">`;
    } else {
        const found = CYBER_AVATARS_CATALOG.find(a => a.id === p.avatarId) || CYBER_AVATARS_CATALOG[0];
        container.innerHTML = found ? found.svg : '';
    }
}

function openAvatarModal() {
    SoundFX.playClick();
    const grid = document.getElementById('avatar-preset-grid');
    if (grid) {
        const p = gameState.player;
        grid.innerHTML = CYBER_AVATARS_CATALOG.map(av => {
            const isSelected = p.avatarType !== 'custom' && p.avatarId === av.id;
            return `
                <button type="button" onclick="selectCyberAvatar('${av.id}')" style="padding: 0.45rem; border-radius: 0.75rem; background: ${isSelected ? 'rgba(6,182,212,0.22)' : 'rgba(15,23,42,0.85)'}; border: 1.5px solid ${isSelected ? '#22d3ee' : '#334155'}; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer;">
                    <div style="width: 3.1rem; height: 3.1rem; border-radius: 0.6rem; overflow: hidden; border: 1px solid rgba(255,255,255,0.12);">${av.svg}</div>
                    <span class="font-display truncate" style="font-size: 9px; font-weight: 700; color: ${isSelected ? '#67e8f9' : '#cbd5e1'}; max-width: 100%;">${av.name}</span>
                </button>
            `;
        }).join('');
    }
    openModal('modal-avatar-picker');
}

function selectCyberAvatar(avatarId) {
    SoundFX.playQuestComplete();
    gameState.player.avatarType = 'svg';
    gameState.player.avatarId = avatarId;
    const foundAv = CYBER_AVATARS_CATALOG.find(a => a.id === avatarId);
    if (foundAv) {
        gameState.player.job = foundAv.name;
    }
    saveState();
    renderStatus();
    openAvatarModal();
    spawnFloatingReward(`🎭 Avatar & Job: ${foundAv ? foundAv.name : 'Diperbarui'}!`);
}

function handleAvatarFileUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const SIZE = 160;
            canvas.width = SIZE;
            canvas.height = SIZE;
            const ctx = canvas.getContext('2d');
            const minSide = Math.min(img.width, img.height);
            const sx = (img.width - minSide) / 2;
            const sy = (img.height - minSide) / 2;
            ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, SIZE, SIZE);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.72);
            gameState.player.avatarType = 'custom';
            gameState.player.avatarCustomDataUrl = compressedDataUrl;
            SoundFX.playQuestComplete();
            saveState();
            renderPlayerPortrait();
            closeModal('modal-avatar-picker');
            spawnFloatingReward('📸 Foto Hunter Berhasil Diunggah & Dikompres!');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    event.target.value = '';
}

function renderHistory() {
    const heatmapEl = document.getElementById('habit-heatmap');
    const logListEl = document.getElementById('history-log-list');
    const totalBadgeEl = document.getElementById('total-completed-badge');
    const datePickerEl = document.getElementById('custom-date-picker');
    const dateLabelEl = document.getElementById('active-date-label');
    const logTitleEl = document.getElementById('history-log-title');
    const toggleAllBtn = document.getElementById('btn-toggle-all-logs');
    if (!heatmapEl || !logListEl) return;

    const activeDateStr = getCurrentGameDateKey();
    const todayStr = formatDateKey(new Date());
    const dailyCounts = gameState.history?.dailyCounts || {};
    const logs = gameState.history?.logs || [];

    if (datePickerEl) datePickerEl.value = activeDateStr;
    if (dateLabelEl) {
        dateLabelEl.textContent = activeDateStr === todayStr 
            ? `${formatReadableDate(activeDateStr)} (Hari Ini)` 
            : formatReadableDate(activeDateStr);
    }

    const totalDone = Object.values(dailyCounts).reduce((acc, val) => acc + val, 0);
    totalBadgeEl.textContent = `${totalDone} Selesai`;

    heatmapEl.innerHTML = '';
    const baseDate = parseDateKey(activeDateStr);
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    for (let i = 13; i >= 0; i--) {
        const d = new Date(baseDate);
        d.setDate(baseDate.getDate() - i);
        const key = formatDateKey(d);
        const count = dailyCounts[key] || 0;
        const isSelected = key === activeDateStr;

        let cellBg = 'background: rgba(15,23,42,0.9); border: 1px solid #1e293b; color: #64748b;';
        if (count >= 4) {
            cellBg = 'background: rgba(16,185,129,0.25); border: 1px solid #34d399; color: #6ee7b7;';
        } else if (count >= 2) {
            cellBg = 'background: rgba(6,182,212,0.25); border: 1px solid #22d3ee; color: #a5f3fc;';
        } else if (count === 1) {
            cellBg = 'background: rgba(8,51,68,0.8); border: 1px solid rgba(14,116,144,0.7); color: #22d3ee;';
        }

        const ringStyle = isSelected ? 'outline: 2px solid #fbbf24; transform: scale(1.03);' : '';

        const cell = document.createElement('button');
        cell.type = 'button';
        cell.onclick = () => selectHistoryDate(key);
        cell.style.cssText = `border-radius: 0.5rem; padding: 6px 2px; display: flex; flex-direction: column; align-items: center; justify-content: center; ${cellBg} ${ringStyle}`;
        cell.title = `${formatReadableDate(key)}: ${count} misi selesai`;
        cell.innerHTML = `
            <span class="font-display" style="font-size: 9px; text-transform: uppercase; opacity: 0.85;">${dayNames[d.getDay()]}</span>
            <span class="font-display" style="font-size: 0.75rem; font-weight: 700; line-height: 1.2;">${d.getDate()}</span>
            <span style="font-size: 9px; font-weight: 700; margin-top: 2px;">${count > 0 ? count + 'x' : '-'}</span>
        `;
        heatmapEl.appendChild(cell);
    }

    const displayedLogs = showAllHistoryLogs 
        ? logs 
        : logs.filter(item => item.dateStr === activeDateStr);

    if (logTitleEl) {
        logTitleEl.textContent = showAllHistoryLogs 
            ? `Semua Riwayat (${logs.length})` 
            : `Riwayat ${activeDateStr} (${displayedLogs.length})`;
    }
    if (toggleAllBtn) {
        toggleAllBtn.textContent = showAllHistoryLogs ? 'Filter Tanggal Ini' : 'Lihat Semua';
    }

    logListEl.innerHTML = '';
    const journals = (gameState.history?.journals || []).filter(j => showAllHistoryLogs || j.dateStr === activeDateStr);
    if (displayedLogs.length === 0 && journals.length === 0) {
        logListEl.innerHTML = `<p style="font-size: 0.75rem; color: #64748b; text-align: center; padding: 0.75rem 0;">Tidak ada misi selesai pada tanggal ${activeDateStr}.</p>`;
        return;
    }

    journals.forEach(j => {
        const jCard = document.createElement('div');
        jCard.style.cssText = 'background: rgba(88,28,135,0.22); border: 1px solid rgba(168,85,247,0.45); border-radius: 0.75rem; padding: 0.55rem 0.75rem; margin-bottom: 0.375rem;';
        jCard.innerHTML = `
            <div class="flex items-center justify-between" style="font-size: 10px; color: #d8b4fe; margin-bottom: 3px;">
                <span class="font-display" style="font-weight: 700;">📜 AWAKENING JOURNAL (${j.dateStr})</span>
                <span class="font-display" style="color: #34d399; font-weight: 700;">+15 WIS</span>
            </div>
            ${j.gratitude ? `<p style="font-size: 11px; color: #f1f5f9;">✨ Syukur: ${escapeHtml(j.gratitude)}</p>` : ''}
            ${j.improve ? `<p style="font-size: 11px; color: #cbd5e1; margin-top: 2px;">🎯 Besok: ${escapeHtml(j.improve)}</p>` : ''}
        `;
        logListEl.appendChild(jCard);
    });

    displayedLogs.forEach(item => {
        const row = document.createElement('div');
        row.style.cssText = 'background: rgba(15,23,42,0.75); border: 1px solid rgba(30,41,59,0.9); border-radius: 0.75rem; padding: 0.5rem 0.75rem;';
        row.className = 'flex items-center justify-between gap-2';
        row.innerHTML = `
            <div class="min-w-0 flex-1">
                <p class="truncate" style="font-size: 0.75rem; font-weight: 500; color: #e2e8f0;">${escapeHtml(item.title)}</p>
                <div class="flex items-center gap-2" style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">
                    <span class="font-display" style="color: var(--cyan-400); font-weight: 700;">${item.type}</span>
                    <span>•</span>
                    <span>${item.dateStr}</span>
                </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
                <div class="text-right font-display" style="font-weight: 700; font-size: 11px;">
                    <span style="color: var(--cyan-400); display: block;">+${item.xp} XP</span>
                    <span style="color: var(--purple-400); font-size: 10px;">+${item.stat}</span>
                </div>
                <button onclick="deleteHistoryLog('${item.id}')" style="color: #64748b; padding: 4px;" title="Hapus Log Ini">
                    <svg class="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                </button>
            </div>
        `;
        logListEl.appendChild(row);
    });
}

function deleteHistoryLog(logId) {
    const idx = gameState.history.logs.findIndex(l => l.id === logId);
    if (idx === -1) return;
    const target = gameState.history.logs[idx];
    SoundFX.playClick();

    if (gameState.history.dailyCounts[target.dateStr]) {
        gameState.history.dailyCounts[target.dateStr] = Math.max(0, gameState.history.dailyCounts[target.dateStr] - 1);
    }
    gameState.history.logs.splice(idx, 1);
    saveState();
    renderAll();
    spawnFloatingReward('Riwayat aktivitas dihapus');
}

function handleDateChange(newDateStr) {
    if (!newDateStr) return;
    selectHistoryDate(newDateStr);
}

function selectHistoryDate(dateStr) {
    SoundFX.playClick();
    gameState.selectedDate = dateStr;
    showAllHistoryLogs = false;
    saveState();
    renderHistory();
    spawnFloatingReward(`📅 Tanggal Sistem: ${formatReadableDate(dateStr)}`);
}

function resetToTodayDate() {
    const todayStr = formatDateKey(new Date());
    selectHistoryDate(todayStr);
}

function toggleShowAllLogs() {
    SoundFX.playClick();
    showAllHistoryLogs = !showAllHistoryLogs;
    renderHistory();
}

function setTimeSlotFilter(slot) {
    SoundFX.playClick();
    currentTimeSlotFilter = slot;
    document.querySelectorAll('.time-filter-btn').forEach(btn => {
        btn.style.cssText = 'padding: 5px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; background: var(--bg-slate-900); color: var(--text-muted); border: 1px solid var(--bg-slate-800); white-space: nowrap;';
    });
    const activeBtn = document.getElementById(`time-filter-${slot}`);
    if (activeBtn) {
        activeBtn.style.cssText = 'padding: 5px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; background: rgba(168,85,247,0.22); color: #d8b4fe; border: 1px solid rgba(168,85,247,0.5); white-space: nowrap;';
    }
    renderQuests();
}

function setQuestStatusFilter(status) {
    SoundFX.playClick();
    currentQuestStatusFilter = status;
    document.querySelectorAll('.status-filter-btn').forEach(btn => {
        btn.style.cssText = 'padding: 5px 8px; border-radius: 0.5rem; font-size: 11px; font-weight: 700; background: var(--bg-slate-900); color: var(--text-muted); border: 1px solid var(--bg-slate-800);';
    });
    const activeBtn = document.getElementById(`status-filter-${status}`);
    if (activeBtn) {
        activeBtn.style.cssText = 'padding: 5px 8px; border-radius: 0.5rem; font-size: 11px; font-weight: 700; background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid rgba(16,185,129,0.45);';
    }
    renderQuests();
}

function handleQuestSearch(val) {
    questSearchQuery = (val || '').trim().toLowerCase();
    const clearBtn = document.getElementById('btn-clear-quest-search');
    if (clearBtn) {
        if (questSearchQuery) clearBtn.classList.remove('hidden');
        else clearBtn.classList.add('hidden');
    }
    renderQuests();
}

function clearQuestSearch() {
    const input = document.getElementById('quest-search-input');
    if (input) input.value = '';
    handleQuestSearch('');
}


// ==========================================
// ACTIVE DAYS SCHEDULE (WEEKDAY / WEEKEND / CUSTOM)
// ==========================================
let currentQuestDayFilter = 'TODAY'; // 'TODAY' | 'ALL'

function getQuestActiveDays(q) {
    if (Array.isArray(q && q.activeDays) && q.activeDays.length > 0) {
        return q.activeDays;
    }
    return [0, 1, 2, 3, 4, 5, 6];
}

function isQuestActiveOnDate(q, dateKey) {
    const d = dateKey ? parseDateKey(dateKey) : new Date();
    const dayIdx = d.getDay();
    return getQuestActiveDays(q).includes(dayIdx);
}

function formatActiveDaysLabel(days) {
    const sorted = [...new Set(days)].sort((a, b) => a - b);
    if (sorted.length === 7) return '';
    if (sorted.length === 5 && sorted.join(',') === '1,2,3,4,5') return 'Weekday';
    if (sorted.length === 2 && sorted.join(',') === '0,6') return 'Weekend';
    const lang = (typeof gameState !== 'undefined' && gameState.language) || localStorage.getItem('sysrpg_lang') || 'id';
    const dayNamesMap = {
        id: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
        en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        ja: ['日', '月', '火', '水', '木', '金', '土']
    };
    const names = dayNamesMap[lang] || dayNamesMap.id;
    return sorted.map(d => names[d]).join('·');
}

function toggleDayChip(btn) {
    btn.classList.toggle('active');
    if (typeof SoundFX !== 'undefined' && SoundFX.playClick) SoundFX.playClick();
}

function applyDayPreset(mode, daysArr) {
    const containerId = mode === 'edit' ? 'edit-q-days' : 'add-q-days';
    const container = document.getElementById(containerId);
    if (!container) return;
    container.querySelectorAll('.day-chip').forEach(btn => {
        const day = parseInt(btn.getAttribute('data-day'), 10);
        btn.classList.toggle('active', daysArr.includes(day));
    });
    if (typeof SoundFX !== 'undefined' && SoundFX.playClick) SoundFX.playClick();
}

function readSelectedDays(mode) {
    const containerId = mode === 'edit' ? 'edit-q-days' : 'add-q-days';
    const container = document.getElementById(containerId);
    if (!container) return [0, 1, 2, 3, 4, 5, 6];
    const selected = [];
    container.querySelectorAll('.day-chip.active').forEach(btn => {
        selected.push(parseInt(btn.getAttribute('data-day'), 10));
    });
    return selected.length > 0 ? selected : [0, 1, 2, 3, 4, 5, 6];
}

function setQuestDayFilter(mode) {
    currentQuestDayFilter = mode;
    if (typeof SoundFX !== 'undefined' && SoundFX.playClick) SoundFX.playClick();
    document.querySelectorAll('.day-filter-btn').forEach(btn => {
        btn.style.cssText = 'padding: 5px 8px; border-radius: 0.5rem; font-size: 11px; font-weight: 700; background: var(--bg-slate-900); color: var(--text-muted); border: 1px solid var(--bg-slate-800);';
    });
    const activeBtn = document.getElementById(`day-filter-${mode}`);
    if (activeBtn) {
        activeBtn.style.cssText = 'padding: 5px 8px; border-radius: 0.5rem; font-size: 11px; font-weight: 700; background: rgba(251,191,36,0.2); color: #fcd34d; border: 1px solid rgba(251,191,36,0.45);';
    }
    renderQuests();
}

function openEditQuestModal(id) {
    const q = gameState.quests.find(item => item.id === id);
    if (!q) return;
    SoundFX.playClick();
    document.getElementById('edit-q-id').value = q.id;
    document.getElementById('edit-q-title').value = q.title;
    document.getElementById('edit-q-category').value = q.category;
    document.getElementById('edit-q-timeslot').value = inferQuestTimeSlot(q);
    document.getElementById('edit-q-stat').value = q.stat;
    document.getElementById('edit-q-xp').value = q.xp;
    document.getElementById('edit-q-gold').value = q.gold;
    applyDayPreset('edit', getQuestActiveDays(q));

    const isCount = q.trackingType === 'count';
    const trackSel = document.getElementById('edit-q-tracking-type');
    if (trackSel) {
        trackSel.value = isCount ? 'count' : 'check';
        toggleQuestCountInputs('edit');
    }
    document.getElementById('edit-q-target-count').value = q.targetCount || 10;
    document.getElementById('edit-q-unit').value = q.unit || 'kali';
    document.getElementById('edit-q-step-count').value = q.stepCount || 1;
    openModal('modal-edit-quest');
}

function saveEditedQuest(e) {
    e.preventDefault();
    const id = document.getElementById('edit-q-id').value;
    const q = gameState.quests.find(item => item.id === id);
    if (!q) return;

    q.title = document.getElementById('edit-q-title').value.trim() || q.title;
    q.category = document.getElementById('edit-q-category').value;
    q.timeSlot = document.getElementById('edit-q-timeslot').value;
    q.stat = document.getElementById('edit-q-stat').value;
    q.xp = Math.max(5, parseInt(document.getElementById('edit-q-xp').value, 10) || q.xp);
    q.gold = Math.max(5, parseInt(document.getElementById('edit-q-gold').value, 10) || q.gold);
    q.activeDays = readSelectedDays('edit');

    const trackMode = document.getElementById('edit-q-tracking-type')?.value || 'check';
    q.trackingType = trackMode;
    if (trackMode === 'count') {
        q.targetCount = Math.max(2, parseInt(document.getElementById('edit-q-target-count').value, 10) || 10);
        q.unit = (document.getElementById('edit-q-unit').value || 'kali').trim() || 'kali';
        q.stepCount = Math.max(1, parseInt(document.getElementById('edit-q-step-count').value, 10) || 1);
        q.currentCount = Math.min(q.targetCount, q.currentCount || 0);
    } else {
        delete q.currentCount;
        delete q.targetCount;
        delete q.stepCount;
        delete q.unit;
    }

    SoundFX.playQuestComplete();
    closeModal('modal-edit-quest');
    saveState();
    renderAll();
    spawnFloatingReward('✏️ Quest Berhasil Diperbarui!');
}

function renderQuests() {
    const container = document.getElementById('quest-list');
    container.innerHTML = '';

    const dailyQuests = gameState.quests.filter(q => q.category === 'Daily Quest' && isQuestActiveOnDate(q, getCurrentGameDateKey()));
    const doneDailyCount = dailyQuests.filter(q => q.completed).length;
    const totalDailyCount = dailyQuests.length;

    const targetPct = getStreakThresholdPct();
    const dailyHeaderEl = document.getElementById('daily-target-header');
    if (dailyHeaderEl) {
        dailyHeaderEl.textContent = `Daily Habit (Target Streak ≥ ${targetPct}%)`;
    }
    const evalLabelEl = document.getElementById('eval-threshold-label');
    if (evalLabelEl) {
        evalLabelEl.textContent = `${targetPct}% Daily Quest`;
    }
    const thresholdInputEl = document.getElementById('input-streak-threshold');
    if (thresholdInputEl && document.activeElement !== thresholdInputEl) {
        thresholdInputEl.value = targetPct;
    }

    const dailyTextEl = document.getElementById('daily-progress-text');
    const dailyBarEl = document.getElementById('daily-progress-bar');
    if (dailyTextEl && dailyBarEl) {
        const pct = totalDailyCount > 0 ? Math.round((doneDailyCount / totalDailyCount) * 100) : 0;
        const targetMet = pct >= targetPct && totalDailyCount > 0;
        dailyTextEl.textContent = `${doneDailyCount} / ${totalDailyCount} (${pct}%)${targetMet ? ' 🔥' : ''}`;
        dailyBarEl.style.width = `${pct}%`;
        dailyBarEl.style.background = targetMet
            ? 'linear-gradient(to right, #34d399, #fbbf24)'
            : 'linear-gradient(to right, #22d3ee, #34d399)';
    }

    const incompleteDaily = doneDailyCount < totalDailyCount;
    const navBadge = document.getElementById('nav-quest-badge');
    if (incompleteDaily) navBadge.classList.remove('hidden');
    else navBadge.classList.add('hidden');

    const filtered = gameState.quests
        .filter(q => {
            const matchCat = currentQuestFilter === 'ALL' || q.category === currentQuestFilter;
            const slot = inferQuestTimeSlot(q);
            const matchTime = currentTimeSlotFilter === 'ALL' || slot === currentTimeSlotFilter;
            const matchStatus = currentQuestStatusFilter === 'ALL' ||
                (currentQuestStatusFilter === 'ACTIVE' && !q.completed) ||
                (currentQuestStatusFilter === 'DONE' && q.completed);
            const matchSearch = !questSearchQuery || q.title.toLowerCase().includes(questSearchQuery);
            const matchDay = currentQuestDayFilter === 'ALL' || isQuestActiveOnDate(q, getCurrentGameDateKey());
            return matchCat && matchTime && matchStatus && matchSearch && matchDay;
        })
        .sort((a, b) => Number(a.completed) - Number(b.completed));

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="system-card text-center space-y-2" style="padding: 1.5rem; color: var(--text-muted); font-size: 0.75rem;">
                <p>Tidak ada misi yang cocok dengan filter / pencarian saat ini.</p>
                <button onclick="restoreDefaultHabits()" style="color: var(--cyan-400); text-decoration: underline; font-weight: 700;">Muat Paket Default Daily Habit</button>
            </div>
        `;
        return;
    }

    const statStyles = {
        STR: 'color: #fb7185; background: rgba(244,63,94,0.15); border: 1px solid rgba(244,63,94,0.35);',
        INT: 'color: #22d3ee; background: rgba(6,182,212,0.15); border: 1px solid rgba(6,182,212,0.35);',
        WIS: 'color: #c084fc; background: rgba(168,85,247,0.15); border: 1px solid rgba(168,85,247,0.35);',
        CHR: 'color: #fbbf24; background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.35);'
    };

    const catStyles = {
        'Daily Quest': 'color: #67e8f9; border: 1px solid rgba(6,182,212,0.35); background: rgba(8,51,68,0.45);',
        'Recovery Quest': 'color: #6ee7b7; border: 1px solid rgba(16,185,129,0.45); background: rgba(6,78,59,0.55);',
        'Main Quest': 'color: #d8b4fe; border: 1px solid rgba(168,85,247,0.35); background: rgba(59,7,100,0.45);',
        'Boss Fight': 'color: #fda4af; border: 1px solid rgba(244,63,94,0.35); background: rgba(76,5,25,0.45);'
    };

    const slotIcons = {
        Pagi: '🌅 Pagi',
        Siang: '☀️ Siang',
        Sore: '🌇 Sore',
        Malam: '🌙 Malam',
        Fleksibel: '⚡ Fleksibel'
    };

    filtered.forEach(q => {
        const isDone = q.completed;
        const isCount = q.trackingType === 'count' && (q.targetCount || 0) > 1;
        const curCount = isCount ? (q.currentCount || 0) : 0;
        const tgtCount = isCount ? (q.targetCount || 1) : 1;
        const stepCount = isCount ? (q.stepCount || 1) : 1;
        const unitLabel = isCount ? (q.unit || 'kali') : '';
        const countPct = isCount ? Math.min(100, Math.round((curCount / tgtCount) * 100)) : 0;

        const slot = inferQuestTimeSlot(q);
        const card = document.createElement('div');
        card.className = 'system-card flex items-center justify-between gap-2';
        card.style.cssText = `padding: 0.875rem; border-radius: 0.75rem; ${isDone ? 'opacity: 0.74; border-color: rgba(16,185,129,0.38);' : ''}`;

        const checkBtnStyle = isDone 
            ? 'background: rgba(16,185,129,0.22); border: 1px solid #10b981; color: #34d399;' 
            : 'border: 1px solid rgba(34,211,238,0.65); color: transparent;';

        const counterControlsHtml = isCount ? `
            <div style="margin-top: 8px; background: rgba(2,6,23,0.72); border: 1px solid rgba(34,211,238,0.3); border-radius: 0.65rem; padding: 0.45rem 0.6rem;">
                <div class="flex items-center justify-between gap-2" style="margin-bottom: 5px;">
                    <span class="font-display" style="font-size: 11px; font-weight: 800; color: ${isDone ? '#34d399' : '#67e8f9'};">
                        📊 Progres: ${curCount} / ${tgtCount} ${escapeHtml(unitLabel)} (${countPct}%)
                    </span>
                    <div class="flex items-center gap-1">
                        <button type="button" onclick="adjustQuestCount('${q.id}', -${stepCount})" style="padding: 2px 8px; border-radius: 0.4rem; background: #1e293b; border: 1px solid #475569; color: #cbd5e1; font-weight: 800; font-size: 11px;" title="Kurangi hitungan">-${stepCount}</button>
                        <button type="button" onclick="adjustQuestCount('${q.id}', ${stepCount})" style="padding: 2px 9px; border-radius: 0.4rem; background: rgba(6,182,212,0.22); border: 1px solid rgba(34,211,238,0.55); color: #67e8f9; font-weight: 800; font-size: 11px;" title="Tambah hitungan">+${stepCount}</button>
                        <button type="button" onclick="promptSetQuestCount('${q.id}')" style="padding: 2px 7px; border-radius: 0.4rem; background: rgba(168,85,247,0.2); border: 1px solid rgba(192,132,252,0.45); color: #e9d5ff; font-weight: 700; font-size: 10px;" title="Input angka manual">Set</button>
                    </div>
                </div>
                <div class="progress-track-sm">
                    <div class="progress-fill" style="width: ${countPct}%; background: ${isDone ? '#10b981' : 'linear-gradient(to right, #06b6d4, #a855f7)'};"></div>
                </div>
            </div>
        ` : '';

        card.innerHTML = `
            <div class="flex items-start gap-2-5 flex-1 min-w-0">
                <button onclick="toggleQuest('${q.id}')" title="${isDone ? 'Klik untuk batalkan (Undo)' : 'Centang selesai penuh'}"
                    style="margin-top: 2px; width: 1.5rem; height: 1.5rem; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; ${checkBtnStyle}">
                    <svg class="icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                </button>
                <div class="min-w-0 flex-1">
                    <div onclick="toggleQuest('${q.id}')" style="cursor: pointer;">
                        <div class="flex flex-wrap items-center gap-1" style="margin-bottom: 4px;">
                            <span class="font-display" style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; ${catStyles[q.category] || ''}">${q.category}</span>
                            <span class="font-display" style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: rgba(30,41,59,0.85); color: #cbd5e1; border: 1px solid #334155;">${slotIcons[slot] || slot}</span>
                            <span class="font-display" style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; ${statStyles[q.stat] || ''}">+${getQuestStatXpGain(q)} ${q.stat} XP</span>
                            ${isCount ? `<span class="font-display" style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: rgba(168,85,247,0.18); color: #d8b4fe; border: 1px solid rgba(168,85,247,0.4);">🔢 Hitungan</span>` : ''}
                        </div>
                        <p class="${isDone ? 'line-through' : ''}" style="font-size: 0.875rem; font-weight: 500; color: ${isDone ? '#94a3b8' : '#f1f5f9'}; line-height: 1.35;">${escapeHtml(q.title)}</p>
                    </div>
                    ${counterControlsHtml}
                    <div class="flex flex-wrap items-center gap-3 font-display" style="margin-top: 6px; font-size: 11px; font-weight: 700;">
                        <span style="color: var(--cyan-400);">+${q.xp} XP</span>
                        <span style="color: var(--amber-400);">+${q.gold} Gold</span>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-1 shrink-0">
                <button onclick="openEditQuestModal('${q.id}')" style="color: #94a3b8; padding: 5px;" title="Edit Quest">
                    <svg class="icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                </button>
                <button onclick="deleteQuest('${q.id}')" style="color: #64748b; padding: 5px;" title="Hapus Quest">
                    <svg class="icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </div>
        `;
        container.appendChild(card);
    });
    renderArmory();
    renderRedeemHistory();
}

function renderArmory() {
    const slotsEl = document.getElementById('armory-active-slots');
    const listEl = document.getElementById('armory-relic-list');
    const countEl = document.getElementById('armory-equipped-count');
    const summaryEl = document.getElementById('armory-passive-summary');
    if (!slotsEl || !listEl) return;

    syncArmoryExpirations();
    const owned = gameState.armory.owned || [];
    const expiresAtMap = gameState.armory.expiresAt || {};
    const equipped = gameState.armory.equipped || { 'Tome/Tool': null, 'Accessory': null, 'Relic': null };
    const slotNames = ['Tome/Tool', 'Accessory', 'Relic'];

    const activeCount = slotNames.filter(s => !!equipped[s]).length;
    if (countEl) countEl.textContent = `${activeCount} / 3 Slot`;

    slotsEl.innerHTML = slotNames.map(slotName => {
        const eqId = equipped[slotName];
        const relic = eqId ? ARMORY_RELICS_CATALOG.find(r => r.id === eqId) : null;
        if (relic) {
            const remLabel = formatRemainingRelicTime(expiresAtMap[relic.id] || Date.now());
            return `
                <div onclick="toggleEquipRelic('${relic.id}')" style="cursor: pointer; background: rgba(6,182,212,0.16); border: 1px solid rgba(34,211,238,0.6); border-radius: 0.65rem; padding: 0.5rem 0.35rem; text-align: center;" title="Klik untuk melepas ${relic.name}">
                    <span style="display: block; font-size: 9px; color: #67e8f9; font-weight: 700; text-transform: uppercase;">${slotName}</span>
                    <span style="display: block; font-size: 1.25rem; margin: 2px 0;">${relic.icon}</span>
                    <span class="font-display truncate" style="display: block; font-size: 9px; font-weight: 700; color: #fff;">${relic.name.replace(' (24 Jam)', '')}</span>
                    <span style="display: block; font-size: 8px; color: #fcd34d; margin-top: 2px;">⏳ Sisa ${remLabel}</span>
                </div>
            `;
        }
        return `
            <div style="background: rgba(2,6,23,0.6); border: 1px dashed #334155; border-radius: 0.65rem; padding: 0.5rem 0.35rem; text-align: center;">
                <span style="display: block; font-size: 9px; color: #64748b; font-weight: 700; text-transform: uppercase;">${slotName}</span>
                <span style="display: block; font-size: 1.15rem; margin: 2px 0; opacity: 0.35;">💠</span>
                <span class="font-display" style="display: block; font-size: 9px; font-weight: 600; color: #475569;">Slot Kosong</span>
            </div>
        `;
    }).join('');

    if (summaryEl) {
        const buffs = getRelicPassiveBonuses();
        if (buffs.relics.length === 0) {
            summaryEl.innerHTML = 'Belum ada Relic aktif. Beli Relic (durasi 24 jam) di bawah untuk mengaktifkan efek sementara!';
        } else {
            const parts = [];
            if (buffs.xpBonus > 0) parts.push(`+${Math.round(buffs.xpBonus * 100)}% Total EXP`);
            if (buffs.goldBonus > 0) parts.push(`+${Math.round(buffs.goldBonus * 100)}% Total Gold`);
            if (buffs.bonusMaxHp > 0) parts.push(`+${buffs.bonusMaxHp} Max HP`);
            Object.keys(buffs.statMult).forEach(st => {
                if (buffs.statMult[st] > 0) parts.push(`+${Math.round(buffs.statMult[st] * 100)}% ${st} XP`);
            });
            summaryEl.innerHTML = `<span style="color: #34d399; font-weight: 700;">✦ Buff Sementara Aktif:</span> ${parts.join(' • ')}`;
        }
    }

    listEl.innerHTML = ARMORY_RELICS_CATALOG.map(relic => {
        const isOwned = owned.includes(relic.id) && (expiresAtMap[relic.id] || 0) > Date.now();
        const isEquipped = isOwned && equipped[relic.slot] === relic.id;
        const finalCost = getDiscountedShopCost(relic.cost);
        const canAfford = gameState.player.gold >= finalCost;
        const remText = isOwned ? formatRemainingRelicTime(expiresAtMap[relic.id]) : '';

        let actionBtn = '';
        if (isEquipped) {
            actionBtn = `<button type="button" onclick="toggleEquipRelic('${relic.id}')" class="font-display" style="padding: 0.45rem 0.65rem; border-radius: 0.65rem; font-weight: 700; font-size: 11px; background: rgba(16,185,129,0.22); color: #34d399; border: 1px solid rgba(16,185,129,0.5);">Aktif (${remText})</button>`;
        } else if (isOwned) {
            actionBtn = `<button type="button" onclick="toggleEquipRelic('${relic.id}')" class="font-display" style="padding: 0.45rem 0.65rem; border-radius: 0.65rem; font-weight: 700; font-size: 11px; background: rgba(6,182,212,0.22); color: #67e8f9; border: 1px solid rgba(34,211,238,0.5);">Pasang (${remText})</button>`;
        } else {
            actionBtn = `<button type="button" onclick="buyArmoryRelic('${relic.id}')" ${!canAfford ? 'disabled' : ''} class="font-display" style="padding: 0.45rem 0.65rem; border-radius: 0.65rem; font-weight: 700; font-size: 11px; ${canAfford ? 'background: var(--cyan-500); color: #020617;' : 'background: var(--bg-slate-800); color: #64748b; border: 1px solid #334155;'}">${finalCost} G / 24j</button>`;
        }

        return `
            <div class="flex items-center justify-between gap-2" style="background: rgba(2,6,23,0.65); border: 1px solid ${isEquipped ? 'rgba(34,211,238,0.55)' : '#1e293b'}; border-radius: 0.7rem; padding: 0.65rem;">
                <div class="flex items-center gap-2-5 min-w-0">
                    <div style="width: 2.35rem; height: 2.35rem; border-radius: 0.6rem; background: rgba(6,182,212,0.14); border: 1px solid rgba(34,211,238,0.35); display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0;">
                        ${relic.icon}
                    </div>
                    <div class="min-w-0">
                        <div class="flex items-center gap-1-5 flex-wrap">
                            <h4 class="truncate" style="font-size: 0.8rem; font-weight: 700; color: #f1f5f9;">${relic.name}</h4>
                            <span class="font-display" style="font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 4px; background: rgba(168,85,247,0.2); color: #d8b4fe; border: 1px solid rgba(168,85,247,0.4);">${relic.slot}</span>
                        </div>
                        <p style="font-size: 10.5px; color: #94a3b8; margin-top: 2px;">${relic.buffDesc}</p>
                    </div>
                </div>
                <div class="shrink-0">${actionBtn}</div>
            </div>
        `;
    }).join('');
}

function buyArmoryRelic(relicId) {
    syncArmoryExpirations();
    const relic = ARMORY_RELICS_CATALOG.find(r => r.id === relicId);
    if (!relic) return;
    if (gameState.armory.owned.includes(relic.id)) return;

    const finalCost = getDiscountedShopCost(relic.cost);
    if (gameState.player.gold < finalCost) {
        SoundFX.playDamage();
        spawnFloatingReward('⚠️ Gold tidak cukup untuk membeli Relic ini!');
        return;
    }

    SoundFX.playCoin();
    gameState.player.gold -= finalCost;
    gameState.armory.owned.push(relic.id);
    gameState.armory.expiresAt[relic.id] = Date.now() + RELIC_DURATION_MS;
    gameState.armory.equipped[relic.slot] = relic.id;
    syncPlayerMaxHp();
    recordRedeemHistory(`${relic.name} [${relic.slot}]`, finalCost, 'relic', relic.buffDesc);
    saveState();
    renderAll();
    spawnFloatingReward(`⚔️ ${relic.name} Aktif selama 24 Jam di Slot ${relic.slot}!`);
}

function toggleEquipRelic(relicId) {
    syncArmoryExpirations();
    const relic = ARMORY_RELICS_CATALOG.find(r => r.id === relicId);
    if (!relic || !gameState.armory || !gameState.armory.owned.includes(relic.id)) return;
    SoundFX.playClick();
    if (gameState.armory.equipped[relic.slot] === relic.id) {
        gameState.armory.equipped[relic.slot] = null;
        spawnFloatingReward(`📦 ${relic.name} dilepas sementara dari slot ${relic.slot}`);
    } else {
        gameState.armory.equipped[relic.slot] = relic.id;
        spawnFloatingReward(`✨ ${relic.name} dipasang di slot ${relic.slot}!`);
    }
    syncPlayerMaxHp();
    saveState();
    renderAll();
}

function restoreDefaultHabits() {
    SoundFX.playClick();
    let addedCount = 0;
    DEFAULT_DAILY_HABITS.forEach(preset => {
        const exists = gameState.quests.some(q => q.title === preset.title);
        if (!exists) {
            gameState.quests.unshift({
                ...preset,
                id: 'dh_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
                completed: false
            });
            addedCount++;
        }
    });

    if (addedCount > 0) {
        saveState();
        renderAll();
        spawnFloatingReward(`✨ ${addedCount} Default Daily Habit Ditambahkan!`);
    } else {
        spawnFloatingReward('✅ Semua Default Daily Habit Sudah Ada!');
    }
}

// ==========================================
// 6. QUEST ACTIONS & SHOP FORM + GACHA CHEST
// ==========================================
function toggleQuestForm() {
    SoundFX.playClick();
    const form = document.getElementById('quest-form');
    if (form) {
        form.classList.toggle('hidden');
        if (!form.classList.contains('hidden')) {
            const titleInput = document.getElementById('q-title');
            if (titleInput) titleInput.focus();
        }
    }
}

function toggleShopForm() {
    SoundFX.playClick();
    const form = document.getElementById('shop-form');
    if (form) {
        form.classList.toggle('hidden');
        if (!form.classList.contains('hidden')) {
            const titleInput = document.getElementById('s-title');
            if (titleInput) titleInput.focus();
        }
    }
}

function setQuestFilter(category) {
    SoundFX.playClick();
    currentQuestFilter = category;
    document.querySelectorAll('.quest-filter-btn').forEach(btn => {
        btn.style.cssText = 'padding: 6px 4px; border-radius: 0.5rem; font-size: 11px; font-weight: 700; background: var(--bg-slate-900); color: var(--text-muted); border: 1px solid var(--bg-slate-800);';
    });
    const activeBtn = document.getElementById(`filter-${category}`);
    if (activeBtn) {
        activeBtn.style.cssText = 'padding: 6px 4px; border-radius: 0.5rem; font-size: 11px; font-weight: 700; background: rgba(6,182,212,0.2); color: #67e8f9; border: 1px solid rgba(6,182,212,0.4);';
    }
    renderQuests();
}

function toggleQuestCountInputs(mode) {
    const selId = mode === 'edit' ? 'edit-q-tracking-type' : 'q-tracking-type';
    const boxId = mode === 'edit' ? 'edit-q-count-fields' : 'q-count-fields';
    const sel = document.getElementById(selId);
    const box = document.getElementById(boxId);
    if (!sel || !box) return;
    if (sel.value === 'count') box.classList.remove('hidden');
    else box.classList.add('hidden');
}

function adjustQuestCount(id, delta) {
    const q = gameState.quests.find(item => item.id === id);
    if (!q || q.trackingType !== 'count') return;
    const target = Math.max(1, q.targetCount || 1);
    const prev = q.currentCount || 0;
    const next = Math.max(0, Math.min(target, prev + delta));
    if (next === prev) return;

    q.currentCount = next;
    if (next >= target && !q.completed) {
        toggleQuest(id);
        return;
    } else if (next < target && q.completed) {
        toggleQuest(id, true);
        return;
    } else {
        SoundFX.playClick();
        spawnFloatingReward(`📊 ${q.title}: ${next} / ${target} ${q.unit || 'kali'}`);
    }
    saveState();
    renderQuests();
}

function promptSetQuestCount(id) {
    const q = gameState.quests.find(item => item.id === id);
    if (!q || q.trackingType !== 'count') return;
    const target = Math.max(1, q.targetCount || 1);
    const unit = q.unit || 'kali';
    const raw = window.prompt(`Masukkan progres hitungan untuk "${q.title}" (0 - ${target} ${unit}):`, String(q.currentCount || 0));
    if (raw === null) return;
    const val = parseInt(raw, 10);
    if (isNaN(val)) return;
    const clamped = Math.max(0, Math.min(target, val));
    const diff = clamped - (q.currentCount || 0);
    if (diff !== 0) adjustQuestCount(id, diff);
}

function handleAddQuest(e) {
    e.preventDefault();
    const titleEl = document.getElementById('q-title');
    const catEl = document.getElementById('q-category');
    const timeEl = document.getElementById('q-timeslot');
    const statEl = document.getElementById('q-stat');
    const xpEl = document.getElementById('q-xp');
    const goldEl = document.getElementById('q-gold');
    const trackEl = document.getElementById('q-tracking-type');

    const title = titleEl ? titleEl.value.trim() : '';
    if (!title) return;

    const category = catEl ? catEl.value : 'Daily Quest';
    const timeSlot = timeEl ? timeEl.value : 'Fleksibel';
    const stat = statEl ? statEl.value : 'INT';
    const xp = Math.max(5, parseInt(xpEl ? xpEl.value : '30', 10) || 30);
    const gold = Math.max(5, parseInt(goldEl ? goldEl.value : '25', 10) || 25);
    const trackingType = trackEl ? trackEl.value : 'check';

    const newQuest = {
        id: 'q_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
        title,
        category,
        timeSlot,
        stat,
        xp,
        gold,
        trackingType,
        activeDays: readSelectedDays('add'),
        completed: false
    };

    if (trackingType === 'count') {
        newQuest.currentCount = 0;
        newQuest.targetCount = Math.max(2, parseInt(document.getElementById('q-target-count')?.value || '10', 10) || 10);
        newQuest.stepCount = Math.max(1, parseInt(document.getElementById('q-step-count')?.value || '1', 10) || 1);
        newQuest.unit = (document.getElementById('q-unit')?.value || 'kali').trim() || 'kali';
    }

    gameState.quests.unshift(newQuest);

    SoundFX.playQuestComplete();
    const form = document.getElementById('quest-form');
    if (form) {
        form.reset();
        applyDayPreset('add', [0, 1, 2, 3, 4, 5, 6]);
        toggleQuestCountInputs('add');
        form.classList.add('hidden');
    }
    saveState();
    renderAll();
    spawnFloatingReward('⚔️ Quest Baru Ditambahkan!');
}

function toggleQuest(id, preserveCount = false) {
    const q = gameState.quests.find(item => item.id === id);
    if (!q) return;

    const todayKey = getCurrentGameDateKey();

    if (!q.completed) {
        q.completed = true;
        if (q.trackingType === 'count' && !preserveCount) {
            q.currentCount = q.targetCount || 1;
        }

        let effectiveBaseXp = q.xp;
        if (q.category === 'Daily Quest' && getTodayDailyXpEarned() >= 350) {
            effectiveBaseXp = Math.max(8, Math.round(q.xp * 0.5));
        }

        const isCrit = Math.random() < 0.12;
        const effectiveBaseGold = isCrit ? Math.round(q.gold * 1.5) : q.gold;
        if (isCrit) {
            SoundFX.playCritical();
            document.body.classList.remove('animate-crit-flash');
            void document.body.offsetWidth;
            document.body.classList.add('animate-crit-flash');
        } else {
            SoundFX.playQuestComplete();
        }

        const statXpEarned = getQuestStatXpGain(q);
        const rewardResult = addRewards(effectiveBaseXp, effectiveBaseGold, q.stat, statXpEarned, isCrit);
        if (isCrit) {
            spawnFloatingReward(`⚡ CRITICAL CLEAR! +${rewardResult.finalXp} XP | +${rewardResult.finalGold} Gold (1.5x)`);
        }

        q.lastReward = {
            xp: rewardResult.finalXp,
            gold: rewardResult.finalGold,
            stat: q.stat,
            statXpGain: statXpEarned
        };

        if (q.category === 'Recovery Quest') {
            syncPlayerMaxHp();
            const baseHeal = q.hpHeal || 20;
            const wasFatigued = (gameState.player.hp / gameState.player.maxHp) < 0.30;
            const minSafeHp = Math.ceil(gameState.player.maxHp * 0.30);
            const targetHp = Math.min(gameState.player.maxHp, gameState.player.hp + baseHeal);
            const finalHp = wasFatigued ? Math.max(targetHp, minSafeHp) : targetHp;
            const actualHealed = Math.max(0, finalHp - gameState.player.hp);
            gameState.player.hp = finalHp;
            q.lastReward.hpHealed = actualHealed;
            setTimeout(() => {
                spawnFloatingReward(`🌿 Recovery! +${actualHealed} HP${wasFatigued ? ' & Status Fatigue (-20% EXP) Dihapus!' : ''}`);
            }, 300);
        }

        recordActivityHistory(q.title, q.category, q.stat, rewardResult.finalXp, rewardResult.finalGold, q.id);

        if (q.category === 'Daily Quest') {
            const slot = inferQuestTimeSlot(q);
            if (['Pagi', 'Siang', 'Sore', 'Malam'].includes(slot)) {
                if (!gameState.history.slotCombosClaimed) gameState.history.slotCombosClaimed = {};
                const comboKey = `${todayKey}_${slot}`;
                const slotQuests = gameState.quests.filter(item => item.category === 'Daily Quest' && inferQuestTimeSlot(item) === slot);
                if (slotQuests.length > 0 && slotQuests.every(item => item.completed) && !gameState.history.slotCombosClaimed[comboKey]) {
                    const comboReward = addRewards(15, 25, 'WIS', 15, true);
                    gameState.history.slotCombosClaimed[comboKey] = {
                        xp: comboReward.finalXp,
                        gold: comboReward.finalGold,
                        statXpGain: 15
                    };
                    setTimeout(() => {
                        spawnFloatingReward(`🔥 ${slot.toUpperCase()} SWEEP COMBO! +${comboReward.finalGold} Gold & +15 WIS XP`);
                    }, 350);
                }
            }

            const dailyQuests = gameState.quests.filter(item => item.category === 'Daily Quest' && isQuestActiveOnDate(item, todayKey));
            const doneCount = dailyQuests.filter(item => item.completed).length;
            const ratio = dailyQuests.length > 0 ? (doneCount / dailyQuests.length) : 0;

            if (ratio >= getStreakThresholdRatio() && gameState.lastStreakDate !== todayKey) {
                gameState.player.streak = (gameState.player.streak || 0) + 1;
                if (gameState.player.streak > (gameState.player.longestStreak || 0)) {
                    gameState.player.longestStreak = gameState.player.streak;
                }
                gameState.lastStreakDate = todayKey;
                setTimeout(() => {
                    spawnFloatingReward(`🔥 TARGET ≥${getStreakThresholdPct()}% TERCAPAI! Streak Hari Ini +1 (${gameState.player.streak} Hari)`);
                }, 650);
            }
        }
        syncSystemReminders();
    } else {
        q.completed = false;
        if (q.trackingType === 'count' && !preserveCount) {
            q.currentCount = 0;
        }
        SoundFX.playUndo();

        const rev = q.lastReward || { xp: q.xp, gold: q.gold, stat: q.stat, statXpGain: getQuestStatXpGain(q) };
        if (q.category === 'Recovery Quest' && rev.hpHealed) {
            gameState.player.hp = Math.max(1, gameState.player.hp - rev.hpHealed);
        }
        revokeRewards(rev.xp, rev.gold, rev.stat, rev.statXpGain ?? rev.statGain ?? getQuestStatXpGain(q));
        delete q.lastReward;

        if (gameState.history && Array.isArray(gameState.history.logs)) {
            const logIdx = gameState.history.logs.findIndex(l => (l.questId === q.id || l.title === q.title) && l.dateStr === todayKey);
            if (logIdx !== -1) {
                gameState.history.logs.splice(logIdx, 1);
            }
            if (gameState.history.dailyCounts && gameState.history.dailyCounts[todayKey]) {
                gameState.history.dailyCounts[todayKey] = Math.max(0, gameState.history.dailyCounts[todayKey] - 1);
            }
        }

        if (q.category === 'Daily Quest') {
            const slot = inferQuestTimeSlot(q);
            const comboKey = `${todayKey}_${slot}`;
            if (gameState.history.slotCombosClaimed && gameState.history.slotCombosClaimed[comboKey]) {
                const cRev = gameState.history.slotCombosClaimed[comboKey];
                revokeRewards(cRev.xp, cRev.gold, 'WIS', cRev.statXpGain || 15);
                delete gameState.history.slotCombosClaimed[comboKey];
            }

            if (gameState.lastStreakDate === todayKey) {
                const dailyQuests = gameState.quests.filter(item => item.category === 'Daily Quest' && isQuestActiveOnDate(item, todayKey));
                const doneCount = dailyQuests.filter(item => item.completed).length;
                const ratio = dailyQuests.length > 0 ? (doneCount / dailyQuests.length) : 0;
                if (ratio < getStreakThresholdRatio()) {
                    gameState.player.streak = Math.max(0, (gameState.player.streak || 1) - 1);
                    gameState.lastStreakDate = null;
                }
            }
        }

        spawnFloatingReward(`↩️ Dibatalkan: -${rev.xp} XP | -${rev.gold} Gold`);
        syncSystemReminders();
    }

    saveState();
    renderAll();
}

function deleteQuest(id) {
    SoundFX.playClick();
    gameState.quests = gameState.quests.filter(q => q.id !== id);
    saveState();
    renderAll();
    syncSystemReminders();
    spawnFloatingReward('🗑️ Quest Dihapus');
}

function handleShopSearch(val) {
    shopSearchQuery = (val || '').trim().toLowerCase();
    const clearBtn = document.getElementById('btn-clear-shop-search');
    if (clearBtn) {
        if (shopSearchQuery) clearBtn.classList.remove('hidden');
        else clearBtn.classList.add('hidden');
    }
    renderShop();
}

function clearShopSearch() {
    const input = document.getElementById('shop-search-input');
    if (input) input.value = '';
    handleShopSearch('');
}

function openEditShopModal(id) {
    const item = gameState.shop.find(s => s.id === id);
    if (!item) return;
    SoundFX.playClick();
    document.getElementById('edit-s-id').value = item.id;
    document.getElementById('edit-s-title').value = item.title;
    document.getElementById('edit-s-cost').value = item.cost;
    document.getElementById('edit-s-type').value = item.type;
    document.getElementById('edit-s-desc').value = item.desc || '';
    openModal('modal-edit-shop');
}

function saveEditedShopItem(e) {
    e.preventDefault();
    const id = document.getElementById('edit-s-id').value;
    const item = gameState.shop.find(s => s.id === id);
    if (!item) return;

    item.title = document.getElementById('edit-s-title').value.trim() || item.title;
    item.cost = Math.max(10, parseInt(document.getElementById('edit-s-cost').value, 10) || item.cost);
    item.type = document.getElementById('edit-s-type').value;
    item.desc = document.getElementById('edit-s-desc').value.trim();

    SoundFX.playQuestComplete();
    closeModal('modal-edit-shop');
    saveState();
    renderAll();
    spawnFloatingReward('✏️ Item Shop Diperbarui!');
}

function renderShop() {
    const container = document.getElementById('shop-list');
    container.innerHTML = '';

    // Update status tombol Gacha
    const gachaBtn = document.getElementById('btn-open-gacha');
    if (gachaBtn) {
        const canGacha = gameState.player.gold >= 100;
        gachaBtn.style.opacity = canGacha ? '1' : '0.55';
    }

    const filteredShop = gameState.shop.filter(item => {
        if (!shopSearchQuery) return true;
        return item.title.toLowerCase().includes(shopSearchQuery) || (item.desc || '').toLowerCase().includes(shopSearchQuery);
    });

    if (filteredShop.length === 0) {
        container.innerHTML = `<div class="system-card text-center" style="padding: 1.25rem; color: var(--text-muted); font-size: 0.75rem;">Tidak ada item Shop yang cocok dengan pencarian.</div>`;
        renderRedeemHistory();
        return;
    }

    const MAX_STREAK_SHIELDS = 2;

    filteredShop.forEach(item => {
        const finalCost = getDiscountedShopCost(item.cost);
        const hasDiscount = finalCost < item.cost;
        const isPotion = item.type === 'potion' || item.type === 'elixir';
        const isElixir = item.type === 'elixir';
        const isShield = item.type === 'shield';
        const currentShields = gameState.player.shields || 0;
        const isShieldMaxed = isShield && currentShields >= MAX_STREAK_SHIELDS;
        const canAfford = !isShieldMaxed && (gameState.player.gold >= finalCost);

        const iconBoxStyle = isElixir
            ? 'background: rgba(16,185,129,0.16); border: 1px solid rgba(16,185,129,0.45); color: #34d399;'
            : (isPotion 
                ? 'background: rgba(244,63,94,0.15); border: 1px solid rgba(244,63,94,0.4); color: #fb7185;'
                : (isShield 
                    ? 'background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.4); color: #38bdf8;'
                    : 'background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.4); color: #fbbf24;'));

        const iconSvg = isElixir
            ? `<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>`
            : (isPotion
                ? `<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>`
                : (isShield
                    ? `<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
                    : `<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`));

        const buyBtnStyle = canAfford
            ? 'background: var(--amber-500); color: #020617;'
            : 'background: var(--bg-slate-800); color: #64748b; border: 1px solid #334155;';

        const card = document.createElement('div');
        card.className = 'system-card flex items-center justify-between gap-2';
        card.style.cssText = 'padding: 0.875rem; border-radius: 0.75rem;';
        card.innerHTML = `
            <div class="flex items-center gap-2-5 min-w-0">
                <div style="width: 2.65rem; height: 2.65rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; ${iconBoxStyle}">
                    ${iconSvg}
                </div>
                <div class="min-w-0">
                    <h4 class="truncate" style="font-size: 0.875rem; font-weight: 700; color: #f1f5f9;">${escapeHtml(item.title)}</h4>
                    <p style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${escapeHtml(item.desc || 'Reward Kustom')}</p>
                    ${isShield ? `<span class="font-display" style="display: inline-block; margin-top: 3px; font-size: 10px; font-weight: 700; color: ${isShieldMaxed ? '#fbbf24' : '#38bdf8'};">Stok Dimiliki: ${currentShields} / ${MAX_STREAK_SHIELDS}${isShieldMaxed ? ' (MAKS)' : ''}</span>` : ''}
                </div>
            </div>
            <div class="flex items-center gap-1 shrink-0">
                <button onclick="buyShopItem('${item.id}')" ${!canAfford ? 'disabled' : ''} class="font-display"
                    style="padding: 0.5rem 0.65rem; border-radius: 0.75rem; font-weight: 700; font-size: 0.75rem; display: flex; flex-direction: column; align-items: center; ${buyBtnStyle}">
                    ${isShieldMaxed
                        ? `<span>MAKS</span><span style="font-size: 9px; opacity: 0.8;">2 / 2</span>`
                        : `<span>${finalCost} G${hasDiscount ? ` <span style="text-decoration: line-through; opacity: 0.65; font-size: 9px;">${item.cost}</span>` : ''}</span>
                           <span style="font-size: 9px; text-transform: uppercase; opacity: 0.85;">Beli</span>`
                    }
                </button>
                <button onclick="openEditShopModal('${item.id}')" style="color: #94a3b8; padding: 4px;" title="Edit Item">
                    <svg class="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                </button>
                ${!['s1', 's_elixir', 's2', 's3', 's4'].includes(item.id) ? `
                <button onclick="deleteShopItem('${item.id}')" style="color: #64748b; padding: 4px;" title="Hapus Item">
                    <svg class="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
                ` : ''}
            </div>
        `;
        container.appendChild(card);
    });
    renderRedeemHistory();
}

function handleAddShopItem(e) {
    e.preventDefault();
    const title = document.getElementById('s-title').value.trim();
    const cost = parseInt(document.getElementById('s-cost').value, 10);
    const type = document.getElementById('s-type').value;

    if (!title || isNaN(cost) || cost <= 0) return;

    const descMap = {
        reward: 'Reward Dunia Nyata Kustom',
        potion: 'Memulihkan 25% Max HP secara instan.',
        elixir: 'Memulihkan HP hingga penuh (100% Max HP) secara instan.',
        shield: 'Pelindung Streak otomatis saat terlewat.'
    };

    gameState.shop.push({
        id: 's_' + Date.now(),
        title,
        cost,
        type,
        healPct: type === 'elixir' ? 1.0 : (type === 'potion' ? 0.25 : 0),
        desc: descMap[type] || 'Reward Kustom'
    });

    SoundFX.playCoin();
    document.getElementById('shop-form').reset();
    document.getElementById('shop-form').classList.add('hidden');
    saveState();
    renderShop();
    spawnFloatingReward('🛍️ Item Ditambahkan ke Shop!');
}

function recordRedeemHistory(title, cost, type, effectNote) {
    if (!Array.isArray(gameState.redeemHistory)) {
        gameState.redeemHistory = [];
    }
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    gameState.redeemHistory.unshift({
        id: 'rdm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
        title,
        cost,
        type,
        effectNote,
        dateStr: getCurrentGameDateKey(),
        timeStr
    });
    if (gameState.redeemHistory.length > 80) {
        gameState.redeemHistory = gameState.redeemHistory.slice(0, 80);
    }
}

function renderRedeemHistory() {
    const listEl = document.getElementById('redeem-history-list');
    const badgeEl = document.getElementById('redeem-count-badge');
    const headerCountEl = document.getElementById('header-redeem-count');
    const clearBtn = document.getElementById('btn-clear-redeem');
    if (!listEl) return;

    const records = Array.isArray(gameState.redeemHistory) ? gameState.redeemHistory : [];
    if (badgeEl) badgeEl.textContent = `${records.length}x Klaim`;
    if (headerCountEl) headerCountEl.textContent = records.length;
    if (clearBtn) {
        if (records.length > 0) clearBtn.classList.remove('hidden');
        else clearBtn.classList.add('hidden');
    }

    if (records.length === 0) {
        listEl.innerHTML = `<p style="font-size: 0.75rem; color: #64748b; text-align: center; padding: 0.75rem 0;">Belum ada reward yang di-redeem.</p>`;
        return;
    }

    const typeIcons = {
        potion: '🧪',
        elixir: '💖',
        shield: '🛡️',
        reward: '🎁',
        gacha: '🎲',
        relic: '⚔️'
    };

    listEl.innerHTML = records.map(r => `
        <div style="background: rgba(15,23,42,0.75); border: 1px solid rgba(30,41,59,0.9); border-radius: 0.75rem; padding: 0.5rem 0.75rem;" class="flex items-center justify-between gap-2">
            <div class="min-w-0 flex-1">
                <p class="truncate" style="font-size: 0.75rem; font-weight: 600; color: #f1f5f9;">
                    ${typeIcons[r.type] || '🎁'} ${escapeHtml(r.title)}
                </p>
                <div class="flex items-center gap-2" style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">
                    <span style="color: #67e8f9; font-weight: 600;">${escapeHtml(r.effectNote || 'Terklaim')}</span>
                    <span>•</span>
                    <span>${r.dateStr}${r.timeStr ? ' ' + r.timeStr : ''}</span>
                </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
                <span class="font-display" style="font-size: 11px; font-weight: 700; color: var(--amber-400);">-${r.cost} G</span>
                <button onclick="deleteRedeemRecord('${r.id}')" style="color: #64748b; padding: 3px;" title="Hapus Catatan Ini">
                    <svg class="icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
        </div>
    `).join('');
}

function deleteRedeemRecord(id) {
    if (!Array.isArray(gameState.redeemHistory)) return;
    SoundFX.playClick();
    gameState.redeemHistory = gameState.redeemHistory.filter(r => r.id !== id);
    saveState();
    renderRedeemHistory();
    spawnFloatingReward('Catatan redeem dihapus');
}

function clearRedeemHistory() {
    SoundFX.playClick();
    gameState.redeemHistory = [];
    saveState();
    renderRedeemHistory();
    spawnFloatingReward('Riwayat redeem dibersihkan');
}

function scrollToRedeemHistory() {
    SoundFX.playClick();
    const card = document.getElementById('redeem-history-card');
    if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function buyShopItem(id) {
    const item = gameState.shop.find(s => s.id === id);
    if (!item) return;

    const MAX_STREAK_SHIELDS = 2;
    const finalCost = getDiscountedShopCost(item.cost);
    if (gameState.player.gold < finalCost) return;

    if (item.type === 'shield' && (gameState.player.shields || 0) >= MAX_STREAK_SHIELDS) {
        SoundFX.playDamage();
        spawnFloatingReward(`⚠️ Stok Streak Shield Penuh (Maks ${MAX_STREAK_SHIELDS})!`);
        return;
    }

    syncPlayerMaxHp();
    if ((item.type === 'potion' || item.type === 'elixir') && gameState.player.hp >= gameState.player.maxHp) {
        SoundFX.playDamage();
        spawnFloatingReward(`❤️ HP Sudah Penuh (${gameState.player.hp}/${gameState.player.maxHp})!`);
        return;
    }

    SoundFX.playCoin();
    gameState.player.gold -= finalCost;

    let effectNote = 'Reward Dunia Nyata';
    if (item.type === 'potion' || item.type === 'elixir') {
        const pct = item.healPct || (item.type === 'elixir' ? 1.0 : 0.25);
        const rawHeal = Math.max(1, Math.round(gameState.player.maxHp * pct));
        const oldHp = gameState.player.hp;
        gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + rawHeal);
        const actualHealed = gameState.player.hp - oldHp;
        effectNote = `Pulih +${actualHealed} HP (${Math.round(pct * 100)}% Max HP)`;
        spawnFloatingReward(`🧪 +${actualHealed} HP Dipulihkan! (${gameState.player.hp}/${gameState.player.maxHp})`);
    } else if (item.type === 'shield') {
        gameState.player.shields = Math.min(MAX_STREAK_SHIELDS, (gameState.player.shields || 0) + 1);
        effectNote = `Streak Shield (${gameState.player.shields}/${MAX_STREAK_SHIELDS})`;
        spawnFloatingReward(`🛡️ +1 Streak Freeze! (Stok: ${gameState.player.shields}/${MAX_STREAK_SHIELDS})`);
    } else {
        effectNote = 'Reward Dunia Nyata';
        spawnFloatingReward(`🎁 Reward Diklaim: ${item.title}`);
    }

    recordRedeemHistory(item.title, finalCost, item.type, effectNote);

    saveState();
    renderAll();
}

function deleteShopItem(id) {
    SoundFX.playClick();
    gameState.shop = gameState.shop.filter(s => s.id !== id);
    saveState();
    renderShop();
}

// ==========================================
// MYSTERY CHEST GACHA SYSTEM (100 GOLD)
// ==========================================
function openMysteryGacha() {
    const GACHA_COST = 100;
    if (gameState.player.gold < GACHA_COST) {
        SoundFX.playDamage();
        spawnFloatingReward('⚠️ Gold tidak cukup! Butuh 100 Gold.');
        return;
    }

    // Potong 100 Gold langsung
    gameState.player.gold -= GACHA_COST;
    SoundFX.playClick();
    saveState();
    renderStatus();

    // Tampilkan modal dengan animasi peti bergetar
    const modal = document.getElementById('modal-gacha');
    const card = document.getElementById('gacha-modal-card');
    const badge = document.getElementById('gacha-rarity-badge');
    const icon = document.getElementById('gacha-chest-icon');
    const titleEl = document.getElementById('gacha-reward-title');
    const descEl = document.getElementById('gacha-reward-desc');
    const closeBtn = document.getElementById('btn-close-gacha');

    card.style.borderColor = '#c084fc';
    card.style.boxShadow = '0 0 20px rgba(168,85,247,0.35)';
    badge.textContent = 'SYSTEM GACHA';
    badge.style.cssText = 'display: inline-block; font-size: 10px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; padding: 3px 10px; border-radius: 9999px; background: rgba(168,85,247,0.2); color: #d8b4fe; border: 1px solid rgba(168,85,247,0.5);';
    icon.innerHTML = '<span class="animate-chest-shake">🎁</span>';
    titleEl.textContent = 'Membuka Peti Misteri...';
    titleEl.style.color = '#ffffff';
    descEl.textContent = 'Sistem sedang mengacak hadiah keberuntunganmu...';
    closeBtn.classList.add('hidden');

    openModal('modal-gacha');

    setTimeout(() => {
        const roll = Math.random() * 100;
        syncPlayerMaxHp();
        const statsPool = ['STR', 'INT', 'WIS', 'CHR'];
        const randStat = statsPool[Math.floor(Math.random() * statsPool.length)];

        let rarity = 'COMMON';
        let rarityStyle = 'background: rgba(100,116,139,0.25); color: #cbd5e1; border: 1px solid #64748b;';
        let borderCol = '#94a3b8';
        let glowShadow = '0 0 18px rgba(148,163,184,0.28)';
        let emoji = '📦';
        let rewardTitle = '';
        let rewardDesc = '';
        let logEffect = '';

        if (roll < 5) {
            // 5% LEGENDARY JACKPOT
            rarity = '★ LEGENDARY JACKPOT (5%) ★';
            rarityStyle = 'background: rgba(245,158,11,0.25); color: #fcd34d; border: 1px solid #fbbf24;';
            borderCol = '#fbbf24';
            glowShadow = '0 0 28px rgba(251,191,36,0.55)';
            emoji = '👑';
            gameState.player.gold += 300;
            gameState.player.hp = gameState.player.maxHp;
            addRewards(100, 0, randStat, 30, true);
            rewardTitle = '+300 GOLD + FULL HP + 100 XP!';
            rewardDesc = `Keberuntungan tertinggi! HP pulih penuh (${gameState.player.maxHp}/${gameState.player.maxHp}) & +30 ${randStat} XP.`;
            logEffect = 'Legendary: +300G, Full HP, +100XP';
            SoundFX.playLevelUp();
        } else if (roll < 20) {
            // 15% EPIC
            rarity = '✦ EPIC REWARD (15%) ✦';
            rarityStyle = 'background: rgba(168,85,247,0.25); color: #e9d5ff; border: 1px solid #c084fc;';
            borderCol = '#c084fc';
            glowShadow = '0 0 24px rgba(192,132,252,0.45)';
            emoji = '🛡️';
            if ((gameState.player.shields || 0) < 2) {
                gameState.player.shields = (gameState.player.shields || 0) + 1;
                addRewards(40, 0, 'WIS', 20, true);
                rewardTitle = '+1 STREAK SHIELD & +40 XP!';
                rewardDesc = `Pelindung Streak ditambahkan (Stok: ${gameState.player.shields}/2) +20 WIS XP.`;
                logEffect = 'Epic: +1 Streak Shield & +40 XP';
            } else {
                gameState.player.gold += 180;
                addRewards(50, 0, 'WIS', 20, true);
                rewardTitle = '+180 GOLD & +50 XP!';
                rewardDesc = 'Stok Shield penuh (2/2), dikonversi menjadi +180 Gold & +50 XP!';
                logEffect = 'Epic: +180 Gold & +50 XP';
            }
            SoundFX.playCritical();
        } else if (roll < 50) {
            // 30% RARE
            rarity = '◆ RARE REWARD (30%) ◆';
            rarityStyle = 'background: rgba(6,182,212,0.22); color: #67e8f9; border: 1px solid #22d3ee;';
            borderCol = '#22d3ee';
            glowShadow = '0 0 20px rgba(34,211,238,0.4)';
            emoji = '💎';
            if (Math.random() < 0.5) {
                addRewards(85, 0, randStat, 25, true);
                rewardTitle = `+85 XP & +25 ${randStat} XP!`;
                rewardDesc = `Lonjakan pengalaman instan untuk meningkatkan Level Hunter dan atribut ${randStat}.`;
                logEffect = `Rare: +85 XP & +25 ${randStat} XP`;
            } else {
                gameState.player.gold += 130;
                addRewards(25, 0, randStat, 15, true);
                rewardTitle = '+130 GOLD & +25 XP!';
                rewardDesc = 'Profit bersih +30 Gold beserta tambahan XP bonus!';
                logEffect = 'Rare: +130 Gold & +25 XP';
            }
            SoundFX.playQuestComplete();
        } else {
            // 50% COMMON
            rarity = '• COMMON SUPPLY (50%) •';
            emoji = '🧪';
            if (Math.random() < 0.5) {
                addRewards(45, 0, randStat, 15, true);
                rewardTitle = `+45 XP & +15 ${randStat} XP!`;
                rewardDesc = 'Suplai energi harian untuk mempercepat progres levelmu.';
                logEffect = `Common: +45 XP & +15 ${randStat} XP`;
            } else {
                const healAmt = Math.max(10, Math.round(gameState.player.maxHp * 0.25));
                const oldHp = gameState.player.hp;
                gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + healAmt);
                const healed = gameState.player.hp - oldHp;
                addRewards(30, 0, 'STR', 10, true);
                rewardTitle = `+${healed > 0 ? healed : healAmt} HP & +30 XP!`;
                rewardDesc = `Vitality dipulihkan ke ${gameState.player.hp}/${gameState.player.maxHp} HP beserta bonus +30 XP.`;
                logEffect = `Common: +${healed} HP & +30 XP`;
            }
            SoundFX.playCoin();
        }

        card.style.borderColor = borderCol;
        card.style.boxShadow = glowShadow;
        badge.textContent = rarity;
        badge.style.cssText = `display: inline-block; font-size: 10px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; padding: 3px 10px; border-radius: 9999px; ${rarityStyle}`;
        icon.textContent = emoji;
        titleEl.textContent = rewardTitle;
        titleEl.style.color = borderCol;
        descEl.textContent = rewardDesc;
        closeBtn.classList.remove('hidden');

        recordRedeemHistory('Mystery System Chest', GACHA_COST, 'gacha', logEffect);
        saveState();
        renderAll();
    }, 750);
}

// ==========================================
// 7. DUNGEON FOCUS TIMER + AMBIENT + WAKE LOCK
// ==========================================
let dungeonTotalSec = 1500;
let dungeonRemainingSec = 1500;
let dungeonEndTimeMs = 0;
let dungeonRewardXp = 100;
let dungeonRewardGold = 80;
let dungeonInterval = null;
let isDungeonRunning = false;

function populateDungeonLinkedQuests() {
    const sel = document.getElementById('dungeon-linked-quest');
    if (!sel) return;
    const prevVal = sel.value;
    const activeQuests = gameState.quests.filter(q => !q.completed);
    sel.innerHTML = `<option value="">-- Fokus Umum (+INT saja) --</option>` +
        activeQuests.map(q => `<option value="${q.id}">[${q.category === 'Daily Quest' ? 'Daily' : (q.category === 'Main Quest' ? 'Main' : 'Boss')}] ${escapeHtml(q.title)}</option>`).join('');
    if (activeQuests.some(q => q.id === prevVal)) {
        sel.value = prevVal;
    }
}

function setDungeonAmbient(mode) {
    SoundFX.ambientMode = mode;
    updateAmbientButtonsUI();
    if (mode !== 'none' && typeof lofiIsPlaying !== 'undefined' && lofiIsPlaying && typeof stopAnimeLofi1Hour === 'function') {
        stopAnimeLofi1Hour();
    }
    if (isDungeonRunning) {
        if (mode === 'none' || SoundFX.muted) SoundFX.stopAmbient();
        else SoundFX.startAmbient(mode);
    } else {
        SoundFX.playClick();
    }
    saveState();
}

function updateAmbientButtonsUI() {
    const modes = ['none', 'synth', 'rain'];
    const labels = { none: 'Mode: Hening', synth: 'Mode: Dark Synth', rain: 'Mode: Suara Hujan' };
    const activeLabel = document.getElementById('ambient-active-label');
    if (activeLabel) activeLabel.textContent = labels[SoundFX.ambientMode] || 'Mode: Hening';

    modes.forEach(m => {
        const btn = document.getElementById(`amb-${m}`);
        if (!btn) return;
        if (m === SoundFX.ambientMode) {
            btn.style.cssText = 'padding: 6px 4px; border-radius: 0.5rem; font-size: 11px; font-weight: 700; background: rgba(34,211,238,0.2); color: #67e8f9; border: 1px solid rgba(34,211,238,0.5);';
        } else {
            btn.style.cssText = 'padding: 6px 4px; border-radius: 0.5rem; font-size: 11px; font-weight: 700; background: var(--bg-slate-900); color: var(--text-muted); border: 1px solid #334155;';
        }
    });
}

function selectDungeonDuration(seconds, xp, gold, modeKey) {
    if (isDungeonRunning) return;
    SoundFX.playClick();
    dungeonTotalSec = seconds;
    dungeonRemainingSec = seconds;
    dungeonRewardXp = xp;
    dungeonRewardGold = gold;

    ['10m', '25m', '45m', '60m'].forEach(k => {
        const btn = document.getElementById(`mode-${k}`);
        if (!btn) return;
        if (k === modeKey) {
            btn.style.cssText = 'padding: 6px 10px; border-radius: 0.75rem; font-size: 0.75rem; font-weight: 700; background: rgba(168,85,247,0.2); color: #d8b4fe; border: 1px solid rgba(168,85,247,0.5);';
        } else {
            btn.style.cssText = 'padding: 6px 10px; border-radius: 0.75rem; font-size: 0.75rem; font-weight: 700; background: var(--bg-slate-900); color: var(--text-muted); border: 1px solid #334155;';
        }
    });

    document.getElementById('dungeon-reward-xp').textContent = `+${xp} XP`;
    document.getElementById('dungeon-reward-gold').textContent = `+${gold} Gold`;
    updateDungeonTimerUI();
}

function applyCustomDungeonDuration() {
    if (isDungeonRunning) return;
    const input = document.getElementById('custom-dungeon-mins');
    if (!input) return;
    const mins = parseInt(input.value, 10);
    if (isNaN(mins) || mins < 1 || mins > 180) {
        spawnFloatingReward('⚠️ Masukkan durasi antara 1 – 180 menit');
        return;
    }
    const seconds = mins * 60;
    const xp = Math.max(10, Math.round(mins * 4));
    const gold = Math.max(8, Math.round(mins * 3.2));
    selectDungeonDuration(seconds, xp, gold, 'custom');
    spawnFloatingReward(`⏱️ Durasi Dungeon diset ke ${mins} Menit!`);
}

function updateDungeonTimerUI() {
    const mins = Math.floor(dungeonRemainingSec / 60).toString().padStart(2, '0');
    const secs = (dungeonRemainingSec % 60).toString().padStart(2, '0');
    document.getElementById('dungeon-timer-text').textContent = `${mins}:${secs}`;

    const ring = document.getElementById('dungeon-progress-ring');
    const circumference = 276.46;
    const progress = dungeonRemainingSec / dungeonTotalSec;
    const offset = circumference * (1 - progress);
    ring.style.strokeDashoffset = offset;
}

function startDungeon() {
    if (isDungeonRunning) return;
    SoundFX.playClick();
    isDungeonRunning = true;

    ScreenWakeManager.enable();

    if (SoundFX.ambientMode !== 'none' && !SoundFX.muted) {
        SoundFX.startAmbient(SoundFX.ambientMode);
    }

    document.getElementById('dungeon-mode-selector').classList.add('hidden');
    document.getElementById('btn-start-dungeon').classList.add('hidden');
    document.getElementById('btn-abort-dungeon').classList.remove('hidden');

    const label = document.getElementById('dungeon-status-label');
    label.textContent = 'IN COMBAT // FOKUS';
    label.style.color = '#22d3ee';

    dungeonEndTimeMs = Date.now() + (dungeonRemainingSec * 1000);
    dungeonInterval = setInterval(() => {
        dungeonRemainingSec = Math.max(0, Math.ceil((dungeonEndTimeMs - Date.now()) / 1000));
        updateDungeonTimerUI();

        if (dungeonRemainingSec <= 0) {
            completeDungeon();
        }
    }, 500);
}

function completeDungeon() {
    clearInterval(dungeonInterval);
    isDungeonRunning = false;

    ScreenWakeManager.disable();
    SoundFX.stopAmbient();
    SoundFX.playLevelUp();

    const intXpGain = Math.max(15, Math.round(dungeonTotalSec / 50));
    const rewardResult = addRewards(dungeonRewardXp, dungeonRewardGold, 'INT', intXpGain);
    gameState.player.dungeonClears = (gameState.player.dungeonClears || 0) + 1;
    const mins = Math.round(dungeonTotalSec / 60);
    gameState.player.dungeonMinutesTotal = (gameState.player.dungeonMinutesTotal || 0) + mins;

    const linkedSel = document.getElementById('dungeon-linked-quest');
    const linkedQuestId = linkedSel ? linkedSel.value : '';
    let linkedNote = '';
    if (linkedQuestId) {
        const targetQ = gameState.quests.find(q => q.id === linkedQuestId && !q.completed);
        if (targetQ) {
            toggleQuest(targetQ.id);
            linkedNote = `\n\n🎯 Quest Tertaut "${targetQ.title}" otomatis selesai!`;
        }
    }

    recordActivityHistory(`Deep Focus Dungeon (${mins} Menit)`, 'Dungeon Clear', 'INT', rewardResult.finalXp, rewardResult.finalGold);
    saveState();
    renderHistory();
    resetDungeonUI();

    showSystemModal(
        'DUNGEON CLEARED!',
        `Luar biasa! Kamu bertahan fokus selama ${mins} menit dan mendapatkan +${rewardResult.finalXp} XP, +${rewardResult.finalGold} Gold, dan +${intXpGain} INT XP!${linkedNote}`
    );
}

function abortDungeon() {
    if (!isDungeonRunning) return;
    clearInterval(dungeonInterval);
    isDungeonRunning = false;

    ScreenWakeManager.disable();
    SoundFX.stopAmbient();

    takeDamage(10);
    resetDungeonUI();
    showSystemModal(
        'DUNGEON FAILED',
        'Kamu kabur dari Dungeon sebelum waktunya habis. Sistem memberikan penalti -10 HP!'
    );
}

function resetDungeonUI() {
    dungeonRemainingSec = dungeonTotalSec;
    updateDungeonTimerUI();
    document.getElementById('dungeon-mode-selector').classList.remove('hidden');
    document.getElementById('btn-start-dungeon').classList.remove('hidden');
    document.getElementById('btn-abort-dungeon').classList.add('hidden');
    const label = document.getElementById('dungeon-status-label');
    label.textContent = 'GATE READY';
    label.style.color = '#c084fc';
}

// ==========================================
// 8. DAILY SIMULATION, TITLES & MODALS
// ==========================================
function openTitlesModal() {
    SoundFX.playClick();
    const listEl = document.getElementById('titles-list');
    listEl.innerHTML = '';

    TITLES_CATALOG.forEach(t => {
        const unlocked = t.checkUnlocked(gameState);
        const isActive = gameState.player.activeTitle === t.id;

        const card = document.createElement('div');
        card.style.cssText = `padding: 0.75rem; border-radius: 0.75rem; border: 1px solid ${isActive ? '#fbbf24' : (unlocked ? '#334155' : '#1e293b')}; background: ${isActive ? 'rgba(245,158,11,0.12)' : (unlocked ? 'rgba(15,23,42,0.85)' : 'rgba(2,6,23,0.6)')}; ${!unlocked ? 'opacity: 0.55;' : ''}`;
        card.innerHTML = `
            <div class="flex items-center justify-between gap-2">
                <div>
                    <div class="flex items-center gap-1-5">
                        <span style="font-size: 0.875rem;">${unlocked ? '👑' : '🔒'}</span>
                        <h4 class="font-display" style="font-size: 0.875rem; font-weight: 700; color: ${isActive ? '#fcd34d' : '#fff'};">${t.name}</h4>
                    </div>
                    <p style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${t.reqText}</p>
                    <p class="font-display" style="font-size: 10px; font-weight: 700; color: var(--cyan-400); margin-top: 4px;">${t.buffText}</p>
                </div>
                <button onclick="selectActiveTitle('${t.id}')" ${!unlocked || isActive ? 'disabled' : ''} class="font-display shrink-0"
                    style="padding: 6px 10px; border-radius: 0.5rem; font-size: 11px; font-weight: 700; ${isActive ? 'background: var(--amber-500); color: #020617;' : (unlocked ? 'background: var(--bg-slate-800); color: #67e8f9; border: 1px solid #334155;' : 'background: var(--bg-slate-900); color: #475569;')}">
                    ${isActive ? 'Aktif' : (unlocked ? 'Pakai' : 'Terkunci')}
                </button>
            </div>
        `;
        listEl.appendChild(card);
    });

    if (typeof applyAppLanguage === 'function') applyAppLanguage();
    openModal('modal-titles');
}

function selectActiveTitle(titleId) {
    const titleObj = TITLES_CATALOG.find(t => t.id === titleId);
    if (!titleObj || !titleObj.checkUnlocked(gameState)) return;
    SoundFX.playQuestComplete();
    gameState.player.activeTitle = titleId;
    saveState();
    renderStatus();
    openTitlesModal();
    spawnFloatingReward(`👑 Gelar Aktif: ${titleObj.name}`);
}

function cycleActiveTitle() {
    const unlockedList = TITLES_CATALOG.filter(t => t.checkUnlocked(gameState));
    if (unlockedList.length <= 1) {
        openTitlesModal();
        spawnFloatingReward('ℹ️ Selesaikan misi & streak untuk membuka Title baru!');
        return;
    }
    const currentIdx = unlockedList.findIndex(t => t.id === gameState.player.activeTitle);
    const nextIdx = (currentIdx + 1) % unlockedList.length;
    const nextTitle = unlockedList[nextIdx];

    SoundFX.playQuestComplete();
    gameState.player.activeTitle = nextTitle.id;
    saveState();
    renderStatus();
    spawnFloatingReward(`👑 Title: ${nextTitle.name} (${nextTitle.buffText})`);
}

function simulateNextDay() {
    SoundFX.playClick();
    const gEl = document.getElementById('journal-gratitude');
    const iEl = document.getElementById('journal-improve');
    if (gEl) gEl.value = '';
    if (iEl) iEl.value = '';
    openModal('modal-daily-journal');
}

function confirmJournalAndAdvance(saveJournal) {
    closeModal('modal-daily-journal');
    const currentKey = getCurrentGameDateKey();

    if (saveJournal) {
        const gratitude = (document.getElementById('journal-gratitude')?.value || '').trim();
        const improve = (document.getElementById('journal-improve')?.value || '').trim();
        if (gratitude || improve) {
            if (!gameState.history.journals) gameState.history.journals = [];
            gameState.history.journals.unshift({ dateStr: currentKey, gratitude, improve });
            addRewards(10, 5, 'WIS', 15, true);
            spawnFloatingReward('📜 Jurnal Tersimpan: +15 WIS XP & +10 XP!');
        }
    }

    const dailyQuests = gameState.quests.filter(q => q.category === 'Daily Quest' && isQuestActiveOnDate(q, getCurrentGameDateKey()));
    const doneCount = dailyQuests.filter(q => q.completed).length;
    const totalDaily = dailyQuests.length;
    const ratio = totalDaily > 0 ? (doneCount / totalDaily) : 1;
    const pct = Math.round(ratio * 100);

    gameState.quests.forEach(q => {
        if (q.category === 'Daily Quest') {
            q.completed = false;
            if (q.trackingType === 'count') q.currentCount = 0;
            delete q.lastReward;
        }
    });

    const curDate = parseDateKey(currentKey);
    curDate.setDate(curDate.getDate() + 1);
    const nextDateKey = formatDateKey(curDate);
    gameState.selectedDate = nextDateKey;
    gameState.lastRealDate = nextDateKey;

    syncPlayerMaxHp();
    const tier = evaluateDailyTier(ratio, gameState.player.maxHp);

    if (tier.rawDamage > 0) {
        let shieldMsg = '';
        if (tier.resetStreak) {
            if ((gameState.player.shields || 0) > 0 && gameState.player.streak > 0) {
                gameState.player.shields -= 1;
                shieldMsg = ` 🛡️ Streak Shield otomatis menahan Streak ${gameState.player.streak} hari (sisa Shield: ${gameState.player.shields})!`;
            } else {
                gameState.player.streak = 0;
                gameState.lastStreakDate = null;
                shieldMsg = ' Streak di-reset ke 0.';
            }
        } else {
            shieldMsg = ` Streak ${gameState.player.streak} hari tetap aman (≥${getStreakThresholdPct()}%), namun tanpa regen HP.`;
        }
        takeDamage(tier.rawDamage);
        const { wisDmgReduce } = getAttributePassives();
        const actualDmg = Math.max(1, Math.round(tier.rawDamage * (1 - wisDmgReduce)));
        showSystemModal(
            `EVALUASI HARIAN // ${tier.rank.toUpperCase()}`,
            `Progres Daily Quest tanggal ${currentKey}: ${pct}% (${doneCount}/${totalDaily}). Penalti ${Math.round(tier.penaltyRate * 100)}% Max HP (-${actualDmg} HP).${shieldMsg} Tanggal sistem maju ke ${formatReadableDate(nextDateKey)}.`
        );
    } else {
        SoundFX.playQuestComplete();
        if (gameState.lastStreakDate !== currentKey) {
            gameState.player.streak += 1;
            if (gameState.player.streak > (gameState.player.longestStreak || 0)) {
                gameState.player.longestStreak = gameState.player.streak;
            }
        }
        gameState.lastStreakDate = null;
        const healAmt = Math.min(tier.regenAmt, gameState.player.maxHp - gameState.player.hp);
        gameState.player.hp += healAmt;
        showSystemModal(
            'EVALUASI HARIAN // S-RANK PERFECT CLEAR!',
            `Sempurna! 100% Daily Quest (${doneCount}/${totalDaily}) selesai pada ${currentKey}. Streak menjadi ${gameState.player.streak} Hari!${healAmt > 0 ? ` Regen +${healAmt} HP (+15% Max HP).` : ' HP sudah penuh.'} Tanggal sistem maju ke ${formatReadableDate(nextDateKey)}.`
        );
    }

    saveState();
    renderAll();
}

function openEditNameModal() {
    SoundFX.playClick();
    document.getElementById('input-player-name').value = gameState.player.name || '';
    const jobInput = document.getElementById('input-player-job');
    if (jobInput) jobInput.value = gameState.player.job || 'Shadow Monarch';
    openModal('modal-edit-name');
}

function savePlayerName() {
    const val = document.getElementById('input-player-name').value.trim();
    const jobVal = document.getElementById('input-player-job')?.value.trim();
    if (val) gameState.player.name = val;
    if (jobVal) gameState.player.job = jobVal;
    if (val || jobVal) {
        SoundFX.playCoin();
        saveState();
        renderStatus();
    }
    closeModal('modal-edit-name');
}

function openResetModal() {
    SoundFX.playClick();
    openModal('modal-reset');
}

function confirmResetData() {
    SoundFX.playDamage();
    localStorage.removeItem(STORAGE_KEY);
    gameState = initDemoHistory(JSON.parse(JSON.stringify(DEFAULT_STATE)));
    saveState();
    closeModal('modal-reset');
    renderAll();
    spawnFloatingReward('🔄 Sistem Di-reset ke Awal');
}

// ==========================================
// 9. NAVIGATION & VISUAL HELPERS
// ==========================================
function switchTab(tabName) {
    SoundFX.playClick();
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(`tab-${tabName}`).classList.remove('hidden');

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.color = '#64748b';
    });

    const activeBtn = document.getElementById(`nav-${tabName}`);
    activeBtn.classList.add('active');
    activeBtn.style.color = '#22d3ee';
}

function spawnFloatingReward(text) {
    const container = document.getElementById('floating-container');
    const badge = document.createElement('div');
    badge.className = 'animate-float-reward font-display shadow-neon-blue';
    badge.style.cssText = 'padding: 0.5rem 1rem; border-radius: 9999px; background: rgba(15,23,42,0.95); border: 1px solid #22d3ee; color: #67e8f9; font-weight: 700; font-size: 0.75rem; text-align: center;';
    badge.textContent = text;
    container.appendChild(badge);
    setTimeout(() => badge.remove(), 1850);
}

function showSystemModal(title, body) {
    document.getElementById('sys-msg-title').textContent = title;
    document.getElementById('sys-msg-body').textContent = body;
    openModal('modal-system-msg');
}

function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
    SoundFX.playClick();
    document.getElementById(id).classList.add('hidden');
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ==========================================
// 10. MOBILE PUSH NOTIFICATION REMINDERS
// ==========================================
function ensureReminderState() {
    if (!gameState.reminders) {
        gameState.reminders = {
            enabled: false,
            times: { Pagi: '07:30', Sore: '16:30', Malam: '20:30' },
            lastFired: {}
        };
    }
    return gameState.reminders;
}

function renderReminderUI() {
    const rem = ensureReminderState();
    const badge = document.getElementById('notif-status-badge');
    const btn = document.getElementById('btn-toggle-notif');
    const inPagi = document.getElementById('rem-time-pagi');
    const inSore = document.getElementById('rem-time-sore');
    const inMalam = document.getElementById('rem-time-malam');

    if (inPagi) inPagi.value = rem.times.Pagi || '07:30';
    if (inSore) inSore.value = rem.times.Sore || '16:30';
    if (inMalam) inMalam.value = rem.times.Malam || '20:30';

    if (badge && btn) {
        if (rem.enabled) {
            badge.textContent = 'AKTIF';
            badge.style.cssText = 'font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 9999px; background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid rgba(16,185,129,0.45);';
            btn.textContent = '🔕 Matikan Notifikasi';
            btn.style.cssText = 'flex: 1; font-weight: 700; font-size: 0.75rem; padding: 0.55rem 0.65rem; border-radius: 0.75rem; background: rgba(244,63,94,0.16); color: #fda4af; border: 1px solid rgba(244,63,94,0.45);';
        } else {
            badge.textContent = 'NONAKTIF';
            badge.style.cssText = 'font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 9999px; background: rgba(100,116,139,0.2); color: #94a3b8; border: 1px solid #475569;';
            btn.textContent = '🔔 Aktifkan Notifikasi';
            btn.style.cssText = 'flex: 1; font-weight: 700; font-size: 0.75rem; padding: 0.55rem 0.65rem; border-radius: 0.75rem; background: rgba(6,182,212,0.18); color: #67e8f9; border: 1px solid rgba(6,182,212,0.45);';
        }
    }
}

function saveReminders() {
    const rem = ensureReminderState();
    const p = document.getElementById('rem-time-pagi')?.value;
    const s = document.getElementById('rem-time-sore')?.value;
    const m = document.getElementById('rem-time-malam')?.value;
    if (p) rem.times.Pagi = p;
    if (s) rem.times.Sore = s;
    if (m) rem.times.Malam = m;
    saveState();
    syncSystemReminders();
    spawnFloatingReward('⏰ Jadwal Reminder Disimpan');
}

async function togglePushReminder() {
    SoundFX.playClick();
    const rem = ensureReminderState();

    if (!rem.enabled) {
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                const perm = await Notification.requestPermission();
                if (perm !== 'granted') {
                    showSystemModal(
                        'IZIN NOTIFIKASI DIBUTUHKAN',
                        'Browser / HP memblokir izin notifikasi. Buka Pengaturan Browser / Info Aplikasi Android → Notifikasi → Izinkan agar pengingat layar atas muncul.'
                    );
                    return;
                }
            } else if (Notification.permission === 'denied') {
                showSystemModal(
                    'NOTIFIKASI DIBLOKIR SISTEM',
                    'Izin notifikasi saat ini berstatus Diblokir. Silakan aktifkan izin Notifikasi untuk aplikasi/situs ini di Pengaturan HP Anda.'
                );
                return;
            }
        }
        rem.enabled = true;
        saveState();
        renderReminderUI();
        syncSystemReminders();
        spawnFloatingReward('🔔 Reminder Notifikasi HP Aktif!');
    } else {
        rem.enabled = false;
        saveState();
        renderReminderUI();
        cancelNativeSystemReminders();
        spawnFloatingReward('🔕 Reminder Notifikasi Dimatikan');
    }
}

function getPendingDailySummary() {
    const dailyQuests = gameState.quests.filter(q => q.category === 'Daily Quest' && isQuestActiveOnDate(q, getCurrentGameDateKey()));
    const pending = dailyQuests.filter(q => !q.completed);
    return {
        total: dailyQuests.length,
        done: dailyQuests.length - pending.length,
        pendingCount: pending.length,
        sampleTitles: pending.slice(0, 3).map(q => q.title)
    };
}

async function fireOsNotification(title, body, tag = 'system-rpg-reminder') {
    if (window.AndroidBridge && typeof window.AndroidBridge.showNotification === 'function') {
        window.AndroidBridge.showNotification(title, body);
        return true;
    }
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        return false;
    }
    try {
        if ('serviceWorker' in navigator) {
            const reg = await navigator.serviceWorker.getRegistration();
            if (reg && typeof reg.showNotification === 'function') {
                await reg.showNotification(title, {
                    body,
                    tag,
                    renotify: true,
                    vibrate: [200, 100, 200]
                });
                return true;
            }
        }
    } catch (e) {}

    try {
        new Notification(title, { body, tag });
        return true;
    } catch (e) {
        return false;
    }
}

async function sendTestSystemNotification() {
    SoundFX.playClick();
    if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
    }
    const summary = getPendingDailySummary();
    const body = summary.pendingCount > 0
        ? `Hunter ${gameState.player.name}, masih ada ${summary.pendingCount} Daily Quest belum selesai (${summary.sampleTitles.join(', ')})!`
        : `Luar biasa Hunter ${gameState.player.name}! Semua Daily Quest hari ini sudah selesai 100%!`;

    const ok = await fireOsNotification('⚔️ SYSTEM // Daily Quest Alert', body, 'system-rpg-test');
    if (ok) {
        spawnFloatingReward('📲 Notifikasi Terkirim ke Layar Atas HP!');
    } else {
        showSystemModal(
            'PREVIEW NOTIFIKASI',
            `Izin notifikasi OS belum diizinkan di browser ini, namun isi pesan pengingatmu adalah:\n\n"${body}"`
        );
    }
}

function syncSystemReminders() {
    const rem = ensureReminderState();
    if (!rem.enabled) { cancelNativeSystemReminders(); return; }
    const summary = getPendingDailySummary();
    const pct = summary.total > 0 ? Math.round((summary.done / summary.total) * 100) : 0;
    const thresholdPct = getStreakThresholdPct();
    try {
        if (window.AndroidBridge) {
            if (typeof window.AndroidBridge.scheduleDailyRemindersFull === 'function') {
                window.AndroidBridge.scheduleDailyRemindersFull(JSON.stringify({
                    times: rem.times,
                    pendingCount: summary.pendingCount,
                    doneCount: summary.done,
                    totalCount: summary.total,
                    pct: pct,
                    thresholdPct: thresholdPct,
                    playerName: gameState.player.name,
                    streak: gameState.player.streak
                }));
            }
            if (typeof window.AndroidBridge.scheduleDailyReminders === 'function') {
                window.AndroidBridge.scheduleDailyReminders(
                    JSON.stringify(rem.times),
                    summary.pendingCount,
                    gameState.player.name
                );
            }
        }
    } catch (e) {}
}

function cancelNativeSystemReminders() {
    try {
        if (window.AndroidBridge && typeof window.AndroidBridge.cancelDailyReminders === 'function') {
            window.AndroidBridge.cancelDailyReminders();
        }
    } catch (e) {}
}

function checkScheduledReminderTick() {
    const rem = ensureReminderState();
    if (!rem.enabled) return;

    const now = new Date();
    const todayKey = formatDateKey(now);
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const nowTime = `${hh}:${mm}`;

    if (!rem.lastFired) rem.lastFired = {};

    ['Pagi', 'Sore', 'Malam'].forEach(slot => {
        const targetTime = rem.times[slot];
        const fireKey = `${todayKey}_${slot}`;
        if (targetTime && nowTime === targetTime && !rem.lastFired[fireKey]) {
            const summary = getPendingDailySummary();
            if (summary.pendingCount > 0) {
                rem.lastFired[fireKey] = true;
                saveState();
                const slotPending = gameState.quests.filter(
                    q => q.category === 'Daily Quest' && !q.completed && inferQuestTimeSlot(q) === slot
                );
                const focusText = slotPending.length > 0
                    ? `${slotPending.length} misi ${slot} menunggumu (${slotPending.slice(0, 2).map(q => q.title).join(', ')})`
                    : `${summary.pendingCount} Daily Quest hari ini masih menunggu diselesaikan`;

                fireOsNotification(
                    `⚔️ SYSTEM // Pengingat ${slot}`,
                    `Hunter ${gameState.player.name}, ${focusText}. Jaga Streak ${gameState.player.streak} harimu!`,
                    `system-rpg-${slot.toLowerCase()}`
                );
            }
        }
    });
}

// ==========================================
// 11. TREASURY (KEUANGAN + KALKULATOR + ANALITIK)
// ==========================================
let calcExpr = '';
let treasuryPeriodMode = 'daily'; // 'daily' | 'monthly' | 'yearly'

const TREASURY_CATEGORIES = {
    expense: ['🍔 Makan & Jajan', '🚗 Transportasi', '🛒 Belanja & Kebutuhan', '📱 Tagihan & Kuota', '📚 Edukasi & Buku', '🎮 Hiburan', '💊 Kesehatan', '📦 Lainnya'],
    income: ['💼 Gaji / Honor', '🎁 Bonus / Hadiah', '📈 Usaha / Freelance', '💰 Pemasukan Lain']
};

function ensureTreasuryState() {
    if (!gameState.treasury) {
        gameState.treasury = { transactions: [], dailyBonusCounts: {} };
    }
    if (!Array.isArray(gameState.treasury.transactions)) gameState.treasury.transactions = [];
    if (!gameState.treasury.dailyBonusCounts) gameState.treasury.dailyBonusCounts = {};
    return gameState.treasury;
}

function formatRupiah(num) {
    const sign = num < 0 ? '-' : '';
    return sign + 'Rp ' + Math.abs(Math.round(num)).toLocaleString('id-ID');
}

function updateTreasuryCategoryOptions() {
    const typeEl = document.getElementById('tx-type');
    const catEl = document.getElementById('tx-category');
    if (!typeEl || !catEl) return;
    const list = TREASURY_CATEGORIES[typeEl.value] || TREASURY_CATEGORIES.expense;
    catEl.innerHTML = list.map(c => `<option value="${c}">${c}</option>`).join('');
}

function calcInput(val) {
    SoundFX.playClick();
    const ops = ['+', '-', '*', '/'];
    if (calcExpr === '' && ops.includes(val)) {
        calcExpr = '0' + val;
    } else if (ops.includes(val) && ops.includes(calcExpr.slice(-1))) {
        calcExpr = calcExpr.slice(0, -1) + val;
    } else {
        calcExpr += val;
    }
    updateCalcDisplay();
}

function calcBackspace() {
    SoundFX.playClick();
    calcExpr = calcExpr.slice(0, -1);
    updateCalcDisplay();
}

function calcClear() {
    SoundFX.playClick();
    calcExpr = '';
    document.getElementById('calc-expression').textContent = '0';
    document.getElementById('calc-display').textContent = '0';
}

function evaluateCalcExpression(expr) {
    if (!expr) return 0;
    let sanitized = expr.replace(/[^0-9+\-*/.]/g, '').replace(/[+\-*/.]+$/, '');
    if (!sanitized) return 0;
    sanitized = sanitized.replace(/(^|[+\-*/])0+(?=\d)/g, '$1');
    try {
        const res = Function('"use strict";return (' + sanitized + ')')();
        return (typeof res === 'number' && isFinite(res)) ? Math.round(res) : 0;
    } catch (e) {
        return 0;
    }
}

function updateCalcDisplay() {
    const exprEl = document.getElementById('calc-expression');
    const dispEl = document.getElementById('calc-display');
    if (!exprEl || !dispEl) return;
    exprEl.textContent = calcExpr.replace(/\*/g, '×').replace(/\//g, '÷') || '0';
    const preview = evaluateCalcExpression(calcExpr);
    dispEl.textContent = preview.toLocaleString('id-ID');
}

function calcEquals() {
    SoundFX.playCoin();
    const val = evaluateCalcExpression(calcExpr);
    document.getElementById('calc-expression').textContent = (calcExpr.replace(/\*/g, '×').replace(/\//g, '÷') || '0') + ' =';
    calcExpr = val > 0 ? String(val) : '';
    document.getElementById('calc-display').textContent = val.toLocaleString('id-ID');
}

function applyCalcToNominal() {
    SoundFX.playQuestComplete();
    const val = evaluateCalcExpression(calcExpr);
    const amountInput = document.getElementById('tx-amount');
    if (amountInput && val > 0) {
        amountInput.value = val;
        spawnFloatingReward(`✓ Nominal Rp ${val.toLocaleString('id-ID')} dimasukkan!`);
    } else {
        spawnFloatingReward('⚠️ Hitung nominal lebih dari 0 terlebih dahulu');
    }
}

function handleAddTreasuryTx(e) {
    e.preventDefault();
    const tr = ensureTreasuryState();
    const type = document.getElementById('tx-type').value;
    const dateStr = document.getElementById('tx-date').value || getCurrentGameDateKey();
    const amount = Math.max(1, parseInt(document.getElementById('tx-amount').value, 10) || 0);
    const category = document.getElementById('tx-category').value;
    const note = document.getElementById('tx-note').value.trim();
    if (!amount || !note) return;

    tr.transactions.unshift({
        id: 'tx_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
        type,
        dateStr,
        amount,
        category,
        note
    });

    const todayKey = getCurrentGameDateKey();
    const usedToday = tr.dailyBonusCounts[todayKey] || 0;
    if (usedToday < 3) {
        tr.dailyBonusCounts[todayKey] = usedToday + 1;
        SoundFX.playQuestComplete();
        addRewards(10, 0, 'WIS', 10, true);
        spawnFloatingReward(`💰 Tercatat! +10 XP & +10 WIS XP (${tr.dailyBonusCounts[todayKey]}/3 hari ini)`);
    } else {
        SoundFX.playCoin();
        spawnFloatingReward('💰 Transaksi keuangan berhasil dicatat!');
    }

    document.getElementById('tx-amount').value = '';
    document.getElementById('tx-note').value = '';
    saveState();
    renderTreasury();
}

function deleteTreasuryTx(id) {
    const tr = ensureTreasuryState();
    SoundFX.playClick();
    tr.transactions = tr.transactions.filter(t => t.id !== id);
    saveState();
    renderTreasury();
    spawnFloatingReward('🗑️ Transaksi dihapus');
}

function setTreasuryPeriodMode(mode) {
    SoundFX.playClick();
    treasuryPeriodMode = mode;
    ['daily', 'monthly', 'yearly'].forEach(m => {
        const btn = document.getElementById(`tr-mode-${m}`);
        if (!btn) return;
        if (m === mode) {
            btn.style.cssText = 'padding: 6px; border-radius: 0.5rem; font-size: 11px; font-weight: 700; background: rgba(6,182,212,0.2); color: #67e8f9; border: 1px solid rgba(6,182,212,0.45);';
        } else {
            btn.style.cssText = 'padding: 6px; border-radius: 0.5rem; font-size: 11px; font-weight: 700; background: var(--bg-slate-900); color: var(--text-muted); border: 1px solid var(--bg-slate-800);';
        }
    });

    const lbl = document.getElementById('tr-filter-label');
    const fDate = document.getElementById('tr-filter-date');
    const fMonth = document.getElementById('tr-filter-month');
    const fYear = document.getElementById('tr-filter-year');

    fDate.classList.add('hidden');
    fMonth.classList.add('hidden');
    fYear.classList.add('hidden');

    if (mode === 'daily') {
        lbl.textContent = 'Filter Tanggal:';
        fDate.classList.remove('hidden');
    } else if (mode === 'monthly') {
        lbl.textContent = 'Filter Bulan:';
        fMonth.classList.remove('hidden');
    } else {
        lbl.textContent = 'Filter Tahun:';
        fYear.classList.remove('hidden');
    }
    renderTreasury();
}

function initTreasuryDefaults() {
    const todayKey = getCurrentGameDateKey();
    const txDate = document.getElementById('tx-date');
    const fDate = document.getElementById('tr-filter-date');
    const fMonth = document.getElementById('tr-filter-month');
    const fYear = document.getElementById('tr-filter-year');

    if (txDate && !txDate.value) txDate.value = todayKey;
    if (fDate && !fDate.value) fDate.value = todayKey;
    if (fMonth && !fMonth.value) fMonth.value = todayKey.slice(0, 7);
    if (fYear && fYear.options.length === 0) {
        const curY = new Date().getFullYear();
        for (let y = curY + 1; y >= curY - 4; y--) {
            const opt = document.createElement('option');
            opt.value = String(y);
            opt.textContent = String(y);
            if (y === curY) opt.selected = true;
            fYear.appendChild(opt);
        }
    }
    updateTreasuryCategoryOptions();
}

function renderTreasury() {
    const tr = ensureTreasuryState();
    const todayKey = getCurrentGameDateKey();
    const quotaUsed = tr.dailyBonusCounts[todayKey] || 0;
    const quotaBadge = document.getElementById('treasury-rpg-quota-badge');
    if (quotaBadge) quotaBadge.textContent = `Bonus RPG: ${quotaUsed}/3 Hari Ini`;

    const fDate = document.getElementById('tr-filter-date')?.value || todayKey;
    const fMonth = document.getElementById('tr-filter-month')?.value || todayKey.slice(0, 7);
    const fYear = document.getElementById('tr-filter-year')?.value || todayKey.slice(0, 4);

    const filtered = tr.transactions.filter(tx => {
        if (treasuryPeriodMode === 'daily') return tx.dateStr === fDate;
        if (treasuryPeriodMode === 'monthly') return (tx.dateStr || '').startsWith(fMonth);
        return (tx.dateStr || '').startsWith(fYear);
    });

    let totalIn = 0;
    let totalOut = 0;
    const catTotals = {};

    filtered.forEach(tx => {
        if (tx.type === 'income') {
            totalIn += tx.amount;
        } else {
            totalOut += tx.amount;
            catTotals[tx.category] = (catTotals[tx.category] || 0) + tx.amount;
        }
    });

    const net = totalIn - totalOut;
    const elIn = document.getElementById('tr-total-income');
    const elOut = document.getElementById('tr-total-expense');
    const elNet = document.getElementById('tr-net-balance');
    if (elIn) elIn.textContent = formatRupiah(totalIn);
    if (elOut) elOut.textContent = formatRupiah(totalOut);
    if (elNet) {
        elNet.textContent = formatRupiah(net);
        elNet.style.color = net >= 0 ? '#22d3ee' : '#fb7185';
    }

    const sumFlow = totalIn + totalOut;
    const inPct = sumFlow > 0 ? Math.round((totalIn / sumFlow) * 100) : 50;
    const outPct = sumFlow > 0 ? (100 - inPct) : 50;
    const elInPct = document.getElementById('tr-ratio-in-pct');
    const elOutPct = document.getElementById('tr-ratio-out-pct');
    const elInBar = document.getElementById('tr-ratio-in-bar');
    const elOutBar = document.getElementById('tr-ratio-out-bar');
    if (elInPct) elInPct.textContent = `${inPct}%`;
    if (elOutPct) elOutPct.textContent = `${outPct}%`;
    if (elInBar) elInBar.style.width = `${inPct}%`;
    if (elOutBar) elOutBar.style.width = `${outPct}%`;

    const catBox = document.getElementById('tr-category-breakdown');
    if (catBox) {
        const entries = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
        if (entries.length === 0) {
            catBox.innerHTML = `<p style="font-size: 11px; color: #64748b;">Belum ada pengeluaran pada periode ini.</p>`;
        } else {
            catBox.innerHTML = entries.map(([cat, amt]) => {
                const pct = totalOut > 0 ? Math.round((amt / totalOut) * 100) : 0;
                return `
                    <div style="background: rgba(15,23,42,0.75); border: 1px solid #1e293b; border-radius: 0.55rem; padding: 0.4rem 0.6rem;">
                        <div class="flex justify-between" style="font-size: 11px; margin-bottom: 3px;">
                            <span style="color: #e2e8f0; font-weight: 600;">${escapeHtml(cat)}</span>
                            <span class="font-display" style="color: #fb7185; font-weight: 700;">${formatRupiah(amt)} (${pct}%)</span>
                        </div>
                        <div class="progress-track-sm">
                            <div class="progress-fill" style="width: ${pct}%; background: linear-gradient(to right, #f43f5e, #fb923c);"></div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    const txListEl = document.getElementById('tr-transaction-list');
    if (txListEl) {
        if (filtered.length === 0) {
            txListEl.innerHTML = `<p style="font-size: 11px; color: #64748b; text-align: center; padding: 0.65rem 0;">Tidak ada transaksi pada periode ini.</p>`;
        } else {
            txListEl.innerHTML = filtered.map(tx => {
                const isInc = tx.type === 'income';
                return `
                    <div style="background: rgba(15,23,42,0.75); border: 1px solid rgba(30,41,59,0.9); border-radius: 0.65rem; padding: 0.5rem 0.65rem;" class="flex items-center justify-between gap-2">
                        <div class="min-w-0 flex-1">
                            <p class="truncate" style="font-size: 0.75rem; font-weight: 600; color: #f1f5f9;">${escapeHtml(tx.note)}</p>
                            <p style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">${escapeHtml(tx.category)} • ${tx.dateStr}</p>
                        </div>
                        <div class="flex items-center gap-2 shrink-0">
                            <span class="font-display" style="font-size: 0.75rem; font-weight: 700; color: ${isInc ? '#34d399' : '#fb7185'};">
                                ${isInc ? '+' : '-'}${formatRupiah(tx.amount)}
                            </span>
                            <button type="button" onclick="deleteTreasuryTx('${tx.id}')" style="color: #64748b; padding: 3px;" title="Hapus">✕</button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
}

// ==========================================
// 12. ANCIENT GRIMOIRE READER (PDF IN DUNGEON)
// ==========================================
let grimoirePdfDoc = null;
let grimoireCurrentPage = 1;
let grimoireTotalPages = 1;
let grimoireScale = 1.0;
let grimoireCurrentFileName = '';
let grimoireRenderTask = null;

if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '';
}

function ensureGrimoireBookmarks() {
    if (!gameState.grimoireBookmarks || typeof gameState.grimoireBookmarks !== 'object') {
        gameState.grimoireBookmarks = {};
    }
    return gameState.grimoireBookmarks;
}

function renderGrimoireBookmarks() {
    const bm = ensureGrimoireBookmarks();
    const entries = Object.entries(bm);
    const countEl = document.getElementById('grimoire-bookmark-count');
    const listEl = document.getElementById('grimoire-bookmark-list');
    if (countEl) countEl.textContent = `${entries.length} File`;
    if (!listEl) return;

    if (entries.length === 0) {
        listEl.innerHTML = `<span style="font-size: 10px; color: #64748b;">Belum ada bookmark tersimpan.</span>`;
        return;
    }

    listEl.innerHTML = entries.map(([fileName, info]) => `
        <div style="background: rgba(15,23,42,0.9); border: 1px solid rgba(245,158,11,0.4); border-radius: 0.55rem; padding: 4px 8px; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; flex-shrink: 0;">
            <span style="font-size: 10px; color: #fcd34d; font-weight: 700;">🔖 ${escapeHtml(fileName.length > 22 ? fileName.slice(0, 20) + '…' : fileName)}</span>
            <span class="font-display" style="font-size: 10px; color: #67e8f9; font-weight: 700;">Hal ${info.page}/${info.totalPages || '?'}</span>
            <button type="button" data-filename="${escapeHtml(fileName)}" onclick="deleteGrimoireBookmark(this.dataset.filename)" style="color: #f87171; font-size: 12px; font-weight: bold; padding: 2px 6px; margin-left: 2px; cursor: pointer;" title="Hapus Bookmark">✕</button>
        </div>
    `).join('');
}

function deleteGrimoireBookmark(fileName) {
    const bm = ensureGrimoireBookmarks();
    SoundFX.playClick();
    delete bm[fileName];
    saveState();
    renderGrimoireBookmarks();
}

async function handleGrimoirePdfUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!window.pdfjsLib) {
        showSystemModal(
            'MODUL PDF MEMERLUKAN INTERNET PERTAMA KALI',
            'Library PDF.js belum dimuat karena perangkat sedang offline saat pertama kali membuka halaman. Hubungkan internet sebentar lalu muat ulang halaman agar tersimpan di cache.'
        );
        return;
    }

    SoundFX.playClick();
    grimoireCurrentFileName = file.name;

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer, disableWorker: true });
    grimoirePdfDoc = await loadingTask.promise;
    grimoireTotalPages = grimoirePdfDoc.numPages;

    const bm = ensureGrimoireBookmarks();
    const saved = bm[grimoireCurrentFileName];
    grimoireCurrentPage = (saved && saved.page >= 1 && saved.page <= grimoireTotalPages) ? saved.page : 1;

    document.getElementById('grimoire-empty-hint').classList.add('hidden');
    document.getElementById('grimoire-reader-workspace').classList.remove('hidden');
    document.getElementById('grimoire-file-title').textContent = grimoireCurrentFileName;

    await fitGrimoireWidth();

    if (saved && saved.page > 1) {
        spawnFloatingReward(`🔖 Melanjutkan dari Bookmark: Halaman ${grimoireCurrentPage}`);
    } else {
        spawnFloatingReward(`📖 Grimoire Dibuka (${grimoireTotalPages} Halaman)`);
    }
    e.target.value = '';
}

async function renderGrimoirePage(pageNum) {
    if (!grimoirePdfDoc) return;
    grimoireCurrentPage = Math.max(1, Math.min(grimoireTotalPages, pageNum));

    document.getElementById('grimoire-page-indicator').textContent = `Hal ${grimoireCurrentPage} / ${grimoireTotalPages}`;
    document.getElementById('grimoire-zoom-label').textContent = `${Math.round(grimoireScale * 100)}%`;

    const page = await grimoirePdfDoc.getPage(grimoireCurrentPage);
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const viewport = page.getViewport({ scale: grimoireScale });

    const canvas = document.getElementById('grimoire-pdf-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = Math.floor(viewport.width * dpr);
    canvas.height = Math.floor(viewport.height * dpr);
    canvas.style.width = `${Math.floor(viewport.width)}px`;
    canvas.style.height = `${Math.floor(viewport.height)}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (grimoireRenderTask) {
        try { grimoireRenderTask.cancel(); } catch (err) {}
    }
    grimoireRenderTask = page.render({ canvasContext: ctx, viewport });
    try {
        await grimoireRenderTask.promise;
    } catch (err) {}
}

async function changeGrimoirePage(delta) {
    if (!grimoirePdfDoc) return;
    const target = grimoireCurrentPage + delta;
    if (target < 1 || target > grimoireTotalPages) return;
    SoundFX.playClick();
    await renderGrimoirePage(target);
}

async function zoomGrimoire(delta) {
    if (!grimoirePdfDoc) return;
    SoundFX.playClick();
    grimoireScale = Math.max(0.5, Math.min(3.0, +(grimoireScale + delta).toFixed(2)));
    await renderGrimoirePage(grimoireCurrentPage);
}

async function fitGrimoireWidth() {
    if (!grimoirePdfDoc) return;
    const viewportBox = document.getElementById('grimoire-viewport');
    const page = await grimoirePdfDoc.getPage(grimoireCurrentPage);
    const unscaled = page.getViewport({ scale: 1.0 });
    const availWidth = Math.max(240, (viewportBox ? viewportBox.clientWidth : 340) - 18);
    grimoireScale = +(availWidth / unscaled.width).toFixed(2);
    await renderGrimoirePage(grimoireCurrentPage);
}

function saveCurrentGrimoireBookmark() {
    if (!grimoirePdfDoc || !grimoireCurrentFileName) return;
    SoundFX.playQuestComplete();
    const bm = ensureGrimoireBookmarks();
    bm[grimoireCurrentFileName] = {
        page: grimoireCurrentPage,
        totalPages: grimoireTotalPages,
        updatedAt: getCurrentGameDateKey()
    };
    saveState();
    renderGrimoireBookmarks();
    spawnFloatingReward(`🔖 Bookmark Tersimpan: Hal ${grimoireCurrentPage} (${grimoireCurrentFileName})`);
}

// Initial Boot moved to bottom after all module declarations


// ==========================================
// MODULE BLOCK 2
// ==========================================

// ==========================================
// 13. PENGATURAN FONT DINAMIS
// ==========================================
const FONT_SCALES = {
    small: '12px',
    normal: '13.5px',
    large: '15.5px'
};

const FONT_FAMILIES = {
    cyber: "'Orbitron', sans-serif",
    clean: "'Inter', system-ui, -apple-system, sans-serif",
    tactical: "'Rajdhani', sans-serif"
};

function openFontSettingsModal() {
    if (typeof SoundFX !== 'undefined' && SoundFX.playClick) SoundFX.playClick();
    const modal = document.getElementById('font-settings-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeFontSettingsModal() {
    if (typeof SoundFX !== 'undefined' && SoundFX.playClick) SoundFX.playClick();
    const modal = document.getElementById('font-settings-modal');
    if (modal) modal.classList.add('hidden');
}

function applySavedFontSettings() {
    const scaleKey = (typeof gameState !== 'undefined' && gameState.fontScale) || localStorage.getItem('sysrpg_zoom_key') || 'normal';
    const famKey = (typeof gameState !== 'undefined' && gameState.fontFamily) || localStorage.getItem('sysrpg_ffam_key') || 'cyber';

    document.documentElement.style.setProperty('--app-font-scale', FONT_SCALES[scaleKey] || '13.5px');
    document.documentElement.style.setProperty('--app-display-font', FONT_FAMILIES[famKey] || "'Orbitron', sans-serif");

    const btnInactive = 'padding: 0.55rem 0.25rem; border-radius: 0.5rem; border: 1px solid #334155; background: #020617; font-size: 11px; font-weight: 700; color: #cbd5e1;';
    const btnActive = 'padding: 0.55rem 0.25rem; border-radius: 0.5rem; border: 1px solid #06b6d4; background: #083344; font-size: 11px; font-weight: 700; color: #67e8f9;';

    document.querySelectorAll('.font-scale-btn').forEach(btn => {
        btn.style.cssText = btnInactive;
    });
    const activeScaleBtn = document.getElementById(`font-scale-${scaleKey}`);
    if (activeScaleBtn) {
        activeScaleBtn.style.cssText = btnActive;
    }

    document.querySelectorAll('.font-fam-btn').forEach(btn => {
        btn.style.cssText = btnInactive;
    });
    const activeFamBtn = document.getElementById(`font-fam-${famKey}`);
    if (activeFamBtn) {
        activeFamBtn.style.cssText = btnActive;
    }
}

function setAppFontScale(scaleKey) {
    localStorage.setItem('sysrpg_zoom_key', scaleKey);
    if (typeof gameState !== 'undefined') {
        gameState.fontScale = scaleKey;
        if (typeof saveState === 'function') saveState();
    }
    applySavedFontSettings();
    if (typeof SoundFX !== 'undefined' && SoundFX.playClick) SoundFX.playClick();
}

function setAppFontFamily(famKey) {
    localStorage.setItem('sysrpg_ffam_key', famKey);
    if (typeof gameState !== 'undefined') {
        gameState.fontFamily = famKey;
        if (typeof saveState === 'function') saveState();
    }
    applySavedFontSettings();
    if (typeof SoundFX !== 'undefined' && SoundFX.playClick) SoundFX.playClick();
}

// ==========================================
// 14. ANIME LOFI 1-HOUR ENGINE (DUNGEON)
// ==========================================
let lofiCtx = null;
let lofiMasterGain = null;
let lofiIsPlaying = false;
let lofiBeatInterval = null;
let lofiCountdownInterval = null;
let lofiRemainingSec = 3600;
let lofiStep = 0;
let lofiUseLocalFile = false;

const ANIME_LOFI_CHORDS = [
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [164.81, 196.00, 246.94, 293.66], // Em7
    [146.83, 174.61, 220.00, 261.63, 329.63], // Dm9
    [130.81, 164.81, 196.00, 246.94]  // Cmaj7
];

function formatLofiTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function updateLofiVolume(val) {
    const num = Number(val);
    const label = document.getElementById('lofi-volume-label');
    if (label) label.textContent = `${num}%`;

    const vol = num / 100;
    if (lofiMasterGain && lofiCtx) {
        lofiMasterGain.gain.setTargetAtTime(vol * 0.35, lofiCtx.currentTime, 0.05);
    }
    const localAudio = document.getElementById('lofi-local-audio-player');
    if (localAudio) {
        localAudio.volume = vol;
    }
}

function playLofiChordAndBeat() {
    if (!lofiCtx || !lofiMasterGain || !lofiIsPlaying) return;
    const now = lofiCtx.currentTime;

    if (lofiStep % 8 === 0) {
        const chordIdx = Math.floor(lofiStep / 8) % ANIME_LOFI_CHORDS.length;
        const freqs = ANIME_LOFI_CHORDS[chordIdx];

        freqs.forEach((f, idx) => {
            const osc = lofiCtx.createOscillator();
            const filter = lofiCtx.createBiquadFilter();
            const gain = lofiCtx.createGain();

            osc.type = idx === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(f * (1 + (Math.random() - 0.5) * 0.004), now);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(950, now);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.14 / freqs.length, now + 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 2.6);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(lofiMasterGain);

            osc.start(now);
            osc.stop(now + 2.7);
        });
    }

    if (lofiStep % 4 === 0) {
        const kickOsc = lofiCtx.createOscillator();
        const kickGain = lofiCtx.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(110, now);
        kickOsc.frequency.exponentialRampToValueAtTime(42, now + 0.14);

        kickGain.gain.setValueAtTime(0.28, now);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        kickOsc.connect(kickGain);
        kickGain.connect(lofiMasterGain);
        kickOsc.start(now);
        kickOsc.stop(now + 0.2);
    }

    if (lofiStep % 2 === 1) {
        const bufferSize = lofiCtx.sampleRate * 0.04;
        const noiseBuffer = lofiCtx.createBuffer(1, bufferSize, lofiCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = lofiCtx.createBufferSource();
        noise.buffer = noiseBuffer;

        const hp = lofiCtx.createBiquadFilter();
        hp.type = 'bandpass';
        hp.frequency.setValueAtTime(4500, now);

        const hatGain = lofiCtx.createGain();
        hatGain.gain.setValueAtTime(0.04, now);
        hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        noise.connect(hp);
        hp.connect(hatGain);
        hatGain.connect(lofiMasterGain);
        noise.start(now);
    }

    lofiStep++;
}

function startLofiCountdown() {
    clearInterval(lofiCountdownInterval);
    lofiCountdownInterval = setInterval(() => {
        if (!lofiIsPlaying) return;
        lofiRemainingSec--;
        const timerEl = document.getElementById('lofi-timer-display');
        if (timerEl) timerEl.textContent = formatLofiTime(Math.max(0, lofiRemainingSec));

        if (lofiRemainingSec <= 0) {
            stopAnimeLofi1Hour();
            if (typeof spawnFloatingReward === 'function') {
                spawnFloatingReward('🎧 Sesi Anime Lofi 1 Jam Selesai!');
            }
        }
    }, 1000);
}

function stopAnimeLofi1Hour() {
    lofiIsPlaying = false;
    clearInterval(lofiBeatInterval);
    clearInterval(lofiCountdownInterval);

    const localAudio = document.getElementById('lofi-local-audio-player');
    if (localAudio) localAudio.pause();

    const btn = document.getElementById('lofi-toggle-btn');
    const status = document.getElementById('lofi-status-text');
    if (btn) btn.textContent = '▶ Putar Anime Lofi (1 Jam)';
    if (status) status.textContent = 'Dijeda • Siap dilanjutkan kapan saja';
}

function toggleAnimeLofi1Hour() {
    if (lofiIsPlaying) {
        stopAnimeLofi1Hour();
        return;
    }

    if (lofiRemainingSec <= 0) lofiRemainingSec = 3600;
    if (typeof SoundFX !== 'undefined' && SoundFX.stopAmbient) {
        SoundFX.stopAmbient();
    }
    lofiIsPlaying = true;

    const btn = document.getElementById('lofi-toggle-btn');
    const status = document.getElementById('lofi-status-text');
    if (btn) btn.textContent = '⏸ Jeda Anime Lofi';

    if (lofiUseLocalFile) {
        const localAudio = document.getElementById('lofi-local-audio-player');
        if (localAudio) {
            localAudio.play();
            if (status) status.textContent = 'Memutar Lagu Lofi dari HP • Timer 1 Jam Aktif';
        }
    } else {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!lofiCtx) {
            lofiCtx = new AudioCtx();
            lofiMasterGain = lofiCtx.createGain();
            const slider = document.getElementById('lofi-volume-slider');
            const vol = slider ? Number(slider.value) / 100 : 0.45;
            lofiMasterGain.gain.setValueAtTime(vol * 0.35, lofiCtx.currentTime);
            lofiMasterGain.connect(lofiCtx.destination);
        }
        if (lofiCtx.state === 'suspended') lofiCtx.resume();

        lofiStep = 0;
        playLofiChordAndBeat();
        clearInterval(lofiBeatInterval);
        lofiBeatInterval = setInterval(playLofiChordAndBeat, 380);
        if (status) status.textContent = 'Sedang Memutar: Midnight Tokyo Lofi (Offline)';
    }

    startLofiCountdown();
}

function loadLocalLofiMp3(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const localAudio = document.getElementById('lofi-local-audio-player');
    if (!localAudio) return;

    stopAnimeLofi1Hour();
    lofiUseLocalFile = true;
    lofiRemainingSec = 3600;
    localAudio.src = URL.createObjectURL(file);
    toggleAnimeLofi1Hour();
    const status = document.getElementById('lofi-status-text');
    if (status) status.textContent = `Memutar: ${file.name.slice(0, 24)} (Loop 1 Jam)`;
}

// ==========================================
// 15. ANDROID HOME SCREEN WIDGET SYNC BRIDGE
// ==========================================
function syncAndroidHomeWidget() {
    try {
        if (!window.AndroidBridge) return;
        const p = gameState.player;
        const rank = getPlayerRank(p.level);
        const dailyQuests = gameState.quests.filter(q => q.category === 'Daily Quest' && isQuestActiveOnDate(q, getCurrentGameDateKey()));
        const doneCount = dailyQuests.filter(q => q.completed).length;
        const totalDaily = dailyQuests.length;
        const pct = totalDaily > 0 ? Math.round((doneCount / totalDaily) * 100) : 0;

        let subtitle = `HP ${p.hp}/${p.maxHp} • Daily: ${doneCount}/${totalDaily} (${pct}%)`;
        if (pct >= 100 && totalDaily > 0) {
            subtitle = `S-Rank Clear! HP ${p.hp}/${p.maxHp} • Streak aman 🔥`;
        } else if (pct >= getStreakThresholdPct() && totalDaily > 0) {
            subtitle = `Target ≥${getStreakThresholdPct()}% tercapai! (${doneCount}/${totalDaily}) • HP ${p.hp}`;
        } else if (p.streak > 0) {
            subtitle = `Jaga ${p.streak} hari streak! (${doneCount}/${totalDaily}) • HP ${p.hp}`;
        }

        // Build last 5 days array (Indo day initials: M, S, S, R, K, J, S)
        const dayInitials = ['M', 'S', 'S', 'R', 'K', 'J', 'S'];
        const activeDateStr = getCurrentGameDateKey();
        const baseDate = parseDateKey(activeDateStr);
        const dailyCounts = (gameState.history && gameState.history.dailyCounts) || {};
        const last5 = [];

        for (let i = 4; i >= 0; i--) {
            const d = new Date(baseDate);
            d.setDate(baseDate.getDate() - i);
            const key = formatDateKey(d);
            const isToday = (key === activeDateStr);
            const isDone = isToday
                ? (pct >= getStreakThresholdPct() || gameState.lastStreakDate === activeDateStr)
                : ((dailyCounts[key] || 0) > 0);
            last5.push({
                label: dayInitials[d.getDay()],
                done: isDone
            });
        }

        if (typeof window.AndroidBridge.updateWidgetData === 'function') {
            window.AndroidBridge.updateWidgetData(
                Number(p.streak || 0),
                Number(p.level || 1),
                String(rank.rankCode || 'E-RANK'),
                String(subtitle),
                JSON.stringify(last5)
            );
        }

        if (typeof window.AndroidBridge.updateWidgetFull === 'function') {
            window.AndroidBridge.updateWidgetFull(JSON.stringify({
                streak: p.streak || 0,
                level: p.level || 1,
                rankCode: rank.rankCode || 'E-RANK',
                hp: p.hp || 0,
                maxHp: p.maxHp || 100,
                doneDaily: doneCount,
                totalDaily: totalDaily,
                pct: pct,
                thresholdPct: getStreakThresholdPct(),
                subtitle: subtitle,
                last5: last5
            }));
        }
    } catch (e) {
        console.error('Widget sync error:', e);
    }
}

// Auto-cek pergantian hari & paksa sinkron widget saat aplikasi dibuka kembali dari background
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        checkRealDayRollover();
        syncAndroidHomeWidget();
    }
});
window.addEventListener('pageshow', () => {
    checkRealDayRollover();
    syncAndroidHomeWidget();
});
window.addEventListener('focus', () => {
    checkRealDayRollover();
    syncAndroidHomeWidget();
});

// Cek pergantian hari tiap 30 detik kalau aplikasi dibiarkan terbuka lewat jam 00:00
setInterval(() => {
    checkRealDayRollover();
}, 30000);

applySavedFontSettings();
syncAndroidHomeWidget();
setTimeout(syncAndroidHomeWidget, 800);


// ==========================================
// MODULE BLOCK 3
// ==========================================

let isSplashUnlocking = false;

function triggerFingerprintScan() {
    if (isSplashUnlocking) return;
    isSplashUnlocking = true;

    const pad = document.getElementById('btn-fingerprint-auth');
    const icon = document.getElementById('fp-svg-icon');
    const statusText = document.getElementById('fp-status-text');
    const subText = document.getElementById('fp-sub-text');

    if (typeof SoundFX !== 'undefined' && SoundFX.playClick) {
        SoundFX.playClick();
    }
    if (navigator.vibrate) {
        try { navigator.vibrate([35, 40, 70]); } catch (e) {}
    }

    if (pad) pad.classList.add('scanning');
    if (statusText) {
        statusText.textContent = 'MEMINDAI BIOMETRIK HUNTER...';
        statusText.style.color = '#fcd34d';
    }

    setTimeout(() => {
        if (pad) {
            pad.classList.remove('scanning');
            pad.classList.add('verified');
        }
        if (icon) icon.setAttribute('stroke', '#34d399');
        if (statusText) {
            statusText.textContent = '✓ AKSES DITERIMA • WELCOME, HUNTER';
            statusText.style.color = '#34d399';
        }
        if (subText) subText.textContent = 'Sinkronisasi Status & Quest Board...';

        if (typeof SoundFX !== 'undefined' && SoundFX.playQuestComplete) {
            SoundFX.playQuestComplete();
        }

        setTimeout(() => {
            const splash = document.getElementById('system-splash-screen');
            if (splash) {
                splash.classList.add('fade-out');
                setTimeout(() => {
                    if (splash && splash.parentNode) splash.remove();
                }, 650);
            }
        }, 420);
    }, 520);
}

// ==========================================
// ==========================================
// 16. UNIFIED MULTILINGUAL ENGINE (ID / EN / JA)
// ==========================================
(function () {
    'use strict';

    const LANG_KEY_PRIMARY = 'system_rpg_lang';
    const LANG_KEY_LEGACY = 'sysrpg_lang';

    const DICTIONARY = {
        en: {
            // Splash, Header & Nav
            '[ TAP FINGERPRINT UNTUK AWAKENING ]': '[ TAP FINGERPRINT FOR AWAKENING ]',
            'Autentikasi Hunter diperlukan sebelum masuk ke Sistem': 'Hunter authentication required before entering the System',
            'MEMINDAI BIOMETRIK HUNTER...': 'SCANNING HUNTER BIOMETRICS...',
            '✓ AKSES DITERIMA • WELCOME, HUNTER': '✓ ACCESS GRANTED • WELCOME, HUNTER',
            'Sinkronisasi Status & Quest Board...': 'Synchronizing Status & Quest Board...',
            'Hunter Interface': 'Hunter Interface',
            'Status': 'Status',
            'Quests': 'Quests',
            'Dungeon': 'Dungeon',
            'Shop': 'Shop',
            'Treasury': 'Treasury',

            // Oracle & Status
            '+ Kutipan': '+ Quote',
            '✨ Terima Petuah (+5 XP / +5 G)': '✨ Receive Wisdom (+5 XP / +5 G)',
            '✓ Petuah Diterima Hari Ini': '✓ Wisdom Claimed Today',
            'Ganti Title': 'Switch Title',
            'Lihat Semua': 'View All',
            'Filter Tanggal Ini': 'Filter This Date',
            'Status Atribut': 'Attribute Status',
            'Distribusi Atribut Hunter': 'Hunter Attribute Distribution',
            'Distribusi Level Atribut': 'Attribute Level Distribution',
            'Distribusi Level Atribut (All-Time)': 'Attribute Level Distribution (All-Time)',
            'Skala Tier: 100': 'Tier Scale: 100',
            'Habit Tracker & Riwayat': 'Habit Tracker & History',
            'Tanggal Aktif Sistem': 'System Active Date',
            'Hari Ini': 'Today',
            'Klik kotak tanggal untuk cek riwayat': 'Click a date box to check history',
            'Log Aktivitas Tanggal Ini': 'Activity Log for This Date',
            'Kontrol Sistem & Evaluasi Harian': 'System Control & Daily Evaluation',
            '🎯 Target Minimal Streak Harian': '🎯 Minimum Daily Streak Target',
            'Atur persentase minimal Daily Quest selesai': 'Set minimum percentage of completed Daily Quests',
            'Evaluasi & Lanjut Hari': 'Evaluate & Advance Day',
            'Reminder Notifikasi Layar HP': 'Mobile Lockscreen Notification Reminder',
            'NONAKTIF': 'INACTIVE',
            'AKTIF': 'ACTIVE',
            'Munculkan notifikasi pop-up di layar atas HP jika masih ada Daily Quest yang belum dikerjakan atau lupa buka SYSTEM RPG.': 'Show pop-up notifications on your phone screen if Daily Quests are still unfinished or you forgot to open SYSTEM RPG.',
            '🌅 Pagi': '🌅 Morning',
            '☀️ Siang': '☀️ Afternoon',
            '🌇 Sore': '🌇 Evening',
            '🌙 Malam': '🌙 Night',
            '⚡ Fleksibel': '⚡ Flexible',
            '🔔 Aktifkan Notifikasi': '🔔 Enable Notifications',
            '🔕 Matikan Notifikasi': '🔕 Disable Notifications',
            'Tes Pop-up': 'Test Pop-up',

            // Quests & Default Habits
            'Centang misi selesai (klik ulang untuk batalkan/undo)': 'Check completed quests (click again to undo)',
            'Preset Habit': 'Habit Preset',
            'Quest Baru': 'New Quest',
            'Buat Misi Baru': 'Create New Quest',
            'Nama Misi / Tugas': 'Quest / Task Name',
            'Kategori': 'Category',
            'Waktu': 'Time',
            'Atribut': 'Attribute',
            'Jadwal Hari Aktif': 'Active Days Schedule',
            'Semua': 'All',
            'Sen': 'Mon', 'Sel': 'Tue', 'Rab': 'Wed', 'Kam': 'Thu', 'Jum': 'Fri', 'Sab': 'Sat', 'Min': 'Sun',
            'Tipe Progres Misi': 'Quest Progress Type',
            '☑️ Ceklis Biasa (Sekali Selesai)': '☑️ Standard Checkbox (One-time)',
            '🔢 Count / Hitungan (Contoh: 20 Hal, 8 Gelas)': '🔢 Counter (e.g., 20 Pages, 8 Glasses)',
            'Target Angka': 'Target Count',
            'Satuan': 'Unit',
            'Hadiah XP': 'XP Reward',
            'Hadiah Gold': 'Gold Reward',
            'TAMBAHKAN KE QUEST BOARD': 'ADD TO QUEST BOARD',
            '🕒 Semua Waktu': '🕒 All Times',
            'Aktif (Belum)': 'Active (Incomplete)',
            'Selesai': 'Completed',
            '📅 Jadwal Hari Ini': "📅 Today's Schedule",
            '🗓️ Semua Jadwal': '🗓️ All Schedules',
            'Shalat Subuh': 'Fajr Prayer',
            'Dzikir Pagi': 'Morning Dhikr',
            'Baca Alquran dan Artinya': 'Read Quran & Translation',
            'Tulis latihan hiragana katakan': 'Practice Writing Hiragana & Katakana',
            'Baca buku': 'Read a Book',
            'Minum air putih': 'Drink Water',
            'Rapih rapih': 'Tidy Up Room',
            'Plank 1 menit dan Push Up 10x': '1-Min Plank & 10x Push-Ups',
            'Angkat beban': 'Weightlifting',
            'Olahraga, senam, jalan atau aktivitas yang mengeluarkan keringat minimal 10 menit': 'Exercise, workout, or brisk walk (min. 10 mins)',
            'Belajar bahasa jepang 1 bab volingo': 'Study Japanese (1 Chapter Volingo)',
            'Belajar bahasa inggris 1 bab volingo': 'Study English (1 Chapter Volingo)',
            'Sarapan': 'Breakfast',
            'Mandi pagi': 'Morning Shower',
            'Skincare mosturizer dan sunscreen': 'Morning Skincare (Moisturizer & Sunscreen)',
            'Podcast self improvement': 'Self-Improvement Podcast',
            'Shalat Zuhur': 'Dhuhr Prayer',
            'Makan siang': 'Lunch',
            'YouTube podcast english': 'English YouTube Podcast',
            'Brainstorm dengan chatgpt, latihan berbicara bahasa inggris atau jepang': 'Speaking Practice in English/Japanese with ChatGPT',
            'Belajar persiapan karir': 'Career Preparation Study',
            'Shalat Ashar': 'Asr Prayer',
            'Dzikir sore': 'Evening Dhikr',
            'Angkat beban sore': 'Evening Weightlifting',
            'Mandi sore': 'Evening Shower',
            'Shalat Magrib': 'Maghrib Prayer',
            'Makan malam': 'Dinner',
            'Shalat Isya': 'Isha Prayer',
            'No sugar': 'No Sugar',
            'Plank sit-up': 'Plank & Sit-Ups',
            'Gosok gigi facial wash moisturizer': 'Brush Teeth, Facial Wash & Moisturizer',
            'Selesaikan Modul Utama Proyek / Target Mingguan': 'Complete Main Project Module / Weekly Target',
            'Presentasi Penting / Taklukkan Tantangan Terberat Minggu Ini': 'Key Presentation / Conquer Hardest Weekly Challenge',

            // Dungeon & Grimoire
            'MASUKI DUNGEON': 'ENTER DUNGEON',
            'MENYERAH (-10 HP)': 'SURRENDER (-10 HP)',
            'Set Waktu': 'Set Time',
            '🎯 Tautkan Quest Fokus (Opsional — Auto-Selesai saat Clear)': '🎯 Link Focus Quest (Optional — Auto-Complete on Clear)',
            '-- Fokus Umum (+INT saja) --': '-- General Focus (+INT only) --',
            'Ambient Fokus': 'Focus Ambient',
            'Mode: Hening': 'Mode: Silent',
            'Mode: Dark Synth': 'Mode: Dark Synth',
            'Mode: Suara Hujan': 'Mode: Rain Sound',
            '🔇 Hening': '🔇 Silent',
            '🌧️ Suara Hujan': '🌧️ Rain Sound',
            'Baca PDF materi belajar/buku sambil Dungeon Raid berjalan': 'Read study material/book PDFs while Dungeon Raid is active',
            '📂 Buka PDF': '📂 Open PDF',
            'ANIME LOFI RADIO (1 JAM)': 'ANIME LOFI RADIO (1 HOUR)',
            'Siap menemani fokus Dungeon • Offline Synth': 'Ready to accompany Dungeon focus • Offline Synth',
            '▶ Putar Anime Lofi (1 Jam)': '▶ Play Anime Lofi (1 Hour)',
            '⏸ Jeda Anime Lofi': '⏸ Pause Anime Lofi',
            '🎵 MP3 HP': '🎵 Phone MP3',
            '🔖 Bookmark Tersimpan (Per Judul File)': '🔖 Saved Bookmarks (By File Title)',
            'Belum ada bookmark tersimpan.': 'No bookmarks saved yet.',
            '🔖 Tandai Hal Ini': '🔖 Bookmark Page',

            // Shop, Relics & Titles
            'Tukarkan Gold dengan Potion atau Reward Dunia Nyata': 'Exchange Gold for Potions or Real-World Rewards',
            'Item Baru': 'New Item',
            'Tambah Item / Reward': 'Add Item / Reward',
            'Nama Item / Reward': 'Item / Reward Name',
            'Harga (Gold)': 'Price (Gold)',
            'Efek Item': 'Item Effect',
            'SIMPAN KE SHOP': 'SAVE TO SHOP',
            'ARMORY / TEMPORARY RELICS': 'ARMORY / TEMPORARY RELICS',
            'Slot Kosong': 'Empty Slot',
            '🎁 Potion & Real-World Rewards': '🎁 Potions & Real-World Rewards',
            'Konsumsi & Hadiah Nyata': 'Consumables & Real Rewards',
            'Relic bersifat sementara (aktif 24 jam sejak dibeli) • Maks 3 slot aktif': 'Relics are temporary (active 24h upon purchase) • Max 3 active slots',
            'Belum ada Relic terpasang. Pasang Relic di bawah untuk mengaktifkan efek pasif!': 'No Relic equipped yet. Equip a Relic below to activate passive effects!',
            'Belum ada Relic aktif. Beli Relic (durasi 24 jam) di bawah untuk mengaktifkan efek sementara!': 'No active Relic. Buy a Relic (24h duration) below to activate temporary buffs!',
            'Uji keberuntungan: XP, HP, Streak Shield, atau Jackpot Gold!': 'Test your luck: XP, HP, Streak Shield, or Gold Jackpot!',
            '🎲 BUKA PETI MISTERI (100 GOLD)': '🎲 OPEN MYSTERY CHEST (100 GOLD)',
            'Riwayat Redeem': 'Redeem History',
            'Belum ada reward yang di-redeem.': 'No rewards redeemed yet.',
            'Hapus Semua': 'Clear All',
            'Beli': 'Buy',
            'MAKS': 'MAX',
            'Aktif': 'Active',
            'Pakai': 'Equip',
            'Terkunci': 'Locked',
            'Memulihkan 25% Max HP secara instan.': 'Instantly restores 25% of Max HP.',
            'Memulihkan HP hingga penuh (100% Max HP) dalam kondisi darurat.': 'Restores HP to full (100% Max HP) in emergencies.',
            'Reward dunia nyata untuk menyegarkan pikiran.': 'Real-world reward to refresh your mind.',
            'Otomatis menahan Streak saat terlewat (Maksimal stok 2 di inventori).': 'Automatically protects your Streak if missed (Max 2 in inventory).',
            'Waktu santai bebas penalti setelah bekerja keras.': 'Penalty-free leisure time after hard work.',
            '[24 Jam] +15% EXP & +10% INT Stat XP dari semua aktivitas': '[24h] +15% EXP & +10% INT Stat XP from all activities',
            '[24 Jam] +12% EXP & +15% INT/WIS Stat XP saat belajar & fokus': '[24h] +12% EXP & +15% INT/WIS Stat XP while studying & focusing',
            '[24 Jam] +25% STR Stat XP & +10 Max HP Sementara': '[24h] +25% STR Stat XP & +10 Temporary Max HP',
            '[24 Jam] +20% Gold dari semua Quest & Dungeon +15% CHR Stat XP': '[24h] +20% Gold from all Quests & Dungeons +15% CHR Stat XP',

            // Treasury
            'Catat arus kas & kalkulator jajan (+10 XP & +10 WIS XP, maks 3x/hari)': 'Record cashflow & snack calculator (+10 XP & +10 WIS XP, max 3x/day)',
            '🧮 Kalkulator Jajan & Belanja': '🧮 Snack & Shopping Calculator',
            '✓ PAKAI NOMINAL': '✓ USE AMOUNT',
            '💸 Catat Transaksi Keuangan': '💸 Record Financial Transaction',
            'Jenis Arus Kas': 'Cashflow Type',
            '📤 Pengeluaran (-)': '📤 Expense (-)',
            '📥 Pemasukan (+)': '📥 Income (+)',
            '💼 Gaji / Honor': '💼 Salary / Wages',
            '🎁 Bonus / Hadiah': '🎁 Bonus / Gift',
            '📈 Usaha / Freelance': '📈 Business / Freelance',
            '💰 Pemasukan Lain': '💰 Other Income',
            'Tanggal': 'Date',
            'Nominal (Rp)': 'Amount (Rp)',
            'Catatan / Keterangan': 'Notes / Description',
            'SIMPAN TRANSAKSI (+10 XP & +10 WIS)': 'SAVE TRANSACTION (+10 XP & +10 WIS)',
            '📊 Dashboard Arus Kas': '📊 Cashflow Dashboard',
            'Harian': 'Daily',
            'Bulanan': 'Monthly',
            'Tahunan': 'Yearly',
            'Filter Tanggal:': 'Filter Date:',
            'Filter Bulan:': 'Filter Month:',
            'Filter Tahun:': 'Filter Year:',
            'Pemasukan': 'Income',
            'Pengeluaran': 'Expense',
            'Selisih Bersih': 'Net Difference',
            'Rincian Pengeluaran per Kategori': 'Expense Breakdown by Category',
            'Belum ada pengeluaran pada periode ini.': 'No expenses in this period.',
            'Daftar Transaksi Periode Ini': 'Transactions in This Period',
            'Tidak ada transaksi pada periode ini.': 'No transactions in this period.',

            // Modals & Settings
            'Membuka Peti...': 'Opening Chest...',
            'Membuka Peti Misteri...': 'Opening Mystery Chest...',
            'Sistem sedang mengacak hadiah keberuntunganmu...': 'The System is randomizing your lucky reward...',
            'KLAIM HADIAH': 'CLAIM REWARD',
            'TERIMA KEKUATAN': 'ACCEPT POWER',
            'LAPORAN HARIAN': 'DAILY REPORT',
            'MENGERTI': 'UNDERSTOOD',
            'Pilih 6 Avatar Cyber-Fantasy atau unggah foto dari galeri HP': 'Choose from 6 Cyber-Fantasy Avatars or upload a photo from your gallery',
            '📷 Foto Pribadi / Galeri HP': '📷 Personal Photo / Phone Gallery',
            'Otomatis dikompres (160×160px) agar ringan di localStorage': 'Automatically compressed (160×160px) for lightweight localStorage',
            '📁 Pilih Foto dari Galeri': '📁 Choose Photo from Gallery',
            'SELESAI': 'DONE',
            'PROFIL HUNTER': 'HUNTER PROFILE',
            'Nama Hunter': 'Hunter Name',
            'Batal': 'Cancel',
            'Simpan': 'Save',
            'RESET DATA SISTEM?': 'RESET SYSTEM DATA?',
            'Semua progres akan di-reset bersih ke awal (Level 1, 0 XP, 0 Gold, 0 Streak).': 'All progress will be reset cleanly to the beginning (Level 1, 0 XP, 0 Gold, 0 Streak).',
            'Nama Misi': 'Quest Name',
            'Tipe Progres': 'Progress Type',
            '☑️ Ceklis Biasa': '☑️ Standard Checkbox',
            '🔢 Count / Hitungan': '🔢 Counter',
            'Tipe Item': 'Item Type',
            'Deskripsi Singkat': 'Short Description',
            'TAMBAH KUTIPAN ORACLE': 'ADD ORACLE QUOTE',
            'Isi Kata Motivasi / Prinsip': 'Motivational Quote / Principle',
            'Nama Tokoh / Sumber': 'Author / Source Name',
            'GELAR & ACHIEVEMENT': 'TITLES & ACHIEVEMENTS',
            'Pilih gelar aktif untuk mendapatkan bonus pasif permanen:': 'Select an active title to gain permanent passive bonuses:',
            'TUTUP ROADMAP': 'CLOSE ROADMAP',
            'Lewati & Lanjut': 'Skip & Advance',
            'Simpan (+15 WIS)': 'Save (+15 WIS)',
            'PENGATURAN FONT': 'FONT SETTINGS',
            '✕ Tutup': '✕ Close',
            'Ukuran Teks Aplikasi': 'App Text Size',
            'Kecil (85%)': 'Small (85%)',
            'Normal (100%)': 'Normal (100%)',
            'Besar (115%)': 'Large (115%)',
            'Gaya Huruf Judul (RPG Style)': 'Heading Font Style (RPG Style)',
            'Tegas': 'Bold Tactical',
            '🌐 Bahasa Antarmuka (Language)': '🌐 Interface Language'
        },
        ja: {
            '[ TAP FINGERPRINT UNTUK AWAKENING ]': '[ 指紋をタップして覚醒する ]',
            'Autentikasi Hunter diperlukan sebelum masuk ke Sistem': 'システムに入る前にハンター認証が必要です',
            'MEMINDAI BIOMETRIK HUNTER...': 'ハンター生体認証をスキャン中...',
            '✓ AKSES DITERIMA • WELCOME, HUNTER': '✓ アクセス承認 • ようこそ、ハンター',
            'Sinkronisasi Status & Quest Board...': 'ステータスとクエストボードを同期中...',
            'Hunter Interface': 'ハンターインターフェース',
            'Status': 'ステータス',
            'Quests': 'クエスト',
            'Dungeon': 'ダンジョン',
            'Shop': 'ショップ',
            'Treasury': '財務庫',
            '+ Kutipan': '+ 名言追加',
            '✨ Terima Petuah (+5 XP / +5 G)': '✨ 託宣を受け取る (+5 XP / +5 G)',
            '✓ Petuah Diterima Hari Ini': '✓ 本日の託宣は受取済み',
            'Ganti Title': '称号変更',
            'Lihat Semua': 'すべて見る',
            'Filter Tanggal Ini': 'この日付のみ表示',
            'Status Atribut': 'ステータス能力値',
            'Distribusi Atribut Hunter': 'ハンター能力値分布',
            'Distribusi Level Atribut': '能力値レベル分布',
            'Distribusi Level Atribut (All-Time)': '能力値レベル分布 (全期間)',
            'Skala Tier: 100': 'ティア基準: 100',
            'Habit Tracker & Riwayat': '習慣トラッカー＆履歴',
            'Tanggal Aktif Sistem': 'システム現在日付',
            'Hari Ini': '今日',
            'Klik kotak tanggal untuk cek riwayat': '日付マスをタップして履歴を確認',
            'Log Aktivitas Tanggal Ini': '本日のアクティビティログ',
            'Kontrol Sistem & Evaluasi Harian': 'システム制御＆日次評価',
            '🎯 Target Minimal Streak Harian': '🎯 毎日の最小ストリーク目標',
            'Atur persentase minimal Daily Quest selesai': 'デイリークエストの最小達成率を設定',
            'Evaluasi & Lanjut Hari': '評価して次の日へ',
            'Reminder Notifikasi Layar HP': 'スマホロック画面通知リマインダー',
            'NONAKTIF': '無効',
            'AKTIF': '有効',
            'Munculkan notifikasi pop-up di layar atas HP jika masih ada Daily Quest yang belum dikerjakan atau lupa buka SYSTEM RPG.': '未完了のデイリークエストがある場合やアプリを開き忘れた際に、スマホ画面上部にポップアップ通知を表示します。',
            '🌅 Pagi': '🌅 朝',
            '☀️ Siang': '☀️ 昼',
            '🌇 Sore': '🌇 夕方',
            '🌙 Malam': '🌙 夜',
            '⚡ Fleksibel': '⚡ いつでも',
            '🔔 Aktifkan Notifikasi': '🔔 通知を有効化',
            '🔕 Matikan Notifikasi': '🔕 通知をオフにする',
            'Tes Pop-up': 'ポップアップテスト',
            'Centang misi selesai (klik ulang untuk batalkan/undo)': '完了したクエストにチェック（再タップで取り消し）',
            'Preset Habit': '習慣プリセット',
            'Quest Baru': '新規クエスト',
            'Buat Misi Baru': '新規クエスト作成',
            'Nama Misi / Tugas': 'クエスト・タスク名',
            'Kategori': 'カテゴリー',
            'Waktu': '時間帯',
            'Atribut': '能力値',
            'Jadwal Hari Aktif': '実行曜日スケジュール',
            'Semua': 'すべて',
            'Sen': '月', 'Sel': '火', 'Rab': '水', 'Kam': '木', 'Jum': '金', 'Sab': '土', 'Min': '日',
            'Tipe Progres Misi': '進捗タイプ',
            '☑️ Ceklis Biasa (Sekali Selesai)': '☑️ 通常チェック（1回で完了）',
            '🔢 Count / Hitungan (Contoh: 20 Hal, 8 Gelas)': '🔢 カウント形式（例: 20ページ、水8杯）',
            'Target Angka': '目標回数',
            'Satuan': '単位',
            'Hadiah XP': '報酬XP',
            'Hadiah Gold': '報酬ゴールド',
            'TAMBAHKAN KE QUEST BOARD': 'クエストボードに追加',
            '🕒 Semua Waktu': '🕒 全時間帯',
            'Aktif (Belum)': '進行中（未完了）',
            'Selesai': '完了',
            '📅 Jadwal Hari Ini': '📅 今日の予定',
            '🗓️ Semua Jadwal': '🗓️ 全スケジュール',
            'MASUKI DUNGEON': 'ダンジョンに入る',
            'MENYERAH (-10 HP)': '諦める (-10 HP)',
            'Set Waktu': '時間設定',
            '🎯 Tautkan Quest Fokus (Opsional — Auto-Selesai saat Clear)': '🎯 集中クエスト連携（任意 — クリア時に自動完了）',
            '-- Fokus Umum (+INT saja) --': '-- 通常集中 (+INTのみ) --',
            'Ambient Fokus': '集中環境音',
            'Mode: Hening': 'モード: 無音',
            'Mode: Dark Synth': 'モード: ダークシンセ',
            'Mode: Suara Hujan': 'モード: 雨音',
            '🔇 Hening': '🔇 無音',
            '🌧️ Suara Hujan': '🌧️ 雨音',
            'Baca PDF materi belajar/buku sambil Dungeon Raid berjalan': 'ダンジョン攻略中に学習教材や書籍のPDFを閲覧',
            '📂 Buka PDF': '📂 PDFを開く',
            'ANIME LOFI RADIO (1 JAM)': 'アニメ Lo-Fi ラジオ (1時間)',
            'Siap menemani fokus Dungeon • Offline Synth': 'ダンジョン集中をサポート • オフライン音源',
            '▶ Putar Anime Lofi (1 Jam)': '▶ アニメLo-Fi再生 (1時間)',
            '⏸ Jeda Anime Lofi': '⏸ アニメLo-Fi一時停止',
            '🎵 MP3 HP': '🎵 端末MP3',
            '🔖 Bookmark Tersimpan (Per Judul File)': '🔖 保存済みブックマーク（ファイル別）',
            'Belum ada bookmark tersimpan.': '保存されたブックマークはありません。',
            '🔖 Tandai Hal Ini': '🔖 このページを保存',
            'Tukarkan Gold dengan Potion atau Reward Dunia Nyata': 'ゴールドをポーションや現実のご褒美と交換',
            'Item Baru': '新規アイテム',
            'Tambah Item / Reward': 'アイテム・報酬追加',
            'Nama Item / Reward': 'アイテム・報酬名',
            'Harga (Gold)': '価格 (ゴールド)',
            'Efek Item': 'アイテム効果',
            'SIMPAN KE SHOP': 'ショップに保存',
            'ARMORY / TEMPORARY RELICS': 'アーモリー / 一時レリック',
            'Slot Kosong': '空きスロット',
            '🎁 Potion & Real-World Rewards': '🎁 ポーション＆現実の報酬',
            'Konsumsi & Hadiah Nyata': '消費アイテム＆現実のご褒美',
            'Relic bersifat sementara (aktif 24 jam sejak dibeli) • Maks 3 slot aktif': 'レリックは一時効果（購入から24時間有効）• 最大3スロット装備可能',
            'Belum ada Relic terpasang. Pasang Relic di bawah untuk mengaktifkan efek pasif!': 'レリック未装備。下のレリックを装備してパッシブ効果を発動しよう！',
            'Belum ada Relic aktif. Beli Relic (durasi 24 jam) di bawah untuk mengaktifkan efek sementara!': '有効なレリックはありません。下でレリック（24時間有効）を購入してバフを発動！',
            '[24 Jam] +15% EXP & +10% INT Stat XP dari semua aktivitas': '[24時間] 全アクティビティの獲得EXP +15% & INT経験値 +10%',
            '[24 Jam] +12% EXP & +15% INT/WIS Stat XP saat belajar & fokus': '[24時間] 学習・集中時の獲得EXP +12% & INT/WIS経験値 +15%',
            '[24 Jam] +25% STR Stat XP & +10 Max HP Sementara': '[24時間] STR経験値 +25% & 一時的な最大HP +10',
            '[24 Jam] +20% Gold dari semua Quest & Dungeon +15% CHR Stat XP': '[24時間] 全クエスト＆ダンジョンの獲得ゴールド +20% & CHR経験値 +15%',
            'Uji keberuntungan: XP, HP, Streak Shield, atau Jackpot Gold!': '運試し：XP、HP、ストリークシールド、またはゴールド大当たり！',
            '🎲 BUKA PETI MISTERI (100 GOLD)': '🎲 ミステリーチェストを開ける (100 GOLD)',
            'Riwayat Redeem': '交換履歴',
            'Belum ada reward yang di-redeem.': 'まだ交換された報酬はありません。',
            'Hapus Semua': 'すべて削除',
            'Beli': '購入',
            'MAKS': '上限',
            'Aktif': '装備中',
            'Pakai': '装備する',
            'Terkunci': '未開放',
            'Catat arus kas & kalkulator jajan (+10 XP & +10 WIS XP, maks 3x/hari)': '収支記録＆お小遣い電卓（+10 XP & +10 WIS XP、1日3回まで）',
            '🧮 Kalkulator Jajan & Belanja': '🧮 買い物・出費電卓',
            '✓ PAKAI NOMINAL': '✓ 金額を反映',
            '💸 Catat Transaksi Keuangan': '💸 収支取引を記録',
            'Jenis Arus Kas': '収支タイプ',
            '📤 Pengeluaran (-)': '📤 支出 (-)',
            '📥 Pemasukan (+)': '📥 収入 (+)',
            '💼 Gaji / Honor': '💼 給与・報酬',
            '🎁 Bonus / Hadiah': '🎁 ボーナス・賞与',
            '📈 Usaha / Freelance': '📈 事業・フリーランス',
            '💰 Pemasukan Lain': '💰 その他の収入',
            'Tanggal': '日付',
            'Nominal (Rp)': '金額 (Rp)',
            'Catatan / Keterangan': 'メモ・詳細',
            'SIMPAN TRANSAKSI (+10 XP & +10 WIS)': '取引を保存 (+10 XP & +10 WIS)',
            '📊 Dashboard Arus Kas': '📊 キャッシュフローダッシュボード',
            'Harian': '日次',
            'Bulanan': '月次',
            'Tahunan': '年次',
            'Filter Tanggal:': '日付フィルター:',
            'Filter Bulan:': '月フィルター:',
            'Filter Tahun:': '年フィルター:',
            'Pemasukan': '収入',
            'Pengeluaran': '支出',
            'Selisih Bersih': '純収支差額',
            'Rincian Pengeluaran per Kategori': 'カテゴリー別支出内訳',
            'Belum ada pengeluaran pada periode ini.': 'この期間の支出はありません。',
            'Daftar Transaksi Periode Ini': 'この期間の取引一覧',
            'Tidak ada transaksi pada periode ini.': 'この期間の取引はありません。',
            'Membuka Peti...': 'チェスト開封中...',
            'Membuka Peti Misteri...': 'ミステリーチェスト開封中...',
            'Sistem sedang mengacak hadiah keberuntunganmu...': 'システムが幸運の報酬を抽選中...',
            'KLAIM HADIAH': '報酬を受け取る',
            'TERIMA KEKUATAN': '力を受け入れる',
            'LAPORAN HARIAN': '日次レポート',
            'MENGERTI': '了解',
            'Pilih 6 Avatar Cyber-Fantasy atau unggah foto dari galeri HP': '6種類のサイバーファンタジーアバターから選択、または端末から写真をアップロード',
            '📷 Foto Pribadi / Galeri HP': '📷 個人写真 / スマホギャラリー',
            'Otomatis dikompres (160×160px) agar ringan di localStorage': '保存容量を節約するため自動圧縮 (160×160px)',
            '📁 Pilih Foto dari Galeri': '📁 ギャラリーから写真を選択',
            'SELESAI': '完了',
            'PROFIL HUNTER': 'ハンタープロフィール',
            'Nama Hunter': 'ハンター名',
            'Batal': 'キャンセル',
            'Simpan': '保存',
            'RESET DATA SISTEM?': 'システムデータを初期化しますか？',
            'Semua progres akan di-reset bersih ke awal (Level 1, 0 XP, 0 Gold, 0 Streak).': 'すべての進行状況が初期状態（レベル1、0 XP、0 Gold、0 ストリーク）にリセットされます。',
            'Nama Misi': 'クエスト名',
            'Tipe Progres': '進捗タイプ',
            '☑️ Ceklis Biasa': '☑️ 通常チェック',
            '🔢 Count / Hitungan': '🔢 カウント形式',
            'Tipe Item': 'アイテムタイプ',
            'Deskripsi Singkat': '簡単な説明',
            'TAMBAH KUTIPAN ORACLE': '託宣の名言を追加',
            'Isi Kata Motivasi / Prinsip': 'モチベーション・格言の内容',
            'Nama Tokoh / Sumber': '著者・出典名',
            'GELAR & ACHIEVEMENT': '称号＆実績',
            'Pilih gelar aktif untuk mendapatkan bonus pasif permanen:': '有効な称号を選択して永続パッシブボーナスを獲得：',
            'TUTUP ROADMAP': 'ロードマップを閉じる',
            'Lewati & Lanjut': 'スキップして次へ',
            'Simpan (+15 WIS)': '保存 (+15 WIS)',
            'PENGATURAN FONT': 'フォント設定',
            '✕ Tutup': '✕ 閉じる',
            'Ukuran Teks Aplikasi': 'アプリ文字サイズ',
            'Kecil (85%)': '小 (85%)',
            'Normal (100%)': '標準 (100%)',
            'Besar (115%)': '大 (115%)',
            'Gaya Huruf Judul (RPG Style)': '見出しフォントスタイル',
            'Tegas': 'ボールド',
            '🌐 Bahasa Antarmuka (Language)': '🌐 表示言語 (Language)'
        }
    };

    // Menangani elemen campuran (teks + child <span>/<svg>) termasuk tombol Ganti Title & deskripsi panjang
    const HTML_BLOCK_RULES = {
        en: [
            {
                match: 'Riwayat (',
                getHtml: (el) => {
                    const count = el.querySelector('#header-redeem-count')?.textContent || '0';
                    return `History (<span id="header-redeem-count">${count}</span>)`;
                }
            },
            {
                match: '✦ Buff Sementara Aktif:',
                getHtml: (el) => {
                    const rest = el.innerHTML.replace(/^[\s\S]*?<\/span>/i, '');
                    return `<span style="color: #34d399; font-weight: 700;">✦ Active Temporary Buffs:</span>${rest}`;
                }
            },
            {
                match: 'Ganti Title (',
                getHtml: (el) => {
                    const count = el.querySelector('#unlocked-titles-count')?.textContent || '1';
                    return `Switch Title (<span id="unlocked-titles-count">${count}</span>/4)`;
                }
            },
            {
                match: 'Evaluasi misi pada tanggal terpilih lalu lanjut ke hari berikutnya.',
                getHtml: (el) => {
                    const pct = el.querySelector('#eval-threshold-label')?.textContent || '80% Daily Quest';
                    return `Evaluate quests on the selected date and advance to the next day. Safe target is at least <span id="eval-threshold-label" style="color: #67e8f9; font-weight: 700;">${pct}</span> completed. If below target, HP decreases &amp; Streak resets (unless protected by a Shield)!`;
                }
            },
            {
                match: 'Masuki gerbang fokus. Layar otomatis tetap menyala',
                html: 'Enter the focus gate. Screen automatically stays awake &amp; do not surrender before time runs out to claim <span style="color: #67e8f9;">+INT</span>, <span style="color: #67e8f9;">XP</span>, and <span style="color: #fcd34d;">Gold</span>!'
            },
            {
                match: 'Pilih file',
                subMatch: 'dari HP untuk membaca sambil timer fokus berjalan',
                html: 'Select a <span style="color: #d8b4fe; font-weight: 700;">.PDF</span> file from your phone to read while the focus timer runs. The last page is saved automatically when you tap <span style="color: #fcd34d; font-weight: 700;">🔖 Bookmark Page</span>.'
            },
            {
                match: 'Common (50%):',
                subMatch: 'Legendary (5%):',
                html: '<span style="color: #94a3b8; font-weight: 700;">Common (50%):</span> +35 XP / +20% HP • <span style="color: #38bdf8; font-weight: 700;">Rare (30%):</span> +80 XP / +120 G • <span style="color: #c084fc; font-weight: 700;">Epic (15%):</span> +1 Streak Shield • <span style="color: #fbbf24; font-weight: 700;">Legendary (5%):</span> Jackpot 300 G + Full HP!'
            },
            {
                match: 'Isi refleksi singkat sebelum menutup hari',
                html: 'Write a short reflection before closing the day to earn a bonus <span style="color: #c084fc; font-weight: 700;">+15 WIS XP</span> (optional):'
            },
            {
                match: 'Naikkan Level Hunter untuk membuka tingkatan Rank baru',
                html: 'Increase your Hunter Level to unlock new Rank tiers and automatically gain <span style="color: #fcd34d; font-weight: 600;">Passive Multiplier Bonuses</span>:'
            }
        ],
        ja: [
            {
                match: 'Riwayat (',
                getHtml: (el) => {
                    const count = el.querySelector('#header-redeem-count')?.textContent || '0';
                    return `履歴 (<span id="header-redeem-count">${count}</span>)`;
                }
            },
            {
                match: '✦ Buff Sementara Aktif:',
                getHtml: (el) => {
                    const rest = el.innerHTML.replace(/^[\s\S]*?<\/span>/i, '');
                    return `<span style="color: #34d399; font-weight: 700;">✦ 有効な一時バフ:</span>${rest}`;
                }
            },
            {
                match: 'Ganti Title (',
                getHtml: (el) => {
                    const count = el.querySelector('#unlocked-titles-count')?.textContent || '1';
                    return `称号変更 (<span id="unlocked-titles-count">${count}</span>/4)`;
                }
            },
            {
                match: 'Evaluasi misi pada tanggal terpilih lalu lanjut ke hari berikutnya.',
                getHtml: (el) => {
                    const pct = el.querySelector('#eval-threshold-label')?.textContent || '80% Daily Quest';
                    return `選択した日付のクエストを評価し、次の日へ進みます。安全ラインは <span id="eval-threshold-label" style="color: #67e8f9; font-weight: 700;">${pct}</span> 以上の完了です。目標未満の場合、シールドがない限りHPが減少しストリークがリセットされます！`;
                }
            },
            {
                match: 'Masuki gerbang fokus. Layar otomatis tetap menyala',
                html: '集中のゲートへ入ろう。画面は自動的に点灯し続けます。時間切れ前に諦めずにクリアして <span style="color: #67e8f9;">+INT</span>、<span style="color: #67e8f9;">XP</span>、<span style="color: #fcd34d;">ゴールド</span> を獲得しよう！'
            },
            {
                match: 'Pilih file',
                subMatch: 'dari HP untuk membaca sambil timer fokus berjalan',
                html: '端末から <span style="color: #d8b4fe; font-weight: 700;">.PDF</span> ファイルを選択して集中タイマー中に閲覧できます。<span style="color: #fcd34d; font-weight: 700;">🔖 このページを保存</span> を押すと最後のページが自動保存されます。'
            },
            {
                match: 'Common (50%):',
                subMatch: 'Legendary (5%):',
                html: '<span style="color: #94a3b8; font-weight: 700;">コモン (50%):</span> +35 XP / +20% HP • <span style="color: #38bdf8; font-weight: 700;">レア (30%):</span> +80 XP / +120 G • <span style="color: #c084fc; font-weight: 700;">エピック (15%):</span> +1 シールド • <span style="color: #fbbf24; font-weight: 700;">レジェンド (5%):</span> 大当たり 300 G + HP全快！'
            },
            {
                match: 'Isi refleksi singkat sebelum menutup hari',
                html: '1日を締めくくる前に短い振り返りを記入すると、ボーナス <span style="color: #c084fc; font-weight: 700;">+15 WIS XP</span> を獲得できます（任意）：'
            },
            {
                match: 'Naikkan Level Hunter untuk membuka tingkatan Rank baru',
                html: 'ハンターレベルを上げて新しいランクを開放し、<span style="color: #fcd34d; font-weight: 600;">パッシブ倍率ボーナス</span> を自動獲得しよう：'
            }
        ]
    };

    const PATTERN_RULES = {
        en: [
            { regex: /\((\d+)\s*Jam\)/gi, replace: '($1h)' },
            { regex: /(\d+)\s*G\s*\/\s*24j/gi, replace: '$1 G / 24h' },
            { regex: /⏳\s*Sisa\s*(\d+)j\s*(\d+)m/gi, replace: '⏳ $1h $2m left' },
            { regex: /⏳\s*Sisa\s*(\d+)m/gi, replace: '⏳ $1m left' },
            { regex: /Aktif\s*\((\d+)j\s*(\d+)m\)/gi, replace: 'Active ($1h $2m)' },
            { regex: /Aktif\s*\((\d+)m\)/gi, replace: 'Active ($1m)' },
            { regex: /Pasang\s*\((\d+)j\s*(\d+)m\)/gi, replace: 'Equip ($1h $2m)' },
            { regex: /Pasang\s*\((\d+)m\)/gi, replace: 'Equip ($1m)' },
            { regex: /(\d+)\s*\/\s*3\s*Slot/gi, replace: '$1 / 3 Slots' },
            { regex: /Distribusi Level Atribut \(All-Time\)/gi, replace: 'Attribute Level Distribution (All-Time)' },
            { regex: /Distribusi Level Atribut/gi, replace: 'Attribute Level Distribution' },
            { regex: /Distribusi Atribut Hunter/gi, replace: 'Hunter Attribute Distribution' },
            { regex: /Evaluasi\s*(&|dan)\s*Lanjut Hari/gi, replace: 'Evaluate $1 Advance Day' },
            { regex: /Matikan Notifikasi/gi, replace: 'Disable Notifications' },
            { regex: /Aktifkan Notifikasi/gi, replace: 'Enable Notifications' },
            { regex: /Dashboard Arus Kas/gi, replace: 'Cashflow Dashboard' },
            { regex: /Kategori Pengeluaran/gi, replace: 'Expense Category' },
            { regex: /Kategori Pemasukan/gi, replace: 'Income Category' },
            { regex: /Selisih Bersih/gi, replace: 'Net Difference' },
            { regex: /Rasio Masuk:/gi, replace: 'Income Ratio:' },
            { regex: /Keluar:/gi, replace: 'Expense:' },
            { regex: /Bonus RPG:\s*(\d+\/\d+)\s*Hari Ini/gi, replace: 'RPG Bonus: $1 Today' },
            { regex: /(\d+)\s*Level lagi menuju/gi, replace: '$1 Levels left until' },
            { regex: /Daily Habit \(Target Streak\s*([≥>=]+)\s*(\d+%)\)/gi, replace: 'Daily Habit (Streak Target $1 $2)' },
            { regex: /Riwayat\s*\((\d+)\)/gi, replace: 'History ($1)' },
            { regex: /(\d+)x\s*Klaim/gi, replace: '$1x Claimed' },
            { regex: /(\d+)\s*Selesai/gi, replace: '$1 Completed' },
            { regex: /(\d+)\s*Hari\b/gi, replace: '$1 Days' },
            { regex: /(\d+(?:\.\d+)?)\s*Jam\b/gi, replace: '$1 Hours' },
            { regex: /Rate Minggu Ini/gi, replace: 'This Week Rate' },
            { regex: /Pasif:\s*\+(\d+)\s*Max HP\s*\(Fisik & Vitality\)/gi, replace: 'Passive: +$1 Max HP (Physical & Vitality)' },
            { regex: /Pasif:\s*\+(\d+(?:\.\d+)?%)\s*XP\s*\(Belajar & Fokus\)/gi, replace: 'Passive: +$1 XP (Study & Focus)' },
            { regex: /Pasif:\s*-(\d+(?:\.\d+)?%)\s*Damage Penalti\s*\(Mindfulness\)/gi, replace: 'Passive: -$1 Penalty Damage (Mindfulness)' },
            { regex: /Pasif:\s*Diskon Shop\s*(\d+%)\s*\(Relasi & Sosial\)/gi, replace: 'Passive: $1 Shop Discount (Relations & Social)' },
            { regex: /Ganti Title\s*\(/gi, replace: 'Switch Title (' },
            { regex: /📊 Progres:/gi, replace: '📊 Progress:' },
            { regex: /Syarat:/gi, replace: 'Requirement:' },
            { regex: /Efek:/gi, replace: 'Effect:' },
            { regex: /\bSemua\b/g, replace: 'All' },
            { regex: /\bPemasukan\b/g, replace: 'Income' },
            { regex: /\bPengeluaran\b/g, replace: 'Expense' },
            { regex: /\bNominal\b/g, replace: 'Amount' }
        ],
        ja: [
            { regex: /\((\d+)\s*Jam\)/gi, replace: '($1時間)' },
            { regex: /(\d+)\s*G\s*\/\s*24j/gi, replace: '$1 G / 24時間' },
            { regex: /⏳\s*Sisa\s*(\d+)j\s*(\d+)m/gi, replace: '⏳ 残り $1時間$2分' },
            { regex: /⏳\s*Sisa\s*(\d+)m/gi, replace: '⏳ 残り $1分' },
            { regex: /Aktif\s*\((\d+)j\s*(\d+)m\)/gi, replace: '装備中 ($1時間$2分)' },
            { regex: /Aktif\s*\((\d+)m\)/gi, replace: '装備中 ($1分)' },
            { regex: /Pasang\s*\((\d+)j\s*(\d+)m\)/gi, replace: '装備する ($1時間$2分)' },
            { regex: /Pasang\s*\((\d+)m\)/gi, replace: '装備する ($1分)' },
            { regex: /(\d+)\s*\/\s*3\s*Slot/gi, replace: '$1 / 3 スロット' },
            { regex: /Distribusi Level Atribut \(All-Time\)/gi, replace: '能力値レベル分布 (全期間)' },
            { regex: /Distribusi Level Atribut/gi, replace: '能力値レベル分布' },
            { regex: /Distribusi Atribut Hunter/gi, replace: 'ハンター能力値分布' },
            { regex: /Evaluasi\s*(&|dan)\s*Lanjut Hari/gi, replace: '評価して次の日へ' },
            { regex: /Matikan Notifikasi/gi, replace: '通知をオフにする' },
            { regex: /Aktifkan Notifikasi/gi, replace: '通知を有効化' },
            { regex: /Dashboard Arus Kas/gi, replace: 'キャッシュフローダッシュボード' },
            { regex: /Kategori Pengeluaran/gi, replace: '支出カテゴリー' },
            { regex: /Kategori Pemasukan/gi, replace: '収入カテゴリー' },
            { regex: /Selisih Bersih/gi, replace: '純収支差額' },
            { regex: /Rasio Masuk:/gi, replace: '収入比率:' },
            { regex: /Keluar:/gi, replace: '支出:' },
            { regex: /Bonus RPG:\s*(\d+\/\d+)\s*Hari Ini/gi, replace: 'RPGボーナス: 本日 $1' },
            { regex: /(\d+)\s*Level lagi menuju/gi, replace: '次のランクまであと $1 レベル' },
            { regex: /Daily Habit \(Target Streak\s*([≥>=]+)\s*(\d+%)\)/gi, replace: 'デイリー習慣 (ストリーク目標 $1 $2)' },
            { regex: /Riwayat\s*\((\d+)\)/gi, replace: '履歴 ($1)' },
            { regex: /(\d+)x\s*Klaim/gi, replace: '$1回 交換済み' },
            { regex: /(\d+)\s*Selesai/gi, replace: '$1件 完了' },
            { regex: /(\d+)\s*Hari\b/gi, replace: '$1日' },
            { regex: /(\d+(?:\.\d+)?)\s*Jam\b/gi, replace: '$1時間' },
            { regex: /Rate Minggu Ini/gi, replace: '今週の達成率' },
            { regex: /Pasif:\s*\+(\d+)\s*Max HP\s*\(Fisik & Vitality\)/gi, replace: 'パッシブ: 最大HP +$1 (体力・生命力)' },
            { regex: /Pasif:\s*\+(\d+(?:\.\d+)?%)\s*XP\s*\(Belajar & Fokus\)/gi, replace: 'パッシブ: 獲得XP +$1 (学習・集中)' },
            { regex: /Pasif:\s*-(\d+(?:\.\d+)?%)\s*Damage Penalti\s*\(Mindfulness\)/gi, replace: 'パッシブ: ペナルティ軽減 -$1 (精神・規律)' },
            { regex: /Pasif:\s*Diskon Shop\s*(\d+%)\s*\(Relasi & Sosial\)/gi, replace: 'パッシブ: ショップ割引 $1 (社交・魅力)' },
            { regex: /Ganti Title\s*\(/gi, replace: '称号変更 (' },
            { regex: /📊 Progres:/gi, replace: '📊 進捗:' },
            { regex: /Syarat:/gi, replace: '条件:' },
            { regex: /Efek:/gi, replace: '効果:' },
            { regex: /\bSemua\b/g, replace: 'すべて' },
            { regex: /\bPemasukan\b/g, replace: '収入' },
            { regex: /\bPengeluaran\b/g, replace: '支出' },
            { regex: /\bNominal\b/g, replace: '金額' }
        ]
    };

    const REVERSE_MAP = {};
    Object.entries(DICTIONARY).forEach(([lang, entries]) => {
        Object.entries(entries).forEach(([idText, translatedText]) => {
            REVERSE_MAP[translatedText] = idText;
            REVERSE_MAP[idText] = idText;
        });
    });

    const SORTED_DICT_KEYS = {
        en: Object.keys(DICTIONARY.en).sort((a, b) => b.length - a.length),
        ja: Object.keys(DICTIONARY.ja).sort((a, b) => b.length - a.length)
    };

    const ORIGINAL_TEXT_MAP = new WeakMap();
    const TRANSLATED_CACHE = {
        id: new Map(),
        en: new Map(),
        ja: new Map()
    };
    const NO_LETTER_RE = /^[^A-Za-z\u3040-\u30ff\u4e00-\u9faf]+$/;

    function getCurrentLang() {
        const stored = localStorage.getItem(LANG_KEY_PRIMARY) || localStorage.getItem(LANG_KEY_LEGACY) || (typeof gameState !== 'undefined' && gameState.language) || 'id';
        return ['id', 'en', 'ja'].includes(stored) ? stored : 'id';
    }

    function translateString(rawText, targetLang) {
        if (!rawText || typeof rawText !== 'string') return rawText;
        if (rawText.length > 600) return rawText;
        const trimmed = rawText.trim();
        if (!trimmed || NO_LETTER_RE.test(trimmed)) return rawText;

        const cache = TRANSLATED_CACHE[targetLang];
        if (cache && cache.has(rawText)) {
            return cache.get(rawText);
        }

        const baseIdKey = REVERSE_MAP[trimmed];
        if (baseIdKey) {
            const translated = targetLang === 'id'
                ? baseIdKey
                : (DICTIONARY[targetLang] && DICTIONARY[targetLang][baseIdKey]) || baseIdKey;
            const out = rawText.replace(trimmed, translated);
            if (cache) cache.set(rawText, out);
            return out;
        }

        if (targetLang === 'id') {
            if (cache) cache.set(rawText, rawText);
            return rawText;
        }

        let result = rawText;
        const rules = PATTERN_RULES[targetLang] || [];
        for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            if (rule.regex.test(result)) {
                rule.regex.lastIndex = 0;
                result = result.replace(rule.regex, rule.replace);
            }
        }

        if (DICTIONARY[targetLang] && SORTED_DICT_KEYS[targetLang]) {
            const keys = SORTED_DICT_KEYS[targetLang];
            for (let i = 0; i < keys.length; i++) {
                const idPhrase = keys[i];
                if (idPhrase.length >= 4 && result.indexOf(idPhrase) !== -1) {
                    result = result.split(idPhrase).join(DICTIONARY[targetLang][idPhrase]);
                }
            }
        }

        if (cache) cache.set(rawText, result);
        return result;
    }

    function translateMixedHtmlBlocks(rootElement, targetLang) {
        if (!rootElement || !rootElement.querySelectorAll) return;
        const blocks = rootElement.querySelectorAll('p, button');
        blocks.forEach((el) => {
            if (el.children.length === 0) return;
            if (el.querySelector('button, input, select, textarea, section, form, nav')) return;
            const text = el.textContent || '';
            if (text.includes('Riwayat (') || text.includes('✦ Buff Sementara Aktif:')) {
                el.dataset.origInnerHtml = el.innerHTML;
            } else if (!el.dataset.origInnerHtml) {
                const isMatch = (HTML_BLOCK_RULES.en || []).some(
                    (r) => text.includes(r.match) && (!r.subMatch || text.includes(r.subMatch))
                );
                if (isMatch) {
                    el.dataset.origInnerHtml = el.innerHTML;
                }
            }
            if (el.dataset.origInnerHtml) {
                if (targetLang === 'id') {
                    if (el.innerHTML !== el.dataset.origInnerHtml) {
                        el.innerHTML = el.dataset.origInnerHtml;
                    }
                } else {
                    const rules = HTML_BLOCK_RULES[targetLang] || [];
                    const found = rules.find(
                        (r) => el.dataset.origInnerHtml.includes(r.match) && (!r.subMatch || el.dataset.origInnerHtml.includes(r.subMatch))
                    );
                    if (found) {
                        const nextHtml = found.getHtml ? found.getHtml(el) : found.html;
                        if (nextHtml && el.innerHTML !== nextHtml) {
                            el.innerHTML = nextHtml;
                        }
                    }
                }
            }
        });
    }

    function translateNode(node, targetLang) {
        if (!node) return;

        if (node.nodeType === Node.TEXT_NODE) {
            if (!ORIGINAL_TEXT_MAP.has(node)) {
                ORIGINAL_TEXT_MAP.set(node, node.nodeValue);
            }
            const sourceText = ORIGINAL_TEXT_MAP.get(node);
            const nextVal = targetLang === 'id' ? sourceText : translateString(sourceText, targetLang);
            if (node.nodeValue !== nextVal) {
                node.nodeValue = nextVal;
            }
            return;
        }

        if (node.nodeType === Node.ELEMENT_NODE) {
            if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG'].includes(node.tagName)) return;

            if (['TEXTAREA', 'INPUT'].includes(node.tagName)) {
                if (node.hasAttribute('placeholder')) {
                    if (!node.dataset.origPlaceholder) {
                        node.dataset.origPlaceholder = node.getAttribute('placeholder');
                    }
                    const origPh = node.dataset.origPlaceholder;
                    const nextPh = targetLang === 'id' ? origPh : translateString(origPh, targetLang);
                    if (node.getAttribute('placeholder') !== nextPh) {
                        node.setAttribute('placeholder', nextPh);
                    }
                }
                return;
            }

            if (node.hasAttribute('title')) {
                if (!node.dataset.origTitle) {
                    node.dataset.origTitle = node.getAttribute('title');
                }
                const origTi = node.dataset.origTitle;
                const nextTi = targetLang === 'id' ? origTi : translateString(origTi, targetLang);
                if (node.getAttribute('title') !== nextTi) {
                    node.setAttribute('title', nextTi);
                }
            }

            const children = node.childNodes;
            for (let i = 0; i < children.length; i++) {
                translateNode(children[i], targetLang);
            }
        }
    }

    function updateLangButtonsHighlight(lang) {
        const btnInactive = 'padding: 0.55rem 0.25rem; border-radius: 0.5rem; border: 1px solid #334155; background: #020617; font-size: 11px; font-weight: 700; color: #cbd5e1;';
        const btnActive = 'padding: 0.55rem 0.25rem; border-radius: 0.5rem; border: 1px solid #06b6d4; background: #083344; font-size: 11px; font-weight: 700; color: #67e8f9;';
        document.querySelectorAll('.app-lang-btn').forEach(b => b.style.cssText = btnInactive);
        const activeLangBtn = document.getElementById(`lang-btn-${lang}`);
        if (activeLangBtn) activeLangBtn.style.cssText = btnActive;
    }

    let isApplying = false;
    let observerStarted = false;

    const observer = new MutationObserver((mutations) => {
        if (isApplying) return;
        const lang = getCurrentLang();
        if (lang === 'id') return;
        isApplying = true;
        try {
            observer.disconnect();
            for (let i = 0; i < mutations.length; i++) {
                const mutation = mutations[i];
                if (mutation.type === 'childList') {
                    for (let j = 0; j < mutation.addedNodes.length; j++) {
                        const added = mutation.addedNodes[j];
                        if (added.nodeType === Node.ELEMENT_NODE) {
                            translateMixedHtmlBlocks(added, lang);
                        }
                        translateNode(added, lang);
                    }
                }
            }
        } finally {
            isApplying = false;
            if (observerStarted && document.body) {
                observer.observe(document.body, { childList: true, subtree: true });
            }
        }
    });

    function applyAppLanguage(forcedLang) {
        if (isApplying) return;
        const lang = ['id', 'en', 'ja'].includes(forcedLang) ? forcedLang : getCurrentLang();
        isApplying = true;
        try {
            if (observerStarted) observer.disconnect();
            localStorage.setItem(LANG_KEY_PRIMARY, lang);
            localStorage.setItem(LANG_KEY_LEGACY, lang);
            document.documentElement.lang = lang;
            updateLangButtonsHighlight(lang);

            if (document.body) {
                translateMixedHtmlBlocks(document.body, lang);
                translateNode(document.body, lang);
            }
        } finally {
            isApplying = false;
            if (observerStarted && document.body) {
                observer.observe(document.body, { childList: true, subtree: true });
            }
        }
    }

    let lastLangSwitchTs = 0;
    let lastLangSwitchVal = '';

    function setAppLanguage(lang) {
        const validLang = ['id', 'en', 'ja'].includes(lang) ? lang : 'id';
        const now = Date.now();
        if (validLang === lastLangSwitchVal && (now - lastLangSwitchTs) < 250) {
            return;
        }
        lastLangSwitchVal = validLang;
        lastLangSwitchTs = now;

        localStorage.setItem(LANG_KEY_PRIMARY, validLang);
        localStorage.setItem(LANG_KEY_LEGACY, validLang);
        if (typeof gameState !== 'undefined') {
            gameState.language = validLang;
            if (typeof saveState === 'function') saveState();
        }
        if (typeof renderAll === 'function') renderAll();
        applyAppLanguage(validLang);

        if (typeof SoundFX !== 'undefined' && SoundFX.playClick) SoundFX.playClick();
        if (typeof spawnFloatingReward === 'function') {
            const names = { id: 'Bahasa Indonesia', en: 'English', ja: '日本語 (Japanese)' };
            spawnFloatingReward(`🌐 ${names[validLang] || validLang}`);
        }
        window.dispatchEvent(new CustomEvent('system-language-changed', { detail: { lang: validLang } }));
    }

    window.applyAppLanguage = applyAppLanguage;
    window.setAppLanguage = setAppLanguage;
    window.setSystemLanguage = setAppLanguage;
    window.t = function (key) {
        return translateString(key, getCurrentLang());
    };

    if (typeof window.renderAll === 'function') {
        const _origRenderAll = window.renderAll;
        window.renderAll = function () {
            _origRenderAll.apply(this, arguments);
            applyAppLanguage(getCurrentLang());
        };
    }

    function initI18nObserver() {
        applyAppLanguage(getCurrentLang());
        if (document.body && !observerStarted) {
            observerStarted = true;
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initI18nObserver);
    } else {
        initI18nObserver();
    }
})();


// ==========================================
// INITIAL BOOT (ALL MODULES READY)
// ==========================================
checkRealDayRollover();
initTreasuryDefaults();
currentOracleIndex = pickContextualOracleIndex();
if (typeof applySavedFontSettings === 'function') applySavedFontSettings();
renderAll();
if (typeof applyAppLanguage === 'function') applyAppLanguage();
syncSystemReminders();
setInterval(checkScheduledReminderTick, 20000);
