'use client';

import { useContext } from 'react';
import { SubscriptionContext } from '@/context/SubscriptionContext';

export function useSubscription() {
  return useContext(SubscriptionContext);
}
