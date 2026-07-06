import API from "./axiosConfig";

export const getFeedback = async () => {
  const response = await API.get("/feedback/");
  return response.data;
};

export const createFeedback = async (data) => {
  const response = await API.post("/feedback/", data);
  return response.data;
};

export const updateFeedback = async (feedbackId, data) => {
  const response = await API.put(`/feedback/${feedbackId}`, data);
  return response.data;
};

export const deleteFeedback = async (feedbackId) => {
  const response = await API.delete(`/feedback/${feedbackId}`);
  return response.data;
};