import { useEffect, useRef, useState } from "react";
import API from "../../api/axios";
import socket from "../../api/socket";
import "./ChatModal.css";


export default function ChatModal({ open, onClose, receiverId, receiverName }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const senderId = user?.id;

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  // join room when modal opens
  useEffect(() => {
    if (open && senderId) {
      socket.emit("joinRoom", senderId);
    }
  }, [open, senderId]);

  // load old messages when modal opens
  useEffect(() => {
    const loadConversation = async () => {
      if (!open || !receiverId) return;

      try {
        setLoading(true);
        const res = await API.get(`/messages/conversation/${receiverId}`);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
        alert("Failed to load chat");
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [open, receiverId]);

  // realtime receive
  useEffect(() => {
    const handler = (data) => {
      // only add if this message belongs to this chat
      if (
        (data.senderId === receiverId && data.receiverId === senderId) ||
        (data.senderId === senderId && data.receiverId === receiverId)
      ) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("receiveMessage", handler);
    return () => socket.off("receiveMessage", handler);
  }, [receiverId, senderId]);

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // optional: clear chat on close
  useEffect(() => {
    if (!open) {
      setMessages([]);
      setMessage("");
    }
  }, [open]);

  const handleSend = async () => {
    if (!message.trim()) return;
    if (!receiverId) return alert("Receiver not found!");

    const msgData = {
      senderId,
      receiverId,
      message: message.trim(),
    };

    try {
      // ✅ show instantly on sender UI
      setMessages((prev) => [...prev, msgData]);

      // 1) emit realtime to receiver
      socket.emit("sendMessage", msgData);

      // 2) save to DB
      await API.post("/messages/send", {
        receiverId,
        message: msgData.message,
      });

      setMessage("");
    } catch (err) {
      console.log(err);
      alert("Failed to send message");
    }
  };

  if (!open) return null;

  return (
    <div className="chatModal-backdrop">
      <div className="chatModal-modal">
        {/* Header */}
        <div className="chatModal-header">
          <div className="chatModal-titleWrap">
            <h3 className="chatModal-title">💬 Chat</h3>
            <small className="chatModal-subtitle">
              {receiverName || "Conversation"}
            </small>
          </div>

          <button onClick={onClose} className="chatModal-closeBtn">
            ✖
          </button>
        </div>

        {/* Body */}
        <div className="chatModal-body">
          {loading ? (
            <p className="chatModal-infoText">Loading chat...</p>
          ) : messages.length === 0 ? (
            <p className="chatModal-infoText">No messages yet.</p>
          ) : (
            messages.map((m, idx) => {
              const mine = m.senderId === senderId;
              return (
                <div
                  key={idx}
                  className={`chatModal-row ${mine ? "me" : "them"}`}
                >
                  <div className={`chatModal-bubble ${mine ? "me" : "them"}`}>
                    {m.message}
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Footer */}
        <div className="chatModal-footer">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="chatModal-input"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <button
            onClick={handleSend}
            className="chatModal-sendBtn"
            disabled={!message.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
