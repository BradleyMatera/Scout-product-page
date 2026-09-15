# Scout release notes — September 15, 2026

## Release identity

- Production source: `7d01170830949a0ef85da58bab6a0a2b266b0e9c`
- Integration source: `e74ac22b5a4c9f39b578191e7e673a0fa16b2e80`
- Shared tree: `92b4d14960a6e34a51691a6692f0ecc7ac514f52`
- Staging mirror: `201beb9cf220e2b12a7fbf8469e2f8e209488d95`
- Qualified feature runtime: `654d25e625b15c3fb043e442fcfcfb813bf71aa9`
- PR #31 merge: `e74ac22b5a4c9f39b578191e7e673a0fa16b2e80`
- PR #32 merge: `7d01170830949a0ef85da58bab6a0a2b266b0e9c`

## Shipped architecture milestone

This release moves Scout materially beyond the September 5 state without changing its basic product identity. Recruiter Alpha remains the reference application, while the same released Core now has stronger tenant-neutral identity, semantic planning, relationship/property grounding, answer-completeness semantics, empty-KB behavior, and cross-domain regression coverage.

Normal visible responses remain model-generated. Deterministic systems resolve, retrieve, calculate, plan, validate, reject, and initiate bounded recovery; they do not become a second prose author.

## Verification

- Deterministic tests: **1452/1452**
- Retrieval Recall@6: **1.000**
- Dated DEV live gate: **100/132 turns · 20/33 conversations**
- Feature CI: **34922407613**
- Develop merge-result CI: **34925217993**
- Production GitHub Pages run 34925715817 completed with conclusion success on 7d011708.
- Production backend health was independently reachable during this refresh.

## Productization impact

Phase 07 Core neutrality is now a substantially complete foundation rather than purely future work. Phase 08 empty/general operation exists as a released runtime capability, although General Scout still needs product packaging. Phase 09 formal domain-package contracts is the next major productization feature. Phase 10 has synthetic portability proof but still needs runnable unrelated packages. Phase 11 controlled extensions/actions and Phase 12 operator/commercial handoff remain planned.

## Commercial boundary

The commercial model remains a one-time negotiated software/IP acquisition. This release does not create hosted monthly tiers, a public multi-tenant API service, or indefinite support obligations.
