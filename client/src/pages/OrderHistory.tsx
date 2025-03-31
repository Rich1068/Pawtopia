import { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import serverAPI from "../helper/axios";
import LoadingPage from "../components/LoadingPage/LoadingPage";
import type { IOrder } from "../types/Types";
import PageHeader from "../components/PageHeader";
import OrderDetailsModal from "../components/OrderHistory/OrderDetailModal";
import TableFilters from "../components/HistoryTable/TableFilters";
import DataTable from "../components/HistoryTable/DataTable";

const OrderHistory = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await serverAPI.get("/order/history", {
          withCredentials: true,
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ getValue }) => new Date(getValue<Date>()).toLocaleDateString(),
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: ({ getValue }) => `$${getValue<number>().toFixed(2)}`,
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
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  if (loading) return <LoadingPage fadeOut={false} />;

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
        <DataTable table={table} />
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
