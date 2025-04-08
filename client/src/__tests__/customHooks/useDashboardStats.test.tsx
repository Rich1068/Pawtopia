import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import serverAPI from "../../helper/axios";
import {
  useAdminStats,
  useAdoptionStats,
  useMostSoldProducts,
  useEarningsStats,
  usePendingRequests,
  useRecentOrders,
} from "../../hooks/useDashboardStats";
import { mockAdoptRequests } from "../../__mocks__/mockAdoptRequests";
import { mockOrders } from "../../__mocks__/mockOrders";

jest.mock("../../helper/axios");

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("Admin Dashboard Hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Mock data for tests
  const mockAdminStats = { totalUsers: 100, totalSales: 5000 };
  const mockAdoptionStats = [
    { month: "January", count: 10 },
    { month: "February", count: 15 },
  ];
  const mockMostSoldProducts = [
    { name: "Dog Food", quantity: 50 },
    { name: "Cat Toys", quantity: 30 },
  ];
  const mockEarningsStats = [
    { month: "January", earnings: 1000 },
    { month: "February", earnings: 1500 },
  ];

  test("useAdminStats hook fetches admin statistics", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValueOnce({
      data: mockAdminStats,
    });

    const { result } = renderHook(() => useAdminStats(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(serverAPI.get).toHaveBeenCalledWith("/admin/stats", {
      withCredentials: true,
    });
    expect(result.current.data).toEqual(mockAdminStats);
  });

  test("useAdoptionStats hook fetches adoption statistics", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValueOnce({
      data: mockAdoptionStats,
    });

    const { result } = renderHook(() => useAdoptionStats(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(serverAPI.get).toHaveBeenCalledWith("/admin/adoptions-per-month", {
      withCredentials: true,
    });
    expect(result.current.data).toEqual(mockAdoptionStats);
  });

  test("useMostSoldProducts hook fetches most sold products", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValueOnce({
      data: mockMostSoldProducts,
    });

    const { result } = renderHook(() => useMostSoldProducts(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(serverAPI.get).toHaveBeenCalledWith("/admin/most-sold-products", {
      withCredentials: true,
    });
    expect(result.current.data).toEqual(mockMostSoldProducts);
  });

  test("useEarningsStats hook fetches earnings statistics", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValueOnce({
      data: mockEarningsStats,
    });

    const { result } = renderHook(() => useEarningsStats(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(serverAPI.get).toHaveBeenCalledWith("/admin/earnings-per-month", {
      withCredentials: true,
    });
    expect(result.current.data).toEqual(mockEarningsStats);
  });

  test("usePendingRequests hook fetches pending adoption requests", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValueOnce({
      data: mockAdoptRequests,
    });

    const { result } = renderHook(() => usePendingRequests(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(serverAPI.get).toHaveBeenCalledWith("/admin/pending-requests", {
      withCredentials: true,
    });
    expect(result.current.data).toEqual(mockAdoptRequests);
  });

  test("useRecentOrders hook fetches recent orders", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValueOnce({
      data: mockOrders,
    });

    const { result } = renderHook(() => useRecentOrders(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(serverAPI.get).toHaveBeenCalledWith("/admin/recent-orders", {
      withCredentials: true,
    });
    expect(result.current.data).toEqual(mockOrders);
  });

  test("handles API errors correctly", async () => {
    const errorMessage = "Network Error";
    (serverAPI.get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useAdminStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});
