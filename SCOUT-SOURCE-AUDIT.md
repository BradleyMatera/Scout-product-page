# Scout Source Audit — 2026-08-22

This file records the repository evidence used by the Scout implementation-status page. It separates released behavior, integrated development behavior, historical evaluation results, and planned productization.

## Source priority

When sources disagree, use this order:

1. current executable source and workflows
2. `ProjectHub:master` for released production behavior
3. `ProjectHub:develop` for integrated but potentially unreleased behavior
4. current staging provenance from `ProjectHub-dev:main:STAGING-SOURCE.json`
5. dated reports and historical evaluation artifacts for the runtime/scorer they describe
6. roadmap documents only for planned work

## Repositories

### `BradleyMatera/ProjectHub`

Canonical source repository.

- `master` = released production line
- `develop` = protected integration/development line
- contains the ProjectHub frontend, Scout backend, tests, evals, documentation, workflows, deployment scripts, Docker configuration, and analytics

At the time of this audit:

- `master` tip: `4a1eee70821ed83f50be1fe2ff6286abfaa4a15c` (`fix(cache): bump production ProjectHub.js bundle to v16`)
- production release parent: `5c49c9a2db915a426ee85dba1943c1bdcb370683` (`Release: Scout 8B Fast + RAG-first + composer fix`)
- `develop` tip: `f56b7688de8d89de9d692acd261f95764dc48e1b` (`fix(rag): avoid skill-framing for role targets, strengthen UNKNOWN/NO answer instructions`)
- both `master` and `develop` are protected and require `Test and Verify / verify`

`master` and `develop` were diverged at audit time. `develop` contained post-release RAG/contract/validation work that was not necessarily in production.

### `BradleyMatera/ProjectHub-dev`

Staging deployment mirror.

`STAGING-SOURCE.json` records the canonical `ProjectHub/develop` commit used to generate the staging tree. At audit time it pointed to:

`a2415db33c1d98a65387bfa4158215d6e44d245f`

The current `sync-staging.yml` prepares a staging-specific tree, writes provenance metadata, and pushes it to `ProjectHub-dev:main`.

## Branch audit

`ProjectHub` had 25 visible branches during the audit.

Most old feature/chore/release branches contained zero unique commits ahead of current `develop` and functioned as historical pointers. Examples:

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

Two stale ChatGPT experiment branches each retained one unique patch script while being roughly 90 commits behind `develop`:

- `chatgpt/scout-negative-memory-20260820`
- `chatgpt/scout-strict-followup-20260820`

Those scripts are not treated as integrated Scout capabilities.

The active Dependabot branch only changed dependency lock data.

## Current runtime architecture

Current source, README, AGENTS instructions, and runtime knowledge agree on these points:

- Scout is the orchestration/intelligence layer used by ProjectHub Recruiter Alpha.
- Production and staging generation use Cloudflare Workers AI.
- Current configured production model: `@cf/meta/llama-3.1-8b-instruct-fast`.
- Ollama `qwen2.5:1.5b` is the current development/evaluation model.
- Cloudflare-to-Ollama production fallback requires explicit enablement and a qualification flag.
- Browser/WebGPU inference is experimental.
- Substantive questions use a RAG-first path.
- Local Okapi BM25 performs retrieval.
- Contextual follow-ups can fuse BM25 rankings with RRF (`k=60`).
- The backend owns structured per-session state.
- Five recent compact turns are retained in server state.
- Current public tools are allowlisted and read-only.
- Tools can add evidence but are not the primary replacement for retrieved RAG evidence.
- Generated output is validated after inference.
- Normal conversational prose is generative; deterministic code controls routing, evidence, contracts, and validation.
- Canonical direct knowledge paths can emit `DIRECT_KB`; model output is `MODEL_GENERATION`; infrastructure/validation failure can emit `TECHNICAL_ERROR`.
- The documented end-to-end request budget is 15 seconds.

## Current application scope

`data/scout-runtime-knowledge.json` on current `develop` states that the current Scout application is not a general-purpose assistant. Its allowed scope is Bradley Matera's projects, skills, experience, education, certifications, career goals, public contact information, and Scout's own runtime/architecture.

The implementation-status page therefore does not label these as shipped capabilities:

- general-purpose no-KB Scout
- arbitrary customer/domain packages
- any-industry specialization without core changes
- finished multi-tenant SaaS
- production browser/WebGPU inference
- automatic qualified local Ollama production fallback

## Current evidence tools

