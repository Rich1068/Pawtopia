import { renderHook, waitFor } from "@testing-library/react";
import {
  useAdminOrderHistory,
  useOrderHistory,
} from "../../hooks/useOrderHistory";
import serverAPI from "../../helper/axios";
import { createWrapper } from "../../__mocks__/utils/testUtils";
import { mockOrders } from "../../__mocks__/mockOrders";

const mockedServerAPI = serverAPI as jest.Mocked<typeof serverAPI>;

describe("useOrderHistory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches order history for regular user", async () => {
    mockedServerAPI.get.mockResolvedValueOnce({ data: mockOrders });

    const { result } = renderHook(() => useOrderHistory(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockOrders);
    expect(result.current.data?.[0].products).toHaveLength(2);
    expect(result.current.data?.[0].totalAmount).toBe(99.99);
    expect(mockedServerAPI.get).toHaveBeenCalledWith("/order/history", {
      withCredentials: true,
    });
  });

  it("fetches admin order history", async () => {
    mockedServerAPI.get.mockResolvedValueOnce({ data: mockOrders });

    const { result } = renderHook(() => useAdminOrderHistory(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockOrders);
    expect(result.current.data?.[0].products).toHaveLength(2);
    expect(result.current.data?.[0].totalAmount).toBe(99.99);
    expect(mockedServerAPI.get).toHaveBeenCalledWith("/order/all", {
      withCredentials: true,
    });
  });

  it("handles error when fetching order history", async () => {
    mockedServerAPI.get.mockRejectedValueOnce(new Error("Network Error"));

    const { result } = renderHook(() => useOrderHistory(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockedServerAPI.get).toHaveBeenCalledWith("/order/history", {
      withCredentials: true,
    });
  });
});
