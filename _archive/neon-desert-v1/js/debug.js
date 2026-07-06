/* ============================================================
   NEON DESERT · DEBUG HUD                                   🌵
   FPS + draw-call meter, only ever built when ?debug=1 is on
   the URL — invisible overhead otherwise.
   ============================================================ */

export function createDebugHud({ renderer }){
  const enabled = new URLSearchParams(location.search).get('debug') === '1';
  if (!enabled) return { update(){} };

  const el = document.createElement('div');
  Object.assign(el.style, {
    position: 'fixed', top: '10px', right: '10px', zIndex: 30,
    font: '11px/1.5 "IBM Plex Mono", ui-monospace, monospace',
    color: '#5CFFB0', background: 'rgba(4,6,14,0.72)', padding: '8px 11px',
    borderRadius: '8px', pointerEvents: 'none', whiteSpace: 'pre'
  });
  document.body.appendChild(el);

  let frames = 0, last = performance.now(), fps = 0;
  return {
    update(){
      frames++;
      const now = performance.now();
      if (now - last >= 500){ fps = Math.round(frames*1000/(now-last)); frames = 0; last = now; }
      const info = renderer.info.render;
      el.textContent = `FPS ${fps}\ndraw calls ${info.calls}\ntriangles ${info.triangles}`;
    }
  };
}
