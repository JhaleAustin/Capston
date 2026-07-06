import API from "./axiosConfig";

export const getDashboardAnalytics = async () => {
  const response = await API.get("/analytics/dashboard");
  return response.data;
};