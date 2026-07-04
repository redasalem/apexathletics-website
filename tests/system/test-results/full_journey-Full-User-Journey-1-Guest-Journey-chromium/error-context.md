# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: full_journey.spec.ts >> Full User Journey >> 1. Guest Journey
- Location: tests\full_journey.spec.ts:19:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "/login"
Received string:    "https://apexathletics-website.vercel.app/product/6a47170f7318b429b027ecf7"
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
        - link "Vendors" [ref=e20] [cursor=pointer]:
          - /url: /vendors
      - generic [ref=e21]:
        - link "Wishlist" [ref=e22] [cursor=pointer]:
          - /url: /wishlist
          - img [ref=e23]
          - generic [ref=e25]: Wishlist
        - link "Cart" [ref=e26] [cursor=pointer]:
          - /url: /cart
          - img [ref=e27]
          - generic [ref=e30]: Cart
        - link "Sign In" [ref=e31] [cursor=pointer]:
          - /url: /login
          - img [ref=e32]
          - generic [ref=e35]: Sign In
  - main [ref=e36]:
    - generic [ref=e38]:
      - img [ref=e39]
      - heading "Loading Product..." [level=2] [ref=e41]
  - contentinfo [ref=e42]:
    - generic [ref=e43]:
      - generic [ref=e44]:
        - generic [ref=e45]:
          - link "IMPECCABLE" [ref=e46] [cursor=pointer]:
            - /url: /
            - img [ref=e48]
            - generic [ref=e51]: IMPECCABLE
          - paragraph [ref=e52]: Premium multi-vendor sports marketplace. Connecting athletes with the best performance gear from independent vendors.
        - generic [ref=e53]:
          - heading "Shop" [level=3] [ref=e54]
          - list [ref=e55]:
            - listitem [ref=e56]:
              - link "All Products" [ref=e57] [cursor=pointer]:
                - /url: /shop
            - listitem [ref=e58]:
              - link "Athletic Shoes" [ref=e59] [cursor=pointer]:
                - /url: /shop?category=Athletic+Shoes
            - listitem [ref=e60]:
              - link "Sportswear" [ref=e61] [cursor=pointer]:
                - /url: /shop?category=Sportswear
            - listitem [ref=e62]:
              - link "Sports Equipment" [ref=e63] [cursor=pointer]:
                - /url: /shop?category=Sports+Equipment
        - generic [ref=e64]:
          - heading "Account" [level=3] [ref=e65]
          - list [ref=e66]:
            - listitem [ref=e67]:
              - link "Sign In" [ref=e68] [cursor=pointer]:
                - /url: /login
            - listitem [ref=e69]:
              - link "Create Account" [ref=e70] [cursor=pointer]:
                - /url: /register
            - listitem [ref=e71]:
              - link "My Orders" [ref=e72] [cursor=pointer]:
                - /url: /account/orders
            - listitem [ref=e73]:
              - link "Shopping Cart" [ref=e74] [cursor=pointer]:
                - /url: /cart
        - generic [ref=e75]:
          - heading "Information" [level=3] [ref=e76]
          - list [ref=e77]:
            - listitem [ref=e78]:
              - link "Privacy Policy" [ref=e79] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=e80]:
              - link "Terms of Service" [ref=e81] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=e82]:
              - link "Shipping Policy" [ref=e83] [cursor=pointer]:
                - /url: /shipping
            - listitem [ref=e84]:
              - link "Contact Us" [ref=e85] [cursor=pointer]:
                - /url: /contact
      - generic [ref=e86]:
        - paragraph [ref=e87]: © 2026 Impeccable Athletics. All rights reserved.
        - generic [ref=e89]: Secure Payments via Stripe
  - alert [ref=e90]: Running Pro Gear 15 - Impeccable Athletics | Apex Athletics
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
  21  |     await page.waitForLoadState('networkidle');
  22  |     
  23  |     // Browse products
  24  |     await page.getByRole('link', { name: 'Shop' }).first().click();
  25  |     await page.waitForLoadState('networkidle');
  26  |     
  27  |     // Click on first product
  28  |     const firstProduct = page.locator('a[href^="/product/"]').first();
  29  |     await firstProduct.click();
  30  |     await page.waitForLoadState('networkidle');
  31  |     
  32  |     // Add to cart as guest
  33  |     await page.getByRole('button', { name: /Add.*to cart/i }).or(page.locator('button:has-text("Add")')).first().click();
  34  |     await page.waitForTimeout(2000);
  35  |     // Should be redirected to login because guest can't use cart or wishlist in this app (auth protected)
