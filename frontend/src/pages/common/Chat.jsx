import { useEffect, useState, useRef } from "react";
import API from "../../api/axios";
import { socket } from "../../api/socket";
import toast from "react-hot-toast";
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  CheckCheck,
  Clock,
  User,
  Shield,
  X,
  MessageSquare,
} from "lucide-react";

// Lex-Modernism Color System
const colors = {
  primary: "#091426",
  primaryContainer: "#1e293b",
  onPrimaryContainer: "#8590a6",
  secondary: "#4648d4",
  secondaryContainer: "#6063ee",
  onSecondaryContainer: "#fffbff",
  surface: "#fbf8fa",
  surfaceDim: "#dcd9db",
  surfaceBright: "#fbf8fa",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f5f3f4",
  surfaceContainer: "#f0edef",
  surfaceContainerHigh: "#eae7e9",
  surfaceContainerHighest: "#e4e2e3",
  onSurface: "#1b1b1d",
  onSurfaceVariant: "#45474c",
  outline: "#75777d",
  outlineVariant: "#c5c6cd",
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
  onError: "#ffffff",
  onErrorContainer: "#93000a",
  tertiary: "#1e1200",
  tertiaryContainer: "#35260c",
  onTertiaryContainer: "#a38c6a",
};

export default function Chat({ receiverId, receiverName, onClose }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const senderId = user?.id;
  const senderRole = user?.role;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const typingTimer = useRef(null);
  const chatContainerRef = useRef(null);

  // Glassmorphism styles
  const glassCardClass = "bg-white/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(30,41,59,0.05)] border border-white/50";
  const inputClass = "w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none";

  const handleInputFocus = (e) => {
    e.currentTarget.style.borderColor = colors.secondary;
    e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.secondary}20`;
  };

  const handleInputBlur = (e) => {
    e.currentTarget.style.borderColor = colors.outlineVariant;
    e.currentTarget.style.boxShadow = "none";
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (senderId) {
      socket.emit("joinRoom", senderId);
    }
  }, [senderId]);

  useEffect(() => {
    const fetchConversation = async () => {
      if (!receiverId) return;
      
      try {
        setLoading(true);
        const res = await API.get(`/messages/conversation/${receiverId}`);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversation();
  }, [receiverId]);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("typing", ({ senderRole }) => {
      setIsTyping(true);
    });

    socket.on("stopTyping", ({ senderRole }) => {
      setIsTyping(false);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, []);

  const handleTyping = (e) => {
    setMessage(e.target.value);

    socket.emit("typing", {
      receiverId,
      senderRole,
    });

    clearTimeout(typingTimer.current);

    typingTimer.current = setTimeout(() => {
      socket.emit("stopTyping", {
        receiverId,
        senderRole,
      });
    }, 1000);
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const msgData = { 
      senderId, 
      receiverId, 
      message: message.trim(),
      timestamp: new Date().toISOString(),
      status: "sent"
    };

    try {
      setSending(true);

      socket.emit("sendMessage", msgData);

      await API.post("/messages/send", { receiverId, message: message.trim() });

      socket.emit("stopTyping", {
        receiverId,
        senderRole,
      });

      setMessages((prev) => [...prev, { ...msgData, status: "delivered" }]);
      setMessage("");
    } catch (err) {
      console.log(err);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    const today = new Date();
    const date = new Date(timestamp);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.timestamp || message.createdAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${glassCardClass} w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden`} style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
        {/* Chat Header */}
        <div className="flex-shrink-0 p-4" style={{ borderBottom: `1px solid ${colors.outlineVariant}`, backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.secondary}15` }}>
                <User className="h-5 w-5" style={{ color: colors.secondary }} />
              </div>
              <div>
                <h2 className="font-bold" style={{ color: colors.onSurface }}>
                  {receiverName || "Client"}
                </h2>
                <div className="flex items-center text-xs" style={{ color: colors.onSurfaceVariant }}>
                  <span className="flex items-center">
                    <Shield className="h-3 w-3 mr-1" style={{ color: colors.secondary }} />
                    End-to-end encrypted
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg transition-all duration-200" style={{ border: `1px solid ${colors.outlineVariant}`, color: colors.onSurfaceVariant }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                <Phone className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-lg transition-all duration-200" style={{ border: `1px solid ${colors.outlineVariant}`, color: colors.onSurfaceVariant }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                <Video className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-lg transition-all duration-200" style={{ border: `1px solid ${colors.outlineVariant}`, color: colors.onSurfaceVariant }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                <Info className="h-4 w-4" />
              </button>
              {onClose && (
                <button 
                  onClick={onClose}
                  className="p-2 rounded-lg transition-all duration-200" style={{ border: `1px solid ${colors.outlineVariant}`, color: colors.onSurfaceVariant }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4"
          style={{ backgroundColor: colors.surface }}
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: colors.secondary, borderTopColor: "transparent" }}></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: colors.surfaceContainerHighest }}>
                <MessageSquare className="h-8 w-8" style={{ color: colors.onSurfaceVariant }} />
              </div>
              <p style={{ color: colors.onSurfaceVariant }}>No messages yet</p>
              <p className="text-xs mt-1" style={{ color: colors.outline }}>
                Send a message to start the conversation
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date}>
                  <div className="flex justify-center my-4">
                    <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: colors.surfaceContainerHighest, color: colors.onSurfaceVariant }}>
                      {date}
                    </span>
                  </div>
                  
                  {dateMessages.map((msg, index) => {
                    const isMe = msg.senderId === senderId;
                    
                    return (
                      <div
                        key={index}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${isMe ? 'order-2' : 'order-1'}`}>
                          <div className="flex items-end space-x-2">
                            {!isMe && (
                              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colors.secondary}15` }}>
                                <User className="h-4 w-4" style={{ color: colors.secondary }} />
                              </div>
                            )}
                            
                            <div className={`rounded-xl p-3 ${isMe ? 'text-white' : ''}`} style={{
                              backgroundColor: isMe ? colors.secondary : colors.surfaceContainerHighest,
                              color: isMe ? "white" : colors.onSurface
                            }}>
                              <p className="text-sm leading-relaxed">
                                {msg.message}
                              </p>
                              <div className={`flex items-center justify-end space-x-1 mt-1 text-xs ${isMe ? 'text-white/70' : ''}`} style={{ color: isMe ? "rgba(255,255,255,0.7)" : colors.onSurfaceVariant }}>
                                <span>
                                  {formatTime(msg.timestamp || msg.createdAt)}
                                </span>
                                {isMe && (
                                  <CheckCheck className="h-3 w-3" />
                                )}
                              </div>
                            </div>

                            {isMe && (
                              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.secondary }}>
                                <Shield className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.secondary}15` }}>
                    <User className="h-4 w-4" style={{ color: colors.secondary }} />
                  </div>
                  <div className="rounded-xl px-4 py-2" style={{ backgroundColor: colors.surfaceContainerHighest }}>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: colors.secondary, animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: colors.secondary, animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: colors.secondary, animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 p-4" style={{ borderTop: `1px solid ${colors.outlineVariant}`, backgroundColor: "rgba(255, 255, 255, 0.95)" }}>
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={message}
                onChange={handleTyping}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                rows={2}
                className={inputClass}
                style={{
                  backgroundColor: colors.surfaceContainerLowest,
                  border: `1px solid ${colors.outlineVariant}`,
                  color: colors.onSurface,
                }}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-lg transition-all duration-200" style={{ border: `1px solid ${colors.outlineVariant}`, color: colors.onSurfaceVariant }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-lg transition-all duration-200" style={{ border: `1px solid ${colors.outlineVariant}`, color: colors.onSurfaceVariant }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                    <Smile className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={handleSend}
                  disabled={!message.trim() || sending}
                  className="px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-md"
                  style={{ 
                    backgroundColor: colors.secondary,
                    color: "white"
                  }}
                  onMouseEnter={(e) => {
                    if (!sending && message.trim()) {
                      e.currentTarget.style.backgroundColor = colors.secondaryContainer;
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!sending && message.trim()) {
                      e.currentTarget.style.backgroundColor = colors.secondary;
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {sending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce {
          animation: bounce 0.8s infinite;
        }
      `}</style>
    </div>
  );
}