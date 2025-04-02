import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgotPasswordSection from "../../components/ForgotPassword/ForgotPasswordSection";
import serverAPI from "../../helper/axios";
import toast from "react-hot-toast";
import "@testing-library/jest-dom";

// Mock dependencies
jest.mock("../../helper/axios");
jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

describe("ForgotPasswordSection Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<ForgotPasswordSection />);
  });

  // Helper function to fill email and submit form
  const fillEmailAndSubmit = async (email: string) => {
    fireEvent.change(await screen.findByTestId("email-input"), {
      target: { value: email },
    });
    fireEvent.click(
      await screen.findByRole("button", { name: /send reset link/i })
    );
  };

  it("renders the component correctly", async () => {
    expect(await screen.findByText(/forgot password/i)).toBeVisible();
    expect(await screen.findByTestId("email-input")).toBeVisible();
    expect(
      await screen.findByRole("button", { name: /send reset link/i })
    ).toBeVisible();
  });

  it("shows an error when email is empty", async () => {
    fireEvent.click(
      await screen.findByRole("button", { name: /send reset link/i })
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Please enter your email");
    });
  });

  it("validates incorrect email format", async () => {
    await fillEmailAndSubmit("invalid-email");

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid email format");
    });
  });

  it("submits the form with valid email and calls API", async () => {
    (serverAPI.post as jest.Mock).mockResolvedValueOnce({});

    await fillEmailAndSubmit("test@example.com");

    await waitFor(() => {
      expect(serverAPI.post).toHaveBeenCalledWith("/api/forgot-password", {
        email: "test@example.com",
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Password reset link sent to your email"
      );
    });
  });

  it("handles API error response correctly", async () => {
    (serverAPI.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { message: "Email not found" } },
    });

    await fillEmailAndSubmit("test@example.com");

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Email not found");
    });
  });
});
