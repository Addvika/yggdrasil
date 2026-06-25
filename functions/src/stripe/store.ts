import * as admin from 'firebase-admin';

type StripeBillingContext = {
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
};

export async function getStripeBillingContext(uid: string): Promise<StripeBillingContext> {
  const db = admin.firestore();

  const [userSnap, subscriptionSnap] = await Promise.all([
    db.doc(`users/${uid}`).get(),
    db.doc(`subscriptions/${uid}`).get(),
  ]);

  const userData = userSnap.data() as { stripeCustomerId?: string } | undefined;
  const subscriptionData = subscriptionSnap.data() as { stripeSubscriptionId?: string } | undefined;

  return {
    stripeCustomerId: userData?.stripeCustomerId ?? null,
    stripeSubscriptionId: subscriptionData?.stripeSubscriptionId ?? null,
  };
}
