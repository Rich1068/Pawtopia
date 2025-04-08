import { useAdoptionStats } from "../../hooks/useDashboardStats";
import MonthlyLineChart from "./MonthlyLineChart";

const AdoptionChart = () => {
  const { data, isLoading, isError } = useAdoptionStats();

  return (
    <MonthlyLineChart
      title="Total Adoptions Per Month"
      data={data}
      isLoading={isLoading}
      isError={isError}
      datasetLabel="Adoptions"
      stepSizeY={1}
    />
  );
};

export default AdoptionChart;
