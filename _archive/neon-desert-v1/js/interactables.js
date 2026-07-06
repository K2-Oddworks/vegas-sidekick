import * as THREE from 'three';

/* ============================================================
   NEON DESERT · INTERACTABLES REGISTRY                      🌵
   Central list any customizable object can register into:
   { id, worldPosition, label, options[], get(), onSelect() }.
   Each entry renders as a small pulsing orange diamond (brand
   #FF6B2B) anchored at its worldPosition, with a slow bob, a
   soft brightness pulse, and a few tiny orbiting sparks — a
   "touch me" affordance with zero explanation. Tapping it hands
   the interactable back to the caller, which opens the pill menu
   built here. The bulb-mode control is the first entry — see
   main.js.
   ============================================================ */

const DIAMOND_COLOR = '#FF6B2B';

const BASE_SCALE = 0.5;    // true world size — small, ~half a meter
const MIN_SCALE = 0.5;
const MAX_SCALE = 1.6;     // clamp so it never dominates the frame up close
const DIST_SCALE_FACTOR = 0.05; // grows with distance so it stays legible from afar
const FADE_START = 45;
const FADE_END = 60;
const BOB_AMPLITUDE = 0.12;
const BOB_SPEED = 1.1;
const HIT_PADDING_PX = 32; // generous screen-space tap radius beyond the visual
const SPARK_COUNT = 3;
const SPARK_ORBIT_SPEED = 1.7;

function buildDiamondTexture(){
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const ctx = c.getContext('2d');
  ctx.translate(32, 32);
  ctx.rotate(Math.PI / 4);
  ctx.shadowColor = DIAMOND_COLOR;
  ctx.shadowBlur = 16;
  ctx.fillStyle = DIAMOND_COLOR;
  ctx.fillRect(-15, -15, 30, 30);
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 2;
  ctx.strokeRect(-15, -15, 30, 30);
  return new THREE.CanvasTexture(c);
}

function buildSparkTexture(){
  const c = document.createElement('canvas'); c.width = c.height = 32;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(16,16,0,16,16,16);
  g.addColorStop(0, 'rgba(255,224,180,1)');
  g.addColorStop(0.5, 'rgba(255,170,90,0.55)');
  g.addColorStop(1, 'rgba(255,140,60,0)');
  ctx.fillStyle = g; ctx.fillRect(0,0,32,32);
  return new THREE.CanvasTexture(c);
}

