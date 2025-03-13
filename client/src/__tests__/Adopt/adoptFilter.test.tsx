import { render, screen, fireEvent } from "@testing-library/react";
import AdoptFilter from "../../components/Adopt/AdoptFilter";
import "@testing-library/jest-dom";

jest.mock("../../components/Adopt/FilterSection", () => ({
  __esModule: true,
  default: jest.fn(({ title }) => (
    <div data-testid={`filter-section-${title}`} />
  )),
}));

describe("AdoptFilter component", () => {
  const mockSetSelected = jest.fn();
  const mockSetSearchQuery = jest.fn();

  const mockProps = {
    selected: {
      species: ["dog", "cat"],
      age: [],
      size: [],
      gender: [],
    },
    setSelected: mockSetSelected,
    petCounts: {
      species: { dog: 5, cat: 3 },
      age: { baby: 2, young: 4, adult: 3, senior: 1 },
      size: { small: 1, medium: 2, large: 3, xlarge: 0 },
      gender: { male: 6, female: 4 },
    },
    searchQuery: "",
    setSearchQuery: mockSetSearchQuery,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the title, search input, and all filter sections", () => {
    render(<AdoptFilter {...mockProps} />);

    expect(screen.getByText("Filters")).toBeVisible();
    expect(screen.getByPlaceholderText("Search for a pet...")).toBeVisible();

    // Confirm mocked filter sections are rendered
    expect(screen.getByTestId("filter-section-Species")).toBeVisible();
    expect(screen.getByTestId("filter-section-Age")).toBeVisible();
    expect(screen.getByTestId("filter-section-Size")).toBeVisible();
    expect(screen.getByTestId("filter-section-Gender")).toBeVisible();
  });

  it("calls setSearchQuery when typing in the search input", () => {
    render(<AdoptFilter {...mockProps} />);
    const input = screen.getByPlaceholderText(
      "Search for a pet..."
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "Buddy" } });
    expect(mockSetSearchQuery).toHaveBeenCalledWith("Buddy");
  });

  it("calls setSelected and setSearchQuery when clicking Reset", () => {
    render(<AdoptFilter {...mockProps} />);
    fireEvent.click(screen.getByText("Reset"));

    expect(mockSetSearchQuery).toHaveBeenCalledWith("");
    expect(mockSetSelected).toHaveBeenCalledWith({
      species: ["dog", "cat"],
      age: [],
      size: [],
      gender: [],
    });
  });
});
