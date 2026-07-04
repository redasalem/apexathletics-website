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