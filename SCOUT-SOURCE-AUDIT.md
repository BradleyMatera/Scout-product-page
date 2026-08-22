# Scout Source Audit — 2026-08-22

This audit records the evidence used to rebuild the public Scout product page. It exists to keep product claims tied to the actual ProjectHub repositories instead of conversation memory or future architecture ideas.

## Repositories

### `BradleyMatera/ProjectHub`

Canonical source repository.

- `master` = released production line
- `develop` = protected integration/development line
- ProjectHub frontend + Scout backend + tests + evals + docs + release automation live here

At the time of this audit:

- `master` tip: `4a1eee70821ed83f50be1fe2ff6286abfaa4a15c` (`fix(cache): bump production ProjectHub.js bundle to v16`)
- production release parent: `5c49c9a2db915a426ee85dba1943c1bdcb370683` (`Release: Scout 8B Fast + RAG-first + composer fix`)
- `develop` tip: `f56b7688de8d89de9d692acd261f95764dc48e1b` (`fix(rag): avoid skill-framing for role targets, strengthen UNKNOWN/NO answer instructions`)
- both `master` and `develop` are protected and require `Test and Verify / verify`

`master` and `develop` are currently diverged. The integrated branch contains post-release RAG/contract/validation work that is not necessarily in production yet.

### `BradleyMatera/ProjectHub-dev`

Staging deployment mirror, not a second source repository.

Its `STAGING-SOURCE.json` identifies the canonical `ProjectHub/develop` commit used to generate the staging tree. At audit time it pointed to `a2415db33c1d98a65387bfa4158215d6e44d245f`.

The current `sync-staging.yml` prepares a staging-specific tree, writes provenance metadata, and pushes it to `ProjectHub-dev:main`.

## Branch audit

`ProjectHub` had 25 visible branches during the audit.

Most old feature/chore/release branches contain **zero unique commits ahead of current `develop`** and now function as historical pointers. This includes:

- `feat/agent-systems-network`
- `feat/architecture-refactor`
- `feat/rag-primary-restoration`
- `feature/ci-hardening`
- `feature/coordinated-releases`
- `feature/deploy-safety`
- `feature/staging-isolation`
- `feature/think-mode-release-compat`
- `fix/secret-name-and-env-setup`
- `hotfix/name-extraction`
- `release/public-refresh-2026-08-20`
- older Git/workspace/doc/revert/archive branches

Two stale ChatGPT experiment branches each retain one unique patch script but are roughly 90 commits behind `develop`:

- `chatgpt/scout-negative-memory-20260820`
- `chatgpt/scout-strict-followup-20260820`

These are not treated as integrated Scout capabilities.

The active Dependabot branch only changes dependency lock data and is not a product capability.

## Current runtime architecture

Current source, README, AGENTS instructions and runtime knowledge agree on the core architecture:

- Scout is the intelligence/orchestration engine.
- ProjectHub Recruiter Alpha is the current application powered by Scout.
- Production and staging generation use Cloudflare Workers AI.
- Current configured production model: `@cf/meta/llama-3.1-8b-instruct-fast`.
- Ollama `qwen2.5:1.5b` is the current development/evaluation model.
- Ollama production fallback is not enabled merely because the code path exists. Cloudflare fallback requires explicit enablement and a qualification flag.
- Browser/WebGPU inference is experimental.
- Substantive questions use RAG-first evidence preparation.
- Local Okapi BM25 performs retrieval.
- Contextual follow-ups can fuse multiple BM25 rankings with RRF (`k=60`).
- The backend owns structured per-session conversation state.
- Five recent compact turns are retained in server state.
- Tools are allowlisted and read-only in the public recruiter application.
- Tools can enrich evidence; they are not the primary replacement for retrieved RAG evidence.
- Generated output is validated after inference.
- Normal chatbot prose is generative; deterministic code owns routing, evidence, contracts and validation rather than freely authoring ordinary conversational answers.
- Canonical direct knowledge paths can emit `DIRECT_KB`; normal model output is `MODEL_GENERATION`; infrastructure/validation failure can emit `TECHNICAL_ERROR`.
- The architecture operates under a 15-second end-to-end response budget.

## Current application scope

This is the largest correction made to the product page.

`data/scout-runtime-knowledge.json` on current `develop` explicitly says the current Scout application is **not a general-purpose assistant**. Its allowed scope is Bradley Matera's projects, skills, experience, education, certifications, career goals, public contact information, and Scout's own runtime/architecture.

Therefore the product page must not advertise the following as currently shipped:

- general-purpose no-KB Scout
- arbitrary customer/domain packs
- any-industry specialization without core work
- finished multi-tenant SaaS
- production browser/WebGPU inference
- automatically qualified local Ollama production fallback

Those belong in the productization roadmap.

## Current evidence tools

