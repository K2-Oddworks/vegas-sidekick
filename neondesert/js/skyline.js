import * as THREE from 'three';
import { mergeGeometries, bakeTransform } from './util.js';

/* ============================================================
   NEON DESERT · SKYLINE RING                                🌵
   Distant low-poly silhouettes for depth only — no detail.
   The Sphere reads as a dim glowing orb behind the Venetian;
   everything else is a generic dark tower silhouette.
   ============================================================ */

export function buildSkyline({ scene, spine, data }){
  const towerGeoms = [];
  let sphereMesh = null;

  (data.skyline || []).forEach(s => {
    const { position } = spine.place(s.spinePosition, s.side, s.lateralOffset, 0);
    if (s.type === 'sphere-orb'){
      const geo = new THREE.SphereGeometry(34, 20, 16);
      const mat = new THREE.MeshBasicMaterial({ color: 0x3a4a66, transparent: true, opacity: 0.7 });
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
    ? new THREE.Mesh(mergeGeometries(towerGeoms), new THREE.MeshBasicMaterial({ color: 0x141c30 }))
    : null;
  if (towersMesh) scene.add(towersMesh);

  return { towersMesh, sphereMesh };
}
