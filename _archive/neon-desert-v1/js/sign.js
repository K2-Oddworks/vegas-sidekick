import * as THREE from 'three';

/* ============================================================
   NEON DESERT · WELCOME SIGN                              🌵
   Front: WELCOME TO FABULOUS LAS VEGAS NEVADA
   Back:  DRIVE CAREFULLY · COME BACK SOON
   Ported verbatim from neon-desert-welcome-sign-v3.html so the
   bloom pipeline (bloom.js) can register its glow materials and
   future landmarks can reuse the same canvas-texture technique.
   ============================================================ */

const F = {
  script: '"Kaushan Script","Brush Script MT",cursive',
  block:  '"Barlow Condensed",Impact,"Arial Narrow",sans-serif',
  bebas:  '"Bebas Neue",Impact,sans-serif'
};

// Sign geometry constants (world units ~ meters)
const SIGN = { w: 3.85, h: 2.15, bulge: 0.26, depth: 0.34, cy: 5.65 };
const TEXW = 2048, TEXH = Math.round(TEXW * (SIGN.h / SIGN.w)); // match aspect

function diamondPath(ctx, w, h, cx, cy, bulge){
  // convex-edged diamond, canvas space
  const L={x:cx-w,y:cy}, T={x:cx,y:cy-h}, R={x:cx+w,y:cy}, B={x:cx,y:cy+h};
  const cp=(a,b,out)=>{ // control point pushed outward from midpoint
    const mx=(a.x+b.x)/2, my=(a.y+b.y)/2;
    const dx=b.x-a.x, dy=b.y-a.y, len=Math.hypot(dx,dy);
    return {x:mx + (-dy/len)*out, y:my + (dx/len)*out};
  };
  const o = bulge;
  ctx.beginPath();
  ctx.moveTo(L.x,L.y);
  let c=cp(L,T,o);  ctx.quadraticCurveTo(c.x,c.y,T.x,T.y);
  c=cp(T,R,o);      ctx.quadraticCurveTo(c.x,c.y,R.x,R.y);
  c=cp(R,B,o);      ctx.quadraticCurveTo(c.x,c.y,B.x,B.y);
  c=cp(B,L,o);      ctx.quadraticCurveTo(c.x,c.y,L.x,L.y);
  ctx.closePath();
}

function makeCanvas(){ const c=document.createElement('canvas'); c.width=TEXW; c.height=TEXH; return c; }
const scaleX = TEXW/(SIGN.w*2), scaleY = TEXH/(SIGN.h*2);
const CX = TEXW/2, CY = TEXH/2;
const bulgePx = SIGN.bulge*scaleX;

function drawBorder(ctx, glow){
  // double gold band tracing the diamond
  const gold  = glow ? '#8a6a1e' : '#E9B94E';
  const gold2 = glow ? '#5e4712' : '#C9992F';
  ctx.save();
  diamondPath(ctx, SIGN.w*scaleX-26, SIGN.h*scaleY-26, CX, CY, bulgePx*0.94);
  ctx.lineWidth = 34; ctx.strokeStyle = gold; ctx.stroke();
  diamondPath(ctx, SIGN.w*scaleX-78, SIGN.h*scaleY-78, CX, CY, bulgePx*0.88);
  ctx.lineWidth = 10; ctx.strokeStyle = gold2; ctx.stroke();
  ctx.restore();
}

function faceBase(ctx, glow){
  if (glow){
    ctx.fillStyle = '#000'; ctx.fillRect(0,0,TEXW,TEXH);
    // faint backlit face so the panel itself blooms softly
    diamondPath(ctx, SIGN.w*scaleX-8, SIGN.h*scaleY-8, CX, CY, bulgePx);
    ctx.fillStyle = '#141419'; ctx.fill();
  } else {
    // warm-white enamel with a subtle top sheen
    const g = ctx.createLinearGradient(0,0,0,TEXH);
    g.addColorStop(0,'#FFFFFF'); g.addColorStop(.55,'#F7F5EE'); g.addColorStop(1,'#ECEAE2');
    ctx.fillStyle = g; ctx.fillRect(0,0,TEXW,TEXH);
  }
  drawBorder(ctx, glow);
}

