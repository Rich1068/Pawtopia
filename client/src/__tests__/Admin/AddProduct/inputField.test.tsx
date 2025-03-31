import { render, screen } from "@testing-library/react";
import InputField from "../../../components/shop/Admin/AddProduct/InputField";
import "@testing-library/jest-dom";

describe("InputField Component", () => {
  it("renders the input field with the correct label", () => {
    render(
      <InputField
        label="Username"
        name="username"
        value=""
        onChange={jest.fn()}
      />
    );

    // Verify label is correctly associated with input
    const label = screen.getByText("Username");
    expect(label).toBeInTheDocument();

    // Ensure input exists
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("renders with a placeholder if provided", () => {
    render(
      <InputField
        label="Email"
        name="email"
        value=""
        onChange={jest.fn()}
        placeholder="Enter your email"
      />
    );

    const input = screen.getByPlaceholderText("Enter your email");
    expect(input).toBeInTheDocument();
  });

  it("renders with the correct input type", () => {
    render(
      <InputField
        label="Password"
        name="password"
        value=""
        onChange={jest.fn()}
        type="password"
      />
    );

    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");
  });
});
