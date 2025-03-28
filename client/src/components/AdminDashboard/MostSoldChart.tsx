import { useEffect, useState } from "react";
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
import serverAPI from "../../helper/axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MostSoldChart = () => {
  const [chartData, setChartData] = useState<
    ChartData<"bar", number[], string>
  >({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await serverAPI.get("/admin/most-sold-products", {
          withCredentials: true,
        });

        const productNames = data.map((item: { name: string }) => item.name);
        const totalSales = data.map(
          (item: { totalSold: number }) => item.totalSold
        );

        setChartData({
          labels: productNames,
          datasets: [
            {
              label: "Units Sold",
              data: totalSales,
              backgroundColor: "oklch(0.705 0.213 47.604)",
              borderColor: "oklch(0.705 0.213 47.604)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching most sold products:", error);
      }
    };

    fetchData();
  }, []);
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
      <div className="h-auto">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default MostSoldChart;
