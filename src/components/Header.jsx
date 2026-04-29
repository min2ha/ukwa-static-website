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
      <div className="bg-gradient-to-r from-dark-900 via-dark-800 to-dark-900 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <NavLink to={lang.urlPrefix || '/'}>
                <img
                  src="/images/logo/ukwa-2018-dark.svg"
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
                    `px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                      isActive
                        ? 'text-accent-primary bg-dark-800/50'
                        : 'text-dark-300 hover:bg-dark-800 hover:text-dark-100'
                    }`
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
                className="p-2 text-dark-300 hover:text-dark-100 transition-colors"
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
