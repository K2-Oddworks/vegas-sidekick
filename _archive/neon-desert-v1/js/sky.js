import * as THREE from 'three';

/* ============================================================
   NEON DESERT · SKY                                         🌵
   A big inverted dome that rides with the camera (classic
   skybox trick) painted with a true-night gradient via vertex
   colors: deep navy dome, never pure black, with a warm amber
   "light dome" glow rising from the horizon — the way a real
   desert city's light pollution washes the low sky. Sparse dim
   stars only survive near the zenith, same as over the Strip.
   ============================================================ */

const STOPS = [
  { v: 0.00, c: [0.050, 0.033, 0.020] }, // ground haze — matches fog, warm dark
  { v: 0.05, c: [0.230, 0.135, 0.058] }, // peak of the amber light-dome glow
  { v: 0.14, c: [0.110, 0.082, 0.088] }, // glow fading into the night sky
  { v: 0.30, c: [0.038, 0.046, 0.095] }, // deep navy transition
  { v: 0.60, c: [0.026, 0.032, 0.072] }, // mid sky, navy
  { v: 1.00, c: [0.014, 0.018, 0.042] }, // darkest at the zenith — where stars survive
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

function buildStars(radius){
  const N = 240;
  const positions = new Float32Array(N * 3);
  for (let i = 0; i < N; i++){
    // bias toward the zenith so stars only survive high overhead, where the
    // amber ground glow can't wash them out
    const elevation = THREE.MathUtils.lerp(Math.PI*0.30, Math.PI*0.5, Math.pow(Math.random(), 0.55));
    const azimuth = Math.random() * Math.PI * 2;
    const r = radius * 0.97;
    const y = Math.sin(elevation) * r;
    const rad = Math.cos(elevation) * r;
    positions[i*3]   = Math.cos(azimuth) * rad;
    positions[i*3+1] = y;
    positions[i*3+2] = Math.sin(azimuth) * rad;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xaebdec, size: 1.5, sizeAttenuation: false,
    transparent: true, opacity: 0.5, depthWrite: false, fog: false
  });
  const stars = new THREE.Points(geo, mat);
  stars.renderOrder = -1;
  return stars;
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

  const stars = buildStars(radius);
  scene.add(stars);

  return {
    dome, stars,
    update(camera){
      dome.position.copy(camera.position);
      stars.position.copy(camera.position);
    }
  };
}
