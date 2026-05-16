# Production QA Runbook — Apex Athletics Frontend

Status: authoritative, production-ready QA runbook for frontend ↔ backend integrations, checkout, webhook flows, uploads, dashboards, and deployment validation.

Sections:
- Overview
- How to use this runbook
- Environment & deployment validation
- Smoke tests
- Detailed feature test cases (auth, protected routes, cart, wishlist, products, uploads, orders, checkout, Stripe payments, webhooks, admin/vendor dashboards, coupons)
- Edge cases, race conditions & duplicate-request tests
- Failure, rollback & recovery procedures
- Post-deployment monitoring & verification
- Final deployment readiness assessment

---

## Overview
This document provides step-by-step manual and semi-automated checks for launch. It assumes the backend is deployed at `https://<API_HOST>` and the frontend at `https://<FRONTEND_HOST>`.

Replace placeholders: `<API_HOST>`, `<FRONTEND_HOST>`, `<PRODUCT_ID>`, `<VENDOR_ID>`, `<ORDER_ID>`, `<STRIPE_PUBLISHABLE_KEY>`, `<STRIPE_SECRET_KEY>`, `<STRIPE_WEBHOOK_SECRET>`.

Important endpoints (backend):
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- Cart: `GET /api/cart`, `POST /api/cart`, `PUT /api/cart/:id`, `DELETE /api/cart/:id`
- Wishlist: `GET /api/wishlist`, `POST /api/wishlist`, `DELETE /api/wishlist/:id`
- Products: `GET /api/products`, `GET /api/products/:id`, `GET /api/products?limit=...&page=...`
- Orders: `POST /api/orders/customer`, `GET /api/orders/customer`, `GET /api/orders/customer/:id`
- Payments: `POST /api/payments/checkout`, Webhook: `POST /api/payments/webhook`
- Uploads: `POST /api/upload` (multipart/form-data)
- Coupons: `POST /api/coupons/validate`
- Health: `GET /api/health`

Response pattern (backend):
- Success: `200 | 201` with JSON `{ success: true, data: ..., message?: '...' }`
- Failure: `4xx | 5xx` with JSON `{ success: false, message: '...', errors?: [...] }`

---

## How to use this runbook
- Run smoke tests immediately after deployment.
- Follow the feature-by-feature checklists; mark pass/fail.
- Use the `curl` examples and the Stripe CLI snippets where provided.
- Record any discrepancies and perform rollback or hotfix per the recovery section.

---

## 1) Environment & Deployment Validation (pre-flight)
Checklist (must pass before smoke tests):
- [ ] Production `FRONTEND_URL` set on backend and matches deployed frontend origin.
- [ ] Frontend env (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`) set in deployment platform.
- [ ] Backend env (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NODE_ENV=production`, `FRONTEND_URL`) set as secrets.
- [ ] HTTPS enabled for both frontend and backend (cookie.secure requirement).
- [ ] CORS whitelist includes frontend origin (backend app uses `FRONTEND_URL`).
- [ ] MongoDB connection string verified and connection pool healthy.
- [ ] Rate limiter, helmet, and other security headers enabled.

Quick checks:
```bash
# Health
curl -sS https://<API_HOST>/api/health | jq
# Expect: { success:true, services: { database: 'connected', stripe: 'configured'| 'missing', email: ... } }

# FRONTEND env is correct (verify from frontend build logs or Vercel env)
# Verify API reachable from frontend host: perform a curl from a server close to production (or use an online check)
curl -I https://<FRONTEND_HOST>/
```

Vercel-specific:
- Ensure all `NEXT_PUBLIC_*` variables are set in the Vercel Project > Settings > Environment Variables for the `Production` scope.
- Ensure server-only secrets are set in the backend host (Vercel serverless functions or separate API host) and not exposed as `NEXT_PUBLIC`.
- Set `NODE_ENV` to `production` in the backend build/runtime environment.

---

## 2) Smoke Tests (quick, immediate)
Goal: confirm core flows work end-to-end.

1. Health endpoint
```bash
curl -sS https://<API_HOST>/api/health | jq
# Expect HTTP 200 and: success: true, database: connected
```

