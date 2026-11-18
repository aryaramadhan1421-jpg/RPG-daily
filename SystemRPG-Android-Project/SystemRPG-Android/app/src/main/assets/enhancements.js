// ============================================================================
// SYSTEM RPG - CORE UPGRADE, BUG FIXES & FEATURE SUITE (ID / EN / JA)
// ============================================================================

(function () {
    'use strict';

    // ------------------------------------------------------------------------
    // 1. FAST O(1) MULTILINGUAL ENGINE (ANTI-FREEZE & FULL SYNC)
    // ------------------------------------------------------------------------
    const LANG_STORAGE_KEY = 'system_rpg_lang';

    const I18N_MAP = {
        id: {
            fp_hold_prompt: '[ TAHAN FINGERPRINT UNTUK AWAKENING ]',
            fp_scanning: 'MEMINDAI BIOMETRIK & MENYELARASKAN MANA...',
            fp_granted: '✓ AKSES DITERIMA • WELCOME, HUNTER',
            fp_music_toggle: 'Musik Biometrik',
            dash_fin_title: '💰 Analitik Keuangan',
            period_today: 'Hari Ini',
            period_week: 'Minggu Ini',
            period_month: 'Bulan Ini',
            period_custom: 'Custom',
            fin_income: 'Pemasukan',
            fin_expense: 'Pengeluaran',
            fin_net: 'Saldo Bersih',
            dungeon_abandon_q: 'Are you sure you want to abandon this dungeon?',
            dungeon_abandon_penalty: 'Membatalkan misi fokus akan memberikan penalti -10 HP.',
            btn_continue_dungeon: 'Continue Dungeon',
            btn_abandon_dungeon: 'Abandon Dungeon',
            tx_edit_title: 'Detail & Edit Transaksi',
            tx_type_lbl: 'Jenis',
            tx_date_lbl: 'Tanggal Transaksi',
            tx_amount_lbl: 'Nominal (Rp)',
            tx_cat_lbl: 'Kategori',
            tx_name_lbl: 'Nama Transaksi',
            tx_note_lbl: 'Catatan Tambahan (Opsional)',
            opt_expense: '📤 Pengeluaran (-)',
            opt_income: '📥 Pemasukan (+)',
            btn_cancel: 'Batal',
            btn_save: 'Simpan',
            tut_skip: 'Lewati',
            tut_prev: 'Sebelumnya',
            tut_next: 'Lanjut',
            tut_finish: 'Selesai',
            amb_focus: '🎧 Ambient Focus',
            amb_synth: '🌌 Dark Synth',
            amb_rain: '🌧️ Suara Hujan',
            notif_title_slot: '⚔️ SYSTEM // Pengingat {slot}',
            notif_body_pending: 'Hunter {name}, masih ada {count} Daily Quest belum selesai. Jaga Streak {streak} harimu!',
            notif_body_done: 'Luar biasa Hunter {name}! Semua Daily Quest hari ini selesai 100%!'
        },
        en: {
            fp_hold_prompt: '[ HOLD FINGERPRINT FOR AWAKENING ]',
            fp_scanning: 'SCANNING BIOMETRICS & ATTUNING MANA...',
            fp_granted: '✓ ACCESS GRANTED • WELCOME, HUNTER',
            fp_music_toggle: 'Biometric Music',
            dash_fin_title: '💰 Financial Analytics',
            period_today: 'Today',
            period_week: 'This Week',
            period_month: 'This Month',
            period_custom: 'Custom',
            fin_income: 'Income',
            fin_expense: 'Expense',
            fin_net: 'Net Balance',
            dungeon_abandon_q: 'Are you sure you want to abandon this dungeon?',
            dungeon_abandon_penalty: 'Abandoning the focus dungeon will inflict a -10 HP penalty.',
            btn_continue_dungeon: 'Continue Dungeon',
            btn_abandon_dungeon: 'Abandon Dungeon',
            tx_edit_title: 'Transaction Detail & Edit',
            tx_type_lbl: 'Type',
            tx_date_lbl: 'Transaction Date',
            tx_amount_lbl: 'Amount (Rp)',
            tx_cat_lbl: 'Category',
            tx_name_lbl: 'Transaction Name',
            tx_note_lbl: 'Additional Notes (Optional)',
            opt_expense: '📤 Expense (-)',
            opt_income: '📥 Income (+)',
            btn_cancel: 'Cancel',
            btn_save: 'Save',
            tut_skip: 'Skip',
            tut_prev: 'Previous',
            tut_next: 'Next',
            tut_finish: 'Finish',
            amb_focus: '🎧 Ambient Focus',
            amb_synth: '🌌 Dark Synth',
            amb_rain: '🌧️ Rain Sound',
            notif_title_slot: '⚔️ SYSTEM // {slot} Reminder',
            notif_body_pending: 'Hunter {name}, you still have {count} unfinished Daily Quests. Protect your {streak}-day Streak!',
            notif_body_done: 'Outstanding Hunter {name}! All Daily Quests for today are 100% cleared!'
        },
        ja: {
            fp_hold_prompt: '[ 指紋を長押しして覚醒する ]',
            fp_scanning: '生体認証スキャン＆マナ同調中...',
            fp_granted: '✓ アクセス承認 • ようこそ、ハンター',
            fp_music_toggle: '生体認証音楽',
            dash_fin_title: '💰 財務アナリティクス',
            period_today: '今日',
            period_week: '今週',
            period_month: '今月',
            period_custom: 'カスタム',
            fin_income: '収入',
            fin_expense: '支出',
            fin_net: '純残高',
            dungeon_abandon_q: 'Are you sure you want to abandon this dungeon?',
            dungeon_abandon_penalty: 'ダンジョンを中断すると -10 HP のペナルティを受けます。',
            btn_continue_dungeon: 'Continue Dungeon',
            btn_abandon_dungeon: 'Abandon Dungeon',
            tx_edit_title: '取引の詳細と編集',
            tx_type_lbl: '種類',
            tx_date_lbl: '取引日',
            tx_amount_lbl: '金額 (Rp)',
            tx_cat_lbl: 'カテゴリー',
            tx_name_lbl: '取引名',
            tx_note_lbl: '追加メモ（任意）',
            opt_expense: '📤 支出 (-)',
            opt_income: '📥 収入 (+)',
            btn_cancel: 'キャンセル',
            btn_save: '保存',
            tut_skip: 'スキップ',
            tut_prev: '前へ',
            tut_next: '次へ',
            tut_finish: '完了',
            amb_focus: '🎧 アンビエント集中',
            amb_synth: '🌌 ダークシンセ',
            amb_rain: '🌧️ 雨音',
            notif_title_slot: '⚔️ SYSTEM // {slot}リマインダー',
            notif_body_pending: 'ハンター {name}、未完了のデイリークエストが {count} 件残っています。{streak}日連続記録を守りましょう！',
            notif_body_done: '素晴らしいハンター {name}！本日のデイリークエストを100%達成しました！'
        }
    };

    const TREASURY_CAT_CATALOG = {
        expense: [
            { id: 'exp_food', icon: '🍔', labels: { id: 'Makan & Jajan', en: 'Food & Dining', ja: '食事・軽食' }, color: '#fb7185' },
            { id: 'exp_transport', icon: '🚗', labels: { id: 'Transportasi', en: 'Transportation', ja: '交通費' }, color: '#38bdf8' },
            { id: 'exp_shopping', icon: '🛒', labels: { id: 'Belanja & Kebutuhan', en: 'Shopping & Supplies', ja: '買い物・日用品' }, color: '#fbbf24' },
            { id: 'exp_bills', icon: '📱', labels: { id: 'Tagihan & Kuota', en: 'Bills & Utilities', ja: '通信費・請求書' }, color: '#a855f7' },
            { id: 'exp_edu', icon: '📚', labels: { id: 'Edukasi & Buku', en: 'Education & Books', ja: '教育・書籍' }, color: '#34d399' },
            { id: 'exp_ent', icon: '🎮', labels: { id: 'Hiburan', en: 'Entertainment', ja: '娯楽・エンタメ' }, color: '#f472b6' },
            { id: 'exp_health', icon: '💊', labels: { id: 'Kesehatan', en: 'Health & Wellness', ja: '医療・健康' }, color: '#2dd4bf' },
            { id: 'exp_other', icon: '📦', labels: { id: 'Lainnya', en: 'Other Expense', ja: 'その他の支出' }, color: '#94a3b8' }
        ],
        income: [
            { id: 'inc_salary', icon: '💼', labels: { id: 'Gaji / Honor', en: 'Salary / Wages', ja: '給与・報酬' }, color: '#10b981' },
            { id: 'inc_bonus', icon: '🎁', labels: { id: 'Bonus / Hadiah', en: 'Bonus / Gift', ja: 'ボーナス・賞与' }, color: '#22d3ee' },
            { id: 'inc_biz', icon: '📈', labels: { id: 'Usaha / Freelance', en: 'Business / Freelance', ja: '事業・フリーランス' }, color: '#f59e0b' },
            { id: 'inc_other', icon: '💰', labels: { id: 'Pemasukan Lain', en: 'Other Income', ja: 'その他の収入' }, color: '#818cf8' }
        ]
    };

    function migrateLegacyTreasuryCategories() {
        if (!window.gameState || !gameState.treasury || !Array.isArray(gameState.treasury.transactions)) return;
        const legacyMap = {
            '🍔 Makan & Jajan': 'exp_food',
            '🚗 Transportasi': 'exp_transport',
            '🛒 Belanja & Kebutuhan': 'exp_shopping',
            '📱 Tagihan & Kuota': 'exp_bills',
            '📚 Edukasi & Buku': 'exp_edu',
            '🎮 Hiburan': 'exp_ent',
            '💊 Kesehatan': 'exp_health',
            '📦 Lainnya': 'exp_other',
            '💼 Gaji / Honor': 'inc_salary',
            '🎁 Bonus / Hadiah': 'inc_bonus',
            '📈 Usaha / Freelance': 'inc_biz',
            '💰 Pemasukan Lain': 'inc_other'
        };
        let changed = false;
        gameState.treasury.transactions.forEach(tx => {
            if (!tx.categoryId) {
                tx.categoryId = legacyMap[tx.category] || (tx.type === 'income' ? 'inc_other' : 'exp_other');
                changed = true;
            }
            if (!tx.name) {
                tx.name = tx.note || 'Transaksi';
                changed = true;
            }
            if (!tx.createdAt) {
                tx.createdAt = tx.dateStr ? `${tx.dateStr} 12:00` : new Date().toISOString().slice(0, 16).replace('T', ' ');
                changed = true;
            }
        });
        if (changed && typeof saveState === 'function') saveState();
    }

    function getActiveLang() {
        const l = localStorage.getItem(LANG_STORAGE_KEY) || (window.gameState && gameState.language) || 'id';
        return ['id', 'en', 'ja'].includes(l) ? l : 'id';
    }

    function tKey(key, vars = {}) {
        const lang = getActiveLang();
        let str = (I18N_MAP[lang] && I18N_MAP[lang][key]) || I18N_MAP.id[key] || key;
        Object.entries(vars).forEach(([k, v]) => {
            str = str.replace(new RegExp(`\{${k}\}`, 'g'), String(v));
        });
        return str;
    }

    function getCategoryMeta(catId, type = 'expense') {
        const pool = [...TREASURY_CAT_CATALOG.expense, ...TREASURY_CAT_CATALOG.income];
        return pool.find(c => c.id === catId) || (type === 'income' ? TREASURY_CAT_CATALOG.income[3] : TREASURY_CAT_CATALOG.expense[7]);
    }

    function getLocalizedCategoryLabel(catId, type = 'expense') {
        const lang = getActiveLang();
        const meta = getCategoryMeta(catId, type);
        return `${meta.icon} ${meta.labels[lang] || meta.labels.id}`;
    }

    let langSwitchLock = false;
    window.setAppLanguage = function (lang) {
        if (langSwitchLock) return;
        langSwitchLock = true;
        const validLang = ['id', 'en', 'ja'].includes(lang) ? lang : 'id';

        requestAnimationFrame(() => {
            try {
                localStorage.setItem(LANG_STORAGE_KEY, validLang);
                localStorage.setItem('sysrpg_lang', validLang);
                document.documentElement.lang = validLang;

                if (window.gameState) {
                    gameState.language = validLang;
                    if (typeof saveState === 'function') saveState();
                }

                document.querySelectorAll('[data-i18n]').forEach(el => {
                    const key = el.getAttribute('data-i18n');
                    const translated = tKey(key);
                    if (el.textContent !== translated) el.textContent = translated;
                });

                document.querySelectorAll('.app-lang-btn').forEach(btn => {
                    const isAct = btn.id === `lang-btn-${validLang}`;
                    btn.style.borderColor = isAct ? '#06b6d4' : '#334155';
                    btn.style.background = isAct ? '#083344' : '#020617';
                    btn.style.color = isAct ? '#67e8f9' : '#cbd5e1';
                });

                updateTreasuryCategoryOptions();
                if (typeof renderAll === 'function') renderAll();
                renderDashboardFinance();
                syncLocalizedSystemNotifications();

                if (typeof SoundFX !== 'undefined' && SoundFX.playClick) SoundFX.playClick();
            } finally {
                langSwitchLock = false;
            }
        });
    };

    // ------------------------------------------------------------------------
    // 2. LOCALIZED NOTIFICATIONS (NO DUPLICATES ON LANGUAGE CHANGE)
    // ------------------------------------------------------------------------
    function syncLocalizedSystemNotifications() {
        if (!window.gameState || !gameState.reminders || !gameState.reminders.enabled) return;
        const lang = getActiveLang();
        const summary = typeof getPendingDailySummary === 'function' ? getPendingDailySummary() : { pendingCount: 0, done: 0, total: 0 };
        const slotNames = {
            id: { Pagi: 'Pagi', Sore: 'Sore', Malam: 'Malam' },
            en: { Pagi: 'Morning', Sore: 'Evening', Malam: 'Night' },
            ja: { Pagi: '朝', Sore: '夕方', Malam: '夜' }
        }[lang];

        const payload = {
            lang,
            times: gameState.reminders.times,
            pendingCount: summary.pendingCount,
            playerName: gameState.player.name,
            streak: gameState.player.streak,
            localizedMessages: {
                Pagi: {
                    title: tKey('notif_title_slot', { slot: slotNames.Pagi }),
                    body: summary.pendingCount > 0
                        ? tKey('notif_body_pending', { name: gameState.player.name, count: summary.pendingCount, streak: gameState.player.streak })
                        : tKey('notif_body_done', { name: gameState.player.name })
                },
                Sore: {
                    title: tKey('notif_title_slot', { slot: slotNames.Sore }),
                    body: summary.pendingCount > 0
                        ? tKey('notif_body_pending', { name: gameState.player.name, count: summary.pendingCount, streak: gameState.player.streak })
                        : tKey('notif_body_done', { name: gameState.player.name })
                },
                Malam: {
                    title: tKey('notif_title_slot', { slot: slotNames.Malam }),
                    body: summary.pendingCount > 0
                        ? tKey('notif_body_pending', { name: gameState.player.name, count: summary.pendingCount, streak: gameState.player.streak })
                        : tKey('notif_body_done', { name: gameState.player.name })
                }
            }
        };

        try {
            if (window.AndroidBridge && typeof window.AndroidBridge.scheduleDailyRemindersFull === 'function') {
                window.AndroidBridge.scheduleDailyRemindersFull(JSON.stringify(payload));
            }
        } catch (e) {}
    }
    window.syncSystemReminders = syncLocalizedSystemNotifications;

    // ------------------------------------------------------------------------
    // 3. FINGERPRINT LONG-PRESS MUSIC ENGINE
    // ------------------------------------------------------------------------
    let fpHoldTimer = null;
    let fpIsHolding = false;
    let fpUnlocked = false;
    let fpAudioNodes = [];
    let fpAudioCtx = null;

    window.toggleFingerprintMusicSetting = function (enabled) {
        localStorage.setItem('sysrpg_fp_music_enabled', enabled ? '1' : '0');
        if (!enabled) stopFingerprintMusic();
    };

    window.setFingerprintMusicTrack = function (track) {
        localStorage.setItem('sysrpg_fp_music_track', track);
        const upBtn = document.getElementById('btn-fp-upload-mp3');
        if (upBtn) {
            if (track === 'custom') upBtn.classList.remove('hidden');
            else upBtn.classList.add('hidden');
        }
    };

    window.loadFingerprintCustomMp3 = function (e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const audioEl = document.getElementById('fp-custom-audio');
        if (audioEl) {
            audioEl.src = URL.createObjectURL(file);
            audioEl.loop = true;
        }
    };

    function startFingerprintMusic() {
        const enabled = localStorage.getItem('sysrpg_fp_music_enabled') !== '0';
        if (!enabled || (window.SoundFX && SoundFX.muted)) return;
        stopFingerprintMusic();

        const track = localStorage.getItem('sysrpg_fp_music_track') || 'cyber';
        if (track === 'custom') {
            const audioEl = document.getElementById('fp-custom-audio');
            if (audioEl && audioEl.src) {
                audioEl.currentTime = 0;
                audioEl.play().catch(() => {});
                return;
            }
        }

        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!fpAudioCtx) fpAudioCtx = new AudioCtx();
        if (fpAudioCtx.state === 'suspended') fpAudioCtx.resume();

        const now = fpAudioCtx.currentTime;
        const master = fpAudioCtx.createGain();
        master.gain.setValueAtTime(0.001, now);
        master.gain.exponentialRampToValueAtTime(0.18, now + 0.35);
        master.connect(fpAudioCtx.destination);

        const freqs = track === 'ethereal' ? [261.63, 329.63, 392.00, 523.25] : [110.00, 164.81, 220.00, 329.63];
        freqs.forEach((f, idx) => {
            const osc = fpAudioCtx.createOscillator();
            osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(f, now);
            osc.connect(master);
            osc.start(now);
            fpAudioNodes.push(osc);
        });
        fpAudioNodes.push(master);
    }

    function stopFingerprintMusic() {
        const audioEl = document.getElementById('fp-custom-audio');
        if (audioEl) {
            audioEl.pause();
            audioEl.currentTime = 0;
        }
        if (fpAudioNodes.length > 0) {
            fpAudioNodes.forEach(n => {
                try { if (n.stop) n.stop(); n.disconnect(); } catch (e) {}
            });
            fpAudioNodes = [];
        }
    }

    function initFingerprintLongPress() {
        const pad = document.getElementById('btn-fingerprint-auth');
        if (!pad) return;

        pad.removeAttribute('onclick');

        const statusEl = document.getElementById('fp-status-text');
        const ringEl = document.getElementById('fp-hold-ring');
        if (statusEl) statusEl.textContent = tKey('fp_hold_prompt');

        const savedEnabled = localStorage.getItem('sysrpg_fp_music_enabled') !== '0';
        const savedTrack = localStorage.getItem('sysrpg_fp_music_track') || 'cyber';
        const chkEl = document.getElementById('fp-music-enabled');
        const selEl = document.getElementById('fp-music-track');
        if (chkEl) chkEl.checked = savedEnabled;
        if (selEl) {
            selEl.value = savedTrack;
            setFingerprintMusicTrack(savedTrack);
        }

        const onPressStart = (e) => {
            if (e.type === 'pointerdown' && e.button !== 0) return;
            if (fpIsHolding || fpUnlocked) return;
            fpIsHolding = true;

            pad.classList.add('scanning');
            if (ringEl) ringEl.style.borderColor = '#22d3ee';
            if (statusEl) {
                statusEl.textContent = tKey('fp_scanning');
                statusEl.style.color = '#fcd34d';
            }
            if (navigator.vibrate) {
                try { navigator.vibrate(40); } catch (err) {}
            }

            startFingerprintMusic();

            fpHoldTimer = setTimeout(() => {
                fpUnlocked = true;
                fpIsHolding = false;
                stopFingerprintMusic();
                pad.classList.remove('scanning');
                pad.classList.add('verified');
                if (ringEl) ringEl.style.borderColor = '#34d399';
                if (statusEl) {
                    statusEl.textContent = tKey('fp_granted');
                    statusEl.style.color = '#34d399';
                }
                if (typeof SoundFX !== 'undefined' && SoundFX.playQuestComplete) SoundFX.playQuestComplete();

                setTimeout(() => {
                    const splash = document.getElementById('system-splash-screen');
                    if (splash) {
                        splash.classList.add('fade-out');
                        setTimeout(() => {
                            if (splash.parentNode) splash.remove();
                            checkAndStartFirstTimeTutorial();
                        }, 550);
                    }
                }, 350);
            }, 1350);
        };

        const onPressRelease = () => {
            if (!fpIsHolding || fpUnlocked) return;
            fpIsHolding = false;
            clearTimeout(fpHoldTimer);
            stopFingerprintMusic();
            pad.classList.remove('scanning');
            if (ringEl) ringEl.style.borderColor = 'transparent';
            if (statusEl) {
                statusEl.textContent = tKey('fp_hold_prompt');
                statusEl.style.color = '#67e8f9';
            }
        };

        pad.addEventListener('pointerdown', onPressStart);
        pad.addEventListener('pointerup', onPressRelease);
        pad.addEventListener('pointerleave', onPressRelease);
        pad.addEventListener('pointercancel', onPressRelease);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) onPressRelease();
        });
    }

    // ------------------------------------------------------------------------
    // 4. INTERACTIVE SPOTLIGHT ONBOARDING TUTORIAL
    // ------------------------------------------------------------------------
    const TUTORIAL_STEPS = [
        {
            tab: 'status',
            targetId: 'player-name-display',
            title: { id: '1. Dashboard & Status Hunter', en: '1. Dashboard & Hunter Status', ja: '1. ダッシュボード＆ステータス' },
            desc: {
                id: 'Pantau Level, EXP, HP, Rank, dan 4 atribut utama (STR, INT, WIS, CHR) beserta analitik keuanganmu di sini.',
                en: 'Track your Level, EXP, HP, Rank, and 4 core attributes (STR, INT, WIS, CHR) along with your financial analytics here.',
                ja: 'レベル、EXP、HP、ランク、4つの基本能力値（STR/INT/WIS/CHR）と財務分析をここで確認できます。'
            }
        },
        {
            tab: 'quests',
            targetId: 'quest-list',
            title: { id: '2. Habit Tracker & Quest Board', en: '2. Habit Tracker & Quest Board', ja: '2. 習慣トラッカー＆クエスト' },
            desc: {
                id: 'Tambah habit harian, atur jadwal hari aktif, dan centang misi untuk meraih EXP, Gold, serta menjaga Streak harian.',
                en: 'Add daily habits, configure active days, and check off quests to earn EXP, Gold, and build your daily Streak.',
                ja: '毎日の習慣を追加し、完了チェックを入れてEXPやゴールドを獲得し、連続記録を伸ばしましょう。'
            }
        },
        {
            tab: 'dungeon',
            targetId: 'btn-start-dungeon',
            title: { id: '3. Deep Focus Dungeon', en: '3. Deep Focus Dungeon', ja: '3. 集中ダンジョン' },
            desc: {
                id: 'Masuki Dungeon timer untuk sesi fokus mendalam. Selesaikan tanpa menyerah untuk hadiah +INT, EXP, dan Gold!',
                en: 'Enter the focus timer gate for deep work sessions. Clear it without abandoning to claim +INT, EXP, and Gold!',
                ja: '集中タイマーでディープワークを開始。諦めずにクリアして +INT、EXP、ゴールドを獲得しよう！'
            }
        },
        {
            tab: 'treasury',
            targetId: 'tx-amount',
            title: { id: '4. Treasury (Pencatatan Keuangan)', en: '4. Treasury (Financial Tracker)', ja: '4. 財務庫（収支管理）' },
            desc: {
                id: 'Catat pemasukan dan pengeluaran dengan tanggal custom, kategori otomatis, serta bonus RPG hingga 3x sehari.',
                en: 'Log income and expenses with custom dates, auto-translated categories, and earn RPG bonuses up to 3x daily.',
                ja: 'カスタム日付や翻訳対応カテゴリーで収支を記録し、1日3回までRPGボーナスを獲得できます。'
            }
        },
        {
            tab: 'shop',
            targetId: 'shop-list',
            title: { id: '5. Hunter Shop & Armory', en: '5. Hunter Shop & Armory', ja: '5. ショップ＆アーモリー' },
            desc: {
                id: 'Tukarkan Gold hasil kerja kerasmu dengan Potion pemulih HP, Streak Freeze, Relic buff, atau reward dunia nyata.',
                en: 'Spend your hard-earned Gold on HP Potions, Streak Freezes, buff Relics, or custom real-world rewards.',
                ja: '獲得したゴールドでHPポーション、ストリーク保護、バフレリック、現実のご褒美を購入できます。'
            }
        },
        {
            tab: 'status',
            targetId: 'btn-toggle-notif',
            title: { id: '6. Smart Reminder Notifikasi', en: '6. Smart Notification Reminders', ja: '6. スマート通知リマインダー' },
            desc: {
                id: 'Atur jadwal pengingat Pagi, Sore, dan Malam agar kamu tidak melewatkan Daily Quest dan menjaga HP tetap aman.',
                en: 'Configure Morning, Evening, and Night reminder schedules so you never miss Daily Quests or lose HP.',
                ja: '朝・夕方・夜のリマインダーを設定し、デイリークエストのやり忘れやHP減少を防ぎましょう。'
            }
        },
        {
            tab: 'dungeon',
            targetId: 'amb-focus',
            title: { id: '7. Ambient Focus & Lofi Music', en: '7. Ambient Focus & Lofi Music', ja: '7. アンビエント集中＆Lo-Fi音楽' },
            desc: {
                id: 'Pilih Ambient Focus, Dark Synth, Suara Hujan, atau MP3 pribadi untuk menemani sesi fokusmu di Dungeon.',
                en: 'Choose Ambient Focus, Dark Synth, Rain Sounds, or your own MP3 tracks to accompany your Dungeon focus sessions.',
                ja: 'アンビエント集中、ダークシンセ、雨音、または端末のMP3を選んで集中セッションを快適に。'
            }
        }
    ];

    let currentTutorialIdx = 0;

    function checkAndStartFirstTimeTutorial() {
        const done = localStorage.getItem('sysrpg_tutorial_completed') === '1';
        if (!done) {
            startOnboardingTutorial(false);
        }
    }

    window.startOnboardingTutorial = function () {
        currentTutorialIdx = 0;
        const overlay = document.getElementById('onboarding-overlay');
        if (!overlay) return;
        overlay.classList.remove('hidden');
        renderTutorialStep();
    };

    function renderTutorialStep() {
        const lang = getActiveLang();
        const step = TUTORIAL_STEPS[currentTutorialIdx];
        if (!step) return;

        if (typeof switchTab === 'function') {
            switchTab(step.tab);
        }

        document.getElementById('tut-step-badge').textContent = `STEP ${currentTutorialIdx + 1} / ${TUTORIAL_STEPS.length}`;
        document.getElementById('tut-title').textContent = step.title[lang] || step.title.id;
        document.getElementById('tut-desc').textContent = step.desc[lang] || step.desc.id;

        const prevBtn = document.getElementById('tut-btn-prev');
        const nextBtn = document.getElementById('tut-btn-next');
        if (prevBtn) prevBtn.style.visibility = currentTutorialIdx === 0 ? 'hidden' : 'visible';
        if (nextBtn) {
            nextBtn.textContent = currentTutorialIdx === TUTORIAL_STEPS.length - 1 ? tKey('tut_finish') : tKey('tut_next');
        }

        setTimeout(() => {
            const targetEl = document.getElementById(step.targetId);
            const ring = document.getElementById('onboarding-spotlight-ring');
            if (targetEl && ring) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const rect = targetEl.getBoundingClientRect();
                ring.style.top = `${Math.max(8, rect.top - 6)}px`;
                ring.style.left = `${Math.max(8, rect.left - 6)}px`;
                ring.style.width = `${Math.min(window.innerWidth - 16, rect.width + 12)}px`;
                ring.style.height = `${rect.height + 12}px`;
            }
        }, 120);
    }

    window.nextTutorialStep = function () {
        if (currentTutorialIdx < TUTORIAL_STEPS.length - 1) {
            currentTutorialIdx++;
            renderTutorialStep();
        } else {
            finishOnboardingTutorial();
        }
    };

    window.prevTutorialStep = function () {
        if (currentTutorialIdx > 0) {
            currentTutorialIdx--;
            renderTutorialStep();
        }
    };

    window.finishOnboardingTutorial = function () {
        localStorage.setItem('sysrpg_tutorial_completed', '1');
        const overlay = document.getElementById('onboarding-overlay');
        if (overlay) overlay.classList.add('hidden');
        if (typeof switchTab === 'function') switchTab('status');
    };

    // ------------------------------------------------------------------------
    // 5. TREASURY UPGRADE & DASHBOARD SVG PIE CHART ANALYTICS
    // ------------------------------------------------------------------------
    let dashFinancePeriod = 'month';
    let selectedPieCategoryId = null;

    window.updateTreasuryCategoryOptions = function () {
        const typeEl = document.getElementById('tx-type');
        const catEl = document.getElementById('tx-category');
        if (!typeEl || !catEl) return;
        const type = typeEl.value || 'expense';
        const list = TREASURY_CAT_CATALOG[type] || TREASURY_CAT_CATALOG.expense;
        const lang = getActiveLang();
        catEl.innerHTML = list.map(c => `<option value="${c.id}">${c.icon} ${c.labels[lang] || c.labels.id}</option>`).join('');
    };

    window.updateEditTreasuryCategoryOptions = function () {
        const typeEl = document.getElementById('edit-tx-type');
        const catEl = document.getElementById('edit-tx-category');
        if (!typeEl || !catEl) return;
        const type = typeEl.value || 'expense';
        const list = TREASURY_CAT_CATALOG[type] || TREASURY_CAT_CATALOG.expense;
        const lang = getActiveLang();
        catEl.innerHTML = list.map(c => `<option value="${c.id}">${c.icon} ${c.labels[lang] || c.labels.id}</option>`).join('');
    };

    window.handleAddTreasuryTx = function (e) {
        e.preventDefault();
        migrateLegacyTreasuryCategories();
        const tr = gameState.treasury;
        const type = document.getElementById('tx-type').value;
        const dateStr = document.getElementById('tx-date').value || getCurrentGameDateKey();
        const amount = Math.max(1, parseInt(document.getElementById('tx-amount').value, 10) || 0);
        const categoryId = document.getElementById('tx-category').value;
        const note = document.getElementById('tx-note').value.trim();
        if (!amount || !note) return;

        const now = new Date();
        const createdAt = `${formatDateKey(now)} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        tr.transactions.unshift({
            id: 'tx_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
            type,
            dateStr,
            createdAt,
            amount,
            categoryId,
            name: note,
            note
        });

        const todayKey = getCurrentGameDateKey();
        const usedToday = tr.dailyBonusCounts[todayKey] || 0;
        if (usedToday < 3) {
            tr.dailyBonusCounts[todayKey] = usedToday + 1;
            if (typeof SoundFX !== 'undefined') SoundFX.playQuestComplete();
            addRewards(10, 0, 'WIS', 10, true);
        } else if (typeof SoundFX !== 'undefined') {
            SoundFX.playCoin();
        }

        document.getElementById('tx-amount').value = '';
        document.getElementById('tx-note').value = '';
        saveState();
        renderTreasury();
        renderDashboardFinance();
    };

    window.openEditTreasuryTxModal = function (txId) {
        migrateLegacyTreasuryCategories();
        const tx = (gameState.treasury.transactions || []).find(t => t.id === txId);
        if (!tx) return;
        document.getElementById('edit-tx-id').value = tx.id;
        document.getElementById('edit-tx-type').value = tx.type;
        updateEditTreasuryCategoryOptions();
        document.getElementById('edit-tx-date').value = tx.dateStr;
        document.getElementById('edit-tx-amount').value = tx.amount;
        document.getElementById('edit-tx-category').value = tx.categoryId;
        document.getElementById('edit-tx-name').value = tx.name || tx.note || '';
        document.getElementById('edit-tx-note').value = tx.note || '';
        document.getElementById('edit-tx-created-at').textContent = `Logged: ${tx.createdAt || tx.dateStr}`;
        openModal('modal-edit-tx');
    };

    window.saveEditedTreasuryTx = function (e) {
        e.preventDefault();
        const id = document.getElementById('edit-tx-id').value;
        const tx = (gameState.treasury.transactions || []).find(t => t.id === id);
        if (!tx) return;

        tx.type = document.getElementById('edit-tx-type').value;
        tx.dateStr = document.getElementById('edit-tx-date').value;
        tx.amount = Math.max(1, parseInt(document.getElementById('edit-tx-amount').value, 10) || tx.amount);
        tx.categoryId = document.getElementById('edit-tx-category').value;
        tx.name = document.getElementById('edit-tx-name').value.trim() || tx.name;
        tx.note = document.getElementById('edit-tx-note').value.trim() || tx.name;

        closeModal('modal-edit-tx');
        saveState();
        renderTreasury();
        renderDashboardFinance();
        if (typeof SoundFX !== 'undefined') SoundFX.playQuestComplete();
    };

    window.confirmDeleteCurrentTx = function () {
        const id = document.getElementById('edit-tx-id').value;
        if (!id) return;
        if (!window.confirm('Hapus transaksi ini secara permanen? / Delete this transaction?')) return;
        gameState.treasury.transactions = gameState.treasury.transactions.filter(t => t.id !== id);
        closeModal('modal-edit-tx');
        saveState();
        renderTreasury();
        renderDashboardFinance();
    };

    const _baseRenderTreasury = window.renderTreasury;
    window.renderTreasury = function () {
        migrateLegacyTreasuryCategories();
        if (typeof _baseRenderTreasury === 'function') _baseRenderTreasury();

        const tr = gameState.treasury;
        const todayKey = getCurrentGameDateKey();
        const fDate = document.getElementById('tr-filter-date')?.value || todayKey;
        const fMonth = document.getElementById('tr-filter-month')?.value || todayKey.slice(0, 7);
        const fYear = document.getElementById('tr-filter-year')?.value || todayKey.slice(0, 4);

        const filtered = tr.transactions.filter(tx => {
            if (window.treasuryPeriodMode === 'daily') return tx.dateStr === fDate;
            if (window.treasuryPeriodMode === 'monthly') return (tx.dateStr || '').startsWith(fMonth);
            return (tx.dateStr || '').startsWith(fYear);
        });

        let totalOut = 0;
        const catTotals = {};
        filtered.forEach(tx => {
            if (tx.type !== 'income') {
                totalOut += tx.amount;
                catTotals[tx.categoryId] = (catTotals[tx.categoryId] || 0) + tx.amount;
            }
        });

        const catBox = document.getElementById('tr-category-breakdown');
        if (catBox) {
            const entries = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
            if (entries.length > 0) {
                catBox.innerHTML = entries.map(([catId, amt]) => {
                    const pct = totalOut > 0 ? Math.round((amt / totalOut) * 100) : 0;
                    const label = getLocalizedCategoryLabel(catId, 'expense');
                    return `
                        <div style="background: rgba(15,23,42,0.75); border: 1px solid #1e293b; border-radius: 0.55rem; padding: 0.4rem 0.6rem;">
                            <div class="flex justify-between" style="font-size: 11px; margin-bottom: 3px;">
                                <span style="color: #e2e8f0; font-weight: 600;">${escapeHtml(label)}</span>
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
        if (txListEl && filtered.length > 0) {
            txListEl.innerHTML = filtered.map(tx => {
                const isInc = tx.type === 'income';
                const catLabel = getLocalizedCategoryLabel(tx.categoryId, tx.type);
                return `
                    <div onclick="openEditTreasuryTxModal('${tx.id}')" style="cursor: pointer; background: rgba(15,23,42,0.75); border: 1px solid rgba(30,41,59,0.9); border-radius: 0.65rem; padding: 0.5rem 0.65rem;" class="flex items-center justify-between gap-2">
                        <div class="min-w-0 flex-1">
                            <p class="truncate" style="font-size: 0.75rem; font-weight: 600; color: #f1f5f9;">${escapeHtml(tx.name || tx.note)}</p>
                            <p style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">${escapeHtml(catLabel)} • ${tx.dateStr}</p>
                        </div>
                        <div class="flex items-center gap-2 shrink-0">
                            <span class="font-display" style="font-size: 0.75rem; font-weight: 700; color: ${isInc ? '#34d399' : '#fb7185'};">
                                ${isInc ? '+' : '-'}${formatRupiah(tx.amount)}
                            </span>
                            <span style="font-size: 11px; color: #64748b;">✎</span>
                        </div>
                    </div>
                `;
            }).join('');
        }
        renderDashboardFinance();
    };

    window.setDashFinancePeriod = function (period) {
        dashFinancePeriod = period;
        selectedPieCategoryId = null;
        ['today', 'week', 'month', 'custom'].forEach(p => {
            const btn = document.getElementById(`df-period-${p}`);
            if (!btn) return;
            const act = p === period;
            btn.style.background = act ? 'rgba(6,182,212,0.2)' : 'var(--bg-slate-900)';
            btn.style.color = act ? '#67e8f9' : '#94a3b8';
            btn.style.borderColor = act ? 'rgba(6,182,212,0.4)' : '#334155';
        });
        const customBox = document.getElementById('df-custom-date-box');
        if (customBox) {
            if (period === 'custom') customBox.classList.remove('hidden');
            else customBox.classList.add('hidden');
        }
        renderDashboardFinance();
    };

    window.selectDashPieCategory = function (catId) {
        selectedPieCategoryId = selectedPieCategoryId === catId ? null : catId;
        renderDashboardFinance();
    };

    function renderDashboardFinance() {
        migrateLegacyTreasuryCategories();
        const pieWrap = document.getElementById('df-pie-chart-wrap');
        const legendWrap = document.getElementById('df-category-legend');
        const detailWrap = document.getElementById('df-selected-cat-txs');
        if (!pieWrap || !legendWrap) return;

        const todayKey = getCurrentGameDateKey();
        const todayDate = parseDateKey(todayKey);
        const startEl = document.getElementById('df-start-date');
        const endEl = document.getElementById('df-end-date');
        if (startEl && !startEl.value) startEl.value = todayKey;
        if (endEl && !endEl.value) endEl.value = todayKey;

        const txs = (gameState.treasury && gameState.treasury.transactions) || [];
        const filtered = txs.filter(tx => {
            if (!tx.dateStr) return false;
            if (dashFinancePeriod === 'today') return tx.dateStr === todayKey;
            if (dashFinancePeriod === 'week') {
                const d = parseDateKey(tx.dateStr);
                const diff = (todayDate - d) / (1000 * 60 * 60 * 24);
                return diff >= 0 && diff < 7;
            }
            if (dashFinancePeriod === 'month') return tx.dateStr.slice(0, 7) === todayKey.slice(0, 7);
            return tx.dateStr >= startEl.value && tx.dateStr <= endEl.value;
        });

        let totalIn = 0;
        let totalOut = 0;
        const expByCat = {};

        filtered.forEach(tx => {
            if (tx.type === 'income') totalIn += tx.amount;
            else {
                totalOut += tx.amount;
                expByCat[tx.categoryId] = (expByCat[tx.categoryId] || 0) + tx.amount;
            }
        });

        document.getElementById('df-total-in').textContent = formatRupiah(totalIn);
        document.getElementById('df-total-out').textContent = formatRupiah(totalOut);
        const net = totalIn - totalOut;
        const netEl = document.getElementById('df-net-bal');
        netEl.textContent = formatRupiah(net);
        netEl.style.color = net >= 0 ? '#22d3ee' : '#fb7185';

        const entries = Object.entries(expByCat).sort((a, b) => b[1] - a[1]);
        if (totalOut === 0 || entries.length === 0) {
            pieWrap.innerHTML = `<svg viewBox="0 0 100 100" width="110" height="110"><circle cx="50" cy="50" r="38" fill="none" stroke="#1e293b" stroke-width="14"/></svg>`;
            legendWrap.innerHTML = `<p style="font-size: 11px; color: #64748b;">Belum ada pengeluaran pada periode ini.</p>`;
            if (detailWrap) detailWrap.classList.add('hidden');
            return;
        }

        const r = 38;
        const circ = 2 * Math.PI * r;
        let offset = 0;
        const slices = entries.map(([catId, amt]) => {
            const meta = getCategoryMeta(catId, 'expense');
            const frac = amt / totalOut;
            const dash = frac * circ;
            const strokeOffset = -offset;
            offset += dash;
            const isSel = selectedPieCategoryId === catId;
            return `<circle onclick="selectDashPieCategory('${catId}')" cx="50" cy="50" r="${r}" fill="transparent"
                stroke="${meta.color}" stroke-width="${isSel ? '17' : '14'}"
                stroke-dasharray="${dash} ${circ - dash}" stroke-dashoffset="${strokeOffset}"
                transform="rotate(-90 50 50)" style="cursor: pointer; transition: stroke-width 0.2s;"/>`;
        }).join('');

        pieWrap.innerHTML = `<svg viewBox="0 0 100 100" width="115" height="115">${slices}</svg>`;

        legendWrap.innerHTML = entries.map(([catId, amt]) => {
            const meta = getCategoryMeta(catId, 'expense');
            const pct = Math.round((amt / totalOut) * 100);
            const label = getLocalizedCategoryLabel(catId, 'expense');
            const isSel = selectedPieCategoryId === catId;
            return `
                <div onclick="selectDashPieCategory('${catId}')" style="cursor: pointer; padding: 3px 6px; border-radius: 6px; background: ${isSel ? 'rgba(34,211,238,0.16)' : 'rgba(15,23,42,0.6)'}; border: 1px solid ${isSel ? '#22d3ee' : 'transparent'};" class="flex items-center justify-between gap-1">
                    <div class="flex items-center gap-1-5 min-w-0">
                        <span style="width: 8px; height: 8px; border-radius: 50%; background: ${meta.color}; flex-shrink: 0;"></span>
                        <span class="truncate" style="font-size: 10.5px; color: #e2e8f0;">${escapeHtml(label)}</span>
                    </div>
                    <span class="font-display shrink-0" style="font-size: 10px; font-weight: 700; color: #cbd5e1;">${pct}% • ${formatRupiah(amt)}</span>
                </div>
            `;
        }).join('');

        if (detailWrap) {
            if (selectedPieCategoryId) {
                const catTxs = filtered.filter(t => t.type !== 'income' && t.categoryId === selectedPieCategoryId);
                detailWrap.classList.remove('hidden');
                detailWrap.innerHTML = catTxs.map(t => `
                    <div onclick="openEditTreasuryTxModal('${t.id}')" style="cursor: pointer; font-size: 11px; padding: 4px 6px; border-radius: 6px; background: rgba(2,6,23,0.7);" class="flex justify-between">
                        <span style="color: #cbd5e1;">${escapeHtml(t.name || t.note)} (${t.dateStr})</span>
                        <span class="font-display" style="color: #fb7185; font-weight: 700;">-${formatRupiah(t.amount)}</span>
                    </div>
                `).join('');
            } else {
                detailWrap.classList.add('hidden');
            }
        }
    }

    // ------------------------------------------------------------------------
    // 6. DUNGEON AMBIENT FOCUS (REMOVE SILENT NIGHT, ADD AMBIENT FOCUS + CONTROLS)
    // ------------------------------------------------------------------------
    let isAmbientPaused = false;

    function enhanceDungeonMusicAndCancel() {
        if (window.SoundFX) {
            SoundFX.playDungeonFail = function () {
                if (this.muted) return;
                this.init();
                const notes = [293.66, 261.63, 220.00, 146.83];
                notes.forEach((f, i) => {
                    const now = this.ctx.currentTime + i * 0.14;
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(f, now);
                    gain.gain.setValueAtTime(0.14, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.3);
                });
            };

            const _origStartAmbient = SoundFX.startAmbient.bind(SoundFX);
            SoundFX.startAmbient = function (mode) {
                if (typeof lofiIsPlaying !== 'undefined' && lofiIsPlaying && typeof stopAnimeLofi1Hour === 'function') {
                    stopAnimeLofi1Hour();
                }
                if (mode === 'focus') {
                    this.stopAmbient();
                    if (this.muted) return;
                    this.init();
                    const master = this.ctx.createGain();
                    master.gain.setValueAtTime(0.001, this.ctx.currentTime);
                    master.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 1.0);
                    master.connect(this.ctx.destination);
                    this.ambientGain = master;

                    [174.61, 261.63, 392.00].forEach((freq, idx) => {
                        const osc = this.ctx.createOscillator();
                        osc.type = idx === 0 ? 'sine' : 'triangle';
                        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                        osc.connect(master);
                        osc.start();
                        this.ambientNodes.push(osc);
                    });
                    isAmbientPaused = false;
                    return;
                }
                _origStartAmbient(mode);
                isAmbientPaused = false;
            };
        }

        const noneBtn = document.getElementById('amb-none');
        if (noneBtn && noneBtn.parentElement) {
            if (SoundFX.ambientMode === 'none') SoundFX.ambientMode = 'focus';
            noneBtn.id = 'amb-focus';
            noneBtn.setAttribute('onclick', "setDungeonAmbient('focus')");
            noneBtn.setAttribute('data-i18n', 'amb_focus');
            noneBtn.textContent = tKey('amb_focus');

            const ctrlBar = document.createElement('div');
            ctrlBar.className = 'flex justify-center gap-1-5';
            ctrlBar.style.marginTop = '0.45rem';
            ctrlBar.innerHTML = `
                <button type="button" onclick="controlDungeonAmbient('play')" class="font-display" style="padding: 4px 10px; border-radius: 0.45rem; font-size: 10px; font-weight: 700; background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid rgba(16,185,129,0.4);">▶ Play</button>
                <button type="button" onclick="controlDungeonAmbient('pause')" class="font-display" style="padding: 4px 10px; border-radius: 0.45rem; font-size: 10px; font-weight: 700; background: rgba(245,158,11,0.2); color: #fcd34d; border: 1px solid rgba(245,158,11,0.4);">⏸ Pause</button>
                <button type="button" onclick="controlDungeonAmbient('stop')" class="font-display" style="padding: 4px 10px; border-radius: 0.45rem; font-size: 10px; font-weight: 700; background: rgba(244,63,94,0.2); color: #fda4af; border: 1px solid rgba(244,63,94,0.4);">⏹ Stop</button>
            `;
            noneBtn.parentElement.parentElement.appendChild(ctrlBar);
        }

        window.abortDungeon = function () {
            if (!window.isDungeonRunning) return;
            if (typeof SoundFX !== 'undefined' && SoundFX.playClick) SoundFX.playClick();
            openModal('modal-dungeon-abandon');
        };

        window.confirmAbandonDungeon = function () {
            closeModal('modal-dungeon-abandon');
            if (!window.isDungeonRunning) return;
            clearInterval(window.dungeonInterval);
            window.isDungeonRunning = false;

            if (typeof ScreenWakeManager !== 'undefined') ScreenWakeManager.disable();
            if (typeof SoundFX !== 'undefined') {
                SoundFX.stopAmbient();
                if (typeof SoundFX.playDungeonFail === 'function') SoundFX.playDungeonFail();
            }

            syncPlayerMaxHp();
            const { wisDmgReduce } = getAttributePassives();
            const dmg = Math.max(1, Math.round(10 * (1 - wisDmgReduce)));
            gameState.player.hp = Math.max(0, gameState.player.hp - dmg);
            saveState();
            renderAll();
            resetDungeonUI();

            showSystemModal(
                'DUNGEON ABANDONED',
                `Dungeon dibatalkan. Penalti -${dmg} HP diterapkan sesuai aturan sistem.`
            );
        };
    }

    window.controlDungeonAmbient = function (action) {
        if (!window.SoundFX) return;
        if (action === 'play') {
            if (isAmbientPaused && SoundFX.ctx && SoundFX.ctx.state === 'suspended') {
                SoundFX.ctx.resume();
                isAmbientPaused = false;
            } else {
                SoundFX.startAmbient(SoundFX.ambientMode || 'focus');
            }
        } else if (action === 'pause') {
            if (SoundFX.ctx && SoundFX.ctx.state === 'running') {
                SoundFX.ctx.suspend();
                isAmbientPaused = true;
            }
        } else if (action === 'stop') {
            SoundFX.stopAmbient();
            isAmbientPaused = false;
        }
    };

    // ------------------------------------------------------------------------
    // 7. INITIALIZE ALL UPGRADES SAFELY ON BOOT
    // ------------------------------------------------------------------------
    function bootEnhancements() {
        migrateLegacyTreasuryCategories();
        enhanceDungeonMusicAndCancel();
        initFingerprintLongPress();
        setAppLanguage(getActiveLang());
        renderDashboardFinance();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootEnhancements);
    } else {
        bootEnhancements();
    }
})();
