import * as THREE from 'three';
import { curbOffset } from './spine.js';
import { mergeGeometries, scaleUV, bakeTransform } from './util.js';

/* ============================================================
   NEON DESERT · ZONES                                      🌵
   The pattern every future landmark uses: each property in
   strip-spine.json becomes a placeholder massing block — now a
   podium + setback tower, not a single monolith slab — with a
   dense emissive window grid, a bright street-level glow band
   standing in for its porte-cochère/marquee, and a floating
   map-style wayfinding label. Everything is baked into a small,
   fixed number of merged draw calls (three warmth "buckets" +
   one glow band + one label mesh), never one mesh per zone.
   ============================================================ */

const WINDOW_TILE = 6;      // world units per texture repeat
const LABEL_W = 11, LABEL_H = 2.6;
const LABEL_LIFT = 3.2;     // gap between block roof and label

const APRON = 16;                // setback gap between curb and property frontage
const WIDTH_FACTOR = 0.74;       // shrinks footprints so neighboring zones show open sky
const PODIUM_FRACTION = 0.34;    // podium height as a fraction of total envelope height
const TOWER_WIDTH_FACTOR = 0.6;
const TOWER_DEPTH_FACTOR = 0.68;
const WARM_BIAS = [0.15, 0.5, 0.85]; // per-bucket window warmth, so towers vary building to building