export function createInteractablesRegistry({ scene }){
  const items = [];
  const group = new THREE.Group();
  scene.add(group);
  const diamondTex = buildDiamondTexture();
  const sparkTex = buildSparkTexture();

  function register(item){
    const mat = new THREE.SpriteMaterial({ map: diamondTex, transparent: true, depthTest: false, depthWrite: false });
    const sprite = new THREE.Sprite(mat);
    sprite.position.copy(item.worldPosition);
    sprite.scale.setScalar(BASE_SCALE);
    sprite.renderOrder = 6;
    group.add(sprite);

    // 2-3 tiny orbiting spark points — cheap Sprites (skipped by the bloom
    // pass's material swap just like the diamond, so they feed bloom for
    // free without any alwaysGlow/glowSwap wiring)
    const sparks = [];
    for (let i = 0; i < SPARK_COUNT; i++){
      const sMat = new THREE.SpriteMaterial({ map: sparkTex, transparent: true, depthTest: false, depthWrite: false });
      const sprk = new THREE.Sprite(sMat);
      sprk.renderOrder = 6;
      group.add(sprk);
      sparks.push({ sprite: sprk, phase: (i / SPARK_COUNT) * Math.PI * 2 + i * 0.6 });
    }

    const entry = { ...item, sprite, sparks };
    items.push(entry);
    return entry;
  }

  function update(t, camera){
    items.forEach((it, i) => {
      const dist = camera.position.distanceTo(it.worldPosition);
      const fade = dist <= FADE_START ? 1 : dist >= FADE_END ? 0 : 1 - (dist - FADE_START) / (FADE_END - FADE_START);
      const visible = fade > 0.01;
      it.sprite.visible = visible;
      it.sparks.forEach(s => { s.sprite.visible = visible; });
      if (!visible) return;

      const bob = Math.sin(t * BOB_SPEED + i * 1.3) * BOB_AMPLITUDE;
      it.sprite.position.set(it.worldPosition.x, it.worldPosition.y + bob, it.worldPosition.z);

      const pulse = 1 + Math.sin(t * 2.4 + i * 1.7) * 0.12;
      const distScale = THREE.MathUtils.clamp(dist * DIST_SCALE_FACTOR, MIN_SCALE, MAX_SCALE);
      const scale = distScale * pulse;
      it.sprite.scale.setScalar(scale);
      it.sprite.material.opacity = fade;

      const brightPulse = 0.85 + Math.sin(t * 3.1 + i * 0.7) * 0.15;
      it.sprite.material.color.setScalar(brightPulse);

      it.sparks.forEach((s, si) => {
        const angle = t * SPARK_ORBIT_SPEED + s.phase;
        const orbitR = scale * 0.85;
        s.sprite.position.set(
          it.sprite.position.x + Math.cos(angle) * orbitR,
          it.sprite.position.y + Math.sin(angle * 1.3) * orbitR * 0.45,
          it.sprite.position.z + Math.sin(angle) * orbitR
        );
        s.sprite.scale.setScalar(scale * 0.16);
        s.sprite.material.opacity = fade * (0.5 + Math.sin(t * 4 + si) * 0.3);
      });
    });
  }

  // Screen-space hit test with generous padding beyond the visual sprite —
  // simpler and more reliably "generous" than tuning a 3D raycaster
  // threshold against a sprite that's deliberately kept small.
  function hitTestScreen(camera, screenX, screenY, viewW, viewH, paddingPx = HIT_PADDING_PX){
    let best = null, bestDist = Infinity;
    items.forEach(it => {
      if (!it.sprite.visible) return;
      const v = it.sprite.position.clone().project(camera);
      if (v.z > 1 || v.z < -1) return; // behind camera or outside clip range
      const sx = (v.x * 0.5 + 0.5) * viewW;
      const sy = (1 - (v.y * 0.5 + 0.5)) * viewH;
      const d = Math.hypot(sx - screenX, sy - screenY);
      if (d < paddingPx && d < bestDist){ bestDist = d; best = it; }
    });
    return best;
  }

  return { register, update, hitTestScreen, group };
}

/** Minimal HTML pill menu for an interactable's options, anchored at a screen point. */
export function createInteractableMenu(){
  const el = document.createElement('div');
  el.id = 'interactableMenu';
  Object.assign(el.style, {
    position: 'fixed', zIndex: 40, display: 'none', flexDirection: 'column', gap: '6px',
    transform: 'translate(-50%, -100%)',
    background: 'rgba(10,15,44,.92)', backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,107,43,.45)', borderRadius: '14px', padding: '8px'
  });
  document.body.appendChild(el);

  function close(){ el.style.display = 'none'; el.innerHTML = ''; }

  function open(interactable, x, y){
    el.innerHTML = '';
    el.style.display = 'flex';
    el.style.left = x + 'px';
    el.style.top = (y - 14) + 'px';

    const title = document.createElement('div');
    title.textContent = interactable.label;
    Object.assign(title.style, {
      font: '500 10px/1 "IBM Plex Mono",ui-monospace,monospace', letterSpacing: '.12em',
      color: 'rgba(180,195,255,.6)', textTransform: 'uppercase', padding: '2px 8px 4px'
    });
    el.appendChild(title);

    interactable.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.textContent = opt;
      const active = opt === interactable.get();
      Object.assign(btn.style, {
        appearance: 'none', border: '1px solid rgba(80,110,220,.35)',
        background: active ? 'rgba(255,107,43,.28)' : 'rgba(10,15,44,.4)',
        color: '#D9E1FF', font: '500 11px/1 "IBM Plex Mono",ui-monospace,monospace',
        letterSpacing: '.08em', textTransform: 'uppercase',
        padding: '9px 14px', borderRadius: '999px', cursor: 'pointer', whiteSpace: 'nowrap'
      });
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        interactable.onSelect(opt);
        close();
      });
      el.appendChild(btn);
    });
  }

  addEventListener('pointerdown', e => {
    if (el.style.display !== 'none' && !el.contains(e.target)) close();
  });

  return { open, close };
}
