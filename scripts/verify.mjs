import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd();
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));
const manifest=JSON.parse(await fs.readFile('audit/asset-manifest.json','utf8'));
const albums=JSON.parse(await fs.readFile('src/data/galleries.json','utf8'));
const issues=[];
for(const [source,asset] of Object.entries(manifest)){
 try {const bytes=await fs.readFile(path.join(root,'public',asset.local));if(crypto.createHash('sha256').update(bytes).digest('hex')!==asset.sha256)issues.push(`Asset integrity: ${source}`);}catch{issues.push(`Missing asset: ${asset.local}`);}
}
const forbidden=/https?:\/\/kennethteetersfoundation\.org\/(?:wp-content|wp-json|wp-includes)\//i;
const assetPaths=new Set();
const photoIds=new Set();
for(const album of albums){
 const expected=album.year===2026?8:12;
 if(album.photos.length!==expected)issues.push(`Album count: ${album.year}`);
 if(!Object.values(pages).some(page=>page.path===album.path))issues.push(`Album route: ${album.path}`);
 if(!album.photos.some(photo=>photo.id===album.coverId))issues.push(`Missing cover: ${album.year}`);
 const archived=await fs.readFile(`src/data/${album.year}-gallery.html`,'utf8');
 const originalPhotos=[...archived.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map(match=>match[1]);
 if(JSON.stringify(originalPhotos)!==JSON.stringify(album.photos.map(photo=>photo.src)))issues.push(`Changed photo order: ${album.year}`);
 for(const photo of album.photos){
  if(photoIds.has(photo.id))issues.push(`Duplicate photo ID: ${photo.id}`);
  photoIds.add(photo.id);
  if(!photo.src.startsWith('/assets/')||forbidden.test(photo.src))issues.push(`Non-local photograph: ${photo.id}`);
  if(!photo.alt||photo.width<=0||photo.height<=0||photo.thumbnailRatio<=0)issues.push(`Invalid photo metadata: ${photo.id}`);
  assetPaths.add(photo.src);
 }
 console.log(`Album: ${album.year} — ${album.photos.length} original photos, stable IDs, preserved order`);
}
for(const [key,page] of Object.entries(pages)){
 const html=await fs.readFile(`src/data/${key}.html`,'utf8');
 if(forbidden.test(html)||/<script\b/i.test(html)||/\son\w+=/i.test(html))issues.push(`Runtime dependency/script: ${key}`);
 for(const match of html.matchAll(/(?:src|href|poster)="(\/assets\/[^"#?]+)"/g))assetPaths.add(match[1]);
 for(const match of html.matchAll(/href="(\/[^"#?]*)"/g)){
  if(!match[1].startsWith('/assets/')&&!Object.values(pages).some(p=>p.path===match[1])){
   const segments=match[1].split('/').filter(Boolean);
   try {await fs.access(path.join('src/app',...segments,'page.tsx'));}
   catch {issues.push(`Broken internal link: ${match[1]}`);}
  }
 }
 if(!html.includes('id="main-content"'))issues.push(`Missing main landmark: ${key}`);
 console.log(`Archive/content: ${page.path} — preserved ${[...html.matchAll(/<img\b/g)].length} images`);
}
const home=(await fs.readFile('src/data/home.html','utf8')).replace(/\r\n/g,'\n');
if(!home.includes('<!--event-gallery-previews-->'))issues.push('Homepage album insertion point missing');
if(!home.includes('<!--community-work-preview-->')||home.includes('Upcoming Events'))issues.push('Homepage community CTA/removal incomplete');
const work=JSON.parse(await fs.readFile('src/data/work-projects.json','utf8'));
for(const project of work.projects){
 for(const photo of [project.portrait,...project.groups.flatMap(group=>group.photos)])assetPaths.add(photo.src);
}
const retiredHomeSections=new Set(['et_pb_section_4','et_pb_section_5','et_pb_section_6','et_pb_section_7']);
const preservation=JSON.parse(await fs.readFile('audit/modern-galleries/homepage-preservation.json','utf8'));
for(const [section,expectedHash] of Object.entries(preservation.sectionHashes??{})){
 if(retiredHomeSections.has(section))continue; // Approved community redesign; see audit/community-redesign.
 const start=home.indexOf(`et_pb_section ${section} `);
 if(start<0){issues.push(`Missing homepage section: ${section}`);continue;}
 const tagStart=home.lastIndexOf('<div',start);
 const tags=home.slice(tagStart).matchAll(/<div\b[^>]*>|<\/div>/g);
 let depth=0,end=0;
 for(const match of tags){depth+=match[0].startsWith('</')?-1:1;if(depth===0){end=tagStart+match.index+match[0].length;break;}}
 let sectionHtml=home.slice(tagStart,end);
 for(const edit of preservation.separatelyAuthoredChanges??[]){
  if(edit.section===section)sectionHtml=sectionHtml.replace(edit.currentMarkup,edit.originalMarkup);
 }
 const actual=crypto.createHash('sha256').update(sectionHtml).digest('hex');
 if(actual!==expectedHash)issues.push(`Unrelated homepage section changed: ${section}`);
}
for(const file of await fs.readdir('src/styles')){
 const css=await fs.readFile(`src/styles/${file}`,'utf8');
 if(forbidden.test(css)||/https?:\/\/(?:fonts\.gstatic|fonts\.googleapis)/.test(css))issues.push(`Remote style dependency: ${file}`);
 for(const match of css.matchAll(/url\(["']?(\/assets\/[^"')?#]+)/g))assetPaths.add(match[1]);
}
for(const asset of assetPaths){try{await fs.access(path.join(root,'public',asset));}catch{issues.push(`Missing referenced asset: ${asset}`);}}
if(process.env.CHECK_HTTP){
 const base=process.env.VERIFY_BASE_URL||'http://127.0.0.1:3000';
 for(const route of [...Object.values(pages).map(p=>p.path),'/sitemap.xml','/robots.txt','/assets/documents/aplication.pdf']){
  const r=await fetch(base+route);if(!r.ok)issues.push(`HTTP ${r.status}: ${route}`);
  if(route.endsWith('/')&&r.ok){const html=await r.text();if(!html.includes('rel="canonical"'))issues.push(`Canonical missing: ${route}`);
   if(route!=='/'&&(!html.includes('gallery-photo')||!html.includes('<h1')))issues.push(`Gallery SSR content missing: ${route}`);
   if(route==='/'&&!html.includes('home-event-previews__albums'))issues.push('Homepage album previews missing');
  }
  console.log(`HTTP ${r.status}: ${route}`);
 }
 const unknown=await fetch(base+'/nonexistent-page/');if(unknown.status!==404)issues.push('Unknown route must return 404');
 const workResponse=await fetch(base+'/our-work/');
 const workHtml=await workResponse.text();
 if(!workResponse.ok||!work.projects.every(project=>workHtml.includes(`id="${project.id}"`)))issues.push('Our Work project sections missing');
 const homeResponse=await fetch(base+'/'); const homeHtml=await homeResponse.text();
 if(!homeHtml.includes('community-work-preview__link')||homeHtml.includes('Upcoming Events'))issues.push('Homepage CTA/Upcoming Events HTTP check failed');
}
console.log(`${Object.keys(pages).length} pages, ${Object.keys(manifest).length} asset URLs, ${new Set(Object.values(manifest).map(a=>a.local)).size} unique local files.`);
if(issues.length){console.error(issues.join('\n'));process.exitCode=1;}else console.log('All migration integrity checks passed.');
