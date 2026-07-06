import * as THREE from 'three';
import { mergeGeometries, bakeTransform } from './util.js';

/* ============================================================
   NEON DESERT · SKYLINE RING                                🌵
   Distant low-poly silhouettes for depth only — no detail, but
   never a flat black cutout either. The Sphere reads as a lit
   LED-panel orb behind the Venetian; everything else is a dim,
   window-flecked tower silhouette.
   ============================================================ */

function sphereLedTexture(){
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(128,150,10,128,128,150);
  g.addColorStop(0, '#6fbfff');
  g.addColorStop(0.55, '#3a6fd8');
  g.addColorStop(1, '#14204a');
  ctx.fillStyle = g; ctx.fillRect(0,0,256,256);
  const cols = 24, rows = 24, cw = 256/cols, ch = 256/rows;
  for (let r = 0; r < rows; r++){
    for (let col = 0; col < cols; col++){
      if (Math.random() > 0.45) continue;
      const warm = Math.random() > 0.6;
      ctx.fillStyle = warm ? 'rgba(255,205,140,0.55)' : 'rgba(220,235,255,0.4)';
      ctx.fillRect(col*cw, r*ch, cw*0.85, ch*0.85);
    }
  }
  return new THREE.CanvasTexture(c);
}

function distantWindowTexture(){
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#0c1424'; ctx.fillRect(0,0,64,64);
  for (let i = 0; i < 90; i++){
    ctx.fillStyle = Math.random() > 0.65 ? 'rgba(255,206,140,0.85)' : 'rgba(160,195,255,0.7)';
    ctx.fillRect(Math.random()*62, Math.random()*62, 1.4, 1.4);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(2, 6);
  return t;
}

export function buildSkyline({ scene, spine, data }){
  const towerGeoms = [];
  let sphereMesh = null;

  (data.skyline || []).forEach(s => {
    const { position } = spine.place(s.spinePosition, s.side, s.lateralOffset, 0);
    if (s.type === 'sphere-orb'){
      const geo = new THREE.SphereGeometry(34, 24, 18);
      const mat = new THREE.MeshBasicMaterial({ map: sphereLedTexture(), transparent: true, opacity: 0.92 });
      sphereMesh = new THREE.Mesh(geo, mat);
      sphereMesh.position.set(position.x, 34, position.z);
      sphereMesh.userData.id = s.id;
      scene.add(sphereMesh);
      return;
    }
    const h = 90 + Math.random()*70;
    const geo = new THREE.BoxGeometry(18 + Math.random()*10, h, 18 + Math.random()*10);
    towerGeoms.push(bakeTransform(geo, new THREE.Vector3(position.x, h/2, position.z), Math.random()*Math.PI));
  });

  const towersMesh = towerGeoms.length
    ? new THREE.Mesh(mergeGeometries(towerGeoms), new THREE.MeshBasicMaterial({ color: 0x2a3550, map: distantWindowTexture() }))
    : null;
  if (towersMesh) scene.add(towersMesh);

  return { towersMesh, sphereMesh };
}
