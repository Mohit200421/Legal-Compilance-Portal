const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/multer"); // 👈 required for file upload

const {
  mockPayment,
  submitPayment,
  verifyPaymentByLawyer,
  getLawyerPayments,
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
 * 📤 USER SUBMITS PAYMENT
 * =========================================
 */
router.post(
  "/submit",
  auth,
  upload.single("screenshot"), // 👈 field name must match frontend
  submitPayment
);

/**
 * =========================================
 * ⚖️ LAWYER VERIFIES PAYMENT
 * =========================================
 */
router.post("/verify", auth, verifyPaymentByLawyer);

/**
 * =========================================
 * 📊 DASHBOARD ROUTES
 * =========================================
 */

// Lawyer → see submitted payments
router.get("/lawyer", auth, getLawyerPayments);

// User → see their payments
router.get("/user", auth, getUserPayments);

module.exports = router;