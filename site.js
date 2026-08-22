const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  }
}, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });

document.querySelectorAll('.reveal, .metric-card').forEach(el => {
  if (reduceMotion) el.classList.add('visible');
  else revealObserver.observe(el);
});

// Count metrics only when they enter view. Values remain deterministic and come from the page markup.
const countObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const el = entry.target;
    const target = Number(el.dataset.count || 0);
    const decimals = Number(el.dataset.decimals || 0);
    if (reduceMotion) {
      el.textContent = target.toFixed(decimals);
    } else {
      const start = performance.now();
      const duration = 900;
      const tick = now => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
    countObserver.unobserve(el);
  }
}, { threshold: 0.7 });
document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

// Subtle card perspective: depth effect only, no semantic 3D object.
if (!reduceMotion && matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.fx-card').forEach(card => {
    const max = Number(card.dataset.tilt || 4);
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const ry = (x - 0.5) * max * 2;
      const rx = (0.5 - y) * max * 2;
      card.style.setProperty('--mx', `${x * 100}%`);
      card.style.setProperty('--my', `${y * 100}%`);
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(4px)`;
    }, { passive: true });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
    });
  });
}

const header = document.querySelector('.site-header');
const progress = document.querySelector('.scroll-progress span');
const timeline = document.querySelector('.timeline');
let lastY = scrollY;

function updateScrollState() {
  const y = scrollY;
  const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  const pct = Math.min(1, Math.max(0, y / max));
  if (progress) progress.style.width = `${pct * 100}%`;

  header?.classList.toggle('scrolled', y > 12);
  header?.classList.toggle('header-hidden', y > lastY && y > 420 && innerWidth < 760);
  lastY = y;

  if (timeline) {
    const rect = timeline.getBoundingClientRect();
    const start = innerHeight * 0.78;
    const end = innerHeight * 0.22;
    const total = rect.height + start - end;
    const value = Math.min(1, Math.max(0, (start - rect.top) / total));
    timeline.style.setProperty('--timeline-progress', `${value * 100}%`);
  }
}

addEventListener('scroll', updateScrollState, { passive: true });
addEventListener('resize', updateScrollState, { passive: true });
updateScrollState();

for (const link of document.querySelectorAll('a[href^="#"]')) {
  link.addEventListener('click', event => {
    const id = link.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
}
