# Scout Product Site

Public customer-facing and implementation-reference site for **Scout**, the orchestration layer used by **ProjectHub Recruiter Alpha**.

## Primary site

- Overview: https://bradleymatera.dev/scout/
- Docs: https://bradleymatera.dev/scout/docs.html
- Learn Scout: https://bradleymatera.dev/scout/learn.html
- API: https://bradleymatera.dev/scout/api.html
- Changelog: https://bradleymatera.dev/scout/changelog.html
- Pricing: https://bradleymatera.dev/scout/pricing.html

A GitHub Pages mirror is also deployed from this repository.

## Current audited source state

Last full branch/source audit and recheck: **September 5, 2026**.

- Production branch: `ProjectHub:master@b071e4e4f0bb69faeecd811f31514af30d2e1f61`
- Production tree: `a0066cc849f33dd84d18d8e8c36b080fed8ce70e`
- Integration branch: `ProjectHub:develop@4f5ee971488e433ebdf66280cce82e163c5c7688`
- Integration tree: `a0066cc849f33dd84d18d8e8c36b080fed8ce70e`
- Staging repository: `ProjectHub-dev:main@6d36433c040d0bbc903ec26b6968674bd937bcd0`
- `ProjectHub-dev/STAGING-SOURCE.json`: `4f5ee971488e433ebdf66280cce82e163c5c7688`
- Active unmerged runtime branch: `feat/generic-conversation-sets@5bd9437b1811957f20d1a217c854d46228ace12c`, **2 commits ahead / 0 behind `develop`** at recheck
- Pending dependency-only branch: Dependabot `c32e83b8428a733b597341b1bc7efe4b4ede7423`, one `package-lock.json`-only commit ahead of `master`

`master` and `develop` have different Git ancestry, but their current trees are byte-for-byte represented by the same Git tree SHA above. The September 5 production release deliberately preserved production ancestry while promoting the exact qualified `develop` tree.

The product site was previously current through August 27. The September 5 audit inspected all 35 visible `ProjectHub` branches and both visible `ProjectHub-dev` branches, branch-head dates, recent PR/release history, staging provenance, current provider/router code, runtime documentation, tests, and the product site's own previous update layers. The branch list was re-read again before finalization; during the audit `feat/generic-conversation-sets` moved from the released develop pointer to new post-release commits, so that newer state is included here. See `SCOUT-SOURCE-AUDIT.md`.

## What changed after the August 27 product-site snapshot

The old product page showed Phase 02 as an active unmerged conversation branch. That exact branch state is no longer current.

- PR #23 merged the Phase 7/8 conversation-gate work into `develop`.
- PR #24 merged idempotent ProjectHub widget initialization.
- PR #26 merged chat scroll/input behavior: users can type while Scout replies, a submitted follow-up can queue, and auto-scroll follows only when the user is already near the bottom.
- PR #28 added release hardening: server-authorized + request-opted diagnostics, debug-cache isolation, retry-safe widget initialization with partial-setup rollback, and browser regressions for draft/bottom-follow behavior.
- PR #29 promoted the qualified `develop@4f5ee971` tree to production on September 5.
- `ProjectHub-dev:main` records the same `4f5ee971` source revision.

Recorded verification for the qualified September 5 tree:

- local tests: **1019/1019**
- retrieval Recall@6: **1.000**
- retrieval MRR@6: **0.942**
- staging marker: `4f5ee971`
- staging widget artifact was recorded as byte-identical to the qualified develop source in the release PR
- pre-release Phase 7/8 live qualification at `4d39995`: **94/132 turns**, **21/33 conversations**
- that live qualification still recorded **14 of 38 failures** as `inference-unavailable`; those are historical test outcomes, not a claim that every such failure was externally caused

The September release is therefore documented as a real source release with known residuals, not as a perfect-conversation claim.

## Active post-release branch

After the September 5 production source release, `feat/generic-conversation-sets` advanced two commits beyond `develop`:

1. `f145f8c` — generic server-owned discourse frames and generated clarification;
2. `5bd9437` — commit discourse state before cache/direct-KB early returns and add a `CLARIFICATION` control mode for unresolved plural-set questions.

