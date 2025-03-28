import DashboardCards from "../../components/AdminDashboard/DashboardCards";
import AdoptionChart from "../../components/AdminDashboard/AdoptionChart";
import PendingRequestsTable from "../../components/AdminDashboard/PendingRequestTable";
import EarningsChart from "../../components/AdminDashboard/EarningsChart";
import MostSoldChart from "../../components/AdminDashboard/MostSoldChart";
import RecentOrdersTable from "../../components/AdminDashboard/RecentOrdersTable";

const AdminDashboard = () => {
  return (
    <div className="flex flex-col">
      {/* Dashboard Cards */}
      <div className="flex-1 w-full">
        <DashboardCards />
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold font-secondary sm:px-4 mb-4">
          Charts & Reports
        </h2>

        <div className="flex flex-wrap xl:flex-nowrap sm:px-4 gap-6">
          {/* Left Side - Charts (Takes More Space) */}
          <div className="flex-1 flex flex-col gap-6 min-w-[300px] sm:min-w-[400px]">
            <AdoptionChart />
            <EarningsChart />
            <MostSoldChart />
          </div>

          {/* Right Side - Tables (Takes Less Space) */}
          <div className="flex-1 flex flex-col gap-6 min-w-[300px] sm:min-w-[400px]">
            <PendingRequestsTable />
            <RecentOrdersTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
