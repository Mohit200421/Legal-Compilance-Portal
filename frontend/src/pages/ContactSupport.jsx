import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { createTicket, getMyTickets } from "../api/supportApi";
import toast from "react-hot-toast";
import {
  MessageCircle,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ChevronRight,
  Loader2,
  Zap,
  Sparkles,
} from "lucide-react";
import SupportChat from "../components/SupportChat";

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

// Category and priority options
const categories = [
  {
    value: "legal",
    label: "Legal Issue",
    description: "For legal advice and cases",
  },
  {
    value: "technical",
    label: "Technical Problem",
    description: "App issues, bugs",
  },
  {
    value: "billing",
    label: "Billing & Payments",
    description: "Payment related issues",
  },
  {
    value: "general",
    label: "General Inquiry",
    description: "Other questions",
  },
];

const priorities = [
  { value: "low", label: "Low", description: "Not urgent" },
  { value: "medium", label: "Medium", description: "Normal priority" },
  { value: "high", label: "High", description: "Urgent" },
  { value: "urgent", label: "Urgent", description: "Critical issue" },
];

const ContactSupport = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // State
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Form state
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("general");
  const [priority, setPriority] = useState("medium");

  // AI suggestion state
  const [showAISuggestion, setShowAISuggestion] = useState(true);

  // Glassmorphism card style
  const glassCardClass = "bg-white/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(30,41,59,0.05)] border border-white/50";

  // Input focus handlers
  const handleInputFocus = (e) => {
    e.currentTarget.style.borderColor = colors.secondary;
    e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.secondary}20`;
  };

  const handleInputBlur = (e) => {
    e.currentTarget.style.borderColor = colors.outlineVariant;
    e.currentTarget.style.boxShadow = "none";
  };

  // Fetch tickets
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await getMyTickets();
      setTickets(data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      setSubmitting(true);
      const result = await createTicket({ message, category, priority });
      toast.success("Ticket created successfully");
      setMessage("");
      setCategory("general");
      setPriority("medium");
      setShowNewTicket(false);
      setSelectedTicket(result.ticket);
      fetchTickets();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  };

  // Status badge config
  const getStatusConfig = (status) => {
    switch (status) {
      case "open":
        return { label: "Open", color: colors.tertiary, bg: `${colors.tertiary}15` };
      case "in-progress":
        return { label: "In Progress", color: colors.secondary, bg: `${colors.secondary}15` };
      case "resolved":
        return { label: "Resolved", color: "#4caf50", bg: "#4caf5015" };
      default:
        return { label: status, color: colors.onSurfaceVariant, bg: colors.surfaceContainerHighest };
    }
  };

  // Priority badge config
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "urgent":
        return { label: "Urgent", color: colors.error, bg: `${colors.error}15` };
      case "high":
        return { label: "High", color: colors.error, bg: `${colors.error}10` };
      case "medium":
        return { label: "Medium", color: colors.secondary, bg: `${colors.secondary}15` };
      case "low":
        return { label: "Low", color: colors.onSurfaceVariant, bg: colors.surfaceContainerHighest };
      default:
        return { label: priority, color: colors.onSurfaceVariant, bg: colors.surfaceContainerHighest };
    }
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Close chat panel
  const handleCloseChat = () => {
    setSelectedTicket(null);
    fetchTickets();
  };

  // AI suggestion handlers
  const handleAIHelp = () => {
    navigate("/ai-assistant");
  };

  const handleContactSupport = () => {
    setShowAISuggestion(false);
    setShowNewTicket(true);
  };

  // Main rendering
  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: colors.surface }}>
      {/* Background decorative elements */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 10% 20%, ${colors.secondary}05, transparent 60%),
                      radial-gradient(circle at 90% 80%, ${colors.secondary}03, transparent 50%)`
        }}
      />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-6">
          <div 
            className="inline-flex items-center px-3 py-1.5 rounded-lg mb-3"
            style={{ backgroundColor: `${colors.secondary}10`, border: `1px solid ${colors.secondary}20` }}
          >
            <MessageCircle className="h-4 w-4 mr-2" style={{ color: colors.secondary }} />
            <span className="text-xs font-semibold tracking-wider" style={{ color: colors.secondary }}>
              SUPPORT CENTER
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold leading-[1.2] tracking-[-0.02em]" style={{ color: colors.onSurface }}>
            Contact Support
          </h1>
          <p className="text-sm md:text-base mt-1" style={{ color: colors.onSurfaceVariant }}>
            Get help from our support team
          </p>
        </div>

        {/* AI Suggestion Banner - Glass Card */}
        {showAISuggestion && (
          <div className={`${glassCardClass} p-6 mb-6`} style={{ background: `linear-gradient(135deg, ${colors.secondary}, ${colors.secondaryContainer})` }}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-white">
                    Need immediate help?
                  </h3>
                  <p className="text-white/80 text-sm">
                    Get instant answers from our AI assistant
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAIHelp}
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
                  style={{ backgroundColor: "white", color: colors.secondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.surfaceBright;
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Try AI Help
                </button>
                <button
                  onClick={handleContactSupport}
                  className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Ticket List - Glass Card */}
          <div className="lg:col-span-1">
            <div className={`${glassCardClass} overflow-hidden`}>
              {/* Header */}
              <div className="p-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${colors.outlineVariant}` }}>
                <h2 className="font-semibold" style={{ color: colors.onSurface }}>My Tickets</h2>
                <button
                  onClick={() => setShowNewTicket(true)}
                  className="p-2 rounded-lg transition-all duration-200"
                  style={{ backgroundColor: colors.secondary, color: "white" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondaryContainer}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Ticket List */}
              <div className="max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" style={{ color: colors.secondary }} />
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: colors.surfaceContainerHighest }}>
                      <MessageCircle className="w-6 h-6" style={{ color: colors.onSurfaceVariant }} />
                    </div>
                    <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>No tickets yet</p>
                    <button
                      onClick={() => setShowNewTicket(true)}
                      className="mt-3 text-sm font-medium transition-colors"
                      style={{ color: colors.secondary }}
                      onMouseEnter={(e) => e.currentTarget.style.color = colors.secondaryContainer}
                      onMouseLeave={(e) => e.currentTarget.style.color = colors.secondary}
                    >
                      Create your first ticket
                    </button>
                  </div>
                ) : (
                  <div className="divide-y" style={{ borderColor: colors.outlineVariant }}>
                    {tickets.map((ticket) => {
                      const statusConfig = getStatusConfig(ticket.status);
                      const priorityConfig = getPriorityConfig(ticket.priority);
                      
                      return (
                        <button
                          key={ticket._id}
                          onClick={() => setSelectedTicket(ticket)}
                          className={`w-full p-4 text-left transition-colors duration-200 ${
                            selectedTicket?._id === ticket._id
                              ? "bg-surfaceContainerLow"
                              : "hover:bg-surfaceContainerLow"
                          }`}
                          style={{
                            backgroundColor: selectedTicket?._id === ticket._id ? colors.surfaceContainerLow : "transparent",
                          }}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="font-medium text-sm line-clamp-1" style={{ color: colors.onSurface }}>
                              {ticket.message.substring(0, 50)}...
                            </span>
                            <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: colors.outline }} />
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{ backgroundColor: statusConfig.bg, color: statusConfig.color }}
                            >
                              {statusConfig.label}
                            </span>
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{ backgroundColor: priorityConfig.bg, color: priorityConfig.color }}
                            >
                              {priorityConfig.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-2 text-xs" style={{ color: colors.onSurfaceVariant }}>
                            <Clock className="w-3 h-3" />
                            {formatDate(ticket.createdAt)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Chat or New Ticket Form */}
          <div className="lg:col-span-2">
            {selectedTicket ? (
              <SupportChat ticket={selectedTicket} onClose={handleCloseChat} />
            ) : showNewTicket ? (
              <div className={`${glassCardClass} p-6`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold" style={{ color: colors.onSurface }}>
                    Create New Ticket
                  </h2>
                  <button
                    onClick={() => setShowNewTicket(false)}
                    className="p-2 rounded-lg transition-all duration-200"
                    style={{ color: colors.onSurfaceVariant }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.surfaceContainerHighest}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Category */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                      Category
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => setCategory(cat.value)}
                          className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                            category === cat.value
                              ? "border-secondary bg-secondary/5"
                              : "border-outlineVariant hover:border-secondary/50"
                          }`}
                          style={{
                            borderColor: category === cat.value ? colors.secondary : colors.outlineVariant,
                            backgroundColor: category === cat.value ? `${colors.secondary}10` : "transparent",
                          }}
                        >
                          <div className="font-medium text-sm" style={{ color: colors.onSurface }}>
                            {cat.label}
                          </div>
                          <div className="text-xs" style={{ color: colors.onSurfaceVariant }}>
                            {cat.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                      Priority
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {priorities.map((pri) => (
                        <button
                          key={pri.value}
                          type="button"
                          onClick={() => setPriority(pri.value)}
                          className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                            priority === pri.value
                              ? "border-secondary bg-secondary/5"
                              : "border-outlineVariant hover:border-secondary/50"
                          }`}
                          style={{
                            borderColor: priority === pri.value ? colors.secondary : colors.outlineVariant,
                            backgroundColor: priority === pri.value ? `${colors.secondary}10` : "transparent",
                          }}
                        >
                          <div className="font-medium text-sm" style={{ color: colors.onSurface }}>
                            {pri.label}
                          </div>
                          <div className="text-xs" style={{ color: colors.onSurfaceVariant }}>
                            {pri.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: colors.onSurfaceVariant }}>
                      Message *
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your issue in detail..."
                      className="w-full px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none resize-none"
                      rows={5}
                      style={{
                        backgroundColor: colors.surfaceContainerLowest,
                        border: `1px solid ${colors.outlineVariant}`,
                        color: colors.onSurface,
                      }}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      required
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting || !message.trim()}
                    className="w-full py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
                    style={{ 
                      backgroundColor: colors.secondary,
                      color: "white",
                    }}
                    onMouseEnter={(e) => {
                      if (!submitting && message.trim()) {
                        e.currentTarget.style.backgroundColor = colors.secondaryContainer;
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!submitting && message.trim()) {
                        e.currentTarget.style.backgroundColor = colors.secondary;
                        e.currentTarget.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating Ticket...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Create Ticket
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className={`${glassCardClass} p-12 text-center`}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: colors.surfaceContainerHighest }}>
                  <MessageCircle className="w-8 h-8" style={{ color: colors.onSurfaceVariant }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: colors.onSurface }}>
                  How can we help you?
                </h3>
                <p className="mb-6 max-w-md mx-auto" style={{ color: colors.onSurfaceVariant }}>
                  Select an existing ticket from the list or create a new ticket
                  to get help from our support team.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setShowNewTicket(true)}
                    className="px-6 py-2.5 rounded-lg font-medium transition-all duration-200 inline-flex items-center gap-2 shadow-md"
                    style={{ backgroundColor: colors.secondary, color: "white" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.secondaryContainer;
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.secondary;
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Create New Ticket
                  </button>
                  
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;