The branch currently changes `conversation-resolver`, `session-state`, response-policy classification, RAG/LITE control handling, server orchestration, and adds `test/discourse-frames.test.js`. Its stated design is domain-neutral: user-introduced ordered alternatives are tracked as server-owned discourse state, assistant mentions do not become authoritative set members, and ambiguous questions such as “which of those is better?” can route to a generated clarification instead of a scope decline.

At the audit recheck this branch was **2 ahead / 0 behind `develop`** and had no GitHub Actions run/status exposed. It is therefore documented as **active unmerged work**, not as integrated, staged, released, or validated production behavior.

## Current hosted inference

Scout's hosted generation model remains:

`@cf/meta/llama-3.1-8b-instruct-fast`

Current production generation paths pass temperature `0` and top-p `0.9` for the RAG/LITE generation calls; the Cloudflare adapter also defaults temperature to `0` when a caller does not supply it.

Cloudflare is the production primary when configured. Ollama `qwen2.5:1.5b` is the development/evaluation runtime and can be used as a production emergency fallback only when the fallback is explicitly enabled **and** `SCOUT_OLLAMA_QUALIFIED=true`. The default Cloudflare-primary fallback state is disabled.

## Cloudflare neuron accounting

The accounting correction remains in force.

Cloudflare's current pricing table does not publish a token-to-neuron rate for Scout's exact `@cf/meta/llama-3.1-8b-instruct-fast` identifier. Scout therefore does not borrow rates from similarly named models.

Distinct published exact-model rates retained for reference:

- `@cf/meta/llama-3.1-8b-instruct-fp8-fast`: `4,119` neurons / M input and `34,868` / M output
- `@cf/meta/llama-3.1-8b-instruct-fp8`: `13,778` neurons / M input and `26,128` / M output

Accounting states remain distinct:

- `actualNeurons`: provider-reported usage when supplied
- `estimatedNeurons`: calculated only when the exact model has a verified rate
- unknown: neither actual nor a verified exact-model estimate exists

Unknown is not zero. An incomplete multi-call/session total remains incomplete.

Cloudflare platform facts remain separate from Scout's per-request estimate:

- included Workers AI allocation: **10,000 neurons/day**
- daily reset: **00:00 UTC**
- Workers Paid reference above the included allocation: **$0.011 / 1,000 neurons**

Those facts do not make Scout's current requests/day capacity knowable from token counts.

Primary Cloudflare references:

- https://developers.cloudflare.com/workers-ai/platform/pricing/
- https://developers.cloudflare.com/ai/models/%40cf/meta/llama-3.1-8b-instruct-fast/

### Known source-truth inconsistency

Current executable `master` provider/accounting code is corrected, but `data/scout-runtime-knowledge.json` is still marked `lastVerified: 2026-08-21` and still contains the superseded statement assigning `4,119 / 34,868` to the normal `-fast` model. The product site does **not** treat that stale sentence as authoritative. Executable provider/accounting code and current Cloudflare primary documentation take precedence until ProjectHub's runtime self-knowledge record is refreshed.

## Current released architecture represented on the site

The released September 5 tree includes:

- local Okapi BM25 retrieval and contextual Reciprocal Rank Fusion
- query normalization, typo handling, conversation-aware rewrite, and referent resolution
- server-owned structured session state and recent-turn memory
- allowlisted read-only recruiter evidence tools
- response-policy classification and semantic response contracts, including open-world TRUE/FALSE/UNKNOWN handling
- Cloudflare Workers AI production generation using `@cf/meta/llama-3.1-8b-instruct-fast`
- explicitly gated Ollama fallback architecture
- RAG-primary evidence selection with tools as supplemental evidence
- post-generation grounding, relationship, entity, number, polarity, provenance, technology-claim, and overclaim validation
- generative repair / constrained recovery paths
- runtime/retrieval/cost telemetry
- a 15-second end-to-end Scout request deadline
- opt-in gate diagnostics that require both server authorization and request opt-in and are excluded from response caching
- retry-safe embeddable widget initialization
- queueable follow-up input while the current answer is in flight
- near-bottom-only auto-scroll behavior

The newer discourse-frame/CLARIFICATION work is not included in this released-capability list until it crosses the integration/release gates.

ProjectHub Recruiter Alpha remains scoped to Bradley Matera's verified professional information and Scout's own runtime. The current product page does not claim that the deployed recruiter instance is already a general-purpose no-KB assistant or a finished multi-tenant SDK.

