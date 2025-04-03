import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Shop, { fetchProducts } from "../../pages/Shop"; // Update path as needed
import serverAPI from "../../helper/axios";
import { IProduct } from "../../types/Types";
import { mockProducts } from "../../__mocks__/mockProducts";
import "@testing-library/jest-dom";

jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
}));

jest.mock("../../helper/axios", () => ({
  get: jest.fn(),
}));

jest.mock("../../components/PageHeader", () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => (
    <div data-testid="page-header">{text}</div>
  ),
}));

jest.mock("../../components/LoadingPage/LoadingPage", () => ({
  __esModule: true,
  default: () => <div data-testid="loading-page">Loading...</div>,
}));

jest.mock("../../components/shop/ShopPage/ShopContainer", () => ({
  __esModule: true,
  default: ({ allProducts }: { allProducts: IProduct[] }) => (
    <div data-testid="shop-container">
      {allProducts.map((product) => (
        <div key={product._id} data-testid="product-item">
          {product.name}
        </div>
      ))}
    </div>
  ),
}));

describe("Shop Component", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    jest.clearAllMocks();
  });

  test("should render loading state initially", () => {
    (serverAPI.get as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolving promise to keep loading state
    );

    render(
      <QueryClientProvider client={queryClient}>
        <Shop />
      </QueryClientProvider>
    );

    expect(screen.getByTestId("loading-page")).toBeVisible();
  });

  test("should render shop with products after loading", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValue({
      data: { data: mockProducts },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <Shop />
      </QueryClientProvider>
    );

    // Check loading state first
    expect(screen.getByTestId("loading-page")).toBeVisible();

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByTestId("page-header")).toBeVisible();
    });

    expect(screen.getByTestId("page-header")).toHaveTextContent("Shop");
    expect(screen.getByTestId("shop-container")).toBeVisible();
    expect(screen.getAllByTestId("product-item")).toHaveLength(5);
  });

  test("should show error toast when API call fails", async () => {
    const errorMessage = "Network Error";
    (serverAPI.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

    render(
      <QueryClientProvider client={queryClient}>
        <Shop />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Fetch Products error. Please try again later!"
      );
    });
  });
  describe("fetchProducts function", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("should return products when API call succeeds", async () => {
      (serverAPI.get as jest.Mock).mockResolvedValue({
        data: { data: mockProducts },
      });

      const result = await fetchProducts();

      expect(result).toEqual(mockProducts);
      expect(serverAPI.get).toHaveBeenCalledWith("/product/get-products");
    });

    test("should throw error when API call fails", async () => {
      const errorMessage = "Network Error";
      (serverAPI.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(fetchProducts()).rejects.toThrow();
      expect(toast.error).toHaveBeenCalledWith(
        "Fetch Products error. Please try again later!"
      );
    });
  });
});
