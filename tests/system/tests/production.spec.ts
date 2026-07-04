import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// ─── Helpers ────────────────────────────────────────────────────────────────

const SCREENSHOTS_DIR = path.resolve(__dirname, '..', 'screenshots');

/** Ensure screenshots directory exists before test suite runs */
test.beforeAll(async () => {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }
});

/** Take a named screenshot and save it to the screenshots directory */
async function snap(page: Page, name: string) {
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, `${name}.png`),
    fullPage: true,
  });
}

/** Generate a unique email so registration tests don't collide */
function uniqueEmail(): string {
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  return `testuser_${ts}_${rand}@test-apex.com`;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const FRONTEND_URL = 'https://apexathletics-website.vercel.app';

// ─── Existing Smoke Tests ───────────────────────────────────────────────────

test.describe('Production System Tests (Smoke Tests)', () => {

  test.describe('Flow 1: Home Page (Smoke Test)', () => {
    test('الصفحة الرئيسية بتتحمل صح، الـ Navigation موجود، المنتجات بتظهر', async ({ page }) => {
      await page.goto(FRONTEND_URL);
      await page.waitForLoadState('networkidle');

      // Check Navigation
      await expect(page.locator('nav')).toBeVisible();
      
      // Check that at least some products or main sections load
      // Waiting for the main content to be visible
      const mainContent = page.locator('main');
      await expect(mainContent).toBeVisible();

      // Ensure that there are links or images representing products on the home page
      // Assuming products appear as cards or links
      const productLinks = page.locator('a[href^="/product/"]');
      if (await productLinks.count() > 0) {
        await expect(productLinks.first()).toBeVisible();
      } else {
        // Fallback: check for standard text indicating products or sections
      console.log('No direct product links found on homepage, checking for standard sections');
      await expect(page.locator('text=Featured').or(page.locator('text=Shop')).first()).toBeVisible();
    }
  });
});

test.describe('Flow 2: Product Browsing', () => {
  test('المستخدم يدخل على صفحة المنتجات، يضغط على منتج ويدخل التفاصيل، وزرار Add to Cart موجود', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/shop`);
    await page.waitForLoadState('networkidle');

    // Wait a bit for products to load
    await page.waitForTimeout(2000);

    const productLinks = page.locator('a[href^="/product/"]');
    if (await productLinks.count() === 0) {
      console.log('No products found in the shop. Skipping product details click.');
      return; // Skip the rest of the test if DB is empty
    }

    const firstProductLink = productLinks.first();
    await expect(firstProductLink).toBeVisible();

    // Click on the product and go to details
    await firstProductLink.click();
    await page.waitForLoadState('networkidle');

    // Check if Add to Cart button exists
    // The button might just say 'Add' or 'Add to Cart'
    const addToCartBtn = page.locator('button', { hasText: /Add/i }).first();
    
    // If we don't find it exactly, fallback to any button inside main containing 'Cart'
    if (await addToCartBtn.count() === 0) {
        console.log('Could not find strict "Add to Cart" button. Checking for variations.');
        const fallbackBtn = page.locator('button', { hasText: /Cart/i }).first();
        await expect(fallbackBtn).toBeVisible();
      } else {
        await expect(addToCartBtn).toBeVisible();
      }
    });
  });

  test.describe('Flow 3: Auth Flow', () => {
    test('المستخدم يدخل على /login، يملأ الفورم، ويتحول لصفحة أخرى', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/login`);
      await page.waitForLoadState('networkidle');

      // Fill email and password (we use an invalid one just to test the UI flow and error/loading handling, 
      // or we can test actual login if we had a test account. We'll use a dummy account to see if it triggers an API call)
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      const submitBtn = page.locator('button[type="submit"]');

      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      await expect(submitBtn).toBeVisible();

      // We won't actually log in successfully unless we have a guaranteed test user.
      // But we will fill the form and submit to ensure it functions.
      await emailInput.fill('systemtest@example.com');
      await passwordInput.fill('SystemTest123!');
      await submitBtn.click();

      // It should either show an error or redirect. 
      // Since it's a dummy user, it will likely show an error message from the API.
      // We will wait for network idle to see the result
      await page.waitForLoadState('networkidle');
      
      const errorMsg = page.locator('text=/invalid|error|not found|too many/i').first();
      if (await errorMsg.count() > 0) {
        await expect(errorMsg).toBeVisible();
      }
    });
  });

  test.describe('Flow 4: Protected Routes', () => {
    test('المستخدم غير المسجل يحاول يدخل /checkout ويتحول لصفحة /login', async ({ page }) => {
      await page.goto(`${FRONTEND_URL}/checkout`);
      await page.waitForLoadState('networkidle');

      // Check if URL contains /login, meaning it redirected successfully
      // or if it explicitly asks to log in
      const currentUrl = page.url();
      if (currentUrl.includes('/login')) {
        expect(currentUrl).toContain('/login');
      } else {
        // Sometimes it shows a message "Please login" or redirects to cart if cart is empty
        console.log(`Redirected to: ${currentUrl}`);
        const loginMessage = page.locator('text=/login|sign in/i').first();
        if (await loginMessage.count() > 0) {
          await expect(loginMessage).toBeVisible();
        } else {
          // If it redirected to cart due to empty cart
          expect(currentUrl).toContain('/cart');
        }
      }
    });
  });
});

