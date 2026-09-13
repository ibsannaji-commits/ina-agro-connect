# INA Agro Connect — Database Schema & API Design

## 1. Core Entities (PostgreSQL)

### users
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| email | VARCHAR UNIQUE | |
| phone | VARCHAR | |
| password_hash | VARCHAR | |
| role | ENUM | farmer, supplier, buyer, logistics, admin |
| status | ENUM | pending, active, suspended |
| preferred_language | VARCHAR | en, am, om |
| created_at / updated_at | TIMESTAMPTZ | |

### companies
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| owner_user_id | UUID FK → users | |
| name | VARCHAR | |
| country | VARCHAR | |
| region | VARCHAR | Oromia, Sidama, etc. |
| business_type | VARCHAR | producer, exporter, cooperative, trader |
| verification_status | ENUM | unverified, pending, verified, rejected |
| response_rate | DECIMAL | |
| successful_transactions | INT | |
| about | TEXT | |

### products
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| company_id | UUID FK | |
| category_id | UUID FK | |
| title | VARCHAR | |
| description | TEXT | |
| origin_region | VARCHAR | |
| available_qty | DECIMAL | |
| unit | VARCHAR | MT, kg |
| moq | DECIMAL | |
| price_type | ENUM | fixed, negotiable |
| price_amount | DECIMAL NULL | |
| quality_grade | VARCHAR | |
| moisture | VARCHAR | |
| packaging | VARCHAR | |
| harvest_date | DATE | |
| status | ENUM | draft, pending, published, rejected |
| verified | BOOLEAN | |

### rfqs
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| buyer_id | UUID FK → users | |
| product_name | VARCHAR | |
| quantity | DECIMAL | |
| unit | VARCHAR | |
| quality_spec | TEXT | |
| destination | VARCHAR | |
| incoterms | VARCHAR | |
| packaging | VARCHAR | |
| required_date | DATE | |
| notes | TEXT | |
| visibility | ENUM | public, selected, private |
| status | ENUM | open, reviewing, awarded, closed |

### rfq_responses
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| rfq_id | UUID FK | |
| supplier_id | UUID FK | |
| price | DECIMAL | |
| available_qty | DECIMAL | |
| lead_time_days | INT | |
| delivery_terms | TEXT | |
| payment_terms | TEXT | |
| status | ENUM | submitted, accepted, rejected |

### orders
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| order_number | VARCHAR UNIQUE | INA-2026-xxxxx |
| buyer_id | UUID FK | |
| supplier_id | UUID FK | |
| product_id | UUID FK | |
| rfq_response_id | UUID FK NULL | |
| quantity | DECIMAL | |
| unit_price | DECIMAL | |
| total_amount | DECIMAL | |
| currency | VARCHAR | |
| status | ENUM | confirmed, processing, quality_check, ready, shipped, delivered, cancelled |
| payment_status | ENUM | pending, paid, refunded |

### messages
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| conversation_id | UUID | |
| sender_id | UUID FK | |
| body | TEXT | |
| attachments | JSONB | |
| read_at | TIMESTAMPTZ NULL | |

### verifications
| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| entity_type | ENUM | company, product, identity |
| entity_id | UUID | |
| documents | JSONB | |
| status | ENUM | pending, approved, rejected |
| reviewed_by | UUID FK NULL | |
| notes | TEXT | |

---

## 2. Recommended API Structure (REST / NestJS or Next.js API Routes)

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/otp/send
POST   /api/auth/otp/verify
POST   /api/auth/refresh
```

### Users & Companies
```
GET    /api/me
PATCH  /api/me
GET    /api/companies/:id
PATCH  /api/companies/:id
POST   /api/companies/:id/verify
```

### Products & Marketplace
```
GET    /api/products?category=&region=&q=
GET    /api/products/:id
POST   /api/products
PATCH  /api/products/:id
DELETE /api/products/:id
```

### RFQ
```
POST   /api/rfqs
GET    /api/rfqs          (buyer: own, supplier: matching)
GET    /api/rfqs/:id
POST   /api/rfqs/:id/responses
PATCH  /api/rfq-responses/:id
```

### Orders
```
POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
PATCH  /api/orders/:id/status
```

### Messaging
```
GET    /api/conversations
GET    /api/conversations/:id/messages
POST   /api/conversations/:id/messages
```

### Admin
```
GET    /api/admin/stats
GET    /api/admin/verifications
PATCH  /api/admin/verifications/:id
GET    /api/admin/users
```

---

## 3. Tech Recommendations

| Layer | Choice |
|-------|--------|
| Database | PostgreSQL |
| ORM | Prisma or Drizzle |
| Backend | NestJS or Next.js API + Supabase |
| Auth | Clerk / Supabase Auth + OTP |
| Real-time | Supabase Realtime or Socket.io |
| File storage | Cloudflare R2 / S3 |
| Search | PostgreSQL full-text or Meilisearch |

---

## 4. Key Indexes

- products (category_id, origin_region, status)
- rfqs (status, buyer_id)
- orders (buyer_id, supplier_id, status)
- messages (conversation_id, created_at)

---

© 2026 INA Agro Connect
