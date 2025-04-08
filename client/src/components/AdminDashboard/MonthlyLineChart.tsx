import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface IMonthlyLineChart {
  title: string;
  data: { _id: number; total: number }[] | undefined;
  isLoading: boolean;
  isError: boolean;
  datasetLabel: string;
  stepSizeY?: number;
}

const MonthlyLineChart = ({
  title,
  data,
  isLoading,
  isError,
  datasetLabel,
  stepSizeY = 1,
}: IMonthlyLineChart) => {
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

  const monthlyData = new Array(12).fill(0);

  if (data) {
    data.forEach(({ _id, total }) => {
      if (_id >= 1 && _id <= 12) {
        monthlyData[_id - 1] = total;
      }
    });
  }

  const chartData: ChartData<"line"> = {
    labels: months,
    datasets: [
      {
        label: datasetLabel,
        data: monthlyData,
        borderColor: "oklch(0.705 0.213 47.604)",
        backgroundColor: "oklch(0.705 0.213 47.604)",
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      y: {
        ticks: {
          autoSkip: true,
          stepSize: stepSizeY,
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
      <h2 className="text-lg font-semibold mb-3 text-gray-700">{title}</h2>

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

export default MonthlyLineChart;
