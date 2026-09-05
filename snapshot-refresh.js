(() => {
  'use strict';

  // Current cross-page source state, audited from all visible ProjectHub and
  // ProjectHub-dev branch heads on September 5, 2026. Released, active-unmerged,
  // staging, dependency-only, and historical evaluation states stay separate.
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
    active: {
      branch: 'feat/generic-conversation-sets',
      sha: '5bd9437',
      fullSha: '5bd9437b1811957f20d1a217c854d46228ace12c',
      parentFeatureSha: 'f145f8c',
      ahead: 2,
      behind: 0,
      actionsRunsObserved: 0,
      prObserved: false
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
  const RELEASE_PR = `${REPO}/pull/29`;
  const PHASE_PR = `${REPO}/pull/23`;
  const HARDENING_PR = `${REPO}/pull/28`;
  const ACTIVE_COMMIT = `${REPO}/commit/${SNAPSHOT.active.fullSha}`;
  const ACTIVE_COMPARE = `${REPO}/compare/develop...feat/generic-conversation-sets`;
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
        <strong>September 5 released source:</strong> production <code>${SNAPSHOT.production.sha}</code> and protected integration <code>${SNAPSHOT.develop.sha}</code> have different Git ancestry but the same Git tree <code>${SNAPSHOT.production.tree.slice(0, 8)}</code>. ProjectHub-dev records <code>${SNAPSHOT.staging.sourceSha}</code> as its staging source. PR #29 used an ancestry-preserving release commit rather than forcing the conflicting direct develop→master PR #25.
      </div>
      ${sourceRow([[RELEASE_PR, 'PR #29 release evidence'], [STAGING_SOURCE, 'staging source marker'], [HANDOFF, 'current handoff']])}`;
  }

  function activeBranchHtml() {
    return `
      <div class="docs-callout warning" data-active-discourse-branch>
        <strong>Active unmerged branch:</strong> <code>${SNAPSHOT.active.branch}@${SNAPSHOT.active.sha}</code> is <strong>${SNAPSHOT.active.ahead} commits ahead / ${SNAPSHOT.active.behind} behind develop</strong> at the audit recheck. It adds generic server-owned discourse frames, ordered user-introduced alternative sets, and a <code>CLARIFICATION</code> control mode; cache/direct-KB turns now commit discourse state before early return. No GitHub Actions run or PR for this head was exposed at recheck, so this is development evidence, not an integrated/staged/released capability.
      </div>
      ${sourceRow([[ACTIVE_COMMIT, 'active branch head'], [ACTIVE_COMPARE, 'develop → active branch diff'], [`${REPO}/blob/feat/generic-conversation-sets/test/discourse-frames.test.js`, 'new discourse-frame tests']])}`;
  }

  function currentVerificationHtml() {
    return `
      <div class="docs-table-wrap" data-sept5-verification><table class="docs-table"><thead><tr><th>September 5 released-tree verification</th><th>Recorded result</th><th>Scope</th></tr></thead><tbody>
        <tr><td>Local test suite</td><td><strong>${SNAPSHOT.tests.unit}</strong></td><td>Release-hardening tree; zero skipped in PR evidence.</td></tr>
        <tr><td>Retrieval Recall@6</td><td><strong>${SNAPSHOT.tests.recall6}</strong></td><td>Released-tree retrieval verification.</td></tr>
        <tr><td>Retrieval MRR@6</td><td><strong>${SNAPSHOT.tests.mrr6}</strong></td><td>Released-tree retrieval verification.</td></tr>
        <tr><td>Phase 7/8 live gate</td><td><strong>${SNAPSHOT.conversation.turns}</strong> turns · <strong>${SNAPSHOT.conversation.conversations}</strong> conversations</td><td>Dated pre-release run at <code>${SNAPSHOT.conversation.revision}</code>.</td></tr>
        <tr><td>Inference-unavailable outcomes</td><td><strong>${SNAPSHOT.conversation.inferenceUnavailable}</strong></td><td>Observed failure category in that dated run; not proof of external root cause.</td></tr>
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

    const sourceBand = document.querySelector('.source-band');
    if (sourceBand && !document.getElementById('sept5-release-state')) {
      const section = document.createElement('section');
      section.id = 'sept5-release-state';
      section.className = 'section-pad section-dark';
      section.innerHTML = `
        <div class="shell">
          <header class="section-head reveal visible"><div class="section-index">Current source state</div><div><h2>Released tree + active branch.</h2><p>The product page's previous current-state snapshot was August 27. The accepted Phase 7/8/widget/hardening iteration has since been released, and new discourse work has started on a separate unmerged branch.</p></div></header>
          <div class="metric-grid reveal visible">
            <article class="metric-card"><span>production</span><strong>${SNAPSHOT.production.sha}</strong><small>master · tree ${SNAPSHOT.production.tree.slice(0, 8)}</small></article>
            <article class="metric-card"><span>integration</span><strong>${SNAPSHOT.develop.sha}</strong><small>develop · same released tree ${SNAPSHOT.develop.tree.slice(0, 8)}</small></article>
            <article class="metric-card"><span>staging source</span><strong>${SNAPSHOT.staging.sourceSha}</strong><small>ProjectHub-dev marker · ${SNAPSHOT.staging.sha}</small></article>
            <article class="metric-card"><span>active unmerged</span><strong>${SNAPSHOT.active.sha}</strong><small>${SNAPSHOT.active.branch} · +${SNAPSHOT.active.ahead} / -${SNAPSHOT.active.behind}</small></article>
            <article class="metric-card"><span>released-tree tests</span><strong>${SNAPSHOT.tests.unit}</strong><small>Sep 5 release hardening</small></article>
          </div>
          <div class="docs-callout limit reveal visible"><strong>Not a perfect-conversation claim:</strong> the last pre-release Phase 7/8 live qualification at <code>${SNAPSHOT.conversation.revision}</code> recorded ${SNAPSHOT.conversation.turns} turns and ${SNAPSHOT.conversation.conversations} conversations passing, with ${SNAPSHOT.conversation.inferenceUnavailable}. Those remain dated released-iteration evidence, not test results for the new active branch.</div>
          <div class="docs-callout warning reveal visible"><strong>Current active branch is not released:</strong> <code>${SNAPSHOT.active.branch}@${SNAPSHOT.active.sha}</code> is +${SNAPSHOT.active.ahead}/-${SNAPSHOT.active.behind} from develop and has no exposed Actions run/PR at the recheck.</div>
          <div class="source-links reveal visible"><a href="${RELEASE_PR}" target="_blank" rel="noopener">Source: PR #29 release ↗</a><a href="${ACTIVE_COMPARE}" target="_blank" rel="noopener">Source: active branch diff ↗</a><a href="${HARDENING_PR}" target="_blank" rel="noopener">Source: PR #28 hardening ↗</a><a href="${STAGING_SOURCE}" target="_blank" rel="noopener">Source: staging marker ↗</a></div>
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
      oldSnapshot.innerHTML = `<strong>Current released-source snapshot (${SNAPSHOT.audited}):</strong> <code>master@${SNAPSHOT.production.sha}</code> and <code>develop@${SNAPSHOT.develop.sha}</code> both point to Git tree <code>${SNAPSHOT.production.tree.slice(0, 8)}</code>. <code>ProjectHub-dev:main@${SNAPSHOT.staging.sha}</code> records <code>${SNAPSHOT.staging.sourceSha}</code>. Separately, <code>${SNAPSHOT.active.branch}@${SNAPSHOT.active.sha}</code> is +${SNAPSHOT.active.ahead}/-${SNAPSHOT.active.behind} from develop and remains unmerged.`;
    }
    if (overview && !overview.querySelector('[data-sept5-release]')) overview.insertAdjacentHTML('beforeend', currentReleaseHtml());
    if (overview && !overview.querySelector('[data-active-discourse-branch]')) overview.insertAdjacentHTML('beforeend', activeBranchHtml());

    const inference = document.getElementById('inference');
    if (inference) {
      replaceText(inference, 'temperature 0.2', 'temperature 0');
      if (!inference.querySelector('[data-sept5-inference]')) {
        const note = makeCallout(`<strong>Current released generation settings:</strong> normal RAG/LITE generation passes temperature <code>0</code> with top-p <code>0.9</code>. The Cloudflare adapter also defaults to temperature <code>0</code>. Cloudflare-primary Ollama fallback remains disabled by default and requires explicit fallback enablement plus <code>SCOUT_OLLAMA_QUALIFIED=true</code>.`, 'production');
        note.dataset.sept5Inference = 'true';
        inference.appendChild(note);
        inference.insertAdjacentHTML('beforeend', sourceRow([[PROVIDER, 'production Cloudflare adapter'], [ROUTER, 'inference router']]));
      }
    }

    const session = document.getElementById('session-state');
    if (session && !session.querySelector('[data-active-discourse-branch]')) {
      session.insertAdjacentHTML('beforeend', activeBranchHtml());
    }

    const widget = document.getElementById('widget');
    if (widget && !widget.querySelector('[data-sept5-widget]')) {
      const note = makeCallout(`<strong>Released September widget behavior:</strong> initialization is guarded against duplicate/reentrant setup and can roll back partial DOM/listener setup before retry. The composer stays usable while Scout replies; a submitted follow-up can queue; auto-scroll follows only when the user was already near the bottom.`, 'production');
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
      if (!testing.querySelector('[data-active-discourse-test-boundary]')) {
        const note = makeCallout(`<strong>Active-branch test boundary:</strong> <code>${SNAPSHOT.active.branch}@${SNAPSHOT.active.sha}</code> adds <code>test/discourse-frames.test.js</code>, but no GitHub Actions run/status was exposed for this branch at recheck. The ${SNAPSHOT.tests.unit} count above belongs to the released <code>4f5ee971</code> tree, not automatically to <code>${SNAPSHOT.active.sha}</code>.`, 'warning');
        note.dataset.activeDiscourseTestBoundary = 'true';
        testing.appendChild(note);
      }
    }

    const release = document.getElementById('release');
    if (release && !release.querySelector('[data-sept5-release]')) {
      release.insertAdjacentHTML('beforeend', currentReleaseHtml());
      const caution = makeCallout('<strong>Release-vs-runtime boundary:</strong> GitHub proves the source release and staging provenance recorded above. External production backend/frontend deployment checks are separate operational evidence and should not be inferred solely from the merge commit.', 'limit');
      release.appendChild(caution);
    }
    if (release && !release.querySelector('[data-active-discourse-branch]')) release.insertAdjacentHTML('beforeend', activeBranchHtml());

    const limits = document.getElementById('limits');
    if (limits && !limits.querySelector('[data-runtime-truth-debt]')) limits.insertAdjacentHTML('beforeend', truthDebtHtml());
  }

  function updateLearn() {
    const generation = document.getElementById('generation');
    if (generation) {
      replaceText(generation, 'defaults to temperature 0.2', 'defaults to temperature 0');
      replaceText(generation, 'temperature <code>0.2</code>', 'temperature <code>0</code>');
      if (!generation.querySelector('[data-sept5-generation]')) {
        const note = makeCallout(`<strong>Current released production path:</strong> Scout uses <code>${SNAPSHOT.model}</code>. RAG/LITE generation calls use temperature <code>0</code> and top-p <code>0.9</code>; max output remains clamped to at most 512 tokens by the provider adapter. Evaluation/browser-local scripts can intentionally use different sampling settings.`, 'production');
        note.dataset.sept5Generation = 'true';
        generation.appendChild(note);
        generation.insertAdjacentHTML('beforeend', sourceRow([[PROVIDER, 'production provider settings'], [`${REPO}/blob/master/lib/rag-agent.js`, 'released RAG generation call'], [`${REPO}/blob/master/lib/lite-agent.js`, 'released LITE generation call']]));
      }
    }

    const stateTools = document.getElementById('state-tools');
    if (stateTools && !stateTools.querySelector('[data-sept5-conversation]')) {
      const released = makeCallout('<strong>Conversation iteration released Sep 5:</strong> the Phase 7/8 iteration expanded generic policy classification, response-contract handling, referent/context resolution, evidence selection, and validation regressions. The released result still has known dated conversation-suite residuals; release is not a 132/132 claim.', 'no-math');
      released.dataset.sept5Conversation = 'true';
      stateTools.appendChild(released);
      stateTools.insertAdjacentHTML('beforeend', sourceRow([[PHASE_PR, 'PR #23 released Phase 7/8 changes']]));
    }
    if (stateTools && !stateTools.querySelector('[data-active-discourse-branch]')) stateTools.insertAdjacentHTML('beforeend', activeBranchHtml());

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
      existing.innerHTML = `<strong>Current released API source (${SNAPSHOT.audited}):</strong> <code>master@${SNAPSHOT.production.sha}</code>, qualified <code>develop@${SNAPSHOT.develop.sha}</code>, same Git tree <code>${SNAPSHOT.production.tree.slice(0, 8)}</code>; staging source <code>${SNAPSHOT.staging.sourceSha}</code>. The active <code>${SNAPSHOT.active.branch}</code> discourse changes are not part of this released API/runtime contract.`;
    } else if (scope && !scope.querySelector('[data-sept5-release]')) {
      scope.insertAdjacentHTML('beforeend', currentReleaseHtml());
    }

    const diagnostics = document.getElementById('diagnostics');
    if (diagnostics && !diagnostics.querySelector('[data-sept5-diagnostics]')) {
      const note = makeCallout('<strong>Per-turn gate diagnostics are opt-in twice:</strong> <code>/api/chat</code> exposes gate-debug detail only when the server has <code>SCOUT_GATE_DEBUG=true</code> and the request explicitly opts in with <code>gateDebug: true</code> (or query <code>gateDebug=1</code>). Authorized debug responses are <code>Cache-Control: no-store</code> and bypass normal response-cache reuse. A public request cannot enable diagnostics by itself.', 'production');
      note.dataset.sept5Diagnostics = 'true';
      diagnostics.appendChild(note);
      diagnostics.insertAdjacentHTML('beforeend', sourceRow([[SERVER, 'released chat diagnostic authorization/cache behavior'], [`${REPO}/blob/master/test/gate-debug-authorization.test.js`, 'authorization regression tests']]));
    }

    const costs = document.getElementById('costs');
    if (costs && !costs.querySelector('[data-runtime-truth-debt]')) costs.insertAdjacentHTML('beforeend', truthDebtHtml());
  }

  function updateChangelog() {
    const status = document.querySelectorAll('.changelog-page .docs-status-row .docs-status-card');
    if (status[0]) { status[0].querySelector('span').textContent = 'Production'; status[0].querySelector('strong').textContent = `master · ${SNAPSHOT.production.sha}`; }
    if (status[1]) { status[1].querySelector('span').textContent = 'Integration'; status[1].querySelector('strong').textContent = `develop · ${SNAPSHOT.develop.sha}`; }
    if (status[2]) { status[2].querySelector('span').textContent = 'Active unmerged'; status[2].querySelector('strong').textContent = `${SNAPSHOT.active.sha} · +${SNAPSHOT.active.ahead}/-${SNAPSHOT.active.behind}`; }
    if (status[3]) { status[3].querySelector('span').textContent = 'Audited'; status[3].querySelector('strong').textContent = SNAPSHOT.audited; }

    const current = document.getElementById('current-state');
    if (current) {
      const cards = current.querySelectorAll('.docs-grid-3 .docs-card');
      if (cards[0]) {
        cards[0].querySelector('.label').textContent = 'Production source';
        cards[0].querySelector('h3').innerHTML = `<code>master</code> · <code>${SNAPSHOT.production.sha}</code>`;
        cards[0].querySelector('p').textContent = `September 5 PR #29 source release; Git tree ${SNAPSHOT.production.tree.slice(0, 8)}.`;
      }
      if (cards[1]) {
        cards[1].querySelector('.label').textContent = 'Qualified integration source';
        cards[1].querySelector('h3').innerHTML = `<code>develop</code> · <code>${SNAPSHOT.develop.sha}</code>`;
        cards[1].querySelector('p').textContent = 'Same Git tree as production; includes release hardening and widget regressions.';
      }
      if (cards[2]) {
        cards[2].querySelector('.label').textContent = 'Active unmerged work';
        cards[2].querySelector('h3').innerHTML = `<code>${SNAPSHOT.active.sha}</code> · <code>+${SNAPSHOT.active.ahead}/-${SNAPSHOT.active.behind}</code>`;
        cards[2].querySelector('p').textContent = `${SNAPSHOT.active.branch}; newer than the released tree and not represented by staging.`;
      }
    }

    if (!document.getElementById('sep5-active-discourse')) {
      const anchor = current || document.querySelector('.changelog-page .docs-content .docs-section');
      if (anchor?.parentNode) {
        const active = document.createElement('section');
        active.className = 'docs-section';
        active.id = 'sep5-active-discourse';
        active.dataset.search = 'september 5 post release generic discourse frames clarification active branch cache direct kb';
        active.innerHTML = `
          <div class="docs-eyebrow">September 5, 2026 · Post-release active branch</div>
          <h2>Generic discourse frames and generated clarification moved two commits beyond develop.</h2>
          <p><code>${SNAPSHOT.active.branch}@${SNAPSHOT.active.sha}</code> is +${SNAPSHOT.active.ahead}/-${SNAPSHOT.active.behind} from <code>develop@${SNAPSHOT.develop.sha}</code> at recheck. It is not in staging or production.</p>
          <div class="docs-flow">
            <div class="docs-flow-step"><div><strong><code>f145f8c</code> · discourse frames.</strong><span>Server-owned state tracks the active conversational relation and ordered user-introduced alternatives without domain vocabulary. Corrections/removals/ordinals mutate the set; assistant mentions do not become authoritative set members.</span></div></div>
            <div class="docs-flow-step"><div><strong><code>5bd9437</code> · cache-hit state + clarification.</strong><span>Discourse state is committed before cache/direct-KB early returns, and unresolved plural-set questions can route through a <code>CLARIFICATION</code> control mode instead of a scope decline.</span></div></div>
            <div class="docs-flow-step"><div><strong>Test surface.</strong><span>The branch adds <code>test/discourse-frames.test.js</code>. No GitHub Actions run/status or PR for this head was exposed at the audit recheck, so no new pass count is asserted.</span></div></div>
          </div>
          ${sourceRow([[ACTIVE_COMMIT, 'active branch head'], [ACTIVE_COMPARE, 'branch diff from develop'], [`${REPO}/blob/feat/generic-conversation-sets/test/discourse-frames.test.js`, 'discourse-frame regression file']])}`;
        anchor.parentNode.insertBefore(active, anchor.nextSibling);
      }
    }

    if (!document.getElementById('sep5-release')) {
      const active = document.getElementById('sep5-active-discourse');
      const anchor = active || current || document.querySelector('.changelog-page .docs-content .docs-section');
      if (anchor?.parentNode) {
        const sep5 = document.createElement('section');
        sep5.className = 'docs-section';
        sep5.id = 'sep5-release';
        sep5.dataset.search = 'september 5 2026 release phase 7 8 hardening widget diagnostics staging production 1019';
        sep5.innerHTML = `
          <div class="docs-eyebrow">September 5, 2026 · Qualified tree released</div>
          <h2>Phase 7/8, widget fixes, and release hardening reached production source.</h2>
          <p>The August 27 product-site snapshot still showed Phase 02 on an active feature branch. The accepted conversation-gate work was merged, widget initialization/input/scroll fixes were merged, release hardening was applied, staging was regenerated from <code>${SNAPSHOT.develop.sha}</code>, and PR #29 promoted the exact qualified tree to production.</p>
          <div class="docs-flow">
            <div class="docs-flow-step"><div><strong>PR #23 · conversation gate.</strong><span>Generic policy/contracts, follow-up/referent handling, evidence selection and validation regressions. Pre-release checkpoint: ${SNAPSHOT.conversation.turns} turns, ${SNAPSHOT.conversation.conversations} conversations.</span></div></div>
            <div class="docs-flow-step"><div><strong>PR #24 · idempotent embed.</strong><span>Guards repeated ProjectHub initialization and exposes an explicit initializer for dynamic embeds.</span></div></div>
            <div class="docs-flow-step"><div><strong>PR #26 · composer/scroll.</strong><span>Typing stays available during replies, submitted follow-ups can queue, and auto-scroll no longer hijacks a user who has scrolled up.</span></div></div>
            <div class="docs-flow-step"><div><strong>PR #28 · release hardening.</strong><span>Diagnostics require server authorization + request opt-in, debug turns are cache-isolated, partial widget setup rolls back for safe retry, and browser regressions cover drafts/bottom-follow.</span></div></div>
            <div class="docs-flow-step"><div><strong>PR #29 · production source.</strong><span><code>master@${SNAPSHOT.production.sha}</code> and <code>develop@${SNAPSHOT.develop.sha}</code> share Git tree <code>${SNAPSHOT.production.tree.slice(0, 8)}</code>; staging records <code>${SNAPSHOT.staging.sourceSha}</code>.</span></div></div>
          </div>
          ${currentVerificationHtml()}
          <div class="docs-callout warning"><strong>Known residuals remain:</strong> the pre-release conversation run did not pass every turn. ${SNAPSHOT.conversation.inferenceUnavailable} were classified as inference unavailable, and release evidence deferred remaining conversation failures rather than claiming all were fixed.</div>
          ${sourceRow([[RELEASE_PR, 'PR #29 production release'], [HARDENING_PR, 'PR #28 release hardening'], [PHASE_PR, 'PR #23 conversation gate'], [STAGING_SOURCE, 'released staging source']])}`;
        anchor.parentNode.insertBefore(sep5, anchor.nextSibling);
      }
    }

    if (!document.getElementById('sep2-release')) {
      const sep5 = document.getElementById('sep5-release');
      if (sep5?.parentNode) {
        const sep2 = document.createElement('section');
        sep2.className = 'docs-section';
        sep2.id = 'sep2-release';
        sep2.dataset.search = 'september 2 2026 production release staging';
        sep2.innerHTML = `<div class="docs-eyebrow">September 2, 2026 · Earlier production promotion</div><h2>The qualified August integration tree was promoted with a master-parented release branch.</h2><p>PR #22 replaced a conflicting direct develop→master PR (#21) with a clean release branch based on production ancestry. The same release pattern was used again on September 5.</p>${sourceRow([[`${REPO}/pull/22`, 'PR #22 Sep 2 release'], [`${REPO}/pull/21`, 'superseded direct release PR']])}`;
        sep5.parentNode.insertBefore(sep2, sep5.nextSibling);
      }
    }

    if (!document.getElementById('sep5-branch-audit')) {
      const sep2 = document.getElementById('sep2-release') || document.getElementById('sep5-release');
      if (sep2?.parentNode) {
        const audit = document.createElement('section');
        audit.className = 'docs-section';
        audit.id = 'sep5-branch-audit';
        audit.dataset.search = 'branch audit 35 branches projecthub dev historical dependabot active discourse';
        audit.innerHTML = `
          <div class="docs-eyebrow">September 5, 2026 · Branch audit</div>
          <h2>All visible branch heads were checked, then checked again before publication.</h2>
          <p><strong>ProjectHub:</strong> 35 visible branches. Twelve branch heads are newer than the August 27 product-page cutoff; 23 point to older July/August work. <strong>ProjectHub-dev:</strong> two visible branches. During the audit, <code>${SNAPSHOT.active.branch}</code> moved from the released develop pointer to <code>${SNAPSHOT.active.sha}</code>, so the later branch state is the one documented here.</p>
          <div class="docs-callout no-math"><strong>Git history nuance:</strong> old feature branches can still appear ahead/diverged after accepted changes were squash-merged. The site therefore uses merge state, current tree content, dates, branch tips, and staging provenance together rather than interpreting raw ahead/behind counts as release status.</div>
          <p>Current post-release branch categories: runtime development <code>${SNAPSHOT.active.sha}</code> (+${SNAPSHOT.active.ahead}/-${SNAPSHOT.active.behind} from develop) and dependency-only maintenance <code>${SNAPSHOT.pendingMaintenance}</code> (one lockfile-only commit ahead of master).</p>
          ${sourceRow([['https://github.com/BradleyMatera/ProjectHub/branches', 'ProjectHub branches'], ['https://github.com/BradleyMatera/ProjectHub-dev/branches', 'ProjectHub-dev branches'], ['./SCOUT-SOURCE-AUDIT.md', 'full branch audit']])}`;
        sep2.parentNode.insertBefore(audit, sep2.nextSibling);
      }
    }

    const firstGroup = document.querySelector('.changelog-page .docs-nav-group');
    if (firstGroup) {
      if (!firstGroup.querySelector('a[href="#sep5-active-discourse"]')) firstGroup.insertAdjacentHTML('afterbegin', '<a href="#sep5-active-discourse"><span class="nav-code">NEW</span>Active discourse branch</a>');
      if (!firstGroup.querySelector('a[href="#sep5-release"]')) firstGroup.insertAdjacentHTML('beforeend', '<a href="#sep5-release"><span class="nav-code">SEP</span>Sep 5 release</a>');
      if (!firstGroup.querySelector('a[href="#sep2-release"]')) firstGroup.insertAdjacentHTML('beforeend', '<a href="#sep2-release"><span class="nav-code">SEP</span>Sep 2 release</a>');
      if (!firstGroup.querySelector('a[href="#sep5-branch-audit"]')) firstGroup.insertAdjacentHTML('beforeend', '<a href="#sep5-branch-audit"><span class="nav-code">AUD</span>Branch audit</a>');
    }
    const mobile = document.querySelector('.changelog-page .docs-mobile-nav select');
    if (mobile) {
      if (!mobile.querySelector('option[value="sep5-active-discourse"]')) mobile.insertAdjacentHTML('afterbegin', '<option value="sep5-active-discourse">Sep 5 · Active discourse branch</option>');
      if (!mobile.querySelector('option[value="sep5-release"]')) mobile.insertAdjacentHTML('beforeend', '<option value="sep5-release">Sep 5 · Qualified release</option>');
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
