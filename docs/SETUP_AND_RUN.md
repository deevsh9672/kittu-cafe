# Kittu Cafe Platform — Setup & Execution Guide

This document provides exact instructions to run, test, seed, and deploy the complete food ordering and cafe management platform for **Kittu Cafe**, located in Shiv Colony, Mariyara Wale, Dausa, Rajasthan 303303.

---

## 1. Prerequisites

- **Node.js**: v20 or v22 LTS (Verified on v22.21.0)
- **npm**: v10+ (Verified on 10.9.4)
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017/kittu_cafe`) or MongoDB Atlas URI
- **Redis** *(Optional for dev)*: In-memory fallback is active if local Redis is not installed.

---

## 2. Quick Monorepo Installation

From the project root (`C:\Users\dell\.gemini\antigravity\scratch\kittu-cafe`):

```bash
# 1. Install root & workspace dependencies
npm install

# 2. Build the shared types package
npm run build --workspace=packages/shared
```

---

## 3. Database Seeding

Initialize the database with verified Kittu Cafe business information, seed menus, inventory ingredients, staff accounts, and test coupons:

```bash
# Run database seed
npm run seed --workspace=apps/backend
```

### Pre-configured Seed Credentials:
- **Admin Portal**: `admin@kittucafe.in` / `KittuAdmin@2026`
- **Kitchen KDS**: `kitchen@kittucafe.in` / `Kitchen@2026`
- **Phone OTP Mode**: Use phone `+919511317456` with default OTP `123456`

---

## 4. Running the Automated Tests

Verify pricing accuracy, variant calculation, RBAC authorization, and Razorpay signature verification:

```bash
npm test --workspace=apps/backend
```

All 3 core test suites will execute:
- `tests/order-pricing.test.ts`: Server-side price recalculation, integer paise precision, variants, add-ons, and coupon discounts.
- `tests/auth-rbac.test.ts`: Authentication tokens and role-based access control.
- `tests/payment-lifecycle.test.ts`: Genuine vs tampered Razorpay HMAC SHA256 signatures.

---

## 5. Starting the Applications

### A. Start the Backend API & Realtime WebSocket Server (Port 5000)
```bash
npm run dev --workspace=apps/backend
```
- API Base: `http://localhost:5000/api/v1`
- Health check: `http://localhost:5000/api/v1/health`
- WebSocket Server: `ws://localhost:5000`

### B. Start the Customer Website & Admin/KDS Portal (Port 3000)
```bash
npm run dev --workspace=apps/web
```
- Customer Website: `http://localhost:3000`
- Digital Menu: `http://localhost:3000/menu`
- Table Booking: `http://localhost:3000/book-table`
- Cart & Checkout: `http://localhost:3000/cart`
- Admin Operations: `http://localhost:3000/admin`
- Kitchen Display System (Tablet View): `http://localhost:3000/admin/kds`

### C. Start the Android Customer App (Expo)
```bash
cd apps/mobile
npx expo start
```
- Press `a` to launch in Android Emulator.
- Scan QR code with Expo Go on a physical Android device.

---

## 6. Docker Local Stack (Alternative)

If Docker Desktop is installed, you can run the entire database, Redis, backend, and web in containers:

```bash
docker-compose up --build -d
```
