import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import ProductFilters from "../../../components/shop/Admin/ProductList/ProductFilters";
import { Table } from "@tanstack/react-table";
import type { IProduct } from "../../../types/Types";
import "@testing-library/jest-dom";

const setGlobalFilter = jest.fn();
const setSelectedCategories = jest.fn();

const mockTable = {
  getState: () => ({
    pagination: { pageSize: 10 },
  }),
  setPageSize: jest.fn(),
} as unknown as Table<IProduct>;

const setup = (props = {}) => {
  render(
    <MemoryRouter>
      <ProductFilters
        globalFilter=""
        setGlobalFilter={setGlobalFilter}
        selectedCategories={[]}
        setSelectedCategories={setSelectedCategories}
        table={mockTable}
        {...props}
      />
    </MemoryRouter>
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ProductFilters Component", () => {
  it("renders pagination dropdown and updates on change", () => {
    setup();

    const select = screen.getByRole("combobox");
    expect(select).toBeVisible();

    fireEvent.change(select, { target: { value: "20" } });
    expect(mockTable.setPageSize).toHaveBeenCalledWith(20);
  });

  it("renders search input and updates global filter", () => {
    setup();

    const searchInput = screen.getByPlaceholderText("Search...");
    expect(searchInput).toBeVisible();

    fireEvent.change(searchInput, { target: { value: "test" } });
    expect(setGlobalFilter).toHaveBeenCalledWith("test");
  });

  it("renders CategoryFilter component", () => {
    setup({ selectedCategories: ["category1"] });

    expect(screen.getByRole("combobox")).toBeVisible();
  });

  it("renders 'Add New Product' button with correct link", () => {
    setup();

    const addButton = screen.getByRole("button", {
      name: /\+ Add New Product/i,
    });
    expect(addButton).toBeVisible();

    const link = screen.getByRole("link", { name: /\+ Add New Product/i });
    expect(link).toHaveAttribute("href", "/admin/add-product");
  });
});
