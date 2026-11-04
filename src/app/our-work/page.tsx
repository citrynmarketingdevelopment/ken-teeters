import Image from 'next/image';
import Link from 'next/link';
import work from '@/data/work-projects.json';
import { WorkPhotos } from '@/components/WorkPhotos';
import { ArrowRightIcon, HouseLineIcon, WrenchIcon, HandHeartIcon } from '@phosphor-icons/react/ssr';

export const metadata = { alternates: {canonical:'/our-work/'}, title: 'Our Work | Kenneth Teeters Foundation', description: 'Home repairs, accessibility improvements, and practical support for local veterans. Learn about assistance and see our work.' };
export default function OurWorkPage() {
  return <div className="foundation-page"><main id="main-content" className="foundation-shell">
    <section className="foundation-hero">
      <div><p className="foundation-kicker">OUR WORK</p><h1>Service deserves<br />support.</h1><p>Practical help for local veterans, from safer homes to reliable transportation.</p><Link className="foundation-button" href="/application/">Apply Now <ArrowRightIcon size={19} /></Link></div>
      <figure className="hero-photo"><Image src="/assets/images/Image_20251020_153720_932.png" alt="Ralph J. Lopez at the Kern County World War II Veterans Memorial" width={1153} height={1537} sizes="(max-width: 767px) 100vw, 50vw" preload /><figcaption>Supporting veterans here in our community.</figcaption></figure>
    </section>
    <nav className="section-links" aria-label="Our Work sections"><a href="#what-we-do">What We Do</a><a href="#who-qualifies">Who Qualifies</a><a href="#before-afters">Before &amp; Afters</a><a href="#testimonials">Testimonials</a></nav>
    <section id="what-we-do" className="foundation-section"><h2>Help that makes everyday life easier.</h2><p className="section-lead">We focus on practical needs that can make a lasting difference for veterans facing hardship.</p>
      <div className="service-list">
        <article><HouseLineIcon size={30} /><div><h3>Home repairs &amp; accessibility</h3><p>Safer bathrooms, easier access, and essential home repairs that support day-to-day independence.</p></div></article>
        <article><WrenchIcon size={30} /><div><h3>Vehicle maintenance</h3><p>Help with vehicle repairs and maintenance for veterans facing financial challenges.</p></div></article>
        <article><HandHeartIcon size={30} /><div><h3>Guidance &amp; community support</h3><p>Experienced volunteers help veterans navigate needs, including the VA disability rating process.</p></div></article>
      </div>
    </section>
    <section id="who-qualifies" className="foundation-section eligibility"><div><h2>Who qualifies?</h2><p>Local veterans experiencing hardship are encouraged to apply. The Board reviews each request individually.</p><Link className="foundation-text-link" href="/application/">Apply Now <ArrowRightIcon size={18} /></Link></div><div className="eligibility-details"><h3>What we consider</h3><p>Applicant need, situational hardship, and the availability of funds. Submitting an application does not guarantee selection.</p><h3>What to have ready</h3><p>Your contact details, service branch and years, and a short explanation of the assistance you need. The application also asks whether a DD214 is available.</p><h3>After you apply</h3><p>A decision is to be provided within 90 days of Board review. For questions about your circumstances, call <a href="tel:+16614961400">661-496-1400</a>.</p></div></section>
    <section id="before-afters" className="foundation-section work-projects">
      <div className="work-projects__heading"><h2>Our work, one home at a time.</h2><p className="section-lead">Two veterans. Two home projects. See what changed and the work each project involved.</p></div>
      <nav className="work-project-nav" aria-label="Community projects">{work.projects.map(project=><a href={`#${project.id}`} key={project.id}>{project.id==='ralph-lopez'?'Ralph J. Lopez':'Edmond Sweeney Jr.'}</a>)}</nav>
      {work.projects.map(project=><article id={project.id} className="work-project" key={project.id} aria-labelledby={`${project.id}-title`}>
        <header className="work-project__intro"><div className="work-project__person"><Image src={project.portrait.src} alt={project.id==='ralph-lopez'?'Ralph J. Lopez at the Kern County World War II Veterans Memorial':'Edmond Sweeney Jr. at his home'} width={project.portrait.width} height={project.portrait.height} sizes="64px" /><span>{project.id==='ralph-lopez'?'Ralph J. Lopez':'Edmond Sweeney Jr.'}</span></div>
          <div><h3 id={`${project.id}-title`}>{project.id==='ralph-lopez'?'Ralph’s bathroom renovation':'Edmond’s home remodel'}</h3><p>{project.summary}</p><div className="work-project__scope"><h4>What we did</h4><p>{project.work}</p></div>
          </div>
        </header>
        <WorkPhotos groups={project.groups} project={project.id==='ralph-lopez'?'Ralph J. Lopez':'Edmond Sweeney Jr.'} />
      </article>)}
    </section>
    <section className="foundation-section work-coverage" aria-labelledby="work-coverage-title"><div><h2 id="work-coverage-title">Veterans helping veterans in Bakersfield.</h2><p>23ABC shared the story of a legally blind Vietnam veteran receiving a bathroom renovation from a local nonprofit.</p><a className="foundation-text-link" href="https://www.turnto23.com/news/in-your-neighborhood/bakersfield/veterans-helping-veterans-in-bakersfield-with-a-completed-bathroom-renovation" target="_blank" rel="noopener noreferrer">Read the 23ABC story <ArrowRightIcon size={18}/></a><p className="work-project__note">If the video is unavailable, you can read the story on 23ABC.</p></div><div className="work-coverage__video"><iframe src={work.coverageVideo} title="23ABC: A local veteran helping veterans in Bakersfield" loading="lazy" allow="autoplay; fullscreen" allowFullScreen /></div></section>
    <section id="testimonials" className="foundation-section testimonial-section work-testimonials"><div><p className="foundation-kicker">TESTIMONIALS</p><h2>Every veteran has a story.</h2><p>Have we helped you or your family? We would welcome your experience and permission to share it.</p><Link className="foundation-text-link" href="/get-involved/#contact">Contact Us <ArrowRightIcon size={18} /></Link></div></section>
  </main></div>;
}
