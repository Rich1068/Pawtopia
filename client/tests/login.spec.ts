import {test, Page, expect} from "@playwright/test";
import { URL } from "./setup";
const errorCases = [
  { email: '', password: '', expectedError: 'All fields are required' },
  { email: 'invalid-email', password: 'password123', expectedError: 'Invalid email format' },
  { email: 'doesnotexist@gmail.com', password: 'password123', expectedError: 'Account does not exist' },
  { email: 'user@gmail.com', password: 'wrongpassword', expectedError: 'Incorrect Password' },
];
let page: Page;

//Login function for modular usage
const login = async (page: Page, email: string, password: string) => {
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
};


test.beforeAll(async ({browser}) => {
  const context = await browser.newContext();
  page = await context.newPage();
  await page.goto(URL + '/login');
});
test.describe('Testing Login', () => {
  test.describe('Login error test', async () => {
    errorCases.map(({ email, password, expectedError }) => {
      test(`Shows error: ${expectedError}`, async () => {
        await login(page, email, password);
        await expect(page.getByText(expectedError)).toBeVisible();
      });
    })
  });
  test('Login works', async () => {
    await login(page, 'user@gmail.com', '12');
    await expect(page).toHaveURL(URL + '/user-dashboard');
  })
});
