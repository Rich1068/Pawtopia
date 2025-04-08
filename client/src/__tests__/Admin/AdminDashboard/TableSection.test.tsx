import { render, screen } from "@testing-library/react";
import TableSection from "../../../components/AdminDashboard/TableSection";
import { Table } from "@tanstack/react-table";
import "@testing-library/jest-dom";

// Mock table object
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
        {
          id: "header-2",
          column: {
            columnDef: { header: "Age" },
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
          {
            id: "cell-2",
            column: {
              columnDef: { cell: "30" },
            },
            getContext: jest.fn(),
          },
        ]),
      },
      {
        id: "row-2",
        getVisibleCells: jest.fn(() => [
          {
            id: "cell-3",
            column: {
              columnDef: { cell: "Jane Smith" },
            },
            getContext: jest.fn(),
          },
          {
            id: "cell-4",
            column: {
              columnDef: { cell: "25" },
            },
            getContext: jest.fn(),
          },
        ]),
      },
    ],
  })),
} as unknown as Table<{
  header: string;
  cell: string;
}>;
const emptyMockTable = {
  getHeaderGroups: jest.fn(() => []),
  getRowModel: jest.fn(() => ({ rows: [] })),
  getAllColumns: jest.fn(() => []),
} as unknown as Table<{
  header: string;
  cell: string;
}>;

// Mock flexRender
jest.mock("@tanstack/react-table", () => ({
  ...jest.requireActual("@tanstack/react-table"),
  flexRender: jest.fn((content) => content),
}));

describe("TableSection Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders table with headers and rows", () => {
    render(<TableSection table={mockTable} />);

    // Check if the table headers are rendered
    expect(screen.getByText("Name")).toBeVisible();
    expect(screen.getByText("Age")).toBeVisible();

    // Check if the table rows are rendered
    expect(screen.getByText("John Doe")).toBeVisible();
    expect(screen.getByText("30")).toBeVisible();
    expect(screen.getByText("Jane Smith")).toBeVisible();
    expect(screen.getByText("25")).toBeVisible();
  });

  it("renders the empty state when no rows are available", () => {
    render(<TableSection table={emptyMockTable} />);

    // Check if the empty message is displayed
    expect(screen.getByText("No records found.")).toBeVisible();
  });

  it("renders a custom empty message", () => {
    render(
      <TableSection table={emptyMockTable} emptyMessage="No data available." />
    );

    expect(screen.getByText("No data available.")).toBeVisible();
  });
});
