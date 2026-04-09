const Payment = require("../models/Payment");
const SubscriptionPlan = require("../models/SubscriptionPlan");
const User = require("../models/User");
const ContactRequest = require("../models/ContactRequest");

const Razorpay = require("razorpay");
const crypto = require("crypto");

// 🔑 Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

/**
 * =========================================
 * 1️⃣ MOCK PAYMENT (SUBSCRIPTION)
 * =========================================
 */
exports.mockPayment = async (req, res) => {
  try {
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({ msg: "planId is required" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    if (user.role !== "lawyer") {
      return res.status(403).json({ msg: "Only lawyers can upgrade plans" });
    }

    const plan = await SubscriptionPlan.findById(planId);

    if (!plan || !plan.isActive) {
      return res.status(404).json({ msg: "Subscription plan not found" });
    }

    await Payment.create({
      userId: user._id,
      planId: plan._id,
      amount: plan.price,
      purpose: "SUBSCRIPTION",
      status: "SUCCESS",
    });

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

/**
 * =========================================
 * 2️⃣ CREATE RAZORPAY ORDER
 * =========================================
 */
exports.createOrder = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { requestId } = req.body;

    const request = await ContactRequest.findById(requestId);

    if (!request) {
      console.log("❌ Request not found:", requestId);
      return res.status(404).json({ msg: "Request not found" });
    }

    const amount = (request.amount || 500) * 100;

    console.log("Amount:", amount);

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${requestId}`,
    });

    res.json({
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("🔥 CREATE ORDER ERROR:", err);
    res.status(500).json({
      msg: "Order creation failed",
      error: err.message,
    });
  }
};

/**
 * =========================================
 * 3️⃣ VERIFY RAZORPAY PAYMENT
 * =========================================
 */
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      requestId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ msg: "Invalid signature" });
    }

    const request = await ContactRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    // Prevent duplicate
    const existing = await Payment.findOne({ requestId });
    if (existing) {
      return res.status(400).json({ msg: "Payment already done" });
    }

    // Save payment
    await Payment.create({
      userId: req.user._id,
      lawyerId: request.lawyerId,
      requestId,
      amount: request.amount,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      purpose: "CONSULTATION",
      gateway: "RAZORPAY",
      status: "SUCCESS",
    });

    // ✅ Unlock chat
    request.status = "PAYMENT_VERIFIED";
    await request.save();

    res.json({ msg: "Payment successful ✅" });
  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).json({
      msg: "Verification failed",
      error: err.message,
    });
  }
};

/**
 * =========================================
 * 4️⃣ GET USER PAYMENTS
 * =========================================
 */
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      userId: req.user._id,
    }).populate("requestId");

    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch payments" });
  }
};