'use client';

import { useEffect } from 'react';
import { logLivingTreeViewed } from '@/lib/analytics';

export function RootsTracker() {
  useEffect(() => {
    logLivingTreeViewed();
  }, []);

  return null;
}
