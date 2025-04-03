import { render, screen, waitFor } from "@testing-library/react";
import { useSearchParams, useNavigate } from "react-router";
import serverAPI from "../../helper/axios";
import CheckoutSuccess from "../../pages/CheckoutSuccess";
import PageHeader from "../../components/PageHeader";
import "@testing-library/jest-dom";

jest.mock("react-router", () => ({
  useSearchParams: jest.fn(),
  useNavigate: jest.fn(),
}));
jest.mock("../../helper/axios");
jest.mock("../../components/PageHeader");

describe("CheckoutSuccess Component", () => {
  const mockNavigate = jest.fn();
  const mockOrder = {
    orderId: "ORD123",
    totalAmount: 99.97,
    products: [
      {
        name: "Test Product 1",
        price: 29.99,
        quantity: 2,
      },
      {
        name: "Test Product 2",
        price: 39.99,
        quantity: 1,
      },
    ],
  };

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (PageHeader as jest.Mock).mockImplementation(() => <div>Page Header</div>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows error when session_id is missing", async () => {
    (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams("")]);

    render(<CheckoutSuccess />);

    await waitFor(() => {
      expect(screen.getByText("Invalid session.")).toBeVisible();
    });
  });

  it("shows error when API fails", async () => {
    (useSearchParams as jest.Mock).mockReturnValue([
      new URLSearchParams("session_id=test_session"),
    ]);
    (serverAPI.get as jest.Mock).mockRejectedValue(new Error("API Error"));

    render(<CheckoutSuccess />);

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch order details.")).toBeVisible();
    });
  });

  it("displays order details on successful fetch", async () => {
    (useSearchParams as jest.Mock).mockReturnValue([
      new URLSearchParams("session_id=test_session"),
    ]);
    (serverAPI.get as jest.Mock).mockResolvedValue({ data: mockOrder });

    render(<CheckoutSuccess />);

    await waitFor(() => {
      expect(screen.getByText("🎉 Success!")).toBeVisible();
      expect(screen.getByText("Thank you for your purchase.")).toBeVisible();
      expect(screen.getByText(`${mockOrder.orderId}`)).toBeVisible();
      expect(
        screen.getByText(`$${mockOrder.totalAmount.toFixed(2)}`)
      ).toBeVisible();

      // Verify products are displayed
      mockOrder.products.forEach((product) => {
        expect(screen.getByText(product.name)).toBeVisible();
        expect(
          screen.getByText(`$${product.price.toFixed(2)} x ${product.quantity}`)
        ).toBeVisible();
      });

      expect(screen.getByText("Continue Shopping")).toBeVisible();
    });
  });

  it("navigates to shop when continue shopping is clicked", async () => {
    (useSearchParams as jest.Mock).mockReturnValue([
      new URLSearchParams("session_id=test_session"),
    ]);
    (serverAPI.get as jest.Mock).mockResolvedValue({ data: mockOrder });

    render(<CheckoutSuccess />);

    await waitFor(() => {
      const button = screen.getByText("Continue Shopping");
      button.click();
      expect(mockNavigate).toHaveBeenCalledWith("/shop");
    });
  });
});
