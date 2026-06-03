# Cookie Solution

How cookies work across the UK Web Archive static site.

## Two independent subsystems

The site uses cookies for **two unrelated purposes**, kept deliberately separate:

1. **Analytics consent** (Google Analytics 4 + Consent Mode v2) — requires user opt-in.
2. **User preferences** (theme + accessibility) — "strictly necessary / functional", set without consent.

---

## 1. Analytics consent

**Files:** `src/utils/analytics.js`, `src/hooks/useCookieConsent.js`, `src/components/CookieBanner.jsx`

### Cookies written

| Cookie | Values | TTL | Purpose |
|---|---|---|---|
| `cookies_accepted` | `true` / `false` | 365 days | The user's choice |
| `cookies_accepted_v` | `1` (`CONSENT_VERSION`) | 365 days | Lets you invalidate old consents if the policy changes |
| `_ga`, `_ga_K5N6D6LKHP`, `_gid`, `_gat` | GA-managed | GA-managed | Only created **after** Accept |

### How it flows

- On every load, `initAnalytics()` installs **Consent Mode v2 with everything denied by default**
  (`ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage` = denied;
  `functionality_storage`, `security_storage` = granted), then loads `gtag.js`.
  So GA runs **cookieless** until the user acts.
- The banner (`CookieBanner`) shows when `getConsentStatus() === 'unset'` (no cookie yet).
  It is **non-blocking** (`aria-modal="false"`), focuses the Accept button, and closes on Esc.
- **Accept** → writes `cookies_accepted=true`, calls `gtag('consent','update', …granted)`;
  GA starts setting its `_ga*` cookies.
- **Reject** → writes `cookies_accepted=false`, keeps consent denied, and actively
  **deletes any existing `_ga*` cookies** (`clearGaCookies()` sweeps the host, `.host`, and root domain).
- **Manage cookies** (footer link → `cookies.openBanner`) re-opens the banner so a choice can be changed.
- State changes broadcast via a `ukwa:consent-change` `CustomEvent`, which `useCookieConsent`
  listens to so the UI stays in sync.
- Banner copy is translated for **en / cy / gd**.

---

## 2. User preferences

Added so theme and accessibility choices persist across visits.

### Generic helper — `src/utils/cookies.js`

`readCookie` / `writeCookie` / `deleteCookie`. `writeCookie` sets:

```
<name>=<encoded>; Max-Age=<n>; Expires=<date>; Path=/; SameSite=Lax; Secure(on https)
```

Default TTL **365 days**. These mirror the robust pattern already used in `analytics.js`.

### Theme — `src/hooks/useTheme.js`

| Cookie | Values | TTL |
|---|---|---|
| `ukwa-theme` | `light` / `dark` | 365 days |

- Resolution order on first load: **cookie → legacy `localStorage` → OS `prefers-color-scheme` → light**.
- Migrated **off `localStorage`** (the old store) onto a cookie; the legacy value is read once for
  migration then removed.
- Toggling adds/removes the `dark` class on `<html>` and rewrites the cookie.

### Accessibility — `src/hooks/useAccessibility.js`

| Cookie | Value | TTL |
|---|---|---|
| `ukwa-a11y` | JSON, e.g. `{"fontScale":"large","contrast":"high","underlineLinks":true,"reduceMotion":true}` | 365 days |

- Stores all four accessibility prefs in **one JSON cookie**.
- **Only written when non-default** — while everything is at defaults, the cookie is actively deleted,
  so the jar stays empty for users who never change anything.
- Applied to `<html>` as `data-font-scale`, `.hc`, `.underline-links`, `.reduce-motion`,
  which `src/index.css` styles.

### No flash of wrong styles — inline script in `index.html`

A small **pre-paint vanilla script** reads `ukwa-theme` and `ukwa-a11y` (plus the legacy
localStorage / OS fallback for theme) and applies the classes/attributes to `<html>`
**before React loads** — so the saved theme and text size never flash. It duplicates the
mapping in the two hooks (kept in sync by comment).

---

## Privacy / compliance posture

- **Preference cookies (`ukwa-theme`, `ukwa-a11y`)** store no personal data — only the user's own
  display choices — so they are treated as functional/necessary and written **regardless of consent**.
  This is consistent with the banner's wording: *"Essential cookies are always on."*
- **Analytics cookies** are gated behind explicit opt-in via Consent Mode v2, use anonymized IP,
  and are fully revocable (Reject clears them).
- All first-party cookies use `SameSite=Lax` and `Secure` on HTTPS.

---

## Quick cookie inventory

| Cookie | Set by | Needs consent? | TTL |
|---|---|---|---|
| `cookies_accepted` | banner choice | n/a (records the choice) | 365 d |
| `cookies_accepted_v` | banner choice | n/a | 365 d |
| `ukwa-theme` | theme toggle / accessibility panel | No (functional) | 365 d |
| `ukwa-a11y` | accessibility panel | No (functional) | 365 d |
| `_ga`, `_ga_*`, `_gid`, `_gat` | GA4 | **Yes** (only after Accept) | GA-managed |

---

## Related files

| Concern | File |
|---|---|
| GA4 + Consent Mode v2, consent cookies | `src/utils/analytics.js` |
| Consent state hook | `src/hooks/useCookieConsent.js` |
| Consent banner UI (en/cy/gd) | `src/components/CookieBanner.jsx` |
| Generic cookie read/write/delete | `src/utils/cookies.js` |
| Theme persistence | `src/hooks/useTheme.js` |
| Accessibility persistence | `src/hooks/useAccessibility.js` |
| Pre-paint application of prefs | `index.html` |
| Accessibility styles | `src/index.css` |
