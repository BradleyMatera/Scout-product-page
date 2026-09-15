#!/usr/bin/env python3
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from datetime import datetime, timezone
import json, os, re

ROOT = Path(__file__).resolve().parent.parent
TOKEN = os.environ.get('GITHUB_TOKEN', '')
API = 'https://api.github.com'
PROJ = 'BradleyMatera/ProjectHub'
STAGING_REPO = 'BradleyMatera/ProjectHub-dev'
PRODUCT_REPO = 'BradleyMatera/Scout-product-page'
MODEL = '@cf/meta/llama-3.1-8b-instruct-fast'
QUALIFIED_RUNTIME = '654d25e625b15c3fb043e442fcfcfb813bf71aa9'
QUALIFIED_TESTS = '1452/1452'
QUALIFIED_RECALL = '1.000'
QUALIFIED_GATE = '100/132 turns · 20/33 conversations'
QUALIFIED_CI = '34922407613'
DEVELOP_CI = '34925217993'


def gh(path):
    req = Request(API + path, headers={
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'scout-product-refresh',
        **({'Authorization': f'Bearer {TOKEN}'} if TOKEN else {}),
    })
    with urlopen(req, timeout=20) as r:
        return json.loads(r.read().decode())


def probe(url):
    try:
        req = Request(url, headers={'User-Agent': 'scout-product-refresh'})
        with urlopen(req, timeout=12) as r:
            body = r.read().decode()
            data = json.loads(body)
            return {'ok': True, 'status': r.status, 'data': data}
    except Exception as exc:
        return {'ok': False, 'error': f'{type(exc).__name__}: {exc}'}


def branch(repo, name):
    return gh(f'/repos/{repo}/branches/{name}')


def all_branch_records(repo):
    rows = gh(f'/repos/{repo}/branches?per_page=100')
    out = []
    for row in rows:
        sha = row['commit']['sha']
        c = gh(f'/repos/{repo}/commits/{sha}')
        commit = c.get('commit', {})
        date = (commit.get('committer') or {}).get('date') or (commit.get('author') or {}).get('date')
        subject = (commit.get('message') or '').splitlines()[0]
        out.append({'name': row['name'], 'sha': sha, 'date': date, 'subject': subject})
    return sorted(out, key=lambda x: x['name'].lower())


def text(path):
    return (ROOT / path).read_text()


def write(path, value):
    (ROOT / path).write_text(value)


def replace_once(s, old, new, label):
    if old not in s:
        raise RuntimeError(f'missing replacement anchor: {label}')
    return s.replace(old, new, 1)


def sub_once(s, pattern, repl, label, flags=re.S):
    out, n = re.subn(pattern, repl, s, count=1, flags=flags)
    if n != 1:
        raise RuntimeError(f'expected one match for {label}, found {n}')
    return out


# ---------------------------------------------------------------------------
# Fresh release truth
# ---------------------------------------------------------------------------
product_main = branch(PRODUCT_REPO, 'main')
develop = branch(PROJ, 'develop')
master = branch(PROJ, 'master')
staging = branch(STAGING_REPO, 'main')
pr31 = gh(f'/repos/{PROJ}/pulls/31')
pr32 = gh(f'/repos/{PROJ}/pulls/32')
prod_sha = master['commit']['sha']
dev_sha = develop['commit']['sha']
staging_sha = staging['commit']['sha']
prod_tree = master['commit']['commit']['tree']['sha']
dev_tree = develop['commit']['commit']['tree']['sha']

runs = gh(f'/repos/{PROJ}/actions/runs?head_sha={prod_sha}&per_page=30').get('workflow_runs', [])
pages = next((r for r in runs if r.get('name') == 'Deploy to GitHub Pages'), None)
prod_health = probe('https://projecthub-chat.bradleymatera.dev/health')
dev_health = probe('https://dev.projecthub-chat.bradleymatera.dev/health')

prod_health_note = 'Production backend health was not independently reachable during this product-site refresh.'
if prod_health.get('ok'):
    d = prod_health['data']
    prod_health_note = 'Production backend health was independently reachable during this refresh'
    if d.get('sourceCommit'):
        prod_health_note += f" and reported sourceCommit {d.get('sourceCommit')}"
    if d.get('provider'):
        prod_health_note += f", provider {d.get('provider')}"
    if d.get('model'):
        prod_health_note += f", model {d.get('model')}"
    if d.get('deadlineMs') is not None:
        prod_health_note += f", deadlineMs {d.get('deadlineMs')}"
    prod_health_note += '.'

