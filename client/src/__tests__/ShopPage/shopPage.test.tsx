/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from "@testing-library/react";
import Shop from "../../pages/Shop";
import "@testing-library/jest-dom";
import { createWrapper } from "../../__mocks__/utils/testUtils";
import { mockProducts } from "../../__mocks__/mockProducts";

// Mock components
jest.mock("../../components/PageHeader", () => ({ text }: any) => (
  <div data-testid="mock-page-header">{text}</div>
));
jest.mock(
  "../../components/LoadingPage/LoadingPage",
  () =>
    ({ fadeOut }: any) =>
      <div data-testid="mock-loading-page">{`Loading ${fadeOut}`}</div>
);
jest.mock(
  "../../components/shop/ShopPage/ShopContainer",
  () =>
    ({ allProducts }: any) =>
      (
        <div data-testid="mock-shop-container">{`Products: ${allProducts.length}`}</div>
      )
);

// Mock hook
jest.mock("../../hooks/useProducts", () => ({
  useShopList: jest.fn(),
}));

import { useShopList } from "../../hooks/useProducts";

const wrapper = createWrapper();

const renderShop = () => render(wrapper({ children: <Shop /> }));

describe("Shop Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading screen when loading", () => {
    (useShopList as jest.Mock).mockReturnValue({
      data: [],
      isLoading: true,
    });

    renderShop();

    expect(screen.getByTestId("mock-loading-page")).toHaveTextContent(
      "Loading false"
    );
  });

  it("renders shop components after loading", async () => {
    (useShopList as jest.Mock).mockReturnValue({
      data: mockProducts,
      isLoading: false,
    });

    renderShop();

    await waitFor(() => {
      expect(screen.getByTestId("mock-page-header")).toHaveTextContent("Shop");
      expect(screen.getByTestId("mock-shop-container")).toHaveTextContent(
        `Products: ${mockProducts.length}`
      );
    });
  });
});
