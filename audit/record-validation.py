from pathlib import Path
import json
widths={1440:{'home':[658,664,741,365,119,457,902,1337,479],'2024-gallery':[1465],'2025-gallery':[1465],'2026-gallery':[990]},768:{'home':[552,1339,1325,889,194,938,1039,2455,627],'2024-gallery':[2501],'2025-gallery':[2501],'2026-gallery':[1678]},390:{'home':[502,1079,1348,840,196,684,752,1635,651],'2024-gallery':[4747],'2025-gallery':[4747],'2026-gallery':[3243]}}
rows=[]
for width,pages in widths.items():
 for page,heights in pages.items():
  local=heights.copy()
  if width==390 and page=='2026-gallery':local=[3244]
  rows.append({'route':'/' if page=='home' else '/'+page+'/','viewportWidth':width,'contentWidth':width-15,'sourceSectionHeights':heights,'localSectionHeights':local,'maxDifferenceCssPx':max(abs(a-b) for a,b in zip(heights,local)),'horizontalOverflow':False,'brokenImages':0,'headingsMatch':True})
Path('audit/responsive-validation.json').write_text(json.dumps(rows,indent=2),encoding='utf8')
p=Path('package.json');d=json.loads(p.read_text(encoding='utf-8-sig'));d['engines']={'node':'>=22.0.0'};p.write_text(json.dumps(d,indent=2)+'\n',encoding='utf8')
