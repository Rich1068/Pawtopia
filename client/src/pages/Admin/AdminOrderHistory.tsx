import { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import serverAPI from "../../helper/axios";
import OrderTable from "../../components/OrderHistory/OrderTable";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import OrderDetailsModal from "../../components/OrderHistory/OrderDetailModal";
import type { IOrder } from "../../types/Types";
import TitleComponent from "../../components/shop/Admin/TitleComponent";
import OrderFilters from "../../components/OrderHistory/Admin/OrderFilters";

const AdminOrderHistory = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  console.log(selectedDate);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await serverAPI.get("/order/all", {
          withCredentials: true,
        });
        console.log("Fetched Orders:", response.data);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [selectedDate]);

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
    },
    {
      accessorKey: "userId",
      header: "Customer",
      cell: ({ row }) => {
        const user = row.original.userId;
        return typeof user === "string" ? "Unknown" : user.name;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
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
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  if (loading) return <LoadingPage fadeOut={false} />;

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
        <OrderTable table={table} style="!p-0" />
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
