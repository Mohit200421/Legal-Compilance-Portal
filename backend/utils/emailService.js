const { Resend } = require("resend");

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Email Sender
exports.sendEmail = async (to, subject, html) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log("⚠️ RESEND_API_KEY missing - skipping email");
      return { success: false, error: "No API key" };
    }

    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully:", { to, subject });
    return { success: true, data: response };
  } catch (err) {
    console.error("❌ Email failed:", { to, error: err.message });
    return { success: false, error: err.message };
  }
};