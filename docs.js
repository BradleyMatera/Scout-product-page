(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sections = [...document.querySelectorAll('.docs-section[id]')];
  const navLinks = [...document.querySelectorAll('.docs-nav a[href^="#"]')];
  const search = document.querySelector('.docs-search');
  const content = document.querySelector('.docs-content');
  const mobileSelect = document.querySelector('.docs-mobile-nav select');

  const byId = new Map(navLinks.map(link => [link.getAttribute('href').slice(1), link]));

  function setActive(id) {
    navLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (mobileSelect && mobileSelect.value !== id) mobileSelect.value = id;
  }

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting);
      if (!visible.length) return;
      visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      setActive(visible[0].target.id);
    }, { threshold: [0.08, 0.2, 0.45], rootMargin: '-12% 0px -68% 0px' });
    sections.forEach(section => observer.observe(section));
  }

  navLinks.forEach(link => {
    link.addEventListener('click', event => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      history.replaceState(null, '', `#${id}`);
      setActive(id);
    });
  });

  mobileSelect?.addEventListener('change', () => {
    const target = document.getElementById(mobileSelect.value);
    if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9+#./_-]+/g, ' ').trim();
  }

  search?.addEventListener('input', () => {
    const query = normalize(search.value);
    let visibleCount = 0;

    sections.forEach(section => {
      const haystack = normalize(section.dataset.search || section.textContent);
      const visible = !query || query.split(/\s+/).every(term => haystack.includes(term));
      section.classList.toggle('search-hidden', !visible);
      byId.get(section.id)?.classList.toggle('hidden', !visible);
      if (visible) visibleCount++;
    });

    content?.classList.toggle('search-empty', visibleCount === 0);
  });

  document.querySelectorAll('.docs-code').forEach(block => {
    const pre = block.querySelector('pre');
    const button = block.querySelector('.docs-copy');
    if (!pre || !button) return;
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pre.innerText);
        const old = button.textContent;
        button.textContent = 'Copied';
        button.classList.add('copied');
        setTimeout(() => {
          button.textContent = old;
          button.classList.remove('copied');
        }, 1200);
      } catch {
        button.textContent = 'Select text';
      }
    });
  });

  if (location.hash) {
    const id = location.hash.slice(1);
    if (document.getElementById(id)) setActive(id);
  } else if (sections[0]) {
    setActive(sections[0].id);
  }
})();
