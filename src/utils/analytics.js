// ─── Google Analytics 4 + Consent Mode v2 ─────────────────────────────────────
//
// Best-practice consent flow for a static UK web archive site:
//
//   1. As early as possible we install Google Consent Mode v2 with every
//      storage signal denied by default. This means gtag.js can load without
//      setting any identifying cookies until the user makes a choice.
//   2. We then attach the gtag.js loader (G-K5N6D6LKHP) so cookieless pings
//      and Consent Mode signals can still flow. No analytics cookies are
//      written while consent is denied.
//   3. The user picks Accept or Reject in the banner. Their decision is
//      stored in the `cookies_accepted` cookie with a 365-day expiry.
//   4. On Accept, we call gtag('consent','update',...) with everything
//      granted — GA4 starts cookies + full measurement automatically.
//   5. On Reject, we leave consent denied. GA4 stays in cookieless mode.
//
// References:
//   • https://developers.google.com/tag-platform/security/guides/consent
//   • https://developers.google.com/tag-platform/gtagjs/reference#consent

export const GA_MEASUREMENT_ID = 'G-K5N6D6LKHP';
export const CONSENT_COOKIE = 'cookies_accepted';
export const CONSENT_VERSION = '1';
const CONSENT_TTL_DAYS = 365;
export const CONSENT_EVENT = 'ukwa:consent-change';

// ─── Cookie helpers ───────────────────────────────────────────────────────────

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

export function writeCookie(name, value, days = CONSENT_TTL_DAYS) {
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

// Clear cookies GA4 itself sets so a Reject after Accept truly clears state.
function clearGaCookies() {
  if (typeof document === 'undefined') return;
  const host = window.location.hostname;
  // GA can attach cookies on the bare host and on `.host` (root domain).
  const domains = [host, `.${host}`];
  const baseParts = host.split('.');
  if (baseParts.length > 2) domains.push('.' + baseParts.slice(-2).join('.'));
  const names = ['_ga', '_gid', '_gat', `_ga_${GA_MEASUREMENT_ID.replace(/^G-/, '')}`];
  for (const n of names) {
    document.cookie = `${n}=; Max-Age=0; Path=/`;
    for (const d of domains) {
      document.cookie = `${n}=; Max-Age=0; Path=/; Domain=${d}`;
    }
  }
}

// ─── Consent state helpers ────────────────────────────────────────────────────

// Persisted in the `cookies_accepted` cookie. The cookie is intentionally a
// strict allowlist of three strings so it round-trips cleanly between server
// and client; consumers map these to UI state.
//   'true'  → user has accepted analytics cookies
//   'false' → user has explicitly declined
//   null    → user hasn't yet made a choice
export function getConsentStatus() {
  const raw = readCookie(CONSENT_COOKIE);
  if (raw === 'true') return 'accepted';
  if (raw === 'false') return 'rejected';
  return 'unset';
}

function emitConsentChange(detail) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail }));
}

// ─── gtag bootstrap ───────────────────────────────────────────────────────────

let gtagInstalled = false;

function gtag() {
  // gtag.js requires a real arguments-list push; do not spread.
  window.dataLayer.push(arguments);
}

// Install Consent Mode v2 defaults and load gtag.js exactly once.
// Safe to call on every mount — guarded by `gtagInstalled`.
export function initAnalytics() {
  if (typeof window === 'undefined') return;
  if (gtagInstalled) return;
  gtagInstalled = true;

  window.dataLayer = window.dataLayer || [];
  // Expose globally so the GA UI in DevTools / Tag Assistant can introspect.
  window.gtag = gtag;

  // 1) Deny everything by default — Consent Mode v2 requires explicit calls
  //    for the four ad-related signals plus analytics_storage. We also wait
  //    500ms for an Accept/Reject update before sending the first ping so we
  //    don't double-fire after a quick choice.
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500,
  });

  // 2) If the user previously accepted, lift consent BEFORE the script loads
  //    so the first pageview is collected with cookies on. If they rejected,
  //    we stay in cookieless mode.
  const status = getConsentStatus();
  if (status === 'accepted') applyGrant();

  // 3) Load the gtag.js loader. The async script will see the queued
  //    `consent default` (and any update) above before firing requests.
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(s);

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    send_page_view: true,
  });
}

function applyGrant() {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('consent', 'update', {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted',
  });
}

function applyDeny() {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('consent', 'update', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
  });
}

// ─── Public actions ──────────────────────────────────────────────────────────

export function acceptCookies() {
  writeCookie(CONSENT_COOKIE, 'true', CONSENT_TTL_DAYS);
  writeCookie(`${CONSENT_COOKIE}_v`, CONSENT_VERSION, CONSENT_TTL_DAYS);
  applyGrant();
  emitConsentChange({ status: 'accepted' });
}

export function rejectCookies() {
  writeCookie(CONSENT_COOKIE, 'false', CONSENT_TTL_DAYS);
  writeCookie(`${CONSENT_COOKIE}_v`, CONSENT_VERSION, CONSENT_TTL_DAYS);
  applyDeny();
  clearGaCookies();
  emitConsentChange({ status: 'rejected' });
}

export function resetCookieConsent() {
  deleteCookie(CONSENT_COOKIE);
  deleteCookie(`${CONSENT_COOKIE}_v`);
  applyDeny();
  clearGaCookies();
  emitConsentChange({ status: 'unset' });
}

// Fire a manual page_view (useful for SPA route changes once we know
// the user has consented). Safe no-op when gtag isn't loaded yet.
export function trackPageView(path) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: path || window.location.pathname + window.location.search,
    page_location: window.location.href,
    page_title: document.title,
  });
}
