# Scout Source Snapshot — 2026-08-23

This is a dated delta from the prior Scout product-site audit. It does not replace `SCOUT-SOURCE-AUDIT.md`; it records what changed after that audit and which public-site surfaces needed updating.

## Source precedence

1. current executable source/runtime configuration
2. `ProjectHub:master` for released production behavior
3. `ProjectHub:develop` for integrated but unreleased behavior
4. `ProjectHub-dev:main:STAGING-SOURCE.json` for the exact staging frontend source
5. dated gate/fix reports for the run they describe

## Branch/source state

### Production

- repository: `BradleyMatera/ProjectHub`
- branch: `master`
- source: `4a1eee70821ed83f50be1fe2ff6286abfaa4a15c`
- production remains on the Aug. 21 released line

### Integrated development

- branch: `develop`
- HEAD: `c9007ff126ccb77a23993a27a84058f542a4cc3e`
- HEAD is the v3 gate-report commit
- latest executable patch immediately below it: `e3f1a592c2968711028eb9ca3365bb95c02125fc`
- `develop` vs `master`: 53 commits ahead, 4 behind at snapshot time

### Delta from the previous product-site develop snapshot

Previous site snapshot used `2d958e28b48ff3798a501a650e544823e639f19b`.

Current `develop` is 29 commits ahead of that point. The delta touches runtime routing/contracts/validation, QA harnesses, frontend bundle state, knowledge, and new gate reports.

Source: https://github.com/BradleyMatera/ProjectHub/compare/2d958e28b48ff3798a501a650e544823e639f19b...c9007ff126ccb77a23993a27a84058f542a4cc3e

### Staging mirror

`BradleyMatera/ProjectHub-dev:main` wrapper at snapshot time:

- wrapper: `ef125fe217b3338795d027e4fd468451c646e157`
- `STAGING-SOURCE.json` source: `d1da87bdcce4b4b77b4b9008d3f156348b7c1255`

The staging frontend source is therefore behind current `develop`. Do not treat the two as identical.

Source: https://github.com/BradleyMatera/ProjectHub-dev/blob/main/STAGING-SOURCE.json

## Material integrated changes since the previous site snapshot

### Customer-neutrality cleanup

The Aug. 23 guardrail-refinement work removed several customer-specific assumptions from integrated core paths:

- hardcoded Bradley/Matera force-substantive matching removed from the RAG agent
- AWS-specific recruiter evidence filtering removed
- hardcoded customer project/AWS lists removed from tool selection
- customer project/big-tech lists removed from generic completeness classification
- customer-specific Pokedex/Entries validator exception removed
- customer project/school/military topic hints removed from session state
- most customer-specific `DIRECT_KB` bypasses removed; the retained profile-summary direct path is data-driven
- false-employer follow-up resolution made more generic by extracting unknown employer mentions from employment context

Source: https://github.com/BradleyMatera/ProjectHub/blob/develop/docs/guardrail-refinement-report.md

### New explicit intent/contract paths

Current integrated classification/contracts now include explicit handling for:

- `EXPERIENCE` / companies / employment history
- `QUALIFICATIONS`
- `FUTURE_CAPABILITY`
- stronger exhaustive-personal-data `REFUSAL`
- `META` capability boundaries for URL browsing and persistence/memory requests
- non-technical re-explanation / simple-language repair cases

`get_candidate_profile` also supports a read-only `qualifications` aggregate section.

Sources:

- https://github.com/BradleyMatera/ProjectHub/blob/develop/lib/completeness-check.js
- https://github.com/BradleyMatera/ProjectHub/blob/develop/lib/response-contract.js
- https://github.com/BradleyMatera/ProjectHub/blob/develop/lib/agent-tools.js
- https://github.com/BradleyMatera/ProjectHub/blob/develop/docs/staging-8b-fix-report-2026-08-23.md

### Validator changes

The Aug. 23 validation work includes:

