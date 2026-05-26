import { useEffect, useRef } from 'react';
import { useLanguage } from '../hooks/useLanguage';

const COPY = {
  en: {
    title: 'Your privacy on the UK Web Archive',
    body: 'We use a single Google Analytics 4 cookie to understand how visitors use our site so we can improve it. No personal data is sold or shared with advertisers. Essential cookies are always on.',
    accept: 'Accept analytics cookies',
    reject: 'Reject non-essential',
    learnMore: 'Cookie policy',
    close: 'Close',
    badge: 'Cookies',
  },
  cy: {
    title: "Eich preifatrwydd ar Archif We'r DU",
    body: "Rydym yn defnyddio un cwci Google Analytics 4 i ddeall sut mae ymwelwyr yn defnyddio ein gwefan er mwyn ei gwella. Ni werthir nac yn rhannu data personol gyda hysbysebwyr. Mae cwcis hanfodol bob amser ymlaen.",
    accept: 'Derbyn cwcis dadansoddeg',
    reject: 'Gwrthod rhai dewisol',
    learnMore: 'Polisi cwcis',
    close: 'Cau',
    badge: 'Cwcis',
  },
  gd: {
    title: 'Do phrìobhaideachd air Tasglann Lìn na RA',
    body: "Bidh sinn a' cleachdadh aon chriomag Google Analytics 4 gus tuigsinn mar a chleachdas luchd-tadhail an làrach gus a leasachadh. Cha tèid dàta pearsanta a reic no a roinn le sanasairean. Tha criomagan riatanach an-còmhnaidh air.",
    accept: 'Gabh ri criomagan sgrùdaidh',
    reject: 'Diùlt feadhainn neo-riatanach',
    learnMore: 'Poileasaidh chriomagan',
    close: 'Dùin',
    badge: 'Criomagan',
  },
};

// Where the British Library hosts its cookie policy.
const COOKIE_POLICY_URL = 'https://join-britishlibrary.co.uk/cookie-policy/';

function CookieIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 2a10 10 0 102.5 19.7A6 6 0 0112 14a3 3 0 01-3-3 5 5 0 01-3-4.6A10 10 0 0112 2z" />
      <circle cx="9" cy="11" r="0.8" fill="currentColor" />
      <circle cx="13.5" cy="9" r="0.8" fill="currentColor" />
      <circle cx="14" cy="14" r="0.8" fill="currentColor" />
      <circle cx="10" cy="16" r="0.8" fill="currentColor" />
    </svg>
  );
}

export default function CookieBanner({ open, onAccept, onReject, onClose }) {
  const lang = useLanguage();
  const t = COPY[lang.code] || COPY.en;
  const acceptRef = useRef(null);

  // Focus the primary action when the banner opens so keyboard users get
  // an immediate target. Don't move focus on every render.
  useEffect(() => {
    if (open) acceptRef.current?.focus();
  }, [open]);

  // Esc dismisses the banner without making a choice (treated like Close).
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-body"
      className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 pointer-events-none"
    >
      <div className="max-w-5xl mx-auto pointer-events-auto">
        <div className="rounded-2xl bg-white/95 dark:bg-dark-900/95 backdrop-blur-md border border-gray-200 dark:border-dark-700 shadow-2xl ring-1 ring-black/5 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 md:p-5">
            {/* Icon + badge column */}
            <div className="flex items-start md:items-center gap-3 md:flex-shrink-0">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent-primary/10 text-accent-primary">
                <CookieIcon />
              </span>
              <div className="md:hidden">
                <p id="cookie-banner-title" className="text-sm font-semibold text-gray-900 dark:text-dark-100">
                  {t.title}
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 min-w-0">
              <p
                id="cookie-banner-title"
                className="hidden md:block text-sm font-semibold text-gray-900 dark:text-dark-100"
              >
                {t.title}
              </p>
              <p
                id="cookie-banner-body"
                className="mt-1 text-xs md:text-sm text-gray-600 dark:text-dark-300 leading-relaxed"
              >
                {t.body}{' '}
                <a
                  href={COOKIE_POLICY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-accent-primary hover:underline underline-offset-2"
                >
                  {t.learnMore}
                  <span aria-hidden className="ml-0.5">↗</span>
                </a>
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 md:flex-shrink-0">
              <button
                type="button"
                onClick={onReject}
                className="order-2 sm:order-1 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-dark-200 bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 border border-gray-200 dark:border-dark-700 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
              >
                {t.reject}
              </button>
              <button
                ref={acceptRef}
                type="button"
                onClick={onAccept}
                className="order-1 sm:order-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-accent-primary hover:bg-blue-700 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
              >
                {t.accept}
              </button>
            </div>

            {/* Close (only when revisiting — banner is non-blocking) */}
            <button
              type="button"
              aria-label={t.close}
              onClick={onClose}
              className="absolute top-2 right-2 md:static md:order-3 md:ml-1 p-1.5 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-dark-100 hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
