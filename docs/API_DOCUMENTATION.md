# Kittu Cafe REST API & WebSocket Specification (/api/v1)

All monetary values are strictly represented in **integer paise** (`100 paise = ₹1.00`). Client-submitted prices are never trusted and are recalculated on the server.

---

## Standard Response Envelopes

### Success:
```json
{
  "success": true,
  "message": "Optional message",
  "data": { ... }
}
```

### Error:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "Human readable error description",
    "details": null
  }
}
```

---

## Core Route Inventory

### 1. Authentication (`/api/v1/auth`)
- `POST /register`: Registers customer with phone, name, email, password.
- `POST /login`: Authenticates staff or customer using phone/email + password. Returns JWT token.
- `POST /otp/request`: Triggers phone OTP code (mock mode default `123456`).
- `POST /otp/verify`: Validates OTP and issues session JWT.
- `GET /me`: Returns current authenticated user profile (`Bearer <token>` required).

### 2. Business Profile & CMS (`/api/v1/restaurant`)
- `GET /`: Returns verified business profile (Name, address, contact number, opening hours, active ordering status).
- `PUT /admin`: Updates cafe settings, announcement banners, and tax percentages (`admin` or `manager` role required).

### 3. Digital Menu (`/api/v1/menu`)
- `GET /`: Returns menu items with categories. Query filters: `categoryId`, `dietaryType` (`veg`, `non_veg`), `search`, `isFeatured`, `isBestseller`.
- `GET /categories`: Returns active menu categories.
- `GET /:id`: Retrieves single menu item by ID.
- `POST /items`: Adds new menu item (`admin` or `manager` required).
- `PATCH /items/:id/toggle-availability`: Toggles item between In Stock and Sold Out.

### 4. Orders (`/api/v1/orders`)
- `POST /calculate`: Previews server-calculated totals, 5% GST, delivery fee, and coupon deductions without persisting an order.
- `POST /`: Places an order with an `idempotencyKey`. Creates Razorpay order if payment method is `razorpay`. Emits WebSocket event `order:created`.
- `GET /my-orders`: Returns customer order history.
- `GET /:id`: Retrieves full order details and receipt snapshot.
- `PATCH /:id/cancel`: Allows customer cancellation when order is in `pending_confirmation` or `confirmed` status.
- `GET /admin/all`: Paginated order feed for cashiers and managers.
- `PATCH /admin/:id/status`: Enforces valid status state transitions and broadcasts real-time update.

### 5. Payments (`/api/v1/payments`)
- `POST /verify`: Verifies Razorpay HMAC SHA256 signature (`crypto.createHmac('sha256')`). Idempotently captures order upon verification.
- `POST /webhooks/razorpay`: Razorpay webhook listener for asynchronous event capture (`payment.captured`) with replay protection.
- `POST /refund`: Authorized refund processor (`admin` or `manager` role required).

### 6. Kitchen Display System (`/api/v1/kds`)
- `GET /orders`: Returns tablet ticket queue of active orders (`confirmed`, `accepted_by_kitchen`, `preparing`) ordered oldest first.
- `PATCH /orders/:id/status`: Advances ticket status from `accepted_by_kitchen` to `preparing` or `ready_for_pickup`.

### 7. Table Reservations (`/api/v1/reservations`)
- `GET /availability`: Checks available table count for a given `date` and `time` slot.
- `POST /`: Books table with concurrency double-booking prevention.
- `GET /admin/all`: Admin daily reservation calendar.
- `PATCH /admin/:id/status`: Updates booking status (`confirmed` -> `seated` -> `completed` -> `cancelled`).

### 8. Inventory & Stock (`/api/v1/admin/inventory`)
- `GET /`: Lists all ingredient stock levels and highlights items below threshold.
- `PATCH /:id/adjust`: Records manual or order consumption adjustments.

### 9. Coupons & Promotions (`/api/v1/coupons`)
- `POST /validate`: Validates coupon code eligibility against subtotal and customer usage limits.
- `GET /`: Lists active and expired coupons.

---

## WebSocket Real-Time Events (Socket.io)

| Event Name | Room | Payload | Purpose |
|------------|------|---------|---------|
| `order:created` | `kitchen`, `admin` | Order object | Triggers sound chime and new KDS ticket card |
| `order:status_updated` | `order:{orderId}`, `kitchen`, `admin` | `{ orderId, status, order }` | Updates live step tracker without browser reload |
| `join:order` | N/A | `orderId` | Customer joins room to receive live tracker events |
| `join:kitchen` | N/A | None | Kitchen tablet joins room to receive tickets |
