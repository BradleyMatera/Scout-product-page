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

for (const page of pages) {
  const file = path.join(root, page);
  if (!fs.existsSync(file)) throw new Error(`Missing Scout page: ${page}`);

  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('src="./freshness.js"')) continue;
  if (!html.includes('</body>')) throw new Error(`Cannot inject freshness.js into ${page}: missing </body>`);

  html = html.replace('</body>', `${scriptTag}\n</body>`);
  fs.writeFileSync(file, html, 'utf8');
  console.log(`Prepared ${page}`);
}
