const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { mockPayment } = require("../controllers/paymentController");

router.post("/mock", auth, mockPayment);

module.exports = router;
