/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RequestHistory from "../../pages/RequestHistory";
import "@testing-library/jest-dom";
import serverAPI from "../../helper/axios";
import { mockAdoptRequests } from "../../__mocks__/mockAdoptRequests";

// Mock components
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

// Mock serverAPI
jest.mock("../../helper/axios");

describe("RequestHistory Page", () => {
  beforeEach(() => {
    (serverAPI.get as jest.Mock).mockResolvedValue({ data: mockAdoptRequests });
  });

  it("renders loading page initially", () => {
    render(<RequestHistory />);
    expect(screen.getByTestId("mock-loading-page")).toBeVisible();
  });

  it("renders the main components after loading", async () => {
    render(<RequestHistory />);
    await waitFor(() =>
      expect(screen.queryByTestId("mock-loading-page")).not.toBeInTheDocument()
    );

    expect(screen.getByTestId("mock-page-header")).toBeVisible();
    expect(screen.getByTestId("mock-table-filters")).toBeVisible();
    expect(screen.getByRole("table")).toBeVisible();
    expect(screen.getByTestId("mock-adopt-request-modal")).toBeVisible();
  });

  it("fetches and displays requests", async () => {
    render(<RequestHistory />);
    await waitFor(() =>
      expect(screen.queryByTestId("mock-loading-page")).not.toBeInTheDocument()
    );

    expect(screen.getByText("Bella")).toBeVisible();
  });

  it("filters requests by date", async () => {
    render(<RequestHistory />);
    await waitFor(() =>
      expect(screen.queryByTestId("mock-loading-page")).not.toBeInTheDocument()
    );

    fireEvent.click(screen.getByText("Set Date"));
    expect(screen.getByText("Bella")).toBeVisible();
  });

  it("filters requests by global filter", async () => {
    render(<RequestHistory />);

    await waitFor(() =>
      expect(screen.queryByTestId("mock-loading-page")).not.toBeInTheDocument()
    );

    fireEvent.click(screen.getByText("Set Filter"));
    expect(screen.getByText("Bella")).toBeVisible();
  });
});
