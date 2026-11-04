import { notFound } from 'next/navigation';
import { GalleryPage } from '@/components/gallery/GalleryPage';
import { getAlbum } from '@/data/galleries';
import { pages, pageMetadata, type PageKey } from '@/lib/content';
const galleries=['2024-gallery','2025-gallery','2026-gallery'] as const;
export const dynamicParams=false;
export function generateStaticParams(){return galleries.map(slug=>({slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  if(!(slug in pages)||slug==='home') notFound();
  return pageMetadata(slug as PageKey);
}
export default async function Gallery({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  if(!galleries.includes(slug as typeof galleries[number])) notFound();
  const album = getAlbum(slug);
  if (!album) notFound();
  return <GalleryPage album={album}/>;
}
