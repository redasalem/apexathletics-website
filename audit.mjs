import { chromium } from 'playwright';
import fs from 'fs';

const PROD_URL = 'https://apexathletics-website.vercel.app';
const results = [];

function logResult(page, element, expected, actual, status) {
  results.push({ page, element, expected, actual, status });
  console.log(`[${status}] ${page} - ${element}: ${actual}`);
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Navbar
    console.log('Testing Navbar...');
    await page.goto(PROD_URL);
    const navLinks = await page.locator('nav a').elementHandles();
    for (const link of navLinks) {
      const href = await link.getAttribute('href');
      const text = (await link.innerText()).trim() || href;
      if (href && href !== '#') {
        const response = await page.request.get(PROD_URL + (href.startsWith('/') ? href : '/' + href));
        if (response.ok()) {
          logResult('Navbar', `Link: ${text}`, 'Navigates correctly', 'OK', '✅ Passed');
        } else {
          logResult('Navbar', `Link: ${text}`, 'Navigates correctly', `Failed with status ${response.status()}`, '🔴 Critical');
        }
      }
    }

    // 2. Footer
    console.log('Testing Footer...');
    await page.goto(PROD_URL);
    const footerLinks = await page.locator('footer a').elementHandles();
    for (const link of footerLinks) {
      const href = await link.getAttribute('href');
      const text = (await link.innerText()).trim() || href;
      if (href === '#' || href === '') {
         logResult('Footer', `Link: ${text}`, 'Valid link', 'Dead link (href="#")', '🟡 Medium');
      } else if (href) {
        const response = await page.request.get(href.startsWith('http') ? href : PROD_URL + href);
        if (response.ok()) {
          logResult('Footer', `Link: ${text}`, 'Navigates correctly', 'OK', '✅ Passed');
        } else {
          logResult('Footer', `Link: ${text}`, 'Navigates correctly', `Failed with ${response.status()}`, '🔴 Critical');
        }
      }
    }

    // 3. Product Cards
    console.log('Testing Products...');
    await page.goto(PROD_URL + '/shop');
    await page.waitForLoadState('networkidle');
    const products = await page.locator('a[href^="/product/"]').elementHandles();
    if (products.length > 0) {
      const firstHref = await products[0].getAttribute('href');
      await products[0].click();
      await page.waitForLoadState('networkidle');
      if (page.url().includes(firstHref)) {
        logResult('Shop', 'Product Card Click', 'Navigates to detail page', 'Success', '✅ Passed');
      } else {
        logResult('Shop', 'Product Card Click', 'Navigates to detail page', 'Did not navigate', '🔴 Critical');
      }
    }

    // 4. Auth Navigation
    console.log('Testing Auth...');
    await page.goto(PROD_URL + '/login');
    const registerLink = page.locator('a[href="/register"]');
    if (await registerLink.count() > 0) {
       await registerLink.first().click();
       await page.waitForLoadState('networkidle');
       if (page.url().includes('/register')) {
         logResult('Login', 'Register Link', 'Navigates to register', 'Success', '✅ Passed');
       }
    }

  } catch(e) {
    console.error(e);
  } finally {
    fs.writeFileSync('audit_results.json', JSON.stringify(results, null, 2));
    await browser.close();
  }
})();