pages_note = 'No successful production Pages run was found for the current master SHA.'
if pages:
    pages_note = f"Production GitHub Pages run {pages['id']} completed with conclusion {pages.get('conclusion')} on {prod_sha[:8]}."

# ---------------------------------------------------------------------------
# Machine-readable source state
# ---------------------------------------------------------------------------
state_path = ROOT / 'source-state.json'
old_state = json.loads(state_path.read_text())
new_state = {
    'auditedAt': datetime.now(timezone.utc).isoformat(),
    'productBefore': product_main['commit']['sha'],
    'production': prod_sha,
    'integration': dev_sha,
    'staging': staging_sha,
    'active': None,
    'activeNote': 'No post-release feature branch is asserted as the current product direction by this audit. Branch inventory is recorded below.',
    'model': MODEL,
    'exactModelNeuronRate': None,
    'providerSource': old_state.get('providerSource', 'https://developers.cloudflare.com/workers-ai/platform/pricing/'),
    'release': {
        'date': '2026-09-15',
        'pr31Merge': pr31.get('merge_commit_sha'),
        'pr32Merge': pr32.get('merge_commit_sha'),
        'developTree': dev_tree,
        'masterTree': prod_tree,
        'exactTreeParity': dev_tree == prod_tree,
        'qualifiedRuntime': QUALIFIED_RUNTIME,
        'qualifiedFeatureCI': QUALIFIED_CI,
        'developMergeCI': DEVELOP_CI,
        'tests': QUALIFIED_TESTS,
        'retrievalRecallAt6': QUALIFIED_RECALL,
        'conversationGate': QUALIFIED_GATE,
        'projectHubPagesRun': pages.get('id') if pages else None,
        'projectHubPagesConclusion': pages.get('conclusion') if pages else None,
    },
    'runtimeHealth': {
        'production': prod_health,
        'development': dev_health,
    },
    'branches': {
        'ProjectHub': all_branch_records(PROJ),
        'ProjectHub-dev': all_branch_records(STAGING_REPO),
    },
}
state_path.write_text(json.dumps(new_state, indent=2) + '\n')

# ---------------------------------------------------------------------------
# README
# ---------------------------------------------------------------------------
readme = text('README.md')
new_release_readme = f'''## September 15 release refresh

Scout's semantic-reliability and tenant-portability work has now crossed the full source-release path.

- Production source: `{prod_sha}`
- Protected integration: `{dev_sha}`
- Shared release tree: `{prod_tree}`
- Staging mirror: `{staging_sha}`, sourced from integration `{dev_sha}`
- PR #31: merged into `develop` as `{pr31.get('merge_commit_sha')}`
- PR #32: exact-tree release merged into `master` as `{pr32.get('merge_commit_sha')}`
- Qualified feature runtime: `{QUALIFIED_RUNTIME}`
- Deterministic verification: **{QUALIFIED_TESTS}** tests; retrieval Recall@6 **{QUALIFIED_RECALL}**
- Dated live qualification: **{QUALIFIED_GATE}** on DEV, zero 429s in the recorded run
- {pages_note}
- {prod_health_note}

The released tree now includes structured semantic query planning, canonical entity/subject identity precedence, server-owned discourse state, proposition-scoped relationship validation, answer obligations/completeness checks, empty-knowledge support, and tenant-neutral portability regressions. ProjectHub Recruiter Alpha remains the reference application, but Scout Core is no longer accurately described as recruiter-only.

Formal domain-package contracts, runnable unrelated domain packages, a permissioned action/tool platform, and commercial/operator handoff remain forward productization work.

'''
readme = sub_once(
    readme,
    r'## September 5 product-site overhaul\n.*?(?=## Local verification and publication)',
    new_release_readme,
    'README current release section',
)
readme = readme.replace(
    "Scout's released application is ProjectHub Recruiter Alpha. A customer-neutral core,\nempty-knowledge operation, generalized domain packages, and commercial handoff remain roadmap work.\nThe pricing page describes one negotiated acquisition of the existing implementation, not an already delivered generic SDK or hosted service operation.",
    "Scout's released reference application is ProjectHub Recruiter Alpha. The released runtime now contains tenant-neutral Core behavior and empty-knowledge operation; formal domain-package contracts, packaged cross-domain applications, the extension/action platform, and operator handoff remain roadmap work.\nThe pricing page still describes one negotiated acquisition of the existing implementation, not a hosted SaaS tier or an already delivered self-service SDK.",
)
write('README.md', readme)

