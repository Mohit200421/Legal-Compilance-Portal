const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    // 👤 User who made payment
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ⚖️ Lawyer (important for your flow)
    lawyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // 🧾 Consultation request
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContactRequest",
    },

    // 📦 Subscription (existing)
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
    },

    // 💰 Amount
    amount: {
      type: Number,
      default: 500,
    },

    // 🧾 UTR (IMPORTANT)
    utr: {
      type: String,
      unique: true, // 🚨 prevent duplicate fraud
      sparse: true,
    },

    // 📸 Screenshot (NEW)
    screenshot: {
      type: String, // store URL (Cloudinary / local)
    },

    // 💳 Razorpay (existing - untouched)
    razorpayOrderId: String,
    razorpayPaymentId: String,

    // 🎯 Purpose
    purpose: {
      type: String,
      enum: ["SUBSCRIPTION", "CONSULTATION", "OTHER"],
      required: true,
    },

    // 💸 Payment method
    gateway: {
      type: String,
      enum: ["RAZORPAY", "UPI"],
      default: "UPI",
    },

    // 📊 STATUS (UPDATED 🔥)
    status: {
      type: String,
      enum: [
        "PENDING",             // created
        "SUBMITTED",           // user uploaded UTR + SS
        "VERIFIED",            // lawyer accepted
        "REJECTED",            // lawyer rejected
        "SUCCESS",             // (for Razorpay)
        "FAILED"
      ],
      default: "PENDING",
    },

    // 👨‍⚖️ Who verified
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    verifiedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);