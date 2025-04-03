import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Checkout from "../../pages/Checkout";
import { useCart } from "../../context/CartContext";
import { MemoryRouter } from "react-router";
import serverAPI from "../../helper/axios";
import { getFullImageUrl } from "../../helper/imageHelper";
import "@testing-library/jest-dom";
import toast from "react-hot-toast";

// Mock dependencies
jest.mock("../../context/CartContext");
jest.mock("../../helper/axios");
jest.mock("../../helper/imageHelper");
jest.mock("lucide-react");
jest.mock("react-hot-toast", () => ({ error: jest.fn(), success: jest.fn() }));

const mockCart = {
  products: [
    {
      _id: "1",
      productId: {
        _id: "prod1",
        name: "Test Product 1",
        price: "29.99",
        images: ["image1.jpg"],
      },
      quantity: 2,
    },
    {
      _id: "2",
      productId: {
        _id: "prod2",
        name: "Test Product 2",
        price: "39.99",
        images: ["image2.jpg"],
      },
      quantity: 1,
    },
  ],
};

describe("Checkout Component", () => {
  const mockAddToCart = jest.fn();
  const mockDecreaseFromCart = jest.fn();
  const mockRemoveFromCart = jest.fn();

  beforeEach(() => {
    (useCart as jest.Mock).mockReturnValue({
      cart: mockCart,
      addToCart: mockAddToCart,
      decreaseFromCart: mockDecreaseFromCart,
      removeFromCart: mockRemoveFromCart,
    });
    (getFullImageUrl as jest.Mock).mockImplementation(
      (img) => `http://example.com/${img}`
    );
    (serverAPI.post as jest.Mock).mockResolvedValue({
      data: { url: "https://payment.example.com" },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <Checkout />
      </MemoryRouter>
    );
  };

  it("renders checkout page with correct title", () => {
    renderComponent();
    expect(screen.getByTestId("cart-title")).toHaveTextContent("Shopping Cart");
  });

  it("displays all cart items with correct information", () => {
    renderComponent();

    const cartItems = screen.getAllByTestId("cart-item");
    expect(cartItems).toHaveLength(mockCart.products.length);

    // Loop through each product and verify its details
    mockCart.products.forEach((product) => {
      const productId = product.productId._id;
      const expectedSubtotal = (
        parseFloat(product.productId.price) * product.quantity
      ).toFixed(2);

      expect(screen.getByTestId(`product-name-${productId}`)).toHaveTextContent(
        product.productId.name
      );
      expect(
        screen.getByTestId(`product-price-${productId}`)
      ).toHaveTextContent(`$${parseFloat(product.productId.price).toFixed(2)}`);
      expect(screen.getByTestId(`quantity-input-${productId}`)).toHaveValue(
        product.quantity.toString()
      );
      expect(
        screen.getByTestId(`item-subtotal-${productId}`)
      ).toHaveTextContent(`$${expectedSubtotal}`);
    });
  });

  it("calculates and displays correct total", () => {
    renderComponent();
    const expectedTotal = 29.99 * 2 + 39.99;
    expect(screen.getByTestId("cart-total")).toHaveTextContent(
      `$${expectedTotal.toFixed(2)}`
    );
  });

  it("handles quantity adjustments", () => {
    renderComponent();

    fireEvent.click(screen.getByTestId("decrease-quantity-prod1"));
    expect(mockDecreaseFromCart).toHaveBeenCalledWith("prod1", 1);

    fireEvent.click(screen.getByTestId("increase-quantity-prod1"));
    expect(mockAddToCart).toHaveBeenCalledWith("prod1", 1);
  });

  it("handles item removal", () => {
    renderComponent();
    fireEvent.click(screen.getByTestId("remove-item-prod1"));
    expect(mockRemoveFromCart).toHaveBeenCalledWith("prod1");
  });

  it("displays empty cart message when no products", () => {
    (useCart as jest.Mock).mockReturnValue({
      cart: { products: [] },
      addToCart: mockAddToCart,
      decreaseFromCart: mockDecreaseFromCart,
      removeFromCart: mockRemoveFromCart,
    });

    renderComponent();
    expect(screen.getByTestId("empty-cart-message")).toHaveTextContent(
      "Your cart is empty."
    );
  });

  it("handles checkout process", async () => {
    renderComponent();

    fireEvent.click(screen.getByTestId("checkout-button"));

    await waitFor(() => {
      expect(serverAPI.post).toHaveBeenCalledWith(
        "/cart/checkout",
        { products: mockCart.products },
        { withCredentials: true }
      );
    });
  });

  it("shows loading state during checkout", async () => {
    renderComponent();

    fireEvent.click(screen.getByTestId("checkout-button"));
    expect(screen.getByTestId("loading-spinner")).toBeVisible();

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });
  });

  it("displays continue shopping link", () => {
    renderComponent();
    const link = screen.getByTestId("continue-shopping-link");
    expect(link).toHaveTextContent("Continue Shopping");
    expect(link).toHaveAttribute("href", "/shop");
  });

  it("renders product images correctly", () => {
    renderComponent();
    expect(getFullImageUrl).toHaveBeenCalledWith("image1.jpg");
    expect(getFullImageUrl).toHaveBeenCalledWith("image2.jpg");
    expect(screen.getByTestId("product-image-prod1")).toHaveAttribute(
      "src",
      "http://example.com/image1.jpg"
    );
  });
  it("handles checkout error and shows error toast", async () => {
    (serverAPI.post as jest.Mock).mockRejectedValueOnce(new Error("API Error"));

    renderComponent();

    fireEvent.click(screen.getByTestId("checkout-button"));
    await waitFor(() => {
      expect(screen.getByTestId("loading-spinner")).toBeVisible();
    });
    await waitFor(() => {
      expect(serverAPI.post).toHaveBeenCalledWith(
        "/cart/checkout",
        { products: mockCart.products },
        { withCredentials: true }
      );
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to process checkout. Please try again later."
      );

      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });
  });
});
