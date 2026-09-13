# INA Agro Connect — Payment Integration Guide
## Chapa + Telebirr (Complete)

---

## 1. Database Tables (PostgreSQL / Prisma)

```prisma
// prisma/schema.prisma  (or equivalent SQL)

model SubscriptionPlan {
  id          String   @id @default(cuid())
  code        String   @unique   // free | pro | premium
  name        String
  priceMonthly Int               // in ETB (e.g. 1999)
  priceYearly  Int?
  features    Json
  createdAt   DateTime @default(now())
}

model Subscription {
  id            String   @id @default(cuid())
  userId        String
  companyId     String?
  planCode      String   // pro | premium
  status        String   // pending | active | cancelled | expired
  billingCycle  String   // monthly | yearly
  amount        Int      // ETB
  currency      String   @default("ETB")
  startsAt      DateTime?
  endsAt        DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  payments      Payment[]
}

model Payment {
  id              String   @id @default(cuid())
  subscriptionId  String?
  userId          String
  provider        String   // chapa | telebirr
  txRef           String   @unique   // our reference
  providerRef     String?            // Chapa/Telebirr reference
  amount          Int
  currency        String   @default("ETB")
  status          String   // pending | success | failed | cancelled
  meta            Json?
  paidAt          DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  subscription    Subscription? @relation(fields: [subscriptionId], references: [id])
}
```

**SQL equivalent (if not using Prisma):**

```sql
CREATE TABLE subscriptions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL,
  company_id    UUID,
  plan_code     VARCHAR(20) NOT NULL,
  status        VARCHAR(20) NOT NULL DEFAULT 'pending',
  billing_cycle VARCHAR(10) NOT NULL,
  amount        INTEGER NOT NULL,
  currency      VARCHAR(3) DEFAULT 'ETB',
  starts_at     TIMESTAMPTZ,
  ends_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id  UUID REFERENCES subscriptions(id),
  user_id          UUID NOT NULL,
  provider         VARCHAR(20) NOT NULL,
  tx_ref           VARCHAR(100) UNIQUE NOT NULL,
  provider_ref     VARCHAR(100),
  amount           INTEGER NOT NULL,
  currency         VARCHAR(3) DEFAULT 'ETB',
  status           VARCHAR(20) NOT NULL DEFAULT 'pending',
  meta             JSONB,
  paid_at          TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_tx_ref ON payments(tx_ref);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
```

---

## 2. Environment Variables

```env
# .env.local / .env

CHAPA_SECRET_KEY=CHASECK_TEST-xxxxxxxxxxxxxxxx   # or live key
CHAPA_PUBLIC_KEY=CHAPUBK_TEST-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional Telebirr (direct)
TELEBIRR_APP_ID=
TELEBIRR_APP_KEY=
TELEBIRR_SHORT_CODE=
TELEBIRR_PUBLIC_KEY=
TELEBIRR_PRIVATE_KEY=
TELEBIRR_NOTIFY_URL=https://yourdomain.com/api/payments/telebirr/webhook
TELEBIRR_RETURN_URL=https://yourdomain.com/checkout/success
```

---

## 3. Chapa — Full Next.js API Routes

