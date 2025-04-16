// tests/hooks/useCheckout.test.ts
import { renderHook, act } from "@testing-library/react";
import useCheckout from "../../hooks/useCheckout";
import serverAPI from "../../helper/axios";
import toast from "react-hot-toast";
import { createWrapper } from "../../__mocks__/utils/testUtils";

const wrapper = createWrapper();

jest.mock("../../helper/axios");
jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
}));

const mockAddToCart = jest.fn();
const mockDecreaseFromCart = jest.fn();
const mockRemoveFromCart = jest.fn();

const mockUseCart = jest.fn();

jest.mock("../../context/CartContext", () => ({
  useCart: () => mockUseCart(),
}));

describe("useCheckout", () => {
  beforeEach(() => {
    mockUseCart.mockReturnValue({
      cart: {
        products: [
          {
            productId: { _id: "1", price: "100", isArchived: false },
            quantity: 2,
          },
          {
            productId: { _id: "2", price: "50", isArchived: true },
            quantity: 1,
          },
        ],
      },
      addToCart: mockAddToCart,
      decreaseFromCart: mockDecreaseFromCart,
      removeFromCart: mockRemoveFromCart,
    });

    jest.clearAllMocks();
  });
  it("calculates total correctly", () => {
    const { result } = renderHook(() => useCheckout(), { wrapper });
    expect(result.current.total).toBe(250); // 100 * 2 + 50 * 1
  });

  it("detects invalid (archived) products", () => {
    const { result } = renderHook(() => useCheckout(), { wrapper });
    expect(result.current.hasInvalidItems).toBe(true);
  });

  it("calls addToCart when handleAdd is triggered", async () => {
    const { result } = renderHook(() => useCheckout(), { wrapper });

    await act(async () => {
      await result.current.handleAdd("1");
    });

    expect(mockAddToCart).toHaveBeenCalledWith("1", 1);
  });

  it("calls decreaseFromCart when handleDecrease is triggered", async () => {
    const { result } = renderHook(() => useCheckout(), { wrapper });

    await act(async () => {
      await result.current.handleDecrease("1");
    });

    expect(mockDecreaseFromCart).toHaveBeenCalledWith("1", 1);
  });

  it("handles successful checkout and redirects", async () => {
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });

    (serverAPI.post as jest.Mock).mockResolvedValueOnce({
      data: { url: "https://checkout.com/session" },
    });

    const { result } = renderHook(() => useCheckout(), { wrapper });

    await act(async () => {
      await result.current.handleCheckout();
    });

    expect(window.location.href).toBe("https://checkout.com/session");
  });

  it("shows toast error on checkout failure", async () => {
    (serverAPI.post as jest.Mock).mockRejectedValueOnce(new Error("Network"));

    const { result } = renderHook(() => useCheckout(), { wrapper });

    await act(async () => {
      await result.current.handleCheckout();
    });

    expect(toast.error).toHaveBeenCalledWith(
      "Failed to process checkout. Please try again later."
    );
  });
  it("returns cartLength as 0 when the cart is empty", () => {
    mockUseCart.mockReturnValue({
      cart: { products: [] },
      addToCart: jest.fn(),
      decreaseFromCart: jest.fn(),
      removeFromCart: jest.fn(),
    });

    const { result } = renderHook(() => useCheckout(), {
      wrapper: createWrapper(),
    });

    expect(result.current.cartLength).toBe(0);
  });

  it("calculates correct cart length when products exist", () => {
    const { result } = renderHook(() => useCheckout(), {
      wrapper: createWrapper(),
    });

    expect(result.current.cartLength).toBe(2);
  });
});
