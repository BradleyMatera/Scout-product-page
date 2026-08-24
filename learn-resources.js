(() => {
  'use strict';

  const figures = {
    'mental-model': ['./assets/docs/how-scout-works.svg', 'Scout request flow from browser input through deterministic retrieval/planning, bounded model generation, validation, and telemetry.', 'System-level mental model. The surrounding source-linked text defines the exact current Scout implementation.'],
    'edit-distance': ['./assets/learn/edit-distance-explained.svg', 'Edit distance visual showing insertion, deletion, substitution, adjacent-transposition implementation note, a dynamic-programming matrix, and O(m×n) complexity.', 'The matrix explains the general algorithm. Scout currently implements a restricted adjacent-transposition variant in its typo-correction code.'],
    'bm25': ['./assets/learn/bm25-explained.svg', 'BM25 formula with IDF, term frequency saturation, document length normalization, k1 and b.', 'BM25 is deterministic lexical ranking. The formula and Scout constants below are also shown in text so the diagram is not the only source.'],
    'rrf': ['./assets/learn/rrf-explained.svg', 'Reciprocal Rank Fusion combining multiple ranked result lists with reciprocal rank.', 'RRF combines positions, not raw BM25 score magnitudes. Scout uses k = 60 in the current implementation.'],
    'retrieval': ['./assets/learn/retrieval-is-not-vector.svg', 'Comparison of Scout current BM25 and contextual RRF retrieval path with a separate embedding and vector database architecture.', 'This distinction matters: RAG is a system pattern, not a synonym for vector search. Scout’s active retrieval path is lexical.'],
    'retrieval-eval': ['./assets/learn/retrieval-evaluation.svg', 'Recall at six and mean reciprocal rank at six with formulas and worked examples.', 'The diagram explains the metrics generally. Scout’s checked-in evaluator and golden set define exactly how relevance is judged in this project.'],
    'state-tools': ['./assets/docs/session-state-followups.svg', 'Server-owned session state and follow-up reference resolution.', 'Illustrative state flow. ProjectHub source defines the current fields, expiration behavior, and resolver logic.'],
    'contracts': ['./assets/docs/response-contracts.svg', 'Response contract from intent and fact state through required entities, claim ceiling and bounded model packet.', 'A response contract constrains generation; it does not make model output correct by itself.'],
    'validation': ['./assets/docs/grounding-validation-repair.svg', 'Grounding checks and repair flow for generated claims.', 'Validator behavior changes as regressions are found, so the linked ProjectHub validator source remains authoritative.']
  };

  const study = {
    'mental-model': [
      ['paper','Lewis et al. (2020)','Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks','https://arxiv.org/abs/2005.11401','Foundational RAG paper. Its retriever is dense, unlike Scout’s current lexical retriever, but it establishes the retrieve-then-generate pattern.'],
      ['watch','IBM Technology','What is Retrieval-Augmented Generation (RAG)?','https://www.youtube.com/watch?v=T-D1OfcDW1M','Short conceptual overview of retrieval plus generation and why external evidence is useful.']
    ],
    'text-processing': [
      ['book','Manning, Raghavan & Schütze','Introduction to Information Retrieval','https://nlp.stanford.edu/IR-book/','Free Stanford/Cambridge text covering term vocabularies, tolerant retrieval, weighting, probabilistic IR and evaluation.']
    ],
    'edit-distance': [
      ['paper','Wagner & Fischer (1974)','The String-to-String Correction Problem','https://doi.org/10.1145/321796.321811','Classic dynamic-programming formulation for insertion, deletion and substitution edit distance.'],
      ['paper','Zhao & Sahni (2019)','String correction using the Damerau-Levenshtein distance','https://doi.org/10.1186/s12859-019-2819-0','Peer-reviewed treatment of edit distance with transposition, useful for distinguishing Levenshtein from Damerau-style variants.'],
      ['watch','Back To Back SWE','Edit Distance Between 2 Strings — The Levenshtein Distance','https://www.youtube.com/watch?v=MiqoA-yF-0M','Step-by-step dynamic-programming explanation aimed at programmers.']
    ],
    'bm25': [
      ['paper','Robertson & Zaragoza (2009)','The Probabilistic Relevance Framework: BM25 and Beyond','https://doi.org/10.1561/1500000019','Canonical detailed treatment of the probabilistic relevance framework and BM25.'],
      ['book','Manning, Raghavan & Schütze','Introduction to Information Retrieval, probabilistic IR','https://nlp.stanford.edu/IR-book/','Academic textbook background for term weighting and probabilistic information retrieval.'],
      ['watch','Abhishek Thakur','A No-Nonsense Introduction to BM25','https://www.youtube.com/watch?v=TW9vHU1GpU4','Applied explanation of term frequency, IDF, document length, k1 and b.']
    ],
    'rrf': [
      ['paper','Cormack, Clarke & Büttcher (2009)','Reciprocal Rank Fusion outperforms Condorcet and individual rank learning methods','https://doi.org/10.1145/1571941.1572114','Original SIGIR paper introducing/evaluating RRF as a simple rank-fusion method.'],
      ['watch','Abhishek Thakur','What is reciprocal rank fusion?','https://www.youtube.com/watch?v=2uBcjEecr38','Short practical explanation of the reciprocal-rank formula and fusion behavior.']
    ],
    'retrieval': [
      ['book','Manning, Raghavan & Schütze','Introduction to Information Retrieval','https://nlp.stanford.edu/IR-book/','Use Chapters 2–3 for terms/tolerant retrieval, 6 for weighting, 8 for evaluation and 11 for probabilistic IR.'],
      ['paper','Lewis et al. (2020)','Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks','https://arxiv.org/abs/2005.11401','Useful for the broader RAG concept. Do not read its dense-vector retriever as a description of Scout’s BM25/RRF implementation.']
    ],
    'retrieval-eval': [
      ['book','Manning, Raghavan & Schütze','Evaluation in information retrieval, Chapter 8','https://nlp.stanford.edu/IR-book/pdf/08eval.pdf','Academic reference for ranked-retrieval evaluation and the limits of finite test collections.'],
      ['paper','Voorhees & Tice (2000)','The TREC-8 Question Answering Track','https://aclanthology.org/L00-1018/','Historical primary source using mean reciprocal rank for ranked answer evaluation.'],
      ['watch','Computing For All','Mean Reciprocal Rank (MRR): Evaluating a Retrieval System','https://www.youtube.com/watch?v=8y9bi2vIG4U','Direct worked explanation of reciprocal rank and MRR.']
    ],
    'generation': [
      ['paper','Vaswani et al. (2017)','Attention Is All You Need','https://arxiv.org/abs/1706.03762','Foundational Transformer paper. Scout does not implement this math itself; the model provider does inference.'],
      ['paper','Holtzman et al. (2019)','The Curious Case of Neural Text Degeneration','https://arxiv.org/abs/1904.09751','Introduces nucleus/top-p sampling and explains why decoding strategy changes generated text.'],
      ['watch','Umar Jamil','Attention is all you need — model explanation, math, inference and training','https://www.youtube.com/watch?v=bCz4OMemCcA','Long-form visual walkthrough of Transformer math and inference.']
    ],
    'cost-math': [
      ['official','Cloudflare','Workers AI pricing','https://developers.cloudflare.com/workers-ai/platform/pricing/','Current provider pricing and neuron allocation. Recheck this page because provider rates can change independently of Scout.'],
      ['official','Cloudflare','llama-3.1-8b-instruct-fast model documentation','https://developers.cloudflare.com/workers-ai/models/llama-3.1-8b-instruct-fast/','Official model identifier, API parameters and context information for the production model path.']
    ],
    'client-local': [
      ['standard','W3C GPU for the Web WG','WebGPU specification','https://www.w3.org/TR/webgpu/','Normative browser API reference for GPU rendering and compute.'],
      ['official','ONNX','Introduction to ONNX','https://onnx.ai/onnx/intro/','Official explanation of ONNX as a model representation/interchange format.']
    ]
  };

  function firstNarrative(section) {
    return section.querySelector('.docs-lede') || Array.from(section.children).find(el => el.tagName === 'P') || section.querySelector('h2');
  }

  function addFigure(id, spec) {
    const section = document.getElementById(id); if (!section || section.querySelector('.learn-figure')) return;
    const [src, alt, caption] = spec;
    const fig = document.createElement('figure'); fig.className = 'learn-figure';
    fig.innerHTML = `<a href="${src}" target="_blank" rel="noopener"><img src="${src}" alt="${alt}" loading="lazy" decoding="async"></a><figcaption>${caption}</figcaption>`;
    const point = firstNarrative(section); point?.parentNode?.insertBefore(fig, point.nextSibling);
  }

  function addStudy(id, items) {
    const section = document.getElementById(id); if (!section || section.querySelector('.learn-study')) return;
    const block = document.createElement('aside'); block.className = 'learn-study'; block.setAttribute('aria-label','External sources and further study');
    block.innerHTML = `<div class="learn-study-head"><span>External sources &amp; further study</span><small>General theory / independent references</small></div><div class="learn-study-grid">${items.map(([type,author,title,url,note]) => `<a class="learn-study-card" href="${url}" target="_blank" rel="noopener"><span class="learn-study-type ${type}">${type}</span><strong>${title}</strong><span class="learn-study-author">${author}</span><p>${note}</p><span class="learn-study-open">open source ↗</span></a>`).join('')}</div><p class="learn-study-note">These references explain the general algorithm or standard. The ProjectHub source links in this section show Scout’s actual implementation and take precedence for implementation-specific behavior.</p>`;
    section.appendChild(block);
  }

  Object.entries(figures).forEach(([id,spec]) => addFigure(id,spec));
  Object.entries(study).forEach(([id,items]) => addStudy(id,items));

  const article = document.querySelector('.learn-page .docs-content');
  if (article && !document.getElementById('references')) {
    const all = []; const seen = new Set();
    Object.values(study).flat().forEach(item => { if (!seen.has(item[3])) { seen.add(item[3]); all.push(item); } });
    const refs = document.createElement('section'); refs.className='docs-section'; refs.id='references'; refs.dataset.search='references bibliography papers videos academic scholarly sources further study';
    refs.innerHTML = `<div class="docs-eyebrow">21 · References</div><h2>Reference library.</h2><p class="docs-lede">Implementation claims on this site are sourced to ProjectHub. The references below are independent material for the algorithms, evaluation methods, standards and provider behavior used in the teaching guide.</p><div class="learn-bibliography">${all.map(([type,author,title,url,note],i)=>`<div class="learn-bib-item"><span>${String(i+1).padStart(2,'0')}</span><div><strong>${title}</strong><p>${author} · <em>${type}</em></p><p>${note}</p><a href="${url}" target="_blank" rel="noopener">source ↗</a></div></div>`).join('')}</div>`;
    article.appendChild(refs);
    const nav = document.querySelector('.docs-sidebar .docs-nav');
    const lastGroup = nav?.querySelector('.docs-nav-group:last-child');
    if (lastGroup) lastGroup.insertAdjacentHTML('beforeend','<a href="#references"><span class="nav-code">21</span>References</a>');
    const select = document.querySelector('.docs-mobile-nav select');
    if (select) select.insertAdjacentHTML('beforeend','<option value="references">References</option>');
    const count = document.querySelector('.docs-sidebar-title span:last-child');
    if (count) count.textContent='21 topics';
  }
})();