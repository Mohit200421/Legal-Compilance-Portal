const Payment = require("../models/Payment");
const SubscriptionPlan = require("../models/SubscriptionPlan");
const User = require("../models/User");

/**
 * MOCK PAYMENT (NO RAZORPAY, NO OTP, NO BANK, NO CARD)
 * Used only for college / demo purposes
 */
exports.mockPayment = async (req, res) => {
  try {
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({ msg: "planId is required" });
    }

    // 1️⃣ Get logged-in user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    if (user.role !== "lawyer") {
      return res.status(403).json({ msg: "Only lawyers can upgrade plans" });
    }

    // 2️⃣ Get subscription plan
    const plan = await SubscriptionPlan.findById(planId);

    if (!plan || !plan.isActive) {
      return res.status(404).json({ msg: "Subscription plan not found" });
    }

    // 3️⃣ Create mock payment record
    await Payment.create({
      userId: user._id,
      planId: plan._id,
      amount: plan.price,
      purpose: "SUBSCRIPTION",
      status: "SUCCESS", // ✅ Direct success
    });

    // 4️⃣ Activate subscription on user
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + (plan.durationDays || 30));

    await User.findByIdAndUpdate(user._id, {
      subscription: {
        plan: plan._id,
        isActive: true,
        startDate,
        endDate,
      },
    });

    res.json({
      msg: "Mock payment successful 🎉",
      subscription: {
        plan: plan.name,
        startDate,
        endDate,
      },
    });
  } catch (err) {
    console.error("Mock payment error:", err);
    res.status(500).json({
      msg: "Mock payment failed",
      error: err.message,
    });
  }
};
