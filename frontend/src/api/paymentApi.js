import API from "./axios";

/**
 * MOCK subscription payment (NO Razorpay)
 * Used only for college / demo project
 */
export const mockPayment = (planId) => {
  return API.post("/payment/mock", { planId });
};
