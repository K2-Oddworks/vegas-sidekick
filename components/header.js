// Vegas Sidekick — Header Component
// Drop <div id="vs-header"></div> at top of body + <script src="/components/header.js"></script>
(function() {
  const html = `
<nav id="vs-nav">
  <a class="nav-logo" href="/"><img src="/images/logo-pill-alt.png" alt="Vegas Sidekick" style="height:64px;width:auto;" /></a>
  <ul class="nav-links">
    <li><a href="/shows/comedy/">Comedy</a></li>
    <li><a href="/shows/magic/">Magic</a></li>
    <li><a href="/shows/cirque/">Cirque</a></li>
    <li><a href="/shows/music/">Music</a></li>
    <li><a href="/shows/spectaculars/">Spectaculars</a></li>
    <li><a href="/shows/family/">Family</a></li>
    <li><a href="/news/">Dispatch</a></li>
    <li><a href="/shows/" class="nav-cta">All Shows →</a></li>
  </ul>
  <button class="nav-mobile-menu" onclick="vsToggleMenu()" aria-label="Menu">☰</button>
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
