import * as THREE from 'three';
import { curbOffset } from './spine.js';
import { mergeGeometries, scaleUV, bakeTransform } from './util.js';

/* ============================================================
   NEON DESERT · ZONES                                      🌵
   The pattern every future landmark uses: each property in
   strip-spine.json becomes a placeholder massing block (dark
   extruded volume, low emissive window grid) + a floating
   map-style wayfinding label. Both are merged into single draw
   calls — this file has no per-zone meshes, only per-zone data
   baked into one shared geometry each.
   ============================================================ */

const WINDOW_TILE = 7;      // world units per texture repeat
const LABEL_W = 11, LABEL_H = 2.6;
const LABEL_LIFT = 3.2;     // gap between block roof and label

function buildWindowTexture(){
  const cols = 8, rows = 16, cw = 16, ch = 16;
  const c = document.createElement('canvas'); c.width = cols*cw; c.height = rows*ch;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#050608'; ctx.fillRect(0,0,c.width,c.height);
  for (let r = 0; r < rows; r++){
    for (let col = 0; col < cols; col++){
      if (Math.random() > 0.32) continue; // mostly dark — LOW emissive reads
      ctx.fillStyle = Math.random() > 0.7 ? 'rgba(255,214,150,0.9)' : 'rgba(150,190,255,0.75)';
      ctx.fillRect(col*cw+3, r*ch+3, cw-7, ch-8);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function tintFor(seed){
  // deterministic-ish desaturated navy/steel tint per zone, so massing
  // reads as varied blocks rather than one flat slab
  const r = 0.06 + (seed % 5) * 0.012;
  const g = 0.07 + ((seed*3) % 5) * 0.012;
  const b = 0.10 + ((seed*7) % 5) * 0.015;
  return [r, g, b];
}

function addColor(geo, rgb){
  const n = geo.attributes.position.count;
  const arr = new Float32Array(n*3);
  for (let i = 0; i < n; i++){ arr[i*3]=rgb[0]; arr[i*3+1]=rgb[1]; arr[i*3+2]=rgb[2]; }
  geo.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return geo;
}

function massingBox(width, height, depth, position, tangent, rgb){
  const geo = new THREE.BoxGeometry(width, height, depth);
  scaleUV(geo, width/WINDOW_TILE, height/WINDOW_TILE);
  addColor(geo, rgb);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1,0,0), tangent);
  geo.applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(q));
  geo.translate(position.x, position.y, position.z);
  return geo;
}

async function buildLabelAtlas(zones){
  try {
    await Promise.race([
      document.fonts.load('500 32px "IBM Plex Mono"'),
      new Promise(r => setTimeout(r, 1500))
    ]);
  } catch(e){ /* system fallback is fine */ }

  const cols = 6, rows = Math.ceil(zones.length / cols);
  const cw = 320, ch = 96;
  const c = document.createElement('canvas'); c.width = cols*cw; c.height = rows*ch;
  const ctx = c.getContext('2d');
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '500 34px "IBM Plex Mono", ui-monospace, monospace';
  const rects = [];
  zones.forEach((z, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const cx = col*cw + cw/2, cy = row*ch + ch/2;
    ctx.fillStyle = 'rgba(180,196,232,0.82)';
    ctx.fillText(z.label || z.name.toUpperCase(), cx, cy, cw*0.92);
    rects.push({ u0: col/cols, v0: 1-(row+1)/rows, u1: (col+1)/cols, v1: 1-row/rows });
  });
  const tex = new THREE.CanvasTexture(c);
  return { tex, rects };
}

function labelQuad(rect, position, facingDir){
  const geo = new THREE.PlaneGeometry(LABEL_W, LABEL_H);
  const uv = geo.attributes.uv;
  uv.setXY(0, rect.u0, rect.v1); uv.setXY(1, rect.u1, rect.v1);
  uv.setXY(2, rect.u0, rect.v0); uv.setXY(3, rect.u1, rect.v0);
  uv.needsUpdate = true;
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), facingDir);
  return bakeTransform(geo, position, new THREE.Euler().setFromQuaternion(q).y, new THREE.Vector3(1,1,1));
}

/**
 * Builds every zone's massing block + label from strip-spine.json data.
 * `spine` is the object returned by buildSpine(). Zones flagged
 * `constructionSite` are skipped here — construction.js owns those.
 */
export async function buildZones({ scene, spine, data }){
  const curb = curbOffset(data);
  const massGeoms = [];
  const windowTex = buildWindowTexture();

  data.zones.forEach((z, i) => {
    const [s, e] = z.spineRange;
    const center = (s + e) / 2;
    const width = e - s;
    let depth = z.footprint.depth, height = z.footprint.height;
    let lateral = curb + depth/2;

    if (z.reserve === 'fountain-lake' || z.reserve === 'eiffel-tower'){
      // leave the frontage strip empty for the future water/landmark phase
      lateral += 45;
    }

    const { position, frame } = spine.place(center, z.side, lateral, height/2);
    if (z.constructionSite) return; // construction.js builds these

    massGeoms.push(massingBox(width*0.92, height, depth, position, frame.tangent, tintFor(i)));

    if (z.id === 'park-mgm'){
      // T-Mobile Arena set behind the property — cheap secondary hint block
      const arenaPos = spine.place(center, z.side, lateral + depth*0.5 + 55, 26).position;
      massGeoms.push(massingBox(width*0.7, 52, 70, arenaPos, frame.tangent, [0.05,0.06,0.08]));
    }
    if (z.id === 'the-linq'){
      // High Roller wheel — Phase 1-quality asset arrives later; flat ring for now
      const ringPos = spine.place(center, z.side, lateral + depth*0.5 + 70, 55).position;
      const ring = new THREE.TorusGeometry(48, 1.4, 8, 48);
      ring.rotateY(Math.PI/2);
      ring.translate(ringPos.x, ringPos.y, ringPos.z);
      addColor(ring, [0.08,0.09,0.12]);
      const uvAttr = ring.attributes.uv;
      for (let k=0;k<uvAttr.count;k++) uvAttr.setXY(k, uvAttr.getX(k)*4, uvAttr.getY(k));
      massGeoms.push(ring);
    }
  });

  const massMat = new THREE.MeshStandardMaterial({
    vertexColors: true, emissiveMap: windowTex, emissive: 0xffffff,
    emissiveIntensity: 0.55, roughness: 0.85, metalness: 0.1
  });
  const massMesh = new THREE.Mesh(mergeGeometries(massGeoms), massMat);
  scene.add(massMesh);

  /* ---------- labels ---------- */
  const { tex, rects } = await buildLabelAtlas(data.zones);
  const labelGeoms = data.zones.map((z, i) => {
    const [s, e] = z.spineRange;
    const center = (s + e) / 2;
    const lateral = curb - 2.5; // hover just inside the sidewalk, facing the road
    const height = (z.footprint.height || 60) + LABEL_LIFT;
    const { position, frame } = spine.place(center, z.side, lateral, Math.min(height, 34));
    const facing = z.side === 'east' ? frame.right.clone().negate() : frame.right.clone();
    return labelQuad(rects[i], position, facing);
  });
  const labelMat = new THREE.MeshBasicMaterial({
    map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide
  });
  const labelMesh = new THREE.Mesh(mergeGeometries(labelGeoms), labelMat);
  labelMesh.renderOrder = 2;
  scene.add(labelMesh);

  return { massMesh, labelMesh };
}
