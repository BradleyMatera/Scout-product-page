# Scout Source Audit — 2026-09-05

This is the source record behind the current Scout product-site sync.

The previous product-site current-state commit was `Scout-product-page@6d5937416a6e6c89cfbf4c849536f14a85578be4`, committed **2026-08-27T19:43:53Z**. August 27 at that timestamp is the comparison cutoff.

The audit inspected:

- every visible branch head in `BradleyMatera/ProjectHub`;
- every visible branch head in `BradleyMatera/ProjectHub-dev`;
- branch-head commit dates/messages;
- recent ProjectHub PR/release history;
- current `master` and `develop` Git trees;
- active post-release branch diffs;
- `ProjectHub-dev/STAGING-SOURCE.json`;
- current provider/router/server/runtime source;
- current handoff/release documentation;
- current test/evaluation evidence used by the September release;
- the product site's prior freshness, accounting, roadmap, Docs, Learn, API, and Changelog layers.

The branch collection was re-read near the end of the audit. During the audit, `feat/generic-conversation-sets` moved from the released `develop` pointer to two new post-release commits. This document records the later state rather than the earlier pointer.

## Source priority

When sources disagree, the product site uses this order:

1. current executable source/runtime configuration;
2. current production/integration Git trees, active branch diffs, and staging provenance;
3. current primary provider documentation for external platform facts;
4. current repository documentation that agrees with executable source;
5. dated test/evaluation/release artifacts as historical evidence;
6. roadmap documents only for planned work.

A stale branch pointer, old self-description, test score, or model output is not promoted to a current runtime fact by itself.

## Current repository state

### Released production

- branch: `ProjectHub:master`
- commit: `b071e4e4f0bb69faeecd811f31514af30d2e1f61`
- date: `2026-09-05T17:51:29Z`
- message: `release: promote qualified develop tree to production`
- Git tree: `a0066cc849f33dd84d18d8e8c36b080fed8ce70e`

### Protected integration

- branch: `ProjectHub:develop`
- commit: `4f5ee971488e433ebdf66280cce82e163c5c7688`
- date: `2026-09-05T17:45:50Z`
- message: `fix: secure diagnostics and retry widget setup`
- Git tree: `a0066cc849f33dd84d18d8e8c36b080fed8ce70e`

`master` and `develop` have different Git histories, but their current Git trees are identical. PR #29 preserved production ancestry while promoting the exact qualified `develop` tree.

### Staging mirror

- branch: `ProjectHub-dev:main`
- commit: `6d36433c040d0bbc903ec26b6968674bd937bcd0`
- date: `2026-09-05T17:46:11Z`
- `STAGING-SOURCE.json`: `ProjectHub/develop@4f5ee971488e433ebdf66280cce82e163c5c7688`

### Active unmerged runtime work

- branch: `ProjectHub:feat/generic-conversation-sets`
- head: `5bd9437b1811957f20d1a217c854d46228ace12c`
- head date: `2026-09-05T18:42:55Z`
- relation to `develop`: **2 commits ahead / 0 behind** at recheck
- GitHub Actions runs exposed for this branch at recheck: **0**
- PR for this head at recheck: **none found**

Two post-release commits are present:

1. `f145f8cec16e414e601ad2fc66b789690fb70cb4` — `feat(scout): generic discourse frames + generated clarification`
2. `5bd9437b1811957f20d1a217c854d46228ace12c` — `fix(scout): commit discourse state on cache-hit turns; CLARIFICATION mode`

The branch adds generic server-owned discourse frames for ordered user-introduced alternatives, corrections/removals/ordinals, and continuation questions. Assistant mentions are intentionally excluded from the authoritative alternative set. It also adds a `CLARIFICATION` control mode for unresolved plural-set questions such as “which of those is better?” and moves discourse-state commit before cache/direct-KB early returns so those turns can seed the next turn's frame.

Changed files compared with current `develop`:

