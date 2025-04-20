/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RequestHistory from "../../pages/RequestHistory";
import "@testing-library/jest-dom";
import { mockAdoptRequests } from "../../__mocks__/mockAdoptRequests";
import { createWrapper } from "../../__mocks__/utils/testUtils";

// ✅ only mock the hook you use in the component
jest.mock("../../hooks/useAdoptRequests", () => ({
  useAdoptRequestHistory: () => ({
    data: mockAdoptRequests,
    isLoading: false,
  }),
}));

const wrapper = createWrapper();

const renderRequestHistory = () =>
  render(wrapper({ children: <RequestHistory /> }));

jest.mock("../../components/LoadingPage/LoadingPage", () => () => (
  <div data-testid="mock-loading-page">Loading...</div>
));

jest.mock("../../components/PageHeader", () => () => (
  <div data-testid="mock-page-header">Request History</div>
));

jest.mock("lucide-react");

jest.mock(
  "../../components/HistoryTable/TableFilters",
  () =>
    ({ setGlobalFilter, setSelectedDate }: any) =>
      (
        <div data-testid="mock-table-filters">
          <button onClick={() => setGlobalFilter("bella")}>Set Filter</button>
          <button onClick={() => setSelectedDate("2025-03-01")}>
            Set Date
          </button>
        </div>
      )
);

jest.mock(
  "../../components/AdoptRequest/AdoptRequestModal",
  () =>
    ({ isOpen, onClose, request }: any) =>
      (
        <div data-testid="mock-adopt-request-modal">
          {isOpen ? "Modal Open" : "Modal Closed"}
          {request && <div>{request.petName}</div>}
          <button onClick={onClose}>Close Modal</button>
        </div>
      )
);

describe("RequestHistory Page", () => {
  it("renders all main components", async () => {
    renderRequestHistory();

    expect(screen.getByTestId("mock-page-header")).toBeVisible();
    expect(screen.getByTestId("mock-table-filters")).toBeVisible();
    expect(screen.getByRole("table")).toBeVisible();
    expect(screen.getByTestId("mock-adopt-request-modal")).toBeVisible();
  });

  it("displays request data after fetching", async () => {
    renderRequestHistory();
    await waitFor(() => screen.getByText("Bella")); // assuming Bella is in mock data
    expect(screen.getByText("Bella")).toBeVisible();
  });

  it("filters requests by selected date", async () => {
    renderRequestHistory();

    fireEvent.click(screen.getByText("Set Date"));

    expect(screen.getByText("Bella")).toBeVisible();
  });

  it("filters requests by global filter", async () => {
    renderRequestHistory();

    fireEvent.click(screen.getByText("Set Filter"));

    expect(screen.getByText("Bella")).toBeVisible();
  });

  it("opens and closes the modal with selected request", async () => {
    renderRequestHistory();

    await waitFor(() => screen.getByText("Bella"));

    fireEvent.click(screen.getAllByText(/view details/i)[0]);
    expect(screen.getByTestId("mock-adopt-request-modal")).toHaveTextContent(
      "Modal Open"
    );
    expect(screen.getByTestId("mock-adopt-request-modal")).toHaveTextContent(
      "Bella"
    );
    fireEvent.click(screen.getByText("Close Modal"));

    expect(screen.getByTestId("mock-adopt-request-modal")).toHaveTextContent(
      "Modal Closed"
    );
  });
});
