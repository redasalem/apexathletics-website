# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: full_journey.spec.ts >> Full User Journey >> 1. Guest Journey
- Location: tests\full_journey.spec.ts:19:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[role="status"], .Toastify').filter({ hasText: /sign in as a customer to use wishlist/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[role="status"], .Toastify').filter({ hasText: /sign in as a customer to use wishlist/i })
    2 × waiting for" https://apexathletics-website.vercel.app/login" navigation to finish...
      - navigated to "https://apexathletics-website.vercel.app/login"

```

```yaml
- navigation:
  - link "IMPECCABLE":
    - /url: /
  - textbox "Search products, gear, athletes..."
  - link "Home":
    - /url: /
  - link "Products":
    - /url: /shop
  - link "Vendors":
    - /url: /vendors
  - link "Wishlist":
    - /url: /wishlist
  - link "Cart":
    - /url: /cart
  - link "Sign In":
    - /url: /login
- main:
  - heading "Welcome Back" [level=2]
  - paragraph:
    - text: New to Impeccable?
    - link "Create your free account":
      - /url: /register
  - text: Email address
  - textbox "you@example.com"
  - text: Password
  - textbox "••••••••"
  - button
  - link "Forgot your password?":
    - /url: /forgot-password
  - button "Sign In"
- contentinfo:
  - link "IMPECCABLE":
    - /url: /
  - paragraph: Premium multi-vendor sports marketplace. Connecting athletes with the best performance gear from independent vendors.
  - heading "Shop" [level=3]
  - list:
    - listitem:
      - link "All Products":
        - /url: /shop
    - listitem:
      - link "Athletic Shoes":
        - /url: /shop?category=Athletic+Shoes
    - listitem:
      - link "Sportswear":
        - /url: /shop?category=Sportswear
    - listitem:
      - link "Sports Equipment":
        - /url: /shop?category=Sports+Equipment
  - heading "Account" [level=3]
  - list:
    - listitem:
      - link "Sign In":
        - /url: /login
    - listitem:
      - link "Create Account":
        - /url: /register
    - listitem:
      - link "My Orders":
        - /url: /account/orders
    - listitem:
      - link "Shopping Cart":
        - /url: /cart
  - heading "Information" [level=3]
  - list:
    - listitem:
      - link "Privacy Policy":
        - /url: /privacy
    - listitem:
      - link "Terms of Service":
        - /url: /terms
    - listitem:
      - link "Shipping Policy":
        - /url: /shipping
    - listitem:
      - link "Contact Us":
        - /url: /contact
  - paragraph: © 2026 Impeccable Athletics. All rights reserved.
  - text: Secure Payments via Stripe
