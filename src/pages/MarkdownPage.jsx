import { useMarkdown } from '../hooks/useMarkdown';
import PageInfoStripe from '../components/PageInfoStripe';
import MarkdownRenderer from '../components/MarkdownRenderer';
import HeraldryDivider from '../components/HeraldryDivider';

function LoadingState({ theme }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="heritage-spinner" />
      <p
        style={{
          fontFamily: 'Cinzel, Georgia, serif',
          color: theme === 'dark' ? 'var(--gold-dark)' : 'var(--navy)',
          fontSize: '0.72rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
        }}
      >
        Loading Archive…
      </p>
    </div>
  );
}

function ErrorState({ message, theme }) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      <p
        style={{
          fontFamily: 'UnifrakturMaguntia, cursive',
          color: theme === 'dark' ? 'var(--gold)' : 'var(--navy)',
          fontSize: '2.5rem',
          marginBottom: '0.5rem',
        }}
      >
        Archive Notice
      </p>
      <HeraldryDivider
        gold={theme === 'dark' ? '#9c7a35' : '#c9a84c'}
        className="my-4"
      />
      <p
        style={{
          fontFamily: 'Cormorant Garamond, Georgia, serif',
          color: theme === 'dark' ? 'var(--parchment-dark)' : 'var(--ink)',
          fontSize: '1.1rem',
        }}
      >
        The requested document could not be retrieved from the archive.
      </p>
      {message && (
        <p
          className="mt-3 text-sm"
          style={{
            fontFamily: 'Courier New, monospace',
            color: theme === 'dark' ? 'var(--gold-dark)' : 'var(--gold-muted, #7a5f28)',
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default function MarkdownPage({ lang, slug, theme }) {
  const { metadata, content, loading, error } = useMarkdown(lang, slug);
  const isDark = theme === 'dark';

  if (loading) return <LoadingState theme={theme} />;
  if (error)   return <ErrorState   message={error} theme={theme} />;

  const pageTitle = metadata.title || null;

  return (
    <>
      <PageInfoStripe pageTitle={pageTitle} />

      <main className="flex-1 py-10 md:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 fade-in">

          {/* Ornamental top rule */}
          <HeraldryDivider
            gold={isDark ? '#9c7a35' : '#c9a84c'}
            className="mb-8"
          />

          {/* Heritage content panel */}
          <article
            className="heritage-panel px-6 sm:px-10 py-10 md:py-14"
            style={{ borderRadius: '2px' }}
          >
            <MarkdownRenderer content={content} theme={theme} />
          </article>

          {/* Ornamental bottom rule */}
          <HeraldryDivider
            gold={isDark ? '#9c7a35' : '#c9a84c'}
            className="mt-8"
          />
        </div>
      </main>
    </>
  );
}
