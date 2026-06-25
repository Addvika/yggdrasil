'use client';

import { createContext, useEffect, useState, type ReactNode } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useAuth } from '@/hooks/useAuth';
import type { BillingPeriod, SubscriptionStatus, SubscriptionTier } from '@/types/subscription';

export type SubscriptionState = {
  tier: SubscriptionTier;
  entitlement: SubscriptionTier;
  status: SubscriptionStatus;
  billingPeriod: BillingPeriod | null;
  loading: boolean;
};

const defaultSubscriptionState: SubscriptionState = {
  tier: 'FREE',
  entitlement: 'FREE',
  status: 'none',
  billingPeriod: null,
  loading: true,
};

export const SubscriptionContext = createContext<SubscriptionState>(defaultSubscriptionState);

function resolveTier(billingPeriod: BillingPeriod | null): SubscriptionTier {
  return billingPeriod ? 'PRO' : 'FREE';
}

function resolveEntitlement(status: SubscriptionStatus, billingPeriod: BillingPeriod | null): SubscriptionTier {
  return status === 'active' && billingPeriod ? 'PRO' : 'FREE';
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<SubscriptionState>(defaultSubscriptionState);

  useEffect(() => {
    if (!user) {
      setState(defaultSubscriptionState);
      return;
    }

    const subscriptionRef = doc(db, 'subscriptions', user.uid);
    const unsubscribe = onSnapshot(subscriptionRef, (snapshot) => {
      if (!snapshot.exists()) {
        setState({
          tier: 'FREE',
          entitlement: 'FREE',
          status: 'none',
          billingPeriod: null,
          loading: false,
        });
        return;
      }

      const data = snapshot.data() as {
        status?: SubscriptionStatus;
        billingPeriod?: BillingPeriod | null;
      };
      const status = data.status ?? 'none';
      const billingPeriod = data.billingPeriod ?? null;

      setState({
        tier: resolveTier(billingPeriod),
        entitlement: resolveEntitlement(status, billingPeriod),
        status,
        billingPeriod,
        loading: false,
      });
    }, () => {
      setState({
        tier: 'FREE',
        entitlement: 'FREE',
        status: 'none',
        billingPeriod: null,
        loading: false,
      });
    });

    return unsubscribe;
  }, [user]);

  return (
    <SubscriptionContext.Provider value={state}>
      {children}
    </SubscriptionContext.Provider>
  );
}
