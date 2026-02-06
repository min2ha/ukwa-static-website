import { useState, useEffect } from 'react';
import { loadMarkdown } from '../utils/markdownLoader';

export function useMarkdown(lang, slug) {
  const [data, setData] = useState({ metadata: {}, content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    loadMarkdown(lang, slug)
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [lang, slug]);

  return { ...data, loading, error };
}
