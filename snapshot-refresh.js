(() => {
  'use strict';

  // Dated source-state layer. ProjectHub moves faster than the long-form product
  // documentation, so these SHAs are explicitly historical snapshot metadata.
  // Cloudflare accounting state is documented separately and is production-hotfixed.
  const SNAPSHOT = {
    audited: 'August 24, 2026',
    production: { branch: 'master', sha: '4a1eee7' },
    develop: { branch: 'develop', sha: '2c140ba', ahead: 65, behind: 4 },
    staging: { sourceSha: 'd1da87b' },
    tests: { unit: '949/949' },
    accountingProductionHotfix: true,
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
    if (eyebrow) eyebrow.textContent = `Current implementation · accounting synced ${SNAPSHOT.audited}`;

    const gate = document.getElementById('daily-develop-gate');
    setMetric(gate, 'develop', SNAPSHOT.develop.sha, `${SNAPSHOT.develop.ahead} ahead · ${SNAPSHOT.develop.behind} behind master at the dated source snapshot`);
    setMetric(gate, 'runtime code', SNAPSHOT.develop.sha, 'dated integration snapshot; accounting correction was later production-hotfixed');
    setMetric(gate, 'staging source', SNAPSHOT.staging.sourceSha, 'dated ProjectHub-dev source marker');
    setMetric(gate, 'unit tests', SNAPSHOT.tests.unit, 'accounting-correction verification suite');

    if (gate) {
      replaceText(gate, 'Aug 23 gate report', 'Aug 24 accounting-correction verification');
      replaceText(gate, '29-commit delta from prior site snapshot', 'dated ProjectHub develop source snapshot');
    }
  }

  function updateDocs() {
    const cards = document.querySelectorAll('.docs-status-row .docs-status-card');
    if (cards[3]?.querySelector('strong')) cards[3].querySelector('strong').textContent = `dated source snapshot: master ${SNAPSHOT.production.sha} · develop ${SNAPSHOT.develop.sha}`;

    const overview = document.getElementById('overview');
    const oldSnapshot = overview?.querySelector('[data-fresh-snapshot]');
    if (oldSnapshot) {
      oldSnapshot.innerHTML = `<strong>Dated source snapshot (${SNAPSHOT.audited}):</strong> the captured branch state was <code>master@${SNAPSHOT.production.sha}</code> and <code>develop@${SNAPSHOT.develop.sha}</code>. Those SHAs are retained as historical source-state evidence, not asserted as the current deployed revision. The Cloudflare exact-model accounting correction described on this site has since been <strong>production-hotfixed</strong>. The staging marker captured here is <code>${SNAPSHOT.staging.sourceSha}</code>, and the accounting verification suite recorded <strong>${SNAPSHOT.tests.unit}</strong> passing tests.`;
    }

    const testing = document.getElementById('testing');
    if (testing) replaceText(testing, '924/924', SNAPSHOT.tests.unit);

    const release = document.getElementById('release');
    if (release) replaceText(release, 'Current release decision: NO.', 'Most recent broad conversation-quality release decision in this dated snapshot: NO. The isolated Cloudflare accounting correction was production-hotfixed separately.');
  }

  function updateApi() {
    const scope = document.getElementById('scope');
    const note = scope?.querySelector('[data-api-snapshot]');
    if (note) {
      note.innerHTML = `<strong>Source snapshot:</strong> <code>master@${SNAPSHOT.production.sha}</code> / <code>develop@${SNAPSHOT.develop.sha}</code> are the dated branch SHAs captured by this documentation layer, not a live deployment lookup. The Cloudflare exact-model accounting correction has since been <strong>production-hotfixed</strong>. No new public commercial API surface is implied by that accounting hotfix.`;
    }
  }

  function updateChangelog() {
    const cards = document.querySelectorAll('.changelog-page .docs-status-row .docs-status-card');
    if (cards[0]) {
      const label = cards[0].querySelector('span');
      const strong = cards[0].querySelector('strong');
      if (label) label.textContent = 'Dated production snapshot';
      if (strong) strong.textContent = `master · ${SNAPSHOT.production.sha}`;
    }
    if (cards[1]) {
      const label = cards[1].querySelector('span');
      const strong = cards[1].querySelector('strong');
      if (label) label.textContent = 'Dated integration snapshot';
      if (strong) strong.textContent = `develop · ${SNAPSHOT.develop.sha}`;
    }
    if (cards[2]) {
      const label = cards[2].querySelector('span');
      const strong = cards[2].querySelector('strong');
      if (label) label.textContent = 'Snapshot comparison';
      if (strong) strong.textContent = `${SNAPSHOT.develop.ahead} ahead · ${SNAPSHOT.develop.behind} behind`;
    }
    if (cards[3]?.querySelector('strong')) cards[3].querySelector('strong').textContent = SNAPSHOT.audited;

    const current = document.getElementById('current-state');
    if (current) {
      const baseCards = current.querySelectorAll('.docs-grid-3 .docs-card');
      if (baseCards[0]) {
        const label = baseCards[0].querySelector('.label');
        const h3 = baseCards[0].querySelector('h3');
        const p = baseCards[0].querySelector('p');
        if (label) label.textContent = 'Dated production source';
        if (h3) h3.innerHTML = `<code>master</code> · <code>${SNAPSHOT.production.sha}</code>`;
        if (p) p.textContent = 'Captured production source before the later isolated Cloudflare accounting hotfix. The SHA is historical snapshot metadata.';
      }
      if (baseCards[1]) {
        const label = baseCards[1].querySelector('.label');
        const h3 = baseCards[1].querySelector('h3');
        const p = baseCards[1].querySelector('p');
        if (label) label.textContent = 'Dated integration source';
        if (h3) h3.innerHTML = `<code>develop</code> · <code>${SNAPSHOT.develop.sha}</code>`;
        if (p) p.textContent = 'Captured integrated head containing the accounting correction and sticky session-completeness follow-up before the isolated production hotfix.';
      }
      if (baseCards[2]) {
        const label = baseCards[2].querySelector('.label');
        const h3 = baseCards[2].querySelector('h3');
        const p = baseCards[2].querySelector('p');
        if (label) label.textContent = 'Dated comparison';
        if (h3) h3.textContent = `${SNAPSHOT.develop.ahead} ahead · ${SNAPSHOT.develop.behind} behind`;
        if (p) p.textContent = 'This comparison belongs to the captured audit point and is not presented as a live post-hotfix branch comparison.';
      }

      const injected = current.querySelector('[data-aug23-state]');
      if (injected) {
        injected.innerHTML = `<h3>August 24 source snapshot</h3><div class="docs-table-wrap"><table class="docs-table"><thead><tr><th>Line</th><th>Captured value</th><th>Meaning</th></tr></thead><tbody><tr><td>Production source</td><td><code>${SNAPSHOT.production.sha}</code></td><td>Dated pre-accounting-hotfix snapshot; not asserted as the current deployed SHA.</td></tr><tr><td>Integrated develop</td><td><code>${SNAPSHOT.develop.sha}</code></td><td>Dated source snapshot containing the accounting correction work.</td></tr><tr><td>ProjectHub-dev source marker</td><td><code>${SNAPSHOT.staging.sourceSha}</code></td><td>Dated staging marker.</td></tr><tr><td>Accounting verification suite</td><td><code>${SNAPSHOT.tests.unit}</code></td><td>PASS in the recorded correction verification.</td></tr></tbody></table></div><div class="docs-callout production"><strong>Current accounting state:</strong> the exact-model Cloudflare accounting correction has been production-hotfixed. The broader conversation-quality release history remains a separate topic.</div>`;
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