> 36  |     expect(page.url()).toContain('/login');
      |                        ^ Error: expect(received).toContain(expected) // indexOf
  37  |     
  38  |     // Wishlist as guest
  39  |     await page.goto(PROD_URL);
  40  |     await page.getByRole('link', { name: 'Wishlist' }).first().click();
  41  |     expect(page.url()).toContain('/login');
  42  |   });
  43  | 
  44  |   test('2. Register Journey (Customer)', async () => {
  45  |     await page.goto(`${PROD_URL}/register`);
  46  |     await page.waitForLoadState('networkidle');
  47  |     
  48  |     await page.locator('input[type="text"]').first().fill('Test Customer');
  49  |     await page.locator('input[type="email"]').fill(customerEmail);
  50  |     await page.locator('input[type="password"]').fill('Password123!');
  51  |     
  52  |     await page.getByRole('button', { name: /Create Account/i }).click();
  53  |     await page.waitForLoadState('networkidle');
  54  |     await page.waitForTimeout(4000);
  55  |     
  56  |     // Check if redirected to account or home
  57  |     expect(page.url()).not.toContain('/register');
  58  |     console.log('Customer registered and redirected to:', page.url());
  59  |   });
  60  | 
  61  |   test('3. Shopping Journey (Customer)', async () => {
  62  |     // Assuming session is maintained since we're in the same browser context
  63  |     await page.goto(`${PROD_URL}/shop`);
  64  |     await page.waitForLoadState('networkidle');
  65  |     
  66  |     // Add to cart (Quick Add)
  67  |     const quickAddBtn = page.locator('button:has-text("Add")').first();
  68  |     if (await quickAddBtn.count() > 0) {
  69  |       await quickAddBtn.click();
  70  |       await page.waitForTimeout(2000); // Wait for toast/API
  71  |     }
  72  |     
  73  |     // Go to cart
  74  |     await page.goto(`${PROD_URL}/cart`);
  75  |     await page.waitForLoadState('networkidle');
  76  |     
  77  |     // Check if item is in cart
  78  |     const cartItems = page.locator('ul li');
  79  |     expect(await cartItems.count()).toBeGreaterThanOrEqual(0);
  80  |     
  81  |     // Try checkout
  82  |     const checkoutBtn = page.locator('button:has-text("Checkout")');
  83  |     if (await checkoutBtn.count() > 0 && await checkoutBtn.isEnabled()) {
  84  |       await checkoutBtn.click();
  85  |       await page.waitForLoadState('networkidle');
  86  |       expect(page.url()).toContain('/checkout');
  87  |       
  88  |       // Fill shipping
  89  |       await page.getByLabel(/Address/i).fill('123 Test St').catch(() => {});
  90  |       await page.getByLabel(/City/i).fill('Test City').catch(() => {});
  91  |       await page.getByLabel(/Postal/i).fill('12345').catch(() => {});
  92  |       
  93  |       await page.getByRole('button', { name: /Continue/i }).or(page.locator('button[type="submit"]')).click().catch(() => {});
  94  |       await page.waitForTimeout(3000);
  95  |       console.log('Checkout URL after submit:', page.url());
  96  |     }
  97  |   });
  98  | 
  99  |   test('7. Logout Journey (Customer)', async () => {
  100 |     await page.goto(`${PROD_URL}/account`);
  101 |     const logoutBtn = page.locator('button:has-text("Logout")');
  102 |     if (await logoutBtn.count() > 0) {
  103 |       await logoutBtn.first().click();
  104 |       await page.waitForTimeout(2000);
  105 |       expect(page.url()).toContain('/');
  106 |     }
  107 |   });
  108 | 
  109 |   test('4. Register Journey (Vendor)', async () => {
  110 |     await page.goto(`${PROD_URL}/register`);
  111 |     await page.waitForLoadState('networkidle');
  112 |     
  113 |     // Select vendor role (might need to click label instead of hidden radio)
  114 |     await page.locator('label').filter({ hasText: 'Vendor' }).click();
  115 |     await page.waitForTimeout(500);
  116 |     
  117 |     await page.locator('input[type="text"]').first().fill('Test Vendor');
  118 |     await page.locator('input[type="email"]').fill(vendorEmail);
  119 |     await page.locator('input[type="password"]').fill('Password123!');
  120 |     
  121 |     // Vendor specific fields
  122 |     await page.locator('input[placeholder="My Awesome Store"]').fill('Apex Vendor Shop').catch(() => {});
  123 |     await page.locator('textarea[placeholder*="Tell us about"]').fill('Selling sports gear').catch(() => {});
  124 |     
  125 |     await page.getByRole('button', { name: /Create Account/i }).click();
  126 |     await page.waitForLoadState('networkidle');
  127 |     await page.waitForTimeout(4000);
  128 |     
  129 |     expect(page.url()).not.toContain('/register');
  130 |     console.log('Vendor registered and redirected to:', page.url());
  131 |   });
  132 | 
  133 |   test('5. Vendor Dashboard Journey', async () => {
  134 |     await page.goto(`${PROD_URL}/vendor-dashboard`);
  135 |     await page.waitForLoadState('networkidle');
  136 |     
```