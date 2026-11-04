from bs4 import BeautifulSoup
from pathlib import Path
for name in ['home','2024-gallery','2025-gallery','2026-gallery']:
 s=BeautifulSoup(Path('audit/'+name+'.txt').read_text(encoding='utf8'),'html.parser')
 print(name)
 for script in s.select('#et-main-area script'):print(script.get_text()[:16000])
