import { flexRender, Table } from "@tanstack/react-table";
import type { IAdoptRequest } from "../../types/Types";

const RequestTable = ({
  table,
  style,
}: {
  table: Table<IAdoptRequest>;
  style?: string;
}) => {
  const noData = table.getRowModel().rows.length === 0;

  return (
    <div className={`sm:px-[6%] ${style}`}>
      <div className="overflow-x-auto mt-4 rounded-md border border-orange-300 shadow-md">
        <table className="w-full rounded-md overflow-hidden">
          <thead className="bg-orange-500 text-white text-sm sm:text-md">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-2 sm:p-3 text-center font-semibold"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="text-sm">
            {noData ? (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="p-4 text-center text-gray-500"
                >
                  No adoption requests found.
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
    </div>
  );
};

export default RequestTable;
