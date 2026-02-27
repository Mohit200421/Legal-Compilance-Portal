const express = require("express");
const router = express.Router();
const SubscriptionPlan = require("../models/SubscriptionPlan");

router.get("/", async (req, res) => {
  const plans = await SubscriptionPlan.find({ isActive: true });
  res.json(plans);
});

module.exports = router;
