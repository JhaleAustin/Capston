import API from "./axiosConfig";

export const getCategories = async () => {
  const response = await API.get("/categories/");
  return response.data;
};

export const createCategory = async (data) => {
  const response = await API.post("/categories/", data);
  return response.data;
};

export const updateCategory = async (categoryId, data) => {
  const response = await API.put(`/categories/${categoryId}`, data);
  return response.data;
};

export const deleteCategory = async (categoryId) => {
  const response = await API.delete(`/categories/${categoryId}`);
  return response.data;
};