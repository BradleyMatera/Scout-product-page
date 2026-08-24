# Scout Product Site

Public customer-facing and implementation-reference site for **Scout**, the orchestration layer currently used by **ProjectHub Recruiter Alpha**.

## Primary site

- Overview: https://bradleymatera.dev/scout/
- Docs: https://bradleymatera.dev/scout/docs.html
- Learn Scout: https://bradleymatera.dev/scout/learn.html
- API: https://bradleymatera.dev/scout/api.html
- Changelog: https://bradleymatera.dev/scout/changelog.html
- Pricing: https://bradleymatera.dev/scout/pricing.html

A GitHub Pages mirror is also deployed from this repository.

## Product navigation

The customer-facing navigation is:

1. **Overview** — launch hero, current runtime snapshot, source state, verification, limits, and productization status.
2. **Features** — implemented code paths and current integrated capabilities.
3. **How It Works** — request pipeline from query handling through retrieval, generation, validation, and telemetry.
4. **Docs** — source-linked runtime/operation documentation.
5. **API** — current ProjectHub route surface, chat contract, diagnostics, telemetry, and compatibility limits.
6. **Changelog** — dated production/integration/evaluation history with source citations.
7. **Pricing** — customer-facing early-access hosted plans, implementation scope, licensing models, and LinkedIn contact.

`learn.html` is linked from Docs as the teaching path for the algorithms, math, data flow, heuristics, and implementation decisions behind Scout.

## Canonical Scout sources

- Source repository: https://github.com/BradleyMatera/ProjectHub
- Production branch: `master`
- Integration branch: `develop`
- Staging deployment mirror: https://github.com/BradleyMatera/ProjectHub-dev
- Production ProjectHub: https://bradleymatera.github.io/ProjectHub/
- Staging ProjectHub: https://bradleymatera.github.io/ProjectHub-dev/

## Living source snapshot

Scout changes frequently, so source-state and gate facts are centralized in `freshness.js` rather than copied independently into every page.

The snapshot keeps these states separate:

1. released production (`ProjectHub:master`);
2. integrated development (`ProjectHub:develop`);
3. staging packaging/source (`ProjectHub-dev:main` + `STAGING-SOURCE.json`);
4. dated test/evaluation/release-gate results.

`freshness.js` updates the relevant parts of Overview, Docs, Learn, API, and Changelog from one audited snapshot. Source URLs in the injected material are citations/evidence for the adjacent claim.

`scripts/prepare-site.js` injects the shared source-state and teaching-resource scripts into published HTML. `accounting-correction.js` remains in the published bundle because it supplies the cross-page accounting notes used by Overview, Docs, API, and Changelog; the raw Learn accounting section is also correct on its own and no longer depends on that script to hide stale math.

### Accounting sync state

As of **August 24, 2026**, the Cloudflare exact-model accounting correction has been implemented and production-hotfixed in Scout. This site does not infer a production commit SHA from a stale page snapshot; the ProjectHub production branch/runtime remains the authority for the exact deployed revision.

The accounting correction is independently test-backed in ProjectHub. Earlier retrieval/conversation-gate measurements remain dated measurements and are not production quality guarantees.

## Cloudflare neuron-accounting rule

Scout's hosted generation model remains:

`@cf/meta/llama-3.1-8b-instruct-fast`

The model did **not** change as part of the accounting correction.

Cloudflare's current pricing table does not publish a token-to-neuron rate for that exact identifier. Scout therefore treats token-derived neuron usage for that model as **unknown / unverified** instead of borrowing a rate from a similarly named model.

Cloudflare currently publishes these distinct exact-model rates:

- `@cf/meta/llama-3.1-8b-instruct-fp8-fast`: `4,119` neurons / M input tokens and `34,868` neurons / M output tokens;
- `@cf/meta/llama-3.1-8b-instruct-fp8`: `13,778` neurons / M input tokens and `26,128` neurons / M output tokens.

The current accounting distinction is:

- `actualNeurons` — provider-reported neuron usage when available;
- `estimatedNeurons` — calculated only when the exact model identifier has a verified published token-to-neuron rate;
- unknown — neither provider actual usage nor a verified exact-model estimate is available.

Unknown is not represented as zero. An incomplete session total also stays incomplete instead of later becoming a misleading partial total.

Platform-level Cloudflare facts remain separate from Scout's per-request accounting:

