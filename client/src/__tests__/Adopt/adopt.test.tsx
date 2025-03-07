import { act, render, screen, waitFor } from "@testing-library/react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import serverAPI from "../../helper/axios";
import Adopt from "../../pages/Adopt";
import { mockPets } from "../../__mocks__/mockPets"; // Mock pet data

import "@testing-library/jest-dom";

jest.mock("../../helper/axios", () => ({
  default: {
    get: jest.fn(),
  },
}));

serverAPI.get = jest.fn();
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

jest.mock("../../helper/envVariables", () => ({
  VITE_SERVER_URL: "http://localhost:8000",
}));
jest.mock("../../components/LoadingPage/LoadingPage", () => () => (
  <div data-testid="loading-component">Loading...</div>
));
jest.mock("../../components/PageHeader", () => () => (
  <div data-testid="mock-page-header">Adopt List</div>
));
jest.mock("../../components/Adopt/AdoptContainer", () => () => (
  <div data-testid="mock-adopt-container"></div>
));
const queryClient = new QueryClient();
describe("Adopt Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state initially", () => {
    (serverAPI.get as jest.Mock).mockReturnValue(new Promise(() => {})); // Simulate pending request

    render(
      <QueryClientProvider client={queryClient}>
        <Adopt />
      </QueryClientProvider>
    );
  });

  it("fetches and display header and adopt-container", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Adopt />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("mock-page-header")).toBeVisible();
      expect(screen.getByTestId("mock-adopt-container")).toBeVisible();
    });
  });

  it("handles API errors gracefully", async () => {
    jest.spyOn(console, "log").mockImplementation(() => {}); // Suppress console logs
    serverAPI.get = jest.fn().mockRejectedValue(new Error("API Error"));

    render(
      <QueryClientProvider client={queryClient}>
        <Adopt />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining("FetchPets error "),
        expect.any(Error)
      );
    });

    jest.restoreAllMocks();
  });
});
