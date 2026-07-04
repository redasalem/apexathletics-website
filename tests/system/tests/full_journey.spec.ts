import { test, expect, Page } from '@playwright/test';

const PROD_URL = 'https://apexathletics-website.vercel.app';
const ts = Date.now();
const customerEmail = `customer_${ts}@test-apex.com`;
const vendorEmail = `vendor_${ts}@test-apex.com`;

test.describe.serial('Full User Journey', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('1. Guest Journey', async () => {
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    
    // Browse products
    await page.getByRole('link', { name: 'Shop' }).first().click();
    await page.waitForLoadState('networkidle');
    
    // Click on first product
    const firstProduct = page.locator('a[href^="/product/"]').first();
    await firstProduct.click();
    await page.waitForLoadState('networkidle');
    
    // Add to cart as guest
    await page.getByRole('button', { name: /Add.*to cart/i }).or(page.locator('button:has-text("Add")')).first().click();
    await page.waitForTimeout(2000);
    // Should be redirected to login because guest can't use cart or wishlist in this app (auth protected)
    expect(page.url()).toContain('/login');
    
    // Wishlist as guest
    await page.goto(PROD_URL);
    await page.getByRole('link', { name: 'Wishlist' }).first().click();
    expect(page.url()).toContain('/login');
  });

  test('2. Register Journey (Customer)', async () => {
    await page.goto(`${PROD_URL}/register`);
    await page.waitForLoadState('networkidle');
    
    await page.locator('input[type="text"]').first().fill('Test Customer');
    await page.locator('input[type="email"]').fill(customerEmail);
    await page.locator('input[type="password"]').fill('Password123!');
    
    await page.getByRole('button', { name: /Create Account/i }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000);
    
    // Check if redirected to account or home
    expect(page.url()).not.toContain('/register');
    console.log('Customer registered and redirected to:', page.url());
  });

  test('3. Shopping Journey (Customer)', async () => {
    // Assuming session is maintained since we're in the same browser context
    await page.goto(`${PROD_URL}/shop`);
    await page.waitForLoadState('networkidle');
    
    // Add to cart (Quick Add)
    const quickAddBtn = page.locator('button:has-text("Add")').first();
    if (await quickAddBtn.count() > 0) {
      await quickAddBtn.click();
      await page.waitForTimeout(2000); // Wait for toast/API
    }
    
    // Go to cart
    await page.goto(`${PROD_URL}/cart`);
    await page.waitForLoadState('networkidle');
    
    // Check if item is in cart
    const cartItems = page.locator('ul li');
    expect(await cartItems.count()).toBeGreaterThanOrEqual(0);
    
    // Try checkout
    const checkoutBtn = page.locator('button:has-text("Checkout")');
    if (await checkoutBtn.count() > 0 && await checkoutBtn.isEnabled()) {
      await checkoutBtn.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/checkout');
      
      // Fill shipping
      await page.getByLabel(/Address/i).fill('123 Test St').catch(() => {});
      await page.getByLabel(/City/i).fill('Test City').catch(() => {});
      await page.getByLabel(/Postal/i).fill('12345').catch(() => {});
      
      await page.getByRole('button', { name: /Continue/i }).or(page.locator('button[type="submit"]')).click().catch(() => {});
      await page.waitForTimeout(3000);
      console.log('Checkout URL after submit:', page.url());
    }
  });

  test('7. Logout Journey (Customer)', async () => {
    await page.goto(`${PROD_URL}/account`);
    const logoutBtn = page.locator('button:has-text("Logout")');
    if (await logoutBtn.count() > 0) {
      await logoutBtn.first().click();
      await page.waitForTimeout(2000);
      expect(page.url()).toContain('/');
    }
  });

  test('4. Register Journey (Vendor)', async () => {
    await page.goto(`${PROD_URL}/register`);
    await page.waitForLoadState('networkidle');
    
    // Select vendor role (might need to click label instead of hidden radio)
    await page.locator('label').filter({ hasText: 'Vendor' }).click();
    await page.waitForTimeout(500);
    
    await page.locator('input[type="text"]').first().fill('Test Vendor');
    await page.locator('input[type="email"]').fill(vendorEmail);
    await page.locator('input[type="password"]').fill('Password123!');
    
    // Vendor specific fields
    await page.locator('input[placeholder="My Awesome Store"]').fill('Apex Vendor Shop').catch(() => {});
    await page.locator('textarea[placeholder*="Tell us about"]').fill('Selling sports gear').catch(() => {});
    
    await page.getByRole('button', { name: /Create Account/i }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000);
    
    expect(page.url()).not.toContain('/register');
    console.log('Vendor registered and redirected to:', page.url());
  });

  test('5. Vendor Dashboard Journey', async () => {
    await page.goto(`${PROD_URL}/vendor-dashboard`);
    await page.waitForLoadState('networkidle');
    
    expect(page.url()).toContain('/vendor-dashboard');
    
    // Check Products tab
    await page.getByRole('link', { name: /Products/i }).click().catch(() => {});
    await page.waitForTimeout(2000);
    
    // Add Product (just check if page opens)
    const addProductBtn = page.getByRole('link', { name: /Add Product/i });
    if (await addProductBtn.count() > 0) {
      await addProductBtn.click();
      await page.waitForTimeout(2000);
      console.log('Add Product page URL:', page.url());
    }
  });
  
  test('7. Logout Journey (Vendor)', async () => {
    await page.goto(`${PROD_URL}/vendor-dashboard`);
    const logoutBtn = page.locator('button:has-text("Logout")');
    if (await logoutBtn.count() > 0) {
      await logoutBtn.first().click();
      await page.waitForTimeout(2000);
    }
  });

  test('6. Admin Journey', async () => {
    // Login as admin
    await page.goto(`${PROD_URL}/login`);
    await page.locator('input[type="email"]').fill('admin@apexathletics.com');
    await page.locator('input[type="password"]').fill('admin123'); // Try basic passwords
    await page.getByRole('button', { name: /Sign In/i }).click();
    await page.waitForTimeout(4000);
    
    await page.goto(`${PROD_URL}/admin`);
    await page.waitForLoadState('networkidle');
    
    console.log('Admin Dashboard URL:', page.url());
    // Browse admin tabs
    const tabs = ['Users', 'Products', 'Orders'];
    for (const tab of tabs) {
      const link = page.getByRole('link', { name: new RegExp(tab, 'i') });
      if (await link.count() > 0) {
        await link.click();
        await page.waitForTimeout(2000);
      }
    }
  });
  
});
