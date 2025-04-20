import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../pages/Login";
import { BrowserRouter } from "react-router";
import "@testing-library/jest-dom";

// Mocks
jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
}));

jest.mock("../hooks/useAuthQueries", () => ({
  useLoginMutation: jest.fn(),
}));

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    login: jest.fn(),
  }),
}));

import toast from "react-hot-toast";
import { useLoginMutation } from "../hooks/useAuthQueries";

describe("Login Component", () => {
  const mutateMock = jest.fn();

  beforeEach(() => {
    (useLoginMutation as jest.Mock).mockReturnValue({
      mutate: mutateMock,
    });
  });

  const setup = () =>
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

  it("renders all input fields and buttons", () => {
    setup();

    expect(screen.getByPlaceholderText("Enter email")).toBeVisible();
    expect(screen.getByPlaceholderText("Enter password")).toBeVisible();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  it("shows error if fields are empty", async () => {
    setup();

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter email")).toBeInvalid();
      expect(screen.getByPlaceholderText("Enter password")).toBeInvalid();
    });
  });

  it("shows custom error if fields are empty", async () => {
    setup();

    const form = screen.getByTestId("login-form");
    (form as HTMLFormElement).noValidate = true;

    fireEvent.submit(form);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("All fields are required");
    });
  });

  it("shows error for invalid email format", async () => {
    setup();

    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "invalidemail" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid email format");
    });
  });

  it("submits form with valid inputs", async () => {
    setup();

    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
        rememberMe: false,
      });
    });
  });
});
