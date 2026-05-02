const mongoose = require("mongoose");

const supportTicketSchema = new mongoose.Schema({
  // Reference to User model
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // User role: user/lawyer
  role: {
    type: String,
    enum: ["user", "lawyer"],
    default: "user",
  },

  // Initial message
  message: {
    type: String,
    required: true,
  },

  // Chat messages array
  messages: [
    {
      sender: {
        type: String,
        enum: ["user", "admin", "lawyer"],
        required: true,
      },
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      isRead: {
        type: Boolean,
        default: false,
      },
      readAt: {
        type: Date,
        default: null,
      },
    },
  ],

  // Ticket status
  status: {
    type: String,
    enum: ["open", "in-progress", "resolved"],
    default: "open",
  },

  // Priority level
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  },

  // Category
  category: {
    type: String,
    enum: ["legal", "technical", "billing", "general"],
    default: "general",
  },

  // Assigned to admin/lawyer
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
supportTicketSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("SupportTicket", supportTicketSchema);
