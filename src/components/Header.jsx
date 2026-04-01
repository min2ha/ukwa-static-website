import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenu from './MobileMenu';
import ThemeToggle from './ThemeToggle';

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function Header({ theme, onToggleTheme }) {
  const lang = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 md:px-6 md:pt-6">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/70 bg-white/75 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-ink-950/72 dark:shadow-[0_24px_90px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-6">
          <div className="min-w-0 flex-1 lg:flex lg:items-center lg:gap-8">
            <NavLink
              to={lang.urlPrefix || '/'}
              className="flex items-center gap-4 rounded-[1.5rem] transition-transform duration-300 hover:scale-[1.01]"
            >
              <div className="rounded-[1.35rem] border border-white/80 bg-white/90 p-3 shadow-[0_12px_30px_rgba(14,116,144,0.12)] dark:border-white/10 dark:bg-white/6 dark:shadow-none">
                <img
                  src={theme === 'dark' ? '/images/logo/ukwa-2018-dark.svg' : '/images/logo/ukwa-2018-onwhite-close.svg'}
                  alt="UK Web Archive"
                  className="h-12 w-auto md:h-14"
                />
              </div>
              <div className="hidden min-w-0 lg:block">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-brand-700 dark:text-brand-300">
                  Digital Preservation
                </p>
              </div>
            </NavLink>

            <nav className="hidden lg:flex lg:flex-1 lg:justify-center">
              <div className="flex items-center gap-2 rounded-full border border-ink-200/80 bg-white/80 p-1.5 shadow-[0_10px_35px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                {lang.menu.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.slug === ''}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </nav>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <LanguageSwitcher />
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink-200/80 bg-white/85 text-ink-700 shadow-sm transition-colors hover:border-brand-300 hover:text-brand-700 dark:border-white/10 dark:bg-white/6 dark:text-mist-100 dark:hover:border-brand-300 dark:hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <MobileMenu lang={lang} onClose={() => setMobileMenuOpen(false)} />
        )}
      </div>
    </header>
  );
}
