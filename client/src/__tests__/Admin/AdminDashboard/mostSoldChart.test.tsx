import { render, screen, waitFor } from "@testing-library/react";
import MostSoldChart from "../../../components/AdminDashboard/MostSoldChart";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMostSoldProducts } from "../../../hooks/useDashboardStats";
import "@testing-library/jest-dom";
import { jest } from "@jest/globals";

jest.mock("../../../hooks/useDashboardStats", () => ({
  useMostSoldProducts: jest.fn(),
}));

jest.mock("react-chartjs-2", () => ({
  Bar: () => <img alt="chart" />,
}));

const queryClient = new QueryClient();

const renderWithClient = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe("MostSoldChart Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    (useMostSoldProducts as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });

    renderWithClient(<MostSoldChart />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    (useMostSoldProducts as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    });

    renderWithClient(<MostSoldChart />);

    expect(screen.getByText("Error fetching data")).toBeInTheDocument();
  });

  it("renders chart with fetched data", async () => {
    const mockData = [
      { name: "Product 1", totalSold: 10 },
      { name: "Product 2", totalSold: 20 },
      { name: "Product 3", totalSold: 15 },
    ];

    (useMostSoldProducts as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    });

    renderWithClient(<MostSoldChart />);

    await waitFor(() => {
      expect(screen.getByText("Most Sold Products")).toBeInTheDocument();
    });

    expect(screen.getByRole("img", { name: /chart/i })).toBeInTheDocument();
  });
});
