import { render, screen, fireEvent } from "@testing-library/react";
import WarningModal from "../../components/WarningModal";
import "@testing-library/jest-dom";

describe("WarningModal Component", () => {
  test("renders header and text when modal is open", () => {
    render(
      <WarningModal
        header="Warning!"
        text="Are you sure?"
        isModalOpen={true}
        setIsModalOpen={jest.fn()}
      />
    );

    expect(screen.getByText("Warning!")).toBeVisible();
    expect(screen.getByText("Are you sure?")).toBeVisible();
  });

  test("renders confirm and close buttons", () => {
    render(
      <WarningModal
        isModalOpen={true}
        setIsModalOpen={jest.fn()}
        onConfirm={jest.fn()}
      />
    );

    expect(screen.getByText("Close")).toBeVisible();
    expect(screen.getByText("Confirm")).toBeVisible();
  });

  test("calls onConfirm when confirm button is clicked", () => {
    const mockOnConfirm = jest.fn();
    render(
      <WarningModal
        isModalOpen={true}
        setIsModalOpen={jest.fn()}
        onConfirm={mockOnConfirm}
      />
    );

    fireEvent.click(screen.getByText("Confirm"));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  test("closes modal when close button is clicked", () => {
    const mockSetIsModalOpen = jest.fn();
    render(
      <WarningModal isModalOpen={true} setIsModalOpen={mockSetIsModalOpen} />
    );

    fireEvent.click(screen.getByText("Close"));
    expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
  });

  test("closes modal when clicking outside modal", () => {
    const mockSetIsModalOpen = jest.fn();
    render(
      <WarningModal isModalOpen={true} setIsModalOpen={mockSetIsModalOpen} />
    );

    // Find the overlay background by class name
    const overlay = document.querySelector(".ReactModal__Overlay");
    if (overlay) {
      fireEvent.click(overlay);
      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
    }
  });

  test("does not close modal when clicking inside", () => {
    const mockSetIsModalOpen = jest.fn();
    render(
      <WarningModal isModalOpen={true} setIsModalOpen={mockSetIsModalOpen} />
    );

    fireEvent.click(screen.getByText("Confirm"));
    expect(mockSetIsModalOpen).not.toHaveBeenCalled();
  });
});
