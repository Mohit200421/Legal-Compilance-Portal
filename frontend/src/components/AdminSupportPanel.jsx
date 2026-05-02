import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getAllTickets,
  getTicketStats,
  updateTicketStatus,
  sendMessage,
  getSingleTicket,
} from "../api/supportApi";
import toast from "react-hot-toast";
import {
  Send,
  X,
  Loader2,
  Check,
  Clock,
  AlertTriangle,
  Filter,
  ChevronLeft,
  Shield,
  User,
  MessageCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";

const AdminSupportPanel = () => {
  const { user } = useContext(AuthContext);

  // State
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const [loadingChat, setLoadingChat] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  // Send message
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");

  // Fetch tickets and stats
  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, [statusFilter, priorityFilter]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (statusFilter) filters.status = statusFilter;
      if (priorityFilter) filters.priority = priorityFilter;

      const data = await getAllTickets(filters);
      setTickets(data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getTicketStats();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // Select ticket
  const handleSelectTicket = async (ticket) => {
    try {
      setLoadingChat(true);
      setSelectedTicket(ticket);
      const data = await getSingleTicket(ticket._id);
      setTicketData(data);
    } catch (err) {
      toast.error("Failed to load ticket");
    } finally {
      setLoadingChat(false);
    }
  };

  // Send message
  const handleSend = async () => {
    const text = input.trim();
    if (!text || !selectedTicket) return;

    try {
      setSending(true);
      const result = await sendMessage(selectedTicket._id, text);
      setTicketData(result.ticket);
      setInput("");
      fetchTickets();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // Update status
  const handleUpdateStatus = async (newStatus) => {
    if (!selectedTicket) return;

    try {
      const result = await updateTicketStatus(selectedTicket._id, {
        status: newStatus,
      });
      setTicketData(result.ticket);
      toast.success("Status updated");
      fetchTickets();
      fetchStats();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // Status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Priority badge
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  // Close chat
  const handleCloseChat = () => {
    setSelectedTicket(null);
    setTicketData(null);
    fetchTickets();
    fetchStats();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
          <div className="text-2xl font-bold text-gray-900">
            {stats.total || 0}
          </div>
          <div className="text-xs text-gray-500">Total Tickets</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
          <div className="text-2xl font-bold text-yellow-600">
            {stats.open || 0}
          </div>
          <div className="text-xs text-gray-500">Open</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
          <div className="text-2xl font-bold text-blue-600">
            {stats.inProgress || 0}
          </div>
          <div className="text-xs text-gray-500">In Progress</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
          <div className="text-2xl font-bold text-green-600">
            {stats.resolved || 0}
          </div>
          <div className="text-xs text-gray-500">Resolved</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-3">
          <div className="text-2xl font-bold text-red-600">
            {stats.urgent || 0}
          </div>
          <div className="text-xs text-gray-500">Urgent</div>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Ticket List */}
        <div className="w-1/3 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Filters */}
          <div className="p-3 border-b border-gray-200">
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Tickets */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
              </div>
            ) : tickets.length === 0 ? (
              <div className="p-8 text-center">
                <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">No tickets found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {tickets.map((ticket) => (
                  <button
                    key={ticket._id}
                    onClick={() => handleSelectTicket(ticket)}
                    className={`w-full p-3 text-left hover:bg-gray-50 transition-colors ${
                      selectedTicket?._id === ticket._id ? "bg-gray-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm line-clamp-1">
                        {ticket.userId?.name}
                      </span>
                      {ticket.priority === "urgent" && (
                        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {ticket.message}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                          ticket.status
                        )}`}
                      >
                        {ticket.status === "in-progress"
                          ? "In Progress"
                          : ticket.status?.charAt(0).toUpperCase() +
                            ticket.status?.slice(1)}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityBadge(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {formatDate(ticket.createdAt)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
          {selectedTicket ? (
            <>
              {/* Header */}
              <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCloseChat}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      {ticketData?.userId?.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {ticketData?.userId?.email} • {ticketData?.role}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {ticketData?.status !== "resolved" && (
                    <button
                      onClick={() => handleUpdateStatus("resolved")}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200"
                    >
                      <CheckCircle className="w-3 h-3 inline mr-1" />
                      Resolve
                    </button>
                  )}
                </div>
              </div>

              {/* Status Update */}
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                <span className="text-xs text-gray-500">Update Status:</span>
                <button
                  onClick={() => handleUpdateStatus("open")}
                  className={`px-2 py-1 rounded text-xs ${
                    ticketData?.status === "open"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Open
                </button>
                <button
                  onClick={() => handleUpdateStatus("in-progress")}
                  className={`px-2 py-1 rounded text-xs ${
                    ticketData?.status === "in-progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => handleUpdateStatus("resolved")}
                  className={`px-2 py-1 rounded text-xs ${
                    ticketData?.status === "resolved"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Resolved
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {loadingChat ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                  </div>
                ) : (
                  ticketData?.messages?.map((msg, idx) => {
                    const isAdmin = msg.sender === "admin";
                    return (
                      <div
                        key={idx}
                        className={`flex ${
                          isAdmin ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex gap-2 max-w-[80%] ${
                            isAdmin ? "flex-row-reverse" : "flex-row"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isAdmin ? "bg-indigo-100" : "bg-gray-900"
                            }`}
                          >
                            {isAdmin ? (
                              <Shield className="w-4 h-4 text-indigo-600" />
                            ) : (
                              <User className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div>
                            <div
                              className={`px-3 py-2 rounded-2xl ${
                                isAdmin
                                  ? "bg-indigo-600 text-white rounded-br-md"
                                  : "bg-gray-100 text-gray-900 rounded-bl-md"
                              }`}
                            >
                              <p className="text-sm">{msg.text}</p>
                            </div>
                            <div
                              className={`text-xs text-gray-400 mt-1 ${
                                isAdmin ? "text-right" : "text-left"
                              }`}
                            >
                              {formatDate(msg.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input */}
              <div className="p-3 border-t border-gray-200">
                <div className="flex gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Reply to user..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg resize-none text-sm"
                    rows={1}
                    disabled={sending}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || sending}
                    className="px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">Select a ticket to view chat</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSupportPanel;
