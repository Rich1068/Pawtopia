import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { useNavigate } from "react-router";
import serverAPI from "../helper/axios";
import toast from "react-hot-toast";
import Register from "../pages/Register";
import "@testing-library/jest-dom";

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: jest.fn(),
}));

jest.mock("../helper/axios");
jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

describe("Register Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  const fillRegisterForm = (data: {
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
  }) => {
    fireEvent.change(screen.getByPlaceholderText("Enter your full name"), {
      target: { value: data.name },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: data.email },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Enter your phone number (ex. 09171234987)"),
      { target: { value: data.phoneNumber } }
    );
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: data.password },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
      target: { value: data.confirmPassword },
    });
  };

  it("renders register form correctly", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByText("Create Account")).toBeVisible();
    expect(screen.getByPlaceholderText("Enter your full name")).toBeVisible();
    expect(screen.getByPlaceholderText("Enter your email")).toBeVisible();
    expect(
      screen.getByPlaceholderText("Enter your phone number (ex. 09171234987)")
    ).toBeVisible();
    expect(screen.getByPlaceholderText("Enter your password")).toBeVisible();
    expect(screen.getByPlaceholderText("Confirm your password")).toBeVisible();
    expect(screen.getByText("Sign Up")).toBeVisible();
  });

  it("validates empty fields", async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    const nameInput = screen.getByPlaceholderText("Enter your full name");
    fireEvent.click(screen.getByText("Sign Up"));
    expect(nameInput).toBeInvalid();
  });

  it("validates invalid email format", async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    const emailInput = screen.getByPlaceholderText("Enter your email");
    fillRegisterForm({
      name: "John Doe",
      email: "invalid-email",
      phoneNumber: "09171234987",
      password: "password123",
      confirmPassword: "password123",
    });
    fireEvent.click(screen.getByText("Sign Up"));
    expect(emailInput).toBeInvalid();
  });

  it("handles successful registration", async () => {
    (serverAPI.post as jest.Mock).mockResolvedValue({
      data: { email: "test@example.com" },
    });
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    fillRegisterForm({
      name: "John Doe",
      email: "test@example.com",
      phoneNumber: "09171234987",
      password: "password123",
      confirmPassword: "password123",
    });
    fireEvent.click(screen.getByText("Sign Up"));
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Registered Successfully, Please Verify Your Email"
      );
      expect(localStorage.getItem("unverifiedEmail")).toBe("test@example.com");
      expect(mockNavigate).toHaveBeenCalledWith("/verify-email");
    });
  });
  test("triggers custom validation when form is submitted", async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    const form = screen.getByTestId("register-form");
    const submitButton = screen.getByText("Sign Up");

    form.setAttribute("noValidate", "true");

    fireEvent.click(submitButton);

    expect(toast.error).toHaveBeenCalledWith("All fields are required");
  });
  it("handles API error response", async () => {
    (serverAPI.post as jest.Mock).mockRejectedValue({
      response: { data: { error: "Registration failed" } },
    });
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    fillRegisterForm({
      name: "John Doe",
      email: "test@example.com",
      phoneNumber: "09171234987",
      password: "password123",
      confirmPassword: "password123",
    });
    fireEvent.click(screen.getByText("Sign Up"));
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Registration failed")
    );
  });

  it("shows loading state while registering", async () => {
    (serverAPI.post as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve({ data: {} }), 1000))
    );
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    fillRegisterForm({
      name: "John Doe",
      email: "test@example.com",
      phoneNumber: "09171234987",
      password: "password123",
      confirmPassword: "password123",
    });
    fireEvent.click(screen.getByText("Sign Up"));
    expect(screen.getByRole("button")).toBeDisabled();
    await waitFor(() => expect(screen.getByRole("button")).not.toBeDisabled());
  });
});
