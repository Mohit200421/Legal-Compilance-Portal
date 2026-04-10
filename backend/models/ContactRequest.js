const mongoose = require("mongoose");

const contactRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lawyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subject: { type: String, required: true },
    message: { type: String, required: true },

    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Accepted", "Rejected", "PAYMENT_VERIFIED"],
    }, // Flow: Pending → Accepted → PAYMENT_VERIFIED → Chat

    amount: {
      type: Number,
      default: 500,
      min: 0,
    }, // Consultation fee in INR
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactRequest", contactRequestSchema);
