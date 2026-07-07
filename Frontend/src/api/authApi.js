import API from "./axiosConfig";
 
export const login = async (data) => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const getProfile = async () => {
  const response = await API.get("/auth/me");
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await API.put("/auth/me", data);
  return response.data;
};

export const register = async (form) => {
  const response = await API.post("/auth/register", form);
  return response.data;
};