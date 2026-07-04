# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: payment_stripe.spec.ts >> Stripe Payment Flow E2E >> Full checkout with Stripe test card
- Location: tests\payment_stripe.spec.ts:31:7

# Error details

```
Test timeout of 180000ms exceeded.
```

```
Error: locator.fill: Test timeout of 180000ms exceeded.
Call log:
  - waiting for locator('input[placeholder="John Doe"]')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e3]:
      - link "IMPECCABLE" [ref=e4] [cursor=pointer]:
        - /url: /
        - img [ref=e6]
        - generic [ref=e9]: IMPECCABLE
      - generic [ref=e11]:
        - img [ref=e13]
        - textbox "Search products, gear, athletes..." [ref=e16]
      - generic [ref=e17]:
        - link "Home" [ref=e18] [cursor=pointer]:
          - /url: /
        - link "Products" [ref=e19] [cursor=pointer]:
          - /url: /shop
      - generic [ref=e20]:
        - link "Wishlist" [ref=e21] [cursor=pointer]:
          - /url: /wishlist
          - img [ref=e22]
          - generic [ref=e24]: Wishlist
        - link "Cart" [ref=e25] [cursor=pointer]:
          - /url: /cart
          - img [ref=e26]
          - generic [ref=e29]: Cart
        - link "Sign In" [ref=e30] [cursor=pointer]:
          - /url: /login
          - img [ref=e31]
          - generic [ref=e34]: Sign In
  - main [ref=e35]:
    - generic [ref=e36]:
      - generic [ref=e37]:
        - heading "Welcome Back" [level=2] [ref=e38]
        - paragraph [ref=e39]:
          - text: New to Impeccable?
          - link "Create your free account" [ref=e40] [cursor=pointer]:
            - /url: /register
      - generic [ref=e43]:
        - generic [ref=e44]:
          - generic [ref=e45]: Email address
          - textbox "you@example.com" [ref=e46]
        - generic [ref=e47]:
          - generic [ref=e48]: Password
          - generic [ref=e49]:
            - textbox "••••••••" [ref=e50]
            - button [ref=e51] [cursor=pointer]:
              - img [ref=e52]
        - link "Forgot your password?" [ref=e57] [cursor=pointer]:
          - /url: /forgot-password
        - button "Sign In" [ref=e58] [cursor=pointer]:
          - text: Sign In
          - img [ref=e59]
  - contentinfo [ref=e61]:
    - generic [ref=e62]:
      - generic [ref=e63]:
        - generic [ref=e64]:
          - link "IMPECCABLE" [ref=e65] [cursor=pointer]:
            - /url: /
            - img [ref=e67]
            - generic [ref=e70]: IMPECCABLE
          - paragraph [ref=e71]: Premium multi-vendor sports marketplace. Connecting athletes with the best performance gear from independent vendors.
        - generic [ref=e72]:
          - heading "Shop" [level=3] [ref=e73]
          - list [ref=e74]:
            - listitem [ref=e75]:
              - link "All Products" [ref=e76] [cursor=pointer]:
                - /url: /shop
            - listitem [ref=e77]:
              - link "Athletic Shoes" [ref=e78] [cursor=pointer]:
                - /url: /shop?category=Athletic+Shoes
            - listitem [ref=e79]:
              - link "Sportswear" [ref=e80] [cursor=pointer]:
                - /url: /shop?category=Sportswear
            - listitem [ref=e81]:
              - link "Sports Equipment" [ref=e82] [cursor=pointer]:
                - /url: /shop?category=Sports+Equipment
        - generic [ref=e83]:
          - heading "Account" [level=3] [ref=e84]
          - list [ref=e85]:
            - listitem [ref=e86]:
              - link "Sign In" [ref=e87] [cursor=pointer]:
                - /url: /login
            - listitem [ref=e88]:
              - link "Create Account" [ref=e89] [cursor=pointer]:
                - /url: /register
            - listitem [ref=e90]:
              - link "My Orders" [ref=e91] [cursor=pointer]:
                - /url: /account/orders
            - listitem [ref=e92]:
              - link "Shopping Cart" [ref=e93] [cursor=pointer]:
                - /url: /cart
        - generic [ref=e94]:
          - heading "Information" [level=3] [ref=e95]
          - list [ref=e96]:
            - listitem [ref=e97]:
              - link "Privacy Policy" [ref=e98] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=e99]:
              - link "Terms of Service" [ref=e100] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=e101]:
              - link "Shipping Policy" [ref=e102] [cursor=pointer]:
                - /url: /shipping
            - listitem [ref=e103]:
              - link "Contact Us" [ref=e104] [cursor=pointer]:
                - /url: /contact
      - generic [ref=e105]:
        - paragraph [ref=e106]: © 2026 Impeccable Athletics. All rights reserved.
        - generic [ref=e108]: Secure Payments via Stripe
  - alert [ref=e109]
```

