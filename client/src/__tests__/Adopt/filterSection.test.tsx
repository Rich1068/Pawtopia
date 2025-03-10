// __tests__/FilterSection.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import FilterSection from "../../components/Adopt/FilterSection";
import "@testing-library/jest-dom";

describe("FilterSection component", () => {
  const mockHandleCheckboxChange = jest.fn();

  const defaultProps = {
    title: "Size",
    options: ["small", "medium", "large", "x-large"],
    selected: ["medium"],
    petCounts: {
      small: 2,
      medium: 5,
      large: 3,
      xlarge: 0,
    },
    filterType: "size" as const,
    handleCheckboxChange: mockHandleCheckboxChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("renders the title", () => {
    render(<FilterSection {...defaultProps} />);
    expect(screen.getByText("Size")).toBeVisible();
  });

  it("shows filter options when open", () => {
    render(<FilterSection {...defaultProps} />);
    expect(screen.getByLabelText(/Medium/i)).toBeVisible();
    expect(screen.getByLabelText(/Small/i)).toBeVisible();
  });

  it("toggles the section open/closed", () => {
    render(<FilterSection {...defaultProps} />);
    const toggleButton = screen.getByRole("button", { name: /Size/i });
    fireEvent.click(toggleButton);
    expect(localStorage.getItem("dropdown-size")).toBe("false");
  });

  it("calls handleCheckboxChange when a checkbox is clicked", () => {
    render(<FilterSection {...defaultProps} />);
    const checkbox = screen.getByLabelText(/Small/i);
    fireEvent.click(checkbox);
    expect(mockHandleCheckboxChange).toHaveBeenCalledWith("size", "small");
  });

  it("renders the count next to each option", () => {
    render(<FilterSection {...defaultProps} />);
    expect(screen.getByText("Small (2)")).toBeVisible();
    expect(screen.getByText("Medium (5)")).toBeVisible();
    expect(screen.getByText("Large (3)")).toBeVisible();
    expect(screen.getByText("X-large (0)")).toBeVisible();
  });
});
