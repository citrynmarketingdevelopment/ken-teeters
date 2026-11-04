import type { Metadata } from 'next';
import pages from '@/data/pages.json';
export type PageKey = keyof typeof pages;
export { pages };
export function pageMetadata(key:PageKey): Metadata {
  const page=pages[key];
  return {
    title: page.title,
    description: page.description,
    alternates:{canonical:page.path},
    robots:{index:true,follow:true,googleBot:{index:true,follow:true,'max-image-preview':'large','max-snippet':-1,'max-video-preview':-1}},
    openGraph:{title:page.title,description:page.description,url:page.path,siteName:'Teeters Foundation',locale:'en_US',type:key==='home'?'website':'article',images:[{url:page.image,width:800,height:800,type:'image/jpeg'}],...(key==='home'?{}:{modifiedTime:page.modified})},
    twitter:{card:'summary_large_image',title:page.title,description:page.description,images:[page.image]},
    other:{'article:modified_time':page.modified},
  };
}
