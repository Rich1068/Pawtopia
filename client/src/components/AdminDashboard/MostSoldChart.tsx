import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { useMostSoldProducts } from "../../hooks/useDashboardStats";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MostSoldChart = () => {
  const { data, isLoading, isError } = useMostSoldProducts();

  interface MostSoldProduct {
    name: string;
    totalSold: number;
  }

  const chartData: ChartData<"bar", number[], string> = {
    labels:
      (data as MostSoldProduct[] | undefined)?.map((item) => item.name) ?? [],
    datasets: [
      {
        label: "Units Sold",
        data:
          (data as MostSoldProduct[] | undefined)?.map(
            (item) => item.totalSold
          ) ?? [],
        backgroundColor: "oklch(0.705 0.213 47.604)",
        borderColor: "oklch(0.705 0.213 47.604)",
        borderWidth: 1,
      },
    ],
  };
  const options: ChartOptions<"bar"> = {
    maintainAspectRatio: false,
    responsive: true,
    indexAxis: "y",
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-lg w-full font-secondary">
      <h2 className="text-lg font-semibold mb-3 text-gray-700">
        Most Sold Products
      </h2>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error fetching data</p>}

      <div className="h-auto">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default MostSoldChart;
