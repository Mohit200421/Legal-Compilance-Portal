import { useEffect, useState } from "react";
import API from "../../api/axios";
import { socket } from "../../api/socket";
import "./Chat.css";


export default function Chat({ receiverId }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const senderId = user?.id;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // join room
  useEffect(() => {
    if (senderId) socket.emit("joinRoom", senderId);
  }, [senderId]);

  // load old messages
  useEffect(() => {
    const fetchConversation = async () => {
      const res = await API.get(`/messages/conversation/${receiverId}`);
      setMessages(res.data);
    };
    if (receiverId) fetchConversation();
  }, [receiverId]);

  // receive message real-time
  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;

    const msgData = { senderId, receiverId, message };

    // emit socket
    socket.emit("sendMessage", msgData);

    // save in DB
    await API.post("/messages/send", { receiverId, message });

    setMessages((prev) => [...prev, msgData]);
    setMessage("");
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div>
          <h2>💬 Chat</h2>
          <p className="chat-subtitle">Secure conversation</p>
        </div>
      </div>
  
      <div className="chat-messages">
        {messages.map((m, index) => (
          <div
            key={index}
            className={`chat-message-row ${
              m.senderId === senderId ? "me" : "them"
            }`}
          >
            <div
              className={`chat-bubble ${
                m.senderId === senderId ? "me" : "them"
              }`}
            >
              <span className="chat-name">
                {m.senderId === senderId ? "Me" : "Them"}
              </span>
              {m.message}
            </div>
          </div>
        ))}
      </div>
  
      <div className="chat-input-area">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
          className="chat-input"
        />
        <button
          onClick={handleSend}
          className="chat-send-btn"
          disabled={!message.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );  
}
