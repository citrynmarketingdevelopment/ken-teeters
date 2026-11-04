'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, XIcon } from '@phosphor-icons/react';

type Photo={src:string;width:number;height:number;caption:string};
type Group={title:string;description:string;photos:Photo[]};
function ProjectImage({photo,project,onOpen}:{photo:Photo;project:string;onOpen:()=>void}) {
  const [status,setStatus]=useState<'loading'|'ready'|'error'>('loading');
  const [attempt,setAttempt]=useState(0);
  return <div className="work-stage__image" aria-busy={status==='loading'}>
    {status==='error'?<div className="work-image-error" role="status"><p>This photo couldn’t load.</p><button type="button" onClick={()=>{setStatus('loading');setAttempt(value=>value+1);}}>Retry photo</button></div>:<button type="button" aria-label={`Enlarge: ${photo.caption}, ${project}`} onClick={onOpen}>
      {status==='loading'?<span className="work-image-loading" aria-hidden="true">Loading photo…</span>:null}
      <Image key={attempt} src={photo.src} alt={`${photo.caption}, ${project}`} width={photo.width} height={photo.height} sizes="(max-width: 767px) 42vw, 28vw" onLoad={()=>setStatus('ready')} onError={()=>setStatus('error')} />
    </button>}
  </div>;
}
export function WorkPhotos({groups,project}:{groups:Group[];project:string}) {
  const photos=groups.flatMap(group=>group.photos.map(photo=>({...photo,group:group.title})));
  const [selected,setSelected]=useState<number|null>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  const trigger=useRef<HTMLButtonElement|null>(null);
  const open=selected!==null;
  useEffect(()=>{
    if(!open||!dialog.current)return;
    const node=dialog.current;node.showModal();
    const overflow=document.body.style.overflow;document.body.style.overflow='hidden';
    return()=>{node.close();document.body.style.overflow=overflow;trigger.current?.focus({preventScroll:true});};
  },[open]);
  const move=(direction:number)=>setSelected(current=>current===null?null:(current+direction+photos.length)%photos.length);
  return <>
    <div className={`work-comparisons ${groups.length===2?'work-comparisons--before-after':''}`}>
      {groups.map(group=><section className="work-comparison-group" key={group.title} aria-label={`${project}: ${group.title}`}>
        <h4>{group.title==='Interior before the remodel'?'Kitchen before the remodel':group.title}</h4>
        <p>{group.description}</p>
        <div className="work-comparison-photos">{group.photos.map(photo=><figure key={photo.src}>
          <ProjectImage photo={photo} project={project} onOpen={()=>{trigger.current=document.activeElement as HTMLButtonElement;setSelected(photos.findIndex(item=>item.src===photo.src));}} />
          <figcaption>{photo.caption}</figcaption>
        </figure>)}</div>
      </section>)}
      <p className="work-comparisons__hint">Select any photo to enlarge it.</p>
    </div>
    {selected!==null?<dialog ref={dialog} className="work-photo-viewer" aria-label={`${project} photographs`} onCancel={()=>setSelected(null)} onClick={event=>{if(event.target===event.currentTarget)setSelected(null);}} onKeyDown={event=>{
      if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}
      if(event.key==='ArrowRight'){event.preventDefault();move(1);}
      if(event.key==='Tab'){
        const controls=Array.from(event.currentTarget.querySelectorAll('button'));
        if(event.shiftKey&&document.activeElement===controls[0]){event.preventDefault();controls.at(-1)?.focus();}
        else if(!event.shiftKey&&document.activeElement===controls.at(-1)){event.preventDefault();controls[0]?.focus();}
      }
    }}>
      <div className="work-photo-viewer__content"><header><div><p>{project}</p><h2>{photos[selected].group}</h2></div><button type="button" onClick={()=>setSelected(null)} aria-label="Close project photograph"><XIcon size={24}/></button></header>
        <figure><Image src={photos[selected].src} alt={photos[selected].caption} width={photos[selected].width} height={photos[selected].height} unoptimized /><figcaption aria-live="polite">{photos[selected].caption}</figcaption></figure>
        <footer><button type="button" onClick={()=>move(-1)} aria-label="Previous project photograph"><ArrowLeftIcon size={20}/> Previous</button><span>{selected+1} of {photos.length}</span><button type="button" onClick={()=>move(1)} aria-label="Next project photograph">Next <ArrowRightIcon size={20}/></button></footer>
      </div>
    </dialog>:null}
  </>;
}