# ---------------------------------------------------------------------------
# Roadmap: keep the original plan, update its status to the shipped reality.
# ---------------------------------------------------------------------------
roadmap = f'''# Scout Roadmap

Last refreshed: **September 15, 2026**

This roadmap describes Scout's engineering path from the released ProjectHub Recruiter Alpha reference application toward a portable product. It separates shipped runtime behavior, integration/release truth, productization milestones, and later extension/operator work.

Passing tests is evidence. A deployment marker is evidence. A branch name is evidence. None of those alone is a universal quality claim.

## Current source state

- **Production source:** `ProjectHub:master@{prod_sha}`
- **Integration source:** `ProjectHub:develop@{dev_sha}`
- **Production + integration Git tree:** `{prod_tree}`
- **Staging mirror:** `ProjectHub-dev:main@{staging_sha}` sourced from `develop@{dev_sha}`
- **Qualified pre-integration runtime:** `{QUALIFIED_RUNTIME}`
- **Production Pages:** {pages_note}
- **Provider/model:** Cloudflare Workers AI · `{MODEL}`
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

Recorded qualification for the frozen feature runtime `{QUALIFIED_RUNTIME}`:

- **{QUALIFIED_TESTS}** deterministic tests;
- retrieval Recall@6 **{QUALIFIED_RECALL}**;
- dated DEV conversation gate **{QUALIFIED_GATE}** with zero 429s;
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

PR #31 merged the accepted feature line into protected `develop` as `{dev_sha}`.

## Phase 04 — Staging truth + parity

**Status: COMPLETED FOR THE SEPTEMBER 15 RELEASE**

`ProjectHub-dev:main@{staging_sha}` records the new integration source `{dev_sha}`. Staging provenance and the qualified develop tree are aligned.

## Phase 05 — Production release gate

**Status: SOURCE RELEASE COMPLETED SEPTEMBER 15, 2026**

PR #32 promoted the exact qualified develop tree to `master@{prod_sha}`. Production and integration share tree `{prod_tree}`.

Source release, backend deployment health, Pages publication, and browser behavior remain separate operational facts. {pages_note} {prod_health_note}

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
'''
write('SCOUT-ROADMAP.md', roadmap)

# ---------------------------------------------------------------------------
# Source audit: prepend a current release audit, preserve prior audits below.
# ---------------------------------------------------------------------------
audit = text('SCOUT-SOURCE-AUDIT.md')
new_audit = f'''# Product-site release audit — September 15, 2026

## Verified release state

- Production source: `ProjectHub:master@{prod_sha}`
- Protected integration: `ProjectHub:develop@{dev_sha}`
- Shared Git tree: `{prod_tree}`
- Staging mirror: `ProjectHub-dev:main@{staging_sha}` sourced from `{dev_sha}`
- PR #31 merged into develop as `{pr31.get('merge_commit_sha')}`
- PR #32 released the exact qualified tree to master as `{pr32.get('merge_commit_sha')}`
- Qualified feature runtime: `{QUALIFIED_RUNTIME}`
- Feature CI: `{QUALIFIED_CI}`; develop merge-result CI: `{DEVELOP_CI}`
- Deterministic tests: **{QUALIFIED_TESTS}**
- Retrieval Recall@6: **{QUALIFIED_RECALL}**
- Dated DEV conversation gate: **{QUALIFIED_GATE}**, zero HTTP 429 in the recorded run
- {pages_note}
- {prod_health_note}

Production and integration now have different Git ancestry but the same tree. The source-release claim is therefore stronger than raw branch-ahead/behind interpretation: the production tree is the qualified integration tree.

## What materially changed since the September 5 audit

The September 5 product site described tenant-neutral Core and empty/no-KB operation primarily as future productization. That wording is now stale.

The released September 15 tree contains substantial tenant-neutral Core behavior, including canonical subject/entity identity, structured semantic query planning, server-owned discourse state, request-context separation, proposition-scoped relationships/properties, generic answer obligations, empty-KB coverage, and synthetic unrelated-domain regressions. Normal visible prose remains model-generated; deterministic code plans, retrieves, calculates, validates, rejects, and triggers bounded recovery.

This does **not** mean Scout has shipped a self-service multi-tenant SDK, formal domain-package manifest, public developer API product, or permissioned action platform. Those remain productization work.

## Release evidence boundaries

- Source release is proven by PR/commit/tree parity.
- Staging provenance is proven by the generated staging mirror/source marker.
- Pages publication is a separate workflow fact. {pages_note}
- Backend runtime deployment is a separate operational fact. {prod_health_note}
- Browser behavior is a separate end-to-end fact and is not inferred merely from Git state.
- The {QUALIFIED_GATE} conversation result is dated qualification evidence, not a universal accuracy percentage.

## Product-direction correction

The forward roadmap now treats Phase 07 (Core neutrality) as a substantially complete foundation and Phase 08 (empty/general operation) as a released runtime capability. Phase 09 domain-package contracts is the next major productization feature. Phase 10 has meaningful synthetic portability proof but still needs runnable unrelated packages. Phase 11 remains the controlled extension/action platform, and Phase 12 remains operator/commercial handoff.

---

'''
if not audit.startswith('# Product-site release audit — September 15, 2026'):
    audit = new_audit + audit
