import { useState, useEffect, useCallback } from 'react';
import { readCookie, writeCookie, deleteCookie } from '../utils/cookies';

const COOKIE_KEY = 'ukwa-a11y';

// All accessibility preferences live in this single JSON cookie. Each maps to
// a class / data-attribute on <html> that index.css styles. The same mapping
// is duplicated by the pre-paint inline script in index.html to avoid a flash
// of unstyled content — keep the two in sync.
export const DEFAULT_PREFS = {
  fontScale: 'normal',   // 'normal' | 'large' | 'larger'
  contrast: 'normal',    // 'normal' | 'high'
  underlineLinks: false, // always underline links in content
  reduceMotion: false,   // minimise animations / transitions
};

function readPrefs() {
  try {
    const parsed = JSON.parse(readCookie(COOKIE_KEY) || '{}');
    if (parsed && typeof parsed === 'object') return { ...DEFAULT_PREFS, ...parsed };
  } catch {
    // malformed cookie — fall back to defaults
  }
  return { ...DEFAULT_PREFS };
}

function applyPrefs(prefs) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  if (prefs.fontScale && prefs.fontScale !== 'normal') {
    root.setAttribute('data-font-scale', prefs.fontScale);
  } else {
    root.removeAttribute('data-font-scale');
  }
  root.classList.toggle('hc', prefs.contrast === 'high');
  root.classList.toggle('underline-links', !!prefs.underlineLinks);
  root.classList.toggle('reduce-motion', !!prefs.reduceMotion);
}

function isDefault(prefs) {
  return (
    prefs.fontScale === DEFAULT_PREFS.fontScale &&
    prefs.contrast === DEFAULT_PREFS.contrast &&
    prefs.underlineLinks === DEFAULT_PREFS.underlineLinks &&
    prefs.reduceMotion === DEFAULT_PREFS.reduceMotion
  );
}

export function useAccessibility() {
  const [prefs, setPrefs] = useState(readPrefs);

  useEffect(() => {
    applyPrefs(prefs);
    // Keep the cookie out of the jar entirely while everything is default.
    if (isDefault(prefs)) deleteCookie(COOKIE_KEY);
    else writeCookie(COOKIE_KEY, JSON.stringify(prefs));
  }, [prefs]);

  const update = useCallback((patch) => setPrefs((p) => ({ ...p, ...patch })), []);
  const reset = useCallback(() => setPrefs({ ...DEFAULT_PREFS }), []);

  return { prefs, update, reset, isDefault: isDefault(prefs) };
}
