import { useAdminStats } from "../../hooks/useAdminStats";
import DashboardCards from "../../components/AdminDashboard/DashboardCards";
import AdoptionChart from "../../components/AdminDashboard/AdoptionChart";
import PendingRequestsTable from "../../components/AdminDashboard/PendingRequestTable";

const AdminDashboard = () => {
  const { data, isLoading, error } = useAdminStats();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-40">
        <p className="animate-spin rounded-full h-8 w-8 border-t-4 border-orange-500"></p>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 font-semibold">
        Error fetching stats. Please try again.
      </div>
    );

  return (
    <div className="flex flex-col">
      {/* Dashboard Cards */}
      <div className="flex-1 w-full">
        <DashboardCards
          stats={{
            totalProducts: data.totalProducts,
            totalRevenue: data.totalRevenue,
            totalAdoptions: data.totalAdoptions,
            totalPendingAdoptions: data.totalPendingAdoptions,
          }}
        />
      </div>
      {/* Placeholder for Graphs and Tables */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Charts & Reports</h2>
        <div className="flex flex-col lg:flex-row w-full px-4 gap-6">
          {/* Chart Container */}
          <div className="flex-1 w-full min-w-[300px]">
            <AdoptionChart />
          </div>

          {/* Table Container */}
          <div className="flex-1 w-full min-w-[300px]">
            <PendingRequestsTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
