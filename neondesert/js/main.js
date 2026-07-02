import * as THREE from 'three';
// Cache-busting query on every local import: this is a no-build static site,
// so filenames never change across deploys — without a version marker a
// browser (or CDN edge) that already cached the pre-Phase-2 main.js/sign.js
// can keep serving them against the new index.html and silently break (HUD
// elements the stale script expects no longer exist). Bump PHASE when any
// of these files changes again.
import { createWelcomeSign } from './sign.js?v=4';
import { createBloomPipeline } from './bloom.js?v=4';
import { loadSpineData, buildSpine } from './spine.js?v=4';
import { buildRoad } from './road.js?v=4';
import { buildZones } from './zones.js?v=4';
import { buildConstructionSites } from './construction.js?v=4';
import { buildAdAnchors } from './adAnchors.js?v=4';
import { buildSkyline } from './skyline.js?v=4';
import { createCameraRig, createDriveController, wireDriveInput } from './cameraRig.js?v=4';
import { createDebugHud } from './debug.js?v=4';
import { buildSky } from './sky.js?v=4';
import { createInteractablesRegistry, createInteractableMenu } from './interactables.js?v=4';

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

// Night is the default state. Readability doesn't come from brightening the
// time of day — it comes from the world emitting: dense emissive windows,
// street-level glow bands, lit streetlights, all feeding a bloom pass. The
// fog stays a warm dark navy so it blends into the sky dome's ground haze.
const FOG_NEAR = 30, FOG_FAR = 420, FOG_COLOR = 0x0d0a06;
const scene = new THREE.Scene();
scene.background = new THREE.Color(FOG_COLOR);
scene.fog = new THREE.Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);

const camera = new THREE.PerspectiveCamera(62, innerWidth/innerHeight, 0.1, 1400);

async function boot(){
  try {
    await bootScene();
  } catch (err) {
    console.error('Neon Desert failed to boot:', err);
    // The loader is otherwise a plain black overlay with no copy — this is
    // the one exception, since a silent black screen on a real boot failure
    // is undebuggable.
    const loader = document.getElementById('loader');
    loader.textContent = 'Something went sideways loading the Strip — please reload. (' + err.message + ')';
    Object.assign(loader.style, {
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      whiteSpace: 'normal', padding: '0 32px', textAlign: 'center',
      font: '500 12px/1.6 "IBM Plex Mono",ui-monospace,monospace',
      letterSpacing: '.08em', color: '#FF6B2B'
    });
  }
}

async function bootScene(){
  const data = await loadSpineData(new URL('../data/strip-spine.json?v=4', import.meta.url));
  const spine = buildSpine(data);

  const sky = buildSky({ scene });
  // Scene-wide night ambient — separate from the sign's own dimmer fill
  // lights so the sign module stays untouched. This is intentionally low:
  // the massing, road and street furniture read from their own emissive
  // materials (fed into the bloom pass), not from a bright directional sun.
  // The hemisphere + a faint cool "moonlight" key just keep flat surfaces
  // from going pure black in areas the emissive layer doesn't reach.
  scene.add(new THREE.HemisphereLight(0x2a3550, 0x201509, 0.6));
  const moonKey = new THREE.DirectionalLight(0x6f86c9, 0.24);
  moonKey.position.set(-140, 220, 90);
  scene.add(moonKey);

  const sign = createWelcomeSign({ scene, renderer });
  const road = buildRoad({ scene, spine, data });
  const zones = await buildZones({ scene, spine, data });
  const construction = buildConstructionSites({ scene, spine, data });
  const adAnchors = buildAdAnchors({ scene, spine, data });
  const skyline = buildSkyline({ scene, spine, data });

  const alwaysGlow = [sign.bulbs, sign.starGroup.userData.bulbs, road.bulbs, road.reflectors];
  if (construction.beacons) alwaysGlow.push(construction.beacons);
  if (zones.glowBandMesh) alwaysGlow.push(zones.glowBandMesh);
  const bloom = createBloomPipeline({
    renderer, scene, camera, pixelRatio: PX,
    alwaysGlow, fogColor: FOG_COLOR, fogNear: FOG_NEAR, fogFar: FOG_FAR
  });
  // Massing windows and ad-anchor screens feed the bloom pass through a
  // dim glow-only material variant rather than their full-brightness base
  // material, so distant towers get a soft halo instead of blowing out.
  [...(zones.glowPairs || []), ...(adAnchors.glowPairs || [])]
    .forEach(({ mesh, material }) => bloom.glowSwap.set(mesh, material));

  /* ---------- drive camera ---------- */
  const rig = createCameraRig({ camera });
  // drive in the innermost northbound lane, not the median — the Welcome
  // Sign's support legs straddle the median centerline near spine 0
  const laneOffset = data.road.medianWidth/2 + data.road.laneWidth*0.5;
  const drive = createDriveController({ spine, initialSpineDistance: data.anchors.welcomeSign.spinePosition + 6, laneOffset });
  rig.setController(drive);
  const driveInput = wireDriveInput({ canvas, throttleEl: document.getElementById('throttle'), controller: drive });

  document.getElementById('btnStop').addEventListener('click', () => drive.stop());
  document.getElementById('btnUturn').addEventListener('click', () => drive.uTurn());
  const throttleFill = document.getElementById('throttleFill');

  /* ---------- interactables registry ---------- */
  // Any customizable object in the world registers here as
  // { id, worldPosition, label, options[] } and renders as a small pulsing
  // orange diamond; tapping it opens a minimal pill menu of its options.
  // The sign's bulb-chase control (formerly the bottom BULBS button) is the
  // first entry.
  const interactables = createInteractablesRegistry({ scene });
  const interactableMenu = createInteractableMenu();

  const chaseModes = ['Classic chase','Sparkle','Steady'];
  let chaseMode = reduceMotion ? 2 : 0;
  // The drive starts a few units past the sign heading away from it, in the
  // east lane rather than the median — so the diamond needs to sit ahead of
  // the start position and roughly in that same lane, or the portrait
  // viewport's narrow horizontal FOV puts it off-screen at boot.
  const bulbDiamondPos = spine.place(data.anchors.welcomeSign.spinePosition + 20, 'east', laneOffset, 3.4).position;
  interactables.register({
    id: 'sign-bulbs',
    worldPosition: bulbDiamondPos,
    label: 'Bulb Pattern',
    options: chaseModes,
    get: () => chaseModes[chaseMode],
    onSelect: (opt) => { chaseMode = chaseModes.indexOf(opt); }
  });

  const raycaster = new THREE.Raycaster();
  const pointerNDC = new THREE.Vector2();
  canvas.addEventListener('pointerup', e => {
    if (driveInput.wasDragLook()) return;
    pointerNDC.set((e.clientX/innerWidth)*2-1, -(e.clientY/innerHeight)*2+1);
    raycaster.setFromCamera(pointerNDC, camera);
    const hit = interactables.hitTest(raycaster);
    if (hit) interactableMenu.open(hit, e.clientX, e.clientY);
    else interactableMenu.close();
  });

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
    interactables.update(t);
    throttleFill.style.width = (drive.state.speed / drive.MAX_SPEED * 100) + '%';

    bloom.renderFrame();
    debugHud.update();
  }
  loop();
}
boot();
