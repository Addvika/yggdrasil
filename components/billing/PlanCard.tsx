'use client';

import { httpsCallable } from 'firebase/functions';
import { useState } from 'react';
import { functions } from '@/lib/firebase/client';
import type { BillingPeriod, RecurringBillingPeriod } from '@/types/subscription';

export type PlanCardActionProps = {
  actionLabel: string;
  helperText?: string;
  isCurrent: boolean;
  disabled?: boolean;
  useBillingPortal?: boolean;
  billingPortalBillingPeriod?: RecurringBillingPeriod;
  openInNewTab?: boolean;
};

type Props = {
  title: string;
  price: string;
  description: string;
  billingPeriod: BillingPeriod;
  badge?: string;
  subtext?: string;
} & PlanCardActionProps;

export function PlanCard({
  title,
  price,
  description,
  billingPeriod,
  badge,
  subtext,
  actionLabel,
  helperText,
  isCurrent,
  disabled,
  useBillingPortal,
  billingPortalBillingPeriod,
  openInNewTab,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (disabled) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (useBillingPortal) {
        const createBillingPortalSession = httpsCallable<{ billingPeriod?: RecurringBillingPeriod }, { url: string }>(functions, 'createBillingPortalSession');
        const result = await createBillingPortalSession(
          billingPortalBillingPeriod ? { billingPeriod: billingPortalBillingPeriod } : {},
        );
        if (openInNewTab) {
          window.open(result.data.url, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = result.data.url;
        }
        return;
      }

      const createCheckout = httpsCallable<{ billingPeriod: BillingPeriod }, { url: string }>(functions, 'createCheckout');
      const result = await createCheckout({ billingPeriod });
      window.location.href = result.data.url;
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'Checkout failed.');
      setLoading(false);
    }
  };

  return (
    <div className={`relative flex h-full flex-col rounded-2xl border p-6 shadow-sm transition-colors ${
      isCurrent
        ? 'border-gold/60 bg-gold/10 ring-1 ring-gold/40'
        : 'border-border/60 bg-surface'
    }`}>
      {isCurrent ? (
        <span className="absolute right-4 top-4 rounded-full border border-sage/30 bg-sage/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-sage">
          Current Plan
        </span>
      ) : badge ? (
        <span className="absolute right-4 top-4 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
          {badge}
        </span>
      ) : null}
      <div className="space-y-3">
        <h2 className="font-display text-2xl text-foreground">{title}</h2>
        <p className="text-4xl text-foreground">{price}</p>
        <p className="text-sm leading-6 text-foreground/70">{description}</p>
        {subtext ? <p className="text-xs uppercase tracking-[0.18em] text-sage">{subtext}</p> : null}
      </div>

      <div className="mt-auto pt-8">
        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading || disabled}
          className={`w-full cursor-pointer rounded-sm px-4 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
            isCurrent
              ? 'border border-sage/30 bg-sage/10 text-sage'
              : 'border border-gold/30 bg-gold/10 text-gold enabled:hover:bg-gold/20'
          }`}
        >
          {loading ? 'Redirecting...' : actionLabel}
        </button>

        {helperText ? <p className="mt-3 text-sm text-foreground/60">{helperText}</p> : null}
        {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
      </div>
    </div>
  );
}
