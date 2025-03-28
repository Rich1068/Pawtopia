import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import serverAPI from "../../helper/axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const EarningsChart = () => {
  const [chartData, setChartData] = useState<ChartData<"line">>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await serverAPI.get("/admin/earnings-per-month", {
          withCredentials: true,
        });
        console.log(data);
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
        const earningsData = new Array(12).fill(0);

        data.forEach((item: { _id: number; total: number }) => {
          if (item._id >= 1 && item._id <= 12) {
            earningsData[item._id - 1] = item.total;
          }
        });

        setChartData({
          labels: months,
          datasets: [
            {
              label: "Earnings ($)",
              data: earningsData,
              borderColor: "oklch(0.705 0.213 47.604)",
              backgroundColor: "oklch(0.705 0.213 47.604)",
              borderWidth: 2,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching earnings data:", error);
      }
    };

    fetchData();
  }, []);

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
          stepSize: 1000,
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
        Earnings Per Month
      </h2>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[300px]">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default EarningsChart;
