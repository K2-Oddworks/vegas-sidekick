import * as THREE from 'three';

/* ============================================================
   SELECTIVE BLOOM — custom two-stage pipeline
   Ported verbatim from neon-desert-welcome-sign-v3.html.
   Pass 1: scene with glow-materials only  → half-res RT
   Pass 2: 4× separable gaussian (2 sizes) → soft halo
   Pass 3: normal render + additive composite
   Landmarks register their glow materials into the returned
   `glowSwap` map (mesh → glow material); everything else that
   isn't in `alwaysGlow` renders black during the bloom pass.
   ============================================================ */

export function createBloomPipeline({
  renderer, scene, camera, pixelRatio,
  alwaysGlow = [],
  fogColor = 0x04060e, fogNear = 30, fogFar = 90
}){
  const blackMesh = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const blackPts  = new THREE.PointsMaterial({ color: 0x000000 });
  const glowSwap = new Map(); // mesh -> glow material

  let rtA, rtB, rtC;
  function makeRTs(){
    const w = Math.max(2, Math.floor(innerWidth *pixelRatio/2));
    const h = Math.max(2, Math.floor(innerHeight*pixelRatio/2));
    const opts = { type: THREE.HalfFloatType, depthBuffer: true };
    rtA?.dispose(); rtB?.dispose(); rtC?.dispose();
    rtA = new THREE.WebGLRenderTarget(w,h,opts);
    rtB = new THREE.WebGLRenderTarget(w,h,{type:THREE.HalfFloatType, depthBuffer:false});
    rtC = new THREE.WebGLRenderTarget(w,h,{type:THREE.HalfFloatType, depthBuffer:false});
  }
  makeRTs();

  const quadCam = new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  const quadScene = new THREE.Scene();
  const blurMat = new THREE.ShaderMaterial({
    uniforms:{ tex:{value:null}, dir:{value:new THREE.Vector2(1,0)}, texel:{value:new THREE.Vector2()} },
    vertexShader:`varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.);}`,
    fragmentShader:`
      uniform sampler2D tex; uniform vec2 dir; uniform vec2 texel; varying vec2 vUv;
      void main(){
        vec2 o = dir*texel;
        vec3 c = texture2D(tex, vUv).rgb * 0.227;
        c += (texture2D(tex, vUv+o*1.385).rgb + texture2D(tex, vUv-o*1.385).rgb) * 0.316;
        c += (texture2D(tex, vUv+o*3.231).rgb + texture2D(tex, vUv-o*3.231).rgb) * 0.070;
        gl_FragColor = vec4(c,1.);
      }`
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2,2), blurMat);
  quadScene.add(quad);

  const compMat = new THREE.ShaderMaterial({
    uniforms:{ tex:{value:null}, strength:{value:1.25} },
    transparent:true, blending:THREE.AdditiveBlending, depthTest:false, depthWrite:false,
    vertexShader:`varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.);}`,
    fragmentShader:`
      uniform sampler2D tex; uniform float strength; varying vec2 vUv;
      void main(){
        vec3 b = texture2D(tex, vUv).rgb * strength;
        gl_FragColor = vec4(b, 1.0);
      }`
  });
  const compScene = new THREE.Scene();
  compScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2), compMat));

  const savedMats = new Map();
  function swapForBloom(){
    scene.traverse(o=>{
      if (o.isPoints){ savedMats.set(o,o.material); o.material = blackPts; return; }
      if (!o.isMesh && !o.isInstancedMesh) return;
      savedMats.set(o, o.material);
      if (alwaysGlow.includes(o)) return;               // full glow
      o.material = glowSwap.get(o) || blackMesh;         // glow map or black
    });
    scene.fog = null;
  }
  function restoreMats(){
    savedMats.forEach((m,o)=> o.material = m);
    savedMats.clear();
    scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);
  }

  function blurPass(src, dst, dx, dy){
    blurMat.uniforms.tex.value = src.texture;
    blurMat.uniforms.dir.value.set(dx,dy);
    blurMat.uniforms.texel.value.set(1/src.width, 1/src.height);
    renderer.setRenderTarget(dst);
    renderer.render(quadScene, quadCam);
  }

  function renderFrame(){
    // bloom source
    const bg = scene.background; scene.background = new THREE.Color(0x000000);
    swapForBloom();
    renderer.setRenderTarget(rtA);
    renderer.render(scene, camera);
    restoreMats();
    scene.background = bg;

    // tight halo then wide halo
    blurPass(rtA, rtB, 1, 0); blurPass(rtB, rtC, 0, 1);
    blurPass(rtC, rtB, 2.5, 0); blurPass(rtB, rtC, 0, 2.5);

    // base + composite
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
    compMat.uniforms.tex.value = rtC.texture;
    renderer.autoClear = false;
    renderer.render(compScene, quadCam);
    renderer.autoClear = true;
  }

  return { glowSwap, renderFrame, resize: makeRTs };
}
