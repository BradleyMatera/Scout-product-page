import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js';

const canvas = document.querySelector('#ambient-three');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer:fine)').matches;

if (canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    });
  } catch (error) {
    console.warn('Scout ambient renderer unavailable:', error);
  }

  if (renderer) {
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.45));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070a0f, 0.075);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
    camera.position.set(0, 1.2, 9.6);

    const world = new THREE.Group();
    scene.add(world);

    const COLORS = {
      green: new THREE.Color(0x79eab3),
      blue: new THREE.Color(0x6da9ff),
      amber: new THREE.Color(0xe9c36f),
      steel: new THREE.Color(0x7890a3),
    };

    // Environmental depth only. Nothing in this scene is semantic UI.
    const particleCount = innerWidth < 760 ? 100 : 220;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSeeds = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 22;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 17;
      particlePositions[i * 3 + 2] = -3 - Math.random() * 18;
      particleSeeds[i] = Math.random() * Math.PI * 2;
    }
    const basePositions = particlePositions.slice();
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: COLORS.steel,
      size: innerWidth < 760 ? 0.022 : 0.028,
      transparent: true,
      opacity: 0.34,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    world.add(particles);

    const grid = new THREE.GridHelper(34, 44, 0x315067, 0x1b2b38);
    grid.position.set(0, -4.5, -8);
    grid.material.transparent = true;
    grid.material.opacity = 0.15;
    world.add(grid);

    const ceiling = new THREE.GridHelper(28, 36, 0x2e4e65, 0x172630);
    ceiling.position.set(0, 7.1, -11);
    ceiling.rotation.z = Math.PI;
    ceiling.material.transparent = true;
    ceiling.material.opacity = 0.045;
    world.add(ceiling);

    // Large low-opacity wire forms sit at the page edges, never in front of content.
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: COLORS.green,
      wireframe: true,
      transparent: true,
      opacity: 0.048,
      depthWrite: false,
    });
    const formA = new THREE.Mesh(new THREE.TorusKnotGeometry(2.5, 0.34, 88, 8, 2, 3), ringMaterial.clone());
    formA.position.set(8.1, 3.4, -8.5);
    formA.rotation.set(0.8, 0.1, -0.5);
    world.add(formA);

    const formBMaterial = ringMaterial.clone();
    formBMaterial.color = COLORS.blue;
    formBMaterial.opacity = 0.036;
    const formB = new THREE.Mesh(new THREE.IcosahedronGeometry(3.1, 1), formBMaterial);
    formB.position.set(-8.5, -3.2, -10.5);
    formB.rotation.set(0.25, 0.55, 0.2);
    world.add(formB);

    const ringCMaterial = ringMaterial.clone();
    ringCMaterial.color = COLORS.steel;
    ringCMaterial.opacity = 0.022;
    const ringC = new THREE.Mesh(new THREE.TorusGeometry(5.4, 0.018, 4, 112), ringCMaterial);
    ringC.position.set(0, 1.1, -14);
    ringC.rotation.set(1.22, 0.2, 0.2);
    world.add(ringC);

    const linePoints = [];
    for (let i = 0; i < 36; i++) {
      const y = -6 + Math.random() * 13;
      const z = -7 - Math.random() * 12;
      const x = (Math.random() > 0.5 ? 1 : -1) * (4.5 + Math.random() * 7);
      linePoints.push(x, y, z, x + (Math.random() - 0.5) * 2.7, y, z);
    }
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      color: COLORS.green,
      transparent: true,
      opacity: 0.075,
      depthWrite: false,
    });
    const circuitLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    world.add(circuitLines);

    const pointer = new THREE.Vector2(0, 0);
    const pointerTarget = new THREE.Vector2(0, 0);
    let scrollProgress = 0;
    const currentAccent = COLORS.green.clone();
    let targetAccent = COLORS.green.clone();

    if (finePointer && !reduceMotion) {
      addEventListener('pointermove', event => {
        pointerTarget.x = (event.clientX / innerWidth - 0.5) * 2;
        pointerTarget.y = (event.clientY / innerHeight - 0.5) * 2;
      }, { passive: true });
    }

    function updateScroll() {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      scrollProgress = Math.min(1, Math.max(0, scrollY / max));
    }
    addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();

    const sectionThemes = {
      architecture: 'green',
      implementation: 'green',
      verification: 'blue',
      scope: 'amber',
      regression: 'green',
      history: 'blue',
      status: 'green',
      roadmap: 'amber',
      limits: 'amber',
    };

    const sectionObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting);
      if (!visible.length) return;
      visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      const tone = sectionThemes[visible[0].target.id] || 'green';
      targetAccent = COLORS[tone].clone();
      document.documentElement.dataset.sceneTone = tone;
    }, { threshold: [0.18, 0.35, 0.55], rootMargin: '-18% 0px -46% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));

    function resize() {
      camera.aspect = innerWidth / Math.max(1, innerHeight);
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight, false);
    }
    addEventListener('resize', resize, { passive: true });
    resize();

    const clock = new THREE.Clock();
    let lastFrame = 0;

    function frame(now) {
      if (!reduceMotion && now - lastFrame < 31) {
        requestAnimationFrame(frame);
        return;
      }
      lastFrame = now;
      const t = clock.getElapsedTime();

      pointer.lerp(pointerTarget, reduceMotion ? 1 : 0.045);
      currentAccent.lerp(targetAccent, 0.035);

      const scrollYWorld = scrollProgress * 4.8;
      const wantedX = reduceMotion ? 0 : pointer.x * 0.22;
      const wantedY = 1.2 - scrollYWorld + (reduceMotion ? 0 : -pointer.y * 0.16);
      camera.position.x += (wantedX - camera.position.x) * 0.035;
      camera.position.y += (wantedY - camera.position.y) * 0.035;
      camera.lookAt(0, camera.position.y * 0.18, -7.5);

      formA.material.color.copy(currentAccent);
      lineMaterial.color.copy(currentAccent);

      if (!reduceMotion) {
        formA.rotation.y += 0.0017;
        formA.rotation.z += 0.0007;
        formB.rotation.x -= 0.0006;
        formB.rotation.y += 0.0010;
        ringC.rotation.z += 0.0004;
        particles.rotation.y = t * 0.0055;
        grid.position.z = -8 + ((scrollProgress * 4) % 1.1);
        grid.position.y = -4.5 + Math.sin(t * 0.12) * 0.08;

        const pos = particleGeometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          pos[i * 3] = basePositions[i * 3] + Math.sin(t * 0.06 + particleSeeds[i]) * 0.10;
          pos[i * 3 + 1] = basePositions[i * 3 + 1] + Math.cos(t * 0.08 + particleSeeds[i]) * 0.14 - scrollProgress * 1.2;
        }
        particleGeometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }
}
