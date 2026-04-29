import { Link } from 'react-router-dom';

// breadcrumbs: [{label, path?}] — items with path are clickable links; the last item (no path) is the current page
export default function PageInfoStripe({ breadcrumbs, title }) {
  const items = breadcrumbs ?? [{ label: title ?? '' }];

  return (
    <div className="bg-gradient-to-r from-blue-700 to-blue-600 dark:from-blue-900/80 dark:via-blue-800/50 dark:to-dark-900 py-3 border-b border-blue-800/30 dark:border-dark-700/50">
      <div className="max-w-7xl mx-auto px-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm md:text-base font-medium flex-wrap">
          <span className="text-blue-100 dark:text-dark-400 mr-1">You are here:</span>
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span className="text-blue-300 dark:text-dark-500 mx-0.5">/</span>}
              {item.path ? (
                <Link
                  to={item.path}
                  className="text-blue-200 dark:text-dark-300 hover:text-white dark:hover:text-dark-100 underline underline-offset-2 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-white dark:text-dark-200 font-semibold" aria-current="page">
                  {item.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
}
