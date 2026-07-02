import * as THREE from 'three';
import { roadHalfWidth, SIDEWALK_WIDTH } from './spine.js';
import { mergeGeometries } from './util.js';

/* ============================================================
   NEON DESERT · ROAD                                       🌵
   Las Vegas Blvd as an 8-lane ribbon (4 each direction + median)
   lofted along the spine curve, with concrete median/sidewalks
   and InstancedMesh streetlight rows. Everything here reads its
   dimensions from strip-spine.json's `road` block.
   ============================================================ */

const POLE_SPACING = 45;
const POLE_HEIGHT = 9.5;
const ARM_LENGTH = 2.6;

function buildRibbonGeometry(spine, spineLength, leftOffset, rightOffset, uPerUnit, y, segments){
  const positions = [], normals = [], uvs = [], indices = [];
  const step = spineLength / segments;
  for (let i = 0; i <= segments; i++){
    const d = i * step;
    const { point, right } = spine.frameAt(d);
    const pL = point.clone().addScaledVector(right, leftOffset);
    const pR = point.clone().addScaledVector(right, rightOffset);
    positions.push(pL.x, y, pL.z,  pR.x, y, pR.z);
    normals.push(0,1,0,  0,1,0);
    const u = d / uPerUnit;
    uvs.push(u, 0,  u, 1);
    if (i > 0){
      const b = (i-1)*2, c = i*2;
      indices.push(b, c, b+1,  c, c+1, b+1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal',   new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv',       new THREE.Float32BufferAttribute(uvs, 2));
  geo.setAttribute('color',    new THREE.Float32BufferAttribute(new Float32Array(positions.length).fill(1), 3));
  geo.setIndex(indices);
  return geo;
}

function buildLaneTextures(data){
  const half = roadHalfWidth(data);
  const { laneWidth, medianWidth, lanesEachDirection } = data.road;
  const TEX_U = 128, TEX_V = 256;
  const toPx = (offset) => Math.round((offset/(half*2) + 0.5) * TEX_V);

  function paint(emissive){
    const c = document.createElement('canvas'); c.width = TEX_U; c.height = TEX_V;
    const ctx = c.getContext('2d');
    ctx.fillStyle = emissive ? '#000000' : '#1c1e24';
    ctx.fillRect(0, 0, TEX_U, TEX_V);
    for (const dir of [-1, 1]){
      for (let i = 1; i < lanesEachDirection; i++){
        const y = toPx(dir * (medianWidth/2 + i*laneWidth));
        ctx.fillStyle = emissive ? 'rgba(255,255,255,0.9)' : 'rgba(230,230,230,0.7)';
        ctx.fillRect(0, y-2, TEX_U*0.5, 4);
      }
      const yEdge = toPx(dir * (medianWidth/2 + lanesEachDirection*laneWidth));
      ctx.fillStyle = emissive ? 'rgba(255,210,140,0.9)' : 'rgba(220,190,140,0.6)';
      ctx.fillRect(0, yEdge-2, TEX_U, 3);
    }
    for (const offset of [-medianWidth/2, medianWidth/2]){
      const y = toPx(offset);
      ctx.fillStyle = emissive ? '#FFD400' : '#E0B400';
      ctx.fillRect(0, y-3, TEX_U, 2);
      ctx.fillRect(0, y+1, TEX_U, 2);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    if (!emissive) tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }
  return { map: paint(false), emissiveMap: paint(true) };
}

function poleUnitGeometry(){
  const parts = [];
  const pole = new THREE.BoxGeometry(0.22, POLE_HEIGHT, 0.22);
  pole.translate(0, POLE_HEIGHT/2, 0);
  parts.push(pole);
  const arm = new THREE.BoxGeometry(ARM_LENGTH, 0.16, 0.16);
  arm.translate(ARM_LENGTH/2, POLE_HEIGHT - 0.3, 0);
  parts.push(arm);
  const head = new THREE.BoxGeometry(0.5, 0.22, 0.32);
  head.translate(ARM_LENGTH - 0.1, POLE_HEIGHT - 0.55, 0);
  parts.push(head);
  return mergeGeometries(parts);
}

export function buildRoad({ scene, spine, data }){
  const half = roadHalfWidth(data);
  const segments = Math.max(24, Math.ceil(spine.spineLength / 20));
  const { map, emissiveMap } = buildLaneTextures(data);

  const roadGeo = buildRibbonGeometry(spine, spine.spineLength, -half, half, 24, 0.02, segments);
  const roadMat = new THREE.MeshStandardMaterial({
    map, emissiveMap, emissive: 0xffffff, emissiveIntensity: 0.35,
    roughness: 0.92, metalness: 0.05
  });
  const roadMesh = new THREE.Mesh(roadGeo, roadMat);
  scene.add(roadMesh);

  const concreteGeoms = [
    buildRibbonGeometry(spine, spine.spineLength, -data.road.medianWidth/2, data.road.medianWidth/2, 40, 0.06, segments),
    buildRibbonGeometry(spine, spine.spineLength, -(half+SIDEWALK_WIDTH), -half, 12, 0.04, segments),
    buildRibbonGeometry(spine, spine.spineLength, half, half+SIDEWALK_WIDTH, 12, 0.04, segments)
  ];
  const concreteMesh = new THREE.Mesh(
    mergeGeometries(concreteGeoms),
    new THREE.MeshStandardMaterial({ color: 0x2a2c34, roughness: 0.95 })
  );
  scene.add(concreteMesh);

  /* ---------- streetlight rows ---------- */
  const poleGeo = poleUnitGeometry();
  const bulbGeo = new THREE.SphereGeometry(0.16, 8, 6);
  const positions = [];
  for (let d = POLE_SPACING/2; d < spine.spineLength; d += POLE_SPACING){
    positions.push({ d, side: 'west' });
    positions.push({ d, side: 'east' });
  }

  const poles = new THREE.InstancedMesh(poleGeo,
    new THREE.MeshStandardMaterial({ color: 0x6a6f7a, roughness: 0.5, metalness: 0.4 }),
    positions.length);
  const bulbs = new THREE.InstancedMesh(bulbGeo,
    new THREE.MeshBasicMaterial({ color: 0xffdfa8 }),
    positions.length);

  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), armAxis = new THREE.Vector3(1,0,0);
  positions.forEach(({ d, side }, i) => {
    const { position, frame } = spine.place(d, side, half + SIDEWALK_WIDTH * 0.4);
    const armDir = side === 'west' ? frame.right.clone() : frame.right.clone().negate();
    q.setFromUnitVectors(armAxis, armDir);
    m.compose(position, q, new THREE.Vector3(1,1,1));
    poles.setMatrixAt(i, m);

    const bulbPos = position.clone()
      .addScaledVector(armDir, ARM_LENGTH - 0.1)
      .setY(POLE_HEIGHT - 0.55);
    m.compose(bulbPos, new THREE.Quaternion(), new THREE.Vector3(1,1,1));
    bulbs.setMatrixAt(i, m);
  });
  poles.instanceMatrix.needsUpdate = true;
  bulbs.instanceMatrix.needsUpdate = true;
  scene.add(poles, bulbs);

  return { roadMesh, concreteMesh, poles, bulbs };
}
