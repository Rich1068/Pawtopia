import { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Eye, MessageSquare, Check, X } from "lucide-react";
import serverAPI from "../../helper/axios";
import AdoptRequestModal from "../../components/AdoptRequest/AdoptRequestModal";
import AdoptRequestFilters from "../../components/AdoptRequest/AdoptRequestFilters";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import TitleComponent from "../../components/shop/Admin/TitleComponent";
import { IAdoptRequest } from "../../types/Types";
import AdoptRequestTable from "../../components/AdoptRequest/AdoptRequestTable";

const AdminAllAdoptRequests = () => {
  const [requests, setRequests] = useState<IAdoptRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<IAdoptRequest | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "pending" | "approved" | "rejected"
  >("pending");

  useEffect(() => {
    fetchAdoptRequests();
  }, [statusFilter]);

  const fetchAdoptRequests = async () => {
    try {
      const { data } = await serverAPI.get("/adopt/requests", {
        params: { status: statusFilter },
        withCredentials: true,
      });
      console.log("Fetched Adoption Requests:", data);
      setRequests(data);
    } catch (error) {
      console.error("Error fetching adoption requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (request: IAdoptRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setIsModalOpen(false);
  };

  const approveRequest = async (id: string) => {
    try {
      await serverAPI.put(`/adoptions/${id}/approve`);
      fetchAdoptRequests();
    } catch (error) {
      console.error("Failed to approve request", error);
    }
  };

  const rejectRequest = async (id: string) => {
    try {
      await serverAPI.put(`/adoptions/${id}/reject`);
      fetchAdoptRequests();
    } catch (error) {
      console.error("Failed to reject request", error);
    }
  };

  const startChat = async (adoptionId: string) => {
    try {
      const { data } = await serverAPI.post(`/chat/start`, { adoptionId });
      window.location.href = `/chat/${data.chatId}`;
    } catch (error) {
      console.error("Failed to start chat", error);
    }
  };

  const columns: ColumnDef<IAdoptRequest>[] = [
    {
      accessorKey: "petName",
      header: "Pet Name",
    },
    {
      accessorKey: "adopterName",
      header: "Adopter",
      cell: ({ row }) => {
        return <span>{row.original.name}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span
            className={`px-2 py-1 rounded-md text-white ${
              status === "pending"
                ? "bg-yellow-400"
                : status === "approved"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const request = row.original;

        return (
          <div className="flex gap-1 sm:gap-2 justify-center">
            {/* View Details */}
            <button
              className="text-blue-500 hover:text-blue-700 flex items-center"
              onClick={() => openModal(request)}
            >
              <Eye
                size={24}
                className="sm:hidden p-1 rounded-full text-white bg-blue-500 "
              />{" "}
              {/* Icon for mobile */}
              <span className="hidden sm:inline">View Details</span>{" "}
              {/* Text for large screens */}
            </button>

            {/* Start Chat */}
            <button
              className="text-purple-500 hover:text-purple-700 flex items-center"
              onClick={() => startChat(request._id)}
            >
              <MessageSquare
                size={24}
                className="p-1 rounded-full text-white bg-purple-500 sm:hidden"
              />
              <span className="hidden sm:inline">Start Chat</span>
            </button>

            {/* Approve Request */}
            <button
              className="text-green-500 hover:text-green-700 flex items-center"
              onClick={() => approveRequest(request._id)}
            >
              <Check
                size={24}
                className="p-1 rounded-full text-white bg-green-500 sm:hidden"
              />
              <span className="hidden sm:inline">Approve</span>
            </button>

            {/* Reject Request */}
            <button
              className="text-red-500 hover:text-red-700 flex items-center"
              onClick={() => rejectRequest(request._id)}
            >
              <X
                size={24}
                className="p-1 rounded-full text-white bg-red-500 sm:hidden"
              />
              <span className="hidden sm:inline">Reject</span>
            </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: requests,
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
      <TitleComponent text={"Adoption Requests"} />
      <div className="p-4 sm:p-6 bg-white rounded-xl min-h-screen">
        <AdoptRequestFilters
          globalFilter={globalFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          setGlobalFilter={setGlobalFilter}
          table={table}
        />
        <AdoptRequestTable table={table} style="!p-0" />
      </div>
      <AdoptRequestModal
        isOpen={isModalOpen}
        onClose={closeModal}
        request={selectedRequest}
      />
    </div>
  );
};

export default AdminAllAdoptRequests;
