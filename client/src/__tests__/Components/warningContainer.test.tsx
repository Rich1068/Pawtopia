import { render, screen, fireEvent } from "@testing-library/react";
import WarningContainer from "../../components/WarningContainer";
import "@testing-library/jest-dom";

describe("WarningContainer Component", () => {
  test("renders header and text", () => {
    render(<WarningContainer header="Warning!" text="Are you sure?" />);

    expect(screen.getByText("Warning!")).toBeVisible();
    expect(screen.getByText("Are you sure?")).toBeVisible();
  });

  test("renders confirm button with default text", () => {
    render(<WarningContainer onConfirm={jest.fn()} />);

    expect(screen.getByText("Confirm")).toBeVisible();
  });

  test("renders confirm button with custom text", () => {
    render(<WarningContainer confirmText="Delete" onConfirm={jest.fn()} />);

    expect(screen.getByText("Delete")).toBeVisible();
  });

  test("calls onConfirm when button is clicked", () => {
    const mockOnConfirm = jest.fn();
    render(<WarningContainer onConfirm={mockOnConfirm} />);

    const button = screen.getByText("Confirm");
    fireEvent.click(button);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  test("does not render button if onConfirm is not provided", () => {
    render(<WarningContainer />);

    expect(screen.queryByText("Confirm")).not.toBeInTheDocument();
  });
});
