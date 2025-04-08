import { render, screen } from "@testing-library/react";
import MonthlyLineChart from "../../../components/AdminDashboard/MonthlyLineChart";
import "@testing-library/jest-dom";

jest.mock("react-chartjs-2", () => ({
  Line: () => <img alt="chart" />,
}));

describe("MonthlyLineChart Component", () => {
  it("renders loading state", () => {
    render(
      <MonthlyLineChart
        title="Test Chart"
        data={undefined}
        isLoading={true}
        isError={false}
        datasetLabel="Test Dataset"
      />
    );

    expect(screen.getByText("Loading...")).toBeVisible();
  });

  it("renders error state", () => {
    render(
      <MonthlyLineChart
        title="Test Chart"
        data={undefined}
        isLoading={false}
        isError={true}
        datasetLabel="Test Dataset"
      />
    );

    expect(screen.getByText("Error fetching data")).toBeVisible();
  });

  it("renders chart with valid data", () => {
    const mockData = [
      { _id: 1, total: 5 },
      { _id: 2, total: 10 },
      { _id: 3, total: 15 },
    ];

    render(
      <MonthlyLineChart
        title="Test Chart"
        data={mockData}
        isLoading={false}
        isError={false}
        datasetLabel="Test Dataset"
      />
    );

    // Check if the title is rendered
    expect(screen.getByText("Test Chart")).toBeVisible();

    // Check if the chart is rendered
    const canvas = screen.getByRole("img", { name: /chart/i });
    expect(canvas).toBeInTheDocument();
  });
});
