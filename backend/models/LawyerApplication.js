const mongoose = require("mongoose");

const LawyerApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },

    specialization: { type: String, required: true },
    experience: { type: Number, required: true, min: 0 },
    barCouncilId: { type: String, required: true },

    officeAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },

    bio: { type: String, default: "" },

    // Cloudinary URLs or local paths
    profilePhoto: { type: String, default: "" },

    // Upload URLs/paths (array)
    documents: [{ type: String }],

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    rejectionReason: { type: String, default: "" },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: { type: Date, default: null },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false },
);

module.exports = mongoose.model("LawyerApplication", LawyerApplicationSchema);
