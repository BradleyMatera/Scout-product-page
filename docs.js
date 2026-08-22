(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sections = [...document.querySelectorAll('.docs-section[id]')];
  const navLinks = [...document.querySelectorAll('.docs-nav a[href^="#"]')];
  const search = document.querySelector('.docs-search');
  const content = document.querySelector('.docs-content');
  const mobileSelect = document.querySelector('.docs-mobile-nav select');

  // The Docs landing page points new readers to the separate engineering teaching
  // guide. API/Changelog/Learn reuse this script but should not receive the extra CTA.
  if (/docs\.html$/i.test(location.pathname)) {
    const actions = document.querySelector('.subpage-actions');
    if (actions && !actions.querySelector('[href="./learn.html"]')) {
      const learnLink = document.createElement('a');
      learnLink.className = 'button';
      learnLink.href = './learn.html';
      learnLink.textContent = 'Learn how Scout works';
      actions.insertBefore(learnLink, actions.lastElementChild || null);
    }

    const sidebarHead = document.querySelector('.docs-sidebar-head');
    if (sidebarHead && !sidebarHead.querySelector('[href="./learn.html"]')) {
      const row = document.createElement('div');
      row.className = 'docs-source-row';
      row.innerHTML = '<a href="./learn.html">Start with the teaching guide →</a>';
      sidebarHead.appendChild(row);
    }
  }

  // Teaching-guide clarification: active retrieval is lexical BM25/RRF. RAG is
  // an architectural pattern and does not imply embeddings or a vector database.
  if (/learn\.html$/i.test(location.pathname)) {
    const mental = document.getElementById('mental-model');
    if (mental && !mental.querySelector('[data-vector-clarification]')) {
      const note = document.createElement('div');
      note.dataset.vectorClarification = 'true';
      note.className = 'docs-callout production';
      note.innerHTML = '<strong>Scout does not currently need a vector database for its active retrieval path.</strong> The executable path traced in this guide builds plain-text chunks and ranks them with BM25/RRF. “RAG” only means retrieval is used to augment generation; RAG can be implemented with lexical search, vector search, hybrid search, databases, APIs, or other retrieval systems. A legacy-looking <code>hash-vector-local</code> label still appears in health metadata, but the current retrieval implementation documented here is BM25/RRF. <div class="docs-source-row"><a href="https://github.com/BradleyMatera/ProjectHub/blob/develop/lib/rag-chunks.js" target="_blank" rel="noopener">Source: chunk corpus ↗</a><a href="https://github.com/BradleyMatera/ProjectHub/blob/develop/lib/bm25.js" target="_blank" rel="noopener">Source: active lexical index ↗</a><a href="https://github.com/BradleyMatera/ProjectHub/blob/develop/lib/rrf.js" target="_blank" rel="noopener">Source: rank fusion ↗</a></div>';
      mental.appendChild(note);
    }

    const glossary = document.querySelector('#glossary .glossary-grid');
    if (glossary) {
      const additions = [
        ['Embedding', 'A numeric vector representation of data, often produced by a neural model so semantically related items have nearby vectors. Scout’s active BM25/RRF retrieval path does not require embeddings.'],
        ['Vector search', 'Retrieval by comparing numeric vectors with a similarity or distance function such as cosine similarity, dot product, or Euclidean distance. This is different from Scout’s current lexical BM25 ranking.'],
        ['Vector database', 'A database/index specialized for storing vectors and retrieving nearest neighbors. A RAG system may use one, but RAG does not require one and Scout’s current retrieval path does not depend on one.'],
        ['Semantic search', 'Search intended to match meaning rather than only exact words. Embedding-based vector retrieval is one approach. Scout instead improves lexical retrieval with normalization, aliases, context rewriting, BM25, RRF, and deterministic re-ranking.'],
        ['Deterministic', 'Given the same inputs and configuration, ordinary code follows the same defined rules and calculations. BM25, RRF, tool functions, contracts, and most validators are deterministic.'],
        ['Generative', 'Produces new output rather than only selecting stored values. In Scout, the language-model call is the main generative component.']
      ];
      for (const [term, definition] of additions) {
        if ([...glossary.querySelectorAll('dt')].some(dt => dt.textContent === term)) continue;
        const wrapper = document.createElement('div');
        wrapper.className = 'glossary-term';
        wrapper.innerHTML = `<dt>${term}</dt><dd>${definition}</dd>`;
        glossary.appendChild(wrapper);
      }
    }
  }

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
