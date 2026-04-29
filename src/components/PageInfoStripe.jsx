import { useLanguage } from '../hooks/useLanguage';

export default function PageInfoStripe({ title }) {
  const lang = useLanguage();

  return (
    <div className="bg-gradient-to-r from-blue-700 to-blue-600 dark:from-blue-900/80 dark:via-blue-800/50 dark:to-dark-900 py-3 border-b border-blue-800/30 dark:border-dark-700/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-2 text-sm md:text-base font-medium">
          <span className="text-blue-100 dark:text-dark-400">You are here:</span>
          <span className="text-blue-200 dark:text-dark-500">&gt;</span>
          <span className="text-white dark:text-dark-200 font-semibold">{title}</span>
        </div>
      </div>
    </div>
  );
}
