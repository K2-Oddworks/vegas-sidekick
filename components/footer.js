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
        <a class="vs-footer-logo" href="/"><img src="data:image/webp;base64,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" alt="" style="height:72px;width:auto;margin-right:8px;flex-shrink:0;"><span class="vs-footer-logo-text"><span style="color:#1A6BFF">VEGAS</span><span style="color:#FF6B2B">SIDEKICK</span></span></a>
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
      <div class="vs-footer-copy">© 2026 Vegas Sidekick. All rights reserved. <a href="/play/desert-crossing/" class="vs-footer-egg">🌵 Bored? Cross the Promenade.</a></div>
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
.vs-footer-logo { display: flex; align-items: center; margin-bottom: 16px; text-decoration: none; } .vs-footer-logo-text { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 1.9rem; letter-spacing: .03em; text-transform: uppercase; line-height: 1; white-space: nowrap; }

.vs-footer-tagline { font-family: 'Barlow Condensed', sans-serif; font-size: 1rem; font-weight: 700; color: #D4DCE8; letter-spacing: 1px; margin-bottom: 6px; }
.vs-footer-tagline-sub { font-size: 0.82rem; color: #A8B4C4; line-height: 1.5; max-width: 260px; }
.vs-footer-links { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
.vs-footer-col { display: flex; flex-direction: column; gap: 10px; }
.vs-footer-col-title { font-family: 'Barlow Condensed', sans-serif; font-size: 0.72rem; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #FF6B2B; margin-bottom: 4px; }
.vs-footer-col a { color: #A8B4C4; text-decoration: none; font-size: 0.85rem; font-family: 'Barlow', sans-serif; transition: color 0.2s; }
.vs-footer-col a:hover { color: #1A6BFF; }
.vs-footer-bottom { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.06); }
.vs-footer-copy { font-size: 0.78rem; color: #A8B4C4; font-family: 'Barlow', sans-serif; }
.vs-footer-egg { color: rgba(168,180,196,0.45); text-decoration: none; margin-left: 4px; transition: color 0.2s; }
.vs-footer-egg:hover { color: #FF6B2B; }
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