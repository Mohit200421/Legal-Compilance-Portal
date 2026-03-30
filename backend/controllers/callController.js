// Call history controller
const CallHistory = require("../models/CallHistory");

// Get call history for user
exports.getCallHistory = async (req, res) => {
  try {
    const { userId, role } = req.user;

    const query = {};
    if (role === "user") {
      query.callerId = userId;
    } else if (role === "lawyer") {
      query.calleeId = userId;
    }

    const callHistory = await CallHistory.find(query)
      .populate("callerId", "name email")
      .populate("calleeId", "name email")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: callHistory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch call history",
      error: error.message,
    });
  }
};