function drawFront(glow){
  const c = makeCanvas(), ctx = c.getContext('2d');
  faceBase(ctx, glow);
  ctx.textAlign='center'; ctx.textBaseline='middle';

  // "to Fabulous" — blue script
  ctx.fillStyle = glow ? '#3E7BFF' : '#1553B8';
  ctx.font = `400 ${TEXH*0.15}px ${F.script}`;
  ctx.save(); ctx.translate(CX, TEXH*0.305); ctx.rotate(-0.03);
  ctx.fillText('to  Fabulous', 0, 0); ctx.restore();

  // LAS VEGAS — the money type, sized to the diamond's beltline
  ctx.fillStyle = glow ? '#FF3A2E' : '#D0312D';
  ctx.font = `800 ${TEXH*0.235}px ${F.block}`;
  const lv = 'LAS VEGAS';
  ctx.save(); ctx.translate(CX, TEXH*0.535);
  if (glow){ ctx.shadowColor='#FF2A1E'; ctx.shadowBlur=26; }
  ctx.fillText(lv, 0, 0); ctx.restore();

  // NEVADA — blue, letterspaced
  ctx.fillStyle = glow ? '#3E7BFF' : '#1553B8';
  ctx.font = `700 ${TEXH*0.092}px ${F.block}`;
  const nev='NEVADA', track=TEXH*0.05;
  let tw=0; for(const ch of nev) tw += ctx.measureText(ch).width + track;
  tw -= track;
  let x = CX - tw/2;
  for(const ch of nev){ const w=ctx.measureText(ch).width; ctx.fillText(ch, x+w/2, TEXH*0.715); x += w+track; }

  if (!glow){
    // YESCO maker's mark + hidden desert signature
    ctx.font = `700 ${TEXH*0.028}px ${F.block}`;
    ctx.fillStyle = '#C43B2E';
    ctx.fillText('YESCO', CX + TEXW*0.055, TEXH*0.855);
    ctx.globalAlpha = 0.16; ctx.font = `${TEXH*0.035}px serif`;
    ctx.fillText('🌵', CX - TEXW*0.06, TEXH*0.858);
    ctx.globalAlpha = 1;
  }
  return c;
}

function drawBack(glow){
  const c = makeCanvas(), ctx = c.getContext('2d');
  faceBase(ctx, glow);
  ctx.textAlign='center'; ctx.textBaseline='middle';

  const red  = glow ? '#FF3A2E' : '#D0312D';
  const blue = glow ? '#3E7BFF' : '#1553B8';

  ctx.fillStyle = red;
  if (glow){ ctx.shadowColor='#FF2A1E'; ctx.shadowBlur=20; }
  ctx.font = `800 ${TEXH*0.17}px ${F.block}`;
  ctx.fillText('DRIVE', CX, TEXH*0.295);
  ctx.font = `800 ${TEXH*0.215}px ${F.block}`;
  ctx.fillText('CAREFULLY', CX, TEXH*0.475);
  ctx.shadowBlur = 0;

  ctx.fillStyle = blue;
  ctx.font = `400 ${TEXH*0.15}px ${F.script}`;
  ctx.save(); ctx.translate(CX, TEXH*0.665); ctx.rotate(-0.025);
  ctx.fillText('Come Back', 0, 0); ctx.restore();

  ctx.fillStyle = red;
  ctx.font = `800 ${TEXH*0.105}px ${F.block}`;
  const s='SOON', trk=TEXH*0.06;
  let tw=0; for(const ch of s) tw += ctx.measureText(ch).width + trk; tw -= trk;
  let x = CX - tw/2;
  for(const ch of s){ const w=ctx.measureText(ch).width; ctx.fillText(ch, x+w/2, TEXH*0.815); x += w+trk; }
  return c;
}

