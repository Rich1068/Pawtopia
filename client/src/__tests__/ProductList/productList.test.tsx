/* eslint-disable @typescript-eslint/no-explicit-any */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ProductList from "../../pages/Admin/ProductList";
import { useProducts } from "../../hooks/useProducts";
import "@testing-library/jest-dom";
import { mockProducts } from "../../__mocks__/mockProducts";

// Mock the custom hook and components
jest.mock("../../hooks/useProducts");
jest.mock("lucide-react");
jest.mock("../../components/shop/Admin/ProductList/ProductFilters", () => ({
  __esModule: true,
  default: ({ globalFilter }: any) => <div>Mocked Filters: {globalFilter}</div>,
}));
jest.mock(
  "../../components/shop/Admin/ProductList/ProductActionButtons",
  () => ({
    __esModule: true,
    default: ({ row }: any) => (
      <div>
        <button onClick={() => row.handleDelete(row.original._id)}>
          Delete
        </button>
        <button onClick={() => row.handleArchive(row.original._id)}>
          Archive
        </button>
        <button onClick={() => row.handleRecover(row.original._id)}>
          Recover
        </button>
      </div>
    ),
  })
);

jest.mock("../../components/shop/Admin/TitleComponent", () => ({
  __esModule: true,
  default: ({ text }: any) => <h1>{text}</h1>,
}));

describe("ProductList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useProducts as jest.Mock).mockReturnValue({
      products: mockProducts,
      isLoading: false,
      error: null,
      deleteProduct: { mutateAsync: jest.fn() },
      archiveProduct: { mutateAsync: jest.fn() },
      recoverProduct: { mutateAsync: jest.fn() },
    });
  });

  it("renders and displays products with images and names", async () => {
    render(<ProductList />);

    // Title
    expect(screen.getByText("Product List")).toBeVisible();

    // Wait for products to render
    await waitFor(() => {
      mockProducts.forEach((product) => {
        expect(screen.getByText(product.name)).toBeVisible();
      });
    });

    // Check that images are rendered (except for the product with no image)
    const imageElements = screen.getAllByAltText(
      "Product"
    ) as HTMLImageElement[];
    expect(imageElements.length).toBe(5);

    // Check image source contains file names
    expect(imageElements[0].src).toContain("dog_food.jpeg");
    expect(imageElements[1].src).toContain("scratching_post.jpeg");
    expect(imageElements[2].src).toContain("dog_toy.jpeg");
    expect(imageElements[3].src).toContain("litter_box.jpeg");
  });

  it("shows loading state if data is loading", () => {
    (useProducts as jest.Mock).mockReturnValue({
      products: [],
      isLoading: true,
      error: null,
      deleteProduct: { mutateAsync: jest.fn() },
      archiveProduct: { mutateAsync: jest.fn() },
      recoverProduct: { mutateAsync: jest.fn() },
    });

    render(<ProductList />);
    expect(screen.getByTestId("icon-LoaderCircle")).toBeVisible();
  });

  it("shows error state", () => {
    (useProducts as jest.Mock).mockReturnValue({
      products: [],
      isLoading: false,
      error: true,
      deleteProduct: { mutateAsync: jest.fn() },
      archiveProduct: { mutateAsync: jest.fn() },
      recoverProduct: { mutateAsync: jest.fn() },
    });

    render(<ProductList />);
    expect(screen.getByText("Error loading products")).toBeVisible();
  });

  it("replaces broken image with fallback logo", async () => {
    render(<ProductList />);

    const brokenImage = (
      await screen.findAllByAltText("Product", {}, { timeout: 1000 })
    )[0];
    fireEvent.error(brokenImage);

    expect(brokenImage).toHaveAttribute(
      "src",
      expect.stringContaining("/assets/img/Logo1.png")
    );
  });
});
