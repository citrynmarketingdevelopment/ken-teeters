import requests,json
origin='http://127.0.0.1:3001'
paths=['/','/2024-gallery/','/2025-gallery/','/2026-gallery/','/sitemap.xml','/robots.txt','/assets/documents/aplication.pdf','/nonexistent-page/','/sitemap_index.xml','/page-sitemap.xml','/wp-sitemap.xml','/wp-content/uploads/2026/03/aplication.pdf','/2024-gallery']
results=[]
for path in paths:
 r=requests.get(origin+path,allow_redirects=False,timeout=20)
 results.append({'path':path,'status':r.status_code,'location':r.headers.get('Location'),'type':r.headers.get('Content-Type')})
 if path=='/nonexistent-page/':assert r.status_code==404
 elif path in paths[8:]:assert r.status_code==308
 else:assert r.status_code==200
 if path in paths[:4]:assert 'rel="canonical"' in r.text and 'noindex' not in r.text
open('audit/production-http.json','w',encoding='utf8').write(json.dumps(results,indent=2))
print(json.dumps(results,indent=2))
