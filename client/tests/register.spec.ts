import { test, Page, expect } from "@playwright/test";
import { URL } from "./setup";
const errorCases = [
  {
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    expectedError: "All fields are required",
  },
  {
    name: "Test User",
    email: "invalid-email",
    phoneNumber: "09126785743",
    password: "password123",
    confirmPassword: "password123",
    expectedError: "Invalid email format",
  },
  {
    name: "Test User",
    email: "user@gmail.com",
    phoneNumber: "09126785743",
    password: "password123",
    confirmPassword: "password123",
    expectedError: "Email already registered",
  },
  {
    name: "Test User",
    email: "user12@gmail.com",
    phoneNumber: "09126785743",
    password: "password123",
    confirmPassword: "mismatchpassword",
    expectedError: "Passwords do not Match",
  },
  {
    name: "Test User",
    email: "user12@gmail.com",
    phoneNumber: "09126785743asdfsad",
    password: "12",
    confirmPassword: "12",
    expectedError: "Invalid phone number format",
  },
];
let page: Page;

//Login function for modular usage
const register = async (
  page: Page,
  name: string,
  email: string,
  phoneNumber: string,
  password: string,
  confirmPassword: string
) => {
  await page.getByLabel("Full Name").fill(name);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Phone Number").fill(phoneNumber);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page
    .getByLabel("Confirm Password", { exact: true })
    .fill(confirmPassword);
  await page.getByRole("button", { name: "Register" }).click();
};

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  page = await context.newPage();
  await page.goto(URL + "/register");
});
test.describe("Testing Register", () => {
  test.describe("Register error test", async () => {
    errorCases.map(
      ({
        name,
        email,
        phoneNumber,
        password,
        confirmPassword,
        expectedError,
      }) => {
        test(`Shows error: ${expectedError}`, async () => {
          await register(
            page,
            name,
            email,
            phoneNumber,
            password,
            confirmPassword
          );
          await expect(page.getByText(expectedError)).toBeVisible();
        });
      }
    );
  });
  test("Register - Successful registration", async () => {
    await page.route("http://localhost:8000/register", async (route) => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          user: {
            name: "Test User",
            email: "test@gmail.com",
            phoneNumber: "09126786343",
            password: "123",
            role: "user",
          },
        }),
      });
    });

    await register(
      page,
      "Test User",
      "test@gmail.com",
      "09126786343",
      "password123",
      "password123"
    );

    await expect(page).toHaveURL(URL + "/login");
  });
});
test.afterAll(async () => {
  await page.close(); // Close the page after all tests
});
