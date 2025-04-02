import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import ShopCards from "../../components/shop/ShopPage/ShopCards";
import { mockProducts } from "../../__mocks__/mockProducts";
import { getFullImageUrl } from "../../helper/imageHelper";
import "@testing-library/jest-dom";
import { IProduct } from "../../types/Types";

// Mock the Link component from react-router
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to} data-testid="link">
      {children}
    </a>
  ),
}));

// Mock the CardImages component
jest.mock("../../components/CardImages", () => ({
  __esModule: true,
  default: ({
    item,
    getImageUrls,
    style,
  }: {
    item: IProduct;
    getImageUrls: (item: IProduct) => string[];
    style: string;
  }) => (
    <div data-testid="card-images" className={style}>
      <img
        src={getImageUrls(item)[0]}
        alt={item.name}
        data-testid="product-image"
      />
    </div>
  ),
}));

// Mock the WarningContainer component
jest.mock("../../components/WarningContainer", () => ({
  __esModule: true,
  default: ({ header, text }: { header: string; text: string }) => (
    <div data-testid="warning-container">
      <h3>{header}</h3>
      <p>{text}</p>
    </div>
  ),
}));

// Mock the getFullImageUrl helper
jest.mock("../../helper/imageHelper", () => ({
  getFullImageUrl: jest.fn((path) => `https://example.com/images/${path}`),
}));

describe("ShopCards Component", () => {
  const defaultProps = {
    products: mockProducts,
    header: "No Products",
    text: "No products available",
  };

  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter>
        <ShopCards {...defaultProps} {...props} />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the correct number of product cards", () => {
    renderComponent();
    const productCards = screen.getAllByTestId("link");
    expect(productCards.length).toBe(mockProducts.length * 2);
  });

  it("renders shop cards when products are provided", async () => {
    renderComponent();
    const prodNames = mockProducts.map((prod) => prod.name);
    await waitFor(() => {
      prodNames.forEach((name) => expect(screen.getByText(name)).toBeVisible());
    });
  });

  test("calls getFullImageUrl for each product image", () => {
    renderComponent();
    expect(getFullImageUrl).toHaveBeenCalledTimes(mockProducts.length);
    mockProducts.forEach((product) => {
      expect(getFullImageUrl).toHaveBeenCalledWith(product.images[0]);
    });
  });

  test("renders CardImages component with correct props", () => {
    renderComponent();
    const cardImages = screen.getAllByTestId("card-images");
    expect(cardImages.length).toBe(mockProducts.length);

    cardImages.forEach((image) => {
      expect(image).toHaveClass("max-[955px]:!h-60 !h-70 !object-contain");
    });
  });

  test("renders WarningContainer when no products are available", () => {
    renderComponent({ products: [] });
    const warningContainer = screen.getByTestId("warning-container");
    expect(warningContainer).toBeVisible();
    expect(screen.getByText("No Products")).toBeVisible();
    expect(screen.getByText("No products available")).toBeVisible();
  });

  test("does not render products when array is empty", () => {
    renderComponent({ products: [] });
    const productCards = screen.queryAllByText(/\$/); // Looking for price indicators
    expect(productCards.length).toBe(0);
  });

  test("applies correct classes to product card container", () => {
    const { container } = renderComponent();
    const gridContainer = container.querySelector(".grid");
    expect(gridContainer).toHaveClass(
      "grid",
      "max-[895px]:grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))]",
      "grid-cols-[repeat(auto-fill,_minmax(280px,_1fr))]",
      "justify-center"
    );
  });

  test('renders "View Details" button on each card', () => {
    renderComponent();
    const viewDetailsButtons = screen.getAllByText("View Details");
    expect(viewDetailsButtons.length).toBe(mockProducts.length);
  });

  test("formats prices correctly when price is missing", () => {
    const productsWithMissingPrice = [
      {
        ...mockProducts[0],
        price: undefined,
      },
    ];

    renderComponent({ products: productsWithMissingPrice });
    expect(screen.getByText("$0.00")).toBeVisible();
  });
});
