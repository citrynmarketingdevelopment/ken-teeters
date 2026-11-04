import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.cwd();
const pages=JSON.parse(await fs.readFile('src/data/pages.json','utf8'));
const manifest=JSON.parse(await fs.readFile('audit/asset-manifest.json','utf8'));
const issues=[];
for(const [source,asset] of Object.entries(manifest)){
 try {const bytes=await fs.readFile(path.join(root,'public',asset.local));if(crypto.createHash('sha256').update(bytes).digest('hex')!==asset.sha256)issues.push(`Asset integrity: ${source}`);}catch{issues.push(`Missing asset: ${asset.local}`);}
}
const forbidden=/https?:\/\/kennethteetersfoundation\.org\/(?:wp-content|wp-json|wp-includes)\//i;
const assetPaths=new Set();
for(const [key,page] of Object.entries(pages)){
 const html=await fs.readFile(`src/data/${key}.html`,'utf8');
 if(forbidden.test(html)||/<script\b/i.test(html)||/\son\w+=/i.test(html))issues.push(`Runtime dependency/script: ${key}`);
 for(const match of html.matchAll(/(?:src|href|poster)="(\/assets\/[^"#?]+)"/g))assetPaths.add(match[1]);
 for(const match of html.matchAll(/href="(\/[^"#?]*)"/g)){
  if(!match[1].startsWith('/assets/')&&!Object.values(pages).some(p=>p.path===match[1]))issues.push(`Broken internal link: ${match[1]}`);
 }
 if(!html.includes('id="main-content"'))issues.push(`Missing main landmark: ${key}`);
 console.log(`Content: ${page.path} — preserved ${[...html.matchAll(/<img\b/g)].length} images`);
}
for(const file of await fs.readdir('src/styles')){
 const css=await fs.readFile(`src/styles/${file}`,'utf8');
 if(forbidden.test(css)||/https?:\/\/(?:fonts\.gstatic|fonts\.googleapis)/.test(css))issues.push(`Remote style dependency: ${file}`);
 for(const match of css.matchAll(/url\(["']?(\/assets\/[^"')?#]+)/g))assetPaths.add(match[1]);
}
for(const asset of assetPaths){try{await fs.access(path.join(root,'public',asset));}catch{issues.push(`Missing referenced asset: ${asset}`);}}
if(process.env.CHECK_HTTP){
 const base='http://127.0.0.1:3000';
 for(const route of [...Object.values(pages).map(p=>p.path),'/sitemap.xml','/robots.txt','/assets/documents/aplication.pdf']){
  const r=await fetch(base+route);if(!r.ok)issues.push(`HTTP ${r.status}: ${route}`);
  if(route.endsWith('/')&&r.ok){const html=await r.text();if(!html.includes('rel="canonical"'))issues.push(`Canonical missing: ${route}`);}
  console.log(`HTTP ${r.status}: ${route}`);
 }
 const unknown=await fetch(base+'/nonexistent-page/');if(unknown.status!==404)issues.push('Unknown route must return 404');
}
console.log(`${Object.keys(pages).length} pages, ${Object.keys(manifest).length} asset URLs, ${new Set(Object.values(manifest).map(a=>a.local)).size} unique local files.`);
if(issues.length){console.error(issues.join('\n'));process.exitCode=1;}else console.log('All migration integrity checks passed.');
