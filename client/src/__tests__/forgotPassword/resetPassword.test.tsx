import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import ResetPasswordSection from "../../components/ForgotPassword/ResetPasswordSection";
import serverAPI from "../../helper/axios";
import toast from "react-hot-toast";
import "@testing-library/jest-dom";

jest.mock("../../helper/axios");
jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

const renderWithRouter = (initialRoute: string) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route
          path="/reset-password/:token"
          element={<ResetPasswordSection />}
        />
        <Route
          path="/forgot-password"
          element={<div>Forgot Password Page</div>}
        />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe("ResetPasswordSection Component", () => {
  const mockToken = "valid-reset-token";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper function to fill inputs
  const fillInputs = async (inputs: { testId: string; value: string }[]) => {
    for (const { testId, value } of inputs) {
      fireEvent.change(await screen.findByTestId(testId), {
        target: { value },
      });
    }
  };

  it("validates reset token on mount", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValueOnce({});
    renderWithRouter(`/reset-password/${mockToken}`);

    await waitFor(() =>
      expect(serverAPI.get).toHaveBeenCalledWith(
        `/api/reset-password/${mockToken}`
      )
    );
  });

  it("redirects to forgot password page if token is invalid", async () => {
    (serverAPI.get as jest.Mock).mockRejectedValueOnce({
      response: { data: { error: "Invalid or expired token" } },
    });

    renderWithRouter(`/reset-password/${mockToken}`);

    await waitFor(() => {
      expect(screen.getByText("Forgot Password Page")).toBeVisible();
      expect(toast.error).toHaveBeenCalledWith("Invalid or expired token");
    });
  });

  it("renders form fields correctly", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValueOnce({});
    renderWithRouter(`/reset-password/${mockToken}`);

    const elements = await Promise.all([
      screen.findByTestId("password-input"),
      screen.findByTestId("confirm-password"),
      screen.findByRole("button", { name: /reset password/i }),
    ]);

    elements.forEach((el) => expect(el).toBeVisible());
  });

  it("validates mismatched passwords", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValueOnce({});
    renderWithRouter(`/reset-password/${mockToken}`);

    await fillInputs([
      { testId: "password-input", value: "password123" },
      { testId: "confirm-password", value: "password456" },
    ]);

    fireEvent.click(
      await screen.findByRole("button", { name: /reset password/i })
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Passwords do not match");
    });
  });

  it("submits form successfully and redirects to login", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValueOnce({});
    (serverAPI.post as jest.Mock).mockResolvedValueOnce({});

    renderWithRouter(`/reset-password/${mockToken}`);

    await fillInputs([
      { testId: "password-input", value: "securepassword" },
      { testId: "confirm-password", value: "securepassword" },
    ]);

    fireEvent.click(
      await screen.findByRole("button", { name: /reset password/i })
    );

    await waitFor(() => {
      expect(serverAPI.post).toHaveBeenCalledWith(
        `/api/reset-password/${mockToken}`,
        {
          password: "securepassword",
        }
      );
      expect(toast.success).toHaveBeenCalledWith(
        "Password reset successful! Please log in."
      );
      expect(screen.getByText("Login Page")).toBeVisible();
    });
  });

  it("handles API failure during password reset", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValueOnce({});
    (serverAPI.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { error: "Server error" } },
    });

    renderWithRouter(`/reset-password/${mockToken}`);

    await fillInputs([
      { testId: "password-input", value: "securepassword" },
      { testId: "confirm-password", value: "securepassword" },
    ]);

    fireEvent.click(
      await screen.findByRole("button", { name: /reset password/i })
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Server error");
    });
  });
});