- `lib/conversation-resolver.js`
- `lib/lite-agent.js`
- `lib/rag-agent.js`
- `lib/response-policy-classifier.js`
- `lib/session-state.js`
- `server-gemini.js`
- new `test/discourse-frames.test.js`
- one small gate-debug test adjustment

This branch is **not** described as integrated, staged, released, or CI-qualified until those states are separately proven.

### Pending dependency maintenance

Dependabot branch `c32e83b8428a733b597341b1bc7efe4b4ede7423` is one commit ahead of `master` and only changes `package-lock.json`. It updates dependency lock data and is not treated as a Scout runtime capability.

## Full ProjectHub branch-head audit

35 visible branch heads were checked. Twelve are dated after the August 27 product-page cutoff; 23 point to older July/August work.

### Post-cutoff/current branch heads

| Branch | Head | Date | Interpretation |
|---|---|---:|---|
| `dependabot/npm_and_yarn/npm_and_yarn-116291eeda` | `c32e83b` | Sep 5 | Lockfile-only maintenance proposal, not runtime behavior. |
| `develop` | `4f5ee97` | Sep 5 | Current qualified integration source. |
| `docs/update-handoff-path-a` | `a280298` | Sep 5 | Handoff branch merged via PR #27; historical pointer after merge. |
| `feat/generic-conversation-sets` | `5bd9437` | Sep 5 | **Active unmerged post-release runtime work, 2 ahead / 0 behind develop at recheck.** |
| `fix/phase7-8-conversation-gate` | `4d39995` | Sep 5 | Original Phase 7/8 pointer; accepted work merged through PR #23. |
| `fix/release-hardening-develop` | `428601a` | Sep 5 | Release-hardening branch merged through PR #28. |
| `fix/release-hardening-gatedebug-init` | `8ac02fb` | Sep 2 | Earlier release/hardening pointer. |
| `hotfix/projecthub-embed-idempotency` | `cdc0a55` | Sep 5 | Widget initialization hotfix merged through PR #24. |
| `hotfix/ui-scroll-and-input` | `eed5809` | Sep 5 | Widget composer/scroll hotfix merged through PR #26. |
| `master` | `b071e4e` | Sep 5 | Current released production source commit. |
| `release/production-2026-09-05` | `2e90ed8` | Sep 5 | Master-parented exact-tree release commit used by PR #29. |
| `release/scout-prod-2026-09-02` | `39afd75` | Sep 2 | Sep 2 release branch, superseded by Sep 5 production source release. |

### Pre-cutoff historical pointers

| Branch | Head | Period | Interpretation |
|---|---|---:|---|
| `archive/develop-pre-multimachine-20260717` | `d38c5bd` | Jul 17 | Archived pre-multi-machine state. |
| `chatgpt/scout-negative-memory-20260820` | `7eef9b7` | Aug 20 | Historical negative-memory experiment. |
| `chatgpt/scout-strict-followup-20260820` | `fd5af3a` | Aug 20 | Historical strict-follow-up experiment. |
| `chore/git-source-of-truth-guardrails` | `15e7651` | Aug 12 | Git source-of-truth guardrails. |
| `chore/mark-scout-workspace-published` | `751374c` | Aug 12 | Workspace metadata pointer. |
| `chore/mark-scout-workspace-published-temp` | `9899ae2` | Aug 12 | Historical workspace pointer. |
| `chore/multi-workspace-git-guardrails` | `ec06351` | Aug 12 | Multi-PC/IDE/agent Git guardrails. |
| `chore/safe-workspace-base` | `ffc96a6` | Aug 12 | Historical safe-workspace pointer. |
| `docs/branch-protection` | `38b3aef` | Jul 17 | Historical branch-protection docs. |
| `docs/spec-housekeeping` | `97f7c71` | Jul 17 | Historical release-spec housekeeping. |
| `feat/agent-systems-network` | `ef892a0` | Aug 16 | Historical agent-system branch. |
| `feat/architecture-refactor` | `dcba6bd` | Aug 17 | Historical architecture branch. |
| `feat/rag-primary-restoration` | `d32b75e` | Aug 21 | Historical RAG/model qualification branch. |
| `feature/ci-hardening` | `ffe281e` | Jul 17 | CI hardening branch. |
| `feature/coordinated-releases` | `0e2dd71` | Jul 17 | Coordinated release workflow branch. |
| `feature/deploy-safety` | `6bf6d13` | Jul 17 | Deployment guard/backup/rollback branch. |
| `feature/staging-isolation` | `25fab33` | Jul 17 | Staging-isolation branch. |
| `feature/think-mode-release-compat` | `7220b06` | Jul 17 | Historical Think Mode release branch. |
| `fix/secret-name-and-env-setup` | `5a5f3a3` | Jul 17 | Historical env/secret setup fix. |
| `hotfix/cloudflare-neuron-accounting` | `a205e30` | Aug 24 | Historical accounting branch; behavior is present in later released tree. |
| `hotfix/name-extraction` | `40b2296` | Aug 20 | Historical name extraction fix. |
| `release/public-refresh-2026-08-20` | `68a28ed` | Aug 20 | Superseded public refresh branch. |
| `revert/accidental-desktop-master-20260812` | `8981102` | Aug 12 | Historical revert/source-of-truth cleanup. |

