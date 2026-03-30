require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./config/db");

// Debug: Check all route modules
const routeFiles = [
  "./routes/authRoutes",
  "./routes/userRoutes",
  "./routes/lawyerRoutes",
  "./routes/adminRoutes",
  "./routes/articleRoutes",
  "./routes/caseRoutes",
  "./routes/categoryRoutes",
  "./routes/discussionRoutes",
  "./routes/documentRoutes",
  "./routes/eventRoutes",
  "./routes/messageRoutes",
  "./routes/notificationRoutes",
  "./routes/ocrRoutes",
  "./routes/paymentRoutes",
  "./routes/publicLawyerRoutes",
  "./routes/publicRoutes",
  "./routes/subscription.routes",
  "./routes/userArticleRoutes",
  "./routes/masterRoutes",
  "./routes/adminLawyerRoutes",
  "./routes/adminMasterRoutes",
];

console.log("Testing route imports...");
for (const route of routeFiles) {
  try {
    const mod = require(route);
    console.log(
      `${route}:`,
      typeof mod,
      Array.isArray(mod) ? "Router" : "module"
    );
    if (typeof mod !== "function" && !Array.isArray(mod)) {
      console.log("  ERROR: Not a router or function!");
      console.log("  Value:", mod);
    }
  } catch (e) {
    console.log(`${route}: ERROR -`, e.message);
  }
}