- negation-aware forbidden-claim handling so an explicit refutation is less likely to be rejected merely because it repeats the forbidden phrase
- negation-aware unknown-skill handling
- expanded negative/unknown phrases in negation scope
- whole-token/phrase skill evidence matching instead of raw substring matching

The latest executable patch changes `hasEvidenceForSkill()` to use `phraseAppears()`, preventing examples such as `vibe` from being treated as verified because an unrelated chunk contains `vibes`.

Source: https://github.com/BradleyMatera/ProjectHub/commit/e3f1a592c2968711028eb9ca3365bb95c02125fc

## QA/test infrastructure changes

New or materially changed QA surfaces in this delta include:

- `playwright.config.js`
- `scripts/api-scenario-runner.js`
- `scripts/playwright-qa.spec.js`
- `scripts/trace-real-human-8b.js`
- `test-production-conversations.py`
- `test/response-contract-focus.test.js`

The Playwright harness was changed to wait for the send button and full reply completion rather than racing the widget busy state. The direct API scenario runner was added for A/B/F recruiter, false-premise, and contact/privacy scenarios.

## Gate progression on August 23

### Initial 8B gate

The first staging 8B gate exposed material failures including:

- verified company evidence not surfacing correctly
- exhaustive personal-detail privacy failure
- non-technical re-explanation routed incorrectly
- broken qualifications response
- broken web-browse/persistence capability boundary
- qualifications technical-error fallback

Release decision: NO.

Source: https://github.com/BradleyMatera/ProjectHub/blob/develop/docs/staging-8b-gate-report.md

### Fix report

After generic routing/contract/tool fixes:

- strict local API eval: 22/23 (95.7%)
- targeted baseline failures improved
- Playwright/staging/harness blockers remained
- release decision remained NO

Source: https://github.com/BradleyMatera/ProjectHub/blob/develop/docs/staging-8b-fix-report-2026-08-23.md

### Gate v2

Recorded:

- unit tests: 924/924 PASS
- Recall@6: 1.000
- MRR@6: 0.954
- build: PASS
- API scenario runner: PASS
- local API eval: 21/23 (91.3%)
- browser harness no longer blocked by the original send-button race but exposed backend content failures
- full production conversation regression: FAIL

Release decision: NO.

Source: https://github.com/BradleyMatera/ProjectHub/blob/develop/docs/staging-8B-gate-report-v2.md

### Gate v3

After targeted validator changes:

- unit tests: 924/924 PASS
- Recall@6: 1.000
- MRR@6: 0.954
- build: PASS
- local API eval: 23/23 (100%)
- focused technical-error reliability: 1/27 TECHNICAL_ERROR
- production conversation regression: 70/132 turns, 12/33 conversations PASS

The report separates remaining failures into validator/repair failures, stale transcript-harness assertions, and product-quality drift.

Release decision: **NO**. The full conversation suite is not green and no `develop → master` release should be represented as shipped.

Source: https://github.com/BradleyMatera/ProjectHub/blob/develop/docs/staging-8B-gate-report-v3.md

## Product-site updates required by this snapshot

The following were stale before this snapshot was applied:

- Overview audit date and develop-state summary
- Docs source snapshot and release gate
- Docs retrieval MRR (`0.971` historical value vs current develop measurement `0.954`)
- Docs intent/contract/tool/validation sections
- Docs QA command/result set
- Learn retrieval-evaluation example and contract/validation teaching examples
- API semantic behavior notes behind `/api/chat`
- Changelog current `develop` SHA and `master...develop` divergence
- Changelog missing Aug. 23 gate/fix progression

The site now centralizes these facts in `freshness.js` so the next dated audit can update one snapshot layer instead of duplicating current-state values across every page.

## No new production claim

Nothing in this snapshot changes the released-production source line. The integrated work described here remains `develop` behavior until a release is actually promoted to `master` and verified.
