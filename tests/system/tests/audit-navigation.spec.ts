import { test, expect } from '@playwright/test';

const PROD_URL = 'https://apexathletics-website.vercel.app';
const results: any[] = [];

function logResult(pageName: string, element: string, expected: string, actual: string, status: string) {
  results.push({ page: pageName, element, expected, actual, status });
  console.log(`[${status}] ${pageName} - ${element}: ${actual}`);
}

test.describe('Navigation Audit', () => {
  test('Navbar Links', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForSelector('nav .animate-pulse', { state: 'hidden' });
    await page.waitForTimeout(500);
    const linksData = await page.locator('nav a').evaluateAll((links) => 
      links.map(link => ({ href: link.getAttribute('href'), text: (link.textContent || '').trim() || link.getAttribute('href') }))
    );
    for (const { href, text } of linksData) {
      if (href && href !== '#') {
        const response = await page.request.get(PROD_URL + (href.startsWith('/') ? href : '/' + href));
        if (response.ok()) {
          logResult('Navbar', `Link: ${text}`, 'Navigates correctly', 'OK', '✅ Passed');
        } else {
          logResult('Navbar', `Link: ${text}`, 'Navigates correctly', `Failed with status ${response.status()}`, '🔴 Critical');
        }
      }
    }
  });

  test('Footer Links', async ({ page }) => {
    await page.goto(PROD_URL);
    await page.waitForSelector('nav .animate-pulse', { state: 'hidden' });
    await page.waitForTimeout(500);
    const linksData = await page.locator('footer a').evaluateAll((links) => 
      links.map(link => ({ href: link.getAttribute('href'), text: (link.textContent || '').trim() || link.getAttribute('href') }))
    );
    for (const { href, text } of linksData) {
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
  });

  test('Product Cards', async ({ page }) => {
    await page.goto(PROD_URL + '/shop');
    await page.waitForLoadState('networkidle');
    const products = await page.locator('a[href^="/product/"]').elementHandles();
    if (products.length > 0) {
      const firstHref = await products[0].getAttribute('href') || '';
      await products[0].click();
      await page.waitForLoadState('networkidle');
      if (firstHref && page.url().includes(firstHref)) {
        logResult('Shop', 'Product Card Click', 'Navigates to detail page', 'Success', '✅ Passed');
      } else {
        logResult('Shop', 'Product Card Click', 'Navigates to detail page', 'Did not navigate', '🔴 Critical');
      }
    }
  });
  
  test('Auth Navigation', async ({ page }) => {
    await page.goto(PROD_URL + '/login');
    const registerLink = page.locator('a[href="/register"]');
    if (await registerLink.count() > 0) {
       await registerLink.first().click();
       await page.waitForLoadState('networkidle');
       if (page.url().includes('/register')) {
         logResult('Login', 'Register Link', 'Navigates to register', 'Success', '✅ Passed');
       }
    }
  });

});
