(() => {
  document.body.dataset.productPage = 'docs';
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    link.removeAttribute('aria-current');
    if ((link.getAttribute('href') || '').includes('docs.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // Current RAG-primary evidence selection has another numeric layer after RRF:
  // manually configured type/intent multipliers. Insert it into the teaching
  // sequence before docs.js snapshots the searchable sections and nav links.
  const rrf = document.getElementById('rrf');
  const retrieval = document.getElementById('retrieval');
  if (rrf && retrieval && !document.getElementById('evidence-rerank')) {
    const section = document.createElement('section');
    section.className = 'docs-section';
    section.id = 'evidence-rerank';
    section.dataset.search = 'evidence reranking boost multiplier heuristic score intent type weighting rag';
    section.innerHTML = `
      <div class="docs-eyebrow">06A · Evidence re-ranking</div>
      <h2>RRF is not the final evidence order.</h2>
      <p>Inside the current RAG-primary agent, retrieved evidence receives a second deterministic score before the final evidence block is built. The raw retrieval score is multiplied by a base weight for the evidence type and, when applicable, another weight for the detected intent.</p>
      <div class="equation"><span class="eq-title">Current re-ranking rule</span><code>boostedScore = evidenceScore × baseTypeBoost × intentBoost</code></div>
      <p>This is a hand-tuned heuristic. The multipliers are configuration encoded in JavaScript, not learned weights and not probabilities. After multiplying, evidence is sorted by <code>boostedScore</code>, deduplicated, capped to 8 items by default, and rendered into an evidence budget of 1,100 characters by default.</p>
      <div class="docs-table-wrap"><table class="docs-table"><thead><tr><th>Base type</th><th>Multiplier</th><th>Base type</th><th>Multiplier</th></tr></thead><tbody>
        <tr><td>identity</td><td>1.20</td><td>pitch</td><td>1.20</td></tr>
        <tr><td>summary</td><td>1.20</td><td>what-he-does</td><td>1.15</td></tr>
        <tr><td>looking-for</td><td>1.10</td><td>target-roles</td><td>1.10</td></tr>
        <tr><td>education</td><td>1.15</td><td>experience</td><td>1.15</td></tr>
        <tr><td>skills-* family</td><td>1.10</td><td>project</td><td>1.10</td></tr>
        <tr><td>faq</td><td>1.05</td><td>story</td><td>1.00</td></tr>
        <tr><td>blog</td><td>0.90</td><td>source</td><td>0.85</td></tr>
        <tr><td>boundaries</td><td>1.00</td><td>direct-answer</td><td>1.10</td></tr>
        <tr><td>scout-runtime</td><td>0.90</td><td>scout-cost</td><td>0.90</td></tr>
        <tr><td>contact</td><td>1.00</td><td>unlisted tag</td><td>1.00</td></tr>
      </tbody></table></div>
      <h3>Intent-specific multipliers</h3>
      <div class="docs-table-wrap"><table class="docs-table"><thead><tr><th>Intent</th><th>Additional boosts / reductions encoded today</th></tr></thead><tbody>
        <tr><td>META</td><td>scout-runtime 2.0; scout-cost 1.5; contact 1.3; direct-answer 1.5; boundaries 1.2</td></tr>
        <tr><td>CONTACT</td><td>contact 2.0; identity 1.3; direct-answer 1.5; scout-runtime 0.7</td></tr>
        <tr><td>PROFILE</td><td>identity 2.2; pitch 2.0; summary 2.0; what-he-does 1.5; looking-for/target-roles 1.2; education/certification 1.4; experience 1.3; faq/source/blog 0.7; scout-runtime 0.6</td></tr>
        <tr><td>SKILL</td><td>skills 1.5; project 1.3; experience 1.1; direct-answer 1.3; scout-runtime 0.7</td></tr>
        <tr><td>JOB_FIT</td><td>skills 1.5; project 1.4; pitch/what-he-does/target-roles 1.3; experience 1.2; scout-runtime 0.7</td></tr>
        <tr><td>NEGATIVE_ASSESSMENT</td><td>boundaries/direct-answer/faq 1.5; story/pitch 1.2; scout-runtime 0.6</td></tr>
        <tr><td>FUTURE_CAPABILITY</td><td>skills 1.4; project 1.3; pitch/what-he-does/target-roles 1.2; scout-runtime 0.7</td></tr>
        <tr><td>YES_NO</td><td>identity/pitch/skills/project/experience 1.2; scout-runtime 0.8</td></tr>
      </tbody></table></div>
      <div class="worked-example"><h4>Why a multiplier can change the winner</h4><div class="step"><b>A</b><span>An identity chunk with retrieval score <code>0.040</code> under PROFILE receives <code>0.040 × 1.2 × 2.2 = 0.1056</code>.</span></div><div class="step"><b>B</b><span>A blog chunk with a slightly higher raw score <code>0.045</code> under PROFILE receives <code>0.045 × 0.9 × 0.7 = 0.02835</code>.</span></div><div class="step"><b>→</b><span>The identity fact moves ahead because profile questions are explicitly biased toward identity evidence.</span></div></div>
      <div class="docs-callout warning"><strong>Trade-off:</strong> this improves control on a small domain, but the weights are subjective engineering choices. They should be regression-tested because changing one multiplier can change which facts reach generation even when BM25/RRF stays unchanged.</div>
      <div class="docs-source-row"><a href="https://github.com/BradleyMatera/ProjectHub/blob/develop/lib/rag-agent.js" target="_blank" rel="noopener">Source: current boost table and evidence selection · rag-agent.js ↗</a></div>`;
    retrieval.parentNode.insertBefore(section, retrieval);

    const rrfNav = document.querySelector('.docs-nav a[href="#rrf"]');
    if (rrfNav) {
      const link = document.createElement('a');
      link.href = '#evidence-rerank';
      link.innerHTML = '<span class="nav-code">06A</span>Evidence re-ranking';
      rrfNav.insertAdjacentElement('afterend', link);
    }
    const select = document.querySelector('.docs-mobile-nav select');
    if (select) {
      const option = document.createElement('option');
      option.value = 'evidence-rerank';
      option.textContent = 'Evidence re-ranking';
      const rrfOption = [...select.options].find(o => o.value === 'rrf');
      if (rrfOption) rrfOption.insertAdjacentElement('afterend', option);
      else select.appendChild(option);
    }
    const titleCount = document.querySelector('.docs-sidebar-title span:last-child');
    if (titleCount) titleCount.textContent = '21 topics';
  }

  // Clarify the two token-estimation schemes. The generic context-packet helper
  // uses chars/4, while the active RAG-primary agent estimates telemetry from
  // word and punctuation counts and uses a separate char budget for prompt size.
  const context = document.getElementById('context');
  if (context && !context.querySelector('[data-current-rag-token-math]')) {
    const block = document.createElement('div');
    block.dataset.currentRagTokenMath = 'true';
    block.innerHTML = `
      <h3>Current RAG-primary estimator</h3>
      <p>The current <code>rag-agent.js</code> path does not use only the <code>chars / 4</code> estimate shown above. It has a second telemetry estimator based on words and punctuation:</p>
      <div class="equation"><span class="eq-title">RAG-primary estimated input tokens</span><code>estimatedInputTokens(text)
= ceil( (wordCount × 1.3 + punctuationCount × 0.5) × 1.15 )</code></div>
      <p>At the same time, prompt construction uses a character budget derived from <code>RAG_MAX_TOKENS × 4</code>. With the default <code>RAG_MAX_TOKENS = 400</code>, the nominal character budget is <code>1,600</code> characters, split approximately 90% to the system side and 10% to the user side before additional truncation rules. Default RAG evidence is capped to 8 selected items and 1,100 characters; requested generation defaults to 220 output tokens.</p>
      <div class="docs-callout warning"><strong>Why two estimates?</strong> These are engineering heuristics for budgeting and telemetry. Neither is an exact tokenizer. The provider's returned token counts, when present, are better measurements of actual model usage.</div>
      <div class="docs-source-row"><a href="https://github.com/BradleyMatera/ProjectHub/blob/develop/lib/rag-agent.js" target="_blank" rel="noopener">Source: active RAG token/budget math ↗</a></div>`;
    const sourceRow = context.querySelector('.docs-source-row');
    if (sourceRow) context.insertBefore(block, sourceRow);
    else context.appendChild(block);
  }

  // The grounding validator has actual count/length thresholds in addition to
  // symbolic checks. Put those numbers next to the conceptual explanation.
  const validation = document.getElementById('validation');
  if (validation && !validation.querySelector('[data-validator-thresholds]')) {
    const block = document.createElement('div');
    block.dataset.validatorThresholds = 'true';
    block.innerHTML = `
      <h3>Numeric thresholds in the validator</h3>
      <div class="docs-table-wrap"><table class="docs-table"><thead><tr><th>Check</th><th>Current rule</th><th>Why it exists</th></tr></thead><tbody>
        <tr><td>Content-word overlap</td><td>Normally at least 2 unique answer words of length ≥5 must occur in evidence.</td><td>A cheap lexical signal that generated prose is talking about supplied facts.</td></tr>
        <tr><td>Short yes/no / refutation</td><td>Can pass with 1 grounded content word in specific cases; invented-entity refutations can be allowed with 0.</td><td>Prevents a correct short denial from failing simply because it is concise.</td></tr>
        <tr><td>Answer too short</td><td>Under 20 characters is rejected, except valid pure yes/no responses to yes/no questions.</td><td>Rejects fragments/incomplete generation.</td></tr>
        <tr><td>Answer too long</td><td>Over 600 characters is surfaced as a validation/rejection condition.</td><td>Keeps widget answers bounded and reduces rambling.</td></tr>
        <tr><td>Validation input cleaning</td><td>Answer is cleaned/capped at 800 characters; evidence source text at 16,000 characters.</td><td>Bounds validator work and input size.</td></tr>
      </tbody></table></div>
      <div class="docs-callout no-math"><strong>These are heuristics, not statistical confidence intervals.</strong> “2 overlapping words” is an application rule chosen to catch a class of bad outputs. It is not mathematically derived proof of factual support.</div>
      <div class="docs-source-row"><a href="https://github.com/BradleyMatera/ProjectHub/blob/develop/lib/grounding-validator.js" target="_blank" rel="noopener">Source: overlap and length thresholds · grounding-validator.js ↗</a></div>`;
    const sourceRow = validation.querySelector('.docs-source-row');
    if (sourceRow) validation.insertBefore(block, sourceRow);
    else validation.appendChild(block);
  }

  // Expand the glossary with terms introduced by the current re-ranking/math path.
  const glossary = document.querySelector('#glossary .glossary-grid');
  if (glossary) {
    const additions = [
      ['Heuristic', 'A practical rule chosen by engineering judgment rather than learned from data or derived as an optimal theorem. Scout’s evidence multipliers and several validator thresholds are heuristics.'],
      ['Re-ranking', 'Taking an already ranked candidate list and applying another scoring/ordering stage before final selection. Scout re-ranks retrieval evidence with type and intent multipliers.'],
      ['Multiplier / boost', 'A numeric factor multiplied into a score. A factor above 1 increases relative priority; below 1 decreases it. It does not make the score a probability.'],
      ['Logit', 'A model’s raw pre-softmax score for a possible next token. Sampling parameters such as temperature operate on logits/probabilities inside the model runtime, not in Scout’s BM25 code.']
    ];
    for (const [term, definition] of additions) {
      if ([...glossary.querySelectorAll('dt')].some(dt => dt.textContent === term)) continue;
      const wrapper = document.createElement('div');
      wrapper.className = 'glossary-term';
      wrapper.innerHTML = `<dt>${term}</dt><dd>${definition}</dd>`;
      glossary.appendChild(wrapper);
    }
  }
})();
