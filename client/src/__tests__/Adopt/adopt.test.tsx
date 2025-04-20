import { render, screen } from "@testing-library/react";
import Adopt from "../../pages/Adopt";
import "@testing-library/jest-dom";

jest.mock("../../hooks/usePets", () => ({
  useAllPets: jest.fn(),
}));

jest.mock("../../components/LoadingPage/LoadingPage", () => ({
  __esModule: true, // If it's an ES module
  default: jest.fn(() => <div data-testid="mock-loading">Loading...</div>),
}));

jest.mock("../../components/PageHeader", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="mock-page-header">Page Header</div>),
}));

jest.mock("../../components/Adopt/AdoptContainer", () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="mock-adopt-container">Adopt Container</div>
  )),
}));

import { useAllPets } from "../../hooks/usePets";
import { MemoryRouter } from "react-router";

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <Adopt />
    </MemoryRouter>
  );
};

describe("Adopt Page", () => {
  it("shows loading state", () => {
    (useAllPets as jest.Mock).mockReturnValue({
      data: [],
      isLoading: true,
    });

    renderComponent();
    expect(screen.getByTestId("mock-loading")).toBeInTheDocument();
  });

  it("renders AdoptContainer when pets are loaded", () => {
    (useAllPets as jest.Mock).mockReturnValue({
      data: [{ id: 1, name: "Max" }],
      isLoading: false,
    });

    renderComponent();

    expect(screen.getByTestId("mock-page-header")).toBeInTheDocument();
    expect(screen.getByTestId("mock-adopt-container")).toBeInTheDocument();
  });
});
