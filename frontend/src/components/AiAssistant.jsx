// AiAssistant.jsx - Updated with Lex-Modernism Design System
import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Send,
  Bot,
  User,
  Loader2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Paperclip,
  Trash2,
  Download,
  X,
  Check,
  Sparkles,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import aiApi from "../api/ai";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

// Lex-Modernism Color System
const colors = {
  primary: "#091426",
  primaryContainer: "#1e293b",
  onPrimaryContainer: "#8590a6",
  secondary: "#4648d4",
  secondaryContainer: "#6063ee",
  onSecondaryContainer: "#fffbff",
  surface: "#fbf8fa",
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

const AiAssistant = ({ documentText = "" }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [feedbackGiven, setFeedbackGiven] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const { user } = useContext(AuthContext);

  // Legal topics for quick selection - Glassmorphism style
  const legalTopics = [
    { id: "rights", name: "Fundamental Rights", icon: "🛡️", description: "Know your constitutional rights" },
    { id: "ipc", name: "IPC Sections", icon: "⚖️", description: "Indian Penal Code explained" },
    { id: "civil", name: "Civil Law", icon: "📄", description: "Property, contracts & more" },
    { id: "property", name: "Property Law", icon: "🏠", description: "Real estate & transfers" },
    { id: "family", name: "Family Law", icon: "👨‍👩‍👧", description: "Marriage, divorce & custody" },
    { id: "criminal", name: "Criminal Law", icon: "🚔", description: "Crimes & procedures" },
    { id: "constitution", name: "Constitution", icon: "📜", description: "Fundamental framework" },
    { id: "consumer", name: "Consumer Rights", icon: "🛒", description: "Protection & redressal" },
  ];

  useEffect(() => {
    if (!user || messages.length > 0) return;
    const welcome = `Hello ${user.name || "there"}! 👋\n\nI'm your AI legal assistant. Select a topic below to get started, or type your question directly.`;
    setMessages([{ type: "ai", text: welcome, timestamp: Date.now() }]);
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleTopicSelect = async (topic) => {
    const query = `Tell me about ${topic.name}`;
    setInput("");
    
    setMessages((prev) => [...prev, { type: "user", text: query, timestamp: Date.now() }]);
    
    setLoading(true);
    try {
      const res = await aiApi.ask(query, documentText);
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: res.data.answer, timestamp: Date.now() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: `**${topic.name}**\n\nI'm having trouble fetching information. Please try again.`,
          isError: true,
          timestamp: Date.now(),
        },
      ]);
      toast.error("Failed to get response");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles((prev) => [...prev, ...files.map((f) => f.name)]);
    toast.success(`${files.length} file(s) attached`);
  };

  const removeFile = (name) =>
    setUploadedFiles((prev) => prev.filter((f) => f !== name));

  const clearChat = () => {
    if (messages.length > 1) {
      setMessages([messages[0]]);
      toast.success("Chat cleared");
    }
  };

  const exportChat = () => {
    const content = messages
      .map((m) => `[${new Date(m.timestamp).toLocaleString()}] ${m.type.toUpperCase()}: ${m.text}`)
      .join("\n\n---\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Chat exported");
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { type: "user", text, timestamp: Date.now() }]);
    setInput("");
    
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    setLoading(true);
    try {
      const res = await aiApi.ask(text, documentText);
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: res.data.answer, timestamp: Date.now() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: "Sorry, I'm having trouble. Please try again.",
          isError: true,
          timestamp: Date.now(),
        },
      ]);
      toast.error("Failed to get response");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const giveFeedback = (idx, type) => {
    setFeedbackGiven((prev) => ({ ...prev, [idx]: type }));
    toast.success(type === "helpful" ? "Thanks for your feedback!" : "Feedback noted");
  };

  const copyText = async (text, idx) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatTime = (ts) =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const showTopicSelector = messages.filter(m => m.type === "user").length === 0;

  // Glassmorphism card style
  const glassCardClass = "bg-white/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(30,41,59,0.05)] border border-white/50";

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: colors.surface }}>
      {/* Header with Actions - Glassmorphism */}
      <div 
        className="px-4 py-3 flex items-center justify-between flex-shrink-0"
        style={{ 
          borderBottom: `1px solid ${colors.outlineVariant}`,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(8px)"
        }}
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${colors.secondary}, ${colors.secondaryContainer})` }}
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold" style={{ color: colors.onSurface }}>Legal Assistant</span>
            <span className="text-xs" style={{ color: colors.outline }}>•</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#4caf50" }} />
              <span className="text-xs" style={{ color: colors.onSurfaceVariant }}>Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={exportChat}
            className="p-1.5 rounded-lg transition-all duration-200"
            style={{ color: colors.onSurfaceVariant }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest;
              e.currentTarget.style.color = colors.onSurface;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = colors.onSurfaceVariant;
            }}
            title="Export chat"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={clearChat}
            className="p-1.5 rounded-lg transition-all duration-200"
            style={{ color: colors.onSurfaceVariant }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.errorContainer;
              e.currentTarget.style.color = colors.onErrorContainer;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = colors.onSurfaceVariant;
            }}
            title="Clear chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ backgroundColor: colors.surface }}>
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-2 max-w-[85%] ${msg.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div 
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                    msg.type === "user" 
                      ? "" 
                      : ""
                  }`}
                  style={{
                    backgroundColor: msg.type === "user" ? colors.primary : colors.surfaceContainerHighest
                  }}
                >
                  {msg.type === "user" ? (
                    <User className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Bot className="w-3.5 h-3.5" style={{ color: colors.onSurfaceVariant }} />
                  )}
                </div>
                <div>
                  <div 
                    className={`px-3 py-2 rounded-xl ${
                      msg.type === "user"
                        ? ""
                        : msg.isError
                        ? ""
                        : ""
                    }`}
                    style={{
                      backgroundColor: msg.type === "user" 
                        ? colors.secondary 
                        : msg.isError 
                          ? colors.errorContainer 
                          : colors.surfaceContainerHighest,
                      color: msg.type === "user" 
                        ? "white" 
                        : msg.isError 
                          ? colors.onErrorContainer 
                          : colors.onSurface
                    }}
                  >
                    <div className="text-xs leading-relaxed prose prose-sm max-w-none">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                    <div 
                      className={`text-[10px] mt-1 ${
                        msg.type === "user" ? "text-white/60" : ""
                      }`}
                      style={msg.type !== "user" ? { color: colors.onSurfaceVariant } : {}}
                    >
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                  {msg.type === "ai" && !msg.isError && (
                    <div className="flex gap-1 mt-1 ml-1">
                      <button
                        onClick={() => copyText(msg.text, idx)}
                        className="p-0.5 rounded transition-colors"
                        style={{ color: colors.onSurfaceVariant }}
                        onMouseEnter={(e) => e.currentTarget.style.color = colors.onSurface}
                        onMouseLeave={(e) => e.currentTarget.style.color = colors.onSurfaceVariant}
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-3 h-3" style={{ color: "#4caf50" }} />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                      <button
                        onClick={() => giveFeedback(idx, "helpful")}
                        className="p-0.5 rounded transition-colors"
                        style={{ color: feedbackGiven[idx] === "helpful" ? "#4caf50" : colors.onSurfaceVariant }}
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => giveFeedback(idx, "not helpful")}
                        className="p-0.5 rounded transition-colors"
                        style={{ color: feedbackGiven[idx] === "not helpful" ? colors.error : colors.onSurfaceVariant }}
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Topic Selector UI - Glassmorphism Cards */}
          {showTopicSelector && !loading && (
            <div className="flex justify-center mt-6">
              <div className="w-full max-w-2xl">
                <div className="text-center mb-4">
                  <p 
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    Select a legal topic to get started
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {legalTopics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicSelect(topic)}
                      className={`group p-3 text-left transition-all duration-300 ${glassCardClass} hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)]`}
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                    >
                      <div className="text-xl mb-1">{topic.icon}</div>
                      <div className="text-sm font-semibold mb-0.5" style={{ color: colors.onSurface }}>
                        {topic.name}
                      </div>
                      <div className="text-[10px]" style={{ color: colors.onSurfaceVariant }}>
                        {topic.description}
                      </div>
                      <ChevronRight 
                        className="w-3 h-3 mt-2 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" 
                        style={{ color: colors.secondary }}
                      />
                    </button>
                  ))}
                </div>
                
                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full" style={{ borderTop: `1px solid ${colors.outlineVariant}` }} />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span 
                      className="px-2"
                      style={{ backgroundColor: colors.surface, color: colors.onSurfaceVariant }}
                    >
                      OR
                    </span>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-xs" style={{ color: colors.onSurfaceVariant }}>
                    Type your question below
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-2">
                <div 
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.surfaceContainerHighest }}
                >
                  <Bot className="w-3.5 h-3.5" style={{ color: colors.onSurfaceVariant }} />
                </div>
                <div 
                  className="px-3 py-2 rounded-xl"
                  style={{ backgroundColor: colors.surfaceContainerHighest }}
                >
                  <div className="flex gap-1.5">
                    <span 
                      className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{ backgroundColor: colors.secondary, animationDelay: '0ms' }}
                    />
                    <span 
                      className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{ backgroundColor: colors.secondary, animationDelay: '150ms' }}
                    />
                    <span 
                      className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{ backgroundColor: colors.secondary, animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Glassmorphism */}
      <div 
        className="p-3 flex-shrink-0"
        style={{ 
          borderTop: `1px solid ${colors.outlineVariant}`,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(8px)"
        }}
      >
        {uploadedFiles.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {uploadedFiles.map((file, idx) => (
              <div 
                key={idx} 
                className="px-2 py-1 rounded-md text-xs flex items-center gap-1.5"
                style={{ 
                  backgroundColor: colors.surfaceContainerHighest,
                  border: `1px solid ${colors.outlineVariant}`
                }}
              >
                <Paperclip className="w-2.5 h-2.5" style={{ color: colors.onSurfaceVariant }} />
                <span style={{ color: colors.onSurfaceVariant }}>{file}</span>
                <button 
                  onClick={() => removeFile(file)} 
                  className="transition-colors"
                  style={{ color: colors.onSurfaceVariant }}
                  onMouseEnter={(e) => e.currentTarget.style.color = colors.error}
                  onMouseLeave={(e) => e.currentTarget.style.color = colors.onSurfaceVariant}
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 p-2 rounded-lg transition-all duration-200"
            style={{ color: colors.onSurfaceVariant }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest;
              e.currentTarget.style.color = colors.onSurface;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = colors.onSurfaceVariant;
            }}
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            multiple
          />
          
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 80) + "px";
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type your legal question..."
            className="flex-1 px-3 py-2 rounded-xl resize-none text-sm focus:outline-none transition-all"
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.outlineVariant}`,
              color: colors.onSurface,
              minHeight: "38px",
              maxHeight: "80px"
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.secondary;
              e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.secondary}20`;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = colors.outlineVariant;
              e.currentTarget.style.boxShadow = "none";
            }}
            disabled={loading}
            rows="1"
          />
          
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="flex-shrink-0 px-3 py-2 rounded-xl text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: colors.secondary }}
            onMouseEnter={(e) => {
              if (!(!input.trim() || loading)) {
                e.currentTarget.style.backgroundColor = colors.secondaryContainer;
              }
            }}
            onMouseLeave={(e) => {
              if (!(!input.trim() || loading)) {
                e.currentTarget.style.backgroundColor = colors.secondary;
              }
            }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
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
        .prose {
          color: inherit;
        }
        .prose p {
          margin: 0 0 0.5rem 0;
        }
        .prose p:last-child {
          margin-bottom: 0;
        }
        .prose ul, .prose ol {
          margin: 0.25rem 0 0.25rem 1rem;
        }
        .prose code {
          background: rgba(0, 0, 0, 0.05);
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
        }
        .prose pre {
          background: rgba(0, 0, 0, 0.05);
          padding: 0.5rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          font-size: 0.7rem;
        }
      `}</style>
    </div>
  );
};

export default AiAssistant;