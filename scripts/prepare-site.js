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
const docsGraphicsScript = '  <script src="./docs-graphics.js" defer></script>';
const learnResourcesScript = '  <script src="./learn-resources.js" defer></script>';
const accountingScript = '  <script src="./accounting-correction.js" defer></script>';
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
    // Dynamic current-state content, teaching resources, and accounting corrections
    // must exist before docs.js snapshots sections and attaches navigation/search/copy behavior.
    if (html.includes(docsScript)) {
      let additions = `${scriptTag}\n${accountingScript}\n${docsScript}`;
      if (page === 'docs.html') additions = `${scriptTag}\n${docsGraphicsScript}\n${accountingScript}\n${docsScript}`;
      if (page === 'learn.html') additions = `${scriptTag}\n${learnResourcesScript}\n${accountingScript}\n${docsScript}`;
      html = html.replace(docsScript, additions);
    } else {
      html = html.replace('</body>', `${scriptTag}\n${accountingScript}\n</body>`);
    }
  } else if (!html.includes('src="./accounting-correction.js"')) {
    // Keep prepared/local copies correct even if freshness.js was already inserted.
    if (html.includes(docsScript)) html = html.replace(docsScript, `${accountingScript}\n${docsScript}`);
    else html = html.replace('</body>', `${accountingScript}\n</body>`);
  }

  fs.writeFileSync(file, html, 'utf8');
  console.log(`Prepared ${page}`);
}
