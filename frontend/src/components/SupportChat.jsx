import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getSingleTicket, sendMessage } from "../api/supportApi";
import toast from "react-hot-toast";
import {
  Send,
  X,
  Loader2,
  Check,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Clock,
  User,
  Shield,
  ChevronLeft,
} from "lucide-react";

const SupportChat = ({ ticket, onClose }) => {
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // State
  const [ticketData, setTicketData] = useState(ticket);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Fetch ticket with messages
  useEffect(() => {
    fetchTicket();
  }, [ticket._id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticketData?.messages]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const data = await getSingleTicket(ticket._id);
      setTicketData(data);
    } catch (err) {
      console.error("Error fetching ticket:", err);
      toast.error("Failed to load ticket");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    try {
      setSending(true);
      const result = await sendMessage(ticket._id, text);
      setTicketData(result.ticket);
      setInput("");
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Group messages by date
  const groupedMessages = [];
  if (ticketData?.messages) {
    let currentDate = null;
    ticketData.messages.forEach((msg) => {
      const msgDate = new Date(msg.timestamp).toDateString();
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groupedMessages.push({ type: "date", date: msg.timestamp });
      }
      groupedMessages.push({ type: "message", ...msg });
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-1">
              {ticketData?.message}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span
                className={`px-2 py-0.5 rounded-full font-medium ${
                  ticketData?.status === "open"
                    ? "bg-yellow-100 text-yellow-800"
                    : ticketData?.status === "in-progress"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {ticketData?.status === "in-progress"
                  ? "In Progress"
                  : ticketData?.status?.charAt(0).toUpperCase() +
                    ticketData?.status?.slice(1)}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full font-medium ${
                  ticketData?.priority === "urgent"
                    ? "bg-red-100 text-red-800"
                    : ticketData?.priority === "high"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {ticketData?.priority}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : (
          groupedMessages.map((item, idx) => {
            if (item.type === "date") {
              return (
                <div key={idx} className="flex justify-center">
                  <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                    {formatDate(item.date)}
                  </span>
                </div>
              );
            }

            const isUser = item.sender === "user" || item.sender === "lawyer";
            const isAdmin = item.sender === "admin";

            return (
              <div
                key={idx}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-2 max-w-[80%] ${
                    isUser ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      isAdmin ? "bg-indigo-100" : "bg-gray-900"
                    }`}
                  >
                    {isAdmin ? (
                      <Shield className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div>
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isUser
                          ? "bg-gray-900 text-white rounded-br-md"
                          : "bg-indigo-50 text-gray-900 rounded-bl-md border border-indigo-100"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{item.text}</p>
                    </div>
                    <div
                      className={`flex items-center gap-1 mt-1 ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span
                        className={`text-xs ${
                          isUser ? "text-gray-400" : "text-gray-400"
                        }`}
                      >
                        {formatTime(item.timestamp)}
                      </span>
                      {isAdmin && item.isRead && (
                        <Check className="w-3 h-3 text-blue-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        {ticketData?.status === "resolved" ? (
          <div className="text-center py-3 text-gray-500 bg-gray-50 rounded-lg">
            This ticket has been resolved. You can still send a message to
            reopen it.
          </div>
        ) : (
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 100) + "px";
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
              rows={1}
              disabled={sending}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportChat;
