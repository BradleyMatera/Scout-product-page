'use strict';
// Pages are canonical static HTML. Publication must never repair stale prose.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
for (const page of ['index', 'docs', 'learn', 'api', 'changelog', 'pricing']) {
  const html = fs.readFileSync(path.join(root, `${page}.html`), 'utf8');
  for (const required of ['</head>', '</body>', 'id="main-content"', './launch.css']) {
    if (!html.includes(required)) throw new Error(`${page}.html missing ${required}`);
  }
  if (/src="\.\/(?:freshness|snapshot-refresh|accounting-correction|roadmap-current|roadmap-copy|docs-graphics|learn-resources)\.js"/.test(html)) {
    throw new Error(`${page}.html loads a retired content injector`);
  }
  console.log(`Validated static ${page}.html`);
}
