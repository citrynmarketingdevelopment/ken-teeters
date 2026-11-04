import type { MetadataRoute } from 'next';
import { pages } from '@/lib/content';
export default function sitemap():MetadataRoute.Sitemap {
  return [...Object.values(pages).map(page=>({url:'https://kennethteetersfoundation.org'+page.path,lastModified:page.modified})), ...['our-work','get-involved','events','application'].map(slug=>({url:`https://kennethteetersfoundation.org/${slug}/`}))];
}
