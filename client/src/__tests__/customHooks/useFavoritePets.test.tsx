import { renderHook, waitFor } from "@testing-library/react";
import { useFavoritePets } from "../../hooks/useFavoritePets";
import { createWrapper } from "../../__mocks__/utils/testUtils";
import serverAPI from "../../helper/axios";

jest.mock("../../helper/axios");

jest.mock("../../context/FavoritesContext", () => ({
  useFavorites: jest.fn(),
}));

import { useFavorites } from "../../context/FavoritesContext";

const mockPetData = [
  { id: "123", name: "Buddy", type: "Dog" },
  { id: "456", name: "Whiskers", type: "Cat" },
];

describe("useFavoritePets", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and returns favorite pets", async () => {
    (useFavorites as jest.Mock).mockReturnValue({
      favorites: [{ petId: "123" }, { petId: "456" }],
    });

    (serverAPI.post as jest.Mock).mockResolvedValueOnce({
      data: { pets: mockPetData },
    });

    const { result } = renderHook(() => useFavoritePets(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockPetData);
  });

  it("does not fetch if no favorites exist", async () => {
    (useFavorites as jest.Mock).mockReturnValue({
      favorites: [],
    });

    const { result } = renderHook(() => useFavoritePets(), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(result.current.data).toBeUndefined();
  });

  it("handles API errors", async () => {
    (useFavorites as jest.Mock).mockReturnValue({
      favorites: [{ petId: "123" }],
    });

    (serverAPI.post as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

    const { result } = renderHook(() => useFavoritePets(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBeInstanceOf(Error);
    });
  });
});
