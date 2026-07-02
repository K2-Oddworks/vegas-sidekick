import * as THREE from 'three';
import { curbOffset } from '../spine.js';
import { mergeGeometries } from '../util.js';

/* ============================================================
   NEON DESERT · LANDMARK — LUXOR                            🌵
   First hero landmark. TEMPLATE for every landmark module that
   follows: mounts into its zone from strip-spine.json, builds a
   small fixed number of merged draw calls, registers one
   interactable, and returns { update(t,dt), glowPairs,
   alwaysGlow } for main.js to wire into the bloom pipeline and
   render loop — the same shape every future landmarks/*.js file
   should return.

   Pieces: pyramid (dark glass, dense low window bands), sky beam
   (the money shot — 3 crossed additive planes off the apex), and
   obelisk (stone spire + baked LUXOR lettering). Everything is
   placed relative to the Luxor zone's own spine position —
   nothing here is hand-typed world coordinates. A stylized sphinx
   was attempted and deferred after failing the quality gate twice
   — see the note near the bottom of buildLuxor().
   ============================================================ */

const APRON = 16; // matches zones.js — same frontage setback as every other property

const BEAM_COLORS = { WHITE: 0xffffff, BLUE: 0x1a6bff, ORANGE: 0xff6b2b, VIOLET: 0x9b6bff };
const BEAM_MODES = ['STEADY', 'PULSE', 'SWEEP'];

function addColor(geo, rgb){
  const n = geo.attributes.position.count;
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++){ arr[i*3]=rgb[0]; arr[i*3+1]=rgb[1]; arr[i*3+2]=rgb[2]; }
  geo.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return geo;
}

function faceToward(geo, position, dir){
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), dir);
  geo.applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(q));
  geo.translate(position.x, position.y, position.z);
  return geo;
}

function edgeFin(corner, apex, thickness){
  const dir = new THREE.Vector3().subVectors(apex, corner);
  const len = dir.length();
  dir.normalize();
  const mid = new THREE.Vector3().addVectors(corner, apex).multiplyScalar(0.5);
  const geo = new THREE.BoxGeometry(thickness, len, thickness);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), dir);
  geo.applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(q));
  geo.translate(mid.x, mid.y, mid.z);
  return geo;
}

