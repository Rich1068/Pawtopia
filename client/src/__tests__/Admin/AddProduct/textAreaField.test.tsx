import { render, screen } from "@testing-library/react";
import TextareaField from "../../../components/shop/Admin/AddProduct/TextareaField";
import "@testing-library/jest-dom";

describe("TextareaField Component", () => {
  const mockOnChange = jest.fn();

  it("renders correctly", () => {
    render(
      <TextareaField
        label="Description"
        name="description"
        value="Initial Value"
        onChange={mockOnChange}
        placeholder="Enter details..."
      />
    );

    expect(screen.getByLabelText("Description")).toBeVisible();

    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeVisible();

    expect(textarea).toHaveValue("Initial Value");

    expect(textarea).toHaveAttribute("placeholder", "Enter details...");
  });

  it("renders without placeholder when not provided", () => {
    render(
      <TextareaField
        label="Notes"
        name="notes"
        value=""
        onChange={mockOnChange}
      />
    );

    const textarea = screen.getByRole("textbox");

    expect(textarea).not.toHaveAttribute("placeholder");
  });
});
