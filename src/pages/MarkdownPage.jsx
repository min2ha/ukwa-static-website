import { useMarkdown } from '../hooks/useMarkdown';
import MarkdownRenderer from '../components/MarkdownRenderer';
import PageInfoStripe from '../components/PageInfoStripe';
import UrlSearchBox from '../components/UrlSearchBox';

// parentBreadcrumbs: [{label, path}] ancestors — current page title is appended automatically from loaded metadata
export default function MarkdownPage({ lang, slug, theme, parentBreadcrumbs }) {
  const { metadata, content, loading, error } = useMarkdown(lang, slug);

  function buildBreadcrumbs(pageTitle) {
    if (parentBreadcrumbs) {
      return [...parentBreadcrumbs, { label: pageTitle }];
    }
    return [{ label: pageTitle }];
  }

  if (loading) {
    return (
      <>
        <PageInfoStripe breadcrumbs={buildBreadcrumbs('Loading...')} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageInfoStripe breadcrumbs={buildBreadcrumbs('Error')} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-gray-100 dark:bg-dark-900 border border-gray-300 dark:border-dark-700 rounded-xl p-8 text-center max-w-md">
            <div className="text-accent-danger text-5xl mb-4">!</div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-100 mb-2">Page Not Found</h2>
            <p className="text-gray-500 dark:text-dark-400">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageInfoStripe breadcrumbs={buildBreadcrumbs(metadata.title || '')} />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <MarkdownRenderer
          content={content}
          theme={theme}
          afterFirstHeading={slug === ''}
          insertNode={slug === '' ? <UrlSearchBox theme={theme} /> : undefined}
        />
      </main>
    </>
  );
}
