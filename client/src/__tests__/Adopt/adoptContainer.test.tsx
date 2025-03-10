import { fireEvent, render, screen } from "@testing-library/react";
import { mockPets } from "../../__mocks__/mockPets";
import AdoptContainer from "../../components/Adopt/AdoptContainer";
import { useFilteredPets } from "../../hooks/useFilteredPets";
import { usePagination } from "../../hooks/usePagination";
import "@testing-library/jest-dom";

jest.mock("../../hooks/useFilteredPets", () => ({
  useFilteredPets: jest.fn(),
}));
jest.mock("../../hooks/usePagination", () => ({
  usePagination: jest.fn(),
}));
jest.mock("../../components/Adopt/AdoptFilter", () => () => (
  <div data-testid="mock-filter" />
));
jest.mock("../../components/Adopt/Cards", () => () => (
  <div data-testid="mock-cards" />
));
jest.mock("react-paginate", () => (props: any) => (
  <button
    data-testid="mock-paginate"
    onClick={() => props.onPageChange({ selected: 1 })}
  >
    Next →
  </button>
));

describe("AdoptContainer (Unit)", () => {
  const mockPetCounts = { dog: 1, cat: 1 };
  const mockFilteredPets = mockPets;
  const mockCurrentPets = mockPets.slice(0, 1);
  const mockSetCurrentPage = jest.fn();

  const mockPagination = {
    currentPets: mockCurrentPets,
    currentPage: 1,
    setCurrentPage: mockSetCurrentPage,
    pageCount: 3,
  };

  beforeEach(() => {
    (useFilteredPets as jest.Mock).mockReturnValue({
      filteredPets: mockFilteredPets,
      petCounts: mockPetCounts,
    });

    (usePagination as jest.Mock).mockReturnValue(mockPagination);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders Filters button and Cards component", () => {
    render(<AdoptContainer allPets={mockPets} />);
    expect(screen.getByText("Filters")).toBeVisible();
    expect(screen.getByTestId("mock-cards")).toBeVisible();
  });

  it("toggles mobile filter dropdown on click", () => {
    render(<AdoptContainer allPets={mockPets} />);
    fireEvent.click(screen.getByText("Filters"));
    expect(screen.getByText("✖")).toBeVisible();
  });

  it("calls setCurrentPage on pagination click", () => {
    render(<AdoptContainer allPets={mockPets} />);
    fireEvent.click(screen.getByTestId("mock-paginate"));
    expect(mockSetCurrentPage).toHaveBeenCalledWith(2);
  });
});
