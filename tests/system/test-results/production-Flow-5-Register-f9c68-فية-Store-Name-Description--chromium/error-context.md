# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: production.spec.ts >> Flow 5: Register Flow (Full E2E) >> Register: vendor role يظهر حقول إضافية (Store Name & Description)
- Location: tests\production.spec.ts:254:7

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('label').filter({ hasText: 'Vendor' })

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
    - generic [ref=e37]:
      - generic [ref=e38]:
        - heading "Welcome Back" [level=2] [ref=e39]
        - paragraph [ref=e40]:
          - text: New to Impeccable?
          - link "Create your free account" [ref=e41] [cursor=pointer]:
            - /url: /register
      - generic [ref=e44]:
        - generic [ref=e45]:
          - generic [ref=e46]: Email address
          - textbox "you@example.com" [ref=e47]
        - generic [ref=e48]:
          - generic [ref=e49]: Password
          - generic [ref=e50]:
            - textbox "••••••••" [ref=e51]
            - button [ref=e52] [cursor=pointer]:
              - img [ref=e53]
        - link "Forgot your password?" [ref=e58] [cursor=pointer]:
          - /url: /forgot-password
        - button "Sign In" [ref=e59] [cursor=pointer]:
          - text: Sign In
          - img [ref=e60]
  - contentinfo [ref=e62]:
    - generic [ref=e63]:
      - generic [ref=e64]:
        - generic [ref=e65]:
          - link "IMPECCABLE" [ref=e66] [cursor=pointer]:
            - /url: /
            - img [ref=e68]
            - generic [ref=e71]: IMPECCABLE
          - paragraph [ref=e72]: Premium multi-vendor sports marketplace. Connecting athletes with the best performance gear from independent vendors.
        - generic [ref=e73]:
          - heading "Shop" [level=3] [ref=e74]
          - list [ref=e75]:
            - listitem [ref=e76]:
              - link "All Products" [ref=e77] [cursor=pointer]:
                - /url: /shop
            - listitem [ref=e78]:
              - link "Athletic Shoes" [ref=e79] [cursor=pointer]:
                - /url: /shop?category=Athletic+Shoes
            - listitem [ref=e80]:
              - link "Sportswear" [ref=e81] [cursor=pointer]:
                - /url: /shop?category=Sportswear
            - listitem [ref=e82]:
              - link "Sports Equipment" [ref=e83] [cursor=pointer]:
                - /url: /shop?category=Sports+Equipment
        - generic [ref=e84]:
          - heading "Account" [level=3] [ref=e85]
          - list [ref=e86]:
            - listitem [ref=e87]:
              - link "Sign In" [ref=e88] [cursor=pointer]:
                - /url: /login
            - listitem [ref=e89]:
              - link "Create Account" [ref=e90] [cursor=pointer]:
                - /url: /register
            - listitem [ref=e91]:
              - link "My Orders" [ref=e92] [cursor=pointer]:
                - /url: /account/orders
            - listitem [ref=e93]:
              - link "Shopping Cart" [ref=e94] [cursor=pointer]:
                - /url: /cart
        - generic [ref=e95]:
          - heading "Information" [level=3] [ref=e96]
          - list [ref=e97]:
            - listitem [ref=e98]:
              - link "Privacy Policy" [ref=e99] [cursor=pointer]:
                - /url: /privacy
            - listitem [ref=e100]:
              - link "Terms of Service" [ref=e101] [cursor=pointer]:
                - /url: /terms
            - listitem [ref=e102]:
              - link "Shipping Policy" [ref=e103] [cursor=pointer]:
                - /url: /shipping
            - listitem [ref=e104]:
              - link "Contact Us" [ref=e105] [cursor=pointer]:
                - /url: /contact
      - generic [ref=e106]:
        - paragraph [ref=e107]: © 2026 Impeccable Athletics. All rights reserved.
        - generic [ref=e109]: Secure Payments via Stripe
  - alert [ref=e110]
