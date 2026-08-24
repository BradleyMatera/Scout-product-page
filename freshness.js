(() => {
  'use strict';

  // Audited source snapshot. Keep production, integrated development, staging
  // packaging, and dated gate results separate so the site does not turn a
  // develop result into a production claim.
  const SNAPSHOT = {
    audited: 'August 23, 2026',
    production: {
      branch: 'master',
      sha: '4a1eee7',
      model: '@cf/meta/llama-3.1-8b-instruct-fast'
    },
    develop: {
      branch: 'develop',
      sha: 'c9007ff',
      runtimeSha: 'e3f1a59',
      ahead: 53,
      behind: 4,
      docsOnlyHead: true
    },
    staging: {
      wrapperSha: 'ef125fe',
      sourceSha: 'd1da87b'
    },
    gate: {
      releaseReady: false,
      unitTests: '924/924',
      recall6: '1.000',
      mrr6: '0.954',
      localApi: '23/23',
      focusedTechnicalErrors: '1/27',
      conversationTurns: '70/132',
      conversations: '12/33'
    }
  };

  const SOURCE = {
    compare: 'https://github.com/BradleyMatera/ProjectHub/compare/2d958e28b48ff3798a501a650e544823e639f19b...c9007ff126ccb77a23993a27a84058f542a4cc3e',
    v3: 'https://github.com/BradleyMatera/ProjectHub/blob/develop/docs/staging-8B-gate-report-v3.md',
    v2: 'https://github.com/BradleyMatera/ProjectHub/blob/develop/docs/staging-8B-gate-report-v2.md',
    firstGate: 'https://github.com/BradleyMatera/ProjectHub/blob/develop/docs/staging-8b-gate-report.md',
    fixReport: 'https://github.com/BradleyMatera/ProjectHub/blob/develop/docs/staging-8b-fix-report-2026-08-23.md',
    guardrailReport: 'https://github.com/BradleyMatera/ProjectHub/blob/develop/docs/guardrail-refinement-report.md',
    currentRuntimeCommit: 'https://github.com/BradleyMatera/ProjectHub/commit/e3f1a592c2968711028eb9ca3365bb95c02125fc',
    stagingMarker: 'https://github.com/BradleyMatera/ProjectHub-dev/blob/main/STAGING-SOURCE.json',
    completeness: 'https://github.com/BradleyMatera/ProjectHub/blob/develop/lib/completeness-check.js',
    contract: 'https://github.com/BradleyMatera/ProjectHub/blob/develop/lib/response-contract.js',
    tools: 'https://github.com/BradleyMatera/ProjectHub/blob/develop/lib/agent-tools.js',
    validator: 'https://github.com/BradleyMatera/ProjectHub/blob/develop/lib/grounding-validator.js',
    claimValidator: 'https://github.com/BradleyMatera/ProjectHub/blob/develop/lib/claim-validator.js',
    negation: 'https://github.com/BradleyMatera/ProjectHub/blob/develop/lib/negation-scope.js',
    scenarioRunner: 'https://github.com/BradleyMatera/ProjectHub/blob/develop/scripts/api-scenario-runner.js',
    playwright: 'https://github.com/BradleyMatera/ProjectHub/blob/develop/playwright.config.js'
  };

  const page = (location.pathname.split('/').filter(Boolean).pop() || 'index.html').toLowerCase();

  function sourceLink(href, text) {
    return `<a href="${href}" target="_blank" rel="noopener">Source: ${text} ↗</a>`;
  }

  function insertAfter(reference, node) {
    if (!reference?.parentNode) return;
    reference.parentNode.insertBefore(node, reference.nextSibling);
  }

  function callout(html, type = 'production') {
    const div = document.createElement('div');
    div.className = `docs-callout ${type}`;
    div.innerHTML = html;
    return div;
  }

  function sourceRow(items) {
    const row = document.createElement('div');
    row.className = 'docs-source-row';
    row.innerHTML = items.map(([href, label]) => sourceLink(href, label)).join('');
    return row;
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

  function updateOverview() {
    const eyebrow = document.querySelector('.hero .eyebrow');
    if (eyebrow) eyebrow.textContent = `Current implementation · audited ${SNAPSHOT.audited}`;

    const sourceCards = document.querySelectorAll('.source-grid article');
    if (sourceCards[1]) {
      const p = sourceCards[1].querySelector('p');
      if (p) p.textContent = 'Current develop adds customer-neutral core cleanup, EXPERIENCE / QUALIFICATIONS / FUTURE_CAPABILITY / META routing, stronger privacy/refusal handling, and validator hardening. These changes are not yet a production release.';
    }
    if (sourceCards[2]) {
      const p = sourceCards[2].querySelector('p');
      if (p) p.textContent = 'Customer-specific guardrails have been removed from more of the integrated core, but empty/no-KB operation, generalized domain packages, unrelated-domain portability tests, and a generic customer installer remain productization work.';
    }

    const architectureNotes = document.querySelectorAll('.architecture-notes article');
    if (architectureNotes[0]) {
      const strong = architectureNotes[0].querySelector('strong');
      const p = architectureNotes[0].querySelector('p');
      if (strong) strong.textContent = 'Routing is more explicit on develop.';
      if (p) p.textContent = 'Integrated classification now distinguishes experience/company questions, qualifications, future capability, meta capability limits, exhaustive-private-data refusal, and non-technical re-explanation before generation.';
    }

    const sourceBand = document.querySelector('.source-band');
    if (sourceBand && !document.getElementById('daily-develop-gate')) {
      const section = document.createElement('section');
      section.id = 'daily-develop-gate';
      section.className = 'section-pad section-dark';
      section.innerHTML = `
        <div class="shell">
          <header class="section-head reveal visible">
            <div class="section-index">Current develop gate</div>
            <div><h2>Integrated work is ahead of production.</h2><p>This block reports the latest audited development state separately from the released <code>master</code> runtime.</p></div>
          </header>
          <div class="metric-grid reveal visible">
            <article class="metric-card"><span>develop</span><strong>${SNAPSHOT.develop.sha}</strong><small>${SNAPSHOT.develop.ahead} ahead · ${SNAPSHOT.develop.behind} behind master</small></article>
            <article class="metric-card"><span>runtime code</span><strong>${SNAPSHOT.develop.runtimeSha}</strong><small>current develop HEAD is a report-only commit over this runtime patch</small></article>
            <article class="metric-card"><span>staging source</span><strong>${SNAPSHOT.staging.sourceSha}</strong><small>ProjectHub-dev source marker, behind current develop</small></article>
            <article class="metric-card"><span>release gate</span><strong>NO</strong><small>full conversation regression remains red</small></article>
            <article class="metric-card"><span>unit tests</span><strong>${SNAPSHOT.gate.unitTests}</strong><small>Aug 23 gate report</small></article>
            <article class="metric-card"><span>retrieval</span><strong>${SNAPSHOT.gate.recall6}</strong><small>Recall@6 · MRR@6 ${SNAPSHOT.gate.mrr6}</small></article>
            <article class="metric-card"><span>local API eval</span><strong>${SNAPSHOT.gate.localApi}</strong><small>latest v3 run</small></article>
            <article class="metric-card"><span>conversation suite</span><strong>${SNAPSHOT.gate.conversationTurns}</strong><small>${SNAPSHOT.gate.conversations} conversations passed</small></article>
          </div>
          <div class="source-links reveal visible">
            ${sourceLink(SOURCE.v3, 'Aug 23 release gate v3')}
            ${sourceLink(SOURCE.compare, '29-commit delta from prior site snapshot')}
            ${sourceLink(SOURCE.stagingMarker, 'staging source marker')}
          </div>
        </div>`;
      insertAfter(sourceBand, section);
    }
  }

  function updateDocs() {
    const cards = document.querySelectorAll('.docs-status-row .docs-status-card');
    if (cards[3]) cards[3].querySelector('strong').textContent = `master ${SNAPSHOT.production.sha} · develop ${SNAPSHOT.develop.sha}`;

    const overview = document.getElementById('overview');
    if (overview && !overview.querySelector('[data-fresh-snapshot]')) {
      const block = callout(`<strong>Development snapshot (${SNAPSHOT.audited}):</strong> production remains <code>master@${SNAPSHOT.production.sha}</code>. Integrated development is <code>develop@${SNAPSHOT.develop.sha}</code>, ${SNAPSHOT.develop.ahead} commits ahead and ${SNAPSHOT.develop.behind} behind <code>master</code>. The latest executable patch in that line is <code>${SNAPSHOT.develop.runtimeSha}</code>; the current HEAD adds the v3 gate report. The staging mirror still identifies <code>${SNAPSHOT.staging.sourceSha}</code> as its source, so staging frontend source and current develop are not identical.`, 'warning');
      block.dataset.freshSnapshot = 'true';
      const lede = overview.querySelector('.docs-lede') || overview.querySelector('p');
      insertAfter(lede, block);
      insertAfter(block, sourceRow([[SOURCE.v3, 'release gate v3'], [SOURCE.stagingMarker, 'staging source marker'], [SOURCE.compare, 'develop delta']]));
    }

    const retrieval = document.getElementById('retrieval');
    if (retrieval) {
      replaceText(retrieval, 'MRR@6 of 0.971', `MRR@6 of ${SNAPSHOT.gate.mrr6}`);
      if (!retrieval.querySelector('[data-mrr-delta]')) {
        const note = callout(`<strong>Current develop measurement:</strong> the Aug. 23 gate reports <strong>Recall@6 = ${SNAPSHOT.gate.recall6}</strong> and <strong>MRR@6 = ${SNAPSHOT.gate.mrr6}</strong>. Earlier documentation showed MRR@6 = 0.971. The algorithm files did not need to change for the metric to move; corpus/chunk/ranking inputs can alter rank positions.`, 'warning');
        note.dataset.mrrDelta = 'true';
        retrieval.appendChild(note);
        retrieval.appendChild(sourceRow([[SOURCE.v3, 'Aug 23 measured gate']]));
      }
    }

    const contracts = document.getElementById('response-contracts');
    if (contracts && !contracts.querySelector('[data-contract-delta]')) {
      const block = document.createElement('div');
      block.dataset.contractDelta = 'true';
      block.innerHTML = `
        <h3>Aug. 23 integrated routing additions</h3>
        <p>The current <code>develop</code> contract/classification layer has explicit handling for several cases that were previously falling into broader categories:</p>
        <div class="docs-grid-2">
          <article class="docs-card"><span class="label">EXPERIENCE</span><h3>Companies and employment history</h3><p>Company-list and employment-history questions can request experience evidence instead of drifting into project/profile retrieval.</p></article>
          <article class="docs-card"><span class="label">QUALIFICATIONS</span><h3>Aggregate qualification evidence</h3><p>Degree, certifications, skills, and experience can be gathered as a qualification-oriented response contract.</p></article>
          <article class="docs-card"><span class="label">FUTURE_CAPABILITY</span><h3>Potential is not current experience</h3><p>Future-learning questions are separated from current skill/employment claims and receive an explicit future claim ceiling.</p></article>
          <article class="docs-card"><span class="label">META / REFUSAL</span><h3>Capability and privacy boundaries</h3><p>URL browsing, persistence/memory requests, exhaustive personal-detail requests, and non-technical re-explanation now have more specific deterministic routes.</p></article>
        </div>`;
      contracts.appendChild(block);
      contracts.appendChild(sourceRow([[SOURCE.completeness, 'intent classification'], [SOURCE.contract, 'response contracts'], [SOURCE.fixReport, '8B fix report']]));
    }

    const tools = document.getElementById('tools');
    if (tools && !tools.querySelector('[data-tool-delta]')) {
      const note = callout('<strong>Tool behavior change on develop:</strong> <code>get_candidate_profile</code> now accepts a <code>qualifications</code> aggregate section. This is an extension of the existing read-only tool, not a new public write capability.', 'production');
      note.dataset.toolDelta = 'true';
      tools.appendChild(note);
      tools.appendChild(sourceRow([[SOURCE.tools, 'agent-tools.js'], [SOURCE.fixReport, 'qualification routing report']]));
    }

    const validation = document.getElementById('validation');
    if (validation && !validation.querySelector('[data-validator-delta]')) {
      const note = callout('<strong>Aug. 23 validator changes:</strong> explicit negation now prevents several false-positive forbidden/skill-claim rejections, and unknown-skill evidence matching now requires whole-token/phrase presence instead of substring presence. For example, <code>vibe</code> is no longer considered evidenced just because an unrelated chunk contains <code>vibes</code>.', 'production');
      note.dataset.validatorDelta = 'true';
      validation.appendChild(note);
      validation.appendChild(sourceRow([[SOURCE.currentRuntimeCommit, 'whole-token validator patch'], [SOURCE.validator, 'grounding validator'], [SOURCE.claimValidator, 'claim validator'], [SOURCE.negation, 'negation scope']]));
    }

    const testing = document.getElementById('testing');
    if (testing && !testing.querySelector('[data-current-gate]')) {
      const block = document.createElement('div');
      block.dataset.currentGate = 'true';
      block.innerHTML = `
        <h3>Current development gate · ${SNAPSHOT.audited}</h3>
        <div class="docs-table-wrap"><table class="docs-table"><thead><tr><th>Gate</th><th>Latest recorded result</th><th>Interpretation</th></tr></thead><tbody>
          <tr><td><code>npm test</code></td><td>PASS · ${SNAPSHOT.gate.unitTests}</td><td>Current unit suite.</td></tr>
          <tr><td><code>npm run eval-retrieval</code></td><td>PASS · Recall@6 ${SNAPSHOT.gate.recall6}, MRR@6 ${SNAPSHOT.gate.mrr6}</td><td>Retrieval-only measurement.</td></tr>
          <tr><td><code>npm run build</code></td><td>PASS</td><td>Current build completes.</td></tr>
          <tr><td><code>npm run eval:local-api</code></td><td>PASS · ${SNAPSHOT.gate.localApi}</td><td>Latest v3 run against dev backend.</td></tr>
          <tr><td>Focused TE reliability</td><td>${SNAPSHOT.gate.focusedTechnicalErrors} TECHNICAL_ERROR</td><td>Three targeted prompts × repeated attempts; one residual provenance failure.</td></tr>
          <tr><td><code>test-production-conversations.py</code></td><td>FAIL · ${SNAPSHOT.gate.conversationTurns} turns, ${SNAPSHOT.gate.conversations} conversations</td><td>Mix of material runtime failures and stale harness assertions; release remains blocked.</td></tr>
        </tbody></table></div>
        <div class="docs-code"><div class="docs-code-head"><span>Additional release-gate commands now used</span><button class="docs-copy" type="button">Copy</button></div><pre>PROJECTHUB_API_URL=https://dev.projecthub-chat.bradleymatera.dev/api/chat node scripts/api-scenario-runner.js
npx playwright test --config=playwright.config.js
python test-production-conversations.py --url https://dev.projecthub-chat.bradleymatera.dev/api/chat --delay 2.5</pre></div>`;
      testing.appendChild(block);
      testing.appendChild(sourceRow([[SOURCE.v3, 'latest gate results'], [SOURCE.scenarioRunner, 'API scenario runner'], [SOURCE.playwright, 'Playwright configuration']]));
    }

    const release = document.getElementById('release');
    if (release && !release.querySelector('[data-release-gate]')) {
      const note = callout(`<strong>Current release decision: NO.</strong> The targeted validator failures improved and the latest local API eval is ${SNAPSHOT.gate.localApi}, but the full conversation regression is still ${SNAPSHOT.gate.conversationTurns} turns / ${SNAPSHOT.gate.conversations} conversations passing. The v3 report says not to open the <code>develop → master</code> release PR yet.`, 'limit');
      note.dataset.releaseGate = 'true';
      release.insertBefore(note, release.firstElementChild?.nextSibling || null);
      release.appendChild(sourceRow([[SOURCE.v3, 'release gate v3']]));
    }
  }

  function updateLearn() {
    const evalSection = document.getElementById('retrieval-eval');
    if (evalSection) {
      replaceText(evalSection, '0.971', SNAPSHOT.gate.mrr6);
      if (!evalSection.querySelector('[data-current-mrr]')) {
        const note = callout(`<strong>A useful real-world example of metric drift:</strong> the earlier documented MRR@6 was 0.971; the Aug. 23 develop gate records ${SNAPSHOT.gate.mrr6} while Recall@6 remains ${SNAPSHOT.gate.recall6}. MRR is sensitive to <em>where</em> the first relevant result lands, so a corpus/chunk change can lower MRR without creating a retrieval miss.`, 'warning');
        note.dataset.currentMrr = 'true';
        evalSection.appendChild(note);
        evalSection.appendChild(sourceRow([[SOURCE.v3, 'current retrieval measurement']]));
      }
    }

    const contracts = document.getElementById('contracts');
    if (contracts && !contracts.querySelector('[data-routing-lesson]')) {
      const block = document.createElement('div');
      block.dataset.routingLesson = 'true';
      block.innerHTML = `
        <h3>Concrete example: adding a new intent is ordinary program logic</h3>
        <p>On Aug. 23, <code>develop</code> added explicit categories for <code>EXPERIENCE</code>, <code>QUALIFICATIONS</code>, and <code>FUTURE_CAPABILITY</code>, plus stronger <code>META</code> and <code>REFUSAL</code> cases. This is not the language model “learning” a new concept. JavaScript patterns classify the question, then response-contract code chooses facts, constraints, and answer shape for that category.</p>
        <div class="worked-example"><h4>"What qualifications does he have?"</h4><div class="step"><b>1</b><span><code>classifyIntent()</code> returns <code>QUALIFICATIONS</code>.</span></div><div class="step"><b>2</b><span>The response contract selects qualification-oriented facts rather than generic project facts.</span></div><div class="step"><b>3</b><span>The lite route can call <code>get_candidate_profile({ section: "qualifications" })</code>.</span></div><div class="step"><b>4</b><span>The model receives the bounded evidence and writes the prose; validation still runs afterward.</span></div></div>
        <div class="docs-callout no-math"><strong>Why this matters:</strong> classification quality can change model behavior even when the model itself, BM25 formula, and RRF formula are unchanged.</div>`;
      contracts.appendChild(block);
      contracts.appendChild(sourceRow([[SOURCE.completeness, 'intent classifier'], [SOURCE.contract, 'contract builder'], [SOURCE.fixReport, 'Aug 23 fix report']]));
    }

    const validation = document.getElementById('validation');
    if (validation && !validation.querySelector('[data-token-match-lesson]')) {
      const block = callout('<strong>Whole-token evidence matching:</strong> current develop tightened unknown-skill validation from raw substring checks to phrase/token matching. Mathematically this is not a new scoring model; it is a stricter string-membership rule. It prevents a query term such as <code>vibe</code> from matching <code>vibes</code> by accident.', 'production');
      block.dataset.tokenMatchLesson = 'true';
      validation.appendChild(block);
      validation.appendChild(sourceRow([[SOURCE.currentRuntimeCommit, 'whole-token patch']]));
    }
  }

  function updateApi() {
    const scope = document.getElementById('scope');
    if (scope && !scope.querySelector('[data-api-snapshot]')) {
      const note = callout(`<strong>Behavior snapshot:</strong> the public production API remains tied to <code>master@${SNAPSHOT.production.sha}</code>. Current <code>develop@${SNAPSHOT.develop.sha}</code> changes the semantics behind <code>POST /api/chat</code> (classification, response contracts, qualification/experience routing, privacy/meta boundaries, and validation) but this Aug. 23 delta does not add a new public commercial API surface.`, 'warning');
      note.dataset.apiSnapshot = 'true';
      scope.appendChild(note);
      scope.appendChild(sourceRow([[SOURCE.compare, 'develop delta'], [SOURCE.v3, 'current release gate']]));
    }

    const chat = document.getElementById('chat');
    if (chat && !chat.querySelector('[data-api-behavior-delta]')) {
      const note = callout('<strong>Integrated chat behavior change:</strong> company/employment questions can route as <code>EXPERIENCE</code>, qualification questions as <code>QUALIFICATIONS</code>, future-learning questions as <code>FUTURE_CAPABILITY</code>, exhaustive personal-detail requests toward <code>REFUSAL</code>, and URL/persistence capability questions toward <code>META</code>. These are response-planning changes behind the same endpoint.', 'production');
      note.dataset.apiBehaviorDelta = 'true';
      chat.appendChild(note);
      chat.appendChild(sourceRow([[SOURCE.completeness, 'classification'], [SOURCE.contract, 'contract behavior']]));
    }

    const compatibility = document.getElementById('compatibility');
    if (compatibility && !compatibility.querySelector('[data-api-gate]')) {
      const note = callout(`<strong>Do not treat current develop behavior as an API release.</strong> The latest gate remains NO because the 132-turn conversation suite is not green. Production compatibility claims therefore remain anchored to <code>master</code>, not current <code>develop</code>.`, 'limit');
      note.dataset.apiGate = 'true';
      compatibility.appendChild(note);
      compatibility.appendChild(sourceRow([[SOURCE.v3, 'release decision']]));
    }
  }

  function updateChangelog() {
    const cards = document.querySelectorAll('.docs-status-row .docs-status-card');
    if (cards[0]) cards[0].querySelector('strong').textContent = `master · ${SNAPSHOT.production.sha}`;
    if (cards[1]) cards[1].querySelector('strong').textContent = `develop · ${SNAPSHOT.develop.sha}`;
    if (cards[2]) cards[2].querySelector('strong').textContent = `${SNAPSHOT.develop.ahead} ahead · ${SNAPSHOT.develop.behind} behind`;
    if (cards[3]) cards[3].querySelector('strong').textContent = SNAPSHOT.audited;

    const current = document.getElementById('current-state');
    if (current && !current.querySelector('[data-aug23-state]')) {
      const block = document.createElement('div');
      block.dataset.aug23State = 'true';
      block.innerHTML = `
        <h3>August 23 source state</h3>
        <div class="docs-table-wrap"><table class="docs-table"><thead><tr><th>Line</th><th>SHA</th><th>State</th></tr></thead><tbody>
          <tr><td>Production</td><td><code>${SNAPSHOT.production.sha}</code></td><td><code>master</code> remains the released line.</td></tr>
          <tr><td>Integrated develop</td><td><code>${SNAPSHOT.develop.sha}</code></td><td>${SNAPSHOT.develop.ahead} ahead / ${SNAPSHOT.develop.behind} behind master.</td></tr>
          <tr><td>Latest executable develop patch</td><td><code>${SNAPSHOT.develop.runtimeSha}</code></td><td>Whole-token skill evidence validation; HEAD after it is the v3 report commit.</td></tr>
          <tr><td>ProjectHub-dev wrapper</td><td><code>${SNAPSHOT.staging.wrapperSha}</code></td><td>Staging package wrapper.</td></tr>
          <tr><td>ProjectHub-dev source marker</td><td><code>${SNAPSHOT.staging.sourceSha}</code></td><td>Staging frontend is behind current develop.</td></tr>
        </tbody></table></div>
        <div class="docs-callout limit"><strong>Release state:</strong> NO. No new <code>develop → master</code> release should be represented as shipped from this snapshot.</div>`;
      current.appendChild(block);
      current.appendChild(sourceRow([[SOURCE.v3, 'latest gate report'], [SOURCE.stagingMarker, 'staging source marker'], [SOURCE.compare, 'current divergence']]));
    }

    const post = document.getElementById('post-release-develop');
    if (post && !post.querySelector('[data-aug23-delta]')) {
      const block = document.createElement('div');
      block.dataset.aug23Delta = 'true';
      block.innerHTML = `
        <h3>August 23 · 29-commit development delta since the previous site audit</h3>
        <div class="docs-flow">
          <div class="docs-flow-step"><div><strong>Customer-neutrality cleanup</strong><span>Removed several customer-name/project/AWS-specific filters and most customer-specific <code>DIRECT_KB</code> bypasses from integrated core paths. The remaining direct profile-summary path is data-driven. False-employer follow-up resolution was made more generic.</span></div></div>
          <div class="docs-flow-step"><div><strong>First Cloudflare 8B gate</strong><span>The 8B backend measured 22/23 on the strict local-API set but exposed six material failures including exhaustive-personal-data handling, qualifications/company retrieval, re-explanation, and capability-boundary behavior. Release decision: NO.</span></div></div>
          <div class="docs-flow-step"><div><strong>Generic routing/contract fixes</strong><span>Added explicit <code>EXPERIENCE</code>, <code>QUALIFICATIONS</code>, <code>FUTURE_CAPABILITY</code>, privacy-refusal, capability-boundary, and non-technical re-explanation handling. <code>get_candidate_profile</code> gained a qualifications aggregate.</span></div></div>
          <div class="docs-flow-step"><div><strong>Test harness fixes</strong><span>Added a direct API scenario runner and Playwright configuration, corrected the browser send-button race, raised appropriate browser-test timeouts, and relaxed several exact-keyword checks that were rejecting semantically valid replies.</span></div></div>
          <div class="docs-flow-step"><div><strong>Validator patches</strong><span>Negated forbidden/unknown-skill statements are handled more carefully, negation vocabulary expanded, and skill evidence now requires whole-token/phrase matching instead of substring matching.</span></div></div>
          <div class="docs-flow-step"><div><strong>Latest gate</strong><span>Unit tests ${SNAPSHOT.gate.unitTests}; Recall@6 ${SNAPSHOT.gate.recall6}; MRR@6 ${SNAPSHOT.gate.mrr6}; local API ${SNAPSHOT.gate.localApi}; focused technical-error set ${SNAPSHOT.gate.focusedTechnicalErrors}; full conversation regression ${SNAPSHOT.gate.conversationTurns} turns and ${SNAPSHOT.gate.conversations} conversations. Release remains blocked.</span></div></div>
        </div>`;
      post.insertBefore(block, post.firstElementChild?.nextSibling || null);
      post.appendChild(sourceRow([[SOURCE.guardrailReport, 'customer-neutrality report'], [SOURCE.firstGate, 'initial 8B gate'], [SOURCE.fixReport, '8B fix report'], [SOURCE.v2, 'gate v2'], [SOURCE.v3, 'gate v3'], [SOURCE.currentRuntimeCommit, 'latest runtime patch']]));
    }
  }

  if (page === 'index.html' || page === 'scout') updateOverview();
  else if (page === 'docs.html') updateDocs();
  else if (page === 'learn.html') updateLearn();
  else if (page === 'api.html') updateApi();
  else if (page === 'changelog.html') updateChangelog();

  window.__SCOUT_SOURCE_SNAPSHOT__ = SNAPSHOT;
})();
