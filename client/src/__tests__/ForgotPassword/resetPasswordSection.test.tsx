import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import ResetPasswordSection from "../../components/ForgotPassword/ResetPasswordSection";
import { useResetPassword } from "../../hooks/useResetPassword";
import "@testing-library/jest-dom";
import toast from "react-hot-toast";

// Mock toast
jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
}));

// Mock hook
jest.mock("../../hooks/useResetPassword");

const mockNavigate = jest.fn();

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useParams: () => ({ token: "mock-token" }),
  useNavigate: () => mockNavigate,
}));

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <ResetPasswordSection />
    </MemoryRouter>
  );
};

describe("ResetPasswordSection", () => {
  const mockValidate = jest.fn();
  const mockSetPassword = jest.fn();
  const mockSetConfirmPassword = jest.fn();

  beforeEach(() => {
    (useResetPassword as jest.Mock).mockReturnValue({
      password: "test123",
      setPassword: mockSetPassword,
      confirmPassword: "test123",
      setConfirmPassword: mockSetConfirmPassword,
      isVerifying: false,
      isValidToken: true,
      isLoading: false,
      validatePasswordAndReset: mockValidate,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders password fields and submit button", () => {
    render(
      <MemoryRouter initialEntries={["/reset-password/mock-token"]}>
        <Routes>
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordSection />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getAllByText(/reset password/i)[0]).toBeVisible();
    expect(screen.getByTestId("password-input")).toBeVisible();
    expect(screen.getByTestId("confirm-password")).toBeVisible();
    expect(
      screen.getByRole("button", { name: /reset password/i })
    ).toBeVisible();
  });

  it("calls setPassword and setConfirmPassword on input change", () => {
    renderComponent();

    fireEvent.change(screen.getByTestId("password-input"), {
      target: { value: "newPass" },
    });
    fireEvent.change(screen.getByTestId("confirm-password"), {
      target: { value: "newPass" },
    });

    expect(mockSetPassword).toHaveBeenCalledWith("newPass");
    expect(mockSetConfirmPassword).toHaveBeenCalledWith("newPass");
  });

  it("submits form and calls validatePasswordAndReset", () => {
    renderComponent();

    fireEvent.submit(screen.getByRole("button").closest("form")!);

    expect(mockValidate).toHaveBeenCalled();
  });

  it("shows 'Resetting...' when isLoading is true", () => {
    (useResetPassword as jest.Mock).mockReturnValue({
      password: "test123",
      setPassword: mockSetPassword,
      confirmPassword: "test123",
      setConfirmPassword: mockSetConfirmPassword,
      isVerifying: false,
      isValidToken: true,
      isLoading: true,
      validatePasswordAndReset: mockValidate,
    });

    renderComponent();

    expect(screen.getByText(/resetting/i)).toBeVisible();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("displays verifying message when isVerifying is true", () => {
    (useResetPassword as jest.Mock).mockReturnValue({
      isVerifying: true,
    });

    renderComponent();

    expect(screen.getByText(/verifying token/i)).toBeVisible();
  });

  it("navigates to /forgot-password if token is invalid", () => {
    (useResetPassword as jest.Mock).mockReturnValue({
      isVerifying: false,
      isValidToken: false,
    });

    renderComponent();

    expect(toast.error).toHaveBeenCalledWith("Invalid or expired token");
    expect(mockNavigate).toHaveBeenCalledWith("/forgot-password");
  });
});