write('SCOUT-SOURCE-AUDIT.md', audit)

# ---------------------------------------------------------------------------
# Overview page
# ---------------------------------------------------------------------------
index = text('index.html')
index = index.replace('Source audit · September 5, 2026', 'Source audit · September 15, 2026')
index = index.replace(
    '<span class="state-tag state-plan">Not shipped</span>\n          <strong>Customer-neutral Scout Core</strong>\n          <p>Empty/no-KB operation, generalized domain packages, and unrelated-domain portability tests remain productization work.</p>',
    '<span class="state-tag state-plan">Released foundation</span>\n          <strong>Tenant-neutral Scout Core</strong>\n          <p>Canonical identity, empty/no-KB operation, structured semantic planning, and cross-domain portability regressions now ship in the same runtime. Formal domain packages and the controlled extension/action platform remain productization work.</p>',
)
index = index.replace(
    '<p>Matches the September 5 production Git tree. New conversation work is on a separate feature branch.</p>',
    f'<p>Matches the September 15 production tree <code>{prod_tree[:8]}</code>. The semantic-reliability and tenant-portability line is now released through both integration and production source.</p>',
)
index = index.replace(
    '<div class="scope-kicker">Productization work</div>\n            <h3>Customer-neutral Scout Core</h3>\n            <p>The target is a reusable engine with customer-specific knowledge and capabilities outside the core.</p>',
    '<div class="scope-kicker">Released Core foundation</div>\n            <h3>Tenant-neutral Scout Core</h3>\n            <p>The released engine now supports tenant-neutral identity, relationships, semantic planning, empty/no-KB operation, and portable entity/property behavior. Formal domain packages remain the next boundary.</p>',
)
for old, new in [
    ('07 · later', '07 · substantially complete'),
    ('08 · later', '08 · released foundation'),
    ('09 · later', '09 · next'),
    ('10 · later', '10 · partial proof'),
    ('11 · later', '11 · planned'),
    ('12 · later', '12 · planned'),
]:
    index = index.replace(old, new)
release_band = f'''\n    <section class="section-pad" id="sep15-release">\n      <div class="shell">\n        <header class="section-head reveal visible"><div class="section-index">Release / September 15, 2026</div><div><h2>Tenant-portability and semantic reliability are now in the released Scout tree.</h2><p>PR #31 integrated the long-running conversation/core hardening into protected integration, and PR #32 promoted the exact qualified tree to production source without drifting from the tested develop tree.</p></div></header>\n        <div class="state-grid">\n          <article class="fx-card"><span class="state-tag state-prod">Production source</span><strong><code>{prod_sha[:8]}</code></strong><p>Production and integration share tree <code>{prod_tree[:8]}</code>.</p></article>\n          <article class="fx-card"><span class="state-tag state-stage">Staging</span><strong><code>{staging_sha[:8]}</code></strong><p>Generated from integration <code>{dev_sha[:8]}</code>.</p></article>\n          <article class="fx-card"><span class="state-tag state-plan">Qualified evidence</span><strong>{QUALIFIED_TESTS}</strong><p>Recall@6 {QUALIFIED_RECALL}; dated DEV gate {QUALIFIED_GATE}.</p></article>\n        </div>\n        <p class="audit-stamp">This release adds structured semantic query planning, canonical identity precedence, proposition-scoped validation, answer obligations, empty-KB support, and tenant-neutral portability coverage. Formal domain packages and the action/extension platform remain roadmap work.</p>\n      </div>\n    </section>\n'''
if 'id="sep15-release"' not in index:
    index = replace_once(index, '    <section class="section-pad section-dark" id="scope">', release_band + '\n    <section class="section-pad section-dark" id="scope">', 'index release insertion')
