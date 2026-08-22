const enhancementSheet = document.createElement('link');
enhancementSheet.rel = 'stylesheet';
enhancementSheet.href = './enhancements.css';
document.head.appendChild(enhancementSheet);

const readingSheet = document.createElement('link');
readingSheet.rel = 'stylesheet';
readingSheet.href = './further-reading.css';
document.head.appendChild(readingSheet);

// Keep Pricing visible in the top navigation on the main product page.
// pricing.html already declares its own Pricing link, so this does not duplicate it there.
const navShell = document.querySelector('.nav-shell');
if (navShell && !navShell.querySelector('[data-pricing-link]')) {
  const pricingLink = document.createElement('a');
  pricingLink.className = 'nav-source nav-pricing';
  pricingLink.dataset.pricingLink = 'true';
  pricingLink.href = './pricing.html';
  pricingLink.textContent = 'Pricing';
  const sourceLink = navShell.querySelector('.nav-source');
  if (sourceLink) navShell.insertBefore(pricingLink, sourceLink);
  else navShell.appendChild(pricingLink);
}

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

// Count only the deterministic values already present in page markup.
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

// Card depth stays attached to the existing boxes. It does not replace or obscure content.
if (!reduceMotion && matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.fx-card, .component-card, .scope-card, .repo-card, .limit-card').forEach(card => {
    const max = Number(card.dataset.tilt || 3.5);
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const ry = (x - 0.5) * max * 2;
      const rx = (0.5 - y) * max * 2;
      card.style.setProperty('--mx', `${x * 100}%`);
      card.style.setProperty('--my', `${y * 100}%`);
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(3px)`;
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

const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const navSections = navLinks
  .map(link => ({ link, target: document.querySelector(link.getAttribute('href')) }))
  .filter(item => item.target);

if (navSections.length) {
  const navObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting);
    if (!visible.length) return;
    visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    const id = `#${visible[0].target.id}`;
    navLinks.forEach(link => {
      const active = link.getAttribute('href') === id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { threshold: [0.15, 0.35, 0.6], rootMargin: '-18% 0px -58% 0px' });
  navSections.forEach(item => navObserver.observe(item.target));
}

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

// Public AI and AI-related writing. URLs are explicit so the footer never guesses article slugs.
const furtherReadingSources = [
  {
    name: 'bradleymatera.dev',
    sourceUrl: 'https://bradleymatera.dev/blog/',
    open: true,
    articles: [
      {
        title: 'How We Built This Coding Style With a GPT Agent and an External Reviewer',
        url: 'https://bradleymatera.dev/coding-style-gpt-agent-external-reviewer/',
      },
      {
        title: 'End to End Projects With AI: A Strict, Verifiable Workflow',
        url: 'https://bradleymatera.dev/ai-end-to-end-projects/',
      },
      {
        title: 'My Real AI Development Setup: Tools and Checks',
        url: 'https://bradleymatera.dev/my-real-ai-development-setup/',
      },
      {
        title: 'How I Built ProjectHub: An Embeddable AI Recruiter Assistant That Runs on Free Tiers',
        url: 'https://bradleymatera.dev/projecthub-embeddable-ai-recruiter-free-tiers/',
      },
    ],
  },
  {
    name: 'DEV Community',
    sourceUrl: 'https://dev.to/bradleymatera',
    open: false,
    articles: [
      {
        title: 'Switching LLMs Mid-Task Is Not as Seamless as It Looks',
        url: 'https://dev.to/bradleymatera/switching-llms-mid-task-is-not-as-seamless-as-it-looks-2cm3',
      },
      {
        title: 'I’m Building Free AI on a VM That Barely Qualifies as a Computer',
        url: 'https://dev.to/bradleymatera/im-building-free-ai-on-a-vm-that-barely-qualifies-as-a-computer-342',
      },
      {
        title: 'How I Built ProjectHub: An Embeddable AI Recruiter Assistant That Runs on Free Tiers',
        url: 'https://dev.to/bradleymatera/how-i-built-projecthub-an-embeddable-ai-recruiter-assistant-that-runs-on-free-tiers-bif',
      },
      {
        title: 'How I Actually Build Full End To End Projects Using AI',
        url: 'https://dev.to/bradleymatera/how-i-actually-build-full-end-to-end-projects-using-ai-42do',
      },
      {
        title: 'Are AI Models Hardwired to Fail?',
        url: 'https://dev.to/bradleymatera/are-ai-models-hardwired-to-fail-2741',
      },
      {
        title: 'AI Didn’t Replace Junior Developers. It Replaced Safe Places To Be One.',
        url: 'https://dev.to/bradleymatera/ai-didnt-replace-junior-developers-it-replaced-safe-places-to-be-one-d91',
      },
      {
        title: 'The AI Review Trap: Why Verification Matters More Than Prompting',
        url: 'https://dev.to/bradleymatera/the-ai-review-trap-why-verification-matters-more-than-prompting-3lak',
      },
      {
        title: 'The Developer Pay Paradox: Are Junior Devs, Staff Engineers and Most Developers Over- or Under-paid?',
        url: 'https://dev.to/bradleymatera/the-developer-pay-paradox-are-junior-devs-staff-engineers-and-most-developers-over-or-under-paid-oid',
      },
      {
        title: 'AI Policy Is Becoming the New Entry-Level Gatekeeping',
        url: 'https://dev.to/bradleymatera/ai-policy-is-becoming-the-new-entry-level-gatekeeping-1d4o',
      },
      {
        title: 'Senior Engineers Complaining About Juniors Are Missing the Point',
        url: 'https://dev.to/bradleymatera/senior-engineers-complaining-about-juniors-are-missing-the-point-2ch6',
      },
      {
        title: 'Entry-Level Job Descriptions Are Becoming Broken Product Specs',
        url: 'https://dev.to/bradleymatera/entry-level-job-descriptions-are-becoming-broken-product-specs-hgc',
      },
      {
        title: 'Testing Bifrost CLI and Code Mode: What Worked, What Broke, and What I Verified',
        url: 'https://dev.to/bradleymatera/testing-bifrost-cli-and-code-mode-what-worked-what-broke-and-what-i-verified-7c3',
      },
      {
        title: 'My Real AI Development Setup',
        url: 'https://dev.to/bradleymatera/how-i-actually-use-agentic-ai-tools-in-vs-code-webflow-and-aws-2kad',
      },
    ],
  },
  {
    name: 'SLOPSTACK',
    sourceUrl: 'https://www.slopstack.dev/guides',
    open: false,
    articles: [
      {
        title: 'The AI Review Trap: Why Junior Developers Need Verification, Not Confidence',
        url: 'https://www.slopstack.dev/guides/ai-review-trap-verification-over-confidence',
      },
    ],
  },
];

function createFurtherReading() {
  const footer = document.querySelector('footer');
  if (!footer || footer.querySelector('.further-reading')) return;

  const section = document.createElement('section');
  section.className = 'further-reading';
  section.setAttribute('aria-labelledby', 'further-reading-title');

  const shell = document.createElement('div');
  shell.className = 'shell';

  const head = document.createElement('div');
  head.className = 'further-reading-head';
  head.innerHTML = `
    <div>
      <span class="further-reading-kicker">Further reading</span>
      <h2 id="further-reading-title">AI, LLMs, agents and AI-assisted development.</h2>
    </div>
    <p>Published articles and guides grouped by their original source. Duplicate subjects are kept when they were separately published on more than one source.</p>
  `;
  shell.appendChild(head);

  for (const source of furtherReadingSources) {
    const details = document.createElement('details');
    details.className = 'reading-source';
    details.open = source.open;

    const summary = document.createElement('summary');
    summary.innerHTML = `
      <span class="reading-source-name">${source.name}</span>
      <span class="reading-source-count">${source.articles.length} ${source.articles.length === 1 ? 'article' : 'articles'}</span>
    `;
    details.appendChild(summary);

    const list = document.createElement('div');
    list.className = 'reading-list';

    for (const article of source.articles) {
      const link = document.createElement('a');
      link.className = 'reading-link';
      link.href = article.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.innerHTML = `
        <span>
          <span class="reading-link-title">${article.title}</span>
          <span class="reading-link-meta">${source.name}</span>
        </span>
        <span class="reading-link-arrow" aria-hidden="true">↗</span>
      `;
      list.appendChild(link);
    }

    details.appendChild(list);

    const sourceFooter = document.createElement('div');
    sourceFooter.className = 'reading-source-footer';
    const sourceLink = document.createElement('a');
    sourceLink.href = source.sourceUrl;
    sourceLink.target = '_blank';
    sourceLink.rel = 'noopener';
    sourceLink.textContent = `View ${source.name} source ↗`;
    sourceFooter.appendChild(sourceLink);
    details.appendChild(sourceFooter);

    shell.appendChild(details);
  }

  const note = document.createElement('p');
  note.className = 'further-reading-note';
  note.textContent = 'This list is limited to public articles and guides identified as AI or AI-related writing. Social posts, drafts and unpublished notes are not included.';
  shell.appendChild(note);

  section.appendChild(shell);
  footer.insertBefore(section, footer.firstChild);
}

createFurtherReading();
