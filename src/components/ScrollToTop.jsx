import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

export default function ScrollToTop() {
  const { pathname, key } = useLocation();

  useLayoutEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.style.scrollBehavior = prev;
    });
  }, [pathname, key]);

  return null;
}