write('index.html', index)

# ---------------------------------------------------------------------------
# Docs page
# ---------------------------------------------------------------------------
docs = text('docs.html')
docs = docs.replace('master b071e4e4 · develop 4f5ee971 · same tree', f'master {prod_sha[:8]} · develop {dev_sha[:8]} · same tree')
docs = docs.replace(
    '<span class="label">Productization direction</span><h3>Customer-neutral Scout Core</h3><p>Empty/no-KB operation, generalized domain packages, arbitrary customer workflows, and unrelated-domain portability tests are productization work, not a currently shipped SDK claim.</p>',
    '<span class="label">Released Core foundation</span><h3>Tenant-neutral Scout Core</h3><p>Empty/no-KB behavior, canonical identity resolution, structured semantic planning, and portable entity/property handling are now part of the released runtime. Formal domain-package contracts, reusable workflow packages, and self-service installation remain productization work.</p>',
)
release_callout = f'''      <div class="docs-callout production" data-sep15-release=""><strong>September 15 released source:</strong> PR #31 integrated semantic-reliability and tenant-portability into <code>develop@{dev_sha[:8]}</code>; PR #32 promoted the exact tree <code>{prod_tree[:8]}</code> to <code>master@{prod_sha[:8]}</code>. The released runtime includes structured semantic query plans, canonical identity precedence, answer obligations/completeness checks, proposition-scoped validation, and empty-KB portability coverage. Deterministic verification reached <strong>{QUALIFIED_TESTS}</strong> tests and Recall@6 <strong>{QUALIFIED_RECALL}</strong>.</div>\n'''
if 'data-sep15-release' not in docs:
    docs = replace_once(docs, '      <div class="docs-callout production" data-sept5-release="">', release_callout + '      <div class="docs-callout production" data-sept5-release="">', 'docs release callout')
docs = sub_once(
    docs,
    r'<div class="docs-callout warning" data-active-discourse-branch="">.*?</div>',
    '<div class="docs-callout"><strong>Historical development note:</strong> the September 5 discourse branch described below was an intermediate post-release checkpoint. Its conversation-state ideas were subsequently expanded through later integration work; the current released source is the September 15 tree documented above.</div>',
    'docs historical discourse note',
)
# Current implementation source links in Docs should resolve to current production source.
docs = docs.replace('blob/b071e4e4f0bb69faeecd811f31514af30d2e1f61/', f'blob/{prod_sha}/')
docs = docs.replace('blob/4f5ee971488e433ebdf66280cce82e163c5c7688/', f'blob/{prod_sha}/')
write('docs.html', docs)

# ---------------------------------------------------------------------------
# Learn page: teach the new semantic planning layer without erasing history.
# ---------------------------------------------------------------------------
learn = text('learn.html')
mental = '<p class="docs-lede">A useful way to understand Scout is to stop thinking of it as one giant AI model. The application is a pipeline. JavaScript prepares facts, ranks evidence, tracks conversation state, applies rules, calls a language model for wording, and checks the result afterward.</p>'
new_mental = mental + f'''\n          <div class="docs-callout production"><strong>September 15 architecture update:</strong> current turns are now represented by a structured semantic query plan rather than by appending arbitrary words from conversation history. The plan tracks the literal/resolved question, current target entity, requested facet/relation/topic/role, continuation/topic-shift state, and bounded retrieval legs. Canonical identity resolution and proposition-scoped validation keep subject/entity relationships separated, while the model still writes the final prose.</div>'''
if 'September 15 architecture update' not in learn:
    learn = replace_once(learn, mental, new_mental, 'Learn semantic-plan callout')
