const SibApiV3Sdk = require("sib-api-v3-sdk");

// Setup Brevo client
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// ============================================
// Send Email - Brevo Only
// ============================================
exports.sendEmail = async (to, subject, html, text = null) => {
  try {
    const sendSmtpEmail = {
      sender: {
        email: process.env.EMAIL_USER,
        name: "Legal Portal",
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html,
    };

    const response = await emailApi.sendTransacEmail(sendSmtpEmail);

    console.log("✅ Email sent via Brevo:", {
      to: to,
      subject: subject,
      messageId: response.messageId,
      messageUuid: response.messageUuid,
    });

    return {
      success: true,
      messageId: response.messageId,
      provider: "brevo",
    };
  } catch (err) {
    console.error("❌ Brevo email failed:", {
      to: to,
      subject: subject,
      error: err.message,
      response: err.response ? err.response.body : null,
    });

    return {
      success: false,
      error: err.message,
      provider: "brevo",
    };
  }
};

// ============================================
// Email Templates
// ============================================

exports.getWelcomeEmailTemplate = (name) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Legal Portal</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #1e3a5f; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: #ffffff; margin: 0;">Welcome to Legal Portal!</h1>
      </div>
      <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="color: #333333; font-size: 16px;">Hello <strong>${name}</strong>,</p>
        <p style="color: #333333; font-size: 16px;">Thank you for registering with Legal Portal!</p>
        <div style="margin-top: 30px; text-align: center;">
          <a href="https://legal-compilance-portal.vercel.app" style="background-color: #1e3a5f; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px;">Visit Legal Portal</a>
        </div>
      </div>
      <div style="text-align: center; padding: 20px; color: #666666; font-size: 14px;">
        <p>&copy; ${new Date().getFullYear()} Legal Portal. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};

exports.getOTPEmailTemplate = (otp, purpose = "verification") => {
  const purposeText =
    purpose === "verification"
      ? "verify your email"
      : purpose === "reset"
      ? "reset your password"
      : "verify your identity";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #1e3a5f; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: #ffffff; margin: 0;">One-Time Password</h1>
      </div>
      <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="color: #333333; font-size: 16px;">Your OTP to ${purposeText} is:</p>
        <div style="background-color: #ffffff; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; color: #1e3a5f; letter-spacing: 5px;">${otp}</span>
        </div>
        <p style="color: #666666; font-size: 14px;">This OTP will expire in 10 minutes.</p>
      </div>
    </body>
    </html>
  `;
};

exports.getContactSupportEmailTemplate = (userName, userEmail, message) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>New Contact Request</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #1e3a5f; padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0;">New Contact Request</h1>
      </div>
      <div style="background-color: #f9f9f9; padding: 30px;">
        <p><strong>Name:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      </div>
    </body>
    </html>
  `;
};

// Log on startup
console.log("📧 Brevo Email Service initialized");

module.exports = exports;
