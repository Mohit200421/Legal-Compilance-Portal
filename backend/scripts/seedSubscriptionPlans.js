const mongoose = require("mongoose");
const SubscriptionPlan = require("../models/SubscriptionPlan");

mongoose.connect("mongodb://127.0.0.1:27017/legalcompliance");

const plans = [
  { name: "Free", price: 0 },
  { name: "Pro", price: 999 },
  { name: "Elite", price: 2499 },
];

(async () => {
  await SubscriptionPlan.deleteMany({});
  await SubscriptionPlan.insertMany(plans);
  console.log("✅ Subscription plans seeded");
  process.exit();
})();
