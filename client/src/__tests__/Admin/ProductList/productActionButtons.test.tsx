import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductActionButtons from "../../../components/shop/Admin/ProductList/ProductActionButtons";
import serverAPI from "../../../helper/axios";
import "@testing-library/jest-dom";
import toast from "react-hot-toast";
import { mockProduct } from "../../../__mocks__/mockProducts";
import { MemoryRouter } from "react-router";

jest.mock("lucide-react");
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

    expect(screen.getByTestId("view-button")).toBeVisible();
    expect(screen.getByTestId("edit-button")).toBeVisible();
    expect(screen.getByTestId("delete-button")).toBeVisible();
  });

  it("opens and closes the delete confirmation modal", () => {
    renderComponent();

    fireEvent.click(screen.getByTestId("delete-button"));

    expect(screen.getByText(/confirm deletion/i)).toBeVisible();
    expect(
      screen.getByText(/Are you sure you want to delete "Premium Dog Food"\?/i)
    ).toBeVisible();

    fireEvent.click(screen.getByText(/close/i));

    expect(screen.queryByText(/confirm deletion/i)).not.toBeInTheDocument();
  });

  it("calls API and onDelete when delete is confirmed", async () => {
    (serverAPI.delete as jest.Mock).mockResolvedValueOnce({});

    renderComponent();
    fireEvent.click(screen.getByTestId("delete-button"));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(serverAPI.delete).toHaveBeenCalledWith("/product/1", {
        withCredentials: true,
      });
      expect(mockOnDelete).toHaveBeenCalledWith("1");
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
    fireEvent.click(screen.getByTestId("delete-button"));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(serverAPI.delete).toHaveBeenCalledWith("/product/1", {
        withCredentials: true,
      });
      expect(mockOnDelete).not.toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        "Error deleting product. Please try again."
      );
    });
  });
});
