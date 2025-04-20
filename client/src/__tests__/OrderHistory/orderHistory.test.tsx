import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import OrderHistory from "../../pages/OrderHistory";
import { useOrderHistory } from "../../hooks/useOrderHistory";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";

// Mock the hook
jest.mock("../../hooks/useOrderHistory");

const today = new Date().toISOString();

const mockOrders = [
  {
    orderId: "1234567890abcdef",
    userId: "user1",
    totalAmount: 59.99,
    createdAt: today,
    products: [
      {
        productId: "prod1",
        name: "Test Product 1",
        price: 29.99,
        quantity: 2,
      },
    ],
  },
  {
    orderId: "abcdef1234567890",
    userId: "user2",
    totalAmount: 42.5,
    createdAt: "2023-01-01T10:00:00Z",
    products: [
      {
        productId: "prod2",
        name: "Test Product 2",
        price: 42.5,
        quantity: 1,
      },
    ],
  },
];

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <OrderHistory />
    </MemoryRouter>
  );
};

describe("OrderHistory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    (useOrderHistory as jest.Mock).mockReturnValue({
      data: [],
      isLoading: true,
    });

    renderComponent();
    expect(screen.getByText(/order history/i)).toBeVisible();
  });

  it("renders orders and opens modal", async () => {
    (useOrderHistory as jest.Mock).mockReturnValue({
      data: mockOrders,
      isLoading: false,
    });

    renderComponent();

    // Wait for the "View Details" buttons to render
    await waitFor(() =>
      expect(screen.getAllByText(/view details/i)).toHaveLength(2)
    );

    // Click on first "View Details"
    fireEvent.click(screen.getAllByText(/view details/i)[0]);

    // Check that modal content appears
    await waitFor(() => {
      expect(screen.getAllByText(/order id/i)[0]).toBeVisible();
    });
  });

  it("filters orders by selected date", async () => {
    renderComponent();

    // Wait for orders to load
    await waitFor(() =>
      expect(screen.getAllByText(/view details/i)).toHaveLength(2)
    );

    const dateInput = screen.getByTestId("date-input");

    const todayStr = new Date(today).toLocaleDateString("en-CA");
    fireEvent.change(dateInput, { target: { value: todayStr } });

    // Expect only 1 matching order after filter
    await waitFor(() =>
      expect(screen.getAllByText(/view details/i)).toHaveLength(1)
    );

    expect(screen.getByText(/1234567890.../i)).toBeVisible(); // ID gets truncated
  });
});
