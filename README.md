# ☕ Kittu Cafe — Production Food Ordering & Cafe Management Platform

**Location**: W82P+3P7, Shiv Colony, Mariyara Wale, Dausa, Rajasthan 303303, India  
**Official Phone**: +91 95113 17456  
**Google Maps**: [https://www.google.com/maps/place/Kittu+cafe/data=!4m2!3m1!1s0x0:0xce3785a196c26746](https://www.google.com/maps/place/Kittu+cafe/data=!4m2!3m1!1s0x0:0xce3785a196c26746)

---

## 🏗️ Architecture & Modules

```
kittu-cafe/
├── apps/
│   ├── backend/        # Node.js + Express + TypeScript API & Socket.io WebSockets
│   ├── web/            # Next.js 15 App Router (Customer Website + Admin Portal + KDS)
│   └── mobile/         # React Native + Expo (SDK 52) Android Customer App
├── packages/
│   └── shared/         # Shared domain types, integer paise currency, business config
├── data/
│   └── sample_menu_import.csv # Ready-to-import CSV catalog
├── docs/               # Detailed Setup, API, Deployment & Google Play guides
├── docker-compose.yml  # Local stack (MongoDB, Redis, Backend, Web)
└── .env.example        # Production-ready environment variables template
```

---

## ⚡ Quick Start

### 1. Monorepo Installation & Build
```bash
npm install
npm run build --workspace=packages/shared
```

### 2. Run Database Seed
```bash
npm run seed --workspace=apps/backend
```
- **Admin**: `admin@kittucafe.in` / `KittuAdmin@2026`
- **Kitchen**: `kitchen@kittucafe.in` / `Kitchen@2026`
- **Customer Phone OTP**: `+919511317456` / OTP `123456`

### 3. Run Automated Tests
```bash
npm test --workspace=apps/backend
```

### 4. Start Services
- **Backend API**: `npm run dev --workspace=apps/backend` (Port 5000)
- **Web & Admin Portal**: `npm run dev --workspace=apps/web` (Port 3000)
- **Android App**: `cd apps/mobile && npx expo start`

---

## 🛡️ Core Highlights
- **Strict Minor-Unit Paise Calculations**: Eliminates floating-point errors. Client prices are never trusted.
- **Server Authoritative State**: Concurrency locks on table reservations and coupon limits.
- **Razorpay Integration**: Server-created orders with HMAC SHA256 signature verification & idempotent webhook processing.
- **Kitchen Display System (KDS)**: Tablet-optimized screen with color-coded elapsed timers and audio chimes.
- **Verified Business Details**: Seeding Shiv Colony, Dausa address, +91 95113 17456 phone, and live Google Maps directions.
