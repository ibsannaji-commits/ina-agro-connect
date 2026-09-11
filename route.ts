import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/payments/chapa/webhook
 * Receives payment result from Chapa and verifies it.
 * Always re-verify with Chapa API before activating a subscription.
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

    // ALWAYS re-verify with Chapa (do not trust webhook payload alone)
    const verifyRes = await fetch(
      `https://api.chapa.co/v1/transaction/verify/${txRef}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    const verifyData = await verifyRes.json();

    if (
      verifyData.status === "success" &&
      verifyData.data?.status === "success"
    ) {
      const { amount, meta, reference } = verifyData.data;

      // TODO: Update database — mark payment success + activate subscription
      // 1. Find payment by tx_ref
      // 2. payment.status = "success", paidAt = now, providerRef = reference
      // 3. subscription.status = "active", set startsAt / endsAt based on billing_cycle
      // 4. Send confirmation email / SMS

      console.log("[Chapa Webhook] Payment verified:", {
        txRef,
        amount,
        reference,
        meta,
      });
    } else {
      console.log("[Chapa Webhook] Payment not successful:", txRef, verifyData);
    }

    // Always return 200 so Chapa stops retrying
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Chapa Webhook] Error:", error);
    // Still return 200 to avoid retry storms
    return NextResponse.json({ received: true });
  }
}
