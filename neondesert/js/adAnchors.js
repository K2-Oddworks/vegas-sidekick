import * as THREE from 'three';
import { curbOffset } from './spine.js';
import { mergeGeometries } from './util.js';

/* ============================================================
   NEON DESERT · AD INVENTORY ANCHORS                        🌵
   Renders strip-spine.json's `adAnchors` as subtle placeholder
   street furniture — never on property buildings. One
   InstancedMesh per tier keeps this cheap regardless of count;
   each mesh carries userData.anchorIds (index-aligned) so a
   future sales-tools pass can look up the stable IDs.
   ============================================================ */

function facingDir(side, facing, frame){
  if (facing === 'north') return new THREE.Vector3(0, 0, -1);
  if (facing === 'south') return new THREE.Vector3(0, 0, 1);
  // 'street' — face toward the road, i.e. inward from whichever side it's on
  return side === 'east' ? frame.right.clone().negate() : frame.right.clone();
}

function panelGeometry(w, h, legH){
  const parts = [];
  const legOffsets = [-w*0.38, w*0.38];
  for (const lx of legOffsets){
    const leg = new THREE.BoxGeometry(0.3, legH, 0.3);
    leg.translate(lx, legH/2, 0);
    parts.push(leg);
  }
  const panel = new THREE.BoxGeometry(w, h, 0.2);
  panel.translate(0, legH + h/2, 0);
  parts.push(panel);
  return mergeGeometries(parts);
}

function screenTexture(cyan){
  const c = document.createElement('canvas'); c.width = 64; c.height = 32;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0,0,64,0);
  if (cyan){ g.addColorStop(0,'#0aa'); g.addColorStop(0.5,'#08f'); g.addColorStop(1,'#a0f'); }
  else { g.addColorStop(0,'#456'); g.addColorStop(1,'#234'); }
  ctx.fillStyle = g; ctx.fillRect(0,0,64,32);
  return new THREE.CanvasTexture(c);
}

function buildInstanced(geo, mat, placements){
  const mesh = new THREE.InstancedMesh(geo, mat, placements.length);
  const m = new THREE.Matrix4(), axisZ = new THREE.Vector3(0,0,1);
  placements.forEach(({ position, dir }, i) => {
    const q = new THREE.Quaternion().setFromUnitVectors(axisZ, dir);
    m.compose(position, q, new THREE.Vector3(1,1,1));
    mesh.setMatrixAt(i, m);
  });
  mesh.instanceMatrix.needsUpdate = true;
  mesh.userData.anchorIds = placements.map(p => p.id);
  return mesh;
}

export function buildAdAnchors({ scene, spine, data }){
  const curb = curbOffset(data);
  const byTier = { 'street-brick': [], 'static-billboard': [], 'digital-billboard': [], 'premium-marker': [] };

  data.adAnchors.forEach(a => {
    const lateral = a.tier === 'street-brick' ? curb - 1.2 : curb + 1.6;
    const height = a.tier === 'street-brick' ? 0.04 : 0; // panels build their own leg height from y=0
    const { position, frame } = spine.place(a.spinePosition, a.side === 'median' ? 'east' : a.side, lateral, height);
    byTier[a.tier].push({ id: a.id, position, dir: facingDir(a.side, a.facing, frame) });
  });

  const meshes = {};

  if (byTier['street-brick'].length){
    const geo = new THREE.BoxGeometry(1.1, 0.08, 0.7);
    const mat = new THREE.MeshStandardMaterial({ color: 0x8a7a5c, roughness: 0.95 });
    meshes.bricks = buildInstanced(geo, mat, byTier['street-brick']);
  }

  if (byTier['static-billboard'].length){
    const geo = panelGeometry(6.5, 3.2, 4.5);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff, map: screenTexture(false), roughness: 0.7, metalness: 0.1
    });
    meshes.staticBillboards = buildInstanced(geo, mat, byTier['static-billboard']);
  }

  if (byTier['digital-billboard'].length){
    const geo = panelGeometry(5.5, 3.0, 5.5);
    const tex = screenTexture(true);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: 0.9,
      map: tex, roughness: 0.4
    });
    meshes.digitalBillboards = buildInstanced(geo, mat, byTier['digital-billboard']);
  }

  if (byTier['premium-marker'].length){
    const parts = [];
    const post = new THREE.CylinderGeometry(0.18, 0.22, 3.4, 8); post.translate(0, 1.7, 0); parts.push(post);
    const plaque = new THREE.BoxGeometry(1.4, 0.9, 0.12); plaque.translate(0, 2.6, 0.12); parts.push(plaque);
    const geo = mergeGeometries(parts);
    const mat = new THREE.MeshStandardMaterial({ color: 0xC9A227, roughness: 0.4, metalness: 0.6 });
    meshes.premiumMarkers = buildInstanced(geo, mat, byTier['premium-marker']);
  }

  Object.values(meshes).forEach(mesh => scene.add(mesh));

  /* rotating digital billboards slowly yaw in place */
  const digitalPlacements = byTier['digital-billboard'];
  function updateDigitalBillboards(t){
    if (!meshes.digitalBillboards) return;
    const m = new THREE.Matrix4(), axisZ = new THREE.Vector3(0,0,1), q = new THREE.Quaternion(), spin = new THREE.Quaternion();
    digitalPlacements.forEach(({ position, dir }, i) => {
      q.setFromUnitVectors(axisZ, dir);
      spin.setFromAxisAngle(new THREE.Vector3(0,1,0), t*0.4);
      q.multiply(spin);
      m.compose(position, q, new THREE.Vector3(1,1,1));
      meshes.digitalBillboards.setMatrixAt(i, m);
    });
    meshes.digitalBillboards.instanceMatrix.needsUpdate = true;
  }

  return { meshes, updateDigitalBillboards };
}
