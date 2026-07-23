import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useAnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    // 1. Get or create persistent visitor ID
    let visitorId = localStorage.getItem('nikahan_visitor_id');
    if (!visitorId) {
      visitorId = 'v_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('nikahan_visitor_id', visitorId);
    }

    // 2. Track page view asynchronously
    const trackPage = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page_path: location.pathname,
            visitor_id: visitorId,
          }),
        });
      } catch (err) {
        // Silent error for tracking
        console.debug('Analytics tracking skipped:', err);
      }
    };

    trackPage();
  }, [location.pathname]);
}
