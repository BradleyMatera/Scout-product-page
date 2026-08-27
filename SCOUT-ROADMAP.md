# Scout Roadmap

Last refreshed: August 27, 2026

This roadmap describes Scout's engineering path. It separates released production, integrated development, active branch work, staging, system-truth cleanup, and later Scout Core portability work. Passing unit tests is evidence, not a release decision.

## Engineering controls

Scout development separates product direction, implementation, verification, and release authority.

- **Product direction + acceptance — Bradley Matera:** product goals, architecture requirements, behavior constraints, human conversation evaluation, and authorization for integration or production release.
- **Implementation workspace — local repository + Devin/Windsurf:** scoped source changes, tests, evaluation harnesses, development deployments, and commits.
- **Research + independent verification — GitHub + ChatGPT review:** repository/branch/deployment inspection, architecture and failure analysis, implementation planning, and verification of reported results against source state.

Review loop:

`Requirement -> scoped implementation -> local code/test cycle -> independent source/deployment review -> human behavior review -> accept/revise -> integration or release gate`

**Evidence gate:** no completion report, test count, or model output advances code on its own. Source state, test evidence, deployed behavior, and human evaluation are checked before integration or release.

## Current source state

- **Production:** `ProjectHub:master` at `4a1eee70821ed83f50be1fe2ff6286abfaa4a15c`.
- **Integration:** `ProjectHub:develop` at `2c140ba747d09cd51d9fcd48f350b66dc6683efc`.
- **Active conversation branch:** `fix/phase7-8-conversation-gate` at `dfe13851df4e1f8542e8c69ed6b903136261f960`, 17 commits ahead of `develop` and 0 behind at verification.
- **Development backend evaluation revision:** `dfe13851df4e1f8542e8c69ed6b903136261f960`.
- **Staging mirror marker:** `ProjectHub-dev:main` records source commit `d1da87bdcce4b4b77b4b9008d3f156348b7c1255`; `develop` is 16 commits ahead of that marker.

The active conversation branch is not integrated into `develop` and is not production.

## Phase 02 gate record

The conversation gate uses a conservative evidence-term matcher that accepts explicit inflections without arbitrary prefix matches. Examples such as `blog -> blogs`, `debug -> debugging`, and `learn -> learning` are supported, while unrelated prefixes such as `js -> json`, `git -> github`, `react -> reactive`, `go -> google`, and `sql -> sqlite` are rejected.

Recorded evaluation state at `dfe1385`:

- harness term regressions: **26 / 26**;
- unit tests: **964 / 964**;
- saved pre-fix baseline rescored with the corrected gate: **86 / 132 turns, 18 / 33 conversations**;
- saved post-fix run rescored with the same gate: **92 / 132 turns, 19 / 33 conversations**;
- apples-to-apples change: **+6 turns, +1 conversation**;
- clean live gate: **93 / 132 turns, 19 / 33 conversations**;
- clean live failure breakdown: **27 generation failures, 12 provider failures**;
- provider failures remain separate from answer-quality failures and do not erase the original scheduled outcomes.

The gate is usable for continued diagnosis, but Phase 02 remains active. The next product failure group is non-tech experience and negative-assessment routing/evidence use. Current examples include failure to surface verified non-tech experience, documented learning gaps, and the correct prior-turn referent.

## Roadmap

### Phase 01 — Working Scout foundation

**Status:** BUILT / RELEASED FOUNDATION

Maintain the RAG-first retrieval, model generation, grounding/relationship validation, server conversation state, provider abstraction, telemetry, and release boundaries already in the system.

**Invariant:** later work must not silently regress the working foundation.

---

### Phase 02 — Conversation quality gate

**Status:** ACTIVE

Make Scout reliable in real multi-turn conversation before broad productization work.

Current focus:

- intent and sub-intent classification;
- response contracts and TRUE/FALSE/UNKNOWN semantics;
- follow-up and referent resolution;
- relationship grounding;
- negative/open-world claim handling;
- retrieval and evidence selection for the requested topic;
- model compliance with grounded response contracts;
- validator/repair behavior;
- natural answer quality;
- separation of provider failures from product failures;
- human-style conversation suites in addition to unit tests.

**Current root-cause group:** non-tech experience and negative-assessment questions. Scout must surface verified experience and documented learning gaps instead of falling into generic `no verified evidence` boilerplate when relevant evidence exists.

**Exit gate:**

