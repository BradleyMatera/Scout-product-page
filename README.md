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

`scripts/prepare-site.js` injects `freshness.js` into all published HTML pages at build time. It also loads `accounting-correction.js` before the documentation UI initializes so the Cloudflare exact-model accounting correction is reflected consistently across Overview, Docs, Learn, API, and Changelog. The GitHub Pages workflow syntax-checks these scripts before publishing. The Gatsby/Netlify sync uses the same preparation step before copying Scout into `public/scout/`.

### Current audited source state

As of **August 24, 2026**, before the separate production-promotion task completes:

- production: `master@4a1eee7`
- integration: `develop@2c140ba`
- develop vs master: `65 ahead / 4 behind`
- staging source marker: `d1da87b`
- Cloudflare provider tests: `26/26` PASS
- public telemetry tests: `14/14` PASS
- cost-ledger tests: `13/13` PASS
- cost-insights tests: `6/6` PASS
- full unit suite recorded by the final accounting correction: `949/949` PASS
- accounting correction release scope: isolated from the still-separate general conversation-quality release gate

The earlier Aug. 23 retrieval/conversation gate measurements remain dated measurements rather than production quality guarantees. The production source state should be re-audited after the separate `develop → master` promotion completes.

## Cloudflare neuron-accounting rule

A source audit found that Scout had associated Cloudflare's published `4,119` input / `34,868` output neurons-per-million-token rates with `@cf/meta/llama-3.1-8b-instruct-fast`. Cloudflare publishes those rates for the exact identifier `@cf/meta/llama-3.1-8b-instruct-fp8-fast` and does not document the two identifiers as billing aliases.

The corrected ProjectHub behavior is therefore exact-model and null-safe:

- `@cf/meta/llama-3.1-8b-instruct-fast` has no guessed token-to-neuron rate while Cloudflare does not publish one for that exact identifier;
- `@cf/meta/llama-3.1-8b-instruct-fp8-fast` uses its published `4119 / 34868` rates;
- `@cf/meta/llama-3.1-8b-instruct-fp8` uses its distinct published `13778 / 26128` rates;
- provider-returned `usage.neurons` is preserved as actual usage when present;
- otherwise unpriced usage remains `null` / unknown rather than becoming a fabricated zero;
- shadow-cost totals expose incomplete/unpriced sources instead of silently treating an unknown Cloudflare value as `$0`;
- once any billable call makes a session neuron total incomplete, later known calls do not turn that partial total back into a falsely complete number.

The customer-facing explanation is maintained by `accounting-correction.js`. The ProjectHub source/report remains authoritative for the runtime implementation.

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
- `accounting-correction.js` — cross-page exact-model Cloudflare neuron-accounting correction and changelog/teaching updates
- `scripts/prepare-site.js` — build-time freshness/resource/correction-script injection
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

Current `develop` also contains more explicit EXPERIENCE, QUALIFICATIONS, FUTURE_CAPABILITY, META/capability, privacy/refusal, and non-technical re-explanation routing than the released production line. These are labeled as integration behavior until promoted.

The production application is not represented as a general-purpose assistant. Current runtime knowledge scopes it to Bradley Matera's verified professional information and Scout's runtime.

## API-page rule

`api.html` documents the checked-in ProjectHub runtime interface. It does **not** claim a public multi-tenant developer platform, public API-key product, external SLA, or backwards-compatible commercial API contract.

Current semantic changes on `develop` are documented behind the existing chat interface without inventing new public routes.

## Evaluation display policy

Historical benchmark values are labeled with their date/scorer/model/context instead of being shown as current quality guarantees. Retrieval measurements are kept separate from API acceptance, repeated reliability tests, browser QA, and multi-turn conversation regressions.

## Deployment

`.github/workflows/deploy-pages.yml` validates the snapshot/resource/correction scripts, runs `scripts/prepare-site.js`, and publishes `main` to the GitHub Pages mirror.

The production Gatsby/Netlify site at `bradleymatera.dev` clones this repository during its normal build, runs the same preparation step, and copies the product files into `public/scout/`. The Scout source commit used for each production build is written to `/scout/scout-source.json`.