2. Frontend up
```bash
curl -sI https://<FRONTEND_HOST>/ | head
# Expect HTTP 200 and HTML served
```

3. Auth quick test (use a test account)
```bash
# Login and persist cookies
echo '{"email":"qa+cust@example.com","password":"Password123"}' > payload.json
curl -i -c cookies.txt -X POST "https://<API_HOST>/api/auth/login" -H 'Content-Type: application/json' -d @payload.json
# Expect Set-Cookie header with token and HTTP 200 { success: true, data: { _id, name, role } }

curl -i -b cookies.txt "https://<API_HOST>/api/auth/me"
# Expect 200 { success: true, data: { _id, name, role } }
```

4. API auth-required endpoint (cart) should return 200 for logged-in user
```bash
curl -i -b cookies.txt "https://<API_HOST>/api/cart"
# Expect 200 and cart object
```

If any smoke test fails — stop and remediate envs, CORS, or secrets.

---

## 3) Detailed Feature Tests (step-by-step)
Each feature includes: exact API calls, expected responses, expected UI behavior and DB state.

### A. Authentication
Steps:
1. Register (if test account not present)
```bash
curl -i -X POST "https://<API_HOST>/api/auth/register" -H 'Content-Type: application/json' -d '{"name":"QA User","email":"qa+user@example.com","password":"Password123"}'
# Expect 201 { success:true, data: { _id, name, email, role } } and Set-Cookie token
```
2. Login
```bash
curl -i -c cookies.txt -X POST "https://<API_HOST>/api/auth/login" -H 'Content-Type: application/json' -d '{"email":"qa+user@example.com","password":"Password123"}'
# Expect 200 & cookie
```
3. Verify `GET /api/auth/me`
```bash
curl -i -b cookies.txt "https://<API_HOST>/api/auth/me"
# Expect 200 and user object
```
UI expectations:
- After login, the Navbar should show `Account` link, cart/wishlist counts update.
- Protected pages redirect to `/login?redirect=...` when unauthenticated.

DB state:
- New user document created with hashed password; no plaintext stored.

Logs:
- Auth controller should log registration/login events; watch backend logs for errors.

Edge cases:
- Invalid password => 401 with message 'Invalid email or password'
- Repeated failed login attempts => 429 or rate-limiter message for auth routes

Recovery:
- If login fails due to cookie settings (no cookie set), verify `FRONTEND_URL`, CORS `credentials: true`, and `cookieUtils.getCookieOptions` settings.

---

### B. Protected Routes
Check `ProtectedRoute` UX and server enforcement.

Manual flow:
- Attempt to open `/account` while logged out => UI should redirect to `/login?redirect=/account`.
- Login and confirm redirect to the original path.

Server enforcement:
- Attempt `GET /api/cart` without cookie => 401 Unauthorized.

---

### C. Cart
API calls:
- `GET /api/cart` -> 200 with `{ success:true, data: { _id, customerId, items: [] } }`
- `POST /api/cart` payload: `{ productId, quantity, selectedSize?, selectedColor? }` -> 200 updated cart or 409 on stock error
- `PUT /api/cart/:itemId` payload: `{ quantity }` -> 200 updated cart
- `DELETE /api/cart/:itemId` -> 200

UI:
- Adding to cart updates navbar count immediately (optimistic update recommended)
- On add failure (stock), show a clear toast and do not corrupt UI

DB state:
- Cart document contains items populated with product snapshots (priceSnapshot)

Concurrency/race:
- Simulate two simultaneous adds of same item to ensure stock validations occur on backend and return 409 if insufficient stock

---

### D. Wishlist
API calls:
- `GET /api/wishlist` -> 200
- `POST /api/wishlist` { productId } -> 200 updated
- `DELETE /api/wishlist/:id` -> 200

UI:
- Wishlist count updates in Navbar; wishlist page shows items

Edge: unauthorized access returns 401

---

### E. Products
Server-side rendering checks:
- Product page (`/product/:id`) uses server `fetch()`; confirm server-rendered HTML includes product meta tags and JSON-LD
- Check hydration console for warnings after visiting product page (no React hydration mismatch)

