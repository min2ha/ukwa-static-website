// ─── Generic first-party cookie helpers ───────────────────────────────────────
//
// Used for "strictly necessary / functional" preference cookies (theme and
// accessibility settings) that the user explicitly sets. These store no
// personal data and are exempt from analytics consent — they only persist the
// user's own display choices, so they're written regardless of consent state.

const DEFAULT_TTL_DAYS = 365;

export function readCookie(name) {
  if (typeof document === 'undefined') return null;
  const target = `${name}=`;
  const pairs = document.cookie ? document.cookie.split('; ') : [];
  for (const pair of pairs) {
    if (pair.startsWith(target)) {
      try { return decodeURIComponent(pair.slice(target.length)); }
      catch { return pair.slice(target.length); }
    }
  }
  return null;
}

export function writeCookie(name, value, days = DEFAULT_TTL_DAYS) {
  if (typeof document === 'undefined') return;
  const maxAge = Math.max(0, Math.floor(days * 24 * 60 * 60));
  const expires = new Date(Date.now() + maxAge * 1000).toUTCString();
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie =
    `${name}=${encodeURIComponent(value)}` +
    `; Max-Age=${maxAge}; Expires=${expires}; Path=/; SameSite=Lax${secure}`;
}

export function deleteCookie(name) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}
