import { forwardRef, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenu from './MobileMenu';
import ThemeToggle from './ThemeToggle';
import AccessibilityPanel from './AccessibilityPanel';

const A11Y_PANEL_ID = 'accessibility-panel';

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

const AccessibilityButton = forwardRef(function AccessibilityButton(
  { open, onClick },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label="Accessibility settings"
      title="Accessibility settings"
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={A11Y_PANEL_ID}
      className={`p-2 rounded-full border text-dark-300 hover:bg-dark-700 hover:text-dark-100 bg-transparent transition-colors ${
        open ? 'border-accent-primary text-dark-100 bg-dark-700' : 'border-dark-600'
      }`}
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
});

export default function Header({ theme, onToggleTheme, onSetTheme, a11y }) {
  const lang = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [a11yOpen, setA11yOpen] = useState(false);
  // The button that opened the panel — focus returns here when it closes.
  const a11yTriggerRef = useRef(null);
  const desktopA11yRef = useRef(null);
  const mobileA11yRef = useRef(null);

  const openA11y = (triggerRef) => {
    a11yTriggerRef.current = triggerRef.current;
    setA11yOpen(true);
  };
  const toggleA11y = (triggerRef) => {
    if (a11yOpen) setA11yOpen(false);
    else openA11y(triggerRef);
  };

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
              <AccessibilityButton
                ref={desktopA11yRef}
                open={a11yOpen}
                onClick={() => toggleA11y(desktopA11yRef)}
              />
            </div>

            {/* Mobile: Theme Toggle + Accessibility + Hamburger */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
              <AccessibilityButton
                ref={mobileA11yRef}
                open={a11yOpen}
                onClick={() => toggleA11y(mobileA11yRef)}
              />
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

      {/* Accessibility settings panel */}
      {a11y && (
        <AccessibilityPanel
          id={A11Y_PANEL_ID}
          open={a11yOpen}
          onClose={() => setA11yOpen(false)}
          returnFocusRef={a11yTriggerRef}
          theme={theme}
          onSetTheme={onSetTheme}
          prefs={a11y.prefs}
          onUpdate={a11y.update}
          onReset={a11y.reset}
        />
      )}
    </header>
  );
}