## Roadmap state

The August 27 site showed Phase 02 as active branch work. The September audit advances the released engineering state while keeping the new post-release branch separate:

- Phase 01: released foundation
- Phase 02: accepted conversation-gate iteration merged and released; known residuals remain; new discourse-frame work is an unmerged continuation
- Phase 03: integration completed for the released iteration
- Phase 04: current staging provenance aligned to `develop@4f5ee971`
- Phase 05: production source release completed through PR #29
- Phase 06: **active system-truth cleanup / post-release verification**
- Active code branch outside those completed release gates: `feat/generic-conversation-sets@5bd9437`, 2 ahead / 0 behind develop at recheck
- Phases 07–12: later Scout Core/productization work

Phase 06 is not cosmetic. Current examples include the stale runtime-neuron self-description above and the need to keep source, deployment provenance, docs, telemetry semantics, and historical evaluation claims clearly separated.

See `SCOUT-ROADMAP.md` for the full roadmap.

## Product navigation

1. **Overview** — current source/release snapshot, implemented behavior, verification, limits, roadmap.
2. **Features** — implemented code paths and current released capabilities.
3. **How It Works** — request path from query understanding through retrieval, generation, validation, and telemetry.
4. **Docs** — source-linked runtime/operations documentation.
5. **Learn** — teaching guide for algorithms, math, heuristics, and implementation details.
6. **API** — current ProjectHub route surface and runtime contract, not a public commercial API guarantee.
7. **Changelog** — dated release/integration/evaluation history.
8. **Pricing** — customer-facing early-access commercial framework. Pricing was reviewed during this sync; no September runtime change required a pricing change.

## Site implementation

The site remains a zero-build static project with normal semantic HTML. Three.js is an ambient visual layer, not the information architecture.

Current-state responsibilities:

- `freshness.js` — non-mutating historical compatibility marker; it no longer injects August state into current pages
- `snapshot-refresh.js` — current audited cross-page state for Overview, Docs, Learn, API, and Changelog
- `accounting-correction.js` — exact-model accounting notes and Learn resource-warning correction
- `roadmap-current.js` — roadmap renderer
- `roadmap-copy.js` — current public roadmap state/copy applied after the renderer
- `scripts/prepare-site.js` — injects the shared scripts/resources before publication
- `SCOUT-SOURCE-AUDIT.md` — branch/source audit
- `SCOUT-ROADMAP.md` — current engineering roadmap

Current-state layers intentionally leave explicitly dated historical snapshot artifacts, such as `SCOUT-SOURCE-SNAPSHOT-2026-08-23.md`, intact as historical evidence.

## Source precedence

When sources disagree, this site uses:

1. current executable source/runtime configuration
2. current production/integration Git trees, active-branch diffs, and staging provenance
3. current provider primary documentation for external platform facts
4. current repository documentation that agrees with executable source
5. dated reports as historical evidence
6. roadmap/intended work only as planned work

A passing test count, a stale branch pointer, a model response, or an older self-description is not promoted to a current runtime fact by itself.

## Pricing-page rule

The pricing page remains customer-facing. The only customer contact path shown there is Bradley Matera's LinkedIn profile. Runtime engineering updates do not silently change commercial terms.

Current early-access framework remains:

- Design Partner Pilot: `$500–$1,500` one-time
- Scout Starter: `$149/month + $750 setup`
- Scout Business: `$399/month + $1,500 setup`
- Scout Managed: `$999+/month`, implementation from `$3,000`
- Portable runtime licensing: from `$5,000`, case-by-case
- Source-access commercial licensing: from `$15,000`, negotiated separately
- Exclusive rights / acquisition: negotiated separately

Included usage, third-party costs, integrations, support, and deployment requirements are defined in written scope rather than represented as unlimited usage.

## Deployment

`.github/workflows/deploy-pages.yml` validates the shared JavaScript/build scripts, runs `scripts/prepare-site.js`, and publishes `main` to the GitHub Pages mirror.

The Gatsby/Netlify site at `bradleymatera.dev` has historically synced this repository into `/scout/`. This repository documents its own source and deployment; a separate host build should be verified independently before claiming that a particular Scout-product-page commit is already live on the primary domain.
