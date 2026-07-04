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
Received string:    "https://apexathletics-website.vercel.app/"
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
        - link "Vendors" [ref=e20] [cursor=pointer]:
          - /url: /vendors
      - generic [ref=e21]:
        - link "Wishlist" [active] [ref=e22] [cursor=pointer]:
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
    - generic [ref=e37]:
      - generic [ref=e38]: 🏆 Free Shipping on Orders Over $50 · 30-Day Returns · Authentic Gear Guaranteed
      - generic [ref=e39]:
        - img "Outdoor Gear"
        - generic [ref=e40]:
          - generic [ref=e41]:
            - img [ref=e42]
            - text: New Season Gear
          - heading "Gear Up. Perform Better." [level=1] [ref=e44]:
            - text: Gear Up.
            - text: Perform Better.
          - paragraph [ref=e45]: Shop thousands of products from verified vendors — athletic shoes, pro equipment, and performance apparel all in one place.
          - generic [ref=e46]:
            - link "Shop Now" [ref=e47] [cursor=pointer]:
              - /url: /shop
            - link "Create Account" [ref=e48] [cursor=pointer]:
              - /url: /register
      - generic [ref=e49]:
        - generic [ref=e50]:
          - generic [ref=e51]:
            - generic [ref=e52]: Shop by Category
            - heading "Find Your Sport" [level=2] [ref=e53]
          - link "View All" [ref=e54] [cursor=pointer]:
            - /url: /register
            - text: View All
            - img [ref=e55]
        - generic [ref=e57]:
          - link "Basketball Basketball Explore collection" [ref=e58] [cursor=pointer]:
            - /url: /shop?category=Basketball
            - generic [ref=e59]:
              - img "Basketball" [ref=e60]
              - generic [ref=e62]: Basketball
            - generic [ref=e63]:
              - paragraph [ref=e64]: Explore collection
              - img [ref=e65]
          - link "Fitness Fitness Explore collection" [ref=e67] [cursor=pointer]:
            - /url: /shop?category=Fitness
            - generic [ref=e68]:
              - img "Fitness" [ref=e69]
              - generic [ref=e71]: Fitness
            - generic [ref=e72]:
              - paragraph [ref=e73]: Explore collection
              - img [ref=e74]
          - link "Football Football Explore collection" [ref=e76] [cursor=pointer]:
            - /url: /shop?category=Football
            - generic [ref=e77]:
              - img "Football" [ref=e78]
              - generic [ref=e80]: Football
            - generic [ref=e81]:
              - paragraph [ref=e82]: Explore collection
              - img [ref=e83]
          - link "Running Running Explore collection" [ref=e85] [cursor=pointer]:
            - /url: /shop?category=Running
            - generic [ref=e86]:
              - img "Running" [ref=e87]
              - generic [ref=e89]: Running
            - generic [ref=e90]:
              - paragraph [ref=e91]: Explore collection
              - img [ref=e92]
          - link "Swimming Swimming Explore collection" [ref=e94] [cursor=pointer]:
            - /url: /shop?category=Swimming
            - generic [ref=e95]:
              - img "Swimming" [ref=e96]
              - generic [ref=e98]: Swimming
            - generic [ref=e99]:
              - paragraph [ref=e100]: Explore collection
              - img [ref=e101]
          - link "Tennis Tennis Explore collection" [ref=e103] [cursor=pointer]:
            - /url: /shop?category=Tennis
            - generic [ref=e104]:
              - img "Tennis" [ref=e105]
              - generic [ref=e107]: Tennis
            - generic [ref=e108]:
              - paragraph [ref=e109]: Explore collection
              - img [ref=e110]
      - generic [ref=e112]:
        - generic [ref=e113]:
          - generic [ref=e114]:
            - generic [ref=e115]: New In
            - heading "Latest Arrivals" [level=2] [ref=e116]
          - link "View All" [ref=e117] [cursor=pointer]:
            - /url: /shop
            - text: View All
            - img [ref=e118]
        - generic [ref=e120]:
          - generic [ref=e121]:
            - generic [ref=e122]:
              - link "View Basketball Pro Gear 13" [ref=e123] [cursor=pointer]:
                - /url: /product/6a47170f7318b429b027ecf5
                - img "Basketball Pro Gear 13" [ref=e124]
              - button "Add to wishlist" [ref=e125] [cursor=pointer]:
                - img [ref=e126]
            - generic [ref=e128]:
              - generic [ref=e129]:
                - generic [ref=e130]: Basketball
                - generic "0 reviews" [ref=e131]:
                  - img [ref=e132]
                  - generic [ref=e134]: "0.0"
              - link "Basketball Pro Gear 13" [ref=e135] [cursor=pointer]:
                - /url: /product/6a47170f7318b429b027ecf5
                - heading "Basketball Pro Gear 13" [level=4] [ref=e136]
              - generic [ref=e137]:
                - generic [ref=e139]: $303.00
                - button "Add Basketball Pro Gear 13 to cart" [ref=e140] [cursor=pointer]:
                  - img [ref=e141]
                  - text: Add
          - generic [ref=e145]:
            - generic [ref=e146]:
              - link "View Fitness Pro Gear 11" [ref=e147] [cursor=pointer]:
                - /url: /product/6a47170f7318b429b027ecf3
                - img "Fitness Pro Gear 11" [ref=e148]
              - button "Add to wishlist" [ref=e149] [cursor=pointer]:
                - img [ref=e150]
            - generic [ref=e152]:
              - generic [ref=e153]:
                - generic [ref=e154]: Fitness
                - generic "0 reviews" [ref=e155]:
                  - img [ref=e156]
                  - generic [ref=e158]: "0.0"
              - link "Fitness Pro Gear 11" [ref=e159] [cursor=pointer]:
                - /url: /product/6a47170f7318b429b027ecf3
                - heading "Fitness Pro Gear 11" [level=4] [ref=e160]
              - generic [ref=e161]:
                - generic [ref=e163]: $133.00
                - button "Add Fitness Pro Gear 11 to cart" [ref=e164] [cursor=pointer]:
                  - img [ref=e165]
                  - text: Add
          - generic [ref=e169]:
            - generic [ref=e170]:
              - link "View Football Pro Gear 12" [ref=e171] [cursor=pointer]:
                - /url: /product/6a47170f7318b429b027ecf4
                - img "Football Pro Gear 12" [ref=e172]
              - button "Add to wishlist" [ref=e173] [cursor=pointer]:
                - img [ref=e174]
            - generic [ref=e176]:
              - generic [ref=e177]:
                - generic [ref=e178]: Football
                - generic "0 reviews" [ref=e179]:
                  - img [ref=e180]
                  - generic [ref=e182]: "0.0"
              - link "Football Pro Gear 12" [ref=e183] [cursor=pointer]:
                - /url: /product/6a47170f7318b429b027ecf4
                - heading "Football Pro Gear 12" [level=4] [ref=e184]
              - generic [ref=e185]:
                - generic [ref=e187]: $341.00
                - button "Add Football Pro Gear 12 to cart" [ref=e188] [cursor=pointer]:
                  - img [ref=e189]
                  - text: Add
          - generic [ref=e193]:
            - generic [ref=e194]:
              - link "View Swimming Pro Gear 10" [ref=e195] [cursor=pointer]:
                - /url: /product/6a47170f7318b429b027ecf2
                - img "Swimming Pro Gear 10" [ref=e196]
              - button "Add to wishlist" [ref=e197] [cursor=pointer]:
                - img [ref=e198]
            - generic [ref=e200]:
              - generic [ref=e201]:
                - generic [ref=e202]: Swimming
                - generic "0 reviews" [ref=e203]:
                  - img [ref=e204]
                  - generic [ref=e206]: "0.0"
              - link "Swimming Pro Gear 10" [ref=e207] [cursor=pointer]:
                - /url: /product/6a47170f7318b429b027ecf2
                - heading "Swimming Pro Gear 10" [level=4] [ref=e208]
              - generic [ref=e209]:
                - generic [ref=e211]: $491.00
                - button "Add Swimming Pro Gear 10 to cart" [ref=e212] [cursor=pointer]:
                  - img [ref=e213]
                  - text: Add
      - generic [ref=e219]:
        - generic [ref=e220]:
          - paragraph [ref=e221]: "3"
          - paragraph [ref=e222]: Active Vendors
        - generic [ref=e223]:
          - paragraph [ref=e224]: "15"
          - paragraph [ref=e225]: Products Listed
        - generic [ref=e226]:
          - paragraph [ref=e227]: 24/7
          - paragraph [ref=e228]: Vendor Support
      - generic [ref=e229]:
        - generic [ref=e230]:
          - generic [ref=e231]: Value
          - heading "Why Impeccable" [level=2] [ref=e232]
        - generic [ref=e233]:
          - generic [ref=e234]:
            - img [ref=e236]
            - heading "Authentic Gear" [level=4] [ref=e238]
            - paragraph [ref=e239]: Every vendor is verified. Every product is genuine. Zero counterfeits, zero compromises.
          - generic [ref=e240]:
            - img [ref=e242]
            - heading "Fast Shipping" [level=4] [ref=e247]
            - paragraph [ref=e248]: Free shipping on orders over $50. Most orders processed within 24 hours.
          - generic [ref=e249]:
            - img [ref=e251]
            - heading "Easy Returns" [level=4] [ref=e254]
            - paragraph [ref=e255]: 30-day hassle-free returns on all purchases. Your satisfaction is guaranteed.
  - contentinfo [ref=e256]:
    - generic [ref=e257]:
      - generic [ref=e258]:
        - generic [ref=e259]:
          - link "IMPECCABLE" [ref=e260] [cursor=pointer]:
            - /url: /
            - img [ref=e262]
            - generic [ref=e265]: IMPECCABLE
          - paragraph [ref=e266]: Premium multi-vendor sports marketplace. Connecting athletes with the best performance gear from independent vendors.
        - generic [ref=e267]:
          - heading "Shop" [level=3] [ref=e268]
          - list [ref=e269]:
            - listitem [ref=e270]:
              - link "All Products" [ref=e271] [cursor=pointer]:
                - /url: /shop
            - listitem [ref=e272]:
              - link "Athletic Shoes" [ref=e273] [cursor=pointer]:
                - /url: /shop?category=Athletic+Shoes
            - listitem [ref=e274]:
              - link "Sportswear" [ref=e275] [cursor=pointer]:
                - /url: /shop?category=Sportswear
            - listitem [ref=e276]:
              - link "Sports Equipment" [ref=e277] [cursor=pointer]:
                - /url: /shop?category=Sports+Equipment
        - generic [ref=e278]:
          - heading "Account" [level=3] [ref=e279]
          - list [ref=e280]:
            - listitem [ref=e281]:
              - link "Sign In" [ref=e282] [cursor=pointer]:
                - /url: /login
            - listitem [ref=e283]:
              - link "Create Account" [ref=e284] [cursor=pointer]:
                - /url: /register
            - listitem [ref=e285]:
              - link "My Orders" [ref=e286] [cursor=pointer]:
                - /url: /account/orders
            - listitem [ref=e287]:
              - link "Shopping Cart" [ref=e288] [cursor=pointer]:
                - /url: /cart
        - generic [ref=e289]:
          - heading "Information" [level=3] [ref=e290]
          - list [ref=e291]:
            - listitem [ref=e292]:
              - link "Privacy Policy" [ref=e293] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=e294]:
              - link "Terms of Service" [ref=e295] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=e296]:
              - link "Shipping Policy" [ref=e297] [cursor=pointer]:
                - /url: /shipping
            - listitem [ref=e298]:
              - link "Contact Us" [ref=e299] [cursor=pointer]:
                - /url: /contact
      - generic [ref=e300]:
        - paragraph [ref=e301]: © 2026 Impeccable Athletics. All rights reserved.
        - generic [ref=e303]: Secure Payments via Stripe
  - alert [ref=e304]
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
  48  |     // Add to cart as guest
  49  |     await page.locator('button', { hasText: /Add to Cart/i }).first().click();
  50  |     await page.waitForURL(url => url.href.includes('/login'), { timeout: 5000 }).catch(() => {});
  51  |     expect(page.url()).toContain('/login');
  52  |     
  53  |     // Wishlist as guest
  54  |     await page.goto(PROD_URL);
  55  |     await page.getByRole('link', { name: 'Wishlist' }).first().click();
  56  |     await page.waitForURL(url => url.href.includes('/login'), { timeout: 5000 }).catch(() => {});
