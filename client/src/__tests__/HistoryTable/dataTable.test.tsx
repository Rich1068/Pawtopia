import { render, screen, fireEvent } from "@testing-library/react";
import DataTable from "../../components/HistoryTable/DataTable";
import { Table } from "@tanstack/react-table";
import "@testing-library/jest-dom";

const mockTable = {
  getHeaderGroups: jest.fn(() => [
    {
      id: "header-group-1",
      headers: [
        {
          id: "header-1",
          column: {
            columnDef: { header: "Name" },
          },
          getContext: jest.fn(),
        },
      ],
    },
  ]),
  getRowModel: jest.fn(() => ({
    rows: [
      {
        id: "row-1",
        getVisibleCells: jest.fn(() => [
          {
            id: "cell-1",
            column: {
              columnDef: { cell: "John Doe" },
            },
            getContext: jest.fn(),
          },
        ]),
      },
    ],
  })),
  getCanPreviousPage: jest.fn(),
  getCanNextPage: jest.fn(),
  previousPage: jest.fn(),
  nextPage: jest.fn(),
  getState: jest.fn(() => ({
    pagination: {
      pageIndex: 0,
    },
  })),
  getPageCount: jest.fn(() => 5),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as unknown as Table<any>;

// Mock flexRender
jest.mock("@tanstack/react-table", () => ({
  ...jest.requireActual("@tanstack/react-table"),
  flexRender: jest.fn((content) => content),
}));

describe("DataTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders table with headers and rows", () => {
    render(<DataTable table={mockTable} />);

    expect(screen.getByRole("table")).toBeVisible();
    expect(screen.getByText("Name")).toBeVisible();
    expect(screen.getByText("John Doe")).toBeVisible();
  });

  it("renders pagination controls", () => {
    render(<DataTable table={mockTable} />);

    expect(screen.getByText("Prev")).toBeVisible();
    expect(screen.getByText("Next")).toBeVisible();
    expect(screen.getByText("Page 1 of 5")).toBeVisible();
  });

  it("handles pagination navigation correctly", () => {
    (mockTable.getCanPreviousPage as jest.Mock).mockReturnValue(true);
    (mockTable.getCanNextPage as jest.Mock).mockReturnValue(true);

    render(<DataTable table={mockTable} />);

    fireEvent.click(screen.getByText("Next"));
    expect(mockTable.nextPage).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("Prev"));
    expect(mockTable.previousPage).toHaveBeenCalledTimes(1);
  });
  it("disables pagination buttons when appropriate", () => {
    (mockTable.getCanPreviousPage as jest.Mock).mockReturnValue(false);
    (mockTable.getCanNextPage as jest.Mock).mockReturnValue(false);

    render(<DataTable table={mockTable} />);

    expect(screen.getByText("Prev")).toBeDisabled();
    expect(screen.getByText("Next")).toBeDisabled();
  });
});
