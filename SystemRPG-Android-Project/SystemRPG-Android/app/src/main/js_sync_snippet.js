// 1. DI MainActivity.kt (daftarkan bridge ke WebView):
// webView.settings.javaScriptEnabled = true
// webView.addJavascriptInterface(WidgetBridge(this), "AndroidWidget")

// 2. DI index.html (panggil fungsi ini setiap kali quest selesai / state berubah / saat app dibuka):
function syncToAndroidWidget(state) {
  if (window.AndroidWidget && typeof window.AndroidWidget.updateWidget === 'function') {
    const streak = Number(state.streak || 0);
    const rank = String(state.rank || 'E-RANK');
    const level = Number(state.level || 1);
    const dailyPct = Math.round(Number(state.dailyPct || 0));
    // Contoh format 7 hari (Senin - Minggu): "1110000" (1 = selesai >=70%, 0 = belum)
    const weekHistory = String(state.weekHistory || '0000000').padEnd(7, '0').slice(0, 7);

    window.AndroidWidget.updateWidget(streak, rank, level, dailyPct, weekHistory);
  }
}
