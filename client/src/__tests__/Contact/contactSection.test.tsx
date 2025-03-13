import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactSection from "../../components/Contact/ContactSection";
import { sendEmail } from "../../helper/email";
import toast from "react-hot-toast";
import "@testing-library/jest-dom";
import { useAuth } from "../../context/AuthContext";
import { BrowserRouter } from "react-router";

jest.mock("../../context/AuthContext", () => ({
  useAuth: jest.fn(() => ({ user: null })),
}));
jest.mock("../../helper/email", () => ({ sendEmail: jest.fn() }));
jest.mock("react-hot-toast", () => ({ error: jest.fn(), success: jest.fn() }));

describe("ContactSection Component", () => {
  const renderContact = () => {
    return render(
      <BrowserRouter>
        <ContactSection />
      </BrowserRouter>
    );
  };
  const fillForm = (fullname: string, email: string, message: string) => {
    fireEvent.change(screen.getByTestId("fullname-form"), {
      target: { value: fullname },
    });
    fireEvent.change(screen.getByTestId("email-form"), {
      target: { value: email },
    });
    fireEvent.change(screen.getByTestId("message-form"), {
      target: { value: message },
    });
  };

  const submitForm = () => {
    return fireEvent.click(screen.getByTestId("contact-submit-button"));
  };
  test("renders form correctly", () => {
    renderContact();

    expect(screen.getByTestId("fullname-form")).toBeVisible();
    expect(screen.getByTestId("email-form")).toBeVisible();
    expect(screen.getByTestId("message-form")).toBeVisible();
    expect(screen.getByTestId("contact-submit-button")).toBeVisible();
  });

  test("shows modal when submitting while logged out", async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });

    renderContact();
    fillForm("John Doe", "john@example.com", "Hello there!");

    const submitButton = screen.getByTestId("contact-submit-button");
    fireEvent.click(submitButton);

    // Check that modal appears
    expect(await screen.findByText("Please Login to Submit")).toBeVisible();
  });

  test("validates required fields", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: "test@example.com" },
    });
    renderContact();
    submitForm();

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("All fields are required")
    );
  });

  test("validates email format", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: "test@example.com" },
    });
    renderContact();
    fillForm("John Doe", "invalid-email", "Test message");
    submitForm();

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Invalid Email Format")
    );
  });

  test("calls sendEmail on valid submission", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: "test@example.com" },
    });
    (sendEmail as jest.Mock).mockResolvedValueOnce({ success: true });

    renderContact();
    fillForm("John Doe", "john@example.com", "Hello there!");
    submitForm();

    await waitFor(() => {
      expect(sendEmail).toHaveBeenCalledWith(
        "John Doe",
        "john@example.com",
        "Hello there!"
      );
      expect(toast.success).toHaveBeenCalledWith("Email sent successfully!");
    });
  });

  test("handles email sending failure", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: "test@example.com" },
    });
    (sendEmail as jest.Mock).mockRejectedValueOnce(
      new Error("Email sending failed")
    );

    renderContact();
    fillForm("John Doe", "john@example.com", "Hello there!");
    submitForm();

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to send email")
    );
  });

  test("disables button & shows spinner while submitting", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: "test@example.com" },
    });
    (sendEmail as jest.Mock).mockResolvedValueOnce({ success: true });

    renderContact();
    fillForm("John Doe", "john@example.com", "Hello there!");

    const submitButton = screen.getByTestId("contact-submit-button");
    fireEvent.click(submitButton);

    await waitFor(() => expect(submitButton).toBeDisabled());
    expect(await screen.findByTestId("contact-submit-button")).toBeVisible();
    await waitFor(() => expect(submitButton).not.toBeDisabled());
  });
});
