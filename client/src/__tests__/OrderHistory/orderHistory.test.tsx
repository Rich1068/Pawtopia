import { render, screen, waitFor } from "@testing-library/react";
import { useReactTable } from "@tanstack/react-table";
import serverAPI from "../../helper/axios";
import OrderHistory from "../../pages/OrderHistory";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import PageHeader from "../../components/PageHeader";
import OrderDetailsModal from "../../components/OrderHistory/OrderDetailModal";
import TableFilters from "../../components/HistoryTable/TableFilters";
import DataTable from "../../components/HistoryTable/DataTable";
import { mockOrders } from "../../__mocks__/mockOrders";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";

// Mock dependencies
jest.mock("@tanstack/react-table", () => ({
  ...jest.requireActual("@tanstack/react-table"),
  useReactTable: jest.fn(),
}));
jest.mock("../../helper/axios");
jest.mock("../../components/LoadingPage/LoadingPage");
jest.mock("../../components/PageHeader");
jest.mock("../../components/OrderHistory/OrderDetailModal");
jest.mock("../../components/HistoryTable/TableFilters");
jest.mock("../../components/HistoryTable/DataTable");

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <OrderHistory />
    </MemoryRouter>
  );
};

describe("OrderHistory Component", () => {
  const mockTableInstance = {
    getHeaderGroups: jest.fn().mockReturnValue([]),
    getRowModel: jest.fn().mockReturnValue({
      rows: mockOrders.map((order) => ({
        original: order,
        getValue: (key: string) => order[key as keyof typeof order],
        id: order.orderId,
      })),
    }),
    getCoreRowModel: jest.fn(),
    getPaginationRowModel: jest.fn(),
    getFilteredRowModel: jest.fn(),
    setGlobalFilter: jest.fn(),
    getState: jest.fn().mockReturnValue({
      globalFilter: "",
      pagination: { pageIndex: 0, pageSize: 10 },
    }),
    setPageIndex: jest.fn(),
    setPageSize: jest.fn(),
    getCanPreviousPage: jest.fn().mockReturnValue(false),
    getCanNextPage: jest.fn().mockReturnValue(false),
    nextPage: jest.fn(),
    previousPage: jest.fn(),
    getPageCount: jest.fn().mockReturnValue(1),
  };

  beforeEach(() => {
    (useReactTable as jest.Mock).mockReturnValue(mockTableInstance);
    (LoadingPage as jest.Mock).mockImplementation(() => <div>Loading...</div>);
    (PageHeader as jest.Mock).mockImplementation(({ text }) => (
      <div>{text}</div>
    ));
    (OrderDetailsModal as jest.Mock).mockImplementation(() => (
      <div>OrderDetailsModal</div>
    ));
    (TableFilters as jest.Mock).mockImplementation(() => (
      <div>TableFilters</div>
    ));
    (DataTable as jest.Mock).mockImplementation(({ table }) => (
      <div>
        DataTable
        <button
          onClick={() =>
            table.getRowModel().rows[0]?.original &&
            (OrderDetailsModal as jest.Mock).mock.calls[0][0].onClose()
          }
        >
          View Details
        </button>
      </div>
    ));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state initially", () => {
    renderComponent();
    expect(screen.getByText("Loading...")).toBeVisible();
  });

  it("fetches and displays orders", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValue({ data: mockOrders });
    renderComponent();

    await waitFor(() => {
      expect(serverAPI.get).toHaveBeenCalledWith("/order/history", {
        withCredentials: true,
      });
      expect(screen.getByText("Order History")).toBeVisible();
      expect(screen.getByText("TableFilters")).toBeVisible();
      expect(screen.getByText("DataTable")).toBeVisible();
    });
  });

  it("handles API errors", async () => {
    (serverAPI.get as jest.Mock).mockRejectedValue(new Error("API Error"));
    console.error = jest.fn();

    renderComponent();

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching orders:",
        expect.any(Error)
      );
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
  });

  it("initializes table with correct columns", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValue({ data: mockOrders });
    renderComponent();

    await waitFor(() => {
      expect(useReactTable).toHaveBeenCalledWith(
        expect.objectContaining({
          columns: expect.arrayContaining([
            expect.objectContaining({ accessorKey: "orderId" }),
            expect.objectContaining({ accessorKey: "createdAt" }),
            expect.objectContaining({ accessorKey: "totalAmount" }),
            expect.objectContaining({ id: "actions" }),
          ]),
        })
      );
    });
  });
});
