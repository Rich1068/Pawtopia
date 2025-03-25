import { Table } from "@tanstack/react-table";
import { IAdoptRequest } from "../../types/Types";

interface IAdoptRequestFilters {
  globalFilter: string;
  statusFilter: "pending" | "approved" | "rejected";
  setStatusFilter: (status: "pending" | "approved" | "rejected") => void;
  setGlobalFilter: (filter: string) => void;
  table: Table<IAdoptRequest>;
}

const AdoptRequestFilters: React.FC<IAdoptRequestFilters> = ({
  globalFilter,
  statusFilter,
  setStatusFilter,
  setGlobalFilter,
}) => {
  return (
    <div className="flex justify-between mb-4">
      <input
        type="text"
        placeholder="Search by pet or adopter name..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="border px-3 py-1 rounded-md"
      />
      <select
        value={statusFilter}
        onChange={(e) =>
          setStatusFilter(e.target.value as "pending" | "approved" | "rejected")
        }
        className="border px-3 py-1 rounded-md"
      >
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>
  );
};

export default AdoptRequestFilters;
