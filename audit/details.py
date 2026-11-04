from pathlib import Path
from bs4 import BeautifulSoup
import requests,json
p=Path('refferences/audit')
r=requests.get('https://kennethteetersfoundation.org/page-sitemap.xml'); (p/'page-sitemap.xml').write_text(r.text,encoding='utf8');print(r.text[:800])
s=BeautifulSoup((p/'home.txt').read_text(encoding='utf8'),'html.parser')
for x in s.find_all(['link','style']):
 if x.name=='link': print(str(x)[:500])
 else: print('STYLE',x.get('id'),len(x.text))
print('BODY',s.body.get('class')); print(str(s.select_one('#et-main-area'))[:4500]); print(str(s.select_one('.ba-gallery'))[-1000:])
