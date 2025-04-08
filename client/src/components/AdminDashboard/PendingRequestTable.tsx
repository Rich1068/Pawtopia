import { useState } from "react";
import { ColumnDef, getCoreRowModel } from "@tanstack/react-table";
import { useReactTable } from "@tanstack/react-table";
import { IAdoptRequest } from "../../types/Types";
import AdoptRequestModal from "../AdoptRequest/AdoptRequestModal";
import { Eye } from "lucide-react";
import { Link } from "react-router";
import TableSection from "./TableSection";
import { usePendingRequests } from "../../hooks/useDashboardStats";

const PendingRequestsTable = () => {
  const [selectedRequest, setSelectedRequest] = useState<IAdoptRequest | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading, isError } = usePendingRequests();

  const openModal = (request: IAdoptRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setIsModalOpen(false);
  };

  const columns: ColumnDef<IAdoptRequest>[] = [
    {
      accessorKey: "name",
      header: "Adopter Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "petName",
      header: "Pet Name",
      cell: (info) => info.getValue() || "N/A",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => (
        <span
          className={`px-2 py-1 rounded-md text-white ${
            info.getValue() === "Pending" ? "bg-yellow-500" : "bg-gray-500"
          }`}
        >
          {info.getValue<string>()}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Requested On",
      cell: (info) => new Date(info.getValue<string>()).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const request = row.original;

        return (
          <div className="flex gap-3 sm:gap-2 justify-center">
            <button
              className="text-orange-500 hover:underline flex items-center"
              onClick={() => openModal(request)}
            >
              <Eye
                size={26}
                className="sm:hidden p-1 rounded-full text-white bg-orange-500 "
              />{" "}
              <span className="hidden sm:inline">View Details</span>{" "}
            </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <p>Loading pending requests...</p>;
  if (isError) return <p>Error fetching pending requests.</p>;
  return (
    <div className="bg-white shadow-md rounded-lg p-4 font-secondary">
      <div className="flex justify-between px-1">
        <h2 className="text-lg font-semibold text-gray-700">
          Latest Pending Adoption Requests
        </h2>
        <Link to="/admin/adopt/requests">
          <button className="px-4 py-2 text-sm font-medium text-orange-600 border border-orange-600 rounded-md hover:bg-orange-50 transition">
            View All Requests
          </button>
        </Link>
      </div>
      <TableSection
        table={table}
        emptyMessage="No pending adoption requests at the moment."
        style="!p-0"
      />
      <AdoptRequestModal
        isOpen={isModalOpen}
        onClose={closeModal}
        request={selectedRequest}
      />
    </div>
  );
};

export default PendingRequestsTable;
