import { useNavigate, useLocation } from 'react-router-dom';
import { languages, languageOrder } from '../config/languages';
import { useLanguage } from '../hooks/useLanguage';

export default function LanguageSwitcher() {
  const currentLang = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const switchLanguage = (targetLangCode) => {
    const targetLang = languages[targetLangCode];
    const currentPrefix = currentLang.urlPrefix;

    // Extract the page path after the language prefix
    let pagePath = location.pathname;
    if (currentPrefix && pagePath.startsWith(currentPrefix)) {
      pagePath = pagePath.slice(currentPrefix.length);
    }

    // Build new path with target language prefix
    const newPath = `${targetLang.urlPrefix}${pagePath}` || '/';
    navigate(newPath === '' ? '/' : newPath);
  };

  return (
    <div className="flex items-center gap-2">
      {languageOrder
        .filter(code => code !== currentLang.code)
        .map(code => (
          <button
            key={code}
            onClick={() => switchLanguage(code)}
            className="lang-btn"
          >
            <span className="text-[0.68rem] font-bold uppercase tracking-[0.22em]">
              {code}
            </span>
            <span className="hidden sm:inline">{languages[code].name}</span>
          </button>
        ))}
    </div>
  );
}
