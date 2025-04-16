import { renderHook, waitFor } from "@testing-library/react";
import { useOrderCheckout } from "../../hooks/useOrderCheckout";
import serverAPI from "../../helper/axios";
import { createWrapper } from "../../__mocks__/utils/testUtils";
import type { IOrder } from "../../types/Types";

const mockedServerAPI = serverAPI as jest.Mocked<typeof serverAPI>;

describe("useOrderCheckout", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mock calls and reset their state
  });
  it("fetches order data when sessionId is provided", async () => {
    const mockSessionId = "abc123";
    const mockOrder: IOrder = {
      _id: "order123",
      userId: "user456",
      products: [
        {
          productId: "prod1",
          name: "Product 1",
          price: 50,
          quantity: 2,
        },
        {
          productId: "prod2",
          name: "Product 2",
          price: 25,
          quantity: 1,
        },
      ],
      orderId: "orderId123",
      totalAmount: 125,
      createdAt: "2025-04-10T12:00:00Z",
      updatedAt: "2025-04-10T12:30:00Z",
    };

    mockedServerAPI.get.mockResolvedValueOnce({ data: mockOrder });

    const { result } = renderHook(() => useOrderCheckout(mockSessionId), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockOrder);
    expect(result.current.data?.products).toHaveLength(2);
    expect(result.current.data?.totalAmount).toBe(125);
    expect(mockedServerAPI.get).toHaveBeenCalledWith(
      `/order/success/${mockSessionId}`
    );
  });

  it("does not run query if sessionId is null", () => {
    const { result } = renderHook(() => useOrderCheckout(null), {
      wrapper: createWrapper(),
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(mockedServerAPI.get).not.toHaveBeenCalled();
  });
});
