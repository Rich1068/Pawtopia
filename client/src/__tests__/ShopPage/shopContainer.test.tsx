import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ShopContainer from "../../components/shop/ShopPage/ShopContainer";
import { useFilteredProducts } from "../../hooks/useFilteredProducts";
import { usePagination } from "../../hooks/usePagination";
import { mockProducts } from "../../__mocks__/mockProducts";
import "@testing-library/jest-dom";

jest.mock("../../hooks/useFilteredProducts", () => ({
  useFilteredProducts: jest.fn(),
}));

jest.mock("../../hooks/usePagination", () => ({
  usePagination: jest.fn(),
}));

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: jest.fn(() => <div data-testid="mock-icon" />),
}));

jest.mock("react-paginate", () => {
  return jest.fn(({ onPageChange }) => (
    <div data-testid="paginate">
      <button
        onClick={() => onPageChange({ selected: 0 })}
        data-testid="page-1"
      >
        1
      </button>
      <button
        onClick={() => onPageChange({ selected: 1 })}
        data-testid="page-2"
      >
        2
      </button>
    </div>
  ));
});

// Mock ShopCards component
jest.mock("../../components/shop/ShopPage/ShopCards", () => {
  return jest.fn(({ products }) => (
    <div data-testid="shop-cards">{products.length} products displayed</div>
  ));
});

// Mock ShopFilter component
jest.mock("../../components/shop/ShopPage/ShopFilter", () => {
  return jest.fn(({ selected, setSelected, searchQuery, setSearchQuery }) => (
    <div data-testid="shop-filter">
      <input
        data-testid="search-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        data-testid="filter-button"
        onClick={() => setSelected({ ...selected, category: ["Dog Supplies"] })}
      >
        Apply Filter
      </button>
    </div>
  ));
});

describe("ShopContainer Component", () => {
  const mockFilteredProducts = mockProducts.slice(0, 3);
  const mockCurrentProducts = mockProducts.slice(0, 2);
  const mockProductCounts = { "Dog Supplies": 2, "Cat Supplies": 2 };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the return values of our custom hooks
    (useFilteredProducts as jest.Mock).mockReturnValue({
      filteredProducts: mockFilteredProducts,
      productCounts: mockProductCounts,
    });

    (usePagination as jest.Mock).mockReturnValue({
      currentItems: mockCurrentProducts,
      currentPage: 1,
      setCurrentPage: jest.fn(),
      pageCount: 2,
    });
  });

  test("renders ShopContainer with initial state from localStorage", () => {
    // Setup localStorage with initial filters
    localStorageMock.getItem.mockReturnValueOnce(
      JSON.stringify({ category: ["Dog Supplies"] })
    );

    render(<ShopContainer allProducts={mockProducts} />);

    expect(localStorageMock.getItem).toHaveBeenCalledWith(
      "selectedProductFilters"
    );
    expect(useFilteredProducts).toHaveBeenCalledWith(
      mockProducts,
      expect.objectContaining({ category: ["Dog Supplies"] }),
      ""
    );
  });

  test("renders ShopContainer with empty localStorage", () => {
    // Setup localStorage to return null
    localStorageMock.getItem.mockReturnValueOnce(null);

    render(<ShopContainer allProducts={mockProducts} />);

    expect(localStorageMock.getItem).toHaveBeenCalledWith(
      "selectedProductFilters"
    );
    expect(useFilteredProducts).toHaveBeenCalledWith(
      mockProducts,
      expect.objectContaining({ category: [] }),
      ""
    );
  });

  test("updates localStorage when selected filters change", async () => {
    render(<ShopContainer allProducts={mockProducts} />);

    const filterButton = screen.getByTestId("filter-button");
    fireEvent.click(filterButton);

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "selectedProductFilters",
        JSON.stringify({ category: ["Dog Supplies"] })
      );
    });
  });

  test("updates search query and passes to useFilteredProducts", () => {
    render(<ShopContainer allProducts={mockProducts} />);

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "dog food" } });

    expect(useFilteredProducts).toHaveBeenCalledWith(
      mockProducts,
      expect.anything(),
      "dog food"
    );
  });

  test("displays pagination when filtered products exist", () => {
    render(<ShopContainer allProducts={mockProducts} />);

    expect(screen.getByTestId("paginate")).toBeVisible();
  });

  test("does not display pagination when no filtered products", () => {
    (useFilteredProducts as jest.Mock).mockReturnValue({
      filteredProducts: [],
      productCounts: {},
    });

    render(<ShopContainer allProducts={mockProducts} />);

    expect(screen.queryByTestId("paginate")).not.toBeInTheDocument();
  });

  test("handles page change", () => {
    const mockSetCurrentPage = jest.fn();
    (usePagination as jest.Mock).mockReturnValue({
      currentItems: mockCurrentProducts,
      currentPage: 1,
      setCurrentPage: mockSetCurrentPage,
      pageCount: 2,
    });

    render(<ShopContainer allProducts={mockProducts} />);

    const page2Button = screen.getByTestId("page-2");
    fireEvent.click(page2Button);

    expect(mockSetCurrentPage).toHaveBeenCalledWith(2);
  });

  describe("Mobile filter functionality", () => {
    test("filter is initially closed on mobile", () => {
      render(<ShopContainer allProducts={mockProducts} />);
      expect(screen.queryByText("✖")).not.toBeInTheDocument();
    });

    test("toggles filter visibility on mobile when filter button is clicked", () => {
      render(<ShopContainer allProducts={mockProducts} />);
      const filterToggleButton = screen.getByText("Filters");
      fireEvent.click(filterToggleButton);

      expect(screen.getByText("✖")).toBeVisible();
      fireEvent.click(screen.getByText("✖"));

      expect(screen.queryByText("✖")).not.toBeInTheDocument();
    });
  });

  test("passes correct props to ShopCards", () => {
    render(<ShopContainer allProducts={mockProducts} />);

    expect(screen.getByTestId("shop-cards")).toHaveTextContent(
      "2 products displayed"
    );
  });

  test("filters products by category correctly", () => {
    // Set up our mock to test category filtering
    const dogSuppliesMock = mockProducts.filter((product) =>
      product.category.includes("Dog Supplies")
    );

    (useFilteredProducts as jest.Mock).mockReturnValueOnce({
      filteredProducts: dogSuppliesMock,
      productCounts: { "Dog Supplies": 2 },
    });

    (usePagination as jest.Mock).mockReturnValueOnce({
      currentItems: dogSuppliesMock,
      currentPage: 1,
      setCurrentPage: jest.fn(),
      pageCount: 1,
    });

    render(<ShopContainer allProducts={mockProducts} />);

    const filterButton = screen.getByTestId("filter-button");
    fireEvent.click(filterButton);

    expect(useFilteredProducts).toHaveBeenCalledWith(
      mockProducts,
      expect.objectContaining({ category: ["Dog Supplies"] }),
      expect.anything()
    );
  });
});
