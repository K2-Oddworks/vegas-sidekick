import * as THREE from 'three';
import { createWelcomeSign } from './sign.js';
import { createBloomPipeline } from './bloom.js';
import { loadSpineData, buildSpine } from './spine.js';
import { buildRoad } from './road.js';
import { buildZones } from './zones.js';
import { buildConstructionSites } from './construction.js';
import { buildAdAnchors } from './adAnchors.js';
import { buildSkyline } from './skyline.js';
import { createCameraRig, createDriveController, wireDriveInput } from './cameraRig.js';
import { createDebugHud } from './debug.js';

/* ============================================================
   NEON DESERT · MAIN                                       🌵
   Phase 2: the spine & skeleton. Boots renderer/scene/camera,
   loads strip-spine.json, builds road + zones + construction
   sites + ad anchors + skyline off that one data file, then
   drives a DriveController-powered CameraRig down the corridor
   through the same selective-bloom pipeline from Phase 1.
   ============================================================ */

console.log('%c🌵 Vegas Sidekick — Neon Desert · Phase 2', 'color:#FF6B2B;font-weight:bold');

const PX = Math.min(window.devicePixelRatio || 1, 2);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const canvas = document.getElementById('stage');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(PX);
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const FOG_NEAR = 30, FOG_FAR = 420;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x04060e);
scene.fog = new THREE.Fog(0x04060e, FOG_NEAR, FOG_FAR);

const camera = new THREE.PerspectiveCamera(62, innerWidth/innerHeight, 0.1, 1400);

async function boot(){
  const data = await loadSpineData(new URL('../data/strip-spine.json', import.meta.url));
  const spine = buildSpine(data);

  const sign = createWelcomeSign({ scene, renderer });
  const road = buildRoad({ scene, spine, data });
  const zones = await buildZones({ scene, spine, data });
  const construction = buildConstructionSites({ scene, spine, data });
  const adAnchors = buildAdAnchors({ scene, spine, data });
  const skyline = buildSkyline({ scene, spine, data });

  const alwaysGlow = [sign.bulbs, sign.starGroup.userData.bulbs, road.bulbs];
  if (construction.beacons) alwaysGlow.push(construction.beacons);
  const bloom = createBloomPipeline({
    renderer, scene, camera, pixelRatio: PX,
    alwaysGlow, fogNear: FOG_NEAR, fogFar: FOG_FAR
  });

  /* ---------- drive camera ---------- */
  const rig = createCameraRig({ camera });
  // drive in the innermost northbound lane, not the median — the Welcome
  // Sign's support legs straddle the median centerline near spine 0
  const laneOffset = data.road.medianWidth/2 + data.road.laneWidth*0.5;
  const drive = createDriveController({ spine, initialSpineDistance: 6, laneOffset });
  rig.setController(drive);
  wireDriveInput({ canvas, throttleEl: document.getElementById('throttle'), controller: drive });

  document.getElementById('btnStop').addEventListener('click', () => drive.stop());
  document.getElementById('btnUturn').addEventListener('click', () => drive.uTurn());
  const throttleFill = document.getElementById('throttleFill');

  /* ---------- sign bulb chase toggle (Phase 1 control, kept) ---------- */
  const chaseModes = ['Classic chase','Sparkle','Steady'];
  let chaseMode = reduceMotion ? 2 : 0;
  const btnChase = document.getElementById('btnChase');
  btnChase.addEventListener('click', () => {
    chaseMode = (chaseMode+1) % 3;
    btnChase.querySelector('.val').textContent = chaseModes[chaseMode];
  });
  btnChase.querySelector('.val').textContent = chaseModes[chaseMode];

  const debugHud = createDebugHud({ renderer });
  if (new URLSearchParams(location.search).get('debug') === '1'){
    window.__NEON_DEBUG = { scene, camera, spine, data, drive, zones, road, adAnchors, construction, rig };
  }
  // The bloom pipeline calls renderer.render() several times per frame and
  // WebGLRenderer auto-resets `info` on every one of those calls — reset it
  // ourselves once per frame so the debug HUD sees the true frame total.
  renderer.info.autoReset = false;

  addEventListener('resize', () => {
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    bloom.resize();
  });

  await sign.bake({ glowSwap: bloom.glowSwap });
  document.getElementById('loader').classList.add('done');

  const clock = new THREE.Clock();
  function loop(){
    requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    renderer.info.reset();
    rig.update(dt, t);
    sign.updateBulbs(t, chaseMode, reduceMotion);
    construction.updateBeacons?.(t);
    adAnchors.updateDigitalBillboards?.(t);
    throttleFill.style.width = (drive.state.speed / drive.MAX_SPEED * 100) + '%';

    bloom.renderFrame();
    debugHud.update();
  }
  loop();
}
boot();