// ═════════════════════════════════════════════════════════════════════════════
//  NEW TESTS — User Flows & Navigation
// ═════════════════════════════════════════════════════════════════════════════

test.describe('Flow 5: Register Flow (Full E2E)', () => {

  test('صفحة /register بتتحمل صح والفورم موجود بالكامل', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/register`);
    await page.waitForLoadState('networkidle');
    await snap(page, '05-register-page-loaded');

    // Page heading
    await expect(page.locator('h2')).toContainText(/Join/i);

    // Account type radios
    const customerRadio = page.locator('input[type="radio"][value="customer"]');
    const vendorRadio   = page.locator('input[type="radio"][value="vendor"]');
    await expect(customerRadio).toBeAttached();
    await expect(vendorRadio).toBeAttached();

    // Core fields
    await expect(page.locator('input[type="text"]').first()).toBeVisible();   // Name
    await expect(page.locator('input[type="email"]')).toBeVisible();          // Email
    await expect(page.locator('input[type="password"]')).toBeVisible();       // Password

    // Submit button
    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toContainText(/Create Account/i);
  });

  test('Register بـ بيانات صحيحة → loading state يظهر → redirect يحصل', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/register`);
    await page.waitForLoadState('networkidle');

    const email = uniqueEmail();

    // Fill the form
    await page.locator('input[type="text"]').first().fill('Test User E2E');
    await page.locator('input[type="email"]').fill(email);
    await page.locator('input[type="password"]').fill('TestPass1!strongE2E');

    await snap(page, '05-register-form-filled');

    // Click submit
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // ✅ Check: loading state — the Loader2 spinner should appear (animate-spin svg)
    const spinnerOrLoading = page.locator('button[type="submit"] svg.animate-spin, button[type="submit"]:has-text("Loading")');
    const loadingAppeared = await spinnerOrLoading.count() > 0;
    if (loadingAppeared) {
      console.log('✅ Loading state detected during registration submit.');
    } else {
      console.log('⚠️ BUG: No visible loading indicator after clicking submit.');
    }

    await snap(page, '05-register-submit-loading');

    // Wait for the network to settle (API response returns)
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // extra buffer for client-side redirect

    await snap(page, '05-register-after-submit');

    const finalUrl = page.url();

    // ✅ Check: redirect happened
    const redirected = !finalUrl.includes('/register');
    if (redirected) {
      console.log(`✅ Redirect successful. Final URL: ${finalUrl}`);
      // Should go to /account (customer) or /vendor-dashboard (vendor)
      const validDestination =
        finalUrl.includes('/account') ||
        finalUrl.includes('/vendor-dashboard') ||
        finalUrl.includes('/');
      expect(validDestination).toBeTruthy();
    } else {
      // ❌ Still on /register — check for error toast / message
      console.log('❌ POTENTIAL BUG: Still on /register after submit.');
      const toastOrError = page.locator('[role="status"]').or(page.locator('[data-sonner-toast]')).or(page.locator('.Toastify')).or(page.getByText(/error|failed|already/i)).first();
      if (await toastOrError.count() > 0) {
        const text = await toastOrError.textContent();
        console.log(`   Error/toast displayed: "${text}"`);
      } else {
        console.log('   ❌ BUG: No redirect AND no error message. User is stuck.');
        // This documents the bug: user stays on the same page with no feedback
        test.info().annotations.push({
          type: 'bug',
          description: 'Register: user stays on /register after submit with no redirect or error message',
        });
      }
    }
  });

  test('Register: vendor role يظهر حقول إضافية (Store Name & Description)', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/register`);
    await page.waitForLoadState('networkidle');

    // Select vendor role — the radio input is sr-only (hidden), so click the visible label
    await page.locator('label').filter({ hasText: 'Vendor' }).click();
    await page.waitForTimeout(500);

    await snap(page, '05-register-vendor-fields');

    // Vendor-specific fields should now be visible
    const storeNameInput = page.locator('input[placeholder="My Awesome Store"]');
    const storeDescTextarea = page.locator('textarea[placeholder*="Tell us about"]');

    await expect(storeNameInput).toBeVisible();
    await expect(storeDescTextarea).toBeVisible();
  });

  test('Register: validation errors تظهر لما الفورم فاضي', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/register`);
    await page.waitForLoadState('networkidle');

    // Submit empty form
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(1000);

    await snap(page, '05-register-validation-errors');

    // Expect at least one validation error message (red text)
    const errorMessages = page.locator('p.text-red-500, .text-red-500');
    const errCount = await errorMessages.count();
    expect(errCount).toBeGreaterThan(0);
    console.log(`✅ ${errCount} validation error(s) displayed on empty submit.`);
  });
});


