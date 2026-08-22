# Scout Product Site

Public customer-facing and implementation-reference site for **Scout**, the orchestration layer currently used by **ProjectHub Recruiter Alpha**.

## Primary site

- Overview: https://bradleymatera.dev/scout/
- Docs: https://bradleymatera.dev/scout/docs.html
- API: https://bradleymatera.dev/scout/api.html
- Changelog: https://bradleymatera.dev/scout/changelog.html
- Pricing: https://bradleymatera.dev/scout/pricing.html

A GitHub Pages mirror is also deployed from this repository.

## Product navigation

The customer-facing navigation is:

1. **Overview** — launch hero, current runtime snapshot, source state, verification, limits, and productization status.
2. **Features** — implemented code paths and current integrated capabilities.
3. **How It Works** — request pipeline from query handling through retrieval, generation, validation, and telemetry.
4. **Docs** — source-linked runtime, architecture, QA, hardening, release, and implementation references.
5. **API** — checked-in ProjectHub route surface, request shape, response metadata, and current API limitations.
6. **Changelog** — selected source-linked repository milestones and evaluation-history notes.
7. **Pricing** — customer-facing early-access hosted plans, implementation scope, licensing models, and LinkedIn contact.

## Canonical Scout sources

- Source repository: https://github.com/BradleyMatera/ProjectHub
- Production branch: `master`
- Integration branch: `develop`
- Staging deployment mirror: https://github.com/BradleyMatera/ProjectHub-dev
- Production ProjectHub: https://bradleymatera.github.io/ProjectHub/
- Staging ProjectHub: https://bradleymatera.github.io/ProjectHub-dev/

## Site implementation

The product site is a zero-build static project. Three.js is used as an ambient visual layer around normal HTML rather than as a standalone 3D product demo.

- `index.html` — overview, implementation/status content, source links, verification, limits, and productization state
- `docs.html` — source-linked documentation index
- `api.html` — current ProjectHub API reference and limitations
- `changelog.html` — selected development/release/evaluation history
- `pricing.html` — customer-facing early-access pricing, hosted plans, licensing models, process, and LinkedIn contact
- `styles.css` — primary responsive layout and component styles
- `enhancements.css` — panel lighting, active section accents, card depth, table/UI polish, and architecture motion
- `launch.css` — launch-page visual system based on the Scout social graphic: dark glass browser shell, green/blue technical panels, neon edge lighting, product navigation, subpage layouts, and pricing integration
- `further-reading.css` — shared AI/LLM/agent article directory in the footer
- `pricing.css` — pricing-specific cards, licensing, process, FAQ, and LinkedIn CTA layout
- `scene.js` — pinned Three.js `0.185.1` ambient renderer
- `site.js` — product navigation, overview/feature/how-it-works section routing, page state, reveal effects, card perspective/lighting, metric counters, scroll/timeline progress, and further-reading inventory
- `assets/scout-mark.svg` — Scout vector mark
- `assets/scout-og.svg` — social/share graphic
- `site.webmanifest` — installable-site metadata
- `SCOUT-SOURCE-AUDIT.md` — source audit behind product-page claims

The Three.js scene is deliberately non-semantic. The actual interface remains HTML. If WebGL or the CDN module is unavailable, the page content remains usable.

## Product-page content rule

The implementation site separates:

1. **Released** — behavior supported by the production `master` line.
2. **Integration** — current `develop` behavior that may not yet be in production.
3. **Historical measurement** — dated/scoped evaluation results retained with scorer/model context.
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

## Current architecture represented on the product site

The current Scout/ProjectHub code includes:

- local Okapi BM25 retrieval and contextual Reciprocal Rank Fusion
- query understanding and conversational rewriting
- server-owned structured session state
- allowlisted read-only recruiter evidence tools
- semantic response contracts and TRUE/FALSE/UNKNOWN claim handling
- Cloudflare Workers AI production generation using `@cf/meta/llama-3.1-8b-instruct-fast`
- Ollama for development/evaluation and an explicitly gated fallback architecture
- post-generation grounding, relationship, entity, number, polarity, provenance, and overclaim validation
- generative repair / constrained recovery paths
- runtime/retrieval telemetry
- a 15-second response budget

The current production application is not represented as a general-purpose assistant. Current runtime knowledge scopes it to Bradley Matera's verified professional information and Scout's runtime.

## API-page rule

`api.html` documents the checked-in ProjectHub runtime interface. It does **not** claim a public multi-tenant developer platform, public API-key product, external SLA, or backwards-compatible commercial API contract.

The repository `docs/api-guide.md` still contains language from the earlier local-Ollama phase. The product site uses `server-gemini.js` for route existence and `data/scout-runtime-knowledge.json` for current inference-provider/runtime facts when those sources differ.

## Evaluation display policy

Historical benchmark values are labeled with their context instead of being shown as current quality guarantees. The page records the older acceptance-scorer results and later strict re-score as development history, while keeping the current retrieval benchmark separately reproducible through the repository evaluator.

See `SCOUT-SOURCE-AUDIT.md` for the repository audit used to build the product site.

## Deployment

`.github/workflows/deploy-pages.yml` publishes `main` to the GitHub Pages mirror.

The production Gatsby/Netlify site at `bradleymatera.dev` clones this repository during its normal build and copies the product files into `public/scout/`. The source commit used for each production build is written to `/scout/scout-source.json`.
