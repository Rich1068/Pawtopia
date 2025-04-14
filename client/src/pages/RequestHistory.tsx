import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

import type { IAdoptRequest } from "../types/Types";
import PageHeader from "../components/PageHeader";
import { Eye } from "lucide-react";
import AdoptRequestModal from "../components/AdoptRequest/AdoptRequestModal";
import DataTable from "../components/HistoryTable/DataTable";
import TableFilters from "../components/HistoryTable/TableFilters";
import { useAdoptRequestHistory } from "../hooks/useAdoptRequests";

const RequestHistory = () => {
  const { data: requests = [], isLoading } = useAdoptRequestHistory();
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<IAdoptRequest | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (request: IAdoptRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setIsModalOpen(false);
  };

  const filteredRequests = useMemo(() => {
    if (!selectedDate) return requests;

    return requests.filter((request) => {
      const localDate = new Date(
        request.createdAt as string
      ).toLocaleDateString("en-CA"); // "YYYY-MM-DD"
      return localDate === selectedDate;
    });
  }, [requests, selectedDate]);

  const columns: ColumnDef<IAdoptRequest>[] = [
    {
      accessorKey: "petName",
      header: "Pet Name",
      enableSorting: true,
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
      enableSorting: true,
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ getValue }) => new Date(getValue<Date>()).toLocaleDateString(),
      enableSorting: true,
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
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredRequests,
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
      <PageHeader text="Request History" />
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
        <DataTable isLoading={isLoading} table={table} />
      </div>
      <AdoptRequestModal
        isOpen={isModalOpen}
        onClose={closeModal}
        request={selectedRequest}
      />
    </div>
  );
};

export default RequestHistory;
