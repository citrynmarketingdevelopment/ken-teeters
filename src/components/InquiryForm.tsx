'use client';
import { useState, type FormEvent } from 'react';
import { ArrowRightIcon } from '@phosphor-icons/react';

export function InquiryForm({ kind }: { kind: 'services' | 'contact' }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    const form = event.currentTarget;
    const body = { ...Object.fromEntries(new FormData(form)), kind };
    setBusy(true); setMessage(''); setErrors({}); setSuccess(false);
    try {
      const response = await fetch('/api/inquiry/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const result = await response.json();
      setMessage(result.message); setErrors(result.fields ?? {}); setSuccess(response.ok);
      if (response.ok) form.reset();
    } catch { setMessage('Your message could not be sent. Please try again or call 661-496-1400.'); }
    finally { setBusy(false); }
  }
  function input(name: string, label: string, type = 'text', required = true, autoComplete?: string) {
    const id = `${kind}-${name}`;
    return <label className="foundation-field" htmlFor={id}>{label}{required ? ' *' : ''}<input id={id} name={name} type={type} required={required} maxLength={250} autoComplete={autoComplete} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${id}-error` : undefined} />{errors[name] && <span className="field-error" id={`${id}-error`}>{errors[name]}</span>}</label>;
  }
  return <form className="inquiry-form" onSubmit={submit} aria-label={kind === 'services' ? 'Donate your services' : 'Contact the foundation'}>
    <p className="form-note">* Required fields</p><div className="inquiry-grid">{input('name','Your name','text',true,'name')}{input('email','Email address','email',true,'email')}{input('phone','Phone number','tel',false,'tel')}{kind === 'services' && input('business','Business name','text',true,'organization')}</div>
    {kind === 'services' && <label className="foundation-field" htmlFor="service-trade">Your trade or service *<select id="service-trade" name="trade" required defaultValue=""><option value="">Select your service</option>{['Plumbing','Construction & carpentry','Electrical','Roofing','Painting','Vehicle repair','Materials & supplies','Other'].map(trade => <option key={trade}>{trade}</option>)}</select></label>}
    <label className="foundation-field" htmlFor={`${kind}-message`}>{kind === 'services' ? 'How would you like to help?' : 'Your message'} *<textarea id={`${kind}-message`} name="message" rows={5} required minLength={10} maxLength={3000} aria-invalid={!!errors.message} aria-describedby={errors.message ? `${kind}-message-error` : undefined} />{errors.message && <span className="field-error" id={`${kind}-message-error`}>{errors.message}</span>}</label>
    <div className="form-trap" aria-hidden="true"><label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <p className="form-note">We will use these details to respond to your inquiry. Please do not include payment details or sensitive records.</p>
    <button className="foundation-button" disabled={busy} type="submit">{busy ? 'Sending...' : 'Send Message'} {!busy && <ArrowRightIcon size={18} />}</button>
    <p className={success ? 'form-response' : 'form-response field-error'} role="status" aria-live="polite">{message}</p>
  </form>;
}
