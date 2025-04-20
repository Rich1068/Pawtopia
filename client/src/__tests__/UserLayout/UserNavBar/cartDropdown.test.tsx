import { render, screen, fireEvent } from "@testing-library/react";
import CartDropdown from "../../../components/Layout/User/NavBarComponents/CartDropdown";
import { useCart } from "../../../context/CartContext";
import { getFullImageUrl } from "../../../helper/imageHelper";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import { createWrapper } from "../../../__mocks__/utils/testUtils";

const wrapper = createWrapper();

const renderComponent = () => {
  return render(
    wrapper({
      children: (
        <MemoryRouter>
          <CartDropdown />
        </MemoryRouter>
      ),
    })
  );
};
jest.mock("../../../context/CartContext", () => ({
  useCart: jest.fn(),
}));

jest.mock("../../../helper/imageHelper", () => ({
  getFullImageUrl: jest.fn(),
}));

const mockUseCart = useCart as jest.Mock;
const mockGetFullImageUrl = getFullImageUrl as jest.Mock;

describe("CartDropdown Component", () => {
  const mockAddToCart = jest.fn();
  const mockDecreaseFromCart = jest.fn();
  const mockRemoveFromCart = jest.fn();

  const mockCart = {
    products: [
      {
        _id: "1",
        productId: {
          _id: "1",
          name: "Product 1",
          price: "10.00",
          images: ["/image1.jpg"],
        },
        quantity: 2,
      },
      {
        _id: "2",
        productId: {
          _id: "2",
          name: "Product 2",
          price: "5.00",
          images: ["/image2.jpg"],
        },
        quantity: 1,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCart.mockReturnValue({
      cart: mockCart,
      addToCart: mockAddToCart,
      decreaseFromCart: mockDecreaseFromCart,
      removeFromCart: mockRemoveFromCart,
    });
  });

  describe("CartDropDown", () => {
    it("renders the cart dropdown button", () => {
      renderComponent();
      const cartButton = screen.getByRole("button");
      expect(cartButton).toBeVisible();
      expect(cartButton).toHaveClass("text-orange-500");
    });

    it("displays an empty cart message when no products are in the cart", () => {
      mockUseCart.mockReturnValue({
        cart: { products: [] },
        addToCart: jest.fn(),
        decreaseFromCart: jest.fn(),
        removeFromCart: jest.fn(),
      });

      renderComponent();
      fireEvent.click(screen.getByRole("button"));
      expect(screen.getByText("Your cart is empty")).toBeVisible();
    });

    describe("Interactions", () => {
      it("toggles the cart dropdown open and closed", () => {
        renderComponent();
        const cartButton = screen.getByRole("button");

        fireEvent.click(cartButton);
        expect(screen.getByText("Shopping Cart")).toBeVisible();

        fireEvent.click(cartButton);
        expect(screen.queryByText("Shopping Cart")).not.toBeInTheDocument();
      });

      it("closes the cart dropdown when clicking outside", () => {
        renderComponent();
        fireEvent.click(screen.getByRole("button"));
        expect(screen.getByText("Shopping Cart")).toBeVisible();

        fireEvent.mouseDown(document);
        expect(screen.queryByText("Shopping Cart")).not.toBeInTheDocument();
      });

      it("does not close the cart dropdown when clicking inside", () => {
        renderComponent();
        fireEvent.click(screen.getByRole("button"));
        const dropdown = screen.getByText("Shopping Cart");
        fireEvent.mouseDown(dropdown);
        expect(screen.getByText("Shopping Cart")).toBeVisible();
      });

      it("closes the cart dropdown when clicking on the 'Proceed to Checkout' button", () => {
        renderComponent();
        fireEvent.click(screen.getByRole("button"));
        const checkoutButton = screen.getByText("Proceed to Checkout");
        fireEvent.click(checkoutButton);
        expect(screen.queryByText("Shopping Cart")).not.toBeInTheDocument();
      });
      it("closes the cart dropdown when clicking on product name", () => {
        renderComponent();

        const cartButton = screen.getByRole("button");
        fireEvent.click(cartButton);

        const productName = screen.getByText("Product 1");
        expect(productName).toBeInTheDocument();

        fireEvent.click(productName);

        const cartContent = screen.queryByText("Shopping Cart");
        expect(cartContent).not.toBeInTheDocument();
      });
    });

    describe("Cart Items", () => {
      it("renders cart items and handles quantity controls", () => {
        renderComponent();
        fireEvent.click(screen.getByRole("button"));

        expect(screen.getByText("Product 1")).toBeVisible();
        expect(screen.getByText("$10.00")).toBeVisible();
        expect(screen.getByText("$20.00")).toBeVisible();

        fireEvent.click(screen.getAllByTestId("icon-Plus")[0]);
        expect(mockAddToCart).toHaveBeenCalledWith("1", 1);

        fireEvent.click(screen.getAllByTestId("icon-Minus")[0]);
        expect(mockDecreaseFromCart).toHaveBeenCalledWith("1", 1);
      });

      it("removes an item from the cart", () => {
        renderComponent();
        fireEvent.click(screen.getByRole("button"));
        fireEvent.click(screen.getAllByText("Remove")[0]);
        expect(mockRemoveFromCart).toHaveBeenCalledWith("1");
      });

      it("displays the correct subtotal", () => {
        renderComponent();
        fireEvent.click(screen.getByRole("button"));
        expect(screen.getByText("Subtotal:")).toBeVisible();
        expect(screen.getByText("$25.00")).toBeVisible();
      });
    });

    describe("Edge Cases", () => {
      it("uses the correct product image URL when a valid image is provided", () => {
        mockGetFullImageUrl.mockReturnValue("/full/path/to/image.jpg");
        renderComponent();
        fireEvent.click(screen.getByRole("button"));

        const productImage = screen.getByAltText("Product 1");
        expect(productImage).toHaveAttribute("src", "/full/path/to/image.jpg");
        expect(mockGetFullImageUrl).toHaveBeenCalledWith("/image1.jpg");
      });

      it("uses the fallback image when no valid image is provided", () => {
        mockGetFullImageUrl.mockReturnValue(null);
        mockUseCart.mockReturnValue({
          cart: {
            products: [
              {
                _id: "1",
                productId: {
                  _id: "1",
                  name: "Product 1",
                  price: "10.00",
                  images: [],
                },
                quantity: 1,
              },
            ],
          },
          addToCart: jest.fn(),
          decreaseFromCart: jest.fn(),
          removeFromCart: jest.fn(),
        });

        renderComponent();
        fireEvent.click(screen.getByRole("button"));

        const productImage = screen.getByAltText("Product 1");
        expect(productImage).toHaveAttribute("src", "/assets/img/Logo1.jpg");
        expect(mockGetFullImageUrl).toHaveBeenCalledWith(undefined);
      });

      it("uses fallback price when product price is invalid or undefined", () => {
        mockUseCart.mockReturnValue({
          cart: {
            products: [
              {
                _id: "1",
                productId: {
                  _id: "1",
                  name: "Product 1",
                  price: undefined,
                  images: ["/image1.jpg"],
                },
                quantity: 2,
              },
            ],
          },
          addToCart: jest.fn(),
          decreaseFromCart: jest.fn(),
          removeFromCart: jest.fn(),
        });

        renderComponent();
        fireEvent.click(screen.getByRole("button"));

        screen.getAllByText("$0.00").forEach((element) => {
          expect(element).toBeVisible();
        });
      });

      it("displays cartProductCount as 0 when the cart is empty", () => {
        mockUseCart.mockReturnValue({
          cart: { products: null },
          addToCart: jest.fn(),
          decreaseFromCart: jest.fn(),
          removeFromCart: jest.fn(),
        });

        renderComponent();

        expect(screen.queryByText("0")).not.toBeInTheDocument();

        const cartButton = screen.getByRole("button");
        fireEvent.click(cartButton);

        expect(screen.getByText("Your cart is empty")).toBeVisible();
      });
    });
  });
});
