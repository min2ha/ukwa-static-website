import { useNavigate, useLocation } from 'react-router-dom';
import { languages, languageOrder } from '../config/languages';
import { useLanguage } from '../hooks/useLanguage';

export default function LanguageSwitcher() {
  const currentLang = useLanguage();
  const navigate    = useNavigate();
  const location    = useLocation();

  function switchTo(targetCode) {
    const target  = languages[targetCode];
    const current = currentLang;

    // Determine the slug portion of the current URL
    const currentPrefix = current.urlPrefix || '';
    const slugPath = location.pathname.startsWith(currentPrefix)
      ? location.pathname.slice(currentPrefix.length) || '/'
      : '/';

    const newPath = (target.urlPrefix || '') + (slugPath === '/' ? '' : slugPath) || '/';
    navigate(newPath || '/');
  }

  return (
    <div className="flex items-center gap-1" aria-label="Language selection">
      {languageOrder
        .filter((code) => code !== currentLang.code)
        .map((code) => (
          <button
            key={code}
            onClick={() => switchTo(code)}
            className="lang-btn"
            aria-label={`Switch to ${languages[code].name}`}
          >
            {languages[code].name}
          </button>
        ))}
    </div>
  );
}
