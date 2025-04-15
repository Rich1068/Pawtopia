import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import OrderDetailsModal from "../../components/OrderHistory/OrderDetailModal";
import type { IOrder } from "../../types/Types";
import TitleComponent from "../../components/shop/Admin/TitleComponent";
import OrderFilters from "../../components/HistoryTable/TableFilters";
import DataTable from "../../components/HistoryTable/DataTable";
import { useAdminOrderHistory } from "../../hooks/useOrderHistory";

const AdminOrderHistory = () => {
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const { data: orders = [], isLoading } = useAdminOrderHistory();

  const filteredOrders = useMemo(() => {
    if (!selectedDate) return orders;

    return orders.filter((order) => {
      const localDate = new Date(order.createdAt as string).toLocaleDateString(
        "en-CA"
      ); // "YYYY-MM-DD"
      return localDate === selectedDate;
    });
  }, [orders, selectedDate]);

  const openModal = (order: IOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const columns: ColumnDef<IOrder>[] = [
    {
      accessorKey: "orderId",
      header: "Order ID",
      cell: ({ getValue }) => {
        const orderId: string = getValue<string>();
        return (
          <span title={orderId}>
            {orderId.length > 10 ? orderId.slice(0, 10) + "..." : orderId}
          </span>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "userId",
      header: "Customer",
      cell: ({ row }) => {
        const user = row.original.userId;
        console.log(row.original);
        if (!user) return "Unknown User";
        return typeof user === "string" ? "Unknown" : user.name;
      },
      enableSorting: true,
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
      enableSorting: true,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <button
          className="text-orange-500 hover:underline"
          onClick={() => openModal(row.original)}
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
      <TitleComponent text={"Order History"} />
      <div className="p-4 sm:p-6 bg-white rounded-xl min-h-screen">
        <OrderFilters
          globalFilter={globalFilter}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setGlobalFilter={setGlobalFilter}
          table={table}
        />
        <DataTable table={table} isLoading={isLoading} style="!p-0" />
      </div>
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        order={selectedOrder}
      />
    </div>
  );
};

export default AdminOrderHistory;
