import { renderHook, act } from "@testing-library/react";
import { usePagination } from "../../hooks/usePagination";
import { petType } from "../../types/pet";

const mockPets: petType[] = [
  { id: "1", type: "animals", attributes: { name: "Buddy" } } as petType,
  { id: "2", type: "animals", attributes: { name: "Milo" } } as petType,
  { id: "3", type: "animals", attributes: { name: "Charlie" } } as petType,
  { id: "4", type: "animals", attributes: { name: "Luna" } } as petType,
];

describe("usePagination Hook", () => {
  it("initializes with first page and correct pets per page", () => {
    const { result } = renderHook(() => usePagination(mockPets, 2));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageCount).toBe(2); // 4 pets, 2 per page → 2 pages
    expect(result.current.currentPets).toHaveLength(2);
    expect(result.current.currentPets[0].id).toBe("1");
    expect(result.current.currentPets[1].id).toBe("2");
  });

  it("changes pages correctly", () => {
    const { result } = renderHook(() => usePagination(mockPets, 2));

    act(() => {
      result.current.setCurrentPage(2);
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.currentPets).toHaveLength(2);
    expect(result.current.currentPets[0].id).toBe("3");
    expect(result.current.currentPets[1].id).toBe("4");
  });

  //Emulate reduction of pets due to filter or other situation
  it("resets page when filteredPets change", () => {
    const { result, rerender } = renderHook(
      ({ pets }) => usePagination(pets, 2),
      {
        initialProps: { pets: mockPets },
      }
    );
    act(() => {
      result.current.setCurrentPage(2);
    });

    expect(result.current.currentPage).toBe(2);
    rerender({ pets: mockPets.slice(0, 2) });
    expect(result.current.currentPage).toBe(1);
  });
});
