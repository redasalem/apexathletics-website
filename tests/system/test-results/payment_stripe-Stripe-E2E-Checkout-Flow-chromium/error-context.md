# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: payment_stripe.spec.ts >> Stripe E2E Checkout Flow
- Location: tests\payment_stripe.spec.ts:5:5

# Error details

```
TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e1]:
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
          - textbox "you@example.com" [active] [ref=e46]
          - paragraph [ref=e47]: Please enter a valid email address
        - generic [ref=e48]:
          - generic [ref=e49]: Password
          - generic [ref=e50]:
            - textbox "••••••••" [ref=e51]
            - button [ref=e52] [cursor=pointer]:
              - img [ref=e53]
          - paragraph [ref=e56]: Password is required
        - link "Forgot your password?" [ref=e59] [cursor=pointer]:
          - /url: /forgot-password
        - button "Sign In" [ref=e60] [cursor=pointer]:
          - text: Sign In
          - img [ref=e61]
  - contentinfo [ref=e63]:
    - generic [ref=e64]:
      - generic [ref=e65]:
        - generic [ref=e66]:
          - link "IMPECCABLE" [ref=e67] [cursor=pointer]:
            - /url: /
            - img [ref=e69]
            - generic [ref=e72]: IMPECCABLE
          - paragraph [ref=e73]: Premium multi-vendor sports marketplace. Connecting athletes with the best performance gear from independent vendors.
        - generic [ref=e74]:
          - heading "Shop" [level=3] [ref=e75]
          - list [ref=e76]:
            - listitem [ref=e77]:
              - link "All Products" [ref=e78] [cursor=pointer]:
                - /url: /shop
            - listitem [ref=e79]:
              - link "Athletic Shoes" [ref=e80] [cursor=pointer]:
                - /url: /shop?category=Athletic+Shoes
            - listitem [ref=e81]:
              - link "Sportswear" [ref=e82] [cursor=pointer]:
                - /url: /shop?category=Sportswear
            - listitem [ref=e83]:
              - link "Sports Equipment" [ref=e84] [cursor=pointer]:
                - /url: /shop?category=Sports+Equipment
        - generic [ref=e85]:
          - heading "Account" [level=3] [ref=e86]
          - list [ref=e87]:
            - listitem [ref=e88]:
              - link "Sign In" [ref=e89] [cursor=pointer]:
                - /url: /login
            - listitem [ref=e90]:
              - link "Create Account" [ref=e91] [cursor=pointer]:
                - /url: /register
            - listitem [ref=e92]:
              - link "My Orders" [ref=e93] [cursor=pointer]:
                - /url: /account/orders
            - listitem [ref=e94]:
              - link "Shopping Cart" [ref=e95] [cursor=pointer]:
                - /url: /cart
        - generic [ref=e96]:
          - heading "Information" [level=3] [ref=e97]
          - list [ref=e98]:
            - listitem [ref=e99]:
              - link "Privacy Policy" [ref=e100] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=e101]:
              - link "Terms of Service" [ref=e102] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=e103]:
              - link "Shipping Policy" [ref=e104] [cursor=pointer]:
                - /url: /shipping
            - listitem [ref=e105]:
              - link "Contact Us" [ref=e106] [cursor=pointer]:
                - /url: /contact
      - generic [ref=e107]:
        - paragraph [ref=e108]: © 2026 Impeccable Athletics. All rights reserved.
        - generic [ref=e110]: Secure Payments via Stripe
  - alert [ref=e111]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | const PROD_URL = 'https://apexathletics-website.vercel.app';
  4   | 
  5   | test('Stripe E2E Checkout Flow', async ({ page }) => {
  6   |   test.setTimeout(120000); // 2 mins for Stripe interactions
  7   | 
  8   |   // 1. Login
  9   |   await page.goto(`${PROD_URL}/login`);
  10  |   await page.locator('input[type="email"]').fill('customer1@apexathletics.com');
  11  |   await page.locator('input[type="password"]').fill('Customer@123456');
  12  |   await page.getByRole('button', { name: /Sign In/i }).click();
  13  |   
  14  |   // Wait for successful login (should redirect away from login)
> 15  |   await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 15000 });
      |              ^ TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
  16  |   console.log('✅ Logged in successfully');
  17  | 
  18  |   // 2. Go to Shop and Add to Cart
  19  |   await page.goto(`${PROD_URL}/shop`);
  20  |   await page.waitForLoadState('networkidle');
  21  | 
  22  |   // Click first product link
  23  |   await page.locator('a[href^="/product/"]').first().click();
  24  |   await page.waitForLoadState('networkidle');
  25  | 
  26  |   // If there are sizes, click the first one
  27  |   const sizes = page.locator('button:has-text("SM"), button:has-text("MD"), button:has-text("LG"), button:has-text("XL")');
  28  |   if (await sizes.count() > 0) {
  29  |     await sizes.first().click();
  30  |   }
  31  | 
  32  |   // If there are colors, click the first one
  33  |   const colors = page.locator('button:has-text("BLACK"), button:has-text("WHITE"), button:has-text("RED")');
  34  |   if (await colors.count() > 0) {
  35  |     await colors.first().click();
  36  |   }
  37  | 
  38  |   // Click Add to Cart
  39  |   await page.locator('button:has-text("Add to Cart")').first().click();
  40  |   await page.waitForTimeout(2000);
  41  |   console.log('✅ Added product to cart');
  42  | 
  43  |   // 3. Checkout
  44  |   await page.goto(`${PROD_URL}/cart`);
  45  |   await page.waitForLoadState('networkidle');
  46  |   
  47  |   // We need to verify if the cart is not empty. If it is empty, that means the previous step failed.
  48  |   const checkoutBtn = page.locator('button:has-text("Checkout")');
  49  |   if (await checkoutBtn.count() === 0) {
  50  |      throw new Error("Cart is empty or checkout button not found.");
  51  |   }
  52  |   
  53  |   await checkoutBtn.click();
  54  |   await page.waitForLoadState('networkidle');
  55  | 
  56  |   // Fill shipping if present
  57  |   const addressInput = page.getByLabel(/Address/i);
  58  |   if (await addressInput.isVisible()) {
  59  |     await addressInput.fill('123 Test St');
  60  |     await page.getByLabel(/City/i).fill('Test City');
  61  |     await page.getByLabel(/Postal/i).fill('12345');
  62  |     await page.getByRole('button', { name: /Continue/i }).or(page.locator('button[type="submit"]')).click();
  63  |     await page.waitForLoadState('networkidle');
  64  |   }
  65  |   
  66  |   console.log('✅ Redirecting to Stripe...');
  67  |   
  68  |   // 4. Wait for Stripe Checkout
  69  |   await page.waitForURL(/checkout\.stripe\.com/, { timeout: 20000 });
  70  |   console.log('✅ Reached Stripe Checkout');
  71  | 
  72  |   // 5. Fill Stripe Test Card
  73  |   await page.waitForTimeout(5000); // Give Stripe time to load completely
  74  | 
  75  |   // Card Number
  76  |   await page.getByLabel('Card number').fill('4242424242424242').catch(() => {});
  77  |   
  78  |   // Expiry
  79  |   await page.getByLabel('Expiration').fill('1234').catch(() => {});
  80  |   
  81  |   // CVC
  82  |   await page.getByLabel('CVC').fill('123').catch(() => {});
  83  |   
  84  |   // Name
  85  |   const nameInput = page.getByLabel('Name on card');
  86  |   if (await nameInput.isVisible()) await nameInput.fill('Test User');
  87  |   
  88  |   // Zip
  89  |   const zipInput = page.getByLabel('ZIP');
  90  |   if (await zipInput.isVisible()) await zipInput.fill('12345');
  91  | 
  92  |   // Submit payment
  93  |   await page.locator('button[type="submit"]').click();
  94  |   console.log('✅ Submitted payment on Stripe');
  95  | 
  96  |   // 6. Wait for redirect back to success page
  97  |   await page.waitForURL(url => url.toString().includes('/order/success') || url.toString().includes('/account'), { timeout: 30000 });
  98  |   console.log('✅ Returned to Apex Athletics:', page.url());
  99  | 
  100 |   // 7. Extract Order ID
  101 |   const urlParts = page.url().split('/');
  102 |   const orderId = urlParts[urlParts.length - 1];
  103 |   console.log('ORDER_ID:', orderId);
  104 |   
  105 |   // Save screenshot of success
  106 |   await page.screenshot({ path: 'stripe_success.png', fullPage: true });
  107 | 
  108 | });
  109 | 
```