import * as THREE from 'three';

/* ============================================================
   NEON DESERT · CAMERA RIG                                  🌵
   CameraRig is controller-agnostic: it just holds a THREE
   camera and applies whatever position/yaw/pitch its attached
   controller computes each frame. DriveController is the only
   controller today; a future WalkController plugs into the
   same rig without any change here.
   ============================================================ */

export function createCameraRig({ camera }){
  const rig = {
    camera,
    position: new THREE.Vector3(),
    yaw: 0,
    pitch: 0,
    controller: null,
    setController(controller){
      rig.controller = controller;
      controller.attach(rig);
    },
    update(dt, t){
      rig.controller?.update(dt, t);
      camera.position.copy(rig.position);
      const cp = Math.cos(rig.pitch);
      const dir = new THREE.Vector3(Math.sin(rig.yaw)*cp, Math.sin(rig.pitch), -Math.cos(rig.yaw)*cp);
      camera.lookAt(rig.position.x + dir.x, rig.position.y + dir.y, rig.position.z + dir.z);
    }
  };
  return rig;
}

const CAMERA_HEIGHT = 1.65; // limo-roof height
const MAX_SPEED = 34;       // world units / sec cruise ceiling
const UTURN_DURATION = 1.6;

function yawFromTangent(t){ return Math.atan2(t.x, -t.z); }

/**
 * Drive camera: cruise along the spine, drag-to-orbit look while stopped
 * or moving, full stop, U-turn. Mobile touch-first (drag canvas to look,
 * scrub the throttle bar to set speed) with desktop mouse/keys secondary.
 */
export function createDriveController({ spine, initialSpineDistance = 0, laneOffset = 0 }){
  let rig = null;
  const state = {
    s: initialSpineDistance,
    dir: 1,
    speed: 0, targetSpeed: 0,
    yawOffset: 0, targetYawOffset: 0,
    pitch: 0, targetPitch: 0,
    uTurning: false, uTurnT: 0
  };

  function attach(r){ rig = r; }

  function baseHeadingYaw(){
    const { tangent } = spine.frameAt(state.s);
    let yaw = yawFromTangent(tangent);
    if (state.dir < 0) yaw += Math.PI;
    return yaw;
  }

  function setTargetSpeed(fraction){ // fraction 0..1 of MAX_SPEED, from the throttle scrubber
    state.targetSpeed = THREE.MathUtils.clamp(fraction, 0, 1) * MAX_SPEED;
  }
  function stop(){ state.targetSpeed = 0; }

  function uTurn(){
    if (state.uTurning) return;
    state.uTurning = true;
    state.uTurnT = 0;
    state.targetSpeed = Math.min(state.targetSpeed, MAX_SPEED*0.18);
  }

  function look(deltaYaw, deltaPitch){
    state.targetYawOffset += deltaYaw;
    state.targetYawOffset = THREE.MathUtils.clamp(state.targetYawOffset, -2.6, 2.6);
    state.targetPitch = THREE.MathUtils.clamp(state.targetPitch + deltaPitch, -0.55, 0.55);
  }

  function update(dt){
    if (state.uTurning){
      state.uTurnT += dt;
      const p = Math.min(1, state.uTurnT / UTURN_DURATION);
      state.targetYawOffset = p * Math.PI;
      if (p >= 1){
        state.dir *= -1;
        state.targetYawOffset = 0; state.yawOffset = 0;
        state.uTurning = false; state.uTurnT = 0;
        state.targetSpeed = Math.max(state.targetSpeed, MAX_SPEED*0.3);
      }
    }

    state.speed += (state.targetSpeed - state.speed) * Math.min(1, dt*2.2);
    state.s += state.dir * state.speed * dt;
    if (state.s <= 0 || state.s >= spine.spineLength){
      state.s = THREE.MathUtils.clamp(state.s, 0, spine.spineLength);
      state.speed *= 0.5; state.targetSpeed *= 0.5; // soft bumper at either terminus
    }

    state.yawOffset += (state.targetYawOffset - state.yawOffset) * Math.min(1, dt*6);
    state.pitch += (state.targetPitch - state.pitch) * Math.min(1, dt*6);

    const { position } = spine.place(state.s, 'east', laneOffset, CAMERA_HEIGHT);
    rig.position.copy(position);
    rig.yaw = baseHeadingYaw() + state.yawOffset;
    rig.pitch = state.pitch;
  }

  return { attach, update, setTargetSpeed, stop, uTurn, look, state, MAX_SPEED };
}

/** Wires touch/mouse/keys to a DriveController. Canvas drag = look; a
 *  throttle scrubber element + stop/u-turn buttons handle the rest. */
export function wireDriveInput({ canvas, throttleEl, controller }){
  let dragging = false, lastX = 0, lastY = 0, moved = false;

  canvas.addEventListener('pointerdown', e => {
    dragging = true; moved = false; canvas.setPointerCapture(e.pointerId);
    lastX = e.clientX; lastY = e.clientY;
  });
  canvas.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX-lastX, dy = e.clientY-lastY;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved = true;
    controller.look(-dx*0.0045, -dy*0.0032);
    lastX = e.clientX; lastY = e.clientY;
  });
  addEventListener('pointerup', () => { dragging = false; });

  if (throttleEl){
    let scrubbing = false;
    const setFromEvent = (e) => {
      const r = throttleEl.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      controller.setTargetSpeed((clientX - r.left) / r.width);
    };
    throttleEl.addEventListener('pointerdown', e => { scrubbing = true; throttleEl.setPointerCapture(e.pointerId); setFromEvent(e); });
    throttleEl.addEventListener('pointermove', e => { if (scrubbing) setFromEvent(e); });
    addEventListener('pointerup', () => { scrubbing = false; });
  }

  addEventListener('keydown', e => {
    switch (e.key){
      case 'ArrowUp': case 'w': case 'W':
        controller.setTargetSpeed(Math.min(1, controller.state.targetSpeed/controller.MAX_SPEED + 0.12)); break;
      case 'ArrowDown': case 's': case 'S':
        controller.setTargetSpeed(Math.max(0, controller.state.targetSpeed/controller.MAX_SPEED - 0.18)); break;
      case ' ':
        controller.stop(); break;
      case 'ArrowLeft': case 'a': case 'A':
        controller.look(0.05, 0); break;
      case 'ArrowRight': case 'd': case 'D':
        controller.look(-0.05, 0); break;
      case 'u': case 'U':
        controller.uTurn(); break;
    }
  });

  return { wasDragLook: () => moved };
}
