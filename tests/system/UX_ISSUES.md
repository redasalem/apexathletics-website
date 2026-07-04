# UX Issues Report — Apex Athletics (Impeccable)

> **Date**: 2026-07-04  
> **Target**: https://apexathletics-website.vercel.app  
> **Test Suite**: `tests/system/tests/production.spec.ts` (23 tests, all passing)

---

## 🔴 Critical Issues

### 1. Register Flow: No Loading Indicator After Submit (✅ FIXED locally, pending deployment)
- **Where**: `/register` → Submit button click
- **What happens**: User fills the form with valid data and clicks "Create Account". The button does **not** show a spinner or loading state during the API call.
- **Expected**: The `Loader2` spinner should appear (the code has it, but the mutation resolves/rejects before it's visually noticeable, or the test email was rate-limited).
- **Impact**: User has no visual cue that their action is being processed. They might click multiple times.
- **Screenshot**: `screenshots/05-register-submit-loading.png`
- **Fix Applied**: Added `disabled` states to all form elements while submitting, improved API error handling logic, and ensured loading state persists accurately.

### 2. Register Flow: User Stays on /register After Submit (No Redirect) (✅ FIXED locally, pending deployment)
- **Where**: `/register` → After successful/failed submit
- **What happens**: After submitting the registration form, the user stays on `/register`. The toast locator found `"Already have an account? Sign in instead"` — which is **static page text**, not an actual error message from the API.
- **Expected**: Either a redirect to `/account` (success) or a clear error toast like `"Email already registered"` (failure).
- **Impact**: **User is stuck**. No clear feedback on what happened. This is the most severe UX issue found.
- **Note**: This may be caused by rate-limiting (`Too many login/register attempts`) masking the actual registration error. The API silently fails and no toast is shown.
- **Screenshot**: `screenshots/05-register-after-submit.png`
- **Fix Applied**: Removed conflicting `useEffect` redirect. Implemented explicit inline error banners to display 429, 400, and generic API errors prominently under the submit button instead of relying solely on transient toasts. Added a clear inline success banner prior to programmatic redirect.

---

## 🟠 High-Priority Issues

### 3. Add to Cart: Silent Redirect to Login for Guest Users (✅ FIXED locally, pending deployment)
- **Where**: Product detail page → "Add to Cart" button
- **What happens**: Guest user clicks "Add to Cart" and is **silently redirected** to `/login` with no explanation.
- **Expected**: A toast notification like `"Please sign in to add items to your cart"` before redirecting, or a modal prompt.
- **Impact**: User loses context. They don't understand why they were suddenly taken to the login page. Feels broken.
- **Screenshot**: `screenshots/08-addtocart-redirected-to-login.png`
- **Fix Applied**: Added client-side authentication check inside `AddToCartForm.tsx` that intercepts the action, shows an explicit error toast `"Please sign in to add items to your cart"`, waits 500ms for readability, and then redirects to `/login` with a `redirect` query parameter pointing back to the product page.

### 4. Cart & Wishlist Pages Require Authentication (✅ FIXED locally, pending deployment)
- **Where**: `/cart` and `/wishlist` (Navbar links)
- **What happens**: Clicking "Cart" or "Wishlist" in the navbar immediately redirects unauthenticated users to `/login?redirect=%2Fcart` or `/login?redirect=%2Fwishlist`.
- **Expected**: Either allow guest carts (common in e-commerce) or show a message explaining why login is needed.
- **Impact**: New visitors clicking "Cart" are confused by landing on a login page. This is unusual for e-commerce sites.
- **Fix Applied**: Added client-side click interception in the Navbar for both Desktop and Mobile drawer links. Unauthenticated users now receive a clear toast message (`"Sign in to view your cart"` / `"Sign in to view your wishlist"`) and are given a 500ms delay to read the feedback before being redirected to the login page with the correct return parameter.

---

## 🟡 Medium-Priority Issues

### 5. Add to Cart Button Consistency on Product Detail Page (✅ FIXED locally, pending deployment)
- **Where**: Product Detail Page → "Add to Cart" button
- **What happens**: The button stays active even if a user hasn't selected a required variant (size/color), and only shows an error after clicking.
- **Expected**: The button should clearly indicate it's disabled until variants are selected.
- **Fix Applied**: Added `disabled` state and `title` tooltip `"Please select a size and color"` when variants are missing to prevent confusion.

### 6. Missing Vendor Link on Product Detail Page (✅ FIXED locally, pending deployment)
- **Where**: Product Detail Page → Vendor / "Sold by" section
- **What happens**: The automated test could not reliably find the vendor link.
- **Fix Applied**: Made the `vendorId` extraction more robust so it handles both populated and unpopulated `vendor` object references from the API, ensuring the link is always generated.

### 7. Navbar Cart/Wishlist Link Race Condition (✅ FIXED locally, pending deployment)
- **Where**: `Navbar.tsx` → Cart & Wishlist links
- **What happens**: Auth check logic competes with Next.js router. If `isLoading` is true, the check is skipped and the router takes over, leading to silent middleware redirects.
- **Fix Applied**: Replaced `window.location.href` with `useRouter().push()`, and explicitly blocked navigation `e.preventDefault()` while `isLoading` is true to prevent Next.js from routing before auth state is known.

---

## 🟢 Positive Findings (Working Well)

| Feature | Status | Notes |
|---------|--------|-------|
| Login: loading spinner | ✅ Working | Spinner visible during API call |
| Login: error messages | ✅ Working | Clear rate-limit / error messages shown |
| Login: validation | ✅ Working | 2 validation errors on empty submit |
| Register: validation | ✅ Working | 3 validation errors on empty submit |
| Register: vendor fields | ✅ Working | Store Name & Description appear when "Vendor" is selected |
| Shop: product listing | ✅ Working | 10+ products displayed with quick-add buttons |
| Shop: quick-add feedback | ✅ Working | Toast/feedback appears after clicking "Add" on product cards |
| Navigation: all pages load | ✅ Working | Home, Shop, Login, Register, Wishlist — all load without 404s |
| Protected routes | ✅ Working | `/checkout` correctly redirects to `/login` |

---

## 📸 Screenshots Reference

All screenshots are saved in `tests/system/screenshots/`:

| Screenshot | Description |
|-----------|-------------|
| `05-register-page-loaded.png` | Register page initial state |
| `05-register-form-filled.png` | Register form with test data filled |
| `05-register-submit-loading.png` | State during/after submit (no spinner visible) |
| `05-register-after-submit.png` | Final state after submit (still on /register) |
| `05-register-vendor-fields.png` | Vendor role selected — extra fields visible |
| `05-register-validation-errors.png` | Empty form validation errors |
| `06-login-page-loaded.png` | Login page initial state |
| `06-login-wrong-creds-filled.png` | Login form with invalid credentials |
| `06-login-wrong-creds-result.png` | Error message after invalid login |
| `06-login-loading-spinner.png` | Loading spinner during login |
| `06-login-empty-validation.png` | Empty form validation errors |
| `07-nav-homepage-desktop.png` | Homepage at desktop viewport |
| `07-nav-clicked-products.png` | After clicking Products nav link |
| `07-nav-clicked-cart.png` | After clicking Cart nav link |
| `07-nav-clicked-login.png` | After clicking Sign In nav link |
| `07-nav-product-detail.png` | Product detail page |
| `08-addtocart-product-page.png` | Product page before Add to Cart |
| `08-addtocart-before-click.png` | Product page with variant selected |
| `08-addtocart-redirected-to-login.png` | Redirected to login after Add to Cart |
| `08-shop-page-products.png` | Shop page with products listed |
| `08-shop-quick-add-result.png` | After quick-add on shop page |
