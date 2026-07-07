// ── S0LACE2 GLOBAL.JS ──
// Loaded on every page. Applies persistent settings from localStorage.

(function () {
  function load(k, def) {
    try { const v = localStorage.getItem(k); return v === null ? def : JSON.parse(v); }
    catch { return def; }
  }
  function save(k, v) { localStorage.setItem(k, JSON.stringify(v)); }

  // ── DEVICE DETECTION: auto-minimal on low-power devices ──
  (function() {
    // Only auto-set if user hasn't manually chosen a background
    if (localStorage.getItem("s0lace2_background") !== null) return;
    var ua = navigator.userAgent.toLowerCase();
    var isChromebook = ua.includes("cros");
    var isLowEnd = false;
    // Check hardware concurrency (CPU cores) — 4 or fewer = likely low-end
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) isLowEnd = true;
    // Check device memory API if available — under 4GB = low-end
    if (navigator.deviceMemory && navigator.deviceMemory < 4) isLowEnd = true;
    if (isChromebook || isLowEnd) {
      localStorage.setItem("s0lace2_background", JSON.stringify("off"));
    }
  })();

  // ── TAB CLOAK ──
  if (load("s0lace2_cloak_enabled", false)) {
    const title   = load("s0lace2_cloak_title", "");
    const _fav = load("s0lace2_cloak_favicon", "");
    const favicon = _fav === "custom" ? load("s0lace2_cloak_favicon_custom", "") : _fav;
    if (title) document.title = title;
    if (favicon) {
      let link = document.querySelector("link[rel*='icon']");
      if (!link) { link = document.createElement("link"); link.rel = "shortcut icon"; document.head.appendChild(link); }
      link.href = favicon;
    }
  }

  // ── ANTI CLOSE ──
  // Only block unload when navigating away from the site entirely
  if (load("s0lace2_anti_close", false)) {
    window.addEventListener("beforeunload", e => {
      const el = document.activeElement;
      const dest = (el && el.href) ? el.href : "";
      if (dest && dest.startsWith(location.origin)) return;
      e.preventDefault();
      e.returnValue = "";
    });
  }

  // ── PANIC KEY ──
  // Skip if inside an iframe — the about:blank parent handles panic itself
  document.addEventListener("keydown", e => {
    if (window.self !== window.top) return;
    if (!load("s0lace2_panic_enabled", false)) return;
    const key = load("s0lace2_panic_key", "");
    if (!key || e.key !== key) return;
    const url  = load("s0lace2_panic_url", "https://classroom.google.com");
    const dest = url === "custom" ? load("s0lace2_panic_custom_url", "https://www.google.com") : url;
    window.location.replace(dest);
  });

  // ── ALWAYS ABOUT:BLANK ──
  if (load("s0lace2_always_blank", false) && window.self === window.top) {
    const cloakTitle   = load("s0lace2_cloak_title", "") || "S0LACE2";
    const cloakFavRaw  = load("s0lace2_cloak_favicon", "");
    const cloakFav     = cloakFavRaw === "custom" ? load("s0lace2_cloak_favicon_custom", "") : cloakFavRaw;
    const favicon      = cloakFav || (location.origin + "/img/favicon.ico");
    const panicEnabled = load("s0lace2_panic_enabled", false);
    const panicKey     = load("s0lace2_panic_key", "");
    const panicUrl     = load("s0lace2_panic_url", "https://classroom.google.com");
    const panicCustom  = load("s0lace2_panic_custom_url", "");
    const finalPanic   = panicUrl === "custom" ? panicCustom : panicUrl;

    const w = window.open("", "_blank");
    if (w) {
      w.document.write(
        '<!DOCTYPE html><html><head>' +
        '<title>' + cloakTitle + '</title>' +
        '<link rel="icon" href="' + favicon + '">' +
        '</head>' +
        '<body style="margin:0;padding:0;background:#0a0a0b;overflow:hidden">' +
        '<iframe src="' + location.href + '" ' +
        'style="position:fixed;inset:0;width:100%;height:100%;border:none" allowfullscreen>' +
        '</iframe>' +
        '<script>' +
        'var _pe=' + JSON.stringify(panicEnabled) + ',' +
        '_pk=' + JSON.stringify(panicKey) + ',' +
        '_pu=' + JSON.stringify(finalPanic) + ';' +
        'document.addEventListener("keydown",function(e){' +
        '  if(_pe&&_pk&&e.key===_pk){window.location.replace(_pu);}' +
        '});' +
        '<\/script>' +
        '</body></html>'
      );
      w.document.close();
      window.close();
    }
  }

  // ── EXPOSE GLOBALS ──
  window.S0LACE2_SEARCH         = load("s0lace2_search", "https://duckduckgo.com/?q=");
  // Central API — always points to the main instance regardless of where the fork is hosted.
  // NOTE: this URL is intentionally left pointing at the original deployment and is not part of the rebrand.
  window.S0LACE2_CENTRAL_API = "https://astriex.vercel.app/api/community-games";
  window.S0LACE2_GAMES_OVERRIDE = load("s0lace2_games_override", null);

})();
