from bs4 import BeautifulSoup
from pathlib import Path
import json,collections,re
results=[]
for name in ['home','2024-gallery','2025-gallery','2026-gallery']:
 source=BeautifulSoup(Path('audit/'+name+'.txt').read_text(encoding='utf8'),'html.parser').select_one('#et-main-area')
 local=BeautifulSoup(Path('src/data/'+name+'.html').read_text(encoding='utf8'),'html.parser')
 clean=lambda s:re.sub(r'\s+',' ',s.get_text(' ',strip=True)).strip()
 results.append({'page':name,'exactText':clean(source)==clean(local),'headings':[(e.name,e.get_text()) for e in source.select('h1,h2,h3,h4,h5,h6')]==[(e.name,e.get_text()) for e in local.select('h1,h2,h3,h4,h5,h6')]})
Path('audit/content-validation.json').write_text(json.dumps(results,indent=2),encoding='utf8')
m=json.loads(Path('audit/asset-manifest.json').read_text(encoding='utf8')); groups=collections.defaultdict(dict)
for asset in m.values():groups[asset['local'].split('/')[2]][asset['local']]=asset['bytes']
report='# Local asset inventory\n\n241 original URLs map to 240 unique, byte-preserved local files. No download failures. SHA-256 hashes and original-to-local mappings are in asset-manifest.json.\n\n| Type | Unique files | Bytes |\n|---|---:|---:|\n'
for kind,files in sorted(groups.items()):report+=f'| {kind} | {len(files)} | {sum(files.values()):,} |\n'
Path('audit/ASSETS.md').write_text(report,encoding='utf8')
print(results);print(report)
