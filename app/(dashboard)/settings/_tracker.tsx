'use client';

import { useEffect } from 'react';
import { logSettingsOpened } from '@/lib/analytics';

export function SettingsTracker() {
  useEffect(() => {
    logSettingsOpened();
  }, []);

  return null;
}
