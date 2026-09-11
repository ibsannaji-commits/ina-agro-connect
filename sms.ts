/**
 * INA Agro Connect — SMS via AfroMessage
 *
 * AfroMessage is a popular Ethiopian SMS gateway.
 * Docs / signup: https://afromessage.com (or check current portal)
 *
 * Alternative providers in Ethiopia:
 * - Hellio
 * - Ethio Telecom bulk SMS
 * - Twilio (international)
 *
 * Setup:
 * 1. Create AfroMessage account
 * 2. Get API token + sender ID (approved)
 * 3. Add to .env:
 *    AFROMESSAGE_TOKEN=...
 *    AFROMESSAGE_FROM=INAAGRO   (or your approved sender)
 */

type SendSmsParams = {
  to: string; // e.g. 0912345678 or +251912345678
  message: string;
};

/** Normalize Ethiopian phone to 2519xxxxxxxx */
function normalizePhone(phone: string): string {
  let p = phone.replace(/\s+/g, "").replace(/-/g, "");
  if (p.startsWith("0")) p = "251" + p.slice(1);
  if (p.startsWith("+")) p = p.slice(1);
  return p;
}

export async function sendSms({ to, message }: SendSmsParams) {
  const token = process.env.AFROMESSAGE_TOKEN;
  const from = process.env.AFROMESSAGE_FROM || "INAAGRO";

  if (!token) {
    console.warn("[SMS] AFROMESSAGE_TOKEN not set — logging only");
    console.log("[SMS]", { to, message });
    return { success: false, logged: true };
  }

  const phone = normalizePhone(to);

  // AfroMessage API shape (verify against current docs when integrating)
  // Common pattern:
  const response = await fetch("https://api.afromessage.com/api/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: phone,
      message,
      // Some accounts use: callback, template_id, etc.
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("[SMS] AfroMessage error:", data);
    return { success: false, error: data };
  }

  console.log("[SMS] Sent via AfroMessage:", phone);
  return { success: true, data };
}

/** Payment success SMS text */
export function paymentSuccessSms(params: {
  plan: string;
  amount: number;
  txRef: string;
}) {
  return `INA Agro Connect: ${params.plan.toUpperCase()} subscription activated. Amount: ${params.amount} ETB. Ref: ${params.txRef}. Galatoomi!`;
}

/** Expiry reminder SMS */
export function expiryReminderSms(params: { plan: string; endsAt: string }) {
  return `INA Agro Connect: Your ${params.plan} plan expires on ${params.endsAt}. Renew at inaagroconnect.com/subscription`;
}
