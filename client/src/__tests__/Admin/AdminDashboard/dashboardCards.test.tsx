import { render, screen, waitFor } from "@testing-library/react";
import DashboardCards from "../../../components/AdminDashboard/DashboardCards";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";
import { useAdminStats } from "../../../hooks/useDashboardStats";

jest.mock("../../../hooks/useDashboardStats", () => ({
  useAdminStats: jest.fn(),
}));

jest.mock("lucide-react");

const queryClient = new QueryClient();

const renderWithClient = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe("DashboardCards", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    (useAdminStats as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    renderWithClient(<DashboardCards />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders error state", () => {
    (useAdminStats as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("Something went wrong"),
    });

    renderWithClient(<DashboardCards />);
    expect(
      screen.getByText("Error fetching stats. Please try again.")
    ).toBeInTheDocument();
  });

  it("renders dashboard cards with data", async () => {
    const mockData = {
      totalProducts: 25,
      totalRevenue: 1234.56,
      totalAdoptions: 8,
      totalPendingAdoptions: 3,
    };

    (useAdminStats as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
    });

    renderWithClient(<DashboardCards />);

    await waitFor(() => {
      expect(screen.getByText("Total Products")).toBeInTheDocument();
    });

    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("$1234.56")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders fallback values if some data fields are missing", async () => {
    (useAdminStats as jest.Mock).mockReturnValue({
      data: {},
      isLoading: false,
      error: null,
    });

    renderWithClient(<DashboardCards />);

    expect(screen.queryAllByText("0")[0]).toBeInTheDocument(); // fallback for numbers
    expect(screen.getByText("$0")).toBeInTheDocument(); // fallback for revenue
  });
});
