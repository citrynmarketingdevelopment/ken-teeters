/** Next's internal request URL may use localhost while Host retains the visitor's hostname. */
export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  try {
    const parsed = new URL(origin);
    return ['http:', 'https:'].includes(parsed.protocol) && parsed.host === (request.headers.get('host') ?? new URL(request.url).host);
  } catch { return false; }
}
