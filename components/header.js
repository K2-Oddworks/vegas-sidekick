// Vegas Sidekick — Header Component
// Drop <div id="vs-header"></div> at top of body + <script src="/components/header.js"></script>
(function() {
  const html = `
<nav id="vs-nav">
  <a class="nav-logo" href="/"><img src="data:image/webp;base64,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" alt="Vegas Sidekick" style="height:64px;width:auto;" /></a>
  <ul class="nav-links">
    <li><a href="/shows/comedy/">Comedy</a></li>
    <li><a href="/shows/magic/">Magic</a></li>
    <li><a href="/shows/cirque/">Cirque</a></li>
    <li><a href="/shows/music/">Music</a></li>
    <li><a href="/shows/family/">Family</a></li>
    <li class="nav-more">
      <button class="nav-more-btn" aria-haspopup="true">MORE &#9660;</button>
      <div class="nav-more-menu">
        <a href="/shows/spectaculars/">Spectaculars</a>
        <a href="/shows/adult/">Adult Shows</a>
      </div>
    </li>
    <li><a href="/news/">Dispatch</a></li>
    <li><a href="/shows/" class="nav-cta">All Shows →</a></li>
  </ul>
  <div class="nav-mobile-right">
    <a class="nav-mobile-tickets" href="/shows/">🎟 All Shows</a>
    <button class="nav-mobile-menu" onclick="vsToggleMenu()" aria-label="Menu">☰</button>
  </div>
</nav>
<div class="nav-mobile-drawer" id="vsMobileDrawer">
  <a href="/shows/comedy/">Comedy</a>
  <a href="/shows/magic/">Magic</a>
  <a href="/shows/cirque/">Cirque &amp; Acrobatic</a>
  <a href="/shows/music/">Music &amp; Variety</a>
  <a href="/shows/spectaculars/">Spectaculars</a>
  <a href="/shows/family/">Family Shows</a>
  <a href="/shows/adult/">Adult Shows</a>
  <a href="/news/" class="mobile-drawer-dispatch">Vegas Dispatch</a>
  <a href="/shows/" class="mobile-drawer-cta">All Shows →</a>
</div>
<div class="nav-overlay" id="vsNavOverlay" onclick="vsToggleMenu()"></div>
<div id="vs-memorial-banner" role="banner" aria-live="polite"></div>`;

  const styles = `
<style>
#vs-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; display: flex; align-items: center; justify-content: space-between; padding: 10px 40px; background: rgba(10,22,40,0.95); backdrop-filter: blur(12px); }
#vs-nav::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #FF6B2B 0%, #1A6BFF 100%); }
.nav-logo img { height: 64px; width: auto; display: block; }
.nav-links { display: flex; gap: 28px; list-style: none; align-items: center; }
.nav-links a { color: #D4DCE8; text-decoration: none; font-weight: 600; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase; transition: color 0.2s; font-family: 'Barlow', sans-serif; }
.nav-links a:hover { color: #FF6B2B; }
.nav-cta { background: #FF6B2B !important; color: #0A1628 !important; padding: 8px 20px; border-radius: 4px; }
.nav-mobile-right { display: none; align-items: center; gap: 8px; }
.nav-mobile-tickets { display: inline-block; background: #FF6B2B; color: #0A1628 !important; font-family: 'Barlow Condensed', 'Barlow', sans-serif; font-weight: 800; font-size: 0.78rem; letter-spacing: 1px; text-transform: uppercase; text-decoration: none; padding: 6px 12px; border-radius: 4px; white-space: nowrap; transition: background 0.2s; }
.nav-mobile-tickets:hover { background: #e85e22; }
.nav-mobile-menu { display: none; background: none; border: none; color: #D4DCE8; font-size: 1.6rem; cursor: pointer; padding: 4px 8px; }
.nav-mobile-drawer { display: none; position: fixed; top: 0; right: -280px; width: 280px; height: 100vh; background: #0D1F3C; z-index: 300; flex-direction: column; padding: 80px 32px 32px; gap: 8px; transition: right 0.3s ease; border-left: 1px solid rgba(26,127,232,0.2); overflow-y: auto; }
.nav-mobile-drawer.open { right: 0; }
.nav-mobile-drawer a { color: #D4DCE8; text-decoration: none; font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 1rem; letter-spacing: 1px; text-transform: uppercase; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.14); transition: color 0.2s; }
.nav-mobile-drawer a:hover { color: #FF6B2B; }
.mobile-drawer-dispatch { border-left: 3px solid #FF6B2B !important; padding-left: 12px !important; color: #FF8C2A !important; margin-top: 4px; }
.mobile-drawer-dispatch:hover { color: #FFB347 !important; }
.mobile-drawer-cta { background: #FF6B2B !important; color: #0A1628 !important; text-align: center; border-radius: 6px; padding: 14px !important; border-bottom: none !important; margin-top: 8px; }
.nav-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 250; }
.nav-overlay.visible { display: block; }
@media (max-width: 900px) {
  #vs-nav { padding: 8px 20px; }
  .nav-logo img { height: 44px !important; }
  .nav-links { display: none; }
  .nav-mobile-right { display: flex; }
  .nav-mobile-menu { display: block; }
  .nav-mobile-drawer { display: flex; }
}
#vs-memorial-banner { display: none; position: fixed; top: 84px; left: 0; right: 0; z-index: 199; background: linear-gradient(90deg, #B22234 0%, #3C3B6E 50%, #B22234 100%); color: #fff; text-align: center; padding: 7px 16px; font-family: 'Barlow Condensed', 'Barlow', sans-serif; font-weight: 700; font-size: 0.9rem; letter-spacing: 1.2px; text-transform: uppercase; border-bottom: 2px solid #fff; box-shadow: 0 2px 12px rgba(0,0,0,0.4); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#vs-memorial-banner.vsm-visible { display: block; }
#vs-memorial-banner .vsm-stars { color: #FFD700; margin: 0 6px; letter-spacing: 3px; }
#vs-memorial-banner .vsm-unit { display: inline-block; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.25); padding: 1px 5px; border-radius: 3px; font-variant-numeric: tabular-nums; margin: 0 1px; min-width: 2.2ch; text-align: center; }
#vs-memorial-banner .vsm-link { color: #FFD700; text-decoration: none; font-weight: 800; border-bottom: 1px solid rgba(255,215,0,0.5); transition: color 0.2s, border-color 0.2s; }
#vs-memorial-banner .vsm-link:hover { color: #fff; border-color: rgba(255,255,255,0.6); }
#vs-memorial-banner .vsm-enjoy { font-size: 1rem; letter-spacing: 1.5px; }
@media (max-width: 900px) { #vs-memorial-banner { top: 60px; font-size: 0.75rem; padding: 6px 10px; letter-spacing: 0.8px; white-space: normal; text-align: center; line-height: 1.4; } }
@media (max-width: 480px) { #vs-memorial-banner { font-size: 0.7rem; padding: 5px 8px; } #vs-memorial-banner .vsm-stars { margin: 0 3px; } }
.nav-more { position: relative; }
.nav-more-btn { background: none; border: none; color: #D4DCE8; font-weight: 600; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; font-family: 'Barlow', sans-serif; padding: 0; transition: color 0.2s; line-height: inherit; }
.nav-more:hover .nav-more-btn { color: #FF6B2B; }
.nav-more-menu { visibility: hidden; opacity: 0; position: absolute; top: calc(100% + 8px); left: 50%; transform: translateX(-50%); background: #0D1F3C; border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.45); min-width: 172px; z-index: 300; transition: opacity 0.15s, visibility 0.15s; }
.nav-more:hover .nav-more-menu { visibility: visible; opacity: 1; }
.nav-more-menu a { display: block; padding: 11px 18px; color: #D4DCE8; text-decoration: none; font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 0.82rem; letter-spacing: 1px; text-transform: uppercase; transition: color 0.2s, background 0.2s; border-bottom: 1px solid rgba(255,255,255,0.07); }
.nav-more-menu a:last-child { border-bottom: none; }
.nav-more-menu a:hover { color: #FF6B2B; background: rgba(255,107,43,0.07); }
</style>`;

  const target = document.getElementById('vs-header');
  if (target) {
    target.innerHTML = styles + html;
  }

  window.vsToggleMenu = function() {
    const drawer = document.getElementById('vsMobileDrawer');
    const overlay = document.getElementById('vsNavOverlay');
    drawer.classList.toggle('open');
    overlay.classList.toggle('visible');
  };

  // July 4th Weekend Countdown (PDT = UTC-7)
  // Counts down to midnight PDT Friday July 3 2026 (= 2026-07-03T07:00:00Z)
  // Switches to "Happy 4th" message through end of July 4 (2026-07-05T07:00:00Z)
  (function() {
    var banner = document.getElementById('vs-memorial-banner');
    if (!banner) return;
    var TARGET = new Date('2026-07-03T07:00:00Z'); // midnight PDT Fri Jul 3 — weekend starts
    var EXPIRE = new Date('2026-07-05T07:00:00Z'); // midnight PDT end of Jul 4
    var offsetApplied = false;

    function applyBodyOffset() {
      if (offsetApplied) return;
      offsetApplied = true;
      requestAnimationFrame(function() {
        var bh = banner.offsetHeight;
        if (bh > 0) {
          var orig = parseFloat(window.getComputedStyle(document.body).paddingTop) || 0;
          document.body.setAttribute('data-vsm-orig-pt', orig);
          document.body.style.setProperty('padding-top', (orig + bh) + 'px', 'important');
        }
      });
    }
    function removeBodyOffset() {
      if (!offsetApplied) return;
      var orig = document.body.getAttribute('data-vsm-orig-pt');
      document.body.style.setProperty('padding-top', (orig || '0') + 'px', 'important');
    }

    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function isMobile() { return window.innerWidth < 480; }

    function tick() {
      var now = new Date();
      if (now >= EXPIRE) {
        banner.classList.remove('vsm-visible');
        removeBodyOffset();
        clearInterval(vsMemTimer);
        return;
      }
      if (!banner.classList.contains('vsm-visible')) {
        banner.classList.add('vsm-visible');
        applyBodyOffset();
      }
      if (now >= TARGET) {
        banner.innerHTML = '<span class="vsm-stars">★ ★ ★</span><span class="vsm-enjoy">Happy 4th of July 2026! 🎆🇺🇸 Enjoy the fireworks — and the shows.</span><span class="vsm-stars">★ ★ ★</span>';
        clearInterval(vsMemTimer);
        return;
      }
      var diff = TARGET - now;
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      if (isMobile()) {
        banner.innerHTML =
          '🎆 July 4th Weekend in ' +
          '<span class="vsm-unit">' + d + 'd</span> ' +
          '<span class="vsm-unit">' + pad(h) + 'h</span> ' +
          '<span class="vsm-unit">' + pad(m) + 'm</span> ' +
          '<span class="vsm-unit">' + pad(s) + 's</span>' +
          ' &mdash; <a class="vsm-link" href="/shows/">All Shows &#8594;</a>';
      } else {
        banner.innerHTML =
          '<span class="vsm-stars">★</span>' +
          '🎆 July 4th Weekend kicks off in ' +
          '<span class="vsm-unit">' + d + 'd</span> ' +
          '<span class="vsm-unit">' + pad(h) + 'h</span> ' +
          '<span class="vsm-unit">' + pad(m) + 'm</span> ' +
          '<span class="vsm-unit">' + pad(s) + 's</span>' +
          ' &mdash; <a class="vsm-link" href="/shows/">Plan Your Vegas Night &#8594;</a>' +
          '<span class="vsm-stars">★</span>';
      }
    }
    tick();
    var vsMemTimer = setInterval(tick, 1000);
  })();

  // Google Analytics — injected once via header, covers every page
  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-BM6QGF7B4Y';
  document.head.appendChild(gtagScript);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', 'G-BM6QGF7B4Y');

})();
