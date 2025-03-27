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

const AdoptionChart = () => {
  const [chartData, setChartData] = useState<ChartData<"bar">>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await serverAPI.get("/admin/adoptions-per-month", {
          withCredentials: true,
        });

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

        data.forEach((item: { _id: number; total: number }) => {
          if (item._id >= 1 && item._id <= 12) {
            adoptionCounts[item._id - 1] = item.total;
          }
        });

        setChartData({
          labels: months,
          datasets: [
            {
              label: "Adoptions",
              data: adoptionCounts,
              backgroundColor: "oklch(0.705 0.213 47.604)",
              borderColor: "oklch(0.705 0.213 47.604)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching adoption data:", error);
      }
    };

    fetchData();
  }, []);
  const options = {
    maintainAspectRatio: false, // Allows manual height control
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        ticks: {
          stepSize: 1, // Ensures integer steps
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <h2 className="text-lg font-semibold mb-3 text-gray-700">
        Total Adoptions Per Month
      </h2>
      <div className="">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default AdoptionChart;
