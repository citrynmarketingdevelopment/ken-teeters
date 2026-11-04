from bs4 import BeautifulSoup
from pathlib import Path
import json
p=Path('refferences/audit')
for name in ['home','2024-gallery','2025-gallery','2026-gallery']:
 s=BeautifulSoup((p/(name+'.txt')).read_text(encoding='utf8'),'html.parser')
 print('\nPAGE',name,'TITLE',s.title.string)
 print('CSS',[(x.get('id'),x.get('href')) for x in s.select('link[rel=stylesheet]')])
 print('LINKS',[(x.get_text(' ',strip=True),x.get('href')) for x in s.select('#et-main-area a')])
 print('SECTIONS',[(x.get('class'),len(str(x))) for x in s.select('.et_pb_section')])
 print('METADATA',[(x.get('name') or x.get('property'),x.get('content')) for x in s.select('meta[name],meta[property]')])
 print('SCRIPTS',[(x.get('id'),x.get('src')) for x in s.select('script')])
print('SITEMAP', (p/'sitemap_index.xml.txt').read_text())
print('PAGES',[(x['id'],x['link'],x['title']['rendered']) for x in json.loads((p/'wp-json_wp_v2_pages_per_page=100.txt').read_text(encoding='utf8'))])