### 3.1 Initialize Payment
`app/api/payments/chapa/initialize/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      amount,
      email,
      first_name,
      last_name,
      phone,
      plan,          // "pro" | "premium"
      billing_cycle, // "monthly" | "yearly"
      user_id,
    } = body;

    if (!amount || !email || !plan || !user_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const tx_ref = `INA-${plan}-${user_id.slice(0, 8)}-${Date.now()}`;

    // TODO: Create pending Payment + Subscription records in your DB here
    // await db.payment.create({ data: { txRef: tx_ref, userId: user_id, amount, status: "pending", provider: "chapa", ... }})

    const response = await fetch("https://api.chapa.co/v1/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: String(amount),
        currency: "ETB",
        email,
        first_name: first_name || "Customer",
        last_name: last_name || "User",
        phone_number: phone,
        tx_ref,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/chapa/webhook`,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?tx_ref=${tx_ref}`,
        customization: {
          title: "INA Agro Connect",
          description: `${plan.toUpperCase()} — ${billing_cycle} subscription`,
        },
        meta: {
          plan,
          billing_cycle,
          user_id,
        },
      }),
    });

    const data = await response.json();

    if (data.status === "success" && data.data?.checkout_url) {
      return NextResponse.json({
        checkout_url: data.data.checkout_url,
        tx_ref,
      });
    }

    return NextResponse.json(
      { error: data.message || "Failed to initialize payment" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Chapa initialize error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

### 3.2 Webhook
`app/api/payments/chapa/webhook/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    // Typical payload: { trx_ref, ref_id, status }

    const txRef = payload.trx_ref || payload.tx_ref;
    if (!txRef) {
      return NextResponse.json({ error: "Missing tx_ref" }, { status: 400 });
    }

    // ALWAYS re-verify with Chapa
    const verifyRes = await fetch(
      `https://api.chapa.co/v1/transaction/verify/${txRef}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );
    const verifyData = await verifyRes.json();

    if (verifyData.status === "success" && verifyData.data?.status === "success") {
      const { amount, meta, reference } = verifyData.data;

      // TODO: Update your database
      // 1. Find payment by tx_ref
      // 2. Mark payment status = "success", paidAt = now, providerRef = reference
      // 3. Activate subscription (status = "active", set startsAt / endsAt)
      // 4. Optionally send email/SMS confirmation

      console.log("Payment verified:", txRef, amount, meta);
    }

    // Always return 200 so Chapa does not retry endlessly
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ received: true }); // still 200
  }
}
```

### 3.3 Success Page
`app/checkout/success/page.tsx`

```tsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const txRef = searchParams.get("tx_ref");

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful</h1>
        <p className="text-gray-500 mb-6">
          Thank you! Your subscription is being activated.
          {txRef && (
            <span className="block mt-2 text-sm font-mono text-gray-400">
              Ref: {txRef}
            </span>
          )}
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/seller"
            className="btn btn-primary w-full py-3"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/pricing"
            className="btn btn-outline w-full py-3"
          >
            View Plans
          </Link>
        </div>
      </div>
    </div>
  );
}
```

---

## 4. Frontend — Call Initialize from Checkout

```typescript
// Example in a React component or checkout page

async function handlePayNow(formData: {
  amount: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  plan: "pro" | "premium";
  billing_cycle: "monthly" | "yearly";
  user_id: string;
}) {
  const res = await fetch("/api/payments/chapa/initialize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (data.checkout_url) {
    window.location.href = data.checkout_url; // Redirect to Chapa
  } else {
    alert(data.error || "Payment initialization failed");
  }
}
```

---

## 5. Telebirr Direct (Summary)

Telebirr requires:
1. Merchant registration at [developer.ethiotelecom.et](https://developer.ethiotelecom.et)
2. AppId, AppKey, ShortCode, Public Key, Private Key
3. Flow:
   - Get Fabric Token / Auth Token
   - Create Order → receive `toPayUrl`
   - Redirect user to Telebirr H5 page
   - Receive result on Notify URL (webhook)
4. Signature is RSA-based — more complex than Chapa

**Recommendation:**  
Start with **Chapa**. It already includes Telebirr as a payment method on its hosted checkout.  
Add direct Telebirr later only if you need deeper control or lower fees on pure Telebirr volume.

---

## 6. Security Checklist

- [ ] `CHAPA_SECRET_KEY` only on server (never in frontend)
- [ ] Unique `tx_ref` for every payment
- [ ] Always verify via Chapa Verify API in webhook
- [ ] Recalculate amount on server (do not trust client)
- [ ] Use HTTPS in production
- [ ] Store pending payment before redirecting
- [ ] Idempotent webhook handling (same tx_ref processed only once)

---

## 7. Test Cards / Test Mode

Chapa Test mode:
- Use `CHASECK_TEST-...` key
- No real money moves
- Test different payment methods from Chapa dashboard documentation

---

## 8. Production Launch Steps

1. Complete Chapa merchant KYC + bank settlement account
2. Switch to live secret key
3. Set live webhook URL in Chapa dashboard
4. Test one real small payment
5. Monitor `payments` and `subscriptions` tables
6. Add email/SMS confirmation after successful payment

---

© 2026 INA Agro Connect  
Chapa docs: https://developer.chapa.co  
Telebirr developer: https://developer.ethiotelecom.et
