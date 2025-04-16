import { renderHook, waitFor } from "@testing-library/react";
import { useCategories } from "../../hooks/useCategories";
import serverAPI from "../../helper/axios";
import { createWrapper } from "../../__mocks__/utils/testUtils";

jest.mock("../../helper/axios");

describe("useCategories Hook", () => {
  test("fetches categories successfully", async () => {
    const mockCategories = ["Dog Supplies", "Cat Supplies"];
    (serverAPI.get as jest.Mock).mockResolvedValue({ data: mockCategories });

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.categories).toEqual(mockCategories);
    expect(result.current.error).toBeNull();
  });

  test("handles API failure", async () => {
    (serverAPI.get as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch")
    );

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.categories).toEqual([]);
    expect(result.current.error).toBe("Failed to fetch categories");
  });
});
