/**
 * SYSTEM RPG - Full Multilingual Engine (ID / EN / JA)
 * Plug-and-play localization interceptor for static & dynamic UI elements.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'system_rpg_lang';

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

      // Stats & Attributes
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

      // Quests & Habits
      'Misi Harian': 'Daily Quests',
      'Misi Utama': 'Main Quests',
      'Misi Tambahan': 'Side Quests',
      'Tambah Misi': 'Add Quest',
      'Selesai': 'Completed',
      'Belum Selesai': 'Incomplete',
      'Batalkan': 'Undo',
      'Hapus': 'Delete',
      'Simpan': 'Save',
      'Pagi': 'Morning',
      'Siang': 'Afternoon',
      'Sore': 'Evening',
      'Malam': 'Night',
      'Kapan Saja': 'Anytime',
      'Beruntun': 'Streak',
      'Bekukan Streak': 'Freeze Streak',

      // Dungeon & Focus Timer
      'Mulai Dungeon': 'Enter Dungeon',
      'Jeda': 'Pause',
      'Lanjutkan': 'Resume',
      'Menyerah': 'Surrender',
      'Fokus': 'Focus',
      'Istirahat': 'Rest',
      'Suara Latar': 'Ambient Audio',
      'Kunci Layar': 'Screen Lock',
      'Dungeon Selesai!': 'Dungeon Cleared!',

      // Shop & Rewards
      'Toko Hadiah': 'Reward Shop',
      'Tukar': 'Redeem',
      'Riwayat Penukaran': 'Redemption History',
      'Tambah Hadiah': 'Add Reward',
      'Koin Tidak Cukup': 'Insufficient Coins',
      'Berhasil Ditukar!': 'Successfully Redeemed!',

      // Settings & System
      'Bahasa': 'Language',
      'Pilih Bahasa': 'Select Language',
      'Efek Suara': 'Sound Effects',
      'Ekspor Data': 'Export Data',
      'Impor Data': 'Import Data',
      'Reset Data': 'Reset Data',
      'Konfirmasi': 'Confirm',
      'Batal': 'Cancel',
      'Tutup': 'Close'
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

      // Stats & Attributes
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

      // Quests & Habits
      'Misi Harian': 'デイリークエスト',
      'Misi Utama': 'メインクエスト',
      'Misi Tambahan': 'サブクエスト',
      'Tambah Misi': 'クエスト追加',
      'Selesai': '完了',
      'Belum Selesai': '未完了',
      'Batalkan': '取り消す',
      'Hapus': '削除',
      'Simpan': '保存',
      'Pagi': '朝',
      'Siang': '昼',
      'Sore': '夕方',
      'Malam': '夜',
      'Kapan Saja': 'いつでも',
      'Beruntun': '連続記録',
      'Bekukan Streak': 'ストリーク凍結',

      // Dungeon & Focus Timer
      'Mulai Dungeon': 'ダンジョン開始',
      'Jeda': '一時停止',
      'Lanjutkan': '再開',
      'Menyerah': '諦める',
      'Fokus': '集中',
      'Istirahat': '休憩',
      'Suara Latar': '環境音',
      'Kunci Layar': '画面ロック',
      'Dungeon Selesai!': 'ダンジョンクリア！',

      // Shop & Rewards
      'Toko Hadiah': '報酬ショップ',
      'Tukar': '交換',
      'Riwayat Penukaran': '交換履歴',
      'Tambah Hadiah': '報酬追加',
      'Koin Tidak Cukup': 'コイン不足',
      'Berhasil Ditukar!': '交換完了！',

      // Settings & System
      'Bahasa': '言語',
      'Pilih Bahasa': '言語を選択',
      'Efek Suara': '効果音',
      'Ekspor Data': 'データ出力',
      'Impor Data': 'データ読込',
      'Reset Data': 'データ初期化',
      'Konfirmasi': '確認',
      'Batal': 'キャンセル',
      'Tutup': '閉じる'
    }
  };

  // Reverse lookup map so switching from EN -> JA or JA -> ID works seamlessly
  const REVERSE_MAP = {};
  Object.entries(DICTIONARY).forEach(([lang, entries]) => {
    Object.entries(entries).forEach(([idText, translatedText]) => {
      REVERSE_MAP[translatedText] = idText;
      REVERSE_MAP[idText] = idText;
    });
  });

  function getCurrentLang() {
    return localStorage.getItem(STORAGE_KEY) || 'id';
  }

  function translateString(rawText, targetLang) {
    if (!rawText || typeof rawText !== 'string') return rawText;
    const trimmed = rawText.trim();
    if (!trimmed) return rawText;

    const baseIdKey = REVERSE_MAP[trimmed];
    if (!baseIdKey) return rawText;

    const translated = targetLang === 'id'
      ? baseIdKey
      : (DICTIONARY[targetLang] && DICTIONARY[targetLang][baseIdKey]) || baseIdKey;

    return rawText.replace(trimmed, translated);
  }

  function translateNode(node, targetLang) {
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE) {
      const nextVal = translateString(node.nodeValue, targetLang);
      if (node.nodeValue !== nextVal) {
        node.nodeValue = nextVal;
      }
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(node.tagName)) return;

      if (node.hasAttribute('placeholder')) {
        const ph = node.getAttribute('placeholder');
        const nextPh = translateString(ph, targetLang);
        if (ph !== nextPh) node.setAttribute('placeholder', nextPh);
      }
      if (node.hasAttribute('title')) {
        const ti = node.getAttribute('title');
        const nextTi = translateString(ti, targetLang);
        if (ti !== nextTi) node.setAttribute('title', nextTi);
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

  // Global helper accessible from UI buttons or app.js
  window.setSystemLanguage = function (lang) {
    applyLanguage(lang);
    window.dispatchEvent(new CustomEvent('system-language-changed', { detail: { lang } }));
  };

  window.t = function (key) {
    return translateString(key, getCurrentLang());
  };

  // Observe dynamic renders (modals, toasts, quest lists)
  const observer = new MutationObserver((mutations) => {
    const lang = getCurrentLang();
    if (lang === 'id') return;
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((added) => translateNode(added, lang));
    });
  });

  function init() {
    applyLanguage(getCurrentLang());
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
