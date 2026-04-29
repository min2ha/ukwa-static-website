import { Link } from 'react-router-dom';
import { languages } from '../config/languages';
import PageInfoStripe from '../components/PageInfoStripe';

export default function InformationIndexPage({ langCode }) {
  const lang = languages[langCode] || languages.en;
  const info = lang.information;

  const breadcrumbs = [
    { label: lang.homeLabel, path: lang.urlPrefix || '/' },
    { label: info.label },
  ];

  return (
    <>
      <PageInfoStripe breadcrumbs={breadcrumbs} />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-100 mb-4">{info.label}</h1>
        <p className="text-gray-600 dark:text-dark-400 mb-8">
          {langCode === 'cy'
            ? 'Gwybodaeth am yr Archif We a sut rydym yn gweithredu.'
            : langCode === 'gd'
            ? "Fiosrachadh mun Tasglann Lìn agus mar a tha sinn ag obair."
            : 'Information about the UK Web Archive and how we operate.'}
        </p>
        <ul className="grid gap-4 sm:grid-cols-2">
          {info.pages.map((page) => (
            <li key={page.path}>
              <Link
                to={page.path}
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-900 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-sm transition-all group"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </span>
                <span className="font-medium text-gray-800 dark:text-dark-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                  {page.name}
                </span>
                <svg className="ml-auto flex-shrink-0 text-gray-400 dark:text-dark-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