function drawCircle(letter, glow){
  const S=256, c=document.createElement('canvas'); c.width=c.height=S;
  const ctx=c.getContext('2d');
  if (glow){
    ctx.fillStyle='#000'; ctx.fillRect(0,0,S,S);
  } else {
    const g=ctx.createRadialGradient(S*0.38,S*0.34,S*0.08,S/2,S/2,S*0.52);
    g.addColorStop(0,'#FFFFFF'); g.addColorStop(.7,'#E6E8EE'); g.addColorStop(1,'#C7CBD4');
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(S/2,S/2,S/2,0,7); ctx.fill();
  }
  // bulb ring
  const dots=14;
  for(let i=0;i<dots;i++){
    const a=i/dots*Math.PI*2;
    ctx.fillStyle = glow ? '#FFDf9a' : '#B98A2E';
    ctx.beginPath();
    ctx.arc(S/2+Math.cos(a)*S*0.42, S/2+Math.sin(a)*S*0.42, glow?7:6, 0, 7);
    ctx.fill();
  }
  // letter
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillStyle = glow ? '#FF4A30' : '#C6302B';
  if (glow){ ctx.shadowColor='#FF2A1E'; ctx.shadowBlur=14; }
  ctx.font = `800 ${S*0.55}px ${F.block}`;
  ctx.fillText(letter, S/2, S*0.54);
  return c;
}

function texFrom(renderer, canvasEl){
  const t = new THREE.CanvasTexture(canvasEl);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return t;
}

function diamondShape(w, h, bulge){
  const s = new THREE.Shape();
  const L=[-w,0], T=[0,h], R=[w,0], B=[0,-h];
  const cp=(a,b,out)=>{
    const mx=(a[0]+b[0])/2, my=(a[1]+b[1])/2;
    const dx=b[0]-a[0], dy=b[1]-a[1], len=Math.hypot(dx,dy);
    return [mx - (-dy/len)*out, my - (dx/len)*out]; // outward (shape winds CCW here)
  };
  s.moveTo(L[0],L[1]);
  let c=cp(L,T,bulge); s.quadraticCurveTo(c[0],c[1],T[0],T[1]);
  c=cp(T,R,bulge);     s.quadraticCurveTo(c[0],c[1],R[0],R[1]);
  c=cp(R,B,bulge);     s.quadraticCurveTo(c[0],c[1],B[0],B[1]);
  c=cp(B,L,bulge);     s.quadraticCurveTo(c[0],c[1],L[0],L[1]);
  s.closePath();
  return s;
}

function remapUV(geo, flipU){
  geo.computeBoundingBox();
  const bb = geo.boundingBox;
  const uv = geo.attributes.uv, pos = geo.attributes.position;
  const w = bb.max.x-bb.min.x, h = bb.max.y-bb.min.y;
  for(let i=0;i<uv.count;i++){
    let u=(pos.getX(i)-bb.min.x)/w, v=(pos.getY(i)-bb.min.y)/h;
    if (flipU) u = 1-u;
    uv.setXY(i,u,v);
  }
  uv.needsUpdate = true;
}

function starShape(scale=1){
  const lengths=[2.35,1.45,1.85,1.45,1.65,1.45,1.85,1.45]; // top, 45°, right, ...
  const inner=0.34;
  const s=new THREE.Shape();
  for(let i=0;i<8;i++){
    const aOut = Math.PI/2 - i*(Math.PI/4);
    const aIn  = aOut - Math.PI/8;
    const ox=Math.cos(aOut)*lengths[i]*scale, oy=Math.sin(aOut)*lengths[i]*scale;
    const ix=Math.cos(aIn)*inner*scale,       iy=Math.sin(aIn)*inner*scale;
    if(i===0) s.moveTo(ox,oy); else s.lineTo(ox,oy);
    s.lineTo(ix,iy);
  }
  s.closePath();
  return s;
}

