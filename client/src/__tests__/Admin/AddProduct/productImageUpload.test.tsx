import { render, screen, fireEvent } from "@testing-library/react";
import ProfileImageUpload from "../../../components/shop/Admin/AddProduct/ProductImageUpload";
import "@testing-library/jest-dom";

// Mock File object creation
const createMockFile = (name: string, type: string): File => {
  return new File(["sample"], name, { type });
};

describe("ProfileImageUpload Component", () => {
  let mockOnImagesSelect: jest.Mock;

  beforeEach(() => {
    mockOnImagesSelect = jest.fn();
    URL.createObjectURL = jest.fn(() => "mock-url");
  });

  const renderComponent = () =>
    render(<ProfileImageUpload onImagesSelect={mockOnImagesSelect} />);

  it("should render the drop zone correctly", () => {
    renderComponent();
    expect(
      screen.getByText("Drag & drop images here or click to upload")
    ).toBeInTheDocument();
  });

  it("should allow selecting files via input", () => {
    renderComponent();
    const fileInput = screen.getByTestId("image-upload");
    const mockFile = createMockFile("test-image.jpg", "image/jpeg");

    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    expect(mockOnImagesSelect).toHaveBeenCalledWith([mockFile]);
  });

  it("should display image preview when files are uploaded", async () => {
    renderComponent();
    const fileInput = screen.getByTestId("image-upload");
    const mockFile = createMockFile("test-image.jpg", "image/jpeg");

    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    const previewImage = await screen.findByAltText("Preview");
    expect(previewImage).toBeInTheDocument();
  });

  it("should remove image when delete button is clicked", async () => {
    renderComponent();
    const fileInput = screen.getByTestId("image-upload");
    const mockFile = createMockFile("test-image.jpg", "image/jpeg");

    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    const removeButton = await screen.findByRole("button");
    fireEvent.click(removeButton);

    expect(mockOnImagesSelect).toHaveBeenCalledWith([mockFile]);
  });

  it("should handle drag and drop event", () => {
    renderComponent();
    const dropZone = screen.getByText(
      "Drag & drop images here or click to upload"
    );
    const mockFile = createMockFile("test-image.jpg", "image/jpeg");

    fireEvent.dragOver(dropZone);
    fireEvent.drop(dropZone, { dataTransfer: { files: [mockFile] } });

    expect(mockOnImagesSelect).toHaveBeenCalledWith([mockFile]);
  });
});
