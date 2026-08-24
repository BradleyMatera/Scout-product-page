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
const docsScript = '  <script src="./docs.js" defer></script>';

for (const page of pages) {
  const file = path.join(root, page);
  if (!fs.existsSync(file)) throw new Error(`Missing Scout page: ${page}`);

  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('src="./freshness.js"')) continue;
  if (!html.includes('</body>')) throw new Error(`Cannot prepare ${page}: missing </body>`);

  // Docs/API/Changelog/Learn should have current-state additions in the DOM
  // before docs.js snapshots sections and attaches copy/search behavior.
  // docs.html also gets the visual teaching layer before docs.js initializes.
  if (html.includes(docsScript)) {
    const additions = page === 'docs.html'
      ? `${scriptTag}\n${docsGraphicsScript}\n${docsScript}`
      : `${scriptTag}\n${docsScript}`;
    html = html.replace(docsScript, additions);
  } else {
    html = html.replace('</body>', `${scriptTag}\n</body>`);
  }

  fs.writeFileSync(file, html, 'utf8');
  console.log(`Prepared ${page}`);
}
