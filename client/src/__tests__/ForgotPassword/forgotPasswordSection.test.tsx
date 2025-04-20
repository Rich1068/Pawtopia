import { render, screen, fireEvent } from "@testing-library/react";
import ForgotPasswordSection from "../../components/ForgotPassword/ForgotPasswordSection";
import useForgotPassword from "../../hooks/useForgotPassword";
import "@testing-library/jest-dom";

// Mock the custom hook
jest.mock("../../hooks/useForgotPassword");

describe("ForgotPasswordSection", () => {
  const mockHandleSubmit = jest.fn();
  const mockSetEmail = jest.fn();

  beforeEach(() => {
    (useForgotPassword as jest.Mock).mockReturnValue({
      email: "test@example.com",
      setEmail: mockSetEmail,
      isLoading: false,
      handleSubmit: mockHandleSubmit,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the heading, input, and button", () => {
    render(<ForgotPasswordSection />);
    expect(screen.getByText(/forgot password/i)).toBeVisible();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeVisible();
    expect(
      screen.getByRole("button", { name: /send reset link/i })
    ).toBeVisible();
  });

  it("updates email input value", () => {
    render(<ForgotPasswordSection />);
    const input = screen.getByTestId("email-input");

    fireEvent.change(input, { target: { value: "new@example.com" } });

    expect(mockSetEmail).toHaveBeenCalledWith("new@example.com");
  });

  it("calls handleSubmit on form submission", () => {
    render(<ForgotPasswordSection />);
    const form = screen.getByRole("button").closest("form");

    fireEvent.submit(form as HTMLFormElement);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it("displays loading state when isLoading is true", () => {
    (useForgotPassword as jest.Mock).mockReturnValue({
      email: "test@example.com",
      setEmail: mockSetEmail,
      isLoading: true,
      handleSubmit: mockHandleSubmit,
    });

    render(<ForgotPasswordSection />);

    expect(screen.getByText(/sending/i)).toBeVisible();
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
