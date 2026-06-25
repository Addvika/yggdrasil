import type { BillingPeriod, SubscriptionTier } from '@/types/subscription';

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  tier: SubscriptionTier;
  entitlement?: SubscriptionTier;
  billingPeriod?: BillingPeriod | null;
  createdAt: number;
  streakDays: number;
  lastEntryAt: number;
  analyticsClientId?: string;
}
