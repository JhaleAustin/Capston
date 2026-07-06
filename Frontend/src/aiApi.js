import API from "./axiosConfig";

export const askAI = async (data) => {
  const response = await API.post("/ai/chat", data);
  return response.data;
};