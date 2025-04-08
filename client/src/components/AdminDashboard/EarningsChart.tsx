import { useEarningsStats } from "../../hooks/useDashboardStats";
import MonthlyLineChart from "./MonthlyLineChart";

const EarningsChart = () => {
  const { data, isLoading, isError } = useEarningsStats();

  return (
    <MonthlyLineChart
      title="Earnings Per Month"
      data={data}
      isLoading={isLoading}
      isError={isError}
      datasetLabel="Earnings ($)"
      stepSizeY={1000}
    />
  );
};

export default EarningsChart;