> 57  |     expect(page.url()).toContain('/login');
      |                        ^ Error: expect(received).toContain(expected) // indexOf
  58  |   });
  59  | 
  60  |   test('2. Register Journey (Customer)', async () => {
  61  |     await page.goto(`${PROD_URL}/register`);
  62  |     await page.waitForSelector('input[type="email"]', { state: 'visible' });
  63  |     
  64  |     await page.getByPlaceholder('John Doe').fill('Test Customer');
  65  |     await page.locator('input[type="email"]').fill(customerEmail);
  66  |     await page.locator('input[type="password"]').fill('Password123!');
  67  |     
  68  |     await page.getByRole('button', { name: /Create Account/i }).click();
  69  |     await page.waitForURL(url => !url.href.includes('/register'), { timeout: 10000 }).catch(() => {});
  70  |     await page.waitForTimeout(1000);
  71  |     
  72  |     const isRateLimited = await page.locator('text=/Too many/i').count() > 0;
  73  |     if (isRateLimited) {
  74  |       console.log('Rate limited. Skipping Customer Registration.');
  75  |       test.skip();
  76  |     }
  77  |     
  78  |     // Check if redirected to account or home
  79  |     expect(page.url()).not.toContain('/register');
  80  |     console.log('Customer registered and redirected to:', page.url());
  81  |   });
  82  | 
  83  |   test('3. Shopping Journey (Customer)', async () => {
  84  |     // Assuming session is maintained since we're in the same browser context
  85  |     await page.goto(`${PROD_URL}/shop`);
  86  |     await page.waitForSelector('button:has-text("Add")', { state: 'visible' }).catch(() => {});
  87  |     
  88  |     // Add to cart (Quick Add)
  89  |     const quickAddBtn = page.locator('button:has-text("Add")').first();
  90  |     if (await quickAddBtn.count() > 0) {
  91  |       await quickAddBtn.click();
  92  |       await page.waitForTimeout(2000); // Wait for toast/API
  93  |     }
  94  |     
  95  |     // Go to cart
  96  |     await page.goto(`${PROD_URL}/cart`);
  97  |     await page.waitForSelector('ul li', { state: 'visible' }).catch(() => {});
  98  |     
  99  |     // Check if item is in cart
  100 |     const cartItems = page.locator('ul li');
  101 |     expect(await cartItems.count()).toBeGreaterThanOrEqual(0);
  102 |     
  103 |     // Try checkout
  104 |     const checkoutBtn = page.locator('button:has-text("Checkout")');
  105 |     if (await checkoutBtn.count() > 0 && await checkoutBtn.isEnabled()) {
  106 |       await checkoutBtn.click();
  107 |       await page.waitForURL(url => url.href.includes('/checkout'), { timeout: 10000 }).catch(() => {});
  108 |       expect(page.url()).toContain('/checkout');
  109 |       
  110 |       // Fill shipping
  111 |       await page.getByLabel(/Address/i).fill('123 Test St').catch(() => {});
  112 |       await page.getByLabel(/City/i).fill('Test City').catch(() => {});
  113 |       await page.getByLabel(/Postal/i).fill('12345').catch(() => {});
  114 |       
  115 |       await page.getByRole('button', { name: /Continue/i }).or(page.locator('button[type="submit"]')).click().catch(() => {});
  116 |       await page.waitForTimeout(3000);
  117 |       console.log('Checkout URL after submit:', page.url());
  118 |     }
  119 |   });
  120 | 
  121 |   test('7. Logout Journey (Customer)', async () => {
  122 |     await page.goto(`${PROD_URL}/account`).catch(() => {});
  123 |     const logoutBtn = page.locator('button:has-text("Logout")');
  124 |     if (await logoutBtn.count() > 0) {
  125 |       await logoutBtn.first().click();
  126 |       await page.waitForTimeout(2000);
  127 |       expect(page.url()).toContain('/');
  128 |     }
  129 |   });
  130 | 
  131 |   test('4. Register Journey (Vendor)', async () => {
  132 |     await page.goto(`${PROD_URL}/register`);
  133 |     await page.waitForSelector('input[type="email"]', { state: 'visible' });
  134 |     
  135 |     // Select vendor role (might need to click label instead of hidden radio)
  136 |     await page.locator('label').filter({ hasText: 'Vendor' }).click();
  137 |     await page.waitForTimeout(500);
  138 |     
  139 |     await page.getByPlaceholder('John Doe').fill('Test Vendor');
  140 |     await page.locator('input[type="email"]').fill(vendorEmail);
  141 |     await page.locator('input[type="password"]').fill('Password123!');
  142 |     
  143 |     // Vendor specific fields
  144 |     await page.locator('input[placeholder="My Awesome Store"]').fill('Apex Vendor Shop').catch(() => {});
  145 |     await page.locator('textarea[placeholder*="Tell us about"]').fill('Selling sports gear').catch(() => {});
  146 |     
  147 |     await page.getByRole('button', { name: /Create Account/i }).click();
  148 |     await page.waitForURL(url => !url.href.includes('/register'), { timeout: 10000 }).catch(() => {});
  149 |     await page.waitForTimeout(1000);
  150 |     
  151 |     const isRateLimited = await page.locator('text=/Too many/i').count() > 0;
  152 |     if (isRateLimited) {
  153 |       console.log('Rate limited. Skipping Vendor Registration.');
  154 |       test.skip();
  155 |     }
  156 |     
  157 |     expect(page.url()).not.toContain('/register');
```