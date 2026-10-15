/** Extracts `|key = value` pairs from the first top-level template on a page. */
export function parseInfobox(wikitext: string): Record<string, string> {
  const start = wikitext.indexOf('{{');
  if (start === -1) return {};
  let depth = 0;
  let end = start;
  for (let i = start; i < wikitext.length - 1; i++) {
    if (wikitext.startsWith('{{', i)) {
      depth++;
      i++;
    } else if (wikitext.startsWith('}}', i)) {
      depth--;
      i++;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  const body = wikitext.slice(start + 2, end - 1);
  const out: Record<string, string> = { template: body.split('|')[0]!.trim() };
  depth = 0;
  let current = '';
  const parts: string[] = [];
  for (let i = 0; i < body.length; i++) {
    const two = body.slice(i, i + 2);
    if (two === '{{' || two === '[[') depth++;
    if (two === '}}' || two === ']]') depth--;
    if (body[i] === '|' && depth === 0) {
      parts.push(current);
      current = '';
    } else current += body[i];
  }
  parts.push(current);
  for (const p of parts.slice(1)) {
    const eq = p.indexOf('=');
    if (eq > 0) out[p.slice(0, eq).trim()] = p.slice(eq + 1).trim();
  }
  return out;
}
