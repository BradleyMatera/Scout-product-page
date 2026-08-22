# Scout Product Page

Public product/status page for **Scout**, the intelligence and orchestration engine currently powering **ProjectHub Recruiter Alpha**.

## Live site

https://bradleymatera.github.io/Scout-product-page/

## Canonical Scout sources

- Source repository: https://github.com/BradleyMatera/ProjectHub
- Production branch: `master`
- Integration branch: `develop`
- Staging deployment mirror: https://github.com/BradleyMatera/ProjectHub-dev
- Production ProjectHub: https://bradleymatera.github.io/ProjectHub/
- Staging ProjectHub: https://bradleymatera.github.io/ProjectHub-dev/

## Positioning rule

This page deliberately separates three states:

1. **Live today** — the real recruiter-specific Scout deployment and capabilities supported by current production/integrated code.
2. **In development** — hardening or integration work that exists on `develop` but may not yet be promoted to production.
3. **Productization direction** — customer-neutral Scout Core, empty/no-KB operation, domain/customer packages, broader tools/workflows, and commercial transferability. These are goals, not current shipped claims.

The previous version of this page incorrectly described several productization goals as though they already existed. The August 22, 2026 overhaul was rebuilt from the actual ProjectHub repositories, branch history, workflows, test/eval artifacts, engineering handoffs, runtime knowledge and current source files.

## Current architecture represented on the page

The current Scout/ProjectHub code supports a RAG-first architecture built around:

- local Okapi BM25 retrieval and contextual Reciprocal Rank Fusion
- query understanding and conversational rewriting
- server-owned structured session state
- allowlisted read-only recruiter evidence tools
- semantic response contracts and TRUE/FALSE/UNKNOWN claim handling
- Cloudflare Workers AI production generation using `@cf/meta/llama-3.1-8b-instruct-fast`
- Ollama `qwen2.5:1.5b` for development/evaluation and a gated fallback architecture
- strict post-generation grounding, relationship, entity, number, polarity, provenance and overclaim validation
- generative repair / constrained recovery
- safe per-reply runtime and retrieval telemetry
- a 15-second response budget

The current production application is **not** represented as a general-purpose assistant. Its runtime knowledge explicitly scopes it to Bradley Matera's verified professional information and Scout's own runtime.

## Accuracy / evidence policy

The product page avoids presenting historical benchmark results as current quality guarantees. ProjectHub's own development history invalidated earlier flattering qualification scores after a strict semantic audit found false positives. The page therefore emphasizes the current retrieval benchmark and the existence of the evaluation/regression system rather than inventing an overall accuracy percentage.

See `SCOUT-SOURCE-AUDIT.md` for the repository audit used to rebuild the site.

## Deployment

The product page is a zero-build static site. `.github/workflows/deploy-pages.yml` publishes `main` to GitHub Pages.
