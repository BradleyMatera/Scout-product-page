import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js';

const mount = document.querySelector('#scout-viewport');
const rendererState = document.querySelector('#renderer-state');
const focusLabel = document.querySelector('#scene-focus-label');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const focusNames = {
  core: 'orchestration core', input: 'browser input', query: 'query understanding',
  retrieval: 'BM25 / RRF retrieval', contract: 'response contract + tools',
  model: 'Cloudflare model generation', validation: 'validation / repair', output: 'reply + telemetry'
};

if (!mount) throw new Error('Scout viewport missing');

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
} catch (error) {
  rendererState.textContent = 'static system map';
  console.warn('Scout 3D renderer unavailable:', error);
}

if (renderer) {
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  mount.prepend(renderer.domElement);
  mount.dataset.rendered = 'true';
  rendererState.textContent = 'three.js r185 · WebGL';

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 1.4, 12.2);

  const root = new THREE.Group();
  scene.add(root);

  const green = new THREE.Color(0x79eab3);
  const blue = new THREE.Color(0x6da9ff);
  const steel = new THREE.Color(0x7f93a5);
  const dark = new THREE.Color(0x0b1118);

  scene.add(new THREE.AmbientLight(0x9db5c8, 0.7));
  const key = new THREE.PointLight(0x79eab3, 28, 20, 2);
  key.position.set(-3, 4, 7);
  scene.add(key);
  const rim = new THREE.PointLight(0x6da9ff, 24, 18, 2);
  rim.position.set(4, -2, 5);
  scene.add(rim);

  const coreGroup = new THREE.Group();
  const coreGeo = new THREE.IcosahedronGeometry(1.18, 2);
  const coreMat = new THREE.MeshPhysicalMaterial({
    color: 0x0e1918, emissive: 0x123c2b, emissiveIntensity: 0.72,
    roughness: 0.28, metalness: 0.58, clearcoat: 0.7, clearcoatRoughness: 0.24,
    wireframe: false
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.userData.focus = 'core';
  coreGroup.add(core);

  const coreWire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.22, 2),
    new THREE.MeshBasicMaterial({ color: green, wireframe: true, transparent: true, opacity: 0.16 })
  );
  coreGroup.add(coreWire);

  const ringA = new THREE.Mesh(
    new THREE.TorusGeometry(1.72, 0.018, 8, 128),
    new THREE.MeshBasicMaterial({ color: green, transparent: true, opacity: 0.6 })
  );
  ringA.rotation.x = Math.PI / 2.55;
  coreGroup.add(ringA);

  const ringB = new THREE.Mesh(
    new THREE.TorusGeometry(2.02, 0.012, 8, 128),
    new THREE.MeshBasicMaterial({ color: blue, transparent: true, opacity: 0.34 })
  );
  ringB.rotation.set(Math.PI / 2.15, 0.3, 0.35);
  coreGroup.add(ringB);
  root.add(coreGroup);

  const nodeDefs = [
    { id: 'input', label: '01 · BROWSER', pos: [-4.55, 2.3, -0.2], color: steel },
    { id: 'query', label: '02 · QUERY', pos: [-2.55, 3.55, -0.6], color: green },
    { id: 'retrieval', label: '03 · BM25 / RRF', pos: [-3.85, -2.35, 0], color: green },
    { id: 'contract', label: '04 · CONTRACT / TOOLS', pos: [0, 4.05, -0.9], color: green },
    { id: 'model', label: '05 · 8B MODEL', pos: [4.25, 2.3, -0.3], color: blue },
    { id: 'validation', label: '06 · VALIDATION', pos: [4.0, -2.35, -0.1], color: green },
    { id: 'output', label: '07 · OUTPUT', pos: [0, -4.15, -0.45], color: steel }
  ];

  const meshes = new Map();
  const labels = new Map();
  const nodeGeo = new THREE.OctahedronGeometry(0.35, 0);
  const nodeWireGeo = new THREE.OctahedronGeometry(0.47, 0);

  for (const def of nodeDefs) {
    const group = new THREE.Group();
    group.position.set(...def.pos);
    group.userData.focus = def.id;
    const mat = new THREE.MeshPhysicalMaterial({
      color: dark, emissive: def.color.clone().multiplyScalar(0.22), emissiveIntensity: 0.8,
      roughness: 0.38, metalness: 0.55
    });
    const mesh = new THREE.Mesh(nodeGeo, mat);
    mesh.userData.focus = def.id;
    const wire = new THREE.Mesh(nodeWireGeo, new THREE.MeshBasicMaterial({ color: def.color, wireframe: true, transparent: true, opacity: 0.5 }));
    wire.userData.focus = def.id;
    group.add(mesh, wire);
    root.add(group);
    meshes.set(def.id, { group, mesh, wire, color: def.color });

    const label = document.createElement('div');
    label.className = `scene-label scene-label-${def.id}`;
    label.textContent = def.label;
    label.dataset.focus = def.id;
    mount.appendChild(label);
    labels.set(def.id, label);
  }

  const edges = [
    ['input', 'query'], ['query', 'retrieval'], ['retrieval', 'contract'], ['contract', 'model'],
    ['model', 'validation'], ['validation', 'output'], ['output', 'core'], ['core', 'input'],
    ['retrieval', 'core'], ['contract', 'core'], ['model', 'core'], ['validation', 'core']
  ];

  const edgeGroup = new THREE.Group();
  root.add(edgeGroup);
  const edgeData = [];
  function posFor(id) { return id === 'core' ? new THREE.Vector3(0,0,0) : meshes.get(id).group.position.clone(); }
  for (let i = 0; i < edges.length; i++) {
    const [a,b] = edges[i];
    const start = posFor(a); const end = posFor(b);
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const modelEdge = a === 'model' || b === 'model';
    const material = new THREE.LineBasicMaterial({ color: modelEdge ? blue : green, transparent: true, opacity: i < 8 ? 0.28 : 0.14 });
    edgeGroup.add(new THREE.Line(geometry, material));

    const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 10), new THREE.MeshBasicMaterial({ color: modelEdge ? blue : green, transparent: true, opacity: 0.85 }));
    edgeGroup.add(pulse);
    edgeData.push({ start, end, pulse, offset: i / edges.length, speed: 0.055 + (i % 4) * 0.009 });
  }

  const particlesGeo = new THREE.BufferGeometry();
  const particleCount = innerWidth < 700 ? 90 : 180;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const radius = 3.1 + Math.random() * 3.5;
    const angle = Math.random() * Math.PI * 2;
    positions[i*3] = Math.cos(angle) * radius;
    positions[i*3+1] = (Math.random() - 0.5) * 7.7;
    positions[i*3+2] = (Math.random() - 0.5) * 3.6 - 1.2;
  }
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particles = new THREE.Points(particlesGeo, new THREE.PointsMaterial({ color: 0x7994a8, size: 0.025, transparent: true, opacity: 0.52, sizeAttenuation: true }));
  root.add(particles);

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 18, 30, 30),
    new THREE.MeshBasicMaterial({ color: 0x284056, wireframe: true, transparent: true, opacity: 0.06 })
  );
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -5.1;
  root.add(plane);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(2, 2);
  const targetPointer = new THREE.Vector2(0, 0);
  let activeFocus = 'core';
  let hoveredFocus = null;

  const focusCamera = {
    core: [0, 1.4, 12.2], input: [-1.1, 1.7, 12.5], query: [-.65, 1.3, 12.2],
    retrieval: [-1.0, .7, 12.0], contract: [0, 1.85, 11.8], model: [1.15, 1.55, 12.1],
    validation: [1.05, .6, 12.0], output: [0, .1, 12.0]
  };

  function setFocus(id, fromScene = false) {
    if (!focusNames[id]) return;
    activeFocus = id;
    focusLabel.textContent = focusNames[id];
    document.querySelectorAll('.flow-node').forEach(el => el.classList.toggle('active', el.dataset.focus === id));
    document.querySelectorAll('.scene-label').forEach(el => el.classList.toggle('active', el.dataset.focus === id));
    for (const [key, item] of meshes) {
      const on = key === id;
      item.wire.material.opacity = on ? 0.95 : 0.45;
      item.mesh.material.emissiveIntensity = on ? 1.75 : 0.8;
      item.group.scale.setScalar(on ? 1.28 : 1);
    }
    coreMat.emissiveIntensity = id === 'core' ? 1.15 : 0.58;
    if (fromScene) document.querySelector(`[data-focus="${id}"]`)?.focus({ preventScroll: true });
  }
  window.scoutSetSceneFocus = setFocus;

  document.querySelectorAll('.flow-node').forEach(button => {
    button.addEventListener('mouseenter', () => setFocus(button.dataset.focus));
    button.addEventListener('focus', () => setFocus(button.dataset.focus));
    button.addEventListener('click', () => setFocus(button.dataset.focus));
  });

  mount.addEventListener('pointermove', event => {
    const rect = mount.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    targetPointer.set(pointer.x, pointer.y);
  }, { passive: true });
  mount.addEventListener('pointerleave', () => { pointer.set(2,2); targetPointer.set(0,0); hoveredFocus = null; mount.style.cursor = 'crosshair'; });
  mount.addEventListener('click', () => { if (hoveredFocus) setFocus(hoveredFocus, true); });

  function resize() {
    const rect = mount.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
    renderer.setSize(rect.width, rect.height, false);
  }
  new ResizeObserver(resize).observe(mount);
  resize();

  const visibleMeshes = [core, ...[...meshes.values()].flatMap(item => [item.mesh, item.wire])];
  const clock = new THREE.Clock();
  const tmp = new THREE.Vector3();

  function updateLabels() {
    const w = mount.clientWidth; const h = mount.clientHeight;
    for (const def of nodeDefs) {
      tmp.copy(meshes.get(def.id).group.position).applyMatrix4(root.matrixWorld).project(camera);
      const label = labels.get(def.id);
      const visible = tmp.z > -1 && tmp.z < 1;
      label.style.opacity = visible ? '1' : '0';
      label.style.transform = `translate(-50%,-50%) translate(${(tmp.x*.5+.5)*w}px,${(-tmp.y*.5+.5)*h}px)`;
    }
  }

  function animate() {
    const t = clock.getElapsedTime();
    const wanted = focusCamera[activeFocus] || focusCamera.core;
    const parallaxX = reduceMotion ? 0 : targetPointer.x * 0.35;
    const parallaxY = reduceMotion ? 0 : targetPointer.y * 0.22;
    camera.position.x += (wanted[0] + parallaxX - camera.position.x) * 0.035;
    camera.position.y += (wanted[1] + parallaxY - camera.position.y) * 0.035;
    camera.position.z += (wanted[2] - camera.position.z) * 0.035;
    camera.lookAt(0,0,0);

    if (!reduceMotion) {
      core.rotation.y = t * 0.11;
      core.rotation.x = Math.sin(t * 0.35) * 0.12;
      coreWire.rotation.y = -t * 0.075;
      ringA.rotation.z = t * 0.07;
      ringB.rotation.z = -t * 0.055;
      particles.rotation.y = t * 0.012;
      root.rotation.z = Math.sin(t * 0.1) * 0.008;
      for (const item of meshes.values()) item.wire.rotation.y = t * 0.26;
      for (const edge of edgeData) {
        const f = (t * edge.speed + edge.offset) % 1;
        edge.pulse.position.lerpVectors(edge.start, edge.end, f);
        edge.pulse.material.opacity = Math.sin(f * Math.PI) * 0.85;
      }
    }

    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(visibleMeshes, false)[0];
    const nextHover = hit?.object?.userData?.focus || null;
    if (nextHover !== hoveredFocus) {
      hoveredFocus = nextHover;
      mount.style.cursor = hoveredFocus ? 'pointer' : 'crosshair';
    }

    root.updateMatrixWorld();
    updateLabels();
    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);
  setFocus('core');
}
