import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import toast from "react-hot-toast";
import AddProduct from "../../../pages/Admin/AddProducts";
import serverAPI from "../../../helper/axios";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderComponent = (productToEdit?: any) => {
  return render(
    <MemoryRouter>
      <AddProduct productToEdit={productToEdit} />
    </MemoryRouter>
  );
};
jest.mock("../../../helper/axios", () => ({
  post: jest.fn().mockImplementation((url) => {
    if (url === "/product/upload-images") {
      return Promise.resolve({ data: { images: ["test.jpg"] } });
    }
    return Promise.resolve({});
  }),
}));

jest.mock("react-hot-toast", () => ({ error: jest.fn(), success: jest.fn() }));

jest.mock("../../../components/shop/Admin/TitleComponent", () => () => (
  <div data-testid="mock-title-component" />
));
jest.mock(
  "../../../components/shop/Admin/AddProduct/InputField",
  () =>
    ({
      name,
      value,
      onChange,
    }: {
      name: string;
      value: string;
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }) =>
      <input data-testid={name} name={name} value={value} onChange={onChange} />
);

jest.mock(
  "../../../components/shop/Admin/AddProduct/TextareaField",
  () =>
    ({
      name,
      value,
      onChange,
    }: {
      name: string;
      value: string;
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    }) =>
      (
        <textarea
          data-testid={name}
          name={name}
          value={value}
          onChange={onChange}
        />
      )
);

jest.mock(
  "../../../components/shop/Admin/AddProduct/CategorySelector",
  () =>
    ({
      selectedCategories,
      setSelectedCategories,
    }: {
      selectedCategories: string[];
      setSelectedCategories: (categories: string[]) => void;
    }) =>
      (
        <select
          data-testid="category-selector"
          value={selectedCategories[0] || ""}
          onChange={(e) => setSelectedCategories([e.target.value])}
        >
          <option value="Test Category">Test Category</option>
        </select>
      )
);

jest.mock(
  "../../../components/shop/Admin/AddProduct/ProductImageUpload",
  () =>
    ({
      productImages,
      setProductImages,
    }: {
      productImages: { preview: string; isNew: boolean }[];
      setProductImages: (images: { preview: string; isNew: boolean }[]) => void;
    }) =>
      (
        <input
          type="file"
          data-testid="image-upload"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            const newImages = files.map((file) => ({
              preview: URL.createObjectURL(file),
              file,
              isNew: true,
            }));
            setProductImages([...productImages, ...newImages]);
          }}
        />
      )
);

describe("AddProduct Component", () => {
  const mockFile = new File(["image-content"], "test.jpg", {
    type: "image/jpeg",
  });

  // Helper function to fill form fields
  const fillForm = async ({
    name = "Test Product",
    description = "Test Description",
    price = "10",
    category = "Test Category",
    includeImage = true,
  } = {}) => {
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

  const submitForm = (text = "Add Product") => {
    fireEvent.click(
      screen.getByRole("button", { name: new RegExp(text, "i") })
    );
  };
  beforeAll(() => {
    URL.createObjectURL = jest.fn(() => "mocked-image-url");
  });
  beforeEach(() => {
    jest.clearAllMocks();
    (serverAPI.put as jest.Mock) = jest.fn().mockResolvedValueOnce({});
  });

  it("should render form fields correctly", () => {
    renderComponent();

    expect(screen.getByTestId("name")).toBeVisible();
    expect(screen.getByTestId("description")).toBeVisible();
    expect(screen.getByTestId("price")).toBeVisible();
    expect(screen.getByTestId("category-selector")).toBeVisible();
    expect(screen.getByTestId("image-upload")).toBeVisible();
    expect(screen.getByRole("button", { name: /add product/i })).toBeVisible();
  });

  it("should show an error if required fields are missing", async () => {
    renderComponent();
    submitForm();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Product name is required.");
    });
  });

  it("should validate price", async () => {
    renderComponent();
    await fillForm({ price: "-10" });
    submitForm();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Please enter a valid price.");
    });
  });

  it("should submit the form when all fields are valid", async () => {
    // Mock API response
    (serverAPI.post as jest.Mock)
      .mockResolvedValueOnce({ data: { images: ["test.jpg"] } }) // Image upload response
      .mockResolvedValueOnce({}); // Product submission response

    renderComponent();
    await fillForm({ includeImage: true });

    // Check file upload
    const fileInput = screen.getByTestId("image-upload") as HTMLInputElement;
    expect(fileInput.files).toHaveLength(1);
    expect(fileInput.files![0].name).toBe("test.jpg");
    expect(
      screen.queryByText("Please enter a valid price.")
    ).not.toBeInTheDocument();
    submitForm();
    await waitFor(() => {
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

  it("should correctly handle editing an existing product", async () => {
    const productToEdit = {
      _id: "123",
      name: "Existing Product",
      description: "Existing Description",
      price: "20",
      category: ["Test Category"],
      images: ["existing.jpg"],
    };
    renderComponent(productToEdit);

    expect(screen.getByTestId("name")).toHaveValue("Existing Product");
    expect(screen.getByTestId("description")).toHaveValue(
      "Existing Description"
    );
    expect(screen.getByTestId("price")).toHaveValue("20");
    expect(screen.getByTestId("category-selector")).toHaveValue(
      "Test Category"
    );

    // Simulate form update and submission
    await fillForm({ name: "Updated Product" });
    submitForm("Update Product");

    await waitFor(() => {
      expect(serverAPI.put).toHaveBeenCalledWith(
        `/product/${productToEdit._id}`,
        expect.objectContaining({ name: "Updated Product" }),
        expect.any(Object)
      );
      expect(toast.success).toHaveBeenCalledWith(
        "Product updated successfully!"
      );
    });
  });
  it("should show an error if image upload fails", async () => {
    (serverAPI.post as jest.Mock)
      .mockRejectedValueOnce(new Error("Failed to upload"))
      .mockResolvedValueOnce({});

    renderComponent();
    await fillForm({ includeImage: true });

    submitForm();

    await waitFor(() => {
      expect(serverAPI.post).toHaveBeenCalledWith(
        "/product/upload-images",
        expect.any(FormData),
        expect.any(Object)
      );
      expect(toast.error).toHaveBeenCalledWith("Error uploading images.");
    });
  });
});
