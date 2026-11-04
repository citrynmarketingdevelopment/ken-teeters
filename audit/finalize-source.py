from pathlib import Path
p=Path('src/components/Interactions.tsx');s=p.read_text(encoding='utf8').replace(" const dialog=useRef", " const isOpen=viewer!==null;\n const dialog=useRef").replace('  if(!viewer)return;','  if(!isOpen)return;').replace(' },[Boolean(viewer)]);',' },[isOpen]);');p.write_text(s,encoding='utf8')
p=Path('src/app/not-found.tsx');s=p.read_text(encoding='utf8');s="import Link from 'next/link';\n"+s.replace('<a href="/">Back Home</a>','<Link href="/">Back Home</Link>');p.write_text(s,encoding='utf8')
# Deduplicate identical local font faces across the four route stylesheets.
import re
seen=set();fonts=[]
for p in Path('src/styles').glob('*.css'):
 if p.name in ['global.css','fonts.css']:continue
 s=p.read_text(encoding='utf8')
 def font(m):
  rule=m.group()
  if rule not in seen:seen.add(rule);fonts.append(rule)
  return ''
 s=re.sub(r'@font-face\s*\{[^}]*\}',font,s)
 p.write_text(s,encoding='utf8')
Path('src/styles/fonts.css').write_text('\n\n'.join(fonts),encoding='utf8')
p=Path('src/app/layout.tsx');s=p.read_text(encoding='utf8').replace("import '@/styles/home.css';","import '@/styles/fonts.css';\nimport '@/styles/home.css';");p.write_text(s,encoding='utf8')
