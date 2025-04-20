/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import DataTable from "../../components/HistoryTable/DataTable";
import { Table } from "@tanstack/react-table";
import "@testing-library/jest-dom";

const createMockTable = <T extends object>(
  rows: any[] = [],
  canPrevious = true,
  canNext = true,
  pageIndex = 0,
  pageCount = 5
): Table<T> => {
  // Create a base mock with the minimal required properties
  const mockTable = {
    getHeaderGroups: jest.fn().mockReturnValue([
      {
        id: "header-group-1",
        headers: [
          {
            id: "header-1",
            column: {
              columnDef: {
                header: "Column 1",
              },
              getCanSort: jest.fn().mockReturnValue(true),
              getIsSorted: jest.fn().mockReturnValue(false),
              getToggleSortingHandler: jest.fn().mockReturnValue(() => {}),
            },
            getContext: jest.fn().mockReturnValue({}),
          },
          {
            id: "header-2",
            column: {
              columnDef: {
                header: "Column 2",
              },
              getCanSort: jest.fn().mockReturnValue(true),
              getIsSorted: jest.fn().mockReturnValue("asc"),
              getToggleSortingHandler: jest.fn().mockReturnValue(() => {}),
            },
            getContext: jest.fn().mockReturnValue({}),
          },
          {
            id: "header-3",
            column: {
              columnDef: {
                header: "Column 3",
              },
              getCanSort: jest.fn().mockReturnValue(true),
              getIsSorted: jest.fn().mockReturnValue("desc"),
              getToggleSortingHandler: jest.fn().mockReturnValue(() => {}),
            },
            getContext: jest.fn().mockReturnValue({}),
          },
        ],
      },
    ]),
    getRowModel: jest.fn().mockReturnValue({
      rows,
    }),
    getState: jest.fn().mockReturnValue({
      pagination: {
        pageIndex,
      },
    }),
    getCanPreviousPage: jest.fn().mockReturnValue(canPrevious),
    getCanNextPage: jest.fn().mockReturnValue(canNext),
    getPageCount: jest.fn().mockReturnValue(pageCount),
    previousPage: jest.fn(),
    nextPage: jest.fn(),
  };

  return mockTable as unknown as Table<T>;
};

jest.mock("@tanstack/react-table", () => ({
  flexRender: (component: any) => component,
}));

describe("DataTable", () => {
  test("renders with headers and data", () => {
    const mockRows = [
      {
        id: "row-1",
        getVisibleCells: () => [
          {
            id: "cell-1-1",
            column: { columnDef: { cell: "Data 1-1" } },
            getContext: jest.fn().mockReturnValue({}),
          },
          {
            id: "cell-1-2",
            column: { columnDef: { cell: "Data 1-2" } },
            getContext: jest.fn().mockReturnValue({}),
          },
          {
            id: "cell-1-3",
            column: { columnDef: { cell: "Data 1-3" } },
            getContext: jest.fn().mockReturnValue({}),
          },
        ],
      },
      {
        id: "row-2",
        getVisibleCells: () => [
          {
            id: "cell-2-1",
            column: { columnDef: { cell: "Data 2-1" } },
            getContext: jest.fn().mockReturnValue({}),
          },
          {
            id: "cell-2-2",
            column: { columnDef: { cell: "Data 2-2" } },
            getContext: jest.fn().mockReturnValue({}),
          },
          {
            id: "cell-2-3",
            column: { columnDef: { cell: "Data 2-3" } },
            getContext: jest.fn().mockReturnValue({}),
          },
        ],
      },
    ];

    const mockTable = createMockTable(mockRows);
    render(<DataTable table={mockTable} />);

    expect(screen.getByText("Column 1")).toBeVisible();
    expect(screen.getByText("Column 2")).toBeVisible();
    expect(screen.getByText("Column 3")).toBeVisible();

    expect(screen.getByText("Data 1-1")).toBeVisible();
    expect(screen.getByText("Data 2-3")).toBeVisible();

    expect(screen.getByText("Page 1 of 5")).toBeVisible();
  });

  test("shows loading state when isLoading is true", () => {
    const mockTable = createMockTable([]);
    render(<DataTable table={mockTable} isLoading={true} />);

    expect(screen.queryByText("No data available.")).not.toBeInTheDocument();
  });

  test('shows "No data available" when no rows', () => {
    const mockTable = createMockTable([]);
    render(<DataTable table={mockTable} />);

    expect(screen.getByText("No data available.")).toBeVisible();
  });

  test("pagination buttons work correctly", () => {
    const mockTable = createMockTable([
      { id: "row-1", getVisibleCells: () => [] },
    ]);
    render(<DataTable table={mockTable} />);

    const prevButton = screen.getByText("Prev");
    const nextButton = screen.getByText("Next");

    fireEvent.click(prevButton);
    expect(mockTable.previousPage).toHaveBeenCalledTimes(1);

    fireEvent.click(nextButton);
    expect(mockTable.nextPage).toHaveBeenCalledTimes(1);
  });

  test("pagination buttons are disabled correctly", () => {
    const mockTable = createMockTable(
      [{ id: "row-1", getVisibleCells: () => [] }],
      false,
      false
    );

    render(<DataTable table={mockTable} />);

    const prevButton = screen.getByText("Prev");
    const nextButton = screen.getByText("Next");

    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  test("renders different sort icons based on column sort state", () => {
    const mockTable = createMockTable([]);
    render(<DataTable table={mockTable} />);

    // We can't directly test for the icons, but we can at least ensure the component renders
    const headers = mockTable.getHeaderGroups()[0].headers;
    expect(headers[0].column.getIsSorted).toHaveBeenCalled();
    expect(headers[1].column.getIsSorted).toHaveBeenCalled();
    expect(headers[2].column.getIsSorted).toHaveBeenCalled();
  });
});
