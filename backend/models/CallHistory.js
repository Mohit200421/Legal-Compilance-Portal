const mongoose = require("mongoose");

const callHistorySchema = new mongoose.Schema({
  callerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  calleeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lawyer",
    required: true,
  },
  callType: {
    type: String,
    enum: ["audio", "video"],
    required: true,
  },
  duration: {
    type: Number, // seconds
    default: 0,
  },
  status: {
    type: String,
    enum: ["initiated", "accepted", "rejected", "ended", "missed"],
    default: "initiated",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CallHistory", callHistorySchema);
