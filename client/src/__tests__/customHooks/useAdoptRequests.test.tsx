import { renderHook, waitFor } from "@testing-library/react";
import {
  useAllAdoptRequests,
  useAdoptRequestAction,
  useAdoptRequestHistory,
} from "../../hooks/useAdoptRequests";
import serverAPI from "../../helper/axios";
import toast from "react-hot-toast";
import { createWrapper } from "../../__mocks__/utils/testUtils";

jest.mock("../../helper/axios");

jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

const mockedServerAPI = serverAPI as jest.Mocked<typeof serverAPI>;

describe("useAdoptRequest hook", () => {
  describe("useAllAdoptRequests", () => {
    it("fetches adopt requests with given status", async () => {
      mockedServerAPI.get.mockResolvedValueOnce({
        data: [
          { id: "1", petName: "Luna", status: "pending" },
          { id: "2", petName: "Max", status: "pending" },
        ],
      });

      const { result } = renderHook(() => useAllAdoptRequests("pending"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toHaveLength(2);
      expect(mockedServerAPI.get).toHaveBeenCalledWith("/adopt/requests", {
        params: { status: "pending" },
        withCredentials: true,
      });
    });
  });

  describe("useAdoptRequestAction", () => {
    it("approves an adopt request", async () => {
      mockedServerAPI.put.mockResolvedValueOnce({ data: { success: true } });

      const { result } = renderHook(() => useAdoptRequestAction(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync({ id: "123", action: "approve" });

      expect(mockedServerAPI.put).toHaveBeenCalledWith(
        "/adopt/123/approve",
        {},
        { withCredentials: true }
      );
    });

    it("calls toast.error with API error message from response", async () => {
      const errorMessage = "You are not authorized";

      mockedServerAPI.put.mockRejectedValueOnce({
        response: {
          data: { error: errorMessage },
        },
      });

      const { result } = renderHook(() => useAdoptRequestAction(), {
        wrapper: createWrapper(),
      });

      result.current.mutate({ id: "123", action: "reject" });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });
  it("calls toast.error with fallback message if no error message provided", async () => {
    mockedServerAPI.put.mockRejectedValueOnce({});

    const { result } = renderHook(() => useAdoptRequestAction(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: "123", action: "reject" });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(toast.error).toHaveBeenCalledWith("Something went wrong");
  });

  describe("useAdoptRequestHistory", () => {
    it("fetches adoption history successfully", async () => {
      mockedServerAPI.get.mockResolvedValueOnce({
        data: [{ id: "3", petName: "Charlie", status: "approved" }],
      });

      const { result } = renderHook(() => useAdoptRequestHistory(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.[0].petName).toBe("Charlie");
      expect(mockedServerAPI.get).toHaveBeenCalledWith("/adopt/history", {
        withCredentials: true,
      });
    });
  });
});
