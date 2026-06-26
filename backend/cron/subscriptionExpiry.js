const cron = require("node-cron");
const User = require("../models/User");

/**
 * Subscription Expiry Checker
 * Runs every day at midnight to check and deactivate expired subscriptions
 */
cron.schedule("0 0 * * *", async () => {
  console.log(" Checking for expired subscriptions...");

  try {
    // Find all users with active subscriptions
    const users = await User.find({
      "subscription.isActive": true,
      "subscription.endDate": { $lt: new Date() },
    });

    console.log(`Found ${users.length} users with expired subscriptions`);

    for (const user of users) {
      // Deactivate subscription
      user.subscription.isActive = false;
      await user.save();

      console.log(` Deactivated subscription for user: ${user.email}`);
    }

    console.log(" Subscription expiry check completed");
  } catch (err) {
    console.error(" Subscription expiry check failed:", err);
  }
});

/**
 * Subscription Expiring Soon Notification
 * Runs every day at 10 AM to notify users whose subscriptions are expiring in 3 days
 */
cron.schedule("0 10 * * *", async () => {
  console.log("⏰ Checking for expiring subscriptions...");

  try {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const expiringUsers = await User.find({
      "subscription.isActive": true,
      "subscription.endDate": {
        $gte: new Date(),
        $lte: threeDaysFromNow,
      },
    });

    console.log(
      `Found ${expiringUsers.length} users with subscriptions expiring soon`
    );

    for (const user of expiringUsers) {
      // TODO: Send email notification
      console.log(`📧 Subscription expiring soon for user: ${user.email}`);
    }

    console.log("✅ Expiring subscriptions check completed");
  } catch (err) {
    console.error("❌ Expiring subscriptions check failed:", err);
  }
});

module.exports = cron;
