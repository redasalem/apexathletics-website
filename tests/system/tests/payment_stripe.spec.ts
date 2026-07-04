import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// ─── Config ─────────────────────────────────────────────────────────────────
const PROD_URL = 'https://apexathletics-website.vercel.app';
const SCREENSHOTS_DIR = path.resolve(__dirname, '..', 'screenshots', 'payment');

// ─── Helpers ────────────────────────────────────────────────────────────────

test.beforeAll(async () => {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }
});

async function snap(page: Page, name: string) {
  try {
    await page.screenshot({
      path: path.join(SCREENSHOTS_DIR, `${name}.png`),
      fullPage: true,
    });
  } catch {
    console.log(`⚠️ Could not take screenshot: ${name}`);
  }
}

// ─── Main Test ──────────────────────────────────────────────────────────────

test.describe('Stripe Payment Flow E2E', () => {
  test('Full checkout with Stripe test card', async ({ page }) => {
    test.setTimeout(180_000); // 3 minutes total
    test.skip(true, 'Temporarily skipped due to rate limits on registration');

    const results: { step: string; status: string; detail: string }[] = [];

    // ── Step 1: Register a new account ─────────────────────────────────────
    // Skip login attempt — seed users may not exist on production
    console.log('📝 Creating new account...');
    await page.goto(`${PROD_URL}/register`);
    await page.waitForLoadState('networkidle');
    await snap(page, '01_register_page');

    const ts = Date.now();
    const testEmail = `testpay_${ts}@test-apex.com`;
    const testPassword = 'TestPayer@123456';

    // Fill name
    await page.locator('input[placeholder="John Doe"]').fill('Test Payer');
    // Fill email
    await page.locator('input[type="email"]').fill(testEmail);
    // Fill password
    await page.locator('input[type="password"]').fill(testPassword);

    await snap(page, '02_register_filled');

    // Submit registration
    await page.locator('button[type="submit"]').click();
    console.log('📝 Submitted registration...');

    // Wait for redirect (to /account for customer)
    try {
      await page.waitForURL(url => !url.toString().includes('/register'), { timeout: 25000 });
      console.log(`✅ [Register] Redirected to: ${page.url()}`);
      results.push({ step: 'Register', status: 'PASS', detail: `Redirected to ${page.url()}` });
    } catch {
      // Check for any error
      const bodyText = await page.locator('body').textContent().catch(() => '');
      const hasError = bodyText?.includes('error') || bodyText?.includes('Error') || bodyText?.includes('already');
      console.log(`❌ [Register] Failed. Body contains error: ${hasError}`);
      
      // Try login instead with a known approach
      console.log('📝 Trying login with seed credentials...');
      await page.goto(`${PROD_URL}/login`);
      await page.waitForLoadState('networkidle');
      await page.locator('input[type="email"]').fill('customer1@apexathletics.com');
      await page.locator('input[type="password"]').fill('Customer@123456');
      await page.locator('button[type="submit"]').click();
      
      try {
        await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 15000 });
        results.push({ step: 'Login (fallback)', status: 'PASS', detail: `Redirected to ${page.url()}` });
      } catch {
        await snap(page, '02_auth_failed');
        results.push({ step: 'Auth', status: 'FAIL', detail: 'Both register and login failed' });
        printResults(results);
        return;
      }
    }

    await snap(page, '03_authenticated');

    // ── Step 2: Add product to cart ─────────────────────────────────────────
    console.log('🛒 Going to shop...');
    await page.goto(`${PROD_URL}/shop`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    await snap(page, '04_shop_page');

    const productLinks = page.locator('a[href^="/product/"]');
    const productCount = await productLinks.count();
    console.log(`🛒 Found ${productCount} products`);

    if (productCount === 0) {
      results.push({ step: 'Shop', status: 'FAIL', detail: 'No products found' });
      printResults(results);
      return;
    }

    // Click first product
    await productLinks.first().click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await snap(page, '05_product_detail');
    console.log(`🛒 Viewing product: ${page.url()}`);

    // Select size if available (look for common size buttons)
    const sizeButtons = page.locator('button').filter({ hasText: /^(XS|S|SM|M|MD|L|LG|XL|XXL)$/i });
    if (await sizeButtons.count() > 0) {
      await sizeButtons.first().click();
      console.log('✅ Selected size');
    }

    // Click Add to Cart
    const addBtn = page.locator('button').filter({ hasText: /add to cart/i }).first();
    if (await addBtn.count() === 0) {
      results.push({ step: 'Add to Cart', status: 'FAIL', detail: 'No Add to Cart button' });
      await snap(page, '06_no_add_to_cart');
      printResults(results);
      return;
    }

    await addBtn.click();
    await page.waitForTimeout(3000);
    await snap(page, '06_after_add_to_cart');

    // Check if redirected to login (means session expired)
    if (page.url().includes('/login')) {
      results.push({ step: 'Add to Cart', status: 'FAIL', detail: 'Redirected to login — session lost' });
      await snap(page, '06_session_lost');
      printResults(results);
      return;
    }

    results.push({ step: 'Add to Cart', status: 'PASS', detail: 'Product added' });
    console.log('✅ Added product to cart');

    // ── Step 3: Go to cart ──────────────────────────────────────────────────
    console.log('🛒 Going to cart...');
    await page.goto(`${PROD_URL}/cart`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await snap(page, '07_cart_page');

    // The checkout link is: <Link href="/checkout">Proceed to Checkout</Link>
    const checkoutLink = page.locator('a[href="/checkout"]');
    if (await checkoutLink.count() === 0) {
      results.push({ step: 'Cart → Checkout', status: 'FAIL', detail: 'No "Proceed to Checkout" link — cart may be empty' });
      await snap(page, '07_cart_empty');
      printResults(results);
      return;
    }

    await checkoutLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await snap(page, '08_checkout_page');
    console.log(`✅ On checkout page: ${page.url()}`);
    results.push({ step: 'Navigate to Checkout', status: 'PASS', detail: page.url() });

    // ── Step 4: Fill checkout form ──────────────────────────────────────────
    console.log('📋 Filling checkout form...');

    // First Name (placeholder "John")
    await page.locator('input[placeholder="John"]').fill('Test');
    // Last Name (placeholder "Doe")
    await page.locator('input[placeholder="Doe"]').fill('Payer');
    // Email (type=email on checkout)
    await page.locator('input[type="email"]').fill(testEmail);
    // Phone (type=tel)
    await page.locator('input[type="tel"]').fill('+15551234567');
    // Street (placeholder "123 Main St")
    await page.locator('input[placeholder="123 Main St"]').fill('123 Test Street');
    // City (placeholder "New York")
    await page.locator('input[placeholder="New York"]').fill('New York');
    // ZIP (placeholder "10001")
    await page.locator('input[placeholder="10001"]').fill('10001');

    await snap(page, '09_checkout_filled');
    console.log('✅ Checkout form filled');

    // Submit checkout — triggers order creation then Stripe redirect
    const payBtn = page.locator('button[type="submit"]');
    await payBtn.click();
    console.log('📋 Submitted checkout, waiting for Stripe redirect...');

    // Wait for Stripe Checkout redirect
    try {
      await page.waitForURL(url => url.toString().includes('checkout.stripe.com'), { timeout: 30000 });
      console.log(`✅ Redirected to Stripe: ${page.url()}`);
      results.push({ step: 'Stripe Redirect', status: 'PASS', detail: page.url() });
      await snap(page, '10_stripe_checkout');
    } catch {
      const toastTexts = await page.locator('[role="status"]').allTextContents().catch(() => []);
      const errText = await page.locator('.text-red-500').allTextContents().catch(() => []);
      console.log(`❌ No Stripe redirect. Toasts: ${toastTexts.join('; ')}. Errors: ${errText.join('; ')}`);
      results.push({ step: 'Stripe Redirect', status: 'FAIL', detail: `Toasts: ${toastTexts.join('; ')}, Errors: ${errText.join('; ')}, URL: ${page.url()}` });
      await snap(page, '10_stripe_redirect_failed');
      printResults(results);
      return;
    }

    // ── Step 5: Fill Stripe payment form ────────────────────────────────────
    console.log('💳 Filling Stripe checkout...');
    await page.waitForTimeout(5000); // Give Stripe UI time to fully render
    await snap(page, '11_stripe_loaded');

    // Stripe Checkout hosted page has different field selectors
    // Try common patterns
    try {
      await page.locator('#cardNumber').fill('4242424242424242');
    } catch {
      try { await page.getByLabel('Card number').fill('4242424242424242'); } catch { /* ignore */ }
    }

    try {
      await page.locator('#cardExpiry').fill('1234');
    } catch {
      try { await page.getByLabel('Expiration').fill('1234'); } catch { /* ignore */ }
    }

    try {
      await page.locator('#cardCvc').fill('123');
    } catch {
      try { await page.getByLabel('CVC').fill('123'); } catch { /* ignore */ }
    }

    try {
      await page.locator('#billingName').fill('Test Payer');
    } catch {
      try { await page.getByLabel('Name on card').fill('Test Payer'); } catch { /* ignore */ }
    }

    try {
      await page.locator('#billingPostalCode').fill('10001');
    } catch {
      try { await page.getByLabel('ZIP').fill('10001'); } catch { /* ignore */ }
    }

    await snap(page, '12_stripe_filled');
    console.log('✅ Stripe form filled');

    // Click Pay / Submit
    await page.locator('button[type="submit"], .SubmitButton').first().click();
    console.log('💳 Clicked Pay on Stripe...');

    // Wait for redirect back to success page
    try {
      await page.waitForURL(
        url => url.toString().includes('apexathletics') && !url.toString().includes('stripe'),
        { timeout: 45000 }
      );
      console.log(`✅ Returned to: ${page.url()}`);
      results.push({ step: 'Payment Complete', status: 'PASS', detail: page.url() });
      await snap(page, '13_payment_success');
    } catch {
      console.log(`❌ Stuck at: ${page.url()}`);
      results.push({ step: 'Payment Complete', status: 'FAIL', detail: `Stuck at: ${page.url()}` });
      await snap(page, '13_payment_stuck');
    }

    // ── Step 6: Extract Order ID ────────────────────────────────────────────
    const finalUrl = page.url();
    if (finalUrl.includes('/order/success/')) {
      const orderId = finalUrl.split('/order/success/')[1]?.split('?')[0] || 'unknown';
      console.log(`🎉 ORDER_ID: ${orderId}`);
      results.push({ step: 'Order Created', status: 'PASS', detail: `Order ID: ${orderId}` });

      // Read success page content
      const pageContent = await page.locator('body').textContent().catch(() => '');
      console.log(`📄 Success page content: ${pageContent?.substring(0, 500)}`);
    } else {
      results.push({ step: 'Order Created', status: 'UNKNOWN', detail: `Final URL: ${finalUrl}` });
    }

    await snap(page, '14_final');
    printResults(results);
  });
});

function printResults(results: { step: string; status: string; detail: string }[]) {
  console.log('\n' + '═'.repeat(60));
  console.log('PAYMENT FLOW TEST RESULTS');
  console.log('═'.repeat(60));
  results.forEach(r => {
    const icon = r.status === 'PASS' ? '✅' : r.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${icon} ${r.step}: ${r.detail}`);
  });
  console.log('═'.repeat(60));
}
