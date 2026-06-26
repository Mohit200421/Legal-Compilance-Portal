const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  sendEmail,
  getOTPEmailTemplate,
  getWelcomeEmailTemplate,
  getEmailConfigStatus,
} = require("../utils/emailService");

// Helper: Generate 6 digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Helper: create token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Helper: set cookie (LOCALHOST FIX)
const setTokenCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// ================= REGISTER (Send OTP) ===================
exports.register = async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;

    if (!name || !username || !email || !password || !role) {
      return res.status(400).json({ msg: "All fields required" });
    }

    if (!email.includes("@")) {
      return res.status(400).json({ msg: "Invalid email" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ msg: "Email already exists" });

    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return res.status(400).json({ msg: "Username already exists" });

    const salt = await bcrypt.genSalt(10);

    const passwordHash = await bcrypt.hash(password, salt);

    const otp = generateOTP();
    const otpCodeHash = await bcrypt.hash(otp, 10);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const lawyerApprovalStatus = role === "lawyer" ? "pending" : "none";

    const user = await User.create({
      name,
      username,
      email,
      passwordHash,
      role,
      lawyerApprovalStatus,
      isEmailVerified: false,

      otpCodeHash,
      otpExpiresAt,
    });

    // Send OTP email with HTML template
    const otpHtml = getOTPEmailTemplate(otp, "verification");

    console.log(" Sending OTP to:", email);

    const emailResult = await sendEmail(
      email,
      "Verify your email (OTP)",
      otpHtml,
    );

    console.log(" Email result:", emailResult);

    // Safe email check
    if (!emailResult || !emailResult.success) {
      console.error("Email failed:", emailResult);

      // Don't fail registration if email sending is misconfigured.
      // User is created with OTP hash; they can retry OTP via /resend-otp.
      return res.status(200).json({
        msg: "Registered successfully ",
        debug: emailResult?.error || "Unknown error",
      });
    }

    if (role === "lawyer") {
      return res.json({
        msg: "Registered successfully! OTP sent to email. After verification, admin approval is required for lawyer login.",
      });
    }

    // Tell frontend to redirect to OTP verification
    return res
      .status(200)
      .json({ msg: "Registered successfully! OTP sent to email.", email });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};

// ================= VERIFY OTP ===================
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ msg: "Email and OTP required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    if (user.isEmailVerified) {
      return res.status(400).json({ msg: "Email already verified" });
    }

    if (!user.otpCodeHash || !user.otpExpiresAt) {
      return res
        .status(400)
        .json({ msg: "OTP not generated. Please register again." });
    }

    if (new Date() > user.otpExpiresAt) {
      return res
        .status(400)
        .json({ msg: "OTP expired. Please request new OTP." });
    }

    const isMatch = await bcrypt.compare(otp, user.otpCodeHash);
    if (!isMatch) return res.status(400).json({ msg: "Invalid OTP" });

    user.isEmailVerified = true;
    user.otpCodeHash = null;
    user.otpExpiresAt = null;
    await user.save();

    res.json({ msg: "Email verified successfully " });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ================= LOGIN (SESSION COOKIE SET) ===================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });
    if (!user.isEmailVerified) {
  return res.status(403).json({
    msg: "Please verify your email first",
  });
}

    if (user.role === "lawyer" && user.lawyerApprovalStatus !== "approved") {
      return res.status(403).json({
        msg: "Your lawyer account is not approved yet. Please wait for admin approval.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = generateToken(user);

    //  Set cookie
    setTokenCookie(res, token);

    res.json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lawyerApprovalStatus: user.lawyerApprovalStatus,
      },
    });
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// ================= LOGOUT (CLEAR COOKIE) ===================
exports.logout = async (req, res) => {
  try {
    const isProd = process.env.NODE_ENV === "production";

    res.clearCookie("token", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
    });

    res.json({ msg: "Logged out successfully ✅" });
  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};

// ================= RESEND OTP ===================
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ msg: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    if (user.isEmailVerified) {
      return res.status(400).json({ msg: "Email already verified" });
    }

    const otp = generateOTP();
    const otpCodeHash = await bcrypt.hash(otp, 10);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.otpCodeHash = otpCodeHash;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    const result = await sendEmail(
      email,
      "Resend OTP - Legal Compliance Portal",
      `
        <div style="font-family:Arial;padding:10px">
          <h2>Your new OTP Code</h2>
          <p><b style="font-size:22px">${otp}</b></p>
          <p>Valid for 10 minutes.</p>
        </div>
      `,
    );

    // Safe email check
    if (!result || !result.success) {
      console.error("Email sending failed:", result);
      return res
        .status(500)
        .json({ msg: "Failed to send OTP. Please try again." });
    }

    res.json({ msg: "New OTP sent to email ✅" });
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};

// ================= FORGOT PASSWORD ===================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ msg: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const otp = generateOTP();
    const resetOtpHash = await bcrypt.hash(otp, 10);
    const resetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.resetOtpHash = resetOtpHash;
    user.resetOtpExpiresAt = resetOtpExpiresAt;
    await user.save();

    const result = await sendEmail(
      email,
      "Reset Password OTP - Legal Compliance Portal",
      `
        <div style="font-family:Arial;padding:10px">
          <h2>Reset Password</h2>
          <p>Your OTP is: <b style="font-size:22px">${otp}</b></p>
          <p>This OTP will expire in 10 minutes.</p>
        </div>
      `,
    );

    // Safe email check
    if (!result || !result.success) {
      console.error("Email sending failed:", result);
      return res
        .status(500)
        .json({ msg: "Failed to send reset email. Please try again." });
    }

    res.json({ msg: "Reset OTP sent to email ✅" });
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};

// ================= RESET PASSWORD ===================
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ msg: "Email, OTP and new password required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    if (!user.resetOtpHash || !user.resetOtpExpiresAt) {
      return res
        .status(400)
        .json({ msg: "OTP not generated. Please try again." });
    }

    if (new Date() > user.resetOtpExpiresAt) {
      return res
        .status(400)
        .json({ msg: "OTP expired. Please request again." });
    }

    const isMatch = await bcrypt.compare(otp, user.resetOtpHash);
    if (!isMatch) return res.status(400).json({ msg: "Invalid OTP" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    user.passwordHash = passwordHash;
    user.resetOtpHash = null;
    user.resetOtpExpiresAt = null;

    await user.save();

    res.json({ msg: "Password reset successfully " });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ================= APPLY LAWYER ===================
exports.applyLawyer = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      barId,
      city,
      state,
      specialization,
      experience,
      message,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !barId ||
      !city ||
      !state ||
      !specialization ||
      !experience
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      const tempPassword = Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(tempPassword, salt);

      await User.create({
        name,
        username: email.split("@")[0] + Math.floor(Math.random() * 1000),
        email,
        passwordHash,
        role: "lawyer",

        phone,
        barId,
        specialization,
        experience: Number(experience),
        about: message || "",

        lawyerApprovalStatus: "pending",
        isEmailVerified: true,
      });

      return res.json({
        msg: "Request submitted successfully  Admin will approve soon.",
      });
    }

    user.role = "lawyer";
    user.phone = phone;
    user.barId = barId;
    user.specialization = specialization;
    user.experience = Number(experience);
    user.about = message || user.about;

    user.lawyerApprovalStatus = "pending";
    await user.save();

    res.json({
      msg: "Request submitted successfully  Admin will approve soon.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};
