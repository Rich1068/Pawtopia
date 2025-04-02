import { render, screen, fireEvent } from "@testing-library/react";
import ShopFilter from "../../components/shop/ShopPage/ShopFilter";
import { useCategories } from "../../hooks/useCategories";
import { mockProducts } from "../../__mocks__/mockProducts";
import "@testing-library/jest-dom";

jest.mock("../../hooks/useCategories", () => ({
  useCategories: jest.fn(),
}));

const mockCategories = ["Dog Supplies", "Cat Supplies"];

const mockProductCounts: Record<string, number> = {
  "Dog Supplies": 2,
  "Cat Supplies": 2,
};

describe("ShopFilter Component", () => {
  // Setup mock functions and props
  const mockSetSelected = jest.fn();
  const mockSetSearchQuery = jest.fn();
  const defaultProps = {
    selected: { category: [] },
    setSelected: mockSetSelected,
    productCounts: mockProductCounts,
    searchQuery: "",
    setSearchQuery: mockSetSearchQuery,
    filteredProducts: mockProducts,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useCategories as jest.Mock).mockReturnValue({
      categories: mockCategories,
    });
  });

  it("renders the component with correct title and product count", () => {
    render(<ShopFilter {...defaultProps} />);

    expect(screen.getByText(`Filters (${mockProducts.length})`)).toBeVisible();
  });

  it("renders the search input", () => {
    render(<ShopFilter {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText("Search for a product...");
    expect(searchInput).toBeVisible();
  });

  it("renders the reset button", () => {
    render(<ShopFilter {...defaultProps} />);

    const resetButton = screen.getByText("Reset");
    expect(resetButton).toBeVisible();
  });

  it("renders all categories from the hook", () => {
    render(<ShopFilter {...defaultProps} />);

    expect(screen.getByText("Category")).toBeVisible();
    fireEvent.click(screen.getByText("Category"));

    mockCategories.forEach((category) => {
      expect(screen.getByText(new RegExp(category, "i"))).toBeVisible();
    });
  });

  it("search input updates search query", () => {
    render(<ShopFilter {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText("Search for a product...");
    fireEvent.change(searchInput, { target: { value: "dog food" } });

    expect(mockSetSearchQuery).toHaveBeenCalledWith("dog food");
  });

  it("reset button clears search query and category selections", () => {
    render(<ShopFilter {...defaultProps} />);

    const resetButton = screen.getByText("Reset");
    fireEvent.click(resetButton);

    expect(mockSetSearchQuery).toHaveBeenCalledWith("");
    expect(mockSetSelected).toHaveBeenCalledWith({ category: [] });
  });

  it("checkbox changes update the selected filters - add item", () => {
    render(<ShopFilter {...defaultProps} />);

    const dogSuppliesCheckbox = screen.getByText("Dog Supplies (2)");
    fireEvent.click(dogSuppliesCheckbox);

    expect(mockSetSelected).toHaveBeenCalled();
    const setSelectedCall = mockSetSelected.mock.calls[0][0];
    const result = setSelectedCall({ category: [] });
    expect(result).toEqual({ category: ["Dog Supplies"] });
  });

  it("checkbox changes update the selected filters - remove item", () => {
    render(
      <ShopFilter
        {...{ ...defaultProps, selected: { category: ["Dog Supplies"] } }}
      />
    );

    const dogSuppliesCheckbox = screen.getByText("Dog Supplies (2)");
    fireEvent.click(dogSuppliesCheckbox);

    expect(mockSetSelected).toHaveBeenCalled();
    const setSelectedCall = mockSetSelected.mock.calls[0][0];

    const result = setSelectedCall({ category: ["Dog Supplies"] });
    expect(result).toEqual({ category: [] });
  });

  it("handles multiple category selections", () => {
    render(
      <ShopFilter
        {...{ ...defaultProps, selected: { category: ["Dog Supplies"] } }}
      />
    );

    const catSuppliesCheckbox = screen.getByText("Cat Supplies (2)");
    fireEvent.click(catSuppliesCheckbox);

    expect(mockSetSelected).toHaveBeenCalled();
    const setSelectedCall = mockSetSelected.mock.calls[0][0];
    const result = setSelectedCall({ category: ["Dog Supplies"] });
    expect(result).toEqual({ category: ["Dog Supplies", "Cat Supplies"] });
  });

  it("handles search with filtered results", () => {
    // Setup props with an existing search query
    const propsWithSearch = {
      ...defaultProps,
      searchQuery: "Cat",
      filteredProducts: mockProducts.filter((p) => p.name.includes("Cat")),
    };

    render(<ShopFilter {...propsWithSearch} />);

    // Check if filter title shows correct number of filtered products
    expect(
      screen.getByText(`Filters (${propsWithSearch.filteredProducts.length})`)
    ).toBeVisible();
  });

  it("handles empty categories array", () => {
    // Mock useCategories to return empty array
    (useCategories as jest.Mock).mockReturnValue({
      categories: [],
    });

    render(<ShopFilter {...defaultProps} />);

    // Component should render without crashing
    expect(screen.getByText(`Filters (${mockProducts.length})`)).toBeVisible();
  });

  it("handles undefined selected categories", () => {
    render(<ShopFilter {...{ ...defaultProps, selected: {} }} />);

    // Component should render without crashing
    expect(screen.getByText(`Filters (${mockProducts.length})`)).toBeVisible();
  });
});
