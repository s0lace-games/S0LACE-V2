// ── S0LACE2 LIQUID BACKGROUND ──
// Reads the "Background Style" setting and applies one of four presets:
// aurora (vivid, default) / dusk (diagonal glow) / mono (calm grayscale) / off (flat, no motion)
(function () {
  var pref;
  try { pref = JSON.parse(localStorage.getItem('s0lace2_background') || '"aurora"'); }
  catch (e) { pref = 'aurora'; }

  var valid = ['aurora', 'dusk', 'mono', 'off'];
  if (valid.indexOf(pref) === -1) pref = 'aurora'; // migrate any old preset names safely

  var el = document.getElementById('s0lace2-bg');
  if (!el) return;

  el.classList.add('bg-' + pref);

  if (pref !== 'off') {
    for (var i = 0; i < 4; i++) {
      var blob = document.createElement('div');
      blob.className = 'bg-blob';
      el.appendChild(blob);
    }
    var vignette = document.createElement('div');
    vignette.className = 'bg-vignette';
    el.appendChild(vignette);
  }
})();
