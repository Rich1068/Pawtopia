import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import AdoptionForm from "../../components/PetPage/AdoptionForm";
import { useAuth } from "../../context/AuthContext";
import serverAPI from "../../helper/axios";
import "@testing-library/jest-dom";
import toast from "react-hot-toast";

jest.mock("../../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

jest.mock("../../helper/axios");

const renderComponent = () => {
  return render(<AdoptionForm petId="1" petName="Buddy" />);
};
describe("AdoptionForm", () => {
  const mockUser = {
    name: "John Doe",
    email: "john@example.com",
    phoneNumber: "09772685577",
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
    });
    (serverAPI.post as jest.Mock).mockResolvedValue({
      data: { message: "Request submitted successfully" },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should render the form with default user data", () => {
    renderComponent();

    expect(screen.getByTestId("name-input")).toHaveValue(mockUser.name);
    expect(screen.getByTestId("email-input")).toHaveValue(mockUser.email);
    expect(screen.getByTestId("phone-input")).toHaveValue(mockUser.phoneNumber);
  });

  test("should submit the form", async () => {
    renderComponent();

    fireEvent.change(screen.getByTestId("address-input"), {
      target: { value: "123 Main St" },
    });
    fireEvent.change(screen.getByTestId("reason-input"), {
      target: { value: "I love animals" },
    });
    fireEvent.click(screen.getByLabelText("House"));
    fireEvent.click(screen.getByLabelText("Email"));
    fireEvent.click(screen.getByLabelText("Had pets before"));
    // Submit the form
    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() =>
      screen.getByText(/Your adoption request has been submitted!/i)
    );

    expect(
      screen.getByText(/Your adoption request has been submitted!/i)
    ).toBeInTheDocument();
  });

  test("should show validation error when name field is empty", async () => {
    renderComponent();

    fireEvent.change(screen.getByTestId("name-input"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByTestId("submit-button"));
    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
    });
  });

  test("should show the 'Other' field when 'Other' is selected for living situation", () => {
    renderComponent();

    fireEvent.click(screen.getByTestId("Other-situation-input"));

    expect(screen.getByTestId("situation-other-input")).toBeInTheDocument();
  });

  test("should show the 'Other' field when 'Other' is selected for mode of communication", () => {
    renderComponent();

    fireEvent.click(screen.getByTestId("Other-mode-input"));

    expect(screen.getByTestId("mode-other-input")).toBeInTheDocument();
  });

  test("should show error toast when form submission fails", async () => {
    (serverAPI.post as jest.Mock).mockRejectedValue({
      response: {
        data: {
          error: "Something went wrong",
        },
      },
    });

    renderComponent();

    fireEvent.change(screen.getByTestId("name-input"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByTestId("email-input"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByTestId("phone-input"), {
      target: { value: "09772685577" },
    });
    fireEvent.click(screen.getByLabelText("House"));
    fireEvent.click(screen.getByLabelText("Email"));
    fireEvent.click(screen.getByLabelText("Had pets before"));
    fireEvent.change(screen.getByTestId("address-input"), {
      target: { value: "123 Main St" },
    });
    fireEvent.change(screen.getByTestId("reason-input"), {
      target: { value: "I love animals" },
    });
    // Simulate form submission
    fireEvent.submit(screen.getByTestId("submit-button"));

    // Wait for the toast error to be called
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith("Something went wrong");
    });
  });
});
