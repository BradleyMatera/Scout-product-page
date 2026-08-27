'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pages = [
  'index.html',
  'docs.html',
  'learn.html',
  'api.html',
  'changelog.html',
  'pricing.html',
];

const scriptTag = '  <script src="./freshness.js" defer></script>';
const snapshotScript = '  <script src="./snapshot-refresh.js" defer></script>';
const docsGraphicsScript = '  <script src="./docs-graphics.js" defer></script>';
const learnResourcesScript = '  <script src="./learn-resources.js" defer></script>';
const accountingScript = '  <script src="./accounting-correction.js" defer></script>';
const roadmapScript = '  <script src="./roadmap-current.js" defer></script>';
const roadmapCopyScript = '  <script src="./roadmap-copy.js" defer></script>';
const docsScript = '  <script src="./docs.js" defer></script>';
const learnCss = '  <link rel="stylesheet" href="./learn-resources.css" />';

for (const page of pages) {
  const file = path.join(root, page);
  if (!fs.existsSync(file)) throw new Error(`Missing Scout page: ${page}`);

  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('</body>')) throw new Error(`Cannot prepare ${page}: missing </body>`);

  if (page === 'learn.html' && !html.includes('href="./learn-resources.css"')) {
    if (!html.includes('</head>')) throw new Error('Cannot prepare learn.html: missing </head>');
    html = html.replace('</head>', `${learnCss}\n</head>`);
  }

  if (!html.includes('src="./freshness.js"')) {
    // Current-state content, dated source refreshes, teaching resources, and the
    // cross-page accounting notes must exist before docs.js snapshots sections and
    // attaches navigation/search/copy behavior.
    if (html.includes(docsScript)) {
      let additions = `${scriptTag}\n${snapshotScript}\n${accountingScript}\n${docsScript}`;
      if (page === 'docs.html') additions = `${scriptTag}\n${snapshotScript}\n${docsGraphicsScript}\n${accountingScript}\n${docsScript}`;
      if (page === 'learn.html') additions = `${scriptTag}\n${snapshotScript}\n${learnResourcesScript}\n${accountingScript}\n${docsScript}`;
      html = html.replace(docsScript, additions);
    } else {
      html = html.replace('</body>', `${scriptTag}\n${snapshotScript}\n${accountingScript}\n</body>`);
    }
  } else {
    if (!html.includes('src="./snapshot-refresh.js"')) {
      html = html.replace('  <script src="./freshness.js" defer></script>', `  <script src="./freshness.js" defer></script>\n${snapshotScript}`);
    }
    if (!html.includes('src="./accounting-correction.js"')) {
      if (html.includes(docsScript)) html = html.replace(docsScript, `${accountingScript}\n${docsScript}`);
      else html = html.replace('</body>', `${accountingScript}\n</body>`);
    }
  }

  // The Overview roadmap is a separately maintained current-state layer. Keeping it
  // out of the old static roadmap markup lets the site show active branch/integration/
  // staging truth without rewriting the historical page body on every engineering turn.
  if (page === 'index.html' && !html.includes('src="./roadmap-current.js"')) {
    html = html.replace('</body>', `${roadmapScript}\n</body>`);
  }

  // Public copy stays static and product-focused even when the current-state roadmap
  // renderer changes frequently. This layer runs after roadmap-current.js.
  if (page === 'index.html' && !html.includes('src="./roadmap-copy.js"')) {
    html = html.replace('</body>', `${roadmapCopyScript}\n</body>`);
  }

  fs.writeFileSync(file, html, 'utf8');
  console.log(`Prepared ${page}`);
}
