import { render, screen, fireEvent } from "@testing-library/react";
import TableFilters from "../../components/HistoryTable/TableFilters";
import { Table } from "@tanstack/react-table";
import "@testing-library/jest-dom";
import { IProduct } from "../../types/Types";

jest.mock("lucide-react");

const mockTable = {
  getState: () => ({
    pagination: { pageSize: 10 },
  }),
  setPageSize: jest.fn(),
} as unknown as Table<IProduct>;

describe("TableFilters", () => {
  const mockSetGlobalFilter = jest.fn();
  const mockSetSelectedDate = jest.fn();

  const defaultProps = {
    globalFilter: "",
    setGlobalFilter: mockSetGlobalFilter,
    selectedDate: "2023-01-01",
    setSelectedDate: mockSetSelectedDate,
    table: mockTable,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all filter controls with correct test IDs", () => {
    render(<TableFilters {...defaultProps} />);

    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByTestId("date-input")).toBeInTheDocument();
    expect(screen.getByTestId("10-size-input")).toBeInTheDocument();
    expect(screen.getByTestId("icon-Search")).toBeInTheDocument();
  });

  it("has all page size options with correct test IDs", () => {
    render(<TableFilters {...defaultProps} />);

    [10, 20, 30, 40, 50].forEach((size) => {
      expect(screen.getByTestId(`${size}-size-input`)).toBeInTheDocument();
    });
  });

  it("handles page size selection change", () => {
    render(<TableFilters {...defaultProps} />);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "20" },
    });
    expect(mockTable.setPageSize).toHaveBeenCalledWith(20);
  });

  it("updates search filter when typing", () => {
    render(<TableFilters {...defaultProps} />);

    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "test query" },
    });
    expect(mockSetGlobalFilter).toHaveBeenCalledWith("test query");
  });

  it("updates date filter when changed", () => {
    render(<TableFilters {...defaultProps} />);

    fireEvent.change(screen.getByTestId("date-input"), {
      target: { value: "2023-02-15" },
    });
    expect(mockSetSelectedDate).toHaveBeenCalledWith("2023-02-15");
  });

  it("displays current filter values correctly", () => {
    render(
      <TableFilters
        {...defaultProps}
        globalFilter="current search"
        selectedDate="2023-03-20"
      />
    );

    expect(screen.getByTestId("search-input")).toHaveValue("current search");
    expect(screen.getByTestId("date-input")).toHaveValue("2023-03-20");
  });
});
