import * as THREE from 'three';
import { createWelcomeSign } from './sign.js';
import { createBloomPipeline } from './bloom.js';

/* ============================================================
   NEON DESERT · MAIN                                      🌵
   Phase 1: Welcome to Fabulous Las Vegas sign only.
   Boots renderer/scene/camera, wires HUD + orbit controls,
   then drives the animation loop through renderFrame() so the
   selective bloom pipeline is always in the render path.
   ============================================================ */

console.log('%c🌵 Vegas Sidekick — Neon Desert', 'color:#FF6B2B;font-weight:bold');

const PX = Math.min(window.devicePixelRatio || 1, 2);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- renderer / scene / camera ---------- */
const canvas = document.getElementById('stage');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(PX);
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x04060e);
scene.fog = new THREE.Fog(0x04060e, 30, 90);

const camera = new THREE.PerspectiveCamera(38, innerWidth/innerHeight, 0.1, 200);
const TARGET = new THREE.Vector3(0, 5.7, 0);

/* orbit state (manual controls — no external deps) */
const orbit = {
  theta: -0.35, phi: 1.42, radius: 17.5,
  tTheta: -0.35, tPhi: 1.42, tRadius: 17.5,
  auto: !reduceMotion, dragging: false
};

/* ---------- build the sign + bloom pipeline ---------- */
const sign = createWelcomeSign({ scene, renderer });
const bloom = createBloomPipeline({
  renderer, scene, camera, pixelRatio: PX,
  alwaysGlow: [sign.bulbs, sign.starGroup.userData.bulbs]
});

/* ============================================================
   ANIMATION — chase mode state + camera
   ============================================================ */
const chaseModes = ['Classic chase','Sparkle','Steady'];
let chaseMode = reduceMotion ? 2 : 0;

/* camera controls */
canvas.addEventListener('pointerdown', e=>{
  orbit.dragging = true; canvas.classList.add('dragging');
  canvas.setPointerCapture(e.pointerId);
  orbit.lx = e.clientX; orbit.ly = e.clientY;
});
canvas.addEventListener('pointermove', e=>{
  if(!orbit.dragging) return;
  orbit.tTheta -= (e.clientX-orbit.lx)*0.0052;
  orbit.tPhi   -= (e.clientY-orbit.ly)*0.0038;
  orbit.tPhi = Math.min(1.62, Math.max(0.55, orbit.tPhi));
  orbit.lx=e.clientX; orbit.ly=e.clientY;
});
addEventListener('pointerup', ()=>{ orbit.dragging=false; canvas.classList.remove('dragging'); });
canvas.addEventListener('wheel', e=>{
  e.preventDefault();
  orbit.tRadius = Math.min(34, Math.max(8, orbit.tRadius + e.deltaY*0.012));
},{passive:false});

/* buttons */
const btnChase = document.getElementById('btnChase');
btnChase.addEventListener('click', ()=>{
  chaseMode = (chaseMode+1)%3;
  btnChase.querySelector('.val').textContent = chaseModes[chaseMode];
});
btnChase.querySelector('.val').textContent = chaseModes[chaseMode];

const btnOrbit = document.getElementById('btnOrbit');
btnOrbit.querySelector('.val').textContent = orbit.auto ? 'On' : 'Off';
btnOrbit.addEventListener('click', ()=>{
  orbit.auto = !orbit.auto;
  btnOrbit.querySelector('.val').textContent = orbit.auto ? 'On' : 'Off';
});

document.getElementById('btnFlip').addEventListener('click', ()=>{
  orbit.tTheta += Math.PI;
});

addEventListener('resize', ()=>{
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  bloom.resize();
});

/* ---------- main loop ---------- */
const clock = new THREE.Clock();
function loop(){
  requestAnimationFrame(loop);
  const t = clock.getElapsedTime();

  if (orbit.auto && !orbit.dragging) orbit.tTheta += 0.0011;
  orbit.theta  += (orbit.tTheta - orbit.theta)*0.07;
  orbit.phi    += (orbit.tPhi   - orbit.phi)  *0.07;
  orbit.radius += (orbit.tRadius- orbit.radius)*0.07;

  camera.position.set(
    TARGET.x + orbit.radius*Math.sin(orbit.phi)*Math.sin(orbit.theta),
    TARGET.y + orbit.radius*Math.cos(orbit.phi),
    TARGET.z + orbit.radius*Math.sin(orbit.phi)*Math.cos(orbit.theta)
  );
  camera.lookAt(TARGET);

  sign.updateBulbs(t, chaseMode, reduceMotion);
  bloom.renderFrame();
}

/* ---------- boot: wait for fonts, bake faces, go ---------- */
async function boot(){
  await sign.bake({ glowSwap: bloom.glowSwap });
  document.getElementById('loader').classList.add('done');
  loop();
}
boot();
