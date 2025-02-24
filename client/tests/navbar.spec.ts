
import { URL } from './setup';

import { Page, expect, test } from '@playwright/test';
const navItems = [
  { name: "logo-nav", path: "" },
  { name: "home-nav", path: "" },
  { name: "shop-nav", path: "/shop" },
  { name: "adopt-nav", path: "/adopt" },
  { name: "contact-nav", path: "/contact" },
  { name: "register-nav", path: "/register" },
  { name: "login-nav", path: "/login" },
];
let page: Page;
test.beforeAll(async ({browser}) => {
  const context = await browser.newContext();
  page = await context.newPage();
  await page.goto(URL);
});

test('has title', async () => {
  await expect(page).toHaveTitle('Pawtopia'); // Expect a title "to contain" a substring.
});

test.describe('Testing Navbar', () => {
  navItems.forEach(({ name, path }) => {
    test(`${name} exists and navigates correctly`, async () => {
      const testElement = page.getByTestId(name);
      await expect(testElement).toBeVisible();

      await Promise.all([
        testElement.click(),
        page.waitForURL(URL + path) 
      ]);
      // Verify the URL is correct
      await expect(page).toHaveURL(URL + path);
    });
  });
});


test.afterAll(async () => {
  await page.close();  // Close the page after all tests
});

