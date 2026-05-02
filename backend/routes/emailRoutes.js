const express = require("express");
const router = express.Router();
const {
  sendEmail,
  getWelcomeEmailTemplate,
  getOTPEmailTemplate,
  getContactSupportEmailTemplate,
  verifyEmailConfig,
} = require("../utils/emailService");

// ============================================
// Test Email Route
// POST /api/test-email
// ============================================
router.post("/test-email", async (req, res) => {
  try {
    const { to, subject, type } = req.body;

    // If no destination provided, use the configured email
    const recipient = to || process.env.EMAIL_USER;
    const emailSubject = subject || "Test Email from Legal Portal";

    let htmlContent;

    // Different test email types
    switch (type) {
      case "welcome":
        htmlContent = getWelcomeEmailTemplate("Test User");
        break;
      case "otp":
        htmlContent = getOTPEmailTemplate("123456", "verification");
        break;
      case "contact":
        htmlContent = getContactSupportEmailTemplate(
          "Test User",
          recipient,
          "This is a test message"
        );
        break;
      default:
        htmlContent = `
          <h1>Test Email</h1>
          <p>This is a test email from Legal Portal.</p>
          <p>Sent at: ${new Date().toISOString()}</p>
        `;
    }

    const result = await sendEmail(recipient, emailSubject, htmlContent);

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Email sent successfully",
        messageId: result.messageId,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to send email",
        error: result.error,
      });
    }
  } catch (err) {
    console.error("❌ Test email error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

// ============================================
// Verify Email Configuration
// GET /api/test-email/config
// ============================================
router.get("/test-email/config", async (req, res) => {
  try {
    const result = await verifyEmailConfig();

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Email configuration is valid",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Email configuration is invalid",
        error: result.error,
      });
    }
  } catch (err) {
    console.error("❌ Config verification error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
});

module.exports = router;
