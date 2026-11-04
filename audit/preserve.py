from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urljoin,urlparse,unquote
import requests,re,json,hashlib,concurrent.futures,threading,tinycss2
ROOT=Path(__file__).resolve().parents[1]
BASE='https://kennethteetersfoundation.org'
ASSETS=ROOT/'public/assets'; DATA=ROOT/'src/data'; STYLES=ROOT/'src/styles'
for d in [ASSETS,DATA,STYLES]:d.mkdir(parents=True,exist_ok=True)
manifest=json.loads((ROOT/'audit/asset-manifest.json').read_text(encoding='utf8')) if (ROOT/'audit/asset-manifest.json').exists() else {};failed=[];lock=threading.RLock(); hashes={v['sha256']:v['local'] for v in manifest.values()}; reserved={v['local']:v['sha256'] for v in manifest.values()}
def get(url):
 r=requests.get(url,timeout=60);r.raise_for_status();return r

def asset(url):
 url=url.replace('&amp;','&');url=urljoin(BASE,url)
 if url.startswith('data:'):return url
 with lock:
  if url in manifest:return manifest[url]['local']
 try:
  r=get(url);ext=Path(unquote(urlparse(url).path)).suffix.lower()
  category='fonts' if ext in ['.woff','.woff2','.ttf','.eot'] else 'documents' if ext=='.pdf' else 'media' if ext in ['.webm','.mp4'] else 'images'
  name=Path(unquote(urlparse(url).path)).name
  if len(name)>100:name=name[:55]+'-'+hashlib.sha256(url.encode()).hexdigest()[:12]+ext
  if not ext:name=hashlib.sha256(url.encode()).hexdigest()[:12]+'.bin'
  sha=hashlib.sha256(r.content).hexdigest()
  with lock:
   if sha in hashes:local=hashes[sha]
   else:
    local='/assets/'+category+'/'+name
    if local in reserved and reserved[local]!=sha:local='/assets/'+category+'/'+Path(name).stem+'-'+sha[:8]+ext
    target=ROOT/'public'/local.lstrip('/');target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(r.content);reserved[local]=sha;hashes[sha]=local
   manifest[url]={'local':local,'bytes':len(r.content),'sha256':sha,'contentType':r.headers.get('Content-Type')}
  return local
 except Exception as e:
  failed.append({'url':url,'error':str(e)});return url

def localize_css(css,origin):
 def sub(m):
  u=m.group(1).strip(' \"\'')
  if u.startswith(('data:','#')):return m.group(0)
  full=urljoin(origin,u)
  return 'url("'+asset(full)+'")'
 css=re.sub(r'url\(([^)]+)\)',sub,css)
 css=re.sub(r'/\*# sourceMappingURL=.*?\*/','',css,flags=re.S)
 return css

def scope_css(css,scope):
 out=[]
 for rule in tinycss2.parse_stylesheet(css,skip_comments=True,skip_whitespace=True):
  if rule.type=='qualified-rule':
   sel=tinycss2.serialize(rule.prelude)
   sels=[]
   selector_groups=[]; group=[]
   for token in rule.prelude:
    if token.type=='literal' and token.value==',':
     selector_groups.append(tinycss2.serialize(group)); group=[]
    else: group.append(token)
   selector_groups.append(tinycss2.serialize(group))
   for s in selector_groups:
    s=re.sub(r'(?<![\w-])body(?![\w-])',scope,s.strip())
    s=re.sub(r'(?<![\w-])html(?![\w-])',scope,s)
    sels.append(s if s.startswith(scope) else scope+' '+s)
   out.append(','.join(sels)+'{'+tinycss2.serialize(rule.content)+'}')
  elif rule.type=='at-rule':
   pre=tinycss2.serialize(rule.prelude)
   if rule.content is None: continue
   if rule.lower_at_keyword in ['media','supports','layer','container']:
    out.append('@'+rule.at_keyword+pre+'{'+scope_css(tinycss2.serialize(rule.content),scope)+'}')
   else:out.append(tinycss2.serialize([rule]))
 return '\n'.join(out)

