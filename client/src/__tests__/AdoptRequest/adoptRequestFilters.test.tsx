import { render, screen, fireEvent } from "@testing-library/react";
import AdoptRequestFilters, {
  IAdoptRequestFilters,
} from "../../components/AdoptRequest/AdoptRequestFilters";
import { Table } from "@tanstack/react-table";
import { IAdoptRequest } from "../../types/Types";
import "@testing-library/jest-dom";

jest.mock("lucide-react");

const mockTable = {
  getState: () => ({
    pagination: { pageSize: 10 },
  }),
  setPageSize: jest.fn(),
} as unknown as Table<IAdoptRequest>;

describe("AdoptRequestFilters", () => {
  const mockSetGlobalFilter = jest.fn();
  const mockSetStatusFilter = jest.fn();

  const defaultProps: IAdoptRequestFilters = {
    globalFilter: "",
    statusFilter: "pending",
    setGlobalFilter: mockSetGlobalFilter,
    setStatusFilter: mockSetStatusFilter,
    table: mockTable,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all filter controls", () => {
    render(<AdoptRequestFilters {...defaultProps} />);

    expect(screen.getByRole("combobox", { name: /pagesize/i })).toBeVisible();
    expect(screen.getByTestId("icon-Search")).toBeVisible();
    expect(screen.getByPlaceholderText("Search")).toBeVisible();
    expect(screen.getByRole("combobox", { name: /status/i })).toBeVisible();
  });

  it("changes page size when select value changes", () => {
    render(<AdoptRequestFilters {...defaultProps} />);

    fireEvent.change(screen.getByRole("combobox", { name: /pagesize/i }), {
      target: { value: "20" },
    });
    expect(mockTable.setPageSize).toHaveBeenCalledWith(20);
  });

  it("updates search filter when typing", () => {
    render(<AdoptRequestFilters {...defaultProps} />);

    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "test query" },
    });
    expect(mockSetGlobalFilter).toHaveBeenCalledWith("test query");
  });

  it("updates status filter when changed", () => {
    render(<AdoptRequestFilters {...defaultProps} />);

    fireEvent.change(screen.getByRole("combobox", { name: /status/i }), {
      target: { value: "approved" },
    });
    expect(mockSetStatusFilter).toHaveBeenCalledWith("approved");
  });

  it("only allows valid status values", () => {
    render(<AdoptRequestFilters {...defaultProps} statusFilter="approved" />);

    const statusSelect = screen.getByRole("combobox", { name: /status/i });
    expect(statusSelect).toHaveValue("approved");

    // Try to set an invalid value (TypeScript would catch this at compile time)
    fireEvent.change(statusSelect, {
      target: { value: "invalid-status" },
    });
    // The component should handle this gracefully
    expect(statusSelect).not.toHaveValue("invalid-status");
  });
});
