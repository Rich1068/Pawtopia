/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from "@testing-library/react";
import ViewProduct from "../../pages/Admin/ViewProduct";
import { MemoryRouter, Route, Routes } from "react-router";
import { useProduct } from "../../hooks/useProducts";
import { useAuth } from "../../context/AuthContext";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

// Mock subcomponents
jest.mock("../../components/shop/ViewProduct/ProductCarousel", () => () => (
  <div data-testid="product-carousel">ProductCarousel</div>
));
jest.mock("../../components/shop/ViewProduct/ProductText", () => () => (
  <div data-testid="product-text">ProductText</div>
));
jest.mock("../../components/LoadingPage/LoadingPage", () => () => (
  <div data-testid="loading">LoadingPage</div>
));
jest.mock(
  "../../components/WarningContainer",
  () =>
    ({ header, text, confirmText, onConfirm }: any) =>
      (
        <div data-testid="warning">
          <p>{header}</p>
          <p>{text}</p>
          <button onClick={onConfirm}>{confirmText}</button>
        </div>
      )
);
jest.mock(
  "../../components/shop/Admin/TitleComponent",
  () =>
    ({ text }: any) =>
      <div data-testid="title">{text}</div>
);
jest.mock("../../components/PageHeader", () => ({ text }: any) => (
  <div data-testid="header">{text}</div>
));

// Mock hooks
jest.mock("../../hooks/useProducts");
jest.mock("../../context/AuthContext");

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

const renderWithRoute = (route: string) => {
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path="/admin/view-product/:id" element={<ViewProduct />} />
        <Route path="/shop/product/:id" element={<ViewProduct />} />
      </Routes>
    </MemoryRouter>
  );
};

const mockProduct = {
  _id: "1",
  name: "Test Product",
  category: ["Cat Supplies"],
  images: [],
  description: "A good item",
  price: "10.00",
  isArchived: false,
};

// Use mocked hooks
const mockedUseProduct = useProduct as jest.Mock;
const mockedUseAuth = useAuth as jest.Mock;

describe("ViewProduct Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays loading state", () => {
    mockedUseProduct.mockReturnValue({ isLoading: true, isError: false });
    mockedUseAuth.mockReturnValue({ user: { role: "user" } });

    renderWithRoute("/shop/product/1");
    expect(screen.getByTestId("loading")).toBeVisible();
  });

  it("displays warning if product not found", async () => {
    mockedUseProduct.mockReturnValue({ isLoading: false, isError: true });
    mockedUseAuth.mockReturnValue({ user: { role: "user" } });

    renderWithRoute("/shop/product/1");

    expect(await screen.findByTestId("warning")).toBeVisible();
    expect(screen.getByText("Product Not Found")).toBeVisible();
  });

  it("renders correctly for user view", async () => {
    mockedUseProduct.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockProduct,
    });
    mockedUseAuth.mockReturnValue({ user: { role: "user" } });

    renderWithRoute("/shop/product/1");

    await waitFor(() => {
      expect(screen.getByTestId("header")).toHaveTextContent("Product Details");
    });

    expect(screen.getByTestId("product-carousel")).toBeVisible();
    expect(screen.getByTestId("product-text")).toBeVisible();
  });

  it("renders correctly for admin view", async () => {
    mockedUseProduct.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockProduct,
    });
    mockedUseAuth.mockReturnValue({ user: { role: "admin" } });

    renderWithRoute("/admin/view-product/1");

    await waitFor(() => {
      expect(screen.getByTestId("title")).toHaveTextContent("View Product");
    });

    expect(screen.getByTestId("product-carousel")).toBeVisible();
    expect(screen.getByTestId("product-text")).toBeVisible();
  });

  it("navigates back when 'Back' button is clicked in WarningContainer", async () => {
    mockedUseProduct.mockReturnValue({ isLoading: false, isError: true });
    mockedUseAuth.mockReturnValue({ user: { role: "user" } });

    renderWithRoute("/shop/product/1");

    const backButton = await screen.findByRole("button", { name: "Back" });
    await userEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
