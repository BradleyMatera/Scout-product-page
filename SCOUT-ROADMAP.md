# Scout Roadmap

Last refreshed: **September 15, 2026**

This roadmap describes Scout's engineering path from the released ProjectHub Recruiter Alpha reference application toward a portable product. It separates shipped runtime behavior, integration/release truth, productization milestones, and later extension/operator work.

Passing tests is evidence. A deployment marker is evidence. A branch name is evidence. None of those alone is a universal quality claim.

## Current source state

- **Production source:** `ProjectHub:master@7d01170830949a0ef85da58bab6a0a2b266b0e9c`
- **Integration source:** `ProjectHub:develop@e74ac22b5a4c9f39b578191e7e673a0fa16b2e80`
- **Production + integration Git tree:** `92b4d14960a6e34a51691a6692f0ecc7ac514f52`
- **Staging mirror:** `ProjectHub-dev:main@201beb9cf220e2b12a7fbf8469e2f8e209488d95` sourced from `develop@e74ac22b5a4c9f39b578191e7e673a0fa16b2e80`
- **Qualified pre-integration runtime:** `654d25e625b15c3fb043e442fcfcfb813bf71aa9`
- **Production Pages:** Production GitHub Pages run 34925715817 completed with conclusion success on 7d011708.
- **Provider/model:** Cloudflare Workers AI · `@cf/meta/llama-3.1-8b-instruct-fast`
- **Scout request deadline:** 15,000 ms

PR #31 merged the semantic-reliability and tenant-portability line into protected `develop`. PR #32 then promoted the exact qualified develop tree to `master` while preserving production ancestry. The current production and integration commits have different ancestry but the same tree, so tree parity is the release invariant.

## September 15 release record

The release includes:

- canonical subject/entity identity precedence shared across planning, extraction, relationship support, grounding, and semantic-plan equivalence;
- structured per-turn semantic query plans instead of bag-of-words history contamination;
- server-owned discourse/context state with explicit current-target semantics;
- weighted retrieval legs with provenance;
- proposition-scoped entity/relationship/property validation;
- answer obligations and false-unknown/enumeration completeness checks;
- generative freedom for UNKNOWN/future-capability answers without exact sentence templates;
- empty-knowledge and synthetic cross-domain portability coverage;
- reproducible browser QA dependencies and clean-install verification.

Recorded qualification for the frozen feature runtime `654d25e625b15c3fb043e442fcfcfb813bf71aa9`:

- **1452/1452** deterministic tests;
- retrieval Recall@6 **1.000**;
- dated DEV conversation gate **100/132 turns · 20/33 conversations** with zero 429s;
- exact-SHA feature CI and develop-merge CI both green.

The conversation score is historical evidence for that runtime/model/scorer combination, not a timeless product-quality percentage.

---

# Foundation and release truth

## Phase 01 — Working Scout foundation

**Status: RELEASED FOUNDATION**

Scout has a working runtime foundation: retrieval, server-owned state, semantic contracts, hosted generation, post-generation validation, telemetry/accounting, and explicit development/staging/production boundaries.

**Invariant:** later productization must not silently regress the working foundation.

## Phase 02 — Conversation quality

**Status: RELEASED MAJOR MILESTONE; ONGOING NORMAL MAINTENANCE**

The September 15 release integrates the long-running semantic-reliability work: structured discourse, referent handling, requested facets, canonical identity, open-world UNKNOWN behavior, evidence selection, answer obligations, validation, and bounded repair.

This phase is no longer the whole future of Scout. Future conversation work should be defect-driven rather than endless benchmark tuning.

## Phase 03 — Integrate accepted conversation work

**Status: COMPLETED FOR THE SEPTEMBER 15 RELEASE**

PR #31 merged the accepted feature line into protected `develop` as `e74ac22b5a4c9f39b578191e7e673a0fa16b2e80`.

## Phase 04 — Staging truth + parity

**Status: COMPLETED FOR THE SEPTEMBER 15 RELEASE**

`ProjectHub-dev:main@201beb9cf220e2b12a7fbf8469e2f8e209488d95` records the new integration source `e74ac22b5a4c9f39b578191e7e673a0fa16b2e80`. Staging provenance and the qualified develop tree are aligned.

## Phase 05 — Production release gate

**Status: SOURCE RELEASE COMPLETED SEPTEMBER 15, 2026**

