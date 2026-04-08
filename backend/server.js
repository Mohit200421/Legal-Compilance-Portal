require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const { Resend } = require("resend"); // ✅ added

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const lawyerRoutes = require("./routes/lawyerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const documentRoutes = require("./routes/documentRoutes");
const messageRoutes = require("./routes/messageRoutes");
const ocrRoutes = require("./routes/ocrRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const publicLawyerRoutes = require("./routes/publicLawyerRoutes");
const publicRoutes = require("./routes/publicRoutes");
const subscriptionRoutes = require("./routes/subscription.routes");
const userArticleRoutes = require("./routes/userArticleRoutes");
const masterRoutes = require("./routes/masterRoutes");
const adminLawyerRoutes = require("./routes/adminLawyerRoutes");
const callRoutes = require("./routes/callRoutes");

const errorHandler = require("./middleware/errorHandler");

// Cron jobs
require("./cron/eventReminder");
require("./cron/subscriptionExpiry");

const app = express();
const server = http.createServer(app);

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

// ================= DB =================
connectDB();

// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: "*", // change later to your frontend URL
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/lawyer", lawyerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin-lawyer", adminLawyerRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/document", documentRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/public-lawyer", publicLawyerRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/user-article", userArticleRoutes);
app.use("/api/master", masterRoutes);
app.use("/api/call", callRoutes);

// ================= HEALTH CHECK =================
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// ================= RESEND SETUP =================
const resend = new Resend(process.env.RESEND_API_KEY);

// ================= TEST MAIL ROUTE =================
app.get("/test-mail", async (req, res) => {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev", // default working sender
      to: process.env.EMAIL_USER, // send to your own email
      subject: "Test Email",
      html: "<h2>Email working 🚀</h2>",
    });

    console.log("EMAIL SENT:", response);
    res.send("Email sent ✅");
  } catch (err) {
    console.log("EMAIL ERROR:", err);
    res.send("Failed ❌");
  }
});

// ================= ERROR HANDLER =================
app.use(errorHandler);

// ================= SOCKET EVENTS =================
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log("User " + userId + " joined room");
  });

  socket.on("sendMessage", (data) => {
    io.to(data.recipientId).emit("receiveMessage", data.message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});