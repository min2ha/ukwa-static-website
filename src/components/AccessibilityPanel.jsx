import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

// ─── Translations ──────────────────────────────────────────────────────────────

const COPY = {
  en: {
    title: 'Accessibility',
    description: 'Adjust the display to suit your needs. Your choices are saved on this device.',
    theme: 'Colour theme',
    light: 'Light',
    dark: 'Dark',
    textSize: 'Text size',
    sizeNormal: 'Normal',
    sizeLarge: 'Large',
    sizeLarger: 'Larger',
    contrast: 'Higher contrast',
    contrastDesc: 'Strengthen text contrast for easier reading',
    underline: 'Underline links',
    underlineDesc: 'Always underline links within content',
    motion: 'Reduce motion',
    motionDesc: 'Minimise animations and transitions',
    reset: 'Reset to defaults',
    statement: 'Accessibility statement',
    close: 'Close',
    on: 'on',
    off: 'off',
    reseted: 'Accessibility settings reset to defaults',
  },
  cy: {
    title: 'Hygyrchedd',
    description: "Addaswch yr arddangosfa i weddu i'ch anghenion. Caiff eich dewisiadau eu cadw ar y ddyfais hon.",
    theme: 'Thema lliw',
    light: 'Golau',
    dark: 'Tywyll',
    textSize: 'Maint y testun',
    sizeNormal: 'Arferol',
    sizeLarge: 'Mawr',
    sizeLarger: 'Mwy',
    contrast: 'Cyferbyniad uwch',
    contrastDesc: "Cryfhau cyferbyniad y testun i'w ddarllen yn haws",
    underline: 'Tanlinellu dolenni',
    underlineDesc: 'Tanlinellu dolenni o fewn cynnwys bob amser',
    motion: 'Lleihau symud',
    motionDesc: 'Lleihau animeiddiadau a phontiadau',
    reset: "Ailosod i'r rhagosodiadau",
    statement: 'Datganiad hygyrchedd',
    close: 'Cau',
    on: 'ymlaen',
    off: 'i ffwrdd',
    reseted: "Ailosodwyd y gosodiadau hygyrchedd i'r rhagosodiadau",
  },
  gd: {
    title: 'So-ruigsinneachd',
    description: 'Atharraich an taisbeanadh a rèir do fheumalachdan. Thèid na roghainnean agad a shàbhaladh air an inneal seo.',
    theme: 'Tèama dhathan',
    light: 'Soilleir',
    dark: 'Dorcha',
    textSize: 'Meud an teacsa',
    sizeNormal: 'Àbhaisteach',
    sizeLarge: 'Mòr',
    sizeLarger: 'Nas motha',
    contrast: 'Iomsgaradh nas àirde',
    contrastDesc: 'Neartaich iomsgaradh an teacsa airson leughadh nas fhasa',
    underline: 'Loidhne fo cheanglaichean',
    underlineDesc: "Cuir loidhne fo cheanglaichean san t-susbaint an-còmhnaidh",
    motion: 'Lùghdaich gluasad',
    motionDesc: 'Lùghdaich beòthachaidhean is gluasadan',
    reset: 'Ath-shuidhich',
    statement: 'Aithris so-ruigsinneachd',
    close: 'Dùin',
    on: 'air',
    off: 'dheth',
    reseted: 'Chaidh na roghainnean so-ruigsinneachd ath-shuidheachadh',
  },
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [role="radio"], [role="switch"], [tabindex]:not([tabindex="-1"])';

// ─── Small accessible primitives ───────────────────────────────────────────────

function Segmented({ label, name, value, options, onChange }) {
  return (
    <div>
      <span id={`${name}-label`} className="block text-sm font-medium text-gray-900 dark:text-dark-100 mb-1.5">
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={`${name}-label`}
        className="grid grid-flow-col auto-cols-fr gap-1 p-1 rounded-xl bg-gray-100 dark:bg-dark-700/60"
      >
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.value)}
              className={`px-2 py-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary ${
                active
                  ? 'bg-white dark:bg-dark-800 text-accent-primary shadow-sm'
                  : 'text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-dark-100'
              }`}
            >
              <span style={opt.style}>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Switch({ label, description, checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-start justify-between w-full gap-3 text-left rounded-xl px-1 py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
    >
      <span className="min-w-0">
        <span className="block text-sm font-medium text-gray-900 dark:text-dark-100">{label}</span>
        {description && (
          <span className="block text-xs text-gray-500 dark:text-dark-400 mt-0.5">{description}</span>
        )}
      </span>
      <span
        aria-hidden="true"
        className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          checked ? 'bg-accent-primary' : 'bg-gray-300 dark:bg-dark-600'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </span>
    </button>
  );
}

// ─── Panel ──────────────────────────────────────────────────────────────────────

export default function AccessibilityPanel({
  id,
  open,
  onClose,
  returnFocusRef,
  theme,
  onSetTheme,
  prefs,
  onUpdate,
  onReset,
}) {
  const lang = useLanguage();
  const t = COPY[lang.code] || COPY.en;
  const panelRef = useRef(null);
  const [announcement, setAnnouncement] = useState('');

  const announce = (msg) => setAnnouncement(`${msg} ​`); // zero-width keeps repeats audible

  // Move focus into the panel when it opens; restore it to the trigger on close.
  useEffect(() => {
    if (!open) return undefined;
    const node = panelRef.current;
    const first = node?.querySelector('[data-autofocus]') || node?.querySelector(FOCUSABLE);
    first?.focus();
    // The trigger element is fixed for the lifetime of an open panel.
    const trigger = returnFocusRef?.current;
    return () => trigger?.focus?.();
  }, [open, returnFocusRef]);

  // Esc to close + Tab focus trap (WCAG 2.1.2 No Keyboard Trap / 2.4.3 Focus Order).
  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const node = panelRef.current;
      if (!node) return;
      const items = Array.from(node.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null
      );
      if (items.length === 0) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [open, onClose]);

  // Dismiss when clicking away from the panel.
  useEffect(() => {
    if (!open) return undefined;
    function onDown(e) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        !returnFocusRef?.current?.contains?.(e.target)
      ) {
        onClose();
      }
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, onClose, returnFocusRef]);

  if (!open) return null;

  const statementHref = `${lang.urlPrefix || ''}/information/accessibility`;

  const setContrast = (v) => {
    onUpdate({ contrast: v ? 'high' : 'normal' });
    announce(`${t.contrast} ${v ? t.on : t.off}`);
  };
  const setUnderline = (v) => {
    onUpdate({ underlineLinks: v });
    announce(`${t.underline} ${v ? t.on : t.off}`);
  };
  const setMotion = (v) => {
    onUpdate({ reduceMotion: v });
    announce(`${t.motion} ${v ? t.on : t.off}`);
  };

  return (
    <>
      {/* Dimming backdrop (mainly for small screens) — click to dismiss. */}
      <div className="fixed inset-0 z-[55] bg-black/20 sm:bg-transparent" aria-hidden="true" />

      <div
        id={id}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-desc`}
        className="fixed z-[60] top-20 right-2 sm:right-4 w-[min(20rem,calc(100vw-1rem))] max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 shadow-2xl ring-1 ring-black/5"
      >
        {/* Live region for screen readers */}
        <p className="sr-only" role="status" aria-live="polite">{announcement}</p>

        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-2">
          <div className="min-w-0">
            <h2 id={`${id}-title`} className="text-base font-semibold text-gray-900 dark:text-dark-100">
              {t.title}
            </h2>
            <p id={`${id}-desc`} className="mt-1 text-xs text-gray-500 dark:text-dark-400 leading-relaxed">
              {t.description}
            </p>
          </div>
          <button
            type="button"
            data-autofocus
            onClick={onClose}
            aria-label={t.close}
            className="shrink-0 p-1.5 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-dark-100 hover:bg-gray-100 dark:hover:bg-dark-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Controls */}
        <div className="px-4 pb-3 space-y-4">
          <Segmented
            name="a11y-theme"
            label={t.theme}
            value={theme === 'dark' ? 'dark' : 'light'}
            onChange={(v) => { onSetTheme(v); announce(`${t.theme}: ${v === 'dark' ? t.dark : t.light}`); }}
            options={[
              { value: 'light', label: t.light },
              { value: 'dark', label: t.dark },
            ]}
          />

          <Segmented
            name="a11y-size"
            label={t.textSize}
            value={prefs.fontScale}
            onChange={(v) => { onUpdate({ fontScale: v }); announce(`${t.textSize}: ${v}`); }}
            options={[
              { value: 'normal', label: t.sizeNormal, style: { fontSize: '0.8125rem' } },
              { value: 'large', label: t.sizeLarge, style: { fontSize: '0.9375rem' } },
              { value: 'larger', label: t.sizeLarger, style: { fontSize: '1.0625rem' } },
            ]}
          />

          <div className="pt-1 border-t border-gray-100 dark:border-dark-700 space-y-1">
            <Switch
              label={t.contrast}
              description={t.contrastDesc}
              checked={prefs.contrast === 'high'}
              onChange={setContrast}
            />
            <Switch
              label={t.underline}
              description={t.underlineDesc}
              checked={prefs.underlineLinks}
              onChange={setUnderline}
            />
            <Switch
              label={t.motion}
              description={t.motionDesc}
              checked={prefs.reduceMotion}
              onChange={setMotion}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 dark:border-dark-700 bg-gray-50/70 dark:bg-dark-900/40">
          <button
            type="button"
            onClick={() => { onReset(); announce(t.reseted); }}
            className="text-sm font-medium text-gray-600 dark:text-dark-300 hover:text-gray-900 dark:hover:text-dark-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-md px-1"
          >
            {t.reset}
          </button>
          <Link
            to={statementHref}
            onClick={onClose}
            className="text-sm font-medium text-accent-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-md px-1"
          >
            {t.statement}
          </Link>
        </div>
      </div>
    </>
  );
}
