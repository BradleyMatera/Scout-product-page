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

## September 5 product-site overhaul

All six pages now own their content as static HTML. Release/accounting notes, diagrams,
roadmap, navigation, and Learn mathematics no longer require browser correction scripts.
The publication step validates pages; it does not rewrite facts.

Audited production: `b071e4e4f0bb69faeecd811f31514af30d2e1f61`.
Audited integration: `4f5ee971488e433ebdf66280cce82e163c5c7688`.
Both share tree `a0066cc849f33dd84d18d8e8c36b080fed8ce70e`.
Staging: `6d36433c040d0bbc903ec26b6968674bd937bcd0`, recording the integration SHA.
Active discourse branch: `cddb3bca1410f9cee04372e0670037244ffc8d3d`, three ahead / zero behind integration.
The third commit is a handoff; runtime implementation remains `5bd9437`.
This branch is unmerged. Its handoff reports 12 discourse tests and a dev-VM deployment,
and acknowledges unresolved thin-evidence recovery. These reported results are not independent live qualification.

See [source-state.json](./source-state.json) for the timestamped inventory of all 35 ProjectHub
and two ProjectHub-dev branches. See [SCOUT-SOURCE-AUDIT.md](./SCOUT-SOURCE-AUDIT.md) for evidence and remaining limitations.

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

Scout's released application is ProjectHub Recruiter Alpha. A customer-neutral core,
empty-knowledge operation, generalized domain packages, and commercial handoff remain roadmap work.
The pricing page describes one negotiated acquisition of the existing implementation, not an already delivered generic SDK or hosted service operation.
