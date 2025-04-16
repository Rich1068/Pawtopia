// tests/hooks/useResetPassword.test.ts
import { renderHook, act } from "@testing-library/react";
import { createWrapper } from "../../__mocks__/utils/testUtils";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import serverAPI from "../../helper/axios";
import { useResetPassword } from "../../hooks/useResetPassword";

jest.mock("../../helper/axios");
jest.mock("react-router", () => ({
  useNavigate: jest.fn(),
}));
jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

describe("useResetPassword", () => {
  const token = "testToken";
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it("shows toast error when password reset fails", async () => {
    const mockToken = "validToken123";
    const mockError = { response: { data: { error: "Reset failed" } } };
    (serverAPI.post as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useResetPassword(mockToken), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setPassword("newPassword");
      result.current.setConfirmPassword("newPassword");
    });

    await act(async () => {
      result.current.validatePasswordAndReset();
    });

    expect(serverAPI.post).toHaveBeenCalledWith(
      `/api/reset-password/${mockToken}`,
      { password: "newPassword" }
    );

    expect(toast.error).toHaveBeenCalledWith("Reset failed");
  });

  it("successfully resets password when inputs are valid", async () => {
    (serverAPI.post as jest.Mock).mockResolvedValueOnce({
      data: { message: "Password reset successful!" },
    });

    const { result } = renderHook(() => useResetPassword(token), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setPassword("strongpass");
      result.current.setConfirmPassword("strongpass");
    });

    await act(async () => {
      const isValid = result.current.validatePasswordAndReset();
      expect(isValid).toBe(true);
    });

    expect(serverAPI.post).toHaveBeenCalledWith(
      `/api/reset-password/${token}`,
      {
        password: "strongpass",
      }
    );
    expect(toast.success).toHaveBeenCalledWith(
      "Password reset successful! Please log in."
    );
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("shows toast error when passwords do not match", () => {
    const { result } = renderHook(() => useResetPassword(token), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setPassword("pass1");
      result.current.setConfirmPassword("pass2");
    });

    const isValid = result.current.validatePasswordAndReset();
    expect(isValid).toBe(false);
    expect(toast.error).toHaveBeenCalledWith("Passwords do not match");
  });

  it("shows toast error when password is too short", () => {
    const { result } = renderHook(() => useResetPassword(token), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setPassword("");
      result.current.setConfirmPassword("");
    });

    const isValid = result.current.validatePasswordAndReset();
    expect(isValid).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(
      "Password must be at least 1 character"
    );
  });

  it("shows toast error on mutation failure", async () => {
    (serverAPI.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { error: "Reset failed" } },
    });

    const { result } = renderHook(() => useResetPassword(token), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setPassword("password123");
      result.current.setConfirmPassword("password123");
    });

    await act(async () => {
      result.current.validatePasswordAndReset();
    });

    expect(toast.error).toHaveBeenCalledWith("Reset failed");
  });
});
