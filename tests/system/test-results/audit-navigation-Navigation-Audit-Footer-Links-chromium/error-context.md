# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: audit-navigation.spec.ts >> Navigation Audit >> Footer Links
- Location: tests\audit-navigation.spec.ts:29:7

# Error details

```
Error: elementHandle.getAttribute: Execution context was destroyed, most likely because of a navigation
Call log:
  - waiting for locator(':scope')

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
    - img [ref=e37]
  - contentinfo [ref=e39]:
    - generic [ref=e40]:
      - generic [ref=e41]:
        - generic [ref=e42]:
          - link "IMPECCABLE" [ref=e43] [cursor=pointer]:
            - /url: /
            - img [ref=e45]
            - generic [ref=e48]: IMPECCABLE
          - paragraph [ref=e49]: Premium multi-vendor sports marketplace. Connecting athletes with the best performance gear from independent vendors.
        - generic [ref=e50]:
          - heading "Shop" [level=3] [ref=e51]
          - list [ref=e52]:
            - listitem [ref=e53]:
              - link "All Products" [ref=e54] [cursor=pointer]:
                - /url: /shop
            - listitem [ref=e55]:
              - link "Athletic Shoes" [ref=e56] [cursor=pointer]:
                - /url: /shop?category=Athletic+Shoes
            - listitem [ref=e57]:
              - link "Sportswear" [ref=e58] [cursor=pointer]:
                - /url: /shop?category=Sportswear
            - listitem [ref=e59]:
              - link "Sports Equipment" [ref=e60] [cursor=pointer]:
                - /url: /shop?category=Sports+Equipment
        - generic [ref=e61]:
          - heading "Account" [level=3] [ref=e62]
          - list [ref=e63]:
            - listitem [ref=e64]:
              - link "Sign In" [ref=e65] [cursor=pointer]:
                - /url: /login
            - listitem [ref=e66]:
              - link "Create Account" [ref=e67] [cursor=pointer]:
                - /url: /register
            - listitem [ref=e68]:
              - link "My Orders" [ref=e69] [cursor=pointer]:
                - /url: /account/orders
            - listitem [ref=e70]:
              - link "Shopping Cart" [ref=e71] [cursor=pointer]:
                - /url: /cart
        - generic [ref=e72]:
          - heading "Information" [level=3] [ref=e73]
          - list [ref=e74]:
            - listitem [ref=e75]:
              - link "Privacy Policy" [ref=e76] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=e77]:
              - link "Terms of Service" [ref=e78] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=e79]:
              - link "Shipping Policy" [ref=e80] [cursor=pointer]:
                - /url: /shipping
            - listitem [ref=e81]:
              - link "Contact Us" [ref=e82] [cursor=pointer]:
                - /url: /contact
      - generic [ref=e83]:
        - paragraph [ref=e84]: © 2026 Impeccable Athletics. All rights reserved.
        - generic [ref=e86]: Secure Payments via Stripe
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const PROD_URL = 'https://apexathletics-website.vercel.app';
  4  | const results: any[] = [];
  5  | 
  6  | function logResult(pageName: string, element: string, expected: string, actual: string, status: string) {
  7  |   results.push({ page: pageName, element, expected, actual, status });
  8  |   console.log(`[${status}] ${pageName} - ${element}: ${actual}`);
  9  | }
  10 | 
  11 | test.describe('Navigation Audit', () => {
  12 |   test('Navbar Links', async ({ page }) => {
  13 |     await page.goto(PROD_URL);
  14 |     const navLinks = await page.locator('nav a').elementHandles();
  15 |     for (const link of navLinks) {
  16 |       const href = await link.getAttribute('href');
  17 |       const text = (await link.innerText()).trim() || href;
  18 |       if (href && href !== '#') {
  19 |         const response = await page.request.get(PROD_URL + (href.startsWith('/') ? href : '/' + href));
  20 |         if (response.ok()) {
  21 |           logResult('Navbar', `Link: ${text}`, 'Navigates correctly', 'OK', '✅ Passed');
  22 |         } else {
  23 |           logResult('Navbar', `Link: ${text}`, 'Navigates correctly', `Failed with status ${response.status()}`, '🔴 Critical');
  24 |         }
  25 |       }
  26 |     }
  27 |   });
  28 | 
  29 |   test('Footer Links', async ({ page }) => {
  30 |     await page.goto(PROD_URL);
  31 |     const footerLinks = await page.locator('footer a').elementHandles();
  32 |     for (const link of footerLinks) {
> 33 |       const href = await link.getAttribute('href');
     |                               ^ Error: elementHandle.getAttribute: Execution context was destroyed, most likely because of a navigation
  34 |       const text = (await link.innerText()).trim() || href;
  35 |       if (href === '#' || href === '') {
  36 |          logResult('Footer', `Link: ${text}`, 'Valid link', 'Dead link (href="#")', '🟡 Medium');
  37 |       } else if (href) {
  38 |         const response = await page.request.get(href.startsWith('http') ? href : PROD_URL + href);
  39 |         if (response.ok()) {
  40 |           logResult('Footer', `Link: ${text}`, 'Navigates correctly', 'OK', '✅ Passed');
  41 |         } else {
  42 |           logResult('Footer', `Link: ${text}`, 'Navigates correctly', `Failed with ${response.status()}`, '🔴 Critical');
  43 |         }
  44 |       }
  45 |     }
  46 |   });
  47 | 
  48 |   test('Product Cards', async ({ page }) => {
  49 |     await page.goto(PROD_URL + '/shop');
  50 |     await page.waitForLoadState('networkidle');
  51 |     const products = await page.locator('a[href^="/product/"]').elementHandles();
  52 |     if (products.length > 0) {
  53 |       const firstHref = await products[0].getAttribute('href') || '';
  54 |       await products[0].click();
  55 |       await page.waitForLoadState('networkidle');
  56 |       if (firstHref && page.url().includes(firstHref)) {
  57 |         logResult('Shop', 'Product Card Click', 'Navigates to detail page', 'Success', '✅ Passed');
  58 |       } else {
  59 |         logResult('Shop', 'Product Card Click', 'Navigates to detail page', 'Did not navigate', '🔴 Critical');
  60 |       }
  61 |     }
  62 |   });
  63 |   
  64 |   test('Auth Navigation', async ({ page }) => {
  65 |     await page.goto(PROD_URL + '/login');
  66 |     const registerLink = page.locator('a[href="/register"]');
  67 |     if (await registerLink.count() > 0) {
  68 |        await registerLink.first().click();
  69 |        await page.waitForLoadState('networkidle');
  70 |        if (page.url().includes('/register')) {
  71 |          logResult('Login', 'Register Link', 'Navigates to register', 'Success', '✅ Passed');
  72 |        }
  73 |     }
  74 |   });
  75 | 
  76 | });
  77 | 
```