# Test source

```ts
  1   | import { test, expect, Page } from '@playwright/test';
  2   | import * as fs from 'fs';
  3   | import * as path from 'path';
  4   | 
  5   | // ─── Config ─────────────────────────────────────────────────────────────────
  6   | const PROD_URL = 'https://apexathletics-website.vercel.app';
  7   | const SCREENSHOTS_DIR = path.resolve(__dirname, '..', 'screenshots', 'payment');
  8   | 
  9   | // ─── Helpers ────────────────────────────────────────────────────────────────
  10  | 
  11  | test.beforeAll(async () => {
  12  |   if (!fs.existsSync(SCREENSHOTS_DIR)) {
  13  |     fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  14  |   }
  15  | });
  16  | 
  17  | async function snap(page: Page, name: string) {
  18  |   try {
  19  |     await page.screenshot({
  20  |       path: path.join(SCREENSHOTS_DIR, `${name}.png`),
  21  |       fullPage: true,
  22  |     });
  23  |   } catch {
  24  |     console.log(`⚠️ Could not take screenshot: ${name}`);
  25  |   }
  26  | }
  27  | 
  28  | // ─── Main Test ──────────────────────────────────────────────────────────────
  29  | 
  30  | test.describe('Stripe Payment Flow E2E', () => {
  31  |   test('Full checkout with Stripe test card', async ({ page }) => {
  32  |     test.setTimeout(180_000); // 3 minutes total
  33  | 
  34  |     const results: { step: string; status: string; detail: string }[] = [];
  35  | 
  36  |     // ── Step 1: Register a new account ─────────────────────────────────────
  37  |     // Skip login attempt — seed users may not exist on production
  38  |     console.log('📝 Creating new account...');
  39  |     await page.goto(`${PROD_URL}/register`);
  40  |     await page.waitForLoadState('networkidle');
  41  |     await snap(page, '01_register_page');
  42  | 
  43  |     const ts = Date.now();
  44  |     const testEmail = `testpay_${ts}@test-apex.com`;
  45  |     const testPassword = 'TestPayer@123456';
  46  | 
  47  |     // Fill name
> 48  |     await page.locator('input[placeholder="John Doe"]').fill('Test Payer');
      |                                                         ^ Error: locator.fill: Test timeout of 180000ms exceeded.
  49  |     // Fill email
  50  |     await page.locator('input[type="email"]').fill(testEmail);
  51  |     // Fill password
  52  |     await page.locator('input[type="password"]').fill(testPassword);
  53  | 
  54  |     await snap(page, '02_register_filled');
  55  | 
  56  |     // Submit registration
  57  |     await page.locator('button[type="submit"]').click();
  58  |     console.log('📝 Submitted registration...');
  59  | 
  60  |     // Wait for redirect (to /account for customer)
  61  |     try {
  62  |       await page.waitForURL(url => !url.toString().includes('/register'), { timeout: 25000 });
  63  |       console.log(`✅ [Register] Redirected to: ${page.url()}`);
  64  |       results.push({ step: 'Register', status: 'PASS', detail: `Redirected to ${page.url()}` });
  65  |     } catch {
  66  |       // Check for any error
  67  |       const bodyText = await page.locator('body').textContent().catch(() => '');
  68  |       const hasError = bodyText?.includes('error') || bodyText?.includes('Error') || bodyText?.includes('already');
  69  |       console.log(`❌ [Register] Failed. Body contains error: ${hasError}`);
  70  |       
  71  |       // Try login instead with a known approach
  72  |       console.log('📝 Trying login with seed credentials...');
  73  |       await page.goto(`${PROD_URL}/login`);
  74  |       await page.waitForLoadState('networkidle');
  75  |       await page.locator('input[type="email"]').fill('customer1@apexathletics.com');
  76  |       await page.locator('input[type="password"]').fill('Customer@123456');
  77  |       await page.locator('button[type="submit"]').click();
  78  |       
  79  |       try {
  80  |         await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 15000 });
  81  |         results.push({ step: 'Login (fallback)', status: 'PASS', detail: `Redirected to ${page.url()}` });
  82  |       } catch {
  83  |         await snap(page, '02_auth_failed');
  84  |         results.push({ step: 'Auth', status: 'FAIL', detail: 'Both register and login failed' });
  85  |         printResults(results);
  86  |         return;
  87  |       }
  88  |     }
  89  | 
  90  |     await snap(page, '03_authenticated');
  91  | 
  92  |     // ── Step 2: Add product to cart ─────────────────────────────────────────
  93  |     console.log('🛒 Going to shop...');
  94  |     await page.goto(`${PROD_URL}/shop`);
  95  |     await page.waitForLoadState('networkidle');
  96  |     await page.waitForTimeout(3000);
  97  |     await snap(page, '04_shop_page');
  98  | 
  99  |     const productLinks = page.locator('a[href^="/product/"]');
  100 |     const productCount = await productLinks.count();
  101 |     console.log(`🛒 Found ${productCount} products`);
  102 | 
  103 |     if (productCount === 0) {
  104 |       results.push({ step: 'Shop', status: 'FAIL', detail: 'No products found' });
  105 |       printResults(results);
  106 |       return;
  107 |     }
  108 | 
  109 |     // Click first product
  110 |     await productLinks.first().click();
  111 |     await page.waitForLoadState('networkidle');
  112 |     await page.waitForTimeout(2000);
  113 |     await snap(page, '05_product_detail');
  114 |     console.log(`🛒 Viewing product: ${page.url()}`);
  115 | 
  116 |     // Select size if available (look for common size buttons)
  117 |     const sizeButtons = page.locator('button').filter({ hasText: /^(XS|S|SM|M|MD|L|LG|XL|XXL)$/i });
  118 |     if (await sizeButtons.count() > 0) {
  119 |       await sizeButtons.first().click();
  120 |       console.log('✅ Selected size');
  121 |     }
  122 | 
  123 |     // Click Add to Cart
  124 |     const addBtn = page.locator('button').filter({ hasText: /add to cart/i }).first();
  125 |     if (await addBtn.count() === 0) {
  126 |       results.push({ step: 'Add to Cart', status: 'FAIL', detail: 'No Add to Cart button' });
  127 |       await snap(page, '06_no_add_to_cart');
  128 |       printResults(results);
  129 |       return;
  130 |     }
  131 | 
  132 |     await addBtn.click();
  133 |     await page.waitForTimeout(3000);
  134 |     await snap(page, '06_after_add_to_cart');
  135 | 
  136 |     // Check if redirected to login (means session expired)
  137 |     if (page.url().includes('/login')) {
  138 |       results.push({ step: 'Add to Cart', status: 'FAIL', detail: 'Redirected to login — session lost' });
  139 |       await snap(page, '06_session_lost');
  140 |       printResults(results);
  141 |       return;
  142 |     }
  143 | 
  144 |     results.push({ step: 'Add to Cart', status: 'PASS', detail: 'Product added' });
  145 |     console.log('✅ Added product to cart');
  146 | 
  147 |     // ── Step 3: Go to cart ──────────────────────────────────────────────────
  148 |     console.log('🛒 Going to cart...');
```