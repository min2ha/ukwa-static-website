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

function AccessibilityButton() {
  return (
    <button
      className="p-2 rounded-full border border-dark-600 text-dark-300 hover:bg-dark-700 hover:text-dark-100 bg-transparent transition-colors"
      aria-label="Accessibility options"
      title="Accessibility options"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="4" r="1.5" />
        <line x1="12" y1="6" x2="12" y2="14" />
        <line x1="6" y1="9.5" x2="18" y2="9.5" />
        <line x1="12" y1="14" x2="8.5" y2="21" />
        <line x1="12" y1="14" x2="15.5" y2="21" />
      </svg>
    </button>
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

            {/* Controls: Language Switcher + Theme Toggle + Accessibility (desktop) */}
            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
              <LanguageSwitcher />
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
              <AccessibilityButton />
            </div>

            {/* Mobile: Theme Toggle + Accessibility + Hamburger */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
              <AccessibilityButton />
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
