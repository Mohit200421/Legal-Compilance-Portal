import API from "./axios";

// ===================== CREATE NEW TICKET =====================
export const createTicket = async (data) => {
  const response = await API.post("/support", data);
  return response.data;
};

// ===================== GET MY TICKETS =====================
export const getMyTickets = async (filters = {}) => {
  const response = await API.get("/support", { params: filters });
  return response.data;
};

// ===================== GET SINGLE TICKET =====================
export const getSingleTicket = async (ticketId) => {
  const response = await API.get(`/support/${ticketId}`);
  return response.data;
};

// ===================== SEND MESSAGE =====================
export const sendMessage = async (ticketId, text) => {
  const response = await API.post(`/support/${ticketId}/message`, { text });
  return response.data;
};

// ===================== ADMIN: GET ALL TICKETS =====================
export const getAllTickets = async (filters = {}) => {
  const response = await API.get("/support/admin/all", { params: filters });
  return response.data;
};

// ===================== ADMIN: UPDATE TICKET STATUS =====================
export const updateTicketStatus = async (ticketId, data) => {
  const response = await API.patch(`/support/${ticketId}/status`, data);
  return response.data;
};

// ===================== ADMIN: GET TICKET STATS =====================
export const getTicketStats = async () => {
  const response = await API.get("/support/admin/stats");
  return response.data;
};
