/**
 * SYSTEM RPG - Full Multilingual Engine (ID / EN / JA)
 * Comprehensive localization interceptor for static & dynamic UI elements,
 * including Dungeon descriptions, Treasury/Finance Cashflow Dashboards, Modals, and System Controls.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'system_rpg_lang';

  // 1. EXACT PHRASE & SENTENCE DICTIONARY
  const DICTIONARY = {
    en: {
      // Navigation & Tabs
      'Beranda': 'Home',
      'Status': 'Status',
      'Misi': 'Quests',
      'Dungeon': 'Dungeon',
      'Toko': 'Shop',
      'Pengaturan': 'Settings',
      'Riwayat': 'History',
      'Profil': 'Profile',
      'Perbendaharaan': 'Treasury',
      'Keuangan': 'Finance',
      'Statistik': 'Statistics',

      // Stats & Attributes
      'Status Atribut': 'Attribute Status',
      'Distribusi Level Atribut': 'Attribute Level Distribution',
      'Kekuatan': 'Strength',
      'Kecerdasan': 'Intelligence',
      'Kebijaksanaan': 'Wisdom',
      'Karisma': 'Charisma',
      'Peringkat': 'Rank',
      'Level': 'Level',
      'Kesehatan': 'HP',
      'Energi': 'Stamina',
      'Koin': 'Coins',
      'Emas': 'Gold',
      'Poin Status': 'Stat Points',
      'Total EXP': 'Total EXP',
      'Tingkat Penyelesaian': 'Completion Rate',
      'Hari Aktif': 'Active Days',

      // Quests & Habits
      'Misi Harian': 'Daily Quests',
      'Misi Utama': 'Main Quests',
      'Misi Tambahan': 'Side Quests',
      'Quest Baru': 'New Quest',
      'Tambah Quest': 'Add Quest',
      'Tambah Misi': 'Add Quest',
      'Edit Quest': 'Edit Quest',
      'Judul Quest': 'Quest Title',
      'Kategori': 'Category',
      'Atribut': 'Attribute',
      'Tingkat Kesulitan': 'Difficulty',
      'Waktu Pelaksanaan': 'Time of Day',
      'Mudah': 'Easy',
      'Sedang': 'Medium',
      'Sulit': 'Hard',
      'Sangat Sulit': 'Very Hard',
      'Selesai': 'Completed',
      'Belum Selesai': 'Incomplete',
      'Batalkan': 'Undo',
      'Hapus': 'Delete',
      'Simpan': 'Save',
      'Simpan Perubahan': 'Save Changes',
      'Pagi': 'Morning',
      'Siang': 'Afternoon',
      'Sore': 'Evening',
      'Malam': 'Night',
      'Kapan Saja': 'Anytime',
      'Semua': 'All',
      'Beruntun': 'Streak',
      'Bekukan Streak': 'Freeze Streak',
      'Habit Tracker & Riwayat': 'Habit Tracker & History',
      'Belum ada misi untuk hari ini.': 'No quests for today yet.',
      'Belum ada riwayat.': 'No history yet.',

      // System Control & Daily Evaluation
      'Kontrol Sistem & Evaluasi Harian': 'System Control & Daily Evaluation',
      'Evaluasi & Lanjut Hari': 'Evaluate & Advance Day',
      'Evaluasi dan Lanjut Hari': 'Evaluate and Advance Day',
      'Evaluasi Harian': 'Daily Evaluation',
      'Evaluasi Misi Harian': 'Daily Quest Evaluation',
      'Evaluasi misi pada tanggal terpilih. Misi yang belum selesai akan mengurangi HP kecuali ada Shield.': 'Evaluate quests on the selected date. Incomplete quests will deduct HP unless a Shield is active.',
      'Evaluasi misi pada tanggal terpilih. Misi yang tidak selesai akan mengurangi HP kecuali ada Shield.': 'Evaluate quests on the selected date. Incomplete quests will deduct HP unless a Shield is active.',
      'Evaluasi misi pada tanggal terpilih. Quest yang belum selesai akan mengurangi HP kecuali ada Shield.': 'Evaluate quests on the selected date. Incomplete quests will deduct HP unless a Shield is active.',
      'Misi yang belum selesai akan mengurangi HP kecuali ada Shield.': 'Incomplete quests will deduct HP unless a Shield is active.',
      'Reminder Notifikasi Layar HP': 'Mobile Lockscreen Notification Reminder',
      'Aktifkan Notifikasi': 'Enable Notifications',
      'Matikan Notifikasi': 'Disable Notifications',
      'Nonaktifkan Notifikasi': 'Disable Notifications',
      'Notifikasi Aktif': 'Notifications Active',
      'Notifikasi Mati': 'Notifications Off',
      'Tes Notifikasi': 'Test Notification',
      'Pengingat Harian': 'Daily Reminder',
      'Waktu Pengingat': 'Reminder Time',
      'Cadangkan & Pulihkan Data': 'Backup & Restore Data',
      'Ekspor Data (JSON)': 'Export Data (JSON)',
      'Impor Data (JSON)': 'Import Data (JSON)',
      'Reset Seluruh Data': 'Reset All Data',

      // Dungeon & Deep Focus Raid
      'Deep Focus Raid': 'Deep Focus Raid',
      'Masuki gerbang fokus': 'Enter the focus gate',
      'Masuki gerbang fokus.': 'Enter the focus gate.',
      'Masuki gerbang fokus untuk menaklukkan tantangan dan raih hadiah EXP serta Gold.': 'Enter the focus gate to conquer challenges and earn EXP and Gold rewards.',
      'Masuki gerbang fokus, kalahkan distraksi, dan dapatkan hadiah EXP & Gold.': 'Enter the focus gate, defeat distractions, and earn EXP & Gold rewards.',
      'Mulai Dungeon': 'Enter Dungeon',
      'Masuk Dungeon': 'Enter Dungeon',
      'Jeda': 'Pause',
      'Lanjutkan': 'Resume',
      'Menyerah': 'Surrender',
      'Fokus': 'Focus',
      'Istirahat': 'Rest',
      'Durasi Fokus': 'Focus Duration',
      'Durasi Istirahat': 'Rest Duration',
      'Suara Latar': 'Ambient Audio',
      'Kunci Layar': 'Screen Lock',
      'Mode Kunci Layar': 'Screen Lock Mode',
      'Dungeon Selesai!': 'Dungeon Cleared!',
      'Menit': 'Minutes',

      // Treasury / Finance / Cashflow Dashboard
      'Pencatatan Keuangan': 'Financial Records',
      'Pencatatan Keuangan & Arus Kas': 'Financial Records & Cashflow',
      'Dashboard Arus Kas': 'Cashflow Dashboard',
      'Arus Kas': 'Cashflow',
      'Arus Kas Harian': 'Daily Cashflow',
      'Arus Kas Bulanan': 'Monthly Cashflow',
      'Arus Kas Tahunan': 'Annual Cashflow',
      'Harian': 'Daily',
      'Bulanan': 'Monthly',
      'Tahunan': 'Yearly',
      'Ringkasan Keuangan': 'Financial Summary',
      'Total Pemasukan': 'Total Income',
      'Total Pengeluaran': 'Total Expenses',
      'Kategori Pemasukan': 'Income Category',
      'Kategori Pengeluaran': 'Expense Category',
      'Selisih Bersih': 'Net Difference',
      'Pemasukan': 'Income',
      'Pengeluaran': 'Expense',
      'Saldo': 'Balance',
      'Saldo Bersih': 'Net Balance',
      'Sisa Saldo': 'Remaining Balance',
      'Arus Kas Bersih': 'Net Cashflow',
      'Catat Transaksi': 'Record Transaction',
      'Tambah Transaksi': 'Add Transaction',
      'Riwayat Transaksi': 'Transaction History',
      'Belum ada transaksi.': 'No transactions recorded yet.',
      'Belum ada catatan keuangan.': 'No financial records yet.',
      'Nominal': 'Amount',
      'Nominal (Rp)': 'Amount (Rp)',
      'Masukkan Nominal': 'Enter Amount',
      'Jumlah': 'Amount',
      'Keterangan': 'Description',
      'Catatan': 'Notes',
      'Tanggal': 'Date',
      'Bulan': 'Month',
      'Tahun': 'Year',
      'Periode': 'Period',
      'Filter Periode': 'Filter Period',
      'Grafik Arus Kas': 'Cashflow Chart',
      'Rasio Tabungan': 'Savings Ratio',
      'Anggaran': 'Budget',
      'Makan & Minum': 'Food & Beverage',
      'Transportasi': 'Transportation',
      'Tagihan & Utilitas': 'Bills & Utilities',
      'Belanja': 'Shopping',
      'Hiburan': 'Entertainment',
      'Kesehatan & Kebugaran': 'Health & Fitness',
      'Pendidikan': 'Education',
      'Investasi': 'Investment',
      'Tabungan': 'Savings',
      'Gaji': 'Salary',
      'Bonus': 'Bonus',
      'Lainnya': 'Others',

      // Shop & Rewards (Ancient Grimoire, Mystery System Chest & Items)
      'Toko Hadiah': 'Reward Shop',
      'Ancient Grimoire': 'Ancient Grimoire',
      'Mystery System Chest': 'Mystery System Chest',
      'Peti Misteri Sistem': 'Mystery System Chest',
      'Buka Peti Misteri untuk mendapatkan hadiah acak bernilai tinggi dari Sistem.': 'Open the Mystery Chest to receive high-value random rewards from the System.',
      'Kitab kuno berisi pengetahuan rahasia dan item langka untuk meningkatkan kekuatan Hunter.': 'An ancient tome containing secret knowledge and rare items to enhance Hunter abilities.',
      'Tukar hadiah dengan Gold hasil kerja kerasmu.': 'Redeem rewards using the Gold earned from your hard work.',
      'Gunakan Gold untuk menukar item spesial dan hadiah dunia nyata.': 'Use Gold to redeem special items and real-world rewards.',
      'Tukar': 'Redeem',
      'Beli': 'Buy',
      'Gunakan': 'Use',
      'Riwayat Penukaran': 'Redemption History',
      'Tambah Hadiah': 'Add Reward',
      'Hadiah Baru': 'New Reward',
      'Nama Hadiah': 'Reward Name',
      'Harga Koin': 'Coin Price',
      'Harga Gold': 'Gold Price',
      'Koin Tidak Cukup': 'Insufficient Coins',
      'Gold Tidak Cukup': 'Insufficient Gold',
      'Berhasil Ditukar!': 'Successfully Redeemed!',
      'Perisai Pelindung Streak': 'Streak Protection Shield',
      'Melindungi HP dan Streak dari penalti evaluasi harian selama 1 hari.': 'Protects HP and Streak from daily evaluation penalties for 1 day.',

      // Settings & Modals
      'Bahasa': 'Language',
      'Pilih Bahasa': 'Select Language',
      'Efek Suara': 'Sound Effects',
      'Ekspor Data': 'Export Data',
      'Impor Data': 'Import Data',
      'Reset Data': 'Reset Data',
      'Konfirmasi': 'Confirm',
      'Batal': 'Cancel',
      'Tutup': 'Close',
      'Ya, Lanjutkan': 'Yes, Continue',
      'Peringatan Sistem': 'System Alert'
    },
    ja: {
      // Navigation & Tabs
      'Beranda': 'ホーム',
      'Status': 'ステータス',
      'Misi': 'クエスト',
      'Dungeon': 'ダンジョン',
      'Toko': 'ショップ',
      'Pengaturan': '設定',
      'Riwayat': '履歴',
      'Profil': 'プロフィール',
      'Perbendaharaan': '宝物庫',
      'Keuangan': '家計簿・財務',
      'Statistik': '統計',

      // Stats & Attributes
      'Status Atribut': 'ステータス能力値',
      'Distribusi Level Atribut': '能力値レベル分布',
      'Kekuatan': '筋力 (STR)',
      'Kecerdasan': '知力 (INT)',
      'Kebijaksanaan': '賢さ (WIS)',
      'Karisma': '魅力 (CHR)',
      'Peringkat': 'ランク',
      'Level': 'レベル',
      'Kesehatan': 'HP',
      'Energi': 'スタミナ',
      'Koin': 'コイン',
      'Emas': 'ゴールド',
      'Poin Status': 'ステータスポイント',
      'Total EXP': '累計EXP',
      'Tingkat Penyelesaian': '達成率',
      'Hari Aktif': 'アクティブ日数',

      // Quests & Habits
      'Misi Harian': 'デイリークエスト',
      'Misi Utama': 'メインクエスト',
      'Misi Tambahan': 'サブクエスト',
      'Quest Baru': '新規クエスト',
      'Tambah Quest': 'クエスト追加',
      'Tambah Misi': 'クエスト追加',
      'Edit Quest': 'クエスト編集',
      'Judul Quest': 'クエスト名',
      'Kategori': 'カテゴリー',
      'Atribut': '能力値',
      'Tingkat Kesulitan': '難易度',
      'Waktu Pelaksanaan': '時間帯',
      'Mudah': '簡単',
      'Sedang': '普通',
      'Sulit': '難しい',
      'Sangat Sulit': '超難関',
      'Selesai': '完了',
      'Belum Selesai': '未完了',
      'Batalkan': '取り消す',
      'Hapus': '削除',
      'Simpan': '保存',
      'Simpan Perubahan': '変更を保存',
      'Pagi': '朝',
      'Siang': '昼',
      'Sore': '夕方',
      'Malam': '夜',
      'Kapan Saja': 'いつでも',
      'Semua': 'すべて',
      'Beruntun': '連続記録',
      'Bekukan Streak': 'ストリーク凍結',
      'Habit Tracker & Riwayat': '習慣トラッカー＆履歴',
      'Belum ada misi untuk hari ini.': '今日のクエストはまだありません。',
      'Belum ada riwayat.': '履歴はまだありません。',

      // System Control & Daily Evaluation
      'Kontrol Sistem & Evaluasi Harian': 'システム制御＆日次評価',
      'Evaluasi & Lanjut Hari': '評価して次の日へ',
      'Evaluasi dan Lanjut Hari': '評価して次の日へ',
      'Evaluasi Harian': '日次評価',
      'Evaluasi Misi Harian': 'デイリークエスト評価',
      'Evaluasi misi pada tanggal terpilih. Misi yang belum selesai akan mengurangi HP kecuali ada Shield.': '選択した日付のクエストを評価します。未完了のクエストはシールドがない限りHPを減少させます。',
      'Evaluasi misi pada tanggal terpilih. Misi yang tidak selesai akan mengurangi HP kecuali ada Shield.': '選択した日付のクエストを評価します。未完了のクエストはシールドがない限りHPを減少させます。',
      'Evaluasi misi pada tanggal terpilih. Quest yang belum selesai akan mengurangi HP kecuali ada Shield.': '選択した日付のクエストを評価します。未完了のクエストはシールドがない限りHPを減少させます。',
      'Misi yang belum selesai akan mengurangi HP kecuali ada Shield.': '未完了のクエストはシールドがない限りHPを減少させます。',
      'Reminder Notifikasi Layar HP': 'スマホロック画面通知リマインダー',
      'Aktifkan Notifikasi': '通知を有効化',
      'Matikan Notifikasi': '通知をオフにする',
      'Nonaktifkan Notifikasi': '通知を無効化',
      'Notifikasi Aktif': '通知有効',
      'Notifikasi Mati': '通知オフ',
      'Tes Notifikasi': '通知テスト',
      'Pengingat Harian': '毎日のリマインダー',
      'Waktu Pengingat': 'リマインダー時間',
      'Cadangkan & Pulihkan Data': 'データのバックアップと復元',
      'Ekspor Data (JSON)': 'データ出力 (JSON)',
      'Impor Data (JSON)': 'データ読込 (JSON)',
      'Reset Seluruh Data': '全データ初期化',

      // Dungeon & Deep Focus Raid
      'Deep Focus Raid': 'ディープフォーカス・レイド',
      'Masuki gerbang fokus': '集中のゲートへ入る',
      'Masuki gerbang fokus.': '集中のゲートへ入る。',
      'Masuki gerbang fokus untuk menaklukkan tantangan dan raih hadiah EXP serta Gold.': '集中のゲートに入り、試練を攻略してEXPとゴールド報酬を獲得しよう。',
      'Masuki gerbang fokus, kalahkan distraksi, dan dapatkan hadiah EXP & Gold.': '集中のゲートに入り、雑念を打ち倒してEXPとゴールド報酬を獲得しよう。',
      'Mulai Dungeon': 'ダンジョン開始',
      'Masuk Dungeon': 'ダンジョンに入る',
      'Jeda': '一時停止',
      'Lanjutkan': '再開',
      'Menyerah': '諦める',
      'Fokus': '集中',
      'Istirahat': '休憩',
      'Durasi Fokus': '集中時間',
      'Durasi Istirahat': '休憩時間',
      'Suara Latar': '環境音',
      'Kunci Layar': '画面ロック',
      'Mode Kunci Layar': '画面ロックモード',
      'Dungeon Selesai!': 'ダンジョンクリア！',
      'Menit': '分',

      // Treasury / Finance / Cashflow Dashboard
      'Pencatatan Keuangan': '家計簿・財務記録',
      'Pencatatan Keuangan & Arus Kas': '財務記録＆キャッシュフロー',
      'Dashboard Arus Kas': 'キャッシュフローダッシュボード',
      'Arus Kas': 'キャッシュフロー',
      'Arus Kas Harian': '日次キャッシュフロー',
      'Arus Kas Bulanan': '月次キャッシュフロー',
      'Arus Kas Tahunan': '年次キャッシュフロー',
      'Harian': '日次',
      'Bulanan': '月次',
      'Tahunan': '年次',
      'Ringkasan Keuangan': '財務サマリー',
      'Total Pemasukan': '総収入',
      'Total Pengeluaran': '総支出',
      'Kategori Pemasukan': '収入カテゴリー',
      'Kategori Pengeluaran': '支出カテゴリー',
      'Selisih Bersih': '純収支差額',
      'Pemasukan': '収入',
      'Pengeluaran': '支出',
      'Saldo': '残高',
      'Saldo Bersih': '純残高',
      'Sisa Saldo': '残り残高',
      'Arus Kas Bersih': '純キャッシュフロー',
      'Catat Transaksi': '取引を記録',
      'Tambah Transaksi': '取引を追加',
      'Riwayat Transaksi': '取引履歴',
      'Belum ada transaksi.': '取引記録はまだありません。',
      'Belum ada catatan keuangan.': '財務記録はまだありません。',
      'Nominal': '金額',
      'Nominal (Rp)': '金額 (Rp)',
      'Masukkan Nominal': '金額を入力',
      'Jumlah': '金額',
      'Keterangan': '説明',
      'Catatan': 'メモ',
      'Tanggal': '日付',
      'Bulan': '月',
      'Tahun': '年',
      'Periode': '期間',
      'Filter Periode': '期間フィルター',
      'Grafik Arus Kas': 'キャッシュフローチャート',
      'Rasio Tabungan': '貯蓄率',
      'Anggaran': '予算',
      'Makan & Minum': '食費',
      'Transportasi': '交通費',
      'Tagihan & Utilitas': '光熱費・請求書',
      'Belanja': '買い物',
      'Hiburan': '娯楽',
      'Kesehatan & Kebugaran': '健康・フィットネス',
      'Pendidikan': '教育',
      'Investasi': '投資',
      'Tabungan': '貯金',
      'Gaji': '給与',
      'Bonus': 'ボーナス',
      'Lainnya': 'その他',

      // Shop & Rewards (Ancient Grimoire, Mystery System Chest & Items)
      'Toko Hadiah': '報酬ショップ',
      'Ancient Grimoire': 'エンシェント・グリモア',
      'Mystery System Chest': 'ミステリー・システムチェスト',
      'Peti Misteri Sistem': 'ミステリー・システムチェスト',
      'Buka Peti Misteri untuk mendapatkan hadiah acak bernilai tinggi dari Sistem.': 'ミステリーチェストを開けて、システムから高価値のランダム報酬を手に入れよう。',
      'Kitab kuno berisi pengetahuan rahasia dan item langka untuk meningkatkan kekuatan Hunter.': 'ハンターの力を高める秘伝の知識とレアアイテムが記された古文書。',
      'Tukar hadiah dengan Gold hasil kerja kerasmu.': '努力して獲得したゴールドで報酬を交換しよう。',
      'Gunakan Gold untuk menukar item spesial dan hadiah dunia nyata.': 'ゴールドを使って特別アイテムや現実の報酬と交換しよう。',
      'Tukar': '交換',
      'Beli': '購入',
      'Gunakan': '使用',
      'Riwayat Penukaran': '交換履歴',
      'Tambah Hadiah': '報酬追加',
      'Hadiah Baru': '新規報酬',
      'Nama Hadiah': '報酬名',
      'Harga Koin': '必要コイン',
      'Harga Gold': '必要ゴールド',
      'Koin Tidak Cukup': 'コイン不足',
      'Gold Tidak Cukup': 'ゴールド不足',
      'Berhasil Ditukar!': '交換完了！',
      'Perisai Pelindung Streak': 'ストリーク保護シールド',
      'Melindungi HP dan Streak dari penalti evaluasi harian selama 1 hari.': '1日間、日次評価のペナルティからHPとストリークを保護します。',

      // Settings & Modals
      'Bahasa': '言語',
      'Pilih Bahasa': '言語を選択',
      'Efek Suara': '効果音',
      'Ekspor Data': 'データ出力',
      'Impor Data': 'データ読込',
      'Reset Data': 'データ初期化',
      'Konfirmasi': '確認',
      'Batal': 'キャンセル',
      'Tutup': '閉じる',
      'Ya, Lanjutkan': 'はい、続行',
      'Peringatan Sistem': 'システム警告'
    }
  };

  // 2. DYNAMIC / REGEX SUBSTRING PATTERNS (Handles partial descriptions, numbers, emojis, & mixed phrases)
  const PATTERN_RULES = {
    en: [
      // Specific UI controls & labels requested
      { regex: /Distribusi Level Atribut/gi, replace: 'Attribute Level Distribution' },
      { regex: /Evaluasi\s*(&|dan)\s*Lanjut Hari/gi, replace: 'Evaluate $1 Advance Day' },
      { regex: /Matikan Notifikasi/gi, replace: 'Disable Notifications' },
      { regex: /Aktifkan Notifikasi/gi, replace: 'Enable Notifications' },
      { regex: /Mystery System Chest/gi, replace: 'Mystery System Chest' },
      { regex: /Semua/g, replace: 'All' },
      // Daily evaluation
      { regex: /Evaluasi misi pada tanggal terpilih\.\s*(Misi|Quest) yang (belum|tidak) selesai akan mengurangi HP kecuali ada Shield\.?/gi, replace: 'Evaluate quests on the selected date. Incomplete quests will deduct HP unless a Shield is active.' },
      // Dungeon & Deep Focus Raid descriptions
      { regex: /Masuki gerbang fokus([^.]*)\.?/gi, replace: 'Enter the focus gate$1.' },
      { regex: /untuk menaklukkan tantangan/gi, replace: 'to conquer challenges' },
      { regex: /dan raih hadiah EXP serta Gold/gi, replace: 'and earn EXP and Gold rewards' },
      { regex: /kalahkan distraksi/gi, replace: 'defeat distractions' },
      { regex: /dan dapatkan hadiah/gi, replace: 'and earn rewards' },
      // Ancient Grimoire & Shop descriptions
      { regex: /Kitab kuno berisi([^.]*)\.?/gi, replace: 'An ancient tome containing$1.' },
      { regex: /pengetahuan rahasia dan item langka/gi, replace: 'secret knowledge and rare items' },
      { regex: /untuk meningkatkan kekuatan Hunter/gi, replace: 'to enhance Hunter abilities' },
      { regex: /Tukar hadiah dengan Gold([^.]*)\.?/gi, replace: 'Redeem rewards with Gold$1.' },
      { regex: /Gunakan Gold untuk menukar([^.]*)\.?/gi, replace: 'Use Gold to redeem$1.' },
      // Finance & Cashflow Dashboard
      { regex: /Dashboard Arus Kas/gi, replace: 'Cashflow Dashboard' },
      { regex: /Pencatatan Keuangan/gi, replace: 'Financial Records' },
      { regex: /Kategori Pemasukan/gi, replace: 'Income Category' },
      { regex: /Kategori Pengeluaran/gi, replace: 'Expense Category' },
      { regex: /Selisih Bersih/gi, replace: 'Net Difference' },
      { regex: /Nominal/gi, replace: 'Amount' },
      { regex: /Arus Kas Harian/gi, replace: 'Daily Cashflow' },
      { regex: /Arus Kas Bulanan/gi, replace: 'Monthly Cashflow' },
      { regex: /Arus Kas Tahunan/gi, replace: 'Annual Cashflow' },
      { regex: /Arus Kas/gi, replace: 'Cashflow' },
      { regex: /Total Pemasukan/gi, replace: 'Total Income' },
      { regex: /Total Pengeluaran/gi, replace: 'Total Expenses' },
      { regex: /Pemasukan/gi, replace: 'Income' },
      { regex: /Pengeluaran/gi, replace: 'Expense' },
      { regex: /Saldo Bersih/gi, replace: 'Net Balance' },
      { regex: /Sisa Saldo/gi, replace: 'Remaining Balance' },
      { regex: /Saldo/gi, replace: 'Balance' },
      { regex: /Harian/gi, replace: 'Daily' },
      { regex: /Bulanan/gi, replace: 'Monthly' },
      { regex: /Tahunan/gi, replace: 'Annual' },
      // Stats & Dynamic counters
      { regex: /Target Streak\s*([≥>=]+)\s*(\d+%)/gi, replace: 'Streak Target $1 $2' },
      { regex: /(\d+)\s*Level lagi menuju/gi, replace: '$1 Levels left until' },
      { regex: /Riwayat\s*\((\d+)\)/gi, replace: 'History ($1)' },
      { regex: /Sisa Shield:\s*(\d+)/gi, replace: 'Remaining Shields: $1' },
      { regex: /Shield Aktif/gi, replace: 'Shield Active' },
      { regex: /Tidak ada Shield/gi, replace: 'No Shield' },
      { regex: /Hari ke-(\d+)/gi, replace: 'Day $1' },
      { regex: /Tanggal Terpilih:/gi, replace: 'Selected Date:' },
      { regex: /Penalti HP:/gi, replace: 'HP Penalty:' },
      { regex: /Kapan Saja/gi, replace: 'Anytime' },
      { regex: /Pagi/g, replace: 'Morning' },
      { regex: /Siang/g, replace: 'Afternoon' },
      { regex: /Sore/g, replace: 'Evening' },
      { regex: /Malam/g, replace: 'Night' }
    ],
    ja: [
      // Specific UI controls & labels requested
      { regex: /Distribusi Level Atribut/gi, replace: '能力値レベル分布' },
      { regex: /Evaluasi\s*(&|dan)\s*Lanjut Hari/gi, replace: '評価して次の日へ' },
      { regex: /Matikan Notifikasi/gi, replace: '通知をオフにする' },
      { regex: /Aktifkan Notifikasi/gi, replace: '通知を有効化' },
      { regex: /Mystery System Chest/gi, replace: 'ミステリー・システムチェスト' },
      { regex: /Semua/g, replace: 'すべて' },
      // Daily evaluation
      { regex: /Evaluasi misi pada tanggal terpilih\.\s*(Misi|Quest) yang (belum|tidak) selesai akan mengurangi HP kecuali ada Shield\.?/gi, replace: '選択した日付のクエストを評価します。未完了のクエストはシールドがない限りHPを減少させます。' },
      // Dungeon & Deep Focus Raid descriptions
      { regex: /Masuki gerbang fokus([^.]*)\.?/gi, replace: '集中のゲートに入り、試練を攻略してEXPとゴールド報酬を獲得しよう。' },
      // Ancient Grimoire & Shop descriptions
      { regex: /Kitab kuno berisi([^.]*)\.?/gi, replace: 'ハンターの力を高める秘伝の知識とレアアイテムが記された古文書。' },
      { regex: /Tukar hadiah dengan Gold([^.]*)\.?/gi, replace: '努力して獲得したゴールドで報酬を交換しよう。' },
      { regex: /Gunakan Gold untuk menukar([^.]*)\.?/gi, replace: 'ゴールドを使って特別アイテムや現実の報酬と交換しよう。' },
      // Finance & Cashflow Dashboard
      { regex: /Dashboard Arus Kas/gi, replace: 'キャッシュフローダッシュボード' },
      { regex: /Pencatatan Keuangan/gi, replace: '財務記録' },
      { regex: /Kategori Pemasukan/gi, replace: '収入カテゴリー' },
      { regex: /Kategori Pengeluaran/gi, replace: '支出カテゴリー' },
      { regex: /Selisih Bersih/gi, replace: '純収支差額' },
      { regex: /Nominal/gi, replace: '金額' },
      { regex: /Arus Kas Harian/gi, replace: '日次キャッシュフロー' },
      { regex: /Arus Kas Bulanan/gi, replace: '月次キャッシュフロー' },
      { regex: /Arus Kas Tahunan/gi, replace: '年次キャッシュフロー' },
      { regex: /Arus Kas/gi, replace: 'キャッシュフロー' },
      { regex: /Total Pemasukan/gi, replace: '総収入' },
      { regex: /Total Pengeluaran/gi, replace: '総支出' },
      { regex: /Pemasukan/gi, replace: '収入' },
      { regex: /Pengeluaran/gi, replace: '支出' },
      { regex: /Saldo Bersih/gi, replace: '純残高' },
      { regex: /Sisa Saldo/gi, replace: '残り残高' },
      { regex: /Saldo/gi, replace: '残高' },
      { regex: /Harian/gi, replace: '日次' },
      { regex: /Bulanan/gi, replace: '月次' },
      { regex: /Tahunan/gi, replace: '年次' },
      // Stats & Dynamic counters
      { regex: /Target Streak\s*([≥>=]+)\s*(\d+%)/gi, replace: 'ストリーク目標 $1 $2' },
      { regex: /(\d+)\s*Level lagi menuju/gi, replace: '次のランクまであと $1 レベル' },
      { regex: /Riwayat\s*\((\d+)\)/gi, replace: '履歴 ($1)' },
      { regex: /Sisa Shield:\s*(\d+)/gi, replace: '残りシールド: $1' },
      { regex: /Shield Aktif/gi, replace: 'シールド有効' },
      { regex: /Tidak ada Shield/gi, replace: 'シールドなし' },
      { regex: /Hari ke-(\d+)/gi, replace: '$1日目' },
      { regex: /Tanggal Terpilih:/gi, replace: '選択日:' },
      { regex: /Penalti HP:/gi, replace: 'HPペナルティ:' },
      { regex: /Kapan Saja/gi, replace: 'いつでも' },
      { regex: /Pagi/g, replace: '朝' },
      { regex: /Siang/g, replace: '昼' },
      { regex: /Sore/g, replace: '夕方' },
      { regex: /Malam/g, replace: '夜' }
    ]
  };

  // Build reverse lookup map so switching EN -> JA or JA -> ID works seamlessly
  const REVERSE_MAP = {};
  Object.entries(DICTIONARY).forEach(([lang, entries]) => {
    Object.entries(entries).forEach(([idText, translatedText]) => {
      REVERSE_MAP[translatedText] = idText;
      REVERSE_MAP[idText] = idText;
    });
  });

  // Sort dictionary keys by length descending so longer phrases match before shorter substrings
  const SORTED_DICT_KEYS = {
    en: Object.keys(DICTIONARY.en).sort((a, b) => b.length - a.length),
    ja: Object.keys(DICTIONARY.ja).sort((a, b) => b.length - a.length)
  };

  // Track original Indonesian text per DOM Text Node so switching languages never loses source text
  const ORIGINAL_TEXT_MAP = new WeakMap();

  function getCurrentLang() {
    return localStorage.getItem(STORAGE_KEY) || 'id';
  }

  function translateString(rawText, targetLang) {
    if (!rawText || typeof rawText !== 'string') return rawText;
    const trimmed = rawText.trim();
    if (!trimmed) return rawText;

    // 1. Check exact dictionary match (including reverse map)
    const baseIdKey = REVERSE_MAP[trimmed];
    if (baseIdKey) {
      const translated = targetLang === 'id'
        ? baseIdKey
        : (DICTIONARY[targetLang] && DICTIONARY[targetLang][baseIdKey]) || baseIdKey;
      return rawText.replace(trimmed, translated);
    }

    // 2. If target is 'id', return raw Indonesian source
    if (targetLang === 'id') return rawText;

    // 3. Apply regex pattern rules (handles multi-word descriptions & dynamic numbers)
    let result = rawText;
    const rules = PATTERN_RULES[targetLang] || [];
    for (const rule of rules) {
      if (rule.regex.test(result)) {
        rule.regex.lastIndex = 0;
        result = result.replace(rule.regex, rule.replace);
      }
    }

    // 4. Multi-phrase replacement sorted by longest phrase first
    if (DICTIONARY[targetLang] && SORTED_DICT_KEYS[targetLang]) {
      for (const idPhrase of SORTED_DICT_KEYS[targetLang]) {
        if (idPhrase.length >= 4 && result.includes(idPhrase)) {
          result = result.split(idPhrase).join(DICTIONARY[targetLang][idPhrase]);
        }
      }
    }

    return result;
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
      if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT'].includes(node.tagName)) {
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

  // Observe dynamic renders & text updates (modals, toasts, daily evaluation text, finance tabs)
  const observer = new MutationObserver((mutations) => {
    const lang = getCurrentLang();
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((added) => {
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
