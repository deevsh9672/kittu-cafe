# Kittu Cafe Security & Audit Checklist

---

## 1. Monetary Calculations & Minor Units
- [x] **Integer Paise Storage**: All prices, subtotals, delivery fees, and taxes are strictly stored and calculated in integer paise.
- [x] **Zero Client Trust**: Client-submitted cart totals are never accepted. Totals are recalculated on the server using fresh database queries.
- [x] **Negative Balance Prevention**: Applied discounts are capped at `min(calculated, maxDiscount)` and will never result in negative totals.

## 2. Payments & Webhooks
- [x] **HMAC SHA256 Signature Verification**: Implemented in `PaymentsController.verifyPayment` using crypto HMAC.
- [x] **Duplicate Webhook Idempotency**: Handled using `idempotencyKey` and status checks before state changes.
- [x] **No Card Data Storage**: The server never handles raw card numbers, CVVs, or bank secrets.

## 3. Authentication & RBAC
- [x] **Password Hashing**: Strong bcrypt hashing with 10 salt rounds.
- [x] **Role-Based Guards**: Protected endpoints enforce `requireRoles('admin', 'manager', 'kitchen', 'cashier')`.
- [x] **Session Tokens**: JWT with signature verification and expiration.

## 4. Input Validation & API Protection
- [x] **Zod Request Validation**: Validates body and query payloads before controller logic.
- [x] **Helmet Security Headers**: Configured on Express application.
- [x] **CORS Allowlisting**: Restricted to verified origins.
- [x] **Audit Trail**: Privileged administrative and financial actions log to `AuditLogModel`.
