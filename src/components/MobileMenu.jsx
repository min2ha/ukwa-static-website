import { NavLink } from 'react-router-dom';
import { languages, languageOrder } from '../config/languages';
import { useNavigate, useLocation } from 'react-router-dom';
import HeraldryDivider from './HeraldryDivider';

export default function MobileMenu({ lang, onClose }) {
  const navigate  = useNavigate();
  const location  = useLocation();

  function switchLang(targetCode) {
    const target  = languages[targetCode];
    const current = lang;
    const prefix  = current.urlPrefix || '';
    const slug    = location.pathname.startsWith(prefix)
      ? location.pathname.slice(prefix.length) || '/'
      : '/';
    const newPath = (target.urlPrefix || '') + (slug === '/' ? '' : slug) || '/';
    navigate(newPath || '/');
    onClose();
  }

  return (
    <div className="mobile-menu-overlay md:hidden">
      <nav className="max-w-7xl mx-auto px-6 py-5">
        {/* Navigation links */}
        <ul className="space-y-1 mb-4">
          {lang.menu.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.slug === ''}
                onClick={onClose}
                className={({ isActive }) =>
                  `block px-4 py-3 font-institutional text-sm tracking-[0.12em] uppercase transition-all duration-200 ${
                    isActive
                      ? 'text-[var(--gold-light)] border-l-2 border-[var(--gold)] pl-5'
                      : 'text-[var(--gold-pale)] hover:text-[var(--gold-light)] hover:pl-5'
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <HeraldryDivider gold="#c9a84c" className="my-3" />

        {/* Language switcher */}
        <div className="flex items-center gap-2 pt-2">
          <span
            className="text-xs tracking-[0.20em] uppercase"
            style={{ fontFamily: 'Cinzel, Georgia, serif', color: 'var(--gold-dark)' }}
          >
            Language
          </span>
          {languageOrder
            .filter((code) => code !== lang.code)
            .map((code) => (
              <button
                key={code}
                onClick={() => switchLang(code)}
                className="lang-btn"
              >
                {languages[code].name}
              </button>
            ))}
        </div>
      </nav>
    </div>
  );
}
