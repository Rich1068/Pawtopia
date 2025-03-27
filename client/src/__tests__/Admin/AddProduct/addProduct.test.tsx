import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import toast from "react-hot-toast";
import AddProduct from "../../../pages/Admin/AddProducts";
import serverAPI from "../../../helper/axios";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

// Mock dependencies
jest.mock("../../../helper/axios");
jest.mock("react-hot-toast", () => ({ error: jest.fn(), success: jest.fn() }));

// Mock components
jest.mock(
  "../../../components/shop/Admin/AddProduct/InputField",
  () =>
    ({
      name,
      onChange,
    }: {
      name: string;
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }) =>
      <input data-testid={name} name={name} onChange={onChange} />
);

jest.mock(
  "../../../components/shop/Admin/AddProduct/TextareaField",
  () =>
    ({
      name,
      onChange,
    }: {
      name: string;
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    }) =>
      <textarea data-testid={name} name={name} onChange={onChange} />
);

jest.mock(
  "../../../components/shop/Admin/AddProduct/CategorySelector",
  () =>
    ({
      setSelectedCategories,
    }: {
      setSelectedCategories: (categories: string[]) => void;
    }) =>
      (
        <select
          data-testid="category-selector"
          onChange={(e) => setSelectedCategories([e.target.value])}
        >
          <option value="Test Category">Test Category</option>
        </select>
      )
);

jest.mock(
  "../../../components/shop/Admin/AddProduct/ProductImageUpload",
  () =>
    ({ onImagesSelect }: { onImagesSelect: (files: File[]) => void }) =>
      (
        <input
          type="file"
          data-testid="image-upload"
          onChange={(e) => onImagesSelect(Array.from(e.target.files || []))}
        />
      )
);

describe("AddProduct Component", () => {
  const mockFile = new File(["image-content"], "test.jpg", {
    type: "image/jpeg",
  });

  // Define an interface for the form data
  interface FormData {
    name?: string;
    description?: string;
    price?: string;
    category?: string;
    includeImage?: boolean;
  }

  // Setup helper functions to reduce code duplication
  const fillForm = async (formData: FormData = {}) => {
    const {
      name = "Test Product",
      description = "Test Description",
      price = "10",
      category = "Test Category",
      includeImage = true,
    } = formData;

    fireEvent.change(screen.getByTestId("name"), { target: { value: name } });
    fireEvent.change(screen.getByTestId("description"), {
      target: { value: description },
    });
    fireEvent.change(screen.getByTestId("price"), { target: { value: price } });
    fireEvent.change(screen.getByTestId("category-selector"), {
      target: { value: category },
    });

    if (includeImage) {
      const fileInput = screen.getByTestId("image-upload");
      await userEvent.upload(fileInput, mockFile);
    }
  };

  const submitForm = () => {
    fireEvent.click(screen.getByRole("button", { name: /add product/i }));
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render form fields", () => {
    render(<AddProduct />);

    expect(screen.getByTestId("name")).toBeVisible();
    expect(screen.getByTestId("description")).toBeVisible();
    expect(screen.getByTestId("price")).toBeVisible();
    expect(screen.getByTestId("category-selector")).toBeVisible();
    expect(screen.getByTestId("image-upload")).toBeVisible();
    expect(screen.getByRole("button", { name: /add product/i })).toBeVisible();
  });

  it("should show an error if required fields are missing", async () => {
    render(<AddProduct />);
    submitForm();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Product name is required.");
    });
  });

  it("should validate price", async () => {
    render(<AddProduct />);
    await fillForm({ price: "-10" });
    submitForm();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Please enter a valid price.");
    });
  });

  it("should submit the form when all fields are valid", async () => {
    // Setup API mocks for successful submission
    (serverAPI.post as jest.Mock)
      .mockResolvedValueOnce({ data: { images: ["test.jpg"] } }) // Image upload
      .mockResolvedValueOnce({}); // Product submission

    render(<AddProduct />);
    await fillForm();

    // Verify file upload
    const fileInput = screen.getByTestId("image-upload") as HTMLInputElement;
    expect(fileInput.files).toHaveLength(1);
    expect(fileInput.files![0].name).toBe("test.jpg");

    submitForm();

    await waitFor(() => {
      // Verify API calls
      expect(serverAPI.post).toHaveBeenCalledTimes(2);
      expect(serverAPI.post).toHaveBeenNthCalledWith(
        1,
        "/product/upload-images",
        expect.any(FormData),
        expect.any(Object)
      );
      expect(serverAPI.post).toHaveBeenNthCalledWith(
        2,
        "/product/add-product",
        expect.any(Object),
        expect.any(Object)
      );
      expect(toast.success).toHaveBeenCalledWith("Product added successfully!");
    });
  });
});
