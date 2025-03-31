import { render, screen, fireEvent } from "@testing-library/react";
import ImageModal from "../../components/ImageModal";
import ReactModal from "react-modal";
import "@testing-library/jest-dom";

ReactModal.setAppElement(document.createElement("div")); // Prevents accessibility warning

describe("ImageModal Component", () => {
  const mockOnClose = jest.fn();
  const imageUrl = "https://example.com/image.jpg";

  test("renders the modal when isOpen is true", () => {
    render(
      <ImageModal imageUrl={imageUrl} isOpen={true} onClose={mockOnClose} />
    );
    expect(screen.getByAltText("Large preview")).toBeVisible();
  });

  test("does not render the modal when isOpen is false", () => {
    render(
      <ImageModal imageUrl={imageUrl} isOpen={false} onClose={mockOnClose} />
    );
    expect(screen.queryByAltText("Large preview")).toBeNull();
  });

  test("calls onClose when close button is clicked", () => {
    render(
      <ImageModal imageUrl={imageUrl} isOpen={true} onClose={mockOnClose} />
    );
    const closeButton = screen.getByTestId("close-modal-button");
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
