# INA Agro Connect — Production Launch Checklist

## A. Local setup (kompiitara kee irratti)

```bash
cd ina-agro-nextjs
npm install
cp .env.local.example .env.local
# Edit .env.local — keys galchi
npm run dev
```

## B. Accounts barbaachisoo

| Service | URL | Maal fudhatta |
|---------|-----|---------------|
| **Chapa** | https://dashboard.chapa.co | Secret Key (LIVE), Public Key |
| **Resend** | https://resend.com | API Key + domain verify |
| **AfroMessage** | https://afromessage.com | Token + Sender ID |
| **Vercel** | https://vercel.com | Account (GitHub login) |
| **Domain** | Namecheap / Cloudflare / etc. | inaagroconnect.com |

## C. Chapa Production

1. Dashboard → switch to **Live** mode
2. Copy `CHASECK-...` (not TEST)
3. Settings → Webhooks:
   - URL: `https://YOURDOMAIN.com/api/payments/chapa/webhook`
   - Events: payment success
4. Return URL already set in code via `NEXT_PUBLIC_APP_URL`

## D. Resend

1. Add domain (e.g. inaagroconnect.com)
2. Add DNS records Resend shows (SPF, DKIM)
3. Create API key
4. `EMAIL_FROM=INA Agro Connect <billing@inaagroconnect.com>`

## E. AfroMessage

1. Register + KYC
2. Request Sender ID (e.g. INAAGRO)
3. Copy API token
4. Test one SMS

## F. Vercel Deploy

```bash
# Option 1: CLI
npm i -g vercel
vercel login
vercel --prod

# Option 2: GitHub (recommended)
# 1. Push repo to GitHub
# 2. vercel.com → Import Project
# 3. Add all Environment Variables
# 4. Deploy
```

### Environment Variables on Vercel

- `NEXT_PUBLIC_APP_URL` = `https://inaagroconnect.com`
- `CHAPA_SECRET_KEY` = live key
- `CHAPA_PUBLIC_KEY`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `AFROMESSAGE_TOKEN`
- `AFROMESSAGE_FROM`
- `CRON_SECRET`

## G. Domain

1. Vercel → Domains → add `inaagroconnect.com`
2. DNS A/CNAME as Vercel instructs
3. Update `NEXT_PUBLIC_APP_URL`
4. Update Chapa webhook to production URL
5. Redeploy

## H. Smoke Test (production)

- [ ] Home page loads
- [ ] /pricing works
- [ ] Checkout → Chapa (small live payment)
- [ ] Webhook received (check Vercel logs)
- [ ] Email arrives
- [ ] SMS arrives (if configured)
- [ ] /subscription shows plan
- [ ] Invoice PDF downloads: `/api/invoices/TXREF/pdf`
- [ ] /admin/payments visible

## I. After launch

- Monitor Vercel logs + Chapa dashboard daily (first week)
- Set up database (Neon/Supabase) and replace mock data
- Enable real user auth
- Onboard first suppliers

---

© 2026 INA Agro Connect