learn = learn.replace('blob/b071e4e4f0bb69faeecd811f31514af30d2e1f61/', f'blob/{prod_sha}/')
learn = learn.replace('blob/4f5ee971488e433ebdf66280cce82e163c5c7688/', f'blob/{prod_sha}/')
write('learn.html', learn)

# ---------------------------------------------------------------------------
# API page: current release source, while keeping the application-runtime boundary.
# ---------------------------------------------------------------------------
api = text('api.html')
api = api.replace('Routes present in the September 5 released source.', 'Routes present in the September 15 released source.')
api_lede = '<p class="docs-lede">Scout currently exposes an application runtime API for ProjectHub Recruiter Alpha. The route surface is real and usable by the ProjectHub frontend and engineering tooling, but it is not documented here as a stable public developer platform.</p>'
api_release = api_lede + f'''\n          <div class="docs-callout production"><strong>September 15 release:</strong> the runtime source is now <code>master@{prod_sha[:8]}</code>, exact-tree equivalent to <code>develop@{dev_sha[:8]}</code>. The semantic-planning/identity/validation changes are internal runtime behavior; they do not convert these application endpoints into a versioned public multi-tenant API product.</div>'''
if 'September 15 release:</strong> the runtime source' not in api:
    api = replace_once(api, api_lede, api_release, 'API release callout')
api = api.replace('blob/b071e4e4f0bb69faeecd811f31514af30d2e1f61/', f'blob/{prod_sha}/')
api = api.replace('blob/4f5ee971488e433ebdf66280cce82e163c5c7688/', f'blob/{prod_sha}/')
write('api.html', api)

