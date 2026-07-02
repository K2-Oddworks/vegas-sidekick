import * as THREE from 'three';
// Cache-busting query on every local import: this is a no-build static site,
// so filenames never change across deploys — without a version marker a
// browser (or CDN edge) that already cached the pre-Phase-2 main.js/sign.js
// can keep serving them against the new index.html and silently break (HUD
// elements the stale script expects no longer exist). Bump PHASE when any
// of these files changes again.
import { createWelcomeSign } from './sign.js?v=phase2';
import { createBloomPipeline } from './bloom.js?v=phase2';
import { loadSpineData, buildSpine } from './spine.js?v=phase2';
import { buildRoad } from './road.js?v=phase2';
import { buildZones } from './zones.js?v=phase2';
import { buildConstructionSites } from './construction.js?v=phase2';
import { buildAdAnchors } from './adAnchors.js?v=phase2';
import { buildSkyline } from './skyline.js?v=phase2';
import { createCameraRig, createDriveController, wireDriveInput } from './cameraRig.js?v=phase2';
import { createDebugHud } from './debug.js?v=phase2';
import { buildSky } from './sky.js?v=phase2';

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

// Early-evening desert dusk, not full night — bright enough that the
// placeholder massing actually reads as buildings instead of black voids.
const FOG_NEAR = 30, FOG_FAR = 420, FOG_COLOR = 0x241f3a;
const scene = new THREE.Scene();
scene.background = new THREE.Color(FOG_COLOR);
scene.fog = new THREE.Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);

const camera = new THREE.PerspectiveCamera(62, innerWidth/innerHeight, 0.1, 1400);

async function boot(){
  try {
    await bootScene();
  } catch (err) {
    console.error('Neon Desert failed to boot:', err);
    const loader = document.getElementById('loader');
    loader.textContent = 'Something went sideways loading the Strip — please reload. (' + err.message + ')';
    loader.style.whiteSpace = 'normal';
    loader.style.padding = '0 32px';
    loader.style.textAlign = 'center';
  }
}

async function bootScene(){
  const data = await loadSpineData(new URL('../data/strip-spine.json', import.meta.url));
  const spine = buildSpine(data);

  const sky = buildSky({ scene });
  // Scene-wide dusk ambient — separate from the sign's own dimmer fill
  // lights so the sign module stays untouched. Warm sky/ground hemisphere
  // fill plus a low, soft "sun just set" key light give the massing blocks
  // enough shading to read as buildings instead of flat black silhouettes.
  scene.add(new THREE.HemisphereLight(0x5c6ea0, 0x3a2a22, 0.85));
  const sunset = new THREE.DirectionalLight(0xffab72, 0.42);
  sunset.position.set(300, 45, 160);
  scene.add(sunset);

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
    alwaysGlow, fogColor: FOG_COLOR, fogNear: FOG_NEAR, fogFar: FOG_FAR
  });

  /* ---------- drive camera ---------- */
  const rig = createCameraRig({ camera });
  // drive in the innermost northbound lane, not the median — the Welcome
  // Sign's support legs straddle the median centerline near spine 0
  const laneOffset = data.road.medianWidth/2 + data.road.laneWidth*0.5;
  const drive = createDriveController({ spine, initialSpineDistance: data.anchors.welcomeSign.spinePosition + 6, laneOffset });
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
    sky.update(camera);
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
