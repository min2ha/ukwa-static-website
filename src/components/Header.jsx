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
    <header className="sticky top-0 z-50">
      {/* Banner */}
      <div className={
        theme === 'dark'
          ? 'bg-gradient-to-r from-dark-900 via-dark-800 to-dark-900 border-b border-dark-700'
          : 'bg-white border-b-4 border-blue-800'
      }>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <NavLink to={lang.urlPrefix || '/'}>
                <img
                  src={theme === 'dark' ? '/images/logo/ukwa-2018-dark.svg' : '/images/logo/ukwa-2018-onwhite-close.svg'}
                  alt="UK Web Archive"
                  className="h-14 md:h-16 w-auto"
                />
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {lang.menu.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.slug === ''}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {/* Controls: Language Switcher + Theme Toggle (desktop) */}
            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
              <LanguageSwitcher />
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            </div>

            {/* Mobile: Theme Toggle + Hamburger */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
              <button
                className="p-2 text-gray-600 hover:text-gray-800 dark:text-dark-300 dark:hover:text-dark-100 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <MobileMenu lang={lang} onClose={() => setMobileMenuOpen(false)} />
      )}
    </header>
  );
}
