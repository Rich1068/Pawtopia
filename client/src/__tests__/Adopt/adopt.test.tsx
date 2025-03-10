import { render, screen, waitFor } from "@testing-library/react";
import serverAPI from "../../helper/axios";
import Adopt from "../../pages/Adopt";
import { mockPets } from "../../__mocks__/mockPets";

import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("../../components/LoadingPage/LoadingPage", () => () => (
  <div data-testid="loading-component">Loading...</div>
));
jest.mock("../../components/PageHeader", () => () => (
  <div data-testid="mock-page-header">Adopt List</div>
));
jest.mock("../../components/Adopt/AdoptContainer", () => () => (
  <div data-testid="mock-adopt-container"></div>
));

const renderWithClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe("Adopt Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state initially", async () => {
    // Simulate slow fetch
    (serverAPI.get as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // never resolves
    );

    renderWithClient(<Adopt />);
    expect(screen.getByTestId("loading-component")).toBeInTheDocument();
  });

  it("displays header and adopt-container when data is loaded", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValue({
      data: { data: mockPets },
    });

    renderWithClient(<Adopt />);

    // Wait for the adopt content to show
    await waitFor(() => {
      expect(screen.getByTestId("mock-page-header")).toBeInTheDocument();
      expect(screen.getByTestId("mock-adopt-container")).toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    (serverAPI.get as jest.Mock).mockRejectedValue(new Error("API Error"));

    renderWithClient(<Adopt />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("FetchPets error: "),
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
});
