import { renderHook } from "@testing-library/react";
import { useFilteredProducts } from "../../hooks/useFilteredProducts";
import { useCategories } from "../../hooks/useCategories";
import { mockProducts } from "../../__mocks__/mockProducts";

jest.mock("../../hooks/useCategories", () => ({
  useCategories: jest.fn(),
}));

describe("useFilteredProducts Hook", () => {
  beforeEach(() => {
    (useCategories as jest.Mock).mockReturnValue({
      categories: ["Dog Supplies", "Cat Supplies"],
    });
  });

  test("returns all products when no filters or search query applied", () => {
    const { result } = renderHook(() =>
      useFilteredProducts(mockProducts, { category: [] }, "")
    );

    expect(result.current.filteredProducts).toHaveLength(4);
    expect(result.current.productCounts).toEqual({
      "Dog Supplies": 2,
      "Cat Supplies": 2,
    });
  });

  test("filters products by search query", () => {
    const { result } = renderHook(() =>
      useFilteredProducts(mockProducts, { category: [] }, "chew")
    );

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toBe("Dog Chew Toy");
  });

  test("filters products by selected category", () => {
    const { result } = renderHook(() =>
      useFilteredProducts(mockProducts, { category: ["Dog Supplies"] }, "")
    );

    expect(result.current.filteredProducts).toHaveLength(2);
    expect(result.current.filteredProducts.map((p) => p.name)).toEqual([
      "Premium Dog Food",
      "Dog Chew Toy",
    ]);
  });

  test("filters products by both category and search query", () => {
    const { result } = renderHook(() =>
      useFilteredProducts(
        mockProducts,
        { category: ["Cat Supplies"] },
        "Litter"
      )
    );

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toBe("Cat Litter Box");
  });

  test("returns empty array when no products match filters", () => {
    const { result } = renderHook(() =>
      useFilteredProducts(mockProducts, { category: ["Reptile Supplies"] }, "")
    );

    expect(result.current.filteredProducts).toHaveLength(0);
    expect(result.current.productCounts).toEqual({
      "Dog Supplies": 0,
      "Cat Supplies": 0,
    });
  });
});
