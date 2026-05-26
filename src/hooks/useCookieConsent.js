import { useCallback, useEffect, useState } from 'react';
import {
  CONSENT_EVENT,
  acceptCookies,
  getConsentStatus,
  initAnalytics,
  rejectCookies,
  resetCookieConsent,
} from '../utils/analytics';

// Tracks current cookie consent state and exposes accept/reject/reset
// actions. Also installs Consent Mode v2 defaults + GA4 loader on mount.
export function useCookieConsent() {
  const [status, setStatus] = useState(() => getConsentStatus());
  const [bannerOpen, setBannerOpen] = useState(() => getConsentStatus() === 'unset');

  useEffect(() => {
    initAnalytics();
    const onChange = (e) => {
      const next = e.detail?.status ?? getConsentStatus();
      setStatus(next);
      // Hide banner when the user makes a choice; reopen only when reset.
      if (next === 'unset') setBannerOpen(true);
      else setBannerOpen(false);
    };
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  const accept = useCallback(() => acceptCookies(), []);
  const reject = useCallback(() => rejectCookies(), []);
  const reset = useCallback(() => {
    resetCookieConsent();
    setBannerOpen(true);
  }, []);
  const openBanner = useCallback(() => setBannerOpen(true), []);
  const closeBanner = useCallback(() => setBannerOpen(false), []);

  return { status, bannerOpen, accept, reject, reset, openBanner, closeBanner };
}
