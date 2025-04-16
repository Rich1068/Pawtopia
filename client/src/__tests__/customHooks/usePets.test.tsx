import { renderHook, waitFor } from "@testing-library/react";
import { useAllPets, usePetData } from "../../hooks/usePets";
import serverAPI from "../../helper/axios";
import { createWrapper } from "../../__mocks__/utils/testUtils";
import { mockPets } from "../../__mocks__/mockPets";
import { useParams } from "react-router";

const mockedUseParams = useParams as jest.Mock;

const mockedServerAPI = serverAPI as jest.Mocked<typeof serverAPI>;

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useParams: jest.fn(),
}));
describe("usePets Hook", () => {
  describe("useAllPets", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("fetches all available pets", async () => {
      mockedServerAPI.get.mockResolvedValueOnce({ data: { data: mockPets } });

      const { result } = renderHook(() => useAllPets(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockPets);
      expect(mockedServerAPI.get).toHaveBeenCalledWith("/pet/getAvailablePets");
    });

    it("handles error when fetching pets", async () => {
      mockedServerAPI.get.mockRejectedValueOnce(new Error("Network Error"));

      const { result } = renderHook(() => useAllPets(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(mockedServerAPI.get).toHaveBeenCalledWith("/pet/getAvailablePets");
    });
  });

  describe("usePetData", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("fetches pet data for a given pet ID", async () => {
      mockedUseParams.mockReturnValue({ id: "10217455" });
      mockedServerAPI.get.mockResolvedValueOnce({
        data: { data: [mockPets[0]] },
      });

      const { result } = renderHook(() => usePetData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockPets[0]);
      expect(mockedServerAPI.get).toHaveBeenCalledWith(
        "pet/get-pet-data/10217455"
      );
    });

    it("returns null if pet data is not found", async () => {
      mockedUseParams.mockReturnValue({ id: "10217455" });
      mockedServerAPI.get.mockResolvedValueOnce({ data: { data: [] } });

      const { result } = renderHook(() => usePetData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeNull();
      expect(mockedServerAPI.get).toHaveBeenCalledWith(
        "pet/get-pet-data/10217455"
      );
    });

    it("handles error when fetching pet data", async () => {
      mockedUseParams.mockReturnValue({ id: "10217455" });
      mockedServerAPI.get.mockRejectedValueOnce(new Error("Network Error"));

      const { result } = renderHook(() => usePetData(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(mockedServerAPI.get).toHaveBeenCalledWith(
        "pet/get-pet-data/10217455"
      );
    });
  });
});
