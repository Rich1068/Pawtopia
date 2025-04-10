import { render, screen } from "@testing-library/react";
import ResetPassword from "../../pages/ForgotPassword/ResetPassword";
import "@testing-library/jest-dom";

jest.mock("../../components/PageHeader", () =>
  jest.fn(() => <div data-testid="page-header" />)
);
jest.mock("../../components/ForgotPassword/ResetPasswordSection", () =>
  jest.fn(() => <div data-testid="reset-password-section" />)
);

describe("ResetPassword Page", () => {
  it("renders the PageHeader component", () => {
    render(<ResetPassword />);

    // Assert that the PageHeader is rendered
    expect(screen.getByTestId("page-header")).toBeVisible();
  });

  it("renders the ResetPasswordSection component", () => {
    render(<ResetPassword />);

    // Assert that the ResetPasswordSection is rendered
    expect(screen.getByTestId("reset-password-section")).toBeVisible();
  });
});
