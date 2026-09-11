/**
 * INA Agro Connect — Subscription helpers
 * Activate, expire, renew
 */

export type PlanCode = "free" | "pro" | "premium";
export type BillingCycle = "monthly" | "yearly";

export const PLAN_PRICES: Record<
  PlanCode,
  { monthly: number; yearly: number }
> = {
  free: { monthly: 0, yearly: 0 },
  pro: { monthly: 1999, yearly: 19999 },
  premium: { monthly: 4999, yearly: 49999 },
};

/** Calculate subscription end date from start + cycle */
export function calculateEndsAt(
  startsAt: Date,
  billingCycle: BillingCycle
): Date {
  const ends = new Date(startsAt);
  if (billingCycle === "yearly") {
    ends.setFullYear(ends.getFullYear() + 1);
  } else {
    ends.setMonth(ends.getMonth() + 1);
  }
  return ends;
}

/**
 * Activate subscription after successful payment.
 * Call this from the Chapa webhook after verification.
 *
 * Pseudo-DB version — replace with your Prisma/SQL calls.
 */
export async function activateSubscription(params: {
  userId: string;
  plan: PlanCode;
  billingCycle: BillingCycle;
  amount: number;
  txRef: string;
  providerRef?: string;
  email?: string;
  phone?: string;
  name?: string;
}) {
  const { userId, plan, billingCycle, amount, txRef, providerRef, email, phone, name } =
    params;

  const startsAt = new Date();
  const endsAt = calculateEndsAt(startsAt, billingCycle);

  // ---------- 1. Update / create subscription in DB ----------
  // await db.subscription.upsert({
  //   where: { userId_planCode: { userId, planCode: plan } }, // or find active one
  //   create: {
  //     userId,
  //     planCode: plan,
  //     status: "active",
  //     billingCycle,
  //     amount,
  //     startsAt,
  //     endsAt,
  //   },
  //   update: {
  //     status: "active",
  //     billingCycle,
  //     amount,
  //     startsAt,
  //     endsAt,
  //   },
  // });

  // ---------- 2. Mark payment success ----------
  // await db.payment.update({
  //   where: { txRef },
  //   data: {
  //     status: "success",
  //     providerRef,
  //     paidAt: startsAt,
  //   },
  // });

  console.log("[Subscription] Activated:", {
    userId,
    plan,
    billingCycle,
    amount,
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
    txRef,
  });

  // ---------- 3. Send notifications ----------
  const { sendPaymentSuccessNotification } = await import("./notifications");
  await sendPaymentSuccessNotification({
    toEmail: email,
    toPhone: phone,
    name,
    plan,
    amount,
    txRef,
    endsAt: endsAt.toLocaleDateString("en-ET"),
  });

  return { startsAt, endsAt };
}

/**
 * Check and expire subscriptions that have passed endsAt.
 * Run this as a daily cron job (Vercel Cron, Railway, or node-cron).
 */
export async function expireDueSubscriptions() {
  const now = new Date();

  // Example with Prisma:
  // const expired = await db.subscription.updateMany({
  //   where: {
  //     status: "active",
  //     endsAt: { lt: now },
  //   },
  //   data: { status: "expired" },
  // });

  console.log("[Subscription] Expire job ran at", now.toISOString());
  // return expired.count;
  return 0;
}

/**
 * Find subscriptions expiring in the next N days and send reminders.
 */
export async function sendExpiryReminders(daysBefore = 7) {
  const now = new Date();
  const threshold = new Date(now);
  threshold.setDate(threshold.getDate() + daysBefore);

  // Example:
  // const soon = await db.subscription.findMany({
  //   where: {
  //     status: "active",
  //     endsAt: { gte: now, lte: threshold },
  //   },
  //   include: { user: true },
  // });
  //
  // for (const sub of soon) {
  //   await sendSubscriptionExpiringNotification({
  //     toEmail: sub.user.email,
  //     toPhone: sub.user.phone,
  //     name: sub.user.name,
  //     plan: sub.planCode,
  //     endsAt: sub.endsAt.toLocaleDateString("en-ET"),
  //   });
  // }

  console.log(`[Subscription] Expiry reminders (${daysBefore} days) job ran`);
  return 0;
}

/**
 * Renew an existing subscription (extend endsAt).
 * Call after a successful renewal payment.
 */
export async function renewSubscription(params: {
  subscriptionId: string;
  billingCycle: BillingCycle;
  amount: number;
  txRef: string;
}) {
  const { subscriptionId, billingCycle, amount, txRef } = params;

  // const sub = await db.subscription.findUnique({ where: { id: subscriptionId } });
  // if (!sub) throw new Error("Subscription not found");
  //
  // const base = sub.endsAt && sub.endsAt > new Date() ? sub.endsAt : new Date();
  // const newEndsAt = calculateEndsAt(base, billingCycle);
  //
  // await db.subscription.update({
  //   where: { id: subscriptionId },
  //   data: {
  //     status: "active",
  //     endsAt: newEndsAt,
  //     amount,
  //     billingCycle,
  //   },
  // });

  console.log("[Subscription] Renewed:", { subscriptionId, billingCycle, amount, txRef });
  return true;
}