PR #32 promoted the exact qualified develop tree to `master@7d01170830949a0ef85da58bab6a0a2b266b0e9c`. Production and integration share tree `92b4d14960a6e34a51691a6692f0ecc7ac514f52`.

Source release, backend deployment health, Pages publication, and browser behavior remain separate operational facts. Production GitHub Pages run 34925715817 completed with conclusion success on 7d011708. Production backend health was independently reachable during this refresh.

## Phase 06 — System truth cleanup + post-release verification

**Status: ACTIVE RELEASE-CLOSURE WORK**

Keep executable behavior, runtime self-knowledge, telemetry, deployment provenance, public documentation, and product explanations synchronized. This product-site refresh is part of that work.

Exit conditions include:

- current docs agree with shipped source;
- historical results stay dated and scoped;
- unknown usage never becomes zero;
- estimated usage never becomes actual;
- staging/source/deployment/browser claims remain distinguishable;
- public product scope does not lag multiple releases behind the runtime.

---

# Productization boundary

A refactor only succeeds if Scout still works afterward. Recruiter Alpha remains a real configuration of the same Core, not a discarded prototype beside a second rewrite.

## Phase 07 — Scout Core extraction

**Status: SUBSTANTIALLY COMPLETE FOUNDATION; FORMAL PACKAGE BOUNDARY REMAINS**

The released runtime has removed broad Bradley/recruiter assumptions from Core paths and now uses tenant-neutral identity, entity, relationship, property, discourse, and validation logic. Recruiter Alpha continues to run on that same Core.

Remaining product work is less about rewriting intelligence and more about formalizing stable specialization interfaces around the working Core.

**Exit gate:** normal specialization requires no customer-specific Core branch and package boundaries are explicit/documented.

## Phase 08 — General Scout / empty-knowledge mode

**Status: RELEASED RUNTIME CAPABILITY; PRODUCT MODE STILL NEEDS PACKAGING**

Empty/no-KB operation is covered by the released runtime and portability regressions. Scout can remain conversational and fail tenant-fact questions safely without assuming Bradley/recruiting.

The next step is to make General Scout a first-class documented runtime mode rather than only a supported configuration/test condition.

## Phase 09 — Domain package contracts

**Status: NEXT MAJOR PRODUCTIZATION FEATURE**

Define stable specialization interfaces for:

- identity and aliases;
- structured knowledge/entities/relationships;
- application/runtime configuration;
- scope and answer policy;
- workflows;
- tools/capabilities;
- permissions/confirmation metadata;
- optional presentation metadata.

Packages must validate cleanly and must not patch Core code.

## Phase 10 — Cross-domain portability proof

**Status: PARTIAL PROOF IN REGRESSIONS; RUNNABLE PRODUCT PACKAGES NOT YET SHIPPED**

The test suite now exercises unrelated synthetic tenants, empty-KB behavior, products/services, research-like entities, and local-business-style properties. That is meaningful Core evidence, but it is not the same as shipping runnable domain packages.

The next proof should run the same Core SHA with multiple real package fixtures such as recruiter/professional, local service business, product/inventory, research/academic, and General Scout.

## Phase 11 — Extension and agent platform

**Status: PLANNED AFTER PACKAGE CONTRACT FOUNDATION**

Build a controlled capability/action layer rather than an unbounded model tool shell.

Target concepts include:

- ToolRegistry / CapabilityDescriptor;
- schema-validated arguments/results;
- read-only vs side-effect classification;
- permission and confirmation policy;
- execution timeouts;
- result provenance;
- action audit;
- workflow state.

Existing arithmetic is a good first capability to move behind the generic abstraction. Later SEO, CRM, messaging, scheduling, and follow-up workflows should share this substrate.

## Phase 12 — Commercial/operator handoff

**Status: PLANNED**

Make Scout installable, configurable, testable, deployable, troubleshootable, extensible, and operable by another competent technical team without hidden Bradley-only knowledge.

Required work includes deployment docs, package authoring docs, ADRs, security/permission documentation, licensing/IP inventory, known limitations, operator runbooks, upgrade procedures, and bounded handoff materials.

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

Do not sacrifice the first four items to make later productization appear finished sooner. Also do not remain forever in benchmark micro-tuning once the architecture is structurally sound; move forward through the productization phases.