`lib/agent-tools.js` currently defines recruiter-specific, allowlisted functions such as:

- `search_portfolio`
- `get_project`
- `compare_projects`
- `match_role`
- `get_candidate_profile`
- `get_skill_evidence`
- `build_recruiter_brief`

This is evidence that the *tool boundary* is reusable, but the current shipped tool catalog itself is tenant/domain-specific.

## Session state

`lib/session-state.js` makes the backend authoritative for conversation state. It tracks items including:

- current topic
- current projects
- job description context
- company
- active comparison
- last intent
- unresolved reference
- visitor name
- five recent compact turns

State is in-memory with a two-hour TTL and bounded session capacity for the public widget.

## Grounding and validation

`lib/grounding-validator.js` includes multiple layers beyond a simple answer/KB similarity check, including:

- overclaim detection
- entity grounding
- number grounding
- content-word overlap
- question relevance
- answer length/structure
- evidence-strength upgrade detection
- claim-level negation-aware validation
- relationship validation
- project/technology provenance checks
- professional/seniority inflation controls

The newest `develop` commits continue strengthening future/hypothetical role handling and UNKNOWN/negative-answer behavior.

## Test and CI evidence

Current engineering instructions describe:

- six legacy API suites
- dozens of checked-in Node tests
- a 61-request local API evaluation
- a 132-input conversation regression (126 retained production inputs plus a six-turn unknown-technology repair regression)
- a 40-query retrieval golden set

Current documented retrieval result:

- Recall@6 = `1.000` on the 40-query golden set

Current CI (`.github/workflows/test.yml`) includes checks for:

- dependency install / high-severity production audit
- analytics build
- committed analytics build freshness
- generated `ProjectHub.js` freshness
- JavaScript syntax
- cost ledger tests
- retrieval unit tests
- retrieval evaluation
- Recall@6 floor of `0.90`
- required knowledge JSON structure
- common secret-pattern scanning
- staging routing isolation
- metered backend fetch call sites

## Qualification history and why old percentages are not marketing claims

The repository contains an unusually useful example of self-correction.

Earlier August 19 live runs looked extremely strong under the original acceptance scorer (including `114/115` and a focused `40/40`). A later raw-output audit proved the scorer had false positives.

Examples recorded in the repository:

- a Google employment question received a definitive closed-world negative when the evidence only justified UNKNOWN
- `Could he learn COBOL?` was scored GOOD even though the visible answer began with the wrong denial
- a future senior-role question carried a FALSE/NO contract when the evidence state should have been UNKNOWN
- a Rust claim drifted onto a project whose canonical technology list did not include Rust

The project then:

1. explicitly invalidated the old release-gate interpretation
2. added a stricter semantic scorer
3. re-scored stored raw artifacts
4. exposed a much weaker strict baseline
5. changed intent / response-contract / recovery / grounding behavior based on the failures

For this reason the public page does not claim a global accuracy percentage.

## Release / operations history

Merged PR history shows implemented work for:

- staging isolation
- CI hardening
- deployment backup / rollback / health checks
- coordinated production releases
- branch protection and GitHub environments
- GitHub-first source-of-truth guardrails
- multi-PC / multi-IDE / multi-agent workspace safety

One important drift was found during this audit:

- older release documentation describes production Pages as manual after backend verification
- current `.github/workflows/pages.yml` actually triggers on pushes to `master` **and** supports manual dispatch

The public product page follows current executable workflow behavior rather than repeating stale documentation.

## Deployment reality

Current ProjectHub runtime knowledge says:

- public frontend: GitHub Pages
- chat backend: separate backend running on a free-tier GCP VM
- normal generation: Cloudflare Workers AI

Dockerfiles and production-parity concepts exist in the repository, but the canonical release documentation still identifies the current SCP-style GCP deployment scripts as legacy infrastructure intended to be replaced by image-based Docker deployment after qualification.

The product page therefore does not claim that the current production backend is already fully migrated to an image-based deployment workflow.

## Productization direction represented on the page

The page labels these as roadmap/productization work rather than current capability:

- stabilize current Scout behavior first
- reduce branch/repository clutter after preserving meaningful history
- extract recruiter/customer assumptions from core orchestration
- support an intentional empty/no-KB Scout mode
- define validated knowledge/policy/workflow/tool/extension package contracts
- prove portability against unrelated domains without changing Scout Core
- improve documentation, configuration validation, deployment, security, licensing/IP inventory and handoff quality

## Audit rule for future page changes

When marketing copy conflicts with source evidence:

1. current executable source/workflow wins over stale prose
2. `master` describes released production behavior
3. `develop` describes integrated but potentially unreleased behavior
4. `ProjectHub-dev` is staging evidence, not an independent source
5. historical evals must retain their date/model/scorer context
6. roadmap ideas must be visibly labeled as roadmap ideas
