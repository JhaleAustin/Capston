import API from "./axiosConfig";

export const getActivityLogs = async () => {
  const response = await API.get("/activity-logs/");
  return response.data;
};