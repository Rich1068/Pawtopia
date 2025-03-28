import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { useQuery } from "@tanstack/react-query";
import serverAPI from "../../helper/axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Fetch function for adoptions per month
const fetchAdoptionStats = async () => {
  const { data } = await serverAPI.get("/admin/adoptions-per-month", {
    withCredentials: true,
  });
  return data;
};

// Custom hook for fetching adoption stats
export const useAdoptionStats = () => {
  return useQuery({
    queryKey: ["adoptionStats"],
    queryFn: fetchAdoptionStats,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnMount: true, // Refetch on mount
  });
};

const AdoptionChart = () => {
  const { data, isLoading, isError } = useAdoptionStats();

  // Format data for Chart.js
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const adoptionCounts = new Array(12).fill(0);

  if (data) {
    data.forEach((item: { _id: number; total: number }) => {
      if (item._id >= 1 && item._id <= 12) {
        adoptionCounts[item._id - 1] = item.total;
      }
    });
  }

  const chartData: ChartData<"line"> = {
    labels: months,
    datasets: [
      {
        label: "Adoptions",
        data: adoptionCounts,
        backgroundColor: "oklch(0.705 0.213 47.604)",
        borderColor: "oklch(0.705 0.213 47.604)",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        ticks: {
          autoSkip: true,
          stepSize: 1,
        },
      },
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 30,
          minRotation: 0,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-lg w-full font-secondary">
      <h2 className="text-lg font-semibold mb-3 text-gray-700">
        Total Adoptions Per Month
      </h2>

      {/* Loading & Error States */}
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error fetching data</p>}

      <div className="w-full overflow-x-auto">
        <div className="min-w-[300px]">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default AdoptionChart;
