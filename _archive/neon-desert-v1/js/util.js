import * as THREE from 'three';

/* ============================================================
   NEON DESERT · GEOMETRY UTILITIES                        🌵
   Small local stand-ins for three/examples/jsm/utils — kept
   in-repo so the project never depends on anything beyond the
   single `three` CDN import already in the importmap.
   ============================================================ */

// Merges same-attribute-set (position/normal/uv, no groups) BufferGeometries
// into one, baking each input's current transform first. Used to collapse
// zone massing / skyline silhouettes / construction lattices into a single
// draw call.
export function mergeGeometries(geometries){
  let vertCount = 0, idxCount = 0;
  for (const g of geometries){
    vertCount += g.attributes.position.count;
    idxCount += g.index ? g.index.count : g.attributes.position.count;
  }
  const position = new Float32Array(vertCount * 3);
  const normal   = new Float32Array(vertCount * 3);
  const uv       = new Float32Array(vertCount * 2);
  const color    = new Float32Array(vertCount * 3);
  const index    = new Uint32Array(idxCount);

  let vOff = 0, iOff = 0;
  for (const g of geometries){
    const p = g.attributes.position, n = g.attributes.normal, u = g.attributes.uv;
    const c = g.attributes.color;
    const vc = p.count;
    for (let i = 0; i < vc; i++){
      position[(vOff+i)*3]   = p.getX(i);
      position[(vOff+i)*3+1] = p.getY(i);
      position[(vOff+i)*3+2] = p.getZ(i);
      normal[(vOff+i)*3]   = n ? n.getX(i) : 0;
      normal[(vOff+i)*3+1] = n ? n.getY(i) : 1;
      normal[(vOff+i)*3+2] = n ? n.getZ(i) : 0;
      uv[(vOff+i)*2]   = u ? u.getX(i) : 0;
      uv[(vOff+i)*2+1] = u ? u.getY(i) : 0;
      color[(vOff+i)*3]   = c ? c.getX(i) : 1;
      color[(vOff+i)*3+1] = c ? c.getY(i) : 1;
      color[(vOff+i)*3+2] = c ? c.getZ(i) : 1;
    }
    if (g.index){
      for (let i = 0; i < g.index.count; i++) index[iOff+i] = g.index.getX(i) + vOff;
      iOff += g.index.count;
    } else {
      for (let i = 0; i < vc; i++) index[iOff+i] = vOff + i;
      iOff += vc;
    }
    vOff += vc;
  }

  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.BufferAttribute(position, 3));
  merged.setAttribute('normal',   new THREE.BufferAttribute(normal, 3));
  merged.setAttribute('uv',       new THREE.BufferAttribute(uv, 2));
  merged.setAttribute('color',    new THREE.BufferAttribute(color, 3));
  merged.setIndex(new THREE.BufferAttribute(index, 1));
  return merged;
}

// Scales UVs in place so a tiling texture repeats at a real-world-unit
// pitch regardless of the box's own size (call before merging).
export function scaleUV(geometry, uPerUnit, vPerUnit){
  const uv = geometry.attributes.uv;
  for (let i = 0; i < uv.count; i++){
    uv.setXY(i, uv.getX(i) * uPerUnit, uv.getY(i) * vPerUnit);
  }
  uv.needsUpdate = true;
  return geometry;
}

// Bakes a mesh-space transform into a geometry's vertices so it can be
// merged with others into one static BufferGeometry.
export function bakeTransform(geometry, position, rotationY = 0, scale = new THREE.Vector3(1,1,1)){
  const m = new THREE.Matrix4().compose(
    position instanceof THREE.Vector3 ? position : new THREE.Vector3(...position),
    new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), rotationY),
    scale
  );
  geometry.applyMatrix4(m);
  return geometry;
}

export function makeCanvasTexture(draw, w, h){
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  return t;
}
