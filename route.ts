import { NextRequest, NextResponse } from "next/server";
import { activateSubscription, PlanCode, BillingCycle } from "@/lib/subscriptions";

/**
 * POST /api/payments/chapa/webhook
 * Receives payment result from Chapa, verifies, activates subscription, sends notifications.
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const txRef = payload.trx_ref || payload.tx_ref;

    if (!txRef) {
      return NextResponse.json({ error: "Missing tx_ref" }, { status: 400 });
    }

    const secretKey = process.env.CHAPA_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ received: true });
    }

    // ALWAYS re-verify with Chapa
    const verifyRes = await fetch(
      `https://api.chapa.co/v1/transaction/verify/${txRef}`,
      {
        headers: { Authorization: `Bearer ${secretKey}` },
      }
    );
    const verifyData = await verifyRes.json();

    if (
      verifyData.status === "success" &&
      verifyData.data?.status === "success"
    ) {
      const { amount, meta, reference, first_name, email, phone_number } =
        verifyData.data;

      const plan = (meta?.plan || "pro") as PlanCode;
      const billingCycle = (meta?.billing_cycle || "monthly") as BillingCycle;
      const userId = meta?.user_id || "unknown";

      // Activate subscription + send email/SMS
      await activateSubscription({
        userId,
        plan,
        billingCycle,
        amount: Number(amount) || 0,
        txRef,
        providerRef: reference,
        email: email || meta?.email,
        phone: phone_number || meta?.phone,
        name: first_name || meta?.name,
      });

      console.log("[Chapa Webhook] Activated:", txRef, plan, amount);
    } else {
      console.log("[Chapa Webhook] Not successful:", txRef, verifyData?.data?.status);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Chapa Webhook] Error:", error);
    return NextResponse.json({ received: true });
  }
}
