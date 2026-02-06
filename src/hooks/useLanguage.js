import { useLocation } from 'react-router-dom';
import { languages, defaultLanguage } from '../config/languages';

export function useLanguage() {
  const location = useLocation();
  const path = location.pathname;

  if (path.startsWith('/cy')) return languages.cy;
  if (path.startsWith('/gd')) return languages.gd;
  return languages[defaultLanguage];
}
