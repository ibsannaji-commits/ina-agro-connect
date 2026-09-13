# INA Agro Connect — Next.js Production Starter

**Connecting Farmers • Suppliers • Buyers • Global Markets**

Full production-ready Next.js 15 + TypeScript + Tailwind CSS starter for the INA Agro Connect B2B agricultural marketplace.

## Features Included

- Modern App Router (Next.js 15)
- TypeScript
- Tailwind CSS design system (agricultural green theme)
- Responsive layout
- Shared Navbar & Footer
- Home page with hero, search, categories, featured products
- Marketplace with filters & product grid
- Seller Dashboard
- Clean component structure ready for expansion

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open http://localhost:3000
```

## Project Structure

```
app/
  page.tsx              → Home
  marketplace/page.tsx  → Marketplace
  seller/page.tsx       → Seller Dashboard
  buyer/                → (extend)
  product/              → (extend)
  rfq/                  → (extend)
  login/                → (extend)
  register/             → (extend)
  admin/                → (extend)
components/
  Navbar.tsx
  Footer.tsx
```

## Recommended Next Steps

1. Add remaining pages (Buyer, Product Detail, RFQ, Login, Register, Admin, Company Profile)
2. Connect to a backend (NestJS / Supabase / Prisma + PostgreSQL)
3. Add authentication (Clerk / NextAuth / Supabase Auth)
4. Implement real product images (Unsplash or Cloudinary)
5. Add mobile app with Flutter or Expo (React Native)
6. Deploy on Vercel

## Design Tokens

- Primary: `#1a7a4c`
- Primary Dark: `#0f5c38`
- Primary Light: `#e8f5ee`

## Tech Stack Recommendation for Full Production

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Frontend     | Next.js 15 + Tailwind + shadcn/ui  |
| Mobile       | Flutter or Expo (React Native)     |
| Backend      | NestJS or Supabase                 |
| Database     | PostgreSQL                         |
| Auth         | Clerk / Supabase Auth + OTP        |
| Storage      | Cloudflare R2 / AWS S3             |
| Hosting      | Vercel + Railway / Render          |

---

© 2026 INA Agro Connect