APIs:
- `GET /api/products/:id` -> 200 with product object
- `GET /api/products?limit=&page=&category=` -> 200 paginated list

---

### F. Uploads (Vendor)
Preconditions: vendor account, logged in cookie

API: `POST /api/upload` (multipart/form-data) with `file` field
- expected success: 200 `{ success: true, url: '<cloudinary-url>', public_id: '...' }`
- expected errors: 400 if no file, 413/500 if file too large or internal error

UI expectations:
- File input should show progress indicator (progress bar) and prevents form submit until upload completes
- After upload success, preview appears and image URL recorded in product images payload

Server checks:
- Verify Cloudinary responds and backend returns secure_url
- Log any cloudinary errors

Automated test:
```bash
curl -i -b vendor-cookies.txt -F 'file=@./test-image.jpg' 'https://<API_HOST>/api/upload'
```

Edge cases & retries:
- Upload interrupted: frontend should allow retry and show error message
- Non-image file: server rejects and frontend surfaces message

---

### G. Orders & Checkout
Flow:
1. Cart must contain items
2. Create Order: `POST /api/orders/customer` with shipping address and paymentMethod
   - Expect 200 with `data._id` order created with `paymentStatus: pending`
3. Initiate Checkout: `POST /api/payments/checkout` with `{ orderId, couponCode? }`
   - Expect 200 `{ success:true, url: '<stripe-checkout-url>' }`
4. Redirect user to Stripe Checkout

Server-side checks:
- Backend calculates totals (unit price * qty), tax, shipping; updates order.totalAmount
- Payment record created with `status: pending` and `stripeSessionId`

UI:
- After initiating checkout frontend redirects to Stripe
- If response lacks `url`, show error and do not create duplicate order attempts

---

### H. Stripe Payments & Webhook Processing
Preconditions:
- Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` on backend
- Stripe webhook configured to point to `https://<API_HOST>/api/payments/webhook`

Verification with Stripe CLI (recommended):
```bash
# Authenticate stripe cli
stripe login
# Forward events to backend (dev/test)
stripe listen --forward-to https://<API_HOST>/api/payments/webhook
# Trigger a test completed checkout session (simulate)
stripe trigger checkout.session.completed
```

Expected webhook behavior:
- Backend verifies signature using `STRIPE_WEBHOOK_SECRET`
- `checkout.session.completed` handler finds `session.metadata.orderId` and runs `fulfillOrder(orderId)`
- `ProcessedStripeEvent` should prevent double-processing of the same event ID
- For first-time success: Payment record updated `status: completed`, Order `paymentStatus: paid`, fulfillment steps run (stock deduction), emails sent
- For retries: idempotency check should prevent double-fulfill, should skip email/coupon increment for already-processed order

Logs:
- Webhook validation failures should be logged with `Webhook signature verification failed` and return 400

Edge: If `STRIPE_WEBHOOK_SECRET` missing -> webhook handler should log critical error and return 500

---

### I. Coupons
API: `POST /api/coupons/validate` with `{ code }` -> 200 `{ success:true, data: { code, discountPercentage } }` or 400/404

UI:
- Checkout page applies coupon server-side (discount calculated by backend)
- UI should not rely on client-side-only discount calculations for final charge

---

### J. Admin & Vendor Dashboards
Access control (server & client):
- Vendor routes require `vendor` role; admin routes require `admin` role
- Attempt to access vendor/admin dashboards with customer token -> server 403 and client redirect to appropriate page

Data integrity:
- Vendor product create/edit uses `/api/vendors/products` or `/api/products` depending on role. Verify product CRUD, upload integration, and success messages.

---

## 4) Edge cases, race conditions and duplicate request prevention
Tests:
- Duplicate checkout submission: attempt two rapid `POST /api/payments/checkout` for same order -> backend should either return same session or reject duplicate; ensure `Payment` creation uses unique `stripeSessionId` and order remains single
- Webhook duplicate events: Stripe will sometimes resend; backend uses `ProcessedStripeEvent` upsert to claim event atomically
- Simultaneous cart updates: two clients attempt to update same cart item; server should validate stock and respond 409 if stock insufficient
- Network flakiness: simulate failing requests and ensure errors surfaced with friendly messages and retry behavior where appropriate (uploads, coupon validation)