`lib/agent-tools.js` currently defines recruiter-specific, allowlisted functions including:

- `search_portfolio`
- `get_project`
- `compare_projects`
- `match_role`
- `get_candidate_profile`
- `get_skill_evidence`
- `build_recruiter_brief`

The current tool catalog is tenant/domain-specific even though the execution boundary can be generalized later.

## Session state

`lib/session-state.js` tracks:

- current topic
- current projects
- job description context
- company
- active comparison
- last intent
- unresolved reference
- visitor name
- five recent compact turns

Current constants also set a two-hour in-memory state TTL and a 250-session cap for the public widget process.

## Grounding and validation

`lib/grounding-validator.js` includes checks for:

- overclaim patterns
- entity grounding
- number grounding
- content-word overlap
- question relevance
- answer length/structure
- evidence-strength upgrades
- negation-aware claim validation
- relationship validation
- project/technology provenance
- professional/seniority inflation

Post-release `develop` commits continued changing future/hypothetical-role and UNKNOWN/negative-answer handling.

## Tests and CI

Current engineering instructions describe:

- six legacy API suites
- checked-in Node test suites
- a 61-request local API evaluation
- a 132-input conversation regression: 126 retained production inputs plus a six-turn unknown-technology repair regression
- a 40-query retrieval golden set

Current documented retrieval result:

- Recall@6 = `1.000` on the 40-query golden set

Current CI (`.github/workflows/test.yml`) includes:

- dependency install and high-severity production dependency audit
- analytics build
- committed analytics build freshness check
- generated `ProjectHub.js` freshness check
- JavaScript syntax checks
- cost ledger tests
- retrieval unit tests
- retrieval evaluation
- Recall@6 floor of `0.90`
- required knowledge JSON structure validation
- common secret-pattern scanning
- staging routing isolation check
- metered backend fetch-site check

## Evaluation/scorer correction history

Earlier August 19 live runs were summarized by the original scorer as `114/115` plus a focused `40/40` run.

A later raw-output audit identified false positives. Recorded examples include:

- a Google employment question received a definitive closed-world negative when the evidence state should have remained UNKNOWN
- `Could he learn COBOL?` was scored GOOD even though the visible answer began with the wrong denial
- a future senior-role question carried FALSE/NO contract state where the evidence state should have been UNKNOWN
- a Rust claim was attributed to a project whose canonical technology list did not include Rust

The repository then added a stricter semantic scorer and re-scored the preserved pre-strict artifacts.

Commit `e013a320d0495b56bd5cde0cee993d848f4323ec` records an offline strict baseline of:

- `131/178`
- `73.6%`

That result is historical. Later model, contract, routing, RAG, and validation changes mean it should not be presented as a current production quality percentage.

## Release and operations history

Merged PR history includes implemented work for:

- staging isolation
- CI hardening
- deployment backup / rollback / health checks
- coordinated production releases
- branch protection and GitHub environments
- GitHub-first source-of-truth guardrails
- multi-PC / multi-IDE / multi-agent workspace safety

One documentation/workflow mismatch was found during this audit:

- older release documentation describes production Pages as manual after backend verification
- current `.github/workflows/pages.yml` triggers on pushes to `master` and also supports manual dispatch

The implementation-status page follows the current workflow file for this behavior.

## Deployment state

Current ProjectHub runtime knowledge states:

- public frontend: GitHub Pages
- chat backend: separate backend on a free-tier GCP VM
- normal generation: Cloudflare Workers AI

Dockerfiles and production-parity assets exist in the repository, but the canonical release documentation still identifies the SCP-style GCP deployment path as legacy infrastructure intended to be replaced by image-based deployment after qualification.

The page therefore does not claim that production is already fully image-deployed.

## Planned productization represented on the page

The page labels these as not implemented yet:

- tenant-neutral core boundaries
- supported empty/no-KB mode
- validated customer/domain package schemas
- generalized tool/workflow extension interfaces
- unrelated-domain portability tests
- product-level deployment/config validation, documentation, security review, licensing/IP inventory, and operator handoff

## Retest references

Useful current commands from `package.json` and release documentation include:

```bash
npm test
npm run test:retrieval
npm run eval-retrieval
npm run eval:local-api
npm run eval:conversation
npm run eval:production-conversations
npm run build
node --check server-gemini.js
```

Historical results should be reproduced against the matching historical commit if exact comparison is required. Current-state claims should be re-run against current `develop` or the current deployed target.
