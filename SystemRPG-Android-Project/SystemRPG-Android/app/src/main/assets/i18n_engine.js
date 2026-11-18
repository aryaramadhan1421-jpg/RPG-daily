/**
 * SYSTEM RPG - Full Multilingual Engine (ID / EN / JA)
 * Comprehensive localization interceptor for static & dynamic UI elements,
 * matching exact strings from index.html & dynamic renders from app.js.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'system_rpg_lang';

  // 1. EXACT PHRASE & SENTENCE DICTIONARY (Extracted directly from index.html)
  const DICTIONARY = {
    en: {
      // Splash Screen & Header
      '[ TAP FINGERPRINT UNTUK AWAKENING ]': '[ TAP FINGERPRINT FOR AWAKENING ]',
      'Autentikasi Hunter diperlukan sebelum masuk ke Sistem': 'Hunter authentication required before entering the System',
      'Hunter Interface': 'Hunter Interface',

      // System Oracle
      '+ Kutipan': '+ Quote',
      '✨ Terima Petuah (+5 XP / +5 G)': '✨ Receive Wisdom (+5 XP / +5 G)',
      '"Kamu tidak naik ke level tujuanmu. Kamu jatuh ke level sistemmu."': '"You do not rise to the level of your goals. You fall to the level of your systems."',

      // Player Identity Card
      'Ganti Title': 'Switch Title',
      'Lihat Semua': 'View All',

      // Core RPG Stats & Radar Chart
      'Status Atribut': 'Attribute Status',
      'Distribusi Atribut Hunter': 'Hunter Attribute Distribution',
      'Distribusi Level Atribut': 'Attribute Level Distribution',
      'Skala Tier: 100': 'Tier Scale: 100',
      'Pasif: +0 Max HP (Fisik & Vitality)': 'Passive: +0 Max HP (Physical & Vitality)',
      'Pasif: +0% XP (Belajar & Fokus)': 'Passive: +0% XP (Study & Focus)',
      'Pasif: -0% Damage Penalti (Mindfulness)': 'Passive: -0% Penalty Damage (Mindfulness)',
      'Pasif: Diskon Shop 0% (Relasi & Sosial)': 'Passive: 0% Shop Discount (Relations & Social)',

      // Habit Tracker & History
      'Habit Tracker & Riwayat': 'Habit Tracker & History',
      'Tanggal Aktif Sistem': 'System Active Date',
      'Hari Ini': 'Today',
      'Klik kotak tanggal untuk cek riwayat': 'Click a date box to check history',
      'Log Aktivitas Tanggal Ini': 'Activity Log for This Date',

      // System Control & Daily Evaluation
      'Kontrol Sistem & Evaluasi Harian': 'System Control & Daily Evaluation',
      '🎯 Target Minimal Streak Harian': '🎯 Minimum Daily Streak Target',
      'Atur persentase minimal Daily Quest selesai': 'Set minimum percentage of completed Daily Quests',
      'Evaluasi & Lanjut Hari': 'Evaluate & Advance Day',
      'Evaluasi dan Lanjut Hari': 'Evaluate and Advance Day',

      // Mobile Notification Reminder
      'Reminder Notifikasi Layar HP': 'Mobile Lockscreen Notification Reminder',
      'NONAKTIF': 'INACTIVE',
      'AKTIF': 'ACTIVE',
      'Munculkan notifikasi pop-up di layar atas HP jika masih ada Daily Quest yang belum dikerjakan atau lupa buka SYSTEM RPG.': 'Show pop-up notifications on your phone screen if Daily Quests are still unfinished or you forgot to open SYSTEM RPG.',
      '🌅 Pagi': '🌅 Morning',
      '🌇 Sore': '🌇 Evening',
      '🌙 Malam': '🌙 Night',
      '🔔 Aktifkan Notifikasi': '🔔 Enable Notifications',
      '🔕 Matikan Notifikasi': '🔕 Disable Notifications',
      'Aktifkan Notifikasi': 'Enable Notifications',
      'Matikan Notifikasi': 'Disable Notifications',
      'Tes Pop-up': 'Test Pop-up',

      // Quests Tab
      'Centang misi selesai (klik ulang untuk batalkan/undo)': 'Check completed quests (click again to undo)',
      'Preset Habit': 'Habit Preset',
      'Quest Baru': 'New Quest',
      'Buat Misi Baru': 'Create New Quest',
      'Nama Misi / Tugas': 'Quest / Task Name',
      'Kategori': 'Category',
      'Waktu': 'Time',
      'Atribut': 'Attribute',
      '🌅 Pagi': '🌅 Morning',
      '☀️ Siang': '☀️ Afternoon',
      '🌇 Sore': '🌇 Evening',
      '🌙 Malam': '🌙 Night',
      '⚡ Fleksibel': '⚡ Flexible',
      'Jadwal Hari Aktif': 'Active Days Schedule',
      'Semua': 'All',
      'Sen': 'Mon',
      'Sel': 'Tue',
      'Rab': 'Wed',
      'Kam': 'Thu',
      'Jum': 'Fri',
      'Sab': 'Sat',
      'Min': 'Sun',
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

      // Dungeon & Deep Focus Raid
      'MASUKI DUNGEON': 'ENTER DUNGEON',
      'MENYERAH (-10 HP)': 'SURRENDER (-10 HP)',
      'Set Waktu': 'Set Time',
      '🎯 Tautkan Quest Fokus (Opsional — Auto-Selesai saat Clear)': '🎯 Link Focus Quest (Optional — Auto-Complete on Clear)',
      '-- Fokus Umum (+INT saja) --': '-- General Focus (+INT only) --',
      'Ambient Fokus': 'Focus Ambient',
      'Mode: Hening': 'Mode: Silent',
      '🔇 Hening': '🔇 Silent',
      '🌌 Dark Synth': '🌌 Dark Synth',
      '🌧️ Suara Hujan': '🌧️ Rain Sound',
      'Baca PDF materi belajar/buku sambil Dungeon Raid berjalan': 'Read study material/book PDFs while Dungeon Raid is active',
      '📂 Buka PDF': '📂 Open PDF',
      'ANIME LOFI RADIO (1 JAM)': 'ANIME LOFI RADIO (1 HOUR)',
      'Siap menemani fokus Dungeon • Offline Synth': 'Ready to accompany Dungeon focus • Offline Synth',
      '▶ Putar Anime Lofi (1 Jam)': '▶ Play Anime Lofi (1 Hour)',
      '🎵 MP3 HP': '🎵 Phone MP3',
      '🔖 Bookmark Tersimpan (Per Judul File)': '🔖 Saved Bookmarks (By File Title)',
      '🔖 Tandai Hal Ini': '🔖 Bookmark Page',

      // Shop & Armory & Mystery Chest
      'Tukarkan Gold dengan Potion atau Reward Dunia Nyata': 'Exchange Gold for Potions or Real-World Rewards',
      'Item Baru': 'New Item',
      'Tambah Item / Reward': 'Add Item / Reward',
      'Nama Item / Reward': 'Item / Reward Name',
      'Harga (Gold)': 'Price (Gold)',
      'Efek Item': 'Item Effect',
      'SIMPAN KE SHOP': 'SAVE TO SHOP',
      '🎁 Potion & Real-World Rewards': '🎁 Potions & Real-World Rewards',
      'Konsumsi & Hadiah Nyata': 'Consumables & Real Rewards',
      'Relic bersifat sementara (aktif 24 jam sejak dibeli) • Maks 3 slot aktif': 'Relics are temporary (active 24h upon purchase) • Max 3 active slots',
      'Belum ada Relic terpasang. Pasang Relic di bawah untuk mengaktifkan efek pasif!': 'No Relic equipped yet. Equip a Relic below to activate passive effects!',
      'MYSTERY SYSTEM CHEST': 'MYSTERY SYSTEM CHEST',
      'Mystery System Chest': 'Mystery System Chest',
      'Uji keberuntungan: XP, HP, Streak Shield, atau Jackpot Gold!': 'Test your luck: XP, HP, Streak Shield, or Gold Jackpot!',
      '🎲 BUKA PETI MISTERI (100 GOLD)': '🎲 OPEN MYSTERY CHEST (100 GOLD)',
      'Riwayat Redeem': 'Redeem History',
      'Hapus Semua': 'Clear All',

      // Treasury / Cashflow Dashboard
      'Catat arus kas & kalkulator jajan (+10 XP & +10 WIS XP, maks 3x/hari)': 'Record cashflow & snack calculator (+10 XP & +10 WIS XP, max 3x/day)',
      '🧮 Kalkulator Jajan & Belanja': '🧮 Snack & Shopping Calculator',
      '✓ PAKAI NOMINAL': '✓ USE AMOUNT',
      '💸 Catat Transaksi Keuangan': '💸 Record Financial Transaction',
      'Jenis Arus Kas': 'Cashflow Type',
      '📤 Pengeluaran (-)': '📤 Expense (-)',
      '📥 Pemasukan (+)': '📥 Income (+)',
      'Tanggal': 'Date',
      'Nominal (Rp)': 'Amount (Rp)',
      'Nominal': 'Amount',
      'Kategori Pengeluaran': 'Expense Category',
      'Kategori Pemasukan': 'Income Category',
      'Catatan / Keterangan': 'Notes / Description',
      'SIMPAN TRANSAKSI (+10 XP & +10 WIS)': 'SAVE TRANSACTION (+10 XP & +10 WIS)',
      '📊 Dashboard Arus Kas': '📊 Cashflow Dashboard',
      'Dashboard Arus Kas': 'Cashflow Dashboard',
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
      'Daftar Transaksi Periode Ini': 'Transactions in This Period',

      // Modals & Font Settings
      'Membuka Peti...': 'Opening Chest...',
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
      // Splash Screen & Header
      '[ TAP FINGERPRINT UNTUK AWAKENING ]': '[ 指紋をタップして覚醒する ]',
      'Autentikasi Hunter diperlukan sebelum masuk ke Sistem': 'システムに入る前にハンター認証が必要です',
      'Hunter Interface': 'ハンターインターフェース',

      // System Oracle
      '+ Kutipan': '+ 名言追加',
      '✨ Terima Petuah (+5 XP / +5 G)': '✨ 託宣を受け取る (+5 XP / +5 G)',
      '"Kamu tidak naik ke level tujuanmu. Kamu jatuh ke level sistemmu."': '「人は目標のレベルまで上がるのではなく、システムのレベルまで落ちる。」',

      // Player Identity Card
      'Ganti Title': '称号変更',
      'Lihat Semua': 'すべて見る',

      // Core RPG Stats & Radar Chart
      'Status Atribut': 'ステータス能力値',
      'Distribusi Atribut Hunter': 'ハンター能力値分布',
      'Distribusi Level Atribut': '能力値レベル分布',
      'Skala Tier: 100': 'ティア基準: 100',
      'Pasif: +0 Max HP (Fisik & Vitality)': 'パッシブ: 最大HP +0 (体力・生命力)',
      'Pasif: +0% XP (Belajar & Fokus)': 'パッシブ: 獲得XP +0% (学習・集中)',
      'Pasif: -0% Damage Penalti (Mindfulness)': 'パッシブ: ペナルティ軽減 -0% (精神・規律)',
      'Pasif: Diskon Shop 0% (Relasi & Sosial)': 'パッシブ: ショップ割引 0% (社交・魅力)',

      // Habit Tracker & History
      'Habit Tracker & Riwayat': '習慣トラッカー＆履歴',
      'Tanggal Aktif Sistem': 'システム現在日付',
      'Hari Ini': '今日',
      'Klik kotak tanggal untuk cek riwayat': '日付マスをタップして履歴を確認',
      'Log Aktivitas Tanggal Ini': '本日のアクティビティログ',

      // System Control & Daily Evaluation
      'Kontrol Sistem & Evaluasi Harian': 'システム制御＆日次評価',
      '🎯 Target Minimal Streak Harian': '🎯 毎日の最小ストリーク目標',
      'Atur persentase minimal Daily Quest selesai': 'デイリークエストの最小達成率を設定',
      'Evaluasi & Lanjut Hari': '評価して次の日へ',
      'Evaluasi dan Lanjut Hari': '評価して次の日へ',

      // Mobile Notification Reminder
      'Reminder Notifikasi Layar HP': 'スマホロック画面通知リマインダー',
      'NONAKTIF': '無効',
      'AKTIF': '有効',
      'Munculkan notifikasi pop-up di layar atas HP jika masih ada Daily Quest yang belum dikerjakan atau lupa buka SYSTEM RPG.': '未完了のデイリークエストがある場合やアプリを開き忘れた際に、スマホ画面上部にポップアップ通知を表示します。',
      '🌅 Pagi': '🌅 朝',
      '🌇 Sore': '🌇 夕方',
      '🌙 Malam': '🌙 夜',
      '🔔 Aktifkan Notifikasi': '🔔 通知を有効化',
      '🔕 Matikan Notifikasi': '🔕 通知をオフにする',
      'Aktifkan Notifikasi': '通知を有効化',
      'Matikan Notifikasi': '通知をオフにする',
      'Tes Pop-up': 'ポップアップテスト',

      // Quests Tab
      'Centang misi selesai (klik ulang untuk batalkan/undo)': '完了したクエストにチェック（再タップで取り消し）',
      'Preset Habit': '習慣プリセット',
      'Quest Baru': '新規クエスト',
      'Buat Misi Baru': '新規クエスト作成',
      'Nama Misi / Tugas': 'クエスト・タスク名',
      'Kategori': 'カテゴリー',
      'Waktu': '時間帯',
      'Atribut': '能力値',
      '☀️ Siang': '☀️ 昼',
      '⚡ Fleksibel': '⚡ いつでも',
      'Jadwal Hari Aktif': '実行曜日スケジュール',
      'Semua': 'すべて',
      'Sen': '月',
      'Sel': '火',
      'Rab': '水',
      'Kam': '木',
      'Jum': '金',
      'Sab': '土',
      'Min': '日',
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

      // Dungeon & Deep Focus Raid
      'MASUKI DUNGEON': 'ダンジョンに入る',
      'MENYERAH (-10 HP)': '諦める (-10 HP)',
      'Set Waktu': '時間設定',
      '🎯 Tautkan Quest Fokus (Opsional — Auto-Selesai saat Clear)': '🎯 集中クエスト連携（任意 — クリア時に自動完了）',
      '-- Fokus Umum (+INT saja) --': '-- 通常集中 (+INTのみ) --',
      'Ambient Fokus': '集中環境音',
      'Mode: Hening': 'モード: 無音',
      '🔇 Hening': '🔇 無音',
      '🌌 Dark Synth': '🌌 ダークシンセ',
      '🌧️ Suara Hujan': '🌧️ 雨音',
      'Baca PDF materi belajar/buku sambil Dungeon Raid berjalan': 'ダンジョン攻略中に学習教材や書籍のPDFを閲覧',
      '📂 Buka PDF': '📂 PDFを開く',
      'ANIME LOFI RADIO (1 JAM)': 'アニメ Lo-Fi ラジオ (1時間)',
      'Siap menemani fokus Dungeon • Offline Synth': 'ダンジョン集中をサポート • オフライン音源',
      '▶ Putar Anime Lofi (1 Jam)': '▶ アニメLo-Fi再生 (1時間)',
      '🎵 MP3 HP': '🎵 端末MP3',
      '🔖 Bookmark Tersimpan (Per Judul File)': '🔖 保存済みブックマーク（ファイル別）',
      '🔖 Tandai Hal Ini': '🔖 このページを保存',

      // Shop & Armory & Mystery Chest
      'Tukarkan Gold dengan Potion atau Reward Dunia Nyata': 'ゴールドをポーションや現実のご褒美と交換',
      'Item Baru': '新規アイテム',
      'Tambah Item / Reward': 'アイテム・報酬追加',
      'Nama Item / Reward': 'アイテム・報酬名',
      'Harga (Gold)': '価格 (ゴールド)',
      'Efek Item': 'アイテム効果',
      'SIMPAN KE SHOP': 'ショップに保存',
      '🎁 Potion & Real-World Rewards': '🎁 ポーション＆現実の報酬',
      'Konsumsi & Hadiah Nyata': '消費アイテム＆現実のご褒美',
      'Relic bersifat sementara (aktif 24 jam sejak dibeli) • Maks 3 slot aktif': 'レリックは一時効果（購入から24時間有効）• 最大3スロット装備可能',
      'Belum ada Relic terpasang. Pasang Relic di bawah untuk mengaktifkan efek pasif!': 'レリック未装備。下のレリックを装備してパッシブ効果を発動しよう！',
      'MYSTERY SYSTEM CHEST': 'ミステリー・システムチェスト',
      'Mystery System Chest': 'ミステリー・システムチェスト',
      'Uji keberuntungan: XP, HP, Streak Shield, atau Jackpot Gold!': '運試し：XP、HP、ストリークシールド、またはゴールド大当たり！',
      '🎲 BUKA PETI MISTERI (100 GOLD)': '🎲 ミステリーチェストを開ける (100 GOLD)',
      'Riwayat Redeem': '交換履歴',
      'Hapus Semua': 'すべて削除',

      // Treasury / Cashflow Dashboard
      'Catat arus kas & kalkulator jajan (+10 XP & +10 WIS XP, maks 3x/hari)': '収支記録＆お小遣い電卓（+10 XP & +10 WIS XP、1日3回まで）',
      '🧮 Kalkulator Jajan & Belanja': '🧮 買い物・出費電卓',
      '✓ PAKAI NOMINAL': '✓ 金額を反映',
      '💸 Catat Transaksi Keuangan': '💸 収支取引を記録',
      'Jenis Arus Kas': '収支タイプ',
      '📤 Pengeluaran (-)': '📤 支出 (-)',
      '📥 Pemasukan (+)': '📥 収入 (+)',
      'Tanggal': '日付',
      'Nominal (Rp)': '金額 (Rp)',
      'Nominal': '金額',
      'Kategori Pengeluaran': '支出カテゴリー',
      'Kategori Pemasukan': '収入カテゴリー',
      'Catatan / Keterangan': 'メモ・詳細',
      'SIMPAN TRANSAKSI (+10 XP & +10 WIS)': '取引を保存 (+10 XP & +10 WIS)',
      '📊 Dashboard Arus Kas': '📊 キャッシュフローダッシュボード',
      'Dashboard Arus Kas': 'キャッシュフローダッシュボード',
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
      'Daftar Transaksi Periode Ini': 'この期間の取引一覧',

      // Modals & Font Settings
      'Membuka Peti...': 'チェスト開封中...',
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

  // 2. HTML-LEVEL BLOCK TRANSLATIONS (Solves paragraphs containing inner <span> / <strong> tags!)
  const HTML_BLOCK_RULES = {
    en: [
      {
        match: 'Evaluasi misi pada tanggal terpilih lalu lanjut ke hari berikutnya.',
        html: 'Evaluate quests on the selected date and advance to the next day. Safe target is at least <span id="eval-threshold-label" style="color: #67e8f9; font-weight: 700;">80% Daily Quests</span> completed. If below target, HP decreases &amp; Streak resets (unless protected by a Shield)!'
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
        match: 'Evaluasi misi pada tanggal terpilih lalu lanjut ke hari berikutnya.',
        html: '選択した日付のクエストを評価し、次の日へ進みます。安全ラインは <span id="eval-threshold-label" style="color: #67e8f9; font-weight: 700;">デイリークエスト 80%</span> 以上の完了です。目標未満の場合、シールドがない限りHPが減少しストリークがリセットされます！'
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

  // 3. DYNAMIC / REGEX SUBSTRING PATTERNS (Handles dynamic numbers, stats & app.js generated labels)
  const PATTERN_RULES = {
    en: [
      { regex: /Distribusi Level Atribut/gi, replace: 'Attribute Level Distribution' },
      { regex: /Distribusi Atribut Hunter/gi, replace: 'Hunter Attribute Distribution' },
      { regex: /Evaluasi\s*(&|dan)\s*Lanjut Hari/gi, replace: 'Evaluate $1 Advance Day' },
      { regex: /Matikan Notifikasi/gi, replace: 'Disable Notifications' },
      { regex: /Aktifkan Notifikasi/gi, replace: 'Enable Notifications' },
      { regex: /Mystery System Chest/gi, replace: 'Mystery System Chest' },
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
      { regex: /(\d+)\s*Hari/gi, replace: '$1 Days' },
      { regex: /(\d+(?:\.\d+)?)\s*Jam/gi, replace: '$1 Hours' },
      { regex: /Rate Minggu Ini/gi, replace: 'This Week Rate' },
      { regex: /Pasif:\s*\+(\d+)\s*Max HP\s*\(Fisik & Vitality\)/gi, replace: 'Passive: +$1 Max HP (Physical & Vitality)' },
      { regex: /Pasif:\s*\+(\d+%)\s*XP\s*\(Belajar & Fokus\)/gi, replace: 'Passive: +$1 XP (Study & Focus)' },
      { regex: /Pasif:\s*-(\d+%)\s*Damage Penalti\s*\(Mindfulness\)/gi, replace: 'Passive: -$1 Penalty Damage (Mindfulness)' },
      { regex: /Pasif:\s*Diskon Shop\s*(\d+%)\s*\(Relasi & Sosial\)/gi, replace: 'Passive: $1 Shop Discount (Relations & Social)' },
      { regex: /Ganti Title\s*\((\d+\/\d+)\)/gi, replace: 'Switch Title ($1)' },
      { regex: /Semua/g, replace: 'All' },
      { regex: /Pemasukan/g, replace: 'Income' },
      { regex: /Pengeluaran/g, replace: 'Expense' },
      { regex: /Nominal/g, replace: 'Amount' }
    ],
    ja: [
      { regex: /Distribusi Level Atribut/gi, replace: '能力値レベル分布' },
      { regex: /Distribusi Atribut Hunter/gi, replace: 'ハンター能力値分布' },
      { regex: /Evaluasi\s*(&|dan)\s*Lanjut Hari/gi, replace: '評価して次の日へ' },
      { regex: /Matikan Notifikasi/gi, replace: '通知をオフにする' },
      { regex: /Aktifkan Notifikasi/gi, replace: '通知を有効化' },
      { regex: /Mystery System Chest/gi, replace: 'ミステリー・システムチェスト' },
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
      { regex: /(\d+)\s*Hari/gi, replace: '$1日' },
      { regex: /(\d+(?:\.\d+)?)\s*Jam/gi, replace: '$1時間' },
      { regex: /Rate Minggu Ini/gi, replace: '今週の達成率' },
      { regex: /Pasif:\s*\+(\d+)\s*Max HP\s*\(Fisik & Vitality\)/gi, replace: 'パッシブ: 最大HP +$1 (体力・生命力)' },
      { regex: /Pasif:\s*\+(\d+%)\s*XP\s*\(Belajar & Fokus\)/gi, replace: 'パッシブ: 獲得XP +$1 (学習・集中)' },
      { regex: /Pasif:\s*-(\d+%)\s*Damage Penalti\s*\(Mindfulness\)/gi, replace: 'パッシブ: ペナルティ軽減 -$1 (精神・規律)' },
      { regex: /Pasif:\s*Diskon Shop\s*(\d+%)\s*\(Relasi & Sosial\)/gi, replace: 'パッシブ: ショップ割引 $1 (社交・魅力)' },
      { regex: /Ganti Title\s*\((\d+\/\d+)\)/gi, replace: '称号変更 ($1)' },
      { regex: /Semua/g, replace: 'すべて' },
      { regex: /Pemasukan/g, replace: '収入' },
      { regex: /Pengeluaran/g, replace: '支出' },
      { regex: /Nominal/g, replace: '金額' }
    ]
  };

  // Reverse map for clean language switching
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

  function getCurrentLang() {
    return localStorage.getItem(STORAGE_KEY) || 'id';
  }

  function translateString(rawText, targetLang) {
    if (!rawText || typeof rawText !== 'string') return rawText;
    const trimmed = rawText.trim();
    if (!trimmed) return rawText;

    const baseIdKey = REVERSE_MAP[trimmed];
    if (baseIdKey) {
      const translated = targetLang === 'id'
        ? baseIdKey
        : (DICTIONARY[targetLang] && DICTIONARY[targetLang][baseIdKey]) || baseIdKey;
      return rawText.replace(trimmed, translated);
    }

    if (targetLang === 'id') return rawText;

    let result = rawText;
    const rules = PATTERN_RULES[targetLang] || [];
    for (const rule of rules) {
      if (rule.regex.test(result)) {
        rule.regex.lastIndex = 0;
        result = result.replace(rule.regex, rule.replace);
      }
    }

    if (DICTIONARY[targetLang] && SORTED_DICT_KEYS[targetLang]) {
      for (const idPhrase of SORTED_DICT_KEYS[targetLang]) {
        if (idPhrase.length >= 4 && result.includes(idPhrase)) {
          result = result.split(idPhrase).join(DICTIONARY[targetLang][idPhrase]);
        }
      }
    }

    return result;
  }

  // Handle paragraphs & divs that mix plain text + inner <span> tags
  function translateMixedHtmlBlocks(rootElement, targetLang) {
    if (!rootElement || !rootElement.querySelectorAll) return;
    const blocks = rootElement.querySelectorAll('p, div');
    blocks.forEach((el) => {
      if (el.children.length === 0) return;
      if (!el.dataset.origInnerHtml) {
        const text = el.textContent || '';
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
          if (found && el.innerHTML !== found.html) {
            el.innerHTML = found.html;
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
      if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.tagName)) return;

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

      node.childNodes.forEach((child) => translateNode(child, targetLang));
    }
  }

  function applyLanguage(lang) {
    const validLang = ['id', 'en', 'ja'].includes(lang) ? lang : 'id';
    localStorage.setItem(STORAGE_KEY, validLang);
    document.documentElement.lang = validLang;
    if (document.body) {
      translateMixedHtmlBlocks(document.body, validLang);
      translateNode(document.body, validLang);
    }
  }

  window.setSystemLanguage = function (lang) {
    applyLanguage(lang);
    window.dispatchEvent(new CustomEvent('system-language-changed', { detail: { lang } }));
  };

  window.t = function (key) {
    return translateString(key, getCurrentLang());
  };

  // Observe dynamic renders from app.js (Treasury categories, Quests, Modals, Notifications)
  let isApplying = false;
  const observer = new MutationObserver((mutations) => {
    if (isApplying) return;
    const lang = getCurrentLang();
    isApplying = true;
    try {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((added) => {
            if (added.nodeType === Node.ELEMENT_NODE) {
              translateMixedHtmlBlocks(added, lang);
            }
            if (lang !== 'id') translateNode(added, lang);
          });
        } else if (mutation.type === 'characterData') {
          const target = mutation.target;
          const currentVal = target.nodeValue;
          const expectedTranslated = translateString(currentVal, lang);
          if (currentVal !== expectedTranslated) {
            ORIGINAL_TEXT_MAP.set(target, currentVal);
            if (lang !== 'id') {
              target.nodeValue = expectedTranslated;
            }
          }
        }
      });
    } finally {
      isApplying = false;
    }
  });

  function init() {
    applyLanguage(getCurrentLang());
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
