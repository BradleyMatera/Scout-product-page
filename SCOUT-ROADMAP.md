# Scout Roadmap

Last refreshed: August 27, 2026

This roadmap describes the actual engineering path for Scout. It separates released production, integrated development, active feature/fix work, staging, and future productization. A green unit-test count by itself is not a release gate.

## How Scout is being engineered

Scout is currently built through a three-part engineering loop:

1. **Bradley Matera — product owner and final decision-maker**
   - defines product direction, architecture requirements, behavior goals, constraints, and acceptance criteria;
   - performs human QA and decides whether behavior is actually useful and correct;
   - decides what is allowed to move into integration or production.

2. **ChatGPT — research, planning, and independent verification**
   - inspects GitHub source, branch state, tests, reports, deployment markers, and external documentation where necessary;
   - reasons with Bradley about architecture and product direction;
   - turns the agreed goal into a scoped implementation prompt for Devin;
   - reviews Devin's report against the actual repository rather than accepting the report as proof;
   - identifies contradictions, stale documentation, misleading tests, deployment drift, and regressions before the next step is chosen.

3. **Devin in Windsurf on Bradley's PC — local implementation environment**
   - works in the real local repository/workspace;
   - edits code, runs tests/evaluations, deploys development/staging when instructed, commits work, and reports the result;
   - does not independently authorize integration or production release.

The working loop is:

`Bradley goal/problem -> Bradley + ChatGPT analysis -> repository/source verification -> ChatGPT implementation prompt -> Devin/Windsurf implementation + tests -> Devin report -> ChatGPT independent verification -> Bradley + ChatGPT accept/reject/revise -> repeat`

**Engineering rule:** no agent completion report is treated as proof. Repository state, test evidence, deployed behavior, and human evaluation are checked independently before work advances to the next gate.

## Current source state

As of this roadmap refresh:

- **Production:** `ProjectHub:master` at `4a1eee70821ed83f50be1fe2ff6286abfaa4a15c`.
- **Integration:** `ProjectHub:develop` at `2c140ba747d09cd51d9fcd48f350b66dc6683efc`.
- **Active conversation branch:** `fix/phase7-8-conversation-gate` at `76e7df556c6e8a12a19cbdd650eae8c9a5237aa1`, 14 commits ahead of `develop` and 0 behind at the time of verification.
- **Staging mirror marker:** `ProjectHub-dev:main` records source commit `d1da87bdcce4b4b77b4b9008d3f156348b7c1255`; current `develop` is 16 commits ahead of that marker.

The active conversation branch is not production and is not yet integrated into `develop`.

## Roadmap

### Phase 01 — Working Scout foundation

**Status:** Built / released foundation

**Goal:** Maintain the proven system foundations that already exist: RAG-first retrieval, generation, validation, server conversation state, provider abstraction, runtime telemetry, and release boundaries.

**Exit condition:** already established; later work must not silently regress this foundation.

---

### Phase 02 — Conversation quality gate

**Status:** ACTIVE

**Goal:** Make Scout reliable in real multi-turn conversation before adding broad new product capabilities.

Current focus includes:

- intent and sub-intent classification;
- response contracts and TRUE/FALSE/UNKNOWN semantics;
- follow-up and referent resolution;
- entity/project/employer/technology relationship grounding;
- negative/open-world claim handling;
- natural answer quality without deterministic benchmark-cheating prose;
- validation/repair behavior that does not reject good grounded answers or accept invalid ones;
- reproducible model behavior where useful for diagnosis;
- human-style conversation suites in addition to unit tests.

The latest local Devin/Windsurf work reported a materially improved but still incomplete conversation gate: 962/962 unit tests passed while the broader human-style conversation suite remained well below a release-quality target. That mismatch is itself part of the gate: unit tests are necessary, not sufficient.

**Exit gate:**

- complete the full 132-turn conversation suite without hiding failures behind retries;
- separate true product failures from stale/brittle harness assertions;
- manually inspect visible answers, not only scorer labels;
- do not weaken grounding, privacy, safety, or open-world semantics to raise the score;
- distinguish model/provider/technical failures from deterministic harness failures;
- convert legitimate human failures into generic regressions;
- Bradley explicitly accepts the conversational behavior before integration.

---

### Phase 03 — Integrate accepted conversation work

**Status:** NEXT

**Goal:** Move only accepted Phase 7/8 conversation improvements from the active branch into `develop`.

**Exit gate:**

- branch diff reviewed against `develop`;
- unit/regression suites pass;
- human conversation failures are understood;
- no safety or grounding rules were weakened merely to improve a benchmark;
- no unrelated production work is bundled into the integration;
- resulting `develop` SHA is recorded and verified remotely.

---

### Phase 04 — Staging truth and parity

**Status:** NEXT

**Goal:** Make `ProjectHub-dev` an accurate generated representation of accepted `develop` again.

