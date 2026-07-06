import API from "./axiosConfig";

export const getSales = async () => {
  const response = await API.get("/sales/");
  return response.data;
};

export const createSale = async (data) => {
  const response = await API.post("/sales/", data);
  return response.data;
};

export const getSale = async (saleId) => {
  const response = await API.get(`/sales/${saleId}`);
  return response.data;
};

export const deleteSale = async (saleId) => {
  const response = await API.delete(`/sales/${saleId}`);
  return response.data;
};

export const getDailySales = async () => {
  const response = await API.get("/sales/daily/report");
  return response.data;
};

export const getMonthlySales = async () => {
  const response = await API.get("/sales/monthly/report");
  return response.data;
};

export const getBestSelling = async () => {
  const response = await API.get("/sales/best-selling");
  return response.data;
};