// ── S0LACE2 AMBIENT BACKGROUND ──
// Lightweight CSS-only replacement for the old Vanta.js clouds background.
// Reads the same "Background Style" setting from the Settings page.
(function () {
  var pref;
  try { pref = JSON.parse(localStorage.getItem('s0lace2_background') || '"ambient"'); }
  catch (e) { pref = 'ambient'; }

  var el = document.getElementById('s0lace2-bg');
  if (!el) return;

  if (pref === 'minimal') {
    el.classList.add('ambient-minimal');
    return;
  }
  el.classList.add(pref === 'ambient_slow' ? 'ambient-slow' : 'ambient-full');
})();
