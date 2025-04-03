import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { useSearchParams, useNavigate } from "react-router";
import serverAPI from "../../helper/axios";
import VerifyEmail from "../../pages/VerifyEmail";
import "@testing-library/jest-dom";

// Mock dependencies
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useSearchParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock("../../helper/axios");

describe("VerifyEmail Component", () => {
  const mockNavigate = jest.fn();
  let mockSearchParams: URLSearchParams;

  const setup = (params = {}) => {
    mockSearchParams = new URLSearchParams(params);
    (useSearchParams as jest.Mock).mockReturnValue([mockSearchParams]);
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    return render(<VerifyEmail />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    (serverAPI.get as jest.Mock).mockResolvedValue({
      data: { message: "Email verified!" },
    });
    (serverAPI.post as jest.Mock).mockResolvedValue({
      data: { message: "Email resent!" },
    });
  });

  test("shows verification message by default", () => {
    setup();
    expect(screen.getByText("Please verify your email.")).toBeInTheDocument();
    expect(screen.getByText("Resend Email")).toBeInTheDocument();
  });

  test("verifies email when token exists", async () => {
    setup({ token: "test123" });

    await waitFor(() => {
      expect(serverAPI.get).toHaveBeenCalledWith(
        "/api/verify-email?token=test123"
      );
      expect(screen.getByText("Email verified!")).toBeInTheDocument();
    });
  });

  test("shows error when verification fails", async () => {
    (serverAPI.get as jest.Mock).mockRejectedValue({
      response: { data: { error: "Invalid token" } },
    });

    setup({ token: "bad-token" });

    await waitFor(() => {
      expect(screen.getByText("Invalid token")).toBeInTheDocument();
    });
  });

  test("resends verification email", async () => {
    localStorage.setItem("unverifiedEmail", "user@test.com");
    setup(); // No token

    fireEvent.click(screen.getByText("Resend Email"));

    await waitFor(() => {
      expect(serverAPI.post).toHaveBeenCalledWith("/api/resend-verification", {
        email: "user@test.com",
      });
    });
  });

  test("shows error when resend fails", async () => {
    localStorage.setItem("unverifiedEmail", "user@test.com");
    (serverAPI.post as jest.Mock).mockRejectedValue({
      response: { data: { error: "Resend failed" } },
    });

    setup();
    fireEvent.click(screen.getByText("Resend Email"));

    await waitFor(() => {
      expect(screen.getByText("Resend failed")).toBeInTheDocument();
    });
  });

  test("goes to login after verification", async () => {
    setup({ token: "test123" });

    await waitFor(() => {
      fireEvent.click(screen.getByText("Go to Login"));
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
