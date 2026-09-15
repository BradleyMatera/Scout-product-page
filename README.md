# Scout Product Site

Public customer-facing and implementation-reference site for **Scout**, a reusable conversational runtime. **ProjectHub Recruiter Alpha** is the current reference application.

## Primary site

- Overview: https://bradleymatera.dev/scout/
- Docs: https://bradleymatera.dev/scout/docs.html
- Learn Scout: https://bradleymatera.dev/scout/learn.html
- API: https://bradleymatera.dev/scout/api.html
- Changelog: https://bradleymatera.dev/scout/changelog.html
- Pricing: https://bradleymatera.dev/scout/pricing.html

A GitHub Pages mirror is also deployed from this repository.

## September 15 release refresh

Scout's semantic-reliability and tenant-portability work has now crossed the full source-release path.

- Production source: `7d01170830949a0ef85da58bab6a0a2b266b0e9c`
- Protected integration: `e74ac22b5a4c9f39b578191e7e673a0fa16b2e80`
- Shared release tree: `92b4d14960a6e34a51691a6692f0ecc7ac514f52`
- Staging mirror: `201beb9cf220e2b12a7fbf8469e2f8e209488d95`, sourced from integration `e74ac22b5a4c9f39b578191e7e673a0fa16b2e80`
- PR #31: merged into `develop` as `e74ac22b5a4c9f39b578191e7e673a0fa16b2e80`
- PR #32: exact-tree release merged into `master` as `7d01170830949a0ef85da58bab6a0a2b266b0e9c`
- Qualified feature runtime: `654d25e625b15c3fb043e442fcfcfb813bf71aa9`
- Deterministic verification: **1452/1452** tests; retrieval Recall@6 **1.000**
- Dated live qualification: **100/132 turns · 20/33 conversations** on DEV, zero 429s in the recorded run
- Production GitHub Pages run 34925715817 completed with conclusion success on 7d011708.
- Production backend health was independently reachable during this refresh.

The released tree now includes structured semantic query planning, canonical entity/subject identity precedence, server-owned discourse state, proposition-scoped relationship validation, answer obligations/completeness checks, empty-knowledge support, and tenant-neutral portability regressions. ProjectHub Recruiter Alpha remains the reference application, but Scout Core is no longer accurately described as recruiter-only.

Formal domain-package contracts, runnable unrelated domain packages, a permissioned action/tool platform, and commercial/operator handoff remain forward productization work.

## Local verification and publication

```sh
node scripts/prepare-site.js
python3 scripts/verify-site.py
node --check site.js
node --check docs.js
git diff --check
```

The offline gate checks all six pages, internal paths/anchors, asset references,
unique IDs, global navigation, and critical accounting claims. GitHub Pages runs
these checks before publishing `main`. A successful Pages deployment does not prove
that the separate Gatsby/Netlify `/scout/` sync has run.

## Maintenance rules

- Edit page HTML directly. Do not introduce a browser script to conceal stale content.
- Verify current source branches and dates before updating claims. Pin implementation links to the audited SHA.
- Distinguish executable behavior, reported test results, independently rerun checks, development work, and planned capabilities.
- Update `source-state.json` and this audit whenever refreshing release/branch status.
- Keep the pricing page aligned with the actual commercial offer. It currently describes one negotiated Scout software/IP acquisition, not hosted service tiers.
- Check the actual publication job for the final commit; do not equate a push with deployment.
- Never modify Scout runtime repositories as part of a product-site sync.

Compatibility markers (`freshness.js`, `snapshot-refresh.js`, `accounting-correction.js`,
`roadmap-current.js`, `roadmap-copy.js`, `docs-graphics.js`, `learn-resources.js`, and `learn.js`)
remain for external sync consumers. They intentionally do nothing and are not loaded by the pages.
`site.js` and `docs.js` only implement interactions. `launch.css` includes the roadmap styling and improves navigation, responsive reading, and accessibility. Keeping styles in this existing synced asset preserves compatibility with the primary-domain publication pipeline.

## Current hosted generation and accounting

Model: `@cf/meta/llama-3.1-8b-instruct-fast`. Provider default temperature: `0`; top-p: `0.9`.
The exact model has no verified token-to-neuron rate in the checked Cloudflare pricing table.
Provider-reported usage is retained when supplied; missing actual usage and missing exact-model
pricing mean unknown, not zero. A partially known session total remains incomplete.

The distinct `@cf/meta/llama-3.1-8b-instruct-fp8-fast` has published rates of 4,119 input
and 34,868 output neurons per million tokens. `@cf/meta/llama-3.1-8b-instruct-fp8` has
13,778 / 26,128. The 5.5463-neuron / 1,803-request worked example in Learn applies only
to FP8-fast and is not Scout's current capacity.

Cloudflare's 10,000-neuron daily allocation, 00:00 UTC reset, and Workers Paid
$0.011 per 1,000 neurons above allocation were checked against
[official pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/).
The [exact model page](https://developers.cloudflare.com/workers-ai/models/llama-3.1-8b-instruct-fast/)
is separate. Provider facts can change independently of Scout.

## Source precedence

Use executable code and configuration for implementation facts, immutable Git revisions
for source/release state, official provider documentation for external pricing, and dated
reports for historical results. The runtime self-knowledge JSON still contains a superseded
neuron-rate statement; do not copy that claim back into these pages.

Scout's released reference application is ProjectHub Recruiter Alpha. The released runtime now contains tenant-neutral Core behavior and empty-knowledge operation; formal domain-package contracts, packaged cross-domain applications, the extension/action platform, and operator handoff remain roadmap work.
The pricing page still describes one negotiated acquisition of the existing implementation, not a hosted SaaS tier or an already delivered self-service SDK.
