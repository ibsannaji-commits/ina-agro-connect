/**
 * INA Agro Connect — Notifications (Resend Email + AfroMessage SMS)
 */
import { sendEmail, paymentSuccessHtml, expiryReminderHtml } from "./email";
import { sendSms, paymentSuccessSms, expiryReminderSms } from "./sms";

type NotifyPayload = {
  toEmail?: string;
  toPhone?: string;
  name?: string;
  plan?: string;
  amount?: number;
  txRef?: string;
  endsAt?: string;
  invoiceUrl?: string;
};

export async function sendPaymentSuccessNotification(payload: NotifyPayload) {
  const { toEmail, toPhone, name, plan, amount, txRef, endsAt, invoiceUrl } = payload;

  if (toEmail && plan && amount != null && txRef && endsAt) {
    await sendEmail({
      to: toEmail,
      subject: `INA Agro Connect — ${plan.toUpperCase()} subscription activated`,
      html: paymentSuccessHtml({
        name: name || "Customer",
        plan,
        amount,
        txRef,
        endsAt,
        invoiceUrl,
      }),
    });
  }

  if (toPhone && plan && amount != null && txRef) {
    await sendSms({
      to: toPhone,
      message: paymentSuccessSms({ plan, amount, txRef }),
    });
  }

  return { ok: true };
}

export async function sendSubscriptionExpiringNotification(payload: NotifyPayload) {
  const { toEmail, toPhone, name, plan, endsAt } = payload;

  if (toEmail && plan && endsAt) {
    await sendEmail({
      to: toEmail,
      subject: `INA Agro Connect — Your ${plan} plan expires soon`,
      html: expiryReminderHtml({
        name: name || "Customer",
        plan,
        endsAt,
      }),
    });
  }

  if (toPhone && plan && endsAt) {
    await sendSms({
      to: toPhone,
      message: expiryReminderSms({ plan, endsAt }),
    });
  }

  return { ok: true };
}
