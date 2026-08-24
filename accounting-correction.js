(() => {
  'use strict';

  // Shared Cloudflare accounting notes for the product pages that summarize runtime
  // behavior. Learn Scout owns its full accounting lesson directly in learn.html;
  // this file only keeps Overview, Docs, API, and Changelog consistent.
  //
  // Current facts:
  // - Scout generation remains @cf/meta/llama-3.1-8b-instruct-fast.
  // - Cloudflare does not publish token-to-neuron rates for that exact identifier.
  // - 4119 / 34868 belongs to @cf/meta/llama-3.1-8b-instruct-fp8-fast.
  // - ProjectHub accounting treats current -fast token-derived usage as unknown unless
  //   provider-reported neuron usage is available.

  const CURRENT_MODEL = '@cf/meta/llama-3.1-8b-instruct-fast';
  const FP8_FAST_MODEL = '@cf/meta/llama-3.1-8b-instruct-fp8-fast';
  const FP8_MODEL = '@cf/meta/llama-3.1-8b-instruct-fp8';
  const PRICING_SOURCE = 'https://developers.cloudflare.com/workers-ai/platform/pricing/';
  const MODEL_SOURCE = 'https://developers.cloudflare.com/ai/models/%40cf/meta/llama-3.1-8b-instruct-fast/';
  const FIX_COMMIT = 'https://github.com/BradleyMatera/ProjectHub/commit/26b6fa032d864ab7312faa8092d8a6b7d8572c89';
  const COMPLETENESS_COMMIT = 'https://github.com/BradleyMatera/ProjectHub/commit/2c140ba747d09cd51d9fcd48f350b66dc6683efc';
  const REPORT = 'https://github.com/BradleyMatera/ProjectHub/blob/develop/docs/cloudflare-neuron-accounting-report.md';
  const MASTER_PROVIDER = 'https://github.com/BradleyMatera/ProjectHub/blob/master/lib/cloudflare-provider.js';

  function sourceRow(items) {
    return `<div class="docs-source-row">${items.map(([href, label]) => `<a href="${href}" target="_blank" rel="noopener">Source: ${label} ↗</a>`).join('')}</div>`;
  }

  function callout(html, type = 'warning') {
    const div = document.createElement('div');
    div.className = `docs-callout ${type}`;
    div.innerHTML = html;
    return div;
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

  function updateDocs() {
    const inference = document.getElementById('inference');
    if (inference && !inference.querySelector('[data-neuron-accounting]')) {
      const note = callout(`<strong>Exact-model accounting:</strong> Scout still uses <code>${CURRENT_MODEL}</code>. Cloudflare documents that model as active but does not publish a token-to-neuron rate for that exact identifier on its current pricing table. Scout therefore keeps token-derived neuron usage <strong>unknown / unverified</strong> unless the provider supplies actual neuron usage. The published <code>4,119 / 34,868</code> rates belong to the distinct <code>${FP8_FAST_MODEL}</code> identifier.`, 'warning');
      note.dataset.neuronAccounting = 'true';
      inference.appendChild(note);
      inference.insertAdjacentHTML('beforeend', sourceRow([[PRICING_SOURCE, 'Cloudflare pricing'], [MODEL_SOURCE, 'Cloudflare -fast model'], [MASTER_PROVIDER, 'ProjectHub production provider adapter']]));
    }

    const telemetry = document.getElementById('telemetry');
    if (telemetry) {
      replaceText(telemetry, 'token/neuron estimates, and response egress when enabled.', 'token usage, provider-reported neuron usage when available, exact-model estimates when verified, unknown/unpriced markers when not verified, and response egress when enabled.');
      replaceText(telemetry, 'Attempt index/type, success, accepted state, model, tokens, and neuron information when available.', 'Attempt index/type, success, accepted state, model, tokens, actual neurons when supplied, and an exact-model estimate only when a verified rate exists.');
    }

    const sourceMap = document.getElementById('source-map');
    if (sourceMap) replaceText(sourceMap, 'Workers AI REST adapter, model restrictions, usage/neuron accounting and provider errors.', 'Workers AI REST adapter, exact-model pricing lookup, null-safe usage/neuron accounting, provider errors, and actual-versus-estimated usage handling.');
  }

  function updateApi() {
    const costs = document.getElementById('costs');
    if (costs && !costs.querySelector('[data-neuron-accounting]')) {
      const note = callout(`<strong>Actual, estimated, and unknown are different states:</strong> <code>actualNeurons</code> is provider-reported usage when available. <code>estimatedNeurons</code> is calculated only when the exact model has a verified published rate. For the current <code>${CURRENT_MODEL}</code> identifier, token-derived usage remains unknown when no provider actual value exists. Unknown is not represented as zero or as a verified <code>$0</code> cost.`, 'warning');
      note.dataset.neuronAccounting = 'true';
      costs.appendChild(note);
      costs.insertAdjacentHTML('beforeend', sourceRow([[PRICING_SOURCE, 'Cloudflare pricing'], [MASTER_PROVIDER, 'production provider adapter'], [FIX_COMMIT, 'exact-model accounting change'], [COMPLETENESS_COMMIT, 'session completeness change']]));
    }

    const sourceMap = document.getElementById('sources');
    if (sourceMap) replaceText(sourceMap, 'Credentials, request shape, free-allocation errors, neuron estimation.', 'Credentials, request shape, free-allocation errors, exact-model pricing, actual-neuron preservation, and null-safe estimation.');
  }

  function updateChangelog() {
    const old = document.getElementById('aug21-model');
    if (old) {
      const cards = Array.from(old.querySelectorAll('.docs-card'));
      const metering = cards.find(card => card.querySelector('.label')?.textContent.trim() === 'Metering');
      if (metering) {
        const h3 = metering.querySelector('h3');
        const p = metering.querySelector('p');
        if (h3) h3.textContent = 'Initial rate mapping was later corrected';
        if (p) p.innerHTML = 'The Aug. 21 model change also updated usage-rate assumptions. A later exact-model audit showed that <code>4,119 / 34,868</code> belongs to <code>-fp8-fast</code>, not Scout\'s configured <code>-fast</code> identifier. The model remained <code>@cf/meta/llama-3.1-8b-instruct-fast</code>; the accounting metadata was corrected.';
      }
    }

    if (document.getElementById('aug23-neuron-accounting')) return;
    const current = document.getElementById('current-state');
    if (!current?.parentNode) return;

    const section = document.createElement('section');
    section.className = 'docs-section';
    section.id = 'aug23-neuron-accounting';
    section.dataset.search = 'august 23 24 cloudflare neuron accounting production hotfix exact model pricing fp8 fast unknown null cost telemetry correction';
    section.innerHTML = `
      <div class="docs-eyebrow">Update / August 23–24, 2026 · Production accounting hotfix</div>
      <h2>Cloudflare neuron accounting now uses exact model identifiers instead of a similarly named model's rates.</h2>
      <p>Scout's active hosted model remains <code>${CURRENT_MODEL}</code>. The old accounting metadata associated <code>4,119 / 34,868</code> neurons per million input/output tokens with that identifier. Cloudflare publishes those rates for <code>${FP8_FAST_MODEL}</code> instead and does not document the two identifiers as billing aliases.</p>
      <div class="docs-flow">
        <div class="docs-flow-step"><div><strong>Model unchanged.</strong><span>The correction did not switch Scout to FP8-fast. Hosted generation remains <code>${CURRENT_MODEL}</code>.</span></div></div>
        <div class="docs-flow-step"><div><strong>Exact identifier lookup.</strong><span><code>${CURRENT_MODEL}</code> has no guessed token-to-neuron rate. <code>${FP8_FAST_MODEL}</code> and <code>${FP8_MODEL}</code> keep their own published rates.</span></div></div>
        <div class="docs-flow-step"><div><strong>Unknown is not zero.</strong><span>Requests without a provider actual value or verified exact-model estimate remain <code>null</code> / unknown rather than becoming a fabricated zero.</span></div></div>
        <div class="docs-flow-step"><div><strong>Completeness remains explicit.</strong><span>If a billable session contains unknown neuron usage, later known calls cannot turn the partial total into a falsely complete total.</span></div></div>
      </div>
      <div class="docs-table-wrap"><table class="docs-table"><thead><tr><th>Cloudflare platform fact</th><th>Current documented value</th></tr></thead><tbody>
        <tr><td>Included Workers AI allocation</td><td><strong>10,000 neurons/day</strong></td></tr>
        <tr><td>Daily reset</td><td><strong>00:00 UTC</strong></td></tr>
        <tr><td>Workers Paid usage above the included allocation</td><td><strong>$0.011 / 1,000 neurons</strong></td></tr>
      </tbody></table></div>
      <div class="docs-callout warning"><strong>Capacity is still not known from token counts for Scout's current model.</strong> Knowing the 10,000-neuron allocation does not justify a requests-per-day estimate while the exact <code>${CURRENT_MODEL}</code> token-to-neuron rate remains unpublished.</div>
      ${sourceRow([[PRICING_SOURCE, 'Cloudflare pricing'], [MODEL_SOURCE, 'Cloudflare -fast model'], [MASTER_PROVIDER, 'ProjectHub production provider adapter'], [FIX_COMMIT, 'exact-model accounting change'], [COMPLETENESS_COMMIT, 'session completeness change'], [REPORT, 'accounting audit report']])}
    `;
    current.parentNode.insertBefore(section, current.nextSibling);

    const firstCurrentGroup = document.querySelector('.changelog-page .docs-nav-group');
    if (firstCurrentGroup && !firstCurrentGroup.querySelector('a[href="#aug23-neuron-accounting"]')) {
      firstCurrentGroup.insertAdjacentHTML('beforeend', '<a href="#aug23-neuron-accounting"><span class="nav-code">NEW</span>Neuron accounting hotfix</a>');
    }
    const mobile = document.querySelector('.changelog-page .docs-mobile-nav select');
    if (mobile && !mobile.querySelector('option[value="aug23-neuron-accounting"]')) {
      mobile.insertAdjacentHTML('afterbegin', '<option value="aug23-neuron-accounting">Aug 23–24 · Neuron accounting hotfix</option>');
    }
    const count = document.querySelector('.changelog-page .docs-sidebar-title span:last-child');
    if (count) count.textContent = '16 topics';
  }

  function updateOverview() {
    const telemetryCards = Array.from(document.querySelectorAll('.component-card'));
    const telemetry = telemetryCards.find(card => card.querySelector('.component-code')?.textContent.trim() === 'OBS.07');
    if (telemetry) {
      const p = telemetry.querySelector('p');
      if (p) p.textContent = 'Prose source, provider, model, model-call count, token usage, provider-reported neuron usage when supplied, exact-model estimates only when verified, latency, repairs, retrieval candidates, selected evidence, and accounting completeness.';
    }

    const sourceBand = document.querySelector('.source-band');
    if (sourceBand && !document.getElementById('accounting-correction-note')) {
      const section = document.createElement('section');
      section.id = 'accounting-correction-note';
      section.className = 'section-pad section-dark';
      section.innerHTML = `<div class="shell"><header class="section-head reveal visible"><div class="section-index">Cloudflare accounting</div><div><h2>The model stayed the same. The rate mapping changed.</h2><p>Scout still uses <code>${CURRENT_MODEL}</code>. Cloudflare's current pricing table does not publish a token-to-neuron rate for that exact identifier, so Scout does not reuse the <code>${FP8_FAST_MODEL}</code> rate. Provider-reported neuron usage is retained when available; otherwise the current model's token-derived usage remains unknown.</p></div></header><div class="metric-grid reveal visible"><article class="metric-card"><span>Workers AI allocation</span><strong>10,000 neurons/day</strong><small>provider platform allocation</small></article><article class="metric-card"><span>reset</span><strong>00:00 UTC</strong><small>Cloudflare daily reset</small></article><article class="metric-card"><span>paid reference</span><strong>$0.011 / 1k neurons</strong><small>above included allocation on Workers Paid</small></article><article class="metric-card"><span>Scout token estimate</span><strong>UNVERIFIED</strong><small>for current ${CURRENT_MODEL}</small></article></div><div class="source-links reveal visible"><a href="${PRICING_SOURCE}" target="_blank" rel="noopener">Source: Cloudflare pricing ↗</a><a href="${MODEL_SOURCE}" target="_blank" rel="noopener">Source: current model page ↗</a><a href="${MASTER_PROVIDER}" target="_blank" rel="noopener">Source: production provider adapter ↗</a></div></div>`;
      sourceBand.parentNode.insertBefore(section, sourceBand.nextSibling);
    }
  }

  const page = (location.pathname.split('/').filter(Boolean).pop() || 'index.html').toLowerCase();
  if (page === 'docs.html') updateDocs();
  if (page === 'api.html') updateApi();
  if (page === 'changelog.html') updateChangelog();
  if (page === 'index.html' || page === 'scout') updateOverview();
})();