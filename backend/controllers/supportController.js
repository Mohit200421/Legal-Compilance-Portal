const SupportTicket = require("../models/SupportTicket");

// ===================== CREATE NEW TICKET =====================
exports.createTicket = async (req, res) => {
  try {
    const { message, category, priority } = req.body;

    // Validate required fields
    if (!message) {
      return res.status(400).json({ msg: "Message is required" });
    }

    // Determine user role
    const role = req.user.role === "lawyer" ? "lawyer" : "user";

    // Create ticket
    const ticket = await SupportTicket.create({
      userId: req.user.id,
      role,
      message,
      category: category || "general",
      priority: priority || "medium",
      messages: [
        {
          sender: role,
          senderId: req.user.id,
          text: message,
          timestamp: new Date(),
          isRead: false,
        },
      ],
    });

    // Populate user info
    await ticket.populate("userId", "name email role");
    await ticket.populate("assignedTo", "name email");

    res.status(201).json({
      msg: "Support ticket created successfully",
      ticket,
    });
  } catch (err) {
    console.error("Create ticket error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===================== GET MY TICKETS (User/Lawyer) =====================
exports.getMyTickets = async (req, res) => {
  try {
    const { status, priority, category } = req.query;

    // Build query
    let query = { userId: req.user.id };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    const tickets = await SupportTicket.find(query)
      .sort({ createdAt: -1 })
      .populate("userId", "name email role")
      .populate("assignedTo", "name email");

    res.json(tickets);
  } catch (err) {
    console.error("Get my tickets error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===================== GET ALL TICKETS (Admin Only) =====================
exports.getAllTickets = async (req, res) => {
  try {
    const { status, priority, category, role } = req.query;

    // Build query
    let query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (role) query.role = role;

    const tickets = await SupportTicket.find(query)
      .sort({ createdAt: -1 })
      .populate("userId", "name email role")
      .populate("assignedTo", "name email");

    res.json(tickets);
  } catch (err) {
    console.error("Get all tickets error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===================== GET SINGLE TICKET =====================
exports.getSingleTicket = async (req, res) => {
  try {
    const { id } = req.params;

    // Find ticket
    let ticket = await SupportTicket.findById(id)
      .populate("userId", "name email role")
      .populate("assignedTo", "name email")
      .populate("messages.senderId", "name email role");

    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    // Check access: Admin can access all, users can only access their own
    if (req.user.role !== "admin") {
      if (ticket.userId._id.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ msg: "Not authorized to view this ticket" });
      }
    }

    // Mark messages as read (for admin viewing user tickets)
    if (req.user.role === "admin") {
      let updated = false;
      ticket.messages = ticket.messages.map((m) => {
        if (m.sender !== "admin" && !m.isRead) {
          updated = true;
          return {
            ...m.toObject(),
            isRead: true,
            readAt: new Date(),
          };
        }
        return m;
      });

      if (updated) await ticket.save();
    }

    res.json(ticket);
  } catch (err) {
    console.error("Get single ticket error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===================== SEND MESSAGE TO TICKET =====================
exports.sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ msg: "Message text is required" });
    }

    // Find ticket
    const ticket = await SupportTicket.findById(id);

    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    // Check access
    if (req.user.role !== "admin") {
      if (ticket.userId.toString() !== req.user.id) {
        return res.status(403).json({ msg: "Not authorized" });
      }
    }

    // Check if ticket is resolved
    if (ticket.status === "resolved") {
      return res
        .status(400)
        .json({ msg: "Cannot send message to resolved ticket" });
    }

    // Determine sender type
    const sender = req.user.role === "admin" ? "admin" : ticket.role;

    // Add message
    ticket.messages.push({
      sender,
      senderId: req.user.id,
      text,
      timestamp: new Date(),
      isRead: false,
    });

    // Update status if first message from admin
    if (sender === "admin" && ticket.status === "open") {
      ticket.status = "in-progress";
    }

    await ticket.save();

    // Populate response
    await ticket.populate("userId", "name email role");
    await ticket.populate("assignedTo", "name email");
    await ticket.populate("messages.senderId", "name email role");

    res.json({
      msg: "Message sent successfully",
      ticket,
    });
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===================== UPDATE TICKET STATUS =====================
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, assignedTo } = req.body;

    // Find ticket
    const ticket = await SupportTicket.findById(id);

    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    // Check access (only admin can update status)
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ msg: "Only admin can update ticket status" });
    }

    // Update fields
    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;
    if (assignedTo) ticket.assignedTo = assignedTo;

    await ticket.save();

    // Populate response
    await ticket.populate("userId", "name email role");
    await ticket.populate("assignedTo", "name email");

    res.json({
      msg: "Ticket status updated",
      ticket,
    });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===================== GET TICKET STATS (Admin Only) =====================
exports.getTicketStats = async (req, res) => {
  try {
    // Count by status
    const openCount = await SupportTicket.countDocuments({ status: "open" });
    const inProgressCount = await SupportTicket.countDocuments({
      status: "in-progress",
    });
    const resolvedCount = await SupportTicket.countDocuments({
      status: "resolved",
    });

    // Count by priority
    const urgentCount = await SupportTicket.countDocuments({
      priority: "urgent",
    });
    const highCount = await SupportTicket.countDocuments({ priority: "high" });

    // Total tickets
    const totalCount = await SupportTicket.countDocuments();

    res.json({
      total: totalCount,
      open: openCount,
      inProgress: inProgressCount,
      resolved: resolvedCount,
      urgent: urgentCount,
      high: highCount,
    });
  } catch (err) {
    console.error("Get ticket stats error:", err);
    res.status(500).json({ error: err.message });
  }
};
