import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Shop from "../../pages/Shop";
import serverAPI from "../../helper/axios";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import { mockProducts } from "../../__mocks__/mockProducts";

jest.mock("../../helper/axios");

// Create a new query client before each test
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

describe("Shop Page", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
    queryClient = createTestQueryClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Shop />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it("renders loading state initially", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValueOnce({ data: { data: [] } });

    renderComponent();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  it("renders products when API call is successful", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValueOnce({
      data: { data: mockProducts },
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Premium Dog Food")).toBeInTheDocument();
    });
  });

  it("renders empty shop when no products are available", async () => {
    (serverAPI.get as jest.Mock).mockResolvedValueOnce({ data: { data: [] } });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Shop")).toBeInTheDocument();
    });

    // Ensure no products are displayed
    expect(screen.queryByText("Premium Dog Food")).not.toBeInTheDocument();
  });

  it("logs an error when API call fails", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {}); // Mock console.log

    (serverAPI.get as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );

    renderComponent();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "FetchPets error: ",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore(); // Restore original console.log
  });
});
