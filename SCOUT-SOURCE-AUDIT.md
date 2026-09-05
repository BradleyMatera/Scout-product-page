# Scout Source Audit — 2026-09-05

This audit is the source record behind the current Scout product-site sync. The previous product-site update was `Scout-product-page@6d5937416a6e6c89cfbf4c849536f14a85578be4`, committed **2026-08-27T19:43:53Z**. This audit therefore treats August 27 at that timestamp as the comparison cutoff.

The audit inspected:

- every visible branch head in `BradleyMatera/ProjectHub`;
- every visible branch head in `BradleyMatera/ProjectHub-dev`;
- branch-head commit dates/messages;
- recent ProjectHub PR/release history;
- current `master` and `develop` Git trees;
- `ProjectHub-dev/STAGING-SOURCE.json`;
- current provider/router/runtime source;
- current handoff/release documentation;
- current test/evaluation evidence used by the September release;
- the existing Scout-product-page freshness, accounting, roadmap, Docs, Learn, API, and Changelog layers.

## Source priority

When sources disagree, the product site uses this order:

1. current executable source/runtime configuration;
2. current production/integration Git trees and staging provenance;
3. current primary provider documentation for external platform facts;
4. current repository documentation that agrees with executable source;
5. dated test/evaluation/release artifacts as historical evidence;
6. roadmap documents only for planned work.

A stale branch pointer, old self-description, test score, or model output is not promoted to a current runtime fact by itself.

## Current repository state

### ProjectHub production

- branch: `master`
- commit: `b071e4e4f0bb69faeecd811f31514af30d2e1f61`
- commit date: `2026-09-05T17:51:29Z`
- message: `Merge pull request #29 ... release: promote qualified develop tree to production`
- Git tree: `a0066cc849f33dd84d18d8e8c36b080fed8ce70e`

### ProjectHub integration

- branch: `develop`
- commit: `4f5ee971488e433ebdf66280cce82e163c5c7688`
- commit date: `2026-09-05T17:45:50Z`
- message: `fix: secure diagnostics and retry widget setup`
- Git tree: `a0066cc849f33dd84d18d8e8c36b080fed8ce70e`

`master` and `develop` have deliberately different Git histories, but their current trees are identical. PR #29 used a production-ancestry-preserving release commit whose tree exactly matches the qualified `develop` tree.

### ProjectHub-dev staging mirror

- branch: `main`
- commit: `6d36433c040d0bbc903ec26b6968674bd937bcd0`
- commit date: `2026-09-05T17:46:11Z`
- message: `staging: mirror from ProjectHub/develop 4f5ee971...`
- `STAGING-SOURCE.json` source commit: `4f5ee971488e433ebdf66280cce82e163c5c7688`

The staging repository therefore records the same qualified `develop` source used for the September 5 production tree.

## Full ProjectHub branch-head audit

35 visible branches were checked. Twelve have branch heads newer than the August 27 product-page cutoff; 23 point to older July/August work.

### Post-cutoff/current branches

| Branch | Head | Head date | Audit interpretation |
|---|---|---:|---|
| `dependabot/npm_and_yarn/npm_and_yarn-116291eeda` | `c32e83b` | Sep 5 | One lockfile-only commit ahead of current master. Pending maintenance, not shipped Scout behavior. |
| `develop` | `4f5ee97` | Sep 5 | Current qualified integration tree. |
| `docs/update-handoff-path-a` | `a280298` | Sep 5 | Handoff update branch; merged via PR #27 and superseded by current develop. |
| `feat/generic-conversation-sets` | `4f5ee97` | Sep 5 | Currently points at the same commit as develop. |
| `fix/phase7-8-conversation-gate` | `4d39995` | Sep 5 | Original Phase 7/8 branch pointer. Work merged through PR #23; current develop contains the accepted/squashed result plus later work. |
| `fix/release-hardening-develop` | `428601a` | Sep 5 | Release-hardening source branch; merged through PR #28. |
| `fix/release-hardening-gatedebug-init` | `8ac02fb` | Sep 2 | Points at the Sep 2 production release line; not the current Sep 5 integration head. |
| `hotfix/projecthub-embed-idempotency` | `cdc0a55` | Sep 5 | Widget initialization hotfix; merged through PR #24. |
| `hotfix/ui-scroll-and-input` | `eed5809` | Sep 5 | Widget input/scroll hotfix; merged through PR #26. |
| `master` | `b071e4e` | Sep 5 | Current production source commit. |
| `release/production-2026-09-05` | `2e90ed8` | Sep 5 | Exact-qualified-tree release commit used by PR #29. |
| `release/scout-prod-2026-09-02` | `39afd75` | Sep 2 | Sep 2 production release branch, superseded by Sep 5 production release. |

### Pre-cutoff historical branch pointers

These branch heads predate the August 27 site cutoff. They were still inspected so an old pointer would not be mistaken for newer unmerged Scout work.

