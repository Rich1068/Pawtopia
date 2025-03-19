import { flexRender, Table } from "@tanstack/react-table";
import type { IProduct } from "../../../../types/Types";

const ProductTable = ({ table }: { table: Table<IProduct> }) => {
  return (
    <>
      <div className="overflow-x-auto mt-4 rounded-md border border-orange-300 shadow-md">
        <table className="w-full rounded-md overflow-hidden">
          <thead className="bg-orange-500 text-white text-sm sm:text-xl">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-3 text-center font-semibold">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="even:bg-orange-50 odd:bg-white">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="p-3 border-orange-300 text-center"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
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
    </>
  );
};

export default ProductTable;