# ---------------------------------------------------------------------------
# Changelog: make Sep 15 the current state, keep Sep 5 as historical record.
# ---------------------------------------------------------------------------
change = text('changelog.html')
change = change.replace('<span>Production</span><strong>master · b071e4e4</strong>', f'<span>Production</span><strong>master · {prod_sha[:8]}</strong>')
change = change.replace('<span>Integration</span><strong>develop · 4f5ee971</strong>', f'<span>Integration</span><strong>develop · {dev_sha[:8]}</strong>')
change = change.replace('<span>Active unmerged</span><strong>cddb3bc · +3/-0</strong>', '<span>Release tree</span><strong>92b4d149 · exact parity</strong>')
change = change.replace('<span>Audited</span><strong>September 5, 2026</strong>', '<span>Audited</span><strong>September 15, 2026</strong>')
change = change.replace('<option value="current-state">Production and integration share the released tree.</option>', '<option value="current-state">Production and integration share the September 15 released tree.</option><option value="sep15-release">Semantic reliability and tenant portability reached production source.</option>')
change = change.replace('<div class="docs-sidebar-title"><span>Changelog</span><span>15 topics</span></div>', '<div class="docs-sidebar-title"><span>Changelog</span><span>16 topics</span></div>')
change = change.replace('<div class="docs-nav-group"><a href="#sep5-active-discourse"><span class="nav-code">NEW</span>Active discourse branch</a><span class="docs-nav-label">Current</span>', '<div class="docs-nav-group"><a href="#sep15-release"><span class="nav-code">NEW</span>Sep 15 release</a><span class="docs-nav-label">Current</span>')
current_section = f'''<section class="docs-section" id="current-state" data-search="current source branch master develop production staging release tree September 15">\n          <div class="docs-eyebrow">01 / Source snapshot · September 15, 2026</div><h2>Production and integration share the newly released tree.</h2>\n          <p class="docs-lede">Production <code>{prod_sha[:8]}</code> and integration <code>{dev_sha[:8]}</code> preserve different ancestry but share Git tree <code>{prod_tree[:8]}</code>. Staging was regenerated from the same integration source at <code>{staging_sha[:8]}</code>.</p>\n          <div class="docs-grid-3">\n            <div class="docs-card"><span class="label">Production source</span><h3><code>master</code> · <code>{prod_sha[:8]}</code></h3><p>PR #32 exact-tree September 15 release.</p></div>\n            <div class="docs-card"><span class="label">Integration source</span><h3><code>develop</code> · <code>{dev_sha[:8]}</code></h3><p>PR #31 semantic-reliability and tenant-portability integration.</p></div>\n            <div class="docs-card"><span class="label">Staging mirror</span><h3><code>{staging_sha[:8]}</code></h3><p>Generated from <code>{dev_sha[:8]}</code>.</p></div>\n          </div>\n          <div class="docs-callout"><strong>Release-truth rule:</strong> source release, backend deployment, Pages publication, and browser behavior are separate facts. {pages_note} {prod_health_note}</div>\n        </section>'''
change = sub_once(change, r'<section class="docs-section" id="current-state".*?</section>', current_section, 'changelog current state')
sep15 = f'''<section class="docs-section" id="sep15-release" data-search="September 15 semantic reliability tenant portability PR 31 PR 32 canonical identity semantic query plan empty knowledge">\n          <div class="docs-eyebrow">September 15, 2026 · Production source release</div>\n          <h2>Semantic reliability and tenant portability reached the released Scout tree.</h2>\n          <p>PR #31 integrated the long-running reliability branch into protected <code>develop</code>; PR #32 then promoted the exact qualified tree to <code>master</code>. The release keeps Recruiter Alpha as the reference application while moving core identity, context, relationship, and validation logic further away from recruiter-specific assumptions.</p>\n          <div class="docs-flow">\n            <div class="docs-flow-step"><div><strong>Structured semantic query plan.</strong><span>Current-turn semantics, active entity, facet/relation/topic/role, continuation state, and retrieval legs replace the old bag-of-words history merge.</span></div></div>\n            <div class="docs-flow-step"><div><strong>Canonical identity.</strong><span>Entity aliases, tenant aliases, and weak name parts share one precedence rule so a real entity cannot silently borrow the tenant subject's relationships.</span></div></div>\n            <div class="docs-flow-step"><div><strong>Response obligations.</strong><span>Requested-facet enumeration and false-unknown checks reject answers that are technically non-false but fail the user's requested semantic obligation.</span></div></div>\n            <div class="docs-flow-step"><div><strong>Tenant portability.</strong><span>Empty/no-KB operation and synthetic unrelated-domain regressions are part of the released test surface; formal domain-package contracts remain the next productization phase.</span></div></div>\n          </div>\n          <div class="docs-table-wrap"><table class="docs-table"><thead><tr><th>September 15 qualification evidence</th><th>Recorded result</th></tr></thead><tbody>\n            <tr><td>Deterministic suite</td><td><strong>{QUALIFIED_TESTS}</strong></td></tr>\n            <tr><td>Retrieval Recall@6</td><td><strong>{QUALIFIED_RECALL}</strong></td></tr>\n            <tr><td>Dated DEV conversation gate</td><td><strong>{QUALIFIED_GATE}</strong></td></tr>\n            <tr><td>Qualified feature CI</td><td><strong>{QUALIFIED_CI}</strong></td></tr>\n            <tr><td>Develop merge-result CI</td><td><strong>{DEVELOP_CI}</strong></td></tr>\n          </tbody></table></div>\n          <div class="docs-callout warning"><strong>Do not read 100/132 as a universal accuracy score.</strong> It is a dated live qualification result for one code/model/scorer combination. The release deliberately kept fail-closed validation instead of weakening grounding to chase the corpus score.</div>\n        </section>'''
if 'id="sep15-release"' not in change:
    change = replace_once(change, '<section class="docs-section" id="sep5-site-overhaul">', sep15 + '<section class="docs-section" id="sep5-site-overhaul">', 'changelog Sep15 insertion')
# Turn the previously-current discourse section into an explicit historical snapshot.
change = change.replace('September 5, 2026 · Post-release active branch', 'September 5, 2026 · Historical post-release branch')
change = change.replace('Two discourse code commits and a handoff remain unmerged.', 'The discourse branch was an intermediate checkpoint before later integration.')
change = change.replace('It is not in staging or production.</p>', 'At the September 5 snapshot it was not in staging or production; later semantic/discourse work was integrated through subsequent pull requests and the September 15 release.</p>')
write('changelog.html', change)

