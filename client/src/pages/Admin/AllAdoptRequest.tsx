import { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Eye, Check, X } from "lucide-react";
import serverAPI from "../../helper/axios";
import AdoptRequestModal from "../../components/AdoptRequest/AdoptRequestModal";
import AdoptRequestFilters from "../../components/AdoptRequest/AdoptRequestFilters";
import TitleComponent from "../../components/shop/Admin/TitleComponent";
import { IAdoptRequest } from "../../types/Types";
import WarningModal from "../../components/WarningModal";
import toast from "react-hot-toast";
import DataTable from "../../components/HistoryTable/DataTable";
import { LoaderCircle } from "lucide-react";

const AllAdoptRequests = () => {
  const [requests, setRequests] = useState<IAdoptRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<IAdoptRequest | null>(
    null
  );
  const [warningAction, setWarningAction] = useState<
    "approve" | "reject" | null
  >(null);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
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
      setLoading(true);
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

  const confirmAction = async () => {
    if (!selectedRequest || !warningAction) return;

    try {
      if (warningAction === "approve") {
        await serverAPI.put(
          `/adopt/${selectedRequest._id}/approve`,
          {},
          { withCredentials: true }
        );
        toast.success("Adopt Request Approved");
      } else if (warningAction === "reject") {
        await serverAPI.put(
          `/adopt/${selectedRequest._id}/reject`,
          {},
          { withCredentials: true }
        );
        toast.success("Adopt Request Rejected");
      }
      fetchAdoptRequests();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(`Failed to ${warningAction} request`);
      toast.error(error.response.data.error);
    } finally {
      setIsWarningModalOpen(false);
    }
  };

  const columns: ColumnDef<IAdoptRequest>[] = [
    {
      accessorKey: "petName",
      header: "Pet Name",
    },
    {
      accessorKey: "name",
      header: "Adopter",
      cell: ({ row }) => {
        return <span>{row.original.name}</span>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
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
          <div className="flex gap-3 sm:gap-2 justify-center">
            <button
              className="text-blue-500 hover:text-blue-700 flex items-center"
              onClick={() => openModal(request)}
            >
              <Eye
                size={26}
                className="sm:hidden p-1 rounded-full text-white bg-blue-500 "
              />{" "}
              <span className="hidden sm:inline">View Details</span>{" "}
            </button>

            <button
              className="text-green-500 hover:text-green-700 flex items-center"
              onClick={() => {
                setSelectedRequest(request);
                setWarningAction("approve");
                setIsWarningModalOpen(true);
              }}
            >
              <Check
                size={26}
                className="p-1 rounded-full text-white bg-green-500 sm:hidden"
              />
              <span className="hidden sm:inline">Approve</span>
            </button>

            {/* Reject Request */}
            <button
              className="text-red-500 hover:text-red-700 flex items-center"
              onClick={() => {
                setSelectedRequest(request);
                setWarningAction("reject");
                setIsWarningModalOpen(true);
              }}
            >
              <X
                size={26}
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
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <LoaderCircle className="animate-spin text-orange-500" size={40} />
          </div>
        ) : (
          <DataTable table={table} style="!p-0" />
        )}
      </div>
      <AdoptRequestModal
        isOpen={isModalOpen}
        onClose={closeModal}
        request={selectedRequest}
      />
      <WarningModal
        header={
          warningAction === "approve"
            ? "Approve Adoption Request"
            : "Reject Adoption Request"
        }
        text={`Are you sure you want to ${warningAction} this adoption request?`}
        isModalOpen={isWarningModalOpen}
        setIsModalOpen={setIsWarningModalOpen}
        confirmText={warningAction === "approve" ? "Approve" : "Reject"}
        onConfirm={confirmAction}
      />
    </div>
  );
};

export default AllAdoptRequests;
