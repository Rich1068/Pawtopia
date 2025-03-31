import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductActionButtons from "../../../components/shop/Admin/ProductList/ProductActionButtons";
import serverAPI from "../../../helper/axios";
import "@testing-library/jest-dom";
import toast from "react-hot-toast";
import { mockProduct } from "../../../__mocks__/mockProducts";
import { MemoryRouter } from "react-router";

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

jest.mock("../../../helper/axios", () => ({
  delete: jest.fn(),
}));

describe("ProductActionButtons Component", () => {
  const mockOnDelete = jest.fn();

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <ProductActionButtons product={mockProduct} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

  beforeEach(() => jest.clearAllMocks());

  it("renders all action buttons", () => {
    renderComponent();

    expect(screen.getByRole("button", { name: /view/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /trash/i })).toBeInTheDocument();
  });

  it("opens and closes the delete confirmation modal", () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /trash/i }));

    expect(screen.getByText(/confirm deletion/i)).toBeVisible();
    expect(
      screen.getByText(/are you sure you want to delete "Test Product"\?/i)
    ).toBeVisible();

    fireEvent.click(screen.getByText(/cancel/i));

    expect(screen.queryByText(/confirm deletion/i)).not.toBeInTheDocument();
  });

  it("calls API and onDelete when delete is confirmed", async () => {
    (serverAPI.delete as jest.Mock).mockResolvedValueOnce({});

    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /trash/i }));
    fireEvent.click(screen.getByText(/delete/i));

    await waitFor(() => {
      expect(serverAPI.delete).toHaveBeenCalledWith("/product/123", {
        withCredentials: true,
      });
      expect(mockOnDelete).toHaveBeenCalledWith("123");
      expect(toast.success).toHaveBeenCalledWith(
        "Product Successfully Deleted"
      );
    });
  });

  it("handles API errors correctly", async () => {
    (serverAPI.delete as jest.Mock).mockRejectedValueOnce(
      new Error("API Error")
    );

    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /trash/i }));
    fireEvent.click(screen.getByText(/delete/i));

    await waitFor(() => {
      expect(serverAPI.delete).toHaveBeenCalledWith("/product/123", {
        withCredentials: true,
      });
      expect(mockOnDelete).not.toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        "Error deleting product. Please try again."
      );
    });
  });
});
