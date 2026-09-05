(() => {
  'use strict';

  // Current cross-page source state, audited from all visible ProjectHub and
  // ProjectHub-dev branch heads on September 5, 2026. Historical measurements
  // stay explicitly dated instead of being relabeled as current quality scores.
  const SNAPSHOT = {
    audited: 'September 5, 2026',
    productPagePrevious: '6d593741',
    production: {
      branch: 'master',
      sha: 'b071e4e4',
      fullSha: 'b071e4e4f0bb69faeecd811f31514af30d2e1f61',
      tree: 'a0066cc849f33dd84d18d8e8c36b080fed8ce70e'
    },
    develop: {
      branch: 'develop',
      sha: '4f5ee971',
      fullSha: '4f5ee971488e433ebdf66280cce82e163c5c7688',
      tree: 'a0066cc849f33dd84d18d8e8c36b080fed8ce70e'
    },
    staging: {
      branch: 'main',
      sha: '6d36433c',
      sourceSha: '4f5ee971'
    },
    tests: {
      unit: '1019/1019',
      recall6: '1.000',
      mrr6: '0.942'
    },
    conversation: {
      revision: '4d39995',
      turns: '94/132',
      conversations: '21/33',
      inferenceUnavailable: '14/38 remaining failures'
    },
    pendingMaintenance: 'c32e83b',
    model: '@cf/meta/llama-3.1-8b-instruct-fast',
    temperature: '0'
  };

  const REPO = 'https://github.com/BradleyMatera/ProjectHub';
  const MASTER = `${REPO}/tree/master`;
  const DEVELOP = `${REPO}/tree/develop`;
  const RELEASE_PR = `${REPO}/pull/29`;
  const PHASE_PR = `${REPO}/pull/23`;
  const HARDENING_PR = `${REPO}/pull/28`;
  const STAGING_SOURCE = 'https://github.com/BradleyMatera/ProjectHub-dev/blob/main/STAGING-SOURCE.json';
  const PROVIDER = `${REPO}/blob/master/lib/cloudflare-provider.js`;
  const ROUTER = `${REPO}/blob/master/lib/local-model-router.js`;
  const SERVER = `${REPO}/blob/master/server-gemini.js`;
  const RUNTIME_KNOWLEDGE = `${REPO}/blob/master/data/scout-runtime-knowledge.json`;
  const HANDOFF = `${REPO}/blob/master/docs/current-feature-handoff.md`;

  function sourceRow(items) {
    return `<div class="docs-source-row">${items.map(([href, label]) => `<a href="${href}" target="_blank" rel="noopener">Source: ${label} ↗</a>`).join('')}</div>`;
  }

  function makeCallout(html, type = 'production') {
    const node = document.createElement('div');
    node.className = `docs-callout ${type}`;
    node.innerHTML = html;
    return node;
  }

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

  function currentReleaseHtml() {
    return `
      <div class="docs-callout production" data-sept5-release>
        <strong>September 5 source release:</strong> production <code>${SNAPSHOT.production.sha}</code> and integration <code>${SNAPSHOT.develop.sha}</code> have different Git ancestry but the same Git tree <code>${SNAPSHOT.production.tree.slice(0, 8)}</code>. ProjectHub-dev records <code>${SNAPSHOT.staging.sourceSha}</code> as its staging source. PR #29 used an ancestry-preserving release commit instead of forcing the conflicting direct develop→master PR #25.
      </div>
      ${sourceRow([[RELEASE_PR, 'PR #29 release evidence'], [STAGING_SOURCE, 'staging source marker'], [HANDOFF, 'current handoff']])}
    `;
  }

  function currentVerificationHtml() {
    return `
      <div class="docs-table-wrap" data-sept5-verification><table class="docs-table"><thead><tr><th>September 5 verification</th><th>Recorded result</th><th>Scope</th></tr></thead><tbody>
        <tr><td>Local test suite</td><td><strong>${SNAPSHOT.tests.unit}</strong></td><td>Release-hardening tree; zero skipped in PR evidence.</td></tr>
        <tr><td>Retrieval Recall@6</td><td><strong>${SNAPSHOT.tests.recall6}</strong></td><td>Current retrieval verification.</td></tr>
        <tr><td>Retrieval MRR@6</td><td><strong>${SNAPSHOT.tests.mrr6}</strong></td><td>Current retrieval verification.</td></tr>
        <tr><td>Phase 7/8 live gate</td><td><strong>${SNAPSHOT.conversation.turns}</strong> turns · <strong>${SNAPSHOT.conversation.conversations}</strong> conversations</td><td>Dated pre-release run at <code>${SNAPSHOT.conversation.revision}</code>.</td></tr>
        <tr><td>Inference-unavailable outcomes</td><td><strong>${SNAPSHOT.conversation.inferenceUnavailable}</strong></td><td>Observed failure category in that dated live run; not proof of external root cause.</td></tr>
      </tbody></table></div>`;
  }

  function truthDebtHtml() {
    return `
      <div class="docs-callout warning" data-runtime-truth-debt>
        <strong>Known source-truth debt:</strong> current executable provider/accounting code is exact-model and null-safe, but <code>data/scout-runtime-knowledge.json</code> is still marked <code>lastVerified: 2026-08-21</code> and retains the superseded sentence assigning <code>4,119 / 34,868</code> to Scout's normal <code>-fast</code> model. This site treats that sentence as stale and follows executable provider/accounting code instead.
      </div>
      ${sourceRow([[PROVIDER, 'current production provider code'], [RUNTIME_KNOWLEDGE, 'stale runtime self-knowledge record']])}`;
  }

  function updateOverview() {
    const eyebrow = document.querySelector('.hero .eyebrow');
    if (eyebrow) eyebrow.textContent = `Current implementation · branch-audited ${SNAPSHOT.audited}`;

    const gate = document.getElementById('daily-develop-gate');
    setMetric(gate, 'develop', SNAPSHOT.develop.sha, 'qualified integration source; same Git tree as current production');
    setMetric(gate, 'runtime code', SNAPSHOT.production.sha, `production master; tree ${SNAPSHOT.production.tree.slice(0, 8)}`);
    setMetric(gate, 'staging source', SNAPSHOT.staging.sourceSha, `ProjectHub-dev ${SNAPSHOT.staging.sha} records this exact develop source`);
    setMetric(gate, 'unit tests', SNAPSHOT.tests.unit, `Sep 5 release hardening · Recall@6 ${SNAPSHOT.tests.recall6} · MRR@6 ${SNAPSHOT.tests.mrr6}`);

    if (gate) {
      replaceText(gate, 'Aug 24 accounting-correction verification', 'Sep 5 release + branch verification');
      replaceText(gate, 'dated ProjectHub develop source snapshot', 'current qualified source tree');
    }

    const sourceBand = document.querySelector('.source-band');
    if (sourceBand && !document.getElementById('sept5-release-state')) {
      const section = document.createElement('section');
      section.id = 'sept5-release-state';
      section.className = 'section-pad section-dark';
      section.innerHTML = `
        <div class="shell">
          <header class="section-head reveal visible"><div class="section-index">Current source state</div><div><h2>September 5 release tree.</h2><p>The product page's previous current-state snapshot was August 27. Since then the Phase 7/8 work, widget hotfixes, and release hardening were merged, staged, and released.</p></div></header>
          <div class="metric-grid reveal visible">
            <article class="metric-card"><span>production</span><strong>${SNAPSHOT.production.sha}</strong><small>master · tree ${SNAPSHOT.production.tree.slice(0, 8)}</small></article>
            <article class="metric-card"><span>integration</span><strong>${SNAPSHOT.develop.sha}</strong><small>develop · same tree ${SNAPSHOT.develop.tree.slice(0, 8)}</small></article>
            <article class="metric-card"><span>staging source</span><strong>${SNAPSHOT.staging.sourceSha}</strong><small>ProjectHub-dev marker · ${SNAPSHOT.staging.sha}</small></article>
            <article class="metric-card"><span>tests</span><strong>${SNAPSHOT.tests.unit}</strong><small>release-hardening local suite</small></article>
          </div>
          <div class="docs-callout limit reveal visible"><strong>Not a perfect-conversation claim:</strong> the last pre-release Phase 7/8 live qualification at <code>${SNAPSHOT.conversation.revision}</code> recorded ${SNAPSHOT.conversation.turns} turns and ${SNAPSHOT.conversation.conversations} conversations passing, with ${SNAPSHOT.conversation.inferenceUnavailable}. Those remain dated evidence and known residuals.</div>
          <div class="source-links reveal visible"><a href="${RELEASE_PR}" target="_blank" rel="noopener">Source: PR #29 release ↗</a><a href="${PHASE_PR}" target="_blank" rel="noopener">Source: PR #23 Phase 7/8 ↗</a><a href="${HARDENING_PR}" target="_blank" rel="noopener">Source: PR #28 hardening ↗</a><a href="${STAGING_SOURCE}" target="_blank" rel="noopener">Source: staging marker ↗</a></div>
        </div>`;
      sourceBand.parentNode.insertBefore(section, sourceBand.nextSibling);
    }
  }

  function updateDocs() {
    const cards = document.querySelectorAll('.docs-status-row .docs-status-card');
    if (cards[3]?.querySelector('strong')) cards[3].querySelector('strong').textContent = `master ${SNAPSHOT.production.sha} · develop ${SNAPSHOT.develop.sha} · same tree`;

    const overview = document.getElementById('overview');
    const oldSnapshot = overview?.querySelector('[data-fresh-snapshot]');
    if (oldSnapshot) {
      oldSnapshot.innerHTML = `<strong>Current source snapshot (${SNAPSHOT.audited}):</strong> <code>master@${SNAPSHOT.production.sha}</code> and <code>develop@${SNAPSHOT.develop.sha}</code> both point to Git tree <code>${SNAPSHOT.production.tree.slice(0, 8)}</code>. <code>ProjectHub-dev:main@${SNAPSHOT.staging.sha}</code> records <code>${SNAPSHOT.staging.sourceSha}</code> as its source. The histories differ because production uses an ancestry-preserving release commit; the current released source tree matches the qualified develop tree.`;
    }
    if (overview && !overview.querySelector('[data-sept5-release]')) overview.insertAdjacentHTML('beforeend', currentReleaseHtml());

    const inference = document.getElementById('inference');
    if (inference) {
      replaceText(inference, 'temperature 0.2', 'temperature 0');
      if (!inference.querySelector('[data-sept5-inference]')) {
        const note = makeCallout(`<strong>Current generation settings:</strong> normal RAG/LITE generation passes temperature <code>0</code> with top-p <code>0.9</code>. The Cloudflare adapter also defaults to temperature <code>0</code> when a caller does not override it. Cloudflare-primary Ollama fallback remains disabled by default and requires explicit fallback enablement plus <code>SCOUT_OLLAMA_QUALIFIED=true</code>.`, 'production');
        note.dataset.sept5Inference = 'true';
        inference.appendChild(note);
        inference.insertAdjacentHTML('beforeend', sourceRow([[PROVIDER, 'production Cloudflare adapter'], [ROUTER, 'inference router']]));
      }
    }

    const widget = document.getElementById('widget');
    if (widget && !widget.querySelector('[data-sept5-widget]')) {
      const note = makeCallout(`<strong>September widget behavior:</strong> initialization is guarded against duplicate/reentrant setup and can roll back partial DOM/listener setup before retry. The composer stays usable while Scout replies; a submitted follow-up can queue; auto-scroll follows only when the user was already near the bottom.`, 'production');
      note.dataset.sept5Widget = 'true';
      widget.appendChild(note);
      widget.insertAdjacentHTML('beforeend', sourceRow([[`${REPO}/pull/24`, 'PR #24 idempotent initialization'], [`${REPO}/pull/26`, 'PR #26 scroll/input behavior'], [HARDENING_PR, 'PR #28 retry-safe setup']]));
    }

    const testing = document.getElementById('testing');
    if (testing) {
      replaceText(testing, '924/924', SNAPSHOT.tests.unit);
      replaceText(testing, '949/949', SNAPSHOT.tests.unit);
      replaceText(testing, '970/970', SNAPSHOT.tests.unit);
      if (!testing.querySelector('[data-sept5-verification]')) testing.insertAdjacentHTML('beforeend', currentVerificationHtml());
    }

    const release = document.getElementById('release');
    if (release && !release.querySelector('[data-sept5-release]')) {
      release.insertAdjacentHTML('beforeend', currentReleaseHtml());
      const caution = makeCallout('<strong>Release-vs-runtime boundary:</strong> GitHub proves the source release and staging provenance recorded above. External production backend/frontend deployment checks are separate operational evidence and should not be inferred solely from the merge commit.', 'limit');
      release.appendChild(caution);
    }

    const limits = document.getElementById('limits');
    if (limits && !limits.querySelector('[data-runtime-truth-debt]')) limits.insertAdjacentHTML('beforeend', truthDebtHtml());
  }

  function updateLearn() {
    const generation = document.getElementById('generation');
    if (generation) {
      replaceText(generation, 'defaults to temperature 0.2', 'defaults to temperature 0');
      replaceText(generation, 'temperature <code>0.2</code>', 'temperature <code>0</code>');
      if (!generation.querySelector('[data-sept5-generation]')) {
        const note = makeCallout(`<strong>Current production path:</strong> Scout still uses <code>${SNAPSHOT.model}</code>. Current RAG/LITE generation calls use temperature <code>0</code> and top-p <code>0.9</code>; max output remains clamped to at most 512 tokens by the provider adapter. Evaluation/browser-local scripts can intentionally use different sampling settings and should not be confused with the production RAG path.`, 'production');
        note.dataset.sept5Generation = 'true';
        generation.appendChild(note);
        generation.insertAdjacentHTML('beforeend', sourceRow([[PROVIDER, 'production provider settings'], [`${REPO}/blob/master/lib/rag-agent.js`, 'RAG generation call'], [`${REPO}/blob/master/lib/lite-agent.js`, 'LITE generation call']]));
      }
    }

    const stateTools = document.getElementById('state-tools');
    if (stateTools && !stateTools.querySelector('[data-sept5-conversation]')) {
      const note = makeCallout('<strong>Conversation work released Sep 5:</strong> the Phase 7/8 iteration expanded generic policy classification, response-contract handling, referent/context resolution, evidence selection, and validation regressions. The released result still has known dated conversation-suite residuals; the site does not treat release as a 132/132 claim.', 'no-math');
      note.dataset.sept5Conversation = 'true';
      stateTools.appendChild(note);
      stateTools.insertAdjacentHTML('beforeend', sourceRow([[PHASE_PR, 'PR #23 Phase 7/8 changes']]));
    }

    const glossary = document.getElementById('glossary');
    if (glossary) {
      const terms = Array.from(glossary.querySelectorAll('.glossary-term'));
      const neuron = terms.find(item => item.querySelector('dt')?.textContent.trim() === 'Neuron');
      const dd = neuron?.querySelector('dd');
      if (dd) dd.innerHTML = "Cloudflare Workers AI's usage-accounting unit. Scout preserves provider-reported actual neurons when available and only computes token-derived estimates when the exact model identifier has a verified rate. Unknown exact-model usage remains unknown rather than becoming zero.";
      if (!glossary.querySelector('[data-runtime-truth-debt]')) glossary.insertAdjacentHTML('beforeend', truthDebtHtml());
    }
  }

  function updateApi() {
    const scope = document.getElementById('scope');
    const existing = scope?.querySelector('[data-api-snapshot]');
    if (existing) {
      existing.innerHTML = `<strong>Current source contract (${SNAPSHOT.audited}):</strong> released <code>master@${SNAPSHOT.production.sha}</code>, qualified <code>develop@${SNAPSHOT.develop.sha}</code>, same Git tree <code>${SNAPSHOT.production.tree.slice(0, 8)}</code>; staging source marker <code>${SNAPSHOT.staging.sourceSha}</code>. This is still ProjectHub's application runtime API, not a promised public multi-tenant API product.`;
    } else if (scope && !scope.querySelector('[data-sept5-release]')) {
      scope.insertAdjacentHTML('beforeend', currentReleaseHtml());
    }

    const diagnostics = document.getElementById('diagnostics');
    if (diagnostics && !diagnostics.querySelector('[data-sept5-diagnostics]')) {
      const note = makeCallout('<strong>Per-turn gate diagnostics are opt-in twice:</strong> <code>/api/chat</code> exposes gate-debug detail only when the server has <code>SCOUT_GATE_DEBUG=true</code> and the request explicitly opts in with <code>gateDebug: true</code> (or query <code>gateDebug=1</code>). Authorized debug responses are <code>Cache-Control: no-store</code> and bypass normal response-cache reuse. A public request cannot enable diagnostics by itself.', 'production');
      note.dataset.sept5Diagnostics = 'true';
      diagnostics.appendChild(note);
      diagnostics.insertAdjacentHTML('beforeend', sourceRow([[SERVER, 'chat diagnostic authorization/cache behavior'], [`${REPO}/blob/master/test/gate-debug-authorization.test.js`, 'authorization regression tests']]));
    }

    const costs = document.getElementById('costs');
    if (costs && !costs.querySelector('[data-runtime-truth-debt]')) costs.insertAdjacentHTML('beforeend', truthDebtHtml());
  }

  function updateChangelog() {
    const status = document.querySelectorAll('.changelog-page .docs-status-row .docs-status-card');
    if (status[0]) { status[0].querySelector('span').textContent = 'Production'; status[0].querySelector('strong').textContent = `master · ${SNAPSHOT.production.sha}`; }
    if (status[1]) { status[1].querySelector('span').textContent = 'Integration'; status[1].querySelector('strong').textContent = `develop · ${SNAPSHOT.develop.sha}`; }
    if (status[2]) { status[2].querySelector('span').textContent = 'Source tree parity'; status[2].querySelector('strong').textContent = SNAPSHOT.production.tree.slice(0, 8); }
    if (status[3]) { status[3].querySelector('span').textContent = 'Audited'; status[3].querySelector('strong').textContent = SNAPSHOT.audited; }

    const current = document.getElementById('current-state');
    if (current) {
      const cards = current.querySelectorAll('.docs-grid-3 .docs-card');
      if (cards[0]) {
        cards[0].querySelector('.label').textContent = 'Production source';
        cards[0].querySelector('h3').innerHTML = `<code>master</code> · <code>${SNAPSHOT.production.sha}</code>`;
        cards[0].querySelector('p').textContent = `September 5 PR #29 release; Git tree ${SNAPSHOT.production.tree.slice(0, 8)}.`;
      }
      if (cards[1]) {
        cards[1].querySelector('.label').textContent = 'Qualified integration source';
        cards[1].querySelector('h3').innerHTML = `<code>develop</code> · <code>${SNAPSHOT.develop.sha}</code>`;
        cards[1].querySelector('p').textContent = 'Same Git tree as the current production release; includes release hardening and widget regressions.';
      }
      if (cards[2]) {
        cards[2].querySelector('.label').textContent = 'Staging provenance';
        cards[2].querySelector('h3').innerHTML = `<code>${SNAPSHOT.staging.sourceSha}</code>`;
        cards[2].querySelector('p').textContent = `ProjectHub-dev main ${SNAPSHOT.staging.sha} records this develop source.`;
      }
    }

    if (document.getElementById('sep5-release')) return;
    const anchor = current || document.querySelector('.changelog-page .docs-content .docs-section');
    if (!anchor?.parentNode) return;

    const sep5 = document.createElement('section');
    sep5.className = 'docs-section';
    sep5.id = 'sep5-release';
    sep5.dataset.search = 'september 5 2026 release phase 7 8 hardening widget diagnostics staging production 1019';
    sep5.innerHTML = `
      <div class="docs-eyebrow">September 5, 2026 · Qualified tree released</div>
      <h2>Phase 7/8, widget fixes, and release hardening reached production source.</h2>
      <p>The August 27 product-site snapshot still showed Phase 02 on an active feature branch. Since then the conversation-gate branch was merged to develop, widget initialization/input/scroll fixes were merged, release hardening was applied, staging was regenerated from <code>${SNAPSHOT.develop.sha}</code>, and PR #29 promoted the exact qualified tree to production.</p>
      <div class="docs-flow">
        <div class="docs-flow-step"><div><strong>PR #23 · conversation gate.</strong><span>Expanded generic conversation policy/contracts, follow-up/referent handling, evidence selection and validation regressions. Pre-release live checkpoint: ${SNAPSHOT.conversation.turns} turns, ${SNAPSHOT.conversation.conversations} conversations.</span></div></div>
        <div class="docs-flow-step"><div><strong>PR #24 · idempotent embed.</strong><span>Guards repeated ProjectHub initialization and exposes an explicit initializer for dynamic embeds.</span></div></div>
        <div class="docs-flow-step"><div><strong>PR #26 · composer/scroll.</strong><span>Typing stays available during replies, submitted follow-ups can queue, and auto-scroll no longer hijacks a user who has scrolled up.</span></div></div>
        <div class="docs-flow-step"><div><strong>PR #28 · release hardening.</strong><span>Diagnostics require server authorization + request opt-in, debug turns are cache-isolated, partial widget setup rolls back for safe retry, and browser regressions cover drafts/bottom-follow.</span></div></div>
        <div class="docs-flow-step"><div><strong>PR #29 · production source.</strong><span><code>master@${SNAPSHOT.production.sha}</code> and <code>develop@${SNAPSHOT.develop.sha}</code> share Git tree <code>${SNAPSHOT.production.tree.slice(0, 8)}</code>; staging records <code>${SNAPSHOT.staging.sourceSha}</code>.</span></div></div>
      </div>
      ${currentVerificationHtml()}
      <div class="docs-callout warning"><strong>Known residuals remain:</strong> the pre-release conversation run did not pass every turn. ${SNAPSHOT.conversation.inferenceUnavailable} were classified as inference unavailable, and release evidence explicitly deferred remaining conversation failures rather than claiming they were all fixed.</div>
      ${sourceRow([[RELEASE_PR, 'PR #29 production release'], [HARDENING_PR, 'PR #28 release hardening'], [PHASE_PR, 'PR #23 conversation gate'], [STAGING_SOURCE, 'current staging source']])}
    `;
    anchor.parentNode.insertBefore(sep5, anchor.nextSibling);

    const sep2 = document.createElement('section');
    sep2.className = 'docs-section';
    sep2.id = 'sep2-release';
    sep2.dataset.search = 'september 2 2026 production release staging';
    sep2.innerHTML = `
      <div class="docs-eyebrow">September 2, 2026 · Earlier production promotion</div>
      <h2>The qualified August integration tree was promoted with a master-parented release branch.</h2>
      <p>PR #22 replaced a conflicting direct develop→master PR (#21) with a clean release branch based on production ancestry. The same release pattern was used again on September 5 after additional Phase 7/8 and hardening work.</p>
      ${sourceRow([[`${REPO}/pull/22`, 'PR #22 Sep 2 release'], [`${REPO}/pull/21`, 'superseded direct release PR']])}
    `;
    sep5.parentNode.insertBefore(sep2, sep5.nextSibling);

    const branchAudit = document.createElement('section');
    branchAudit.className = 'docs-section';
    branchAudit.id = 'sep5-branch-audit';
    branchAudit.dataset.search = 'branch audit 35 branches projecthub dev historical dependabot';
    branchAudit.innerHTML = `
      <div class="docs-eyebrow">September 5, 2026 · Branch audit</div>
      <h2>All visible branch heads were checked before this documentation sync.</h2>
      <p><strong>ProjectHub:</strong> 35 visible branches. Twelve branch heads were newer than the August 27 product-page cutoff; the remaining 23 pointed to older July/August work. <strong>ProjectHub-dev:</strong> two visible branches; current <code>main</code> is the September 5 staging mirror and its Dependabot branch is an older August 9 dependency proposal.</p>
      <div class="docs-callout no-math"><strong>Git history nuance:</strong> old feature branches can still appear ahead/diverged after their accepted changes were squash-merged. The site therefore uses merge state, current tree content, dates, and branch tips together rather than interpreting raw ahead/behind counts as release status.</div>
      <p>The only branch newer than the current production release is Dependabot <code>${SNAPSHOT.pendingMaintenance}</code>, one <code>package-lock.json</code>-only commit ahead of master. It is recorded as pending maintenance, not a runtime capability.</p>
      ${sourceRow([['https://github.com/BradleyMatera/ProjectHub/branches', 'ProjectHub branches'], ['https://github.com/BradleyMatera/ProjectHub-dev/branches', 'ProjectHub-dev branches'], ['./SCOUT-SOURCE-AUDIT.md', 'full branch audit']])}
    `;
    sep2.parentNode.insertBefore(branchAudit, sep2.nextSibling);

    const firstGroup = document.querySelector('.changelog-page .docs-nav-group');
    if (firstGroup) {
      if (!firstGroup.querySelector('a[href="#sep5-release"]')) firstGroup.insertAdjacentHTML('afterbegin', '<a href="#sep5-release"><span class="nav-code">NEW</span>Sep 5 release</a>');
      if (!firstGroup.querySelector('a[href="#sep2-release"]')) firstGroup.insertAdjacentHTML('beforeend', '<a href="#sep2-release"><span class="nav-code">SEP</span>Sep 2 release</a>');
      if (!firstGroup.querySelector('a[href="#sep5-branch-audit"]')) firstGroup.insertAdjacentHTML('beforeend', '<a href="#sep5-branch-audit"><span class="nav-code">AUD</span>Branch audit</a>');
    }
    const mobile = document.querySelector('.changelog-page .docs-mobile-nav select');
    if (mobile) {
      if (!mobile.querySelector('option[value="sep5-release"]')) mobile.insertAdjacentHTML('afterbegin', '<option value="sep5-release">Sep 5 · Qualified release</option>');
      if (!mobile.querySelector('option[value="sep2-release"]')) mobile.insertAdjacentHTML('beforeend', '<option value="sep2-release">Sep 2 · Production release</option>');
      if (!mobile.querySelector('option[value="sep5-branch-audit"]')) mobile.insertAdjacentHTML('beforeend', '<option value="sep5-branch-audit">Sep 5 · Branch audit</option>');
    }
  }

  const page = (location.pathname.split('/').filter(Boolean).pop() || 'index.html').toLowerCase();
  if (page === 'index.html' || page === 'scout') updateOverview();
  else if (page === 'docs.html') updateDocs();
  else if (page === 'learn.html') updateLearn();
  else if (page === 'api.html') updateApi();
  else if (page === 'changelog.html') updateChangelog();

  window.__SCOUT_SOURCE_SNAPSHOT_REFRESH__ = SNAPSHOT;
})();
