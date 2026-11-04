import requests,pathlib,concurrent.futures
base='https://kennethteetersfoundation.org'
paths=['/','/2024-gallery/','/2025-gallery/','/2026-gallery/','/robots.txt','/sitemap_index.xml','/wp-sitemap.xml','/wp-json/wp/v2/pages?per_page=100','/wp-json/wp/v2/posts?per_page=100','/wp-json/wp/v2/media?per_page=100']
def fetch(p):
 r=requests.get(base+p,timeout=45); name=p.strip('/').replace('/','_').replace('?','_') or 'home'; pathlib.Path('refferences/audit/'+name+'.txt').write_text(r.text,encoding='utf8'); return p,r.status_code,len(r.content),r.url
for x in concurrent.futures.ThreadPoolExecutor(8).map(fetch,paths): print(x)
