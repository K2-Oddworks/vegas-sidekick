// Vegas Sidekick — Header Component
// Drop <div id="vs-header"></div> at top of body + <script src="/components/header.js"></script>
(function() {
  const html = `
<nav id="vs-nav">
  <canvas id="vs-logo-orbs" style="position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:0;"></canvas>
  <a class="nav-logo" href="/" style="position:relative;z-index:1;display:flex;align-items:center;text-decoration:none;"><img src="data:image/webp;base64,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" alt="" style="height:80px;width:auto;margin-right:8px;flex-shrink:0;"><span class="vs-logo-text"><span class="vs-lv">VEGAS</span><span class="vs-ls">SIDEKICK</span></span></a>
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
.nav-logo { display: flex !important; align-items: center; } .vs-logo-text { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 2.1rem; letter-spacing: .03em; text-transform: uppercase; line-height: 1; white-space: nowrap; } .vs-lv { color: #1A6BFF; } .vs-ls { color: #FF6B2B; }
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
  .nav-logo img { height: 54px !important; } .vs-logo-text { font-size: 1.5rem; }
  .nav-links { display: none; }
  .nav-mobile-right { display: flex; }
  .nav-mobile-menu { display: block; }
  .nav-mobile-drawer { display: flex; }
}
#vs-memorial-banner { display: none; position: fixed; top: 84px; left: 0; right: 0; z-index: 199; background: linear-gradient(100deg, #050B18 0%, #0F3E9E 55%, #4D90F0 100%); box-shadow: 0 2px 14px rgba(0,0,0,0.4); overflow: visible; }
#vs-memorial-banner.vsm-visible { display: block; }
#vs-memorial-banner .vsm-clip { position: relative; overflow: hidden; padding: 8px 16px; }
#vs-memorial-banner .vsm-canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }
#vs-memorial-banner .vsm-inner { position: relative; z-index: 2; display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: nowrap; white-space: nowrap; font-family: 'Barlow Condensed', 'Barlow', sans-serif; font-weight: 800; font-size: 0.86rem; letter-spacing: 0.3px; text-transform: uppercase; color: #fff; }
#vs-memorial-banner .vsm-text { -webkit-text-stroke: 0.6px rgba(0,0,0,0.6); text-shadow: 0 1px 3px rgba(0,0,0,0.4); overflow: hidden; text-overflow: ellipsis; }
#vs-memorial-banner .vsm-icon { display: inline-block; flex-shrink: 0; font-size: 1.2em; line-height: 1; animation: vsmBob 2.4s ease-in-out infinite; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.45)); }
#vs-memorial-banner .vsm-icon.vsm-icon-2 { animation-delay: 1.1s; }
@keyframes vsmBob { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-3px) rotate(-6deg); } }
#vs-memorial-banner .vsm-btn { display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0; background: #FF6B2B; color: #0A1628; text-decoration: none; font-weight: 800; letter-spacing: 0.05em; padding: 5px 15px; border-radius: 100px; font-size: 0.82rem; white-space: nowrap; border: 2px solid rgba(255,255,255,0.9); box-shadow: 0 2px 8px rgba(0,0,0,0.3); transition: background 0.2s, transform 0.2s; }
#vs-memorial-banner .vsm-btn:hover { background: #ff7d40; transform: translateY(-1px); }

/* Floating Spike sprite */
#vs-memorial-banner .vsm-spike { position: absolute; top: 50%; left: -60px; width: 32px; height: 32px; transform: translateY(-50%); background: transparent; border: none; padding: 0; cursor: pointer; z-index: 3; animation: vsmSpikeDrift 16s linear infinite; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35)); }
#vs-memorial-banner .vsm-spike img { width: 100%; height: 100%; display: block; }
#vs-memorial-banner .vsm-spike:hover, #vs-memorial-banner .vsm-spike.vsm-paused { animation-play-state: paused; }
@keyframes vsmSpikeDrift {
  0%   { left: -60px; transform: translateY(-50%) rotate(0deg); }
  50%  { transform: translateY(-68%) rotate(8deg); }
  100% { left: calc(100% + 60px); transform: translateY(-50%) rotate(0deg); }
}

/* Spike email popover */
#vs-memorial-banner .vsm-popover { display: none; position: absolute; top: 100%; right: 16px; margin-top: 8px; background: #0A1628; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 16px; width: 250px; box-shadow: 0 14px 34px rgba(0,0,0,0.45); z-index: 250; text-align: left; text-transform: none; letter-spacing: normal; }
#vs-memorial-banner .vsm-popover.vsm-pop-open { display: block; }
#vs-memorial-banner .vsm-pop-close { position: absolute; top: 8px; right: 10px; background: none; border: none; color: rgba(255,255,255,0.5); font-size: 1.1rem; line-height: 1; cursor: pointer; padding: 2px; }
#vs-memorial-banner .vsm-pop-close:hover { color: #fff; }
#vs-memorial-banner .vsm-pop-msg { font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 0.82rem; color: #fff; margin-bottom: 10px; padding-right: 14px; -webkit-text-stroke: 0; text-shadow: none; }
#vs-memorial-banner .vsm-pop-form { display: flex; flex-direction: column; gap: 8px; }
#vs-memorial-banner .vsm-pop-form input { font-family: 'Barlow', sans-serif; font-size: 0.8rem; padding: 8px 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.06); color: #fff; }
#vs-memorial-banner .vsm-pop-form input::placeholder { color: rgba(255,255,255,0.4); }
#vs-memorial-banner .vsm-pop-form button { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 0.78rem; letter-spacing: 0.05em; text-transform: uppercase; background: #FF6B2B; color: #0A1628; border: none; border-radius: 6px; padding: 8px; cursor: pointer; transition: background 0.2s; }
#vs-memorial-banner .vsm-pop-form button:hover { background: #ff7d40; }
#vs-memorial-banner .vsm-pop-success { display: none; font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 0.82rem; color: #4ade80; -webkit-text-stroke: 0; text-shadow: none; }
#vs-memorial-banner .vsm-pop-success.vsm-show { display: block; }

@media (prefers-reduced-motion: reduce) { #vs-memorial-banner .vsm-icon, #vs-memorial-banner .vsm-spike { animation: none; } }
@media (max-width: 900px) { #vs-memorial-banner .vsm-clip { padding: 7px 10px; } #vs-memorial-banner .vsm-inner { font-size: 0.72rem; gap: 7px; } #vs-memorial-banner .vsm-btn { font-size: 0.72rem; padding: 4px 12px; } #vs-memorial-banner .vsm-spike { width: 26px; height: 26px; } }
@media (max-width: 480px) { #vs-memorial-banner .vsm-inner { font-size: 0.62rem; gap: 5px; } #vs-memorial-banner .vsm-text { max-width: 44vw; } #vs-memorial-banner .vsm-btn { padding: 4px 10px; font-size: 0.62rem; } #vs-memorial-banner .vsm-popover { right: 8px; width: 210px; } }
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
  // Favicon — set once, applies to every page via this component
  (function() {
    var existing = document.querySelector("link[rel*='icon']");
    if (existing) existing.parentNode.removeChild(existing);
    var link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = 'data:image/png;base64,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';
    document.head.appendChild(link);
  })();
  // Orb particles — bright intro on first session visit, fades to subtle on subsequent pages
  (function() {
    var canvas = document.getElementById('vs-logo-orbs');
    if (!canvas) return;
    var nav = document.getElementById('vs-nav');
    function resize() {
      canvas.width  = nav.offsetWidth  || 1200;
      canvas.height = nav.offsetHeight || 84;
    }
    resize();
    // sessionStorage: first visit this session gets bright intro, all other pages skip it
    var firstVisit = !sessionStorage.getItem('vsOrbs');
    sessionStorage.setItem('vsOrbs', '1');
    var introStart = firstVisit ? Date.now() : null;
    var HOLD = 1500;  // ms to hold bright before fading
    var FADE = 2000;  // ms to fade down to soft
    var cols = ['#1A6BFF','#FF6B2B','#3B7FFF','#FF8040'];
    var orbs = [];
    for (var i = 0; i < 4; i++) {
      var xMax = (canvas.width || 1200) * 0.34;
      var softOp = 0.13 + Math.random() * 0.12;
      orbs.push({
        x: Math.random() * xMax, y: Math.random() * canvas.height,
        r: 18 + Math.random() * 10,
        color: cols[i % cols.length],
        vx: (Math.random() - 0.5) * 0.21,
        vy: -0.15 - Math.random() * 0.21,
        op: firstVisit ? 0.55 : softOp,
        softOp: softOp,
        xMax: xMax
      });
    }
    var ctx = canvas.getContext('2d');
    function frame() {
      if (introStart) {
        var el = Date.now() - introStart;
        if (el >= HOLD + FADE) {
          for (var j = 0; j < orbs.length; j++) orbs[j].op = orbs[j].softOp;
          introStart = null;
        } else if (el >= HOLD) {
          var t = (el - HOLD) / FADE;
          t = t * t * (3 - 2 * t); // smooth-step easing
          for (var j = 0; j < orbs.length; j++)
            orbs[j].op = 0.55 + (orbs[j].softOp - 0.55) * t;
        }
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < orbs.length; i++) {
        var o = orbs[i];
        var g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, o.color); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.save(); ctx.globalAlpha = o.op; ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        o.x += o.vx; o.y += o.vy;
        if (o.y < -o.r * 2) { o.y = canvas.height + o.r; o.x = Math.random() * o.xMax; }
        if (o.x < 0) o.x = o.xMax;
        if (o.x > o.xMax) o.x = 0;
      }
      requestAnimationFrame(frame);
    }
    frame();
  })();


  window.vsToggleMenu = function() {
    const drawer = document.getElementById('vsMobileDrawer');
    const overlay = document.getElementById('vsNavOverlay');
    drawer.classList.toggle('open');
    overlay.classList.toggle('visible');
  };

  // Labor Day Weekend Advance Notice (PDT = UTC-7)
  // Shows through end of Labor Day 2026 (Mon Sept 7) — hides after midnight PDT Sept 8 (= 2026-09-08T07:00:00Z)
  (function() {
    var banner = document.getElementById('vs-memorial-banner');
    if (!banner) return;
    var EXPIRE = new Date('2026-09-08T07:00:00Z'); // midnight PDT end of Labor Day
    var SPIKE_URL = 'data:image/png;base64,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';

    function applyBodyOffset() {
      requestAnimationFrame(function() {
        var bh = banner.offsetHeight;
        if (bh > 0) {
          var orig = parseFloat(window.getComputedStyle(document.body).paddingTop) || 0;
          document.body.setAttribute('data-vsm-orig-pt', orig);
          document.body.style.setProperty('padding-top', (orig + bh) + 'px', 'important');
        }
      });
    }

    var now = new Date();
    if (now >= EXPIRE) return;

    banner.innerHTML =
      '<div class="vsm-clip">' +
        '<canvas class="vsm-canvas" id="vsmCanvas"></canvas>' +
        '<div class="vsm-inner">' +
          '<span class="vsm-icon">🧳</span>' +
          '<span class="vsm-text">Labor Day Weekend is coming and many shows sell out early. Be smart and book ahead.</span>' +
          '<span class="vsm-icon vsm-icon-2">🌵</span>' +
          '<a class="vsm-btn" href="/shows/">All Shows &#8594;</a>' +
        '</div>' +
      '</div>' +
      '<button class="vsm-spike" id="vsmSpike" aria-label="Say hi to Spike"><img src="' + SPIKE_URL + '" alt="Spike the cactus"></button>' +
      '<div class="vsm-popover" id="vsmPopover">' +
        '<button class="vsm-pop-close" id="vsmPopClose" aria-label="Close">&times;</button>' +
        '<div class="vsm-pop-msg" id="vsmPopMsg">&#127942; Psst — want Vegas deals before everyone else?</div>' +
        '<form class="vsm-pop-form" id="vsmPopForm">' +
          '<input type="email" id="vsmPopEmail" placeholder="you@email.com" required autocomplete="email">' +
          '<button type="submit">Join Spike\'s List</button>' +
        '</form>' +
        '<div class="vsm-pop-success" id="vsmPopSuccess">You\'re in — Spike says welcome! &#127796;</div>' +
      '</div>';
    banner.classList.add('vsm-visible');
    applyBodyOffset();

    // Drifting orange flare/bubble canvas
    (function() {
      var canvas = document.getElementById('vsmCanvas');
      var clip = banner.querySelector('.vsm-clip');
      if (!canvas || !clip) return;
      function resize() {
        canvas.width = clip.offsetWidth || 1200;
        canvas.height = clip.offsetHeight || 50;
      }
      resize();
      window.addEventListener('resize', resize);
      var cols = ['#FF6B2B', '#FFA35C', '#FF8C42'];
      var flares = [];
      for (var i = 0; i < 5; i++) {
        flares.push({
          x: Math.random() * (canvas.width || 1200),
          y: Math.random() * (canvas.height || 50),
          r: 6 + Math.random() * 10,
          color: cols[i % cols.length],
          vx: 0.12 + Math.random() * 0.18,
          op: 0.14 + Math.random() * 0.16
        });
      }
      var ctx = canvas.getContext('2d');
      function frame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < flares.length; i++) {
          var f = flares[i];
          var g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
          g.addColorStop(0, f.color);
          g.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.save();
          ctx.globalAlpha = f.op;
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          f.x += f.vx;
          if (f.x - f.r > canvas.width) {
            f.x = -f.r;
            f.y = Math.random() * canvas.height;
          }
        }
        requestAnimationFrame(frame);
      }
      frame();
    })();

    // Spike click-to-email popover
    (function() {
      var spike = document.getElementById('vsmSpike');
      var popover = document.getElementById('vsmPopover');
      var closeBtn = document.getElementById('vsmPopClose');
      var form = document.getElementById('vsmPopForm');
      if (!spike || !popover) return;

      function openPop() {
        popover.classList.add('vsm-pop-open');
        spike.classList.add('vsm-paused');
      }
      function closePop() {
        popover.classList.remove('vsm-pop-open');
        spike.classList.remove('vsm-paused');
      }
      spike.addEventListener('click', function(e) {
        e.preventDefault();
        if (popover.classList.contains('vsm-pop-open')) { closePop(); } else { openPop(); }
      });
      closeBtn.addEventListener('click', closePop);

      form.addEventListener('submit', function(e) {
        e.preventDefault();
        var email = document.getElementById('vsmPopEmail').value.trim();
        if (!email || !email.includes('@')) return;
        var btn = form.querySelector('button');
        btn.disabled = true;
        btn.textContent = '...';
        fetch('https://brevo-subscribe.vegassidekickcom.workers.dev', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email })
        }).catch(function() {}).then(function() {
          form.style.display = 'none';
          document.getElementById('vsmPopMsg').style.display = 'none';
          document.getElementById('vsmPopSuccess').classList.add('vsm-show');
          setTimeout(closePop, 2600);
        });
      });
    })();
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