Important Git nuance: several merged branches still look `ahead` or `diverged` because accepted work was squash/merge-integrated and the source branch pointer remains. Merge state, current tree content, dates, and current branch tips are used together rather than treating raw ahead/behind counts as product status.

## Full ProjectHub-dev branch audit

Two visible branches:

| Branch | Head | Date | Interpretation |
|---|---|---:|---|
| `main` | `6d36433` | Sep 5 | Current staging mirror from `ProjectHub/develop@4f5ee971`. |
| `dependabot/npm_and_yarn/npm_and_yarn-116291eeda` | `abf2c3a` | Aug 9 | Old dependency proposal based on an old staging state. |

## Post-August-27 PR/release history

### PR #23 — Phase 7/8 conversation gate

Merged Sep 5 into `develop`.

It changed the actual conversation stack, including response-policy classification, query understanding, conversation resolution, response contracts/completeness, RAG, claim/grounding/relationship/technology validation, provider/router behavior, server orchestration, the widget bundle, the 132-turn harness, and new regression suites.

Recorded qualification at branch commit `4d39995`:

- **995 local tests** at that PR checkpoint;
- live dev conversations: **16/33 → 21/33**;
- live dev turns: **88/132 → 94/132**;
- **14 of 38** remaining failures classified by the harness as `inference-unavailable`.

That category is an observed outcome, not proof that every failure was externally caused.

### PR #24 — widget initialization

Merged Sep 5.

- guards duplicate/reentrant `initProjectHub()` calls;
- exposes `window.initProjectHub` for explicit dynamic embeds;
- prevents duplicate UI/listeners from repeated initialization.

### PR #26 — chat input and scrolling

Merged Sep 5.

- auto-scroll only follows while the user is already near the bottom;
- composer input remains usable while a request/reply is in flight;
- a submitted follow-up can queue and is sent after the active turn finishes.

### PR #28 — release hardening

Merged Sep 5.

- gate diagnostics require server authorization **and** request opt-in;
- authorized debug responses are `no-store` and isolated from the normal response cache;
- dead timeout helpers removed without changing the 15-second Scout request deadline;
- partial widget initialization rolls back DOM/listeners before retry;
- browser regressions cover draft preservation and bottom-follow behavior.

Recorded local verification:

- **1019/1019** tests, zero skipped;
- retrieval Recall@6 **1.000**;
- retrieval MRR@6 **0.942**;
- widget build/parity, syntax, whitespace and workspace checks passed.

### PR #29 — September 5 production source release

Merged Sep 5.

- release commit `2e90ed8` was parented from production ancestry;
- its tree exactly matched qualified `develop@4f5ee971` tree `a0066cc...`;
- resulting `master@b071e4e4` has the same tree.

