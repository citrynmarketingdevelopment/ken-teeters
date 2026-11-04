import { getImageProps } from 'next/image';

const attribute = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

export function workPreviewMarkup() {
  const projects = [
    {src:'/assets/images/bathroom-after-1.webp',width:1290,height:968,alt:'Ralph’s completed shower with a seat and support rails',name:'Ralph J. Lopez',description:'A safer, more accessible bathroom'},
    {src:'/assets/images/Image_20260624_130009_879.jpg',width:386,height:513,alt:'The access ramp at Edmond’s home',name:'Edmond Sweeney Jr.',description:'Support through our home remodel program'},
  ];
  const photos = projects.map(project => {
    const {props}=getImageProps({src:project.src,width:project.width,height:project.height,alt:project.alt,sizes:'(max-width: 767px) 43vw, 28vw'});
    return `<figure><div class="community-work-preview__photo"><img src="${attribute(props.src)}" srcset="${attribute(props.srcSet??'')}" sizes="${attribute(props.sizes??'')}" alt="${attribute(project.alt)}" width="${project.width}" height="${project.height}" loading="lazy" decoding="async"></div><figcaption><strong>${project.name}</strong><span>${project.description}</span></figcaption></figure>`;
  }).join('');
  return `<section class="community-work-preview" aria-labelledby="community-work-title"><div class="community-work-preview__inner"><div class="community-work-preview__copy"><p class="community-work-preview__label">Our work in the community</p><h2 id="community-work-title">Safer homes for local veterans.</h2><p>Meet Ralph and Edmond. See how practical help at home supports the veterans in our community.</p><a class="community-work-preview__link" href="/our-work/#before-afters">See Our Work <span aria-hidden="true">&rarr;</span></a></div><div class="community-work-preview__projects">${photos}</div></div></section>`;
}
