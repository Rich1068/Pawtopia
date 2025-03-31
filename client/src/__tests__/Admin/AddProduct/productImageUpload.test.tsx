import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductImageUpload from "../../../components/shop/Admin/AddProduct/ProductImageUpload";
import "@testing-library/jest-dom";
import { IProductImage } from "../../../types/Types";

// Mock File object creation
const createMockFile = (name: string, type: string, size = 1024) => {
  return new File([new Array(size).fill("a").join("")], name, { type });
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

    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <ProductImageUpload
        productImages={mockProductImages}
        setProductImages={mockSetProductImages}
      />
    );

  it("renders the drop zone correctly", () => {
    renderComponent();
    expect(
      screen.getByText("Drag & drop images here or click to upload")
    ).toBeInTheDocument();
  });

  it("allows selecting and uploading valid image files", async () => {
    renderComponent();
    const fileInput = screen.getByTestId("image-upload");
    const mockFile = createMockFile("test-image.jpg", "image/jpeg");

    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(mockSetProductImages).toHaveBeenCalled();
    });
  });

  it("displays uploaded images correctly", async () => {
    renderComponent();
    const fileInput = screen.getByTestId("image-upload");
    const mockFile = createMockFile("test-image.jpg", "image/jpeg");

    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      const images = screen.getAllByAltText("Preview");
      expect(images.length).toBeGreaterThan(0);
      images.forEach((img) => expect(img).toBeVisible());
    });
  });

  it("prevents uploading non-image files", async () => {
    renderComponent();
    const fileInput = screen.getByTestId("image-upload");
    const invalidFile = createMockFile("document.txt", "text/plain");

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "File document.txt must be a JPG or PNG."
      );
    });

    expect(mockSetProductImages).not.toHaveBeenCalled();
  });

  it("prevents uploading large files", async () => {
    renderComponent();
    const fileInput = screen.getByTestId("image-upload");
    const largeFile = createMockFile(
      "large.jpg",
      "image/jpeg",
      3 * 1024 * 1024
    ); // 3MB

    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "File large.jpg is larger than 2MB."
      );
    });

    expect(mockSetProductImages).not.toHaveBeenCalled();
  });

  it("limits uploads to a maximum of 5 images", async () => {
    // Local state to track product images
    let productImages: IProductImage[] = [
      {
        file: new File([], "existing1.jpg"),
        preview: "blob://existing1",
        isNew: true,
      },
      {
        file: new File([], "existing2.jpg"),
        preview: "blob://existing2",
        isNew: true,
      },
    ];

    mockSetProductImages.mockImplementation((updateFn) => {
      if (typeof updateFn === "function") {
        productImages = updateFn(productImages);
      } else {
        productImages = updateFn;
      }
    });

    renderComponent();
    const fileInput = screen.getByTestId("image-upload");

    const files = [
      createMockFile("image3.jpg", "image/jpeg"),
      createMockFile("image4.jpg", "image/jpeg"),
      createMockFile("image5.jpg", "image/jpeg"),
      createMockFile("image6.jpg", "image/jpeg"),
    ];

    fireEvent.change(fileInput, { target: { files } });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "You can only upload up to 5 images."
      );
    });

    // Ensure no more than 5 images exist in state
    expect(productImages.length).toBeLessThanOrEqual(5);
  });

  it("removes an image when delete button is clicked", async () => {
    renderComponent();

    const deleteButtons = screen.getAllByRole("button");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockSetProductImages).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  it("handles drag-and-drop file uploads", async () => {
    renderComponent();
    const dropZone = screen.getByText(
      "Drag & drop images here or click to upload"
    );
    const mockFile = createMockFile("dragged.jpg", "image/jpeg");

    // Manually mock DataTransfer
    const dataTransfer = {
      files: [mockFile],
      items: [{ kind: "file", type: mockFile.type, getAsFile: () => mockFile }],
    };

    fireEvent.dragOver(dropZone);
    fireEvent.drop(dropZone, { dataTransfer });

    await waitFor(() => {
      expect(mockSetProductImages).toHaveBeenCalled();
    });
  });
});
