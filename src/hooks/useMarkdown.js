import { useState, useEffect } from 'react';

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { metadata: {}, content: raw };

  const yamlBlock = match[1];
  const content   = match[2];
  const metadata  = {};

  for (const line of yamlBlock.split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key   = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '');
    if (key) metadata[key] = value;
  }

  return { metadata, content };
}

export function useMarkdown(lang, slug) {
  const [state, setState] = useState({ metadata: {}, content: '', loading: true, error: null });

  useEffect(() => {
    setState({ metadata: {}, content: '', loading: true, error: null });

    const path = slug
      ? `/content/${lang}/${slug}/_index.md`
      : `/content/${lang}/_index.md`;

    fetch(path)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
        return r.text();
      })
      .then((raw) => {
        const { metadata, content } = parseFrontmatter(raw);
        setState({ metadata, content, loading: false, error: null });
      })
      .catch((err) => {
        setState({ metadata: {}, content: '', loading: false, error: err.message });
      });
  }, [lang, slug]);

  return state;
}
