const User = require("../models/User");
const { sendEmail } = require("../utils/emailService");

// ✅ Get all lawyer requests (pending)
exports.getPendingLawyers = async (req, res) => {
  try {
    const lawyers = await User.find({
      role: "lawyer",
      lawyerApprovalStatus: "pending",
    }).select("-passwordHash");

    res.json(lawyers);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Approve / Reject lawyer
exports.updateLawyerApprovalStatus = async (req, res) => {
  try {
    const { status } = req.body; // approved / rejected

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const lawyer = await User.findById(req.params.id);

    if (!lawyer || lawyer.role !== "lawyer") {
      return res.status(404).json({ msg: "Lawyer not found" });
    }

    lawyer.lawyerApprovalStatus = status;
    await lawyer.save();

    // ✅ Lawyer approval email - Fixed HTML & Logging
    try {
      console.log(`📧 Sending approval email to ${lawyer.email} (${status})`);

      await sendEmail(
        lawyer.email,
        `Lawyer Account ${status.toUpperCase()} 🎉`,
        `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">LawSetu Lawyer Account</h2>
            <p>Hello <b>${lawyer.name}</b>,</p>
            <p>Your lawyer account request has been <b style="color: ${
              status === "approved" ? "#10b981" : "#ef4444"
            }">${status.toUpperCase()}</b>.</p>
            
            ${
              status === "approved"
                ? `
              <p><strong>Congratulations!</strong> You can now login to the dashboard.</p>
              <p>Please use your registered email and password to login.</p>
              <a href="http://localhost:5173/login" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Login to Dashboard</a>
            `
                : `
              <p>Please apply again after fixing the issues.</p>
            `
            }
            
            <p>Thank you for choosing LawSetu!</p>
            <hr style="margin-top: 30px;">
            <p style="color: #6b7280; font-size: 12px;">This is an automated email. Please do not reply.</p>
          </div>
        `
      );

      console.log("✅ Lawyer approval email sent successfully");
    } catch (e) {
      console.error("❌ Lawyer approval email failed:", e.message);
    }

    res.json({ msg: `Lawyer ${status} successfully`, lawyer });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
