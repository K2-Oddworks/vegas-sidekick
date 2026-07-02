import * as THREE from 'three';

/* ============================================================
   NEON DESERT · INTERACTABLES REGISTRY                      🌵
   Central list any customizable object can register into:
   { id, worldPosition, label, options[], get(), onSelect() }.
   Each entry renders as a small pulsing orange diamond (brand
   #FF6B2B) floating near its object; tapping it hands the
   interactable back to the caller, which opens the pill menu
   built here. The bulb-mode control is the first entry — see
   main.js.
   ============================================================ */

const DIAMOND_COLOR = '#FF6B2B';

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

export function createInteractablesRegistry({ scene }){
  const items = [];
  const group = new THREE.Group();
  scene.add(group);
  const tex = buildDiamondTexture();

  function register(item){
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false });
    const sprite = new THREE.Sprite(mat);
    sprite.position.copy(item.worldPosition);
    sprite.scale.setScalar(1.4);
    sprite.renderOrder = 6;
    group.add(sprite);
    const entry = { ...item, sprite };
    items.push(entry);
    return entry;
  }

  function update(t){
    items.forEach((it, i) => {
      const pulse = 1.2 + Math.sin(t * 2.4 + i * 1.7) * 0.22;
      it.sprite.scale.setScalar(pulse);
    });
  }

  function hitTest(raycaster){
    const hits = raycaster.intersectObjects(group.children, false);
    if (!hits.length) return null;
    return items.find(it => it.sprite === hits[0].object) || null;
  }

  return { register, update, hitTest, group };
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
