import { renderHook, act } from "@testing-library/react";
import { usePagination } from "../../hooks/usePagination";

// Mock data (generic instead of petType)
const mockItems = [
  { id: "1", name: "Item 1" },
  { id: "2", name: "Item 2" },
  { id: "3", name: "Item 3" },
  { id: "4", name: "Item 4" },
];

describe("usePagination Hook", () => {
  it("initializes with the first page and correct items per page", () => {
    const { result } = renderHook(() => usePagination(mockItems, 2));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageCount).toBe(2); // 4 items, 2 per page → 2 pages
    expect(result.current.currentItems).toHaveLength(2);
    expect(result.current.currentItems[0].id).toBe("1");
    expect(result.current.currentItems[1].id).toBe("2");
  });

  it("changes pages correctly", () => {
    const { result } = renderHook(() => usePagination(mockItems, 2));

    act(() => {
      result.current.setCurrentPage(2);
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.currentItems).toHaveLength(2);
    expect(result.current.currentItems[0].id).toBe("3");
    expect(result.current.currentItems[1].id).toBe("4");
  });

  it("does not allow pages beyond the last page", () => {
    const { result } = renderHook(() => usePagination(mockItems, 2));

    act(() => {
      result.current.setCurrentPage(3);
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.currentItems).toEqual([
      { id: "3", name: "Item 3" },
      { id: "4", name: "Item 4" },
    ]);
  });

  it("resets page when the items array changes", () => {
    const { result, rerender } = renderHook(
      ({ items }) => usePagination(items, 2),
      {
        initialProps: { items: mockItems },
      }
    );

    act(() => {
      result.current.setCurrentPage(2);
    });

    expect(result.current.currentPage).toBe(2);

    rerender({ items: mockItems.slice(0, 2) }); // Reduce items to 2

    expect(result.current.currentPage).toBe(1);
    expect(result.current.currentItems).toHaveLength(2);
  });

  it("handles empty array gracefully", () => {
    const { result } = renderHook(() => usePagination([], 2));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageCount).toBe(1);
    expect(result.current.currentItems).toEqual([]);
  });
});
