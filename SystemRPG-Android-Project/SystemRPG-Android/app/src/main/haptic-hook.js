// Sisipkan <script src="haptic-hook.js"></script> sebelum </body> di index.html (opsional)
// Otomatis memberi getaran fisik halus saat tombol/checkbox quest ditekan,
// dan menyediakan window.triggerRpgHaptic('quest' | 'complete' | 'levelup' | 'damage')
(function () {
  window.triggerRpgHaptic = function (type) {
    try {
      if (window.AndroidBridge && typeof window.AndroidBridge.hapticFeedback === 'function') {
        window.AndroidBridge.hapticFeedback(type || 'tap');
      }
    } catch (_) {}
  };

  document.addEventListener('click', function (e) {
    const target = e.target.closest('button, input[type="checkbox"], [role="button"], .quest-item');
    if (!target) return;
    const text = (target.innerText || '').toLowerCase();
    if (text.includes('claim') || text.includes('selesai') || text.includes('redeem')) {
      window.triggerRpgHaptic('complete');
    } else {
      window.triggerRpgHaptic('quest');
    }
  }, true);
})();
