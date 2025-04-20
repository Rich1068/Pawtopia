/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import ProductFilters from "../../../components/shop/Admin/ProductList/ProductFilters";
import { MemoryRouter } from "react-router";
import "@testing-library/jest-dom";

jest.mock("../../../components/shop/Admin/ProductList/CategoryFilter", () => ({
  __esModule: true,
  default: ({ selectedCategories }: any) => (
    <div data-testid="category-filter">
      Mocked CategoryFilter — {selectedCategories.join(",")}
    </div>
  ),
}));

const mockSetGlobalFilter = jest.fn();
const mockSetSelectedCategories = jest.fn();
const mockSetStatusFilter = jest.fn();

const createMockTable = (): any => {
  return {
    getState: () => ({
      pagination: { pageSize: 20 },
    }),
    setPageSize: jest.fn(),
  };
};

const renderComponent = () => {
  const mockTable = createMockTable();

  render(
    <MemoryRouter>
      <ProductFilters
        globalFilter="cat"
        setGlobalFilter={mockSetGlobalFilter}
        selectedCategories={["Food"]}
        setSelectedCategories={mockSetSelectedCategories}
        statusFilter="Available"
        setStatusFilter={mockSetStatusFilter}
        table={mockTable}
      />
    </MemoryRouter>
  );

  return { mockTable };
};

describe("ProductFilters", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders dropdowns, search input, and add button", () => {
    renderComponent();

    expect(screen.getByDisplayValue("20")).toBeVisible();
    expect(screen.getByDisplayValue("Available")).toBeVisible();
    expect(screen.getByPlaceholderText("Search...")).toHaveValue("cat");
    expect(
      screen.getByRole("link", { name: "+ Add New Product" })
    ).toBeVisible();
    expect(screen.getByTestId("category-filter")).toBeVisible();
  });

  it("calls setGlobalFilter on search input change", () => {
    renderComponent();
    const input = screen.getByPlaceholderText("Search...");

    fireEvent.change(input, { target: { value: "dog" } });
    expect(mockSetGlobalFilter).toHaveBeenCalledWith("dog");
  });

  it("calls setStatusFilter on status dropdown change", () => {
    renderComponent();
    const statusSelect = screen.getByDisplayValue("Available");

    fireEvent.change(statusSelect, { target: { value: "Archived" } });
    expect(mockSetStatusFilter).toHaveBeenCalledWith("Archived");
  });

  it("calls table.setPageSize on page size dropdown change", () => {
    const { mockTable } = renderComponent();
    const sizeSelect = screen.getByDisplayValue("20");

    fireEvent.change(sizeSelect, { target: { value: "50" } });
    expect(mockTable.setPageSize).toHaveBeenCalledWith(50);
  });

  it("has correct link to add new product", () => {
    renderComponent();
    const addLink = screen.getByRole("link", { name: "+ Add New Product" });
    expect(addLink).toHaveAttribute("href", "/admin/add-product");
  });
});
