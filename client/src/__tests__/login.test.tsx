import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import serverAPI from "../helper/axios";
import Login from "../pages/Login";
import toast from "react-hot-toast";
import "@testing-library/jest-dom";

jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: jest.fn(),
}));

jest.mock("../helper/axios");
jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

describe("Login Component", () => {
  const mockNavigate = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  const fillLoginForm = (email: string, password: string) => {
    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: email },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: password },
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockAPIResponse = (response: any, isError = false) => {
    if (isError) {
      (serverAPI.post as jest.Mock).mockRejectedValue(response);
    } else {
      (serverAPI.post as jest.Mock).mockResolvedValue(response);
    }
  };

  it("renders login form correctly", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText("Login")).toBeVisible();
    expect(screen.getByPlaceholderText("Enter email")).toBeVisible();
    expect(screen.getByPlaceholderText("Enter password")).toBeVisible();
    expect(screen.getByText("Sign in")).toBeVisible();
  });

  it("validates empty fields", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const emailInput = screen.getByPlaceholderText("Enter email");
    fireEvent.click(screen.getByText("Sign in"));

    expect(emailInput).toBeInvalid();
  });

  it("validates empty fields with custom validation", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const form = screen.getByTestId("login-form");
    form.setAttribute("noValidate", "true");

    fireEvent.click(screen.getByText("Sign in"));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("All fields are required")
    );
  });

  it("validates invalid email format", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fillLoginForm("invalid-email", "password123");
    fireEvent.click(screen.getByText("Sign in"));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Invalid email format")
    );
  });

  it("handles successful login", async () => {
    mockAPIResponse({ data: { message: "Login successful" } });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fillLoginForm("test@example.com", "password123");
    fireEvent.click(screen.getByText("Sign in"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(false);
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("redirects to email verification page if email not verified", async () => {
    mockAPIResponse({
      data: { message: "Please Verify Email", email: "test@example.com" },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fillLoginForm("test@example.com", "password123");
    fireEvent.click(screen.getByText("Sign in"));

    await waitFor(() => {
      expect(localStorage.getItem("unverifiedEmail")).toBe("test@example.com");
      expect(mockNavigate).toHaveBeenCalledWith("/verify-email");
    });
  });

  it("handles API error response", async () => {
    mockAPIResponse(
      { response: { data: { error: "Invalid credentials" } } },
      true
    );

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fillLoginForm("wrong@example.com", "wrongpassword");
    fireEvent.click(screen.getByText("Sign in"));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Invalid credentials")
    );
  });

  it("handles unknown API error", async () => {
    mockAPIResponse(new Error("Network Error"), true);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fillLoginForm("test@example.com", "password123");
    fireEvent.click(screen.getByText("Sign in"));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Something went wrong")
    );
  });

  it("shows loading state while logging in", async () => {
    (serverAPI.post as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve({ data: {} }), 1000))
    );

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fillLoginForm("test@example.com", "password123");
    fireEvent.click(screen.getByText("Sign in"));

    expect(screen.getByRole("button")).toBeDisabled();
    await waitFor(() => expect(screen.getByRole("button")).not.toBeDisabled());
  });

  it("toggles rememberMe checkbox state", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const rememberMeCheckbox = screen.getByRole("checkbox", {
      name: /remember me/i,
    });

    expect(rememberMeCheckbox).not.toBeChecked();

    fireEvent.click(rememberMeCheckbox);
    expect(rememberMeCheckbox).toBeChecked();

    fireEvent.click(rememberMeCheckbox);
    expect(rememberMeCheckbox).not.toBeChecked();
  });
});
