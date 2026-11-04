import Link from 'next/link';
import Image from 'next/image';
import ApplicationForm from './form';
import './application.css';
export const metadata = { title: 'Apply for assistance | Kenneth Teeters Foundation' };
export default function ApplicationPage() { return <main id="main-content" className="application"><div className="app-shell"><Link className="back" href="/">← Back to home</Link><header className="app-header"><Image className="application-brand-banner" src="/assets/images/foundation-application-header.webp" alt="Kenneth Teeters Foundation" width={1000} height={150} unoptimized preload /><h1>Apply for assistance</h1><p>Tell us about yourself and the help you need. You can apply online or download a fillable copy to complete at your own pace.</p><a className="download" href="/assets/documents/fillable-application.pdf" download>Download fillable PDF ↓</a></header><ApplicationForm /><aside className="application-review-note">Applications are reviewed based on need, hardship, and available funds. Selection is not guaranteed. A decision will be provided within 90 days of Board review.<br/><br/>Mail: Kenneth Teeters Foundation, PO Box 80203, Bakersfield, CA 93380</aside></div></main> }



