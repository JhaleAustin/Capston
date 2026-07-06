import API from "./axiosConfig";

export const getUsers = async () => {
  const response = await API.get("/users/");
  return response.data;
};

export const updateUser = async (uid, data) => {
  const response = await API.put(`/users/${uid}`, data);
  return response.data;
};

export const deleteUser = async (uid) => {
  const response = await API.delete(`/users/${uid}`);
  return response.data;
};