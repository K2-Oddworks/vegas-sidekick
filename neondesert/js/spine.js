import * as THREE from 'three';

/* ============================================================
   NEON DESERT · SPINE                                     🌵
   Loads strip-spine.json and turns its centerline into a
   THREE.CatmullRomCurve3, then exposes spine-distance-based
   helpers (frameAt / place) so every other module — road,
   zones, construction, ad anchors, skyline, the camera rig —
   positions itself off the same data, never off hand-typed
   coordinates.
   ============================================================ */

export const SIDEWALK_WIDTH = 6;

export function roadHalfWidth(data){
  const { lanesEachDirection, laneWidth, medianWidth } = data.road;
  return lanesEachDirection * laneWidth + medianWidth / 2;
}

export function curbOffset(data){
  return roadHalfWidth(data) + SIDEWALK_WIDTH;
}

export async function loadSpineData(url = new URL('../data/strip-spine.json', import.meta.url)){
  const res = await fetch(url);
  if (!res.ok) throw new Error(`strip-spine.json failed to load: ${res.status}`);
  const data = await res.json();
  // Era is future-proofing only right now — every zone ships as "present"
  // and this is the one place that filters, so a future era can be added
  // to the data file without every consumer module needing to know about it.
  data.zones = (data.zones || []).filter(z => (z.era || 'present') === 'present');
  return data;
}

/**
 * Wraps the parsed strip-spine.json data with a CatmullRomCurve3 and
 * spine-distance (world units, 0 = Welcome Sign, spineLength = north
 * terminus) based query helpers.
 */
export function buildSpine(data){
  const curve = new THREE.CatmullRomCurve3(
    data.centerline.map(p => new THREE.Vector3(p.x, 0, p.z)),
    false, 'catmullrom', 0.3
  );
  const spineLength = data.spineLength;

  function frameAt(spineDistance){
    const t = THREE.MathUtils.clamp(spineDistance / spineLength, 0, 1);
    const point = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();
    const right = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
    return { point, tangent, right, t, spineDistance };
  }

  // Places something at (spineDistance, side, lateralDistance) — side is
  // 'east' | 'west' | 'median'; lateralDistance is measured from the
  // centerline outward along the local right vector.
  function place(spineDistance, side, lateralDistance, height = 0){
    const frame = frameAt(spineDistance);
    const sign = side === 'east' ? 1 : side === 'west' ? -1 : 0;
    const position = frame.point.clone().addScaledVector(frame.right, sign * lateralDistance);
    position.y = height;
    return { position, frame };
  }

  function headingAt(spineDistance){
    return Math.atan2(frameAt(spineDistance).tangent.x, frameAt(spineDistance).tangent.z);
  }

  return { curve, spineLength, frameAt, place, headingAt };
}
