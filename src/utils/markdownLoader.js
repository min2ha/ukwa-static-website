/**
 * Synchronously parse YAML front-matter from a raw markdown string.
 * Returns { metadata, content }.
 */
export function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { metadata: {}, content: raw };

  const metadata = {};
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key   = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '');
    if (key) metadata[key] = value;
  }

  return { metadata, content: match[2] };
}
