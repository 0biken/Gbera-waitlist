'use client';

import { useEffect } from 'react';

// Counts one page view per browser session, not per load or per React re-mount.
export default function PageViewBeacon() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem('gbera:pv')) return;
      sessionStorage.setItem('gbera:pv', '1');
    } catch {
      // Storage blocked: fall through and count once for this mount
    }
    fetch('/api/pageview', { method: 'POST', keepalive: true }).catch(() => {});
  }, []);

  return null;
}
