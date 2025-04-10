import { render, screen } from "@testing-library/react";
import ForgotPassword from "../../pages/ForgotPassword/ForgotPassword";
import "@testing-library/jest-dom";

jest.mock("../../components/PageHeader", () =>
  jest.fn(() => <div data-testid="page-header" />)
);
jest.mock("../../components/ForgotPassword/ForgotPasswordSection", () =>
  jest.fn(() => <div data-testid="forgot-password-section" />)
);

describe("ForgotPassword Page", () => {
  it("renders the PageHeader component", () => {
    render(<ForgotPassword />);

    // Assert that the PageHeader is rendered
    expect(screen.getByTestId("page-header")).toBeVisible();
  });

  it("renders the ForgotPasswordSection component", () => {
    render(<ForgotPassword />);

    // Assert that the ForgotPasswordSection is rendered
    expect(screen.getByTestId("forgot-password-section")).toBeVisible();
  });
});
