import { useState, useEffect } from 'react';
import { readCookie, writeCookie } from '../utils/cookies';

const COOKIE_KEY = 'ukwa-theme';
// Legacy key — previous builds persisted the theme in localStorage.
const LEGACY_KEY = 'ukwa-theme';

// Resolve the starting theme in priority order:
//   1. the saved cookie, 2. a legacy localStorage value (migrated on mount),
//   3. the operating-system colour-scheme preference, 4. light.
function getInitialTheme() {
  const fromCookie = readCookie(COOKIE_KEY);
  if (fromCookie === 'light' || fromCookie === 'dark') return fromCookie;

  try {
    const ls = localStorage.getItem(LEGACY_KEY);
    if (ls === 'light' || ls === 'dark') return ls;
  } catch {
    // localStorage unavailable
  }

  try {
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
  } catch {
    // matchMedia unavailable
  }

  return 'light';
}

export function useTheme() {
  const [theme, setThemeState] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    writeCookie(COOKIE_KEY, theme);
    // Drop any stale localStorage value now that the cookie is authoritative.
    try { localStorage.removeItem(LEGACY_KEY); } catch { /* ignore */ }
  }, [theme]);

  const toggleTheme = () => setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const setTheme = (next) => setThemeState(next === 'dark' ? 'dark' : 'light');

  return { theme, toggleTheme, setTheme };
}