- Workers AI includes a **10,000-neuron daily allocation**;
- the allocation resets at **00:00 UTC**;
- Workers Paid usage above the included allocation is **$0.011 per 1,000 neurons**.

Those platform facts do **not** make Scout's current requests-per-day capacity knowable while the exact token-to-neuron rate for `@cf/meta/llama-3.1-8b-instruct-fast` is unpublished.

Primary Cloudflare references:

- https://developers.cloudflare.com/workers-ai/platform/pricing/
- https://developers.cloudflare.com/ai/models/%40cf/meta/llama-3.1-8b-instruct-fast/

## Site implementation

The product site is a zero-build static project. Three.js is used as an ambient visual layer around normal HTML rather than as a standalone 3D product demo.

- `index.html` — overview, implementation/status content, source links, verification, limits, and productization state
- `docs.html` — full runtime/operations documentation application
- `learn.html` — teaching guide for BM25/RRF, text processing, evaluation math, context/inference, validation, complexity, and glossary
- `api.html` — current ProjectHub API reference and limitations
- `changelog.html` — development/release/evaluation history
- `pricing.html` — customer-facing early-access pricing, licensing, process, and LinkedIn contact
- `docs.css` / `docs.js` — shared documentation navigation/search/code-copy UI
- `learn.css` / `learn.js` — teaching-guide extensions
- `freshness.js` — shared audited source/gate snapshot and page-specific current-state updates
- `snapshot-refresh.js` — dated source-state follow-up layer
- `accounting-correction.js` — cross-page exact-model accounting notes for Overview, Docs, API, and Changelog
- `scripts/prepare-site.js` — build-time shared-script/resource injection
- `styles.css` — primary responsive layout and component styles
- `enhancements.css` — panel lighting, active section accents, card depth, table/UI polish, and architecture motion
- `launch.css` — dark glass/neon product visual system
- `further-reading.css` — shared AI/LLM/agent article directory in the footer
- `pricing.css` — pricing-specific layout
- `scene.js` — pinned Three.js `0.185.1` ambient renderer
- `site.js` — product navigation, reveal effects, card lighting, metrics, and further-reading inventory
- `assets/scout-mark.svg` — Scout vector mark
- `assets/scout-og.svg` — social/share graphic
- `site.webmanifest` — installable-site metadata
- `SCOUT-SOURCE-AUDIT.md` — source audit behind product-page claims

The Three.js scene is deliberately non-semantic. The actual interface remains HTML. If WebGL or the CDN module is unavailable, the page content remains usable.

## Documentation/source rule

The site uses this precedence when sources disagree:

1. current executable source/runtime configuration;
2. production runtime facts;
3. current master/develop documentation that matches the source;
4. dated reports as historical evidence.

The site separates:

1. **Released** — behavior supported by production `master`.
2. **Integration** — current `develop` behavior that may not be in production.
3. **Staging** — the exact source recorded by the staging wrapper/marker.
4. **Historical measurement** — dated/scoped evaluation results.
5. **Not shipped / productization work** — customer-neutral empty/no-KB operation, domain packages, unrelated-domain portability tests, and commercial handoff work.

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

The released/integrated Scout/ProjectHub lines include, depending on branch state:

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

Current `develop` can contain behavior not yet represented in a dated product-page source snapshot. Accounting claims on this site are maintained separately from those broader development-gate snapshots so a model-pricing correction is not confused with a general Scout release.

The production application is not represented as a general-purpose assistant. Current runtime knowledge scopes it to Bradley Matera's verified professional information and Scout's runtime.

## API-page rule

`api.html` documents the checked-in ProjectHub runtime interface. It does **not** claim a public multi-tenant developer platform, public API-key product, external SLA, or backwards-compatible commercial API contract.

Current semantic changes on `develop` are documented behind the existing chat interface without inventing new public routes.

## Evaluation display policy

Historical benchmark values are labeled with their date/scorer/model/context instead of being shown as current quality guarantees. Retrieval measurements are kept separate from API acceptance, repeated reliability tests, browser QA, and multi-turn conversation regressions.

## Deployment

`.github/workflows/deploy-pages.yml` validates the shared scripts, runs `scripts/prepare-site.js`, and publishes `main` to the GitHub Pages mirror.

The production Gatsby/Netlify site at `bradleymatera.dev` clones this repository during its normal build, runs the same preparation step, and copies the product files into `public/scout/`. The Scout source commit used for each production build is written to `/scout/scout-source.json`.