# ---------------------------------------------------------------------------
# Pricing: preserve the one-time acquisition model, update technical reality.
# ---------------------------------------------------------------------------
pricing = text('pricing.html')
pricing = pricing.replace(
    '<p><strong>Current boundary:</strong> Scout is a real ProjectHub Recruiter Alpha implementation. A customer-neutral core and turnkey multi-tenant package are not being represented as finished products. <a href="./index.html#roadmap">See the roadmap.</a></p>',
    '<p><strong>Current boundary:</strong> Scout now ships a substantially tenant-neutral Core foundation, including empty/no-KB behavior and portable entity/relationship handling, while ProjectHub Recruiter Alpha remains the reference application. Formal domain-package contracts, turnkey multi-domain packaging, controlled action extensions, and operator handoff are not being represented as finished products. <a href="./index.html#roadmap">See the roadmap.</a></p>',
)
pricing = pricing.replace(
    'Scout has real retrieval, session, inference, tool, validation, telemetry, and deployment work behind it. It is still a ProjectHub Recruiter Alpha implementation, not a finished customer-neutral SaaS product.',
    'Scout has real retrieval, semantic planning, session/discourse state, inference, tools, validation, telemetry, deployment controls, tenant-neutral Core behavior, and empty-KB support behind it. It is not being represented as a turnkey hosted SaaS, self-service multi-tenant SDK, or finished domain-package platform.',
)
pricing = pricing.replace(
    '<article class="faq-card"><h3>Is Scout a turnkey product for any industry?</h3><p>No. The current implementation is ProjectHub Recruiter Alpha. A customer-neutral core and generalized domain packages remain productization work.</p></article>',
    '<article class="faq-card"><h3>Is Scout a turnkey product for any industry?</h3><p>No. The released runtime now has a tenant-neutral Core foundation and empty-KB support, but formal domain-package contracts, packaged unrelated-domain applications, self-service installation, and the controlled extension/action platform remain productization work.</p></article>',
)
write('pricing.html', pricing)

# ---------------------------------------------------------------------------
# One explicit release note for humans/operators.
# ---------------------------------------------------------------------------
release_notes = f'''# Scout release notes — September 15, 2026

## Release identity

- Production source: `{prod_sha}`
- Integration source: `{dev_sha}`
- Shared tree: `{prod_tree}`
- Staging mirror: `{staging_sha}`
- Qualified feature runtime: `{QUALIFIED_RUNTIME}`
- PR #31 merge: `{pr31.get('merge_commit_sha')}`
- PR #32 merge: `{pr32.get('merge_commit_sha')}`

## Shipped architecture milestone

This release moves Scout materially beyond the September 5 state without changing its basic product identity. Recruiter Alpha remains the reference application, while the same released Core now has stronger tenant-neutral identity, semantic planning, relationship/property grounding, answer-completeness semantics, empty-KB behavior, and cross-domain regression coverage.

Normal visible responses remain model-generated. Deterministic systems resolve, retrieve, calculate, plan, validate, reject, and initiate bounded recovery; they do not become a second prose author.

## Verification

- Deterministic tests: **{QUALIFIED_TESTS}**
- Retrieval Recall@6: **{QUALIFIED_RECALL}**
- Dated DEV live gate: **{QUALIFIED_GATE}**
- Feature CI: **{QUALIFIED_CI}**
- Develop merge-result CI: **{DEVELOP_CI}**
- {pages_note}
- {prod_health_note}

## Productization impact

Phase 07 Core neutrality is now a substantially complete foundation rather than purely future work. Phase 08 empty/general operation exists as a released runtime capability, although General Scout still needs product packaging. Phase 09 formal domain-package contracts is the next major productization feature. Phase 10 has synthetic portability proof but still needs runnable unrelated packages. Phase 11 controlled extensions/actions and Phase 12 operator/commercial handoff remain planned.

## Commercial boundary

The commercial model remains a one-time negotiated software/IP acquisition. This release does not create hosted monthly tiers, a public multi-tenant API service, or indefinite support obligations.
'''
write('RELEASE-NOTES-2026-09-15.md', release_notes)

# One-shot workflow cleans itself out of the resulting branch.
for rel in ['.github/refresh-scout-site.py', '.github/workflows/refresh-current-release.yml']:
    p = ROOT / rel
    if p.exists():
        p.unlink()

print('Scout product refresh prepared')
print(json.dumps({
    'production': prod_sha,
    'integration': dev_sha,
    'tree': prod_tree,
    'staging': staging_sha,
    'pages': pages.get('id') if pages else None,
    'prodHealth': prod_health,
}, indent=2))