| Branch | Head | Head date / period | Interpretation |
|---|---|---:|---|
| `archive/develop-pre-multimachine-20260717` | `d38c5bd` | Jul 17 | Archived pre-multi-machine develop state. |
| `chatgpt/scout-negative-memory-20260820` | `7eef9b7` | Aug 20 | Historical guarded negative-memory experiment. |
| `chatgpt/scout-strict-followup-20260820` | `fd5af3a` | Aug 20 | Historical strict-follow-up experiment. |
| `chore/git-source-of-truth-guardrails` | `15e7651` | Aug 12 | Git safety/source-of-truth work already represented in repo history. |
| `chore/mark-scout-workspace-published` | `751374c` | Aug 12 | Workspace metadata branch. |
| `chore/mark-scout-workspace-published-temp` | `9899ae2` | Aug 12 | Historical workspace pointer. |
| `chore/multi-workspace-git-guardrails` | `ec06351` | Aug 12 | Multi-PC/IDE/agent Git guardrails. |
| `chore/safe-workspace-base` | `ffc96a6` | Aug 12 | Historical safe-workspace branch. |
| `docs/branch-protection` | `38b3aef` | Jul 17 | Historical branch-protection docs. |
| `docs/spec-housekeeping` | `97f7c71` | Jul 17 | Historical release-spec housekeeping. |
| `feat/agent-systems-network` | `ef892a0` | Aug 16 | Historical agent-system development pointer. |
| `feat/architecture-refactor` | `dcba6bd` | Aug 17 | Historical architecture branch. |
| `feat/rag-primary-restoration` | `d32b75e` | Aug 21 | Historical RAG/model qualification branch. |
| `feature/ci-hardening` | `ffe281e` | Jul 17 | CI hardening merged long before cutoff. |
| `feature/coordinated-releases` | `0e2dd71` | Jul 17 | Coordinated release workflow branch. |
| `feature/deploy-safety` | `6bf6d13` | Jul 17 | Deployment guard/backup/rollback branch. |
| `feature/staging-isolation` | `25fab33` | Jul 17 | Staging-isolation branch. |
| `feature/think-mode-release-compat` | `7220b06` | Jul 17 | Historical Think Mode compatibility branch. |
| `fix/secret-name-and-env-setup` | `5a5f3a3` | Jul 17 | Historical environment/secret setup fix. |
| `hotfix/cloudflare-neuron-accounting` | `a205e30` | Aug 24 | Historical accounting hotfix branch. Its exact-model/null-safe behavior is present in the current released tree even though PR #20 remains open against an obsolete base. |
| `hotfix/name-extraction` | `40b2296` | Aug 20 | Historical name-extraction fix. |
| `release/public-refresh-2026-08-20` | `68a28ed` | Aug 20 | Superseded public refresh branch. |
| `revert/accidental-desktop-master-20260812` | `8981102` | Aug 12 | Historical revert/source-of-truth cleanup branch. |

Important Git nuance: several merged branches still appear `ahead` or `diverged` when compared to current develop because the accepted work was merged/squashed and the original branch pointer was left in place. PR merge state, current tree content, dates, and current branch tips are therefore used together rather than treating raw ahead/behind counts as product status.

## Full ProjectHub-dev branch audit

Two branches were visible:

| Branch | Head | Date | Interpretation |
|---|---|---:|---|
| `main` | `6d36433` | Sep 5 | Current staging mirror, generated from ProjectHub `develop@4f5ee971`. |
| `dependabot/npm_and_yarn/npm_and_yarn-116291eeda` | `abf2c3a` | Aug 9 | Old dependency proposal based on an old staging tree; not current runtime state. |

## Post-August-27 release history

### PR #23 — Phase 7/8 conversation gate

Merged Sep 5 into `develop`.

Changed the actual conversation stack, including:

- response-policy classification;
- query understanding and conversation resolution;
- response contracts and completeness handling;
- RAG agent/chunks;
- claim, grounding, relationship, and technology-claim validation;
- provider/router behavior;
- server orchestration;
- ProjectHub widget bundle;
- 132-turn conversation harness and new Phase 7/8/synthetic regressions.

Recorded qualification at branch commit `4d39995`:

- 995 local tests passed at the PR checkpoint;
- live dev qualification improved from 16/33 conversations to **21/33**;
- turns improved from 88/132 to **94/132**;
- 14 of 38 remaining failures were classified by the harness as `inference-unavailable`.

That last category is an observed outcome, not proof that every such failure was externally caused.

### PR #24 — widget initialization

Merged Sep 5.

- `initProjectHub()` became idempotent;
- duplicate calls are guarded;
- `window.initProjectHub` is exposed for explicit dynamic-embed initialization;
- duplicate listeners/UI caused by repeated initialization are prevented.

### PR #26 — chat input and scrolling

Merged Sep 5.

- auto-scroll occurs only when the user is already near the bottom;
- composer input remains usable while a request/reply is in flight;
- a submitted follow-up can be queued;
- the queued query is sent after the active turn finishes.

### PR #28 — release hardening

