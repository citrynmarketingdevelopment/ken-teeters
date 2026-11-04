export type Inquiry = { kind: 'contact' | 'services'; name: string; email: string; phone: string; business: string; trade: string; message: string; website: string };
export function validateInquiry(raw: unknown): { data?: Inquiry; fields: Record<string, string> } {
  const fields: Record<string, string> = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { fields: { message: 'Invalid request.' } };
  const input = raw as Record<string, unknown>;
  const data: Record<string, string> = {};
  for (const name of ['kind', 'name', 'email', 'phone', 'business', 'trade', 'message', 'website']) {
    const value = input[name];
    if (value !== undefined && typeof value !== 'string') { fields[name] = 'Please enter a valid value.'; continue; }
    data[name] = typeof value === 'string' ? value.trim() : '';
    if (data[name].length > (name === 'message' ? 3000 : 250)) fields[name] = 'Please shorten this answer.';
  }
  if (!['contact', 'services'].includes(data.kind)) fields.kind = 'Invalid inquiry type.';
  if (!data.name) fields.name = 'Please enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email ?? '')) fields.email = 'Please enter a valid email address.';
  if (!data.message || data.message.length < 10) fields.message = 'Please include at least 10 characters.';
  if (data.kind === 'services') {
    if (!data.business) fields.business = 'Please enter your business name.';
    if (!['Plumbing','Construction & carpentry','Electrical','Roofing','Painting','Vehicle repair','Materials & supplies','Other'].includes(data.trade)) fields.trade = 'Please select a service.';
  }
  return Object.keys(fields).length ? { fields } : { data: data as Inquiry, fields };
}
