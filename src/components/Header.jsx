import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenu from './MobileMenu';
import ThemeToggle from './ThemeToggle';
import HeraldryDivider from './HeraldryDivider';

/* ── Inline SVG: simplified Royal Crown ── */
function CrownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 28" width="34" height="24" aria-hidden="true">
      <defs>
        <linearGradient id="crownGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#e8cc7e" />
          <stop offset="100%" stopColor="#9c7a35" />
        </linearGradient>
      </defs>
      {/* Base band */}
      <rect x="2" y="18" width="36" height="7" rx="1" fill="url(#crownGrad)" />
      {/* Left point */}
      <polygon points="2,18 2,4 10,14" fill="url(#crownGrad)" />
      {/* Centre point */}
      <polygon points="14,18 20,2 26,18" fill="url(#crownGrad)" />
      {/* Right point */}
      <polygon points="38,18 38,4 30,14" fill="url(#crownGrad)" />
      {/* Jewels */}
      <circle cx="20" cy="21" r="2"   fill="#8b0000" />
      <circle cx="10" cy="21" r="1.5" fill="#8b0000" />
      <circle cx="30" cy="21" r="1.5" fill="#8b0000" />
    </svg>
  );
}

/* ── Hamburger / Close icon ── */
function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <line x1="3" y1="6"  x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <line x1="18" y1="6"  x2="6"  y2="18" />
      <line x1="6"  y1="6"  x2="18" y2="18" />
    </svg>
  );
}

export default function Header({ theme, onToggleTheme }) {
  const lang = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-50">

      {/* ── Royal Banner (top strip) ── */}
      <div className="royal-banner">
        <div className="max-w-7xl mx-auto px-6 py-1.5 flex items-center justify-center gap-4">
          <span className="royal-banner-text hidden sm:inline">Est. MMXIV</span>
          <span className="royal-banner-text">✦  United Kingdom Web Archive  ✦  The British Library  ✦</span>
          <span className="royal-banner-text hidden sm:inline">MMXXVI</span>
        </div>
      </div>

      {/* ── Main Header ── */}
      <div className={`header-main ${isDark ? 'header-main-dark' : 'header-main-light'} backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">

            {/* Logo + Titles */}
            <div className="flex items-center gap-4 min-w-0">
              <NavLink to={lang.urlPrefix || '/'} className="flex-shrink-0 group">
                <img
                  src={isDark
                    ? '/images/logo/ukwa-2018-dark.svg'
                    : '/images/logo/ukwa-2018-onwhite-close.svg'}
                  alt="UK Web Archive"
                  className="h-14 md:h-16 w-auto transition-opacity group-hover:opacity-80"
                />
              </NavLink>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <CrownIcon />
                  <div>
                    <p
                      className="font-semibold leading-tight text-base md:text-lg"
                      style={{
                        fontFamily: 'Cinzel, Georgia, serif',
                        color: isDark ? 'var(--gold-light)' : 'var(--navy)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {lang.siteTitle}
                    </p>
                    <p
                      className="hidden lg:block text-xs mt-0.5"
                      style={{
                        fontFamily: 'IM Fell English SC, Georgia, serif',
                        color: isDark ? 'var(--gold-dark)' : 'var(--gold-muted, #7a5f28)',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {lang.siteSubtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center" aria-label="Main navigation">
              {lang.menu.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.slug === ''}
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {/* Controls */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0">
              <LanguageSwitcher />
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            </div>

            {/* Mobile controls */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                style={{
                  border: '1px solid var(--gold-dark)',
                  color: isDark ? 'var(--gold-light)' : 'var(--navy)',
                }}
                className="p-2 transition-colors"
              >
                {mobileOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* Gold hairline separator */}
        <HeraldryDivider className="px-0 py-0" gold={isDark ? '#9c7a35' : '#c9a84c'} />
      </div>

      {mobileOpen && (
        <MobileMenu lang={lang} onClose={() => setMobileOpen(false)} />
      )}
    </header>
  );
}
