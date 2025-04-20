import { render, screen, fireEvent } from "@testing-library/react";
import Checkout from "../../pages/Checkout";
import * as checkoutHook from "../../hooks/useCheckout";
import { BrowserRouter } from "react-router";
import { mockProduct } from "../../__mocks__/mockProducts";
import "@testing-library/jest-dom";

// Mock PageHeader
jest.mock("../../components/PageHeader", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-page-header">Checkout Header</div>,
}));

jest.mock("lucide-react");

// Wrapper for rendering with router
const renderWithRouter = (ui: React.ReactNode) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Checkout Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows empty cart message", () => {
    jest.spyOn(checkoutHook, "default").mockReturnValue({
      cart: null,
      cartLength: 0,
      total: 0,
      loading: false,
      hasInvalidItems: false,
      handleAdd: jest.fn(),
      handleDecrease: jest.fn(),
      removeFromCart: jest.fn(),
      handleCheckout: jest.fn(),
      updatingProductId: null,
    });

    renderWithRouter(<Checkout />);

    expect(screen.getByTestId("mock-page-header")).toBeVisible();
    expect(screen.getByTestId("empty-cart-message")).toHaveTextContent(
      "Your cart is empty."
    );
    expect(screen.getByTestId("cart-total")).toHaveTextContent("$0.00");
  });

  it("renders cart items and handles interaction", () => {
    const mockAdd = jest.fn();
    const mockDecrease = jest.fn();
    const mockRemove = jest.fn();
    const mockCheckout = jest.fn();

    jest.spyOn(checkoutHook, "default").mockReturnValue({
      cart: {
        _id: "1",
        userId: "user1",
        products: [
          {
            _id: "cartItem1",
            quantity: 2,
            productId: mockProduct,
          },
        ],
        createdAt: "2025-03-05T09:45:00Z",
        updatedAt: "2025-03-05T09:45:00Z",
      },
      cartLength: 1,
      total: 50,
      loading: false,
      hasInvalidItems: false,
      handleAdd: mockAdd,
      handleDecrease: mockDecrease,
      removeFromCart: mockRemove,
      handleCheckout: mockCheckout,
      updatingProductId: null,
    });

    renderWithRouter(<Checkout />);

    expect(screen.getByText("Premium Dog Food")).toBeVisible();
    expect(screen.getByText("$25.00")).toBeVisible();
    expect(screen.getByTestId("cart-total")).toHaveTextContent("$50.00");

    // Simulate user clicking + and -
    fireEvent.click(screen.getByTestId("icon-Plus").parentElement!);
    expect(mockAdd).toHaveBeenCalledWith("1");

    fireEvent.click(screen.getByTestId("icon-Minus").parentElement!);
    expect(mockDecrease).toHaveBeenCalledWith("1");

    fireEvent.click(screen.getByText("Remove"));
    expect(mockRemove).toHaveBeenCalledWith("cartItem1");

    fireEvent.click(screen.getByText("Proceed to Payment"));
    expect(mockCheckout).toHaveBeenCalled();
  });

  it("disables checkout when invalid items exist", () => {
    jest.spyOn(checkoutHook, "default").mockReturnValue({
      cart: {
        _id: "1",
        userId: "user1",
        products: [
          {
            _id: "cartItem1",
            quantity: 1,
            productId: null, // deleted product
          },
        ],
        createdAt: "2025-03-05T09:45:00Z",
        updatedAt: "2025-03-05T09:45:00Z",
      },
      cartLength: 1,
      total: 0,
      loading: false,
      hasInvalidItems: true,
      handleAdd: jest.fn(),
      handleDecrease: jest.fn(),
      removeFromCart: jest.fn(),
      handleCheckout: jest.fn(),
      updatingProductId: null,
    });

    renderWithRouter(<Checkout />);

    expect(
      screen.getByText("Please remove unavailable products before checkout.")
    ).toBeVisible();
    expect(screen.getByText("Proceed to Payment")).toBeDisabled();
  });
});
