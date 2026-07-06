import API from "./axiosConfig";

export const getSalesReport = async () => {
  const response = await API.get("/reports/sales");
  return response.data;
};