/**
 * Builds the Welcome to Fabulous Las Vegas sign (faces, perimeter bulbs,
 * WELCOME circles, star, structure, ground pad and star field) into `scene`.
 * Returns handles the bloom pipeline and animation loop need.
 */
export function createWelcomeSign({ scene, renderer }){
  const _m = new THREE.Matrix4();
  const _c = new THREE.Color();

  /* ---------- lights (poles/frame only; sign is self-lit) ---------- */
  scene.add(new THREE.HemisphereLight(0x223055, 0x0a0c14, 0.55));
  const upA = new THREE.PointLight(0xffc78a, 22, 16, 2); upA.position.set(2.4, 0.4, 4.2); scene.add(upA);
  const upB = new THREE.PointLight(0xffc78a, 18, 16, 2); upB.position.set(-2.4, 0.4, -4.2); scene.add(upB);
  const moon = new THREE.DirectionalLight(0x5a72c8, 0.35); moon.position.set(-8, 20, 6); scene.add(moon);

  /* ============================================================
     SIGN GEOMETRY
     ============================================================ */
  const signGroup = new THREE.Group();
  scene.add(signGroup);

  const shape = diamondShape(SIGN.w, SIGN.h, SIGN.bulge);

  // core slab (edge / thickness)
  const slabGeo = new THREE.ExtrudeGeometry(shape, { depth: SIGN.depth, bevelEnabled:false });
  slabGeo.translate(0,0,-SIGN.depth/2);
  const slabMat = new THREE.MeshStandardMaterial({ color:0xDCD8CE, roughness:0.6, metalness:0.15 });
  const slab = new THREE.Mesh(slabGeo, slabMat);
  signGroup.add(slab);

  // faces (built async once fonts are ready — placeholder now)
  const frontGeo = new THREE.ShapeGeometry(shape, 24); remapUV(frontGeo, false);
  const backGeo  = frontGeo.clone(); // same UVs — mesh PI rotation + rear viewpoint cancel out

  const frontMesh = new THREE.Mesh(frontGeo, new THREE.MeshBasicMaterial({color:0x111111}));
  frontMesh.position.z = SIGN.depth/2 + 0.005;
  const backMesh = new THREE.Mesh(backGeo, new THREE.MeshBasicMaterial({color:0x111111}));
  backMesh.rotation.y = Math.PI;
  backMesh.position.z = -SIGN.depth/2 - 0.005;
  signGroup.add(frontMesh, backMesh);

  signGroup.position.y = SIGN.cy;

  /* ---------- perimeter bulbs (both faces) ---------- */
  const BULBS_PER_FACE = 72;
  const edgePts = shape.getSpacedPoints(BULBS_PER_FACE); // arc-length spaced, last==first
  edgePts.pop();

  const bulbGeo = new THREE.SphereGeometry(0.052, 12, 10);
  const bulbMat = new THREE.MeshBasicMaterial({ color:0xffffff });
  const bulbs = new THREE.InstancedMesh(bulbGeo, bulbMat, BULBS_PER_FACE*2);
  for(let f=0; f<2; f++){
    const z = (f===0? 1 : -1) * (SIGN.depth/2 + 0.055);
    for(let i=0;i<BULBS_PER_FACE;i++){
      const p = edgePts[i];
      const prev = edgePts[(i-1+BULBS_PER_FACE)%BULBS_PER_FACE];
      const next = edgePts[(i+1)%BULBS_PER_FACE];
      const tx = next.x-prev.x, ty = next.y-prev.y, tl = Math.hypot(tx,ty);
      const nx = ty/tl, ny = -tx/tl; // outward-ish normal
      // ensure outward: point away from centre
      const dot = nx*p.x + ny*p.y;
      const s = dot >= 0 ? 1 : -1;
      _m.makeTranslation(p.x + nx*s*0.02, p.y + ny*s*0.02, z);
      bulbs.setMatrixAt(f*BULBS_PER_FACE + i, _m);
    }
  }
  bulbs.instanceMatrix.needsUpdate = true;
  signGroup.add(bulbs);

  const COL_ON  = new THREE.Color(0xFFE9B8).multiplyScalar(2.6); // hot warm white (HDR)
  const COL_OFF = new THREE.Color(0x38230C);                      // dead amber
  for(let i=0;i<bulbs.count;i++) bulbs.setColorAt(i, COL_OFF);
  bulbs.instanceColor.needsUpdate = true;

  /* ---------- WELCOME circles along the top edges ----------
     Reuse the diamond shape's own top-left/top-right curves (rather
     than re-deriving control points with a different sign convention)
     so the circles sit exactly on the real border edge instead of
     drifting off it toward the star. */
  const topPath = new THREE.CurvePath();
  topPath.add(shape.curves[0]); // L -> T
  topPath.add(shape.curves[1]); // T -> R

  const WELCOME = 'WELCOME';
  const circleGroup = new THREE.Group();
  signGroup.add(circleGroup);
  const circleFaceMeshes = []; // to attach textures later

  {
    const R = 0.44, T0 = 0.115, T1 = 0.885;
    const rimMat  = new THREE.MeshStandardMaterial({ color:0xB9BCC4, roughness:0.45, metalness:0.6 });
    const backMat = new THREE.MeshStandardMaterial({ color:0x8E929B, roughness:0.6, metalness:0.5 });
    for(let i=0;i<7;i++){
      const t = T0 + (T1-T0)*(i/6);
      const p = topPath.getPointAt(t);
      const tan = topPath.getTangentAt(t);
      const n = new THREE.Vector2(-tan.y, tan.x); if (n.dot(p)<0) n.negate();
      const px = p.x + n.x*0.34, py = p.y + n.y*0.34;

      const g = new THREE.Group();
      g.position.set(px, py, 0);

      const side = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 0.16, 40, 1, true), rimMat);
      side.rotation.x = Math.PI/2;
      const front = new THREE.Mesh(new THREE.CircleGeometry(R, 40),
                      new THREE.MeshBasicMaterial({color:0x151515}));
      front.position.z = 0.081;
      const back = new THREE.Mesh(new THREE.CircleGeometry(R, 40), backMat);
      back.rotation.y = Math.PI; back.position.z = -0.081;

      g.add(side, front, back);
      circleGroup.add(g);
      circleFaceMeshes.push(front);
    }
  }

  /* ---------- the star ---------- */
  const starGroup = new THREE.Group();
  starGroup.position.set(0, 9.55, 0);
  scene.add(starGroup);

  const starBackMat = new THREE.MeshBasicMaterial({ color:0x8f1d14 });
  const starBack = new THREE.Mesh(
    new THREE.ExtrudeGeometry(starShape(1.14), {depth:0.07, bevelEnabled:false}), starBackMat);
  starBack.position.z = -0.09;
  const starFrontMat = new THREE.MeshBasicMaterial({ color:0xB33E12 });
  const starFront = new THREE.Mesh(
    new THREE.ExtrudeGeometry(starShape(1.0), {depth:0.09, bevelEnabled:false}), starFrontMat);
  starGroup.add(starBack, starFront);

  // star bulbs — along each spike, plus tip balls on the long four
  const starBulbData = [];
  {
    const lengths=[2.35,1.45,1.85,1.45,1.65,1.45,1.85,1.45];
    const pos=[];
    for(let i=0;i<8;i++){
      const a = Math.PI/2 - i*(Math.PI/4);
      const fr = lengths[i] > 1.6 ? [0.3,0.55,0.8,1.0] : [0.42,0.78];
      for(const f of fr){
        pos.push([Math.cos(a)*lengths[i]*f, Math.sin(a)*lengths[i]*f, f===1.0?0.14:0.11, f===1.0]);
      }
    }
    const g = new THREE.SphereGeometry(1, 10, 8);
    const starBulbs = new THREE.InstancedMesh(g, new THREE.MeshBasicMaterial({color:0xffffff}), pos.length);
    pos.forEach((p,i)=>{
      const r = p[3] ? 0.085 : 0.06;
      _m.compose(new THREE.Vector3(p[0],p[1],p[2]),
                 new THREE.Quaternion(), new THREE.Vector3(r,r,r));
      starBulbs.setMatrixAt(i,_m);
      starBulbs.setColorAt(i, COL_OFF);
      starBulbData.push({ phase: Math.random()*Math.PI*2, speed: 1.6+Math.random()*2.2 });
    });
    starBulbs.instanceColor.needsUpdate = true;
    starGroup.add(starBulbs);
    starGroup.userData.bulbs = starBulbs;
  }

  /* ---------- structure: poles, star frame, hardware ---------- */
  const steelBlue = new THREE.MeshStandardMaterial({ color:0x5FA8CF, roughness:0.55, metalness:0.35 });
  // Star-frame verticals sit well above the ground uplights and the moon's
  // grazing angle barely touches them, so with steelBlue's higher metalness
  // they read as near-black voids at night. Lighten + desaturate the base
  // color, drop metalness so ambient/hemisphere light does more work, and
  // add a faint self-emissive tint so the bars always read as lit structure.
  const steelBlueFrame = new THREE.MeshStandardMaterial({
    color:0x8FC4E8, roughness:0.6, metalness:0.12,
    emissive:0x1C3450, emissiveIntensity:0.55
  });
  const frameFill = new THREE.PointLight(0x9fc0ff, 9, 14, 2);
  frameFill.position.set(0, 10.2, 2.6); scene.add(frameFill);

  function box(w,h,d,x,y,z,mat=steelBlue){
    const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat);
    m.position.set(x,y,z); scene.add(m); return m;
  }
  box(0.44, 4.2, 0.30,  1.18, 2.1, 0);  // legs — stop beneath the panel, tucked inside sign depth
  box(0.44, 4.2, 0.30, -1.18, 2.1, 0);
  box(0.30, 4.3, 0.30,  1.02, 9.45, 0, steelBlueFrame); // star frame verticals — perch on the top edges
  box(0.30, 4.3, 0.30, -1.02, 9.45, 0, steelBlueFrame);
  box(2.38, 0.30, 0.30, 0, 11.55, 0);   // frame crossbar
  box(0.9, 0.5, 0.28, 1.18, 1.15, 0.30,
      new THREE.MeshStandardMaterial({color:0x9aa0a8, roughness:0.5, metalness:0.6})); // utility cabinet

  /* ---------- ground: dark pad + restrained light pool ---------- */
  {
    const pad = new THREE.Mesh(
      new THREE.CircleGeometry(9, 48),
      new THREE.MeshStandardMaterial({ color:0x0b0e18, roughness:0.95 }));
    pad.rotation.x = -Math.PI/2; pad.position.y = 0.001; scene.add(pad);

    const gc = document.createElement('canvas'); gc.width=gc.height=256;
    const g = gc.getContext('2d');
    const grad = g.createRadialGradient(128,128,4,128,128,126);
    grad.addColorStop(0,'rgba(255,190,120,0.30)');
    grad.addColorStop(0.4,'rgba(255,150,80,0.10)');
    grad.addColorStop(1,'rgba(0,0,0,0)');
    g.fillStyle=grad; g.fillRect(0,0,256,256);
    const glowTex = texFrom(renderer, gc);
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(11,11),
      new THREE.MeshBasicMaterial({ map:glowTex, transparent:true, blending:THREE.AdditiveBlending, depthWrite:false }));
    pool.rotation.x = -Math.PI/2; pool.position.y = 0.02; scene.add(pool);
    pool.userData.noBloom = true;
  }

  /* ---------- desert sky: sparse dim stars ---------- */
  {
    const N=520, p=new Float32Array(N*3);
    for(let i=0;i<N;i++){
      const a=Math.random()*Math.PI*2, e=Math.random()*Math.PI*0.42+0.06, r=70+Math.random()*20;
      p[i*3]=Math.cos(a)*Math.cos(e)*r; p[i*3+1]=Math.sin(e)*r; p[i*3+2]=Math.sin(a)*Math.cos(e)*r;
    }
    const g=new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(p,3));
    const sky = new THREE.Points(g, new THREE.PointsMaterial({color:0x9fb2e8, size:0.14, sizeAttenuation:true, transparent:true, opacity:0.55, depthWrite:false}));
    scene.add(sky);
  }

  /* ---------- per-frame bulb chase / twinkle ---------- */
  function updateBulbs(t, chaseMode, reduceMotion){
    const N = BULBS_PER_FACE;
    for(let f=0; f<2; f++){
      for(let i=0;i<N;i++){
        let k = 0;
        if (chaseMode === 0){
          // 3-phase marquee with soft falloff
          const step = Math.floor(t*7) % 3;
          const ph = (i + (f? 1:0)) % 3;
          k = ph===step ? 1 : (ph===(step+2)%3 ? 0.18 : 0.05);
        } else if (chaseMode === 1){
          k = 0.25 + 0.75*Math.max(0, Math.sin(t*3 + i*2.399));
          k = Math.pow(k, 2.2);
        } else {
          k = 0.92 + 0.08*Math.sin(t*9 + i);
        }
        _c.copy(COL_OFF).lerp(COL_ON, k);
        bulbs.setColorAt(f*N+i, _c);
      }
    }
    bulbs.instanceColor.needsUpdate = true;

    // star: independent twinkle + periodic full burst
    const sb = starGroup.userData.bulbs;
    const burst = Math.max(0, Math.sin(t*0.7)) > 0.985 ? 1 : 0;
    for(let i=0;i<sb.count;i++){
      const d = starBulbData[i];
      let k = 0.3 + 0.7*Math.max(0, Math.sin(t*d.speed + d.phase));
      k = Math.max(k*k, burst);
      if (reduceMotion) k = 0.85;
      _c.copy(COL_OFF).lerp(COL_ON, k);
      sb.setColorAt(i, _c);
    }
    sb.instanceColor.needsUpdate = true;
  }

  /* ---------- bake face/circle/star textures once fonts are ready ---------- */
  async function bake({ glowSwap }){
    try{
      await Promise.race([
        Promise.all([
          document.fonts.load(`800 100px "Barlow Condensed"`),
          document.fonts.load(`400 100px "Kaushan Script"`),
          document.fonts.load(`400 40px "Bebas Neue"`)
        ]),
        new Promise(r=>setTimeout(r, 2500)) // fallback fonts if network is slow
      ]);
    } catch(e){ /* system fallbacks are acceptable */ }

    frontMesh.material = new THREE.MeshBasicMaterial({ map: texFrom(renderer, drawFront(false)) });
    backMesh.material  = new THREE.MeshBasicMaterial({ map: texFrom(renderer, drawBack(false)) });
    glowSwap.set(frontMesh, new THREE.MeshBasicMaterial({ map: texFrom(renderer, drawFront(true)) }));
    glowSwap.set(backMesh,  new THREE.MeshBasicMaterial({ map: texFrom(renderer, drawBack(true)) }));

    WELCOME.split('').forEach((ch,i)=>{
      const face = circleFaceMeshes[i];
      face.material = new THREE.MeshBasicMaterial({ map: texFrom(renderer, drawCircle(ch,false)) });
      glowSwap.set(face, new THREE.MeshBasicMaterial({ map: texFrom(renderer, drawCircle(ch,true)) }));
    });

    // the star bodies glow softly (dimmed versions for bloom pass)
    glowSwap.set(starFront, new THREE.MeshBasicMaterial({ color:0x4a1505 }));
    glowSwap.set(starBack,  new THREE.MeshBasicMaterial({ color:0x2e0a05 }));
  }

  return { signGroup, bulbs, starGroup, updateBulbs, bake };
}
