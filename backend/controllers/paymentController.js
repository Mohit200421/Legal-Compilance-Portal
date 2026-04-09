const Payment = require("../models/Payment");
const SubscriptionPlan = require("../models/SubscriptionPlan");
const User = require("../models/User");
const ContactRequest = require("../models/ContactRequest");
const cloudinary = require("../config/cloudinary");

const streamifier = require("streamifier");

// ✅ Upload buffer to Cloudinary
const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "payments" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

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
 * 2️⃣ USER SUBMITS PAYMENT (UPI + SCREENSHOT)
 * =========================================
 */
exports.submitPayment = async (req, res) => {
  try {
    const { requestId, utr } = req.body;

    if (!requestId || !utr || !req.file) {
      return res.status(400).json({
        msg: "requestId, UTR and screenshot are required",
      });
    }

    if (utr.length < 8) {
      return res.status(400).json({ msg: "Invalid UTR" });
    }

    // ✅ Upload to Cloudinary using buffer
    const upload = await uploadFromBuffer(req.file.buffer);

    const request = await ContactRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    const existing = await Payment.findOne({ requestId });

    if (existing) {
      return res.status(400).json({
        msg: "Payment already submitted for this request",
      });
    }

    const payment = await Payment.create({
      userId: req.user._id,
      lawyerId: request.lawyerId,
      requestId,
      amount: request.amount || 500,
      utr,
      screenshot: upload.secure_url,
      purpose: "CONSULTATION",
      gateway: "UPI",
      status: "SUBMITTED",
    });

    request.status = "PAYMENT_SUBMITTED";
    await request.save();

    res.json({
      msg: "Payment submitted successfully ✅",
      payment,
    });
  } catch (err) {
    console.error("Submit payment error:", err);
    res.status(500).json({
      msg: "Payment submission failed",
      error: err.message,
    });
  }
};

/**
 * =========================================
 * 3️⃣ LAWYER VERIFIES PAYMENT
 * =========================================
 */
exports.verifyPaymentByLawyer = async (req, res) => {
  try {
    const { paymentId, action } = req.body;

    if (!paymentId || !["ACCEPT", "REJECT"].includes(action)) {
      return res.status(400).json({
        msg: "paymentId and valid action required",
      });
    }

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ msg: "Payment not found" });
    }

    if (payment.lawyerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const request = await ContactRequest.findById(payment.requestId);

    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    if (action === "ACCEPT") {
      payment.status = "VERIFIED";
      request.status = "PAYMENT_VERIFIED";
    } else {
      payment.status = "REJECTED";
      request.status = "PAYMENT_REJECTED";
    }

    payment.verifiedBy = req.user._id;
    payment.verifiedAt = new Date();

    await payment.save();
    await request.save();

    res.json({
      msg: `Payment ${
        action === "ACCEPT" ? "verified" : "rejected"
      } successfully`,
    });
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
 * 4️⃣ GET PAYMENTS FOR LAWYER
 * =========================================
 */
exports.getLawyerPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      lawyerId: req.user._id,
      status: "SUBMITTED",
    })
      .populate("userId", "name email")
      .populate("requestId");

    res.json(payments);
  } catch (err) {
    console.error("Fetch payments error:", err);
    res.status(500).json({
      msg: "Failed to fetch payments",
      error: err.message,
    });
  }
};

/**
 * =========================================
 * 5️⃣ GET USER PAYMENTS
 * =========================================
 */
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      userId: req.user._id,
    }).populate("requestId");

    res.json(payments);
  } catch (err) {
    console.error("Fetch user payments error:", err);
    res.status(500).json({
      msg: "Failed to fetch payments",
      error: err.message,
    });
  }
};