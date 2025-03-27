import { render, screen, fireEvent } from "@testing-library/react";
import ProductImageUpload from "../../../components/shop/Admin/AddProduct/ProductImageUpload";
import "@testing-library/jest-dom";
import { IProductImage } from "../../../types/Types";

// Mock File object creation
const createMockFile = (name: string, type: string): File => {
  return new File(["sample"], name, { type });
};

describe("ProductImageUpload Component", () => {
  let mockSetProductImages: jest.Mock;
  let mockProductImages: IProductImage[];

  beforeEach(() => {
    mockSetProductImages = jest.fn();
    mockProductImages = [
      { preview: "image1.jpg", isNew: true },
      { preview: "image2.jpg", isNew: false },
    ];
    URL.createObjectURL = jest.fn(() => "mock-url");
  });

  const renderComponent = () =>
    render(
      <ProductImageUpload
        productImages={mockProductImages}
        setProductImages={mockSetProductImages}
      />
    );

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
    expect(mockSetProductImages).toHaveBeenCalledWith(expect.any(Function));
  });

  it("should display image preview when files are uploaded", async () => {
    renderComponent();
    const fileInput = screen.getByTestId("image-upload");
    const mockFile = createMockFile("test-image.jpg", "image/jpeg");
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    const previewImages = await screen.findAllByAltText("Preview");
    expect(previewImages.length).toBeGreaterThan(0);
    previewImages.forEach((img) => expect(img).toBeVisible());
  });

  it("should remove an image when delete button is clicked", async () => {
    renderComponent();

    const deleteButtons = screen.getAllByRole("button");
    fireEvent.click(deleteButtons[0]);

    expect(mockSetProductImages).toHaveBeenCalledWith(expect.any(Function));
  });

  it("should handle drag and drop event", () => {
    renderComponent();
    const dropZone = screen.getByTestId("image-upload");
    const mockFile = createMockFile("test-image.jpg", "image/jpeg");

    // Manually mock DataTransfer
    const dataTransfer = {
      files: [mockFile],
      items: [{ kind: "file", type: mockFile.type, getAsFile: () => mockFile }],
    };

    fireEvent.dragOver(dropZone);
    fireEvent.drop(dropZone, { dataTransfer });

    expect(mockSetProductImages).toHaveBeenCalledWith(expect.any(Function));
  });
});
