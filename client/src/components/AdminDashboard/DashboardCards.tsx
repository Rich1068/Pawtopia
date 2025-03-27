import { FC, JSX } from "react";
import { ShoppingCart, PawPrint, Clock, DollarSign } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: JSX.Element;
  borderColor: string;
}

const DashboardCard: FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  borderColor,
}) => {
  return (
    <div
      className={`flex items-center p-4 shadow-md rounded-lg border-l-4 ${borderColor} bg-white`}
    >
      <div className="p-3 bg-gray-100/60 rounded-full">{icon}</div>
      <div className="ml-4">
        <p className="text-gray-600 text-sm font-medium font-primary">
          {title}
        </p>
        <p className="text-xl font-semibold text-gray-900 font-secondary">
          {value}
        </p>
      </div>
    </div>
  );
};

interface DashboardCardsProps {
  stats: {
    totalProducts: number;
    totalRevenue: number;
    totalAdoptions: number;
    totalPendingAdoptions: number;
  };
}

const DashboardCards: FC<DashboardCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      <DashboardCard
        title="Total Products"
        value={stats.totalProducts}
        icon={<ShoppingCart className="w-6 h-6 text-orange-500" />}
        borderColor="border-orange-500"
      />
      <DashboardCard
        title="Total Revenue"
        value={`$${stats.totalRevenue}`}
        icon={<DollarSign className="w-6 h-6 text-yellow-500" />}
        borderColor="border-yellow-500"
      />
      <DashboardCard
        title="Pets Adopted"
        value={stats.totalAdoptions}
        icon={<PawPrint className="w-6 h-6 text-green-500" />}
        borderColor="border-green-500"
      />
      <DashboardCard
        title="Pending Adoptions"
        value={stats.totalPendingAdoptions}
        icon={<Clock className="w-6 h-6 text-red-500" />}
        borderColor="border-red-500"
      />
    </div>
  );
};

export default DashboardCards;
