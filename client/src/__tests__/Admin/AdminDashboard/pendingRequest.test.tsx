import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import PendingRequestsTable from "../../../components/AdminDashboard/PendingRequestTable";
import { usePendingRequests } from "../../../hooks/useDashboardStats";
import "@testing-library/jest-dom";
import { mockAdoptRequests } from "../../../__mocks__/mockAdoptRequests";
import { MemoryRouter } from "react-router";

jest.mock("../../../hooks/useDashboardStats");
jest.mock("lucide-react");
const renderComponent = () => {
  return render(
    <MemoryRouter>
      <PendingRequestsTable />
    </MemoryRouter>
  );
};

describe("PendingRequestsTable Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    (usePendingRequests as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    renderComponent();

    // Check if the loading message is displayed
    expect(screen.getByText("Loading pending requests...")).toBeVisible();
  });

  it("renders error state", () => {
    (usePendingRequests as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    renderComponent();

    // Check if the error message is displayed
    expect(screen.getByText("Error fetching pending requests.")).toBeVisible();
  });

  it("renders table with fetched data", async () => {
    (usePendingRequests as jest.Mock).mockReturnValue({
      data: mockAdoptRequests,
      isLoading: false,
      isError: false,
    });

    renderComponent();

    // Wait for the loading state to disappear
    await waitFor(() =>
      expect(
        screen.queryByText("Loading pending requests...")
      ).not.toBeInTheDocument()
    );

    // Check if the table is rendered with data
    expect(screen.getByText("Latest Pending Adoption Requests")).toBeVisible();
    expect(screen.getByText("John Doe")).toBeVisible();
    expect(screen.getByText("Bella")).toBeVisible();
    expect(screen.getByText("Jane Smith")).toBeVisible();
    expect(screen.getByText("Max")).toBeVisible();
  });
  it('displays "N/A" when petName is null or undefined', async () => {
    const mockRequests = [
      {
        id: "1",
        name: "John Doe",
        petName: null,
        status: "Pending",
        createdAt: "2025-04-01T00:00:00.000Z",
      },
    ];

    (usePendingRequests as jest.Mock).mockReturnValue({
      data: mockRequests,
      isLoading: false,
      isError: false,
    });

    renderComponent();

    await waitFor(() =>
      expect(
        screen.queryByText("Loading pending requests...")
      ).not.toBeInTheDocument()
    );

    expect(screen.getByText("N/A")).toBeVisible();
  });
  it("opens and closes the modal when a request is selected", async () => {
    (usePendingRequests as jest.Mock).mockReturnValue({
      data: mockAdoptRequests,
      isLoading: false,
      isError: false,
    });

    renderComponent();

    await waitFor(() =>
      expect(
        screen.queryByText("Loading pending requests...")
      ).not.toBeInTheDocument()
    );

    fireEvent.click(screen.getAllByText("View Details")[0]);
    expect(screen.getByTestId("icon-X")).toBeVisible();
    fireEvent.click(screen.getByTestId("icon-X"));
    await waitFor(() =>
      expect(screen.queryByTestId("icon-X")).not.toBeInTheDocument()
    );
  });
});
