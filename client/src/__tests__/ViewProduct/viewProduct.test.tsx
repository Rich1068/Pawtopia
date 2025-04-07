import { render, screen, waitFor } from "@testing-library/react";
import ViewProduct from "../../pages/Admin/ViewProduct";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import serverAPI from "../../helper/axios";
import { useAuth } from "../../context/AuthContext";
import { mockProduct } from "../../__mocks__/mockProducts";
import "@testing-library/jest-dom";

jest.mock("../../helper/axios");
jest.mock("../../context/AuthContext");
jest.mock("../../components/shop/ViewProduct/ProductCarousel", () => () => (
  <div data-testid="product-carousel" />
));
jest.mock("../../components/shop/ViewProduct/ProductText", () => () => (
  <div data-testid="product-text" />
));
jest.mock("../../components/LoadingPage/LoadingPage", () => () => (
  <div data-testid="loading-page" />
));
jest.mock("../../components/WarningContainer", () => () => (
  <div data-testid="warning-container" />
));
jest.mock("../../components/PageHeader", () => () => (
  <div data-testid="page-header" />
));
jest.mock("../../components/shop/Admin/TitleComponent", () => () => (
  <div data-testid="title-component" />
));

// Mock useLocation to return different paths
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useLocation: jest.fn(),
}));

describe("ViewProduct", () => {
  const renderComponent = (
    productId = "123",
    isAdmin = false,
    isAdminView = false
  ) => {
    (useLocation as jest.Mock).mockReturnValue({
      pathname: isAdminView
        ? `/admin/products/${productId}`
        : `/products/${productId}`,
    });

    (useAuth as jest.Mock).mockReturnValue({
      user: { role: isAdmin ? "admin" : "user" },
    });

    return render(
      <MemoryRouter initialEntries={[`/products/${productId}`]}>
        <Routes>
          <Route path="/products/:id" element={<ViewProduct />} />
          <Route path="/admin/products/:id" element={<ViewProduct />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state initially", () => {
    (serverAPI.get as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );
    renderComponent();
    expect(screen.getByTestId("loading-page")).toBeVisible();
  });

  it("fetches and displays product data successfully", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValue({
      data: { data: mockProduct },
    });
    renderComponent();

    await waitFor(() => {
      expect(serverAPI.get).toHaveBeenCalledWith(`/product/123`);
      expect(screen.getByTestId("product-carousel")).toBeVisible();
      expect(screen.getByTestId("product-text")).toBeVisible();
    });
  });

  it("shows error state when product not found", async () => {
    (serverAPI.get as jest.Mock).mockRejectedValue(new Error("Not found"));
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("warning-container")).toBeVisible();
    });
  });

  it("displays admin title component in admin view", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValue({
      data: { data: mockProduct },
    });
    renderComponent("123", true, true);

    await waitFor(() => {
      expect(screen.getByTestId("title-component")).toBeVisible();
      expect(screen.queryByTestId("page-header")).not.toBeInTheDocument();
    });
  });

  it("displays page header in user view", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValue({
      data: { data: mockProduct },
    });
    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("page-header")).toBeVisible();
      expect(screen.queryByTestId("title-component")).not.toBeInTheDocument();
    });
  });
});
