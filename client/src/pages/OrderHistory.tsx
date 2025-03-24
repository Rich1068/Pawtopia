import { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  getPaginationRowModel,
} from "@tanstack/react-table";
import serverAPI from "../helper/axios";
import OrderTable from "../components/OrderHistory/OrderTable";
import LoadingPage from "../components/LoadingPage/LoadingPage";
import type { IOrder } from "../types/Types";
import PageHeader from "../components/PageHeader";
import OrderDetailsModal from "../components/OrderHistory/OrderDetailModal";

const OrderHistory = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

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
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) return <LoadingPage fadeOut={false} />;

  return (
    <div className="relative font-primary text-amber-950">
      <PageHeader text="Order History" />
      <div className="p-4 sm:p-6 rounded-xl min-h-screen">
        <OrderTable table={table} />
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