Merged Sep 5.

- `gateDebug` diagnostics now require both server authorization (`SCOUT_GATE_DEBUG=true`) and request opt-in;
- debug responses are marked `Cache-Control: no-store` and are isolated from normal response-cache reads/writes;
- dead timeout helpers were removed without changing the 15-second Scout request deadline;
- partial widget initialization can roll back DOM/listeners and retry safely;
- browser tests fixed/proved draft preservation and bottom-follow behavior.

Recorded local verification:

- **1019/1019** tests, zero skipped;
- retrieval Recall@6 **1.000**;
- retrieval MRR@6 **0.942**;
- build, widget rebuild/parity, syntax, whitespace and workspace checks passed.

### PR #29 — September 5 production source release

Merged Sep 5.

- release commit `2e90ed8` was parented from current production ancestry;
- release tree exactly matched qualified `develop@4f5ee971` tree `a0066cc...`;
- resulting `master@b071e4e4` also has tree `a0066cc...`.

Recorded release evidence also states:

- staging `STAGING-SOURCE.json` pins `4f5ee971`;
- staging ProjectHub.js was recorded byte-identical to develop source;
- dev backend source was hash-verified at `4f5ee971` with health/smoke verification;
- known residuals from the pre-existing qualification remained deferred rather than being silently reclassified as fixed.

The PR body lists additional post-merge production deployment checks as required steps. Git merge history proves the source release; it does not by itself prove every external production host check after the merge. The product site keeps that distinction.

### September 2 production release

PR #22 released the earlier qualified Scout staging tree to production on Sep 2 after a direct develop→master PR (#21) was replaced by a clean master-parented release branch because of branch-history divergence. The same ancestry-preserving pattern was used again for the Sep 5 release.

### Direct Sep 5 release PR #25

PR #25 (`develop → master`) was closed without merge. PR #29 superseded it with a tree-exact production-ancestry-preserving release commit. The site must not describe #25 as the production merge.

## Current runtime facts verified against source

- normal hosted model: `@cf/meta/llama-3.1-8b-instruct-fast`;
- production RAG/LITE generation uses temperature `0`, top-p `0.9`;
- Cloudflare adapter default temperature is also `0` when not explicitly supplied;
- production-primary Cloudflare→Ollama fallback is disabled by default and requires explicit fallback enablement plus `SCOUT_OLLAMA_QUALIFIED=true`;
- local development/evaluation model remains `qwen2.5:1.5b`;
- request deadline remains 15 seconds;
- substantive requests remain RAG-first;
- local BM25 and contextual RRF remain the retrieval foundation;
- tools supplement evidence rather than replacing RAG as the primary answer context;
- current public evidence tools remain allowlisted/read-only;
- generated output is validated after inference;
- current recruiter application remains scoped to Bradley Matera's verified professional information and Scout runtime, not a shipped general-purpose assistant.

## Cloudflare accounting truth

Current executable provider/accounting code correctly keeps model identifiers exact:

- normal Scout model `@cf/meta/llama-3.1-8b-instruct-fast` has no borrowed token→neuron rate;
- `@cf/meta/llama-3.1-8b-instruct-fp8-fast` retains `4119 / 34868` only for that exact identifier;
- `@cf/meta/llama-3.1-8b-instruct-fp8` retains `13778 / 26128` for that exact identifier;
- provider-reported actual neurons can be preserved;
- unverified estimates remain `null`/unknown rather than zero;
- session/cost completeness fails closed when a contributing value is unknown.

### Current source inconsistency

`data/scout-runtime-knowledge.json` is still marked `lastVerified: 2026-08-21` and still contains the old sentence assigning `4119 / 34868` to the normal `-fast` model. This conflicts with executable provider/accounting code and current Cloudflare pricing evidence. The product page treats that record as stale truth debt and does not repeat it as current behavior.

## Current evidence/test boundary

Use test/evaluation numbers only with their scope:

- **1019/1019**: Sep 5 local release-hardening test suite;
- Recall@6 **1.000**, MRR@6 **0.942**: Sep 5 retrieval verification;
- **94/132 turns, 21/33 conversations**: pre-release Phase 7/8 live qualification at `4d39995`;
- **14/38 inference-unavailable outcomes**: failure classification from that live run;
- older `dfe1385`, `2d358ac`, August gate, strict-scorer and local-model results remain historical comparison points only.

No one of these values is a universal production quality percentage.

## Productization boundary

The September release advances the working recruiter implementation and release truth. It does not prove these later product claims:

- general-purpose no-KB Scout;
- finished customer/domain-package installer;
- arbitrary-industry portability without core changes;
- public multi-tenant developer API/key product;
- production browser/WebGPU primary inference;
- unbounded agent/tool execution;
- completed customer/operator handoff.

Those remain roadmap/productization work.

## Retest references

Current repository scripts continue to expose reproducible checks such as:

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

Exact historical comparisons should be reproduced at the matching historical commit. Current claims should be tested against the current released/integration tree and the intended deployment target.
