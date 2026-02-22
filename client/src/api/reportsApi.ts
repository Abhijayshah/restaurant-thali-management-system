import axiosClient from "./axiosClient";

interface SummaryReportResponse {
  monthlyCustomersTotal: number;
  dailyCustomersTotal: number;
  grandTotal: number;
}

export const fetchSummaryReport = async (month?: string) => {
  const params = month ? { month } : undefined;
  const response = await axiosClient.get<SummaryReportResponse>(
    "/reports/summary",
    { params }
  );
  return response.data;
};

