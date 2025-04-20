import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../pages/Register";
import { BrowserRouter } from "react-router";
import "@testing-library/jest-dom";

// Mocks
jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
}));

jest.mock("../hooks/useAuthQueries", () => ({
  useRegisterMutation: jest.fn(),
}));

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    login: jest.fn(),
  }),
}));

import toast from "react-hot-toast";
import { useRegisterMutation } from "../hooks/useAuthQueries";

describe("Register Component", () => {
  const mutateMock = jest.fn();

  const fillForm = (data: {
    name?: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
    confirmPassword?: string;
  }) => {
    const {
      name = "",
      email = "",
      phoneNumber = "",
      password = "",
      confirmPassword = "",
    } = data;

    fireEvent.change(screen.getByPlaceholderText("Enter your full name"), {
      target: { value: name },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: email },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Enter your phone number (ex. 09171234987)"),
      {
        target: { value: phoneNumber },
      }
    );
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: password },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm your password"), {
      target: { value: confirmPassword },
    });
  };

  const setup = () =>
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

  beforeEach(() => {
    (useRegisterMutation as jest.Mock).mockReturnValue({
      mutate: mutateMock,
    });
    mutateMock.mockClear();
  });

  it("renders all input fields and buttons", () => {
    setup();

    expect(
      screen.getByPlaceholderText("Enter your full name")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your phone number (ex. 09171234987)")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Confirm your password")
    ).toBeInTheDocument();
    expect(screen.getByTestId("register-button")).toBeInTheDocument();
  });

  it("shows error if fields are empty", async () => {
    setup();

    fireEvent.click(screen.getByTestId("register-button"));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter your full name")).toBeInvalid();
      expect(screen.getByPlaceholderText("Enter your email")).toBeInvalid();
      expect(
        screen.getByPlaceholderText("Enter your phone number (ex. 09171234987)")
      ).toBeInvalid();
      expect(screen.getByPlaceholderText("Enter your password")).toBeInvalid();
      expect(
        screen.getByPlaceholderText("Confirm your password")
      ).toBeInvalid();
    });
  });

  it("shows custom error if fields are empty", async () => {
    setup();

    const form = screen.getByTestId("register-form") as HTMLFormElement;
    form.noValidate = true;

    fireEvent.submit(form);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("All fields are required");
    });
  });

  it("shows error for invalid email format", async () => {
    setup();

    fillForm({
      name: "John Doe",
      email: "invalid email",
      phoneNumber: "09171234567",
      password: "password123",
      confirmPassword: "password123",
    });

    fireEvent.click(screen.getByTestId("register-button"));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter your email")).toBeInvalid();
    });
  });

  it("submits form with valid inputs and clears fields", async () => {
    setup();

    fillForm({
      name: "John Doe",
      email: "john@example.com",
      phoneNumber: "09171234567",
      password: "password123",
      confirmPassword: "password123",
    });

    fireEvent.click(screen.getByTestId("register-button"));

    await waitFor(() => {
      expect(mutateMock.mock.calls[0][0]).toEqual({
        name: "John Doe",
        email: "john@example.com",
        phoneNumber: "09171234567",
        password: "password123",
        confirmPassword: "password123",
      });
    });

    const onSuccess = mutateMock.mock.calls[0][1].onSuccess;
    onSuccess();

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Enter your full name")).toHaveValue(
        ""
      );
      expect(screen.getByPlaceholderText("Enter your email")).toHaveValue("");
      expect(
        screen.getByPlaceholderText("Enter your phone number (ex. 09171234987)")
      ).toHaveValue("");
      expect(screen.getByPlaceholderText("Enter your password")).toHaveValue(
        ""
      );
      expect(screen.getByPlaceholderText("Confirm your password")).toHaveValue(
        ""
      );
    });
  });
});
