import { flexRender, Table } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, LoaderCircle } from "lucide-react";

interface IDataTable<T> {
  table: Table<T>;
  isLoading?: boolean;
  style?: string;
}

const DataTable = <T,>({ table, isLoading, style }: IDataTable<T>) => {
  return (
    <div className={`sm:px-[6%] ${style}`}>
      <div className="overflow-x-auto mt-4 rounded-md border border-orange-300 shadow-md">
        <table className="w-full rounded-md overflow-hidden">
          <thead className="bg-orange-500 text-white text-sm sm:text-xl">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-2 sm:p-3 text-center font-semibold"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <div
                          onClick={header.column.getToggleSortingHandler()}
                          className="cursor-pointer"
                        >
                          {header.column.getIsSorted() === "desc" ? (
                            <ArrowUp className="w-5 h-5" />
                          ) : header.column.getIsSorted() === "asc" ? (
                            <ArrowDown className="w-5 h-5" />
                          ) : (
                            <ArrowUpDown className="w-5 h-5 opacity-50" />
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={table.getHeaderGroups()[0]?.headers.length || 1}
                  className="p-4 text-center"
                >
                  <div className="flex justify-center items-center text-orange-500 animate-spin">
                    <LoaderCircle />
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={table.getHeaderGroups()[0]?.headers.length || 1}
                  className="p-4 text-center text-gray-500"
                >
                  No data available.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="even:bg-orange-50 odd:bg-white">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="p-3 border-orange-300 text-center"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-row justify-between sm:justify-end items-center mt-4 gap-3">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 sm:w-auto"
        >
          Prev
        </button>
        <span className="text-amber-950">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 sm:w-auto"
        >
          Next
        </button>
      </div>
    </div>
  );
};
export default DataTable;
