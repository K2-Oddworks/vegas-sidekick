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
@keyframes vsEmailPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(255,107,0,0.5); } 50% { box-shadow: 0 0 0 10px rgba(255,107,0,0); } }
.vs-email-bar { background: linear-gradient(135deg, #FF6B00 0%, #D94F00 40%, #B83E00 100%); padding: 52px 40px; position: relative; overflow: hidden; }
.vs-email-bar::before { content:''; position:absolute; top:0; left:0; right:0; bottom:0; background: radial-gradient(ellipse at 80% 50%, rgba(255,200,80,0.18) 0%, transparent 60%), radial-gradient(ellipse at 20% 50%, rgba(0,0,0,0.2) 0%, transparent 60%); pointer-events:none; }
.vs-email-bar::after { content:''; position:absolute; bottom:-2px; left:0; right:0; height:4px; background: linear-gradient(90deg, #FFB347, #FF6B00, #FF4500, #FF6B00, #FFB347); background-size: 300% 100%; animation: vsEmailPulse 2.5s ease infinite; pointer-events:none; }
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
.vs-footer-col-title { font-family: 'Barlow Condensed', sans-serif; font-size: 0.72rem; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #FF6B00; margin-bottom: 4px; }
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