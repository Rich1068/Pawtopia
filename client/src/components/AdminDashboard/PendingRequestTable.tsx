import { useEffect, useState } from "react";
import { ColumnDef, getCoreRowModel } from "@tanstack/react-table";
import { useReactTable } from "@tanstack/react-table";
import AdoptRequestTable from "../AdoptRequest/AdoptRequestTable";
import { IAdoptRequest } from "../../types/Types";
import serverAPI from "../../helper/axios";

const PendingRequestsTable = () => {
  const [data, setData] = useState<IAdoptRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await serverAPI.get("/admin/pending-requests", {
          withCredentials: true,
        });
        setData(data);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

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
      header: "Actions",
      cell: (info) => (
        <button
          className="text-blue-600 hover:underline"
          onClick={() => console.log("View details of", info.row.original._id)}
        >
          View Details
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) return <p>Loading pending requests...</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-3">
        Latest Pending Adoption Requests
      </h2>
      <AdoptRequestTable table={table} style="!p-0" />
    </div>
  );
};

export default PendingRequestsTable;