```

# Test source

```ts
  159 | // ═════════════════════════════════════════════════════════════════════════════
  160 | //  NEW TESTS — User Flows & Navigation
  161 | // ═════════════════════════════════════════════════════════════════════════════
  162 | 
  163 | test.describe('Flow 5: Register Flow (Full E2E)', () => {
  164 | 
  165 |   test('صفحة /register بتتحمل صح والفورم موجود بالكامل', async ({ page }) => {
  166 |     await page.goto(`${FRONTEND_URL}/register`);
  167 |     await page.waitForLoadState('networkidle');
  168 |     await snap(page, '05-register-page-loaded');
  169 | 
  170 |     // Page heading
  171 |     await expect(page.locator('h2')).toContainText(/Join/i);
  172 | 
  173 |     // Account type radios
  174 |     const customerRadio = page.locator('input[type="radio"][value="customer"]');
  175 |     const vendorRadio   = page.locator('input[type="radio"][value="vendor"]');
  176 |     await expect(customerRadio).toBeAttached();
  177 |     await expect(vendorRadio).toBeAttached();
  178 | 
  179 |     // Core fields
  180 |     await expect(page.locator('input[type="text"]').first()).toBeVisible();   // Name
  181 |     await expect(page.locator('input[type="email"]')).toBeVisible();          // Email
  182 |     await expect(page.locator('input[type="password"]')).toBeVisible();       // Password
  183 | 
  184 |     // Submit button
  185 |     const submitBtn = page.locator('button[type="submit"]');
  186 |     await expect(submitBtn).toBeVisible();
  187 |     await expect(submitBtn).toContainText(/Create Account/i);
  188 |   });
  189 | 
  190 |   test('Register بـ بيانات صحيحة → loading state يظهر → redirect يحصل', async ({ page }) => {
  191 |     await page.goto(`${FRONTEND_URL}/register`);
  192 |     await page.waitForLoadState('networkidle');
  193 | 
  194 |     const email = uniqueEmail();
  195 | 
  196 |     // Fill the form
  197 |     await page.locator('input[type="text"]').first().fill('Test User E2E');
  198 |     await page.locator('input[type="email"]').fill(email);
  199 |     await page.locator('input[type="password"]').fill('TestPass1!strongE2E');
  200 | 
  201 |     await snap(page, '05-register-form-filled');
  202 | 
  203 |     // Click submit
  204 |     const submitBtn = page.locator('button[type="submit"]');
  205 |     await submitBtn.click();
  206 | 
  207 |     // ✅ Check: loading state — the Loader2 spinner should appear (animate-spin svg)
  208 |     const spinnerOrLoading = page.locator('button[type="submit"] svg.animate-spin, button[type="submit"]:has-text("Loading")');
  209 |     const loadingAppeared = await spinnerOrLoading.count() > 0;
  210 |     if (loadingAppeared) {
  211 |       console.log('✅ Loading state detected during registration submit.');
  212 |     } else {
  213 |       console.log('⚠️ BUG: No visible loading indicator after clicking submit.');
  214 |     }
  215 | 
  216 |     await snap(page, '05-register-submit-loading');
  217 | 
  218 |     // Wait for the network to settle (API response returns)
  219 |     await page.waitForLoadState('networkidle');
  220 |     await page.waitForTimeout(3000); // extra buffer for client-side redirect
  221 | 
  222 |     await snap(page, '05-register-after-submit');
  223 | 
  224 |     const finalUrl = page.url();
  225 | 
  226 |     // ✅ Check: redirect happened
  227 |     const redirected = !finalUrl.includes('/register');
  228 |     if (redirected) {
  229 |       console.log(`✅ Redirect successful. Final URL: ${finalUrl}`);
  230 |       // Should go to /account (customer) or /vendor-dashboard (vendor)
  231 |       const validDestination =
  232 |         finalUrl.includes('/account') ||
  233 |         finalUrl.includes('/vendor-dashboard') ||
  234 |         finalUrl.includes('/');
  235 |       expect(validDestination).toBeTruthy();
  236 |     } else {
  237 |       // ❌ Still on /register — check for error toast / message
  238 |       console.log('❌ POTENTIAL BUG: Still on /register after submit.');
  239 |       const toastOrError = page.locator('[role="status"]').or(page.locator('[data-sonner-toast]')).or(page.locator('.Toastify')).or(page.getByText(/error|failed|already/i)).first();
  240 |       if (await toastOrError.count() > 0) {
  241 |         const text = await toastOrError.textContent();
  242 |         console.log(`   Error/toast displayed: "${text}"`);
  243 |       } else {
  244 |         console.log('   ❌ BUG: No redirect AND no error message. User is stuck.');
  245 |         // This documents the bug: user stays on the same page with no feedback
  246 |         test.info().annotations.push({
  247 |           type: 'bug',
  248 |           description: 'Register: user stays on /register after submit with no redirect or error message',
  249 |         });
  250 |       }
  251 |     }
  252 |   });
  253 | 
  254 |   test('Register: vendor role يظهر حقول إضافية (Store Name & Description)', async ({ page }) => {
  255 |     await page.goto(`${FRONTEND_URL}/register`);
  256 |     await page.waitForLoadState('networkidle');
  257 | 
  258 |     // Select vendor role — the radio input is sr-only (hidden), so click the visible label
> 259 |     await page.locator('label').filter({ hasText: 'Vendor' }).click();
      |                                                               ^ Error: locator.click: Test timeout of 60000ms exceeded.
  260 |     await page.waitForTimeout(500);
  261 | 
  262 |     await snap(page, '05-register-vendor-fields');
  263 | 
  264 |     // Vendor-specific fields should now be visible
  265 |     const storeNameInput = page.locator('input[placeholder="My Awesome Store"]');
  266 |     const storeDescTextarea = page.locator('textarea[placeholder*="Tell us about"]');
  267 | 
  268 |     await expect(storeNameInput).toBeVisible();
  269 |     await expect(storeDescTextarea).toBeVisible();
  270 |   });
  271 | 
  272 |   test('Register: validation errors تظهر لما الفورم فاضي', async ({ page }) => {
  273 |     await page.goto(`${FRONTEND_URL}/register`);
  274 |     await page.waitForLoadState('networkidle');
  275 | 
  276 |     // Submit empty form
  277 |     await page.locator('button[type="submit"]').click();
  278 |     await page.waitForTimeout(1000);
  279 | 
  280 |     await snap(page, '05-register-validation-errors');
  281 | 
  282 |     // Expect at least one validation error message (red text)
  283 |     const errorMessages = page.locator('p.text-red-500, .text-red-500');
  284 |     const errCount = await errorMessages.count();
  285 |     expect(errCount).toBeGreaterThan(0);
  286 |     console.log(`✅ ${errCount} validation error(s) displayed on empty submit.`);
  287 |   });
  288 | });
  289 | 
  290 | 
  291 | // ═════════════════════════════════════════════════════════════════════════════
  292 | test.describe('Flow 6: Login Flow (Full E2E)', () => {
  293 | 
  294 |   test('صفحة /login بتتحمل صح والفورم موجود', async ({ page }) => {
  295 |     await page.goto(`${FRONTEND_URL}/login`);
  296 |     await page.waitForLoadState('networkidle');
  297 |     await snap(page, '06-login-page-loaded');
  298 | 
  299 |     await expect(page.locator('h2')).toContainText(/Welcome/i);
  300 |     await expect(page.locator('input[type="email"]')).toBeVisible();
  301 |     await expect(page.locator('input[type="password"]')).toBeVisible();
  302 | 
  303 |     const submitBtn = page.locator('button[type="submit"]');
  304 |     await expect(submitBtn).toBeVisible();
  305 |     await expect(submitBtn).toContainText(/Sign In/i);
  306 |   });
  307 | 
  308 |   test('Login بـ بيانات غلط → error message يظهر', async ({ page }) => {
  309 |     await page.goto(`${FRONTEND_URL}/login`);
  310 |     await page.waitForLoadState('networkidle');
  311 | 
  312 |     await page.locator('input[type="email"]').fill('nonexistent_user@wrong.com');
  313 |     await page.locator('input[type="password"]').fill('WrongPassword123!');
  314 | 
  315 |     await snap(page, '06-login-wrong-creds-filled');
  316 | 
  317 |     const submitBtn = page.locator('button[type="submit"]');
  318 |     await submitBtn.click();
  319 | 
  320 |     // Check loading state
  321 |     const spinnerOrLoading = page.locator('button[type="submit"] svg.animate-spin');
  322 |     const loadingAppeared = await spinnerOrLoading.count() > 0;
  323 |     if (loadingAppeared) {
  324 |       console.log('✅ Loading state detected during login submit.');
  325 |     }
  326 | 
  327 |     await snap(page, '06-login-wrong-creds-submitting');
  328 | 
  329 |     // Wait for the response
  330 |     await page.waitForLoadState('networkidle');
  331 |     await page.waitForTimeout(2000);
  332 | 
  333 |     await snap(page, '06-login-wrong-creds-result');
  334 | 
  335 |     // ✅ Check: Should still be on /login (not redirected)
  336 |     expect(page.url()).toContain('/login');
  337 | 
  338 |     // ✅ Check: error message should appear (toast or inline)
  339 |     const errorIndicator = page.locator('[role="status"]').or(page.getByText(/invalid|error|credentials|incorrect|failed|not found/i)).first();
  340 | 
  341 |     if (await errorIndicator.count() > 0) {
  342 |       const text = await errorIndicator.textContent();
  343 |       console.log(`✅ Error message displayed: "${text}"`);
  344 |     } else {
  345 |       console.log('⚠️ UX ISSUE: No visible error message after invalid login.');
  346 |       test.info().annotations.push({
  347 |         type: 'ux-issue',
  348 |         description: 'Login: no visible error feedback after submitting invalid credentials',
  349 |       });
  350 |     }
  351 |   });
  352 | 
  353 |   test('Login: loading state يظهر أثناء الـ submit', async ({ page }) => {
  354 |     await page.goto(`${FRONTEND_URL}/login`);
  355 |     await page.waitForLoadState('networkidle');
  356 | 
  357 |     await page.locator('input[type="email"]').fill('loadingtest@example.com');
  358 |     await page.locator('input[type="password"]').fill('SomePassword1!');
  359 | 
```