- alert
```

# Test source

```ts
  1   | import { test, expect, Page } from '@playwright/test';
  2   | 
  3   | const PROD_URL = 'https://apexathletics-website.vercel.app';
  4   | const ts = Date.now();
  5   | const customerEmail = `customer_${ts}@test-apex.com`;
  6   | const vendorEmail = `vendor_${ts}@test-apex.com`;
  7   | 
  8   | test.describe.serial('Full User Journey', () => {
  9   |   let page: Page;
  10  | 
  11  |   test.beforeAll(async ({ browser }) => {
  12  |     page = await browser.newPage();
  13  |   });
  14  | 
  15  |   test.afterAll(async () => {
  16  |     await page.close();
  17  |   });
  18  | 
  19  |   test('1. Guest Journey', async () => {
  20  |     await page.goto(PROD_URL);
  21  |     await page.waitForSelector('nav .animate-pulse', { state: 'hidden' });
  22  |     
  23  |     // Browse products
  24  |     await page.getByRole('link', { name: 'Products' }).first().click();
  25  |     
  26  |     // Wait for either products to load or empty state
  27  |     await page.waitForSelector('a[href^="/product/"], .empty-state', { state: 'visible', timeout: 5000 }).catch(() => {});
  28  |     
  29  |     const productLinks = page.locator('a[href^="/product/"]');
  30  |     if (await productLinks.count() === 0) {
  31  |       console.log('No products found. Skipping Guest Journey.');
  32  |       test.skip();
  33  |       return;
  34  |     }
  35  |     
  36  |     // Click on first product
  37  |     const firstProduct = productLinks.first();
  38  |     await firstProduct.click();
  39  |     await page.waitForSelector('button:has-text("Add"), button:has-text("Cart")', { state: 'visible' });
  40  |     
  41  |     // Select variants if they exist so the button is enabled
  42  |     const sizeBtn = page.locator('button[aria-pressed]').filter({ hasText: /^(S|M|L|XL|XXL|\d+)$/ }).first();
  43  |     if (await sizeBtn.count() > 0) await sizeBtn.click();
  44  |     
  45  |     const colorBtn = page.locator('button[aria-pressed]:not(:has-text("S")):not(:has-text("M")):not(:has-text("L")):not(:has-text("XL")):not(:has-text("XXL"))').first();
  46  |     if (await colorBtn.count() > 0) await colorBtn.click();
  47  | 
  48  |     // Add to cart as guest and wait for the API to finish to prevent lingering redirects
  49  |     const addToCartBtn = page.locator('button:has-text("Add")').first();
  50  |     await Promise.all([
  51  |       page.waitForResponse(res => res.url().includes('/api/cart'), { timeout: 5000 }).catch(() => null),
  52  |       addToCartBtn.click()
  53  |     ]);
  54  |     
  55  |     // Check if redirected to login (if not rate limited)
  56  |     await page.waitForURL(url => url.href.includes('/login'), { timeout: 3000 }).catch(() => {});
  57  |     if (!page.url().includes('/login')) {
  58  |       console.log('Guest Add to Cart did not redirect to /login. Likely rate limited.');
  59  |     }
  60  |     
  61  |     // Wishlist as guest
  62  |     await page.goto(PROD_URL);
  63  |     // Wait for either products to load or empty state
  64  |     await page.waitForSelector('button[aria-label="Add to wishlist"], button[aria-label="Remove from wishlist"], .empty-state', { state: 'visible', timeout: 5000 }).catch(() => {});
  65  |     const wishlistBtn = page.locator('button[aria-label="Add to wishlist"], button[aria-label="Remove from wishlist"]').first();
  66  |     if (await wishlistBtn.count() > 0) {
  67  |       await wishlistBtn.click();
  68  |       const toastMsg = page.locator('[role="status"], .Toastify').filter({ hasText: /sign in as a customer to use wishlist/i });
> 69  |       await expect(toastMsg).toBeVisible({ timeout: 5000 });
      |                              ^ Error: expect(locator).toBeVisible() failed
  70  |     } else {
  71  |       console.log('No wishlist buttons found. Skipping Wishlist assertion.');
  72  |     }
  73  |   });
  74  | 
  75  |   test('2. Register Journey (Customer)', async () => {
  76  |     await page.goto(`${PROD_URL}/register`);
  77  |     await page.waitForSelector('input[type="email"]', { state: 'visible' });
  78  |     
  79  |     await page.getByPlaceholder('John Doe').fill('Test Customer');
  80  |     await page.locator('input[type="email"]').fill(customerEmail);
  81  |     await page.locator('input[type="password"]').fill('Password123!');
  82  |     
  83  |     await page.getByRole('button', { name: /Create Account/i }).click();
  84  |     await page.waitForURL(url => !url.href.includes('/register'), { timeout: 10000 }).catch(() => {});
  85  |     await page.waitForTimeout(1000);
  86  |     
  87  |     const isRateLimited = await page.locator('text=/Too many/i').count() > 0;
  88  |     if (isRateLimited) {
  89  |       console.log('Rate limited. Skipping Customer Registration.');
  90  |       test.skip();
  91  |     }
  92  |     
  93  |     // Check if redirected to account or home
  94  |     expect(page.url()).not.toContain('/register');
  95  |     console.log('Customer registered and redirected to:', page.url());
  96  |   });
  97  | 
  98  |   test('3. Shopping Journey (Customer)', async () => {
  99  |     // Assuming session is maintained since we're in the same browser context
  100 |     await page.goto(`${PROD_URL}/shop`);
  101 |     await page.waitForSelector('button:has-text("Add")', { state: 'visible' }).catch(() => {});
  102 |     
  103 |     // Add to cart (Quick Add)
  104 |     const quickAddBtn = page.locator('button:has-text("Add")').first();
  105 |     if (await quickAddBtn.count() > 0) {
  106 |       await quickAddBtn.click();
  107 |       await page.waitForTimeout(2000); // Wait for toast/API
  108 |     }
  109 |     
  110 |     // Go to cart
  111 |     await page.goto(`${PROD_URL}/cart`);
  112 |     await page.waitForSelector('ul li', { state: 'visible' }).catch(() => {});
  113 |     
  114 |     // Check if item is in cart
  115 |     const cartItems = page.locator('ul li');
  116 |     expect(await cartItems.count()).toBeGreaterThanOrEqual(0);
  117 |     
  118 |     // Try checkout
  119 |     const checkoutBtn = page.locator('button:has-text("Checkout")');
  120 |     if (await checkoutBtn.count() > 0 && await checkoutBtn.isEnabled()) {
  121 |       await checkoutBtn.click();
  122 |       await page.waitForURL(url => url.href.includes('/checkout'), { timeout: 10000 }).catch(() => {});
  123 |       expect(page.url()).toContain('/checkout');
  124 |       
  125 |       // Fill shipping
  126 |       await page.getByLabel(/Address/i).fill('123 Test St').catch(() => {});
  127 |       await page.getByLabel(/City/i).fill('Test City').catch(() => {});
  128 |       await page.getByLabel(/Postal/i).fill('12345').catch(() => {});
  129 |       
  130 |       await page.getByRole('button', { name: /Continue/i }).or(page.locator('button[type="submit"]')).click().catch(() => {});
  131 |       await page.waitForTimeout(3000);
  132 |       console.log('Checkout URL after submit:', page.url());
  133 |     }
  134 |   });
  135 | 
  136 |   test('7. Logout Journey (Customer)', async () => {
  137 |     await page.goto(`${PROD_URL}/account`).catch(() => {});
  138 |     const logoutBtn = page.locator('button:has-text("Logout")');
  139 |     if (await logoutBtn.count() > 0) {
  140 |       await logoutBtn.first().click();
  141 |       await page.waitForTimeout(2000);
  142 |       expect(page.url()).toContain('/');
  143 |     }
  144 |   });
  145 | 
  146 |   test('4. Register Journey (Vendor)', async () => {
  147 |     await page.goto(`${PROD_URL}/register`);
  148 |     await page.waitForSelector('input[type="email"]', { state: 'visible' });
  149 |     
  150 |     // Select vendor role (might need to click label instead of hidden radio)
  151 |     await page.locator('label').filter({ hasText: 'Vendor' }).click();
  152 |     await page.waitForTimeout(500);
  153 |     
  154 |     await page.getByPlaceholder('John Doe').fill('Test Vendor');
  155 |     await page.locator('input[type="email"]').fill(vendorEmail);
  156 |     await page.locator('input[type="password"]').fill('Password123!');
  157 |     
  158 |     // Vendor specific fields
  159 |     await page.locator('input[placeholder="My Awesome Store"]').fill('Apex Vendor Shop').catch(() => {});
  160 |     await page.locator('textarea[placeholder*="Tell us about"]').fill('Selling sports gear').catch(() => {});
  161 |     
  162 |     await page.getByRole('button', { name: /Create Account/i }).click();
  163 |     await page.waitForURL(url => !url.href.includes('/register'), { timeout: 10000 }).catch(() => {});
  164 |     await page.waitForTimeout(1000);
  165 |     
  166 |     const isRateLimited = await page.locator('text=/Too many/i').count() > 0;
  167 |     if (isRateLimited) {
  168 |       console.log('Rate limited. Skipping Vendor Registration.');
  169 |       test.skip();
```