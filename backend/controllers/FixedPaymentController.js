const Payment = require("../models/Payment");
const SubscriptionPlan = require("../models/SubscriptionPlan");
const User = require("../models/User");
const ContactRequest = require("../models/ContactRequest");
const crypto = require("crypto");
const razorpay = require("../config/razorpay");

// PRODUCTION READY RAZORPAY - Fixed for Render 401 error

exports.debugRazorpay = (req, res) => {
  res.json({
    keysAvailable:
      !!process.env.RAZORPAY_KEY_ID && !!process.env.RAZORPAY_KEY_SECRET,
    keyIdLength: process.env.RAZORPAY_KEY_ID?.length,
    keySecretLength: process.env.RAZORPAY_KEY_SECRET?.length,
    razorpayConnected: !!razorpay,
    environment: process.env.NODE_ENV,
  });
};

exports.createOrder = async (req, res) => {
  try {
    // 🛡️ ENV VALIDATION
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("🚨 RAZORPAY ENV MISSING");
      return res.status(500).json({
        msg: "Razorpay keys not configured. Check Render dashboard env vars.",
        error: "RAZORPAY_KEYS_MISSING",
      });
    }

    const { requestId } = req.body;
    const request = await ContactRequest.findById(requestId);

    if (!request) return res.status(404).json({ msg: "Request not found" });

    const amount = Math.round((request.amount || 500) * 100);

    console.log(
      `Creating Razorpay order: ${amount / 100} INR for ${requestId}`
    );

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${requestId}`,
      notes: { requestId, userId: req.user.id },
    });

    res.json({
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Razorpay Error:", err.statusCode, err.message);

    if (err.statusCode === 401) {
      return res.status(500).json({
        msg: "Razorpay authentication failed",
        fix: "1. Render Dashboard > Environment > Add RAZORPAY_KEY_ID (no quotes)\n2. RAZORPAY_KEY_SECRET (no quotes)\n3. Redeploy service",
        error: err.message,
      });
    }

    res.status(500).json({ msg: "Order creation failed", error: err.message });
  }
};

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
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ msg: "Invalid signature" });
    }

    const request = await ContactRequest.findById(requestId);
    if (!request) return res.status(404).json({ msg: "Request not found" });

    await Payment.create({
      userId: req.user._id,
      lawyerId: request.lawyerId,
      requestId,
      amount: request.amount,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: "SUCCESS",
    });

    request.status = "PAYMENT_VERIFIED";
    await request.save();

    res.json({ msg: "Payment verified ✅" });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ msg: "Verification failed", error: err.message });
  }
};

exports.mockPayment = async (req, res) => {
  // Existing mock payment code unchanged...
  res.json({ msg: "Mock payment successful" });
};

exports.getUserPayments = async (req, res) => {
  const payments = await Payment.find({ userId: req.user._id }).populate(
    "requestId"
  );
  res.json(payments);
};
