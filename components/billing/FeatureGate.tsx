'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { logPaywallViewed } from '@/lib/analytics/client';
import type { SubscriptionTier } from '@/types/subscription';

type Props = {
  loading?: boolean;
  blocked: boolean;
  requiredTier?: Exclude<SubscriptionTier, 'FREE'>;
  label?: string;
  overlay?: boolean;
  children?: React.ReactNode;
  fallback?: React.ReactNode;
};

function TierFallback({ requiredTier, label }: { requiredTier?: Exclude<SubscriptionTier, 'FREE'>; label?: string }) {
  const headline = label ?? `This feature is available with ${requiredTier ?? 'Pro'}.`;

  return (
    <div className="rounded-xl border border-gold/20 bg-surface-2/80 p-6 text-left shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold/80">Upgrade Required</p>
      <h3 className="mt-2 font-display text-2xl text-foreground">{headline}</h3>
      <p className="mt-3 text-sm leading-6 text-foreground/70">
        Your journal stays intact. Upgrade to unlock this feature and the rest of the paid workspace.
      </p>
      <Link
        href="/pricing"
        className="mt-5 inline-flex rounded-sm border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-medium text-gold transition-colors hover:bg-gold/20"
      >
        Upgrade
      </Link>
    </div>
  );
}

function TierOverlay({
  children,
  headline,
}: {
  children: React.ReactNode;
  headline: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="pointer-events-none select-none opacity-30 blur-[2px]">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-xl border border-gold/25 bg-background/90 p-6 text-center shadow-lg shadow-gold/10 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold/80">Upgrade Required</p>
          <h3 className="mt-2 font-display text-2xl text-foreground">{headline}</h3>
          <p className="mt-3 text-sm leading-6 text-foreground/70">
            Your journal stays intact. Upgrade to unlock this feature and the rest of the paid workspace.
          </p>
          <Link
            href="/pricing"
            className="mt-5 inline-flex rounded-sm border border-gold/30 bg-gold/10 px-5 py-2.5 text-sm font-medium text-gold transition-colors hover:bg-gold/20"
          >
            Upgrade
          </Link>
        </div>
      </div>
    </div>
  );
}

export function FeatureGate({ children, fallback, ...rest }: Props) {
  const resolvedFallback = fallback ?? (
    <TierFallback requiredTier={rest.requiredTier} label={rest.label} />
  );

  useEffect(() => {
    if (!rest.loading && rest.blocked) {
      logPaywallViewed();
    }
  }, [rest.blocked, rest.loading]);

  if (rest.loading) {
    return null;
  }

  if (!rest.blocked) {
    return <>{children}</>;
  }

  if (rest.overlay && children) {
    const headline = rest.label ?? `This feature is available with ${rest.requiredTier ?? 'Pro'}.`;
    return <TierOverlay headline={headline}>{children}</TierOverlay>;
  }

  return <>{resolvedFallback}</>;
}
