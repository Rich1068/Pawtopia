import { Search } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { IOrder } from "../../types/Types";

interface OrderFiltersProps {
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  table: Table<IOrder>;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  globalFilter,
  setGlobalFilter,
  selectedDate,
  setSelectedDate,
  table,
}) => {
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3">
      <div className="flex w-full sm:w-auto gap-3">
        <select
          className="p-2 border border-orange-400 rounded font-primary text-amber-950 w-full sm:w-auto"
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>

        {/* Search Input */}
        <div className="relative w-7/1 flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500" />
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search"
            className="pl-10 p-2 border border-orange-400 rounded w-full focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Date Filter aligned to the right on PC */}
      <div className="w-full md:w-auto md:ml-auto">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          className="p-2 border border-orange-400 rounded font-primary text-amber-950 w-full sm:w-auto"
        />
      </div>
    </div>
  );
};

export default OrderFilters;
