const Payment = require("../models/Payment");
const SubscriptionPlan = require("../models/SubscriptionPlan");
const User = require("../models/User");
const ContactRequest = require("../models/ContactRequest");
const crypto = require("crypto");
const razorpay = require("../config/razorpay");

// 🚨 PRODUCTION READY RAZORPAY CONTROLLER
// Fixed env validation, logging, Render deployment

/**
 * =========================================
 * 🔍 DEBUG - Check Razorpay config (GET /api/payment/debug)
 * =========================================
 */
exports.debugRazorpay = (req, res) => {
  const keyId = Boolean(process.env.RAZORPAY_KEY_ID);
  const keySecret = Boolean(process.env.RAZORPAY_KEY_SECRET);

  res.json({
    localKeyId: !!process.env.RAZORPAY_KEY_ID,
    localKeySecret: !!process.env.RAZORPAY_KEY_SECRET,
    razorpayConnected: keyId && keySecret,
    envDebug: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
    },
  });
};

/**
 * =========================================
 * 1️⃣ MOCK PAYMENT (unchanged)
 * =========================================
 */
exports.mockPayment = async (req, res) => {
  try {
    const { planId } = req.body;
    // ... (existing code unchanged)
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
 * 2️⃣ CREATE RAZORPAY ORDER - PRODUCTION READY
 * =========================================
 */
exports.createOrder = async (req, res) => {
  try {
    console.log("🧾 CREATE ORDER - ENV CHECK:", {
      hasKeyId: !!process.env.RAZORPAY_KEY_ID,
      keyIdLength: process.env.RAZORPAY_KEY_ID?.length || 0,
      hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET,
      NODE_ENV: process.env.NODE_ENV,
    });

    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({ msg: "requestId required" });
    }

    const request = await ContactRequest.findById(requestId);
    if (!request) {
      console.log("❌ Request not found:", requestId);
      return res.status(404).json({ msg: "Request not found" });
    }

    const amount = Math.round((request.amount || 500) * 100); // paise

    console.log(`💰 Creating order: amount=${amount} for request=${requestId}`);

    // 🚨 RAZORPAY ORDER CREATION - Fixed receipt length
    const receiptId = `req_${requestId.slice(-10)}`;
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: receiptId,
      notes: {
        requestId,
        userId: req.user?.id,
      },
    });

    console.log(`📄 Receipt ID: ${receiptId}`);

    console.log("✅ RAZORPAY ORDER CREATED:", order.id);

    res.json({
      order,
      key: process.env.RAZORPAY_KEY_ID, // Publishable key
    });
  } catch (err) {
    console.error("🔥 RAZORPAY CREATE ORDER ERROR:", {
      message: err.message,
      statusCode: err.statusCode,
      errorCode: err.error?.code,
      description: err.error?.description,
      source: err.source,
    });

    // 🚨 SPECIFIC RAZORPAY ERROR HANDLING - NULL SAFE
    if (err.statusCode === 401 || (err?.message || "").includes("api key")) {
      return res.status(500).json({
        msg: "Razorpay authentication failed - check RENDER env vars",
        error: "RAZORPAY_401",
        fix: "Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Render dashboard",
      });
    }

    res.status(500).json({
      msg: "Order creation failed",
      error: err.message,
      razorpayError: err.statusCode,
    });
  }
};

/**
 * =========================================
 * 3️⃣ VERIFY RAZORPAY PAYMENT - FIXED
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
    const secret = process.env.RAZORPAY_KEY_SECRET; // ✅ Consistent with config

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.log("❌ Signature mismatch");
      return res.status(400).json({ msg: "Invalid signature" });
    }

    const request = await ContactRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    const existing = await Payment.findOne({ requestId });
    if (existing) {
      return res.status(400).json({ msg: "Payment already processed" });
    }

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

    request.status = "PAYMENT_VERIFIED";
    await request.save();

    // 🔥 Real-time: Notify lawyer CHAT UNLOCKED 💬
    const io = req.app.get("io");
    if (io && request.lawyerId) {
      io.to(request.lawyerId.toString()).emit("paymentVerified", {
        requestId: request._id,
        userId: req.user._id,
        userName: req.user.name,
        status: "PAYMENT_VERIFIED",
        amount: request.amount,
      });
      console.log(
        `💰📡 Emitted paymentVerified to lawyer ${request.lawyerId}: Chat unlocked!`
      );
    }

    console.log("✅ Payment verified:", razorpay_payment_id);

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
 * 4️⃣ GET USER PAYMENTS (unchanged)
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
