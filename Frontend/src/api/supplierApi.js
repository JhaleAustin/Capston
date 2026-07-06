import API from "./axiosConfig";

export const getSuppliers = async () => {
  const response = await API.get("/suppliers/");
  return response.data;
};

export const createSupplier = async (data) => {
  const response = await API.post("/suppliers/", data);
  return response.data;
};

export const updateSupplier = async (supplierId, data) => {
  const response = await API.put(`/suppliers/${supplierId}`, data);
  return response.data;
};

export const deleteSupplier = async (supplierId) => {
  const response = await API.delete(`/suppliers/${supplierId}`);
  return response.data;
};