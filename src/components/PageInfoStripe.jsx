import { useLanguage } from '../hooks/useLanguage';

export default function PageInfoStripe({ title }) {
  const lang = useLanguage();

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 md:px-6 md:pt-10">
      <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-sm text-ink-600 shadow-[0_8px_24px_rgba(15,23,42,0.06)] backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-mist-300 dark:shadow-none">
        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-brand-700 dark:text-brand-300">
          Archive
        </span>
        <span>{lang.siteTitle}</span>
        <span className="text-ink-300 dark:text-white/20">/</span>
        <span className="font-semibold text-ink-900 dark:text-white">{title || 'Overview'}</span>
      </div>
    </div>
  );
}
