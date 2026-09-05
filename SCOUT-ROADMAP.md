# Scout Roadmap

Last refreshed: **September 5, 2026**

This roadmap describes the engineering path from the current released ProjectHub Recruiter Alpha implementation toward a portable Scout product. It distinguishes source release, staging provenance, dated evaluation evidence, current truth-debt, and later productization work.

Passing tests is evidence. A branch name is evidence. A deployment marker is evidence. None of them, by itself, is a universal quality claim.

## Current source state

- **Production:** `ProjectHub:master@b071e4e4f0bb69faeecd811f31514af30d2e1f61`
- **Integration:** `ProjectHub:develop@4f5ee971488e433ebdf66280cce82e163c5c7688`
- **Production + integration Git tree:** `a0066cc849f33dd84d18d8e8c36b080fed8ce70e`
- **Staging:** `ProjectHub-dev:main@6d36433c040d0bbc903ec26b6968674bd937bcd0`
- **Staging source marker:** `4f5ee971488e433ebdf66280cce82e163c5c7688`
- **Pending maintenance:** Dependabot `c32e83b`, one lockfile-only commit ahead of `master`

The histories of `master` and `develop` are intentionally different. The September 5 production release preserved production ancestry while promoting the exact qualified `develop` tree, so current source-tree parity is more meaningful than raw branch ahead/behind counts.

## September release record

The August 27 product-site snapshot showed Phase 02 as an active branch. That state has moved forward.

- PR #23 merged the Phase 7/8 conversation-gate changes into `develop`.
- PR #24 merged retry-safe/idempotent widget initialization behavior.
- PR #26 merged chat scroll/input behavior and queued follow-ups.
- PR #28 merged release hardening and the final 1019-test verification state.
- `ProjectHub-dev` was regenerated from `develop@4f5ee971`.
- PR #29 released the exact qualified tree to `master` on September 5.

Recorded qualification evidence:

- Sep 5 local tests: **1019 / 1019**
- retrieval Recall@6: **1.000**
- retrieval MRR@6: **0.942**
- Phase 7/8 live qualification at `4d39995`: **94 / 132 turns**, **21 / 33 conversations**
- remaining live failures at that checkpoint: **38**, of which **14** were classified as `inference-unavailable`

The release did not convert those residuals into a perfect-score claim. They remain dated evidence and deferred failure cases.

## Engineering controls

Scout development separates product direction, implementation, independent verification, and release authority.

Review loop:

`Requirement → scoped implementation → local code/test cycle → source/deployment review → human behavior review → accept/revise → integration/release gate`

Current source of release truth is GitHub plus explicit staging/deployment provenance, not a local agent report.

---

# Engine hardening + release truth

## Phase 01 — Working Scout foundation

**Status: RELEASED FOUNDATION**

Maintain the working runtime foundations:

- RAG-first evidence path;
- local BM25 retrieval;
- contextual RRF where applicable;
- server-owned conversation state;
- response policy/contracts;
- Cloudflare-hosted generation;
- grounded post-generation validation;
- telemetry/accounting;
- explicit release/staging boundaries.

**Invariant:** later work must not silently regress the working foundation.

---

## Phase 02 — Conversation quality gate

**Status: RELEASED ITERATION / RESIDUALS REMAIN**

The August 27 site showed this as active branch work. The accepted iteration is now merged and released.

Implemented/released work includes broader generic conversation routing, follow-up/referent handling, response-contract behavior, evidence selection, open-world/negative handling, and validator/repair regressions across the Phase 7/8 stack.

The latest pre-release live checkpoint is not a full pass:

- **94/132 turns**
- **21/33 conversations**
- **14/38 failures** classified as `inference-unavailable`

Those residuals stay visible. “Released” means the accepted source iteration crossed the release gate; it does not mean the conversation suite is finished forever.

**Continuation rule:** future conversation work should keep failure categories separated, preserve tenant-neutral mechanisms, avoid benchmark-specific final prose, and turn legitimate defects into generic regressions.

---

## Phase 03 — Integrate accepted conversation work

**Status: COMPLETED FOR CURRENT ITERATION**

PR #23 merged the accepted Phase 7/8 branch into protected `develop`. Subsequent widget and release-hardening PRs also merged before the production source release.

**Current integration SHA:** `4f5ee971488e433ebdf66280cce82e163c5c7688`.

---

## Phase 04 — Staging truth + parity

**Status: COMPLETED FOR CURRENT ITERATION**

`ProjectHub-dev:main` currently records:

`STAGING-SOURCE.json → ProjectHub/develop@4f5ee971488e433ebdf66280cce82e163c5c7688`

The Sep 5 release PR records the staging ProjectHub.js artifact as byte-identical to the qualified develop source.

