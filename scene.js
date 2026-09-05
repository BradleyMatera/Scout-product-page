// Scout's visual model is an explanatory diagram, not a live telemetry display.
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
const host=document.querySelector('[data-scout-visual]');
const heroCanvas=host?.querySelector('#scout-engine-three');
const controls=document.querySelector('[data-scene-controls]');
const caption=document.querySelector('[data-scene-caption]');
const descriptions=[
 'Flow: a question enters Scout, moves through evidence, context, generation, and validation, then becomes a reply.',
 'Retrieve: the funnel gathers the strongest local BM25 and contextual RRF evidence.',
 'Context: the layered memory core combines session state and the response contract.',
 'Generate: the central crystal represents Cloudflare Workers AI writing from the bounded packet.',
 'Validate: the shield and check mark represent deterministic grounding checks before the reply leaves Scout.'
];
let library,cleanup=()=>{};
async function boot(){try{library||=await import('https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js');cleanup();cleanup=start(library)}catch(e){document.documentElement.dataset.scoutGraphics='fallback';if(caption)caption.textContent='Scout request path: retrieve evidence → assemble context → generate → validate.';if(controls)controls.hidden=true;console.warn('Scout graphics unavailable',e)}}
function start(THREE){
 const abort=new AbortController(),opts={signal:abort.signal},palette=[0x78e6b4,0x62c9f2,0xa59bff,0xffca82];
 let renderer,scene,camera,world,raf=0,last=0,time=0,paused=reduceMotion.matches,stage=0,zoom=10.8;
 let yaw=.05,pitch=.12,targetYaw=yaw,targetPitch=pitch,drag=false,lx=0,ly=0;
 const resources=[],keep=x=>(resources.push(x),x);
 const mat=(c,o=1)=>keep(new THREE.MeshStandardMaterial({color:c,transparent:o<1,opacity:o,metalness:.3,roughness:.42,emissive:c,emissiveIntensity:.14}));
 const line=(c,o=.6)=>keep(new THREE.LineBasicMaterial({color:c,transparent:true,opacity:o,depthWrite:false}));
 renderer=new THREE.WebGLRenderer({canvas:heroCanvas,alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));renderer.setClearColor(0x07101a,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
 scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(32,1,.1,80);camera.position.set(0,.15,zoom);
 world=new THREE.Group();scene.add(world);scene.add(new THREE.HemisphereLight(0xc9efff,0x081426,2.4));
 const key=new THREE.DirectionalLight(0xffffff,3.2);key.position.set(1,5,7);scene.add(key);
 const base=new THREE.Mesh(keep(new THREE.CylinderGeometry(5,.01,.05,64)),mat(0x173044,.4));base.position.y=-1.05;world.add(base);
 const groups=[];
 function edge(mesh,color,opacity=.8){const e=new THREE.LineSegments(keep(new THREE.EdgesGeometry(mesh.geometry)),line(color,opacity));mesh.add(e)}
 function addRetrieval(){
   const g=new THREE.Group(), funnel=new THREE.Mesh(keep(new THREE.ConeGeometry(.72,1.35,32,1,true)),mat(palette[0],.24));funnel.rotation.z=Math.PI;funnel.position.y=.05;g.add(funnel);edge(funnel,palette[0]);
   const neck=new THREE.Mesh(keep(new THREE.CylinderGeometry(.15,.15,.38,20)),mat(palette[0],.75));neck.position.y=-.7;g.add(neck);
   for(let i=0;i<5;i++){const card=new THREE.Mesh(keep(new THREE.PlaneGeometry(.42,.24)),mat(palette[0],.7));card.position.set(-.65+i*.32,.88+(i%2)*.12,.08+(i%3)*.05);card.rotation.z=(i-2)*.12;g.add(card)}
   return g;
 }
 function addContext(){
   const g=new THREE.Group();
   for(let i=0;i<4;i++){const ring=new THREE.Mesh(keep(new THREE.TorusGeometry(.62,.07,12,48)),mat(palette[1],.7));ring.rotation.x=Math.PI/2;ring.position.y=.62-i*.38;g.add(ring)}
   const core=new THREE.Mesh(keep(new THREE.CylinderGeometry(.48,.48,1.45,32)),mat(palette[1],.16));g.add(core);edge(core,palette[1],.7);
   for(let i=0;i<8;i++){const n=new THREE.Mesh(keep(new THREE.SphereGeometry(.07,12,8)),mat(palette[1],.9));const a=i*Math.PI/4;n.position.set(Math.cos(a)*.68,Math.sin(a)*.5,.25);g.add(n)}
   return g;
 }
 function addGeneration(){
   const g=new THREE.Group(),crystal=new THREE.Mesh(keep(new THREE.OctahedronGeometry(.78,1)),mat(palette[2],.68));g.add(crystal);edge(crystal,0xe0dcff,.95);
   const halo=new THREE.Mesh(keep(new THREE.TorusGeometry(1.02,.025,8,64)),mat(palette[2],.65));halo.rotation.set(Math.PI/2,.3,0);g.add(halo);
   for(let i=0;i<6;i++){const ray=new THREE.Mesh(keep(new THREE.CylinderGeometry(.018,.018,.52,8)),mat(palette[2],.65));const a=i*Math.PI/3;ray.position.set(Math.cos(a)*.8,Math.sin(a)*.8,0);ray.rotation.z=a;g.add(ray)}
   return g;
 }
 function addValidation(){
   const g=new THREE.Group(),shield=new THREE.Mesh(keep(new THREE.IcosahedronGeometry(.82,1)),mat(palette[3],.12));g.add(shield);edge(shield,palette[3],.9);
   const ring=new THREE.Mesh(keep(new THREE.TorusGeometry(.92,.045,8,64)),mat(palette[3],.72));ring.rotation.x=Math.PI/2;g.add(ring);
   const pts=new THREE.Vector3(0,0,.88),geo=keep(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-.38,.02,.88),new THREE.Vector3(-.08,-.3,.88),new THREE.Vector3(.48,.35,.88)]));g.add(new THREE.Line(geo,line(palette[3],1)));
   const dot=new THREE.Mesh(keep(new THREE.SphereGeometry(.1,16,12)),mat(palette[3],.95));dot.position.set(0,.95,.1);g.add(dot);return g;
 }
 const builders=[addRetrieval,addContext,addGeneration,addValidation];
 builders.forEach((build,i)=>{const g=build();g.position.x=(i-1.5)*2.25;groups.push(g);world.add(g)});
 const arrowGroups=[],arrowMat=mat(0xc5f9e9,.86),arrowHead=keep(new THREE.ConeGeometry(.12,.34,4));
 for(let i=0;i<3;i++){const g=new THREE.Group();g.position.x=-2.72+i*2.25;const shaft=new THREE.Mesh(keep(new THREE.CylinderGeometry(.035,.035,.86,8)),arrowMat);shaft.rotation.z=Math.PI/2;g.add(shaft);const head=new THREE.Mesh(arrowHead,arrowMat);head.rotation.z=-Math.PI/2;head.position.x=.52;g.add(head);arrowGroups.push(g);world.add(g)}
 const packet=new THREE.Mesh(keep(new THREE.SphereGeometry(.11,16,12)),mat(0xf3fff9,.95));world.add(packet);
 const dustGeo=keep(new THREE.BufferGeometry()),dust=[];for(let i=0;i<100;i++){const a=i*2.4,r=4+(i%9)*.18;dust.push(Math.cos(a)*r,(i%11-5)*.25-.25,Math.sin(a)*r*.35-1.1)}dustGeo.setAttribute('position',new THREE.Float32BufferAttribute(dust,3));const dustObj=new THREE.Points(dustGeo,keep(new THREE.PointsMaterial({color:0x6e9bb0,size:.018,transparent:true,opacity:.38,depthWrite:false})));scene.add(dustObj);
 function resize(){const r=host.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=r.width/Math.max(1,r.height);camera.updateProjectionMatrix();request()}
 const ro=typeof ResizeObserver==='function'?new ResizeObserver(resize):null;ro?.observe(host);addEventListener('resize',resize,opts);
 function request(){if(!raf&&!document.hidden)raf=requestAnimationFrame(frame)}
 function frame(now){raf=0;if(document.hidden)return;const animate=!paused&&!reduceMotion.matches;if(animate&&now-last<1000/45){request();return}const dt=Math.min((now-last)/1000||0,.05);last=now;if(animate)time+=dt;world.rotation.set(pitch,yaw,0);camera.position.z=zoom;camera.updateProjectionMatrix();
   groups.forEach((g,i)=>{const active=stage===0||stage===i+1;g.scale.setScalar(active?1:.78);g.traverse(o=>{if(o.material?.opacity!==undefined)o.material.opacity=active?Math.max(o.material.opacity,.18):.07})});
   arrowGroups.forEach((g,i)=>g.children.forEach(o=>{if(o.material)o.material.opacity=stage===0||stage===i+1||stage===i+2?.86:.16}));
   packet.position.set(-3.85+((time*.55)%1)*7.7,.05,.35);packet.visible=stage===0;
   groups[2].rotation.y=time*.4;groups[1].rotation.y=-time*.18;groups[3].rotation.y=time*.16;dustObj.rotation.y=time*.012;renderer.render(scene,camera);if(animate)request()}
 function setStage(v){stage=v;if(caption)caption.textContent=descriptions[v];document.querySelectorAll('[data-scene-stage]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.sceneStage)===v)));request()}
 function down(e){drag=true;lx=e.clientX;ly=e.clientY;heroCanvas.setPointerCapture?.(e.pointerId)}function move(e){if(!drag)return;targetYaw+=(e.clientX-lx)*.008;targetPitch=Math.max(-.55,Math.min(.6,targetPitch+(e.clientY-ly)*.006));lx=e.clientX;ly=e.clientY;request()}function up(){drag=false}
 heroCanvas.addEventListener('pointerdown',down,opts);heroCanvas.addEventListener('pointermove',move,opts);heroCanvas.addEventListener('pointerup',up,opts);heroCanvas.addEventListener('pointercancel',up,opts);heroCanvas.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')targetYaw-=.15;if(e.key==='ArrowRight')targetYaw+=.15;if(e.key==='ArrowUp')targetPitch=Math.min(.6,targetPitch+.1);if(e.key==='ArrowDown')targetPitch=Math.max(-.55,targetPitch-.1);request()},opts);
 controls?.removeAttribute('hidden');controls?.querySelectorAll('[data-scene-stage]').forEach(b=>b.addEventListener('click',()=>setStage(Number(b.dataset.sceneStage)),opts));controls?.querySelectorAll('[data-scene-zoom]').forEach(b=>b.addEventListener('click',()=>{zoom=Math.max(7,Math.min(14,zoom+Number(b.dataset.sceneZoom)));request()},opts));controls?.querySelector('[data-scene-reset]')?.addEventListener('click',()=>{targetYaw=.05;targetPitch=.12;zoom=10.8;setStage(0)},opts);controls?.querySelector('[data-scene-pause]')?.addEventListener('click',e=>{paused=!paused;e.currentTarget.setAttribute('aria-pressed',String(paused));e.currentTarget.textContent=paused?'Resume motion':'Pause motion';request()},opts);
 document.documentElement.dataset.scoutGraphics='ready';resize();setStage(0);request();
 return()=>{abort.abort();cancelAnimationFrame(raf);ro?.disconnect();renderer.dispose();resources.forEach(r=>r.dispose?.())}
}
boot();