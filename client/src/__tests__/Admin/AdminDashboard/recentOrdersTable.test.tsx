import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import RecentOrdersTable from "../../../components/AdminDashboard/RecentOrdersTable";
import { useRecentOrders } from "../../../hooks/useDashboardStats";
import "@testing-library/jest-dom";
import { mockOrders } from "../../../__mocks__/mockOrders";
import { MemoryRouter } from "react-router";

jest.mock("../../../hooks/useDashboardStats");

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <RecentOrdersTable />
    </MemoryRouter>
  );
};

describe("RecentOrdersTable Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    (useRecentOrders as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    renderComponent();

    expect(screen.getByRole("status")).toBeVisible();
  });

  it("renders error state", () => {
    (useRecentOrders as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    renderComponent();

    expect(
      screen.getByText("Error fetching recent orders. Please try again later.")
    ).toBeVisible();
  });

  it("renders table with fetched data with unknown name", async () => {
    (useRecentOrders as jest.Mock).mockReturnValue({
      data: mockOrders,
      isLoading: false,
      isError: false,
    });

    renderComponent();

    await waitFor(() =>
      expect(screen.queryByRole("status")).not.toBeInTheDocument()
    );

    expect(screen.getByText("Recent Orders")).toBeVisible();
    expect(screen.getAllByText("Unknown")[0]).toBeVisible();
    expect(screen.getByText("$99.99")).toBeVisible();
    expect(screen.getByText("1/1/2023")).toBeVisible();
    expect(screen.getByText("$59.99")).toBeVisible();
    expect(screen.getByText("1/2/2023")).toBeVisible();
  });

  it("displays the user's name when userId is an object with a name property", async () => {
    const mockOrderWithName = [
      {
        orderId: "ORD456",
        createdAt: "2023-01-02T00:00:00Z",
        totalAmount: 59.99,
        userId: { name: "John Doe" },
        products: [
          { productId: "3", name: "Product 3", price: 19.99, quantity: 3 },
        ],
      },
    ];

    (useRecentOrders as jest.Mock).mockReturnValue({
      data: mockOrderWithName,
      isLoading: false,
      isError: false,
    });

    renderComponent();

    await waitFor(() =>
      expect(screen.queryByRole("status")).not.toBeInTheDocument()
    );

    expect(screen.getByText("John Doe")).toBeVisible();
  });

  it('displays "$0.00" when totalAmount is null or undefined', async () => {
    const mockOrders = [
      {
        orderId: "ORD123",
        createdAt: "2023-01-01T00:00:00Z",
        totalAmount: null,
        userId: { name: "John Doe" },
      },
    ];

    (useRecentOrders as jest.Mock).mockReturnValue({
      data: mockOrders,
      isLoading: false,
      isError: false,
    });

    renderComponent();

    await waitFor(() =>
      expect(screen.queryByRole("status")).not.toBeInTheDocument()
    );

    expect(screen.getByText("$0.00")).toBeVisible();
  });

  it('displays "N/A" when createdAt is null or undefined', async () => {
    const mockOrders = [
      {
        orderId: "ORD456",
        createdAt: null,
        totalAmount: 59.99,
        userId: { name: "Jane Doe" },
      },
    ];

    (useRecentOrders as jest.Mock).mockReturnValue({
      data: mockOrders,
      isLoading: false,
      isError: false,
    });
    renderComponent();

    await waitFor(() =>
      expect(screen.queryByRole("status")).not.toBeInTheDocument()
    );

    expect(screen.getByText("N/A")).toBeVisible();
  });

  it("opens and closes the modal when a row's 'View Details' button is clicked", async () => {
    (useRecentOrders as jest.Mock).mockReturnValue({
      data: mockOrders,
      isLoading: false,
      isError: false,
    });

    renderComponent();

    // Wait for the loading state to disappear
    await waitFor(() =>
      expect(screen.queryByRole("status")).not.toBeInTheDocument()
    );

    // Click the "View Details" button for the first order
    fireEvent.click(screen.getAllByText("View Details")[0]);

    // Check if the modal is opened
    expect(screen.getByText("Order Details")).toBeVisible();

    // Close the modal
    fireEvent.click(screen.getByText("Close"));

    // Check if the modal is closed
    await waitFor(() =>
      expect(screen.queryByText("Order Details")).not.toBeInTheDocument()
    );
  });
});
