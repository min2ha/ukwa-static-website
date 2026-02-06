/**
 * Parse YAML frontmatter from markdown text.
 * Handles simple --- delimited frontmatter with key: "value" pairs.
 */
export function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { metadata: {}, content: text };
  }

  const frontmatterBlock = match[1];
  const content = match[2];
  const metadata = {};

  for (const line of frontmatterBlock.split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    metadata[key] = value;
  }

  return { metadata, content };
}

/**
 * Load a markdown file for a given language and page slug.
 * @param {string} lang - Language code: 'en', 'cy', 'gd'
 * @param {string} slug - Page slug: '' (home), 'about', 'contact', 'save-website'
 * @returns {Promise<{metadata: object, content: string}>}
 */
export async function loadMarkdown(lang, slug) {
  const path = slug
    ? `/content/${lang}/${slug}/_index.md`
    : `/content/${lang}/_index.md`;

  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load content: ${path} (${response.status})`);
  }

  const text = await response.text();
  return parseFrontmatter(text);
}
