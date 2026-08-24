(() => {
  'use strict';

  // Cross-page correction for the Cloudflare neuron-accounting issue found while
  // sourcing Learn Scout. This runs before docs.js so search/navigation indexes the
  // corrected content instead of the older static wording.
  //
  // Source of truth:
  // - Cloudflare pricing publishes 4119 / 34868 for the exact identifier
  //   @cf/meta/llama-3.1-8b-instruct-fp8-fast.
  // - Scout's normal model identifier is @cf/meta/llama-3.1-8b-instruct-fast.
  // - Cloudflare documents that -fast model, but does not publish an exact neuron
  //   rate for that identifier on the current pricing table.
  // - ProjectHub therefore treats estimated neurons for -fast as unknown unless the
  //   provider returns an actual usage.neurons value.

  const CURRENT_MODEL = '@cf/meta/llama-3.1-8b-instruct-fast';
  const FP8_FAST_MODEL = '@cf/meta/llama-3.1-8b-instruct-fp8-fast';
  const FP8_MODEL = '@cf/meta/llama-3.1-8b-instruct-fp8';
  const PRICING_SOURCE = 'https://developers.cloudflare.com/workers-ai/platform/pricing/';
  const MODEL_SOURCE = 'https://developers.cloudflare.com/workers-ai/models/llama-3.1-8b-instruct-fast/';
  const FIX_COMMIT = 'https://github.com/BradleyMatera/ProjectHub/commit/26b6fa032d864ab7312faa8092d8a6b7d8572c89';
  const COMPLETENESS_COMMIT = 'https://github.com/BradleyMatera/ProjectHub/commit/2c140ba747d09cd51d9fcd48f350b66dc6683efc';
  const REPORT = 'https://github.com/BradleyMatera/ProjectHub/blob/develop/docs/cloudflare-neuron-accounting-report.md';
  const DEVELOP_PROVIDER = 'https://github.com/BradleyMatera/ProjectHub/blob/develop/lib/cloudflare-provider.js';
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

  function updateLearn() {
    const section = document.getElementById('cost-math');
    if (!section) return;

    section.dataset.search = 'cloudflare neuron usage accounting exact model unknown unverified fp8 fast pricing actual estimated tokens free allocation';
    section.innerHTML = `
      <div class="docs-eyebrow">11 · Provider usage math</div>
      <h2>Neuron math is only valid when the rate belongs to the exact model identifier.</h2>
      <p>Scout's normal Cloudflare generation target is <code>${CURRENT_MODEL}</code>. Cloudflare documents that model as active, but its current pricing table does <strong>not</strong> publish an exact input/output neuron rate for that identifier. Scout therefore must not borrow rates from a similarly named model.</p>
      <div class="docs-callout production"><strong>Current accounting rule:</strong> if Cloudflare returns <code>result.usage.neurons</code>, Scout can preserve that as actual provider usage. If the exact model has a published rate, Scout may calculate an estimate from token counts. If neither is available, neuron usage is <code>null</code> / <strong>unknown</strong>, not zero and not a guessed estimate.</div>

      <h3>The bug that was found</h3>
      <p>The old implementation associated <code>4,119</code> input neurons per million tokens and <code>34,868</code> output neurons per million tokens with <code>${CURRENT_MODEL}</code>. Cloudflare's pricing table actually publishes those numbers for <code>${FP8_FAST_MODEL}</code>. The identifiers are similar, but Cloudflare does not state that they are billing aliases, so using one model's published rate for the other was unsupported.</p>

      <div class="docs-table-wrap"><table class="docs-table"><thead><tr><th>Exact identifier</th><th>Published neuron rate</th><th>Scout behavior</th></tr></thead><tbody>
        <tr><td><code>${CURRENT_MODEL}</code></td><td>Not published on the current Cloudflare pricing table</td><td><strong>Unknown estimate.</strong> Preserve actual provider neurons when supplied; otherwise do not fabricate a number.</td></tr>
        <tr><td><code>${FP8_FAST_MODEL}</code></td><td><code>4,119</code> / M input · <code>34,868</code> / M output</td><td>May estimate with those exact rates when this exact model is used.</td></tr>
        <tr><td><code>${FP8_MODEL}</code></td><td><code>13,778</code> / M input · <code>26,128</code> / M output</td><td>Uses its own exact published rates, not the FP8-fast values.</td></tr>
      </tbody></table></div>

      <div class="equation"><span class="eq-title">General estimate, only for an exact priced model</span><code>estimated_neurons = (input_tokens / 1,000,000) × published_input_rate(model)
                  + (output_tokens / 1,000,000) × published_output_rate(model)</code></div>

      <div class="worked-example"><h4>Worked example: FP8-fast only, not Scout's normal -fast model</h4>
        <div class="step"><b>1</b><span>For <code>${FP8_FAST_MODEL}</code>, 500 input tokens give <code>500 / 1,000,000 × 4,119 = 2.0595</code> neurons.</span></div>
        <div class="step"><b>2</b><span>100 output tokens give <code>100 / 1,000,000 × 34,868 = 3.4868</code> neurons.</span></div>
        <div class="step"><b>3</b><span>Total estimate = <code>5.5463</code> neurons for <strong>that exact FP8-fast model</strong>.</span></div>
        <div class="step"><b>4</b><span>A simple free-allocation planning estimate would be <code>floor(10,000 / 5.5463) = 1,803</code> equal-sized FP8-fast requests. This calculation must not be reused for <code>${CURRENT_MODEL}</code> while its exact rate is unpublished.</span></div>
      </div>

      <h3>Why <code>null</code> matters</h3>
      <p><code>0</code> means a known quantity of zero. <code>null</code> means the complete value is unknown or unavailable. The accounting fix keeps those meanings separate at request, session, daily-usage, and shadow-cost levels. If one billable call in a session has unknown neuron usage, the complete session neuron total stays unknown instead of later turning into a misleading partial number.</p>
      <div class="docs-callout no-math"><strong>This is accounting logic, not model intelligence.</strong> Exact string keys map model identifiers to verified provider rates. Unknown identifiers remain unknown. The model does not decide any of this.</div>

      ${sourceRow([
        [PRICING_SOURCE, 'Cloudflare Workers AI pricing'],
        [MODEL_SOURCE, 'Cloudflare -fast model page'],
        [FIX_COMMIT, 'exact-model accounting fix'],
        [COMPLETENESS_COMMIT, 'sticky session-completeness fix'],
        [REPORT, 'ProjectHub accounting report']
      ])}
    `;

    // learn-resources.js used to add a temporary warning while the code was still
    // wrong. Once the correction layer is present, remove that obsolete warning.
    document.querySelectorAll('.learn-source-warning').forEach(node => node.remove());
  }

  function updateDocs() {
    const inference = document.getElementById('inference');
    if (inference && !inference.querySelector('[data-neuron-accounting]')) {
      const note = callout(`<strong>Exact-model accounting:</strong> Cloudflare currently documents <code>${CURRENT_MODEL}</code> as an active model but does not publish an exact neuron-per-token rate for that identifier on its pricing table. Scout's corrected accounting treats the estimate as <code>null</code> / unknown unless an actual provider neuron value is returned. The published <code>4,119 / 34,868</code> rates belong to <code>${FP8_FAST_MODEL}</code>, not automatically to <code>${CURRENT_MODEL}</code>.`, 'warning');
      note.dataset.neuronAccounting = 'true';
      inference.appendChild(note);
      inference.insertAdjacentHTML('beforeend', sourceRow([[PRICING_SOURCE, 'Cloudflare pricing'], [DEVELOP_PROVIDER, 'ProjectHub corrected provider adapter'], [REPORT, 'accounting correction report']]));
    }

    const telemetry = document.getElementById('telemetry');
    if (telemetry) {
      replaceText(telemetry, 'token/neuron estimates, and response egress when enabled.', 'token usage, actual neuron usage when supplied, exact-model estimates when verified, unknown/unpriced markers when not verified, and response egress when enabled.');
      replaceText(telemetry, 'Attempt index/type, success, accepted state, model, tokens, and neuron information when available.', 'Attempt index/type, success, accepted state, model, tokens, actual neurons when supplied, and an exact-model estimate only when a verified rate exists.');
    }

    const sourceMap = document.getElementById('source-map');
    if (sourceMap) replaceText(sourceMap, 'Workers AI REST adapter, model restrictions, usage/neuron accounting and provider errors.', 'Workers AI REST adapter, exact-model pricing lookup, null-safe usage/neuron accounting, provider errors, and actual-versus-estimated usage handling.');
  }

  function updateApi() {
    const costs = document.getElementById('costs');
    if (costs && !costs.querySelector('[data-neuron-accounting]')) {
      const note = callout(`<strong>Accounting completeness is part of the contract:</strong> an unpriced Cloudflare call is not represented as <code>0</code> neurons or <code>$0</code>. Unknown neuron usage stays <code>null</code>; unpriced shadow-cost sources are tracked as incomplete. Numeric totals may still exist for independently priced sources, but the API should not present a partial total as complete.`, 'warning');
      note.dataset.neuronAccounting = 'true';
      costs.appendChild(note);
      costs.insertAdjacentHTML('beforeend', sourceRow([[REPORT, 'Cloudflare accounting report'], [FIX_COMMIT, 'exact-model fix'], [COMPLETENESS_COMMIT, 'session completeness fix']]));
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
        if (p) p.innerHTML = 'The Aug. 21 model change also updated usage-rate assumptions. A later source audit showed that the <code>4,119 / 34,868</code> values belonged to <code>-fp8-fast</code>, not the configured <code>-fast</code> identifier. The correction is recorded separately below.';
      }
    }

    if (document.getElementById('aug23-neuron-accounting')) return;
    const current = document.getElementById('current-state');
    if (!current?.parentNode) return;

    const section = document.createElement('section');
    section.className = 'docs-section';
    section.id = 'aug23-neuron-accounting';
    section.dataset.search = 'august 23 cloudflare neuron accounting exact model pricing fp8 fast unknown null cost ledger telemetry correction';
    section.innerHTML = `
      <div class="docs-eyebrow">Update / August 23–24, 2026 · Accounting correction</div>
      <h2>Cloudflare neuron accounting was changed from a guessed model mapping to exact-model accounting.</h2>
      <p>The provider table had associated <code>4,119 / 34,868</code> neurons per million input/output tokens with <code>${CURRENT_MODEL}</code>. Cloudflare publishes those rates for <code>${FP8_FAST_MODEL}</code> and does not state that the two identifiers are billing aliases. The old mapping was therefore not supportable as exact accounting.</p>
      <div class="docs-flow">
        <div class="docs-flow-step"><div><strong>Exact identifier lookup.</strong><span><code>${CURRENT_MODEL}</code> now has no guessed rate. <code>${FP8_FAST_MODEL}</code> and <code>${FP8_MODEL}</code> keep their own published rates.</span></div></div>
        <div class="docs-flow-step"><div><strong>Unknown is not zero.</strong><span>Requests without a verified estimate or actual provider neuron value remain <code>null</code> / unknown instead of becoming a fabricated zero.</span></div></div>
        <div class="docs-flow-step"><div><strong>Cost completeness is explicit.</strong><span>Unpriced Cloudflare events mark shadow-cost totals incomplete rather than silently contributing a fake <code>$0</code>.</span></div></div>
        <div class="docs-flow-step"><div><strong>Session completeness is sticky.</strong><span>Once any billable call has unknown neuron usage, the complete session total remains unknown; later known calls cannot turn a partial sum into a falsely complete total.</span></div></div>
      </div>
      <div class="docs-table-wrap"><table class="docs-table"><thead><tr><th>Check</th><th>Recorded result</th></tr></thead><tbody>
        <tr><td>Cloudflare provider tests</td><td><strong>26/26 passed</strong></td></tr>
        <tr><td>Public telemetry tests</td><td><strong>14/14 passed</strong></td></tr>
        <tr><td>Cost-ledger tests</td><td><strong>13/13 passed</strong></td></tr>
        <tr><td>Cost-insights tests</td><td><strong>6/6 passed</strong></td></tr>
        <tr><td>Full unit suite in final correction report</td><td><strong>949/949 passed</strong></td></tr>
      </tbody></table></div>
      <div class="docs-callout warning"><strong>Release scope:</strong> this accounting correction is isolated from Scout's broader conversation-quality release gate. Correct accounting does not by itself mean all unrelated <code>develop</code> work is release-ready.</div>
      ${sourceRow([[FIX_COMMIT, '26b6fa0 exact-model fix'], [COMPLETENESS_COMMIT, '2c140ba session-completeness fix'], [REPORT, 'final accounting report'], [PRICING_SOURCE, 'Cloudflare pricing']])}
    `;
    current.parentNode.insertBefore(section, current.nextSibling);

    const firstCurrentGroup = document.querySelector('.changelog-page .docs-nav-group');
    if (firstCurrentGroup && !firstCurrentGroup.querySelector('a[href="#aug23-neuron-accounting"]')) {
      firstCurrentGroup.insertAdjacentHTML('beforeend', '<a href="#aug23-neuron-accounting"><span class="nav-code">NEW</span>Neuron accounting correction</a>');
    }
    const mobile = document.querySelector('.changelog-page .docs-mobile-nav select');
    if (mobile && !mobile.querySelector('option[value="aug23-neuron-accounting"]')) {
      mobile.insertAdjacentHTML('afterbegin', '<option value="aug23-neuron-accounting">Aug 23–24 · Neuron accounting correction</option>');
    }
    const count = document.querySelector('.changelog-page .docs-sidebar-title span:last-child');
    if (count) count.textContent = '16 topics';
  }

  function updateOverview() {
    const telemetryCards = Array.from(document.querySelectorAll('.component-card'));
    const telemetry = telemetryCards.find(card => card.querySelector('.component-code')?.textContent.trim() === 'OBS.07');
    if (telemetry) {
      const p = telemetry.querySelector('p');
      if (p) p.textContent = 'Prose source, provider, model, model-call count, token usage, actual neuron usage when supplied, exact-model estimates only when verified, latency, repairs, retrieval candidates, selected evidence, and accounting completeness.';
    }

    const sourceBand = document.querySelector('.source-band');
    if (sourceBand && !document.getElementById('accounting-correction-note')) {
      const section = document.createElement('section');
      section.id = 'accounting-correction-note';
      section.className = 'section-pad section-dark';
      section.innerHTML = `<div class="shell"><header class="section-head reveal visible"><div class="section-index">Accounting note</div><div><h2>Unknown usage stays unknown.</h2><p>The current Cloudflare model's exact neuron-per-token rate is not published, so Scout does not reuse the similarly named FP8-fast rate. Actual provider neuron values are retained when available; otherwise exact-model estimates remain unknown.</p></div></header><div class="source-links reveal visible"><a href="${REPORT}" target="_blank" rel="noopener">Source: accounting correction report ↗</a><a href="${PRICING_SOURCE}" target="_blank" rel="noopener">Source: Cloudflare pricing ↗</a></div></div>`;
      sourceBand.parentNode.insertBefore(section, sourceBand.nextSibling);
    }
  }

  const page = (location.pathname.split('/').filter(Boolean).pop() || 'index.html').toLowerCase();
  if (page === 'learn.html') updateLearn();
  if (page === 'docs.html') updateDocs();
  if (page === 'api.html') updateApi();
  if (page === 'changelog.html') updateChangelog();
  if (page === 'index.html' || page === 'scout') updateOverview();
})();