import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pages, type PageKey } from '@/lib/content';
import { Interactions } from './Interactions';

/** Trusted, locally preserved static content. No remote HTML or scripts execute. */
export async function MigrationPage({pageKey}:{pageKey:PageKey}){
 const page=pages[pageKey];
 const html=await readFile(path.join(process.cwd(),'src/data',pageKey+'.html'),'utf8');
 return <div className={`migration-page source-${pageKey} ${page.bodyClasses}`}>
   <a className="skip-link" href="#main-content">Skip to content</a>
   <div className={page.bodyClasses}>
     <div id="page-container"><div id="et-boc" className="et-boc" dangerouslySetInnerHTML={{__html:html}}/></div>
   </div>
   <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(page.schema).replace(/</g,'\\u003c')}}/>
   <Interactions pageKey={pageKey}/>
 </div>;
}
