# Scout Product Page

Public product/early-access page for **Scout**, Bradley Matera's portable intelligence engine project.

## Live site

GitHub Pages target:

**https://bradleymatera.github.io/Scout-product-page/**

## Product positioning

Scout is being designed as a general intelligence and conversation engine that remains useful without customer-specific knowledge installed, then becomes specialized through swappable domain knowledge, policies, workflows, tools, integrations, and controlled extensions.

The product page intentionally describes Scout as **in development** and treats current pricing as provisional early-access/design-partner pricing rather than a final generally available commercial offer.

## Deployment

The site is a zero-build static page. `.github/workflows/deploy-pages.yml` deploys `main` to GitHub Pages using GitHub's official Pages Actions workflow.

## Editing

The current site is self-contained in `index.html` so it is easy to read, move, audit, or hand off. It includes the layout, responsive styles, lightweight reveal animations, SEO metadata, and product content without a JavaScript framework or build dependency.
