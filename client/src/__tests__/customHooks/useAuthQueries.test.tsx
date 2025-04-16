/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { renderHook, act } from "@testing-library/react";
import {
  useLoginMutation,
  useRegisterMutation,
} from "../../hooks/useAuthQueries";
import serverAPI from "../../helper/axios";
import toast from "react-hot-toast";
import { createWrapper } from "../../__mocks__/utils/testUtils";

jest.mock("../../helper/axios");
jest.mock("react-router", () => ({
  useNavigate: () => jest.fn(),
}));
jest.mock("react-hot-toast");

const wrapper = createWrapper();

describe("useRegisterMutation", () => {
  it("registers user and navigates to verify-email", async () => {
    const mockedData = { email: "test@example.com" };
    (serverAPI.post as jest.Mock).mockResolvedValueOnce({ data: mockedData });

    const { result } = renderHook(() => useRegisterMutation(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        name: "Test",
        email: "test@example.com",
        phoneNumber: "1234567890",
        password: "password",
        confirmPassword: "password",
      });
    });

    expect(serverAPI.post).toHaveBeenCalledWith(
      "/register",
      expect.any(Object)
    );
    expect(toast.success).toHaveBeenCalledWith(
      "Registered Successfully, Please Verify Your Email"
    );
    expect(localStorage.getItem("unverifiedEmail")).toBe("test@example.com");
  });

  it("handles registration error", async () => {
    const errorMessage = "Email already exists";
    (serverAPI.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { error: errorMessage } },
    });

    const { result } = renderHook(() => useRegisterMutation(), { wrapper });

    await act(async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await result.current.mutateAsync({} as any);
      } catch (e) {}
    });

    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });
});

describe("useLoginMutation", () => {
  it("logs in and navigates to verify-email if not verified", async () => {
    const mockedLogin = jest.fn();
    const data = {
      message: "Please Verify Email",
      email: "verify@example.com",
      rememberMe: true,
    };
    (serverAPI.post as jest.Mock).mockResolvedValueOnce({ data });

    const { result } = renderHook(() => useLoginMutation(mockedLogin), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync({
        email: "verify@example.com",
        password: "pass",
        rememberMe: true,
      });
    });

    expect(mockedLogin).toHaveBeenCalledWith(true);
    expect(localStorage.getItem("unverifiedEmail")).toBe("verify@example.com");
  });

  it("navigates to home on successful login", async () => {
    const mockedLogin = jest.fn();
    const data = {
      message: "Welcome",
      rememberMe: false,
    };
    (serverAPI.post as jest.Mock).mockResolvedValueOnce({ data });

    const { result } = renderHook(() => useLoginMutation(mockedLogin), {
      wrapper,
    });

    await act(async () => {
      await result.current.mutateAsync({
        email: "home@example.com",
        password: "pass",
        rememberMe: false,
      });
    });

    expect(mockedLogin).toHaveBeenCalledWith(false);
  });

  it("handles login error", async () => {
    const mockedLogin = jest.fn();
    (serverAPI.post as jest.Mock).mockRejectedValueOnce({
      response: { data: { error: "Invalid credentials" } },
    });

    const { result } = renderHook(() => useLoginMutation(mockedLogin), {
      wrapper,
    });

    await act(async () => {
      try {
        await result.current.mutateAsync({
          email: "fail@example.com",
          password: "pass",
          rememberMe: false,
        });
      } catch (e) {}
    });

    expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
  });
  it("shows fallback error message on login failure without server error message", async () => {
    const mockedLogin = jest.fn();
    (serverAPI.post as jest.Mock).mockRejectedValueOnce({});

    const { result } = renderHook(() => useLoginMutation(mockedLogin), {
      wrapper,
    });

    await act(async () => {
      try {
        await result.current.mutateAsync({
          email: "fail@example.com",
          password: "pass",
          rememberMe: false,
        });
      } catch (e) {}
    });

    expect(toast.error).toHaveBeenCalledWith("Something went wrong");
  });
});
