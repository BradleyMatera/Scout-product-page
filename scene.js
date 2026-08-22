import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js';

const canvas = document.querySelector('#ambient-three');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (error) {
    console.warn('Ambient Three.js renderer unavailable:', error);
  }

  if (renderer) {
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, innerWidth / innerHeight, 0.1, 100);
    camera.position.set(0, 2.6, 10.5);

    const root = new THREE.Group();
    scene.add(root);

    const green = new THREE.Color(0x79eab3);
    const blue = new THREE.Color(0x6da9ff);

    // A low-contrast wire plane creates depth behind the document without becoming content.
    const gridGeo = new THREE.PlaneGeometry(34, 22, 42, 28);
    const gridMat = new THREE.MeshBasicMaterial({ color: 0x33516a, wireframe: true, transparent: true, opacity: 0.075 });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    grid.rotation.x = -Math.PI / 2.25;
    grid.position.set(0, -4.0, -4.5);
    root.add(grid);

    // Sparse depth particles. They stay slow and subtle so the page content remains dominant.
    const particleCount = innerWidth < 760 ? 70 : 150;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSeeds = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 20;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      particlePositions[i * 3 + 2] = -2 - Math.random() * 12;
      particleSeeds[i] = Math.random() * Math.PI * 2;
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(
      particlesGeo,
      new THREE.PointsMaterial({ color: 0x6f8798, size: 0.027, transparent: true, opacity: 0.48, sizeAttenuation: true })
    );
    root.add(particles);

    // Thin light ribbons create movement at the edges of the page, not a central object.
    function ribbon(color, x, z, opacity) {
      const geometry = new THREE.PlaneGeometry(0.018, 18);
      const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, 0, z);
      mesh.rotation.z = 0.22;
      root.add(mesh);
      return mesh;
    }
    const ribbonA = ribbon(green, -6.8, -4.0, 0.11);
    const ribbonB = ribbon(blue, 7.1, -5.5, 0.08);

    // Soft luminous points move behind sections and create depth while scrolling.
    const glowGroup = new THREE.Group();
    const glowMatA = new THREE.MeshBasicMaterial({ color: green, transparent: true, opacity: 0.055, blending: THREE.AdditiveBlending, depthWrite: false });
    const glowMatB = new THREE.MeshBasicMaterial({ color: blue, transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending, depthWrite: false });
    const glowGeo = new THREE.CircleGeometry(2.3, 48);
    const glowA = new THREE.Mesh(glowGeo, glowMatA);
    glowA.position.set(5.5, 3.0, -7.5);
    const glowB = new THREE.Mesh(glowGeo, glowMatB);
    glowB.position.set(-5.5, -2.2, -8.5);
    glowGroup.add(glowA, glowB);
    root.add(glowGroup);

    const pointer = new THREE.Vector2(0, 0);
    const pointerTarget = new THREE.Vector2(0, 0);
    let scrollTarget = 0;
    let scrollValue = 0;

    addEventListener('pointermove', event => {
      pointerTarget.x = (event.clientX / innerWidth - 0.5) * 2;
      pointerTarget.y = (event.clientY / innerHeight - 0.5) * 2;
    }, { passive: true });

    addEventListener('scroll', () => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      scrollTarget = scrollY / max;
    }, { passive: true });

    function resize() {
      const w = innerWidth;
      const h = innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
    addEventListener('resize', resize, { passive: true });
    resize();

    const clock = new THREE.Clock();
    const basePositions = particlePositions.slice();

    function animate() {
      const t = clock.getElapsedTime();
      pointer.lerp(pointerTarget, 0.025);
      scrollValue += (scrollTarget - scrollValue) * 0.035;

      camera.position.x += ((reduceMotion ? 0 : pointer.x * 0.28) - camera.position.x) * 0.025;
      camera.position.y += ((2.6 + (reduceMotion ? 0 : -pointer.y * 0.2)) - camera.position.y) * 0.025;
      camera.lookAt(0, -0.7, -4.5);

      if (!reduceMotion) {
        grid.position.y = -4.0 + Math.sin(t * 0.14) * 0.16;
        grid.rotation.z = Math.sin(t * 0.08) * 0.012;
        grid.material.opacity = 0.06 + Math.sin(t * 0.22) * 0.012;

        ribbonA.position.y = Math.sin(t * 0.2) * 1.2 + (scrollValue - 0.5) * 2.5;
        ribbonB.position.y = Math.cos(t * 0.17) * 1.4 - (scrollValue - 0.5) * 2.0;
        ribbonA.material.opacity = 0.08 + Math.sin(t * 0.5) * 0.025;
        ribbonB.material.opacity = 0.06 + Math.cos(t * 0.42) * 0.02;

        glowA.position.y = 3.0 - scrollValue * 5.0 + Math.sin(t * 0.12) * 0.3;
        glowB.position.y = -2.2 + scrollValue * 4.0 + Math.cos(t * 0.11) * 0.3;

        const pos = particlesGeo.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          pos[i * 3] = basePositions[i * 3] + Math.sin(t * 0.08 + particleSeeds[i]) * 0.12;
          pos[i * 3 + 1] = basePositions[i * 3 + 1] + Math.cos(t * 0.1 + particleSeeds[i]) * 0.18 - scrollValue * 1.4;
        }
        particlesGeo.attributes.position.needsUpdate = true;
        particles.rotation.z = Math.sin(t * 0.04) * 0.01;
      }

      renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);
  }
}