/* ---------- pyramid skin: sparse warm window bands on near-black glass ---------- */
function pyramidSkinTexture(){
  const w = 256, h = 512;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#050608'; ctx.fillRect(0,0,w,h);
  const rows = 46, cols = 44;
  const ch = h/rows, cw = w/cols;
  for (let r = 0; r < rows; r++){
    const vBase = 1 - r/rows;               // 1 near the pyramid base, 0 near the apex
    const baseBoost = Math.pow(vBase, 1.6); // slightly brighter banding near the base
    const density = 0.1 + baseBoost*0.16;   // sparse throughout, never a wall of light
    for (let col = 0; col < cols; col++){
      if (Math.random() > density) continue;
      const bright = 0.5 + Math.random()*0.4;
      ctx.fillStyle = `rgba(${(255*bright)|0},${(196*bright)|0},${(120*bright)|0},0.85)`;
      ctx.fillRect(col*cw+1, r*ch+1, cw-2, ch-2);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 3);
  tex.anisotropy = 8;
  return tex;
}

/* ---------- sky beam: soft radial-falloff column, narrow at the source ---------- */
function beamTexture(){
  const w = 128, h = 256;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++){
    const vBase = 1 - y/h;                       // 1 at canvas bottom == beam base (source)
    const heightFade = Math.pow(vBase, 0.55);     // fades out with height
    const colHalfWidth = 0.06 + 0.44*(1-vBase);   // narrow near the source, flares upward
    for (let x = 0; x < w; x++){
      const u = x/w - 0.5;
      const t = Math.abs(u) / colHalfWidth;
      const radial = Math.max(0, 1 - t*t);
      const a = Math.pow(radial, 1.5) * heightFade;
      const idx = (y*w+x)*4;
      img.data[idx]=255; img.data[idx+1]=255; img.data[idx+2]=255; img.data[idx+3] = Math.round(a*255);
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.RepeatWrapping; // scrolled for SWEEP mode
  return tex;
}

/* ---------- obelisk lettering: LUXOR, baked emissive ----------
   Drawn plain and horizontal — ordinary fillText, no canvas rotate/mirror
   tricks to get wrong. The plane geometry that carries this texture is
   itself rotated 90° (see the sign-plate setup below) to stand the text
   up vertically on the obelisk, which keeps the orientation math in one
   easy-to-verify place instead of split across canvas transforms and UV. */
function obeliskSignTexture(){
  const w = 512, h = 96;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.clearRect(0,0,w,h);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '700 64px "Barlow Condensed", Impact, sans-serif';
  ctx.fillStyle = '#FFE3A6';
  ctx.shadowColor = '#FFB347'; ctx.shadowBlur = 18;
  ctx.fillText('L U X O R', w/2, h*0.52);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}

/* ---------- shared warm ground-glow decal for obelisk / sphinx bases ---------- */
function poolTexture(){
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64,64,4,64,64,62);
  g.addColorStop(0, 'rgba(255,255,255,0.9)');
  g.addColorStop(0.45, 'rgba(255,255,255,0.35)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0,0,128,128);
  return new THREE.CanvasTexture(c);
}

function groundPool(position, radius, rgb, geoms){
  const geo = new THREE.PlaneGeometry(radius*2, radius*2);
  geo.rotateX(-Math.PI/2);
  addColor(geo, rgb);
  geo.translate(position.x, position.y, position.z);
  geoms.push(geo);
}

export function buildLuxor({ scene, spine, data, interactables }){
  const z = data.zones.find(zz => zz.id === 'luxor');
  if (!z) return {};

  const [s, e] = z.spineRange;
  const center = (s + e) / 2;
  const { width, depth, height } = z.footprint;
  const curb = curbOffset(data);
  const frame = spine.frameAt(center);
  const facingDir = z.side === 'east' ? frame.right.clone().negate() : frame.right.clone();

  const accentGeoms = [];   // pyramid edges + obelisk trim — one merged emissive mesh
  const groundGeoms = [];   // obelisk base light pool — one merged additive mesh

  /* ---------- pyramid ---------- */
  const baseEdge = Math.min(width, depth) * 0.86;
  const pyrRadius = baseEdge / Math.SQRT2;
  const pyrHeight = Math.max(90, height * 0.92);
  const pyrLateral = curb + APRON + depth*0.62;
  const pyrGroundPos = spine.place(center, z.side, pyrLateral, 0).position;
  const pyrCenter = new THREE.Vector3(pyrGroundPos.x, pyrHeight/2, pyrGroundPos.z);

  const pyrGeo = new THREE.ConeGeometry(pyrRadius, pyrHeight, 4, 1, false);
  pyrGeo.rotateY(Math.PI/4);
  pyrGeo.translate(pyrCenter.x, pyrCenter.y, pyrCenter.z);
  const pyrTex = pyramidSkinTexture();
  const pyrMat = new THREE.MeshStandardMaterial({
    color: 0x0a0b10, roughness: 0.32, metalness: 0.6,
    emissiveMap: pyrTex, emissive: 0xffffff, emissiveIntensity: 0.85
  });
  const pyramidMesh = new THREE.Mesh(pyrGeo, pyrMat);
  scene.add(pyramidMesh);
  const pyramidGlowMat = new THREE.MeshBasicMaterial({ map: pyrTex, color: 0x241c10 });

  // corner rim fins, base to apex
  const apexWorld = new THREE.Vector3(pyrCenter.x, pyrCenter.y + pyrHeight/2, pyrCenter.z);
  for (let i = 0; i < 4; i++){
    const angle = i*(Math.PI/2) + Math.PI/4;
    const corner = new THREE.Vector3(
      pyrCenter.x + Math.cos(angle)*pyrRadius,
      pyrCenter.y - pyrHeight/2,
      pyrCenter.z + Math.sin(angle)*pyrRadius
    );
    const fin = edgeFin(corner, apexWorld, 0.55);
    addColor(fin, [0.55, 0.72, 0.95]);
    accentGeoms.push(fin);
  }

  /* ---------- sky beam ---------- */
  const beamHeight = 420, beamTopWidth = 64;
  const beamTex = beamTexture();
  function beamPlane(rotY){
    const g = new THREE.PlaneGeometry(beamTopWidth, beamHeight, 1, 1);
    g.translate(0, beamHeight/2, 0);
    g.rotateY(rotY);
    return g;
  }
  const beamGeo = mergeGeometries([0, Math.PI/3, (2*Math.PI)/3].map(beamPlane));
  beamGeo.translate(apexWorld.x, apexWorld.y, apexWorld.z);
  const beamMat = new THREE.MeshBasicMaterial({
    map: beamTex, color: BEAM_COLORS.WHITE, transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
  });
  const beamMesh = new THREE.Mesh(beamGeo, beamMat);
  scene.add(beamMesh);

  /* ---------- obelisk ---------- */
  const obeliskLateral = curb + APRON + depth*0.14;
  const obeliskSpine = center - 34;
  const obFrame = spine.frameAt(obeliskSpine);
  const obFacing = z.side === 'east' ? obFrame.right.clone().negate() : obFrame.right.clone();
  const obGroundPos = spine.place(obeliskSpine, z.side, obeliskLateral, 0).position;

  const obHeight = 30, obBaseR = 3.4, obTopR = 1.2;
  const shaftGeo = new THREE.CylinderGeometry(obTopR/Math.SQRT2, obBaseR/Math.SQRT2, obHeight*0.88, 4, 1);
  shaftGeo.rotateY(Math.PI/4);
  shaftGeo.translate(0, obHeight*0.44, 0);
  const capGeo = new THREE.ConeGeometry(obTopR/Math.SQRT2, obHeight*0.12, 4);
  capGeo.rotateY(Math.PI/4);
  capGeo.translate(0, obHeight*0.88 + obHeight*0.06, 0);
  const obeliskLocalGeo = mergeGeometries([shaftGeo, capGeo]);
  faceToward(obeliskLocalGeo, obGroundPos, obFacing);
  const obeliskMat = new THREE.MeshStandardMaterial({ color: 0x2a2620, roughness: 0.88, metalness: 0.05 });
  const obeliskMesh = new THREE.Mesh(obeliskLocalGeo, obeliskMat);
  scene.add(obeliskMesh);

  // edge trim, base to cap tip, local space before faceToward bake
  for (let i = 0; i < 4; i++){
    const angle = i*(Math.PI/2) + Math.PI/4;
    const corner = new THREE.Vector3(Math.cos(angle)*obBaseR, 0, Math.sin(angle)*obBaseR);
    const tip = new THREE.Vector3(0, obHeight, 0);
    const fin = edgeFin(corner, tip, 0.22);
    addColor(fin, [1.0, 0.78, 0.42]);
    faceToward(fin, obGroundPos, obFacing);
    accentGeoms.push(fin);
  }

  // vertical LUXOR sign plate on the street-facing side. The texture is
  // drawn plain and horizontal (see obeliskSignTexture); a 90° rotateZ
  // here stands it up vertically. A pure rotation can't mirror individual
  // glyphs the way a negative-scale or a canvas-transform mismatch can —
  // worst case the reading direction is flipped top/bottom, which is an
  // easy, obvious thing to spot-check and correct, unlike backwards letters.
  const signW = obBaseR*1.5, signH = obHeight*0.62;
  const signGeo = new THREE.PlaneGeometry(signH, signW);
  signGeo.rotateZ(Math.PI/2);
  signGeo.translate(0, obHeight*0.42, obBaseR*0.74);
  faceToward(signGeo, obGroundPos, obFacing);
  const signTex = obeliskSignTexture();
  const signMat = new THREE.MeshBasicMaterial({ map: signTex, transparent: true, depthWrite: false });
  const obeliskSign = new THREE.Mesh(signGeo, signMat);
  scene.add(obeliskSign);

  groundPool(obGroundPos, 5.5, [1.0, 0.72, 0.38], groundGeoms);

  /* ---------- sphinx: deferred ----------
     Attempted as a low-poly assembled-box guardian (crouched haunches,
     extended front legs, forward-jutting head, tapered nemes headdress),
     rendered and inspected against the Welcome Sign quality bar across two
     genuine refinement passes — first fixing an invisible/unlit material,
     then reworking the whole proportion set (lower crouch, forward head,
     stepped headdress taper). From every practical viewing angle, including
     a proper 3/4 hero shot, it still read as a stack of boxes rather than a
     guardian. Per the brief's explicit quality gate, it's removed rather
     than shipped awkward — the obelisk and beam carry the zone's street
     presence instead. A real sphinx needs an actual modeled/sculpted asset,
     not procedural boxes; that's follow-up work, not this pass. */
  const sphinxMesh = null;

  /* ---------- merged accent + ground-decal meshes ---------- */
  const accentMesh = new THREE.Mesh(
    mergeGeometries(accentGeoms),
    new THREE.MeshBasicMaterial({ vertexColors: true })
  );
  scene.add(accentMesh);
  const accentGlowMat = new THREE.MeshBasicMaterial({ vertexColors: true, color: 0x40404a });

  const groundMesh = new THREE.Mesh(
    mergeGeometries(groundGeoms),
    new THREE.MeshBasicMaterial({ map: poolTexture(), vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  groundMesh.position.y = 0.03;
  scene.add(groundMesh);

  /* ---------- interactable: beam control ---------- */
  let beamMode = 'STEADY';
  let beamColorName = 'WHITE';
  const beamOptions = [];
  BEAM_MODES.forEach(m => Object.keys(BEAM_COLORS).forEach(c => beamOptions.push(`${m} · ${c}`)));
  const markerLateral = curb + APRON + 6;
  const markerPos = spine.place(center, z.side, markerLateral, 4.2).position;
  interactables?.register({
    id: 'luxor-beam',
    worldPosition: markerPos,
    label: 'Sky Beam',
    options: beamOptions,
    get: () => `${beamMode} · ${beamColorName}`,
    onSelect: (opt) => {
      const [m, c] = opt.split(' · ');
      beamMode = m; beamColorName = c;
    }
  });

  /* ---------- per-frame update ---------- */
  function update(t, dt){
    const shimmer = 0.92 + Math.sin(t*3.1)*0.04 + Math.sin(t*7.7)*0.02;
    let intensity = shimmer;
    if (beamMode === 'PULSE'){
      intensity *= 0.5 + 0.5*(0.5 + 0.5*Math.sin(t*0.6));
    } else if (beamMode === 'SWEEP'){
      beamTex.offset.y = (beamTex.offset.y + dt*0.12) % 1;
      intensity *= 0.75 + 0.25*Math.sin(t*1.4);
    }
    beamMat.opacity = THREE.MathUtils.clamp(intensity, 0.05, 1);
    beamMat.color.setHex(BEAM_COLORS[beamColorName]);
  }

  return {
    pyramidMesh, beamMesh, obeliskMesh, sphinxMesh, accentMesh, groundMesh,
    glowPairs: [
      { mesh: pyramidMesh, material: pyramidGlowMat },
      { mesh: accentMesh, material: accentGlowMat }
    ],
    alwaysGlow: [beamMesh],
    update
  };
}
