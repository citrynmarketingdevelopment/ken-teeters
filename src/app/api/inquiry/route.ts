import { createHash } from 'node:crypto';
import { validateInquiry } from '@/lib/inquiry';
import { isSameOriginRequest } from '@/lib/request-origin';
export const runtime = 'nodejs';
const attempts = new Map<string, { count: number; expires: number }>();
function respond(message: string, status: number, fields?: Record<string,string>) {
  return Response.json({ message, fields }, { status, headers: { 'Cache-Control': 'no-store', ...(status === 429 ? { 'Retry-After': '900' } : {}) } });
}
export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return respond('Please submit from this website.', 403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return respond('Unsupported request format.', 415);
  const reader = request.body?.getReader();
  if (!reader) return respond('The message could not be read.', 400);
  const chunks: Uint8Array[] = []; let size = 0; let raw: unknown;
  try {
    while (true) {
      const chunk = await reader.read(); if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > 20000) { await reader.cancel(); return respond('The message is too large.', 413); }
      chunks.push(chunk.value);
    }
    raw = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch { return respond('The message could not be read.', 400); }
  const { data, fields } = validateInquiry(raw);
  if (!data) return respond('Please check the highlighted fields.', 400, fields);
  if (data.website) return respond('Your message has been submitted. Thank you.', 200);
  // Best-effort instance-local throttling. Production-wide limits belong at the edge.
  const now = Date.now();
  for (const [key, value] of attempts) if (value.expires <= now) attempts.delete(key);
  const key = createHash('sha256').update(data.email.toLowerCase()).digest('hex');
  const attempt = attempts.get(key) ?? { count: 0, expires: now + 900000 };
  if (attempt.count >= 3 || attempts.size >= 10000) return respond('Please wait 15 minutes before sending another message, or call 661-496-1400.', 429);
  attempt.count++; attempts.set(key, attempt);
  const apiKey = process.env.SMTP_API; const channel = process.env.SMTP_CHANNEL;
  if (!apiKey || !channel) return respond('Online messages are temporarily unavailable. Please call 661-496-1400.', 503);
  try {
    const response = await fetch('https://api.smtp.com/v4/messages', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-SMTPCOM-API': apiKey },
      body: JSON.stringify({ channel, recipients: { to: [{ address: 'citryn.contactforms@gmail.com' }] }, originator: { from: { name: 'Kenneth Teeters Foundation', address: 'contactforms@citryn.com' }, reply_to: { address: data.email } },
        subject: data.kind === 'services' ? 'Foundation: offer to donate services' : 'Foundation: contact inquiry',
        body: { parts: [{ type: 'text/plain', charset: 'UTF-8', content: `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'Not provided'}\nBusiness: ${data.business || 'Not provided'}\nService: ${data.trade || 'Not provided'}\n\n${data.message}` }] } }), signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error('MAIL_REJECTED');
    const result = await response.json();
    const accepted = typeof result.data?.msg_id === 'string' && result.data.msg_id.trim() || /^accepted,\s*msg_id:\s*[a-zA-Z0-9][a-zA-Z0-9._-]*\s*$/i.test(result.data?.message ?? '');
    if (result.status !== 'success' || !accepted) throw new Error('MAIL_NOT_ACCEPTED');
    return respond('Your message has been submitted. Thank you for getting in touch.', 200);
  } catch {
    console.error('Foundation inquiry delivery could not be confirmed.');
    return respond('We could not confirm your message was sent. Please try again or call 661-496-1400.', 502);
  }
}
