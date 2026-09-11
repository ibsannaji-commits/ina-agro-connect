# INA Agro Connect — Vercel Deployment Guide

Deploy the Next.js app to production on **Vercel**.

---

## 1. Prerequisites

- GitHub / GitLab / Bitbucket account
- Vercel account → [vercel.com](https://vercel.com)
- Chapa live keys (when ready)
- Resend API key
- AfroMessage token (optional)
- Domain (optional, e.g. `inaagroconnect.com`)

---

## 2. Prepare the Project

```bash
cd ina-agro-nextjs

# Install dependencies
npm install

# Add PDF + any missing packages
npm install @react-pdf/renderer

# Test locally
npm run dev
```

Ensure these work:
- `/` Home
- `/pricing`
- `/subscription`
- `/admin/payments`
- `/api/payments/chapa/initialize` (needs env)

---

## 3. Environment Variables on Vercel

In Vercel Dashboard → Project → **Settings → Environment Variables**:

| Variable | Example | Notes |
|----------|---------|-------|
| `CHAPA_SECRET_KEY` | `CHASECK-...` | Live or test |
| `CHAPA_PUBLIC_KEY` | `CHAPUBK-...` | Optional |
| `NEXT_PUBLIC_APP_URL` | `https://inaagroconnect.com` | No trailing slash |
| `RESEND_API_KEY` | `re_...` | From resend.com |
| `EMAIL_FROM` | `INA Agro Connect <billing@yourdomain.com>` | Verified domain |
| `AFROMESSAGE_TOKEN` | `...` | Optional |
| `AFROMESSAGE_FROM` | `INAAGRO` | Approved sender ID |
| `CRON_SECRET` | random long string | Protect expire endpoint |
| `DATABASE_URL` | `postgresql://...` | When you add DB |

Set for **Production**, **Preview**, and **Development** as needed.

---

## 4. Deploy

### Option A — Vercel CLI

```bash
npm i -g vercel
cd ina-agro-nextjs
vercel login
vercel          # preview
vercel --prod   # production
```

### Option B — GitHub Integration (recommended)

1. Push `ina-agro-nextjs` to a GitHub repo
2. Vercel → **Add New Project** → Import repo
3. Framework: **Next.js** (auto-detected)
4. Root directory: leave default (or set if monorepo)
5. Add environment variables
6. **Deploy**

Every push to `main` = automatic production deploy.

---

## 5. Custom Domain

1. Vercel → Project → **Settings → Domains**
2. Add `inaagroconnect.com` and `www.inaagroconnect.com`
3. Point DNS (A / CNAME) as Vercel shows
4. Update `NEXT_PUBLIC_APP_URL` to `https://inaagroconnect.com`
5. Update Chapa webhook + return URLs to production domain
6. Update Resend domain verification

---

## 6. Chapa Production Checklist

- [ ] Switch to **live** Chapa secret key
- [ ] Webhook URL: `https://yourdomain.com/api/payments/chapa/webhook`
- [ ] Return URL uses production domain
- [ ] Test one real small payment
- [ ] Confirm subscription activates + email arrives

---

## 7. Cron Job (Subscription Expiry)

**Vercel Cron** (vercel.json):

```json
{
  "crons": [
    {
      "path": "/api/subscriptions/expire",
      "schedule": "0 2 * * *"
    }
  ]
}
```

Protect the route with `Authorization: Bearer CRON_SECRET`.

Vercel Cron automatically sends a special header; you can also check that, or use the Bearer secret.

---

## 8. Recommended Production Stack

| Layer | Service |
|-------|---------|
| Frontend + API | **Vercel** |
| Database | **Neon** / Supabase / Railway PostgreSQL |
| Email | **Resend** |
| SMS | **AfroMessage** |
| Payments | **Chapa** (includes Telebirr, CBE, banks) |
| File storage | Cloudflare R2 / Vercel Blob (later) |

---

## 9. Post-Deploy Smoke Test

1. Open `https://yourdomain.com`
2. Go to `/pricing` → select Pro → checkout flow
3. Complete test payment (or live small amount)
4. Confirm:
   - Webhook received
   - Subscription active
   - Email received
   - `/subscription` shows plan
   - Invoice PDF downloads
5. Check `/admin/payments`

---

## 10. Common Issues

| Problem | Fix |
|---------|-----|
| Webhook 404 | Ensure route is under `app/api/...` and deployed |
| Email not sent | Verify Resend domain + API key |
| PDF fails | `npm install @react-pdf/renderer` and redeploy |
| Env undefined | Set vars in Vercel and **redeploy** |
| Chapa redirect wrong | Check `NEXT_PUBLIC_APP_URL` has no trailing slash |

---

© 2026 INA Agro Connect
