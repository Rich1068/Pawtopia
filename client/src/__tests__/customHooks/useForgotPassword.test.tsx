/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook, act } from "@testing-library/react";
import toast from "react-hot-toast";
import serverAPI from "../../helper/axios";
import useForgotPassword from "../../hooks/useForgotPassword";
import { createWrapper } from "../../__mocks__/utils/testUtils";

jest.mock("../../helper/axios");
jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe("useForgotPassword (renderHook)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("validates empty email", () => {
    const { result } = renderHook(() => useForgotPassword(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleSubmit({ preventDefault: jest.fn() } as any);
    });

    expect(toast.error).toHaveBeenCalledWith("Please enter your email");
  });

  it("validates invalid email format", () => {
    const { result } = renderHook(() => useForgotPassword(), {
      wrapper: createWrapper(),
    });
    act(() => {
      result.current.setEmail("invalid-email");
    });

    act(() => {
      result.current.handleSubmit({ preventDefault: jest.fn() } as any);
    });

    expect(toast.error).toHaveBeenCalledWith("Invalid email format");
  });

  it("calls forgot password API and shows success", async () => {
    (serverAPI.post as jest.Mock).mockResolvedValueOnce({});

    const { result } = renderHook(() => useForgotPassword(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setEmail("test@example.com");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as any);
    });

    expect(serverAPI.post).toHaveBeenCalledWith("/api/forgot-password", {
      email: "test@example.com",
    });

    expect(toast.success).toHaveBeenCalledWith(
      "Password reset link sent to your email"
    );
  });

  it("handles API error and shows toast", async () => {
    (serverAPI.post as jest.Mock).mockRejectedValueOnce({
      response: {
        data: {
          error: "User not found",
        },
      },
    });

    const { result } = renderHook(() => useForgotPassword(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setEmail("fail@example.com");
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as any);
    });

    expect(toast.error).toHaveBeenCalledWith("User not found");
  });
});
