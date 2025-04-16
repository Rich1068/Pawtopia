import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddProduct from "../../../pages/Admin/AddProducts";
import { useAddEditMutation } from "../../../hooks/useProducts";
import "@testing-library/jest-dom";
import { createWrapper } from "../../../__mocks__/utils/testUtils";
import { MemoryRouter } from "react-router";
import toast from "react-hot-toast";

const wrapper = createWrapper();

const renderComponent = () => {
  return render(
    wrapper({
      children: (
        <MemoryRouter>
          <AddProduct />
        </MemoryRouter>
      ),
    })
  );
};

global.URL.createObjectURL = jest.fn(() => "mock-url");

jest.mock("../../../hooks/useProducts", () => ({
  useAddEditMutation: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
  },
}));
jest.mock("../../../components/shop/Admin/AddProduct/CategorySelector", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ setSelectedCategories }: any) => (
    <div>
      <button onClick={() => setSelectedCategories(["mock-category"])}>
        Mock Category
      </button>
    </div>
  ),
}));

describe("AddProduct UI", () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    (useAddEditMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
  });

  afterAll(() => {
    (global.URL.createObjectURL as jest.Mock).mockReset();
  });

  it("renders form inputs", () => {
    renderComponent();
    expect(screen.getByLabelText(/Product Name/i)).toBeVisible();
    expect(screen.getByLabelText(/Description/i)).toBeVisible();
    expect(screen.getByLabelText(/Price/i)).toBeVisible();
    expect(screen.getByText(/Product Image/i)).toBeVisible();
  });

  it("shows validation error when required fields are empty", async () => {
    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /Add Product/i }));

    await waitFor(() => {
      expect(screen.getByTestId("input-name")).toBeInvalid();
    });
  });

  it("calls mutate with correct data on valid submission", async () => {
    renderComponent();
    fireEvent.change(screen.getByPlaceholderText(/Enter Product Name/i), {
      target: { value: "Test Product" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/Enter product description/i),
      {
        target: { value: "Test Description" },
      }
    );
    fireEvent.change(screen.getByPlaceholderText(/Enter Price/i), {
      target: { value: "99.99" },
    });

    fireEvent.click(screen.getByText("Mock Category"));

    const fileInput = screen.getByTestId("image-upload") as HTMLInputElement;
    const file = new File(["hello"], "cat.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });
    // Submit
    fireEvent.click(screen.getByRole("button", { name: /Add Product/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });
  });

  it("disables button and shows 'Saving...' when isPending is true", () => {
    (useAddEditMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    });

    renderComponent();
    const button = screen.getByRole("button", { name: /Saving.../i });
    expect(button).toBeDisabled();
  });

  it("renders image previews when product has existing images", () => {
    const mockProduct = {
      name: "Test Product",
      description: "Test description",
      price: "10",
      category: [],
      images: [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
      ],
    };
    render(
      wrapper({
        children: (
          <MemoryRouter>
            <AddProduct productToEdit={mockProduct} />
          </MemoryRouter>
        ),
      })
    );

    expect(screen.getAllByAltText("Preview")).toHaveLength(2);
  });
  it("shows toast and does not call mutate when price is invalid", async () => {
    const mockMutate = jest.fn();
    (useAddEditMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/Product Name/i), {
      target: { value: "Test Product" },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "A cool item" },
    });
    fireEvent.change(screen.getByLabelText(/Price/i), {
      target: { value: "-100" }, // invalid price
    });

    const fileInput = screen.getByTestId("image-upload") as HTMLInputElement;
    const file = new File(["hello"], "cat.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByRole("button", { name: /Add Product/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Please enter a valid price.");
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  it("calls updateProductImagesPreview when updatedProduct is truthy", async () => {
    const mockProductImages = ["img1.png", "img2.png"];

    (useAddEditMutation as jest.Mock).mockReturnValue({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mutate: ({ onSuccess }: any) => {
        onSuccess(mockProductImages);
      },
      isPending: false,
    });

    renderComponent();

    // Fill minimal fields
    fireEvent.change(screen.getByPlaceholderText(/Enter Product Name/i), {
      target: { value: "Test Product" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/Enter product description/i),
      {
        target: { value: "Description" },
      }
    );
    fireEvent.change(screen.getByPlaceholderText(/Enter Price/i), {
      target: { value: "100" },
    });

    // Add image
    const fileInput = screen.getByTestId("image-upload") as HTMLInputElement;
    const file = new File(["(⌐□_□)"], "coolcat.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Submit
    fireEvent.click(screen.getByRole("button", { name: /Add Product/i }));

    await waitFor(() => {
      // You can't test updateProductImagesPreview directly, but you can check that the new image previews exist
      expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
    });
  });
  it("clears form fields when updatedProduct is falsy", async () => {
    (useAddEditMutation as jest.Mock).mockReturnValue({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mutate: ({ onSuccess }: any) => {
        onSuccess(undefined);
      },
      isPending: false,
    });

    renderComponent();

    // Fill fields
    fireEvent.change(screen.getByPlaceholderText(/Enter Product Name/i), {
      target: { value: "Test Product" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/Enter product description/i),
      {
        target: { value: "Description" },
      }
    );
    fireEvent.change(screen.getByPlaceholderText(/Enter Price/i), {
      target: { value: "100" },
    });

    const fileInput = screen.getByTestId("image-upload") as HTMLInputElement;
    const file = new File(["hello"], "cat.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByRole("button", { name: /Add Product/i }));

    await waitFor(() => {
      expect(
        (screen.getByPlaceholderText(/Enter Product Name/i) as HTMLInputElement)
          .value
      ).toBe("");
      expect(
        (
          screen.getByPlaceholderText(
            /Enter product description/i
          ) as HTMLInputElement
        ).value
      ).toBe("");
      expect(
        (screen.getByPlaceholderText(/Enter Price/i) as HTMLInputElement).value
      ).toBe("");
    });
  });
});
