import Stripe from 'stripe';

// Use a Proxy to prevent crashes during Next.js build-time data collection while ensuring clear errors at runtime.
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-05-27.dahlia' as any, // Bypass strict type check
    })
  : new Proxy({} as Stripe, {
      get() {
        throw new Error('STRIPE_SECRET_KEY is missing. Please set it in your environment variables.');
      }
    });
