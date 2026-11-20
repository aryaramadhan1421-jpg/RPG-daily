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

   ambientTimer: null,

    triggerHaptic(type) {
        try {
            if (window.AndroidBridge && typeof window.AndroidBridge.hapticFeedback === 'function') {
                window.AndroidBridge.hapticFeedback(type);
                return;
            }
            if (navigator && typeof navigator.vibrate === 'function') {
                const map = {
                    tap: 18,
                    quest: 30,
                    complete: [40, 45, 70],
                    levelup: [55, 45, 80, 50, 140],
                    damage: [110, 55, 110]
                };
                navigator.vibrate(map[type] || 20);
            }
        } catch (e) {}
    },

    playClick() {
        this.triggerHaptic('tap');
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
        this.triggerHaptic('tap');
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
        this.triggerHaptic('complete');
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
        this.triggerHaptic('levelup');
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
        this.triggerHaptic('levelup');
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
        this.triggerHaptic('quest');
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
        this.triggerHaptic('damage');
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

    // Rich Offline Ambient Generator for Dungeon Mode
    startAmbient(mode) {
        this.stopAmbient();
        if (mode === 'none' || this.muted) return;
        this.init();

        const masterGain = this.ctx.createGain();
        masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(mode === 'synth' ? 0.24 : 0.22, this.ctx.currentTime + 1.0);
        masterGain.connect(this.ctx.destination);
        this.ambientGain = masterGain;

        if (mode === 'synth') {
            // Ethereal Shadow Temple: Warm Pad Chords + Crystal Chime Arpeggio (Jernih di Speaker HP)
            const chords = [
                [220.00, 261.63, 329.63, 493.88], // Am9
                [174.61, 220.00, 261.63, 329.63], // Fmaj7
                [130.81, 196.00, 246.94, 329.63], // Cmaj7
                [164.81, 196.00, 293.66, 392.00]  // Em7
            ];
            const chimes = [659.25, 783.99, 987.77, 1174.66, 880.00, 659.25];
            let step = 0;

            const playPadCycle = () => {
                if (!this.ambientGain || this.muted) return;
                const now = this.ctx.currentTime;
                const chord = chords[step % chords.length];

                // 1. Warm Stereo-feel Pad Chord
                chord.forEach((freq, idx) => {
                    const osc = this.ctx.createOscillator();
                    const filter = this.ctx.createBiquadFilter();
                    const g = this.ctx.createGain();

                    osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
                    osc.frequency.setValueAtTime(freq, now);
                    osc.detune.setValueAtTime((idx - 1.5) * 7, now);

                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(680, now);
                    filter.frequency.linearRampToValueAtTime(1150, now + 2.2);
                    filter.frequency.linearRampToValueAtTime(620, now + 4.4);

                    g.gain.setValueAtTime(0.0001, now);
                    g.gain.linearRampToValueAtTime(0.11, now + 1.1);
                    g.gain.setValueAtTime(0.11, now + 3.1);
                    g.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

                    osc.connect(filter);
                    filter.connect(g);
                    g.connect(masterGain);

                    osc.start(now);
                    osc.stop(now + 4.55);
                });

                // 2. Soft Crystal Chime Bell (terdengar jelas di speaker HP)
                const bellFreq = chimes[step % chimes.length];
                const bellOsc = this.ctx.createOscillator();
                const bellGain = this.ctx.createGain();
                bellOsc.type = 'sine';
                bellOsc.frequency.setValueAtTime(bellFreq, now + 0.6);

                bellGain.gain.setValueAtTime(0.0001, now + 0.6);
                bellGain.gain.linearRampToValueAtTime(0.055, now + 0.72);
                bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

                bellOsc.connect(bellGain);
                bellGain.connect(masterGain);
                bellOsc.start(now + 0.6);
                bellOsc.stop(now + 3.25);

                step++;
            };

            playPadCycle();
            this.ambientTimer = setInterval(playPadCycle, 4200);
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
            bandpass.frequency.setValueAtTime(820, this.ctx.currentTime);
            bandpass.Q.setValueAtTime(0.6, this.ctx.currentTime);

            const highshelf = this.ctx.createBiquadFilter();
            highshelf.type = 'highshelf';
            highshelf.frequency.setValueAtTime(2400, this.ctx.currentTime);
            highshelf.gain.setValueAtTime(-4, this.ctx.currentTime);

            noise.connect(bandpass);
            bandpass.connect(highshelf);
            highshelf.connect(masterGain);
            noise.start();
            this.ambientNodes.push(noise);
        }
    },

    stopAmbient() {
        if (this.ambientTimer) {
            clearInterval(this.ambientTimer);
            this.ambientTimer = null;
        }
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
        deathHistory: [],
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
            cost: 250,
            type: 'potion',
            healPct: 0.25,
            desc: 'Memulihkan 25% Max HP secara instan.'
        },
        {
            id: 's_elixir',
            title: 'Elixir of Vitality (+100% Max HP)',
            cost: 650,
            type: 'elixir',
            healPct: 1.0,
            desc: 'Memulihkan HP hingga penuh (100% Max HP) dalam kondisi darurat.'
        },
        {
            id: 's3',
            title: 'Streak Freeze (Pelindung Streak • Maks 2)',
            cost: 850,
            type: 'shield',
            desc: 'Otomatis menahan Streak saat terlewat (Maksimal stok 2 di inventori).'
        },
        {
            id: 's_snack',
            title: 'Snack / Camilan Favorit',
            cost: 350,
            type: 'reward',
            desc: 'Reward ringan untuk mengapresiasi konsistensi harian.'
        },
        {
            id: 's2',
            title: 'Kopi Favorit / Minuman Spesial',
            cost: 450,
            type: 'reward',
            desc: 'Reward dunia nyata untuk menyegarkan pikiran.'
        },
        {
            id: 's4',
            title: '1 Jam Main Game Tanpa Rasa Bersalah',
            cost: 600,
            type: 'reward',
            desc: 'Waktu santai bebas penalti setelah menuntaskan quest.'
        },
        {
            id: 's_cheatmeal',
            title: 'Makan Enak / Cheat Meal Spesial',
            cost: 1200,
            type: 'reward',
            desc: 'Hidangan spesial setelah disiplin menjaga pola makan & latihan.'
        },
        {
            id: 's_restpass',
            title: 'Half-Day Rest Pass (Santai Setengah Hari)',
            cost: 1800,
            type: 'reward',
            desc: 'Waktu istirahat total untuk memulihkan fokus & energi mental.'
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
        name: 'Awakened Vessel',
        reqText: 'Gelar awal Hunter yang baru membangkitkan Sistem',
        buffText: 'Status Dasar (1.0x)',
        xpBonus: 0,
        goldBonus: 0,
        checkUnlocked: () => true
    },
    {
        id: 't_discipline',
        name: 'Dawnbreaker',
        reqText: 'Capai Streak Harian 3 Hari berturut-turut',
        buffText: '+4% Bonus XP dari semua misi',
        xpBonus: 0.04,
        goldBonus: 0,
        checkUnlocked: (state) => Math.max(state.player.streak || 0, state.player.longestStreak || 0) >= 3
    },
    {
        id: 't_wolf',
        name: 'Wolf Slayer',
        reqText: 'Capai Streak Harian 7 Hari berturut-turut',
        buffText: '+8% Bonus Gold dari semua misi',
        xpBonus: 0,
        goldBonus: 0.08,
        checkUnlocked: (state) => Math.max(state.player.streak || 0, state.player.longestStreak || 0) >= 7
    },
    {
        id: 't_iron',
        name: 'Dungeon Raider',
        reqText: 'Selesaikan minimal 5x sesi Deep Focus Dungeon',
        buffText: '+8% Bonus XP dari semua misi',
        xpBonus: 0.08,
        goldBonus: 0,
        checkUnlocked: (state) => (state.player.dungeonClears || 0) >= 5
    },
    {
        id: 't_vanguard_body',
        name: 'Iron Vanguard',
        reqText: 'Capai atribut STR Level 15 (Latihan fisik & kebugaran)',
        buffText: '+7% XP & +5% Gold',
        xpBonus: 0.07,
        goldBonus: 0.05,
        checkUnlocked: (state) => (state.player.stats?.STR || 1) >= 15
    },
    {
        id: 't_polyglot',
        name: 'Arcane Polyglot',
        reqText: 'Capai atribut INT Level 15 (Penguasaan bahasa & belajar)',
        buffText: '+10% Bonus XP dari semua misi',
        xpBonus: 0.10,
        goldBonus: 0,
        checkUnlocked: (state) => (state.player.stats?.INT || 1) >= 15
    },
    {
        id: 't_ascetic',
        name: 'Serene Sage',
        reqText: 'Capai atribut WIS Level 15 (Ibadah, dzikir & ketenangan jiwa)',
        buffText: '+8% XP & +7% Gold',
        xpBonus: 0.08,
        goldBonus: 0.07,
        checkUnlocked: (state) => (state.player.stats?.WIS || 1) >= 15
    },
    {
        id: 't_sovereign_voice',
        name: 'Silver-Tongued',
        reqText: 'Capai atribut CHR Level 15 (Komunikasi & perawatan diri)',
        buffText: '+12% Bonus Gold dari semua misi',
        xpBonus: 0,
        goldBonus: 0.12,
        checkUnlocked: (state) => (state.player.stats?.CHR || 1) >= 15
    },
    {
        id: 't_unbroken',
        name: 'Unbroken Will',
        reqText: 'Capai Streak Harian 14 Hari berturut-turut',
        buffText: '+12% Bonus XP & +8% Gold',
        xpBonus: 0.12,
        goldBonus: 0.08,
        checkUnlocked: (state) => Math.max(state.player.streak || 0, state.player.longestStreak || 0) >= 14
    },
    {
        id: 't_abyss_walker',
        name: 'Abyss Conqueror',
        reqText: 'Selesaikan 25x Dungeon atau total 10 Jam Deep Focus',
        buffText: '+14% Bonus XP Permanen',
        xpBonus: 0.14,
        goldBonus: 0,
        checkUnlocked: (state) => (state.player.dungeonClears || 0) >= 25 || (state.player.dungeonMinutesTotal || 0) >= 600
    },
    {
        id: 't_treasurer',
        name: 'Golden Sovereign',
        reqText: 'Kumpulkan saldo 3.000 Gold atau capai D-Rank (Lv.10 & Avg Stat Lv.8)',
        buffText: '+15% Bonus Gold Permanen',
        xpBonus: 0,
        goldBonus: 0.15,
        checkUnlocked: (state) => (state.player.gold || 0) >= 3000 || (state.player.level >= 10 && getAverageStatLevel(state.player.stats) >= 8)
    },
    {
        id: 't_centurion',
        name: 'Relentless Centurion',
        reqText: 'Capai Streak Harian 30 Hari berturut-turut',
        buffText: '+16% XP & +14% Gold Permanen',
        xpBonus: 0.16,
        goldBonus: 0.14,
        checkUnlocked: (state) => Math.max(state.player.streak || 0, state.player.longestStreak || 0) >= 30
    },
    {
        id: 't_grandmaster',
        name: 'Transcendent Master',
        reqText: 'Capai Rank B-Rank (Level 45 & Rata-rata Atribut Lv.32)',
        buffText: '+20% XP & +18% Gold Permanen',
        xpBonus: 0.20,
        goldBonus: 0.18,
        checkUnlocked: (state) => state.player.level >= 45 && getAverageStatLevel(state.player.stats) >= 32
    },
    {
        id: 't_monarch',
        name: 'Monarch of Shadows',
        reqText: 'Capai S-Rank Sovereign (Level 90 & Rata-rata Atribut Lv.70)',
        buffText: '+25% XP & +25% Gold Permanen',
        xpBonus: 0.25,
        goldBonus: 0.25,
        checkUnlocked: (state) => state.player.level >= 90 && getAverageStatLevel(state.player.stats) >= 70
    }
];

// Offline Library + Oracle language pack. Stable IDs preserve rewards and bookmarks.
const V6_CONTENT_LOCALES={"chapters":{"7-habits":{"en":[{"title":"Character Before Techniques","paragraphs":["Character Before Techniques is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For character before techniques, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: When a task feels overwhelming, focus on the decision you can still make today. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Character Before Techniques”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Being Proactive and Your Circle of Influence","paragraphs":["Being Proactive and Your Circle of Influence is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For being proactive and your circle of influence, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: When a task feels overwhelming, focus on the decision you can still make today. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Being Proactive and Your Circle of Influence”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Defining Your Life Direction","paragraphs":["Defining Your Life Direction is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For defining your life direction, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: When a task feels overwhelming, focus on the decision you can still make today. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Defining Your Life Direction”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Important but Nonurgent Priorities","paragraphs":["Important but Nonurgent Priorities is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For important but nonurgent priorities, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: When a task feels overwhelming, focus on the decision you can still make today. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Important but Nonurgent Priorities”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Win-Win Relationships","paragraphs":["Win-Win Relationships is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For win-win relationships, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: When a task feels overwhelming, focus on the decision you can still make today. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Win-Win Relationships”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Listen Before Responding","paragraphs":["Listen Before Responding is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For listen before responding, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: When a task feels overwhelming, focus on the decision you can still make today. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Listen Before Responding”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Synergy Through Differences","paragraphs":["Synergy Through Differences is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For synergy through differences, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: When a task feels overwhelming, focus on the decision you can still make today. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Synergy Through Differences”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Renewing Yourself Continually","paragraphs":["Renewing Yourself Continually is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For renewing yourself continually, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: When a task feels overwhelming, focus on the decision you can still make today. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Renewing Yourself Continually”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]}],"ja":[{"title":"テクニックより人格","paragraphs":["「テクニックより人格」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「テクニックより人格」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、課題が重く感じるときは、今日の自分にできる選択に目を向けてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「テクニックより人格」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"主体性と影響の輪","paragraphs":["「主体性と影響の輪」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「主体性と影響の輪」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、課題が重く感じるときは、今日の自分にできる選択に目を向けてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「主体性と影響の輪」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"人生の方向性を決める","paragraphs":["「人生の方向性を決める」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「人生の方向性を決める」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、課題が重く感じるときは、今日の自分にできる選択に目を向けてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「人生の方向性を決める」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"緊急ではない重要なこと","paragraphs":["「緊急ではない重要なこと」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「緊急ではない重要なこと」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、課題が重く感じるときは、今日の自分にできる選択に目を向けてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「緊急ではない重要なこと」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"互いに利益のある関係","paragraphs":["「互いに利益のある関係」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「互いに利益のある関係」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、課題が重く感じるときは、今日の自分にできる選択に目を向けてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「互いに利益のある関係」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"答える前に聴く","paragraphs":["「答える前に聴く」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「答える前に聴く」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、課題が重く感じるときは、今日の自分にできる選択に目を向けてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「答える前に聴く」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"違いから生まれる相乗効果","paragraphs":["「違いから生まれる相乗効果」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「違いから生まれる相乗効果」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、課題が重く感じるときは、今日の自分にできる選択に目を向けてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「違いから生まれる相乗効果」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"継続的に自分を磨く","paragraphs":["「継続的に自分を磨く」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「継続的に自分を磨く」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、課題が重く感じるときは、今日の自分にできる選択に目を向けてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「継続的に自分を磨く」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]}]},"atomic":{"en":[{"title":"Why Small Changes Matter","paragraphs":["Why Small Changes Matter is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For why small changes matter, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Make the desired behavior easier to start by adjusting one cue in your surroundings. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Why Small Changes Matter”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"The Cue-to-Reward Loop","paragraphs":["The Cue-to-Reward Loop is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For the cue-to-reward loop, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Make the desired behavior easier to start by adjusting one cue in your surroundings. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “The Cue-to-Reward Loop”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Making Habits Visible","paragraphs":["Making Habits Visible is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For making habits visible, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Make the desired behavior easier to start by adjusting one cue in your surroundings. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Making Habits Visible”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Making the First Step Easier","paragraphs":["Making the First Step Easier is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For making the first step easier, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Make the desired behavior easier to start by adjusting one cue in your surroundings. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Making the First Step Easier”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Identity and Repetition","paragraphs":["Identity and Repetition is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For identity and repetition, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Make the desired behavior easier to start by adjusting one cue in your surroundings. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Identity and Repetition”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Reducing Disruptive Habits","paragraphs":["Reducing Disruptive Habits is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For reducing disruptive habits, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Make the desired behavior easier to start by adjusting one cue in your surroundings. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Reducing Disruptive Habits”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Tracking Progress Without Obsession","paragraphs":["Tracking Progress Without Obsession is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For tracking progress without obsession, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Make the desired behavior easier to start by adjusting one cue in your surroundings. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Tracking Progress Without Obsession”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Designing Sustainable Systems","paragraphs":["Designing Sustainable Systems is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For designing sustainable systems, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Make the desired behavior easier to start by adjusting one cue in your surroundings. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Designing Sustainable Systems”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]}],"ja":[{"title":"小さな変化が重要な理由","paragraphs":["「小さな変化が重要な理由」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「小さな変化が重要な理由」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、周囲のきっかけを一つ変え、望ましい行動を始めやすくしてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「小さな変化が重要な理由」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"きっかけから報酬までの循環","paragraphs":["「きっかけから報酬までの循環」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「きっかけから報酬までの循環」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、周囲のきっかけを一つ変え、望ましい行動を始めやすくしてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「きっかけから報酬までの循環」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"習慣を目に見えるようにする","paragraphs":["「習慣を目に見えるようにする」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「習慣を目に見えるようにする」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、周囲のきっかけを一つ変え、望ましい行動を始めやすくしてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「習慣を目に見えるようにする」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"最初の一歩を簡単にする","paragraphs":["「最初の一歩を簡単にする」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「最初の一歩を簡単にする」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、周囲のきっかけを一つ変え、望ましい行動を始めやすくしてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「最初の一歩を簡単にする」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"アイデンティティと反復","paragraphs":["「アイデンティティと反復」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「アイデンティティと反復」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、周囲のきっかけを一つ変え、望ましい行動を始めやすくしてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「アイデンティティと反復」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"邪魔になる習慣を減らす","paragraphs":["「邪魔になる習慣を減らす」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「邪魔になる習慣を減らす」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、周囲のきっかけを一つ変え、望ましい行動を始めやすくしてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「邪魔になる習慣を減らす」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"執着せずに進歩を記録する","paragraphs":["「執着せずに進歩を記録する」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「執着せずに進歩を記録する」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、周囲のきっかけを一つ変え、望ましい行動を始めやすくしてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「執着せずに進歩を記録する」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"続けられる仕組みを設計する","paragraphs":["「続けられる仕組みを設計する」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「続けられる仕組みを設計する」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、周囲のきっかけを一つ変え、望ましい行動を始めやすくしてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「続けられる仕組みを設計する」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]}]},"morning":{"en":[{"title":"A Morning That Fits Your Life","paragraphs":["A Morning That Fits Your Life is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For a morning that fits your life, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Try a five-minute morning ritual that does not shorten your sleep. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “A Morning That Fits Your Life”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Sleep Remains the Foundation","paragraphs":["Sleep Remains the Foundation is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For sleep remains the foundation, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Try a five-minute morning ritual that does not shorten your sleep. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Sleep Remains the Foundation”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Quiet Time and Setting Intentions","paragraphs":["Quiet Time and Setting Intentions is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For quiet time and setting intentions, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Try a five-minute morning ritual that does not shorten your sleep. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Quiet Time and Setting Intentions”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Realistic Physical Movement","paragraphs":["Realistic Physical Movement is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For realistic physical movement, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Try a five-minute morning ritual that does not shorten your sleep. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Realistic Physical Movement”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Brief Reading and Writing","paragraphs":["Brief Reading and Writing is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For brief reading and writing, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Try a five-minute morning ritual that does not shorten your sleep. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Brief Reading and Writing”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Reducing Morning Distractions","paragraphs":["Reducing Morning Distractions is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For reducing morning distractions, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Try a five-minute morning ritual that does not shorten your sleep. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Reducing Morning Distractions”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Routines When Schedules Change","paragraphs":["Routines When Schedules Change is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For routines when schedules change, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Try a five-minute morning ritual that does not shorten your sleep. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Routines When Schedules Change”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Evaluating Without Perfectionism","paragraphs":["Evaluating Without Perfectionism is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For evaluating without perfectionism, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Try a five-minute morning ritual that does not shorten your sleep. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Evaluating Without Perfectionism”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]}],"ja":[{"title":"自分の生活に合う朝","paragraphs":["「自分の生活に合う朝」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「自分の生活に合う朝」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、睡眠時間を削らずに、五分間の朝の習慣を試してみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「自分の生活に合う朝」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"睡眠がすべての土台","paragraphs":["「睡眠がすべての土台」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「睡眠がすべての土台」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、睡眠時間を削らずに、五分間の朝の習慣を試してみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「睡眠がすべての土台」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"静かな時間と意図の設定","paragraphs":["「静かな時間と意図の設定」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「静かな時間と意図の設定」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、睡眠時間を削らずに、五分間の朝の習慣を試してみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「静かな時間と意図の設定」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"無理のない運動","paragraphs":["「無理のない運動」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「無理のない運動」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、睡眠時間を削らずに、五分間の朝の習慣を試してみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「無理のない運動」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"短い読書と執筆","paragraphs":["「短い読書と執筆」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「短い読書と執筆」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、睡眠時間を削らずに、五分間の朝の習慣を試してみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「短い読書と執筆」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"朝の誘惑を減らす","paragraphs":["「朝の誘惑を減らす」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「朝の誘惑を減らす」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、睡眠時間を削らずに、五分間の朝の習慣を試してみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「朝の誘惑を減らす」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"予定が変わる日の習慣","paragraphs":["「予定が変わる日の習慣」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「予定が変わる日の習慣」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、睡眠時間を削らずに、五分間の朝の習慣を試してみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「予定が変わる日の習慣」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"完璧を求めない振り返り","paragraphs":["「完璧を求めない振り返り」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「完璧を求めない振り返り」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、睡眠時間を削らずに、五分間の朝の習慣を試してみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「完璧を求めない振り返り」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]}]},"ikigai":{"en":[{"title":"Finding Meaning in Everyday Life","paragraphs":["Finding Meaning in Everyday Life is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For finding meaning in everyday life, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Notice an everyday activity that makes you feel useful or connected. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Finding Meaning in Everyday Life”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Interests Do Not Always Become Careers","paragraphs":["Interests Do Not Always Become Careers is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For interests do not always become careers, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Notice an everyday activity that makes you feel useful or connected. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Interests Do Not Always Become Careers”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Skills Grow Through Practice","paragraphs":["Skills Grow Through Practice is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For skills grow through practice, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Notice an everyday activity that makes you feel useful or connected. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Skills Grow Through Practice”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Contributing to Others","paragraphs":["Contributing to Others is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For contributing to others, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Notice an everyday activity that makes you feel useful or connected. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Contributing to Others”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Economic Needs and Reality","paragraphs":["Economic Needs and Reality is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For economic needs and reality, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Notice an everyday activity that makes you feel useful or connected. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Economic Needs and Reality”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Small Experiments to Find Direction","paragraphs":["Small Experiments to Find Direction is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For small experiments to find direction, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Notice an everyday activity that makes you feel useful or connected. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Small Experiments to Find Direction”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Protecting Relationships and Health","paragraphs":["Protecting Relationships and Health is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For protecting relationships and health, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Notice an everyday activity that makes you feel useful or connected. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Protecting Relationships and Health”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Meaning as an Evolving Process","paragraphs":["Meaning as an Evolving Process is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For meaning as an evolving process, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Notice an everyday activity that makes you feel useful or connected. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Meaning as an Evolving Process”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]}],"ja":[{"title":"日常の中に意味を見つける","paragraphs":["「日常の中に意味を見つける」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「日常の中に意味を見つける」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、役に立っている、あるいは人とつながっていると感じる日常の活動に注目しましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「日常の中に意味を見つける」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"興味が必ず仕事になるとは限らない","paragraphs":["「興味が必ず仕事になるとは限らない」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「興味が必ず仕事になるとは限らない」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、役に立っている、あるいは人とつながっていると感じる日常の活動に注目しましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「興味が必ず仕事になるとは限らない」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"実践を通して能力を育てる","paragraphs":["「実践を通して能力を育てる」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「実践を通して能力を育てる」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、役に立っている、あるいは人とつながっていると感じる日常の活動に注目しましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「実践を通して能力を育てる」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"他者への貢献","paragraphs":["「他者への貢献」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「他者への貢献」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、役に立っている、あるいは人とつながっていると感じる日常の活動に注目しましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「他者への貢献」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"経済的な必要と現実","paragraphs":["「経済的な必要と現実」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「経済的な必要と現実」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、役に立っている、あるいは人とつながっていると感じる日常の活動に注目しましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「経済的な必要と現実」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"小さな実験で方向性を探る","paragraphs":["「小さな実験で方向性を探る」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「小さな実験で方向性を探る」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、役に立っている、あるいは人とつながっていると感じる日常の活動に注目しましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「小さな実験で方向性を探る」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"人間関係と健康を守る","paragraphs":["「人間関係と健康を守る」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「人間関係と健康を守る」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、役に立っている、あるいは人とつながっていると感じる日常の活動に注目しましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「人間関係と健康を守る」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"変化し続ける生きがい","paragraphs":["「変化し続ける生きがい」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「変化し続ける生きがい」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、役に立っている、あるいは人とつながっていると感じる日常の活動に注目しましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「変化し続ける生きがい」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]}]},"stoic":{"en":[{"title":"What You Can Control","paragraphs":["What You Can Control is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For what you can control, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Separate what happened from the interpretation you gave it. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Write two columns: what you can influence and what is beyond your control. Choose one action from the first. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “What You Can Control”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Perceptions Are Not Facts","paragraphs":["Perceptions Are Not Facts is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For perceptions are not facts, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Separate what happened from the interpretation you gave it. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Write two columns: what you can influence and what is beyond your control. Choose one action from the first. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Perceptions Are Not Facts”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Pausing Before Reacting","paragraphs":["Pausing Before Reacting is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For pausing before reacting, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Separate what happened from the interpretation you gave it. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Write two columns: what you can influence and what is beyond your control. Choose one action from the first. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Pausing Before Reacting”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Virtue as a Compass","paragraphs":["Virtue as a Compass is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For virtue as a compass, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Separate what happened from the interpretation you gave it. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Write two columns: what you can influence and what is beyond your control. Choose one action from the first. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Virtue as a Compass”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Facing Uncertainty","paragraphs":["Facing Uncertainty is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For facing uncertainty, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Separate what happened from the interpretation you gave it. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Write two columns: what you can influence and what is beyond your control. Choose one action from the first. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Facing Uncertainty”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Accepting Without Giving Up","paragraphs":["Accepting Without Giving Up is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For accepting without giving up, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Separate what happened from the interpretation you gave it. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Write two columns: what you can influence and what is beyond your control. Choose one action from the first. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Accepting Without Giving Up”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Practical Evening Reflection","paragraphs":["Practical Evening Reflection is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For practical evening reflection, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Separate what happened from the interpretation you gave it. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Write two columns: what you can influence and what is beyond your control. Choose one action from the first. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Practical Evening Reflection”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Stoicism in Everyday Conflicts","paragraphs":["Stoicism in Everyday Conflicts is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For stoicism in everyday conflicts, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Separate what happened from the interpretation you gave it. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Write two columns: what you can influence and what is beyond your control. Choose one action from the first. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Stoicism in Everyday Conflicts”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]}],"ja":[{"title":"自分で制御できること","paragraphs":["「自分で制御できること」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「自分で制御できること」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、実際に起きた出来事と、自分が与えた解釈を分けて考えてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。影響を与えられることと制御できないことを二列に書き、前者から一つ行動を選びましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「自分で制御できること」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"認識は事実ではない","paragraphs":["「認識は事実ではない」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「認識は事実ではない」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、実際に起きた出来事と、自分が与えた解釈を分けて考えてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。影響を与えられることと制御できないことを二列に書き、前者から一つ行動を選びましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「認識は事実ではない」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"反応する前に間を置く","paragraphs":["「反応する前に間を置く」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「反応する前に間を置く」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、実際に起きた出来事と、自分が与えた解釈を分けて考えてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。影響を与えられることと制御できないことを二列に書き、前者から一つ行動を選びましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「反応する前に間を置く」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"徳を判断の指針にする","paragraphs":["「徳を判断の指針にする」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「徳を判断の指針にする」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、実際に起きた出来事と、自分が与えた解釈を分けて考えてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。影響を与えられることと制御できないことを二列に書き、前者から一つ行動を選びましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「徳を判断の指針にする」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"不確実さに向き合う","paragraphs":["「不確実さに向き合う」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「不確実さに向き合う」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、実際に起きた出来事と、自分が与えた解釈を分けて考えてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。影響を与えられることと制御できないことを二列に書き、前者から一つ行動を選びましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「不確実さに向き合う」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"諦めずに受け入れる","paragraphs":["「諦めずに受け入れる」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「諦めずに受け入れる」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、実際に起きた出来事と、自分が与えた解釈を分けて考えてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。影響を与えられることと制御できないことを二列に書き、前者から一つ行動を選びましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「諦めずに受け入れる」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"夜の実践的な振り返り","paragraphs":["「夜の実践的な振り返り」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「夜の実践的な振り返り」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、実際に起きた出来事と、自分が与えた解釈を分けて考えてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。影響を与えられることと制御できないことを二列に書き、前者から一つ行動を選びましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「夜の実践的な振り返り」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"日常の対立とストア哲学","paragraphs":["「日常の対立とストア哲学」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「日常の対立とストア哲学」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、実際に起きた出来事と、自分が与えた解釈を分けて考えてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。影響を与えられることと制御できないことを二列に書き、前者から一つ行動を選びましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「日常の対立とストア哲学」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]}]},"deep":{"en":[{"title":"The Value of Deep Attention","paragraphs":["The Value of Deep Attention is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For the value of deep attention, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Protect a short period of uninterrupted work for one meaningful task. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Set a focus interval, remove notifications, and note what interrupted you. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “The Value of Deep Attention”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"The Cost of Task Switching","paragraphs":["The Cost of Task Switching is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For the cost of task switching, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Protect a short period of uninterrupted work for one meaningful task. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Set a focus interval, remove notifications, and note what interrupted you. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “The Cost of Task Switching”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Preparing a Focused Space","paragraphs":["Preparing a Focused Space is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For preparing a focused space, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Protect a short period of uninterrupted work for one meaningful task. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Set a focus interval, remove notifications, and note what interrupted you. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Preparing a Focused Space”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Defining the Session Outcome","paragraphs":["Defining the Session Outcome is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For defining the session outcome, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Protect a short period of uninterrupted work for one meaningful task. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Set a focus interval, remove notifications, and note what interrupted you. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Defining the Session Outcome”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Starting and Finishing Rituals","paragraphs":["Starting and Finishing Rituals is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For starting and finishing rituals, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Protect a short period of uninterrupted work for one meaningful task. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Set a focus interval, remove notifications, and note what interrupted you. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Starting and Finishing Rituals”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Managing Notifications","paragraphs":["Managing Notifications is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For managing notifications, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Protect a short period of uninterrupted work for one meaningful task. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Set a focus interval, remove notifications, and note what interrupted you. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Managing Notifications”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Rest and Recovery","paragraphs":["Rest and Recovery is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For rest and recovery, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Protect a short period of uninterrupted work for one meaningful task. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Set a focus interval, remove notifications, and note what interrupted you. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Rest and Recovery”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Measuring Quality, Not Hours","paragraphs":["Measuring Quality, Not Hours is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For measuring quality, not hours, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Protect a short period of uninterrupted work for one meaningful task. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Set a focus interval, remove notifications, and note what interrupted you. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Measuring Quality, Not Hours”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]}],"ja":[{"title":"深い集中の価値","paragraphs":["「深い集中の価値」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「深い集中の価値」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、大切な課題一つのために、邪魔されない短い集中時間を確保しましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。集中する時間を決め、通知を消し、妨げになったことを記録しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「深い集中の価値」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"作業切り替えの代償","paragraphs":["「作業切り替えの代償」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「作業切り替えの代償」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、大切な課題一つのために、邪魔されない短い集中時間を確保しましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。集中する時間を決め、通知を消し、妨げになったことを記録しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「作業切り替えの代償」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"集中できる環境を整える","paragraphs":["「集中できる環境を整える」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「集中できる環境を整える」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、大切な課題一つのために、邪魔されない短い集中時間を確保しましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。集中する時間を決め、通知を消し、妨げになったことを記録しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「集中できる環境を整える」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"作業の成果を決める","paragraphs":["「作業の成果を決める」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「作業の成果を決める」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、大切な課題一つのために、邪魔されない短い集中時間を確保しましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。集中する時間を決め、通知を消し、妨げになったことを記録しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「作業の成果を決める」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"始めと終わりの儀式","paragraphs":["「始めと終わりの儀式」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「始めと終わりの儀式」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、大切な課題一つのために、邪魔されない短い集中時間を確保しましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。集中する時間を決め、通知を消し、妨げになったことを記録しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「始めと終わりの儀式」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"通知を管理する","paragraphs":["「通知を管理する」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「通知を管理する」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、大切な課題一つのために、邪魔されない短い集中時間を確保しましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。集中する時間を決め、通知を消し、妨げになったことを記録しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「通知を管理する」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"休息と回復","paragraphs":["「休息と回復」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「休息と回復」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、大切な課題一つのために、邪魔されない短い集中時間を確保しましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。集中する時間を決め、通知を消し、妨げになったことを記録しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「休息と回復」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"時間ではなく質を測る","paragraphs":["「時間ではなく質を測る」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「時間ではなく質を測る」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、大切な課題一つのために、邪魔されない短い集中時間を確保しましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。集中する時間を決め、通知を消し、妨げになったことを記録しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「時間ではなく質を測る」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]}]},"growth":{"en":[{"title":"Ability Is Not a Fixed Label","paragraphs":["Ability Is Not a Fixed Label is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For ability is not a fixed label, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Treat feedback as information about your strategy, not a verdict on your ability. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Ability Is Not a Fixed Label”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Deliberate Practice","paragraphs":["Deliberate Practice is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For deliberate practice, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Treat feedback as information about your strategy, not a verdict on your ability. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Deliberate Practice”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Strategies and Feedback","paragraphs":["Strategies and Feedback is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For strategies and feedback, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Treat feedback as information about your strategy, not a verdict on your ability. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Strategies and Feedback”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Facing Mistakes","paragraphs":["Facing Mistakes is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For facing mistakes, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Treat feedback as information about your strategy, not a verdict on your ability. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Facing Mistakes”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Language That Opens Possibilities","paragraphs":["Language That Opens Possibilities is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For language that opens possibilities, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Treat feedback as information about your strategy, not a verdict on your ability. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Language That Opens Possibilities”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Support and Environment","paragraphs":["Support and Environment is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For support and environment, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Treat feedback as information about your strategy, not a verdict on your ability. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Support and Environment”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Separating Effort from Results","paragraphs":["Separating Effort from Results is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For separating effort from results, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Treat feedback as information about your strategy, not a verdict on your ability. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Separating Effort from Results”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Building Learning Habits","paragraphs":["Building Learning Habits is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For building learning habits, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Treat feedback as information about your strategy, not a verdict on your ability. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Choose one practical action related to this chapter and test it in your everyday routine. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Building Learning Habits”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]}],"ja":[{"title":"能力は固定されたものではない","paragraphs":["「能力は固定されたものではない」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「能力は固定されたものではない」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、フィードバックを能力への判決ではなく、方法を改善する情報として受け止めましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「能力は固定されたものではない」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"意図的な練習","paragraphs":["「意図的な練習」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「意図的な練習」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、フィードバックを能力への判決ではなく、方法を改善する情報として受け止めましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「意図的な練習」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"戦略とフィードバック","paragraphs":["「戦略とフィードバック」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「戦略とフィードバック」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、フィードバックを能力への判決ではなく、方法を改善する情報として受け止めましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「戦略とフィードバック」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"失敗に向き合う","paragraphs":["「失敗に向き合う」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「失敗に向き合う」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、フィードバックを能力への判決ではなく、方法を改善する情報として受け止めましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「失敗に向き合う」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"可能性を広げる言葉","paragraphs":["「可能性を広げる言葉」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「可能性を広げる言葉」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、フィードバックを能力への判決ではなく、方法を改善する情報として受け止めましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「可能性を広げる言葉」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"支援と環境","paragraphs":["「支援と環境」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「支援と環境」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、フィードバックを能力への判決ではなく、方法を改善する情報として受け止めましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「支援と環境」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"努力と結果を区別する","paragraphs":["「努力と結果を区別する」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「努力と結果を区別する」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、フィードバックを能力への判決ではなく、方法を改善する情報として受け止めましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「努力と結果を区別する」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"学習習慣を育てる","paragraphs":["「学習習慣を育てる」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「学習習慣を育てる」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、フィードバックを能力への判決ではなく、方法を改善する情報として受け止めましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。この章に関係する実践的な行動を一つ選び、日常の中で試してみましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「学習習慣を育てる」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]}]},"eq":{"en":[{"title":"Identifying Emotions Precisely","paragraphs":["Identifying Emotions Precisely is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For identifying emotions precisely, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Name the emotion you are feeling before deciding how to respond. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Write down a feeling, its trigger, and a respectful response you could try. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Identifying Emotions Precisely”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Emotions and Needs","paragraphs":["Emotions and Needs is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For emotions and needs, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Name the emotion you are feeling before deciding how to respond. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Write down a feeling, its trigger, and a respectful response you could try. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Emotions and Needs”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Creating a Pause Before Responding","paragraphs":["Creating a Pause Before Responding is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For creating a pause before responding, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Name the emotion you are feeling before deciding how to respond. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Write down a feeling, its trigger, and a respectful response you could try. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Creating a Pause Before Responding”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Empathy Without Assumptions","paragraphs":["Empathy Without Assumptions is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For empathy without assumptions, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Name the emotion you are feeling before deciding how to respond. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Write down a feeling, its trigger, and a respectful response you could try. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Empathy Without Assumptions”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Communicating During Conflict","paragraphs":["Communicating During Conflict is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For communicating during conflict, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Name the emotion you are feeling before deciding how to respond. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Write down a feeling, its trigger, and a respectful response you could try. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Communicating During Conflict”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Healthy Boundaries","paragraphs":["Healthy Boundaries is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For healthy boundaries, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Name the emotion you are feeling before deciding how to respond. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Write down a feeling, its trigger, and a respectful response you could try. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Healthy Boundaries”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Repairing Relationships","paragraphs":["Repairing Relationships is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For repairing relationships, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Name the emotion you are feeling before deciding how to respond. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Write down a feeling, its trigger, and a respectful response you could try. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Repairing Relationships”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Keeping an Emotion Journal","paragraphs":["Keeping an Emotion Journal is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For keeping an emotion journal, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Name the emotion you are feeling before deciding how to respond. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Write down a feeling, its trigger, and a respectful response you could try. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Keeping an Emotion Journal”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]}],"ja":[{"title":"感情を正確に見分ける","paragraphs":["「感情を正確に見分ける」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「感情を正確に見分ける」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、反応を決める前に、今感じている感情を言葉にしてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。感情、そのきっかけ、試してみたい丁寧な対応を書き出しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「感情を正確に見分ける」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"感情と必要なもの","paragraphs":["「感情と必要なもの」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「感情と必要なもの」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、反応を決める前に、今感じている感情を言葉にしてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。感情、そのきっかけ、試してみたい丁寧な対応を書き出しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「感情と必要なもの」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"反応する前に一呼吸置く","paragraphs":["「反応する前に一呼吸置く」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「反応する前に一呼吸置く」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、反応を決める前に、今感じている感情を言葉にしてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。感情、そのきっかけ、試してみたい丁寧な対応を書き出しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「反応する前に一呼吸置く」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"決めつけない共感","paragraphs":["「決めつけない共感」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「決めつけない共感」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、反応を決める前に、今感じている感情を言葉にしてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。感情、そのきっかけ、試してみたい丁寧な対応を書き出しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「決めつけない共感」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"対立時のコミュニケーション","paragraphs":["「対立時のコミュニケーション」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「対立時のコミュニケーション」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、反応を決める前に、今感じている感情を言葉にしてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。感情、そのきっかけ、試してみたい丁寧な対応を書き出しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「対立時のコミュニケーション」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"健全な境界線","paragraphs":["「健全な境界線」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「健全な境界線」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、反応を決める前に、今感じている感情を言葉にしてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。感情、そのきっかけ、試してみたい丁寧な対応を書き出しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「健全な境界線」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"関係を修復する","paragraphs":["「関係を修復する」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「関係を修復する」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、反応を決める前に、今感じている感情を言葉にしてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。感情、そのきっかけ、試してみたい丁寧な対応を書き出しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「関係を修復する」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"感情日記をつける","paragraphs":["「感情日記をつける」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「感情日記をつける」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、反応を決める前に、今感じている感情を言葉にしてみましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。感情、そのきっかけ、試してみたい丁寧な対応を書き出しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「感情日記をつける」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]}]},"time":{"en":[{"title":"Time, Attention, and Energy","paragraphs":["Time, Attention, and Energy is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For time, attention, and energy, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Choose one important outcome before filling your day with smaller tasks. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Pick one priority, divide it into small steps, and leave room for rest. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Time, Attention, and Energy”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Setting Important Priorities","paragraphs":["Setting Important Priorities is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For setting important priorities, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Choose one important outcome before filling your day with smaller tasks. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Pick one priority, divide it into small steps, and leave room for rest. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Setting Important Priorities”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Breaking Down Large Tasks","paragraphs":["Breaking Down Large Tasks is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For breaking down large tasks, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Choose one important outcome before filling your day with smaller tasks. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Pick one priority, divide it into small steps, and leave room for rest. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Breaking Down Large Tasks”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Flexible Planning","paragraphs":["Flexible Planning is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For flexible planning, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Choose one important outcome before filling your day with smaller tasks. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Pick one priority, divide it into small steps, and leave room for rest. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Flexible Planning”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Overcoming Procrastination","paragraphs":["Overcoming Procrastination is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For overcoming procrastination, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Choose one important outcome before filling your day with smaller tasks. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Pick one priority, divide it into small steps, and leave room for rest. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Overcoming Procrastination”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Protecting Rest Time","paragraphs":["Protecting Rest Time is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For protecting rest time, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Choose one important outcome before filling your day with smaller tasks. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Pick one priority, divide it into small steps, and leave room for rest. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Protecting Rest Time”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Weekly Review","paragraphs":["Weekly Review is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For weekly review, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Choose one important outcome before filling your day with smaller tasks. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Pick one priority, divide it into small steps, and leave room for rest. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Weekly Review”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Creating a Simple System","paragraphs":["Creating a Simple System is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For creating a simple system, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Choose one important outcome before filling your day with smaller tasks. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Pick one priority, divide it into small steps, and leave room for rest. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Creating a Simple System”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]}],"ja":[{"title":"時間・注意・エネルギー","paragraphs":["「時間・注意・エネルギー」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「時間・注意・エネルギー」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、細かな用事で一日を埋める前に、重要な成果を一つ選びましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。優先事項を一つ選び、小さな手順に分け、休む余裕も残しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「時間・注意・エネルギー」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"重要な優先順位を決める","paragraphs":["「重要な優先順位を決める」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「重要な優先順位を決める」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、細かな用事で一日を埋める前に、重要な成果を一つ選びましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。優先事項を一つ選び、小さな手順に分け、休む余裕も残しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「重要な優先順位を決める」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"大きな課題を分ける","paragraphs":["「大きな課題を分ける」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「大きな課題を分ける」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、細かな用事で一日を埋める前に、重要な成果を一つ選びましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。優先事項を一つ選び、小さな手順に分け、休む余裕も残しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「大きな課題を分ける」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"柔軟な計画","paragraphs":["「柔軟な計画」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「柔軟な計画」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、細かな用事で一日を埋める前に、重要な成果を一つ選びましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。優先事項を一つ選び、小さな手順に分け、休む余裕も残しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「柔軟な計画」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"先延ばしを乗り越える","paragraphs":["「先延ばしを乗り越える」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「先延ばしを乗り越える」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、細かな用事で一日を埋める前に、重要な成果を一つ選びましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。優先事項を一つ選び、小さな手順に分け、休む余裕も残しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「先延ばしを乗り越える」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"休息の時間を守る","paragraphs":["「休息の時間を守る」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「休息の時間を守る」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、細かな用事で一日を埋める前に、重要な成果を一つ選びましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。優先事項を一つ選び、小さな手順に分け、休む余裕も残しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「休息の時間を守る」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"週ごとの振り返り","paragraphs":["「週ごとの振り返り」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「週ごとの振り返り」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、細かな用事で一日を埋める前に、重要な成果を一つ選びましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。優先事項を一つ選び、小さな手順に分け、休む余裕も残しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「週ごとの振り返り」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"シンプルな仕組みを作る","paragraphs":["「シンプルな仕組みを作る」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「シンプルな仕組みを作る」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、細かな用事で一日を埋める前に、重要な成果を一つ選びましょう。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。優先事項を一つ選び、小さな手順に分け、休む余裕も残しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「シンプルな仕組みを作る」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]}]},"finance":{"en":[{"title":"Mapping Cash Flow","paragraphs":["Mapping Cash Flow is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For mapping cash flow, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Tracking small expenses for a week can reveal patterns you may have missed. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Sort spending into needs, commitments, and choices, then review it without judging yourself. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Mapping Cash Flow”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Needs and Wants","paragraphs":["Needs and Wants is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For needs and wants, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Tracking small expenses for a week can reveal patterns you may have missed. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Sort spending into needs, commitments, and choices, then review it without judging yourself. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Needs and Wants”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"A Workable Budget","paragraphs":["A Workable Budget is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For a workable budget, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Tracking small expenses for a week can reveal patterns you may have missed. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Sort spending into needs, commitments, and choices, then review it without judging yourself. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “A Workable Budget”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Emergency Savings","paragraphs":["Emergency Savings is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For emergency savings, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Tracking small expenses for a week can reveal patterns you may have missed. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Sort spending into needs, commitments, and choices, then review it without judging yourself. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Emergency Savings”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Debt and Interest Costs","paragraphs":["Debt and Interest Costs is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For debt and interest costs, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Tracking small expenses for a week can reveal patterns you may have missed. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Sort spending into needs, commitments, and choices, then review it without judging yourself. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Debt and Interest Costs”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Risk and Diversification","paragraphs":["Risk and Diversification is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For risk and diversification, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Tracking small expenses for a week can reveal patterns you may have missed. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Sort spending into needs, commitments, and choices, then review it without judging yourself. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Risk and Diversification”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Protection Against Fraud","paragraphs":["Protection Against Fraud is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For protection against fraud, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Tracking small expenses for a week can reveal patterns you may have missed. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Sort spending into needs, commitments, and choices, then review it without judging yourself. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Protection Against Fraud”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]},{"title":"Reviewing Financial Goals","paragraphs":["Reviewing Financial Goals is an important part of understanding this subject. These ideas are not rigid rules that fit everyone. Start by considering your circumstances, goals, limitations, and available resources. Lasting understanding comes from testing ideas in daily life rather than memorizing attractive phrases.","Consider how small choices shape long-term outcomes. Change is often difficult not because we lack knowledge, but because the first step is too large, the environment is unsupportive, or we expect results too quickly. For reviewing financial goals, identify the specific problem you want to solve. Then choose a simple, observable sign of progress without measuring every moment of your life.","For example: Tracking small expenses for a week can reveal patterns you may have missed. This is not a universal prescription. People have different schedules, responsibilities, health needs, and circumstances. Understand why a strategy may help, then adapt it. If it does not work, treat the outcome as information for adjusting your approach, not proof of personal failure.","Try a small experiment over several days. Sort spending into needs, commitments, and choices, then review it without judging yourself. Record what felt easy, what got in the way, and one adjustment to try next. Avoid adding too many goals at once: one action actually completed teaches more than a long, impressive-looking list.","Hunter reflection: what is one decision you can make after studying “Reviewing Financial Goals”? Connect your answer to your quests, studies, work, or relationships. You do not have to solve everything today. This chapter aims to offer a perspective and a step to test and evaluate honestly. Healthy progress leaves room to learn, rest, and begin again."]}],"ja":[{"title":"お金の流れを把握する","paragraphs":["「お金の流れを把握する」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「お金の流れを把握する」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、一週間の小さな支出を記録すると、見落としていた傾向が見えてくることがあります。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。支出を必要なもの、約束した支払い、選択できるものに分け、自分を責めずに見直しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「お金の流れを把握する」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"必要なものと欲しいもの","paragraphs":["「必要なものと欲しいもの」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「必要なものと欲しいもの」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、一週間の小さな支出を記録すると、見落としていた傾向が見えてくることがあります。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。支出を必要なもの、約束した支払い、選択できるものに分け、自分を責めずに見直しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「必要なものと欲しいもの」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"実行できる予算","paragraphs":["「実行できる予算」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「実行できる予算」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、一週間の小さな支出を記録すると、見落としていた傾向が見えてくることがあります。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。支出を必要なもの、約束した支払い、選択できるものに分け、自分を責めずに見直しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「実行できる予算」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"緊急時の貯蓄","paragraphs":["「緊急時の貯蓄」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「緊急時の貯蓄」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、一週間の小さな支出を記録すると、見落としていた傾向が見えてくることがあります。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。支出を必要なもの、約束した支払い、選択できるものに分け、自分を責めずに見直しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「緊急時の貯蓄」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"借金と利息の負担","paragraphs":["「借金と利息の負担」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「借金と利息の負担」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、一週間の小さな支出を記録すると、見落としていた傾向が見えてくることがあります。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。支出を必要なもの、約束した支払い、選択できるものに分け、自分を責めずに見直しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「借金と利息の負担」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"リスクと分散","paragraphs":["「リスクと分散」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「リスクと分散」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、一週間の小さな支出を記録すると、見落としていた傾向が見えてくることがあります。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。支出を必要なもの、約束した支払い、選択できるものに分け、自分を責めずに見直しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「リスクと分散」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"詐欺から身を守る","paragraphs":["「詐欺から身を守る」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「詐欺から身を守る」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、一週間の小さな支出を記録すると、見落としていた傾向が見えてくることがあります。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。支出を必要なもの、約束した支払い、選択できるものに分け、自分を責めずに見直しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「詐欺から身を守る」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]},{"title":"お金の目標を見直す","paragraphs":["「お金の目標を見直す」は、このテーマを理解するための大切な視点です。ここで紹介する考え方は、誰にでも当てはまる厳格な規則ではありません。まず自分の状況、目標、制約、使える資源を見つめましょう。長く役立つ理解は、魅力的な言葉を暗記するだけでなく、日常生活で試すことから生まれます。","小さな選択が長期的にどのような結果を生むか考えてみましょう。変化が難しいのは、何が良いか知らないからとは限りません。最初の一歩が大きすぎたり、環境が整っていなかったり、結果を急ぎすぎたりすることもあります。「お金の目標を見直す」について、まず解決したい具体的な問題を一つ決めましょう。そして、生活のすべてを測定しなくても確認できる簡単な進歩の目印を選びます。","例えば、一週間の小さな支出を記録すると、見落としていた傾向が見えてくることがあります。 これはすべての人に通用する唯一の正解ではありません。生活時間、責任、健康状態、置かれた環境は人それぞれです。方法が役立つ理由を理解し、自分に合わせて調整しましょう。うまくいかなかった結果は、自分が駄目だという証拠ではなく、方法を改善するための情報です。","数日間、小さな実験をしてみましょう。支出を必要なもの、約束した支払い、選択できるものに分け、自分を責めずに見直しましょう。 やりやすかったこと、妨げになったこと、次に変えたいことを記録します。一度に目標を増やしすぎないでください。実際に行った一つの行動は、立派に見える長い計画より多くを教えてくれます。","ハンターの振り返り：「お金の目標を見直す」を学んだ後、あなたができる決断は何でしょうか。クエスト、勉強、仕事、人間関係と結びつけて考えてみてください。今日すべてを解決する必要はありません。この章の目的は、試して正直に振り返れる視点と行動を見つけることです。健全な成長には、学び、休み、再び始める余地があります。"]}]}},"metadata":{"7-habits":["Building character through conscious choices.","意識的な選択を通じて人格を育てる。"],"atomic":["Small changes you can sustain.","続けられる小さな変化。"],"morning":["Designing a realistic morning routine.","無理のない朝の習慣を設計する。"],"ikigai":["Finding reasons to embrace each day.","毎日を生きる意味を見つける。"],"stoic":["Choosing your response to what you cannot control.","制御できない出来事への対応を選ぶ。"],"deep":["Protecting time for deep thinking.","深く考える時間を守る。"],"growth":["Abilities can develop through a process.","能力は過程を通じて育てられる。"],"eq":["Recognizing emotions and responding wisely.","感情を理解し、賢く対応する。"],"time":["Managing priorities and energy.","優先順位とエネルギーを管理する。"],"finance":["The basics of managing money consciously.","意識的なお金の管理の基礎。"]},"oracle":{"en":["You do not rise to the level of your goals. You fall to the level of your systems.","Every action you take is a vote for the type of person you wish to become.","We are what we repeatedly do. Excellence, then, is not an act, but a habit.","Discipline is choosing between what you want now and what you want most.","The person who conquers himself is the mightiest warrior.","Start where you are. Use what you have. Do what you can.","The ability to perform deep work is becoming increasingly rare, and increasingly valuable.","The successful warrior is the average man, with laser-like focus.","Tranquility of mind is the summit of self-mastery.","It is not that we have a short time to live, but that we waste much of it.","The obstacle in the path becomes the path.","Fall seven times, stand up eight.","Success is not final, failure is not fatal: it is the courage to continue that counts.","Do not pray for an easy life; pray for the strength to endure a difficult one.","The unexamined life is not worth living.","Well done is better than well said.","It is not that we have a short time to live, but that we waste a lot of it.","No man is free who is not master of himself.","The impediment to action advances action. What stands in the way becomes the way.","If you want to improve, be content to be thought foolish and stupid.","The happiness of your life depends upon the quality of your thoughts.","A journey of a thousand miles begins with a single step."],"ja":["目標の高さまで上がるのではなく、仕組みの水準まで下がる。","一つひとつの行動が、なりたい自分への一票になる。","私たちは繰り返し行うことによって形づくられる。卓越とは一度の行為ではなく習慣である。","規律とは、今欲しいものと最も大切なもののどちらを選ぶかということだ。","自分自身に打ち勝つ者こそ、最も強い戦士である。","今いる場所から始めよう。持っているものを使い、できることをしよう。","深く集中して働く能力はますます希少になり、同時に価値を増している。","成功する戦士とは、レーザーのように集中した普通の人である。","心の静けさは自己統制の頂点である。","人生が短いのではない。私たちがその多くを浪費しているのだ。","道をふさぐ障害そのものが、進むべき道になる。","七転び八起き。","成功は終わりではなく、失敗も致命的ではない。大切なのは続ける勇気だ。","楽な人生ではなく、困難に耐える力を願いなさい。","吟味されない人生は生きるに値しない。","立派に語るより、立派に行うほうがよい。","人生が短いのではない。多くの時間を浪費しているのだ。","自分を律することができなければ、自由ではない。","行動を妨げるものが、かえって行動を前に進める。障害こそ道になる。","成長したいなら、愚かだと思われることも受け入れなさい。","人生の幸福は、思考の質に左右される。","千里の道も一歩から始まる。"]}};

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

SYSTEM_QUOTES_CATALOG.push(...[{"text": "Disiplin bukan janji untuk selalu kuat, melainkan keputusan untuk kembali pada hal penting.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Rutinitas kecil mengurangi jarak antara niat dan tindakan.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Ketika motivasi turun, sistem yang sederhana akan tetap menuntunmu.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Satu tugas yang selesai lebih berharga daripada sepuluh rencana yang tak dimulai.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Jadilah orang yang bisa mempercayai janji kecilnya sendiri.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Konsistensi tumbuh dari pengulangan, bukan dari hari yang sempurna.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Tindakan yang sederhana tetap bernilai ketika dilakukan dengan sadar.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Jangan menunggu kondisi ideal untuk melakukan langkah yang mungkin hari ini.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Kemajuan dimulai ketika alasan berhenti mengalahkan alasan bertindak.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Kebiasaan baik adalah bentuk perhatian kepada dirimu di masa depan.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Perhatianmu adalah sumber daya; tempat kamu menaruhnya menentukan apa yang tumbuh.", "author": "SYSTEM RPG · Original Wisdom", "tag": "focus"}, {"text": "Selesaikan satu hal penting sebelum membuka pintu bagi sepuluh gangguan.", "author": "SYSTEM RPG · Original Wisdom", "tag": "focus"}, {"text": "Fokus bukan bekerja tanpa henti, tetapi memilih kapan harus hadir sepenuhnya.", "author": "SYSTEM RPG · Original Wisdom", "tag": "focus"}, {"text": "Keheningan sesaat bisa menjadi ruang bagi gagasan yang lebih jernih.", "author": "SYSTEM RPG · Original Wisdom", "tag": "focus"}, {"text": "Tidak semua hal mendesak layak mendapat perhatian pertamamu.", "author": "SYSTEM RPG · Original Wisdom", "tag": "focus"}, {"text": "Pikiran yang lelah membutuhkan jeda, bukan selalu tekanan tambahan.", "author": "SYSTEM RPG · Original Wisdom", "tag": "focus"}, {"text": "Pekerjaan mendalam dimulai dengan keberanian menutup gangguan kecil.", "author": "SYSTEM RPG · Original Wisdom", "tag": "focus"}, {"text": "Satu jam penuh perhatian bisa mengubah arah satu hari.", "author": "SYSTEM RPG · Original Wisdom", "tag": "focus"}, {"text": "Menolak gangguan adalah cara mengatakan ya kepada tujuanmu.", "author": "SYSTEM RPG · Original Wisdom", "tag": "focus"}, {"text": "Beri pikiranmu kesempatan menyelesaikan satu perjalanan sebelum memulai yang lain.", "author": "SYSTEM RPG · Original Wisdom", "tag": "focus"}, {"text": "Hari yang sulit tidak menghapus usaha pada hari sebelumnya.", "author": "SYSTEM RPG · Original Wisdom", "tag": "recovery"}, {"text": "Beristirahat dengan sadar adalah bagian dari perjalanan, bukan lawannya.", "author": "SYSTEM RPG · Original Wisdom", "tag": "recovery"}, {"text": "Kegagalan hari ini bisa menjadi informasi untuk strategi besok.", "author": "SYSTEM RPG · Original Wisdom", "tag": "recovery"}, {"text": "Kamu boleh berjalan lambat tanpa harus meninggalkan arah.", "author": "SYSTEM RPG · Original Wisdom", "tag": "recovery"}, {"text": "Kekuatan juga terlihat ketika kamu berani meminta bantuan.", "author": "SYSTEM RPG · Original Wisdom", "tag": "recovery"}, {"text": "Jangan menilai seluruh perjalanan dari satu malam yang berat.", "author": "SYSTEM RPG · Original Wisdom", "tag": "recovery"}, {"text": "Memulai kembali adalah kemampuan yang pantas dilatih.", "author": "SYSTEM RPG · Original Wisdom", "tag": "recovery"}, {"text": "Luka pada rencana bukan berarti akhir dari tujuan.", "author": "SYSTEM RPG · Original Wisdom", "tag": "recovery"}, {"text": "Pemulihan membutuhkan kesabaran yang sama besarnya dengan perjuangan.", "author": "SYSTEM RPG · Original Wisdom", "tag": "recovery"}, {"text": "Seorang Hunter tidak kehilangan nilainya hanya karena satu quest gagal.", "author": "SYSTEM RPG · Original Wisdom", "tag": "recovery"}, {"text": "Kemampuan berkembang ketika rasa ingin tahu bertemu latihan yang terarah.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Pertanyaan yang baik kadang lebih berharga daripada jawaban yang cepat.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Belajar berarti bersedia menjadi pemula berkali-kali.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Umpan balik bukan vonis; ia adalah petunjuk untuk langkah berikutnya.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Jangan bandingkan bab pertamamu dengan bab kesepuluh orang lain.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Perubahan besar sering tersembunyi di balik latihan yang tampak biasa.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Pilih kemajuan yang dapat diulang daripada lonjakan yang menguras tenaga.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Kesalahan yang dipahami dapat berubah menjadi pengetahuan.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Tumbuh bukan menjadi orang lain, tetapi memperluas kemampuan diri.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Setiap kali mencoba strategi baru, kamu memperbesar kemungkinan berhasil.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Tidak semua yang bisa kamu kendalikan perlu kamu kendalikan.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Ketenangan muncul ketika kamu membedakan fakta dari dugaan.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Keputusan yang bijak mempertimbangkan dampak setelah rasa sesaat berlalu.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Mendengarkan dengan sungguh-sungguh adalah bentuk kekuatan.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Hidup yang bermakna dibangun dari pilihan yang selaras dengan nilai.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Mengetahui kapan berhenti sama pentingnya dengan mengetahui kapan mulai.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Kesederhanaan dapat menjadi bentuk kecerdasan yang matang.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Jangan biarkan satu emosi sesaat menentukan keputusan jangka panjang.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Memahami alasanmu membantu menjaga arah ketika hasil belum terlihat.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Sikap terbuka tidak berarti kehilangan prinsip.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Keberanian kadang hanya berupa satu percobaan lagi.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Langkah pertama tidak harus besar agar tetap berarti.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Ketidakpastian tidak selalu tanda untuk mundur.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Berani berkata tidak dapat melindungi hal yang lebih penting.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Mengakui bahwa kamu belum tahu adalah awal keberanian belajar.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Kamu tidak harus merasa siap untuk mulai mempersiapkan diri.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Hadapi tugas yang menakutkan dengan membaginya menjadi langkah kecil.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Keberanian dan kehati-hatian bisa berjalan bersama.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Keputusan sulit lebih mudah dijalani ketika alasannya jelas.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Suara keraguan boleh ada tanpa harus menjadi pengemudi.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Catatan hari ini adalah percakapan dengan dirimu di masa depan.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Syukur tidak menghapus kesulitan, tetapi membantu melihat hal yang masih baik.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Evaluasi yang jujur perlu ditemani belas kasih kepada diri sendiri.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Tanyakan apa yang bisa diperbaiki, bukan hanya siapa yang salah.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Satu pelajaran yang dicatat dapat menghemat banyak kesalahan berulang.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Hari yang biasa pun menyimpan sesuatu untuk dipelajari.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Perubahan lebih mudah terlihat ketika kamu mencatat prosesnya.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Luangkan waktu untuk memahami perasaan sebelum menilainya.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Tujuan besok lebih jelas ketika pengalaman hari ini direnungkan.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}, {"text": "Mengenali batas diri adalah bagian dari mengenali potensi diri.", "author": "SYSTEM RPG · Original Wisdom", "tag": "system"}]);

let currentOracleIndex = 0;

// Additional historical quotations; translations are labeled as adapted translations.
SYSTEM_QUOTES_CATALOG.push(
 {text:'The unexamined life is not worth living.',author:'Socrates (Plato, Apology)',tag:'system'},
 {text:'Well done is better than well said.',author:'Benjamin Franklin',tag:'system'},
 {text:'It is not that we have a short time to live, but that we waste a lot of it.',author:'Seneca (On the Shortness of Life, translation)',tag:'focus'},
 {text:'No man is free who is not master of himself.',author:'Epictetus (Discourses, translation)',tag:'system'},
 {text:'The impediment to action advances action. What stands in the way becomes the way.',author:'Marcus Aurelius (Meditations, translation)',tag:'recovery'},
 {text:'If you want to improve, be content to be thought foolish and stupid.',author:'Epictetus (Enchiridion, translation)',tag:'system'},
 {text:'The happiness of your life depends upon the quality of your thoughts.',author:'Marcus Aurelius (Meditations, traditional translation)',tag:'focus'},
 {text:'A journey of a thousand miles begins with a single step.',author:'Laozi (Tao Te Ching, translation)',tag:'system'}
);
function getAllQuotesPool() {
    const custom = (gameState.customQuotes || []).map(q => ({
        text: q.text,
        author: q.author,
        tag: 'custom'
    }));
    const base=SYSTEM_QUOTES_CATALOG.filter(q => q.author && !/SYSTEM RPG|Original Wisdom/i.test(q.author));
    const lang=typeof getCurrentLang==='function'?getCurrentLang():(localStorage.getItem('system_rpg_lang')||'id');
    const key=lang==='jp'?'ja':lang;
    const translations=V6_CONTENT_LOCALES.oracle[key];
    return [...custom,...base.map((q,i)=>({...q,text:translations?.[i]||q.text}))];
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
    currentOracleIndex = (currentOracleIndex + 1 + Math.floor(Math.random() * (pool.length - 1))) % pool.length;
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
            if (!parsed.activeDayThresholdPct) parsed.activeDayThresholdPct = parsed.streakThresholdPct;
            if (Array.isArray(parsed.quests)) {
                parsed.quests = parsed.quests.filter(q => q.category !== 'Recovery Quest');
            }
            if (typeof parsed.player.shields !== 'number') parsed.player.shields = 0;
            if (!Array.isArray(parsed.player.deathHistory)) parsed.player.deathHistory = [];
            parsed.player.deathHistory = parsed.player.deathHistory.filter(ts => Number.isFinite(Number(ts))).map(Number).filter(ts => ts > 0);
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
            if (Array.isArray(parsed.shop) && !parsed.shopRebalancedV2) {
                const rebalancedMap = {
                    s1: 250,
                    s_elixir: 650,
                    s2: 450,
                    s3: 850,
                    s4: 600
                };
                parsed.shop.forEach(item => {
                    if (rebalancedMap[item.id] !== undefined) {
                        item.cost = rebalancedMap[item.id];
                    }
                });
                const extraDefaultItems = [
                    {
                        id: 's_snack',
                        title: 'Snack / Camilan Favorit',
                        cost: 350,
                        type: 'reward',
                        desc: 'Reward ringan untuk mengapresiasi konsistensi harian.'
                    },
                    {
                        id: 's_cheatmeal',
                        title: 'Makan Enak / Cheat Meal Spesial',
                        cost: 1200,
                        type: 'reward',
                        desc: 'Hidangan spesial setelah disiplin menjaga pola makan & latihan.'
                    },
                    {
                        id: 's_restpass',
                        title: 'Half-Day Rest Pass (Santai Setengah Hari)',
                        cost: 1800,
                        type: 'reward',
                        desc: 'Waktu istirahat total untuk memulihkan fokus & energi mental.'
                    }
                ];
                extraDefaultItems.forEach(defItem => {
                    if (!parsed.shop.some(s => s.id === defItem.id)) {
                        parsed.shop.push(defItem);
                    }
                });
                parsed.shopRebalancedV2 = true;
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

// Pending daily reports are stored with the game state so an interrupted splash
// cannot silently consume a report or re-apply its HP penalty.
let dailyReportOpen = false;
function showPendingDailyReport() {
    if (!gameState || !gameState.pendingDailyReport || dailyReportOpen) return;
    const splash = document.getElementById('system-splash-screen');
    if (splash && splash.style.display !== 'none' && !splash.classList.contains('hidden') && !splash.classList.contains('is-hidden')) return;
    const report = gameState.pendingDailyReport;
    if (!document.getElementById('modal-system-msg')) return;
    dailyReportOpen = true;
    const rows = (report.days || []).map(day => {
        const state = day.status === 'protected' ? '🛡️ Shield' : day.status === 'completed' ? '✅' : '❌';
        return [day.date, `${day.done}/${day.total} (${day.pct}%) ${state} · -${day.damage} HP`, '📅'];
    });
    rows.push(['TOTAL HP LOST', `-${report.damage} HP`, '💔']);
    rows.push(['CURRENT HP', `${gameState.player.hp}/${gameState.player.maxHp}`, '❤️']);
    showSystemModal('📊 DAILY SYSTEM REPORT',
        `${report.days.length} hari dievaluasi. Penalti sudah diterapkan satu kali dan tidak akan dihitung ulang.`,
        null, {type:'daily', cards:rows, hint:'Tekan OK untuk menandai laporan telah dibaca.'});
}
function acknowledgeDailyReport() {
    if (!dailyReportOpen) return;
    dailyReportOpen = false;
    if (gameState && gameState.pendingDailyReport) {
        delete gameState.pendingDailyReport;
        saveState();
    }
}
function checkRealDayRollover() {
    // Calendar-based, idempotent settlement. All data stays local/offline.
    if (!gameState || !gameState.player || !Array.isArray(gameState.quests)) return;
    const today = formatDateKey(new Date());
    if (!gameState.history) gameState.history = { dailyCounts: {}, logs: [] };
    if (!gameState.history.evaluations) gameState.history.evaluations = {};
    let cursor = gameState.lastRealDate || gameState.selectedDate || today;
    if (cursor > today) return; // Device clock rolled back: never rewind or pay twice.
    if (cursor === today) {
        if (gameState.selectedDate !== today) { gameState.selectedDate = today; saveState(); renderAll(); }
        return;
    }
    const diff = Math.round((Date.UTC(+today.slice(0,4), +today.slice(5,7)-1, +today.slice(8)) - Date.UTC(+cursor.slice(0,4), +cursor.slice(5,7)-1, +cursor.slice(8))) / 86400000);
    if (diff <= 0) return;
    // Snapshot today's target was captured before midnight; old installs use existing target.
    const threshold = Number(gameState.activeDayThresholdPct) || getStreakThresholdPct();
    let settled = 0, protectedDays = 0, brokenDays = 0, totalDamage = 0;
    const dailyReportDays = [];
    for (let i = 0; i < Math.min(diff, 3660); i++) {
        const date = new Date(Date.UTC(+cursor.slice(0,4), +cursor.slice(5,7)-1, +cursor.slice(8)+i));
        const key = date.toISOString().slice(0,10);
        if (gameState.history.evaluations[key]) continue;
        const quests = i === 0 ? gameState.quests.filter(q => q.category === 'Daily Quest' && isQuestActiveOnDate(q,key)) : [];
        const done = quests.filter(q => q.completed).length;
        const total = quests.length;
        const pct = total ? Math.round(100*done/total) : 0;
        const met = total > 0 && pct >= threshold;
        const tier = evaluateDailyTier(total ? done/total : 0, gameState.player.maxHp);
        const damage = met ? tier.rawDamage : Math.max(1, Math.round(gameState.player.maxHp*(pct >= 50 ? .25 : .40)));
        let status = met ? 'completed' : 'broken';
        if (met) {
            // Quest handler already awarded today's streak when target was reached.
            if (gameState.lastStreakDate !== key) {
                gameState.player.streak = (gameState.player.streak || 0)+1;
                gameState.player.longestStreak = Math.max(gameState.player.longestStreak || 0, gameState.player.streak);
            }
            if (pct === 100) gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + tier.regenAmt);
        } else if ((gameState.player.shields || 0) > 0 && gameState.player.streak > 0) {
            gameState.player.shields -= 1;
            status = 'protected'; protectedDays++;
        } else {
            gameState.player.streak = 0;
            status = 'broken'; brokenDays++;
        }
        let appliedDamage = 0;
        if (damage > 0) {
            // Process once per date. takeDamage also honors existing mitigation/death rules.
            const result = takeDamage(damage, true);
            appliedDamage = result.mitigatedDamage || 0;
            totalDamage += appliedDamage;
        }
        dailyReportDays.push({date:key, done, total, pct, status, damage:appliedDamage});
        gameState.history.evaluations[key] = {dateStr:key, doneCount:done, totalDaily:total, pct, thresholdPct:threshold, streakStatus:status, evaluatedAt:new Date().toISOString(), automatic:true};
        settled++;
    }
    // Reset only after settlement, never before snapshotting yesterday.
    gameState.quests.forEach(q => { if(q.category === 'Daily Quest') { q.completed=false; if(q.trackingType === 'count') q.currentCount=0; delete q.lastReward; } });
    gameState.selectedDate = today;
    gameState.lastRealDate = today;
    gameState.lastStreakDate = null;
    gameState.activeDayThresholdPct = getStreakThresholdPct();
    if (dailyReportDays.length) {
        const previous = gameState.pendingDailyReport;
        const days = [...(previous && Array.isArray(previous.days) ? previous.days : []), ...dailyReportDays];
        gameState.pendingDailyReport = {days:days.slice(-3660), damage:days.reduce((n,d)=>n+(Number(d.damage)||0),0)};
    }
    saveState();
    renderAll();
    // The full persistent report appears after the fingerprint splash is dismissed.
    if (settled) setTimeout(showPendingDailyReport, 500);
}

function saveState() {
    try {
        gameState.muted = SoundFX.muted;
        gameState.ambientMode = SoundFX.ambientMode;
        const serialized = JSON.stringify(gameState);
        localStorage.setItem(STORAGE_KEY, serialized);

        // Silent Auto-Backup ke penyimpanan internal Android (tanpa popup/teks)
        if (window.AndroidBridge && typeof window.AndroidBridge.saveAutoBackup === 'function') {
            window.AndroidBridge.saveAutoBackup(serialized);
        }

       if (typeof syncHomeScreenWidget === 'function') {
            syncHomeScreenWidget();
        } else if (typeof syncAndroidHomeWidget === 'function') {
            syncAndroidHomeWidget();
        }
    } catch (e) {
        console.error('Gagal menyimpan state:', e);
    }
}

// Silent Auto-Restore saat halaman dimuat jika localStorage ter-reset
// Silent Auto-Restore saat halaman selesai dimuat jika localStorage ter-reset
function runSilentAutoRestore() {
    try {
        if (!window.AndroidBridge || typeof window.AndroidBridge.loadAutoBackup !== 'function') return;
        const currentLocal = localStorage.getItem(STORAGE_KEY);
        const backupStr = window.AndroidBridge.loadAutoBackup();
        if (!backupStr || backupStr.length < 20) return;

        let shouldRestore = !currentLocal;
        if (!shouldRestore) {
            try {
                const parsedLocal = JSON.parse(currentLocal);
                const parsedBackup = JSON.parse(backupStr);
                const localLvl = parsedLocal?.player?.level || 1;
                const backupLvl = parsedBackup?.player?.level || 1;
                const localLogs = parsedLocal?.history?.logs?.length || 0;
                const backupLogs = parsedBackup?.history?.logs?.length || 0;
                if (localLvl === 1 && localLogs === 0 && (backupLvl > 1 || backupLogs > 0)) {
                    shouldRestore = true;
                }
            } catch (_) {}
        }

        if (shouldRestore) {
            localStorage.setItem(STORAGE_KEY, backupStr);
            const restored = JSON.parse(backupStr);
            if (typeof gameState !== 'undefined' && restored && typeof restored === 'object') {
                Object.assign(gameState, restored);
                if (typeof renderAll === 'function') renderAll();
            }
        }
        if (typeof syncHomeScreenWidget === 'function') syncHomeScreenWidget();
    } catch (_) {}
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(runSilentAutoRestore, 150));
} else {
    setTimeout(runSilentAutoRestore, 150);
}
// ==========================================
// 4. CORE RPG CALCULATIONS & RANKING
// ==========================================
function getRequiredXP(level) {
    return Math.round(650 + 320 * Math.pow(level, 1.48));
}

function getTodayDailyXpEarned() {
    const todayKey = getCurrentGameDateKey();
    const logs = (gameState.history && Array.isArray(gameState.history.logs)) ? gameState.history.logs : [];
    return logs
        .filter(l => l.dateStr === todayKey && l.type === 'Daily Quest')
        .reduce((sum, l) => sum + (l.xp || 0), 0);
}

function getAverageStatLevel(statsObj) {
    const s = statsObj || (typeof gameState !== 'undefined' && gameState?.player?.stats) || { STR: 1, INT: 1, WIS: 1, CHR: 1 };
    const total = (s.STR || 1) + (s.INT || 1) + (s.WIS || 1) + (s.CHR || 1);
    return Math.floor(total / 4);
}

const RANKS_CATALOG = [
    {
        minLevel: 1,
        minAvgStat: 1,
        rankCode: 'E-RANK',
        name: 'Novice',
        title: 'E-Rank • Novice',
        perkText: 'Fase Awal Kebangkitan (Lv.1+ • Avg Stat Lv.1+)',
        style: 'color: #cbd5e1; background: rgba(51,65,85,0.45); border: 1px solid #475569;',
        accentColor: '#94a3b8'
    },
    {
        minLevel: 10,
        minAvgStat: 8,
        rankCode: 'D-RANK',
        name: 'Awakened',
        title: 'D-Rank • Awakened',
        perkText: 'Fondasi Kebiasaan Terbentuk (Lv.10+ • Avg Stat Lv.8+)',
        style: 'color: #60a5fa; background: rgba(37,99,235,0.22); border: 1px solid rgba(59,130,246,0.55);',
        accentColor: '#60a5fa'
    },
    {
        minLevel: 25,
        minAvgStat: 18,
        rankCode: 'C-RANK',
        name: 'Vanguard',
        title: 'C-Rank • Vanguard',
        perkText: 'Disiplin Konsisten & Penakluk Harian (Lv.25+ • Avg Stat Lv.18+)',
        style: 'color: #34d399; background: rgba(16,185,129,0.2); border: 1px solid rgba(16,185,129,0.5);',
        accentColor: '#34d399'
    },
    {
        minLevel: 45,
        minAvgStat: 32,
        rankCode: 'B-RANK',
        name: 'Strategist',
        title: 'B-Rank • Strategist',
        perkText: 'Penguasaan Sistem & Eksekusi Deep Work (Lv.45+ • Avg Stat Lv.32+)',
        style: 'color: #67e8f9; background: rgba(6,182,212,0.2); border: 1px solid rgba(6,182,212,0.55);',
        accentColor: '#22d3ee'
    },
    {
        minLevel: 70,
        minAvgStat: 50,
        rankCode: 'A-RANK',
        name: 'Commander',
        title: 'A-Rank • Commander',
        perkText: 'Elit Produktivitas & Ketahanan Mental Tinggi (Lv.70+ • Avg Stat Lv.50+)',
        style: 'color: #d8b4fe; background: rgba(168,85,247,0.22); border: 1px solid rgba(168,85,247,0.55);',
        accentColor: '#c084fc'
    },
    {
        minLevel: 90,
        minAvgStat: 70,
        rankCode: 'S-RANK',
        name: 'Sovereign',
        title: 'S-Rank • Sovereign',
        perkText: 'Hunter Kelas Atas (Lv.90+ • Avg Stat Lv.70+)',
        style: 'color: #fcd34d; background: rgba(245,158,11,0.22); border: 1px solid rgba(251,191,36,0.6); box-shadow: 0 0 10px rgba(251,191,36,0.25);',
        accentColor: '#fbbf24'
    },
    {
        minLevel: 100,
        minAvgStat: 85,
        rankCode: 'NATIONAL',
        name: 'Shadow Monarch',
        title: 'National • Shadow Monarch',
        perkText: 'Puncak Tertinggi Sistem (Lv.100 • Avg Stat Lv.85+)',
        style: 'color: #fda4af; background: linear-gradient(135deg, rgba(225,29,72,0.28), rgba(168,85,247,0.28)); border: 1px solid rgba(251,113,133,0.75); box-shadow: 0 0 14px rgba(244,63,94,0.35);',
        accentColor: '#fb7185'
    }
];

function getPlayerRank(level, statsObj = null) {
    const avgStat = getAverageStatLevel(statsObj);
    let current = RANKS_CATALOG[0];
    let next = null;
    for (let i = 0; i < RANKS_CATALOG.length; i++) {
        const tier = RANKS_CATALOG[i];
        if (level >= tier.minLevel && avgStat >= (tier.minAvgStat || 1)) {
            current = tier;
            next = RANKS_CATALOG[i + 1] || null;
        } else {
            next = tier;
            break;
        }
    }
    return { ...current, avgStat, next };
}

function openRankRoadmapModal() {
    SoundFX.playClick();
    const listEl = document.getElementById('rank-roadmap-list');
    if (!listEl) return;
    const curLvl = gameState.player.level;
    const avgStat = getAverageStatLevel(gameState.player.stats);
    const currentRank = getPlayerRank(curLvl, gameState.player.stats);

    listEl.innerHTML = RANKS_CATALOG.map((r) => {
        const reqLabel = `Lv.${r.minLevel} + Avg Stat ${r.minAvgStat}`;
        const isUnlocked = curLvl >= r.minLevel && avgStat >= r.minAvgStat;
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
                        ${reqLabel}
                    </span>
                </div>
                <p style="font-size: 11px; color: #cbd5e1; margin-top: 4px;">${r.perkText}</p>
                ${isCurrent ? `<span class="font-display" style="display: inline-block; margin-top: 4px; font-size: 9px; font-weight: 800; color: #34d399; text-transform: uppercase; letter-spacing: 0.06em;">★ RANK KAMU SAAT INI (AVG STAT: LV.${avgStat})</span>` : ''}
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
    return Math.max(60, Math.round(60 + statLevel * 40));
}

function getQuestStatXpGain(questOrCategory) {
    const cat = typeof questOrCategory === 'string' ? questOrCategory : (questOrCategory.category || 'Daily Quest');
    const baseXp = typeof questOrCategory === 'object' ? (questOrCategory.xp || 20) : 20;
    if (cat === 'Boss Fight') return 150;
    if (cat === 'Main Quest') return 80;
    if (baseXp >= 30) return 35;
    return 25;
}

function getStatTierInfo(maxStatVal, currentRankObj = null) {
    const rankLabel = currentRankObj ? currentRankObj.rankCode : 'HUNTER';
    const avgStat = getAverageStatLevel();
    if (maxStatVal < 25) return { cap: 25, tier: `${rankLabel} • Avg Lv.${avgStat}` };
    if (maxStatVal < 50) return { cap: 50, tier: `${rankLabel} • Avg Lv.${avgStat}` };
    if (maxStatVal < 75) return { cap: 75, tier: `${rankLabel} • Avg Lv.${avgStat}` };
    return { cap: MAX_STAT_LEVEL, tier: `${rankLabel} • Avg Lv.${avgStat}` };
}
function getStreakThresholdPct() {
    const val = Number(typeof gameState !== 'undefined' && gameState ? gameState.streakThresholdPct : 80);
    if (!Number.isFinite(val) || val < 10 || val > 100) return 80;
    return Math.round(val);
}

function getStreakThresholdRatio() {
    return (Number(gameState.activeDayThresholdPct) || getStreakThresholdPct()) / 100;
}

function v6UiLang(){try{const lang=window.__v6ActiveLanguage||document.documentElement.lang||localStorage.getItem('system_rpg_lang')||localStorage.getItem('sysrpg_lang')||(typeof gameState!=='undefined'&&gameState.language)||'id';return ['id','en','ja'].includes(lang)?lang:'id';}catch(_){return 'id';}}
function v6Text(id,en,ja){const l=v6UiLang();return l==='en'?en:l==='ja'?ja:id;}
function updateStreakThreshold(rawVal) {
    let num = Math.round(Number(rawVal));
    if (!Number.isFinite(num)) num = 80;
    num = Math.max(10, Math.min(100, num));
    gameState.streakThresholdPct = num;

    // Target baru berlaku besok; hari ini memakai snapshot yang dikunci.
    if (!gameState.activeDayThresholdPct) gameState.activeDayThresholdPct = getStreakThresholdPct();
    saveState();
    renderAll();
    syncSystemReminders();
    if (typeof SoundFX !== 'undefined' && SoundFX.playClick) SoundFX.playClick();
    spawnFloatingReward(v6Text(`🎯 Target streak ${num}% mulai besok; target hari ini tetap terkunci.`,`🎯 New streak target ${num}% starts tomorrow; today's target remains locked.`,`🎯 新しいストリーク目標${num}%は明日から適用。今日の目標は変更されません。`));
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

// Status locale strings: dynamic UI is rendered in the selected language, not translated from stale DOM.
function statusLocale() {
    const lang = (typeof gameState !== 'undefined' && gameState.language) ||
        localStorage.getItem('system_rpg_v6_language') || localStorage.getItem('system_rpg_language') || 'id';
    return ['id', 'en', 'ja'].includes(lang) ? lang : 'id';
}
function statusText(id, params = {}) {
    const dict = {
        rankNext: {id: 'Menuju {rank}: butuh Lv.{level} & Avg Stat {stat}', en: 'To {rank}: requires Lv.{level} & Avg Stat {stat}', ja: '{rank}まで：Lv.{level}・平均ステータス {stat} が必要'},
        rankMax: {id: '👑 PUNCAK TERTINGGI TERCAPAI (SHADOW MONARCH)', en: '👑 HIGHEST RANK REACHED (SHADOW MONARCH)', ja: '👑 最高ランク到達（シャドウモナーク）'},
        prime: {id: 'PRIMA (+10%)', en: 'PRIME (+10%)', ja: '絶好調 (+10%)'},
        critical: {id: 'SEKARAT (-25% EXP)', en: 'CRITICAL (-25% EXP)', ja: '瀕死 (-25% EXP)'},
        tired: {id: 'LELAH (-10% EXP)', en: 'TIRED (-10% EXP)', ja: '疲労 (-10% EXP)'},
        stable: {id: 'STABIL (1.0x)', en: 'STABLE (1.0x)', ja: '安定 (1.0x)'},
        today: {id: 'Hari Ini', en: 'Today', ja: '今日'},
        completed: {id: '{count} Selesai', en: '{count} Completed', ja: '{count}件完了'},
        allHistory: {id: 'Semua Riwayat ({count})', en: 'All History ({count})', ja: 'すべての履歴 ({count})'},
        dateHistory: {id: 'Riwayat {date} ({count})', en: 'History {date} ({count})', ja: '{date} の履歴 ({count})'},
        filterDate: {id: 'Filter Tanggal Ini', en: 'Filter This Date', ja: 'この日付で絞り込む'},
        viewAll: {id: 'Lihat Semua', en: 'View All', ja: 'すべて表示'},
        noQuests: {id: 'Tidak ada misi selesai pada tanggal {date}.', en: 'No quests completed on {date}.', ja: '{date} に完了したクエストはありません。'},
        dailyTarget: {id: 'Daily Habit (Target Streak ≥ {pct}%)', en: 'Daily Habit (Streak Target ≥ {pct}%)', ja: '毎日の習慣（ストリーク目標 ≥ {pct}%）'},
        autoDescription: {
            id: 'Pergantian hari dan evaluasi streak berjalan otomatis mengikuti kalender HP. Target harian dikunci sampai besok. Target aman minimal {pct}% Daily Quest selesai. Jika kurang dari target tersebut, HP berkurang & Streak reset (kecuali ada Shield)!',
            en: 'Day changes and streak evaluations run automatically based on your device calendar. Today’s target is locked until tomorrow. Complete at least {pct}% of Daily Quests to stay safe. Below that, HP decreases and the Streak resets (unless you have a Shield)!',
            ja: '日付の切り替えとストリークの判定は端末のカレンダーに合わせて自動で行われます。今日の目標は翌日まで変更できません。デイリークエストを最低 {pct}% 達成すると安全です。未達成の場合、シールドがなければHPが減少し、ストリークがリセットされます！'
        },
        autoSub: {id: '日付', en: 'Quests reset automatically when the date changes. Daily reports are saved in History; journaling is optional.', ja: '日付が変わるとクエストは自動的にリセットされます。日次レポートは履歴に保存され、日記の記入は任意です。'},
        autoTitle: {id: 'AUTO DAY ACTIVE', en: 'AUTO DAY ACTIVE', ja: '自動日付更新：有効'}
    };
    const lang = statusLocale();
    return (dict[id]?.[lang] || dict[id]?.id || id).replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? ''));
}
function updateStatusLocaleNodes() {
    const description = document.getElementById('v6-auto-day-description');
    const pct = typeof getStreakThresholdPct === 'function' ? getStreakThresholdPct() : 80;
    if (description) description.textContent = statusText('autoDescription', {pct});
    const sub = document.getElementById('v6-auto-day-subtext');
    if (sub) sub.textContent = statusLocale() === 'id' ? 'Quest direset otomatis saat tanggal berubah. Laporan harian tersimpan di History; jurnal tetap opsional.' : statusText('autoSub');
    const title = document.getElementById('v6-auto-day-title');
    if (title) title.textContent = statusText('autoTitle');
}

function getHpCondition() {
    syncPlayerMaxHp();
    const ratio = gameState.player.maxHp > 0 ? (gameState.player.hp / gameState.player.maxHp) : 1;
    if (ratio >= getStreakThresholdRatio()) {
        return {
            label: statusText('prime'),
            xpMod: 0.10,
            goldMod: 0.10,
            style: 'background: rgba(16,185,129,0.18); color: #34d399; border: 1px solid rgba(16,185,129,0.45);'
        };
    }
    if (ratio < 0.25) {
        return {
            label: statusText('critical'),
            xpMod: -0.25,
            goldMod: -0.20,
            style: 'background: rgba(225,29,72,0.28); color: #fecdd3; border: 1px solid rgba(244,63,94,0.75); box-shadow: 0 0 8px rgba(244,63,94,0.25);'
        };
    }
    if (ratio < 0.50) {
        return {
            label: statusText('tired'),
            xpMod: -0.10,
            goldMod: -0.10,
            style: 'background: rgba(245,158,11,0.20); color: #fcd34d; border: 1px solid rgba(245,158,11,0.50);'
        };
    }
    return {
        label: statusText('stable'),
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

function ensureRpgExtendedState() {
    if (!gameState.penaltyQuest || typeof gameState.penaltyQuest !== 'object') {
        gameState.penaltyQuest = {
            active: false,
            progress: 0,
            targetCount: 2,
            rewardHp: 25,
            rewardGold: 15
        };
    } else {
        gameState.penaltyQuest.active = Boolean(gameState.penaltyQuest.active);
        gameState.penaltyQuest.progress = Math.max(0, Number(gameState.penaltyQuest.progress) || 0);
        gameState.penaltyQuest.targetCount = Math.max(1, Number(gameState.penaltyQuest.targetCount) || 2);
        gameState.penaltyQuest.rewardHp = Math.max(1, Number(gameState.penaltyQuest.rewardHp) || 25);
        gameState.penaltyQuest.rewardGold = Math.max(0, Number(gameState.penaltyQuest.rewardGold) || 15);
    }

    if (!gameState.dailyCombo || typeof gameState.dailyCombo !== 'object') {
        gameState.dailyCombo = {
            dateKey: getCurrentGameDateKey(),
            count: 0
        };
    } else {
        gameState.dailyCombo.count = Math.max(0, Number(gameState.dailyCombo.count) || 0);
    }
}

function assignPenaltyQuestOnDeath() {
    ensureRpgExtendedState();
    const maxHp = Math.max(50, Number(gameState.player.maxHp) || 100);
    const healAmt = Math.max(20, Math.round(maxHp * 0.25));
    gameState.penaltyQuest = {
        active: true,
        progress: 0,
        targetCount: 2,
        rewardHp: healAmt,
        rewardGold: 15
    };
}

function advancePenaltyQuestProgress() {
    ensureRpgExtendedState();
    const pq = gameState.penaltyQuest;
    if (!pq.active) return null;

    pq.progress += 1;
    if (pq.progress >= pq.targetCount) {
        const rewardHp = pq.rewardHp;
        const rewardGold = pq.rewardGold;
        gameState.player.hp = Math.min(gameState.player.maxHp, (gameState.player.hp || 0) + rewardHp);
        gameState.player.gold = (gameState.player.gold || 0) + rewardGold;
        pq.active = false;
        pq.progress = 0;
        return { completed: true, rewardHp, rewardGold };
    }
    return { completed: false, progress: pq.progress, targetCount: pq.targetCount };
}

function getDailyComboBonus() {
    ensureRpgExtendedState();
    const todayKey = getCurrentGameDateKey();
    const dc = gameState.dailyCombo;
    const count = (dc && dc.dateKey === todayKey) ? (dc.count || 0) : 0;

    if (count >= 6) return { count, mult: 0.25, label: `${count}x OVERDRIVE (+25% XP)` };
    if (count >= 4) return { count, mult: 0.15, label: `${count}x COMBO (+15% XP)` };
    if (count >= 2) return { count, mult: 0.08, label: `${count}x STREAK (+8% XP)` };
    return { count, mult: 0, label: '' };
}

function getPenaltyQuestBannerHtml() {
    ensureRpgExtendedState();
    const pq = gameState.penaltyQuest;
    if (!pq || !pq.active) return '';
    const cur = pq.progress || 0;
    const target = pq.targetCount || 2;
    return `
        <div style="margin-bottom: 0.75rem; padding: 0.65rem 0.8rem; border-radius: 0.75rem; background: rgba(225,29,72,0.16); border: 1px solid rgba(244,63,94,0.65); box-shadow: 0 0 12px rgba(244,63,94,0.2);">
            <div class="flex items-center justify-between gap-2">
                <span class="font-display" style="font-size: 0.78rem; font-weight: 800; color: #fda4af; letter-spacing: 0.04em;">⚠️ PENALTY ZONE AKTIF</span>
                <span class="font-display" style="font-size: 0.75rem; font-weight: 800; color: #fecdd3;">${cur}/${target} QUEST</span>
            </div>
            <p style="font-size: 11px; color: #ffe4e6; margin-top: 3px;">
                Selesaikan ${target} Daily Quest untuk keluar dari Penalty Zone, pulih hingga +${pq.rewardHp} HP & +${pq.rewardGold} Gold.
            </p>
        </div>
    `;
}

function renderPenaltyQuestBanner() {
    const el = document.getElementById('penalty-quest-banner');
    if (!el) return;
    el.innerHTML = getPenaltyQuestBannerHtml();
}

function renderDailyComboBadge() {
    const box = document.getElementById('daily-combo-badge');
    const lbl = document.getElementById('daily-combo-label');
    if (!box || !lbl) return;
    const combo = typeof getDailyComboBonus === 'function' ? getDailyComboBonus() : { count: 0, label: '' };
    if (combo.count >= 2 && combo.label) {
        box.style.display = 'flex';
        box.classList.remove('hidden');
        lbl.textContent = combo.label;
    } else {
        box.style.display = 'none';
        box.classList.add('hidden');
    }
}

function takeDamage(amount, suppressDeathModal = false) {
    const rawDamage = Number(amount);
    if (!Number.isFinite(rawDamage) || rawDamage <= 0) {
        return { mitigatedDamage: 0, deathReport: null };
    }

    SoundFX.playDamage();
    syncPlayerMaxHp();
    ensureRpgExtendedState();

    const { wisDmgReduce } = getAttributePassives();
    const safeReduction = Math.min(0.9, Math.max(0, Number(wisDmgReduce) || 0));
    const mitigatedDamage = Math.max(1, Math.round(rawDamage * (1 - safeReduction)));
    const hpBeforeDamage = Math.max(0, Number(gameState.player.hp) || 0);
    gameState.player.hp = Math.max(0, hpBeforeDamage - mitigatedDamage);
    spawnFloatingReward(`⚠️ -${mitigatedDamage} HP!${mitigatedDamage < rawDamage ? ` (WIS menahan ${Math.round(rawDamage - mitigatedDamage)} HP)` : ''}`);

    let deathReport = null;
    if (gameState.player.hp <= 0) {
        const now = Date.now();
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        const history = Array.isArray(gameState.player.deathHistory) ? gameState.player.deathHistory : [];
        const recentDeaths = history.map(Number).filter(ts => Number.isFinite(ts) && ts > now - sevenDaysMs && ts <= now);
        recentDeaths.push(now);
        gameState.player.deathHistory = recentDeaths;

        const deathCount7d = recentDeaths.length;
        const goldPenaltyRate = deathCount7d === 1 ? 0.10 : deathCount7d === 2 ? 0.20 : 0.30;
        const xpPenaltyRate = deathCount7d === 1 ? 0 : deathCount7d === 2 ? 0.05 : 0.10;
        const prevLevel = Math.max(1, Number(gameState.player.level) || 1);
        const prevXp = Math.max(0, Number(gameState.player.xp) || 0);
        const prevGold = Math.max(0, Number(gameState.player.gold) || 0);
        const prevStreak = Math.max(0, Number(gameState.player.streak) || 0);
        const lostGold = Math.min(prevGold, Math.floor(prevGold * goldPenaltyRate));
        const lostXp = Math.min(prevXp, Math.floor(prevXp * xpPenaltyRate));

        // Death never lowers the Hunter's level or rank: only current-level XP progress is reduced.
        gameState.player.gold = Math.max(0, prevGold - lostGold);
        gameState.player.xp = Math.max(0, prevXp - lostXp);
        if (deathCount7d >= 3 && prevStreak > 0) {
            gameState.player.streak = Math.max(0, prevStreak - 1);
            if (gameState.player.streak === 0) gameState.lastStreakDate = null;
        }

        const maxHp = Math.max(1, Number(gameState.player.maxHp) || 100);
        gameState.player.hp = Math.max(1, Math.round(maxHp * 0.30));
        const penaltyWasActive = Boolean(gameState.penaltyQuest && gameState.penaltyQuest.active);
        if (!penaltyWasActive) assignPenaltyQuestOnDeath();

        const penaltyHealAmt = Math.max(20, Math.round(maxHp * 0.25));
        const streakLost = deathCount7d >= 3 ? Math.min(1, prevStreak) : 0;
        deathReport = {
            repeatKnockout: false,
            deathCount7d,
            goldPenaltyRate,
            xpPenaltyRate,
            lostGold,
            remainingGold: gameState.player.gold,
            prevGold,
            lostXp,
            remainingXp: gameState.player.xp,
            prevXp,
            level: prevLevel,
            prevLevel,
            newLevel: prevLevel,
            levelLost: 0,
            prevStreak,
            newStreak: gameState.player.streak,
            streakLost,
            revivedHp: gameState.player.hp,
            maxHp,
            penaltyQuestProgress: gameState.penaltyQuest.progress || 0,
            penaltyQuestTarget: gameState.penaltyQuest.targetCount || 2,
            penaltyQuestWasActive: penaltyWasActive,
            summaryText: `Kematian ke-${deathCount7d} dalam 7 hari. Gold -${Math.round(goldPenaltyRate * 100)}% (-${lostGold} G), EXP -${Math.round(xpPenaltyRate * 100)}% (-${lostXp}), Rank dan Level tetap. ${streakLost ? `Streak berkurang ${streakLost} hari. ` : ''}Bangkit dengan ${gameState.player.hp}/${maxHp} HP.`
        };

        if (!suppressDeathModal) {
            showSystemModal(
                'YOU DIED // RESURRECTION',
                'Vitality mencapai 0. Sistem mencatat kematian dan menerapkan penalti bertahap.',
                deathReport
            );
        }
    }

    saveState();
    renderAll();
    return { mitigatedDamage, deathReport };
}
// ==========================================
// 5. UI RENDERING FUNCTIONS
// ==========================================
function renderAll() {
    renderOracle();
    renderStatus();
    if (typeof renderPenaltyQuestBanner === 'function') renderPenaltyQuestBanner();
    if (typeof renderDailyComboBadge === 'function') renderDailyComboBadge();
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
            const lvlPct = Math.min(1, p.level / Math.max(1, rank.next.minLevel));
            const statPct = Math.min(1, rank.avgStat / Math.max(1, rank.next.minAvgStat));
            const pctRank = Math.min(99, Math.max(8, Math.round(((lvlPct + statPct) / 2) * 100)));
            rankNextLabel.textContent = statusText('rankNext', {rank:rank.next.rankCode, level:rank.next.minLevel, stat:rank.next.minAvgStat});
            rankTargetLvl.textContent = `Lv.${p.level}/${rank.next.minLevel} • Stat ${rank.avgStat}/${rank.next.minAvgStat}`;
            rankProgBar.style.width = `${pctRank}%`;
        } else {
            rankNextLabel.textContent = statusText('rankMax');
            rankTargetLvl.textContent = `Lv.${p.level} • Avg Stat ${rank.avgStat}`;
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
    const tierInfo = getStatTierInfo(maxCurrentStat, rank);
    const scaleBadge = document.getElementById('stat-scale-badge');
    if (scaleBadge) {
        scaleBadge.textContent = tierInfo.tier;
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
    const totalTitlesEl = document.getElementById('total-titles-count');
    if (titleNameEl) titleNameEl.textContent = activeTitle.name;
    if (unlockedCountEl) unlockedCountEl.textContent = unlockedCount;
    if (totalTitlesEl) totalTitlesEl.textContent = TITLES_CATALOG.length;
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

    const activeDateStr = gameState.selectedHistoryDate || getCurrentGameDateKey();
    const todayStr = formatDateKey(new Date());
    const dailyCounts = gameState.history?.dailyCounts || {};
    const logs = gameState.history?.logs || [];

    if (datePickerEl) datePickerEl.value = activeDateStr;
    if (dateLabelEl) {
        dateLabelEl.textContent = activeDateStr === todayStr 
            ? `${formatReadableDate(activeDateStr)} (${statusText('today')})` 
            : formatReadableDate(activeDateStr);
    }

    const totalDone = Object.values(dailyCounts).reduce((acc, val) => acc + (Number(val) || 0), 0);
    totalBadgeEl.textContent = statusText('completed', {count:totalDone});

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
            ? statusText('allHistory', {count:logs.length}) 
            : statusText('dateHistory', {date:activeDateStr, count:displayedLogs.length});
    }
    if (toggleAllBtn) {
        toggleAllBtn.textContent = showAllHistoryLogs ? statusText('filterDate') : statusText('viewAll');
    }

    logListEl.innerHTML = '';
    const journals = (gameState.history?.journals || []).filter(j => showAllHistoryLogs || j.dateStr === activeDateStr);
    if (displayedLogs.length === 0 && journals.length === 0 && !Object.keys((()=>{try{return JSON.parse(localStorage.getItem("system_rpg_v6_journal")||"{}")}catch(_){return {}}})()).some(day => showAllHistoryLogs || day === activeDateStr)) {
        logListEl.innerHTML = `<p style="font-size: 0.75rem; color: #64748b; text-align: center; padding: 0.75rem 0;">${statusText('noQuests', {date:activeDateStr})}</p>`;
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

    // Full Hunter Journal is independent of the short Habit Tracker journal.
    // Read-only here: browsing history must never change the active game day.
    try {
        const hunterEntries = JSON.parse(localStorage.getItem('system_rpg_v6_journal') || '{}');
        const selectedEntries = Object.entries(hunterEntries)
            .filter(([day]) => showAllHistoryLogs || day === activeDateStr)
            .sort(([a],[b]) => b.localeCompare(a));
        const lang = typeof v6UiLang === 'function' ? v6UiLang() : 'id';
        const translations = {
            id: ['📓 HUNTER JOURNAL', 'Hal baik hari ini', 'Refleksi singkat', 'Harapan besok', 'Catatan lama', 'Buka jurnal lengkap'],
            en: ['📓 HUNTER JOURNAL', 'Good things today', 'Short reflection', 'Tomorrow’s intention', 'Older notes', 'Open full journal'],
            ja: ['📓 ハンター日記', '今日のよかったこと', '短い振り返り', '明日の目標', '以前の記録', '日記をすべて開く']
        };
        const t = translations[lang] || translations.id;
        selectedEntries.forEach(([day, j]) => {
            const card = document.createElement('div');
            card.style.cssText = 'background:rgba(8,47,73,.38);border:1px solid rgba(34,211,238,.4);border-radius:.75rem;padding:.75rem;margin-bottom:.5rem;overflow-wrap:anywhere';
            const mood = {'Very Happy':'🤩','Happy':'😊','Neutral':'😐','Sad':'😔','Stressed':'😣'}[j.mood] || '📖';
            const lines = [[t[1],j.good],[t[2],j.improve],[t[3],j.tomorrow],['Activities',j.activities],['Achievements',j.achievements]]
                .filter(([,value]) => value && String(value).trim());
            const heading = document.createElement('div');
            heading.style.cssText='color:#67e8f9;font-size:12px;font-weight:700;margin-bottom:8px';
            heading.textContent=`${mood} ${t[0]} · ${day}`;
            card.appendChild(heading);
            lines.forEach(([label,value])=>{
                const labelNode=document.createElement('div');labelNode.style.cssText='color:#c4b5fd;font-size:11px;font-weight:700;margin-top:8px';labelNode.textContent=label;
                const contentNode=document.createElement('p');contentNode.style.cssText='color:#e2e8f0;font-size:12px;line-height:1.65;white-space:pre-wrap;margin:3px 0';contentNode.textContent=String(value);
                card.append(labelNode,contentNode);
            });
            const open=document.createElement('button');open.type='button';open.textContent=t[5]+' →';
            open.style.cssText='margin-top:10px;color:#67e8f9;font-size:12px;text-decoration:underline';
            open.onclick=()=>{if(typeof V6!=='undefined'&&V6.openJournalAt)V6.openJournalAt(day);};
            card.appendChild(open);logListEl.appendChild(card);
        });
    } catch (error) { console.warn('Journal history could not be loaded',error); }

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
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return;
    gameState.selectedHistoryDate = dateStr;
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

// Quest ordering is stored in the existing gameState.quests array.
// Reordering changes positions only; XP, rewards, and completion remain untouched.
function questOrderVisibleIds() {
    return Array.from(document.querySelectorAll('#quest-list [data-quest-order-id]'))
        .map(el => el.dataset.questOrderId);
}
function moveQuestInOrder(fromId, toId) {
    if (!fromId || !toId || fromId === toId) return;
    const quests = gameState.quests;
    const from = quests.findIndex(q => String(q.id) === String(fromId));
    const to = quests.findIndex(q => String(q.id) === String(toId));
    if (from < 0 || to < 0) return;
    const [item] = quests.splice(from, 1);
    quests.splice(to, 0, item);
    saveState();
    renderQuests();
}
// Long-press quest sorting: live DOM reordering, commit only on release.
const questSort = {timer:null, active:false, pointerId:null, card:null, origin:null,
    startX:0,startY:0,x:0,y:0,raf:0, suppressUntil:0, moved:false};
function questSortClearTimer() {
    if (questSort.timer) clearTimeout(questSort.timer);
    questSort.timer = null;
}
function questSortStart(event) {
    if (event.button !== undefined && event.button !== 0) return;
    if (questSort.active || questSort.timer) return;
    if (event.target.closest('button, input, textarea, select, a, [contenteditable="true"]')) return;
    const card = event.target.closest('[data-quest-order-id]');
    if (!card || !card.closest('#quest-list')) return;
    questSort.pointerId = event.pointerId;
    questSort.card = card;
    questSort.origin = questOrderVisibleIds();
    questSort.startX = questSort.x = event.clientX;
    questSort.startY = questSort.y = event.clientY;
    questSort.moved = false;
    questSort.timer = setTimeout(() => {
        questSort.timer = null;
        if (!questSort.card || !questSort.card.isConnected) return;
        questSort.active = true;
        questSort.card.style.cssText += ';position:relative;z-index:25;box-shadow:0 10px 30px rgba(34,211,238,.28);border-color:#22d3ee;transform:scale(1.018);transition:transform .14s ease, box-shadow .14s ease;';
        questSort.card.style.touchAction = 'none';
        document.body.style.userSelect = 'none';
        try {
            if (window.AndroidBridge && typeof window.AndroidBridge.vibrate === 'function') window.AndroidBridge.vibrate(25);
            else if (navigator.vibrate) navigator.vibrate(25);
        } catch (_) {}
        questSort.raf = requestAnimationFrame(questSortAutoScroll);
    }, 350);
}
function questSortMove(event) {
    if (questSort.pointerId !== event.pointerId || !questSort.card) return;
    questSort.x = event.clientX;
    questSort.y = event.clientY;
    if (!questSort.active) {
        if (Math.hypot(questSort.x-questSort.startX,questSort.y-questSort.startY)>9) questSortAbort(false);
        return;
    }
    if (event.cancelable) event.preventDefault();
    questSort.moved = true;
    questSortReposition();
}
function questSortReposition() {
    if (!questSort.active || !questSort.card) return;
    const container = document.getElementById('quest-list');
    if (!container) return;
    const siblings = [...container.querySelectorAll('[data-quest-order-id]')].filter(el => el!==questSort.card);
    for (const sibling of siblings) {
        const rect=sibling.getBoundingClientRect();
        const midpoint=rect.top+rect.height/2;
        if (questSort.y < midpoint) {
            if (questSort.card.nextElementSibling!==sibling) container.insertBefore(questSort.card,sibling);
            return;
        }
    }
    if (siblings.length && container.lastElementChild!==questSort.card) container.appendChild(questSort.card);
}
function questSortAutoScroll() {
    if (!questSort.active) return;
    const edge=75, y=questSort.y, h=window.innerHeight;
    const speed=y<edge ? -Math.min(16,(edge-y)/edge*16) : y>h-edge ? Math.min(16,(y-(h-edge))/edge*16) : 0;
    if (speed) {
        const candidates=[...document.querySelectorAll('*')].filter(el=>{
            if (!el.contains(questSort.card)) return false;
            const st=getComputedStyle(el), overflow=st.overflowY;
            return (overflow==='auto'||overflow==='scroll') && el.scrollHeight>el.clientHeight+2;
        });
        const scrollBox=candidates[0];
        if (scrollBox) scrollBox.scrollTop+=speed;
        else window.scrollBy(0,speed);
        questSortReposition();
    }
    questSort.raf=requestAnimationFrame(questSortAutoScroll);
}
function questSortFinish(event) {
    if (event.pointerId!==questSort.pointerId) return;
    if (!questSort.active) { questSortAbort(false); return; }
    const ordered=questOrderVisibleIds();
    const original=questSort.origin || [];
    const changed=ordered.length===original.length && ordered.some((id,i)=>id!==original[i]);
    questSort.suppressUntil=Date.now()+500;
    questSortAbort(false);
    if (!changed) return;
    // Preserve filtered-out quests in their original slots; never change quest data.
    const visible=new Set(original);
    let next=0;
    gameState.quests=gameState.quests.map(q=>visible.has(String(q.id))
        ? gameState.quests.find(x=>String(x.id)===ordered[next++]) : q);
    saveState();
    renderQuests();
}
function questSortAbort(restore) {
    questSortClearTimer();
    if (questSort.raf) cancelAnimationFrame(questSort.raf);
    questSort.raf=0;
    if (restore && questSort.active && questSort.origin) {
        const list=document.getElementById('quest-list');
        if (list) for (const id of questSort.origin) {
            const el=[...list.querySelectorAll('[data-quest-order-id]')].find(x=>x.dataset.questOrderId===id);
            if (el) list.appendChild(el);
        }
    }
    if (questSort.card && questSort.active) {
        questSort.card.style.removeProperty('position');
        questSort.card.style.removeProperty('z-index');
        questSort.card.style.removeProperty('box-shadow');
        questSort.card.style.removeProperty('transform');
        questSort.card.style.removeProperty('transition');
        questSort.card.style.removeProperty('touch-action');
    }
    document.body.style.removeProperty('user-select');
    questSort.active=false;questSort.card=null;questSort.origin=null;questSort.pointerId=null;
}
// Android WebView: stop native page scrolling only after long-press has activated.
document.addEventListener('touchmove', event => {
    if (questSort.active && event.cancelable) event.preventDefault();
}, {passive:false, capture:true});
document.addEventListener('pointermove',questSortMove,{passive:false});
document.addEventListener('pointerup',questSortFinish);
document.addEventListener('pointercancel',()=>questSortAbort(true));
window.addEventListener('blur',()=>questSortAbort(true));
document.addEventListener('click',event=>{
    if (Date.now()<questSort.suppressUntil && event.target.closest('#quest-list')) {
        event.preventDefault();event.stopImmediatePropagation();
    }
},true);

function renderQuests() {
    const container = document.getElementById('quest-list');
    container.innerHTML = '';

    const dailyQuests = gameState.quests.filter(q => q.category === 'Daily Quest' && isQuestActiveOnDate(q, getCurrentGameDateKey()));
    const doneDailyCount = dailyQuests.filter(q => q.completed).length;
    const totalDailyCount = dailyQuests.length;

    const targetPct = getStreakThresholdPct();
    const dailyHeaderEl = document.getElementById('daily-target-header');
    if (dailyHeaderEl) {
        dailyHeaderEl.textContent = statusText('dailyTarget', {pct:targetPct});
    }
    const evalLabelEl = document.getElementById('eval-threshold-label');
    if (evalLabelEl) {
        evalLabelEl.textContent = `${targetPct}% Daily Quest`;
    }
    updateStatusLocaleNodes();
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
        ; // Manual quest order: do not auto-move completed quests

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
        card.dataset.questOrderId = String(q.id);
        card.addEventListener('pointerdown', questSortStart, {passive:true});
        card.addEventListener('contextmenu', event => { if (questSort.active) event.preventDefault(); });
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

        // Penalty Quest hanya dihitung dari Daily Quest yang benar-benar diselesaikan.
        // Hook ini sebelumnya belum dipanggil, sehingga progress penalty tidak pernah bertambah.
        if (q.category === 'Daily Quest') {
            const penaltyProgress = advancePenaltyQuestProgress();
            if (penaltyProgress?.completed) {
                SoundFX.playQuestComplete();
                spawnFloatingReward(`🛡️ PENALTY CLEARED! +${penaltyProgress.rewardHp} HP & +${penaltyProgress.rewardGold} Gold`);
            } else if (penaltyProgress) {
                spawnFloatingReward(`⚠️ PENALTY QUEST: ${penaltyProgress.progress}/${penaltyProgress.targetCount} Daily Quest`);
            }
        }

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
            const logIdx = gameState.history.logs.findIndex(l => l.questId === q.id && l.dateStr === todayKey);
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

const V6_SHOP_TRANSLATIONS={
 s1:{en:'Restores 25% of maximum HP instantly.',ja:'最大HPの25%を即座に回復します。'},
 s_elixir:{en:'Fully restores HP (100% of maximum HP) in an emergency.',ja:'緊急時にHPを最大値まで全回復します。'},
 s3:{en:'Automatically protects your streak on a missed day (maximum 2 in inventory).',ja:'未達成の日にストリークを自動保護します（所持上限2個）。'},
 s_snack:{en:'A small reward for celebrating daily consistency.',ja:'毎日の継続をねぎらう小さなご褒美。'},
 s2:{en:'A real-life treat to refresh your mind.',ja:'気分転換のための現実のご褒美。'},
 s4:{en:'Enjoy one hour of gaming as a personal reward.',ja:'自分へのご褒美としてゲームを1時間楽しめます。'}
};
function v6ShopDescription(item){
 const l=v6UiLang(),t=V6_SHOP_TRANSLATIONS[item.id];
 if(!t||l==='id')return item.desc||'Reward Kustom';
 // Only translate original default items, not user-edited descriptions.
 const defaults={s1:'Memulihkan 25% Max HP secara instan.',s_elixir:'Memulihkan HP hingga penuh (100% Max HP) dalam kondisi darurat.',s3:'Otomatis menahan Streak saat terlewat (Maksimal stok 2 di inventori).',s_snack:'Reward ringan untuk mengapresiasi konsistensi harian.',s2:'Reward dunia nyata untuk menyegarkan pikiran.',s4:'Reward untuk menikmati waktu bermain game tanpa rasa bersalah.'};
 if(item.desc!==defaults[item.id])return item.desc||'';
 return t[l]||item.desc;
}
function renderShop() {
    const container = document.getElementById('shop-list');
    container.innerHTML = '';

    // Update status & label harga tombol Gacha (150 Gold)
    const gachaBtn = document.getElementById('btn-open-gacha');
    if (gachaBtn) {
        const canGacha = gameState.player.gold >= 150;
        gachaBtn.style.opacity = canGacha ? '1' : '0.55';
        if (gachaBtn.innerHTML.includes('100')) {
            gachaBtn.innerHTML = gachaBtn.innerHTML.replace(/100/g, '150');
        }
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
                    <p style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${escapeHtml(v6ShopDescription(item))}</p>
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
// MYSTERY CHEST GACHA SYSTEM (150 GOLD)
// ==========================================
function openMysteryGacha() {
    const GACHA_COST = 150;
    if (gameState.player.gold < GACHA_COST) {
        SoundFX.playDamage();
        spawnFloatingReward('⚠️ Gold tidak cukup! Butuh 150 Gold.');
        return;
    }

    // Potong 150 Gold langsung
    gameState.player.gold -= GACHA_COST;
    SoundFX.playClick();
    saveState();
    renderStatus();

    const card = document.getElementById('gacha-modal-card');
    const badge = document.getElementById('gacha-rarity-badge');
    const icon = document.getElementById('gacha-chest-icon');
    const titleEl = document.getElementById('gacha-reward-title');
    const descEl = document.getElementById('gacha-reward-desc');
    const closeBtn = document.getElementById('btn-close-gacha');

    card.style.borderColor = '#c084fc';
    card.style.boxShadow = '0 0 20px rgba(168,85,247,0.35)';
    badge.textContent = 'SYSTEM GACHA • 150G';
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
        const subRoll = Math.random();

        let rarity = 'COMMON';
        let rarityStyle = 'background: rgba(100,116,139,0.25); color: #cbd5e1; border: 1px solid #64748b;';
        let borderCol = '#94a3b8';
        let glowShadow = '0 0 18px rgba(148,163,184,0.28)';
        let emoji = '📦';
        let rewardTitle = '';
        let rewardDesc = '';
        let logEffect = '';

        if (roll < 5) {
            // 5% LEGENDARY JACKPOT (2 Variasi Drop)
            rarity = '★ LEGENDARY JACKPOT (5%) ★';
            rarityStyle = 'background: rgba(245,158,11,0.25); color: #fcd34d; border: 1px solid #fbbf24;';
            borderCol = '#fbbf24';
            glowShadow = '0 0 28px rgba(251,191,36,0.55)';
            if (subRoll < 0.5) {
                emoji = '👑';
                gameState.player.gold += 500;
                gameState.player.hp = gameState.player.maxHp;
                addRewards(250, 0, randStat, 60, true);
                rewardTitle = '+500 GOLD + FULL HP + 250 XP!';
                rewardDesc = `Jackpot Tertinggi! HP pulih penuh (${gameState.player.maxHp}/${gameState.player.maxHp}) & +60 ${randStat} XP.`;
                logEffect = `Legendary: +500G, Full HP, +250XP, +60 ${randStat}`;
            } else {
                emoji = '🐉';
                const gotShield = (gameState.player.shields || 0) < 2;
                if (gotShield) gameState.player.shields = (gameState.player.shields || 0) + 1;
                else gameState.player.gold += 350;
                addRewards(300, 0, randStat, 80, true);
                rewardTitle = gotShield ? '+1 SHIELD + 300 XP + 80 STAT XP!' : '+350 GOLD + 300 XP + 80 STAT XP!';
                rewardDesc = gotShield
                    ? `Berkah Monarch! +1 Streak Shield (${gameState.player.shields}/2), +300 XP & +80 ${randStat} XP.`
                    : `Berkah Monarch! Stok Shield penuh, dikonversi jadi +350 Gold, +300 XP & +80 ${randStat} XP.`;
                logEffect = `Legendary: ${gotShield ? '+1 Shield' : '+350G'}, +300XP, +80 ${randStat}`;
            }
            SoundFX.playLevelUp();
        } else if (roll < 20) {
            // 15% EPIC (3 Variasi Drop)
            rarity = '✦ EPIC REWARD (15%) ✦';
            rarityStyle = 'background: rgba(168,85,247,0.25); color: #e9d5ff; border: 1px solid #c084fc;';
            borderCol = '#c084fc';
            glowShadow = '0 0 24px rgba(192,132,252,0.45)';
            if (subRoll < 0.34) {
                emoji = '🛡️';
                if ((gameState.player.shields || 0) < 2) {
                    gameState.player.shields = (gameState.player.shields || 0) + 1;
                    addRewards(120, 0, 'WIS', 40, true);
                    rewardTitle = '+1 STREAK SHIELD & +120 XP!';
                    rewardDesc = `Pelindung Streak ditambahkan (Stok: ${gameState.player.shields}/2) +40 WIS XP.`;
                    logEffect = 'Epic: +1 Streak Shield, +120 XP, +40 WIS';
                } else {
                    gameState.player.gold += 280;
                    addRewards(120, 0, 'WIS', 40, true);
                    rewardTitle = '+280 GOLD & +120 XP!';
                    rewardDesc = 'Stok Shield penuh (2/2), dikonversi menjadi +280 Gold & +120 XP!';
                    logEffect = 'Epic: +280 Gold & +120 XP';
                }
            } else if (subRoll < 0.67) {
                emoji = '🔮';
                ['STR', 'INT', 'WIS', 'CHR'].forEach(st => addRewards(0, 0, st, 35, true));
                addRewards(150, 0, null, 0, true);
                rewardTitle = 'ALL STATS BLESSING (+35 XP SEMUA)!';
                rewardDesc = 'Keempat atribut (STR, INT, WIS, CHR) masing-masing mendapat +35 Stat XP & +150 Hunter XP!';
                logEffect = 'Epic: +35 All Stats XP & +150 XP';
            } else {
                emoji = '💰';
                gameState.player.gold += 300;
                addRewards(90, 0, 'CHR', 35, true);
                rewardTitle = '+300 GOLD & +90 XP!';
                rewardDesc = 'Harta karun tersembunyi! Profit bersih +150 Gold & +35 CHR XP.';
                logEffect = 'Epic: +300 Gold, +90 XP, +35 CHR';
            }
            SoundFX.playCritical();
        } else if (roll < 50) {
            // 30% RARE (3 Variasi Drop)
            rarity = '◆ RARE REWARD (30%) ◆';
            rarityStyle = 'background: rgba(6,182,212,0.22); color: #67e8f9; border: 1px solid #22d3ee;';
            borderCol = '#22d3ee';
            glowShadow = '0 0 20px rgba(34,211,238,0.4)';
            if (subRoll < 0.34) {
                emoji = '📘';
                addRewards(180, 0, randStat, 50, true);
                rewardTitle = `+180 XP & +50 ${randStat} XP!`;
                rewardDesc = `Grimoire Langka! Lonjakan pengalaman besar untuk Level Hunter dan atribut ${randStat}.`;
                logEffect = `Rare: +180 XP & +50 ${randStat} XP`;
            } else if (subRoll < 0.67) {
                emoji = '💎';
                gameState.player.gold += 210;
                addRewards(60, 0, randStat, 30, true);
                rewardTitle = '+210 GOLD & +60 XP!';
                rewardDesc = `Profit bersih +60 Gold beserta tambahan +30 ${randStat} XP!`;
                logEffect = `Rare: +210 Gold & +60 XP`;
            } else {
                emoji = '💖';
                const healAmt = Math.max(15, Math.round(gameState.player.maxHp * 0.50));
                const oldHp = gameState.player.hp;
                gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + healAmt);
                const healed = gameState.player.hp - oldHp;
                addRewards(120, 0, 'STR', 35, true);
                rewardTitle = `+${healed > 0 ? healed : healAmt} HP & +120 XP!`;
                rewardDesc = `Vitality Surge (+50% Max HP) ke ${gameState.player.hp}/${gameState.player.maxHp} HP +35 STR XP.`;
                logEffect = `Rare: +${healed} HP, +120 XP, +35 STR`;
            }
            SoundFX.playQuestComplete();
        } else {
            // 50% COMMON (3 Variasi Drop)
            rarity = '• COMMON SUPPLY (50%) •';
            if (subRoll < 0.35) {
                emoji = '⚡';
                addRewards(95, 0, randStat, 30, true);
                rewardTitle = `+95 XP & +30 ${randStat} XP!`;
                rewardDesc = `Suplai energi harian untuk mempercepat progres level & atribut ${randStat}.`;
                logEffect = `Common: +95 XP & +30 ${randStat} XP`;
            } else if (subRoll < 0.70) {
                emoji = '🪙';
                gameState.player.gold += 120;
                addRewards(50, 0, 'CHR', 20, true);
                rewardTitle = '+120 GOLD & +50 XP!';
                rewardDesc = 'Cashback 120 Gold + bonus +50 XP & +20 CHR XP.';
                logEffect = 'Common: +120 Gold & +50 XP';
            } else {
                emoji = '🧪';
                const healAmt = Math.max(10, Math.round(gameState.player.maxHp * 0.25));
                const oldHp = gameState.player.hp;
                gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + healAmt);
                const healed = gameState.player.hp - oldHp;
                addRewards(80, 0, 'STR', 25, true);
                rewardTitle = `+${healed > 0 ? healed : healAmt} HP & +80 XP!`;
                rewardDesc = `Vitality dipulihkan ke ${gameState.player.hp}/${gameState.player.maxHp} HP +80 XP & +25 STR XP.`;
                logEffect = `Common: +${healed} HP & +80 XP`;
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
    if (isDungeonRunning || document.getElementById('sysrpg-dungeon-entry-warning')) return;
    SoundFX.playClick();
    const lang = getReminderLang();
    const copy = {
        id: ['⚠️ PERINGATAN DUNGEON', 'Keluar sebelum timer selesai menyebabkan penalti dasar -10 HP (dapat berkurang oleh pasif WIS), dan seluruh hadiah sesi ini hangus. Lanjut masuk?', 'Batal', 'Masuk Dungeon'],
        en: ['⚠️ DUNGEON WARNING', 'Leaving before the timer finishes causes a base -10 HP penalty (reduced by WIS passive) and forfeits all session rewards. Enter?', 'Cancel', 'Enter Dungeon'],
        ja: ['⚠️ ダンジョン警告', 'タイマー終了前に退出すると基本10 HPのペナルティ（WISの軽減あり）を受け、報酬を失います。入場しますか？', 'キャンセル', '入場する']
    }[lang] || [];
    const modal = document.createElement('div');
    modal.id = 'sysrpg-dungeon-entry-warning';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', copy[0]);
    modal.style.cssText = 'position:fixed;inset:0;z-index:1000000;background:rgba(2,6,23,.84);display:flex;align-items:center;justify-content:center;padding:16px;';
    modal.innerHTML = `<div style="width:min(100%,410px);padding:20px;border:1px solid #fb7185;background:#0f172a;border-radius:16px;color:#f8fafc;box-shadow:0 0 30px #be123c44;"><h3 style="color:#fda4af;font-weight:800;margin:0 0 12px;">${copy[0]}</h3><p style="line-height:1.6;font-size:13px;">${copy[1]}</p><div style="display:flex;gap:10px;justify-content:end;margin-top:20px;"><button id="sysrpg-dungeon-entry-cancel" style="background:#334155;color:#fff;padding:10px;border-radius:9px;">${copy[2]}</button><button id="sysrpg-dungeon-entry-confirm" style="background:#be123c;color:#fff;font-weight:800;padding:10px;border-radius:9px;">${copy[3]}</button></div></div>`;
    document.body.appendChild(modal);
    modal.querySelector('#sysrpg-dungeon-entry-cancel').onclick = () => modal.remove();
    modal.querySelector('#sysrpg-dungeon-entry-confirm').onclick = () => {
        modal.remove();
        beginDungeonSession();
    };
}

function beginDungeonSession() {
    if (isDungeonRunning) return;
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

let isDungeonConfirmOpen = false;

function getDungeonWarningDict(minsLeft, secsLeft) {
    const lang = typeof getReminderLang === 'function'
        ? getReminderLang()
        : ((typeof gameState !== 'undefined' && gameState.language) || localStorage.getItem('system_rpg_lang') || 'id');

    const dicts = {
        id: {
            title: 'PERINGATAN SISTEM // DUNGEON',
            desc: `Sisa waktu fokusmu masih <strong style="color: #22d3ee;">${minsLeft}:${secsLeft}</strong>. Apakah kamu yakin ingin berhenti dan keluar dari Dungeon sekarang?`,
            penalty: `⚡ Konsekuensi: Kamu akan kehilangan <strong style="color: #fb7185;">-10 HP</strong> dan seluruh reward XP & Gold sesi ini hangus.`,
            btnKeep: '⚔️ TETAP LANJUT FOKUS',
            btnQuit: '🚪 YA, BERHENTI & KELUAR (-10 HP)',
            failTitle: 'DUNGEON FAILED',
            failBody: 'Kamu kabur dari Dungeon sebelum waktunya habis. Sistem memberikan penalti -10 HP!'
        },
        en: {
            title: 'SYSTEM WARNING // DUNGEON',
            desc: `You still have <strong style="color: #22d3ee;">${minsLeft}:${secsLeft}</strong> of focus time remaining. Are you sure you want to stop and exit the Dungeon now?`,
            penalty: `⚡ Consequence: You will lose <strong style="color: #fb7185;">-10 HP</strong> and forfeit all XP & Gold rewards for this session.`,
            btnKeep: '⚔️ KEEP FOCUSING',
            btnQuit: '🚪 YES, STOP & EXIT (-10 HP)',
            failTitle: 'DUNGEON FAILED',
            failBody: 'You fled the Dungeon before time ran out. The System issued a -10 HP penalty!'
        },
        ja: {
            title: 'システム警告 // ダンジョン',
            desc: `残り集中時間はあと <strong style="color: #22d3ee;">${minsLeft}:${secsLeft}</strong> です。本当に今すぐ中断してダンジョンから退出しますか？`,
            penalty: `⚡ ペナルティ：<strong style="color: #fb7185;">-10 HP</strong> を失い、今回のセッションのXPおよびゴールド報酬はすべて無効になります。`,
            btnKeep: '⚔️ 集中を続ける',
            btnQuit: '🚪 はい、中断して退出する (-10 HP)',
            failTitle: 'DUNGEON FAILED',
            failBody: '制限時間終了前にダンジョンから逃走しました。システムにより -10 HP のペナルティが科されました！'
        }
    };

    return dicts[lang] || dicts.id;
}

function abortDungeon() {
    if (!isDungeonRunning || isDungeonConfirmOpen) return;
    if (typeof SoundFX !== 'undefined' && SoundFX.playClick) SoundFX.playClick();

    // Jeda sementara hitungan mundur saat modal konfirmasi terbuka
    isDungeonConfirmOpen = true;
    clearInterval(dungeonInterval);
    const pausedRemainingSec = dungeonRemainingSec;

    // Hapus modal lama jika masih ada
    const oldModal = document.getElementById('sysrpg-dungeon-confirm-modal');
    if (oldModal) oldModal.remove();

    const minsLeft = Math.floor(pausedRemainingSec / 60).toString().padStart(2, '0');
    const secsLeft = (pausedRemainingSec % 60).toString().padStart(2, '0');
    const txt = getDungeonWarningDict(minsLeft, secsLeft);

    const modal = document.createElement('div');
    modal.id = 'sysrpg-dungeon-confirm-modal';
    modal.style.cssText = `
        position: fixed; inset: 0; z-index: 999998;
        background: rgba(2, 6, 23, 0.85); backdrop-filter: blur(6px);
        display: flex; align-items: center; justify-content: center;
        padding: 1rem; animation: fadeIn 0.2s ease;
    `;

    modal.innerHTML = `
        <div style="width: 100%; max-width: 340px; background: linear-gradient(145deg, #0f172a, #020617); border: 1px solid rgba(244, 63, 94, 0.55); border-radius: 1rem; padding: 1.25rem; box-shadow: 0 0 28px rgba(244, 63, 94, 0.25);">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 0.65rem;">
                <span style="font-size: 1.25rem;">⚠️</span>
                <h3 class="font-display" style="font-size: 0.9rem; font-weight: 800; color: #fb7185; letter-spacing: 0.05em; margin: 0;">
                    ${txt.title}
                </h3>
            </div>
            <p style="font-size: 0.8rem; color: #e2e8f0; line-height: 1.5; margin-bottom: 0.6rem;">
                ${txt.desc}
            </p>
            <div style="background: rgba(244, 63, 94, 0.12); border: 1px solid rgba(244, 63, 94, 0.35); border-radius: 0.6rem; padding: 0.55rem 0.7rem; margin-bottom: 1rem; font-size: 0.72rem; color: #fda4af;">
                ${txt.penalty}
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <button type="button" id="btn-dungeon-keep-going" class="font-display"
                    style="width: 100%; padding: 0.65rem; border-radius: 0.65rem; font-size: 0.78rem; font-weight: 800; background: linear-gradient(135deg, #06b6d4, #3b82f6); color: #020617; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(6, 182, 212, 0.35);">
                    ${txt.btnKeep}
                </button>
                <button type="button" id="btn-dungeon-confirm-quit" class="font-display"
                    style="width: 100%; padding: 0.55rem; border-radius: 0.65rem; font-size: 0.72rem; font-weight: 700; background: rgba(244, 63, 94, 0.14); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.45); cursor: pointer;">
                    ${txt.btnQuit}
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Opsi 1: Tetap lanjut fokus -> lanjutkan timer dari detik terakhir
    document.getElementById('btn-dungeon-keep-going').onclick = () => {
        if (typeof SoundFX !== 'undefined' && SoundFX.playClick) SoundFX.playClick();
        modal.remove();
        isDungeonConfirmOpen = false;
        if (!isDungeonRunning) return;

        dungeonEndTimeMs = Date.now() + (pausedRemainingSec * 1000);
        dungeonInterval = setInterval(() => {
            dungeonRemainingSec = Math.max(0, Math.ceil((dungeonEndTimeMs - Date.now()) / 1000));
            updateDungeonTimerUI();

            if (dungeonRemainingSec <= 0) {
                completeDungeon();
            }
        }, 500);
    };

    // Opsi 2: Ya, berhenti -> eksekusi keluar & penalti HP
    document.getElementById('btn-dungeon-confirm-quit').onclick = () => {
        modal.remove();
        isDungeonConfirmOpen = false;
        executeDungeonAbort();
    };
}

function executeDungeonAbort() {
    if (!isDungeonRunning) return;
    clearInterval(dungeonInterval);
    isDungeonRunning = false;

    ScreenWakeManager.disable();
    SoundFX.stopAmbient();

    // Tahan modal kematian agar tidak ditimpa oleh pesan DUNGEON FAILED.
    // Sebelumnya takeDamage() dapat membuka YOU DIED, lalu showSystemModal()
    // di bawah langsung menggantinya sehingga Hunter tampak respawn tanpa laporan.
    const damageResult = takeDamage(10, true);
    resetDungeonUI();

    const txt = getDungeonWarningDict('00', '00');
    if (damageResult && damageResult.deathReport) {
        showSystemModal(
            'YOU DIED // DUNGEON FAILED',
            `${txt.failBody} Damage -${damageResult.mitigatedDamage} HP membuat Vitality mencapai 0. Sistem telah menjatuhkan penalti dan membangkitkan Hunter dalam kondisi kritis.`,
            damageResult.deathReport
        );
    } else {
        showSystemModal(txt.failTitle, txt.failBody);
    }
}
// Proteksi tambahan jika pengguna mencoba menutup/refresh browser saat Dungeon berjalan
window.addEventListener('beforeunload', (e) => {
    if (isDungeonRunning) {
        e.preventDefault();
        e.returnValue = '';
    }
});

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

function getDayAdvanceBlockedMessage() {
    const lang = (typeof gameState !== 'undefined' && gameState.language) ||
        localStorage.getItem('system_rpg_lang') || document.documentElement.lang || 'id';
    const messages = {
        id: 'Tanggal yang dipilih bukan hari aktif yang bisa dievaluasi. Pilih hari aktif; HP dan progres tetap aman.',
        en: 'The selected date is not the active day eligible for evaluation. Select the active day; your HP and progress remain safe.',
        ja: '選択した日付は評価できるアクティブな日付ではありません。アクティブな日付を選択してください。HPと進行状況は保持されます。'
    };
    return messages[String(lang).slice(0, 2)] || messages.id;
}

function canAdvancePastRealDate() {
    const key = getCurrentGameDateKey();
    return key === gameState.lastRealDate && !(gameState.history?.evaluations || {})[key];
}
function advanceEvaluatedDay() {
    spawnFloatingReward("Hari berganti otomatis mengikuti kalender."); return;
    const key = getCurrentGameDateKey();
    if (key !== gameState.lastRealDate || !(gameState.history?.evaluations || {})[key]) {
        spawnFloatingReward('Evaluasi hari aktif terlebih dahulu sebelum Next Day.'); return;
    }
    gameState.quests.forEach(q => {
        if (q.category === 'Daily Quest') {
            q.completed = false;
            if (q.trackingType === 'count') q.currentCount = 0;
            delete q.lastReward;
        }
    });
    const next = parseDateKey(key); next.setDate(next.getDate()+1);
    gameState.selectedDate = formatDateKey(next);
    gameState.lastRealDate = gameState.selectedDate;
    saveState(); renderAll();
    spawnFloatingReward('Hari game berikutnya dimulai!');
}

function simulateNextDay() {
    spawnFloatingReward("Hari berganti otomatis; lihat Daily Report di History."); return;
    SoundFX.playClick();
    if (!canAdvancePastRealDate()) {
        spawnFloatingReward(getDayAdvanceBlockedMessage());
        return;
    }
    const gEl = document.getElementById('journal-gratitude');
    const iEl = document.getElementById('journal-improve');
    if (gEl) gEl.value = '';
    if (iEl) iEl.value = '';
    openModal('modal-daily-journal');
}

function confirmJournalAndAdvance(saveJournal) {
    const currentKey = getCurrentGameDateKey();
    // Re-check before any journal reward, quest reset, date change, or HP penalty.
    if (!canAdvancePastRealDate()) {
        spawnFloatingReward(getDayAdvanceBlockedMessage());
        return;
    }
    closeModal('modal-daily-journal');

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

    // Snapshot recorded before effects, preventing duplicate evaluation.
    if (!gameState.history.evaluations) gameState.history.evaluations = {};
    gameState.history.evaluations[currentKey] = {dateStr:currentKey, doneCount, totalDaily, pct, evaluatedAt:new Date().toISOString()};
    const nextDateKey = currentKey; // Keep game date until explicit Next Day.

    syncPlayerMaxHp();
    const tier = evaluateDailyTier(ratio, gameState.player.maxHp);

   if (tier.rawDamage > 0) {
        let streakStatusText = '';
        let streakIcon = '🔥';
        if (tier.resetStreak) {
            if ((gameState.player.shields || 0) > 0 && gameState.player.streak > 0) {
                gameState.player.shields -= 1;
                streakStatusText = `Ditahan Shield (${gameState.player.streak} hr • Sisa: ${gameState.player.shields})`;
                streakIcon = '🛡️';
            } else {
                const oldStreak = gameState.player.streak;
                gameState.player.streak = 0;
                gameState.lastStreakDate = null;
                streakStatusText = oldStreak > 0 ? `${oldStreak} → 0 Hari (Reset)` : '0 Hari';
                streakIcon = '💔';
            }
        } else {
            streakStatusText = `${gameState.player.streak} Hari (Aman ≥${getStreakThresholdPct()}%)`;
        }

        const damageResult = takeDamage(tier.rawDamage, true);
        const actualDmg = damageResult.mitigatedDamage;

        if (damageResult.deathReport) {
            showSystemModal(
                `YOU DIED // ${tier.rank.toUpperCase()}`,
                `Progres Daily Quest (${currentKey}) hanya ${pct}% (${doneCount}/${totalDaily}). Penalti -${actualDmg} HP menyebabkan Hunter KO!`,
                damageResult.deathReport
            );
        } else {
            showSystemModal(
                `EVALUASI HARIAN // ${tier.rank.toUpperCase()}`,
                `Laporan evaluasi harian untuk tanggal ${currentKey} telah dicatat oleh Sistem.`,
                null,
                {
                    type: 'penalty',
                    cards: [
                        ['DAILY QUEST', `${doneCount}/${totalDaily} (${pct}%)`, '📋'],
                        ['RANK HARIAN', tier.rank.toUpperCase(), '⚔️'],
                        ['PENALTI HP', `-${actualDmg} HP (${Math.round(tier.penaltyRate * 100)}%)`, '🩸'],
                        ['SISA HP', `${gameState.player.hp}/${gameState.player.maxHp}`, '❤️'],
                        ['STATUS STREAK', streakStatusText, streakIcon],
                        ['STATUS HARI', 'Sudah dievaluasi • Klik Next Day', '📅']
                    ],
                    hint: pct < getStreakThresholdPct()
                        ? `Target minimal ${getStreakThresholdPct()}% tidak tercapai. Tingkatkan konsistensi besok!`
                        : `Streak tetap terjaga (≥${getStreakThresholdPct()}%), selesaikan 100% untuk bonus Regen HP.`
                }
            );
        }
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
            'EVALUASI HARIAN // S-RANK PERFECT!',
            `Luar biasa! Seluruh misi harian pada ${currentKey} berhasil diselesaikan tanpa celah.`,
            null,
            {
                type: 'perfect',
                cards: [
                    ['DAILY QUEST', `${doneCount}/${totalDaily} (100%)`, '✅'],
                    ['RANK HARIAN', 'S-RANK CLEAR', '👑'],
                    ['PEMULIHAN HP', healAmt > 0 ? `+${healAmt} HP (+15%)` : 'HP Sudah Penuh', '💚'],
                    ['TOTAL HP', `${gameState.player.hp}/${gameState.player.maxHp}`, '❤️'],
                    ['STREAK AKTIF', `${gameState.player.streak} Hari (+1)`, '🔥'],
                    ['STATUS HARI', 'Sudah dievaluasi • Klik Next Day', '📅']
                ],
                hint: 'PERFECT CLEAR • Pertahankan rekor streak untuk membuka Title & bonus EXP!'
            }
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
    const confirmInput = document.getElementById('reset-confirm-input');
    if (confirmInput) confirmInput.value = '';
    openModal('modal-reset');
}

function confirmResetData() {
    const confirmInput = document.getElementById('reset-confirm-input');
    if (!confirmInput || confirmInput.value.trim().toUpperCase() !== 'RESET') {
        spawnFloatingReward('⚠️ Ketik RESET untuk mengonfirmasi penghapusan seluruh progres.');
        if (confirmInput) confirmInput.focus();
        return;
    }
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
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.style.color = '#22d3ee';
    }

    // Reset posisi scroll ke paling atas setiap kali berpindah tab
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const mainWrap = document.querySelector('main');
    if (mainWrap) mainWrap.scrollTop = 0;
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

function playDeathCinematic(onComplete) {
    const existing = document.getElementById('death-cinematic-overlay');
    if (existing) existing.remove();
    const overlay = document.createElement('div');
    overlay.id = 'death-cinematic-overlay';
    overlay.className = 'death-cinematic-overlay';
    overlay.innerHTML = `
        <div class="death-cinematic-vignette"></div>
        <div class="death-cinematic-content">
            <div class="death-cinematic-kicker">SYSTEM ALERT // VITALITY CRITICAL</div>
            <div class="death-cinematic-main">YOU DIED</div>
            <div class="death-cinematic-sub">YOUR SOUL IS LEAVING THE BODY</div>
            <div class="death-cinematic-resurrect">✦ RESURRECTION IN PROGRESS ✦</div>
        </div>`;
    document.body.appendChild(overlay);
    try { if (navigator.vibrate) navigator.vibrate([90, 50, 180]); } catch (_) {}
    window.setTimeout(() => {
        overlay.classList.add('is-resurrecting');
    }, 1250);
    window.setTimeout(() => {
        overlay.classList.add('is-fading');
        window.setTimeout(() => {
            overlay.remove();
            if (typeof onComplete === 'function') onComplete();
        }, 350);
    }, 2250);
}

function showSystemModal(title, body, deathReport = null, evalReport = null) {
    const titleEl = document.getElementById('sys-msg-title');
    const bodyEl = document.getElementById('sys-msg-body');
    const detailEl = document.getElementById('sys-msg-details');
    const iconEl = document.getElementById('sys-msg-icon');
    const cardEl = document.getElementById('sys-msg-card');
    if (titleEl) titleEl.textContent = title;
    if (bodyEl) bodyEl.textContent = body;

    if (detailEl) {
        if (deathReport) {
            const deathCount = Math.max(1, Number(deathReport.deathCount7d) || 1);
            const cards = [
                ['KEMATIAN / 7 HARI', `${deathCount}x`, '☠️'],
                ['GOLD DIPOTONG', `-${Math.round((deathReport.goldPenaltyRate || 0) * 100)}% (-${deathReport.lostGold} G)`, '🪙'],
                ['SISA GOLD', `${deathReport.remainingGold} G`, '💰'],
                ['EXP DIPOTONG', `-${Math.round((deathReport.xpPenaltyRate || 0) * 100)}% (-${deathReport.lostXp} XP)`, '✦'],
                ['SISA EXP', `${deathReport.remainingXp} XP`, '✨'],
                ['LEVEL / RANK', `Lv.${deathReport.level} (AMAN)`, '🛡️'],
                ['STREAK', deathReport.streakLost ? `${deathReport.prevStreak} → ${deathReport.newStreak} (-1)` : `${deathReport.newStreak} hari (aman)`, '🔥'],
                ['HP KEBANGKITAN', `${deathReport.revivedHp}/${deathReport.maxHp}`, '❤️']
            ];
            detailEl.innerHTML = cards.map(([label, value, icon]) => `<div class="death-stat-card"><span class="death-stat-icon">${icon}</span><span class="death-stat-label">${label}</span><strong>${value}</strong></div>`).join('');
            detailEl.classList.remove('hidden');
            if (iconEl) { iconEl.textContent = '☠'; iconEl.style.background = 'rgba(127,29,29,.45)'; iconEl.style.borderColor = '#f87171'; }
            if (cardEl) { cardEl.style.borderColor = '#ef4444'; cardEl.style.boxShadow = '0 0 35px rgba(239,68,68,.16)'; }
            const hint = document.getElementById('sys-msg-hint');
            if (hint) hint.textContent = deathReport.penaltyQuestWasActive ? `PENALTY ZONE AKTIF • Progres ${deathReport.penaltyQuestProgress}/${deathReport.penaltyQuestTarget} tetap tersimpan.` : 'PENALTY ZONE AKTIF • Selesaikan 2 Daily Quest untuk memulihkan HP dan mendapat Gold.';
        } else if (evalReport && Array.isArray(evalReport.cards)) {
            const isPerfect = evalReport.type === 'perfect';
            detailEl.innerHTML = evalReport.cards.map(([label, value, icon]) => `<div class="death-stat-card"><span class="death-stat-icon">${icon}</span><span class="death-stat-label">${label}</span><strong>${value}</strong></div>`).join('');
            detailEl.classList.remove('hidden');
            if (iconEl) {
                iconEl.textContent = isPerfect ? '👑' : '📊';
                iconEl.style.background = isPerfect ? 'rgba(16,185,129,.22)' : 'rgba(245,158,11,.22)';
                iconEl.style.borderColor = isPerfect ? '#34d399' : '#fbbf24';
            }
            if (cardEl) {
                cardEl.style.borderColor = isPerfect ? '#10b981' : '#f59e0b';
                cardEl.style.boxShadow = isPerfect ? '0 0 35px rgba(16,185,129,.18)' : '0 0 35px rgba(245,158,11,.15)';
            }
            const hint = document.getElementById('sys-msg-hint');
            if (hint) hint.textContent = evalReport.hint || '';
        } else {
            detailEl.innerHTML = '';
            detailEl.classList.add('hidden');
            if (iconEl) { iconEl.textContent = 'ⓘ'; iconEl.style.background = 'rgba(6,182,212,.18)'; iconEl.style.borderColor = '#22d3ee'; }
            if (cardEl) { cardEl.style.borderColor = '#475569'; cardEl.style.boxShadow = ''; }
            const hint = document.getElementById('sys-msg-hint');
            if (hint) hint.textContent = '';
        }
    }
    if (deathReport) playDeathCinematic(() => openModal('modal-system-msg'));
    else openModal('modal-system-msg');
}

function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
    if (id === 'modal-system-msg') acknowledgeDailyReport();
    SoundFX.playClick();
    document.getElementById(id).classList.add('hidden');
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ==========================================
// Health, Death & Shield Guide: strictly mirrors evaluateDailyTier, takeDamage, and rollover.
const HUNTER_HEALTH_GUIDE = {
    id: {
        summary: 'Aturan HP, penalti, Shield, kematian dan respawn', open: 'Baca Panduan →', close: 'Tutup',
        title: 'HUNTER SURVIVAL GUIDE',
        sections: [
            ['🩸 Kerusakan HP Harian', [
                'Evaluasi otomatis ketika tanggal lokal berganti. Penyelesaian 100% (S): 0 damage dan pulih +15% Max HP (dibatasi Max HP).',
                'Mencapai target streak harian tetapi di bawah 100% (A): penalti dasar 10% Max HP.',
                'Menyelesaikan 50% hingga di bawah target harian (B): penalti dasar 25% Max HP.',
                'Menyelesaikan di bawah 50% (F): penalti dasar 40% Max HP.',
                'Hari yang terlewat diproses satu kali per tanggal saat aplikasi dibuka lagi. Jika target tidak terpenuhi, Shield dapat melindungi streak, tetapi bukan HP.'
            ]],
            ['⚔️ Dungeon & Pengurangan Damage', [
                'Menyelesaikan timer Dungeon: tidak ada penalti HP; reward XP dan Gold diperoleh.',
                'Menyerah sebelum timer habis: damage dasar 10 HP dan reward sesi hangus.',
                'Pasif atribut WIS mengurangi damage sebelum HP dikurangi (maksimal pengurangan 90%, minimal 1 HP).'
            ]],
            ['🛡️ Shield & Pemulihan', [
                'Streak Shield/Freeze otomatis digunakan hanya saat target harian gagal dan streak masih aktif. Stok maksimal 2. Shield tidak meniadakan penalti HP.',
                'Potion/Elixir di Shop dan penyelesaian Penalty Quest bisa memulihkan HP; pemulihan tidak melebihi Max HP.'
            ]],
            ['☠️ Jika HP Mencapai Nol', [
                'HP 0 menyebabkan YOU DIED. Dalam 7 hari: kematian pertama mengurangi 10% Gold dan 0% XP; kedua 20% Gold dan 5% XP; ketiga dan seterusnya 30% Gold dan 10% XP.',
                'Pada kematian ketiga atau berikutnya dalam 7 hari, streak berkurang 1 jika ada. Level dan Rank tidak turun.',
                'Hunter bangkit otomatis dengan 30% Max HP (minimal 1 HP). Penalty Quest: selesaikan 2 Daily Quest untuk pemulihan sekitar 25% Max HP (minimal 20 HP) dan +15 Gold.'
            ]]
        ]
    },
    en: {
        summary: 'HP damage, penalties, Shields, death and revival', open: 'Read Guide →', close: 'Close',
        title: 'HUNTER SURVIVAL GUIDE',
        sections: [
            ['🩸 Daily HP Damage', [
                'Automatic evaluation runs when the local date changes. 100% completion (S): 0 damage and +15% Max HP healing (capped at Max HP).',
                'Reaching your streak threshold but below 100% (A): base damage of 10% Max HP.',
                '50% completion but below the target (B): base damage of 25% Max HP.',
                'Below 50% completion (F): base damage of 40% Max HP.',
                'Missed days settle once per date when you return. Shields may protect the streak, but not HP.'
            ]],
            ['⚔️ Dungeon & Mitigation', [
                'Finishing the Dungeon timer causes no HP penalty and awards XP/Gold.',
                'Aborting early causes a base 10 HP penalty and forfeits the session rewards.',
                'WIS passive reduces incoming damage (up to 90% reduction, minimum 1 HP).'
            ]],
            ['🛡️ Shields & Healing', [
                'Streak Shield/Freeze is used automatically when the daily target is missed and you still have a streak. Maximum stock: 2. It does not prevent HP damage.',
                'Shop potions/elixirs and Penalty Quest completion heal HP, without exceeding Max HP.'
            ]],
            ['☠️ When HP Reaches Zero', [
                'At 0 HP, YOU DIED triggers. Deaths within 7 days: first loses 10% Gold and 0% XP; second 20% Gold and 5% XP; third+ 30% Gold and 10% XP.',
                'On the third or later death within 7 days, lose 1 streak day if any. Level and Rank remain unchanged.',
                'Revive automatically with 30% Max HP (minimum 1 HP). The Penalty Quest requires 2 Daily Quests to earn roughly 25% Max HP healing (at least 20 HP) and +15 Gold.'
            ]]
        ]
    },
    ja: {
        summary: 'HPダメージ・ペナルティ・シールド・復活のルール', open: 'ガイドを読む →', close: '閉じる',
        title: 'ハンター生存ガイド',
        sections: [
            ['🩸 毎日のHPダメージ', [
                '日付が変わると自動評価されます。達成率100%（S）：ダメージなし、最大HPの15%を回復（上限あり）。',
                '設定した目標以上・100%未満（A）：最大HPの10%を基本ダメージとして受けます。',
                '達成率50%以上・目標未満（B）：最大HPの25%を基本ダメージとして受けます。',
                '達成率50%未満（F）：最大HPの40%を基本ダメージとして受けます。',
                '未確認の日は次回起動時に1日につき一度だけ評価されます。シールドは連続記録のみ保護し、HPダメージは防ぎません。'
            ]],
            ['⚔️ ダンジョンと軽減', [
                'タイマー完了時はHPペナルティなしでXPとゴールドがもらえます。',
                '途中で中止すると基本10 HPのダメージを受け、報酬は失われます。',
                'WISのパッシブ効果でダメージが軽減されます（最大90%軽減、最低1 HP）。'
            ]],
            ['🛡️ シールドと回復', [
                'デイリー目標未達でストリークがある場合、シールドが自動使用されます（最大2個）。HPダメージは無効化しません。',
                'ショップのポーション／エリクサーやペナルティクエストでHPを回復できます。最大HPは超えません。'
            ]],
            ['☠️ HPが0になると', [
                'HPが0になるとYOU DIEDが発生します。7日間の死亡回数：1回目はゴールド10%、XP0%；2回目はゴールド20%、XP5%；3回目以降はゴールド30%、XP10%を失います。',
                '7日以内の3回目以降はストリークが1日減少します。レベルとランクは下がりません。',
                '最大HPの30%（最低1 HP）で自動復活します。ペナルティクエストでデイリークエスト2件を完了すると、最大HPの約25%（最低20 HP）と15ゴールドを獲得します。'
            ]]
        ]
    }
};
function openHunterHealthGuide() {
    const modal = document.getElementById('hunter-health-guide-modal');
    const lang = typeof getReminderLang === 'function' ? getReminderLang() : 'id';
    const data = HUNTER_HEALTH_GUIDE[lang] || HUNTER_HEALTH_GUIDE.id;
    if (!modal) return;
    document.getElementById('hunter-health-guide-heading').textContent = data.title;
    document.getElementById('hunter-health-close').textContent = data.close;
    const content = document.getElementById('hunter-health-guide-content');
    content.replaceChildren();
    data.sections.forEach(([heading, facts]) => {
        const section = document.createElement('section');
        const h3 = document.createElement('h3'); h3.textContent = heading;
        const list = document.createElement('ul');
        facts.forEach(fact => { const li = document.createElement('li'); li.textContent = fact; list.appendChild(li); });
        section.append(h3, list); content.appendChild(section);
    });
    modal.classList.remove('hidden');
}
function closeHunterHealthGuide() {
    document.getElementById('hunter-health-guide-modal')?.classList.add('hidden');
}
function updateHunterHealthGuideLanguage() {
    const lang = typeof getReminderLang === 'function' ? getReminderLang() : 'id';
    document.querySelectorAll('[data-health-i18n]').forEach(el => {
        const value = HUNTER_HEALTH_GUIDE[lang]?.[el.getAttribute('data-health-i18n')];
        if (typeof value === 'string') el.textContent = value;
    });
    if (!document.getElementById('hunter-health-guide-modal')?.classList.contains('hidden')) openHunterHealthGuide();
}
window.addEventListener('DOMContentLoaded', updateHunterHealthGuideLanguage);

// 10. MOBILE PUSH NOTIFICATION REMINDERS
// ==========================================
// Five independent local-time reminder slots. Earlier three-slot settings are migrated once.
const SYSTEM_REMINDER_DEFAULT_TIMES = Object.freeze({
    Pagi: '04:00', Siang: '12:00', Sore: '15:30', Petang: '18:00', Malam: '20:00'
});
const SYSTEM_REMINDER_SLOTS = Object.keys(SYSTEM_REMINDER_DEFAULT_TIMES);
function ensureReminderState() {
    if (!gameState.reminders || typeof gameState.reminders !== 'object') {
        gameState.reminders = { enabled: false, times: {}, lastFired: {} };
    }
    const rem = gameState.reminders;
    if (!rem.times || typeof rem.times !== 'object') rem.times = {};
    if (!rem.lastFired || typeof rem.lastFired !== 'object') rem.lastFired = {};
    if ((rem.scheduleVersion || 0) < 2) {
        // Keep manually customized legacy slots; replace only the historical stock values.
        const oldDefaults = { Pagi: '07:30', Sore: '16:30', Malam: '20:30' };
        for (const slot of Object.keys(oldDefaults)) {
            if (!rem.times[slot] || rem.times[slot] === oldDefaults[slot]) {
                rem.times[slot] = SYSTEM_REMINDER_DEFAULT_TIMES[slot];
            }
        }
        rem.scheduleVersion = 2;
    }
    for (const slot of SYSTEM_REMINDER_SLOTS) {
        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(String(rem.times[slot] || ''))) {
            rem.times[slot] = SYSTEM_REMINDER_DEFAULT_TIMES[slot];
        }
    }
    return rem;
}

function getReminderLang() {
    const saved = (typeof gameState !== 'undefined' && gameState.language) ||
                  localStorage.getItem('system_rpg_lang') ||
                  (typeof appLanguage !== 'undefined' ? appLanguage : 'id');
    if (saved.startsWith('ja')) return 'ja';
    if (saved.startsWith('en')) return 'en';
    return 'id';
}

function getReminderDict() {
    const lang = getReminderLang();
    const dicts = {
        id: {
            active: 'AKTIF',
            inactive: 'NONAKTIF',
            turnOff: '🔕 Matikan Notifikasi',
            turnOn: '🔔 Aktifkan Notifikasi',
            saved: '⏰ Jadwal Reminder Disimpan',
            permTitle: 'IZIN NOTIFIKASI DIBUTUHKAN',
            permBody: 'Browser / HP memblokir izin notifikasi. Buka Pengaturan Browser / Info Aplikasi Android → Notifikasi → Izinkan agar pengingat layar atas muncul.',
            deniedTitle: 'NOTIFIKASI DIBLOKIR SISTEM',
            deniedBody: 'Izin notifikasi saat ini berstatus Diblokir. Silakan aktifkan izin Notifikasi untuk aplikasi/situs ini di Pengaturan HP Anda.',
            enabledToast: '🔔 Reminder Notifikasi HP Aktif!',
            disabledToast: '🔕 Reminder Notifikasi Dimatikan',
            slots: { Pagi: 'Subuh', Siang: 'Siang', Sore: 'Sore', Petang: 'Petang', Malam: 'Malam' },
            testPending: (name, count, list) => `Hunter ${name}, masih ada ${count} Daily Quest belum selesai (${list})!`,
            testDone: (name) => `Luar biasa Hunter ${name}! Semua Daily Quest hari ini sudah selesai 100%!`,
            testTitle: '⚔️ SYSTEM // Pengingat Daily Quest',
            testSent: '📲 Notifikasi Terkirim ke Layar Atas HP!',
            previewTitle: 'PREVIEW NOTIFIKASI',
            previewBody: (body) => `Izin notifikasi OS belum diizinkan di browser ini, namun isi pesan pengingatmu adalah:\n\n"${body}"`,
            slotFocus: (cnt, slotLbl, list) => `${cnt} misi ${slotLbl} menunggumu (${list})`,
            dayFocus: (cnt) => `${cnt} Daily Quest hari ini masih menunggu diselesaikan`,
            schedTitle: (slotLbl) => `⚔️ SYSTEM // Pengingat ${slotLbl}`,
            schedBody: (name, focus, streak) => `Hunter ${name}, ${focus}. Jaga Streak ${streak} harimu!`
        },
        en: {
            active: 'ACTIVE',
            inactive: 'INACTIVE',
            turnOff: '🔕 Disable Notifications',
            turnOn: '🔔 Enable Notifications',
            saved: '⏰ Reminder Schedule Saved',
            permTitle: 'NOTIFICATION PERMISSION REQUIRED',
            permBody: 'Your browser/device blocked notifications. Open Browser Settings / Android App Info → Notifications → Allow to receive top-bar alerts.',
            deniedTitle: 'NOTIFICATIONS BLOCKED BY SYSTEM',
            deniedBody: 'Notifications are currently blocked. Please enable Notification permission for this app/site in your phone Settings.',
            enabledToast: '🔔 Mobile Push Reminders Enabled!',
            disabledToast: '🔕 Push Reminders Disabled',
            slots: { Pagi: 'Early Morning', Siang: 'Noon', Sore: 'Afternoon', Petang: 'Evening', Malam: 'Night' },
            testPending: (name, count, list) => `Hunter ${name}, you still have ${count} unfinished Daily Quests (${list})!`,
            testDone: (name) => `Outstanding, Hunter ${name}! All Daily Quests for today are 100% complete!`,
            testTitle: '⚔️ SYSTEM // Daily Quest Alert',
            testSent: '📲 Notification Sent to Phone Status Bar!',
            previewTitle: 'NOTIFICATION PREVIEW',
            previewBody: (body) => `OS notification permission is not granted in this browser, but your reminder message is:\n\n"${body}"`,
            slotFocus: (cnt, slotLbl, list) => `${cnt} ${slotLbl} quests await you (${list})`,
            dayFocus: (cnt) => `${cnt} Daily Quests today are still waiting to be completed`,
            schedTitle: (slotLbl) => `⚔️ SYSTEM // ${slotLbl} Reminder`,
            schedBody: (name, focus, streak) => `Hunter ${name}, ${focus}. Protect your ${streak}-day Streak!`
        },
        ja: {
            active: '有効',
            inactive: '無効',
            turnOff: '🔕 通知をオフにする',
            turnOn: '🔔 通知をオンにする',
            saved: '⏰ リマインダー時間を保存しました',
            permTitle: '通知の許可が必要です',
            permBody: 'ブラウザまたは端末で通知がブロックされています。設定 → 通知 → 許可をオンにしてください。',
            deniedTitle: 'システムにより通知がブロックされています',
            deniedBody: '現在通知がブロックされています。端末の設定からこのアプリ/サイトの通知を許可してください。',
            enabledToast: '🔔 スマホ通知リマインダーを有効にしました！',
            disabledToast: '🔕 通知リマインダーをオフにしました',
            slots: { Pagi: '早朝', Siang: '昼', Sore: '午後', Petang: '夕方', Malam: '夜' },
            testPending: (name, count, list) => `ハンター ${name}、未完了のデイリークエストが残り ${count} 件あります（${list}）！`,
            testDone: (name) => `素晴らしい、ハンター ${name}！本日のデイリークエストは100%完了しています！`,
            testTitle: '⚔️ SYSTEM // デイリークエスト通知',
            testSent: '📲 ステータスバーに通知を送信しました！',
            previewTitle: '通知プレビュー',
            previewBody: (body) => `このブラウザではOS通知が許可されていません。送信されるメッセージ内容：\n\n「${body}」`,
            slotFocus: (cnt, slotLbl, list) => `${slotLbl}のクエスト ${cnt} 件が待機中です（${list}）`,
            dayFocus: (cnt) => `本日のデイリークエスト ${cnt} 件がまだ未完了です`,
            schedTitle: (slotLbl) => `⚔️ SYSTEM // ${slotLbl}のリマインダー`,
            schedBody: (name, focus, streak) => `ハンター ${name}、${focus}。${streak}日連続ストリークを守り抜け！`
        }
    };
    return dicts[lang] || dicts.id;
}

function renderReminderUI() {
    const rem = ensureReminderState();
    if (typeof updateHunterHealthGuideLanguage === 'function') updateHunterHealthGuideLanguage();
    const d = getReminderDict();
    const badge = document.getElementById('notif-status-badge');
    const btn = document.getElementById('btn-toggle-notif');
    for (const slot of SYSTEM_REMINDER_SLOTS) {
        const el = document.getElementById('rem-time-' + slot.toLowerCase());
        if (el) el.value = rem.times[slot];
    }

    document.querySelectorAll('[data-rem-label]').forEach(label => {
        const slot = label.getAttribute('data-rem-label');
        const icon = {Pagi:'🌄', Siang:'☀️', Sore:'🌤️', Petang:'🌇', Malam:'🌙'}[slot] || '⏰';
        label.textContent = `${icon} ${d.slots[slot] || slot}`;
    });
    if (badge && btn) {
        if (rem.enabled) {
            badge.textContent = d.active;
            badge.style.cssText = 'font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 9999px; background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid rgba(16,185,129,0.45);';
            btn.textContent = d.turnOff;
            btn.style.cssText = 'flex: 1; font-weight: 700; font-size: 0.75rem; padding: 0.55rem 0.65rem; border-radius: 0.75rem; background: rgba(244,63,94,0.16); color: #fda4af; border: 1px solid rgba(244,63,94,0.45);';
        } else {
            badge.textContent = d.inactive;
            badge.style.cssText = 'font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 9999px; background: rgba(100,116,139,0.2); color: #94a3b8; border: 1px solid #475569;';
            btn.textContent = d.turnOn;
            btn.style.cssText = 'flex: 1; font-weight: 700; font-size: 0.75rem; padding: 0.55rem 0.65rem; border-radius: 0.75rem; background: rgba(6,182,212,0.18); color: #67e8f9; border: 1px solid rgba(6,182,212,0.45);';
        }
    }

    if (rem.enabled && typeof syncSystemReminders === 'function') {
        syncSystemReminders();
    }
}

function saveReminders() {
    const rem = ensureReminderState();
    const d = getReminderDict();
    for (const slot of SYSTEM_REMINDER_SLOTS) {
        const value = document.getElementById('rem-time-' + slot.toLowerCase())?.value;
        if (value && /^([01]\d|2[0-3]):[0-5]\d$/.test(value)) rem.times[slot] = value;
    }
    saveState();
    syncSystemReminders();
    spawnFloatingReward(d.saved);
}

async function togglePushReminder() {
    SoundFX.playClick();
    const rem = ensureReminderState();
    const d = getReminderDict();

    if (!rem.enabled) {
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                const perm = await Notification.requestPermission();
                if (perm !== 'granted') {
                    showSystemModal(d.permTitle, d.permBody);
                    return;
                }
            } else if (Notification.permission === 'denied') {
                showSystemModal(d.deniedTitle, d.deniedBody);
                return;
            }
        }
        rem.enabled = true;
        saveState();
        renderReminderUI();
        syncSystemReminders();
        spawnFloatingReward(d.enabledToast);
    } else {
        rem.enabled = false;
        saveState();
        renderReminderUI();
        cancelNativeSystemReminders();
        spawnFloatingReward(d.disabledToast);
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
    const d = getReminderDict();
    if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
    }
    const summary = getPendingDailySummary();
    const body = summary.pendingCount > 0
        ? d.testPending(gameState.player.name, summary.pendingCount, summary.sampleTitles.join(', '))
        : d.testDone(gameState.player.name);

    const ok = await fireOsNotification(d.testTitle, body, 'system-rpg-test');
    if (ok) {
        spawnFloatingReward(d.testSent);
    } else {
        showSystemModal(d.previewTitle, d.previewBody(body));
    }
}

function syncSystemReminders() {
    const rem = ensureReminderState();
    if (!rem.enabled) { cancelNativeSystemReminders(); return; }
    const summary = getPendingDailySummary();
    const pct = summary.total > 0 ? Math.round((summary.done / summary.total) * 100) : 0;
    const thresholdPct = getStreakThresholdPct();
    const lang = getReminderLang();
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
                    streak: gameState.player.streak,
                    language: lang
                }));
            }
            else if (typeof window.AndroidBridge.scheduleDailyReminders === 'function') {
                // Fallback for older APKs only; avoid scheduling all alarms twice.
                window.AndroidBridge.scheduleDailyReminders(
                    JSON.stringify(rem.times), summary.pendingCount, gameState.player.name
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

function syncHomeScreenWidget() {
    try {
        if (!window.AndroidBridge || typeof gameState === 'undefined' || !gameState.player) return;
        const p = gameState.player;
        const rankObj = (typeof getPlayerRank === 'function') ? getPlayerRank(p.level) : { title: 'E-Rank' };
        const summary = (typeof getPendingDailySummary === 'function') ? getPendingDailySummary() : { done: 0, total: 0 };
        const dailyPct = summary.total > 0 ? Math.round((summary.done / summary.total) * 100) : 0;

       if (typeof window.AndroidBridge.setAppLanguage === 'function') {
            window.AndroidBridge.setAppLanguage(getReminderLang());
        }
        if (typeof window.AndroidBridge.updateWidgetData === 'function') {
            window.AndroidBridge.updateWidgetData(
                p.streak || 0,
                rankObj.title || 'E-Rank',
                p.level || 1,
                p.hp || 100,
                p.maxHp || 100,
                dailyPct
            );
        }
    } catch (e) {}
}

function checkScheduledReminderTick() {
    const rem = ensureReminderState();
    if (!rem.enabled) return;
    // The Android AlarmManager owns background and foreground delivery inside the APK.
    if (window.AndroidBridge && typeof window.AndroidBridge.scheduleDailyRemindersFull === 'function') return;
    const d = getReminderDict();

    const now = new Date();
    const todayKey = formatDateKey(now);
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const nowTime = `${hh}:${mm}`;

    if (!rem.lastFired) rem.lastFired = {};

    SYSTEM_REMINDER_SLOTS.forEach(slot => {
        const targetTime = rem.times[slot];
        const fireKey = `${todayKey}_${slot}`;
        if (targetTime && nowTime === targetTime && !rem.lastFired[fireKey]) {
            const summary = getPendingDailySummary();
            {
                rem.lastFired[fireKey] = true;
                saveState();
                const slotLbl = d.slots[slot] || slot;
                const slotPending = gameState.quests.filter(
                    q => q.category === 'Daily Quest' && !q.completed && inferQuestTimeSlot(q) === slot
                );
                const focusText = slotPending.length > 0
                    ? d.slotFocus(slotPending.length, slotLbl, slotPending.slice(0, 2).map(q => q.title).join(', '))
                    : d.dayFocus(summary.pendingCount);

                fireOsNotification(
                    d.schedTitle(slotLbl),
                    summary.pendingCount ? d.schedBody(gameState.player.name, focusText, gameState.player.streak) : d.testDone(gameState.player.name),
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
let selectedTreasuryCategoryFilter = null;

const TREASURY_PIE_COLORS = [
    '#f43f5e', // Rose
    '#22d3ee', // Cyan
    '#fbbf24', // Amber
    '#a855f7', // Purple
    '#34d399', // Emerald
    '#fb923c', // Orange
    '#60a5fa', // Blue
    '#e879f9'  // Fuchsia
];

function toggleTreasuryCategoryFilter(cat) {
    if (typeof SoundFX !== 'undefined' && SoundFX.playClick) SoundFX.playClick();
    selectedTreasuryCategoryFilter = (selectedTreasuryCategoryFilter === cat) ? null : cat;
    renderTreasury();
}

function buildTreasuryPieChartSVG(entries, totalOut) {
    if (!entries.length || totalOut <= 0) return '';
    const size = 128;
    const cx = size / 2;
    const cy = size / 2;
    const radius = 44;
    const strokeWidth = 18;
    const circumference = 2 * Math.PI * radius;

    let cumulativePct = 0;
    const segments = entries.map(([cat, amt], idx) => {
        const pct = amt / totalOut;
        const dashLength = pct * circumference;
        const dashOffset = -cumulativePct * circumference;
        cumulativePct += pct;
        const color = TREASURY_PIE_COLORS[idx % TREASURY_PIE_COLORS.length];
        const isSelected = selectedTreasuryCategoryFilter === cat;
        const isDimmed = selectedTreasuryCategoryFilter && !isSelected;
        const safeCat = cat.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

        return `<circle
            cx="${cx}" cy="${cy}" r="${radius}"
            fill="transparent"
            stroke="${color}"
            stroke-width="${isSelected ? strokeWidth + 4 : strokeWidth}"
            stroke-dasharray="${dashLength} ${circumference}"
            stroke-dashoffset="${dashOffset}"
            transform="rotate(-90 ${cx} ${cy})"
            style="cursor: pointer; transition: all 0.25s ease; opacity: ${isDimmed ? '0.32' : '1'};"
            onclick="toggleTreasuryCategoryFilter('${safeCat}')"
        />`;
    }).join('');

    const activeAmt = selectedTreasuryCategoryFilter
        ? (entries.find(([c]) => c === selectedTreasuryCategoryFilter)?.[1] || 0)
        : totalOut;
    const centerLabel = selectedTreasuryCategoryFilter ? 'TERPILIH' : 'TOTAL KELUAR';

    return `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; background: rgba(2,6,23,0.65); border: 1px solid #1e293b; border-radius: 0.75rem; padding: 0.65rem; margin-bottom: 0.6rem;">
            <div style="position: relative; width: ${size}px; height: ${size}px; flex-shrink: 0;">
                <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                    <circle cx="${cx}" cy="${cy}" r="${radius}" fill="transparent" stroke="#0f172a" stroke-width="${strokeWidth}" />
                    ${segments}
                </svg>
                <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; text-align: center; padding: 0 14px;">
                    <span class="font-display" style="font-size: 8px; font-weight: 700; color: #94a3b8; letter-spacing: 0.04em;">${centerLabel}</span>
                    <span class="font-display" style="font-size: 10px; font-weight: 800; color: #f8fafc; margin-top: 1px;">${formatRupiah(activeAmt)}</span>
                </div>
            </div>
            <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; max-height: 128px; overflow-y: auto;">
                ${entries.map(([cat, amt], idx) => {
                    const pct = Math.round((amt / totalOut) * 100);
                    const color = TREASURY_PIE_COLORS[idx % TREASURY_PIE_COLORS.length];
                    const isSelected = selectedTreasuryCategoryFilter === cat;
                    const safeCat = cat.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                    return `
                        <button type="button" onclick="toggleTreasuryCategoryFilter('${safeCat}')"
                            style="display: flex; align-items: center; justify-content: space-between; gap: 4px; text-align: left; padding: 3px 6px; border-radius: 0.4rem; background: ${isSelected ? 'rgba(34,211,238,0.16)' : 'transparent'}; border: 1px solid ${isSelected ? 'rgba(34,211,238,0.45)' : 'transparent'}; cursor: pointer;">
                            <span class="truncate" style="display: flex; align-items: center; gap: 5px; font-size: 10px; color: ${isSelected ? '#67e8f9' : '#cbd5e1'}; font-weight: ${isSelected ? '700' : '500'};">
                                <span style="width: 8px; height: 8px; border-radius: 9999px; background: ${color}; flex-shrink: 0;"></span>
                                <span class="truncate">${escapeHtml(tTreasury(cat))}</span>
                            </span>
                            <span class="font-display shrink-0" style="font-size: 10px; font-weight: 700; color: ${color};">${pct}%</span>
                        </button>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

const TREASURY_CATEGORIES = {
    expense: ['🍔 Makan & Jajan', '🚗 Transportasi', '🛒 Belanja & Kebutuhan', '📱 Tagihan & Kuota', '📚 Edukasi & Buku', '🎮 Hiburan', '💊 Kesehatan', '📦 Lainnya'],
    income: ['💼 Gaji / Honor', '🎁 Bonus / Hadiah', '📈 Usaha / Freelance', '💰 Pemasukan Lain']
};

function tTreasury(str) {
    if (typeof appLanguage === 'undefined' || appLanguage === 'id') return str;
    if (typeof DICTIONARY !== 'undefined' && DICTIONARY[appLanguage] && DICTIONARY[appLanguage][str]) {
        return DICTIONARY[appLanguage][str];
    }
    return str;
}

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
    const prevVal = catEl.value;
    const list = TREASURY_CATEGORIES[typeEl.value] || TREASURY_CATEGORIES.expense;
    catEl.innerHTML = list.map(c => `<option value="${c}">${tTreasury(c)}</option>`).join('');
    if (prevVal && list.includes(prevVal)) {
        catEl.value = prevVal;
    }
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
        if (typeof res === 'number' && !isFinite(res)) {
            if (typeof spawnFloatingReward === 'function') {
                spawnFloatingReward(tTreasury('⚠️ Error: Tidak bisa membagi dengan nol!'));
            }
            return 0;
        }
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
        const formatted = val.toLocaleString('id-ID');
        const curLang = (typeof gameState !== 'undefined' && gameState.language) || localStorage.getItem('system_rpg_lang') || 'id';
        if (curLang === 'en') {
            spawnFloatingReward(`✓ Amount Rp ${formatted} inserted!`);
        } else if (curLang === 'ja') {
            spawnFloatingReward(`✓ 金額 Rp ${formatted} を入力しました！`);
        } else {
            spawnFloatingReward(`✓ Nominal Rp ${formatted} dimasukkan!`);
        }
    } else {
        spawnFloatingReward(tTreasury('⚠️ Hitung nominal lebih dari 0 terlebih dahulu'));
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

    // Urutkan transaksi dari tanggal terbaru ke terlama agar input tanggal mundur/maju tetap rapi
    tr.transactions.sort((a, b) => (b.dateStr || '').localeCompare(a.dateStr || ''));

    // Sesuaikan filter periode agar transaksi yang baru diinput langsung terlihat
    const fDateEl = document.getElementById('tr-filter-date');
    const fMonthEl = document.getElementById('tr-filter-month');
    const fYearEl = document.getElementById('tr-filter-year');
    if (fDateEl) fDateEl.value = dateStr;
    if (fMonthEl) fMonthEl.value = dateStr.slice(0, 7);
    if (fYearEl) fYearEl.value = dateStr.slice(0, 4);

    const todayKey = getCurrentGameDateKey();
    const usedToday = tr.dailyBonusCounts[todayKey] || 0;
    if (usedToday < 3) {
        tr.dailyBonusCounts[todayKey] = usedToday + 1;
        SoundFX.playQuestComplete();
        addRewards(10, 0, 'WIS', 10, true);
        const count = tr.dailyBonusCounts[todayKey];
        const curLang = (typeof gameState !== 'undefined' && gameState.language) || localStorage.getItem('system_rpg_lang') || 'id';
        if (curLang === 'en') {
            spawnFloatingReward(`💰 Recorded! +10 XP & +10 WIS XP (${count}/3 today)`);
        } else if (curLang === 'ja') {
            spawnFloatingReward(`💰 記録完了！ +10 XP & +10 WIS XP (本日 ${count}/3)`);
        } else {
            spawnFloatingReward(`💰 Tercatat! +10 XP & +10 WIS XP (${count}/3 hari ini)`);
        }
    } else {
        SoundFX.playCoin();
        spawnFloatingReward(tTreasury('💰 Transaksi keuangan berhasil dicatat!'));
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
    spawnFloatingReward(tTreasury('🗑️ Transaksi dihapus'));
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
        lbl.textContent = tTreasury('Filter Tanggal:');
        fDate.classList.remove('hidden');
    } else if (mode === 'monthly') {
        lbl.textContent = tTreasury('Filter Bulan:');
        fMonth.classList.remove('hidden');
    } else {
        lbl.textContent = tTreasury('Filter Tahun:');
        fYear.classList.remove('hidden');
    }
    renderTreasury();
}

function getOffsetGameDateKey(offsetDays = 0) {
    const baseKey = getCurrentGameDateKey();
    const [y, m, d] = baseKey.split('-').map(Number);
    const dt = new Date(y, (m || 1) - 1, (d || 1) + offsetDays);
    const yy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
}

function setQuickTxDate(offsetDays) {
    if (typeof SoundFX !== 'undefined' && SoundFX.playClick) SoundFX.playClick();
    const txDate = document.getElementById('tx-date');
    if (!txDate) return;
    txDate.value = getOffsetGameDateKey(offsetDays);
    updateQuickTxDateButtons();
}

function updateQuickTxDateButtons() {
    const txDate = document.getElementById('tx-date');
    const wrap = document.getElementById('tx-quick-date-pills');
    if (!txDate || !wrap) return;
    const val = txDate.value;
    const map = {
        '-1': getOffsetGameDateKey(-1),
        '0': getOffsetGameDateKey(0),
        '1': getOffsetGameDateKey(1)
    };
    wrap.querySelectorAll('button[data-offset]').forEach(btn => {
        const off = btn.getAttribute('data-offset');
        const active = val === map[off];
        btn.style.background = active ? 'rgba(6,182,212,0.22)' : 'rgba(15,23,42,0.85)';
        btn.style.color = active ? '#67e8f9' : '#94a3b8';
        btn.style.borderColor = active ? 'rgba(34,211,238,0.55)' : '#1e293b';
    });
}

function initTreasuryDefaults() {
    const todayKey = getCurrentGameDateKey();
    const txDate = document.getElementById('tx-date');
    const fDate = document.getElementById('tr-filter-date');
    const fMonth = document.getElementById('tr-filter-month');
    const fYear = document.getElementById('tr-filter-year');

    if (txDate) {
        if (!txDate.value) txDate.value = todayKey;
        txDate.removeAttribute('min');
        txDate.removeAttribute('max');

        if (!document.getElementById('tx-quick-date-pills') && txDate.parentElement) {
            const pills = document.createElement('div');
            pills.id = 'tx-quick-date-pills';
            pills.style.cssText = 'display: flex; gap: 4px; margin-top: 5px;';
            pills.innerHTML = `
                <button type="button" data-offset="-1" onclick="setQuickTxDate(-1)" style="flex:1; padding: 3px 6px; border-radius: 0.4rem; font-size: 10px; font-weight: 700; border: 1px solid #1e293b; cursor: pointer;">Kemarin</button>
                <button type="button" data-offset="0" onclick="setQuickTxDate(0)" style="flex:1; padding: 3px 6px; border-radius: 0.4rem; font-size: 10px; font-weight: 700; border: 1px solid #1e293b; cursor: pointer;">Hari Ini</button>
                <button type="button" data-offset="1" onclick="setQuickTxDate(1)" style="flex:1; padding: 3px 6px; border-radius: 0.4rem; font-size: 10px; font-weight: 700; border: 1px solid #1e293b; cursor: pointer;">Besok</button>
            `;
            txDate.parentElement.appendChild(pills);
            txDate.addEventListener('change', updateQuickTxDateButtons);
        }
        updateQuickTxDateButtons();
    }

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
    if (quotaBadge) {
        if (typeof appLanguage !== 'undefined' && appLanguage === 'en') {
            quotaBadge.textContent = `RPG Bonus: ${quotaUsed}/3 Today`;
        } else if (typeof appLanguage !== 'undefined' && appLanguage === 'ja') {
            quotaBadge.textContent = `RPGボーナス: 本日 ${quotaUsed}/3`;
        } else {
            quotaBadge.textContent = `Bonus RPG: ${quotaUsed}/3 Hari Ini`;
        }
    }

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

    // Reset filter jika kategori yang dipilih sudah tidak ada di periode ini
    if (selectedTreasuryCategoryFilter && !catTotals[selectedTreasuryCategoryFilter]) {
        selectedTreasuryCategoryFilter = null;
    }

    const catBox = document.getElementById('tr-category-breakdown');
    if (catBox) {
        const entries = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
        if (entries.length === 0) {
            catBox.innerHTML = `<p style="font-size: 11px; color: #64748b;">${escapeHtml(tTreasury('Belum ada pengeluaran pada periode ini.'))}</p>`;
        } else {
            const pieChartHtml = buildTreasuryPieChartSVG(entries, totalOut);
            const hintHtml = `<p style="font-size: 10px; color: #94a3b8; margin-bottom: 6px;">💡 Ketuk kategori / irisan grafik di bawah untuk melihat riwayat transaksi kategori tersebut:</p>`;
            const listHtml = entries.map(([cat, amt], idx) => {
                const pct = totalOut > 0 ? Math.round((amt / totalOut) * 100) : 0;
                const color = TREASURY_PIE_COLORS[idx % TREASURY_PIE_COLORS.length];
                const isSelected = selectedTreasuryCategoryFilter === cat;
                const safeCat = cat.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                const txCount = filtered.filter(t => t.type !== 'income' && t.category === cat).length;

                return `
                    <div onclick="toggleTreasuryCategoryFilter('${safeCat}')"
                        style="cursor: pointer; background: ${isSelected ? 'rgba(6,182,212,0.16)' : 'rgba(15,23,42,0.75)'}; border: 1px solid ${isSelected ? '#22d3ee' : '#1e293b'}; border-radius: 0.55rem; padding: 0.45rem 0.6rem; transition: all 0.2s;">
                        <div class="flex justify-between items-center" style="font-size: 11px; margin-bottom: 4px;">
                            <span style="color: ${isSelected ? '#67e8f9' : '#e2e8f0'}; font-weight: 700; display: flex; align-items: center; gap: 5px;">
                                <span style="width: 8px; height: 8px; border-radius: 9999px; background: ${color}; display: inline-block;"></span>
                                ${escapeHtml(tTreasury(cat))}
                                <span style="font-size: 9px; color: #94a3b8; font-weight: 500;">(${txCount}x)</span>
                            </span>
                            <span class="font-display" style="color: ${color}; font-weight: 700;">${formatRupiah(amt)} (${pct}%)</span>
                        </div>
                        <div class="progress-track-sm">
                            <div class="progress-fill" style="width: ${pct}%; background: ${color};"></div>
                        </div>
                    </div>
                `;
            }).join('');

            catBox.innerHTML = pieChartHtml + hintHtml + listHtml;
        }
    }

    const txListEl = document.getElementById('tr-transaction-list');
    if (txListEl) {
        const displayedTx = selectedTreasuryCategoryFilter
            ? filtered.filter(tx => tx.type !== 'income' && tx.category === selectedTreasuryCategoryFilter)
            : filtered;

        const filterBannerHtml = selectedTreasuryCategoryFilter ? `
            <div class="flex items-center justify-between gap-2" style="background: rgba(6,182,212,0.14); border: 1px solid rgba(34,211,238,0.45); border-radius: 0.6rem; padding: 0.45rem 0.65rem; margin-bottom: 0.45rem;">
                <div style="font-size: 11px; color: #67e8f9; font-weight: 700;">
                    🔍 Filter: ${escapeHtml(tTreasury(selectedTreasuryCategoryFilter))} • Total ${formatRupiah(catTotals[selectedTreasuryCategoryFilter] || 0)}
                </div>
                <button type="button" onclick="toggleTreasuryCategoryFilter(null)" class="font-display"
                    style="font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 0.4rem; background: rgba(15,23,42,0.9); color: #cbd5e1; border: 1px solid #334155; cursor: pointer;">
                    ✕ Semua
                </button>
            </div>
        ` : '';

        if (displayedTx.length === 0) {
            txListEl.innerHTML = filterBannerHtml + `<p style="font-size: 11px; color: #64748b; text-align: center; padding: 0.65rem 0;">${escapeHtml(tTreasury('Tidak ada transaksi pada periode ini.'))}</p>`;
        } else {
            txListEl.innerHTML = filterBannerHtml + displayedTx.map(tx => {
                const isInc = tx.type === 'income';
                return `
                    <div style="background: rgba(15,23,42,0.75); border: 1px solid rgba(30,41,59,0.9); border-radius: 0.65rem; padding: 0.5rem 0.65rem;" class="flex items-center justify-between gap-2">
                        <div class="min-w-0 flex-1">
                            <p class="truncate" style="font-size: 0.75rem; font-weight: 600; color: #f1f5f9;">${escapeHtml(tx.note)}</p>
                            <p style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">${escapeHtml(tTreasury(tx.category))} • ${tx.dateStr}</p>
                        </div>
                        <div class="flex items-center gap-2 shrink-0">
                            <span class="font-display" style="font-size: 0.75rem; font-weight: 700; color: ${isInc ? '#34d399' : '#fb7185'};">
                                ${isInc ? '+' : '-'}${formatRupiah(tx.amount)}
                            </span>
                            <button type="button" onclick="deleteTreasuryTx('${tx.id}')" style="color: #64748b; padding: 3px;" title="${escapeHtml(tTreasury('Hapus'))}">✕</button>
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
    normal: '15px',
    large: '15.5px'
};

const FONT_FAMILIES = {
    cyber: "'Orbitron', sans-serif",
    clean: "'Inter', system-ui, -apple-system, sans-serif",
    tactical: "'Rajdhani', sans-serif"
};

const SYSRPG_THEME_KEY = 'sysrpg_theme';
const ALLOWED_THEMES = ['cyber', 'crimson', 'cobalt'];

function syncThemeChips(themeName) {
    const activeTheme = ALLOWED_THEMES.includes(themeName) ? themeName : 'cyber';
    document.querySelectorAll('[data-theme-choice]').forEach((btn) => {
        btn.classList.toggle('is-active', btn.getAttribute('data-theme-choice') === activeTheme);
    });
}

function setAppTheme(themeName) {
    const chosen = ALLOWED_THEMES.includes(themeName) ? themeName : 'cyber';
    document.documentElement.setAttribute('data-theme', chosen);
    try {
        localStorage.setItem(SYSRPG_THEME_KEY, chosen);
    } catch (_) {}
    if (typeof gameState !== 'undefined') {
        gameState.uiTheme = chosen;
        if (typeof saveState === 'function') saveState();
    }
    syncThemeChips(chosen);
    if (typeof SoundFX !== 'undefined' && SoundFX.playClick) SoundFX.playClick();
}

window.setAppTheme = setAppTheme;

function openFontSettingsModal() {
    if (typeof SoundFX !== 'undefined' && SoundFX.playClick) SoundFX.playClick();
    const savedTheme = (typeof gameState !== 'undefined' && gameState.uiTheme) ||
        (() => {
            try { return localStorage.getItem(SYSRPG_THEME_KEY) || 'cyber'; } catch (_) { return 'cyber'; }
        })();
    syncThemeChips(savedTheme);
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

    document.documentElement.style.setProperty('--app-font-scale', FONT_SCALES[scaleKey] || '15px');
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

(function initSystemThemeOnLoad() {
    let saved = 'cyber';
    if (typeof gameState !== 'undefined' && gameState.uiTheme && ALLOWED_THEMES.includes(gameState.uiTheme)) {
        saved = gameState.uiTheme;
    } else {
        try {
            saved = localStorage.getItem(SYSRPG_THEME_KEY) || 'cyber';
        } catch (_) {}
    }
    document.documentElement.setAttribute('data-theme', ALLOWED_THEMES.includes(saved) ? saved : 'cyber');
    syncThemeChips(saved);
})();

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
let rpgLofiTrack = 'moonlit';
function selectRpgLofiTrack(value) {
    const wasPlaying = lofiIsPlaying;
    if (wasPlaying) stopAnimeLofi1Hour();
    rpgLofiTrack = ['moonlit','night','synth','custom'].includes(value) ? value : 'moonlit';
    try { if (rpgLofiTrack !== 'custom') localStorage.setItem('system_rpg_lofi_track_v2', rpgLofiTrack); } catch (_e) {}
    const picker = document.getElementById('rpg-lofi-track');
    if (picker) picker.value = rpgLofiTrack;
    const audio = document.getElementById('lofi-local-audio-player');
    if (audio && audio.src.startsWith('blob:') && rpgLofiTrack !== 'custom') URL.revokeObjectURL(audio.src);
    if (rpgLofiTrack === 'moonlit' || rpgLofiTrack === 'night') {
        if (audio) audio.src = rpgLofiTrack === 'moonlit' ? 'moonlit-study.ogg' : 'night-quest.ogg';
        lofiUseLocalFile = true;
    } else if (rpgLofiTrack === 'synth') {
        lofiUseLocalFile = false;
    } else {
        lofiUseLocalFile = !!(audio && audio.src && audio.src.startsWith('blob:'));
        if (!lofiUseLocalFile) { document.getElementById('lofi-local-mp3')?.click(); return; }
    }
    if (wasPlaying) toggleAnimeLofi1Hour();
}


function cycleRpgLofiTrack(direction) {
    const tracks = ['moonlit', 'night', 'synth'];
    const i = tracks.indexOf(rpgLofiTrack);
    const next = tracks[(Math.max(0, i) + (direction < 0 ? tracks.length - 1 : 1)) % tracks.length];
    selectRpgLofiTrack(next);
}

let lofiVinylSource = null;
let lofiVinylGain = null;

// 8-Bar Progresi Akor Anime Chillhop + Nada Bass + Skala Melodi
const ANIME_LOFI_PROGRESSION = [
    { bass: 87.31,  chords: [174.61, 220.00, 261.63, 329.63, 392.00], melody: [523.25, 0, 659.25, 587.33, 523.25, 440.00, 0, 392.00] }, // Fmaj9
    { bass: 82.41,  chords: [164.81, 196.00, 246.94, 293.66, 392.00], melody: [493.88, 587.33, 0, 493.88, 440.00, 392.00, 329.63, 0] }, // Em7
    { bass: 110.00, chords: [220.00, 261.63, 329.63, 392.00, 493.88], melody: [659.25, 0, 587.33, 523.25, 493.88, 523.25, 0, 440.00] }, // Am9
    { bass: 73.42,  chords: [146.83, 174.61, 220.00, 261.63, 329.63], melody: [392.00, 440.00, 523.25, 0, 440.00, 392.00, 349.23, 0] }, // Dm9
    { bass: 98.00,  chords: [196.00, 246.94, 293.66, 349.23, 440.00], melody: [587.33, 0, 523.25, 493.88, 440.00, 392.00, 440.00, 0] }, // G13
    { bass: 65.41,  chords: [130.81, 164.81, 196.00, 246.94, 293.66], melody: [523.25, 493.88, 392.00, 0, 329.63, 392.00, 440.00, 0] }, // Cmaj9
    { bass: 123.47, chords: [246.94, 293.66, 349.23, 440.00],         melody: [587.33, 0, 523.25, 493.88, 440.00, 0, 392.00, 440.00] }, // Bm7b5
    { bass: 82.41,  chords: [164.81, 207.65, 246.94, 293.66, 392.00], melody: [493.88, 523.25, 587.33, 659.25, 587.33, 493.88, 0, 0] }  // E7#9
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
        lofiMasterGain.gain.setTargetAtTime(vol * 0.48, lofiCtx.currentTime, 0.05);
    }
    const localAudio = document.getElementById('lofi-local-audio-player');
    if (localAudio) {
        localAudio.volume = vol;
    }
}

function startLofiVinylTexture() {
    if (!lofiCtx || !lofiMasterGain || lofiVinylSource) return;
    try {
        const bufferLen = lofiCtx.sampleRate * 3;
        const buffer = lofiCtx.createBuffer(1, bufferLen, lofiCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferLen; i++) {
            // Gabungan noise hujan halus + letupan vinyl tipis acak
            const rain = (Math.random() * 2 - 1) * 0.018;
            const pop = Math.random() > 0.9985 ? (Math.random() * 2 - 1) * 0.22 : 0;
            data[i] = rain + pop;
        }
        const src = lofiCtx.createBufferSource();
        src.buffer = buffer;
        src.loop = true;

        const filter = lofiCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1800, lofiCtx.currentTime);
        filter.Q.setValueAtTime(0.7, lofiCtx.currentTime);

        const gain = lofiCtx.createGain();
        gain.gain.setValueAtTime(0.16, lofiCtx.currentTime);

        src.connect(filter);
        filter.connect(gain);
        gain.connect(lofiMasterGain);
        src.start();

        lofiVinylSource = src;
        lofiVinylGain = gain;
    } catch (e) {}
}

function stopLofiVinylTexture() {
    if (lofiVinylSource) {
        try { lofiVinylSource.stop(); } catch (e) {}
        lofiVinylSource = null;
        lofiVinylGain = null;
    }
}

function playLofiChordAndBeat() {
    if (!lofiCtx || !lofiMasterGain || !lofiIsPlaying) return;
    const stepInBar = lofiStep % 8;
    const barIdx = Math.floor(lofiStep / 8) % ANIME_LOFI_PROGRESSION.length;
    const currentBar = ANIME_LOFI_PROGRESSION[barIdx];

    // Tambahkan sedikit micro-swing pada ketukan ganjil agar terasa manusiawi
    const swingDelay = (stepInBar % 2 === 1) ? 0.025 : 0;
    const now = lofiCtx.currentTime + swingDelay;

    // 1. RHODES ELECTRIC PIANO CHORDS (Awal bar + strum lembut di tengah bar)
    if (stepInBar === 0 || stepInBar === 4) {
        const chordGainScale = stepInBar === 0 ? 1.0 : 0.55;
        currentBar.chords.forEach((f, idx) => {
            const strum = idx * 0.022; // Efek jari menekan tuts piano berurutan
            const osc = lofiCtx.createOscillator();
            const subOsc = lofiCtx.createOscillator();
            const filter = lofiCtx.createBiquadFilter();
            const gain = lofiCtx.createGain();

            osc.type = 'triangle';
            subOsc.type = 'sine';
            // Sedikit detune analog biar hangat
            const detune = 1 + (Math.random() - 0.5) * 0.005;
            osc.frequency.setValueAtTime(f * detune, now + strum);
            subOsc.frequency.setValueAtTime(f * 2, now + strum);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1150, now + strum);
            filter.frequency.exponentialRampToValueAtTime(520, now + strum + 2.4);

            const peak = (0.16 / currentBar.chords.length) * chordGainScale;
            gain.gain.setValueAtTime(0.001, now + strum);
            gain.gain.linearRampToValueAtTime(peak, now + strum + 0.09);
            gain.gain.exponentialRampToValueAtTime(0.001, now + strum + 2.5);

            const overtoneGain = lofiCtx.createGain();
            overtoneGain.gain.setValueAtTime(0.18, now + strum);

            osc.connect(filter);
            subOsc.connect(overtoneGain);
            overtoneGain.connect(filter);
            filter.connect(gain);
            gain.connect(lofiMasterGain);

            osc.start(now + strum);
            subOsc.start(now + strum);
            osc.stop(now + strum + 2.6);
            subOsc.stop(now + strum + 2.6);
        });
    }

    // 2. WARM SUB-BASS (Ketukan 1 dan sinkopasi ketukan 5)
    if (stepInBar === 0 || stepInBar === 5) {
        const bassOsc = lofiCtx.createOscillator();
        const bassFilter = lofiCtx.createBiquadFilter();
        const bassGain = lofiCtx.createGain();

        bassOsc.type = 'sine';
        const bassFreq = stepInBar === 5 ? currentBar.bass * 1.5 : currentBar.bass;
        bassOsc.frequency.setValueAtTime(bassFreq, now);

        bassFilter.type = 'lowpass';
        bassFilter.frequency.setValueAtTime(260, now);

        const dur = stepInBar === 0 ? 1.5 : 0.7;
        bassGain.gain.setValueAtTime(0.001, now);
        bassGain.gain.linearRampToValueAtTime(stepInBar === 0 ? 0.24 : 0.14, now + 0.06);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        bassOsc.connect(bassFilter);
        bassFilter.connect(bassGain);
        bassGain.connect(lofiMasterGain);
        bassOsc.start(now);
        bassOsc.stop(now + dur + 0.05);
    }

    // 3. ANIME BELL / PIANO LEAD MELODY (Variasi tiap putaran agar tidak monoton)
    const loopCycle = Math.floor(lofiStep / 64);
    const melNote = currentBar.melody[stepInBar];
    const shouldPlayMelody = melNote > 0 && ((loopCycle % 2 === 0) || (stepInBar % 2 === 0));
    if (shouldPlayMelody) {
        const melOsc = lofiCtx.createOscillator();
        const melFilter = lofiCtx.createBiquadFilter();
        const melGain = lofiCtx.createGain();

        melOsc.type = 'sine';
        // Variasi oktaf lembut di putaran tertentu
        const octaveShift = (loopCycle % 3 === 2 && stepInBar === 0) ? 2 : 1;
        melOsc.frequency.setValueAtTime(melNote * octaveShift, now);

        melFilter.type = 'lowpass';
        melFilter.frequency.setValueAtTime(1600, now);

        melGain.gain.setValueAtTime(0.001, now);
        melGain.gain.linearRampToValueAtTime(0.065, now + 0.04);
        melGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

        melOsc.connect(melFilter);
        melFilter.connect(melGain);
        melGain.connect(lofiMasterGain);
        melOsc.start(now);
        melOsc.stop(now + 0.9);
    }

    // 4. BOOM-BAP KICK (Ketukan 0, 3, dan 4 untuk groove chillhop)
    if (stepInBar === 0 || stepInBar === 3 || stepInBar === 4) {
        const kickOsc = lofiCtx.createOscillator();
        const kickGain = lofiCtx.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(118, now);
        kickOsc.frequency.exponentialRampToValueAtTime(40, now + 0.13);

        const kickVol = stepInBar === 3 ? 0.16 : 0.28; // Ghost kick lebih pelan
        kickGain.gain.setValueAtTime(kickVol, now);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);

        kickOsc.connect(kickGain);
        kickGain.connect(lofiMasterGain);
        kickOsc.start(now);
        kickOsc.stop(now + 0.19);
    }

    // 5. LOFI RIMSHOT SNARE (Ketukan 2 & 6)
    if (stepInBar === 2 || stepInBar === 6) {
        const bufSize = Math.floor(lofiCtx.sampleRate * 0.09);
        const snareBuf = lofiCtx.createBuffer(1, bufSize, lofiCtx.sampleRate);
        const sData = snareBuf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) sData[i] = Math.random() * 2 - 1;

        const snareSrc = lofiCtx.createBufferSource();
        snareSrc.buffer = snareBuf;

        const bp = lofiCtx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.setValueAtTime(1450, now);
        bp.Q.setValueAtTime(1.2, now);

        const sGain = lofiCtx.createGain();
        sGain.gain.setValueAtTime(0.11, now);
        sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        snareSrc.connect(bp);
        bp.connect(sGain);
        sGain.connect(lofiMasterGain);
        snareSrc.start(now);
    }

    // 6. SHAKER / HI-HAT SWING (Setiap step dengan dinamika keras-pelan)
    {
        const bufferSize = Math.floor(lofiCtx.sampleRate * 0.035);
        const noiseBuffer = lofiCtx.createBuffer(1, bufferSize, lofiCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noise = lofiCtx.createBufferSource();
        noise.buffer = noiseBuffer;

        const hp = lofiCtx.createBiquadFilter();
        hp.type = 'bandpass';
        hp.frequency.setValueAtTime(5200, now);

        const hatGain = lofiCtx.createGain();
        const hatVol = (stepInBar % 2 === 1) ? 0.045 : 0.02;
        hatGain.gain.setValueAtTime(hatVol, now);
        hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

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
    stopLofiVinylTexture();

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
            const vol = slider ? Number(slider.value) / 100 : 0.55;
            lofiMasterGain.gain.setValueAtTime(vol * 0.48, lofiCtx.currentTime);
            lofiMasterGain.connect(lofiCtx.destination);
        }
        if (lofiCtx.state === 'suspended') lofiCtx.resume();

        startLofiVinylTexture();
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
    if (localAudio.src && localAudio.src.startsWith('blob:')) {
        URL.revokeObjectURL(localAudio.src);
    }
    lofiUseLocalFile = true;
    rpgLofiTrack = 'custom';
    const selector = document.getElementById('rpg-lofi-track');
    if (selector) selector.value = 'custom';
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

// Cek pergantian hari & update sisa waktu Relic tiap 30 detik
setInterval(() => {
    checkRealDayRollover();
    const shopTab = document.getElementById('tab-shop');
    if (shopTab && !shopTab.classList.contains('hidden') && typeof renderArmory === 'function') {
        renderArmory();
    }
}, 30000);

applySavedFontSettings();
syncAndroidHomeWidget();
setTimeout(syncAndroidHomeWidget, 800);


// ==========================================
// MODULE BLOCK 3
// ==========================================

let isSplashUnlocking = false;
let fpHoldTimer = null;
let fpVibrateInterval = null;
let fpAudioCtx = null;

// ==========================================
// AUTO FANTASY AMBIENT BGM (SPLASH SCREEN ONLY)
// ==========================================
let splashBgmInterval = null;
let splashBgmMasterGain = null;
let isSplashBgmPlaying = false;
let isStartingSplashBgm = false;

// Original offline audio, played through HTMLAudioElement to avoid oscillator clipping.
let rpgSplashAudio = null;
function startAutoSplashFantasyBGM() {
    if (isSplashUnlocking || isSplashBgmPlaying) return;
    if (!rpgSplashAudio) {
        rpgSplashAudio = new Audio('awakening-cinematic.ogg');
        rpgSplashAudio.loop = true;
        rpgSplashAudio.preload = 'auto';
        rpgSplashAudio.volume = 0.9;
    }
    isSplashBgmPlaying = true;
    rpgSplashAudio.play().catch(() => { isSplashBgmPlaying = false; });
}
function stopAutoSplashFantasyBGM() {
    isSplashBgmPlaying = false;
    isStartingSplashBgm = false;
    if (splashBgmInterval) { clearInterval(splashBgmInterval); splashBgmInterval = null; }
    if (rpgSplashAudio) { rpgSplashAudio.pause(); rpgSplashAudio.currentTime = 0; }
}

// Native haptics first: Android WebView does not reliably implement navigator.vibrate.
// The preference is opt-out, and is safe to use even before Settings is opened.
function awakeningHaptic(kind) {
    try {
        if (localStorage.getItem('system_rpg_haptic_enabled') === 'false') return;
        const bridge = window.AndroidBridge;
        if (bridge && typeof bridge.hapticFeedback === 'function') {
            bridge.hapticFeedback(kind === 'success' ? 'levelup' : 'tap');
            return;
        }
        if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
            navigator.vibrate(kind === 'success' ? [60, 45, 110, 55, 160] : 35);
        }
    } catch (_) {}
}

function setFingerprintFeedback(statusText, subText, color = '#67e8f9', scanning = false) {
    const statusEl = document.getElementById('fp-status-text');
    const subEl = document.getElementById('fp-sub-text');
    const padEl = document.getElementById('btn-fingerprint-auth');
    const scanLine = document.getElementById('fp-scan-line');
    const svgIcon = document.getElementById('fp-svg-icon');

    if (statusEl && statusText) {
        statusEl.textContent = statusText;
        statusEl.style.color = color;
    }
    if (subEl && subText) {
        subEl.textContent = subText;
    }
    if (padEl) {
        padEl.classList.toggle('is-scanning', scanning);
        padEl.classList.toggle('scanning', scanning);
    }
    if (scanLine) {
        scanLine.style.opacity = scanning ? '1' : '0';
    }
    if (svgIcon) {
        svgIcon.style.stroke = color;
    }
}

function clearFingerprintHoldTimers() {
    if (fpHoldTimer) {
        clearTimeout(fpHoldTimer);
        fpHoldTimer = null;
    }
    if (fpVibrateInterval) {
        clearInterval(fpVibrateInterval);
        fpVibrateInterval = null;
    }
}

function playFingerprintUnlockSound() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        if (!fpAudioCtx) fpAudioCtx = new AudioCtx();
        if (fpAudioCtx.state === 'suspended') {
            fpAudioCtx.resume().catch(() => {});
        }

        const now = fpAudioCtx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
            const osc = fpAudioCtx.createOscillator();
            const gain = fpAudioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.07);

            gain.gain.setValueAtTime(0.001, now + idx * 0.07);
            gain.gain.linearRampToValueAtTime(0.22, now + idx * 0.07 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.32);

            osc.connect(gain);
            gain.connect(fpAudioCtx.destination);
            osc.start(now + idx * 0.07);
            osc.stop(now + idx * 0.07 + 0.35);
        });
    } catch (_e) {}
}

function unlockSystemSplashScreen() {
    if (isSplashUnlocking) return;
    isSplashUnlocking = true;
    clearFingerprintHoldTimers();
    stopAutoSplashFantasyBGM();

    setFingerprintFeedback(
        '[ AWAKENING CONFIRMED ]',
        'Memuat antarmuka Hunter...',
        '#34d399',
        false
    );

    playFingerprintUnlockSound();

    awakeningHaptic('success');

    const splashEl = document.getElementById('system-splash-screen');
    if (splashEl) {
        splashEl.classList.add('unlocked', 'is-hidden', 'hidden', 'fade-out');
        splashEl.style.pointerEvents = 'none';
        splashEl.style.transition = 'opacity 0.35s ease, visibility 0.35s ease';
        splashEl.style.opacity = '0';
        splashEl.style.visibility = 'hidden';

        setTimeout(() => {
            splashEl.style.display = 'none';
        }, 360);
    }

    setTimeout(showPendingDailyReport, 520);
    if (typeof window.onSystemUnlocked === 'function') {
        try { window.onSystemUnlocked(); } catch (_e) {}
    } else if (typeof renderAll === 'function') {
        try { renderAll(); } catch (_e) {}
    }
}

function startFingerprintHold(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }
    if (isSplashUnlocking || fpHoldTimer) return;

    // Capture the pointer so small finger movements do not cancel the hold.
    try {
        if (event && event.currentTarget && event.pointerId !== undefined &&
            typeof event.currentTarget.setPointerCapture === 'function') {
            event.currentTarget.setPointerCapture(event.pointerId);
        }
    } catch (_e) {}

    clearFingerprintHoldTimers();
    stopAutoSplashFantasyBGM();

    setFingerprintFeedback(
        '[ MEMINDAI BIOMETRIK... TAHAN ]',
        'Jangan lepaskan sidik jari hingga verifikasi selesai',
        '#fbbf24',
        true
    );

    awakeningHaptic('tap');
    fpVibrateInterval = setInterval(() => {
        if (isSplashUnlocking) {
            clearFingerprintHoldTimers();
            return;
        }
        awakeningHaptic('tap');
    }, 420);

    fpHoldTimer = setTimeout(() => {
        unlockSystemSplashScreen();
    }, 1100);
}

function cancelFingerprintHold() {
    if (isSplashUnlocking) return;
    if (!fpHoldTimer && !fpVibrateInterval) return;

    clearFingerprintHoldTimers();
    setFingerprintFeedback(
        '[ TAP & TAHAN FINGERPRINT UNTUK AWAKENING ]',
        'Pemindaian dibatalkan — tahan lagi untuk masuk',
        '#67e8f9',
        false
    );

    if (!isSplashBgmPlaying) {
        startAutoSplashFantasyBGM();
    }
}

function initSplashBgmAutoplay() {
    startAutoSplashFantasyBGM();

    const autoRetryTimer = setInterval(() => {
        if (isSplashUnlocking || isSplashBgmPlaying) {
            clearInterval(autoRetryTimer);
            return;
        }
        if (fpAudioCtx && fpAudioCtx.state === 'suspended') {
            fpAudioCtx.resume().catch(() => {});
        }
        startAutoSplashFantasyBGM();
    }, 300);

    setTimeout(() => clearInterval(autoRetryTimer), 15000);
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initSplashBgmAutoplay();
} else {
    window.addEventListener('DOMContentLoaded', initSplashBgmAutoplay, { once: true });
    window.addEventListener('load', initSplashBgmAutoplay, { once: true });
}

    // ==========================================
// TUTORIAL & GUIDE BUTTON CLICK SOUND EFFECT
// ==========================================
(function initTutorialClickSFX() {
    function playTutorialUISound(type = 'tap') {
        try {
            if (typeof SoundFX !== 'undefined' && typeof SoundFX.play === 'function') {
                SoundFX.play(type);
                return;
            }
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            if (!window._tutAudioCtx) window._tutAudioCtx = new AudioCtx();
            const ctx = window._tutAudioCtx;
            if (ctx.state === 'suspended') ctx.resume();

            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            if (type === 'complete') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, now);
                osc.frequency.setValueAtTime(783.99, now + 0.07);
                gain.gain.setValueAtTime(0.14, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.23);
            } else {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(660, now);
                osc.frequency.exponentialRampToValueAtTime(980, now + 0.055);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.085);
            }
        } catch (e) {}
    }

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('button, [role="button"]');
        if (!btn) return;

        const isTutorialElement =
            btn.closest('[id*="tutorial" i], [class*="tutorial" i], [id*="guide" i], [class*="guide" i], [id*="onboarding" i]') ||
            (btn.id && /tutorial|guide|onboarding/i.test(btn.id)) ||
            (btn.getAttribute('onclick') && /tutorial|guide/i.test(btn.getAttribute('onclick')));

        if (!isTutorialElement) return;

        const label = (btn.textContent || '').trim().toLowerCase();
        const isFinishBtn = /selesai|finish|mulai|start|tutup|close|mengerti|got it|完了|閉じる/.test(label);

        playTutorialUISound(isFinishBtn ? 'complete' : 'tap');
    }, true);
})();

function finishFingerprintUnlock() {
    const pad = document.getElementById('btn-fingerprint-auth');
    const icon = document.getElementById('fp-svg-icon');
    const statusText = document.getElementById('fp-status-text');
    const subText = document.getElementById('fp-sub-text');
    const splash = document.getElementById('system-splash-screen');

    if (typeof playBiometricAudio === 'function') playBiometricAudio('success');
    if (typeof triggerFingerprintVibrate === 'function') triggerFingerprintVibrate([60, 45, 120], 'complete');

    if (pad) {
        pad.classList.remove('scanning');
        pad.classList.add('verified');
    }
    if (icon) icon.setAttribute('stroke', '#34d399');
    if (statusText) {
        statusText.textContent = '[ AKSES DITERIMA • SELAMAT DATANG HUNTER ]';
        statusText.style.color = '#34d399';
    }
    if (subText) {
        subText.textContent = 'Memasuki antarmuka SYSTEM RPG...';
    }

    setTimeout(() => {
        if (splash) splash.classList.add('fade-out');
        setTimeout(() => {
            if (splash) splash.style.display = 'none';
            setTimeout(showPendingDailyReport, 60);
        }, 680);
    }, 450);
}

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
            '[ TAP & TAHAN FINGERPRINT UNTUK AWAKENING ]': '[ TOUCH AND HOLD THE FINGERPRINT TO AWAKEN ]',
            '[ MEMINDAI BIOMETRIK... TAHAN ]': '[ SCANNING BIOMETRICS... KEEP HOLDING ]',
            '[ AWAKENING CONFIRMED ]': '[ AWAKENING CONFIRMED ]',
            'Jangan lepaskan sidik jari hingga verifikasi selesai': 'Keep holding your finger until verification is complete',
            'Pemindaian dibatalkan — tahan lagi untuk masuk': 'Scan cancelled — touch and hold again to enter',
            'Memuat antarmuka Hunter...': 'Loading Hunter interface...',
            'Memasuki antarmuka SYSTEM RPG...': 'Entering the SYSTEM RPG interface...',
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
            'ANCIENT GRIMOIRE // PDF READER': 'ANCIENT GRIMOIRE // PDF READER',
            'Pilih file .PDF dari HP untuk membaca sambil timer fokus berjalan. Halaman terakhir otomatis tersimpan saat menekan 🔖 Tandai Hal Ini.': 'Select a .PDF file from your phone to read while the focus timer runs. The last page is saved automatically when you press 🔖 Bookmark Page.',
            'Pilih file .PDF dari HP untuk membaca sambil timer fokus berjalan. Halaman terakhir otomatis tersimpan saat kamu menekan 🔖 Tandai Hal Ini.': 'Select a .PDF file from your phone to read while the focus timer runs. The last page is saved automatically when you press 🔖 Bookmark Page.',
            'Pilih file': 'Select a .PDF file from your phone to read while the focus timer runs. The last page is saved automatically when you press 🔖 Bookmark Page.',
            'dari HP untuk membaca sambil timer fokus berjalan. Halaman terakhir otomatis tersimpan saat menekan': '',
            'dari HP untuk membaca sambil timer fokus berjalan. Halaman terakhir otomatis tersimpan saat kamu menekan': '',
            
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
            '🌐 Bahasa Antarmuka (Language)': '🌐 Interface Language',
            'Daily Habit (Target Streak)': 'Daily Habits (Streak Goal)',
            'Rasio Masuk:': 'Income Ratio:',
            'Keluar:': 'Outflow:',
            'Job / Class Hunter': 'Hunter Job / Class',
            'Contoh: Shadow Monarch': 'Example: Shadow Monarch',
            '1. Hal yang disyukuri / pencapaian hari ini:': '1. What I am grateful for / today\'s achievement:',
            '2. Fokus evaluasi untuk besok:': '2. Focus for tomorrow\'s review:',
            'HUNTER PORTRAIT': 'HUNTER PORTRAIT',
            'HUNTER RANK ROADMAP': 'HUNTER RANK ROADMAP',
            '🇬🇧 English (Bahasa Inggris)': '🇬🇧 English',
            '🇯🇵 Japanese (Bahasa Jepang)': '🇯🇵 Japanese',
            'HUNTER BIOMETRIC GATE': 'HUNTER BIOMETRIC GATE',
            'Target': 'Goal',
            '🎲 BUKA PETI MISTERI (150 GOLD)': '🎲 OPEN MYSTERY CHEST (150 GOLD)'
        },
        ja: {
            '[ TAP FINGERPRINT UNTUK AWAKENING ]': '[ 指紋をタップして覚醒する ]',
            '[ TAP & TAHAN FINGERPRINT UNTUK AWAKENING ]': '[ 指紋を長押しして覚醒する ]',
            '[ MEMINDAI BIOMETRIK... TAHAN ]': '[ 生体認証中...そのまま押し続けてください ]',
            '[ AWAKENING CONFIRMED ]': '[ 覚醒を確認しました ]',
            'Jangan lepaskan sidik jari hingga verifikasi selesai': '認証が完了するまで指を離さないでください',
            'Pemindaian dibatalkan — tahan lagi untuk masuk': 'スキャンがキャンセルされました。もう一度長押ししてください',
            'Memuat antarmuka Hunter...': 'ハンターインターフェースを読み込んでいます...',
            'Memasuki antarmuka SYSTEM RPG...': 'SYSTEM RPGの画面に移動しています...',
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
            'ANCIENT GRIMOIRE // PDF READER': '古代の魔導書 // PDFリーダー',
            'Pilih file .PDF dari HP untuk membaca sambil timer fokus berjalan. Halaman terakhir otomatis tersimpan saat menekan 🔖 Tandai Hal Ini.': '端末から .PDF ファイルを選択して集中タイマー中に閲覧できます。🔖 このページを保存 を押すと最後のページが自動保存されます。',
            'Pilih file .PDF dari HP untuk membaca sambil timer fokus berjalan. Halaman terakhir otomatis tersimpan saat kamu menekan 🔖 Tandai Hal Ini.': '端末から .PDF ファイルを選択して集中タイマー中に閲覧できます。🔖 このページを保存 を押すと最後のページが自動保存されます。',
            'Pilih file': '端末から .PDF ファイルを選択して集中タイマー中に閲覧できます。🔖 このページを保存 を押すと最後のページが自動保存されます。',
            'dari HP untuk membaca sambil timer fokus berjalan. Halaman terakhir otomatis tersimpan saat menekan': '',
            'dari HP untuk membaca sambil timer fokus berjalan. Halaman terakhir otomatis tersimpan saat kamu menekan': '',
            'Belum ada file PDF dibuka': 'PDFファイルがまだ開かれていません',
            'Ketuk tombol "Buka PDF" di atas untuk memilih materi bacaan': '上の「PDFを開く」をタップして教材を選択してください',
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
            '🌐 Bahasa Antarmuka (Language)': '🌐 表示言語 (Language)',
            'Daily Habit (Target Streak)': '毎日の習慣（ストリーク目標）',
            'Rasio Masuk:': '収入比率:',
            'Keluar:': '支出:',
            'Job / Class Hunter': 'ハンターの職業／クラス',
            'Contoh: Shadow Monarch': '例：シャドウ・モナーク',
            '1. Hal yang disyukuri / pencapaian hari ini:': '1. 感謝したこと／今日の達成:',
            '2. Fokus evaluasi untuk besok:': '2. 明日の振り返りポイント:',
            'HUNTER PORTRAIT': 'ハンターポートレート',
            'HUNTER RANK ROADMAP': 'ハンターランク進行表',
            '🇬🇧 English (Bahasa Inggris)': '🇬🇧 英語',
            '🇯🇵 Japanese (Bahasa Jepang)': '🇯🇵 日本語',
            'HUNTER BIOMETRIC GATE': 'ハンター生体認証ゲート',
            'Target': '目標',
            '🎲 BUKA PETI MISTERI (150 GOLD)': '🎲 ミステリーチェストを開く (150 GOLD)'
        }
    };

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
                    const total = el.querySelector('#total-titles-count')?.textContent || String(TITLES_CATALOG.length);
                    return `Switch Title (<span id="unlocked-titles-count">${count}</span>/<span id="total-titles-count">${total}</span>)`;
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
                subMatch: 'timer fokus berjalan',
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
                    const total = el.querySelector('#total-titles-count')?.textContent || String(TITLES_CATALOG.length);
                    return `称号変更 (<span id="unlocked-titles-count">${count}</span>/<span id="total-titles-count">${total}</span>)`;
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
                subMatch: 'timer fokus berjalan',
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
            { regex: /\bNominal\b/g, replace: 'Amount' },

            // --- TAMBAHAN BARU: TREASURY & PDF READER ---
            { regex: /Makan & Jajan/g, replace: 'Food & Snacks' },
            { regex: /Transportasi/g, replace: 'Transportation' },
            { regex: /Belanja & Kebutuhan/g, replace: 'Shopping & Essentials' },
            { regex: /Tagihan & Kuota/g, replace: 'Bills & Mobile Data' },
            { regex: /Edukasi & Buku/g, replace: 'Education & Books' },
            { regex: /Hiburan/g, replace: 'Entertainment' },
            { regex: /Kesehatan/g, replace: 'Health' },
            { regex: /Lainnya/g, replace: 'Others' },
            { regex: /Gaji \/ Honor/g, replace: 'Salary / Wages' },
            { regex: /Bonus \/ Hadiah/g, replace: 'Bonus / Gift' },
            { regex: /Usaha \/ Freelance/g, replace: 'Business / Freelance' },
            { regex: /Pemasukan Lain/g, replace: 'Other Income' },
            { regex: /Filter Tanggal:/g, replace: 'Filter Date:' },
            { regex: /Filter Bulan:/g, replace: 'Filter Month:' },
            { regex: /Filter Tahun:/g, replace: 'Filter Year:' },
            { regex: /Belum ada pengeluaran pada periode ini\./g, replace: 'No expenses in this period yet.' },
            { regex: /Tidak ada transaksi pada periode ini\./g, replace: 'No transactions in this period.' },
            { regex: /Belum ada file PDF dibuka/g, replace: 'No PDF file opened yet' },
            { regex: /Ketuk tombol "Buka PDF" di atas untuk memilih materi bacaan/g, replace: 'Tap "Open PDF" above to select reading material' },
            { regex: /\bHal\s+(\d+)\s*\/\s*(\d+)/gi, replace: 'Page $1 / $2' }
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
            { regex: /\bNominal\b/g, replace: '金額' },

            // --- TAMBAHAN BARU: TREASURY & PDF READER ---
            { regex: /Makan & Jajan/g, replace: '食事・おやつ' },
            { regex: /Transportasi/g, replace: '交通費' },
            { regex: /Belanja & Kebutuhan/g, replace: '買い物・日用品' },
            { regex: /Tagihan & Kuota/g, replace: '公共料金・通信費' },
            { regex: /Edukasi & Buku/g, replace: '教育・書籍' },
            { regex: /Hiburan/g, replace: '娯楽・エンタメ' },
            { regex: /Kesehatan/g, replace: '健康・医療' },
            { regex: /Lainnya/g, replace: 'その他' },
            { regex: /Gaji \/ Honor/g, replace: '給与・報酬' },
            { regex: /Bonus \/ Hadiah/g, replace: 'ボーナス・賞与' },
            { regex: /Usaha \/ Freelance/g, replace: '事業・フリーランス' },
            { regex: /Pemasukan Lain/g, replace: 'その他の収入' },
            { regex: /Filter Tanggal:/g, replace: '日付フィルター:' },
            { regex: /Filter Bulan:/g, replace: '月フィルター:' },
            { regex: /Filter Tahun:/g, replace: '年フィルター:' },
            { regex: /Belum ada pengeluaran pada periode ini\./g, replace: 'この期間の支出はまだありません。' },
            { regex: /Tidak ada transaksi pada periode ini\./g, replace: 'この期間の取引はありません。' },
            { regex: /Belum ada file PDF dibuka/g, replace: 'PDFファイルがまだ開かれていません' },
            { regex: /Ketuk tombol "Buka PDF" di atas untuk memilih materi bacaan/g, replace: '上の「PDFを開く」をタップして教材を選択してください' },
            { regex: /\bHal\s+(\d+)\s*\/\s*(\d+)/gi, replace: '$1 / $2 ページ' }
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
            if (el.closest && el.closest('#tutorial-modal')) return;
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
            if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'CANVAS'].includes(node.tagName)) return;
            if (node.id === 'tutorial-modal') return;

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
                        if (added.nodeType === Node.ELEMENT_NODE && added.id !== 'tutorial-modal') {
                            translateMixedHtmlBlocks(added, lang);
                            translateNode(added, lang);
                        } else if (added.nodeType === Node.TEXT_NODE) {
                            translateNode(added, lang);
                        }
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
            try {
                localStorage.setItem(LANG_KEY_PRIMARY, lang);
                localStorage.setItem(LANG_KEY_LEGACY, lang);
            } catch (_e) {}
            document.documentElement.lang = lang;
            window.__v6ActiveLanguage = lang;
            updateLangButtonsHighlight(lang);

            if (document.body) {
                translateMixedHtmlBlocks(document.body, lang);
                translateNode(document.body, lang);
            }
            updateStatusLocaleNodes();
            // Rendered status/history strings use locale-aware templates on the next render.
            if (typeof renderHistory === 'function') renderHistory();
            if (typeof renderStatus === 'function') renderStatus();
            updateStatusLocaleNodes();
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

        try {
            localStorage.setItem(LANG_KEY_PRIMARY, validLang);
            localStorage.setItem(LANG_KEY_LEGACY, validLang);
        } catch (_e) {}
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
        if (typeof V6 !== 'undefined' && V6.refreshLanguage) V6.refreshLanguage();
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

const TUTORIAL_STORAGE_KEY = 'sysrpg_tutorial_v2';

// =========================================================
// SISTEM TUTORIAL MANDIRI (ANTI-GAGAL & MULTI-BAHASA)
// =========================================================
window.TUTORIAL_STORAGE_KEY = 'sysrpg_tutorial_v2';

(function () {
    let tutStep = 0;
    let highlightedEl = null;
    let tutorialLaunchScheduled = false;
    let tutorialIsOpen = false;

    function hasCompletedTutorial() {
        try { return localStorage.getItem(window.TUTORIAL_STORAGE_KEY) === 'true'; }
        catch (_e) { return false; }
    }

    function playTutorialSound(type) {
        try {
            if (typeof SoundFX !== 'undefined' && SoundFX.muted) return;
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            if (!window._tutAudioCtx) window._tutAudioCtx = new AudioCtx();
            const ctx = window._tutAudioCtx;
            if (ctx.state === 'suspended') ctx.resume();
            const now = ctx.currentTime;

            const tones = type === 'finish'
                ? [523.25, 659.25, 783.99, 1046.50]
                : type === 'open'
                ? [440, 587.33]
                : type === 'back'
                ? [420, 340]
                : [520, 660];

            tones.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const start = now + i * 0.055;
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, start);
                gain.gain.setValueAtTime(0.08, start);
                gain.gain.exponentialRampToValueAtTime(0.001, start + 0.13);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(start);
                osc.stop(start + 0.14);
            });
        } catch (e) {}
    }

    function clearTutorialSpotlight() {
        if (highlightedEl) {
            highlightedEl.style.outline = highlightedEl.dataset.prevOutline || '';
            highlightedEl.style.outlineOffset = highlightedEl.dataset.prevOutlineOffset || '';
            highlightedEl.style.boxShadow = highlightedEl.dataset.prevShadow || '';
            highlightedEl.style.position = highlightedEl.dataset.prevPos || '';
            highlightedEl.style.zIndex = highlightedEl.dataset.prevZ || '';
            highlightedEl = null;
        }
    }

    function switchAndHighlightFeature(tabName, targetSelectors) {
        clearTutorialSpotlight();

        if (tabName) {
            if (typeof switchTab === 'function') {
                try { switchTab(tabName); } catch (e) {}
            } else {
                const tabBtn = document.querySelector(`[data-tab="${tabName}"], #tab-${tabName}, button[onclick*="'${tabName}'"]`);
                if (tabBtn) tabBtn.click();
            }
        }

        setTimeout(() => {
            if (!Array.isArray(targetSelectors)) return;
            for (const sel of targetSelectors) {
                const el = document.querySelector(sel);
                if (el && el.offsetParent !== null) {
                    el.dataset.prevOutline = el.style.outline || '';
                    el.dataset.prevOutlineOffset = el.style.outlineOffset || '';
                    el.dataset.prevShadow = el.style.boxShadow || '';
                    el.dataset.prevPos = el.style.position || '';
                    el.dataset.prevZ = el.style.zIndex || '';
                    el.style.outline = '2px solid #22d3ee';
                    el.style.outlineOffset = '3px';
                    el.style.boxShadow = '0 0 24px rgba(34, 211, 238, 0.55)';
                    if (getComputedStyle(el).position === 'static') {
                        el.style.position = 'relative';
                    }
                    el.style.zIndex = '999991';
                    highlightedEl = el;
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    break;
                }
            }
        }, 80);
    }

    const TUT_DATA = {
        id: [
            { tab: 'status', targets: ['#hp-bar', '#player-name-display'], icon: '⚔️', title: '1. Selamat Datang, Hunter!', desc: 'Lihat bagian atas layar: ini adalah profil Hunter, HP (Nyawa), XP, dan atribut STR/INT/WIS/CHR milikmu.', tip: 'Tips: Pantau Level, HP, dan Hunter Rank kamu di tab STATUS ini.' },
            { tab: 'quests', targets: ['#quest-list', '#tab-content-quests'], icon: '📋', title: '2. Quest Board & Daily Habit', desc: 'Tab QUESTS terbuka di atas! Centang misi harianmu di sini. Selesaikan minimal 80% Daily Quest agar Streak aman.', tip: 'Tips: Kamu bisa menambah misi baru atau mengatur jadwal hari aktifnya.' },
            { tab: 'dungeon', targets: ['#dungeon-timer-text', '#tab-content-dungeon'], icon: '⏳', title: '3. Dungeon Deep Focus', desc: 'Ini ruang DUNGEON untuk fokus belajar/kerja, lengkap dengan Grimoire PDF Reader & Anime Lofi Radio di bawahnya.', tip: 'Tips: Jangan menyerah sebelum timer habis agar tidak terkena penalti -10 HP!' },
            { tab: 'shop', targets: ['#shop-items-container', '#tab-content-shop'], icon: '🛒', title: '4. System Shop & Armory', desc: 'Di tab SHOP ini kamu bisa menukar Gold dengan Potion pemulih HP, Relic pasif, Peti Misteri, atau hadiah dunia nyata.', tip: 'Tips: Tingkatkan atribut CHR untuk mendapatkan diskon otomatis di Shop.' },
            { tab: 'treasury', targets: ['#tr-net-balance', '#tab-content-treasury'], icon: '💰', title: '5. Treasury Vault & Grafik', desc: 'Ini brankas keuanganmu! Catat pemasukan/pengeluaran, lihat Pie Chart kategori, dan gunakan kalkulator bawaan.', tip: 'Tips: Mencatat transaksi memberi bonus XP & atribut WIS (maks 3x/hari).' },
            { tab: 'dungeon', targets: ['#dungeon-subtab-flashcard', '#dungeon-mode-flashcard'], icon: '🃏', title: 'Flashcard Arena & Review Terjadwal', desc: 'Buka mode Flashcard di DUNGEON, balik kartunya, lalu nilai: Tidak Tahu (10 menit), Lupa (1 hari), Ingat (3 hari+), Mudah (7 hari+).', tip: 'Review muncul saat jatuh tempo. Gunakan Latihan Bebas untuk mengacak seluruh deck.' },
            { tab: 'status', targets: ['#btn-evaluate-day', '#player-rank-badge'], icon: '🌙', title: '6. Evaluasi Harian', desc: 'Kembali ke tab STATUS: di akhir hari, tekan tombol "Evaluasi & Lanjut Hari" untuk merekap progresmu ke hari berikutnya.', tip: 'Sistem siap. Selamat berjuang naik ke Rank tertinggi, Hunter!' }
        ],
        en: [
            { tab: 'status', targets: ['#hp-bar', '#player-name-display'], icon: '⚔️', title: '1. Welcome, Hunter!', desc: 'Look above: this is your Hunter profile, HP, XP, and STR/INT/WIS/CHR attributes.', tip: 'Tip: Track your Level, HP, and Hunter Rank in the STATUS tab.' },
            { tab: 'quests', targets: ['#quest-list', '#tab-content-quests'], icon: '📋', title: '2. Quest Board & Daily Habits', desc: 'The QUESTS tab is now open above! Check off your missions and complete at least 80% to keep your Streak safe.', tip: 'Tip: You can create custom quests and set specific active days.' },
            { tab: 'dungeon', targets: ['#dungeon-timer-text', '#tab-content-dungeon'], icon: '⏳', title: '3. Dungeon Deep Focus', desc: 'This is the DUNGEON room for distraction-free focus sessions, complete with a PDF Reader and Anime Lofi Radio.', tip: 'Tip: Do not abort early or you will suffer a -10 HP penalty!' },
            { tab: 'shop', targets: ['#shop-items-container', '#tab-content-shop'], icon: '🛒', title: '4. System Shop & Armory', desc: 'In the SHOP tab above, spend earned Gold on HP Potions, passive Relics, Mystery Chests, or real-world rewards.', tip: 'Tip: Level up CHR to unlock automatic Shop discounts.' },
            { tab: 'treasury', targets: ['#tr-net-balance', '#tab-content-treasury'], icon: '💰', title: '5. Treasury Vault & Charts', desc: 'Your financial vault! Log income/expenses, inspect the category Pie Chart, and use the built-in calculator.', tip: 'Tip: Logging transactions grants bonus XP & WIS (up to 3x/day).' },
            { tab: 'dungeon', targets: ['#dungeon-subtab-flashcard', '#dungeon-mode-flashcard'], icon: '🃏', title: 'Flashcard Arena & Spaced Repetition', desc: 'Open Flashcards inside DUNGEON. Flip a card and rate it: No Idea (10 min), Forgot (1 day), Remember (3+ days), Easy (7+ days).', tip: 'Due cards return automatically. Free Practice shuffles the whole deck.' },
            { tab: 'status', targets: ['#btn-evaluate-day', '#player-rank-badge'], icon: '🌙', title: '6. Daily Evaluation', desc: 'Back on STATUS: after the real date changes, tap "Evaluate & Advance Day" to review your progress.', tip: 'System ready. Rise to the highest Rank, Hunter!' }
        ],
        ja: [
            { tab: 'status', targets: ['#hp-bar', '#player-name-display'], icon: '⚔️', title: '1. ようこそ、ハンター！', desc: '上の画面があなたのステータスです。レベル、HP、XP、各能力値を確認できます。', tip: 'ヒント：STATUSタブでレベル、HP、ランクを確認できます。' },
            { tab: 'quests', targets: ['#quest-list', '#tab-content-quests'], icon: '📋', title: '2. クエストボード', desc: 'QUESTSタブが表示されています！毎日のミッションを80%以上達成するとストリークが維持されます。', tip: 'ヒント：新しいクエストや曜日スケジュールも自由に作成できます。' },
            { tab: 'dungeon', targets: ['#dungeon-timer-text', '#tab-content-dungeon'], icon: '⏳', title: '3. ダンジョン集中モード', desc: 'ここは集中タイマーのDUNGEONタブです。PDFリーダーやアニメLo-Fiラジオも利用できます。', tip: 'ヒント：途中で諦めるとHPが10減少するので注意！' },
            { tab: 'shop', targets: ['#shop-items-container', '#tab-content-shop'], icon: '🛒', title: '4. システムショップ', desc: '上のSHOPタブで、獲得したゴールドをHPポーションやレリック、現実のご褒美と交換できます。', tip: 'ヒント：CHRを上げるとショップが割引されます。' },
            { tab: 'treasury', targets: ['#tr-net-balance', '#tab-content-treasury'], icon: '💰', title: '5. トレジャリー（家計簿）', desc: '家計簿タブです！電卓やカテゴリ別円グラフで収入と支出をスマートに管理できます。', tip: 'ヒント：取引を記録するとボーナスXPとWISを獲得できます（1日3回まで）。' },
            { tab: 'dungeon', targets: ['#dungeon-subtab-flashcard', '#dungeon-mode-flashcard'], icon: '🃏', title: 'フラッシュカードと間隔反復', desc: 'DUNGEONの単語カードを開き、答えを見て評価しましょう：わからない（10分）、忘れた（1日）、覚えた（3日以上）、簡単（7日以上）。', tip: '期限になったカードは自動で戻ります。自由練習では全カードがシャッフルされます。' },
            { tab: 'status', targets: ['#btn-evaluate-day', '#player-rank-badge'], icon: '🌙', title: '6. 1日の評価', desc: 'STATUSタブに戻りました。実際の日付が変わった後、「評価して次の日へ」を押して進行状況を確認しましょう。', tip: 'システム準備完了。最高ランクを目指せ、ハンター！' }
        ]
    };

    function detectActiveLang() {
        if (document.getElementById('lang-btn-ja')?.style.borderColor.includes('6, 182, 212') ||
            document.getElementById('lang-btn-ja')?.style.background.includes('8, 51, 68')) return 'ja';
        if (document.getElementById('lang-btn-en')?.style.borderColor.includes('6, 182, 212') ||
            document.getElementById('lang-btn-en')?.style.background.includes('8, 51, 68')) return 'en';

        const saved = (typeof gameState !== 'undefined' && gameState.language) ||
                      localStorage.getItem('system_rpg_lang') ||
                      localStorage.getItem('sysrpg_language') ||
                      localStorage.getItem('sysrpg_lang') ||
                      localStorage.getItem('appLanguage') ||
                      localStorage.getItem('language') ||
                      (typeof currentLang !== 'undefined' ? currentLang : '') ||
                      document.documentElement.lang || 'id';

        if (saved.startsWith('ja')) return 'ja';
        if (saved.startsWith('en')) return 'en';
        return 'id';
    }

    function getSteps() {
        return TUT_DATA[detectActiveLang()] || TUT_DATA.id;
    }

    function updateTutorialTriggerButtonLabel() {
        const lang = detectActiveLang();
        const labels = {
            id: '📖 BANTUAN & PANDUAN HUNTER (TUTORIAL)',
            en: '📖 HUNTER HELP & GUIDE (TUTORIAL)',
            ja: '📖 ハンターガイド＆チュートリアル'
        };
        document.querySelectorAll('#font-settings-modal button').forEach(btn => {
            if ((btn.getAttribute('onclick') || '').includes('openTutorialModal')) {
                btn.textContent = labels[lang] || labels.id;
            }
        });
    }

    function renderBox() {
        const lang = detectActiveLang();
        const steps = getSteps();
        const item = steps[tutStep] || steps[0];
        const box = document.getElementById('sysrpg-force-tutorial');
        if (!box) return;

        const uiText = {
            id: { skip: 'Lewati', prev: '← Kembali', next: 'Lanjut →', done: 'Selesai ✓' },
            en: { skip: 'Skip', prev: '← Back', next: 'Next →', done: 'Finish ✓' },
            ja: { skip: 'スキップ', prev: '← 戻る', next: '次へ →', done: '完了 ✓' }
        }[lang] || { skip: 'Lewati', prev: '← Kembali', next: 'Lanjut →', done: 'Selesai ✓' };

        box.querySelector('#sft-counter').textContent = (tutStep + 1) + ' / ' + steps.length;
        box.querySelector('#sft-icon').textContent = item.icon;
        box.querySelector('#sft-title').textContent = item.title;
        box.querySelector('#sft-desc').textContent = item.desc;
        box.querySelector('#sft-tip').textContent = item.tip;

        box.querySelector('#sft-skip').textContent = uiText.skip;
        const prevBtn = box.querySelector('#sft-prev');
        const nextBtn = box.querySelector('#sft-next');
        prevBtn.textContent = uiText.prev;
        prevBtn.style.visibility = tutStep === 0 ? 'hidden' : 'visible';
        nextBtn.textContent = tutStep === steps.length - 1 ? uiText.done : uiText.next;

        const dots = box.querySelector('#sft-dots');
        dots.innerHTML = steps.map((_, idx) =>
            '<span style="width:' + (idx === tutStep ? '18px' : '7px') + ';height:7px;border-radius:99px;background:' + (idx === tutStep ? '#22d3ee' : '#334155') + ';transition:all .2s;"></span>'
        ).join('');

        switchAndHighlightFeature(item.tab, item.targets);
    }

    function closeTutorialTour(playDoneSound) {
        playTutorialSound(playDoneSound ? 'finish' : 'back');
        clearTutorialSpotlight();
        try { localStorage.setItem(window.TUTORIAL_STORAGE_KEY, 'true'); } catch (_e) {}
        tutorialIsOpen = false;
        const box = document.getElementById('sysrpg-force-tutorial');
        if (box) box.remove();
        if (typeof switchTab === 'function') {
            try { switchTab('status'); } catch (e) {}
        }
    }

    window.openTutorialModal = function (startIndex = 0) {
        // Only automatic onboarding is once; Settings can replay the guided tour.
        if (tutorialIsOpen) return;
        if (typeof startIndex !== 'number') startIndex = 0;
        tutorialIsOpen = true;
        tutorialLaunchScheduled = true;
        playTutorialSound('open');

        const fontModal = document.getElementById('font-settings-modal');
        if (fontModal) fontModal.classList.add('hidden');

        let box = document.getElementById('sysrpg-force-tutorial');
        if (!box) {
            box = document.createElement('div');
            box.id = 'sysrpg-force-tutorial';
            box.setAttribute('style', 'position:fixed;inset:0;width:100vw;height:100vh;background:rgba(2,6,23,0.42);z-index:999999;display:flex;align-items:flex-end;justify-content:center;padding:0.85rem;box-sizing:border-box;');
            box.innerHTML = `
                <div style="width:100%;max-width:420px;background:rgba(15,23,42,0.97);backdrop-filter:blur(10px);border:1.5px solid #22d3ee;border-radius:1rem;padding:1rem 1.15rem;box-shadow:0 -4px 32px rgba(6,182,212,0.4);color:#f8fafc;box-sizing:border-box;font-family:inherit;margin-bottom:0.35rem;">
                    <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #1e293b;padding-bottom:0.55rem;margin-bottom:0.65rem;">
                        <div style="display:flex;align-items:center;gap:8px;">
                            <span id="sft-icon" style="font-size:1.45rem;"></span>
                            <div>
                                <div style="font-size:9px;letter-spacing:0.15em;color:#22d3ee;font-weight:700;">💠 SYSTEM INTERACTIVE TOUR</div>
                                <h3 id="sft-title" style="font-size:14px;font-weight:800;color:#fff;margin:1px 0 0 0;"></h3>
                            </div>
                        </div>
                        <span id="sft-counter" style="font-size:11px;font-weight:700;padding:3px 9px;border-radius:999px;background:#083344;color:#67e8f9;border:1px solid #0e7490;"></span>
                    </div>
                    <div style="text-align:left;padding:0.15rem 0;">
                        <p id="sft-desc" style="font-size:12.5px;color:#e2e8f0;line-height:1.5;margin:0;"></p>
                        <div id="sft-tip" style="margin-top:0.6rem;font-size:11px;color:#67e8f9;background:rgba(8,51,68,0.65);border:1px solid rgba(34,211,238,0.35);border-radius:0.55rem;padding:0.45rem 0.65rem;line-height:1.4;"></div>
                    </div>
                    <div id="sft-dots" style="display:flex;justify-content:center;gap:6px;margin:0.7rem 0;"></div>
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;border-top:1px solid #1e293b;padding-top:0.6rem;">
                        <button type="button" id="sft-skip" style="background:transparent;border:none;color:#94a3b8;font-size:12px;font-weight:700;cursor:pointer;padding:5px 6px;">Lewati</button>
                        <div style="display:flex;gap:8px;">
                            <button type="button" id="sft-prev" style="background:#1e293b;border:1px solid #334155;color:#e2e8f0;font-size:12px;font-weight:700;border-radius:0.6rem;padding:6px 11px;cursor:pointer;">← Kembali</button>
                            <button type="button" id="sft-next" style="background:#06b6d4;border:none;color:#020617;font-size:12px;font-weight:800;border-radius:0.6rem;padding:6px 14px;cursor:pointer;">Lanjut →</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(box);

            box.addEventListener('click', function (e) {
                e.stopPropagation();
            });

            box.querySelector('#sft-skip').onclick = function (e) {
                e.preventDefault();
                e.stopPropagation();
                closeTutorialTour(false);
            };
            box.querySelector('#sft-prev').onclick = function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (tutStep > 0) {
                    playTutorialSound('back');
                    tutStep--;
                    renderBox();
                }
            };
            box.querySelector('#sft-next').onclick = function (e) {
                e.preventDefault();
                e.stopPropagation();
                const total = getSteps().length;
                if (tutStep < total - 1) {
                    playTutorialSound('next');
                    tutStep++;
                    renderBox();
                } else {
                    closeTutorialTour(true);
                }
            };
        }

        tutStep = Math.max(0, Math.min(startIndex, getSteps().length - 1));
        renderBox();
    };

    function checkFirstTimeTutorial() {
        if (hasCompletedTutorial() || tutorialLaunchScheduled || tutorialIsOpen) return;

        const splash = document.getElementById('system-splash-screen');
        const isSplashVisible = splash && splash.style.display !== 'none' && !splash.classList.contains('hidden');
        const scheduleFirstRunTour = () => {
            if (tutorialLaunchScheduled || hasCompletedTutorial()) return;
            tutorialLaunchScheduled = true;
            setTimeout(() => {
                tutorialLaunchScheduled = false;
                if (!hasCompletedTutorial() && !tutorialIsOpen) window.openTutorialModal(0);
            }, 300);
        };

        if (isSplashVisible) {
            const observer = new MutationObserver(() => {
                if (splash.style.display === 'none' || splash.classList.contains('hidden') ||
                    splash.classList.contains('fade-out')) {
                    observer.disconnect();
                    scheduleFirstRunTour();
                }
            });
            observer.observe(splash, { attributes: true, attributeFilter: ['style', 'class'] });
        } else {
            scheduleFirstRunTour();
        }
    }

    document.addEventListener('click', function (e) {
        if (e.target.closest('#sysrpg-force-tutorial')) return;

        const btn = e.target.closest('button');
        if (!btn) return;

        if (btn.id === 'lang-btn-id' || btn.id === 'lang-btn-en' || btn.id === 'lang-btn-ja') {
            setTimeout(updateTutorialTriggerButtonLabel, 50);
            return;
        }

        const onclickStr = btn.getAttribute('onclick') || '';
        const label = (btn.textContent || '').toUpperCase();
        // Only the dedicated Settings tutorial button starts the tour.
        // Avoid hijacking unrelated buttons such as 'Baca Panduan' (Survival Guide).
        if (onclickStr.includes('openTutorialModal')) {
            e.preventDefault();
            e.stopPropagation();
            window.openTutorialModal(0);
        }
    }, true);

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', () => {
            updateTutorialTriggerButtonLabel();
            checkFirstTimeTutorial();
        });
    } else {
        updateTutorialTriggerButtonLabel();
        checkFirstTimeTutorial();
    }
    setTimeout(updateTutorialTriggerButtonLabel, 200);
})();
// ==========================================

// ==========================================
// 18. DUNGEON FLASHCARD STUDY MODULE (EN & JP)
// ==========================================
const FLASHCARD_STORAGE_KEY = 'system_rpg_flashcards_v1';

const DEFAULT_EN_VOCAB_RAW = [["abandon", "meninggalkan / mengabaikan"], ["ability", "kemampuan"], ["able", "mampu / bisa"], ["about", "tentang / sekitar"], ["above", "di atas"], ["accept", "menerima"], ["according", "menurut"], ["account", "akun / rekening / laporan"], ["across", "melintasi / di seberang"], ["act", "bertindak / tindakan"], ["action", "aksi / tindakan"], ["activity", "aktivitas / kegiatan"], ["actually", "sebenarnya / faktanya"], ["add", "menambah"], ["address", "alamat"], ["administration", "administrasi / pengelolaan"], ["admit", "mengakui / mengizinkan masuk"], ["adult", "dewasa"], ["affect", "memengaruhi"], ["after", "setelah"], ["afternoon", "siang / sore hari"], ["again", "lagi / kembali"], ["against", "melawan / menentang"], ["age", "usia / umur / zaman"], ["agency", "agensi / lembaga"], ["agent", "agen / perwakilan"], ["ago", "yang lalu"], ["agree", "setuju"], ["agreement", "kesepakatan / perjanjian"], ["ahead", "di depan / ke depan"], ["air", "udara"], ["all", "semua / seluruh"], ["allow", "mengizinkan / membolehkan"], ["almost", "hampir"], ["alone", "sendirian / sendiri"], ["along", "sepanjang / bersama-sama"], ["already", "sudah / telah"], ["also", "juga"], ["although", "meskipun / walaupun"], ["always", "selalu"], ["among", "di antara (banyak)"], ["amount", "jumlah"], ["analysis", "analisis"], ["and", "dan"], ["animal", "hewan / binatang"], ["another", "yang lain / satu lagi"], ["answer", "jawaban / menjawab"], ["any", "apa saja / beberapa"], ["anyone", "siapa pun"], ["anything", "apa pun"], ["appear", "muncul / tampak"], ["apply", "menerapkan / melamar"], ["approach", "pendekatan / mendekati"], ["area", "area / wilayah / bidang"], ["argue", "berdebat / berargumen"], ["arm", "lengan / senjata"], ["around", "di sekitar / kira-kira"], ["arrive", "tiba / sampai"], ["art", "seni"], ["article", "artikel / pasal / barang"], ["artist", "seniman"], ["as", "sebagai / saat / karena"], ["ask", "bertanya / meminta"], ["assume", "mengasumsikan / menduga"], ["at", "di / pada"], ["attack", "menyerang / serangan"], ["attention", "perhatian"], ["attorney", "pengacara / kuasa hukum"], ["audience", "audiens / penonton"], ["author", "penulis"], ["authority", "otoritas / wewenang"], ["available", "tersedia"], ["avoid", "menghindari"], ["away", "jauh / pergi"], ["baby", "bayi"], ["back", "punggung / belakang / kembali"], ["bad", "buruk / jelek"], ["bag", "tas / kantong"], ["ball", "bola"], ["bank", "bank / tepi sungai"], ["bar", "batang / palang / kedai"], ["base", "dasar / pangkalan"], ["be", "menjadi / ada / adalah"], ["beat", "mengalahkan / memukul"], ["beautiful", "indah / cantik"], ["because", "karena"], ["become", "menjadi"], ["bed", "tempat tidur / kasur"], ["before", "sebelum / di depan"], ["begin", "mulai / memulai"], ["behavior", "perilaku / tingkah laku"], ["behind", "di belakang"], ["believe", "percaya / yakin"], ["benefit", "manfaat / keuntungan"], ["best", "terbaik"], ["better", "lebih baik"], ["between", "di antara (dua)"], ["beyond", "di luar / melampaui"], ["big", "besar"], ["bill", "tagihan / uang kertas"], ["billion", "miliar"], ["bit", "sedikit / keping"], ["black", "hitam"], ["blood", "darah"], ["blue", "biru"], ["board", "papan / dewan"], ["body", "tubuh / badan"], ["book", "buku / memesan"], ["born", "lahir"], ["both", "keduanya"], ["box", "kotak"], ["boy", "anak laki-laki"], ["break", "istirahat / memecahkan"], ["bring", "membawa"], ["brother", "saudara laki-laki"], ["budget", "anggaran"], ["build", "membangun"], ["building", "bangunan / gedung"], ["business", "bisnis / usaha"], ["but", "tetapi / namun"], ["buy", "membeli"], ["by", "oleh / dekat / dengan"], ["call", "menelepon / memanggil"], ["camera", "kamera"], ["campaign", "kampanye"], ["can", "bisa / dapat / kaleng"], ["candidate", "kandidat / calon"], ["capital", "ibu kota / modal"], ["car", "mobil"], ["card", "kartu"], ["care", "peduli / perawatan"], ["career", "karier"], ["carry", "membawa / mengangkut"], ["case", "kasus / kotak"], ["catch", "menangkap"], ["cause", "penyebab / menyebabkan"], ["cell", "sel / ponsel"], ["center", "pusat / tengah"], ["central", "pusat / utama"], ["century", "abad"], ["certain", "pasti / tertentu"], ["certainly", "tentu saja / pasti"], ["chair", "kursi"], ["challenge", "tantangan / menantang"], ["chance", "kesempatan / peluang"], ["change", "perubahan / mengubah"], ["character", "karakter / tokoh / sifat"], ["charge", "biaya / mengisi daya / menuduh"], ["check", "memeriksa / tagihan / cek"], ["child", "anak"], ["choice", "pilihan"], ["choose", "memilih"], ["church", "gereja"], ["citizen", "warga negara"], ["city", "kota"], ["civil", "sipil"], ["claim", "klaim / mengklaim / menyatakan"], ["class", "kelas"], ["clear", "jelas / jernih / membersihkan"], ["clearly", "dengan jelas"], ["close", "dekat / menutup"], ["coach", "pelatih / melatih"], ["cold", "dingin / pilek"], ["collection", "koleksi / kumpulan"], ["college", "perguruan tinggi / kampus"], ["color", "warna"], ["come", "datang"], ["commercial", "komersial / iklan"], ["common", "umum / biasa"], ["community", "komunitas / masyarakat"], ["company", "perusahaan"], ["compare", "membandingkan"], ["computer", "komputer"], ["concern", "kekhawatiran / menyangkut"], ["condition", "kondisi / syarat"], ["conference", "konferensi"], ["consider", "mempertimbangkan / menganggap"], ["consumer", "konsumen"], ["contain", "berisi / mengandung"], ["continue", "melanjutkan / berlanjut"], ["control", "kendali / mengendalikan"], ["cost", "biaya / berharga"], ["could", "bisa / dapat (lampau/sopan)"], ["country", "negara / pedesaan"], ["couple", "pasangan / beberapa"], ["course", "kursus / jalur / tentu"], ["court", "pengadilan / lapangan"], ["cover", "menutupi / sampul"], ["create", "menciptakan / membuat"], ["crime", "kejahatan / tindak pidana"], ["cultural", "budaya (kata sifat)"], ["culture", "budaya"], ["cup", "cangkir / piala"], ["current", "saat ini / arus"], ["customer", "pelanggan"], ["cut", "memotong / potongan"], ["dark", "gelap"], ["data", "data"], ["daughter", "anak perempuan"], ["day", "hari / siang"], ["dead", "mati"], ["deal", "kesepakatan / menangani"], ["death", "kematian"], ["debate", "debat / perdebatan"], ["decade", "dekade (10 tahun)"], ["decide", "memutuskan"], ["decision", "keputusan"], ["deep", "dalam"], ["defense", "pertahanan / pembelaan"], ["degree", "derajat / gelar"], ["democratic", "demokratis"], ["describe", "menggambarkan / menjelaskan"], ["design", "desain / merancang"], ["despite", "meskipun"], ["detail", "detail / rincian"], ["determine", "menentukan"], ["develop", "mengembangkan / berkembang"], ["development", "perkembangan / pembangunan"], ["die", "meninggal / mati"], ["difference", "perbedaan"], ["different", "berbeda"], ["difficult", "sulit / susah"], ["dinner", "makan malam"], ["direction", "arah / petunjuk"], ["director", "direktur / sutradara"], ["discover", "menemukan"], ["discuss", "mendiskusikan / membahas"], ["discussion", "diskusi / pembahasan"], ["disease", "penyakit"], ["do", "melakukan / mengerjakan"], ["doctor", "dokter"], ["dog", "anjing"], ["door", "pintu"], ["down", "bawah / turun"], ["draw", "menggambar / menarik"], ["dream", "mimpi / bermimpi"], ["drive", "mengemudi / menyetir"], ["drop", "menjatuhkan / tetes"], ["drug", "obat / narkotika"], ["during", "selama"], ["each", "setiap / masing-masing"], ["early", "awal / dini"], ["east", "timur"], ["easy", "mudah / gampang"], ["eat", "makan"], ["economic", "ekonomi (kata sifat)"], ["economy", "perekonomian / ekonomi"], ["edge", "tepi / pinggir / ujung"], ["education", "pendidikan"], ["effect", "efek / dampak"], ["effort", "usaha / upaya"], ["eight", "delapan"], ["either", "salah satu / juga tidak"], ["election", "pemilihan umum"], ["else", "lain / lagi"], ["employee", "karyawan / pegawai"], ["end", "akhir / berakhir"], ["energy", "energi"], ["enjoy", "menikmati"], ["enough", "cukup"], ["enter", "masuk / memasukkan"], ["entire", "seluruh / keseluruhan"], ["environment", "lingkungan"], ["environmental", "lingkungan (kata sifat)"], ["especially", "terutama / khususnya"], ["establish", "mendirikan / menetapkan"], ["even", "bahkan / genap / rata"], ["evening", "malam / petang"], ["event", "acara / peristiwa"], ["ever", "pernah"], ["every", "setiap"], ["everybody", "setiap orang / semua orang"], ["everyone", "setiap orang"], ["everything", "segalanya / semuanya"], ["evidence", "bukti"], ["exactly", "tepatnya / persis"], ["example", "contoh"], ["executive", "eksekutif"], ["exist", "ada / eksis"], ["expect", "mengharapkan / menduga"], ["experience", "pengalaman / mengalami"], ["expert", "ahli / pakar"], ["explain", "menjelaskan"], ["eye", "mata"], ["face", "wajah / menghadapi"], ["fact", "fakta"], ["factor", "faktor"], ["fail", "gagal"], ["fall", "jatuh / musim gugur"], ["family", "keluarga"], ["far", "jauh"], ["fast", "cepat / puasa"], ["father", "ayah"], ["fear", "ketakutan / takut"], ["federal", "federal"], ["feel", "merasa / merasakan"], ["feeling", "perasaan"], ["few", "sedikit / beberapa"], ["field", "lapangan / bidang"], ["fight", "bertarung / berkelahi"], ["figure", "sosok / angka / figur"], ["fill", "mengisi"], ["film", "film"], ["final", "akhir / terakhir"], ["finally", "akhirnya"], ["financial", "keuangan / finansial"], ["find", "menemukan"], ["fine", "baik-baik saja / denda / halus"], ["finger", "jari"], ["finish", "selesai / menyelesaikan"], ["fire", "api / kebakaran / memecat"], ["firm", "perusahaan / tegas / kokoh"], ["first", "pertama"], ["fish", "ikan / memancing"], ["five", "lima"], ["floor", "lantai"], ["fly", "terbang / lalat"], ["focus", "fokus"], ["follow", "mengikuti"], ["food", "makanan"], ["foot", "kaki"], ["for", "untuk / selama"], ["force", "kekuatan / memaksa"], ["foreign", "asing / luar negeri"], ["forget", "lupa / melupakan"], ["form", "bentuk / formulir / membentuk"], ["former", "mantan / sebelumnya"], ["forward", "maju / ke depan"], ["four", "empat"], ["free", "gratis / bebas"], ["friend", "teman"], ["from", "dari"], ["front", "depan"], ["full", "penuh / kenyang"], ["fund", "dana / mendanai"], ["future", "masa depan"], ["game", "permainan / pertandingan"], ["garden", "taman / kebun"], ["gas", "gas / bensin"], ["general", "umum / jenderal"], ["generation", "generasi"], ["get", "mendapatkan / menjadi"], ["girl", "anak perempuan / gadis"], ["give", "memberi"], ["glass", "gelas / kaca"], ["go", "pergi"], ["goal", "tujuan / gol"], ["good", "baik / bagus"], ["government", "pemerintah"], ["great", "hebat / besar / luar biasa"], ["green", "hijau"], ["ground", "tanah / dasar"], ["group", "kelompok / grup"], ["grow", "tumbuh / menanam"], ["growth", "pertumbuhan"], ["guess", "menebak / tebakan"], ["gun", "senjata api / pistol"], ["guy", "pria / orang"], ["hair", "rambut"], ["half", "setengah"], ["hand", "tangan / menyerahkan"], ["hang", "menggantung"], ["happen", "terjadi"], ["happy", "senang / bahagia"], ["hard", "keras / sulit"], ["have", "memiliki / mempunyai"], ["he", "dia (laki-laki)"], ["head", "kepala / memimpin"], ["health", "kesehatan"], ["hear", "mendengar"], ["heart", "hati / jantung"], ["heat", "panas / memanaskan"], ["heavy", "berat"], ["help", "membantu / bantuan"], ["her", "dia (perempuan - objek/milik)"], ["here", "di sini"], ["herself", "dirinya sendiri (perempuan)"], ["high", "tinggi"], ["him", "dia (laki-laki - objek)"], ["himself", "dirinya sendiri (laki-laki)"], ["his", "miliknya (laki-laki)"], ["history", "sejarah"], ["hit", "memukul / mengenai"], ["hold", "memegang / menahan"], ["home", "rumah / kampung halaman"], ["hope", "harapan / berharap"], ["hospital", "rumah sakit"], ["hot", "panas / pedas"], ["hotel", "hotel"], ["hour", "jam"], ["house", "rumah"], ["how", "bagaimana / berapa"], ["however", "namun / bagaimanapun"], ["huge", "sangat besar / raksasa"], ["human", "manusia"], ["hundred", "ratus"], ["husband", "suami"], ["I", "saya / aku"], ["idea", "ide / gagasan"], ["identify", "mengidentifikasi"], ["if", "jika / apabila"], ["image", "gambar / citra"], ["imagine", "membayangkan"], ["impact", "dampak"], ["important", "penting"], ["improve", "meningkatkan / memperbaiki"], ["in", "di dalam / pada"], ["include", "termasuk / mencakup"], ["including", "termasuk"], ["increase", "meningkat / peningkatan"], ["indeed", "memang / sungguh"], ["indicate", "menunjukkan / mengindikasikan"], ["individual", "individu / perorangan"], ["industry", "industri"], ["information", "informasi"], ["inside", "di dalam"], ["instead", "sebagai gantinya / melainkan"], ["institution", "institusi / lembaga"], ["interest", "minat / bunga bank / kepentingan"], ["interesting", "menarik"], ["international", "internasional"], ["interview", "wawancara"], ["into", "ke dalam"], ["investment", "investasi"], ["involve", "melibatkan"], ["issue", "masalah / isu / terbitan"], ["it", "itu / ia (benda/hewan)"], ["item", "barang / butir"], ["its", "miliknya (benda/hewan)"], ["itself", "dirinya sendiri (benda)"], ["job", "pekerjaan"], ["join", "bergabung"], ["just", "hanya / baru saja / adil"], ["keep", "menjaga / menyimpan / tetap"], ["key", "kunci / utama"], ["kid", "anak / bocah"], ["kill", "membunuh"], ["kind", "baik hati / jenis"], ["kitchen", "dapur"], ["know", "tahu / mengetahui / kenal"], ["knowledge", "pengetahuan"], ["land", "tanah / daratan / mendarat"], ["language", "bahasa"], ["large", "besar / luas"], ["last", "terakhir / lalu / bertahan"], ["late", "terlambat / larut"], ["later", "nanti / kemudian"], ["laugh", "tertawa"], ["law", "hukum / undang-undang"], ["lawyer", "pengacara"], ["lay", "meletakkan / berbaring"], ["lead", "memimpin / petunjuk"], ["leader", "pemimpin"], ["learn", "belajar"], ["least", "paling sedikit"], ["leave", "meninggalkan / pergi / cuti"], ["left", "kiri / tersisa"], ["leg", "kaki / tungkai"], ["legal", "sah / hukum"], ["less", "lebih sedikit / kurang"], ["let", "membiarkan / mengizinkan"], ["letter", "surat / huruf"], ["level", "tingkat / level"], ["lie", "berbohong / berbaring"], ["life", "kehidupan / hidup"], ["light", "cahaya / ringan / terang"], ["like", "suka / seperti"], ["likely", "kemungkinan besar"], ["line", "garis / antrean / jalur"], ["list", "daftar"], ["listen", "mendengarkan"], ["little", "kecil / sedikit"], ["live", "tinggal / hidup / langsung"], ["local", "lokal / setempat"], ["long", "panjang / lama"], ["look", "melihat / tampak"], ["lose", "kalah / kehilangan"], ["loss", "kerugian / kehilangan"], ["lot", "banyak"], ["love", "cinta / mencintai"], ["low", "rendah"], ["machine", "mesin"], ["magazine", "majalah"], ["main", "utama"], ["maintain", "memelihara / mempertahankan"], ["major", "utama / besar / jurusan"], ["majority", "mayoritas"], ["make", "membuat"], ["man", "pria / laki-laki / manusia"], ["manage", "mengelola / berhasil"], ["management", "manajemen / pengelolaan"], ["manager", "manajer"], ["many", "banyak (bisa dihitung)"], ["market", "pasar"], ["marriage", "pernikahan"], ["material", "bahan / materi"], ["matter", "masalah / materi / penting"], ["may", "boleh / mungkin / bulan Mei"], ["maybe", "mungkin"], ["me", "saya / aku (objek)"]];

const DEFAULT_JP_VOCAB_RAW = [["私", "watashi", "saya / aku"], ["あなた", "anata", "kamu / anda"], ["彼", "kare", "dia (laki-laki)"], ["彼女", "kanojo", "dia (perempuan) / pacar perempuan"], ["私たち", "watashitachi", "kami / kita"], ["人", "hito", "orang / manusia"], ["男", "otoko", "laki-laki / pria"], ["女", "onna", "perempuan / wanita"], ["子供", "kodomo", "anak-anak"], ["赤ちゃん", "akachan", "bayi"], ["家族", "kazoku", "keluarga"], ["父", "chichi", "ayah (saya)"], ["お父さん", "otousan", "ayah / bapak"], ["母", "haha", "ibu (saya)"], ["お母さん", "okaasan", "ibu / mama"], ["兄", "ani", "kakak laki-laki (saya)"], ["お兄さん", "oniisan", "kakak laki-laki"], ["姉", "ane", "kakak perempuan (saya)"], ["お姉さん", "oneesan", "kakak perempuan"], ["弟", "otouto", "adik laki-laki"], ["妹", "imouto", "adik perempuan"], ["祖父", "sofu", "kakek (saya)"], ["おじいさん", "ojiisan", "kakek"], ["祖母", "sobo", "nenek (saya)"], ["おばあさん", "obaasan", "nenek"], ["夫", "otto", "suami"], ["妻", "tsuma", "istri"], ["友達", "tomodachi", "teman"], ["先生", "sensei", "guru / dosen / dokter"], ["学生", "gakusei", "pelajar / mahasiswa"], ["生徒", "seito", "murid / siswa"], ["会社員", "kaishain", "karyawan perusahaan"], ["医者", "isha", "dokter"], ["看護師", "kangoshi", "perawat"], ["警察官", "keisatsukan", "polisi"], ["店員", "ten'in", "pelayan toko / kasir"], ["名前", "namae", "nama"], ["国", "kuni", "negara"], ["日本", "nihon", "Jepang"], ["インドネシア", "indoneshia", "Indonesia"], ["英語", "eigo", "bahasa Inggris"], ["日本語", "nihongo", "bahasa Jepang"], ["言葉", "kotoba", "kata / bahasa"], ["一", "ichi", "satu"], ["二", "ni", "dua"], ["三", "san", "tiga"], ["四", "yon / shi", "empat"], ["五", "go", "lima"], ["六", "roku", "enam"], ["七", "nana / shichi", "tujuh"], ["八", "hachi", "delapan"], ["九", "kyuu / ku", "sembilan"], ["十", "juu", "sepuluh"], ["百", "hyaku", "seratus"], ["千", "sen", "seribu"], ["万", "man", "sepuluh ribu"], ["零 / ゼロ", "rei / zero", "nol"], ["半分", "hanbun", "setengah"], ["全部", "zenbu", "semua / seluruhnya"], ["たくさん", "takusan", "banyak"], ["少し", "sukoshi", "sedikit"], ["時間", "jikan", "waktu / jam"], ["今", "ima", "sekarang"], ["今日", "kyou", "hari ini"], ["昨日", "kinou", "kemarin"], ["一昨日", "ototoi", "kemarin lusa"], ["明日", "ashita", "besok"], ["明後日", "asatte", "lusa"], ["毎日", "mainichi", "setiap hari"], ["朝", "asa", "pagi"], ["今朝", "kesa", "tadi pagi"], ["昼", "hiru", "siang"], ["夕方", "yuugata", "sore"], ["夜", "yoru", "malam"], ["今晩", "konban", "malam ini"], ["週", "shuu", "minggu (pekan)"], ["今週", "konshuu", "minggu ini"], ["先週", "senshuu", "minggu lalu"], ["来週", "raishuu", "minggu depan"], ["毎週", "maishuu", "setiap minggu"], ["月", "tsuki / gatsu", "bulan"], ["今月", "kongetsu", "bulan ini"], ["先月", "sengetsu", "bulan lalu"], ["来月", "raigetsu", "bulan depan"], ["毎年", "maitoshi / mainen", "setiap tahun"], ["今年", "kotoshi", "tahun ini"], ["去年", "kyonen", "tahun lalu"], ["来年", "rainen", "tahun depan"], ["月曜日", "getsuyoubi", "hari Senin"], ["火曜日", "kayoubi", "hari Selasa"], ["水曜日", "suiyoubi", "hari Rabu"], ["木曜日", "mokuyoubi", "hari Kamis"], ["金曜日", "kinyoubi", "hari Jumat"], ["土曜日", "doyoubi", "hari Sabtu"], ["日曜日", "nichiyoubi", "hari Minggu"], ["週末", "shuumatsu", "akhir pekan"], ["休日", "kyuujitsu", "hari libur"], ["誕生日", "tanjoubi", "hari ulang tahun"], ["時", "ji", "pukul / jam"], ["分", "fun / pun", "menit"], ["秒", "byou", "detik"], ["午前", "gozen", "pagi (AM)"], ["午後", "gogo", "siang/sore/malam (PM)"], ["春", "haru", "musim semi"], ["夏", "natsu", "musim panas"], ["秋", "aki", "musim gugur"], ["冬", "fuyu", "musim dingin"], ["天気", "tenki", "cuaca"], ["晴れ", "hare", "cerah"], ["雨", "ame", "hujan"], ["雪", "yuki", "salju"], ["風", "kaze", "angin"], ["雲", "kumo", "awan"], ["空", "sora", "langit"], ["太陽", "taiyou", "matahari"], ["星", "hoshi", "bintang"], ["海", "umi", "laut"], ["山", "yama", "gunung"], ["川", "kawa", "sungai"], ["森", "mori", "hutan"], ["木", "ki", "pohon / kayu"], ["花", "hana", "bunga"], ["草", "kusa", "rumput"], ["石", "ishi", "batu"], ["火", "hi", "api"], ["水", "mizu", "air"], ["土", "tsuchi", "tanah"], ["空気", "kuuki", "udara"], ["動物", "doubutsu", "hewan / binatang"], ["犬", "inu", "anjing"], ["猫", "neko", "kucing"], ["鳥", "tori", "burung"], ["魚", "sakana", "ikan"], ["馬", "uma", "kuda"], ["牛", "ushi", "sapi"], ["豚", "buta", "babi"], ["虫", "mushi", "serangga"], ["体", "karada", "tubuh / badan"], ["頭", "atama", "kepala"], ["顔", "kao", "wajah"], ["髪", "kami", "rambut"], ["目", "me", "mata"], ["耳", "mimi", "telinga"], ["鼻", "hana", "hidung"], ["口", "kuchi", "mulut"], ["歯", "ha", "gigi"], ["首", "kubi", "leher"], ["肩", "kata", "bahu"], ["腕", "ude", "lengan"], ["手", "te", "tangan"], ["指", "yubi", "jari"], ["胸", "mune", "dada"], ["お腹", "onaka", "perut"], ["背中", "senaka", "punggung"], ["足", "ashi", "kaki"], ["心", "kokoro", "hati / pikiran / jiwa"], ["声", "koe", "suara (orang/hewan)"], ["音", "oto", "bunyi / suara (benda)"], ["食べ物", "tabemono", "makanan"], ["飲み物", "nomimono", "minuman"], ["ご飯", "gohan", "nasi / makanan"], ["パン", "pan", "roti"], ["肉", "niku", "daging"], ["鶏肉", "toriniku", "daging ayam"], ["牛肉", "gyuuniku", "daging sapi"], ["卵", "tamago", "telur"], ["野菜", "yasai", "sayuran"], ["果物", "kudamono", "buah-buahan"], ["りんご", "ringo", "apel"], ["バナナ", "banana", "pisang"], ["みかん", "mikan", "jeruk mandarin"], ["お茶", "ocha", "teh (hijau)"], ["紅茶", "koucha", "teh hitam"], ["コーヒー", "koohii", "kopi"], ["牛乳", "gyuunyuu", "susu sapi"], ["お酒", "osake", "minuman beralkohol / sake"], ["砂糖", "satou", "gula"], ["塩", "shio", "garam"], ["醤油", "shouyu", "kecap asin"], ["朝ご飯", "asagohan", "sarapan"], ["昼ご飯", "hirugohan", "makan siang"], ["晩ご飯", "bangohan", "makan malam"], ["料理", "ryouri", "masakan / memasak"], ["味", "aji", "rasa"], ["家", "ie / uchi", "rumah"], ["部屋", "heya", "kamar / ruangan"], ["台所", "daidokoro", "dapur"], ["トイレ", "toire", "toilet / kamar kecil"], ["お風呂", "ofuro", "kamar mandi / bak mandi"], ["玄関", "genkan", "pintu masuk rumah (teras)"], ["庭", "niwa", "halaman / taman rumah"], ["窓", "mado", "jendela"], ["ドア", "doa", "pintu"], ["壁", "kabe", "dinding / tembok"], ["床", "yuka", "lantai"], ["机", "tsukue", "meja tulis / meja belajar"], ["テーブル", "teeburu", "meja makan / meja"], ["椅子", "isu", "kursi"], ["ベッド", "beddo", "tempat tidur"], ["布団", "futon", "kasur lipat Jepang"], ["冷蔵庫", "reizouko", "kulkas"], ["洗濯機", "sentakuki", "mesin cuci"], ["エアコン", "eakon", "AC (pendingin ruangan)"], ["テレビ", "terebi", "televisi"], ["電話", "denwa", "telepon"], ["スマホ", "sumaho", "ponsel pintar (smartphone)"], ["パソコン", "pasokon", "komputer / laptop"], ["カメラ", "kamera", "kamera"], ["時計", "tokei", "jam dinding / jam tangan"], ["鏡", "kagami", "cermin"], ["鍵", "kagi", "kunci"], ["傘", "kasa", "payung"], ["鞄", "kaban", "tas"], ["財布", "saifu", "dompet"], ["お金", "okane", "uang"], ["本", "hon", "buku"], ["辞書", "jisho", "kamus"], ["新聞", "shinbun", "koran / surat kabar"], ["雑誌", "zasshi", "majalah"], ["ノート", "nooto", "buku catatan"], ["紙", "kami", "kertas"], ["手紙", "tegami", "surat"], ["鉛筆", "enpitsu", "pensil"], ["ペン", "pen", "pulpen"], ["消しゴム", "keshigomu", "penghapus"], ["はさみ", "hasami", "gunting"], ["箱", "hako", "kotak"], ["皿", "sara", "piring"], ["コップ", "koppu", "gelas"], ["茶碗", "chawan", "mangkuk nasi"], ["箸", "hashi", "sumpit"], ["スプーン", "supuun", "sendok"], ["フォーク", "fooku", "garpu"], ["服", "fuku", "pakaian / baju"], ["シャツ", "shatsu", "kemeja / kaos"], ["ズボン", "zubon", "celana panjang"], ["スカート", "sukaato", "rok"], ["靴", "kutsu", "sepatu"], ["靴下", "kutsushita", "kaus kaki"], ["帽子", "boushi", "topi"], ["眼鏡", "megane", "kacamata"], ["学校", "gakkou", "sekolah"], ["大学", "daigaku", "universitas"], ["教室", "kyoushitsu", "ruang kelas"], ["図書館", "toshokan", "perpustakaan"], ["病院", "byouin", "rumah sakit"], ["薬局", "yakkyoku", "apotek"], ["銀行", "ginkou", "bank"], ["郵便局", "yuubinkyoku", "kantor pos"], ["駅", "eki", "stasiun"], ["空港", "kuukou", "bandara"], ["バス停", "basutei", "halte bus"], ["店", "mise", "toko"], ["スーパー", "suupaa", "supermarket"], ["コンビニ", "konbini", "minimarket"], ["レストラン", "resutoran", "restoran"], ["喫茶店", "kissaten", "kedai kopi / kafe"], ["ホテル", "hoteru", "hotel"], ["公園", "kouen", "taman kota"], ["映画館", "eigakan", "bioskop"], ["会社", "kaisha", "perusahaan / kantor"], ["工場", "koujou", "pabrik"], ["町", "machi", "kota kecil / distrik"], ["市", "shi", "kota"], ["道", "michi", "jalan"], ["橋", "hashi", "jembatan"], ["角", "kado", "sudut / belokan"], ["場所", "basho", "tempat / lokasi"], ["入り口", "iriguchi", "pintu masuk"], ["出口", "deguchi", "pintu keluar"], ["車", "kuruma", "mobil"], ["電車", "densha", "kereta listrik"], ["地下鉄", "chikatetsu", "kereta bawah tanah"], ["新幹線", "shinkansen", "kereta peluru Jepang"], ["バス", "basu", "bus"], ["タクシー", "takushii", "taksi"], ["自転車", "jitensha", "sepeda"], ["バイク", "baiku", "sepeda motor"], ["飛行機", "hikouki", "pesawat terbang"], ["船", "fune", "kapal / perahu"], ["切符", "kippu", "tiket / karcis"], ["地図", "chizu", "peta"], ["旅行", "ryokou", "perjalanan / wisata"], ["仕事", "shigoto", "pekerjaan"], ["勉強", "benkyou", "belajar"], ["宿題", "shukudai", "pekerjaan rumah (PR)"], ["試験", "shiken", "ujian"], ["質問", "shitsumon", "pertanyaan"], ["答え", "kotae", "jawaban"], ["意味", "imi", "arti / makna"], ["問題", "mondai", "masalah / soal"], ["練習", "renshuu", "latihan"], ["音楽", "ongaku", "musik"], ["歌", "uta", "lagu"], ["映画", "eiga", "film"], ["写真", "shashin", "foto"], ["絵", "e", "gambar / lukisan"], ["スポーツ", "supootsu", "olahraga"], ["サッカー", "sakkaa", "sepak bola"], ["野球", "yakyuu", "bisbol"], ["趣味", "shumi", "hobi"], ["夢", "yume", "mimpi / cita-cita"], ["病気", "byouki", "sakit / penyakit"], ["薬", "kusuri", "obat"], ["怪我", "kega", "luka / cedera"], ["熱", "netsu", "demam / panas"], ["上", "ue", "atas"], ["下", "shita", "bawah"], ["前", "mae", "depan / sebelum"], ["後ろ", "ushiro", "belakang"], ["右", "migi", "kanan"], ["左", "hidari", "kiri"], ["中", "naka", "dalam"], ["外", "soto", "luar"], ["隣", "tonari", "sebelah / tetangga"], ["近く", "chikaku", "dekat / sekitar"], ["間", "aida", "antara"], ["向こう", "mukou", "seberang / sana"], ["北", "kita", "utara"], ["南", "minami", "selatan"], ["東", "higashi", "timur"], ["西", "nishi", "barat"], ["ここ", "koko", "di sini"], ["そこ", "soko", "di situ"], ["あそこ", "asoko", "di sana"], ["どこ", "doko", "di mana"], ["これ", "kore", "ini"], ["それ", "sore", "itu"], ["あれ", "are", "itu (jauh)"], ["どれ", "dore", "yang mana"], ["誰", "dare", "siapa"], ["何", "nani / nan", "apa"], ["いつ", "itsu", "kapan"], ["なぜ / どうして", "naze / doushite", "mengapa / kenapa"], ["どう", "dou", "bagaimana"], ["いくら", "ikura", "berapa (harga)"], ["いくつ", "ikutsu", "berapa banyak / berapa umur"], ["行く", "iku", "pergi"], ["来る", "kuru", "datang"], ["帰る", "kaeru", "pulang / kembali"], ["食べる", "taberu", "makan"], ["飲む", "nomu", "minum"], ["見る", "miru", "melihat / menonton"], ["聞く", "kiku", "mendengar / bertanya"], ["話す", "hanasu", "berbicara"], ["言う", "iu", "berkata / mengatakan"], ["読む", "yomu", "membaca"], ["書く", "kaku", "menulis"], ["買う", "kau", "membeli"], ["売る", "uru", "menjual"], ["作る", "tsukuru", "membuat"], ["使う", "tsukau", "menggunakan"], ["持つ", "motsu", "memegang / memiliki"], ["取る", "toru", "mengambil"], ["あげる", "ageru", "memberi"], ["もらう", "morau", "menerima"], ["貸す", "kasu", "meminjamkan"], ["借りる", "kariru", "meminjam"], ["教える", "oshieru", "mengajar / memberi tahu"], ["習う", "narau", "belajar (dari seseorang)"], ["勉強する", "benkyou suru", "belajar"], ["働く", "hataraku", "bekerja"], ["休む", "yasumu", "beristirahat / libur"], ["寝る", "neru", "tidur"], ["起きる", "okiru", "bangun"], ["座る", "suwaru", "duduk"], ["立つ", "tatsu", "berdiri"], ["歩く", "aruku", "berjalan kaki"], ["走る", "hashiru", "berlari"], ["泳ぐ", "oyogu", "berenang"], ["遊ぶ", "asobu", "bermain"], ["入る", "hairu", "masuk"], ["出る", "deru", "keluar"], ["開ける", "akeru", "membuka"], ["閉める", "shimeru", "menutup"], ["つける", "tsukeru", "menyalakan / memakai"], ["消す", "kesu", "mematikan / menghapus"], ["乗る", "noru", "naik (kendaraan)"], ["降りる", "oriru", "turun (kendaraan)"], ["曲がる", "magaru", "berbelok"], ["渡る", "wataru", "menyeberang"], ["止まる", "tomaru", "berhenti"], ["待つ", "matsu", "menunggu"], ["会う", "au", "bertemu"], ["知る", "shiru", "tahu / mengenal"], ["分かる", "wakaru", "mengerti / paham"], ["忘れる", "wasureru", "lupa"], ["覚える", "oboeru", "mengingat / menghafal"], ["考える", "kangaeru", "berpikir / memikirkan"], ["思う", "omou", "berpikir / merasa / mengira"], ["始める", "hajimeru", "memulai"], ["終わる", "owaru", "selesai / berakhir"], ["洗う", "arau", "mencuci"], ["掃除する", "souji suru", "membersihkan"], ["洗濯する", "sentaku suru", "mencuci pakaian"], ["料理する", "ryouri suru", "memasak"], ["切る", "kiru", "memotong"], ["着る", "kiru", "memakai (baju atasan)"], ["履く", "haku", "memakai (celana/sepatu)"], ["脱ぐ", "nugu", "melepas (pakaian/sepatu)"], ["浴びる", "abiru", "mandi (shower)"], ["磨く", "migaku", "menggosok (gigi/sepatu)"], ["呼ぶ", "yobu", "memanggil / mengundang"], ["頼む", "tanomu", "meminta / memesan"], ["手伝う", "tetsudau", "membantu"], ["送る", "okuru", "mengirim / mengantar"], ["届く", "todoku", "sampai / terkirim"], ["探す", "sagasu", "mencari"], ["見つける", "mitsukeru", "menemukan"], ["なくす", "nakusu", "menghilangkan / kehilangan"], ["置く", "oku", "meletakkan"], ["入れる", "ireru", "memasukkan"], ["出す", "dasu", "mengeluarkan / menyerahkan"], ["押す", "osu", "mendorong / menekan"], ["引く", "hiku", "menarik"], ["飛ぶ", "tobu", "terbang / melompat"], ["登る", "noboru", "mendaki / memanjat"], ["降る", "furu", "turun (hujan/salju)"], ["吹く", "fuku", "bertiup (angin)"], ["咲く", "saku", "mekar (bunga)"], ["死ぬ", "shinu", "mati / meninggal"], ["生まれる", "umareru", "lahir"], ["生きる", "ikiru", "hidup"], ["結婚する", "kekkon suru", "menikah"], ["住む", "sumu", "tinggal / menetap"], ["笑う", "warau", "tertawa / tersenyum"], ["泣く", "naku", "menangis"], ["怒る", "okoru", "marah"], ["喜ぶ", "yorokobu", "bergembira / senang"], ["驚く", "odoroku", "terkejut / kaget"], ["疲れる", "tsukareru", "lelah / capek"], ["急ぐ", "isogu", "terburu-buru"], ["気をつける", "ki o tsukeru", "berhati-hati"], ["頑張る", "ganbaru", "berjuang / semangat"], ["大きい", "ookii", "besar"], ["小さい", "chiisai", "kecil"], ["新しい", "atarashii", "baru"], ["古い", "furui", "lama / tua (benda)"], ["良い / いい", "yoi / ii", "baik / bagus"], ["悪い", "warui", "buruk / jahat"], ["高い", "takai", "tinggi / mahal"], ["安い", "yasui", "murah"], ["低い", "hikui", "rendah"], ["長い", "nagai", "panjang / lama"], ["短い", "mijikai", "pendek / singkat"], ["広い", "hiroi", "luas / lebar"], ["狭い", "semai", "sempit"], ["遠い", "tooi", "jauh"], ["近い", "chikai", "dekat"], ["速い / 早い", "hayai", "cepat / awal"], ["遅い", "osoi", "lambat / terlambat"], ["多い", "ooi", "banyak"], ["少ない", "sukunai", "sedikit"], ["暑い", "atsui", "panas (cuaca)"], ["熱い", "atsui", "panas (benda/air)"], ["寒い", "samui", "dingin (cuaca)"], ["冷たい", "tsumetai", "dingin (benda/minuman)"], ["暖かい", "atatakai", "hangat"], ["涼しい", "suzushii", "sejuk"], ["重い", "omoi", "berat"], ["軽い", "karui", "ringan"], ["強い", "tsuyoi", "kuat"], ["弱い", "yowai", "lemah"], ["難しい", "muzukashii", "sulit / susah"], ["易しい", "yasashii", "mudah / gampang"], ["優しい", "yasashii", "baik hati / ramah"], ["楽しい", "tanoshii", "menyenangkan"], ["嬉しい", "ureshii", "senang / gembira"], ["悲しい", "kanashii", "sedih"], ["怖い", "kowai", "takut / menyeramkan"], ["面白い", "omoshiroi", "menarik / lucu"], ["つまらない", "tsumaranai", "membosankan"], ["忙しい", "isogashii", "sibuk"], ["美味しい", "oishii", "enak / lezat"], ["まずい", "mazui", "tidak enak"], ["甘い", "amai", "manis"], ["辛い", "karai", "pedas"], ["苦い", "nigai", "pahit"], ["酸っぱい", "suppai", "asam / kecut"], ["しょっぱい", "shoppai", "asin"], ["明るい", "akarui", "terang / ceria"], ["暗い", "kurai", "gelap / suram"], ["静か", "shizuka", "tenang / sepi"], ["賑やか", "nigiyaka", "ramai / meriah"], ["綺麗", "kirei", "cantik / bersih / indah"], ["汚い", "kitanai", "kotor"], ["元気", "genki", "sehat / bersemangat"], ["便利", "benri", "praktis / nyaman"], ["不便", "fuben", "tidak praktis"], ["有名", "yuumei", "terkenal"], ["親切", "shinsetsu", "ramah / baik hati"], ["大切", "taisetsu", "penting / berharga"], ["大丈夫", "daijoubu", "tidak apa-apa / baik-baik saja"], ["好き", "suki", "suka"], ["嫌い", "kirai", "benci / tidak suka"], ["上手", "jouzu", "pandai / mahir"], ["下手", "heta", "tidak pandai / payah"], ["白い", "shiroi", "putih"], ["黒い", "kuroi", "hitam"], ["赤い", "akai", "merah"]];

const FC_I18N_MAP = {
    id: {
        subtab_focus: 'Focus Raid & Grimoire',
        subtab_flashcard: 'Flashcard Study (EN / JP)',
        fc_title: 'FLASHCARD ARENA',
        fc_btn_add: 'Kartu Baru',
        fc_filter_all: 'Semua Kartu',
        fc_filter_queue: 'Antrean Sesi',
        fc_filter_mastered: 'Sudah Ingat',
        fc_filter_review: 'Perlu Diulang',
        fc_filter_custom: 'Kartu Custom',
        fc_stat_queue: 'Sisa Antrean',
        fc_stat_mastered: 'Dikuasai',
        fc_stat_repeats: 'Pengulangan',
        fc_btn_edit: 'Edit',
        fc_tap_hint: 'Ketuk kartu untuk melihat arti',
        fc_meaning_lbl: 'ARTI (BAHASA INDONESIA)',
        fc_rate_hint: 'Pilih tingkat ingatan di bawah',
        fc_rate_easy: 'Mudah',
        fc_rate_easy_sub: '7 hari+',
        fc_rate_forgot: 'Lupa',
        fc_rate_forgot_sub: '1 hari',
        fc_rate_dont: 'Tidak Tahu',
        fc_rate_dont_sub: '10 menit',
        fc_rate_remember: 'Ingat',
        fc_rate_remember_sub: '3 hari+',
        fc_btn_restart_session: 'Muat Review Jatuh Tempo',
        fc_free_practice: 'Latihan Bebas (Acak)',
        fc_due_info: 'Kartu yang sudah dijadwalkan muncul lagi saat waktunya tiba.',
        fc_next_due: 'Review berikutnya',
        fc_no_due: 'Belum ada kartu jatuh tempo. Coba lagi nanti atau gunakan Latihan Bebas.',
        fc_form_lang: 'Deck Bahasa',
        fc_form_word: 'Kata / Frasa',
        fc_form_romaji: 'Romaji (Wajib untuk Bahasa Jepang)',
        fc_form_meaning: 'Arti (Bahasa Indonesia)',
        fc_btn_cancel: 'Batal',
        fc_btn_save: 'Simpan Kartu',
        fc_search_ph: 'Cari kata, romaji, atau arti...',
        fc_status_mastered: 'INGAT',
        fc_status_review: 'DIULANG',
        fc_status_new: 'BARU',
        fc_status_custom: 'CUSTOM',
        fc_repeat_prefix: 'Ulang',
        fc_modal_add: '🃏 TAMBAH FLASHCARD',
        fc_modal_edit: '✏️ EDIT FLASHCARD',
        fc_toast_saved: '🃏 Flashcard baru ditambahkan!',
        fc_toast_updated: '✏️ Kartu diperbarui!',
        fc_reset_title: 'SYSTEM WARNING // RESET DECK',
        fc_reset_body: 'Reset seluruh progres hafalan & kembalikan deck',
        fc_reset_suffix: 'ke bawaan awal?',
        fc_reset_cancel: 'BATAL',
        fc_reset_confirm: 'YA, RESET'
    },
    en: {
        subtab_focus: 'Focus Raid & Grimoire',
        subtab_flashcard: 'Flashcard Study (EN / JP)',
        fc_title: 'FLASHCARD ARENA',
        fc_btn_add: 'New Card',
        fc_filter_all: 'All Cards',
        fc_filter_queue: 'Session Queue',
        fc_filter_mastered: 'Remembered',
        fc_filter_review: 'Needs Review',
        fc_filter_custom: 'Custom Cards',
        fc_stat_queue: 'Queue Left',
        fc_stat_mastered: 'Mastered',
        fc_stat_repeats: 'Repeats',
        fc_btn_edit: 'Edit',
        fc_tap_hint: 'Tap card to reveal meaning',
        fc_meaning_lbl: 'MEANING (INDONESIAN)',
        fc_rate_hint: 'Select your recall level below',
        fc_rate_easy: 'Easy',
        fc_rate_easy_sub: '7+ days',
        fc_rate_forgot: 'Forgot',
        fc_rate_forgot_sub: '1 day',
        fc_rate_dont: 'No Idea',
        fc_rate_dont_sub: '10 minutes',
        fc_rate_remember: 'Remember',
        fc_rate_remember_sub: '3+ days',
        fc_btn_restart_session: 'Load Due Reviews',
        fc_free_practice: 'Free Practice (Shuffle)',
        fc_due_info: 'Scheduled cards will return when their review time arrives.',
        fc_next_due: 'Next review',
        fc_no_due: 'No cards are due yet. Come back later or use Free Practice.',
        fc_form_lang: 'Language Deck',
        fc_form_word: 'Word / Phrase',
        fc_form_romaji: 'Romaji (Required for Japanese)',
        fc_form_meaning: 'Meaning (Indonesian)',
        fc_btn_cancel: 'Cancel',
        fc_btn_save: 'Save Card',
        fc_search_ph: 'Search word, romaji, or meaning...',
        fc_status_mastered: 'MASTERED',
        fc_status_review: 'REVIEW',
        fc_status_new: 'NEW',
        fc_status_custom: 'CUSTOM',
        fc_repeat_prefix: 'Repeat',
        fc_modal_add: '🃏 ADD FLASHCARD',
        fc_modal_edit: '✏️ EDIT FLASHCARD',
        fc_toast_saved: '🃏 New flashcard added!',
        fc_toast_updated: '✏️ Card updated!',
        fc_reset_title: 'SYSTEM WARNING // RESET DECK',
        fc_reset_body: 'Reset all memorization progress and restore the deck',
        fc_reset_suffix: 'to its default state?',
        fc_reset_cancel: 'CANCEL',
        fc_reset_confirm: 'YES, RESET'
    },
    ja: {
        subtab_focus: '集中レイド & 魔導書',
        subtab_flashcard: '単語カード学習 (EN / JP)',
        fc_title: 'フラッシュカードアリーナ',
        fc_btn_add: '新規カード',
        fc_filter_all: 'すべてのカード',
        fc_filter_queue: '学習キュー',
        fc_filter_mastered: '習得済み',
        fc_filter_review: '復習が必要',
        fc_filter_custom: 'カスタムカード',
        fc_stat_queue: '残りキュー',
        fc_stat_mastered: '習得数',
        fc_stat_repeats: '反復回数',
        fc_btn_edit: '編集',
        fc_tap_hint: 'タップして意味を表示',
        fc_meaning_lbl: '意味（インドネシア語）',
        fc_rate_hint: '記憶度を選択してください',
        fc_rate_easy: '簡単',
        fc_rate_easy_sub: '7日以上',
        fc_rate_forgot: '忘れた',
        fc_rate_forgot_sub: '1日後',
        fc_rate_dont: 'わからない',
        fc_rate_dont_sub: '10分後',
        fc_rate_remember: '覚えた',
        fc_rate_remember_sub: '3日以上',
        fc_btn_restart_session: '復習カードを読み込む',
        fc_free_practice: '自由練習（シャッフル）',
        fc_due_info: '復習カードは次の予定時刻になると表示されます。',
        fc_next_due: '次の復習',
        fc_no_due: '復習期限のカードはありません。後で戻るか自由練習を選んでください。',
        fc_form_lang: '言語デッキ',
        fc_form_word: '単語・フレーズ',
        fc_form_romaji: 'ローマ字（日本語は必須）',
        fc_form_meaning: '意味（インドネシア語）',
        fc_btn_cancel: 'キャンセル',
        fc_btn_save: '保存する',
        fc_search_ph: '単語・ローマ字・意味を検索...',
        fc_status_mastered: '習得済み',
        fc_status_review: '復習',
        fc_status_new: '新規',
        fc_status_custom: 'カスタム',
        fc_repeat_prefix: '復習',
        fc_modal_add: '🃏 単語カードを追加',
        fc_modal_edit: '✏️ 単語カードを編集',
        fc_toast_saved: '🃏 新しい単語カードを追加しました！',
        fc_toast_updated: '✏️ カードを更新しました！',
        fc_reset_title: 'システム警告 // デッキをリセット',
        fc_reset_body: '暗記の進捗をすべてリセットし、デッキを',
        fc_reset_suffix: '初期状態に戻しますか？',
        fc_reset_cancel: 'キャンセル',
        fc_reset_confirm: 'リセットする'
    }
};

let flashcardState = {
    activeDeck: 'en',
    decks: { en: [], jp: [] },
    queues: { en: [], jp: [] },
    sessionRepeats: { en: 0, jp: 0 },
    isFlipped: false
};

function buildDefaultFlashcardDeck(lang) {
    if (lang === 'en') {
        return DEFAULT_EN_VOCAB_RAW.map((row, idx) => ({
            id: `en_${idx + 1}`,
            no: idx + 1,
            word: row[0],
            romaji: '',
            meaning: row[1],
            status: 'new',
            repeatCount: 0,
            rewardClaimed: false,
            isCustom: false
        }));
    }
    return DEFAULT_JP_VOCAB_RAW.map((row, idx) => ({
        id: `jp_${idx + 1}`,
        no: idx + 1,
        word: row[0],
        romaji: row[1],
        meaning: row[2],
        status: 'new',
        repeatCount: 0,
        rewardClaimed: false,
        isCustom: false
    }));
}

function loadFlashcardState() {
    try {
        const raw = localStorage.getItem(FLASHCARD_STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.decks && Array.isArray(parsed.decks.en) && Array.isArray(parsed.decks.jp) && parsed.decks.en.length > 0 && parsed.decks.jp.length > 0) {
                flashcardState = parsed;
                if (!flashcardState.queues) flashcardState.queues = { en: [], jp: [] };
                if (!flashcardState.sessionRepeats) flashcardState.sessionRepeats = { en: 0, jp: 0 };
                flashcardState.isFlipped = false;
                ensureFlashcardScheduling();
                return;
            }
        }
    } catch (e) {
        console.error('Gagal memuat state flashcard:', e);
    }

    flashcardState.decks.en = buildDefaultFlashcardDeck('en');
    flashcardState.decks.jp = buildDefaultFlashcardDeck('jp');
    ensureFlashcardScheduling();
    saveFlashcardState();
}

function saveFlashcardState() {
    try {
        localStorage.setItem(FLASHCARD_STORAGE_KEY, JSON.stringify(flashcardState));
    } catch (e) {
        console.error('Gagal menyimpan state flashcard:', e);
    }
}

function applyFlashcardLanguage() {
    const uiLang = localStorage.getItem('system_rpg_lang') || localStorage.getItem('sysrpg_lang') || 'id';
    const dict = FC_I18N_MAP[uiLang] || FC_I18N_MAP.id;
    document.querySelectorAll('[data-fc-i18n]').forEach(el => {
        const key = el.getAttribute('data-fc-i18n');
        if (dict[key]) el.textContent = dict[key];
    });
    const searchInput = document.getElementById('fc-search-input');
    if (searchInput && dict.fc_search_ph) {
        searchInput.placeholder = dict.fc_search_ph;
    }
}

function switchDungeonSubMode(mode) {
    if (typeof SoundFX !== 'undefined' && SoundFX.playClick) SoundFX.playClick();
    const focusPane = document.getElementById('dungeon-mode-focus');
    const fcPane = document.getElementById('dungeon-mode-flashcard');
    const btnFocus = document.getElementById('dungeon-subtab-focus');
    const btnFc = document.getElementById('dungeon-subtab-flashcard');
    if (!focusPane || !fcPane) return;

    if (mode === 'flashcard') {
        focusPane.classList.add('hidden');
        fcPane.classList.remove('hidden');
        if (btnFc) btnFc.style.cssText = 'padding: 0.55rem 0.5rem; border-radius: 0.65rem; font-size: 11px; font-weight: 800; background: rgba(6,182,212,0.24); color: #67e8f9; border: 1px solid rgba(34,211,238,0.55);';
        if (btnFocus) btnFocus.style.cssText = 'padding: 0.55rem 0.5rem; border-radius: 0.65rem; font-size: 11px; font-weight: 800; background: var(--bg-slate-900); color: var(--text-muted); border: 1px solid var(--bg-slate-800);';
        renderFlashcardUI();
    } else {
        fcPane.classList.add('hidden');
        focusPane.classList.remove('hidden');
        if (btnFocus) btnFocus.style.cssText = 'padding: 0.55rem 0.5rem; border-radius: 0.65rem; font-size: 11px; font-weight: 800; background: rgba(168,85,247,0.24); color: #e9d5ff; border: 1px solid rgba(168,85,247,0.55);';
        if (btnFc) btnFc.style.cssText = 'padding: 0.55rem 0.5rem; border-radius: 0.65rem; font-size: 11px; font-weight: 800; background: var(--bg-slate-900); color: var(--text-muted); border: 1px solid var(--bg-slate-800);';
    }
}

function setFlashcardDeck(lang) {
    if (typeof SoundFX !== 'undefined' && SoundFX.playClick) SoundFX.playClick();
    flashcardState.activeDeck = lang === 'jp' ? 'jp' : 'en';
    flashcardState.isFlipped = false;
    saveFlashcardState();
    renderFlashcardUI();
}

// Deterministic due-time rules. Date.now() is only read for scheduling, never for rewards.
const FC_DAY_MS = 86400000;
const FC_TEN_MIN_MS = 600000;
function shuffleFlashcardIds(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}
function ensureFlashcardScheduling() {
    const now = Date.now();
    if (!flashcardState.queues || typeof flashcardState.queues !== 'object') flashcardState.queues = {};
    if (!flashcardState.sessionRepeats) flashcardState.sessionRepeats = { en: 0, jp: 0 };
    if (!flashcardState.answeredInSession) flashcardState.answeredInSession = { en: [], jp: [] };
    if (!flashcardState.freePracticeByDeck || typeof flashcardState.freePracticeByDeck !== 'object') flashcardState.freePracticeByDeck = { en: false, jp: false };
    for (const lang of ['en', 'jp']) {
        const deck = flashcardState.decks[lang] || [];
        for (const card of deck) {
            if (!Number.isFinite(card.dueAt) || card.dueAt < 0) {
                // Previously mastered cards should not instantly reappear after upgrading.
                card.dueAt = card.status === 'mastered' ? now + 3 * FC_DAY_MS : now;
            }
            if (!Number.isFinite(card.intervalDays)) card.intervalDays = card.status === 'mastered' ? 3 : 0;
            if (!Number.isFinite(card.reviewCount)) card.reviewCount = 0;
            if (!Number.isFinite(card.successStreak)) card.successStreak = card.status === 'mastered' ? 1 : 0;
            if (!Number.isFinite(card.easeFactor)) card.easeFactor = 2;
        }
        const currentIds = new Set(deck.map(c => c.id));
        const queued = Array.isArray(flashcardState.queues[lang]) ? flashcardState.queues[lang] : [];
        const seen = new Set();
        flashcardState.queues[lang] = queued.filter(id => currentIds.has(id) && !seen.has(id) && seen.add(id));
        if (!Array.isArray(flashcardState.answeredInSession[lang])) flashcardState.answeredInSession[lang] = [];
    }
    if (!flashcardState.activeDeck || !flashcardState.decks[flashcardState.activeDeck]) flashcardState.activeDeck = 'en';
}
function refreshDueFlashcardQueue(lang = flashcardState.activeDeck) {
    const deck = flashcardState.decks[lang] || [];
    const now = Date.now();
    const byId = new Map(deck.map(c => [c.id, c]));
    const queue = Array.isArray(flashcardState.queues[lang]) ? flashcardState.queues[lang] : [];
    const pending = queue.filter(id => byId.has(id) && (flashcardState.freePracticeByDeck?.[lang] || byId.get(id).dueAt <= now));
    const seen = new Set(pending);
    const due = deck.filter(c => c.dueAt <= now && !seen.has(c.id)).map(c => c.id);
    // New due cards are shuffled to avoid fixed alphabetical order.
    flashcardState.queues[lang] = [...pending, ...shuffleFlashcardIds(due)];
}
function getFilteredActiveQueueIds() {
    const lang = flashcardState.activeDeck;
    const deck = flashcardState.decks[lang] || [];
    const queue = flashcardState.queues[lang] || [];
    const query = (document.getElementById('fc-search-input')?.value || '').trim().toLowerCase();
    const filter = document.getElementById('fc-status-filter')?.value || 'ALL';
    const byId = new Map(deck.map(c => [c.id, c]));
    const ids = (filter === 'MASTERED' || filter === 'REVIEW' || filter === 'CUSTOM' || query)
        ? deck.map(c => c.id) : queue;
    return ids.filter(id => {
        const card = byId.get(id);
        if (!card) return false;
        if (filter === 'QUEUE' && !queue.includes(id)) return false;
        if (filter === 'MASTERED' && card.status !== 'mastered') return false;
        if (filter === 'REVIEW' && card.status !== 'review') return false;
        if (filter === 'CUSTOM' && !card.isCustom) return false;
        return !query || `${card.word} ${card.romaji || ''} ${card.meaning}`.toLowerCase().includes(query);
    });
}

function getCurrentActiveFlashcard() {
    const lang = flashcardState.activeDeck;
    const deck = flashcardState.decks[lang] || [];
    const visibleIds = getFilteredActiveQueueIds();
    if (visibleIds.length === 0) return null;
    return deck.find(c => c.id === visibleIds[0]) || null;
}

function flipFlashcard() {
    const card = getCurrentActiveFlashcard();
    if (!card) return;
    if (typeof SoundFX !== 'undefined' && SoundFX.playClick) SoundFX.playClick();
    flashcardState.isFlipped = !flashcardState.isFlipped;
    const cardInner = document.getElementById('fc-card-inner');
    if (cardInner) {
        cardInner.classList.toggle('is-flipped', flashcardState.isFlipped);
    }
}

function rateCurrentFlashcard(rating) {
    const lang = flashcardState.activeDeck;
    const card = getCurrentActiveFlashcard();
    if (!card) return;
    const aliases = { dont_remember: 'dont_know', forgot: 'forgot', remember: 'remember', easy: 'easy' };
    rating = aliases[rating];
    if (!rating) return;

    const now = Date.now();
    const previousDays = Math.max(0, Number(card.intervalDays) || 0);
    const streak = Math.max(0, Number(card.successStreak) || 0);
    let intervalMs;
    if (rating === 'dont_know') {
        intervalMs = FC_TEN_MIN_MS;
        card.intervalDays = 0;
        card.successStreak = 0;
        card.easeFactor = Math.max(1.3, (card.easeFactor || 2) - 0.25);
        card.status = 'review';
    } else if (rating === 'forgot') {
        card.intervalDays = 1;
        intervalMs = FC_DAY_MS;
        card.successStreak = 0;
        card.easeFactor = Math.max(1.3, (card.easeFactor || 2) - 0.15);
        card.status = 'review';
    } else {
        const factor = rating === 'easy' ? Math.max(2.4, card.easeFactor || 2) : Math.max(1.8, (card.easeFactor || 2) * 0.9);
        const baseDays = rating === 'easy' ? 7 : 3;
        card.intervalDays = Math.min(365, Math.max(baseDays, Math.round(previousDays * factor)));
        card.successStreak = streak + 1;
        card.easeFactor = Math.min(3, (card.easeFactor || 2) + (rating === 'easy' ? 0.15 : 0.03));
        intervalMs = card.intervalDays * FC_DAY_MS;
        card.status = 'mastered';
        // A flashcard pays only once, even after refresh, due reviews, or free practice.
        if (!card.rewardClaimed) {
            card.rewardClaimed = true;
            if (typeof addRewards === 'function') addRewards(5, 3, 'INT', 5, true);
            if (typeof spawnFloatingReward === 'function') spawnFloatingReward('⚡ +5 XP | +3 Gold | +5 INT XP');
        }
    }
    card.dueAt = now + intervalMs;
    card.lastReviewedAt = now;
    card.reviewCount = (card.reviewCount || 0) + 1;
    if (rating === 'forgot' || rating === 'dont_know') {
        card.repeatCount = (card.repeatCount || 0) + 1;
        flashcardState.sessionRepeats[lang] = (flashcardState.sessionRepeats[lang] || 0) + 1;
    }
    if (typeof SoundFX !== 'undefined') {
        if ((rating === 'remember' || rating === 'easy') && SoundFX.playQuestComplete) SoundFX.playQuestComplete();
        else if (SoundFX.playClick) SoundFX.playClick();
    }
    flashcardState.queues[lang] = (flashcardState.queues[lang] || []).filter(id => id !== card.id);
    flashcardState.isFlipped = false;
    // Leaving search mode prevents repeatedly grading the same first result.
    const search = document.getElementById('fc-search-input');
    if (search && search.value.trim()) search.value = '';
    const filter = document.getElementById('fc-status-filter');
    if (filter && filter.value !== 'ALL' && filter.value !== 'QUEUE') filter.value = 'QUEUE';
    refreshDueFlashcardQueue(lang);
    saveFlashcardState();
    renderFlashcardUI();
}

function restartFlashcardSessionQueue(freePractice = false) {
    if (typeof SoundFX !== 'undefined' && SoundFX.playClick) SoundFX.playClick();
    const lang = flashcardState.activeDeck;
    const deck = flashcardState.decks[lang] || [];
    if (!flashcardState.freePracticeByDeck) flashcardState.freePracticeByDeck = { en: false, jp: false };
    flashcardState.freePracticeByDeck[lang] = !!freePractice;
    const now = Date.now();
    const source = freePractice ? deck : deck.filter(card => card.dueAt <= now);
    flashcardState.queues[lang] = shuffleFlashcardIds(source.map(card => card.id));
    flashcardState.sessionRepeats[lang] = 0;
    flashcardState.isFlipped = false;
    const search = document.getElementById('fc-search-input');
    const filter = document.getElementById('fc-status-filter');
    if (search) search.value = '';
    if (filter) filter.value = 'ALL';
    saveFlashcardState();
    renderFlashcardUI();
}

function handleFlashcardFilterChange() {
    flashcardState.isFlipped = false;
    renderFlashcardUI();
}

function renderFlashcardUI() {
    refreshDueFlashcardQueue();
    applyFlashcardLanguage();
    const lang = flashcardState.activeDeck;
    const deck = flashcardState.decks[lang] || [];

    const btnEn = document.getElementById('fc-deck-en');
    const btnJp = document.getElementById('fc-deck-jp');
    const cEn = document.getElementById('fc-count-en');
    const cJp = document.getElementById('fc-count-jp');
    if (cEn) cEn.textContent = (flashcardState.decks.en || []).length;
    if (cJp) cJp.textContent = (flashcardState.decks.jp || []).length;

    if (btnEn && btnJp) {
        const activeStyle = 'padding: 0.55rem; border-radius: 0.65rem; font-size: 11px; font-weight: 800; background: rgba(6,182,212,0.22); color: #67e8f9; border: 1px solid rgba(34,211,238,0.55);';
        const idleStyle = 'padding: 0.55rem; border-radius: 0.65rem; font-size: 11px; font-weight: 800; background: var(--bg-slate-900); color: var(--text-muted); border: 1px solid #334155;';
        btnEn.style.cssText = lang === 'en' ? activeStyle : idleStyle;
        btnJp.style.cssText = lang === 'jp' ? activeStyle : idleStyle;
    }

    const masteredCount = deck.filter(c => c.status === 'mastered').length;
    const visibleIds = getFilteredActiveQueueIds();
    const remEl = document.getElementById('fc-queue-remaining');
    const masEl = document.getElementById('fc-mastered-total');
    const repEl = document.getElementById('fc-repeat-counter');
    if (remEl) remEl.textContent = visibleIds.length;
    if (masEl) masEl.textContent = `${masteredCount} / ${deck.length}`;
    if (repEl) repEl.textContent = `${flashcardState.sessionRepeats[lang] || 0}x`;

    const stage = document.getElementById('fc-stage-container');
    const empty = document.getElementById('fc-empty-state');
    const card = getCurrentActiveFlashcard();

    if (!card) {
        if (stage) stage.classList.add('hidden');
        if (empty) empty.classList.remove('hidden');
        const uiLang = localStorage.getItem('system_rpg_lang') || localStorage.getItem('sysrpg_lang') || 'id';
        const text = FC_I18N_MAP[uiLang] || FC_I18N_MAP.id;
        const emptyDesc = document.getElementById('fc-empty-desc');
        if (emptyDesc) emptyDesc.textContent = text.fc_no_due;
        return;
    }

    if (stage) stage.classList.remove('hidden');
    if (empty) empty.classList.add('hidden');

    const cardInner = document.getElementById('fc-card-inner');
    if (cardInner) cardInner.classList.toggle('is-flipped', flashcardState.isFlipped);

    document.getElementById('fc-card-number').textContent = `#${card.no}`;
    document.getElementById('fc-front-word').textContent = card.word;
    document.getElementById('fc-back-word-mini').textContent = card.word;
    document.getElementById('fc-back-meaning').textContent = card.meaning;

    const frontRomaji = document.getElementById('fc-front-romaji');
    const backRomaji = document.getElementById('fc-back-romaji');
    if (lang === 'jp' && card.romaji) {
        frontRomaji.textContent = card.romaji;
        frontRomaji.classList.remove('hidden');
        backRomaji.textContent = card.romaji;
        backRomaji.classList.remove('hidden');
    } else {
        frontRomaji.classList.add('hidden');
        backRomaji.classList.add('hidden');
    }

    const statusBadge = document.getElementById('fc-card-status-badge');
    const uiLang = localStorage.getItem('system_rpg_lang') || localStorage.getItem('sysrpg_lang') || 'id';
    const uiDict = FC_I18N_MAP[uiLang] || FC_I18N_MAP.id;
    if (card.status === 'mastered') {
        statusBadge.textContent = uiDict.fc_status_mastered;
        statusBadge.style.cssText = 'background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid rgba(16,185,129,0.45);';
    } else if (card.status === 'review') {
        statusBadge.textContent = uiDict.fc_status_review;
        statusBadge.style.cssText = 'background: rgba(244,63,94,0.2); color: #fda4af; border: 1px solid rgba(244,63,94,0.45);';
    } else {
        statusBadge.textContent = card.isCustom ? uiDict.fc_status_custom : uiDict.fc_status_new;
        statusBadge.style.cssText = 'background: rgba(6,182,212,0.18); color: #67e8f9; border: 1px solid rgba(34,211,238,0.4);';
    }

    const dueBadge = document.getElementById('fc-next-due');
    if (dueBadge) {
        const due = new Date(card.dueAt);
        dueBadge.textContent = `${uiDict.fc_next_due}: ${card.dueAt > Date.now() ? due.toLocaleString(uiLang === 'ja' ? 'ja-JP' : uiLang === 'en' ? 'en-US' : 'id-ID') : 'NOW'}`;
    }
    const repBadge = document.getElementById('fc-card-repeat-badge');
    if ((card.repeatCount || 0) > 0) {
        repBadge.textContent = `${uiDict.fc_repeat_prefix} ${card.repeatCount}x`;
        repBadge.classList.remove('hidden');
    } else {
        repBadge.classList.add('hidden');
    }
}

function toggleFlashcardRomajiField() {
    const langSel = document.getElementById('fc-form-lang')?.value || 'en';
    const romajiGroup = document.getElementById('fc-form-romaji-group');
    const romajiInput = document.getElementById('fc-form-romaji');
    if (!romajiGroup || !romajiInput) return;

    if (langSel === 'jp') {
        romajiGroup.classList.remove('hidden');
        romajiInput.required = true;
    } else {
        romajiGroup.classList.add('hidden');
        romajiInput.required = false;
    }
}

function openFlashcardModal(mode) {
    if (typeof SoundFX !== 'undefined' && SoundFX.playClick) SoundFX.playClick();
    const lang = flashcardState.activeDeck;
    document.getElementById('fc-edit-mode').value = mode;
    document.getElementById('fc-form-lang').value = lang;

    const uiLang = localStorage.getItem('system_rpg_lang') || localStorage.getItem('sysrpg_lang') || 'id';
    const uiDict = FC_I18N_MAP[uiLang] || FC_I18N_MAP.id;
    if (mode === 'edit') {
        const card = getCurrentActiveFlashcard();
        if (!card) return;
        document.getElementById('fc-modal-title').textContent = uiDict.fc_modal_edit;
        document.getElementById('fc-edit-id').value = card.id;
        document.getElementById('fc-form-lang').disabled = true;
        document.getElementById('fc-form-word').value = card.word;
        document.getElementById('fc-form-romaji').value = card.romaji || '';
        document.getElementById('fc-form-meaning').value = card.meaning;
    } else {
        document.getElementById('fc-modal-title').textContent = uiDict.fc_modal_add;
        document.getElementById('fc-edit-id').value = '';
        document.getElementById('fc-form-lang').disabled = false;
        document.getElementById('fc-form-word').value = '';
        document.getElementById('fc-form-romaji').value = '';
        document.getElementById('fc-form-meaning').value = '';
    }

    toggleFlashcardRomajiField();
    if (typeof openModal === 'function') openModal('modal-flashcard-editor');
}

function saveFlashcardForm(e) {
    e.preventDefault();
    const mode = document.getElementById('fc-edit-mode').value;
    const lang = document.getElementById('fc-form-lang').value;
    const word = document.getElementById('fc-form-word').value.trim();
    const romaji = document.getElementById('fc-form-romaji').value.trim();
    const meaning = document.getElementById('fc-form-meaning').value.trim();

    if (!word || !meaning) return;
    if (lang === 'jp' && !romaji) return;

    const deck = flashcardState.decks[lang];
    if (mode === 'edit') {
        const id = document.getElementById('fc-edit-id').value;
        const target = deck.find(c => c.id === id);
        if (target) {
            target.word = word;
            target.romaji = lang === 'jp' ? romaji : '';
            target.meaning = meaning;
        }
    } else {
        const newId = `${lang}_custom_${Date.now()}`;
        const newCard = {
            id: newId,
            no: deck.length + 1,
            word,
            romaji: lang === 'jp' ? romaji : '',
            meaning,
            status: 'new',
            repeatCount: 0,
            rewardClaimed: false,
            isCustom: true
        };
        deck.unshift(newCard);
        newCard.dueAt = Date.now();
        newCard.intervalDays = 0;
        newCard.reviewCount = 0;
        newCard.successStreak = 0;
        newCard.easeFactor = 2;
        flashcardState.queues[lang].unshift(newId);
        flashcardState.activeDeck = lang;
    }

    if (typeof SoundFX !== 'undefined' && SoundFX.playQuestComplete) SoundFX.playQuestComplete();
    if (typeof closeModal === 'function') closeModal('modal-flashcard-editor');
    flashcardState.isFlipped = false;
    saveFlashcardState();
    renderFlashcardUI();
    if (typeof spawnFloatingReward === 'function') {
        const uiLang = localStorage.getItem('system_rpg_lang') || localStorage.getItem('sysrpg_lang') || 'id';
        const uiDict = FC_I18N_MAP[uiLang] || FC_I18N_MAP.id;
        spawnFloatingReward(mode === 'edit' ? uiDict.fc_toast_updated : uiDict.fc_toast_saved);
    }
}

function confirmResetFlashcards() {
    if (typeof SoundFX !== 'undefined' && SoundFX.playClick) SoundFX.playClick();
    const lang = flashcardState.activeDeck;
    const uiLang = localStorage.getItem('system_rpg_lang') || localStorage.getItem('sysrpg_lang') || 'id';
    const uiDict = FC_I18N_MAP[uiLang] || FC_I18N_MAP.id;
    const deckLabels = {
        id: { en: 'English', jp: 'Jepang' },
        en: { en: 'English', jp: 'Japanese' },
        ja: { en: '英語', jp: '日本語' }
    };
    const deckLabel = (deckLabels[uiLang] || deckLabels.id)[lang];

    const existingModal = document.getElementById('fc-rpg-reset-modal');
    if (existingModal) existingModal.remove();

    const overlay = document.createElement('div');
    overlay.id = 'fc-rpg-reset-modal';
    overlay.style.cssText = 'position: fixed; inset: 0; z-index: 99999; background: rgba(2, 6, 23, 0.85); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 1.25rem;';

    overlay.innerHTML = `
        <div style="width: 100%; max-width: 360px; background: linear-gradient(160deg, #0f172a 0%, #090d16 100%); border: 1px solid rgba(244, 63, 94, 0.55); box-shadow: 0 0 28px rgba(244, 63, 94, 0.25), inset 0 0 18px rgba(34, 211, 238, 0.08); border-radius: 0.9rem; padding: 1.25rem; color: #e2e8f0;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.65rem;">
                <span style="color: #fb7185; font-size: 1rem;">⚠️</span>
                <span style="font-size: 11px; font-weight: 800; letter-spacing: 1.5px; color: #fb7185; text-transform: uppercase;">
                    ${uiDict.fc_reset_title}
                </span>
            </div>
            <p style="font-size: 13px; line-height: 1.55; color: #cbd5e1; margin: 0 0 1.15rem 0;">
                ${uiDict.fc_reset_body} <strong style="color: #67e8f9;">${deckLabel}</strong> ${uiDict.fc_reset_suffix}
            </p>
            <div style="display: flex; gap: 0.6rem;">
                <button type="button" id="fc-reset-cancel-btn" style="flex: 1; padding: 0.6rem 0.75rem; border-radius: 0.6rem; background: rgba(30, 41, 59, 0.85); border: 1px solid #334155; color: #94a3b8; font-size: 11px; font-weight: 800; letter-spacing: 0.8px; cursor: pointer;">
                    ${uiDict.fc_reset_cancel}
                </button>
                <button type="button" id="fc-reset-confirm-btn" style="flex: 1; padding: 0.6rem 0.75rem; border-radius: 0.6rem; background: linear-gradient(135deg, #e11d48, #9f1239); border: 1px solid rgba(253, 164, 175, 0.5); color: #fff; font-size: 11px; font-weight: 800; letter-spacing: 0.8px; cursor: pointer; box-shadow: 0 0 14px rgba(225, 29, 72, 0.35);">
                    ${uiDict.fc_reset_confirm}
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const closeResetModal = () => overlay.remove();

    overlay.querySelector('#fc-reset-cancel-btn').onclick = () => {
        if (typeof SoundFX !== 'undefined' && SoundFX.playClick) SoundFX.playClick();
        closeResetModal();
    };

    overlay.querySelector('#fc-reset-confirm-btn').onclick = () => {
        closeResetModal();
        if (typeof SoundFX !== 'undefined' && SoundFX.playDamage) SoundFX.playDamage();

        flashcardState.decks[lang] = buildDefaultFlashcardDeck(lang);
        flashcardState.queues[lang] = shuffleFlashcardIds(flashcardState.decks[lang].map(c => c.id));
        if (!flashcardState.freePracticeByDeck) flashcardState.freePracticeByDeck = { en: false, jp: false };
        flashcardState.freePracticeByDeck[lang] = false;
        flashcardState.sessionRepeats[lang] = 0;
        flashcardState.isFlipped = false;
        saveFlashcardState();
        renderFlashcardUI();
        if (typeof spawnFloatingReward === 'function') {
            spawnFloatingReward(`↺ Deck ${deckLabel} di-reset ke awal`);
        }
    };

    overlay.onclick = (e) => {
        if (e.target === overlay) closeResetModal();
    };
}

window.addEventListener('system-language-changed', () => {
    applyFlashcardLanguage();
});

loadFlashcardState();
// Return 10-minute and later due reviews while this screen stays open.
setInterval(() => {
    const pane = document.getElementById('dungeon-mode-flashcard');
    if (pane && !pane.classList.contains('hidden')) renderFlashcardUI();
}, 60000);


// 17. INITIAL BOOT SEQUENCE
// ==========================================
(function bootSystemRPG() {
    currentOracleIndex = pickContextualOracleIndex();
    checkRealDayRollover();
    initTreasuryDefaults();
    renderAll();
    updateDungeonTimerUI();
    syncSystemReminders();
    setTimeout(showPendingDailyReport, 1200);

    if (typeof applyAppLanguage === 'function') {
        applyAppLanguage();
    }

    // Check five web-only reminders every 20 seconds (Android alarms are independent).
    setInterval(checkScheduledReminderTick, 20000);
})();
// SYSTEM RPG V6 Refined additions. Separate namespaces preserve legacy save data.

const V6 = (() => {
 const JKEY='system_rpg_v6_journal', LKEY='system_rpg_v6_library';
 const read=(k,fallback)=>{try{const x=JSON.parse(localStorage.getItem(k));return x&&typeof x==='object'?x:fallback;}catch(e){return fallback;}};
 const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true;}catch(e){alert('Penyimpanan gagal. Periksa ruang browser atau izin penyimpanan.');return false;}};
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const articles=[
 ['7-habits','The 7 Habits of Highly Effective People','Self Development','Membangun karakter melalui pilihan sadar.','7 menit','Efektivitas jangka panjang dimulai dari karakter, bukan trik untuk terlihat sibuk. Kebiasaan proaktif mengajak kita memusatkan energi pada tindakan yang bisa kita kendalikan, alih-alih terus menyalahkan keadaan.','Memulai dengan tujuan akhir berarti membayangkan nilai dan kontribusi yang ingin kita tinggalkan. Dari gambaran itu, kita dapat menyusun prioritas yang konsisten, bukan sekadar merespons hal yang mendesak.','Hubungan yang sehat memerlukan upaya memahami sudut pandang orang lain, mencari manfaat bersama, dan bekerja sama tanpa menghapus perbedaan.','Pilih satu keputusan hari ini yang selaras dengan nilai jangka panjangmu.'],
 ['atomic','Atomic Habits','Habits','Perubahan kecil yang dapat dipertahankan.','6 menit','Kebiasaan terbentuk melalui pengulangan dalam konteks yang relatif konsisten. Mengandalkan motivasi saja membuat perilaku mudah terhenti ketika energi menurun.','Buat perilaku baik terlihat jelas, mudah dimulai, dan memberi rasa berhasil. Sebaliknya, kurangi pemicu kebiasaan yang ingin dihentikan dan tambahkan sedikit hambatan untuk melakukannya.','Identitas membantu menjaga arah: setiap tindakan kecil menjadi bukti tentang pribadi yang sedang kita bangun. Satu kegagalan tidak menghapus seluruh proses.','Buat kebiasaan baru cukup kecil untuk dilakukan dalam dua menit.'],
 ['morning','The Miracle Morning: Rutinitas Pagi','Productivity','Merancang pagi yang realistis.','5 menit','Rutinitas pagi bukan perlombaan bangun paling awal. Manfaatnya muncul ketika kita memberi ruang untuk menentukan arah hari sebelum distraksi mengambil alih.','Gabungkan beberapa aktivitas sederhana seperti hening sejenak, bergerak, membaca, menulis, dan meninjau rencana. Durasi dapat disesuaikan dengan kebutuhan tidur dan jadwal masing-masing.','Rutinitas yang terlalu ambisius sering sulit dipertahankan. Mulailah dari satu kegiatan selama lima menit dan evaluasi manfaatnya.','Tentukan satu ritual pagi yang tidak mengorbankan tidur.'],
 ['ikigai','Ikigai','Philosophy','Menemukan alasan untuk menjalani hari.','6 menit','Ikigai merupakan konsep Jepang tentang hal yang membuat kehidupan terasa layak dijalani. Maknanya tidak harus berupa satu pekerjaan ideal atau pencapaian besar.','Kegiatan sederhana, hubungan yang bermakna, tanggung jawab, dan rasa ingin tahu dapat menjadi sumber tujuan. Kita boleh memiliki lebih dari satu sumber makna sepanjang hidup.','Mencari tujuan adalah proses eksplorasi. Perhatikan kapan kamu merasa berguna, terhubung, dan ingin terus belajar.','Tuliskan tiga kegiatan kecil yang memberi rasa bermakna.'],
 ['stoic','Stoicism','Philosophy','Menentukan respons terhadap hal di luar kendali.','7 menit','Filsafat Stoa mengajak kita membedakan tindakan dan penilaian yang dapat kita kelola dari peristiwa yang tidak sepenuhnya berada di tangan kita.','Ini bukan ajakan untuk menekan emosi. Kita dapat mengakui rasa kecewa sambil memilih respons yang selaras dengan kebijaksanaan, keberanian, keadilan, dan pengendalian diri.','Latihan praktisnya adalah berhenti sejenak sebelum bereaksi dan bertanya apakah tindakan berikutnya membantu keadaan atau justru memperburuknya.','Tulis satu hal yang tidak bisa dikendalikan dan satu respons yang bisa dipilih.'],
 ['deep','Deep Work','Productivity','Melindungi waktu untuk berpikir mendalam.','6 menit','Pekerjaan kognitif yang sulit membutuhkan perhatian berkelanjutan. Pergantian tugas dan notifikasi berulang dapat mengganggu alur berpikir.','Tentukan satu hasil yang spesifik, sediakan blok waktu tanpa gangguan, dan singkirkan distraksi sebelum mulai. Istirahat terencana juga penting agar fokus tidak berubah menjadi kelelahan.','Ukur kualitas hasil, bukan hanya lamanya duduk di depan layar. Mulailah dengan blok fokus yang realistis.','Jadwalkan satu sesi fokus 25 menit tanpa notifikasi.'],
 ['growth','Growth Mindset','Psychology','Kemampuan dapat dikembangkan lewat proses.','5 menit','Growth mindset memandang kemampuan sebagai sesuatu yang dapat berkembang melalui latihan, strategi, umpan balik, dan dukungan yang tepat.','Ini bukan berarti semua orang akan mencapai hasil sama hanya dengan berusaha keras. Strategi, kesempatan, kondisi, dan kualitas latihan tetap memengaruhi kemajuan.','Alih-alih menilai diri dari satu kegagalan, tanyakan strategi apa yang perlu diubah dan bantuan apa yang dapat dicari.','Ganti satu kalimat “aku tidak bisa” menjadi “aku belum menguasainya”.'],
 ['eq','Emotional Intelligence','Psychology','Mengenali emosi dan merespons dengan bijak.','6 menit','Kecerdasan emosional mencakup kemampuan mengenali perasaan sendiri, memahami pemicunya, dan memperhatikan keadaan emosional orang lain.','Mengenali emosi tidak sama dengan membenarkan semua tindakan. Kita tetap bertanggung jawab atas cara menyampaikan kebutuhan dan menangani konflik.','Menyebut emosi secara spesifik dapat membantu menciptakan jarak sebelum mengambil keputusan.','Saat emosi kuat muncul, beri nama perasaannya dan pilih respons yang aman.'],
 ['time','Time Management','Productivity','Mengelola prioritas dan energi.','6 menit','Waktu tidak dapat ditambah, tetapi perhatian dan prioritas dapat diarahkan. Daftar tugas yang panjang belum tentu menunjukkan kemajuan pada hal terpenting.','Pilih satu sampai tiga hasil utama setiap hari. Sisakan ruang untuk kejadian tak terduga dan sesuaikan tugas berat dengan periode energi terbaikmu.','Tinjau rencana secara berkala. Jadwal yang baik membantu mengambil keputusan, bukan menghukum diri ketika keadaan berubah.','Tentukan satu prioritas yang paling berdampak untuk hari game berikutnya.'],
 ['finance','Financial Literacy','Finance','Dasar mengelola uang secara sadar.','7 menit','Literasi finansial dimulai dari memahami arus kas: uang masuk, kebutuhan, kewajiban, dan pengeluaran yang bisa dipilih.','Dana darurat dapat membantu menghadapi pengeluaran tak terduga. Besarnya perlu disesuaikan dengan kondisi pribadi, kestabilan pendapatan, dan tanggungan.','Pahami risiko, biaya, dan tujuan sebelum memilih produk keuangan. Tidak ada investasi yang bebas risiko atau cocok untuk semua orang.','Catat satu minggu pengeluaran dan kelompokkan kebutuhan serta keinginan.']
 ];
 const CHAPTERS={"7-habits": [{"title": "Karakter sebelum teknik", "paragraphs": ["Karakter sebelum teknik adalah bagian penting dari perjalanan memahami 7 habits. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang karakter sebelum teknik, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Ketika sebuah tugas terasa berat, fokuslah pada keputusan yang masih bisa kamu ambil hari ini. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Buat daftar dua kolom: hal yang dapat dipengaruhi dan hal yang di luar kendali. Pilih satu tindakan dari kolom pertama. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Karakter sebelum teknik”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Proaktif dan lingkar pengaruh", "paragraphs": ["Proaktif dan lingkar pengaruh adalah bagian penting dari perjalanan memahami 7 habits. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang proaktif dan lingkar pengaruh, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Ketika sebuah tugas terasa berat, fokuslah pada keputusan yang masih bisa kamu ambil hari ini. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Buat daftar dua kolom: hal yang dapat dipengaruhi dan hal yang di luar kendali. Pilih satu tindakan dari kolom pertama. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Proaktif dan lingkar pengaruh”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Menentukan arah hidup", "paragraphs": ["Menentukan arah hidup adalah bagian penting dari perjalanan memahami 7 habits. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang menentukan arah hidup, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Ketika sebuah tugas terasa berat, fokuslah pada keputusan yang masih bisa kamu ambil hari ini. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Buat daftar dua kolom: hal yang dapat dipengaruhi dan hal yang di luar kendali. Pilih satu tindakan dari kolom pertama. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Menentukan arah hidup”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Prioritas yang tidak mendesak", "paragraphs": ["Prioritas yang tidak mendesak adalah bagian penting dari perjalanan memahami 7 habits. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang prioritas yang tidak mendesak, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Ketika sebuah tugas terasa berat, fokuslah pada keputusan yang masih bisa kamu ambil hari ini. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Buat daftar dua kolom: hal yang dapat dipengaruhi dan hal yang di luar kendali. Pilih satu tindakan dari kolom pertama. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Prioritas yang tidak mendesak”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Menang bersama orang lain", "paragraphs": ["Menang bersama orang lain adalah bagian penting dari perjalanan memahami 7 habits. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang menang bersama orang lain, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Ketika sebuah tugas terasa berat, fokuslah pada keputusan yang masih bisa kamu ambil hari ini. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Buat daftar dua kolom: hal yang dapat dipengaruhi dan hal yang di luar kendali. Pilih satu tindakan dari kolom pertama. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Menang bersama orang lain”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Mendengar sebelum menjawab", "paragraphs": ["Mendengar sebelum menjawab adalah bagian penting dari perjalanan memahami 7 habits. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang mendengar sebelum menjawab, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Ketika sebuah tugas terasa berat, fokuslah pada keputusan yang masih bisa kamu ambil hari ini. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Buat daftar dua kolom: hal yang dapat dipengaruhi dan hal yang di luar kendali. Pilih satu tindakan dari kolom pertama. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Mendengar sebelum menjawab”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Sinergi dan perbedaan", "paragraphs": ["Sinergi dan perbedaan adalah bagian penting dari perjalanan memahami 7 habits. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang sinergi dan perbedaan, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Ketika sebuah tugas terasa berat, fokuslah pada keputusan yang masih bisa kamu ambil hari ini. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Buat daftar dua kolom: hal yang dapat dipengaruhi dan hal yang di luar kendali. Pilih satu tindakan dari kolom pertama. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Sinergi dan perbedaan”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Memperbarui diri secara berkelanjutan", "paragraphs": ["Memperbarui diri secara berkelanjutan adalah bagian penting dari perjalanan memahami 7 habits. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang memperbarui diri secara berkelanjutan, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Ketika sebuah tugas terasa berat, fokuslah pada keputusan yang masih bisa kamu ambil hari ini. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Buat daftar dua kolom: hal yang dapat dipengaruhi dan hal yang di luar kendali. Pilih satu tindakan dari kolom pertama. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Memperbarui diri secara berkelanjutan”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}], "atomic": [{"title": "Mengapa perubahan kecil penting", "paragraphs": ["Mengapa perubahan kecil penting adalah bagian penting dari perjalanan memahami atomic. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang mengapa perubahan kecil penting, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Jika ingin membaca, letakkan buku di tempat yang terlihat dan mulai dari satu halaman setelah sarapan. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Pilih satu pemicu yang sudah rutin, lalu tempelkan kebiasaan baru yang sangat kecil setelahnya. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Mengapa perubahan kecil penting”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Siklus isyarat hingga ganjaran", "paragraphs": ["Siklus isyarat hingga ganjaran adalah bagian penting dari perjalanan memahami atomic. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang siklus isyarat hingga ganjaran, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Jika ingin membaca, letakkan buku di tempat yang terlihat dan mulai dari satu halaman setelah sarapan. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Pilih satu pemicu yang sudah rutin, lalu tempelkan kebiasaan baru yang sangat kecil setelahnya. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Siklus isyarat hingga ganjaran”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Membuat kebiasaan terlihat", "paragraphs": ["Membuat kebiasaan terlihat adalah bagian penting dari perjalanan memahami atomic. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang membuat kebiasaan terlihat, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Jika ingin membaca, letakkan buku di tempat yang terlihat dan mulai dari satu halaman setelah sarapan. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Pilih satu pemicu yang sudah rutin, lalu tempelkan kebiasaan baru yang sangat kecil setelahnya. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Membuat kebiasaan terlihat”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Mempermudah langkah pertama", "paragraphs": ["Mempermudah langkah pertama adalah bagian penting dari perjalanan memahami atomic. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang mempermudah langkah pertama, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Jika ingin membaca, letakkan buku di tempat yang terlihat dan mulai dari satu halaman setelah sarapan. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Pilih satu pemicu yang sudah rutin, lalu tempelkan kebiasaan baru yang sangat kecil setelahnya. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Mempermudah langkah pertama”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Identitas dan pengulangan", "paragraphs": ["Identitas dan pengulangan adalah bagian penting dari perjalanan memahami atomic. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang identitas dan pengulangan, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Jika ingin membaca, letakkan buku di tempat yang terlihat dan mulai dari satu halaman setelah sarapan. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Pilih satu pemicu yang sudah rutin, lalu tempelkan kebiasaan baru yang sangat kecil setelahnya. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Identitas dan pengulangan”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Mengurangi kebiasaan pengganggu", "paragraphs": ["Mengurangi kebiasaan pengganggu adalah bagian penting dari perjalanan memahami atomic. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang mengurangi kebiasaan pengganggu, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Jika ingin membaca, letakkan buku di tempat yang terlihat dan mulai dari satu halaman setelah sarapan. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Pilih satu pemicu yang sudah rutin, lalu tempelkan kebiasaan baru yang sangat kecil setelahnya. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Mengurangi kebiasaan pengganggu”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Melacak kemajuan tanpa terobsesi", "paragraphs": ["Melacak kemajuan tanpa terobsesi adalah bagian penting dari perjalanan memahami atomic. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang melacak kemajuan tanpa terobsesi, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Jika ingin membaca, letakkan buku di tempat yang terlihat dan mulai dari satu halaman setelah sarapan. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Pilih satu pemicu yang sudah rutin, lalu tempelkan kebiasaan baru yang sangat kecil setelahnya. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Melacak kemajuan tanpa terobsesi”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Merancang sistem yang bertahan", "paragraphs": ["Merancang sistem yang bertahan adalah bagian penting dari perjalanan memahami atomic. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang merancang sistem yang bertahan, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Jika ingin membaca, letakkan buku di tempat yang terlihat dan mulai dari satu halaman setelah sarapan. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Pilih satu pemicu yang sudah rutin, lalu tempelkan kebiasaan baru yang sangat kecil setelahnya. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Merancang sistem yang bertahan”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}], "morning": [{"title": "Pagi yang sesuai hidupmu", "paragraphs": ["Pagi yang sesuai hidupmu adalah bagian penting dari perjalanan memahami morning. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang pagi yang sesuai hidupmu, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Rutinitas pagi lima belas menit yang konsisten lebih berguna daripada jadwal dua jam yang mengorbankan tidur. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tulis tiga kegiatan pagi yang paling membantu, lalu pilih satu yang realistis besok. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Pagi yang sesuai hidupmu”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Tidur tetap menjadi fondasi", "paragraphs": ["Tidur tetap menjadi fondasi adalah bagian penting dari perjalanan memahami morning. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang tidur tetap menjadi fondasi, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Rutinitas pagi lima belas menit yang konsisten lebih berguna daripada jadwal dua jam yang mengorbankan tidur. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tulis tiga kegiatan pagi yang paling membantu, lalu pilih satu yang realistis besok. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Tidur tetap menjadi fondasi”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Hening dan menetapkan niat", "paragraphs": ["Hening dan menetapkan niat adalah bagian penting dari perjalanan memahami morning. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang hening dan menetapkan niat, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Rutinitas pagi lima belas menit yang konsisten lebih berguna daripada jadwal dua jam yang mengorbankan tidur. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tulis tiga kegiatan pagi yang paling membantu, lalu pilih satu yang realistis besok. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Hening dan menetapkan niat”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Gerak tubuh yang realistis", "paragraphs": ["Gerak tubuh yang realistis adalah bagian penting dari perjalanan memahami morning. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang gerak tubuh yang realistis, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Rutinitas pagi lima belas menit yang konsisten lebih berguna daripada jadwal dua jam yang mengorbankan tidur. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tulis tiga kegiatan pagi yang paling membantu, lalu pilih satu yang realistis besok. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Gerak tubuh yang realistis”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Membaca dan menulis singkat", "paragraphs": ["Membaca dan menulis singkat adalah bagian penting dari perjalanan memahami morning. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang membaca dan menulis singkat, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Rutinitas pagi lima belas menit yang konsisten lebih berguna daripada jadwal dua jam yang mengorbankan tidur. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tulis tiga kegiatan pagi yang paling membantu, lalu pilih satu yang realistis besok. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Membaca dan menulis singkat”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Mengurangi distraksi pagi", "paragraphs": ["Mengurangi distraksi pagi adalah bagian penting dari perjalanan memahami morning. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang mengurangi distraksi pagi, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Rutinitas pagi lima belas menit yang konsisten lebih berguna daripada jadwal dua jam yang mengorbankan tidur. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tulis tiga kegiatan pagi yang paling membantu, lalu pilih satu yang realistis besok. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Mengurangi distraksi pagi”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Rutinitas saat jadwal berubah", "paragraphs": ["Rutinitas saat jadwal berubah adalah bagian penting dari perjalanan memahami morning. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang rutinitas saat jadwal berubah, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Rutinitas pagi lima belas menit yang konsisten lebih berguna daripada jadwal dua jam yang mengorbankan tidur. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tulis tiga kegiatan pagi yang paling membantu, lalu pilih satu yang realistis besok. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Rutinitas saat jadwal berubah”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Evaluasi tanpa perfeksionisme", "paragraphs": ["Evaluasi tanpa perfeksionisme adalah bagian penting dari perjalanan memahami morning. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang evaluasi tanpa perfeksionisme, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Rutinitas pagi lima belas menit yang konsisten lebih berguna daripada jadwal dua jam yang mengorbankan tidur. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tulis tiga kegiatan pagi yang paling membantu, lalu pilih satu yang realistis besok. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Evaluasi tanpa perfeksionisme”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}], "ikigai": [{"title": "Mencari makna dalam keseharian", "paragraphs": ["Mencari makna dalam keseharian adalah bagian penting dari perjalanan memahami ikigai. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang mencari makna dalam keseharian, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Seseorang bisa menemukan makna melalui penelitian, membantu keluarga, mengajar, atau merawat lingkungan, tanpa harus mengubah semuanya menjadi karier. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Catat kegiatan yang membuatmu merasa terlibat dan alasan kegiatan itu berarti. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Mencari makna dalam keseharian”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Minat tidak selalu menjadi pekerjaan", "paragraphs": ["Minat tidak selalu menjadi pekerjaan adalah bagian penting dari perjalanan memahami ikigai. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang minat tidak selalu menjadi pekerjaan, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Seseorang bisa menemukan makna melalui penelitian, membantu keluarga, mengajar, atau merawat lingkungan, tanpa harus mengubah semuanya menjadi karier. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Catat kegiatan yang membuatmu merasa terlibat dan alasan kegiatan itu berarti. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Minat tidak selalu menjadi pekerjaan”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Kemampuan tumbuh melalui praktik", "paragraphs": ["Kemampuan tumbuh melalui praktik adalah bagian penting dari perjalanan memahami ikigai. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang kemampuan tumbuh melalui praktik, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Seseorang bisa menemukan makna melalui penelitian, membantu keluarga, mengajar, atau merawat lingkungan, tanpa harus mengubah semuanya menjadi karier. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Catat kegiatan yang membuatmu merasa terlibat dan alasan kegiatan itu berarti. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Kemampuan tumbuh melalui praktik”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Kontribusi bagi orang lain", "paragraphs": ["Kontribusi bagi orang lain adalah bagian penting dari perjalanan memahami ikigai. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang kontribusi bagi orang lain, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Seseorang bisa menemukan makna melalui penelitian, membantu keluarga, mengajar, atau merawat lingkungan, tanpa harus mengubah semuanya menjadi karier. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Catat kegiatan yang membuatmu merasa terlibat dan alasan kegiatan itu berarti. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Kontribusi bagi orang lain”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Kebutuhan ekonomi dan realitas", "paragraphs": ["Kebutuhan ekonomi dan realitas adalah bagian penting dari perjalanan memahami ikigai. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang kebutuhan ekonomi dan realitas, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Seseorang bisa menemukan makna melalui penelitian, membantu keluarga, mengajar, atau merawat lingkungan, tanpa harus mengubah semuanya menjadi karier. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Catat kegiatan yang membuatmu merasa terlibat dan alasan kegiatan itu berarti. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Kebutuhan ekonomi dan realitas”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Eksperimen kecil menemukan arah", "paragraphs": ["Eksperimen kecil menemukan arah adalah bagian penting dari perjalanan memahami ikigai. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang eksperimen kecil menemukan arah, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Seseorang bisa menemukan makna melalui penelitian, membantu keluarga, mengajar, atau merawat lingkungan, tanpa harus mengubah semuanya menjadi karier. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Catat kegiatan yang membuatmu merasa terlibat dan alasan kegiatan itu berarti. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Eksperimen kecil menemukan arah”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Menjaga relasi dan kesehatan", "paragraphs": ["Menjaga relasi dan kesehatan adalah bagian penting dari perjalanan memahami ikigai. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang menjaga relasi dan kesehatan, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Seseorang bisa menemukan makna melalui penelitian, membantu keluarga, mengajar, atau merawat lingkungan, tanpa harus mengubah semuanya menjadi karier. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Catat kegiatan yang membuatmu merasa terlibat dan alasan kegiatan itu berarti. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Menjaga relasi dan kesehatan”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Makna sebagai proses yang berubah", "paragraphs": ["Makna sebagai proses yang berubah adalah bagian penting dari perjalanan memahami ikigai. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang makna sebagai proses yang berubah, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Seseorang bisa menemukan makna melalui penelitian, membantu keluarga, mengajar, atau merawat lingkungan, tanpa harus mengubah semuanya menjadi karier. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Catat kegiatan yang membuatmu merasa terlibat dan alasan kegiatan itu berarti. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Makna sebagai proses yang berubah”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}], "stoic": [{"title": "Apa yang bisa dikendalikan", "paragraphs": ["Apa yang bisa dikendalikan adalah bagian penting dari perjalanan memahami stoic. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang apa yang bisa dikendalikan, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Kamu tidak bisa mengendalikan komentar orang, tetapi bisa memilih kapan menjawab dan bagaimana menyusun respons. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tuliskan satu peristiwa, interpretasimu, dan respons alternatif yang lebih bijak. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Apa yang bisa dikendalikan”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Persepsi bukan fakta", "paragraphs": ["Persepsi bukan fakta adalah bagian penting dari perjalanan memahami stoic. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang persepsi bukan fakta, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Kamu tidak bisa mengendalikan komentar orang, tetapi bisa memilih kapan menjawab dan bagaimana menyusun respons. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tuliskan satu peristiwa, interpretasimu, dan respons alternatif yang lebih bijak. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Persepsi bukan fakta”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Memberi jeda sebelum bereaksi", "paragraphs": ["Memberi jeda sebelum bereaksi adalah bagian penting dari perjalanan memahami stoic. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang memberi jeda sebelum bereaksi, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Kamu tidak bisa mengendalikan komentar orang, tetapi bisa memilih kapan menjawab dan bagaimana menyusun respons. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tuliskan satu peristiwa, interpretasimu, dan respons alternatif yang lebih bijak. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Memberi jeda sebelum bereaksi”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Kebajikan sebagai kompas", "paragraphs": ["Kebajikan sebagai kompas adalah bagian penting dari perjalanan memahami stoic. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang kebajikan sebagai kompas, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Kamu tidak bisa mengendalikan komentar orang, tetapi bisa memilih kapan menjawab dan bagaimana menyusun respons. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tuliskan satu peristiwa, interpretasimu, dan respons alternatif yang lebih bijak. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Kebajikan sebagai kompas”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Menghadapi hal yang tidak pasti", "paragraphs": ["Menghadapi hal yang tidak pasti adalah bagian penting dari perjalanan memahami stoic. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang menghadapi hal yang tidak pasti, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Kamu tidak bisa mengendalikan komentar orang, tetapi bisa memilih kapan menjawab dan bagaimana menyusun respons. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tuliskan satu peristiwa, interpretasimu, dan respons alternatif yang lebih bijak. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Menghadapi hal yang tidak pasti”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Menerima tanpa menyerah", "paragraphs": ["Menerima tanpa menyerah adalah bagian penting dari perjalanan memahami stoic. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang menerima tanpa menyerah, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Kamu tidak bisa mengendalikan komentar orang, tetapi bisa memilih kapan menjawab dan bagaimana menyusun respons. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tuliskan satu peristiwa, interpretasimu, dan respons alternatif yang lebih bijak. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Menerima tanpa menyerah”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Refleksi malam yang praktis", "paragraphs": ["Refleksi malam yang praktis adalah bagian penting dari perjalanan memahami stoic. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang refleksi malam yang praktis, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Kamu tidak bisa mengendalikan komentar orang, tetapi bisa memilih kapan menjawab dan bagaimana menyusun respons. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tuliskan satu peristiwa, interpretasimu, dan respons alternatif yang lebih bijak. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Refleksi malam yang praktis”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Stoisisme dalam konflik sehari-hari", "paragraphs": ["Stoisisme dalam konflik sehari-hari adalah bagian penting dari perjalanan memahami stoic. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang stoisisme dalam konflik sehari-hari, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Kamu tidak bisa mengendalikan komentar orang, tetapi bisa memilih kapan menjawab dan bagaimana menyusun respons. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tuliskan satu peristiwa, interpretasimu, dan respons alternatif yang lebih bijak. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Stoisisme dalam konflik sehari-hari”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}], "deep": [{"title": "Nilai perhatian mendalam", "paragraphs": ["Nilai perhatian mendalam adalah bagian penting dari perjalanan memahami deep. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang nilai perhatian mendalam, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Satu sesi menulis selama tiga puluh menit tanpa notifikasi sering menghasilkan kemajuan lebih jelas daripada berpindah antara dokumen dan media sosial. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tentukan satu keluaran konkret sebelum memulai sesi fokus berikutnya. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Nilai perhatian mendalam”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Biaya berpindah tugas", "paragraphs": ["Biaya berpindah tugas adalah bagian penting dari perjalanan memahami deep. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang biaya berpindah tugas, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Satu sesi menulis selama tiga puluh menit tanpa notifikasi sering menghasilkan kemajuan lebih jelas daripada berpindah antara dokumen dan media sosial. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tentukan satu keluaran konkret sebelum memulai sesi fokus berikutnya. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Biaya berpindah tugas”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Menyiapkan ruang fokus", "paragraphs": ["Menyiapkan ruang fokus adalah bagian penting dari perjalanan memahami deep. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang menyiapkan ruang fokus, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Satu sesi menulis selama tiga puluh menit tanpa notifikasi sering menghasilkan kemajuan lebih jelas daripada berpindah antara dokumen dan media sosial. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tentukan satu keluaran konkret sebelum memulai sesi fokus berikutnya. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Menyiapkan ruang fokus”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Menentukan hasil sesi", "paragraphs": ["Menentukan hasil sesi adalah bagian penting dari perjalanan memahami deep. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang menentukan hasil sesi, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Satu sesi menulis selama tiga puluh menit tanpa notifikasi sering menghasilkan kemajuan lebih jelas daripada berpindah antara dokumen dan media sosial. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tentukan satu keluaran konkret sebelum memulai sesi fokus berikutnya. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Menentukan hasil sesi”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Ritual mulai dan selesai", "paragraphs": ["Ritual mulai dan selesai adalah bagian penting dari perjalanan memahami deep. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang ritual mulai dan selesai, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Satu sesi menulis selama tiga puluh menit tanpa notifikasi sering menghasilkan kemajuan lebih jelas daripada berpindah antara dokumen dan media sosial. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tentukan satu keluaran konkret sebelum memulai sesi fokus berikutnya. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Ritual mulai dan selesai”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Mengelola notifikasi", "paragraphs": ["Mengelola notifikasi adalah bagian penting dari perjalanan memahami deep. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang mengelola notifikasi, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Satu sesi menulis selama tiga puluh menit tanpa notifikasi sering menghasilkan kemajuan lebih jelas daripada berpindah antara dokumen dan media sosial. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tentukan satu keluaran konkret sebelum memulai sesi fokus berikutnya. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Mengelola notifikasi”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Istirahat dan pemulihan", "paragraphs": ["Istirahat dan pemulihan adalah bagian penting dari perjalanan memahami deep. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang istirahat dan pemulihan, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Satu sesi menulis selama tiga puluh menit tanpa notifikasi sering menghasilkan kemajuan lebih jelas daripada berpindah antara dokumen dan media sosial. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tentukan satu keluaran konkret sebelum memulai sesi fokus berikutnya. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Istirahat dan pemulihan”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Mengukur kualitas bukan jam", "paragraphs": ["Mengukur kualitas bukan jam adalah bagian penting dari perjalanan memahami deep. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang mengukur kualitas bukan jam, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Satu sesi menulis selama tiga puluh menit tanpa notifikasi sering menghasilkan kemajuan lebih jelas daripada berpindah antara dokumen dan media sosial. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tentukan satu keluaran konkret sebelum memulai sesi fokus berikutnya. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Mengukur kualitas bukan jam”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}], "growth": [{"title": "Kemampuan bukan label tetap", "paragraphs": ["Kemampuan bukan label tetap adalah bagian penting dari perjalanan memahami growth. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang kemampuan bukan label tetap, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Nilai ujian yang kurang baik bukan bukti bahwa kemampuanmu tetap; itu informasi tentang strategi belajar yang perlu diuji. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tinjau satu kesalahan, cari umpan balik, dan rancang latihan yang lebih tepat. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Kemampuan bukan label tetap”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Latihan yang disengaja", "paragraphs": ["Latihan yang disengaja adalah bagian penting dari perjalanan memahami growth. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang latihan yang disengaja, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Nilai ujian yang kurang baik bukan bukti bahwa kemampuanmu tetap; itu informasi tentang strategi belajar yang perlu diuji. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tinjau satu kesalahan, cari umpan balik, dan rancang latihan yang lebih tepat. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Latihan yang disengaja”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Strategi dan umpan balik", "paragraphs": ["Strategi dan umpan balik adalah bagian penting dari perjalanan memahami growth. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang strategi dan umpan balik, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Nilai ujian yang kurang baik bukan bukti bahwa kemampuanmu tetap; itu informasi tentang strategi belajar yang perlu diuji. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tinjau satu kesalahan, cari umpan balik, dan rancang latihan yang lebih tepat. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Strategi dan umpan balik”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Menghadapi kesalahan", "paragraphs": ["Menghadapi kesalahan adalah bagian penting dari perjalanan memahami growth. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang menghadapi kesalahan, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Nilai ujian yang kurang baik bukan bukti bahwa kemampuanmu tetap; itu informasi tentang strategi belajar yang perlu diuji. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tinjau satu kesalahan, cari umpan balik, dan rancang latihan yang lebih tepat. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Menghadapi kesalahan”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Bahasa yang membuka peluang", "paragraphs": ["Bahasa yang membuka peluang adalah bagian penting dari perjalanan memahami growth. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang bahasa yang membuka peluang, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Nilai ujian yang kurang baik bukan bukti bahwa kemampuanmu tetap; itu informasi tentang strategi belajar yang perlu diuji. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tinjau satu kesalahan, cari umpan balik, dan rancang latihan yang lebih tepat. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Bahasa yang membuka peluang”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Dukungan dan lingkungan", "paragraphs": ["Dukungan dan lingkungan adalah bagian penting dari perjalanan memahami growth. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang dukungan dan lingkungan, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Nilai ujian yang kurang baik bukan bukti bahwa kemampuanmu tetap; itu informasi tentang strategi belajar yang perlu diuji. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tinjau satu kesalahan, cari umpan balik, dan rancang latihan yang lebih tepat. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Dukungan dan lingkungan”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Membedakan usaha dari hasil", "paragraphs": ["Membedakan usaha dari hasil adalah bagian penting dari perjalanan memahami growth. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang membedakan usaha dari hasil, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Nilai ujian yang kurang baik bukan bukti bahwa kemampuanmu tetap; itu informasi tentang strategi belajar yang perlu diuji. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tinjau satu kesalahan, cari umpan balik, dan rancang latihan yang lebih tepat. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Membedakan usaha dari hasil”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Membangun kebiasaan belajar", "paragraphs": ["Membangun kebiasaan belajar adalah bagian penting dari perjalanan memahami growth. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang membangun kebiasaan belajar, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Nilai ujian yang kurang baik bukan bukti bahwa kemampuanmu tetap; itu informasi tentang strategi belajar yang perlu diuji. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Tinjau satu kesalahan, cari umpan balik, dan rancang latihan yang lebih tepat. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Membangun kebiasaan belajar”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}], "eq": [{"title": "Mengenali emosi dengan tepat", "paragraphs": ["Mengenali emosi dengan tepat adalah bagian penting dari perjalanan memahami eq. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang mengenali emosi dengan tepat, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Saat merasa kesal karena pesan belum dibalas, beri nama emosinya sebelum menyimpulkan niat orang lain. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Gunakan kalimat “Aku merasa ... ketika ... dan aku membutuhkan ...” untuk mengungkapkan kebutuhan. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Mengenali emosi dengan tepat”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Emosi dan kebutuhan", "paragraphs": ["Emosi dan kebutuhan adalah bagian penting dari perjalanan memahami eq. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang emosi dan kebutuhan, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Saat merasa kesal karena pesan belum dibalas, beri nama emosinya sebelum menyimpulkan niat orang lain. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Gunakan kalimat “Aku merasa ... ketika ... dan aku membutuhkan ...” untuk mengungkapkan kebutuhan. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Emosi dan kebutuhan”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Menciptakan jeda respons", "paragraphs": ["Menciptakan jeda respons adalah bagian penting dari perjalanan memahami eq. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang menciptakan jeda respons, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Saat merasa kesal karena pesan belum dibalas, beri nama emosinya sebelum menyimpulkan niat orang lain. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Gunakan kalimat “Aku merasa ... ketika ... dan aku membutuhkan ...” untuk mengungkapkan kebutuhan. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Menciptakan jeda respons”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Empati tanpa mengasumsikan", "paragraphs": ["Empati tanpa mengasumsikan adalah bagian penting dari perjalanan memahami eq. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang empati tanpa mengasumsikan, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Saat merasa kesal karena pesan belum dibalas, beri nama emosinya sebelum menyimpulkan niat orang lain. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Gunakan kalimat “Aku merasa ... ketika ... dan aku membutuhkan ...” untuk mengungkapkan kebutuhan. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Empati tanpa mengasumsikan”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Komunikasi saat konflik", "paragraphs": ["Komunikasi saat konflik adalah bagian penting dari perjalanan memahami eq. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang komunikasi saat konflik, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Saat merasa kesal karena pesan belum dibalas, beri nama emosinya sebelum menyimpulkan niat orang lain. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Gunakan kalimat “Aku merasa ... ketika ... dan aku membutuhkan ...” untuk mengungkapkan kebutuhan. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Komunikasi saat konflik”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Batas diri yang sehat", "paragraphs": ["Batas diri yang sehat adalah bagian penting dari perjalanan memahami eq. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang batas diri yang sehat, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Saat merasa kesal karena pesan belum dibalas, beri nama emosinya sebelum menyimpulkan niat orang lain. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Gunakan kalimat “Aku merasa ... ketika ... dan aku membutuhkan ...” untuk mengungkapkan kebutuhan. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Batas diri yang sehat”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Memulihkan hubungan", "paragraphs": ["Memulihkan hubungan adalah bagian penting dari perjalanan memahami eq. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang memulihkan hubungan, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Saat merasa kesal karena pesan belum dibalas, beri nama emosinya sebelum menyimpulkan niat orang lain. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Gunakan kalimat “Aku merasa ... ketika ... dan aku membutuhkan ...” untuk mengungkapkan kebutuhan. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Memulihkan hubungan”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Membuat jurnal emosi", "paragraphs": ["Membuat jurnal emosi adalah bagian penting dari perjalanan memahami eq. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang membuat jurnal emosi, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Saat merasa kesal karena pesan belum dibalas, beri nama emosinya sebelum menyimpulkan niat orang lain. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Gunakan kalimat “Aku merasa ... ketika ... dan aku membutuhkan ...” untuk mengungkapkan kebutuhan. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Membuat jurnal emosi”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}], "time": [{"title": "Waktu, perhatian, dan energi", "paragraphs": ["Waktu, perhatian, dan energi adalah bagian penting dari perjalanan memahami time. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang waktu, perhatian, dan energi, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Daripada menulis dua puluh tugas, pilih satu hasil penting dan pecah menjadi langkah yang bisa dimulai dalam lima menit. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Susun satu prioritas utama, dua tugas pendukung, dan satu ruang cadangan. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Waktu, perhatian, dan energi”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Menyusun prioritas penting", "paragraphs": ["Menyusun prioritas penting adalah bagian penting dari perjalanan memahami time. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang menyusun prioritas penting, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Daripada menulis dua puluh tugas, pilih satu hasil penting dan pecah menjadi langkah yang bisa dimulai dalam lima menit. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Susun satu prioritas utama, dua tugas pendukung, dan satu ruang cadangan. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Menyusun prioritas penting”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Membagi tugas besar", "paragraphs": ["Membagi tugas besar adalah bagian penting dari perjalanan memahami time. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang membagi tugas besar, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Daripada menulis dua puluh tugas, pilih satu hasil penting dan pecah menjadi langkah yang bisa dimulai dalam lima menit. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Susun satu prioritas utama, dua tugas pendukung, dan satu ruang cadangan. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Membagi tugas besar”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Perencanaan yang fleksibel", "paragraphs": ["Perencanaan yang fleksibel adalah bagian penting dari perjalanan memahami time. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang perencanaan yang fleksibel, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Daripada menulis dua puluh tugas, pilih satu hasil penting dan pecah menjadi langkah yang bisa dimulai dalam lima menit. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Susun satu prioritas utama, dua tugas pendukung, dan satu ruang cadangan. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Perencanaan yang fleksibel”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Mengatasi prokrastinasi", "paragraphs": ["Mengatasi prokrastinasi adalah bagian penting dari perjalanan memahami time. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang mengatasi prokrastinasi, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Daripada menulis dua puluh tugas, pilih satu hasil penting dan pecah menjadi langkah yang bisa dimulai dalam lima menit. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Susun satu prioritas utama, dua tugas pendukung, dan satu ruang cadangan. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Mengatasi prokrastinasi”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Menjaga ruang istirahat", "paragraphs": ["Menjaga ruang istirahat adalah bagian penting dari perjalanan memahami time. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang menjaga ruang istirahat, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Daripada menulis dua puluh tugas, pilih satu hasil penting dan pecah menjadi langkah yang bisa dimulai dalam lima menit. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Susun satu prioritas utama, dua tugas pendukung, dan satu ruang cadangan. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Menjaga ruang istirahat”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Review mingguan", "paragraphs": ["Review mingguan adalah bagian penting dari perjalanan memahami time. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang review mingguan, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Daripada menulis dua puluh tugas, pilih satu hasil penting dan pecah menjadi langkah yang bisa dimulai dalam lima menit. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Susun satu prioritas utama, dua tugas pendukung, dan satu ruang cadangan. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Review mingguan”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Membuat sistem yang sederhana", "paragraphs": ["Membuat sistem yang sederhana adalah bagian penting dari perjalanan memahami time. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang membuat sistem yang sederhana, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Daripada menulis dua puluh tugas, pilih satu hasil penting dan pecah menjadi langkah yang bisa dimulai dalam lima menit. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Susun satu prioritas utama, dua tugas pendukung, dan satu ruang cadangan. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Membuat sistem yang sederhana”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}], "finance": [{"title": "Memetakan arus kas", "paragraphs": ["Memetakan arus kas adalah bagian penting dari perjalanan memahami finance. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang memetakan arus kas, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Mencatat pengeluaran kecil selama seminggu dapat mengungkap pola yang tidak terlihat dalam ingatan. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Kelompokkan pengeluaran menjadi kebutuhan, komitmen, dan pilihan; tinjau tanpa menghakimi diri. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Memetakan arus kas”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Kebutuhan dan keinginan", "paragraphs": ["Kebutuhan dan keinginan adalah bagian penting dari perjalanan memahami finance. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang kebutuhan dan keinginan, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Mencatat pengeluaran kecil selama seminggu dapat mengungkap pola yang tidak terlihat dalam ingatan. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Kelompokkan pengeluaran menjadi kebutuhan, komitmen, dan pilihan; tinjau tanpa menghakimi diri. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Kebutuhan dan keinginan”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Anggaran yang bisa dijalankan", "paragraphs": ["Anggaran yang bisa dijalankan adalah bagian penting dari perjalanan memahami finance. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang anggaran yang bisa dijalankan, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Mencatat pengeluaran kecil selama seminggu dapat mengungkap pola yang tidak terlihat dalam ingatan. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Kelompokkan pengeluaran menjadi kebutuhan, komitmen, dan pilihan; tinjau tanpa menghakimi diri. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Anggaran yang bisa dijalankan”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Dana darurat", "paragraphs": ["Dana darurat adalah bagian penting dari perjalanan memahami finance. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang dana darurat, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Mencatat pengeluaran kecil selama seminggu dapat mengungkap pola yang tidak terlihat dalam ingatan. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Kelompokkan pengeluaran menjadi kebutuhan, komitmen, dan pilihan; tinjau tanpa menghakimi diri. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Dana darurat”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Utang dan biaya bunga", "paragraphs": ["Utang dan biaya bunga adalah bagian penting dari perjalanan memahami finance. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang utang dan biaya bunga, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Mencatat pengeluaran kecil selama seminggu dapat mengungkap pola yang tidak terlihat dalam ingatan. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Kelompokkan pengeluaran menjadi kebutuhan, komitmen, dan pilihan; tinjau tanpa menghakimi diri. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Utang dan biaya bunga”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Risiko dan diversifikasi", "paragraphs": ["Risiko dan diversifikasi adalah bagian penting dari perjalanan memahami finance. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang risiko dan diversifikasi, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Mencatat pengeluaran kecil selama seminggu dapat mengungkap pola yang tidak terlihat dalam ingatan. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Kelompokkan pengeluaran menjadi kebutuhan, komitmen, dan pilihan; tinjau tanpa menghakimi diri. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Risiko dan diversifikasi”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Perlindungan dari penipuan", "paragraphs": ["Perlindungan dari penipuan adalah bagian penting dari perjalanan memahami finance. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang perlindungan dari penipuan, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Mencatat pengeluaran kecil selama seminggu dapat mengungkap pola yang tidak terlihat dalam ingatan. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Kelompokkan pengeluaran menjadi kebutuhan, komitmen, dan pilihan; tinjau tanpa menghakimi diri. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Perlindungan dari penipuan”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}, {"title": "Meninjau tujuan keuangan", "paragraphs": ["Meninjau tujuan keuangan adalah bagian penting dari perjalanan memahami finance. Pembahasan ini tidak dimaksudkan sebagai aturan kaku yang cocok bagi semua orang. Mulailah dengan memperhatikan situasi, tujuan, keterbatasan, dan sumber daya yang kamu miliki. Pemahaman yang bertahan biasanya muncul ketika sebuah gagasan diuji dalam kehidupan sehari-hari, bukan hanya dihafalkan sebagai kalimat yang terdengar menarik.", "Perhatikan hubungan antara pilihan kecil dan akibatnya dalam jangka panjang. Dalam praktik, perubahan sering terhambat bukan karena seseorang tidak mengetahui apa yang baik, tetapi karena langkah awal terlalu besar, lingkungan kurang mendukung, atau hasil yang diharapkan terlalu cepat. Untuk bab tentang meninjau tujuan keuangan, tanyakan terlebih dahulu masalah konkret apa yang ingin diselesaikan. Setelah itu, pilih indikator sederhana yang bisa diamati tanpa perlu mengukur setiap detik kehidupan.", "Contoh yang bisa dipertimbangkan: Mencatat pengeluaran kecil selama seminggu dapat mengungkap pola yang tidak terlihat dalam ingatan. Contoh tersebut bukan resep universal. Orang dengan jadwal, tanggung jawab, kesehatan, dan kondisi berbeda mungkin membutuhkan pendekatan lain. Hal terpenting adalah mengerti mengapa sebuah strategi membantu, lalu mengubahnya sesuai kebutuhan. Jika suatu cara tidak bekerja, anggap hasilnya sebagai data untuk memperbaiki strategi, bukan bukti bahwa kamu gagal sebagai pribadi.", "Untuk mempraktikkan gagasan ini, lakukan eksperimen kecil selama beberapa hari. Kelompokkan pengeluaran menjadi kebutuhan, komitmen, dan pilihan; tinjau tanpa menghakimi diri. Tuliskan apa yang terasa mudah, apa yang menghambat, dan perubahan kecil apa yang ingin dicoba berikutnya. Hindari menambah terlalu banyak target sekaligus: satu tindakan yang benar-benar dijalankan memberi pengalaman yang lebih berguna daripada daftar panjang yang hanya terlihat ambisius.", "Refleksi Hunter: apa satu keputusan yang bisa kamu ambil setelah memahami “Meninjau tujuan keuangan”? Hubungkan jawabanmu dengan quest, studi, pekerjaan, atau hubungan yang sedang kamu jalani. Kamu tidak perlu menyelesaikan semuanya hari ini. Tujuan bab ini adalah memberimu sudut pandang dan langkah yang dapat dicoba, kemudian dievaluasi dengan jujur. Kemajuan yang sehat menyediakan ruang untuk belajar, beristirahat, dan memulai kembali."]}]};
 const journalFields=[['good','Hal Baik Hari Ini','Apa yang membuatmu bersyukur atau senang?'],['improve','Refleksi Singkat','Apa yang ingin kamu perbaiki?'],['tomorrow','Harapan Besok','Satu hal yang ingin kamu usahakan besok']];
 let journalDate=null,articleId=null,filter='All';
 const ui=(id,en,ja)=>{const l=(typeof v6UiLang==='function'?v6UiLang():'id');return l==='en'?en:l==='ja'?ja:id;};
 function localizeOverlay(){
  const overlay=document.getElementById('v6-overlay');if(!overlay)return;
  const map={
   'HUNTER JOURNAL':['HUNTER JOURNAL','ハンター日記'], 'KNOWLEDGE LIBRARY':['KNOWLEDGE LIBRARY','知識ライブラリー'],
   'Jejak Perjalanan Hunter':['Hunter Journey Journal','ハンターの記録'],
   'Catatan pribadi, tersimpan hanya setelah kamu menekan Save Journal.':['Personal notes are saved only when you press Save Journal.','日記は「保存」を押した時だけ保存されます。'],
   'Hal Baik Hari Ini':['Good Things Today','今日のよかったこと'], 'Refleksi Singkat':['Short Reflection','短い振り返り'], 'Harapan Besok':['Tomorrow’s Intention','明日の目標'],
   'Apa yang membuatmu bersyukur atau senang?':['What made you grateful or happy?','感謝したことや嬉しかったことは？'],
   'Apa yang ingin kamu perbaiki?':['What would you like to improve?','改善したいことは？'],
   'Satu hal yang ingin kamu usahakan besok.':['One thing you want to work on tomorrow.','明日取り組みたいことを一つ。'],
   'Buka Library':['Open Library','ライブラリーを開く'], 'Buka Journal':['Open Journal','日記を開く'],
   'Simpan Jurnal':['Save Journal','日記を保存'], 'Save Journal':['Save Journal','日記を保存'],
   'Catatan':['Notes','メモ'], 'Sebelumnya':['Previous','前へ'], 'Berikutnya':['Next','次へ'],
   'Semua':['All','すべて'], 'Kembali':['Back','戻る'], 'Bab':['Chapter','章'], 'BAB':['CHAPTER','章'],
   'Knowledge Archive':['Knowledge Archive','知識アーカイブ'], 'Journal History':['Journal History','日記の履歴'],
   'Perubahan belum disimpan':['Unsaved changes','未保存の変更'],
  };
  const l=v6UiLang();const w=document.createTreeWalker(overlay,NodeFilter.SHOW_TEXT);
  let n;while((n=w.nextNode())){if(n.parentElement?.closest('.v6-article p, .v6-article .v6-chapter-text'))continue;
   const raw=n.textContent,trim=raw.trim();if(!trim)continue;
   const entry=map[trim]||Object.entries(map).find(([k])=>trim===k)?.[1];
   if(entry)n.textContent=raw.replace(trim,l==='en'?entry[0]:l==='ja'?entry[1]:trim);
  }
  overlay.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(el=>{const val=el.getAttribute('placeholder');if(map[val])el.placeholder=l==='en'?map[val][0]:l==='ja'?map[val][1]:val;});
 }
 const body=()=>document.getElementById('v6-body');
 const date=()=>typeof getCurrentGameDateKey==='function'?getCurrentGameDateKey():new Date().toISOString().slice(0,10);
 function show(title){document.getElementById('v6-heading').textContent=title;document.getElementById('v6-overlay').classList.remove('hidden');document.body.style.overflow='hidden';setTimeout(localizeOverlay,0);document.getElementById('v6-overlay').scrollTop=0;}
 function close(){if(journalDate && !confirmDiscard())return; journalDate=null;document.getElementById('v6-overlay').classList.add('hidden');document.body.style.overflow='';}
 const moods=[['Very Happy','🤩'],['Happy','😊'],['Neutral','😐'],['Sad','😔'],['Stressed','😣']];
 let journalDirty=false;
 function confirmDiscard(){return !journalDirty || confirm('Perubahan jurnal belum disimpan. Buang perubahan?');}
 function openJournal(){journalDate=date();journalDirty=false;renderJournal();show('HUNTER JOURNAL');}
 function openJournalAt(day){if(!/^\d{4}-\d{2}-\d{2}$/.test(day))return;journalDate=day;journalDirty=false;renderJournal();show('HUNTER JOURNAL');}
 function renderJournal(){
  journalDirty=false;
  const records=read(JKEY,{}),data=records[journalDate]||{},dates=Object.keys(records).sort().reverse();
  const list=dates.map(d=>`<button type="button" class="v6-history-item" data-day="${esc(d)}"><strong>${esc(d)} · ${moods.find(m=>m[0]===records[d].mood)?.[1]||'📖'} ${esc(records[d].mood||'')}</strong><small>${esc((records[d].good||records[d].achievements||records[d].activities||'Baca jurnal lengkap').slice(0,90))}</small><span class="v6-muted">Buka seluruh isi jurnal →</span></button>`).join('');
  body().innerHTML=`<div class="v6-journal-hero"><span>✦ HUNTER CHRONICLE</span><h3>Jejak Perjalanan Hunter</h3><p>Catatan pribadi, tersimpan hanya setelah kamu menekan Save Journal.</p><div class="v6-journal-stats"><span>📅 ${dates.length} Hari Tercatat</span><span>✍️ Manual Save</span></div></div><div class="v6-card"><h3>📜 Journal Archive</h3><div class="v6-history-list">${list||'<p class="v6-muted">Belum ada jurnal tersimpan.</p>'}</div></div><div class="v6-card"><h3>📓 ${records[journalDate]?'Read / Edit Journal':'New Daily Record'}</h3><p class="v6-muted">Tanggal: ${esc(journalDate)} · Semua isi catatan lama ditampilkan lengkap di bawah.</p><label class="v6-field">Tanggal jurnal<input id="v6-journal-date" type="date" value="${esc(journalDate)}"></label><div class="v6-field">How are you feeling today?<div class="v6-moods">${moods.map(([m,e])=>`<button type="button" class="v6-mood ${data.mood===m?'selected':''}" data-mood="${esc(m)}"><span>${e}</span><small>${esc(m)}</small></button>`).join('')}</div><input type="hidden" id="v6-mood" value="${esc(data.mood||'')}"></div>${(data.activities||data.achievements)?`<div class="v6-card"><h3>📚 Catatan lama</h3>${data.activities?`<p>${esc(data.activities)}</p>`:''}${data.achievements?`<p>${esc(data.achievements)}</p>`:''}</div>`:''}${journalFields.map(([id,title,hint])=>`<label class="v6-field">${esc(title)}<textarea id="v6-${id}" placeholder="${esc(hint)}">${esc(data[id]||'')}</textarea></label>`).join('')}<button type="button" class="v6-next-day" id="v6-save-journal">💾 ${records[journalDate]?'Update Journal':'Save Journal'}</button><p id="v6-save-status" class="v6-muted">${records[journalDate]?'✓ Jurnal tersimpan · Ubah lalu tekan Update':'Belum disimpan'}</p></div>`;
  localizeOverlay();
  body().querySelectorAll('[data-day]').forEach(b=>b.onclick=()=>{if(!confirmDiscard())return;journalDate=b.dataset.day;renderJournal();body().querySelector('.v6-card:last-child')?.scrollIntoView({behavior:'smooth',block:'start'});});
  document.getElementById('v6-journal-date').onchange=e=>{if(!confirmDiscard()){e.target.value=journalDate;return;}if(!/^\d{4}-\d{2}-\d{2}$/.test(e.target.value))return;journalDate=e.target.value;renderJournal();};
  body().querySelectorAll('[data-mood]').forEach(b=>b.onclick=()=>{document.getElementById('v6-mood').value=b.dataset.mood;body().querySelectorAll('[data-mood]').forEach(x=>x.classList.toggle('selected',x===b));markDirty();});
  journalFields.forEach(([id])=>document.getElementById('v6-'+id).oninput=markDirty);
  document.getElementById('v6-save-journal').onclick=saveJournal;
 }
 function markDirty(){journalDirty=true;document.getElementById('v6-save-status').textContent='● Perubahan belum disimpan';}
 function saveJournal(){
  const records=read(JKEY,{}),data={};['mood',...journalFields.map(x=>x[0])].forEach(id=>data[id]=document.getElementById('v6-'+id).value);
  records[journalDate]={...records[journalDate],...data,updatedAt:new Date().toISOString()};if(!write(JKEY,records))return;
  journalDirty=false;const active=date();let reward='';
  if(journalDate===active&&data.mood?.trim()&&data.good?.trim()&&data.tomorrow?.trim()){
   const ledger=read('system_rpg_v6_journal_rewards',{});
   if(!ledger[active]){ledger[active]=true;if(write('system_rpg_v6_journal_rewards',ledger)){addRewards(10,0,'WIS',5,true);saveState();reward=' · +10 EXP & +5 WIS XP';}}
  }
  renderJournal();document.getElementById('v6-save-status').textContent='✓ Journal saved'+reward;
  if(typeof renderHistory==='function')renderHistory();
 }
 function openLibrary(){articleId=null;filter='All';renderLibrary();show('KNOWLEDGE LIBRARY');requestAnimationFrame(()=>{const overlay=document.getElementById('v6-overlay');if(overlay)overlay.scrollTop=0;const content=document.getElementById('v6-body');if(content)content.scrollTop=0;});}
 function renderLibrary(){
  const progress=read(LKEY,{}),cats=['All',...new Set(articles.map(a=>a[2]))];
  body().innerHTML=`<div class="v6-card"><h3>📚 Knowledge Archive</h3><p>10 bacaan orisinal · 8 bab per artikel. Baca bertahap, simpan bookmark dan catatan, lanjutkan dari bab terakhir.</p><div class="v6-toolbar"><select id="v6-category">${cats.map(x=>`<option ${x===filter?'selected':''}>${esc(x)}</option>`).join('')}</select></div></div>${articles.filter(a=>filter==='All'||a[2]===filter).map(a=>{const p=progress[a[0]]||{};const n=CHAPTERS[a[0]].length;const ml=v6UiLang(),desc=ml==='id'?a[3]:(V6_CONTENT_LOCALES.metadata[a[0]]?.[ml==='ja'?1:0]||a[3]);return `<div class="v6-card"><h3>${esc(a[1])} ${p.read?'✓':''}</h3><p class="v6-muted">${esc(a[2])} · ${n} bab · ${p.bookmark?'★ Bookmark':'☆ Bookmark'}</p><p>${esc(desc)}</p><div class="v6-progress"><span style="width:${Math.min(100,Math.max(0,(Number(p.chapter)||0)/n*100))}%"></span></div><p class="v6-muted">${Math.min(n,Number(p.chapter)||0)} / ${n} bab selesai</p><button class="v6-action" onclick="V6.openArticle('${a[0]}')">${p.chapter?'Lanjutkan membaca':'Mulai membaca'} →</button></div>`}).join('')}`;
  localizeOverlay();
  document.getElementById('v6-category').onchange=e=>{filter=e.target.value;renderLibrary()};
 }
 function openArticle(id){
  const a=articles.find(x=>x[0]===id);if(!a)return;articleId=id;const p=read(LKEY,{})[id]||{},chapters=(V6_CONTENT_LOCALES.chapters[id]?.[v6UiLang()]||CHAPTERS[id]),idx=Math.min(chapters.length-1,Math.max(0,Number(p.currentChapter)||0)),c=chapters[idx];
  body().innerHTML=`<div class="v6-card v6-article"><button class="v6-action" id="v6-back">← Library</button><p class="v6-muted">${esc(a[2])} · BAB ${idx+1} / ${chapters.length}</p><h3>${esc(a[1])}</h3><div class="v6-progress"><span style="width:${Math.round((Number(p.chapter)||0)/chapters.length*100)}%"></span></div><h4>${esc(c.title)}</h4>${c.paragraphs.map(x=>`<p>${esc(x)}</p>`).join('')}<div class="v6-toolbar v6-reader-nav"><button id="v6-prev" ${idx===0?'disabled':''}>← Bab sebelumnya</button><button id="v6-next">${idx===chapters.length-1?'✓ Selesaikan artikel':'Bab berikutnya →'}</button></div><p class="v6-muted">Progress ${Math.min(chapters.length,Number(p.chapter)||0)} / ${chapters.length} bab · Reward hanya saat pertama selesai</p><label class="v6-field">Personal Notes<textarea id="v6-notes" placeholder="Catat hal yang kamu pelajari...">${esc(p.notes||'')}</textarea></label><button id="v6-bookmark" class="v6-action">${p.bookmark?'★ Bookmarked':'☆ Bookmark'}</button></div>`;
  localizeOverlay();
  document.getElementById('v6-back').onclick=renderLibrary;
  document.getElementById('v6-prev').onclick=()=>{updateArticle({currentChapter:idx-1});openArticle(id);document.getElementById('v6-overlay').scrollTop=0;};
  document.getElementById('v6-next').onclick=()=>{const next=Math.max(Number(p.chapter)||0,idx+1);updateArticle({chapter:next,currentChapter:Math.min(chapters.length-1,idx+1),percent:Math.round(next/chapters.length*100)});if(idx===chapters.length-1){const latest=read(LKEY,{})[id]||{};if(!latest.read){updateArticle({read:true});const key=date(),ledger=read('system_rpg_v6_read_rewards',{}),today=ledger[key]||[];if(!today.includes(id)&&today.length<2){today.push(id);ledger[key]=today;if(write('system_rpg_v6_read_rewards',ledger)){addRewards(5,0,'INT',5,true);saveState();spawnFloatingReward('📖 +5 EXP & +5 INT XP');}}}alert('📚 Artikel selesai! Catatan dan progresmu telah tersimpan.');renderLibrary();}else{openArticle(id);document.getElementById('v6-overlay').scrollTop=0;}};
  document.getElementById('v6-notes').onchange=e=>updateArticle({notes:e.target.value});
  document.getElementById('v6-bookmark').onclick=()=>{updateArticle({bookmark:!read(LKEY,{})[id]?.bookmark});openArticle(id)};
 }
 function updateArticle(patch){const all=read(LKEY,{});all[articleId]={...all[articleId],...patch,updatedAt:new Date().toISOString()};write(LKEY,all);}
 return {openJournal,openJournalAt,openLibrary,openArticle,close,refreshLanguage:()=>{if(document.getElementById('v6-overlay')?.classList.contains('hidden'))return;if(articleId){openArticle(articleId);}else if(document.getElementById('v6-category')){renderLibrary();}else{localizeOverlay();}}};
})();

window.addEventListener('system-language-changed',()=>{if(typeof renderShop==='function')renderShop();if(typeof renderOracle==='function')renderOracle();});

window.addEventListener('system-language-changed',()=>{if(typeof V6!=='undefined'&&V6.refreshLanguage)V6.refreshLanguage();});

function v6RefreshEntryLabels(){const l=v6UiLang();const entries=[['v6-journal-entry','HUNTER JOURNAL','Mood · Reflection · Tomorrow’s Goal','Buka Journal →','Open Journal →','日記を開く →'],['v6-library-entry','KNOWLEDGE LIBRARY','The Hunter’s Knowledge Archive · Artikel & Catatan','Buka Library →','Open Library →','ライブラリーを開く →']];for(const [id,title,sub,idBtn,enBtn,jaBtn] of entries){const e=document.getElementById(id);if(!e)continue;const btn=e.querySelector('button');if(btn)btn.textContent=l==='en'?enBtn:l==='ja'?jaBtn:idBtn;}}
window.addEventListener('system-language-changed',v6RefreshEntryLabels);
setTimeout(v6RefreshEntryLabels,0);

// Bundled track is selected by default; no music auto-plays in the Dungeon.
window.addEventListener('DOMContentLoaded', () => {
    const picker = document.getElementById('rpg-lofi-track');
    if (picker) {
        let lastTrack = 'moonlit';
        try { lastTrack = localStorage.getItem('system_rpg_lofi_track_v2') || 'moonlit'; } catch (_e) {}
        if (!['moonlit', 'night', 'synth'].includes(lastTrack)) lastTrack = 'moonlit';
        picker.value = lastTrack;
        selectRpgLofiTrack(lastTrack);
    }
});
