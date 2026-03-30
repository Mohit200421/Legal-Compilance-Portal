require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const lawyerRoutes = require("./routes/lawyerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const articleRoutes = require("./routes/articleRoutes");
const caseRoutes = require("./routes/caseRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const discussionRoutes = require("./routes/discussionRoutes");
const documentRoutes = require("./routes/documentRoutes");
const eventRoutes = require("./routes/eventRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const ocrRoutes = require("./routes/ocrRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const publicLawyerRoutes = require("./routes/publicLawyerRoutes");
const publicRoutes = require("./routes/publicRoutes");
const subscriptionRoutes = require("./routes/subscription.routes");
const userArticleRoutes = require("./routes/userArticleRoutes");
const masterRoutes = require("./routes/masterRoutes");
const adminLawyerRoutes = require("./routes/adminLawyerRoutes");
const adminMasterRoutes = require("./routes/adminMasterRoutes");

const errorHandler = require("./middleware/errorHandler");

require("./cron/eventReminder");
require("./cron/subscriptionExpiry");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/lawyer", lawyerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin-lawyer", adminLawyerRoutes);
app.use("/api/admin-master", adminMasterRoutes);
app.use("/api/article", articleRoutes);
app.use("/api/case", caseRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/discussion", discussionRoutes);
app.use("/api/document", documentRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/ocr", ocrRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/public-lawyer", publicLawyerRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/user-article", userArticleRoutes);
app.use("/api/master", masterRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use(errorHandler);

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log("User " + userId + " joined room");
  });

  socket.on("sendMessage", (data) => {
    const recipientId = data.recipientId;
    const message = data.message;
    io.to(recipientId).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

module.exports = app;
