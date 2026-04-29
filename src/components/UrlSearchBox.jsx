import { useState } from 'react';

export default function UrlSearchBox({ theme }) {
  const [url, setUrl] = useState('');
  const isDark = theme === 'dark';

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    try {
      new URL(trimmed);
    } catch {
      alert('Please enter a valid URL (e.g. https://www.bl.uk)');
      return;
    }
    alert('URL is correct');
  };

  return (
    <div className="my-6 px-5 py-4 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 dark:from-blue-900/80 dark:via-blue-800/50 dark:to-dark-900 border border-blue-800/30 dark:border-dark-700/50 lg:w-[70%]">
      <div className="text-sm font-semibold mb-3 text-white">
        Search the archive by URL
      </div>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="e.g. https://www.bl.uk"
          className={`flex-1 px-4 py-2 rounded-lg border text-sm transition-colors ${
            isDark
              ? 'border-dark-600 bg-dark-800 text-dark-100 placeholder-dark-500 focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20'
              : 'border-blue-300 bg-white text-gray-800 placeholder-gray-400 focus:border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300/50'
          }`}
        />
        <button
          type="submit"
          className="px-5 py-2 rounded-lg font-medium text-sm transition-colors bg-white text-blue-700 hover:bg-blue-50 dark:bg-accent-primary dark:text-white dark:hover:bg-blue-500"
        >
          Search
        </button>
      </form>
    </div>
  );
}