The current staging source marker is behind current `develop`, so staging must not be described as if it automatically represents the newest integration state.

**Exit gate:**

- `STAGING-SOURCE.json` records the accepted `develop` SHA;
- generated `ProjectHub.js` and frontend assets are rebuilt from source;
- dev backend revision matches the intended source;
- browser QA verifies the actual deployed staging build;
- telemetry shown to the user matches backend semantics, including actual vs estimated vs unknown neuron usage;
- staging analytics/runtime state remain separated from production.

---

### Phase 05 — Production release gate

**Status:** NEXT

**Goal:** Promote a proven integration state to production without treating `develop` or staging success as automatic production authorization.

**Exit gate:**

- explicit Bradley release approval;
- coordinated frontend/backend release plan;
- production branch update through the release process;
- production smoke tests and conversational checks;
- runtime/source SHA verified after deployment;
- no assumption that fixing one isolated bug makes the whole product release-ready.

---

### Phase 06 — System truth cleanup

**Status:** NEXT

**Goal:** Make Scout's code, telemetry, runtime facts, staging markers, documentation, and public product explanation agree with one another before the major portability refactor.

Known classes of truth debt include:

- stale model/accounting explanations surviving after accounting code changed;
- older docs that describe previous provider or branch behavior;
- browser fallback behavior that does not perfectly match server-side prose-source descriptions;
- staging snapshots that lag integration;
- historical reports that can look current when their date/scope is not obvious.

**Exit gate:**

- current executable behavior and current docs agree;
- stale facts are corrected or explicitly labeled historical;
- public telemetry never converts unknown into zero or estimate into actual;
- source precedence is documented and consistently followed.

---

## Productization boundary

Phases 01–06 are primarily **engine hardening and release truth**. The work below is the deliberate transition from the current recruiter implementation toward a portable Scout product.

A refactor is only successful if Scout still works afterward.

---

### Phase 07 — Scout Core extraction

**Status:** LATER

**Goal:** Separate the reusable Scout engine from Bradley/recruiter-specific knowledge, identity assumptions, tools, policies, and workflows without creating a second divergent rewrite.

**Exit gate:**

- current ProjectHub Recruiter Alpha still runs on the same Scout Core;
- recruiter-specific behavior can be identified outside core orchestration boundaries;
- provider/model choice remains an interchangeable layer;
- no customer-specific if-statements are required inside Scout Core for normal specialization.

---

### Phase 08 — General Scout / empty-knowledge mode

**Status:** LATER

**Goal:** Prove that Scout Core exists independently of a customer knowledge base.

Expected invariant:

`Scout Core + no domain package -> General Scout`

Knowledge specializes Scout; it does not create Scout.

**Exit gate:**

- empty/no-KB operation is intentional, supported, and tested;
- core conversation/runtime behavior remains functional;
- installing and removing a domain package does not require core edits.

---

### Phase 09 — Domain package contracts

**Status:** LATER

**Goal:** Define stable specialization interfaces for:

- knowledge;
- configuration;
- identity;
- policies;
- workflows;
- tools/extensions.

Extensions that can execute code need explicit schemas, permissions, timeouts, validation, side-effect classification, failure isolation, logging, and ownership boundaries.

**Exit gate:** a new domain can specialize Scout through defined package contracts rather than edits scattered through Scout Core.

---

### Phase 10 — Cross-domain portability proof

**Status:** LATER

**Goal:** Demonstrate that portability is real, not a claim in documentation.

Example proof set:

- recruiter/portfolio domain;
- unrelated inventory or fruit-store domain;
- IT support domain.

**Pass condition:** the same Scout Core SHA powers all test domains; only the domain packages change. If Scout Core must be modified merely to make an unrelated domain work, the portability test failed.

---

### Phase 11 — Extension and agent platform

**Status:** LATER

**Goal:** Allow richer customer tools, workflows, integrations, and agent-to-agent capabilities without turning Scout into an unsafe tool-calling shell.

Potential tools may include inventory systems, internal documents, invoices, test systems, communication/scheduling systems, or another agent. Core orchestration should consume a generic controlled tool contract rather than know every future customer tool.

**Exit gate:** permissioned extension lifecycle, validation, observability, safe failure behavior, and test coverage exist before broad executable extension support is called a product capability.

---

### Phase 12 — Commercial/operator handoff

**Status:** LATER

**Goal:** Make Scout understandable and operable by another competent developer/customer without hidden Bradley-only knowledge.

**Exit gate:** another competent developer can receive the repository and documentation, install it, configure a domain, test it, deploy it, operate it, troubleshoot it, and extend it without Bradley being present.

Required work includes deployment docs, ADRs, root agent/developer instructions, configuration validation, security review, licensing/IP inventory, known limitations, operator runbooks, and buyer/handoff documentation.

## Product rule

Scout is not being optimized for the appearance of progress. The order is:

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

Do not sacrifice the first four items to make the later items look finished sooner.