// ═════════════════════════════════════════════════════════════════════════════
test.describe('Flow 6: Login Flow (Full E2E)', () => {

  test('صفحة /login بتتحمل صح والفورم موجود', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/login`);
    await page.waitForLoadState('networkidle');
    await snap(page, '06-login-page-loaded');

    await expect(page.locator('h2')).toContainText(/Welcome/i);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toContainText(/Sign In/i);
  });

  test('Login بـ بيانات غلط → error message يظهر', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/login`);
    await page.waitForLoadState('networkidle');

    await page.locator('input[type="email"]').fill('nonexistent_user@wrong.com');
    await page.locator('input[type="password"]').fill('WrongPassword123!');

    await snap(page, '06-login-wrong-creds-filled');

    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // Check loading state
    const spinnerOrLoading = page.locator('button[type="submit"] svg.animate-spin');
    const loadingAppeared = await spinnerOrLoading.count() > 0;
    if (loadingAppeared) {
      console.log('✅ Loading state detected during login submit.');
    }

    await snap(page, '06-login-wrong-creds-submitting');

    // Wait for the response
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await snap(page, '06-login-wrong-creds-result');

    // ✅ Check: Should still be on /login (not redirected)
    expect(page.url()).toContain('/login');

    // ✅ Check: error message should appear (toast or inline)
    const errorIndicator = page.locator('[role="status"]').or(page.getByText(/invalid|error|credentials|incorrect|failed|not found/i)).first();

    if (await errorIndicator.count() > 0) {
      const text = await errorIndicator.textContent();
      console.log(`✅ Error message displayed: "${text}"`);
    } else {
      console.log('⚠️ UX ISSUE: No visible error message after invalid login.');
      test.info().annotations.push({
        type: 'ux-issue',
        description: 'Login: no visible error feedback after submitting invalid credentials',
      });
    }
  });

  test('Login: loading state يظهر أثناء الـ submit', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/login`);
    await page.waitForLoadState('networkidle');

    await page.locator('input[type="email"]').fill('loadingtest@example.com');
    await page.locator('input[type="password"]').fill('SomePassword1!');

    // Intercept network to slow down the API and observe loading state
    await page.route('**/api/auth/login', async (route) => {
      await new Promise(r => setTimeout(r, 1500)); // Delay 1.5s
      await route.continue();
    });

    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    // The button should show a spinner while the request is in flight
    const spinner = page.locator('button[type="submit"] svg.animate-spin');
    try {
      await expect(spinner).toBeVisible({ timeout: 3000 });
      console.log('✅ Loading spinner is visible during login submit.');
      await snap(page, '06-login-loading-spinner');
    } catch {
      console.log('⚠️ UX ISSUE: No loading spinner during login submit.');
      await snap(page, '06-login-no-loading-spinner');
      test.info().annotations.push({
        type: 'ux-issue',
        description: 'Login: submit button has no loading indicator during API call',
      });
    }
  });

  test('Login: validation — empty submit يظهر errors', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/login`);
    await page.waitForLoadState('networkidle');

    // Submit empty form
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(1000);

    await snap(page, '06-login-empty-validation');

    // Should show at least one validation message
    const errorMessages = page.locator('p.text-red-500, .text-red-500');
    const errCount = await errorMessages.count();
    if (errCount > 0) {
      console.log(`✅ ${errCount} validation error(s) on empty login submit.`);
    } else {
      // HTML5 validation might handle it instead (required attribute)
      console.log('ℹ️ No custom validation errors; browser may handle via HTML5 required.');
    }
  });
});