**Caution:** a matching source marker proves source provenance. It does not automatically prove every external browser/backend behavior forever; those are separate runtime checks.

---

## Phase 05 — Production release gate

**Status: SOURCE RELEASE COMPLETED SEP 5**

PR #29 released a master-parented commit whose Git tree exactly matches the qualified `develop@4f5ee971` tree.

- release branch commit: `2e90ed88a32b00f33d68736f08f18f98412f85a4`
- production commit: `b071e4e4f0bb69faeecd811f31514af30d2e1f61`
- released tree: `a0066cc849f33dd84d18d8e8c36b080fed8ce70e`

The earlier direct `develop → master` PR #25 was closed without merge and superseded by the tree-exact release path.

**Boundary:** Git history proves the source release. Production backend/frontend host checks remain operational evidence and should be stated separately when independently verified.

---

## Phase 06 — System truth cleanup + post-release verification

**Status: ACTIVE**

This is the current engineering-truth phase.

The goal is to make executable behavior, runtime self-knowledge, telemetry, deployment provenance, documentation, and public explanations agree.

Current concrete truth debt includes:

1. `data/scout-runtime-knowledge.json` is still `lastVerified: 2026-08-21` and contains the superseded Cloudflare neuron-rate sentence for normal `-fast`, while executable provider/accounting code correctly treats that exact-model rate as unknown.
2. Historical branch pointers remain visible after squash/merge, so raw ahead/behind counts can misrepresent whether work is actually integrated.
3. Dated conversation results need to remain labeled by commit/environment rather than displayed as timeless production quality.
4. Source release, staging provenance, dev-backend smoke, production-host deployment, and browser behavior are separate facts and should not be collapsed into one “deployed” label.
5. Runtime documentation must reflect current temperature `0`, current fallback gating, current gate-debug authorization/cache isolation, and current widget behavior.

**Exit gate:**

- current self-knowledge agrees with executable code;
- current public docs agree with released source;
- historical results are clearly dated/scoped;
- unknown never becomes zero;
- estimated never becomes actual;
- branch/release status does not confuse stale pointers with current work;
- current production host provenance can be stated without inference from Git alone.

---

# Productization boundary

Phases 01–06 operate on the current working recruiter implementation and release truth. Phases 07–12 deliberately move Scout toward a portable product.

A refactor only succeeds if Scout still works afterward.

## Phase 07 — Scout Core extraction

**Status: LATER**

Separate reusable orchestration from Bradley/recruiter-specific knowledge, identity assumptions, policies, tools, and workflows while keeping ProjectHub Recruiter Alpha on the same core.

**Exit gate:** normal specialization requires no customer-specific branches inside Scout Core.

---

## Phase 08 — General Scout / empty-knowledge mode

**Status: LATER**

Prove that Scout Core functions independently of a customer knowledge package.

Expected invariant:

`Scout Core + no domain package → General Scout`

Knowledge specializes Scout; it does not create Scout.

---

## Phase 09 — Domain package contracts

**Status: LATER**

Define stable specialization interfaces for knowledge, configuration, identity, policies, workflows, and tools/extensions.

Executable extensions require explicit schemas, permissions, timeouts, validation, side-effect classification, failure isolation, logging, and ownership boundaries.

---

## Phase 10 — Cross-domain portability proof

**Status: LATER**

Demonstrate portability with unrelated domain packages while holding Scout Core constant.

Example proof set:

- recruiter/portfolio;
- inventory/fruit store;
- IT support.

**Pass condition:** the same Scout Core SHA powers the unrelated domains; only domain packages change.

---

## Phase 11 — Extension and agent platform

**Status: LATER**

Support richer customer tools, workflows, integrations, and controlled agent-to-agent capabilities without turning Scout into an unbounded tool-calling shell.

**Exit gate:** permissioned extension lifecycle, validation, observability, safe failure behavior, and test coverage exist before broad executable-extension support is treated as shipped.

---

## Phase 12 — Commercial/operator handoff

**Status: LATER**

Make Scout installable, configurable, testable, deployable, operable, troubleshootable, and extensible by another competent developer/customer without hidden Bradley-only knowledge.

Required work includes deployment docs, ADRs, developer/agent instructions, configuration validation, security review, licensing/IP inventory, known limitations, operator runbooks, and handoff documentation.

---

## Product rule

Priority order:

1. Scout works.
2. Correctness, grounding, and reliability.
3. No silent behavioral regression.
4. Resource efficiency.
5. Core customer/domain neutrality.
6. Defined specialization boundaries.
7. Security and controlled extensions.
8. Testing/evaluation.
9. Human understandability and maintainability.
10. Repository aesthetics/cleanup.

Do not sacrifice the first four items to make later productization appear finished sooner.
