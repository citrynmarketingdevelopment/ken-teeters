from pathlib import Path
from bs4 import BeautifulSoup
for p in Path('src/data').glob('*.html'):
 s=BeautifulSoup(p.read_text(encoding='utf8'),'html.parser')
 for row in s.select('.et_pb_row,.et_pb_row_inner'):
  columns=row.find_all(class_='et_pb_column',recursive=False)
  sizes=[next((c.removeprefix('et_pb_column_') for c in col.get('class',[]) if c in ['et_pb_column_1_4','et_pb_column_1_6']),None) for col in columns]
  cls=None
  if sizes==['1_4']*4:cls='et_pb_row_4col'
  elif len(sizes)>1 and all(sizes):cls='et_pb_row_'+'_'.join(size.replace('_','-') for size in sizes)
  if cls and cls not in row.get('class',[]):row['class']=row.get('class',[])+[cls]
 p.write_text(str(s),encoding='utf8')
