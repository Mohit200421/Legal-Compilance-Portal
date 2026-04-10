import { io } from "socket.io-client";

// 🔥 Remove /api if present
const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000")
  .replace("/api", "")
  .replace(/\/$/, "");

const socket = io(BASE_URL, {
  autoConnect: true,
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Debug logs
socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Socket disconnected");
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket connection error:", error.message);
});

export default socket;