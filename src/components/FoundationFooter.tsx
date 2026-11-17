import Link from 'next/link';
import Image from 'next/image';
import { socialLinks } from '@/lib/social-links';
import { MapPinLineIcon, ArrowUpRightIcon } from '@phosphor-icons/react/ssr';

export function FoundationFooter() {
  return (
    <footer className="shared-footer" id="site-footer" aria-label="Foundation information">
      <div className="shared-footer__transition">
        <Link href="/" aria-label="Kenneth Teeters Foundation home">
          <Image src="/assets/images/Kenneth-Teeters-foundation.png" alt="Kenneth Teeters Foundation" width={594} height={375} sizes="230px" className="shared-footer__logo" />
        </Link>
      </div>
      <div className="shared-footer__shell">
        <div className="shared-footer__panels">
          <section className="shared-footer__location" aria-labelledby="footer-location">
            <MapPinLineIcon size={28} weight="regular" aria-hidden="true" />
            <div><h2 id="footer-location">Stay connected.</h2><p>Veterans helping veterans in our community.</p>
              <address><span>Mailing address</span>PO Box 80203<br />Bakersfield, CA 93380</address>
            </div>
          </section>
          <section className="shared-footer__contact" aria-labelledby="footer-contact">
            <h2 id="footer-contact">We’re here to help.</h2>
            <Link className="shared-footer__message" href="/get-involved/#contact">Contact Us <ArrowUpRightIcon size={18} aria-hidden="true" /></Link>
          </section>
        </div>
        <nav className="shared-footer__nav" aria-label="Footer navigation">
          <Link href="/our-work/">Our Work</Link><Link href="/get-involved/">Get Involved</Link><Link href="/events/">Events</Link><Link href="/application/">Apply Now</Link>
        </nav>
      </div>
      <div className="shared-footer__bottom">
        <div className="shared-footer__shell">
          <p>© {new Date().getFullYear()} Kenneth Teeters Foundation</p>
          <nav className="foundation-socials" aria-label="Foundation social media">
            {socialLinks.map(({ name, href, iconPath }) => (
              <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${name} (opens in a new tab)`} title={name}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false"><path d={iconPath} /></svg>
              </a>
            ))}
          </nav>
          <p>Powered &amp; Designed by <span>Citryn</span></p>
        </div>
      </div>
    </footer>
  );
}
