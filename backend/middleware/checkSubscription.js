const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("subscription.plan");

    //  Not logged in or not lawyer
    if (!user || user.role !== "lawyer") {
      return res.status(403).json({
        msg: "Lawyer account required",
      });
    }

    //  No subscription
    if (!user.subscription || !user.subscription.isActive) {
      return res.status(403).json({
        msg: "Active subscription required",
      });
    }

    //  Free plan restriction
    if (user.subscription.plan?.name === "Free") {
      return res.status(403).json({
        msg: "Upgrade to Pro to access this feature",
      });
    }

    //  All good
    next();
  } catch (err) {
    console.error("Subscription middleware error:", err);
    res.status(500).json({
      msg: "Subscription check failed",
    });
  }
};