function buildWindowTexture(warmBias){
  const cols = 10, rows = 22, cw = 14, ch = 13;
  const c = document.createElement('canvas'); c.width = cols*cw; c.height = rows*ch;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#04050a'; ctx.fillRect(0,0,c.width,c.height);
  for (let r = 0; r < rows; r++){
    for (let col = 0; col < cols; col++){
      if (Math.random() > 0.58) continue; // ~58% lit — dense enough to read as a wall of
                                           // light without blowing every pixel to solid white
      const warm = Math.random() < (0.35 + warmBias*0.5);
      const bright = 0.6 + Math.random()*0.4;
      const [r0,g0,b0] = warm ? [255,196,120] : [150,190,255];
      ctx.fillStyle = `rgba(${(r0*bright)|0},${(g0*bright)|0},${(b0*bright)|0},0.95)`;
      ctx.fillRect(col*cw+2, r*ch+2, cw-4, ch-4);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8; // building walls are seen at shallow angles down the corridor too
  return tex;
}

function tintFor(seed){
  // deterministic-ish desaturated navy/steel tint per zone, so massing
  // reads as varied blocks rather than one flat slab. Bright enough to
  // catch the low night ambient without the emissive windows doing all
  // the work.
  const r = 0.10 + (seed % 5) * 0.018;
  const g = 0.12 + ((seed*3) % 5) * 0.018;
  const b = 0.17 + ((seed*7) % 5) * 0.022;
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
  const buckets = WARM_BIAS.map(bias => ({ bias, geoms: [], tex: buildWindowTexture(bias) }));
  const glowBandGeoms = [];
  const extraGlowPairs = []; // standalone meshes (e.g. the wheel) that need their own bloom variant

  data.zones.forEach((z, i) => {
    const [s, e] = z.spineRange;
    const center = (s + e) / 2;
    const width = e - s;
    let depth = z.footprint.depth, height = z.footprint.height;
    let lateral = curb + APRON + depth/2;

    if (z.reserve === 'fountain-lake' || z.reserve === 'eiffel-tower'){
      // leave the frontage strip empty for the future water/landmark phase
      lateral += 45;
    }

    if (z.constructionSite) return; // construction.js builds these
    if (z.id === 'luxor') return;   // landmarks/luxor.js builds this hero landmark instead

    const frame = spine.frameAt(center);
    const bucket = buckets[i % buckets.length];

    const podiumWidth = width * WIDTH_FACTOR;
    const podiumHeight = Math.max(16, height * PODIUM_FRACTION);
    const towerWidth = podiumWidth * TOWER_WIDTH_FACTOR;
    const towerHeight = Math.max(10, height - podiumHeight);
    const towerDepth = depth * TOWER_DEPTH_FACTOR;

    const podiumPos = spine.place(center, z.side, lateral, podiumHeight/2).position;
    const towerPos = spine.place(center, z.side, lateral, podiumHeight + towerHeight/2).position;
    const baseRGB = tintFor(i);
    const towerRGB = baseRGB.map(c => Math.min(1, c*1.18));

    bucket.geoms.push(massingBox(podiumWidth, podiumHeight, depth, podiumPos, frame.tangent, baseRGB));
    bucket.geoms.push(massingBox(towerWidth, towerHeight, towerDepth, towerPos, frame.tangent, towerRGB));

    // street-level glow band — placeholder porte-cochère/marquee light that
    // pours onto the corridor from the building's own frontage
    const glowPos = spine.place(center, z.side, curb + APRON*0.45, 1.1).position;
    const warm = bucket.bias;
    const glowRGB = [1.0, 0.5 + warm*0.18, 0.2 + warm*0.14];
    glowBandGeoms.push(massingBox(podiumWidth*0.94, 2.0, 0.55, glowPos, frame.tangent, glowRGB));

    if (z.id === 'park-mgm'){
      // T-Mobile Arena set behind the property — cheap secondary hint block
      const arenaPos = spine.place(center, z.side, lateral + depth*0.5 + 55, 26).position;
      bucket.geoms.push(massingBox(width*0.7, 52, 70, arenaPos, frame.tangent, [0.12,0.13,0.17]));
    }
    if (z.id === 'the-linq'){
      // High Roller wheel — Phase 1-quality asset arrives later; flat ring
      // for now. A window-grid emissiveMap doesn't map cleanly onto a torus
      // (the coarse UV sampling read as a mostly-dark void with a few random
      // speckles) — instead it gets its own dedicated dim emissive rim, a
      // uniform glow that reads consistently as a lit structure regardless
      // of viewing angle, plus a thin bright LED accent ring.
      const ringPos = spine.place(center, z.side, lateral + depth*0.5 + 70, 55).position;
      const ringGeo = new THREE.TorusGeometry(48, 1.6, 16, 96);
      ringGeo.rotateY(Math.PI/2);
      ringGeo.translate(ringPos.x, ringPos.y, ringPos.z);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x4a4e58, roughness: 0.55, metalness: 0.35,
        emissive: 0xffb066, emissiveIntensity: 0.5
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      scene.add(ringMesh);
      extraGlowPairs.push({ mesh: ringMesh, material: new THREE.MeshBasicMaterial({ color: 0x3a2a12 }) });

      const accent = new THREE.TorusGeometry(48, 0.32, 8, 96);
      accent.rotateY(Math.PI/2);
      accent.translate(ringPos.x, ringPos.y, ringPos.z);
      addColor(accent, [1.0, 0.62, 0.28]);
      glowBandGeoms.push(accent);
    }
  });

  const glowPairs = [];
  const massMeshes = buckets
    .filter(b => b.geoms.length)
    .map(bucket => {
      const massMat = new THREE.MeshStandardMaterial({
        vertexColors: true, emissiveMap: bucket.tex, emissive: 0xffffff,
        emissiveIntensity: 1.0, roughness: 0.82, metalness: 0.12
      });
      const mesh = new THREE.Mesh(mergeGeometries(bucket.geoms), massMat);
      scene.add(mesh);
      // dim glow-only variant feeds the bloom pass at low intensity — the
      // window texture's mostly-dark background keeps the halo soft even
      // though the base pass reads bright and detailed up close
      const glowMat = new THREE.MeshBasicMaterial({ map: bucket.tex, color: 0x2b2620 });
      glowPairs.push({ mesh, material: glowMat });
      return mesh;
    });
  glowPairs.push(...extraGlowPairs);

  const glowBandMesh = glowBandGeoms.length
    ? new THREE.Mesh(mergeGeometries(glowBandGeoms), new THREE.MeshBasicMaterial({ vertexColors: true }))
    : null;
  if (glowBandMesh) scene.add(glowBandMesh);

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

  return { massMeshes, glowBandMesh, labelMesh, glowPairs };
}