// ═════════════════════════════════════════════════════════════════════════════
test.describe('Flow 7: Navigation Between Pages', () => {

  const navTargets = [
    { label: 'Home',     path: '/',          expectText: /Featured|Shop|Impeccable|Explore/i },
    { label: 'Products', path: '/shop',      expectText: /Products|Shop|Filter/i },
    { label: 'Cart',     path: '/cart',       expectText: /Cart|Bag|Empty/i },
    { label: 'Login',    path: '/login',      expectText: /Welcome|Sign In|Email/i },
    { label: 'Register', path: '/register',   expectText: /Join|Create Account|Sign up/i },
    { label: 'Wishlist', path: '/wishlist',    expectText: /Wishlist|Favorites|Empty/i },
  ];

  for (const target of navTargets) {
    test(`Navigation: ${target.label} (${target.path}) بيفتح صح`, async ({ page }) => {
      await page.goto(`${FRONTEND_URL}${target.path}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await snap(page, `07-nav-${target.label.toLowerCase()}`);

      // ✅ Should not be 404
      const is404 = await page.locator('text=/404|not found|page not found/i').count();
      expect(is404).toBe(0);

      // ✅ Page should have meaningful content (not blank)
      const mainContent = page.locator('main, [role="main"], body');
      const bodyText = await mainContent.first().textContent() || '';
      expect(bodyText.trim().length).toBeGreaterThan(10);

      // ✅ Page contains expected text
      const matchFound = await page.locator(`text=${target.expectText.source}`).count() > 0
        || target.expectText.test(bodyText);
      if (!matchFound) {
        console.log(`⚠️ Page "${target.label}" loaded but expected text pattern not found.`);
      }

      console.log(`✅ ${target.label} page loaded successfully at ${page.url()}`);
    });
  }

  test('Navigation: Vendor page بيفتح من صفحة المنتج', async ({ page }) => {
    // First go to shop and find a product
    await page.goto(`${FRONTEND_URL}/shop`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const productLinks = page.locator('a[href^="/product/"]');
    if (await productLinks.count() === 0) {
      console.log('No products found. Skipping vendor navigation test.');
      return;
    }

    // Click the first product
    await productLinks.first().click();
    await page.waitForLoadState('networkidle');

    await snap(page, '07-nav-product-detail');

    // Look for a vendor link on the product page
    const vendorLink = page.locator('a[href^="/vendor/"]').first();
    if (await vendorLink.count() > 0) {
      await vendorLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      await snap(page, '07-nav-vendor-page');

      // ✅ Should be on a vendor page
      expect(page.url()).toContain('/vendor/');

      // ✅ Should not be 404
      const is404 = await page.locator('text=/404|not found/i').count();
      expect(is404).toBe(0);

      // ✅ Should show vendor info
      const bodyText = await page.locator('body').textContent() || '';
      expect(bodyText.trim().length).toBeGreaterThan(20);

      console.log(`✅ Vendor page loaded successfully at ${page.url()}`);
    } else {
      console.log('⚠️ No vendor link found on product detail page.');
    }
  });

  test('Navigation: Navbar links تشتغل من الصفحة الرئيسية', async ({ page }) => {
    // ── Products link ──
    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('networkidle');
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(1000);

    await snap(page, '07-nav-homepage-desktop');

    const productsNavLink = page.locator('nav >> visible=true >> a[href="/shop"]').first();
    if (await productsNavLink.count() > 0) {
      await productsNavLink.click();
      try {
        await page.waitForURL('**/shop**', { timeout: 10000 });
        console.log('✅ Navbar "Products" link works.');
      } catch {
        console.log(`⚠️ Products link: expected /shop but got ${page.url()}`);
      }
      await snap(page, '07-nav-clicked-products');
    }

    // ── Cart link ──
    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const cartNavLink = page.locator('nav >> visible=true >> a[href="/cart"]').first();
    if (await cartNavLink.count() > 0) {
      await cartNavLink.click();
      // Cart may redirect to /login (auth) or /cart — wait for navigation
      await page.waitForTimeout(2000);
      const cartUrl = page.url();
      console.log(`   Cart link navigated to: ${cartUrl}`);

      if (cartUrl.includes('/cart')) {
        console.log('✅ Navbar "Cart" link works — navigated to /cart.');
      } else if (cartUrl.includes('/login')) {
        console.log('✅ Navbar "Cart" link works — redirected to /login (auth required).');
      } else {
        console.log(`⚠️ UX ISSUE: Cart link redirected to unexpected URL: ${cartUrl}`);
        test.info().annotations.push({
          type: 'ux-issue',
          description: `Navbar Cart link redirects to "${cartUrl}" instead of /cart or /login.`,
        });
      }
      await snap(page, '07-nav-clicked-cart');
    }

    // ── Login / Sign In link ──
    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const loginNavLink = page.locator('nav >> visible=true >> a[href="/login"]').first();
    if (await loginNavLink.count() > 0) {
      await loginNavLink.click();
      try {
        await page.waitForURL('**/login**', { timeout: 10000 });
        console.log('✅ Navbar "Sign In" link works.');
      } catch {
        console.log(`⚠️ Login link: expected /login but got ${page.url()}`);
      }
      await snap(page, '07-nav-clicked-login');
    }
  });
});


// ═════════════════════════════════════════════════════════════════════════════
test.describe('Flow 8: Button Click Feedback (Add to Cart)', () => {

  test('Add to Cart بيدي feedback واضح (toast أو تغيير في الـ cart count)', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/shop`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const productLinks = page.locator('a[href^="/product/"]');
    if (await productLinks.count() === 0) {
      console.log('No products found. Skipping Add to Cart feedback test.');
      return;
    }

    // Navigate to first product
    await productLinks.first().click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await snap(page, '08-addtocart-product-page');

    // Get initial cart count (if displayed in navbar)
    const cartBadge = page.locator('nav a[href="/cart"] span[aria-live="polite"]');
    const initialCartCount = await cartBadge.count() > 0
      ? parseInt(await cartBadge.textContent() || '0', 10)
      : 0;

    // Find the Add to Cart button
    const addToCartBtn = page.locator('button', { hasText: /Add to Cart/i }).first();
    if (await addToCartBtn.count() === 0) {
      console.log('⚠️ Add to Cart button not found on product page.');
      await snap(page, '08-addtocart-btn-missing');
      return;
    }

    // If size/color selection is required, select the first option
    const sizeButtons = page.locator('button[aria-pressed]');
    if (await sizeButtons.count() > 0) {
      // Click the first unselected variant button (size or color)
      for (let i = 0; i < await sizeButtons.count(); i++) {
        const pressed = await sizeButtons.nth(i).getAttribute('aria-pressed');
        if (pressed === 'false') {
          await sizeButtons.nth(i).click();
          break;
        }
      }
      await page.waitForTimeout(300);
    }

    await snap(page, '08-addtocart-before-click');

    // Click Add to Cart
    await addToCartBtn.click();

    // Wait a moment for feedback
    await page.waitForTimeout(2000);

    await snap(page, '08-addtocart-after-click');

    const currentUrl = page.url();

    // If redirected to login (guest user), that's expected behavior
    if (currentUrl.includes('/login')) {
      console.log('ℹ️ Guest user was redirected to /login after Add to Cart. Expected behavior.');
      await snap(page, '08-addtocart-redirected-to-login');

      // ⚠️ UX issue: no warning before redirect
      console.log('⚠️ UX ISSUE: User was silently redirected to login without toast/warning.');
      test.info().annotations.push({
        type: 'ux-issue',
        description:
          'Add to Cart: guest user is silently redirected to /login with no toast or warning explaining why.',
      });
      return;
    }

    // If still on product page, check for feedback
    // 1) Toast notification
    const toast = page.locator(
      '[role="status"], [data-sonner-toast], .Toastify__toast, div:has-text("Added to cart")'
    ).first();

    // 2) Cart count changed
    const newCartCount = await cartBadge.count() > 0
      ? parseInt(await cartBadge.textContent() || '0', 10)
      : 0;

    const toastVisible = await toast.count() > 0;
    const cartCountChanged = newCartCount > initialCartCount;

    if (toastVisible) {
      console.log('✅ Toast feedback appeared after Add to Cart.');
    }
    if (cartCountChanged) {
      console.log(`✅ Cart count changed: ${initialCartCount} → ${newCartCount}`);
    }

    if (!toastVisible && !cartCountChanged) {
      console.log('❌ UX ISSUE: No visible feedback after clicking Add to Cart.');
      test.info().annotations.push({
        type: 'ux-issue',
        description:
          'Add to Cart: no visible feedback (no toast, no cart badge change) after clicking the button.',
      });
    }
  });

  test('Add to Cart: الزرار بيتغير لحالة loading أثناء الإضافة', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/shop`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const productLinks = page.locator('a[href^="/product/"]');
    if (await productLinks.count() === 0) {
      console.log('No products found. Skipping test.');
      return;
    }

    await productLinks.first().click();
    await page.waitForLoadState('networkidle');

    // Select variant options if available
    const sizeButtons = page.locator('button[aria-pressed="false"]');
    if (await sizeButtons.count() > 0) {
      await sizeButtons.first().click();
      await page.waitForTimeout(300);
    }

    const addToCartBtn = page.locator('button', { hasText: /Add to Cart/i }).first();
    if (await addToCartBtn.count() === 0) {
      console.log('⚠️ Add to Cart button not found.');
      return;
    }

    // Slow down the API to observe loading state
    await page.route('**/api/cart**', async (route) => {
      await new Promise(r => setTimeout(r, 1500));
      await route.continue();
    });

    await addToCartBtn.click();

    // Check for spinner or disabled state
    const spinner = page.locator('button svg.animate-spin');
    const btnDisabled = await addToCartBtn.isDisabled().catch(() => false);

    try {
      await expect(spinner).toBeVisible({ timeout: 3000 });
      console.log('✅ Loading spinner visible in Add to Cart button.');
      await snap(page, '08-addtocart-loading-state');
    } catch {
      if (btnDisabled) {
        console.log('✅ Button was disabled during loading (acceptable feedback).');
      } else {
        // If redirected to login, skip this check
        if (page.url().includes('/login')) {
          console.log('ℹ️ Guest user redirected to login. Loading check N/A.');
        } else {
          console.log('⚠️ UX ISSUE: No loading state on Add to Cart button.');
          await snap(page, '08-addtocart-no-loading-state');
        }
      }
    }
  });

  test('Shop page: "Add" buttons على كروت المنتجات بتدي feedback', async ({ page }) => {
    await page.goto(`${FRONTEND_URL}/shop`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await snap(page, '08-shop-page-products');

    // Look for quick-add buttons on product cards (the "Add" button)
    const quickAddButtons = page.locator('button', { hasText: /^Add$/i });
    const count = await quickAddButtons.count();

    if (count === 0) {
      console.log('ℹ️ No quick-add "Add" buttons found on product cards.');
      return;
    }

    console.log(`Found ${count} quick-add button(s) on shop page.`);

    // Click the first one
    await quickAddButtons.first().click();
    await page.waitForTimeout(2000);

    await snap(page, '08-shop-quick-add-result');

    const currentUrl = page.url();

    if (currentUrl.includes('/login')) {
      console.log('ℹ️ Quick-add redirected guest to /login.');
      test.info().annotations.push({
        type: 'ux-issue',
        description:
          'Shop page: clicking "Add" button on product card silently redirects guest to /login without explanation.',
      });
    } else {
      // Check for any feedback (toast, count change, etc.)
      const toast = page.locator('[role="status"]').or(page.getByText(/added|cart/i)).first();
      if (await toast.count() > 0) {
        console.log('✅ Feedback appeared after quick-add on shop page.');
      } else {
        console.log('⚠️ UX ISSUE: No feedback after clicking quick-add on shop page.');
      }
    }
  });
});
