const sceneStyle = document.createElement('link');
sceneStyle.rel = 'stylesheet';
sceneStyle.href = './scene.css';
document.head.appendChild(sceneStyle);

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  }
}, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });

document.querySelectorAll('.reveal').forEach(el => {
  if (reduceMotion) el.classList.add('visible');
  else revealObserver.observe(el);
});

const focusObserver = new IntersectionObserver(entries => {
  const candidates = entries.filter(entry => entry.isIntersecting);
  if (!candidates.length) return;
  candidates.sort((a,b) => b.intersectionRatio - a.intersectionRatio);
  const focus = candidates[0].target.dataset.sceneFocus;
  if (focus && typeof window.scoutSetSceneFocus === 'function') window.scoutSetSceneFocus(focus);
}, { threshold: [0.2, 0.4, 0.6], rootMargin: '-18% 0px -38% 0px' });

document.querySelectorAll('[data-scene-focus]').forEach(section => focusObserver.observe(section));

const header = document.querySelector('.site-header');
let lastY = scrollY;
addEventListener('scroll', () => {
  const y = scrollY;
  header?.classList.toggle('scrolled', y > 12);
  header?.classList.toggle('header-hidden', y > lastY && y > 420 && innerWidth < 760);
  lastY = y;
}, { passive: true });

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
