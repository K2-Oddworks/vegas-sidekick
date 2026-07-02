import * as THREE from 'three';
import { curbOffset } from './spine.js';
import { mergeGeometries, bakeTransform } from './util.js';

/* ============================================================
   NEON DESERT · CONSTRUCTION SITES                         🌵
   Hard Rock (guitar-silhouette skeleton) and Athletics Ballpark
   (bowl outline), both mid-build with tower cranes + blinking
   red FAA-style beacons. Sponsor-free — these are landmarks,
   not ad inventory.
   ============================================================ */

function guitarSilhouette(height){
  // rough guitar body + neck, traced as a flat 2D shape and extruded thin
  const s = new THREE.Shape();
  s.moveTo(-0.55, 0);
  s.bezierCurveTo(-0.95,0.05, -0.95,0.42, -0.55,0.5);
  s.bezierCurveTo(-0.3,0.56, -0.3,0.66, -0.55,0.74);
  s.bezierCurveTo(-1.0,0.86, -1.0,1.28, -0.4,1.4);
  s.bezierCurveTo(0.05,1.48, 0.05,1.0, 0.12,1.0);
  s.lineTo(0.12, 2.55);
  s.lineTo(-0.12, 2.55);
  s.lineTo(-0.12, 1.0);
  s.bezierCurveTo(-0.05,1.0, 0.3,1.48, 0.55,1.4);
  s.bezierCurveTo(1.0,1.26, 1.0,0.84, 0.55,0.72);
  s.bezierCurveTo(0.3,0.64, 0.3,0.55, 0.55,0.48);
  s.bezierCurveTo(0.95,0.4, 0.95,0.05, 0.55,0);
  s.lineTo(-0.55,0);
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.34, bevelEnabled: false });
  geo.scale(height/2.55, height/2.55, height/2.55);
  return geo;
}

function craneUnitGeometry(mastH, jibLen){
  const parts = [];
  const mast = new THREE.BoxGeometry(1.1, mastH, 1.1); mast.translate(0, mastH/2, 0); parts.push(mast);
  const jib  = new THREE.BoxGeometry(jibLen, 0.6, 0.6); jib.translate(jibLen*0.32, mastH-0.6, 0); parts.push(jib);
  const counter = new THREE.BoxGeometry(jibLen*0.32, 0.55, 0.55); counter.translate(-jibLen*0.2, mastH-0.6, 0); parts.push(counter);
  const cab = new THREE.BoxGeometry(1.4, 1.6, 1.4); cab.translate(0, mastH-1.4, 0); parts.push(cab);
  return mergeGeometries(parts);
}

function sparseWorkLightTexture(){
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#000'; ctx.fillRect(0,0,128,128);
  for (let i = 0; i < 10; i++){
    ctx.fillStyle = 'rgba(190,220,255,0.8)';
    ctx.fillRect(Math.random()*120, Math.random()*120, 3, 6);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 6);
  return t;
}

export function buildConstructionSites({ scene, spine, data }){
  const curb = curbOffset(data);
  const sites = data.zones.filter(z => z.constructionSite);
  const cranePositions = []; // { position, mastH }
  const cranesGeoms = [];

  sites.forEach(z => {
    const [s, e] = z.spineRange;
    const center = (s + e) / 2;
    const height = z.footprint.height;
    const { position, frame } = spine.place(center, z.side, curb + z.footprint.depth/2, 0);

    if (z.constructionSite.type === 'guitar-skeleton'){
      const geo = guitarSilhouette(height);
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),
        z.side === 'east' ? frame.right.clone().negate() : frame.right.clone());
      geo.applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(q));
      geo.translate(position.x, position.y, position.z);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x2a3644, roughness: 0.75, metalness: 0.5,
        emissiveMap: sparseWorkLightTexture(), emissive: 0xffffff, emissiveIntensity: 0.8
      });
      scene.add(new THREE.Mesh(geo, mat));
    }

    if (z.constructionSite.type === 'ballpark-bowl'){
      const bowl = new THREE.TorusGeometry(z.footprint.width*0.5, 6, 8, 32, Math.PI*1.45);
      bowl.rotateX(Math.PI/2);
      bowl.scale(1, 1, 0.62);
      bowl.translate(position.x, 16, position.z);
      const mat = new THREE.MeshStandardMaterial({ color: 0x30343c, roughness: 0.9, metalness: 0.2 });
      scene.add(new THREE.Mesh(bowl, mat));
    }

    const craneCount = z.constructionSite.cranes || 2;
    for (let i = 0; i < craneCount; i++){
      const spread = (i - (craneCount-1)/2) * (z.footprint.width * 0.42);
      const cranePos = spine.place(center + spread, z.side, curb + z.footprint.depth*0.75, 0).position;
      const mastH = height * 1.18;
      cranesGeoms.push(bakeTransform(
        craneUnitGeometry(mastH, mastH*0.55), cranePos, (i % 2) * Math.PI*0.5
      ));
      cranePositions.push({ position: cranePos, mastH });
    }
  });

  if (!cranePositions.length) return {};

  const craneMat = new THREE.MeshStandardMaterial({ color: 0xC7541E, roughness: 0.6, metalness: 0.4 });
  const cranes = new THREE.Mesh(mergeGeometries(cranesGeoms), craneMat);
  const beacons = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.4, 8, 6),
    new THREE.MeshBasicMaterial({ color: 0xff2a2a }),
    cranePositions.length
  );

  const m = new THREE.Matrix4();
  const beaconPhases = [];
  cranePositions.forEach(({ position, mastH }, i) => {
    const top = position.clone(); top.y = mastH + 0.6;
    m.compose(top, new THREE.Quaternion(), new THREE.Vector3(1,1,1));
    beacons.setMatrixAt(i, m);
    beaconPhases.push(Math.random()*Math.PI*2);
  });
  beacons.instanceMatrix.needsUpdate = true;
  scene.add(cranes, beacons);

  const _c = new THREE.Color();
  function updateBeacons(t){
    for (let i = 0; i < beaconPhases.length; i++){
      const on = Math.sin(t*2.4 + beaconPhases[i]) > 0.3;
      _c.set(on ? 0xff2a2a : 0x2a0505);
      beacons.setColorAt(i, _c);
    }
    beacons.instanceColor.needsUpdate = true;
  }

  return { cranes, beacons, updateBeacons };
}
