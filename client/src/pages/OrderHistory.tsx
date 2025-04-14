import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import type { IOrder } from "../types/Types";
import PageHeader from "../components/PageHeader";
import OrderDetailsModal from "../components/OrderHistory/OrderDetailModal";
import TableFilters from "../components/HistoryTable/TableFilters";
import DataTable from "../components/HistoryTable/DataTable";
import { useOrderHistory } from "../hooks/useOrderHistory";

const OrderHistory = () => {
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const { data: orders = [], isLoading } = useOrderHistory();

  const filteredOrders = useMemo(() => {
    if (!selectedDate) return orders;

    return orders.filter((order) => {
      const localDate = new Date(order.createdAt as string).toLocaleDateString(
        "en-CA"
      ); // "YYYY-MM-DD"
      return localDate === selectedDate;
    });
  }, [orders, selectedDate]);

  const columns: ColumnDef<IOrder>[] = [
    {
      accessorKey: "orderId",
      header: "Order ID",
      cell: ({ getValue }) => {
        const orderId: string = getValue<string>();

        return (
          <span className="cursor-pointer" title={orderId}>
            {orderId.length > 10 ? orderId.slice(0, 10) + "..." : orderId}
          </span>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ getValue }) => new Date(getValue<Date>()).toLocaleDateString(),
      enableSorting: true,
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: ({ getValue }) => `$${getValue<number>().toFixed(2)}`,
      enableSorting: true,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <button
          className="text-orange-500 hover:underline"
          onClick={() => setSelectedOrder(row.original)}
        >
          View Details
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredOrders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="relative font-primary text-amber-950">
      <PageHeader text="Order History" />
      <div className="p-4 sm:p-6 rounded-xl min-h-screen">
        <div className="sm:px-[6%]">
          <TableFilters
            globalFilter={globalFilter}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            setGlobalFilter={setGlobalFilter}
            table={table}
          />
        </div>
        <DataTable table={table} isLoading={isLoading} />
      </div>
      <OrderDetailsModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrderHistory;
