// Sisipkan script ini di dalam index.html sebelum tag </body>
(function () {
  function computeWeekHistory(state) {
    if (typeof state.weekHistory === 'string' && state.weekHistory.length === 7) {
      return state.weekHistory;
    }
    // Hitung otomatis 7 hari (Senin = index 0 ... Minggu = index 6) berdasarkan streak & dailyPct
    const now = new Date();
    const jsDay = now.getDay(); // 0=Minggu, 1=Senin, ..., 6=Sabtu
    const todayIdx = jsDay === 0 ? 6 : jsDay - 1;
    const streak = Number(state.streak || 0);
    const dailyPct = Number(state.dailyPct || state.dailyProgress || 0);
    const arr = ['0', '0', '0', '0', '0', '0', '0'];

    if (dailyPct >= 70) {
      arr[todayIdx] = '1';
    }
    const pastDays = dailyPct >= 70 ? Math.max(0, streak - 1) : streak;
    for (let i = 1; i <= pastDays && todayIdx - i >= 0; i++) {
      arr[todayIdx - i] = '1';
    }
    return arr.join('');
  }

  window.syncToAndroidWidget = function (customState) {
    try {
      if (!window.AndroidWidget || typeof window.AndroidWidget.updateWidget !== 'function') return;

      let state = customState;
      if (!state) {
        // Coba baca otomatis dari localStorage jika tidak dipass manual
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.toLowerCase().includes('system')) {
            const parsed = JSON.parse(localStorage.getItem(k));
            if (parsed && typeof parsed === 'object') {
              state = parsed;
              break;
            }
          }
        }
      }
      state = state || {};

      const streak = Number(state.streak || 0);
      const rank = String(state.rank || 'E-RANK');
      const level = Number(state.level || 1);
      const dailyPct = Math.round(Number(state.dailyPct || state.dailyProgress || 0));
      const weekHistory = computeWeekHistory(state);

      window.AndroidWidget.updateWidget(streak, rank, level, dailyPct, weekHistory);
    } catch (e) {
      console.warn('Widget sync skipped:', e);
    }
  };

  // Sinkronisasi otomatis saat halaman dibuka & setiap 3 detik saat ada perubahan
  window.addEventListener('load', () => window.syncToAndroidWidget());
  setInterval(() => window.syncToAndroidWidget(), 3000);
})();
