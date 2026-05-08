const express = require("express");
const router = express.Router();

const {
  register,
  login,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  applyLawyer,
  logout,
} = require("../controllers/authController");

const auth = require("../middleware/authMiddleware");

router.post("/register", register);

router.post("/login", login);

router.post("/verify-otp", verifyOtp);

router.post("/resend-otp", resendOtp);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.post("/logout", logout);

router.post("/apply-lawyer", applyLawyer);

router.get("/me", auth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