- full 132-turn conversation suite completed without hiding scheduled failures behind retries;
- product, harness, and provider failures separated;
- visible replies manually reviewed;
- no benchmark-specific deterministic prose;
- no weakening of grounding, privacy, safety, or open-world semantics merely to improve a score;
- legitimate failures converted into generic regressions;
- Bradley accepts the conversational behavior before integration.

---

### Phase 03 — Integrate accepted conversation work

**Status:** NEXT

Move only accepted Phase 02 work from the active branch into protected `develop`.

**Exit gate:** branch diff reviewed, deterministic suites pass, conversation failures are understood, no safety/grounding weakening is hidden in the diff, and the resulting remote `develop` SHA is verified.

---

### Phase 04 — Staging truth + parity

**Status:** NEXT

Regenerate `ProjectHub-dev` from the accepted integration state so staging accurately represents `develop`.

**Exit gate:** `STAGING-SOURCE.json` matches the accepted `develop` SHA, generated assets match source, frontend/backend revisions align, browser QA passes, and telemetry semantics are correct.

---

### Phase 05 — Production release gate

**Status:** NEXT

Promote a proven integration state through the explicit production authorization boundary.

**Exit gate:** Bradley release approval, coordinated frontend/backend release, production source/runtime revision verification, and production smoke/conversation checks.

---

### Phase 06 — System truth cleanup

**Status:** NEXT

Make executable behavior, telemetry, runtime facts, staging markers, documentation, and public product explanations agree before the major portability refactor.

Known truth-debt classes include stale provider/accounting descriptions, stale branch/runtime documentation, browser/server prose-source mismatches, and historical reports that can appear current without clear scope.

**Exit gate:** current executable behavior and current documentation agree; historical facts are labeled; unknown is never represented as zero; estimates are never represented as actuals.

---

## Productization boundary

Phases 01–06 are engine hardening and release truth. Phases 07–12 are the deliberate transition from ProjectHub Recruiter Alpha toward a portable Scout product.

A refactor only succeeds if Scout still works afterward.

### Phase 07 — Scout Core extraction

**Status:** LATER

Separate reusable orchestration from Bradley/recruiter-specific knowledge, identity assumptions, policies, tools, and workflows while keeping ProjectHub Recruiter Alpha on the same core.

**Exit gate:** normal specialization requires no customer-specific branches inside Scout Core.

---

### Phase 08 — General Scout / empty-knowledge mode

**Status:** LATER

Prove that Scout Core functions independently of a customer knowledge package.

Expected invariant:

`Scout Core + no domain package -> General Scout`

Knowledge specializes Scout; it does not create Scout.

---

### Phase 09 — Domain package contracts

**Status:** LATER

Define stable specialization interfaces for knowledge, configuration, identity, policies, workflows, and tools/extensions.

Executable extensions require explicit schemas, permissions, timeouts, validation, side-effect classification, failure isolation, logging, and ownership boundaries.

---

### Phase 10 — Cross-domain portability proof

**Status:** LATER

Demonstrate portability with unrelated domain packages while holding Scout Core constant.

Example proof set:

- recruiter/portfolio;
- inventory or fruit store;
- IT support.

**Pass condition:** the same Scout Core SHA powers the test domains; only domain packages change.

---

### Phase 11 — Extension and agent platform

**Status:** LATER

Support richer customer tools, workflows, integrations, and controlled agent-to-agent capabilities without turning Scout into an unbounded tool-calling shell.

**Exit gate:** permissioned extension lifecycle, validation, observability, safe failure behavior, and test coverage exist before broad executable-extension support is treated as a product capability.

---

### Phase 12 — Commercial/operator handoff

**Status:** LATER

Make Scout installable, configurable, testable, deployable, operable, troubleshootable, and extensible by another competent developer/customer without hidden Bradley-only knowledge.

Required work includes deployment documentation, ADRs, developer/agent instructions, configuration validation, security review, licensing/IP inventory, known limitations, operator runbooks, and handoff documentation.

## Product rule

Priority order:

1. Scout actually works.
2. Correctness, grounding, and reliability.
3. No silent behavioral regression.
4. Resource efficiency.
5. Core customer/domain neutrality.
6. Defined specialization boundaries.
7. Security and controlled extensions.
8. Testing/evaluation.
9. Human understandability and maintainability.
10. Repository aesthetics and cleanup.

Do not sacrifice the first four items to make later productization work appear finished sooner.
