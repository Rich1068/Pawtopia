import AdminOrderHistory from "../../../pages/Admin/AdminOrderHistory";
import serverAPI from "../../../helper/axios";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { mockOrders } from "../../../__mocks__/mockOrders";
import { createWrapper } from "../../../__mocks__/utils/testUtils";

const wrapper = createWrapper();

const renderComponent = () => {
  return render(
    wrapper({
      children: <AdminOrderHistory />,
    })
  );
};

jest.mock("../../../helper/axios");
jest.mock("../../../components/LoadingPage/LoadingPage", () => () => (
  <div data-testid="loading-spinner">Loading...</div>
));
jest.mock(
  "../../../components/OrderHistory/OrderDetailModal",
  () =>
    ({
      isOpen,
      onClose,
    }: {
      isOpen: boolean;
      onClose: () => void;
      order: { orderId: string; userId: { name: string }; createdAt: string };
    }) =>
      isOpen ? (
        <div>
          <div>OrderDetailsModal</div>
          <button onClick={onClose} data-testid="close-modal">
            Close
          </button>
        </div>
      ) : null
);
jest.mock(
  "../../../components/shop/Admin/TitleComponent",
  () =>
    ({ text }: { text: string }) =>
      <h1>{text}</h1>
);
jest.mock(
  "../../../components/HistoryTable/TableFilters",
  () =>
    ({
      globalFilter,
      selectedDate,
      setSelectedDate,
      setGlobalFilter,
    }: {
      globalFilter: string;
      selectedDate: string;
      setSelectedDate: (date: string) => void;
      setGlobalFilter: (filter: string) => void;
    }) =>
      (
        <div>
          <input
            data-testid="date-filter"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <input
            data-testid="global-filter"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
      )
);

describe("AdminOrderHistory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading spinner initially", () => {
    renderComponent();
    expect(screen.getByTestId("loading-spinner")).toBeVisible();
  });

  it("fetches orders on mount and displays them", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValue({ data: mockOrders });

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      expect(serverAPI.get).toHaveBeenCalledWith("/order/all", {
        withCredentials: true,
      });
      expect(screen.getByRole("table")).toBeVisible();
    });
  });

  it("filters orders by date", async () => {
    const mockOrders = [
      { orderId: "123", userId: { name: "John Doe" }, createdAt: "2023-01-01" },
      { orderId: "456", userId: { name: "Jane Doe" }, createdAt: "2023-02-01" },
    ];
    (serverAPI.get as jest.Mock).mockResolvedValue({ data: mockOrders });

    await act(async () => {
      renderComponent();
    });

    fireEvent.change(screen.getByTestId("date-filter"), {
      target: { value: "2023-01-01" },
    });

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeVisible();
    });
  });

  it("opens and closes the modal", async () => {
    const mockOrders = [
      { orderId: "123", userId: { name: "John Doe" }, createdAt: "2023-01-01" },
    ];
    (serverAPI.get as jest.Mock).mockResolvedValue({ data: mockOrders });

    await act(async () => {
      renderComponent();
    });

    fireEvent.click(screen.getByText("View Details"));

    expect(screen.getByText("OrderDetailsModal")).toBeVisible();

    fireEvent.click(screen.getByTestId("close-modal"));

    expect(screen.queryByText("OrderDetailsModal")).not.toBeInTheDocument();
  });

  it("handles API errors gracefully", async () => {
    const error = { response: { data: { error: "Test error" } } };
    (serverAPI.get as jest.Mock).mockRejectedValue(error);

    const consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      expect(consoleErrorMock).toHaveBeenCalledWith(
        "Error fetching orders:",
        error
      );
    });

    consoleErrorMock.mockRestore();
  });
});
