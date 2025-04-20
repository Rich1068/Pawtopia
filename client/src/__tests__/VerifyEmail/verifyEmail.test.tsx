/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { useSearchParams, useNavigate } from "react-router";
import VerifyEmail from "../../pages/VerifyEmail";
import "@testing-library/jest-dom";
import { createWrapper } from "../../__mocks__/utils/testUtils";
import * as verifyHooks from "../../hooks/useVerifyEmail";

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useSearchParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock("../../hooks/useVerifyEmail");

const wrapper = createWrapper();

const renderComponent = () =>
  render(
    wrapper({
      children: <VerifyEmail />,
    })
  );

describe("VerifyEmail Component", () => {
  const mockNavigate = jest.fn();
  const mockUseVerifyEmailQuery = verifyHooks.useVerifyEmailQuery as jest.Mock;
  const mockUseResendVerificationMutation =
    verifyHooks.useResendVerificationMutation as jest.Mock;

  const setup = ({
    token = null,
    verifyProps = {},
    resendProps = {},
  }: {
    token?: string | null;
    verifyProps?: any;
    resendProps?: any;
  } = {}) => {
    const searchParams = new URLSearchParams();
    if (token) searchParams.set("token", token);
    (useSearchParams as jest.Mock).mockReturnValue([searchParams]);
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    mockUseVerifyEmailQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: false,
      ...verifyProps,
    });

    mockUseResendVerificationMutation.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
      error: null,
      ...resendProps,
    });

    return renderComponent();
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("shows default verification message and resend button when no token", () => {
    setup();
    expect(screen.getByText("Please verify your email.")).toBeVisible();
    expect(screen.getByText("Resend Email")).toBeVisible();
  });

  test("displays success message when verification is successful", () => {
    setup({
      token: "test123",
      verifyProps: {
        data: { message: "Email verified!" },
        isSuccess: true,
      },
    });

    expect(screen.getByText("Email verified!")).toBeVisible();
    expect(screen.getByText("Go to Login")).toBeVisible();
  });

  test("displays verification loading state", () => {
    setup({
      token: "test123",
      verifyProps: { isLoading: true },
    });

    expect(screen.getByText("Verifying your email...")).toBeVisible();
  });

  test("displays verification error", () => {
    setup({
      token: "bad-token",
      verifyProps: {
        isError: true,
        error: { response: { data: { error: "Invalid token" } } },
      },
    });

    expect(screen.getByText("Invalid token")).toBeVisible();
  });

  test("resends verification email when button is clicked", async () => {
    const mutateMock = jest.fn((_, options) =>
      options.onSuccess?.({ message: "Email resent!" })
    );
    localStorage.setItem("unverifiedEmail", "user@test.com");

    setup({
      resendProps: {
        mutate: mutateMock,
      },
    });

    fireEvent.click(screen.getByText("Resend Email"));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith(
        "user@test.com",
        expect.any(Object)
      );
      expect(screen.getByText("Email resent!")).toBeVisible();
    });
  });

  test("shows resend error if resend fails", async () => {
    const mutateMock = jest.fn();
    localStorage.setItem("unverifiedEmail", "user@test.com");

    setup({
      resendProps: {
        mutate: mutateMock,
        error: { response: { data: { error: "Resend failed" } } },
      },
    });

    fireEvent.click(screen.getByText("Resend Email"));

    await waitFor(() => {
      expect(screen.getByText("Resend failed")).toBeVisible();
    });
  });

  test("navigates to login after successful verification", async () => {
    setup({
      token: "valid-token",
      verifyProps: {
        data: { message: "Email verified!" },
        isSuccess: true,
      },
    });

    const loginButton = screen.getByText("Go to Login");
    fireEvent.click(loginButton);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
