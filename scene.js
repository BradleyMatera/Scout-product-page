// Scout's visual model is an explanatory diagram, not a live telemetry display.
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const canvas = document.querySelector('#ambient-three');
const host = document.querySelector('[data-scout-visual]');
const heroCanvas = host?.querySelector('#scout-engine-three');
const controls = document.querySelector('[data-scene-controls]');
const caption = document.querySelector('[data-scene-caption]');
const descriptions = [
  'Flow: one question moves through four bounded stages before Scout replies.',
  'Retrieve: local BM25 + contextual RRF select supporting knowledge.',
  'Context: server session state and response contracts shape the model input.',
  'Generate: Cloudflare Workers AI writes from the bounded evidence packet.',
  'Validate: deterministic checks inspect entities, numbers, relationships, polarity, and provenance.'
];
let cleanup = () => {};
let library;
async function boot(){
  try{
    library ||= await import('https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js');
    cleanup(); cleanup = start(library);
  }catch(error){
    document.documentElement.dataset.scoutGraphics='fallback';
    if(caption) caption.textContent='Scout request path: retrieve evidence → assemble context → generate → validate.';
    if(controls) controls.hidden=true;
    console.warn('Scout graphics unavailable',error);
  }
}
function start(THREE){
  const abort = new AbortController();
  const opts={signal:abort.signal};
  const palette=[0x78e6b4,0x62c9f2,0xa59bff,0xffca82];
  const stages=[
    {name:'RETRIEVE',short:'BM25 + RRF',color:palette[0]},
    {name:'CONTEXT',short:'state + contract',color:palette[1]},
    {name:'GENERATE',short:'Workers AI',color:palette[2]},
    {name:'VALIDATE',short:'grounding checks',color:palette[3]}
  ];
  let renderer,scene,camera,world,raf=0,last=0,time=0,paused=reduceMotion.matches,selected=0,zoom=8.8;
  let yaw=0.08,pitch=0.12,targetYaw=yaw,targetPitch=pitch,dragging=false,lastX=0,lastY=0;
  const resources=[];
  const keep=x=>(resources.push(x),x);
  const line=(color,opacity=.5)=>keep(new THREE.LineBasicMaterial({color,transparent:true,opacity,depthWrite:false}));
  const solid=(color,opacity=1)=>keep(new THREE.MeshStandardMaterial({color,transparent:opacity<1,opacity,metalness:.25,roughness:.48,emissive:color,emissiveIntensity:.12}));
  function makeRenderer(target){
    if(!target)return null;
    const r=new THREE.WebGLRenderer({canvas:target,alpha:true,antialias:true,powerPreference:'low-power'});
    r.setPixelRatio(Math.min(devicePixelRatio||1,1.6)); r.setClearColor(0x07101a,0);
    r.outputColorSpace=THREE.SRGBColorSpace; r.toneMapping=THREE.ACESFilmicToneMapping; r.toneMappingExposure=1.1;
    return r;
  }
  renderer=makeRenderer(heroCanvas);
  if(!renderer)return ()=>{};
  scene=new THREE.Scene(); camera=new THREE.PerspectiveCamera(34,1,.1,80); camera.position.set(0,.3,zoom);
  world=new THREE.Group(); scene.add(world);
  scene.add(new THREE.HemisphereLight(0xc9efff,0x081426,2.2));
  const key=new THREE.DirectionalLight(0xffffff,3); key.position.set(2,5,7); scene.add(key);
  const floor=new THREE.Mesh(keep(new THREE.BoxGeometry(10,.035,2.6)),solid(0x173044,.34)); floor.position.set(0,-1.22,0); world.add(floor);
  const stationGeo=keep(new THREE.BoxGeometry(1.35,1.55,1.15));
  const innerGeo=keep(new THREE.BoxGeometry(.76,.12,.72));
  const stations=[];
  stages.forEach((stage,i)=>{
    const group=new THREE.Group(); group.position.x=(i-1.5)*2.05;
    const body=new THREE.Mesh(stationGeo,solid(stage.color,.2)); group.add(body);
    const wire=new THREE.LineSegments(keep(new THREE.EdgesGeometry(stationGeo)),line(stage.color,.95)); group.add(wire);
    for(let row=0;row<3;row++){
      const inner=new THREE.Mesh(innerGeo,solid(stage.color,.72)); inner.position.y=.42-row*.34; group.add(inner);
      const innerEdge=new THREE.LineSegments(keep(new THREE.EdgesGeometry(innerGeo)),line(stage.color,.7)); inner.add(innerEdge);
    }
    const beacon=new THREE.Mesh(keep(new THREE.SphereGeometry(.11,16,12)),solid(stage.color,.95)); beacon.position.set(0,1.02,.04); group.add(beacon);
    stations.push({group,body,beacon,color:stage.color}); world.add(group);
  });
  const arrowGeo=keep(new THREE.ConeGeometry(.13,.38,4));
  const arrows=[];
  for(let i=0;i<3;i++){
    const g=new THREE.Group(); g.position.set(-1.03+i*2.05,0,.05); g.rotation.z=-Math.PI/2;
    const shaft=new THREE.Mesh(keep(new THREE.CylinderGeometry(.035,.035,.9,8)),solid(0xb5f5df,.75)); shaft.rotation.z=Math.PI/2; g.add(shaft);
    const head=new THREE.Mesh(arrowGeo,solid(0xb5f5df,.9)); head.position.x=.53; g.add(head);
    arrows.push(g); world.add(g);
  }
  const packetGeo=keep(new THREE.SphereGeometry(.09,12,8));
  const packets=[];
  for(let i=0;i<10;i++){const p=new THREE.Mesh(packetGeo,solid(0xe8fff8,.9)); packets.push(p); world.add(p);}
  const dustGeo=keep(new THREE.BufferGeometry()); const dust=[];
  for(let i=0;i<90;i++){const a=i*2.4,r=4+(i%9)*.18; dust.push(Math.cos(a)*r,(i%11-5)*.25-0.3,Math.sin(a)*r*.35-1.2);}
  dustGeo.setAttribute('position',new THREE.Float32BufferAttribute(dust,3));
  const dustObj=new THREE.Points(dustGeo,keep(new THREE.PointsMaterial({color:0x6e9bb0,size:.018,transparent:true,opacity:.38,depthWrite:false}))); scene.add(dustObj);
  function resize(){const rect=host.getBoundingClientRect(); renderer.setSize(Math.max(1,rect.width),Math.max(1,rect.height),false); camera.aspect=rect.width/Math.max(1,rect.height); camera.updateProjectionMatrix(); request();}
  const ro=typeof ResizeObserver==='function'?new ResizeObserver(resize):null; ro?.observe(host); addEventListener('resize',resize,opts);
  function request(){if(!raf&&!document.hidden)raf=requestAnimationFrame(frame);}
  function frame(now){
    raf=0; if(document.hidden)return;
    const animate=!paused&&!reduceMotion.matches; if(animate&&now-last<1000/45){request();return;}
    const dt=Math.min((now-last)/1000||0,.05); last=now; if(animate)time+=dt;
    yaw+=(targetYaw-yaw)*.12; pitch+=(targetPitch-pitch)*.12; world.rotation.set(pitch,yaw,0);
    camera.position.z=zoom; camera.updateProjectionMatrix();
    stations.forEach((s,i)=>{const active=selected===0||selected===i+1; s.body.material.opacity=active?.26:.07; s.beacon.material.emissiveIntensity=active?1.1:.2;});
    arrows.forEach((a,i)=>{const active=selected===0||selected===i+1||selected===i+2; a.children[0].material.opacity=active?.86:.18; a.children[1].material.opacity=active?.95:.2;});
    packets.forEach((p,i)=>{const phase=(time*.18+i/packets.length)%1; const x=-3.0+phase*6.0; p.position.set(x,.12+Math.sin(i+time*2)*.08,.08); p.visible=selected===0;});
    dustObj.rotation.y=animate?time*.012:0; renderer.render(scene,camera); if(animate)request();
  }
  function setStage(value){selected=value; if(caption)caption.textContent=descriptions[value]; document.querySelectorAll('[data-scene-stage]').forEach(b=>{const on=Number(b.dataset.sceneStage)===value;b.setAttribute('aria-pressed',String(on));}); request();}
  function onPointerDown(e){dragging=true;lastX=e.clientX;lastY=e.clientY;heroCanvas.setPointerCapture?.(e.pointerId);}
  function onPointerMove(e){if(!dragging)return;targetYaw+=(e.clientX-lastX)*.008;targetPitch+=(e.clientY-lastY)*.006;targetPitch=Math.max(-.6,Math.min(.65,targetPitch));lastX=e.clientX;lastY=e.clientY;request();}
  function onPointerUp(){dragging=false;}
  heroCanvas.addEventListener('pointerdown',onPointerDown,opts); heroCanvas.addEventListener('pointermove',onPointerMove,opts); heroCanvas.addEventListener('pointerup',onPointerUp,opts); heroCanvas.addEventListener('pointercancel',onPointerUp,opts);
  heroCanvas.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')targetYaw-=.15;if(e.key==='ArrowRight')targetYaw+=.15;if(e.key==='ArrowUp')targetPitch=Math.min(.65,targetPitch+.1);if(e.key==='ArrowDown')targetPitch=Math.max(-.6,targetPitch-.1);request();},opts);
  controls?.removeAttribute('hidden');
  controls?.querySelectorAll('[data-scene-stage]').forEach(b=>b.addEventListener('click',()=>setStage(Number(b.dataset.sceneStage)),opts));
  controls?.querySelectorAll('[data-scene-zoom]').forEach(b=>b.addEventListener('click',()=>{zoom=Math.max(6,Math.min(13,zoom+Number(b.dataset.sceneZoom)));request();},opts));
  controls?.querySelector('[data-scene-reset]')?.addEventListener('click',()=>{targetYaw=.08;targetPitch=.12;zoom=8.8;setStage(0);},opts);
  controls?.querySelector('[data-scene-pause]')?.addEventListener('click',e=>{paused=!paused;e.currentTarget.setAttribute('aria-pressed',String(paused));e.currentTarget.textContent=paused?'Resume motion':'Pause motion';request();},opts);
  document.documentElement.dataset.scoutGraphics='ready'; resize(); setStage(0); request();
  return ()=>{abort.abort();cancelAnimationFrame(raf);ro?.disconnect();renderer.dispose();resources.forEach(r=>r.dispose?.());};
}
boot();