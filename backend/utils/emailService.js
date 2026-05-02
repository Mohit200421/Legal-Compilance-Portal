const nodemailer = require("nodemailer");

// ============================================
// Email Transporter Configuration
// ============================================
const createTransporter = () => {
  // Check if credentials are available
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.error("❌ Email credentials not configured in .env");
    return null;
  }

  // Create Nodemailer transporter for Gmail SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for 587
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    tls: {
      rejectUnauthorized: false, // For development
    },
  });

  console.log("📧 Email transporter configured:", {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    user: emailUser,
  });

  return transporter;
};

// Initialize transporter
let transporter = null;

// Initialize on module load
const initTransporter = () => {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
};

// ============================================
// Main sendEmail Function
// ============================================
exports.sendEmail = async (to, subject, html, text = null) => {
  try {
    // Initialize transporter if not already done
    const mailTransporter = initTransporter();

    if (!mailTransporter) {
      console.error("❌ Email transporter not initialized");
      return { success: false, error: "Email service not configured" };
    }

    // Fallback text for email clients that don't support HTML
    const emailText =
      text || `Please enable HTML to view this email. Subject: ${subject}`;

    // Email options
    const mailOptions = {
      from: `"Legal Portal" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
      text: emailText,
    };

    // Send email
    const info = await mailTransporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully:", {
      to: to,
      subject: subject,
      messageId: info.messageId,
    });

    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("❌ Email failed to send:", {
      to: to,
      subject: subject,
      error: err.message,
    });
    return { success: false, error: err.message };
  }
};

// ============================================
// Email Templates
// ============================================

// Welcome Email Template
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
        <p style="color: #333333; font-size: 16px;">Thank you for registering with Legal Portal. We're excited to have you on board!</p>
        <p style="color: #333333; font-size: 16px;">With Legal Portal, you can:</p>
        <ul style="color: #333333; font-size: 16px;">
          <li>Find experienced lawyers</li>
          <li>Manage your legal cases</li>
          <li>Get legal consultations</li>
          <li>Access documents securely</li>
        </ul>
        <p style="color: #333333; font-size: 16px;">If you have any questions, feel free to contact our support team.</p>
        <div style="margin-top: 30px; text-align: center;">
          <a href="https://legalportal.com" style="background-color: #1e3a5f; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px;">Visit Legal Portal</a>
        </div>
      </div>
      <div style="text-align: center; padding: 20px; color: #666666; font-size: 14px;">
        <p>&copy; ${new Date().getFullYear()} Legal Portal. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};

// OTP Email Template
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
      <title>OTP ${purpose}</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #1e3a5f; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: #ffffff; margin: 0;">One-Time Password</h1>
      </div>
      <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="color: #333333; font-size: 16px;">Your OTP for ${purposeText} is:</p>
        <div style="background-color: #ffffff; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; color: #1e3a5f; letter-spacing: 5px;">${otp}</span>
        </div>
        <p style="color: #666666; font-size: 14px;">This OTP will expire in 10 minutes.</p>
        <p style="color: #666666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
      </div>
      <div style="text-align: center; padding: 20px; color: #666666; font-size: 14px;">
        <p>&copy; ${new Date().getFullYear()} Legal Portal. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};

// Contact Support Email Template
exports.getContactSupportEmailTemplate = (userName, userEmail, message) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Request</title>
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #1e3a5f; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: #ffffff; margin: 0;">New Contact Request</h1>
      </div>
      <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="color: #333333; font-size: 16px;"><strong>Name:</strong> ${userName}</p>
        <p style="color: #333333; font-size: 16px;"><strong>Email:</strong> ${userEmail}</p>
        <hr style="border: 1px solid #dddddd; margin: 20px 0;">
        <p style="color: #333333; font-size: 16px;"><strong>Message:</strong></p>
        <p style="color: #333333; font-size: 16px;">${message}</p>
      </div>
      <div style="text-align: center; padding: 20px; color: #666666; font-size: 14px;">
        <p>&copy; ${new Date().getFullYear()} Legal Portal. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};

// ============================================
// Utility function to verify email configuration
// ============================================
exports.verifyEmailConfig = async () => {
  try {
    const mailTransporter = initTransporter();

    if (!mailTransporter) {
      return { success: false, error: "Email not configured" };
    }

    // Verify connection
    await mailTransporter.verify();

    console.log("✅ Email configuration verified successfully");
    return { success: true };
  } catch (err) {
    console.error("❌ Email configuration verification failed:", err.message);
    return { success: false, error: err.message };
  }
};

// Initialize transporter on module load
initTransporter();

module.exports = exports;
