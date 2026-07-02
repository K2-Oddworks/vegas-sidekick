import * as THREE from 'three';

/* ============================================================
   NEON DESERT · SKY                                         🌵
   A big inverted dome that rides with the camera (classic
   skybox trick) painted with an early-evening desert gradient
   via vertex colors — one mesh, no extra draw calls beyond the
   usual bloom-pass duplicate, and it correctly pans with camera
   yaw/pitch instead of looking like a flat sticker.
   ============================================================ */

const STOPS = [
  { v: 0.00, c: [0.035, 0.035, 0.075] }, // ground-level haze (matches fog)
  { v: 0.40, c: [0.085, 0.065, 0.120] }, // dark band just under the horizon
  { v: 0.50, c: [0.560, 0.335, 0.260] }, // warm horizon glow — sun just set
  { v: 0.60, c: [0.260, 0.195, 0.320] }, // afterglow transitioning to sky
  { v: 0.78, c: [0.120, 0.145, 0.310] }, // mid sky blue
  { v: 1.00, c: [0.050, 0.060, 0.145] }, // zenith indigo
];

function colorAt(v){
  for (let i = 1; i < STOPS.length; i++){
    if (v <= STOPS[i].v){
      const a = STOPS[i-1], b = STOPS[i];
      const t = (v - a.v) / (b.v - a.v || 1);
      return [0,1,2].map(k => a.c[k] + (b.c[k]-a.c[k])*t);
    }
  }
  return STOPS[STOPS.length-1].c;
}

export function buildSky({ scene, radius = 900 }){
  const geo = new THREE.SphereGeometry(radius, 32, 20);
  const pos = geo.attributes.position;
  const color = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++){
    const v = (pos.getY(i) / radius + 1) / 2;
    const [r,g,b] = colorAt(v);
    color[i*3] = r; color[i*3+1] = g; color[i*3+2] = b;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(color, 3));

  const mat = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false });
  const dome = new THREE.Mesh(geo, mat);
  dome.renderOrder = -1;
  scene.add(dome);

  return { dome, update(camera){ dome.position.copy(camera.position); } };
}
