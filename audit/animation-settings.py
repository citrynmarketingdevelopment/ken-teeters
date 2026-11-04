from pathlib import Path
from bs4 import BeautifulSoup
import re,json
for p in Path('src/data').glob('*.html'):
 source=Path('audit/'+p.stem+'.txt').read_text(encoding='utf8')
 match=re.search(r'var et_animation_data = (\[.*?\]);',source)
 if not match:continue
 s=BeautifulSoup(p.read_text(encoding='utf8'),'html.parser')
 for item in json.loads(match.group(1)):
  for node in s.select('.'+item['class']):
   node['data-migration-animate']=item['style']
   node['style']=node.get('style','')+';--entrance-duration:'+item['duration']+';--entrance-delay:'+item['delay']+';--entrance-intensity:'+item['intensity']+';--entrance-easing:'+item['speed_curve']
 p.write_text(str(s),encoding='utf8')
