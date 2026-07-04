import { test, expect } from '@playwright/test';

const PROD_URL = 'https://apexathletics-website.vercel.app';

test('Stripe E2E Checkout Flow', async ({ page }) => {
  test.setTimeout(120000); // 2 mins for Stripe interactions

  // 1. Login
  await page.goto(`${PROD_URL}/login`);
  await page.locator('input[type="email"]').fill('customer1@apexathletics.com');
  await page.locator('input[type="password"]').fill('Customer@123456');
  await page.getByRole('button', { name: /Sign In/i }).click();
  
  // Wait for successful login (should redirect away from login)
  await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 15000 });
  console.log('✅ Logged in successfully');

  // 2. Go to Shop and Add to Cart
  await page.goto(`${PROD_URL}/shop`);
  await page.waitForLoadState('networkidle');

  // Click first product link
  await page.locator('a[href^="/product/"]').first().click();
  await page.waitForLoadState('networkidle');

  // If there are sizes, click the first one
  const sizes = page.locator('button:has-text("SM"), button:has-text("MD"), button:has-text("LG"), button:has-text("XL")');
  if (await sizes.count() > 0) {
    await sizes.first().click();
  }

  // If there are colors, click the first one
  const colors = page.locator('button:has-text("BLACK"), button:has-text("WHITE"), button:has-text("RED")');
  if (await colors.count() > 0) {
    await colors.first().click();
  }

  // Click Add to Cart
  await page.locator('button:has-text("Add to Cart")').first().click();
  await page.waitForTimeout(2000);
  console.log('✅ Added product to cart');

  // 3. Checkout
  await page.goto(`${PROD_URL}/cart`);
  await page.waitForLoadState('networkidle');
  
  // We need to verify if the cart is not empty. If it is empty, that means the previous step failed.
  const checkoutBtn = page.locator('button:has-text("Checkout")');
  if (await checkoutBtn.count() === 0) {
     throw new Error("Cart is empty or checkout button not found.");
  }
  
  await checkoutBtn.click();
  await page.waitForLoadState('networkidle');

  // Fill shipping if present
  const addressInput = page.getByLabel(/Address/i);
  if (await addressInput.isVisible()) {
    await addressInput.fill('123 Test St');
    await page.getByLabel(/City/i).fill('Test City');
    await page.getByLabel(/Postal/i).fill('12345');
    await page.getByRole('button', { name: /Continue/i }).or(page.locator('button[type="submit"]')).click();
    await page.waitForLoadState('networkidle');
  }
  
  console.log('✅ Redirecting to Stripe...');
  
  // 4. Wait for Stripe Checkout
  await page.waitForURL(/checkout\.stripe\.com/, { timeout: 20000 });
  console.log('✅ Reached Stripe Checkout');

  // 5. Fill Stripe Test Card
  await page.waitForTimeout(5000); // Give Stripe time to load completely

  // Card Number
  await page.getByLabel('Card number').fill('4242424242424242').catch(() => {});
  
  // Expiry
  await page.getByLabel('Expiration').fill('1234').catch(() => {});
  
  // CVC
  await page.getByLabel('CVC').fill('123').catch(() => {});
  
  // Name
  const nameInput = page.getByLabel('Name on card');
  if (await nameInput.isVisible()) await nameInput.fill('Test User');
  
  // Zip
  const zipInput = page.getByLabel('ZIP');
  if (await zipInput.isVisible()) await zipInput.fill('12345');

  // Submit payment
  await page.locator('button[type="submit"]').click();
  console.log('✅ Submitted payment on Stripe');

  // 6. Wait for redirect back to success page
  await page.waitForURL(url => url.toString().includes('/order/success') || url.toString().includes('/account'), { timeout: 30000 });
  console.log('✅ Returned to Apex Athletics:', page.url());

  // 7. Extract Order ID
  const urlParts = page.url().split('/');
  const orderId = urlParts[urlParts.length - 1];
  console.log('ORDER_ID:', orderId);
  
  // Save screenshot of success
  await page.screenshot({ path: 'stripe_success.png', fullPage: true });

});
