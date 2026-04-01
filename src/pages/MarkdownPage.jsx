import { Link } from 'react-router-dom';
import MarkdownRenderer from '../components/MarkdownRenderer';
import PageInfoStripe from '../components/PageInfoStripe';
import { useLanguage } from '../hooks/useLanguage';
import { useMarkdown } from '../hooks/useMarkdown';
import { languageOrder, languages } from '../config/languages';

const WORDS_PER_MINUTE = 180;

function stripMarkdown(text = '') {
  return text
    .replace(/`{1,3}[^`]*`{1,3}/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~>-]/g, ' ')
    .replace(/\d+\.\s+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getLeadText(content = '') {
  return content
    .split('\n')
    .map(line => line.trim())
    .find(line => (
      line &&
      !line.startsWith('#') &&
      !line.startsWith('-') &&
      !line.startsWith('>') &&
      !/^\d+\./.test(line)
    ))
    ?.replace(/[*_`]/g, '');
}

function getReadingTime(content = '') {
  const wordCount = stripMarkdown(content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

function buildLocalizedPath(code, slug) {
  const prefix = languages[code].urlPrefix;
  const path = `${prefix}${slug ? `/${slug}` : ''}`;
  return path || '/';
}

export default function MarkdownPage({ lang, slug }) {
  const currentLanguage = useLanguage();
  const { metadata, content, loading, error } = useMarkdown(lang, slug);
  const isHome = slug === '';
  const summary = metadata.description || getLeadText(content) || currentLanguage.description;
  const readingTime = getReadingTime(content);
  const alternateLanguages = languageOrder.map(code => ({
    code,
    name: languages[code].name,
    path: buildLocalizedPath(code, slug),
    active: code === currentLanguage.code,
  }));
  const relatedPages = currentLanguage.menu.filter(item => item.slug !== slug);

  if (loading) {
    return (
      <>
        <PageInfoStripe title="Loading..." />
        <div className="mx-auto flex min-h-[52vh] max-w-7xl items-center justify-center px-4 py-16 md:px-6">
          <div className="surface-panel flex min-h-56 w-full max-w-xl flex-col items-center justify-center gap-5 p-10 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600 dark:border-brand-500/30 dark:border-t-brand-300" />
            <div>
              <h2 className="text-xl font-semibold text-ink-950 dark:text-white">Loading page content</h2>
              <p className="mt-2 text-sm text-ink-600 dark:text-mist-300">
                Fetching the markdown source and preparing the page layout.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageInfoStripe title="Error" />
        <div className="mx-auto flex min-h-[52vh] max-w-7xl items-center justify-center px-4 py-16 md:px-6">
          <div className="surface-panel max-w-xl p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-copper-100 text-3xl text-copper-700 dark:bg-copper-500/15 dark:text-copper-300">
              !
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-ink-950 dark:text-white">Page not found</h2>
            <p className="mt-3 text-sm leading-7 text-ink-600 dark:text-mist-300">{error}</p>
            <Link
              to={currentLanguage.urlPrefix || '/'}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-ink-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 dark:bg-white dark:text-ink-950 dark:hover:bg-brand-200"
            >
              Return to the homepage
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageInfoStripe title={metadata.title || ''} />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 md:px-6 md:pb-20 md:pt-8">
        <section>
          <div className="surface-panel relative overflow-hidden p-8 md:p-10">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />

            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-brand-700 dark:border-brand-400/20 dark:bg-brand-400/10 dark:text-brand-200">
                {isHome ? 'Homepage' : 'Section Page'}
              </span>
              <span className="inline-flex items-center rounded-full border border-ink-200/80 bg-white/80 px-3 py-1 text-xs font-medium text-ink-600 dark:border-white/10 dark:bg-white/5 dark:text-mist-300">
                {currentLanguage.name}
              </span>
              <span className="inline-flex items-center rounded-full border border-ink-200/80 bg-white/80 px-3 py-1 text-xs font-medium text-ink-600 dark:border-white/10 dark:bg-white/5 dark:text-mist-300">
                Markdown content source
              </span>
            </div>

            <h1 className="mt-6 max-w-4xl font-display text-4xl leading-tight text-ink-950 text-balance dark:text-white md:text-5xl">
              {metadata.title || currentLanguage.siteTitle}
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-ink-600 dark:text-mist-300 md:text-lg">
              {summary}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={buildLocalizedPath(currentLanguage.code, isHome ? 'save-website' : '')}
                className="inline-flex items-center justify-center rounded-full bg-ink-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 dark:bg-white dark:text-ink-950 dark:hover:bg-brand-200"
              >
                {isHome ? 'Nominate a UK website' : 'Back to homepage'}
              </Link>
              <Link
                to={buildLocalizedPath(currentLanguage.code, 'about')}
                className="inline-flex items-center justify-center rounded-full border border-ink-200 bg-white/85 px-5 py-3 text-sm font-semibold text-ink-900 transition-colors hover:border-brand-300 hover:text-brand-700 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-brand-300 dark:hover:text-brand-200"
              >
                Learn about the archive
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <article className="surface-panel overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-200/70 px-6 py-5 dark:border-white/10 md:px-8">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-brand-700 dark:text-brand-300">
                  Page Content
                </p>
                <p className="mt-1 text-sm text-ink-600 dark:text-mist-300">
                  Authored in markdown and rendered into a more editorial page layout.
                </p>
              </div>
              <span className="inline-flex items-center rounded-full border border-ink-200/70 bg-white/80 px-3 py-1 text-xs font-medium text-ink-600 dark:border-white/10 dark:bg-white/5 dark:text-mist-300">
                {readingTime} minute read
              </span>
            </div>

            <div className="px-6 py-8 md:px-8 md:py-10">
              <MarkdownRenderer content={content} />
            </div>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
            <div className="surface-panel p-6">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-brand-700 dark:text-brand-300">
                Page Map
              </p>
              <div className="mt-4 flex flex-col gap-2">
                {currentLanguage.menu.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`rounded-2xl border px-4 py-3 text-sm transition-colors ${
                      item.slug === slug
                        ? 'border-brand-300 bg-brand-50 text-brand-800 dark:border-brand-400/20 dark:bg-brand-400/10 dark:text-brand-100'
                        : 'border-ink-200/70 bg-white/70 text-ink-700 hover:border-brand-300 hover:text-brand-700 dark:border-white/10 dark:bg-white/5 dark:text-mist-200 dark:hover:border-brand-300 dark:hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="surface-panel p-6">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-brand-700 dark:text-brand-300">
                Other Languages
              </p>
              <div className="mt-4 flex flex-col gap-2">
                {alternateLanguages.map(languageItem => (
                  <Link
                    key={languageItem.code}
                    to={languageItem.path}
                    className={`rounded-2xl border px-4 py-3 text-sm transition-colors ${
                      languageItem.active
                        ? 'border-copper-300 bg-copper-50 text-copper-800 dark:border-copper-400/20 dark:bg-copper-400/10 dark:text-copper-100'
                        : 'border-ink-200/70 bg-white/70 text-ink-700 hover:border-copper-300 hover:text-copper-700 dark:border-white/10 dark:bg-white/5 dark:text-mist-200 dark:hover:border-copper-300 dark:hover:text-white'
                    }`}
                  >
                    {languageItem.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="surface-panel p-6">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-brand-700 dark:text-brand-300">
                Continue Exploring
              </p>
              <div className="mt-4 space-y-4 text-sm leading-7 text-ink-600 dark:text-mist-300">
                <p>{currentLanguage.description}</p>
                <div className="flex flex-col gap-2">
                  {relatedPages.slice(0, 3).map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="rounded-2xl border border-ink-200/70 bg-white/70 px-4 py-3 text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700 dark:border-white/10 dark:bg-white/5 dark:text-mist-200 dark:hover:border-brand-300 dark:hover:text-white"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="surface-panel-muted p-5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-ink-500 dark:text-mist-400">
                Delivery
              </p>
              <p className="mt-3 text-3xl font-semibold text-ink-950 dark:text-white">Static</p>
              <p className="mt-2 text-sm text-ink-600 dark:text-mist-300">Fast, cacheable, and easy to maintain.</p>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}
