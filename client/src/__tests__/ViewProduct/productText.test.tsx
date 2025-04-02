import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductText from "../../components/shop/ViewProduct/ProductText";
import { MemoryRouter } from "react-router";
import toast from "react-hot-toast";
import serverAPI from "../../helper/axios";
import { mockProduct } from "../../__mocks__/mockProducts";
import "@testing-library/jest-dom";

jest.mock("react-hot-toast");
jest.mock("../../helper/axios");

jest.mock(
  "../../components/shop/ViewProduct/AdminButtons",
  () =>
    ({ setIsModalOpen }: { setIsModalOpen: (value: boolean) => void }) =>
      (
        <button
          data-testid="admin-buttons"
          onClick={() => setIsModalOpen(true)}
        >
          Delete Button
        </button>
      )
);

jest.mock("../../components/shop/ViewProduct/UserButtons", () => () => (
  <div data-testid="user-buttons" />
));

jest.mock("../../components/WarningModal", () => ({
  __esModule: true,
  default: ({
    isModalOpen,
    setIsModalOpen,
    onConfirm,
  }: {
    isModalOpen: boolean;
    setIsModalOpen: (value: boolean) => void;
    onConfirm: () => void;
  }) =>
    isModalOpen && (
      <div data-testid="warning-modal">
        <button onClick={() => setIsModalOpen(false)}>Cancel</button>
        <button onClick={onConfirm} data-testid="confirm-delete">
          Confirm Delete
        </button>
      </div>
    ),
}));

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

describe("ProductText", () => {
  const renderComponent = (isAdmin = false, isAdminView = false) => {
    return render(
      <MemoryRouter>
        <ProductText
          productData={mockProduct}
          isAdmin={isAdmin}
          isAdminView={isAdminView}
        />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Existing tests
  it("renders product information correctly", () => {
    renderComponent();
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price}.00`)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.category[0])).toBeInTheDocument();
  });

  it("renders UserButtons when not in admin view", () => {
    renderComponent();
    expect(screen.getByTestId("user-buttons")).toBeInTheDocument();
    expect(screen.queryByTestId("admin-buttons")).not.toBeInTheDocument();
  });

  it("renders AdminButtons when in admin view", () => {
    renderComponent(true, true);
    expect(screen.getByTestId("admin-buttons")).toBeInTheDocument();
    expect(screen.queryByTestId("user-buttons")).not.toBeInTheDocument();
  });

  describe("Delete Product", () => {
    it("opens warning modal when delete button is clicked", () => {
      renderComponent(true, true);

      fireEvent.click(screen.getByTestId("admin-buttons"));

      expect(screen.getByTestId("warning-modal")).toBeInTheDocument();
    });

    it("closes warning modal when cancel is clicked", () => {
      renderComponent(true, true);

      fireEvent.click(screen.getByTestId("admin-buttons"));
      fireEvent.click(screen.getByText("Cancel"));

      expect(screen.queryByTestId("warning-modal")).not.toBeInTheDocument();
    });

    it("successfully deletes product when confirmed", async () => {
      (serverAPI.delete as jest.Mock).mockResolvedValueOnce({});
      renderComponent(true, true);

      fireEvent.click(screen.getByTestId("admin-buttons"));
      fireEvent.click(screen.getByTestId("confirm-delete"));

      await waitFor(() => {
        expect(serverAPI.delete).toHaveBeenCalledWith(
          `/product/${mockProduct._id}`,
          { withCredentials: true }
        );
        expect(toast.success).toHaveBeenCalledWith(
          "Product Successfully Deleted"
        );
        expect(mockNavigate).toHaveBeenCalledWith("/admin/product-list");
      });
    });

    it("handles delete error appropriately", async () => {
      const error = new Error("Delete failed");
      (serverAPI.delete as jest.Mock).mockRejectedValueOnce(error);
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      renderComponent(true, true);

      fireEvent.click(screen.getByTestId("admin-buttons"));
      fireEvent.click(screen.getByTestId("confirm-delete"));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Error deleting product. Please try again."
        );
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Failed to delete product:",
          error
        );
      });

      consoleErrorSpy.mockRestore();
    });
  });
});
