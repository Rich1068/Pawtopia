import { render, screen } from "@testing-library/react";
import AdminDashboard from "../../../pages/Admin/AdminDashboard";
import "@testing-library/jest-dom";

jest.mock("../../../components/AdminDashboard/DashboardCards", () => () => (
  <div data-testid="dashboard-cards">Dashboard Cards</div>
));

jest.mock("../../../components/AdminDashboard/AdoptionChart", () => () => (
  <div data-testid="adoption-chart">Adoption Chart</div>
));

jest.mock("../../../components/AdminDashboard/EarningsChart", () => () => (
  <div data-testid="earnings-chart">Earnings Chart</div>
));

jest.mock("../../../components/AdminDashboard/MostSoldChart", () => () => (
  <div data-testid="most-sold-chart">Most Sold Chart</div>
));

jest.mock(
  "../../../components/AdminDashboard/PendingRequestTable",
  () => () => <div data-testid="pending-requests">Pending Requests Table</div>
);

jest.mock("../../../components/AdminDashboard/RecentOrdersTable", () => () => (
  <div data-testid="recent-orders">Recent Orders Table</div>
));

describe("AdminDashboard", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("renders all main sections", () => {
    render(<AdminDashboard />);

    // Verify dashboard cards section exists
    expect(screen.getByTestId("dashboard-cards")).toBeVisible();

    // Verify charts & reports section header
    expect(screen.getByText("Charts & Reports")).toBeVisible();
  });

  it("renders all chart components in the left column", () => {
    render(<AdminDashboard />);

    // Left column charts
    expect(screen.getByTestId("adoption-chart")).toBeVisible();
    expect(screen.getByTestId("earnings-chart")).toBeVisible();
    expect(screen.getByTestId("most-sold-chart")).toBeVisible();
  });

  it("renders all table components in the right column", () => {
    render(<AdminDashboard />);

    // Right column tables
    expect(screen.getByTestId("pending-requests")).toBeVisible();
    expect(screen.getByTestId("recent-orders")).toBeVisible();
  });
});
