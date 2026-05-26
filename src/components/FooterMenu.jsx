import { NavLink } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

const FOOTER_INFO_HIDDEN = new Set(['about', 'information/technical-information', 'information/notice-and-takedown']);

const MANAGE_COOKIES_LABEL = {
  en: 'Manage cookies',
  cy: 'Rheoli cwcis',
  gd: 'Stiùirich criomagan',
};

export default function FooterMenu({ onManageCookies }) {
  const lang = useLanguage();

  return (
    <section className="bg-white dark:bg-dark-950 border-t border-blue-200 dark:border-dark-700 py-2">
      <div className="max-w-7xl mx-auto px-6">
        <div className="pl-36">
          <div className="grid grid-cols-2 gap-4">

            {/* Column 1: Main navigation */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-800 dark:text-dark-100 mb-1 pb-0.5 border-b border-blue-200 dark:border-dark-700">
                {lang.siteTitle}
              </h3>
              <ul className="space-y-0.5">
                {lang.menu.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.slug === ''}
                      className={({ isActive }) =>
                        `text-xs transition-colors ${
                          isActive
                            ? 'text-blue-800 dark:text-dark-100 font-semibold'
                            : 'text-blue-700 dark:text-dark-400 hover:text-blue-900 dark:hover:text-dark-100'
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Information section */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-800 dark:text-dark-100 mb-1 pb-0.5 border-b border-blue-200 dark:border-dark-700">
                {lang.information.label}
              </h3>
              <ul className="space-y-0.5">
                {lang.information.pages
                  .filter((page) => !FOOTER_INFO_HIDDEN.has(page.slug))
                  .map((page) => (
                    <li key={page.path}>
                      {page.isExternal ? (
                        <a
                          href={page.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs transition-colors text-blue-700 dark:text-dark-400 hover:text-blue-900 dark:hover:text-dark-100"
                        >
                          {page.name}
                        </a>
                      ) : (
                        <NavLink
                          to={page.path}
                          className={({ isActive }) =>
                            `text-xs transition-colors ${
                              isActive
                                ? 'text-blue-800 dark:text-dark-100 font-semibold'
                                : 'text-blue-700 dark:text-dark-400 hover:text-blue-900 dark:hover:text-dark-100'
                            }`
                          }
                        >
                          {page.name}
                        </NavLink>
                      )}
                    </li>
                  ))}
                {onManageCookies && (
                  <li>
                    <button
                      type="button"
                      onClick={onManageCookies}
                      className="text-xs transition-colors text-blue-700 dark:text-dark-400 hover:text-blue-900 dark:hover:text-dark-100 underline-offset-2 hover:underline"
                    >
                      {MANAGE_COOKIES_LABEL[lang.code] || MANAGE_COOKIES_LABEL.en}
                    </button>
                  </li>
                )}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
