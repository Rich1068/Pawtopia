import { render, screen, waitFor } from "@testing-library/react";
import { useParams } from "react-router";
import serverAPI from "../../../helper/axios";
import EditProduct from "../../../pages/Admin/EditProduct";
import "@testing-library/jest-dom";

// Mock dependencies
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useParams: jest.fn(),
}));

jest.mock("../../../helper/axios");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
jest.mock("../../../pages/Admin/AddProducts", () => (props: any) => (
  <div data-testid="add-product">
    {props.productToEdit && (
      <div data-testid="product-data">
        {JSON.stringify(props.productToEdit)}
      </div>
    )}
  </div>
));

describe("EditProduct Component", () => {
  const mockProduct = {
    _id: "123",
    name: "Test Product",
    price: 100,
    description: "Test description",
    // ... other product fields
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ id: "123" });
  });

  it("shows loading state initially", () => {
    (serverAPI.get as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );
    render(<EditProduct />);
    expect(screen.getByText("Loading...")).toBeVisible();
  });

  it("fetches and displays product data", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValue({
      data: { data: mockProduct },
    });
    render(<EditProduct />);

    await waitFor(() => {
      expect(serverAPI.get).toHaveBeenCalledWith("/product/123");
      expect(screen.getByTestId("product-data")).toHaveTextContent(
        JSON.stringify(mockProduct)
      );
    });
  });

  it("handles fetch errors", async () => {
    const consoleSpy = jest.spyOn(console, "error");
    (serverAPI.get as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch")
    );

    render(<EditProduct />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to fetch product:",
        expect.any(Error)
      );
    });
  });

  it("passes product data and refresh function to AddProduct", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValue({
      data: { data: mockProduct },
    });
    render(<EditProduct />);

    await waitFor(() => {
      expect(screen.getByTestId("add-product")).toBeVisible();
      expect(screen.getByTestId("product-data")).toBeVisible();
    });
  });

  it("re-fetches when id changes", async () => {
    const { rerender } = render(<EditProduct />);
    (serverAPI.get as jest.Mock).mockResolvedValue({
      data: { data: mockProduct },
    });

    // Change the mock params
    (useParams as jest.Mock).mockReturnValue({ id: "456" });
    rerender(<EditProduct />);

    await waitFor(() => {
      expect(serverAPI.get).toHaveBeenCalledWith("/product/456");
    });
  });
});
