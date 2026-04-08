const { Resend } = require("resend");

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

//  Safe Email Sender (Production Ready)
exports.sendEmail = async (to, subject, html) => {
  try {
    // Check if API key exists
    if (!process.env.RESEND_API_KEY) {
      console.log(" RESEND_API_KEY not set. Skipping email...");
      return;
    }

    const response = await resend.emails.send({
      from: "legal@lawsetu.com", // default sender (works instantly)
      to: to,
      subject: subject,
      html: html,
    });

    console.log(" Email sent:", response);
  } catch (err) {
    console.log(" Email failed:", err);
  }
};