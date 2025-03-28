import { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  getPaginationRowModel,
} from "@tanstack/react-table";
import serverAPI from "../../helper/axios";
import OrderDetailsModal from "../../components/OrderHistory/OrderDetailModal";
import type { IOrder } from "../../types/Types";
import TableSection from "./TableSection";
import { Link } from "react-router";

const RecentOrdersTable = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await serverAPI.get("/admin/recent-orders", {
          withCredentials: true,
        });
        setOrders(data);
      } catch (error) {
        console.error("Error fetching recent orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
      accessorKey: "userId",
      header: "Customer",
      cell: ({ row }) => {
        const user = row.original.userId;
        return typeof user === "string" ? "Unknown" : user?.name;
      },
    },
    {
      accessorKey: "totalPrice",
      header: "Total Price",
      cell: ({ row }) => {
        const price = row.original.totalAmount;
        return price ? `$${price.toFixed(2)}` : "$0.00";
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => {
        const date = row.original.createdAt;
        return date ? new Date(date).toLocaleDateString() : "N/A";
      },
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
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-white p-4 shadow-md rounded-lg w-full font-secondary">
      <div className="flex justify-between px-1">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">
          Recent Orders
        </h2>
        <Link to="/admin/orders/all">
          <button className="px-4 py-2 text-sm font-medium text-orange-600 border border-orange-600 rounded-md hover:bg-orange-50 transition">
            View All Orders
          </button>
        </Link>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-4">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <TableSection table={table} style="!p-0" />
      )}

      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        order={selectedOrder}
      />
    </div>
  );
};

export default RecentOrdersTable;
