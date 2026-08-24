(() => {
  'use strict';

  // Dated source-state correction layered after freshness.js. This exists because
  // ProjectHub moves faster than the long-form documentation pages. Keep it small:
  // source/branch/test state only. Algorithm and accounting explanations live elsewhere.
  const SNAPSHOT = {
    audited: 'August 24, 2026',
    production: { branch: 'master', sha: '4a1eee7' },
    develop: { branch: 'develop', sha: '2c140ba', ahead: 65, behind: 4 },
    staging: { sourceSha: 'd1da87b' },
    tests: { unit: '949/949' },
    releaseReady: false
  };

  function replaceText(root, from, to) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      if (node.nodeValue.includes(from)) node.nodeValue = node.nodeValue.replaceAll(from, to);
    }
  }

  function setMetric(section, label, value, detail) {
    if (!section) return;
    const cards = Array.from(section.querySelectorAll('.metric-card'));
    const card = cards.find(item => item.querySelector('span')?.textContent.trim().toLowerCase() === label.toLowerCase());
    if (!card) return;
    const strong = card.querySelector('strong');
    const small = card.querySelector('small');
    if (strong) strong.textContent = value;
    if (small && detail) small.textContent = detail;
  }

  function updateOverview() {
    const eyebrow = document.querySelector('.hero .eyebrow');
    if (eyebrow) eyebrow.textContent = `Current implementation · audited ${SNAPSHOT.audited}`;

    const gate = document.getElementById('daily-develop-gate');
    setMetric(gate, 'develop', SNAPSHOT.develop.sha, `${SNAPSHOT.develop.ahead} ahead · ${SNAPSHOT.develop.behind} behind master`);
    setMetric(gate, 'runtime code', SNAPSHOT.develop.sha, 'current develop HEAD includes the sticky session-neuron completeness fix');
    setMetric(gate, 'staging source', SNAPSHOT.staging.sourceSha, 'ProjectHub-dev source marker, behind current develop');
    setMetric(gate, 'unit tests', SNAPSHOT.tests.unit, 'final Cloudflare accounting correction suite');

    if (gate) {
      replaceText(gate, 'Aug 23 gate report', 'Aug 24 accounting-correction verification');
      replaceText(gate, '29-commit delta from prior site snapshot', 'current ProjectHub develop source');
    }
  }

  function updateDocs() {
    const cards = document.querySelectorAll('.docs-status-row .docs-status-card');
    if (cards[3]?.querySelector('strong')) cards[3].querySelector('strong').textContent = `master ${SNAPSHOT.production.sha} · develop ${SNAPSHOT.develop.sha}`;

    const overview = document.getElementById('overview');
    const oldSnapshot = overview?.querySelector('[data-fresh-snapshot]');
    if (oldSnapshot) {
      oldSnapshot.innerHTML = `<strong>Development snapshot (${SNAPSHOT.audited}):</strong> production was still <code>master@${SNAPSHOT.production.sha}</code> at this audit point while a separate production-promotion task was in progress. Integrated development is <code>develop@${SNAPSHOT.develop.sha}</code>, ${SNAPSHOT.develop.ahead} commits ahead and ${SNAPSHOT.develop.behind} behind <code>master</code>. The staging source marker remains <code>${SNAPSHOT.staging.sourceSha}</code>. The current development unit suite recorded <strong>${SNAPSHOT.tests.unit}</strong> passing tests after the Cloudflare accounting correction. Re-check <code>master</code> after promotion before treating develop-only behavior as released.`;
    }

    const testing = document.getElementById('testing');
    if (testing) replaceText(testing, '924/924', SNAPSHOT.tests.unit);

    const release = document.getElementById('release');
    if (release) replaceText(release, 'Current release decision: NO.', 'Most recent broad conversation-quality release decision before the isolated accounting promotion: NO.');
  }

  function updateApi() {
    const scope = document.getElementById('scope');
    const note = scope?.querySelector('[data-api-snapshot]');
    if (note) {
      note.innerHTML = `<strong>Behavior snapshot (${SNAPSHOT.audited}):</strong> production was still tied to <code>master@${SNAPSHOT.production.sha}</code> at this audit point, while <code>develop@${SNAPSHOT.develop.sha}</code> contained the current integrated behavior and Cloudflare accounting correction. A separate production-promotion task was in progress. No new public commercial API surface is implied by that promotion.`;
    }
  }

  function updateChangelog() {
    const cards = document.querySelectorAll('.changelog-page .docs-status-row .docs-status-card');
    if (cards[0]?.querySelector('strong')) cards[0].querySelector('strong').textContent = `master · ${SNAPSHOT.production.sha}`;
    if (cards[1]?.querySelector('strong')) cards[1].querySelector('strong').textContent = `develop · ${SNAPSHOT.develop.sha}`;
    if (cards[2]?.querySelector('strong')) cards[2].querySelector('strong').textContent = `${SNAPSHOT.develop.ahead} ahead · ${SNAPSHOT.develop.behind} behind`;
    if (cards[3]?.querySelector('strong')) cards[3].querySelector('strong').textContent = SNAPSHOT.audited;

    const current = document.getElementById('current-state');
    if (current) {
      const baseCards = current.querySelectorAll('.docs-grid-3 .docs-card');
      if (baseCards[0]) {
        const h3 = baseCards[0].querySelector('h3');
        if (h3) h3.innerHTML = `<code>master</code> · <code>${SNAPSHOT.production.sha}</code>`;
      }
      if (baseCards[1]) {
        const h3 = baseCards[1].querySelector('h3');
        if (h3) h3.innerHTML = `<code>develop</code> · <code>${SNAPSHOT.develop.sha}</code>`;
        const p = baseCards[1].querySelector('p');
        if (p) p.textContent = 'Current integrated head includes the Cloudflare neuron-accounting correction and sticky session-completeness follow-up.';
      }
      if (baseCards[2]) {
        const h3 = baseCards[2].querySelector('h3');
        const p = baseCards[2].querySelector('p');
        if (h3) h3.textContent = `${SNAPSHOT.develop.ahead} ahead · ${SNAPSHOT.develop.behind} behind`;
        if (p) p.textContent = 'The branches remain diverged at this audit point; a separate production-promotion task is in progress.';
      }

      const injected = current.querySelector('[data-aug23-state]');
      if (injected) {
        injected.innerHTML = `<h3>August 24 source state</h3><div class="docs-table-wrap"><table class="docs-table"><thead><tr><th>Line</th><th>SHA</th><th>State</th></tr></thead><tbody><tr><td>Production at audit time</td><td><code>${SNAPSHOT.production.sha}</code></td><td><code>master</code>; separate promotion task in progress.</td></tr><tr><td>Integrated develop</td><td><code>${SNAPSHOT.develop.sha}</code></td><td>${SNAPSHOT.develop.ahead} ahead / ${SNAPSHOT.develop.behind} behind master.</td></tr><tr><td>ProjectHub-dev source marker</td><td><code>${SNAPSHOT.staging.sourceSha}</code></td><td>Staging frontend source is behind current develop.</td></tr><tr><td>Unit suite after accounting correction</td><td><code>${SNAPSHOT.tests.unit}</code></td><td>PASS in the final correction report.</td></tr></tbody></table></div><div class="docs-callout limit"><strong>Scope:</strong> the accounting fix is independently verified. The broader conversation-quality gate remains a separate release decision.</div>`;
      }
    }
  }

  const page = (location.pathname.split('/').filter(Boolean).pop() || 'index.html').toLowerCase();
  if (page === 'index.html' || page === 'scout') updateOverview();
  else if (page === 'docs.html') updateDocs();
  else if (page === 'api.html') updateApi();
  else if (page === 'changelog.html') updateChangelog();

  window.__SCOUT_SOURCE_SNAPSHOT_REFRESH__ = SNAPSHOT;
})();