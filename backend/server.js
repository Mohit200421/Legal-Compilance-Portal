
require("dotenv").config();
require("./cron/eventReminder");

const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser"); // ✅ NEW

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const userArticleRoutes = require("./routes/userArticleRoutes");

const app = express();

// CORS
app.use(
  cors({
    origin: "https://legal-compilance-portal.vercel.app",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser()); // ✅ NEW (for session cookie)

// Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect DB
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("Backend running...");
});

app.use("/api/user", userArticleRoutes);

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/admin/lawyers", require("./routes/adminLawyerRoutes"));
app.use("/api/admin/master", require("./routes/adminMasterRoutes"));
app.use("/api/admin/lawyers", require("./routes/adminLawyerRoutes"));

app.use("/api/lawyer", require("./routes/lawyerRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api/ocr", require("./routes/ocrRoutes"));



app.use("/api/master", require("./routes/masterRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));

// ✅ Chat Message APIs
app.use("/api/messages", require("./routes/messageRoutes"));

// Error handler
app.use(errorHandler);

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: "https://legal-compilance-portal.vercel.app",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("joinRoom", (userId) => {
    if (!userId) return;
    socket.join(userId);
    console.log("👤 Joined room:", userId);
  });

  socket.on("sendMessage", (data) => {
    if (!data?.receiverId) return;
    io.to(data.receiverId).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