Recorded release evidence also states staging pins `4f5ee971`, staging widget source was byte-identical to qualified develop, and the dev backend had hash/health/smoke evidence for that source. Known conversation residuals were deferred rather than silently relabeled as fixed.

The PR lists separate post-merge production deployment checks. Git merge history proves the source release; it does not by itself prove every external host check completed afterward.

### September 2 release

PR #22 used the same ancestry-preserving release pattern after direct PR #21 conflicted with production history.

### Closed direct Sep 5 PR #25

PR #25 (`develop → master`) was closed without merge. PR #29 superseded it with the exact-tree production-ancestry-preserving path. The product site does not describe #25 as the production merge.

## Current released runtime facts verified against source

- hosted model: `@cf/meta/llama-3.1-8b-instruct-fast`;
- current RAG/LITE production generation: temperature `0`, top-p `0.9`;
- Cloudflare adapter default temperature: `0` when not overridden;
- Cloudflare-primary Ollama fallback: disabled by default, requires explicit fallback enablement plus `SCOUT_OLLAMA_QUALIFIED=true`;
- local development/evaluation model: `qwen2.5:1.5b`;
- request deadline: 15 seconds;
- substantive requests remain RAG-first;
- local BM25 and contextual RRF remain retrieval foundations;
- tools supplement retrieved evidence rather than replacing RAG as primary context;
- public evidence tools remain allowlisted/read-only;
- generated output is validated after inference;
- recruiter application remains scoped to Bradley Matera's verified professional information and Scout runtime.

The new discourse-frame/CLARIFICATION branch is deliberately not included in this released list.

## Cloudflare accounting truth

Current executable provider/accounting code is exact-model and null-safe:

- normal Scout `@cf/meta/llama-3.1-8b-instruct-fast` has no borrowed token→neuron rate;
- `@cf/meta/llama-3.1-8b-instruct-fp8-fast` retains `4119 / 34868` only for that identifier;
- `@cf/meta/llama-3.1-8b-instruct-fp8` retains `13778 / 26128` only for that identifier;
- provider-reported actual neurons can be preserved;
- unverified estimates remain `null`/unknown;
- session/cost completeness stays incomplete when a contributing value is unknown.

### Current source inconsistency

`data/scout-runtime-knowledge.json` is still marked `lastVerified: 2026-08-21` and still contains the old sentence assigning `4119 / 34868` to normal `-fast`. This conflicts with executable provider/accounting code and current Cloudflare pricing evidence. The product page records it as stale truth debt and does not repeat it as current behavior.

## Current evidence/test boundary

Use numbers only with their scope:

- **1019/1019**: Sep 5 released-tree hardening suite;
- Recall@6 **1.000**, MRR@6 **0.942**: Sep 5 retrieval verification;
- **94/132 turns, 21/33 conversations**: pre-release Phase 7/8 live qualification at `4d39995`;
- **14/38 inference-unavailable outcomes**: failure classification from that dated live run;
- `feat/generic-conversation-sets@5bd9437`: no GitHub Actions run/status was exposed at recheck, so no new branch-level pass count is asserted here.

No single value is a universal production quality percentage.

## Productization boundary

The September release advances the working recruiter implementation and release truth. It does not prove these later product claims:

- general-purpose no-KB Scout;
- finished customer/domain-package installer;
- arbitrary-industry portability without core changes;
- public multi-tenant API-key product;
- production browser/WebGPU primary inference;
- unbounded tool/agent execution;
- completed customer/operator handoff.

Those remain roadmap/productization work.

## Retest references

```bash
npm test
npm run test:retrieval
npm run eval-retrieval
npm run eval:local-api
npm run eval:conversation
npm run eval:production-conversations
npm run build
npm run build:widget
node --check server-gemini.js
git diff --check
```

Exact historical comparisons should be reproduced at the matching historical commit. Current claims should be tested against the intended current branch/deployment target.
