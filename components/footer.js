// Vegas Sidekick — Footer Component
// Drop <div id="vs-footer"></div> before </body> + <script src="/components/footer.js"></script>
// Includes email capture wired to Brevo

(function() {
  const BREVO_API_KEY = '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';
  const BREVO_LIST_ID = 2;

  const html = `
<div class="vs-email-bar" id="vsEmailBar">
  <div class="vs-email-bar-accent"></div>
  <div class="vs-email-bar-inner">
    <div class="vs-email-bar-left">
      <div class="vs-email-bar-spike">🌵</div>
      <div class="vs-email-bar-text">
        <span class="vs-email-bar-headline">Vegas deals before prices go up</span>
        <span class="vs-email-bar-sub">Spike's picks, last-minute discounts, and show alerts — straight to your inbox. No spam.</span>
      </div>
    </div>
    <form class="vs-email-form" id="vsEmailForm" onsubmit="vsSubmitEmail(event)">
      <input type="email" id="vsEmailInput" placeholder="your@email.com" required autocomplete="email" />
      <button type="submit" id="vsEmailBtn">Get Deals →</button>
    </form>
    <div class="vs-email-success" id="vsEmailSuccess">
      ✅ You're in — Spike will be in touch.
    </div>
  </div>
</div>

<footer id="vs-footer-inner">
  <div class="vs-footer-inner">
    <div class="vs-footer-top">
      <div class="vs-footer-brand">
        <a class="vs-footer-logo" href="/"><img src="/images/logo-pill-alt.png" alt="Vegas Sidekick" style="height:56px;width:auto;" /></a>
        <p class="vs-footer-tagline">Biggest Shows. Real Discounts. No BS.</p>
        <p class="vs-footer-tagline-sub">We live here. We know the shows. We tell you the truth.</p>
      </div>
      <div class="vs-footer-links">
        <div class="vs-footer-col">
          <div class="vs-footer-col-title">Shows</div>
          <a href="/shows/comedy/">Comedy</a>
          <a href="/shows/magic/">Magic</a>
          <a href="/shows/music/">Music</a>
          <a href="/shows/cirque/">Cirque &amp; Acrobatic</a>
          <a href="/shows/headliners/">Headliners</a>
        </div>
        <div class="vs-footer-col">
          <div class="vs-footer-col-title">More Shows</div>
          <a href="/shows/production/">Production</a>
          <a href="/shows/adult/">Adult Shows</a>
          <a href="/shows/tribute/">Tribute Acts</a>
          <a href="/shows/variety/">Variety</a>
          <a href="/search/">Search All Shows</a>
        </div>
        <div class="vs-footer-col">
          <div class="vs-footer-col-title">Vegas Sidekick</div>
          <a href="/news/">Vegas Dispatch</a>
          <a href="/about/">About Vegas Sidekick</a>
          <a href="/about/kris-kidd/">About Kris Kidd</a>
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
<style>
/* EMAIL BAR */
.vs-email-bar { background: linear-gradient(135deg, #0D1F3C 0%, #0A1628 60%, #12182a 100%); border-top: 3px solid #FF6B00; border-bottom: 1px solid rgba(255,107,0,0.15); padding: 28px 40px; position: relative; overflow: hidden; }
.vs-email-bar::after { content:''; position:absolute; top:0; right:0; width:320px; height:100%; background: radial-gradient(ellipse at right center, rgba(255,107,0,0.07) 0%, transparent 70%); pointer-events:none; }
.vs-email-bar-accent { display:none; }
.vs-email-bar-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 28px; flex-wrap: wrap; }
.vs-email-bar-left { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0; }
.vs-email-bar-spike { font-size: 2.2rem; flex-shrink: 0; line-height: 1; }
.vs-email-bar-text { display: flex; flex-direction: column; gap: 3px; }
.vs-email-bar-headline { font-family: 'Barlow Condensed', sans-serif; font-size: 1.25rem; font-weight: 800; color: #FFFFFF; letter-spacing: 0.5px; line-height: 1.15; }
.vs-email-bar-sub { font-size: 0.78rem; color: rgba(255,255,255,0.5); line-height: 1.4; }
.vs-email-form { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; flex-shrink: 0; }
.vs-email-form input { background: rgba(255,255,255,0.07); border: 1.5px solid rgba(255,255,255,0.15); border-radius: 7px; padding: 11px 16px; color: #FFFFFF; font-family: 'Barlow', sans-serif; font-size: 0.9rem; width: 240px; outline: none; transition: border-color 0.2s, background 0.2s; }
.vs-email-form input:focus { border-color: #FF6B00; background: rgba(255,255,255,0.1); }
.vs-email-form input::placeholder { color: rgba(255,255,255,0.35); }
.vs-email-form button { background: #FF6B00; color: #FFFFFF; font-family: 'Barlow Condensed', sans-serif; font-size: 0.95rem; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; padding: 11px 26px; border-radius: 7px; border: none; cursor: pointer; transition: background 0.2s, transform 0.15s; white-space: nowrap; box-shadow: 0 4px 14px rgba(255,107,0,0.35); }
.vs-email-form button:hover { background: #FF8C2A; transform: translateY(-1px); }
.vs-email-success { display: none; font-family: 'Barlow Condensed', sans-serif; font-size: 1rem; font-weight: 700; color: #4ade80; letter-spacing: 0.5px; }
.vs-email-success.visible { display: block; }

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
.vs-footer-col-title { font-family: 'Barlow Condensed', sans-serif; font-size: 0.72rem; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #FF6B00; margin-bottom: 4px; }
.vs-footer-col a { color: #A8B4C4; text-decoration: none; font-size: 0.85rem; font-family: 'Barlow', sans-serif; transition: color 0.2s; }
.vs-footer-col a:hover { color: #1A6BFF; }
.vs-footer-bottom { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.06); }
.vs-footer-copy { font-size: 0.78rem; color: #A8B4C4; font-family: 'Barlow', sans-serif; }
.vs-footer-disclosure { font-size: 0.72rem; color: rgba(168,180,196,0.5); max-width: 500px; text-align: right; line-height: 1.5; font-family: 'Barlow', sans-serif; }

@media (max-width: 900px) {
  .vs-email-bar { padding: 24px 20px; }
  .vs-email-bar-inner { flex-direction: column; align-items: flex-start; gap: 18px; }
  .vs-email-form input { width: 100%; }
  .vs-email-form { width: 100%; }
  .vs-email-form button { flex: 1; }
  #vs-footer-inner { padding: 40px 20px 32px; }
  .vs-footer-top { grid-template-columns: 1fr; gap: 32px; }
  .vs-footer-links { grid-template-columns: 1fr 1fr; gap: 24px; }
  .vs-footer-disclosure { text-align: left; }
}
@media (max-width: 480px) {
  .vs-footer-links { grid-template-columns: 1fr; }
}
</style>`;

  const target = document.getElementById('vs-footer');
  if (target) {
    target.innerHTML = styles + html;
  }

  window.vsSubmitEmail = async function(e) {
    e.preventDefault();
    const email = document.getElementById('vsEmailInput').value;
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
      form.style.display = 'none';
      success.classList.add('visible');
    } catch (err) {
      btn.textContent = 'Get Deals →';
      btn.disabled = false;
    }
  };
})();