import { render, screen, waitFor } from "@testing-library/react";
import EarningsChart from "../../../components/AdminDashboard/EarningsChart";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEarningsStats } from "../../../hooks/useDashboardStats";

jest.mock("../../../hooks/useDashboardStats", () => ({
  useEarningsStats: jest.fn(),
}));

jest.mock("react-chartjs-2", () => ({
  Line: () => <img alt="chart" />,
}));

const queryClient = new QueryClient();
const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <EarningsChart />
    </QueryClientProvider>
  );
};
describe("EarningsChart Component", () => {
  it("renders loading state", () => {
    (useEarningsStats as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });

    renderComponent();

    expect(screen.getByText("Loading...")).toBeVisible();
  });

  it("renders error state", () => {
    (useEarningsStats as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    });

    renderComponent();

    expect(screen.getByText("Error fetching data")).toBeVisible();
  });

  it("renders chart with fetched data", async () => {
    const mockData = [
      { _id: 1, total: 5 },
      { _id: 2, total: 10 },
      { _id: 3, total: 15 },
    ];

    (useEarningsStats as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    });

    renderComponent();

    await waitFor(() =>
      expect(screen.getByText("Earnings Per Month")).toBeVisible()
    );

    expect(screen.getByRole("img", { name: /chart/i })).toBeVisible();
  });
});
