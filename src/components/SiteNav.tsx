'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CaretDownIcon, ListIcon, XIcon, SunIcon } from '@phosphor-icons/react';

const groups = [
  { label: 'Our Work', href: '/our-work/', items: [['What We Do', 'what-we-do'], ['Who Qualifies', 'who-qualifies'], ['Before & Afters', 'before-afters'], ['Testimonials', 'testimonials']] },
  { label: 'Get Involved', href: '/get-involved/', items: [['Become a Monthly Donor', 'monthly-donor'], ['Donate Your Services', 'donate-services'], ['Contact Us', 'contact']] },
];

export function SiteNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const close = () => { setMobileOpen(false); setExpanded(null); };
  return <header className="site-header" onKeyDown={event => {
    if (event.key === 'Escape') {
      const trigger = expanded ? event.currentTarget.querySelector<HTMLButtonElement>(`button[aria-label="${expanded} sections"]`) : menuButton.current;
      close(); trigger?.focus();
    }
  }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) close(); }}>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="site-nav-shell">
      <Link className="site-brand" href="/" onClick={close}>
        <Image src="/assets/images/Kenneth-Teeters-foundation-icon.png" width={44} height={42} alt="" />
        <span>Kenneth Teeters<span>Foundation</span></span>
      </Link>
      <button className="site-menu-toggle" ref={menuButton} aria-expanded={mobileOpen} aria-controls="site-navigation" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <XIcon size={24} /> : <ListIcon size={24} />}<span>{mobileOpen ? 'Close' : 'Menu'}</span>
      </button>
      <nav id="site-navigation" className={mobileOpen ? 'site-navigation is-open' : 'site-navigation'} aria-label="Main navigation">
        {groups.map(group => <div className="site-nav-group" key={group.href}>
          <div className="site-nav-label">
            <Link href={group.href} onClick={close} aria-current={pathname.startsWith(group.href.slice(0, -1)) ? 'page' : undefined}>{group.label}</Link>
            <button aria-label={`${group.label} sections`} aria-expanded={expanded === group.label} aria-controls={`nav-${group.href.split('/')[1]}`} onClick={() => setExpanded(expanded === group.label ? null : group.label)}><CaretDownIcon size={16} /></button>
          </div>
          <div className="site-dropdown" id={`nav-${group.href.split('/')[1]}`} hidden={expanded !== group.label}>
            {group.items.map(([label, id]) => <Link href={`${group.href}#${id}`} key={id} onClick={close}>{label}</Link>)}
          </div>
        </div>)}
        <Link href="/events/" onClick={close} aria-current={pathname.startsWith('/events') || pathname.includes('-gallery') ? 'page' : undefined}>Events</Link>
        <a href="https://quickclick.com/r/rfgqff7zjlg59evdhbsf5dmcpdlshr" className="site-donate" onClick={close} target="_blank" rel="noopener noreferrer">Donate<span className="sr-only"> (opens in a new tab)</span></a>
        <Link href="/application/" onClick={close} className="site-apply">Apply Now</Link>
        <button className="site-theme-toggle" aria-label="Switch color theme" onClick={() => {
          const root = document.documentElement;
          const dark = root.dataset.theme ? root.dataset.theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
          root.dataset.theme = dark ? 'light' : 'dark';
        }}><SunIcon size={22} /></button>
      </nav>
    </div>
  </header>;
}
