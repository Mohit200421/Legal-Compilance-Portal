const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createTicket,
  getMyTickets,
  getAllTickets,
  getSingleTicket,
  sendMessage,
  updateStatus,
  getTicketStats,
} = require("../controllers/supportController");

// ===================== PUBLIC ROUTES =====================
// None - all routes require authentication

// ===================== PROTECTED ROUTES =====================
// All routes require auth middleware
router.use(authMiddleware);

// ===================== USER/LAWYER ROUTES =====================

// POST /api/support - Create new ticket
router.post("/", createTicket);

// GET /api/support - Get my tickets (user/lawyer)
router.get("/", getMyTickets);

// GET /api/support/:id - Get single ticket
router.get("/:id", getSingleTicket);

// POST /api/support/:id/message - Send message to ticket
router.post("/:id/message", sendMessage);

// ===================== ADMIN ROUTES =====================
// These routes should be admin-only, but we check role in controller

// GET /api/support/admin/all - Get all tickets (admin only)
router.get("/admin/all", getAllTickets);

// GET /api/support/admin/stats - Get ticket stats (admin only)
router.get("/admin/stats", getTicketStats);

// PATCH /api/support/:id/status - Update ticket status (admin only)
router.patch("/:id/status", updateStatus);

module.exports = router;
