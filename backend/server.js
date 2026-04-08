require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const nodemailer = require("nodemailer");

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
    origin: "*", // temporary for testing
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

// ================= TEST MAIL ROUTE =================
app.get("/test-mail", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test Email",
      text: "Email working 🚀",
    });

    console.log("EMAIL SENT:", info.response);
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