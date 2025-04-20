/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminOrderHistory from "../../../pages/Admin/AdminOrderHistory";
import { useAdminOrderHistory } from "../../../hooks/useOrderHistory";
import { mockOrders } from "../../../__mocks__/mockOrders";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";

jest.mock("lucide-react");
// Mocking child components
jest.mock("../../../components/OrderHistory/OrderDetailModal", () => ({
  __esModule: true,
  default: ({ isOpen, onClose, order }: any) =>
    isOpen ? (
      <div data-testid="modal">
        <p>{order?.orderId}</p>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

jest.mock("../../../components/HistoryTable/TableFilters", () => ({
  __esModule: true,
  default: ({
    globalFilter,
    setGlobalFilter,
    selectedDate,
    setSelectedDate,
  }: any) => (
    <div>
      <input
        placeholder="Search"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        data-testid="global-filter"
      />
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        data-testid="date-filter"
      />
    </div>
  ),
}));

jest.mock("../../../hooks/useOrderHistory");

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <AdminOrderHistory />
    </MemoryRouter>
  );
};

describe("AdminOrderHistory", () => {
  beforeEach(() => {
    (useAdminOrderHistory as jest.Mock).mockReturnValue({
      data: mockOrders,
      isLoading: false,
    });
  });

  it("renders the component and displays orders", () => {
    renderComponent();
    expect(screen.getByText("Order History")).toBeVisible();
    expect(screen.getByText("ORD123")).toBeVisible();
    expect(screen.getByText("ORD456")).toBeVisible();
  });

  it("filters orders by global search", async () => {
    renderComponent();
    const input = screen.getByTestId("global-filter");
    fireEvent.change(input, { target: { value: "ORD123" } });

    await waitFor(() => {
      expect(screen.getByText("ORD123")).toBeVisible();
    });
  });

  it("filters orders by selected date", async () => {
    renderComponent();
    const dateInput = screen.getByTestId("date-filter");

    fireEvent.change(dateInput, { target: { value: "2023-01-01" } });

    await waitFor(() => {
      expect(screen.getByText("ORD123")).toBeVisible();
      expect(screen.queryByText("ORD456")).not.toBeInTheDocument();
    });
  });
  it("opens and close modal", async () => {
    (useAdminOrderHistory as jest.Mock).mockReturnValue({
      data: mockOrders,
      isLoading: false,
      meta: {
        openModal: jest.fn(), // or a real function to test
      },
    });
    renderComponent();

    const viewDetailsButton = screen.getAllByText("View Details")[0];
    fireEvent.click(viewDetailsButton);

    await waitFor(() => {
      expect(screen.getByTestId("modal")).toBeVisible();
      expect(screen.getAllByText("ORD123")).toHaveLength(2);
    });

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
      expect(screen.getAllByText("ORD123")).toHaveLength(1);
    });
  });
  it("renders truncated orderId if longer than 10 characters", () => {
    (useAdminOrderHistory as jest.Mock).mockReturnValue({
      data: [
        {
          orderId: "123456789012345",
          createdAt: "2024-04-01",
          userId: { name: "John" },
        },
      ],
      isLoading: false,
    });

    renderComponent();

    const truncated = screen.getByTitle("123456789012345");
    expect(truncated.textContent).toBe("1234567890...");
  });

  it("renders full orderId if 10 characters or less", () => {
    (useAdminOrderHistory as jest.Mock).mockReturnValue({
      data: [
        {
          orderId: "ABCDE12345",
          createdAt: "2024-04-01",
          userId: { name: "Jane" },
        },
      ],
      isLoading: false,
    });

    renderComponent();

    const full = screen.getByTitle("ABCDE12345");
    expect(full.textContent).toBe("ABCDE12345");
  });

  test("shows 'Unknown User' when userId is missing", async () => {
    (useAdminOrderHistory as jest.Mock).mockReturnValue({
      data: [
        {
          orderId: "ABCDE12345",
          createdAt: "2024-04-01",
          userId: null,
        },
      ],
      isLoading: false,
    });
    renderComponent();
    expect(await screen.findByText("Unknown User")).toBeVisible();
  });

  test("renders no orders message if data is undefined", () => {
    (useAdminOrderHistory as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });
    renderComponent();
    expect(screen.getByText(/no data available/i)).toBeVisible();
  });
});
