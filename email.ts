/**
 * INA Agro Connect — Resend Email Provider
 * Docs: https://resend.com/docs
 *
 * Setup:
 * 1. Create account at resend.com
 * 2. Add domain (or use onboarding@resend.dev for testing)
 * 3. Copy API key → RESEND_API_KEY in .env
 * 4. npm install resend
 */

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
  from?: string;
};

export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("[Email] RESEND_API_KEY not set — logging only");
    console.log("[Email]", { to, subject });
    return { id: "logged", success: false };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: from || process.env.EMAIL_FROM || "INA Agro Connect <billing@inaagroconnect.com>",
      to: [to],
      subject,
      html,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("[Email] Resend error:", data);
    return { success: false, error: data };
  }

  console.log("[Email] Sent via Resend:", data.id);
  return { success: true, id: data.id };
}

/** Payment success email template */
export function paymentSuccessHtml(params: {
  name: string;
  plan: string;
  amount: number;
  txRef: string;
  endsAt: string;
  invoiceUrl?: string;
}) {
  const { name, plan, amount, txRef, endsAt, invoiceUrl } = params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://inaagroconnect.com";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f7faf8;font-family:Inter,Arial,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:white;border-radius:12px;overflow:hidden;border:1px solid #e2e8e4;">
    <div style="background:#1a7a4c;padding:24px 28px;">
      <div style="color:white;font-size:20px;font-weight:700;">🌱 INA Agro Connect</div>
    </div>
    <div style="padding:28px;">
      <h1 style="color:#1a7a4c;font-size:22px;margin:0 0 12px;">Payment Successful ✅</h1>
      <p style="color:#333;line-height:1.6;">Dear ${name || "Customer"},</p>
      <p style="color:#333;line-height:1.6;">
        Your <strong>${plan.toUpperCase()}</strong> subscription is now active.
      </p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <tr>
          <td style="padding:8px 0;color:#5a6a5e;">Amount</td>
          <td style="padding:8px 0;text-align:right;font-weight:700;">${amount.toLocaleString()} ETB</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#5a6a5e;">Reference</td>
          <td style="padding:8px 0;text-align:right;font-family:monospace;font-size:13px;">${txRef}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#5a6a5e;">Valid until</td>
          <td style="padding:8px 0;text-align:right;font-weight:600;">${endsAt}</td>
        </tr>
      </table>
      <div style="text-align:center;margin:28px 0;">
        <a href="${appUrl}/subscription"
           style="background:#1a7a4c;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">
          View My Subscription
        </a>
      </div>
      ${
        invoiceUrl
          ? `<p style="text-align:center;"><a href="${invoiceUrl}" style="color:#1a7a4c;">Download Invoice (PDF)</a></p>`
          : ""
      }
      <p style="color:#888;font-size:13px;margin-top:32px;">
        INA Agro Connect — Connecting Agriculture to Opportunity<br>
        Ethiopia → Africa → Global
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/** Expiry reminder email */
export function expiryReminderHtml(params: {
  name: string;
  plan: string;
  endsAt: string;
}) {
  const { name, plan, endsAt } = params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://inaagroconnect.com";

  return `
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;">
  <h2 style="color:#1a7a4c;">Subscription expiring soon</h2>
  <p>Dear ${name || "Customer"},</p>
  <p>Your <strong>${plan.toUpperCase()}</strong> plan expires on <strong>${endsAt}</strong>.</p>
  <p>Renew now to keep full access to RFQs, analytics and verified features.</p>
  <p style="margin:24px 0;">
    <a href="${appUrl}/subscription"
       style="background:#1a7a4c;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;">
      Renew Subscription
    </a>
  </p>
  <p style="color:#888;font-size:13px;">INA Agro Connect</p>
</body>
</html>
  `.trim();
}
