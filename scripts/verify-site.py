"""Offline publication gate for static pages, links, and critical factual contracts."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json, re
ROOT = Path(__file__).resolve().parent.parent
class Page(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.ids=[]; self.links=[]; self.h1=0; self.assets=[]; self.scripts=[]
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if 'id' in a: self.ids.append(a['id'])
        if tag=='h1': self.h1+=1
        if tag=='a' and 'href' in a: self.links.append(a['href'])
        if tag in ('img','script') and 'src' in a: self.assets.append(a['src'])
        if tag=='link' and a.get('rel')=='stylesheet': self.assets.append(a['href'])
        if tag=='script' and 'src' in a: self.scripts.append(a['src'])
pages={p.name:Page(p.read_text()) for p in ROOT.glob('*.html')}
errors=[]; checked=0
for name,page in pages.items():
    if page.h1!=1: errors.append(f'{name}: expected one h1, found {page.h1}')
    if len(page.ids)!=len(set(page.ids)): errors.append(f'{name}: duplicate ids')
    for href in page.links+page.assets:
        url=urlsplit(href)
        if url.scheme or url.netloc: continue
        target=(ROOT/unquote(url.path or name)).resolve()
        if not target.is_relative_to(ROOT): errors.append(f'{name}: outside site: {href}'); continue
        if target.is_dir(): target=target/'index.html'
        checked+=1
        if not target.exists(): errors.append(f'{name}: missing {href}')
        elif url.fragment and target.name in pages and unquote(url.fragment) not in pages[target.name].ids:
            errors.append(f'{name}: missing anchor {href}')
    for required in ['./learn.html','./docs.html','./api.html','./pricing.html']:
        if required not in page.links: errors.append(f'{name}: missing global link {required}')
learn=(ROOT/'learn.html').read_text()
if 'temperature <code>0.2</code>' in learn: errors.append('Learn: stale temperature')
if 'Teaching example: @cf/meta/llama-3.1-8b-instruct-fp8-fast only' not in re.sub('<[^>]+>','',learn): errors.append('Learn: missing exact-model teaching label')
for text in ['5.5463','1,803']:
    if text in learn and "not Scout" not in re.sub('<[^>]+>', '', learn): errors.append('Learn: unqualified capacity example')
state=json.loads((ROOT/'source-state.json').read_text())
if state['exactModelNeuronRate'] is not None: errors.append('Unverified runtime-model rate must remain null')
if errors:
    print('\n'.join(errors));raise SystemExit(1)
print(f'PASS: {len(pages)} pages; {checked} local links/assets; unique IDs, navigation, and accounting contracts')
