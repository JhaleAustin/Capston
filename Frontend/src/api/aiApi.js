import API from "./axiosConfig";

export const getBusinessSummary = async () => {
  const response = await API.get("/ai/business-summary");
  return response.data;
};

export const getSalesInsights = async () => {
  const response = await API.get("/ai/sales-insights");
  return response.data;
};

export const getInventoryRecommendation = async () => {
  const response = await API.get("/ai/inventory-recommendation");
  return response.data;
};

export const getFeedbackAnalysis = async () => {
  const response = await API.get("/ai/feedback-analysis");
  return response.data;
};

export const getSalesForecast = async () => {
  const response = await API.get("/ai/sales-forecast");
  return response.data;
};

export const getAIDashboard = async () => {
  const response = await API.get("/ai/dashboard");
  return response.data;
};

export const askAI = async (data) => {
  const response = await API.post("/ai/chat", data);
  return response.data;
};

 