# Scout Product Page

Public implementation/status page for **Scout**, the orchestration layer currently used by **ProjectHub Recruiter Alpha**.

## Live pages

- Product / implementation page: https://bradleymatera.github.io/Scout-product-page/
- Customer pricing page: https://bradleymatera.github.io/Scout-product-page/pricing.html

## Canonical Scout sources

- Source repository: https://github.com/BradleyMatera/ProjectHub
- Production branch: `master`
- Integration branch: `develop`
- Staging deployment mirror: https://github.com/BradleyMatera/ProjectHub-dev
- Production ProjectHub: https://bradleymatera.github.io/ProjectHub/
- Staging ProjectHub: https://bradleymatera.github.io/ProjectHub-dev/

## Site implementation

The page is a zero-build GitHub Pages project. Three.js is used as part of the visual system around the existing HTML interface, not as a separate 3D product demo.

- `index.html` — factual implementation/status content and source links
- `pricing.html` — customer-facing early-access pricing, hosted plans, licensing models, process, and pricing notes
- `styles.css` — primary responsive layout and component styles
- `enhancements.css` — final visual layer for panel lighting, active section accents, card depth, table/UI polish, and architecture motion
- `pricing.css` — pricing-specific cards, licensing, process, FAQ, and LinkedIn CTA layout
- `scene.js` — pinned Three.js `0.185.1` ambient renderer
- `site.js` — reveal effects, card perspective/lighting, metric counters, active navigation, scroll/timeline progress, enhancement loading, and the main-page Pricing navigation link
- `assets/scout-mark.svg` — Scout vector mark
- `assets/scout-og.svg` — social/share graphic
- `site.webmanifest` — installable-site metadata
- `SCOUT-SOURCE-AUDIT.md` — source audit behind product-page claims

The Three.js scene is deliberately non-semantic. It renders low-contrast perspective grids, sparse depth particles, edge wire geometry, and slow scroll/pointer-reactive movement behind the normal document. Section visibility can shift the ambient accent between the existing green, blue, and amber status colors. The actual interface remains HTML.

If WebGL or the CDN module is unavailable, the full page content remains usable.

## Product-page content rule

The implementation page separates:

1. **Released** — behavior supported by the production `master` line.
2. **Integration** — current `develop` behavior that may not yet be in production.
3. **Historical measurement** — dated/scoped eval results retained with scorer/model context.
4. **Not shipped / productization work** — customer-neutral Scout Core, empty/no-KB operation, domain packages, unrelated-domain portability tests, and commercial handoff work.

Claims should point to implementation, workflow, commit, evaluation artifact, or a reproducible command where practical.

## Pricing-page rule

`pricing.html` is customer-facing. It exposes the early-access commercial framework without publishing internal margins, tax planning, cost allocation, or private business operations.

Current pricing framework shown on the page:

- Design Partner Pilot: `$500–$1,500` one-time
- Scout Starter: `$149/month + $750 setup`
- Scout Business: `$399/month + $1,500 setup`
- Scout Managed: `$999+/month`, implementation from `$3,000`
- Portable runtime licensing: from `$5,000`, case-by-case availability
- Source-access commercial licensing: from `$15,000`, negotiated separately
- Exclusive rights / acquisition: negotiated separately

Included usage, external-service costs, integration scope, support expectations, and deployment requirements are defined in the written quote/order scope rather than represented as an unlimited promise.

The only customer contact information on the pricing page is Bradley Matera's LinkedIn profile:

https://www.linkedin.com/in/bradmatera

## Current architecture represented on the product page

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

See `SCOUT-SOURCE-AUDIT.md` for the repository audit used to build the product page.

## Deployment

`.github/workflows/deploy-pages.yml` publishes `main` to GitHub Pages.
