# Scout Product Page

Public implementation/status page for **Scout**, the orchestration layer currently used by **ProjectHub Recruiter Alpha**.

## Live site

https://bradleymatera.github.io/Scout-product-page/

## Canonical Scout sources

- Source repository: https://github.com/BradleyMatera/ProjectHub
- Production branch: `master`
- Integration branch: `develop`
- Staging deployment mirror: https://github.com/BradleyMatera/ProjectHub-dev
- Production ProjectHub: https://bradleymatera.github.io/ProjectHub/
- Staging ProjectHub: https://bradleymatera.github.io/ProjectHub-dev/

## Site implementation

The product page is a zero-build GitHub Pages project with progressive Three.js enhancement.

- `index.html` — factual implementation/status content and source links
- `styles.css` — responsive layout, glass/depth effects, animated pipeline, ticker, runtime panel, tables, timeline, and motion system
- `scene.js` — pinned Three.js `0.185.1` ambient renderer
- `site.js` — reveal effects, card perspective/lighting, metric counters, scroll progress, timeline progress, and navigation behavior
- `assets/scout-mark.svg` — Scout vector mark
- `assets/scout-og.svg` — social/share graphic
- `site.webmanifest` — installable-site metadata
- `SCOUT-SOURCE-AUDIT.md` — source audit behind page claims

Three.js is used only as progressive visual enhancement behind the content. It renders a low-contrast perspective grid, sparse depth particles, edge light ribbons, and slow scroll/pointer-reactive lighting. It does not replace or represent the Scout architecture itself. If WebGL or the CDN module is unavailable, the factual content and all source-linked verification remain usable.

## Content rule

The page separates:

1. **Released** — behavior supported by the production `master` line.
2. **Integration** — current `develop` behavior that may not yet be in production.
3. **Historical measurement** — dated/scoped eval results retained with scorer/model context.
4. **Not shipped / productization work** — customer-neutral Scout Core, empty/no-KB operation, domain packages, unrelated-domain portability tests, and commercial handoff work.

Claims should point to implementation, workflow, commit, evaluation artifact, or a reproducible command where practical.

## Current architecture represented on the page

The current Scout/ProjectHub code includes:

- local Okapi BM25 retrieval and contextual Reciprocal Rank Fusion
- query understanding and conversational rewriting
- server-owned structured session state
- allowlisted read-only recruiter evidence tools
- semantic response contracts and TRUE/FALSE/UNKNOWN claim handling
- Cloudflare Workers AI production generation using `@cf/meta/llama-3.1-8b-instruct-fast`
- Ollama `qwen2.5:1.5b` for development/evaluation and a gated fallback architecture
- post-generation grounding, relationship, entity, number, polarity, provenance, and overclaim validation
- generative repair / constrained recovery paths
- runtime/retrieval telemetry
- a 15-second response budget

The current production application is not represented as a general-purpose assistant. The current runtime knowledge scopes it to Bradley Matera's verified professional information and Scout's runtime.

## Evaluation display policy

Historical benchmark values are labeled with their context instead of being shown as current quality guarantees. The page records the older acceptance-scorer results and the later strict re-score as development history, while keeping the current retrieval benchmark separately reproducible through the repository evaluator.

See `SCOUT-SOURCE-AUDIT.md` for the repository audit used to build the page.

## Deployment

`.github/workflows/deploy-pages.yml` publishes `main` to GitHub Pages.
