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
    <li><a href="/shows/headliners/">Headliners</a></li>
    <li><a href="/shows/" class="nav-cta">All Shows →</a></li>
  </ul>
  <button class="nav-mobile-menu" onclick="vsToggleMenu()" aria-label="Menu">☰</button>
</nav>
<div class="nav-mobile-drawer" id="vsMobileDrawer">
  <a href="/shows/comedy/">Comedy</a>
  <a href="/shows/magic/">Magic</a>
  <a href="/shows/cirque/">Cirque &amp; Acrobatic</a>
  <a href="/shows/music/">Music</a>
  <a href="/shows/headliners/">Headliners</a>
  <a href="/shows/production/">Production</a>
  <a href="/shows/adult/">Adult Shows</a>
  <a href="/shows/tribute/">Tribute Acts</a>
  <a href="/shows/variety/">Variety</a>
  <a href="/shows/" class="mobile-drawer-cta">All Shows →</a>
</div>
<div class="nav-overlay" id="vsNavOverlay" onclick="vsToggleMenu()"></div>`;

  const styles = `
<style>
#vs-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; display: flex; align-items: center; justify-content: space-between; padding: 10px 40px; background: rgba(10,22,40,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(26,127,232,0.15); }
.nav-logo img { height: 64px; width: auto; display: block; }
.nav-links { display: flex; gap: 28px; list-style: none; align-items: center; }
.nav-links a { color: #D4DCE8; text-decoration: none; font-weight: 600; font-size: 0.85rem; letter-spacing: 1px; text-transform: uppercase; transition: color 0.2s; font-family: 'Barlow', sans-serif; }
.nav-links a:hover { color: #FF6B00; }
.nav-cta { background: #FF6B00 !important; color: #0A1628 !important; padding: 8px 20px; border-radius: 4px; }
.nav-mobile-menu { display: none; background: none; border: none; color: #D4DCE8; font-size: 1.6rem; cursor: pointer; padding: 4px 8px; }
.nav-mobile-drawer { display: none; position: fixed; top: 0; right: -280px; width: 280px; height: 100vh; background: #0D1F3C; z-index: 300; flex-direction: column; padding: 80px 32px 32px; gap: 8px; transition: right 0.3s ease; border-left: 1px solid rgba(26,127,232,0.2); overflow-y: auto; }
.nav-mobile-drawer.open { right: 0; }
.nav-mobile-drawer a { color: #D4DCE8; text-decoration: none; font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 1rem; letter-spacing: 1px; text-transform: uppercase; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); transition: color 0.2s; }
.nav-mobile-drawer a:hover { color: #FF6B00; }
.mobile-drawer-cta { background: #FF6B00 !important; color: #0A1628 !important; text-align: center; border-radius: 6px; padding: 14px !important; border-bottom: none !important; margin-top: 8px; }
.nav-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 250; }
.nav-overlay.visible { display: block; }
@media (max-width: 900px) {
  #vs-nav { padding: 8px 20px; }
  .nav-logo img { height: 44px !important; }
  .nav-links { display: none; }
  .nav-mobile-menu { display: block; }
  .nav-mobile-drawer { display: flex; }
}
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
})();
