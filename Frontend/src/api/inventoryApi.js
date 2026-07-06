import API from "./axiosConfig";

export const getInventory = async () => {
  const response = await API.get("/inventory/");
  return response.data;
};

export const createInventory = async (data) => {
  const response = await API.post("/inventory/", data);
  return response.data;
};

export const updateInventory = async (itemId, data) => {
  const response = await API.put(`/inventory/${itemId}`, data);
  return response.data;
};

export const deleteInventory = async (itemId) => {
  const response = await API.delete(`/inventory/${itemId}`);
  return response.data;
};