// Scout's visual model is illustrative, not a live telemetry display.
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const canvas = document.querySelector('#ambient-three');
const host = document.querySelector('[data-scout-visual]');
const controls = document.querySelector('[data-scene-controls]');
const caption = document.querySelector('[data-scene-caption]');
let cleanup = () => {};
let disposed = false;
let library;
const descriptions = [
  'Selected knowledge enters a bounded context. Drag to explore the layered view.',
  'Retrieval ranks local knowledge with BM25 and contextual reciprocal rank fusion.',
  'Server-owned state and response contracts prepare the evidence for generation.',
  'Cloudflare Workers AI generates the response from the selected context.',
  'Post-generation checks inspect claims; invalid output can be repaired or rejected.'
];

async function boot() {
  disposed = false;
  try {
    library ||= await import('https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js');
    if (disposed) return;
    cleanup();
    cleanup = start(library);
  } catch (error) {
    document.documentElement.dataset.scoutGraphics = 'fallback';
    if (caption) caption.textContent = 'Retrieval → context → generation → validation. The source-linked explanation below remains available.';
    if (controls) controls.hidden = true;
    console.warn('Scout graphics unavailable', error);
  }
}

function start(THREE) {
  const events = new AbortController();
  const options = { signal: events.signal };
  const compact = innerWidth < 760 || (navigator.deviceMemory && navigator.deviceMemory < 4);
  const renderers = [];
  const observers = [];
  const resources = new Set();
  const keep = resource => (resources.add(resource), resource);
  const palette = [0x85f7c5, 0x64d6ff, 0xa5a0ff, 0xffd093];
  const colors = palette.map(c => new THREE.Color(c));
  const pointer = new THREE.Vector2();
  let raf = 0, previous = 0, time = 0, paused = motion.matches, stage = 0;
  let inView = true, dirty = true, lost = false, dragging = false;
  let yaw = -0.48, pitch = 0.2, targetYaw = yaw, targetPitch = pitch, zoom = 8.8;
  let lastX = 0, lastY = 0;

  function rendererFor(target) {
    const renderer = new THREE.WebGLRenderer({ canvas: target, alpha: true, antialias: !compact, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, compact ? 1.25 : 1.75));
    renderer.setClearColor(0x070d16, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderers.push(renderer);
    target.addEventListener('webglcontextlost', event => {
      event.preventDefault(); lost = true; cancelAnimationFrame(raf); raf = 0;
      document.documentElement.dataset.scoutGraphics = 'fallback';
    }, options);
    target.addEventListener('webglcontextrestored', () => boot(), options);
    return renderer;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
  camera.position.set(0, 0.25, zoom);
  camera.lookAt(0, 0, 0);
  const world = new THREE.Group();
  scene.add(world);
  scene.add(new THREE.HemisphereLight(0xb4e9ff, 0x071322, 2.0));
  const key = new THREE.DirectionalLight(0xc7eaff, 3.2);
  key.position.set(3, 5, 6); scene.add(key);
  const fill = new THREE.PointLight(0x63ffc6, 18, 15);
  fill.position.set(-3, 0, 2); scene.add(fill);
  let heroRenderer = null;
  if (host) heroRenderer = rendererFor(host.querySelector('canvas'));

  const lineMat = (color, opacity = 0.45) => keep(new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false }));
  const solidMat = (color, opacity = 1) => keep(new THREE.MeshStandardMaterial({
    color, metalness: 0.58, roughness: 0.3, transparent: opacity < 1, opacity,
    emissive: color, emissiveIntensity: 0.13, depthWrite: opacity >= 1
  }));
  const edge = (mesh, color, opacity = 0.5) => {
    const wire = new THREE.LineSegments(keep(new THREE.EdgesGeometry(mesh.geometry)), lineMat(color, opacity));
    mesh.add(wire); return wire;
  };
  const planes = [];
  const plateGeometry = keep(new THREE.BoxGeometry(2.7, 0.065, 1.8));
  const chipGeometry = keep(new THREE.BoxGeometry(0.15, 0.055, 0.2));
  const nodeGeometry = keep(new THREE.IcosahedronGeometry(0.045, 0));
  for (let layer = 0; layer < 4; layer++) {
    const group = new THREE.Group();
    group.position.y = (layer - 1.5) * 0.72;
    const plate = new THREE.Mesh(plateGeometry, solidMat(palette[layer], 0.12));
    edge(plate, palette[layer], 0.55); group.add(plate);
    const chips = new THREE.InstancedMesh(chipGeometry, solidMat(palette[layer], 0.82), 24);
    const matrix = new THREE.Matrix4();
    for (let i = 0; i < 24; i++) {
      matrix.makeTranslation((i % 6 - 2.5) * 0.39, 0.07, (Math.floor(i / 6) - 1.5) * 0.4);
      chips.setMatrixAt(i, matrix);
    }
    chips.instanceMatrix.needsUpdate = true;
    group.add(chips);
    // Exact geometric pathways are decorative; their counts do not encode runtime facts.
    const rails = [];
    for (let j = 0; j < 4; j++) {
      const z = (j - 1.5) * 0.4;
      rails.push(-1.18, 0.075, z, 1.18, 0.075, z);
    }
    const geo = keep(new THREE.BufferGeometry());
    geo.setAttribute('position', new THREE.Float32BufferAttribute(rails, 3));
    group.add(new THREE.LineSegments(geo, lineMat(palette[layer], 0.3)));
    world.add(group); planes.push({ group, plate, chips });
  }

  const core = new THREE.Group();
  const coreShape = keep(new THREE.IcosahedronGeometry(0.62, 0));
  const crystal = new THREE.Mesh(coreShape, solidMat(0x89dcff, 0.6));
  edge(crystal, 0xd1f8ff, 0.85); core.add(crystal);
  const rim = keep(new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { tint: { value: new THREE.Color(0x78e8ff) } },
    vertexShader: 'varying vec3 n; varying vec3 v; void main(){vec4 p=modelViewMatrix*vec4(position,1.0);n=normalize(normalMatrix*normal);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',
    fragmentShader: 'uniform vec3 tint;varying vec3 n;varying vec3 v;void main(){float f=pow(1.0-abs(dot(normalize(n),normalize(v))),2.0);gl_FragColor=vec4(tint,f*0.42);}'
  }));
  core.add(new THREE.Mesh(keep(new THREE.IcosahedronGeometry(0.72, 2)), rim));
  world.add(core);

  const rings = [];
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      keep(new THREE.TorusGeometry(2.0 + i * 0.22, 0.009, 4, compact ? 80 : 128)),
      keep(new THREE.MeshBasicMaterial({ color: palette[i], transparent: true, opacity: 0.27, depthWrite: false }))
    );
    ring.rotation.set(Math.PI * (0.33 + i * 0.19), i * 0.5, i * 0.85);
    world.add(ring); rings.push(ring);
  }
  const curves = [], pulses = [];
  const beadMat = solidMat(0xc8fff1);
  const cardGeo = keep(new THREE.BoxGeometry(0.28, 0.36, 0.06));
  for (let i = 0; i < (compact ? 12 : 20); i++) {
    const angle = i * 2.399963;
    const side = i % 2 ? 1 : -1;
    const start = new THREE.Vector3(side * (2.1 + (i % 3) * 0.2), Math.sin(angle) * 1.35, Math.cos(angle) * 1.0);
    const end = new THREE.Vector3(side * 0.9, ((i % 4) - 1.5) * 0.72, (i % 3 - 1) * 0.42);
    const curve = new THREE.CubicBezierCurve3(start, start.clone().multiplyScalar(0.74).add(new THREE.Vector3(0,0,0.55)), end.clone().add(new THREE.Vector3(side*0.65,0,0.45)), end);
    const geometry = keep(new THREE.BufferGeometry().setFromPoints(curve.getPoints(28)));
    world.add(new THREE.Line(geometry, lineMat(palette[i % 4], 0.24)));
    const card = new THREE.Mesh(cardGeo, solidMat(palette[i % 4], 0.5));
    card.position.copy(start); card.rotation.set(0.1, -side*0.35, Math.sin(angle)*0.2);
    edge(card,palette[i % 4],0.7); world.add(card);
    const pulse = new THREE.Mesh(nodeGeometry, beadMat); world.add(pulse);
    curves.push(curve); pulses.push(pulse);
  }

  // A single point draw call gives the hero atmospheric depth without texture downloads.
  const dustGeo = keep(new THREE.BufferGeometry());
  const dust = [];
  for (let i = 0; i < (compact ? 100 : 220); i++) {
    const a = i * 2.399963, radius = 2.4 + (i % 17) / 8;
    dust.push(Math.cos(a)*radius, Math.sin(a)*radius*0.7, -2.3+(i%13)/6);
  }
  dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(dust,3));
  const dustMat = keep(new THREE.PointsMaterial({ color:0x86afc9,size:0.018,transparent:true,opacity:0.46,depthWrite:false }));
  const stars = new THREE.Points(dustGeo,dustMat); scene.add(stars);

  // Quiet shared-page background. The detailed scene has its own bounded viewport.
  let ambientRenderer = null;
  const ambientScene = new THREE.Scene();
  const ambientCamera = new THREE.PerspectiveCamera(45,1,0.1,60);
  ambientCamera.position.set(0,0,10);
  const ambientWorld = new THREE.Group(); ambientScene.add(ambientWorld);
  if(canvas) {
    ambientRenderer = rendererFor(canvas);
    const net = [];
    for(let i=0;i<40;i++) {
      const side=i%2?1:-1, x=side*(4.0+(i%5)*0.65), y=(i%10-4.5)*0.72,z=-2-(i%7)*0.35;
      net.push(x,y,z,x+side*0.55,y+0.36,z-0.4);
    }
    const geo=keep(new THREE.BufferGeometry());geo.setAttribute('position',new THREE.Float32BufferAttribute(net,3));
    ambientWorld.add(new THREE.LineSegments(geo,lineMat(0x62bba5,0.16)));
    const field=new THREE.Points(dustGeo,dustMat);field.scale.set(2.8,2.8,1);ambientWorld.add(field);
  }

  function resize() {
    if(heroRenderer) {
      const rect=host.getBoundingClientRect();
      const w=Math.max(1,rect.width),h=Math.max(1,rect.height);
      heroRenderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
    }
    if(ambientRenderer) {
      ambientRenderer.setSize(innerWidth,innerHeight,false);
      ambientCamera.aspect=innerWidth/Math.max(1,innerHeight);ambientCamera.updateProjectionMatrix();
    }
    dirty=true;request();
  }
  const ro=typeof ResizeObserver==='function'?new ResizeObserver(resize):null;
  if(ro&&host){ro.observe(host);observers.push(ro);}
  addEventListener('resize',resize,options);
  if(host&&typeof IntersectionObserver==='function'){
    const observer=new IntersectionObserver(entries=>{
      inView=entries[0].isIntersecting;dirty=true;request();
    },{rootMargin:'100px'});
    observer.observe(host);observers.push(observer);
  }
  function request(){if(!raf&&!document.hidden&&!lost)raf=requestAnimationFrame(frame);}
  function frame(now) {
    raf=0;
    if(document.hidden||lost)return;
    const animate=!paused&&!motion.matches;
    const interval=compact?1000/30:1000/45;
    if(animate&&now-previous<interval){request();return;}
    const dt=Math.min((now-previous)/1000||0,0.05);previous=now;
    if(animate)time+=dt;
    if(inView&&heroRenderer&&(dirty||animate)) {
      if(animate){yaw+=(targetYaw-yaw)*0.12;pitch+=(targetPitch-pitch)*0.12;}
      else{yaw=targetYaw;pitch=targetPitch;}
      world.rotation.set(pitch,yaw+(animate&&!dragging?Math.sin(time*0.13)*0.1:0),0);
      core.rotation.set(time*0.08,time*0.13,0.2);
      planes.forEach(({group,plate,chips},i)=>{
        const selected=stage===0||stage===i+1;
        const expanded=stage?1.3:1;
        group.position.y=(i-1.5)*0.72*expanded;
        plate.material.opacity=selected?0.16:0.045;
        chips.material.opacity=selected?0.85:0.17;
      });
      rings.forEach((ring,i)=>{ring.rotation.z=time*(i%2?-.035:.035)+i*0.85;});
      curves.forEach((curve,i)=>pulses[i].position.copy(curve.getPoint((time*0.15+i/pulses.length)%1)));
      camera.position.z=camera.aspect<0.85?zoom+2.3:zoom;
      camera.updateProjectionMatrix();
      heroRenderer.render(scene,camera);
    }
    if(ambientRenderer&&(dirty||animate)){
      ambientWorld.rotation.y=animate?Math.sin(time*0.035)*0.06:0;
      ambientRenderer.render(ambientScene,ambientCamera);
    }
    dirty=false;
    if(animate)request();
  }
  const pause=controls?.querySelector('[data-scene-pause]');
  function syncPause(){if(pause){pause.disabled=motion.matches;pause.textContent=motion.matches?'Reduced motion':paused?'Play motion':'Pause motion';pause.setAttribute('aria-pressed',String(paused));}}
  if(controls) {
    controls.hidden=false;
    controls.addEventListener('click',event=>{
      const button=event.target.closest('button');if(!button)return;
      if(button.hasAttribute('data-scene-stage')){
        stage=Number(button.dataset.sceneStage);
        controls.querySelectorAll('[data-scene-stage]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.sceneStage)===stage)));
        if(caption)caption.textContent=descriptions[stage];
      }else if(button.hasAttribute('data-scene-pause')){paused=!paused;if(motion.matches)paused=true;syncPause();}
      else if(button.hasAttribute('data-scene-reset')){targetYaw=-0.48;targetPitch=0.2;zoom=8.8;}
      else if(button.hasAttribute('data-scene-zoom')){zoom=Math.max(6.5,Math.min(12,zoom+Number(button.dataset.sceneZoom)));}
      dirty=true;request();
    },options);
  }
  if(host) {
    const target=host.querySelector('canvas');
    target.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;dragging=true;lastX=e.clientX;lastY=e.clientY;target.setPointerCapture(e.pointerId);},options);
    target.addEventListener('pointermove',e=>{if(!dragging)return;targetYaw+=(e.clientX-lastX)*0.008;targetPitch=Math.max(-0.55,Math.min(0.7,targetPitch+(e.clientY-lastY)*0.006));lastX=e.clientX;lastY=e.clientY;dirty=true;request();},options);
    target.addEventListener('pointerup',()=>{dragging=false;},options);
    target.addEventListener('pointercancel',()=>{dragging=false;},options);
    target.addEventListener('keydown',e=>{
      if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;
      e.preventDefault();
      if(e.key==='ArrowLeft')targetYaw-=0.12;if(e.key==='ArrowRight')targetYaw+=0.12;
      if(e.key==='ArrowUp')targetPitch=Math.max(-0.55,targetPitch-0.1);
      if(e.key==='ArrowDown')targetPitch=Math.min(0.7,targetPitch+0.1);
      dirty=true;request();
    },options);
  }
  motion.addEventListener('change',()=>{paused=motion.matches;syncPause();dirty=true;request();},options);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){cancelAnimationFrame(raf);raf=0;}
    else{previous=performance.now();dirty=true;request();}
  },options);
  syncPause();resize();
  document.documentElement.dataset.scoutGraphics='ready';
  return ()=>{
    events.abort();cancelAnimationFrame(raf);
    observers.forEach(observer=>observer.disconnect());
    resources.forEach(resource=>resource.dispose());
    renderers.forEach(renderer=>renderer.dispose());
  };
}
addEventListener('pagehide',()=>{disposed=true;cleanup();});
addEventListener('pageshow',event=>{if(event.persisted)boot();});
boot();
