(() => {
  'use strict';

  const GRAPHICS = [
    {
      section: 'architecture',
      src: './assets/docs/how-scout-works.svg',
      alt: 'Scout request pipeline from browser widget through Express API, query understanding, BM25 and RRF retrieval, response contracts, model generation, validation, and telemetry.',
      caption: 'System overview. This diagram is a visual summary; the request-lifecycle text and linked source files below define the exact current behavior.'
    },
    {
      section: 'retrieval',
      src: './assets/docs/retrieval-knowledge-to-evidence.svg',
      alt: 'Scout retrieval pipeline from structured knowledge to RAG chunks, tokenization, BM25 ranking, RRF fusion, and the selected evidence pack, including the BM25 and RRF equations.',
      caption: 'Retrieval overview. BM25 and RRF are deterministic information-retrieval algorithms, not neural-network inference. The Learn Scout guide contains the full worked math and implementation limitations.'
    },
    {
      section: 'session-state',
      src: './assets/docs/session-state-followups.svg',
      alt: 'Scout server-owned session state storing active context and recent turns so a follow-up reference can be resolved to the current project or entity.',
      caption: 'Illustrative follow-up. Names and questions in the diagram are examples; the state fields, TTL, and resolver behavior are documented in the surrounding section and source.'
    },
    {
      section: 'response-contracts',
      src: './assets/docs/response-contracts.svg',
      alt: 'Scout response-contract pipeline showing request intent, TRUE FALSE UNKNOWN fact state, required entities, claim ceiling, read-only evidence tools, answer shape, and the bounded model packet.',
      caption: 'Response-planning overview. A contract narrows what generation is supposed to say; it does not replace post-generation validation or guarantee correctness by itself.'
    },
    {
      section: 'validation',
      src: './assets/docs/grounding-validation-repair.svg',
      alt: 'Scout validation pipeline checking generated text for entity, number, relationship, polarity, provenance, whole-token skill evidence, and other claim constraints before pass, repair, or rejection.',
      caption: 'Validation overview. Individual validators and failure reasons evolve on develop; the linked validator source and current gate reports remain the authority for exact checks.'
    },
    {
      section: 'release',
      src: './assets/docs/source-truth-release-flow.svg',
      alt: 'Scout release model separating production master, integration develop, staging ProjectHub-dev, and release gates including unit tests, retrieval evaluation, API evaluation, browser QA, and conversation regression.',
      caption: 'Release-model overview. Branch SHAs and gate results change frequently, so this diagram intentionally shows the process while the live source snapshot and changelog report current values.'
    }
  ];

  const style = document.createElement('style');
  style.textContent = `
    .docs-graphic{margin:24px 0 30px;border:1px solid rgba(111,166,205,.18);border-radius:10px;overflow:hidden;background:#03090e;box-shadow:0 18px 54px rgba(0,0,0,.26)}
    .docs-graphic a{display:block;position:relative;background:#03090e}
    .docs-graphic a::after{content:'open full size ↗';position:absolute;right:12px;bottom:12px;padding:7px 9px;border:1px solid rgba(105,255,132,.28);border-radius:4px;background:rgba(3,9,14,.88);color:#aeeebc;font:700 .56rem/1 ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:.05em;text-transform:uppercase;opacity:0;transform:translateY(4px);transition:.16s ease}
    .docs-graphic a:hover::after,.docs-graphic a:focus-visible::after{opacity:1;transform:none}
    .docs-graphic img{display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:contain;background:#03090e}
    .docs-graphic figcaption{padding:11px 13px;border-top:1px solid rgba(111,166,205,.13);color:#788e9c;background:#061019;font:600 .62rem/1.55 ui-monospace,SFMono-Regular,Consolas,monospace}
    @media(max-width:680px){.docs-graphic{margin-inline:-4px}.docs-graphic a::after{display:none}.docs-graphic figcaption{font-size:.58rem}}
  `;
  document.head.appendChild(style);

  function insertionPoint(section) {
    const lede = section.querySelector('.docs-lede');
    if (lede) return lede;
    const directParagraph = Array.from(section.children).find(el => el.tagName === 'P');
    if (directParagraph) return directParagraph;
    const heading = section.querySelector('h2');
    return heading;
  }

  for (const graphic of GRAPHICS) {
    const section = document.getElementById(graphic.section);
    if (!section || section.querySelector('.docs-graphic')) continue;

    const figure = document.createElement('figure');
    figure.className = 'docs-graphic';
    figure.dataset.docsGraphic = graphic.section;
    figure.innerHTML = `
      <a href="${graphic.src}" target="_blank" rel="noopener" aria-label="Open this documentation graphic at full size">
        <img src="${graphic.src}" alt="${graphic.alt}" loading="lazy" decoding="async" />
      </a>
      <figcaption>${graphic.caption}</figcaption>
    `;

    const point = insertionPoint(section);
    if (point?.parentNode) point.parentNode.insertBefore(figure, point.nextSibling);
    else section.prepend(figure);
  }
})();
