import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfileCard from "../../components/Profile/ProfileCard";
import { useAuth } from "../../context/AuthContext";
import serverAPI from "../../helper/axios";
import "@testing-library/jest-dom";
import toast from "react-hot-toast";
import { User } from "../../types/Types";
import { createWrapper } from "../../__mocks__/utils/testUtils";

const wrapper = createWrapper();

const renderComponent = () => {
  return render(
    wrapper({
      children: <ProfileCard user={mockUser} />,
    })
  );
};
jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

jest.mock("../../helper/axios");
jest.mock("../../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));
const mockVerifyToken = jest.fn();

const mockUser: User = {
  _id: "123",
  name: "Jane Doe",
  email: "jane@example.com",
  role: "user",
  profileImage: "",
  phoneNumber: "09772684567",
  createdAt: new Date(),
};

describe("ProfileCard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ verifyToken: mockVerifyToken });
  });

  it("renders the ProfileCard with user data", () => {
    renderComponent();

    expect(screen.getByText("Profile Information")).toBeVisible();
    expect(screen.getByText("Jane Doe")).toBeVisible();
    expect(screen.getByText("jane@example.com")).toBeVisible();
    expect(screen.getByText("09772684567")).toBeVisible();
    expect(screen.getByText("user")).toBeVisible();
  });

  it("switch tabs", () => {
    renderComponent();

    fireEvent.click(screen.getByText("Change Password"));
    expect(screen.getAllByText("Change Password")[0]).toBeVisible();
    expect(
      screen.getByText("Enter a new password to update your account.")
    ).toBeVisible();

    fireEvent.click(screen.getByText("Profile"));
    expect(screen.getByText("Profile Information")).toBeVisible();
  });

  it("allows editing and saving profile information", async () => {
    (serverAPI.post as jest.Mock).mockResolvedValue({
      data: { message: "Profile updated successfully", user: mockUser },
    });

    renderComponent();

    fireEvent.click(screen.getByText("Edit"));

    const nameInput = screen.getByTestId("name-input");
    fireEvent.change(nameInput, { target: { value: "John Doe" } });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(serverAPI.post).toHaveBeenCalledWith(
        "/user/edit",
        {
          name: "John Doe",
          email: "jane@example.com",
          phoneNumber: "09772684567",
        },
        { withCredentials: true }
      );
    });

    expect(toast.success).toHaveBeenCalledWith("Profile updated successfully");
    expect(mockVerifyToken).toHaveBeenCalled();
  });

  it("handles errors when saving profile information", async () => {
    (serverAPI.post as jest.Mock).mockRejectedValue({
      response: { data: { error: "Failed to update profile" } },
    });

    renderComponent();

    fireEvent.click(screen.getByText("Edit"));

    const nameInput = screen.getByTestId("name-input");
    fireEvent.change(nameInput, { target: { value: "John Doe" } });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to update profile");
    });
  });
  it("resets the form and exits editing mode when 'Cancel' is clicked", () => {
    renderComponent();

    fireEvent.click(screen.getByText("Edit"));

    const nameInput = screen.getByTestId("name-input");
    const emailInput = screen.getByTestId("email-input");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });

    expect(nameInput).toHaveValue("John Doe");
    expect(emailInput).toHaveValue("john.doe@example.com");

    fireEvent.click(screen.getAllByText("Cancel")[0]);

    const namevalue = screen.getByTestId("Full Name-value");
    const emailvalue = screen.getByTestId("Email Address-value");
    expect(namevalue).not.toHaveValue("John Doe");
    expect(emailvalue).not.toHaveValue("john.doe@example.com");

    // Verify editing mode is exited
    expect(screen.getByText("Edit")).toBeVisible();
  });
  it("allows editing and saving the password", async () => {
    (serverAPI.post as jest.Mock).mockResolvedValue({
      data: { message: "Password updated successfully" },
    });

    renderComponent();

    fireEvent.click(screen.getByText("Change Password"));

    const newPasswordInput = screen.getByTestId("newPassword-input");
    const confirmPasswordInput = screen.getByTestId("confirmPassword-input");

    fireEvent.change(newPasswordInput, { target: { value: "newpassword123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "newpassword123" },
    });

    fireEvent.click(screen.getByText("Update Password"));

    await waitFor(() => {
      expect(serverAPI.post).toHaveBeenCalledWith(
        "/user/edit-password",
        {
          password: "newpassword123",
          confirmPassword: "newpassword123",
        },
        { withCredentials: true }
      );
    });

    expect(toast.success).toHaveBeenCalledWith("Password updated successfully");
  });

  it("handles errors when saving the password", async () => {
    (serverAPI.post as jest.Mock).mockRejectedValue({
      response: { data: { error: "Failed to update password" } },
    });

    renderComponent();

    fireEvent.click(screen.getByText("Change Password"));

    const newPasswordInput = screen.getByTestId("newPassword-input");
    const confirmPasswordInput = screen.getByTestId("confirmPassword-input");

    fireEvent.change(newPasswordInput, { target: { value: "newpassword123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "newpassword123" },
    });

    fireEvent.click(screen.getByText("Update Password"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to update password");
    });
  });
});
