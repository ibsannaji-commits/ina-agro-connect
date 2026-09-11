/**
 * INA Agro Connect — Notification helpers
 * Email + SMS after successful payment / subscription events
 *
 * Production:
 * - Email: Resend, Nodemailer, or SendGrid
 * - SMS:  Twilio, or Ethiopian providers (e.g. AfroMessage, Hellio)
 */

type NotifyPayload = {
  toEmail?: string;
  toPhone?: string;
  name?: string;
  plan?: string;
  amount?: number;
  txRef?: string;
  endsAt?: string;
};

export async function sendPaymentSuccessNotification(payload: NotifyPayload) {
  const { toEmail, toPhone, name, plan, amount, txRef, endsAt } = payload;

  // ---------- EMAIL ----------
  if (toEmail) {
    const subject = `INA Agro Connect — ${plan?.toUpperCase()} subscription activated`;
    const html = `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
        <h2 style="color:#1a7a4c;">Payment Successful ✅</h2>
        <p>Dear ${name || "Customer"},</p>
        <p>Your <strong>${plan?.toUpperCase()}</strong> subscription is now active.</p>
        <ul>
          <li><strong>Amount:</strong> ${amount?.toLocaleString()} ETB</li>
          <li><strong>Reference:</strong> ${txRef}</li>
          ${endsAt ? `<li><strong>Valid until:</strong> ${endsAt}</li>` : ""}
        </ul>
        <p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/seller"
             style="background:#1a7a4c;color:white;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block;">
            Go to Dashboard
          </a>
        </p>
        <p style="color:#666;font-size:13px;">INA Agro Connect — Connecting Agriculture to Opportunity</p>
      </div>
    `;

    // Example with Resend (recommended for production)
    // await fetch("https://api.resend.com/emails", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     from: "INA Agro Connect <billing@inaagroconnect.com>",
    //     to: toEmail,
    //     subject,
    //     html,
    //   }),
    // });

    console.log("[Email] Payment success →", toEmail, subject);
    // For now we only log. Uncomment Resend block above when ready.
  }

  // ---------- SMS ----------
  if (toPhone) {
    const message = `INA Agro Connect: ${plan?.toUpperCase()} subscription activated. Amount: ${amount} ETB. Ref: ${txRef}. Galatoomi!`;

    // Example with a generic SMS API
    // await fetch("https://api.your-sms-provider.com/send", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${process.env.SMS_API_KEY}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ to: toPhone, message }),
    // });

    console.log("[SMS] Payment success →", toPhone, message);
  }

  return { ok: true };
}

export async function sendSubscriptionExpiringNotification(payload: NotifyPayload) {
  const { toEmail, toPhone, name, plan, endsAt } = payload;

  if (toEmail) {
    console.log(
      `[Email] Subscription expiring → ${toEmail} | ${plan} ends ${endsAt}`
    );
    // Same pattern as above — send reminder email
  }

  if (toPhone) {
    const message = `INA Agro Connect: Your ${plan} plan expires on ${endsAt}. Renew now to keep full access.`;
    console.log("[SMS] Expiring reminder →", toPhone, message);
  }

  return { ok: true };
}
