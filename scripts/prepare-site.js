'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pages = [
  'index.html',
  'docs.html',
  'learn.html',
  'api.html',
  'changelog.html',
  'pricing.html',
];

const scriptTag = '  <script src="./freshness.js" defer></script>';
const snapshotScript = '  <script src="./snapshot-refresh.js" defer></script>';
const docsGraphicsScript = '  <script src="./docs-graphics.js" defer></script>';
const learnResourcesScript = '  <script src="./learn-resources.js" defer></script>';
const accountingScript = '  <script src="./accounting-correction.js" defer></script>';
const docsScript = '  <script src="./docs.js" defer></script>';
const learnCss = '  <link rel="stylesheet" href="./learn-resources.css" />';

const correctedCostSection = `        <section class="docs-section" id="cost-math" data-search="cloudflare neuron usage accounting exact model unknown unverified fp8 fast pricing actual estimated tokens free allocation">
          <div class="docs-eyebrow">11 · Provider usage math</div>
          <h2>Neuron math is only valid when the rate belongs to the exact model identifier.</h2>
          <p>Scout's normal Cloudflare generation target is <code>@cf/meta/llama-3.1-8b-instruct-fast</code>. Cloudflare documents that model as active, but its current pricing table does <strong>not</strong> publish an exact input/output neuron rate for that identifier. Scout therefore does not borrow rates from a similarly named model.</p>
          <div class="docs-callout production"><strong>Current accounting rule:</strong> preserve <code>result.usage.neurons</code> as actual provider usage when Cloudflare supplies it. Estimate from token counts only when the exact model identifier has a verified published rate. Otherwise neuron usage is <code>null</code> / unknown, not zero and not a guessed estimate.</div>
          <div class="docs-table-wrap"><table class="docs-table"><thead><tr><th>Exact identifier</th><th>Published neuron rate</th><th>Scout behavior</th></tr></thead><tbody>
            <tr><td><code>@cf/meta/llama-3.1-8b-instruct-fast</code></td><td>Not published on the current Cloudflare pricing table</td><td>Actual provider neurons when supplied; otherwise estimate remains unknown.</td></tr>
            <tr><td><code>@cf/meta/llama-3.1-8b-instruct-fp8-fast</code></td><td><code>4,119</code> / M input · <code>34,868</code> / M output</td><td>Exact-model estimate is allowed for this identifier.</td></tr>
            <tr><td><code>@cf/meta/llama-3.1-8b-instruct-fp8</code></td><td><code>13,778</code> / M input · <code>26,128</code> / M output</td><td>Uses its own distinct published rates.</td></tr>
          </tbody></table></div>
          <div class="equation"><span class="eq-title">General exact-model estimate</span><code>estimated_neurons = (input_tokens / 1,000,000) × published_input_rate(model)
                  + (output_tokens / 1,000,000) × published_output_rate(model)</code></div>
          <div class="worked-example"><h4>Worked example: FP8-fast only</h4><div class="step"><b>1</b><span>500 input tokens: <code>500 / 1,000,000 × 4,119 = 2.0595</code> neurons.</span></div><div class="step"><b>2</b><span>100 output tokens: <code>100 / 1,000,000 × 34,868 = 3.4868</code> neurons.</span></div><div class="step"><b>3</b><span>Total: <code>5.5463</code> neurons for <strong>@cf/meta/llama-3.1-8b-instruct-fp8-fast</strong>.</span></div><div class="step"><b>4</b><span><code>floor(10,000 / 5.5463) = 1,803</code> equal-sized requests is only an FP8-fast planning example. It is not a capacity estimate for Scout's normal <code>-fast</code> model while that exact rate is unpublished.</span></div></div>
          <p><code>0</code> means a known zero. <code>null</code> means the complete value is unknown. Request, session, daily-usage, and shadow-cost accounting keep that distinction. Once a billable session contains unknown neuron usage, its complete neuron total stays unknown instead of becoming a misleading partial sum after later known calls.</p>
          <div class="docs-source-row"><a href="https://developers.cloudflare.com/workers-ai/platform/pricing/" target="_blank" rel="noopener">Source: Cloudflare Workers AI pricing ↗</a><a href="https://developers.cloudflare.com/workers-ai/models/llama-3.1-8b-instruct-fast/" target="_blank" rel="noopener">Source: Cloudflare -fast model page ↗</a><a href="https://github.com/BradleyMatera/ProjectHub/commit/26b6fa032d864ab7312faa8092d8a6b7d8572c89" target="_blank" rel="noopener">Source: exact-model accounting fix ↗</a><a href="https://github.com/BradleyMatera/ProjectHub/commit/2c140ba747d09cd51d9fcd48f350b66dc6683efc" target="_blank" rel="noopener">Source: sticky session completeness ↗</a></div>
        </section>`;

function correctPublishedHtml(page, html) {
  if (page === 'learn.html') {
    const start = html.indexOf('<section class="docs-section" id="cost-math"');
    if (start !== -1) {
      const end = html.indexOf('</section>', start);
      if (end === -1) throw new Error('Cannot correct learn.html: cost-math section is not closed');
      html = `${html.slice(0, start)}${correctedCostSection}${html.slice(end + '</section>'.length)}`;
    }
  }

  if (page === 'changelog.html') {
    html = html
      .replace('Model-specific neuron rates updated', 'Initial rate mapping was later corrected')
      .replace('The same change updated the input/output neuron rates used for usage estimation.', 'The same change updated usage-rate assumptions. A later exact-model audit found that the published 4,119 / 34,868 rates belonged to the -fp8-fast identifier rather than the configured -fast identifier; the accounting correction is documented separately.');
  }

  return html;
}

for (const page of pages) {
  const file = path.join(root, page);
  if (!fs.existsSync(file)) throw new Error(`Missing Scout page: ${page}`);

  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('</body>')) throw new Error(`Cannot prepare ${page}: missing </body>`);

  html = correctPublishedHtml(page, html);

  if (page === 'learn.html' && !html.includes('href="./learn-resources.css"')) {
    if (!html.includes('</head>')) throw new Error('Cannot prepare learn.html: missing </head>');
    html = html.replace('</head>', `${learnCss}\n</head>`);
  }

  if (!html.includes('src="./freshness.js"')) {
    // Current-state content, the dated snapshot refresh, teaching resources, and
    // accounting corrections must exist before docs.js snapshots sections and
    // attaches navigation/search/copy behavior.
    if (html.includes(docsScript)) {
      let additions = `${scriptTag}\n${snapshotScript}\n${accountingScript}\n${docsScript}`;
      if (page === 'docs.html') additions = `${scriptTag}\n${snapshotScript}\n${docsGraphicsScript}\n${accountingScript}\n${docsScript}`;
      if (page === 'learn.html') additions = `${scriptTag}\n${snapshotScript}\n${learnResourcesScript}\n${accountingScript}\n${docsScript}`;
      html = html.replace(docsScript, additions);
    } else {
      html = html.replace('</body>', `${scriptTag}\n${snapshotScript}\n${accountingScript}\n</body>`);
    }
  } else {
    if (!html.includes('src="./snapshot-refresh.js"')) {
      html = html.replace('  <script src="./freshness.js" defer></script>', `  <script src="./freshness.js" defer></script>\n${snapshotScript}`);
    }
    if (!html.includes('src="./accounting-correction.js"')) {
      if (html.includes(docsScript)) html = html.replace(docsScript, `${accountingScript}\n${docsScript}`);
      else html = html.replace('</body>', `${accountingScript}\n</body>`);
    }
  }

  fs.writeFileSync(file, html, 'utf8');
  console.log(`Prepared ${page}`);
}
