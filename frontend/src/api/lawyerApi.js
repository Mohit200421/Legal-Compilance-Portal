import API from "./axios";

export const getLawyerProfile = (lawyerId) => {
  return API.get(`/lawyers/${lawyerId}`);
};

export const updateLawyerProfile = (data) => {
  return API.put("/lawyer/profile", data);
};