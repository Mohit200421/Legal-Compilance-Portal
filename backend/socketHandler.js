const CallHistory = require("./models/CallHistory");

// Socket.io handler for call signaling
const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join user room
    socket.on("join-call-room", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined call room`);
    });

    // Initiate call
    socket.on("call-user", ({ userToCall, from, signalData, callType }) => {
      console.log(`Call from ${from} to ${userToCall}`);
      io.to(userToCall).emit("incoming-call", {
        from,
        signalData,
        callType,
        callerId: socket.id,
      });
    });

    // Answer call
    socket.on("answer-call", ({ to, signalData }) => {
      io.to(to).emit("call-accepted", { signalData });
    });

    // End call
    socket.on("end-call", ({ to }) => {
      io.to(to).emit("call-ended");
    });

    // Relay ICE candidates
    socket.on("ice-candidate", ({ to, candidate }) => {
      io.to(to).emit("ice-candidate", { candidate });
    });

    // Save call history
    socket.on(
      "save-call-history",
      async ({ callerId, calleeId, callType, duration, status }) => {
        try {
          const callHistory = new CallHistory({
            callerId,
            calleeId,
            callType,
            duration,
            status,
          });
          await callHistory.save();
        } catch (error) {
          console.error("Error saving call history:", error);
        }
      }
    );

    // 🔥 REQUEST STATUS UPDATES - Lawyer Accept → User Notification
    socket.on("requestStatusUpdated", (data) => {
      console.log("🔄 Relaying requestStatusUpdated:", data);
      io.to(data.userId.toString()).emit("requestStatusUpdated", data);
    });

    // 🔥 PAYMENT VERIFIED - User Pay → Lawyer Chat Unlock
    socket.on("paymentVerified", (data) => {
      console.log("💰 Relaying paymentVerified:", data);
      io.to(data.lawyerId.toString()).emit("paymentVerified", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = socketHandler;
