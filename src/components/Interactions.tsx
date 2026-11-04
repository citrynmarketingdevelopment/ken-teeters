'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type Photo={src:string;alt:string};
type Viewer={photos:Photo[];index:number};
export function Interactions({pageKey}:{pageKey:string}){
 const [viewer,setViewer]=useState<Viewer|null>(null);
 const isOpen=viewer!==null;
 const dialog=useRef<HTMLDialogElement>(null);
 const returnFocus=useRef<HTMLElement|null>(null);
 useEffect(()=>{
  const root=document.querySelector(`.source-${pageKey}`);
  if(!root)return;
  const cleanup:Array<()=>void>=[];
  // Replace builder slideshow behavior with local, dependency-free controls.
  root.querySelectorAll<HTMLElement>('.et_pb_gallery_fullwidth').forEach(gallery=>{
   const slides=Array.from(gallery.querySelectorAll<HTMLElement>('.et_pb_gallery_item'));
   let active=0;
   const arrows=document.createElement('div');arrows.className='et-pb-slider-arrows';
   const dots=document.createElement('div');dots.className='et-pb-controllers';
   const activate=(index:number)=>{
    active=(index+slides.length)%slides.length;
    slides.forEach((slide,i)=>{slide.classList.toggle('et-pb-active-slide',i===active);slide.setAttribute('aria-hidden',String(i!==active));});
    dots.querySelectorAll('button').forEach((dot,i)=>{dot.classList.toggle('et-pb-active-control',i===active);dot.setAttribute('aria-pressed',String(i===active));});
   };
   for(const [label,direction,cls] of [['Previous image',-1,'et-pb-arrow-prev'],['Next image',1,'et-pb-arrow-next']] as const){
    const button=document.createElement('button');button.type='button';button.className=cls;button.setAttribute('aria-label',label);button.addEventListener('click',()=>activate(active+direction));arrows.append(button);
   }
   slides.forEach((_,i)=>{const dot=document.createElement('button');dot.type='button';dot.setAttribute('aria-label',`Show image ${i+1}`);dot.addEventListener('click',()=>activate(i));dots.append(dot);});
   gallery.append(arrows,dots);activate(0);
   const onKey=(event:KeyboardEvent)=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();activate(active+(event.key==='ArrowRight'?1:-1));}};
   gallery.addEventListener('keydown',onKey);
   cleanup.push(()=>{arrows.remove();dots.remove();gallery.removeEventListener('keydown',onKey);});
  });
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('migration-visible');observer.unobserve(entry.target);}});},{threshold:0.06});
  root.querySelectorAll('[data-migration-animate]').forEach(el=>observer.observe(el));
  cleanup.push(()=>observer.disconnect());
  root.querySelectorAll<HTMLVideoElement>('.et_pb_section_video_bg video').forEach(video=>{video.muted=true;void video.play().catch(()=>{});});
  const onClick=(event:Event)=>{
   const anchor=(event.target as Element).closest<HTMLAnchorElement>('a');
   if(!anchor||!anchor.matches('.et_pb_gallery_image a,.et_pb_image a.et_pb_lightbox_image'))return;
   event.preventDefault();
   const group=anchor.closest('.et_pb_gallery')||root;
   const links=Array.from(group.querySelectorAll<HTMLAnchorElement>('.et_pb_gallery_image a,.et_pb_image a.et_pb_lightbox_image'));
   const photos=links.map(link=>({src:link.getAttribute('href')||'',alt:link.querySelector('img')?.alt||link.title||'Event photograph'}));
   returnFocus.current=anchor;
   setViewer({photos,index:links.indexOf(anchor)});
  };
  root.addEventListener('click',onClick);cleanup.push(()=>root.removeEventListener('click',onClick));
  return ()=>cleanup.forEach(fn=>fn());
 },[pageKey]);
 useEffect(()=>{
  if(!isOpen)return;
  const node=dialog.current;if(!node)return;
  node.showModal();
  const previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';
  const onKey=(event:KeyboardEvent)=>{
   if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
    event.preventDefault();const delta=event.key==='ArrowRight'?1:-1;
    setViewer(current=>current?{...current,index:(current.index+delta+current.photos.length)%current.photos.length}:null);
   }
  };
  node.addEventListener('keydown',onKey);
  return ()=>{node.removeEventListener('keydown',onKey);node.close();document.body.style.overflow=previousOverflow;returnFocus.current?.focus();};
 },[isOpen]); // Open once; changing photos keeps the dialog and keyboard focus stable.
 const move=(delta:number)=>setViewer(current=>current?{...current,index:(current.index+delta+current.photos.length)%current.photos.length}:null);
 return viewer?<dialog className="photo-viewer" ref={dialog} aria-label="Photo gallery" onCancel={()=>setViewer(null)} onClick={event=>{if(event.target===event.currentTarget)setViewer(null);}}>
   <button type="button" className="viewer-close" aria-label="Close gallery" onClick={()=>setViewer(null)}>×</button>
   <button type="button" className="viewer-prev" aria-label="Previous photo" onClick={()=>move(-1)}>‹</button>
   <figure><div className="viewer-image"><Image src={viewer.photos[viewer.index].src} alt={viewer.photos[viewer.index].alt} fill unoptimized sizes="95vw" style={{objectFit:'contain'}}/></div><figcaption aria-live="polite">{viewer.index+1} / {viewer.photos.length}</figcaption></figure>
   <button type="button" className="viewer-next" aria-label="Next photo" onClick={()=>move(1)}>›</button>
 </dialog>:null;
}
