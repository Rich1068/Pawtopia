import { renderHook, act, waitFor } from "@testing-library/react";
import { createWrapper } from "../../__mocks__/utils/testUtils";
import serverAPI from "../../helper/axios";
import {
  useVerifyEmailQuery,
  useResendVerificationMutation,
} from "../../hooks/useVerifyEmail";

jest.mock("../../helper/axios");

describe("useVerifyEmailQuery", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls the API and returns success data when token is valid", async () => {
    const mockData = { message: "Email verified successfully" };
    (serverAPI.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => useVerifyEmailQuery("validToken123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(serverAPI.get).toHaveBeenCalledWith(
      "/api/verify-email?token=validToken123"
    );
    expect(result.current.data).toEqual(mockData);
  });

  it("does not call the API when token is null", async () => {
    renderHook(() => useVerifyEmailQuery(null), {
      wrapper: createWrapper(),
    });

    expect(serverAPI.get).not.toHaveBeenCalled();
  });

  it("handles API errors correctly", async () => {
    (serverAPI.get as jest.Mock).mockRejectedValueOnce({
      response: { data: { error: "Invalid or expired token" } },
    });

    const { result } = renderHook(() => useVerifyEmailQuery("badToken"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
    expect(serverAPI.get).toHaveBeenCalledWith(
      "/api/verify-email?token=badToken"
    );
  });
});

describe("useResendVerificationMutation", () => {
  it("resends verification email and returns success", async () => {
    const mockData = { message: "Verification email sent" };
    (serverAPI.post as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(() => useResendVerificationMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      const response = await result.current.mutateAsync("user@example.com");
      expect(response).toEqual(mockData);
    });

    expect(serverAPI.post).toHaveBeenCalledWith("/api/resend-verification", {
      email: "user@example.com",
    });
  });

  it("handles resend verification email failure", async () => {
    (serverAPI.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { error: "User not found" } },
    });

    const { result } = renderHook(() => useResendVerificationMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.mutateAsync("wrong@example.com");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        expect(error.response.data.error).toBe("User not found");
      }
    });

    expect(serverAPI.post).toHaveBeenCalledWith("/api/resend-verification", {
      email: "wrong@example.com",
    });
  });
});
