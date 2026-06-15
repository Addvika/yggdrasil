'use client';

import { useEffect } from 'react';
import { logInsightsTabViewed } from '@/lib/analytics';

export function InsightsTracker() {
  useEffect(() => {
    logInsightsTabViewed();
  }, []);

  return null;
}
