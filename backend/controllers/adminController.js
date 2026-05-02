const User = require("../models/User");
const City = require("../models/City");
const State = require("../models/State");
const Category = require("../models/Category");
const Lawyer = require("../models/Lawyer");
const Job = require("../models/Job");
const News = require("../models/News");
const { sendEmail } = require("../utils/emailService");
const bcrypt = require("bcryptjs");
const Payment = require("../models/Payment");
const ContactRequest = require("../models/ContactRequest");

/* ================= USERS =================== */

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.activateUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { status: "active" });
  res.json({ msg: "User activated" });
};

exports.deactivateUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { status: "inactive" });
  res.json({ msg: "User deactivated" });
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: "User deleted" });
};

/* ================= LAWYERS =================== */

exports.getAllLawyers = async (req, res) => {
  try {
    const lawyers = await Lawyer.find()
      .populate("city", "cityName")
      .populate("state", "stateName")
      .populate("category", "name");

    res.json(lawyers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

/* ================= CITY =================== */

exports.addCity = async (req, res) => {
  const city = await City.create({ name: req.body.name });
  res.json(city);
};

exports.getCities = async (req, res) => {
  const cities = await City.find();
  res.json(cities);
};

exports.deleteCity = async (req, res) => {
  await City.findByIdAndDelete(req.params.id);
  res.json({ msg: "City deleted" });
};

/* ================= STATE =================== */

exports.addState = async (req, res) => {
  const state = await State.create({ name: req.body.name });
  res.json(state);
};

exports.getStates = async (req, res) => {
  const states = await State.find();
  res.json(states);
};

exports.deleteState = async (req, res) => {
  await State.findByIdAndDelete(req.params.id);
  res.json({ msg: "State deleted" });
};

/* ================= CATEGORY =================== */

exports.addCategory = async (req, res) => {
  const category = await Category.create({ name: req.body.name });
  res.json(category);
};

exports.getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ msg: "Category deleted" });
};

/* ================= DASHBOARD =================== */

exports.getDashboardCounts = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalLawyers = await Lawyer.countDocuments();
    const activeJobs = await Job.countDocuments({ status: "active" });
    const newsPosts = await News.countDocuments();

    res.status(200).json({
      totalUsers,
      totalLawyers,
      activeJobs,
      newsPosts,
    });
  } catch (error) {
    console.error("Dashboard count error:", error);
    res.status(500).json({ msg: "Dashboard count error" });
  }
};

/* ================= LAWYER APPROVAL (USERS TABLE) =================== */

// ✅ Get all pending lawyer users
exports.getPendingLawyerUsers = async (req, res) => {
  try {
    const pendingLawyers = await User.find({
      role: "lawyer",
      lawyerApprovalStatus: "pending",
    }).select("-passwordHash");

    res.json(pendingLawyers);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.approveLawyerUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ msg: "Lawyer not found" });

    if (user.role !== "lawyer") {
      return res.status(400).json({ msg: "This user is not a lawyer" });
    }

    //  Generate NEW temp password HERE
    const tempPassword = Math.random().toString(36).slice(-8);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(tempPassword, salt);

    //   Update user
    user.passwordHash = passwordHash;
    user.lawyerApprovalStatus = "approved";
    await user.save();

    //  SEND EMAIL WITH LOGIN CREDENTIALS
    const clientUrl =
      process.env.CLIENT_URL || "https://legal-compilance-portal.vercel.app";

    try {
      const emailResult = await sendEmail(
        user.email,
        "Lawyer Application Approved 🎉",
        `
          <h2>Congratulations ${user.name}!</h2>
          <p>Your lawyer application has been <b>approved</b> ✅</p>

          <p><b>Email:</b> ${user.email}</p>
          <p><b>Password:</b> ${tempPassword}</p>

          <p>Please login and change your password immediately.</p>

          <a href="${clientUrl}/login" style="display:inline-block; background-color:#1e3a5f; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:5px; margin:10px 0;">
            Login Now
          </a>

          <p>Thank you for joining us!</p>
        `
      );

      if (!emailResult.success) {
        console.error("❌ Failed to send approval email:", emailResult.error);
      } else {
        console.log("✅ Approval email sent to:", user.email);
      }
    } catch (emailErr) {
      console.error("❌ Email error:", emailErr.message);
    }

    res.json({ msg: "Lawyer approved & credentials sent ✅", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

//  Reject lawyer user
exports.rejectLawyerUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ msg: "Lawyer not found" });

    if (user.role !== "lawyer") {
      return res.status(400).json({ msg: "This user is not a lawyer" });
    }

    user.lawyerApprovalStatus = "rejected";
    await user.save();

    res.json({ msg: "Lawyer rejected ❌", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Admin approves payment (optional override)
exports.approvePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ msg: "Payment not found" });
    }

    // ✅ Update payment
    payment.status = "VERIFIED";
    payment.verifiedBy = req.user._id;
    payment.verifiedAt = new Date();
    await payment.save();

    // ✅ Update request
    const request = await ContactRequest.findById(payment.requestId);

    if (request) {
      request.status = "PAYMENT_VERIFIED";
      await request.save();
    }

    res.json({ msg: "Payment approved by admin ✅" });
  } catch (err) {
    console.error("Admin approve payment error:", err);
    res.status(500).json({ msg: err.message });
  }
};
