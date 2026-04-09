const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  mockPayment,
  createOrder,
  verifyRazorpayPayment,
  getUserPayments,
} = require("../controllers/paymentController");

/**
 * =========================================
 * 💳 SUBSCRIPTION (MOCK)
 * =========================================
 */
router.post("/mock", auth, mockPayment);

/**
 * =========================================
 * 💰 RAZORPAY PAYMENT FLOW
 * =========================================
 */

// 🧾 Create Razorpay Order
router.post("/create-order", auth, createOrder);

// ✅ Verify Razorpay Payment
router.post("/verify-razorpay", auth, verifyRazorpayPayment);

/**
 * =========================================
 * 📊 USER PAYMENTS
 * =========================================
 */

// User → see their payments
router.get("/user", auth, getUserPayments);

module.exports = router;