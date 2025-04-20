import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import AdminButtons from "../../components/shop/ViewProduct/AdminButtons";
import { useProductMutations, useProduct } from "../../hooks/useProducts";
import "@testing-library/jest-dom";

// Mock hooks
jest.mock("../../hooks/useProducts", () => ({
  useProductMutations: jest.fn(),
  useProduct: jest.fn(),
}));

// Mock functions
const mockArchiveProduct = jest.fn();
const mockRecoverProduct = jest.fn();
const mockDeleteProduct = jest.fn();
const mockRefetch = jest.fn();

// Helper render function
const renderComponent = (
  productId: string,
  productName: string,
  isArchived: boolean
) => {
  return render(
    <MemoryRouter>
      <AdminButtons
        productId={productId}
        productName={productName}
        isArchived={isArchived}
      />
    </MemoryRouter>
  );
};

describe("AdminButtons Component", () => {
  const productId = "123";
  const productName = "Test Product";

  beforeEach(() => {
    // Set mock returns before each test
    (useProductMutations as jest.Mock).mockReturnValue({
      archiveProduct: { mutateAsync: mockArchiveProduct },
      recoverProduct: { mutateAsync: mockRecoverProduct },
      deleteProduct: { mutateAsync: mockDeleteProduct },
    });
    (useProduct as jest.Mock).mockReturnValue({
      refetch: mockRefetch,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders buttons and modal", () => {
    renderComponent(productId, productName, false);

    expect(screen.getByText("Edit Product")).toBeVisible();
    expect(screen.getByTestId("icon-Archive")).toBeVisible();
  });

  test("opens archive modal when clicking Archive button", () => {
    renderComponent(productId, productName, false);

    fireEvent.click(screen.getByTestId("icon-Archive"));

    expect(
      screen.getByText(`Are you sure you want to archive "${productName}"?`)
    ).toBeVisible();
    expect(screen.getByText("Archive")).toBeVisible();
  });

  test("calls archiveProduct on confirm", async () => {
    renderComponent(productId, productName, false);

    fireEvent.click(screen.getByTestId("icon-Archive"));
    fireEvent.click(screen.getByText("Archive"));

    await waitFor(() => {
      expect(mockArchiveProduct).toHaveBeenCalledWith(productId);
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  test("opens recover modal when clicking Recover button", () => {
    renderComponent(productId, productName, true);

    fireEvent.click(screen.getByTestId("icon-Check"));

    expect(
      screen.getByText(`Are you sure you want to recover "${productName}"?`)
    ).toBeVisible();
    expect(screen.getByText("Recover")).toBeVisible();
  });

  test("calls recoverProduct on confirm", async () => {
    renderComponent(productId, productName, true);

    fireEvent.click(screen.getByTestId("icon-Check"));
    fireEvent.click(screen.getByText("Recover"));

    await waitFor(() => {
      expect(mockRecoverProduct).toHaveBeenCalledWith(productId);
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  test("opens delete modal when clicking Delete button", () => {
    renderComponent(productId, productName, true);

    fireEvent.click(screen.getByTestId("icon-Trash"));

    expect(
      screen.getByText(
        `Are you sure you want to permanently delete "${productName}"?`
      )
    ).toBeVisible();
    expect(screen.getByText("Delete")).toBeVisible();
  });

  test("calls deleteProduct on confirm", async () => {
    renderComponent(productId, productName, true);

    fireEvent.click(screen.getByTestId("icon-Trash"));
    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(mockDeleteProduct).toHaveBeenCalledWith(productId);
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  test("logs error when archiveProduct fails", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    mockArchiveProduct.mockRejectedValue(new Error("Archive failed"));

    renderComponent("123", "Test Product", false);

    fireEvent.click(screen.getByTestId("icon-Archive"));
    fireEvent.click(screen.getByText("Archive"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  test("logs error when recoverProduct fails", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    mockRecoverProduct.mockRejectedValue(new Error("Recover failed"));

    renderComponent("123", "Test Product", true);

    fireEvent.click(screen.getByTestId("icon-Check"));
    fireEvent.click(screen.getByText("Recover"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  test("logs error when deleteProduct fails", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    mockDeleteProduct.mockRejectedValue(new Error("Delete failed"));

    renderComponent("123", "Test Product", true);

    fireEvent.click(screen.getByTestId("icon-Trash"));
    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});
