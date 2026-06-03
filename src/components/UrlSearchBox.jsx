import { useState } from 'react';

const inputResetStyle = {
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  appearance: 'none',
  boxSizing: 'border-box',
};

const buttonResetStyle = {
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  appearance: 'none',
  WebkitTapHighlightColor: 'transparent',
};

export default function UrlSearchBox({ theme }) {
  const [url, setUrl] = useState('');
  const isDark = theme === 'dark';

  const validateUrl = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return false;
    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (validateUrl(url)) {
      window.alert('URL is correct');
    } else {
      window.alert('URL is not correct. Please enter a valid URL starting with http:// or https://');
    }
  };

  return (
    <div className="my-6 w-full px-4 sm:px-5 py-4 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 dark:from-blue-900/80 dark:via-blue-800/50 dark:to-dark-900 border border-blue-800/30 dark:border-dark-700/50 shadow-sm">
      <label
        htmlFor="ukwa-url-search-input"
        className="block text-sm font-semibold mb-3 text-white"
      >
        Search the archive by URL
      </label>
      <form
        onSubmit={handleSearch}
        noValidate
        className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full"
      >
        <input
          id="ukwa-url-search-input"
          type="text"
          inputMode="url"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.bl.uk"
          aria-label="URL to search"
          style={inputResetStyle}
          className={`flex-1 min-w-0 w-full px-4 py-2.5 rounded-lg border text-sm leading-normal transition-colors ${
            isDark
              ? 'border-dark-600 bg-dark-800 text-dark-100 placeholder-dark-400 focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/30'
              : 'border-blue-300 bg-white text-gray-800 placeholder-gray-500 focus:border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300/50'
          }`}
        />
        <button
          type="submit"
          style={buttonResetStyle}
          className="shrink-0 px-6 py-2.5 rounded-lg font-medium text-sm transition-colors cursor-pointer bg-white text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/70 dark:bg-accent-primary dark:text-white dark:hover:bg-blue-500"
        >
          Search
        </button>
      </form>
    </div>
  );
}