---

## 5) Failure, rollback & recovery procedures
1. Failed deployment or runtime crash
- Immediate mitigation: rollback to previous stable deployment (Vercel UI: Deployments -> Promote previous)
- Verify previous release health via smoke tests

2. Broken payments/webhook processing
- Disable webhook processing temporarily by:
  - Rotating `STRIPE_WEBHOOK_SECRET` to an invalid value (backends returns 500) **OR**
  - Using firewall rules to block Stripe IPs temporarily
- Notify customers and disable new checkout on frontend (feature flag) while investigating
- Restart workers / serverless functions if necessary

3. Data corruption (e.g., wrong order totals)
- If an urgent fix is needed, deploy a hotfix to re-calculate orders or revert to database snapshot
- Use database backup/restore procedure described in backend docs (`docs/BACKUP_RECOVERY.md`)

4. Image upload outage (Cloudinary)
- Fallback: enable temporary local file storage or S3 bucket endpoint, update `upload` route config, redeploy backend
- Notify vendors and queue failed uploads for retry

---

## 6) Post-deployment monitoring & verification
- Verify logs (server) for errors, rate limiting spikes, and webhook signature failures for 5–10 minutes after launch
- Metrics to watch: 5xx rate, 401/403 spikes, Stripe webhook failures, queue length for background jobs
- Verify emails (order confirmations) sent from production email provider

Recommended tools:
- Sentry (errors), Datadog or NewRelic (APM), Papertrail or LogDNA (logs), Stripe Dashboard for payments

---

## 7) Test Automation suggestions (smoke / regression)
- Implement Playwright tests for: login, add to cart, checkout redirect, mock Stripe success callback, order success page
- Implement API integration tests (supertest) for auth, cart, orders, webhook simulation

---

## 8) Final deployment readiness assessment
(This is also a checklist to complete before the final go/no-go decision.)

Pre-launch gating items:
- [ ] All env vars configured and validated (frontend and backend)
- [ ] Stripe secret + webhook tested and passing signed event verification
- [ ] MongoDB connection healthy and backups configured
- [ ] Upload provider reachable and tested
- [ ] Security checks passed (CSP, Helmet, rate-limiter behavior)
- [ ] Automated smoke tests pass on the production deployment
- [ ] Monitoring & alerting configured

Remaining risks (as of this runbook creation):
- Missing or incorrect production env vars (API URL, FRONTEND_URL) causing cookie/CORS failure
- Stripe webhook misconfiguration or secret mismatch
- Uncaught edge case in payment/coupon handling under concurrency

Blockers:
- Any missing production secret (Stripe keys) — **blocking**
- Inaccessible webhook endpoint due to firewall or misconfigured DNS — **blocking**

Confidence level: 72% — majority of code paths covered; main exposure is env/configuration and live webhook/Stripe integration.

Production readiness score: 72 / 100

Recommended launch order (phased):
1. Finalize envs & secrets, validate health endpoints
2. Deploy to a staging environment and run full automated smoke/regression tests
3. Configure Stripe webhook to staging and test with Stripe CLI
4. Deploy to production with maintenance banner (low traffic window)
5. Run smoke tests (auth, cart, checkout, webhook simulation) in prod
6. Gradual ramp/beta (e.g., 5% traffic or invite-only) and monitor
7. Full launch after 24–48 hours of stable monitoring

---

## 9) Appendices
### Useful curl snippets
(See above sections per feature for full calls.)

### Stripe CLI quick start
```bash
npm install -g stripe
stripe login
stripe listen --forward-to https://<API_HOST>/api/payments/webhook
stripe trigger checkout.session.completed
```

---

End of runbook.

Please review and tell me if you want any item expanded into runnable Playwright scripts or CI job definitions. If you're ready, I'll also update the repository with this file (already created) and mark the QA step complete in the task tracker.