pages={}
for slug in ['home','2024-gallery','2025-gallery','2026-gallery']:
 print('Extracting',slug,flush=True)
 soup=BeautifulSoup((ROOT/'audit'/f'{slug}.txt').read_text(encoding='utf8'),'html.parser')
 main=soup.select_one('#et-main-area')
 for tag in main.select('script,style'):tag.decompose()
 for tag in main.find_all(True):
  for attr in list(tag.attrs):
   if attr.startswith('on'):del tag[attr]
   if attr.startswith('data-') and attr!='data-per_page':del tag[attr]
  for attr in ['src','poster']:
   if tag.get(attr) and not tag.name=='iframe':tag[attr]=asset(tag[attr])
  if tag.get('srcset'):
   tag['srcset']=', '.join(asset(i.strip().split()[0])+' '+' '.join(i.strip().split()[1:]) for i in tag['srcset'].split(','))
  if tag.get('style'):tag['style']=localize_css(tag['style'],BASE)
  if tag.name=='a':
   href=tag.get('href','')
   if '/wp-content/' in href:tag['href']=asset(href)
   elif href.startswith(BASE):tag['href']=href[len(BASE):] or '/'
   if tag.get('target')=='_blank':tag['rel']='noopener noreferrer'
  if tag.name=='img' and not tag.get('alt'):tag['alt']=tag.get('title','') if tag.find_parent('a') else tag.get('alt','')
  if tag.name=='iframe':tag['title']='A Local Veteran Helping Veterans in Bakersfield';tag['loading']='lazy'
  if tag.name=='source' and '.webm' in tag.get('src',''):tag['type']='video/webm'
  if tag.name=='video':tag['preload']='metadata';tag['aria-label']='Waving American flag'
 for tag in main.select('.et_animated'):
  tag['data-migration-animate']='true';tag['class']=[c for c in tag.get('class',[]) if c!='et_animated']
 for tag in main.select('.et_pb_preload'):tag['class'].remove('et_pb_preload')
 # Standalone native slideshow: first item is visible before hydration.
 for gallery in main.select('.et_pb_gallery_fullwidth'):
  for i,item in enumerate(gallery.select('.et_pb_gallery_item')):
   if i==0:item['class']=item.get('class',[])+['et-pb-active-slide']
 # Preserve local static content with no scripts or runtime builder data.
 html=str(main)
 DATA.joinpath(slug+'.html').write_text(html,encoding='utf8')
 css=[]
 for el in soup.find_all(['style','link']):
  if el.name=='style':css.append(localize_css(el.get_text(),BASE))
  elif el.get('href') and ('stylesheet' in el.get('rel',[]) or el.get('as')=='style'):
   # Admin/block editor and hosting UI styles have no public content here.
   if el.get('id') in ['wp-theme-css','wp-components-css','godaddy-styles-css','mediaelement-css','wp-mediaelement-css']:continue
   url=el['href'];content=get(url).text;css.append(localize_css(content,url))
 scope='.source-'+slug
 STYLES.joinpath(slug+'.css').write_text('/* Preserved source layout; selectors scoped to this route. */\n'+scope_css('\n'.join(css),scope),encoding='utf8')
 metas={x.get('name') or x.get('property'):x.get('content') for x in soup.select('meta[name],meta[property]')}
 schema=json.loads(soup.select_one('script.yoast-schema-graph').string)
 def transform(x):
  if isinstance(x,dict):return {k:transform(v) for k,v in x.items()}
  if isinstance(x,list):return [transform(v) for v in x]
  if isinstance(x,str) and '/wp-content/' in x:return BASE+asset(x)
  return x
 schema=transform(schema)
 pages[slug]={'title':soup.title.string,'description':metas.get('description'),'path':'/' if slug=='home' else '/'+slug+'/', 'modified':metas.get('article:modified_time'),'bodyClasses':' '.join(soup.body.get('class',[])),'image':asset(metas['og:image']),'schema':schema}
for el in soup.select('link[rel=icon],link[rel=apple-touch-icon]'):asset(el['href'])
DATA.joinpath('pages.json').write_text(json.dumps(pages,ensure_ascii=False,indent=2),encoding='utf8')
(ROOT/'audit/asset-manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf8')
(ROOT/'audit/asset-failures.json').write_text(json.dumps(failed,indent=2),encoding='utf8')
print('ASSETS',len(manifest),'UNIQUE',len(hashes),'BYTES',sum((ROOT/'public'/v.lstrip('/')).stat().st_size for v in hashes.values()),'FAILURES',len(failed),flush=True)
