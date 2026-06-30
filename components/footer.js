// Vegas Sidekick — Footer Component
// Drop <div id="vs-footer"></div> before </body> + <script src="/components/footer.js"></script>
// Includes email capture wired to Brevo

(function() {
  const BREVO_API_KEY = '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';
  const BREVO_LIST_ID = 2;

  const html = `
<div class="vs-email-bar" id="vsEmailBar">
  <div class="vs-email-bar-inner">
    <div class="vs-email-bar-badge">🌵 SPIKE'S INSIDER LIST</div>
    <div class="vs-email-bar-headline">Vegas Deals Before Prices Go Up</div>
    <div class="vs-email-bar-sub">Last-minute discounts, show alerts, and picks from someone who actually lives here. No spam. Unsubscribe anytime.</div>
    <div class="vs-email-bar-proof">Join 4,200+ Vegas travelers already in the know</div>
    <form class="vs-email-form" id="vsEmailForm" onsubmit="vsSubmitEmail(event)">
      <input type="email" id="vsEmailInput" placeholder="your@email.com" required autocomplete="email" />
      <button type="submit" id="vsEmailBtn">🎟️ Get Free Deals</button>
    </form>
    <div class="vs-email-success" id="vsEmailSuccess">
      ✅ You're in — Spike will be in touch with the good stuff.
    </div>
    <div class="vs-email-bar-trust">✓ No spam &nbsp;·&nbsp; ✓ Unsubscribe anytime &nbsp;·&nbsp; ✓ Real local picks</div>
  </div>
</div>

<!-- Sidekick Standards Trust Strip -->
<div class="sidekick-standards">
  <div class="sidekick-standards-inner">
    <span class="ss-label">Sidekick Standards</span>
    <span class="ss-item"><span class="ss-x">✕</span> Fake timers</span>
    <span class="ss-sep">·</span>
    <span class="ss-item"><span class="ss-x">✕</span> Fake reviews</span>
    <span class="ss-sep">·</span>
    <span class="ss-item"><span class="ss-x">✕</span> Hidden fees</span>
    <span class="ss-sep">·</span>
    <span class="ss-item"><span class="ss-x">✕</span> Email walls</span>
  </div>
</div>

<footer id="vs-footer-inner">
  <div class="vs-footer-inner">
    <div class="vs-footer-top">
      <div class="vs-footer-brand">
        <a class="vs-footer-logo" href="/"><img src="data:image/webp;base64,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" alt="Vegas Sidekick" style="height:56px;width:auto;" /></a>
        <p class="vs-footer-tagline">Biggest Shows. Real Discounts. No BS.</p>
        <p class="vs-footer-tagline-sub">We live here. We know the shows. We tell you the truth.</p>
      </div>
      <div class="vs-footer-links">
        <div class="vs-footer-col">
          <div class="vs-footer-col-title">Shows</div>
          <a href="/shows/comedy/">Comedy</a>
          <a href="/shows/magic/">Magic</a>
          <a href="/shows/cirque/">Cirque &amp; Acrobatic</a>
          <a href="/shows/music/">Music &amp; Variety</a>
          <a href="/shows/spectaculars/">Spectaculars</a>
          <a href="/shows/family/">Family Shows</a>
          <a href="/shows/adult/">Adult Shows</a>
          <a href="/search/">Search All Shows</a>
        </div>
        <div class="vs-footer-col">
          <div class="vs-footer-col-title">Vegas Sidekick</div>
          <a href="/news/">Vegas Dispatch</a>
          <a href="/about/">About Vegas Sidekick</a>
          <a href="/about/kris-kidd/">About Kris Kidd</a>
          <a href="/contact/">Contact</a>
          <a href="/affiliate-disclosure/">Affiliate Disclosure</a>
          <a href="/privacy/">Privacy Policy</a>
          <a href="/terms/">Terms of Use</a>
        </div>
      </div>
    </div>
    <div class="vs-footer-bottom">
      <div class="vs-footer-copy">© 2026 Vegas Sidekick. All rights reserved.</div>
      <div class="vs-footer-disclosure">Affiliate Disclosure: Vegas Sidekick earns commissions when you purchase tickets through our links. This never affects our pricing or recommendations.</div>
    </div>
  </div>
</footer>`;

  const styles = `
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* Sidekick Standards Trust Strip */
.sidekick-standards {
  background: #ffffff;
  border-top: 1px solid rgba(10, 15, 44, 0.08);
  border-bottom: 1px solid rgba(10, 15, 44, 0.08);
  padding: 16px 20px;
}
.sidekick-standards-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
  flex-wrap: wrap;
  font-family: 'Barlow', sans-serif;
}
.ss-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 10px;
  letter-spacing: 2.5px;
  color: #8a93a8;
  text-transform: uppercase;
}
.ss-item {
  font-size: 13px;
  color: #0A0F2C;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.ss-x {
  color: #FF6B2B;
  font-weight: 700;
}
.ss-sep {
  color: #8a93a8;
  opacity: 0.4;
}
@media (max-width: 720px) {
  .ss-sep { display: none; }
  .sidekick-standards-inner { gap: 16px 20px; }
}

/* EMAIL BAR */
@keyframes vsEmailPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(255,107,0,0.5); } 50% { box-shadow: 0 0 0 10px rgba(255,107,0,0); } }
.vs-email-bar { background: linear-gradient(135deg, #FF6B2B 0%, #D94F00 40%, #B83E00 100%); padding: 52px 40px; position: relative; overflow: hidden; }
.vs-email-bar::before { content:''; position:absolute; top:0; left:0; right:0; bottom:0; background: radial-gradient(ellipse at 80% 50%, rgba(255,200,80,0.18) 0%, transparent 60%), radial-gradient(ellipse at 20% 50%, rgba(0,0,0,0.2) 0%, transparent 60%); pointer-events:none; }
.vs-email-bar::after { content:''; position:absolute; bottom:-2px; left:0; right:0; height:4px; background: linear-gradient(90deg, #FFB347, #FF6B2B, #FF4500, #FF6B2B, #FFB347); background-size: 300% 100%; animation: vsEmailPulse 2.5s ease infinite; pointer-events:none; }
.vs-email-bar-inner { max-width: 680px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 18px; text-align: center; position: relative; z-index: 1; }
.vs-email-bar-badge { display: inline-block; background: rgba(0,0,0,0.25); color: #FFE0B0; font-family: 'Barlow Condensed', sans-serif; font-size: 0.72rem; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; padding: 5px 14px; border-radius: 100px; border: 1px solid rgba(255,255,255,0.2); }
.vs-email-bar-headline { font-family: 'Bebas Neue', sans-serif; font-size: clamp(2.2rem,5vw,3.4rem); letter-spacing: 2px; color: #FFFFFF; line-height: 1; text-shadow: 0 2px 12px rgba(0,0,0,0.3); }
.vs-email-bar-sub { font-size: 1rem; color: rgba(255,255,255,0.88); line-height: 1.55; max-width: 520px; font-family: 'Barlow', sans-serif; }
.vs-email-bar-proof { font-family: 'Barlow Condensed', sans-serif; font-size: 0.82rem; font-weight: 700; letter-spacing: 1px; color: #FFE0B0; text-transform: uppercase; }
.vs-email-form { display: flex; gap: 10px; align-items: stretch; flex-wrap: wrap; justify-content: center; width: 100%; max-width: 520px; }
.vs-email-form input { flex: 1; min-width: 220px; background: #FFFFFF; border: 3px solid rgba(255,255,255,0.3); border-radius: 8px; padding: 14px 18px; color: #1A2236; font-family: 'Barlow', sans-serif; font-size: 1rem; outline: none; transition: border-color 0.2s; }
.vs-email-form input:focus { border-color: #FFE0B0; }
.vs-email-form input::placeholder { color: #8A9AB4; }
.vs-email-form button { background: #0A1628; color: #FFFFFF; font-family: 'Barlow Condensed', sans-serif; font-size: 1.05rem; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; padding: 14px 28px; border-radius: 8px; border: 3px solid rgba(255,255,255,0.15); cursor: pointer; transition: background 0.2s, transform 0.15s, box-shadow 0.2s; white-space: nowrap; box-shadow: 0 4px 18px rgba(0,0,0,0.35); animation: vsEmailPulse 2.5s ease infinite; }
.vs-email-form button:hover { background: #1A6BFF; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
.vs-email-success { display: none; font-family: 'Barlow Condensed', sans-serif; font-size: 1.15rem; font-weight: 800; color: #FFFFFF; letter-spacing: 1px; background: rgba(0,0,0,0.25); padding: 14px 28px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.3); }
.vs-email-success.visible { display: block; }
.vs-email-bar-trust { font-size: 0.78rem; color: rgba(255,255,255,0.7); font-family: 'Barlow', sans-serif; letter-spacing: 0.5px; }

/* FOOTER */
#vs-footer-inner { background: #060E1A; padding: 48px 40px 32px; border-top: 1px solid rgba(26,107,255,0.1); position: relative; z-index: 1; }
.vs-footer-inner { max-width: 1200px; margin: 0 auto; }
.vs-footer-top { display: grid; grid-template-columns: 1fr 2fr; gap: 48px; margin-bottom: 40px; }
.vs-footer-logo { display: block; margin-bottom: 16px; }
.vs-footer-logo img { height: 56px; width: auto; }
.vs-footer-tagline { font-family: 'Barlow Condensed', sans-serif; font-size: 1rem; font-weight: 700; color: #D4DCE8; letter-spacing: 1px; margin-bottom: 6px; }
.vs-footer-tagline-sub { font-size: 0.82rem; color: #A8B4C4; line-height: 1.5; max-width: 260px; }
.vs-footer-links { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
.vs-footer-col { display: flex; flex-direction: column; gap: 10px; }
.vs-footer-col-title { font-family: 'Barlow Condensed', sans-serif; font-size: 0.72rem; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #FF6B2B; margin-bottom: 4px; }
.vs-footer-col a { color: #A8B4C4; text-decoration: none; font-size: 0.85rem; font-family: 'Barlow', sans-serif; transition: color 0.2s; }
.vs-footer-col a:hover { color: #1A6BFF; }
.vs-footer-bottom { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.06); }
.vs-footer-copy { font-size: 0.78rem; color: #A8B4C4; font-family: 'Barlow', sans-serif; }
.vs-footer-disclosure { font-size: 0.72rem; color: rgba(168,180,196,0.5); max-width: 500px; text-align: right; line-height: 1.5; font-family: 'Barlow', sans-serif; }

@media (max-width: 900px) {
  .vs-email-bar { padding: 40px 24px; }
  .vs-email-form input { width: 100%; min-width: unset; }
  .vs-email-form { flex-direction: column; }
  .vs-email-form button { width: 100%; }
  #vs-footer-inner { padding: 40px 20px 32px; }
  .vs-footer-top { grid-template-columns: 1fr; gap: 32px; }
  .vs-footer-links { grid-template-columns: 1fr 1fr; gap: 24px; }
  .vs-footer-disclosure { text-align: left; }
}
@media (max-width: 480px) {
  .vs-email-bar { padding: 36px 20px; }
  .vs-footer-links { grid-template-columns: 1fr; }
}
</style>`;

  const target = document.getElementById('vs-footer');
  if (target) {
    target.innerHTML = styles + html;
  }

  // Post-affiliate-click deal alert overlay
  (function() {
    const STORAGE_KEY = 'vs_deal_alert_captured';

    const overlayHTML = `
<div id="vs-deal-overlay" role="dialog" aria-modal="true" aria-label="Vegas deal alerts">
  <div class="vs-deal-backdrop"></div>
  <div class="vs-deal-card">
    <button class="vs-deal-close" onclick="vsDealClose()" aria-label="Close">✕</button>
    <div class="vs-deal-opening">Your tickets are opening now →</div>
    <div class="vs-deal-headline">Want deal alerts for Vegas shows?</div>
    <div class="vs-deal-form" id="vsDealForm">
      <input type="email" class="vs-deal-input" id="vsDealInput" placeholder="your@email.com" autocomplete="email" />
      <button class="vs-deal-btn" type="button" onclick="vsDealSubmit()">Yes, Send Me Deals</button>
    </div>
    <div class="vs-deal-success" id="vsDealSuccess">✅ You're in — Spike's on it.</div>
    <div class="vs-deal-tagline">Spike finds the discounts. You just show up.</div>
    <button class="vs-deal-skip" onclick="vsDealClose()">No thanks</button>
  </div>
</div>`;

    const overlayStyles = `
#vs-deal-overlay { position: fixed; inset: 0; z-index: 9000; display: flex; align-items: center; justify-content: center; padding: 20px; opacity: 0; pointer-events: none; transition: opacity 0.28s ease; }
#vs-deal-overlay.visible { opacity: 1; pointer-events: auto; }
.vs-deal-backdrop { position: absolute; inset: 0; background: rgba(6,14,26,0.88); backdrop-filter: blur(5px); cursor: pointer; }
.vs-deal-card { position: relative; z-index: 1; background: #0A1628; border: 1px solid rgba(255,107,0,0.22); border-top: 3px solid #FF6B2B; border-radius: 16px; padding: 36px 32px 28px; max-width: 400px; width: 100%; box-shadow: 0 24px 60px rgba(0,0,0,0.55); transform: translateY(12px); transition: transform 0.28s ease; }
#vs-deal-overlay.visible .vs-deal-card { transform: translateY(0); }
.vs-deal-close { position: absolute; top: 14px; right: 16px; background: none; border: none; color: rgba(255,255,255,0.3); font-size: 1rem; cursor: pointer; padding: 4px 6px; line-height: 1; transition: color 0.2s; }
.vs-deal-close:hover { color: rgba(255,255,255,0.7); }
.vs-deal-opening { font-family: 'IBM Plex Mono', monospace; font-size: 0.68rem; color: #4d90f0; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 12px; }
.vs-deal-headline { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; color: #FFFFFF; line-height: 1.05; letter-spacing: 0.03em; margin-bottom: 20px; }
.vs-deal-form { display: flex; flex-direction: column; gap: 9px; margin-bottom: 14px; }
.vs-deal-input { padding: 12px 14px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; color: #fff; font-family: 'IBM Plex Mono', monospace; font-size: 0.82rem; outline: none; transition: border-color 0.2s; }
.vs-deal-input:focus { border-color: rgba(255,107,0,0.5); }
.vs-deal-input::placeholder { color: rgba(255,255,255,0.25); }
.vs-deal-btn { padding: 13px; background: #FF6B2B; color: #fff; font-family: 'Barlow Condensed', sans-serif; font-size: 1rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; border: none; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
.vs-deal-btn:hover { background: #ff8c33; }
.vs-deal-success { display: none; font-family: 'Barlow Condensed', sans-serif; font-size: 1rem; font-weight: 700; color: #4ade80; margin-bottom: 14px; }
.vs-deal-success.visible { display: block; }
.vs-deal-tagline { font-family: 'IBM Plex Mono', monospace; font-size: 0.67rem; color: rgba(255,255,255,0.32); letter-spacing: 0.04em; margin-bottom: 16px; }
.vs-deal-skip { background: none; border: none; color: rgba(255,255,255,0.22); font-family: 'IBM Plex Mono', monospace; font-size: 0.62rem; cursor: pointer; text-decoration: underline; padding: 0; transition: color 0.2s; }
.vs-deal-skip:hover { color: rgba(255,255,255,0.5); }
@media (max-width: 480px) { .vs-deal-card { padding: 28px 20px 22px; } .vs-deal-headline { font-size: 1.7rem; } }`;

    function init() {
      if (localStorage.getItem(STORAGE_KEY)) return;
      document.head.insertAdjacentHTML('beforeend', '<style>' + overlayStyles + '</style>');
      document.body.insertAdjacentHTML('beforeend', overlayHTML);
      document.querySelector('.vs-deal-backdrop').addEventListener('click', window.vsDealClose);

      document.addEventListener('click', function(e) {
        if (localStorage.getItem(STORAGE_KEY)) return;
        const link = e.target.closest('a[href*="spotlight.vegas"]');
        if (!link) return;
        e.preventDefault();
        window.open(link.href, '_blank', 'noopener,noreferrer');
        setTimeout(function() {
          const overlay = document.getElementById('vs-deal-overlay');
          if (overlay) overlay.classList.add('visible');
        }, 200);
      }, true);
    }

    window.vsDealClose = function() {
      const overlay = document.getElementById('vs-deal-overlay');
      if (overlay) { overlay.classList.remove('visible'); }
    };

    window.vsDealSubmit = async function() {
      const input = document.getElementById('vsDealInput');
      const val = input ? input.value.trim() : '';
      if (!val || !val.includes('@') || !val.includes('.')) {
        if (input) { input.style.borderColor = 'rgba(255,107,0,0.6)'; setTimeout(() => { input.style.borderColor = ''; }, 2000); }
        return;
      }
      try {
        await fetch('https://brevo-subscribe.vegassidekickcom.workers.dev', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: val })
        });
      } catch(e) { /* silent */ }
      localStorage.setItem(STORAGE_KEY, '1');
      const form = document.getElementById('vsDealForm');
      const success = document.getElementById('vsDealSuccess');
      if (form) form.style.display = 'none';
      if (success) success.classList.add('visible');
      setTimeout(window.vsDealClose, 2200);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();

  window.vsSubmitEmail = async function(e) {
    e.preventDefault();
    const email = document.getElementById('vsEmailInput').value.trim();
    if (!email || !email.includes('@')) return;
    const btn = document.getElementById('vsEmailBtn');
    const success = document.getElementById('vsEmailSuccess');
    const form = document.getElementById('vsEmailForm');

    btn.textContent = '...';
    btn.disabled = true;

    try {
      await fetch('https://brevo-subscribe.vegassidekickcom.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
    } catch (err) { /* silent fail — still show success */ }

    form.style.display = 'none';
    success.classList.add('visible');
  };
})();