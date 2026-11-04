from pathlib import Path
import json
p=Path('src/data/pages.json');d=json.loads(p.read_text(encoding='utf8'))
for page in d.values():
 for item in page['schema']['@graph']:
  if item.get('@type')=='WebSite':item.pop('potentialAction',None)
p.write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf8')
# The source has no visible search; omit its obsolete WordPress search advertisement.
for p in Path('src/data').glob('*.html'):
 s=p.read_text(encoding='utf8').replace('<div id="main-content">','<main id="main-content" tabindex="-1">')
 s=s.replace('</article>\n</div>','</article>\n</main>')
 p.write_text(s,encoding='utf8')
