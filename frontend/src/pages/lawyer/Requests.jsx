import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import socket from "../../api/socket";

import {
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Calendar,
  FileText,
  AlertCircle,
  Search,
  Filter,
  X,
  Send,
  RefreshCw,
  Users,
  Phone,
  Video,
  Sparkles,
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

export default function Requests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Glassmorphism card style
  const glassCardClass = "bg-white/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(30,41,59,0.05)] border border-white/50";
  const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none";

  const handleInputFocus = (e) => {
    e.currentTarget.style.borderColor = colors.secondary;
    e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.secondary}20`;
  };

  const handleInputBlur = (e) => {
    e.currentTarget.style.borderColor = colors.outlineVariant;
    e.currentTarget.style.boxShadow = "none";
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await API.get("/lawyer/requests");
      setRequests(res.data);
      setFilteredRequests(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handlePaymentVerified = (data) => {
      console.log("💰 paymentVerified:", data);
      toast.success(`Payment verified from ${data.userName}! 💬`);
      fetchRequests();
    };

    socket.on("paymentVerified", handlePaymentVerified);

    return () => {
      socket.off("paymentVerified", handlePaymentVerified);
    };
  }, []);

  useEffect(() => {
    let result = [...requests];

    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (searchTerm) {
      result = result.filter(
        (r) =>
          r.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

    setFilteredRequests(result);
  }, [requests, searchTerm, statusFilter, sortBy]);

  const updateStatus = async (id, status) => {
    try {
      const res = await API.put(`/lawyer/requests/${id}/status`, { status });
      toast.success(res.data.msg || `Request ${status}`);
      fetchRequests();
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  const handleOpenChat = (user) => {
    if (!user?._id) return toast.error("User not found");
    navigate(`/chat/${user._id}`, {
      state: { receiverName: user.name },
    });
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "Accepted":
        return { icon: CheckCircle, text: "Accepted", bg: "#4caf5015", textColor: "#4caf50" };
      case "Rejected":
        return { icon: XCircle, text: "Rejected", bg: `${colors.error}15`, textColor: colors.error };
      default:
        return { icon: Clock, text: "Pending", bg: `${colors.tertiary}15`, textColor: colors.tertiary };
    }
  };

  const getStatusCounts = () => ({
    total: requests.length,
    pending: requests.filter(r => r.status === "Pending").length,
    accepted: requests.filter(r => r.status === "Accepted").length,
    rejected: requests.filter(r => r.status === "Rejected").length
  });

  const counts = getStatusCounts();

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: colors.surface }}>
      {/* Header Section */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div 
              className="inline-flex items-center px-3 py-1.5 rounded-lg mb-3"
              style={{ backgroundColor: `${colors.secondary}10`, border: `1px solid ${colors.secondary}20` }}
            >
              <Users className="h-4 w-4 mr-2" style={{ color: colors.secondary }} />
              <span className="text-xs font-semibold tracking-wider" style={{ color: colors.secondary }}>
                CLIENT REQUESTS
              </span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-[1.2] tracking-[-0.02em]" style={{ color: colors.onSurface }}>
              Client Requests
            </h1>
            <p className="text-xs md:text-sm mt-1" style={{ color: colors.onSurfaceVariant }}>
              Manage and respond to client consultation requests
            </p>
          </div>
          
          <button
            onClick={fetchRequests}
            className={`flex items-center space-x-2 px-4 py-2.5 ${glassCardClass} transition-all duration-200 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)]`}
          >
            <RefreshCw className="h-4 w-4" style={{ color: colors.onSurfaceVariant }} />
            <span className="text-sm font-medium" style={{ color: colors.onSurfaceVariant }}>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards - Glass Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className={`${glassCardClass} p-4 md:p-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)]`}>
          <p className="text-xs mb-1" style={{ color: colors.onSurfaceVariant }}>Total</p>
          <p className="text-xl md:text-2xl font-bold" style={{ color: colors.onSurface }}>{counts.total}</p>
          <p className="text-xs mt-1" style={{ color: colors.onSurfaceVariant }}>All requests</p>
        </div>
        <div className={`${glassCardClass} p-4 md:p-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)]`}>
          <p className="text-xs mb-1" style={{ color: colors.onSurfaceVariant }}>Pending</p>
          <p className="text-xl md:text-2xl font-bold" style={{ color: colors.tertiary }}>{counts.pending}</p>
          <p className="text-xs mt-1" style={{ color: colors.onSurfaceVariant }}>Awaiting response</p>
        </div>
        <div className={`${glassCardClass} p-4 md:p-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)]`}>
          <p className="text-xs mb-1" style={{ color: colors.onSurfaceVariant }}>Accepted</p>
          <p className="text-xl md:text-2xl font-bold" style={{ color: "#4caf50" }}>{counts.accepted}</p>
          <p className="text-xs mt-1" style={{ color: colors.onSurfaceVariant }}>Ready to chat</p>
        </div>
        <div className={`${glassCardClass} p-4 md:p-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)]`}>
          <p className="text-xs mb-1" style={{ color: colors.onSurfaceVariant }}>Rejected</p>
          <p className="text-xl md:text-2xl font-bold" style={{ color: colors.error }}>{counts.rejected}</p>
          <p className="text-xs mt-1" style={{ color: colors.onSurfaceVariant }}>Declined</p>
        </div>
      </div>

      {/* Search and Filter Bar - Glass Card */}
      <div className={`${glassCardClass} mb-6 p-4`}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: colors.outline }} />
              <input
                type="text"
                placeholder="Search by subject, message, or client name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={inputClass}
                style={{
                  backgroundColor: colors.surfaceContainerLowest,
                  border: `1px solid ${colors.outlineVariant}`,
                  color: colors.onSurface,
                  paddingLeft: "2.25rem"
                }}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4" style={{ color: colors.outline }} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden p-2.5 rounded-xl"
              style={{ backgroundColor: colors.surfaceContainerHighest }}
            >
              <Filter className="h-5 w-5" style={{ color: colors.onSurfaceVariant }} />
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm transition-all duration-200 focus:outline-none"
              style={{
                backgroundColor: colors.surfaceContainerLowest,
                border: `1px solid ${colors.outlineVariant}`,
                color: colors.onSurface,
              }}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm transition-all duration-200 focus:outline-none"
              style={{
                backgroundColor: colors.surfaceContainerLowest,
                border: `1px solid ${colors.outlineVariant}`,
                color: colors.onSurface,
              }}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <span className="text-sm ml-auto" style={{ color: colors.onSurfaceVariant }}>
              Showing <span className="font-medium" style={{ color: colors.onSurface }}>{filteredRequests.length}</span> of {requests.length} requests
            </span>
          </div>

          {showFilters && (
            <div className="md:hidden space-y-3 pt-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: colors.surfaceContainerLowest,
                  border: `1px solid ${colors.outlineVariant}`,
                  color: colors.onSurface,
                }}
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: colors.surfaceContainerLowest,
                  border: `1px solid ${colors.outlineVariant}`,
                  color: colors.onSurface,
                }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className={`${glassCardClass} p-12 text-center`}>
          <div className="inline-flex flex-col items-center space-y-3">
            <div className="w-10 h-10 border-3 rounded-full animate-spin" style={{ borderColor: colors.secondary, borderTopColor: "transparent" }}></div>
            <p style={{ color: colors.onSurfaceVariant }}>Loading requests...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredRequests.length === 0 && (
        <div className={`${glassCardClass} p-12 text-center`}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: colors.surfaceContainerHighest }}>
            <Users className="h-8 w-8" style={{ color: colors.onSurfaceVariant }} />
          </div>
          <h3 className="text-lg font-medium mb-2" style={{ color: colors.onSurface }}>No requests found</h3>
          <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: colors.onSurfaceVariant }}>
            {searchTerm || statusFilter !== "all" 
              ? "Try adjusting your search or filters" 
              : "No client requests yet. They will appear here when clients contact you."}
          </p>
        </div>
      )}

      {/* Requests List */}
      {!loading && filteredRequests.length > 0 && (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const statusBadge = getStatusBadge(req.status);
            const StatusIcon = statusBadge.icon;
            
            return (
              <div
                key={req._id}
                className={`${glassCardClass} overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)]`}
              >
                {/* Request Header */}
                <div className="p-5" style={{ borderBottom: `1px solid ${colors.outlineVariant}` }}>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-2 mb-2">
                        <span 
                          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full"
                          style={{ backgroundColor: statusBadge.bg, color: statusBadge.textColor }}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusBadge.text}
                        </span>
                        <span className="text-xs" style={{ color: colors.onSurfaceVariant }}>
                          ID: {req._id.slice(-8)}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold mb-2" style={{ color: colors.onSurface }}>
                        {req.subject}
                      </h3>
                      
                      <p className="text-sm mb-3 leading-relaxed" style={{ color: colors.onSurfaceVariant, lineHeight: "1.6" }}>
                        {req.message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div className="p-5" style={{ backgroundColor: colors.surfaceContainerLow }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Client Info */}
                    <div className={`${glassCardClass} p-4`}>
                      <p className="text-xs font-semibold mb-3 flex items-center" style={{ color: colors.onSurfaceVariant }}>
                        <User className="h-4 w-4 mr-2" style={{ color: colors.secondary }} />
                        Client Details
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <User className="h-4 w-4 mr-2" style={{ color: colors.outline }} />
                          <span className="font-medium" style={{ color: colors.onSurface }}>
                            {req.userId?.name || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2" style={{ color: colors.outline }} />
                          <span style={{ color: colors.onSurfaceVariant }}>
                            {req.userId?.email || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Request Metadata */}
                    <div className={`${glassCardClass} p-4`}>
                      <p className="text-xs font-semibold mb-3 flex items-center" style={{ color: colors.onSurfaceVariant }}>
                        <Clock className="h-4 w-4 mr-2" style={{ color: colors.secondary }} />
                        Request Info
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2" style={{ color: colors.outline }} />
                          <span style={{ color: colors.onSurfaceVariant }}>
                            {new Date(req.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {req.status === "Accepted" && (
                      <button
                        onClick={() => handleOpenChat(req.userId)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md"
                        style={{ backgroundColor: colors.secondary, color: "white" }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondaryContainer}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Chat with Client</span>
                      </button>
                    )}

                    {req.status !== "Accepted" && (
                      <button
                        onClick={() => updateStatus(req._id, "Accepted")}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md"
                        style={{ backgroundColor: "#4caf50", color: "white" }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#45a049"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#4caf50"}
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Accept Request</span>
                      </button>
                    )}

                    {req.status !== "Rejected" && req.status !== "Accepted" && (
                      <button
                        onClick={() => updateStatus(req._id, "Rejected")}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md"
                        style={{ backgroundColor: colors.error, color: "white" }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.errorContainer}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.error}
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Reject Request</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}