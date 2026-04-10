import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";
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
  ChevronDown,
  X,
  Send,
  ArrowRight,
  RefreshCw,
  Users,
  CheckCheck,
  Briefcase,
  Phone,
  Video,
  Star,
  Award,
  TrendingUp,
  MoreVertical,
  Download,
  Upload,
  Share2,
  Copy,
  Bell,
  Shield,
  Gavel,
  Scale,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
} from "lucide-react";

export default function Requests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

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

  // 🔥 Real-time payment verified → show chat
  useEffect(() => {
    const handlePaymentVerified = (data) => {
      console.log("💰 paymentVerified:", data);
      toast.success(`Payment verified from ${data.userName}! Chat unlocked 💬`);
      fetchRequests(); // refresh list
    };

    socket.on("paymentVerified", handlePaymentVerified);
    return () => socket.off("paymentVerified", handlePaymentVerified);
  }, []);

  // Filter and search
  useEffect(() => {
    let result = [...requests];

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }

    // Apply search
    if (searchTerm) {
      result = result.filter(
        (r) =>
          r.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === "name") {
        return (a.userId?.name || "").localeCompare(b.userId?.name || "");
      }
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
      console.log(err);
      toast.error(err?.response?.data?.msg || "Failed to update");
    }
  };

  const handleOpenChat = (user) => {
    if (!user?._id) return toast.error("User not found");

    navigate(`/chat/${user._id}`, {
      state: {
        receiverName: user.name,
      },
    });
  };

  const viewRequestDetails = (request) => {
    setSelectedRequest(request);
    setShowDetails(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Accepted":
        return {
          icon: CheckCircle,
          text: "Accepted",
          bg: "bg-green-100",
          textColor: "text-green-700",
          border: "border-green-200",
          lightBg: "bg-green-50",
        };
      case "Rejected":
        return {
          icon: XCircle,
          text: "Rejected",
          bg: "bg-red-100",
          textColor: "text-red-700",
          border: "border-red-200",
          lightBg: "bg-red-50",
        };
      default:
        return {
          icon: Clock,
          text: "Pending",
          bg: "bg-yellow-100",
          textColor: "text-yellow-700",
          border: "border-yellow-200",
          lightBg: "bg-yellow-50",
        };
    }
  };

  const getStatusCounts = () => {
    return {
      total: requests.length,
      pending: requests.filter((r) => r.status === "Pending").length,
      accepted: requests.filter((r) => r.status === "Accepted").length,
      rejected: requests.filter((r) => r.status === "Rejected").length,
    };
  };

  const counts = getStatusCounts();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-lg mb-3">
              <Users className="h-4 w-4 text-purple-600 mr-2" />
              <span className="text-xs font-semibold text-purple-600 tracking-wider">
                CLIENT REQUESTS
              </span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
              Client Requests
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Manage and respond to consultation requests from clients
            </p>
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchRequests}
            className="p-3 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors self-start"
            title="Refresh"
          >
            <RefreshCw className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-white rounded-xl border-l-4 border-purple-600 border border-gray-200 p-4 md:p-5 hover:shadow-lg transition-shadow">
          <p className="text-xs text-gray-500 mb-1">Total</p>
          <p className="text-xl md:text-2xl font-bold text-gray-900">
            {counts.total}
          </p>
          <p className="text-xs text-gray-400 mt-1">All requests</p>
        </div>
        <div className="bg-white rounded-xl border-l-4 border-yellow-500 border border-gray-200 p-4 md:p-5 hover:shadow-lg transition-shadow">
          <p className="text-xs text-gray-500 mb-1">Pending</p>
          <p className="text-xl md:text-2xl font-bold text-yellow-600">
            {counts.pending}
          </p>
          <p className="text-xs text-gray-400 mt-1">Awaiting response</p>
        </div>
        <div className="bg-white rounded-xl border-l-4 border-green-500 border border-gray-200 p-4 md:p-5 hover:shadow-lg transition-shadow">
          <p className="text-xs text-gray-500 mb-1">Accepted</p>
          <p className="text-xl md:text-2xl font-bold text-green-600">
            {counts.accepted}
          </p>
          <p className="text-xs text-gray-400 mt-1">Can chat now</p>
        </div>
        <div className="bg-white rounded-xl border-l-4 border-red-500 border border-gray-200 p-4 md:p-5 hover:shadow-lg transition-shadow">
          <p className="text-xs text-gray-500 mb-1">Rejected</p>
          <p className="text-xl md:text-2xl font-bold text-red-600">
            {counts.rejected}
          </p>
          <p className="text-xs text-gray-400 mt-1">Not accepted</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6 p-4">
        <div className="flex flex-col gap-4">
          {/* Search and Filter Row */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by subject, message, or client name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden p-2.5 bg-gray-100 rounded-xl"
            >
              <Filter className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Filters - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Client Name</option>
            </select>

            <span className="text-sm text-gray-500 ml-auto">
              Showing{" "}
              <span className="font-medium text-gray-900">
                {filteredRequests.length}
              </span>{" "}
              of {requests.length} requests
            </span>
          </div>

          {/* Filters - Mobile */}
          {showFilters && (
            <div className="md:hidden space-y-3 pt-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Client Name</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
          <div className="inline-flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent animate-spin rounded-full"></div>
            <p className="text-gray-600">Loading requests...</p>
          </div>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No requests found
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "You haven't received any client requests yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => {
            const statusBadge = getStatusBadge(request.status);
            const StatusIcon = statusBadge.icon;

            return (
              <div
                key={request._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all"
              >
                <div className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Request Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-md">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                    </div>

                    {/* Request Info */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div>
                          {/* Header with Status */}
                          <div className="flex items-center flex-wrap gap-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">
                              {request.subject}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.textColor}`}
                            >
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusBadge.text}
                            </span>
                          </div>

                          {/* Message */}
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {request.message}
                          </p>

                          {/* Client Info Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs text-gray-500 mb-1">
                                Client
                              </p>
                              <div className="flex items-center">
                                <User className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                                <span className="text-sm font-medium text-gray-900 truncate">
                                  {request.userId?.name || "N/A"}
                                </span>
                              </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs text-gray-500 mb-1">
                                Email
                              </p>
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                                <span className="text-sm text-gray-600 truncate">
                                  {request.userId?.email || "N/A"}
                                </span>
                              </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs text-gray-500 mb-1">
                                Received
                              </p>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                                <span className="text-sm text-gray-600">
                                  {new Date(
                                    request.createdAt
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>

                            {request.consultationType && (
                              <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">
                                  Type
                                </p>
                                <div className="flex items-center">
                                  {request.consultationType === "video" ? (
                                    <Video className="h-4 w-4 text-blue-400 mr-2" />
                                  ) : request.consultationType === "phone" ? (
                                    <Phone className="h-4 w-4 text-green-400 mr-2" />
                                  ) : (
                                    <MessageSquare className="h-4 w-4 text-purple-400 mr-2" />
                                  )}
                                  <span className="text-sm text-gray-600 capitalize">
                                    {request.consultationType || "General"}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => viewRequestDetails(request)}
                              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center space-x-1"
                            >
                              <FileText className="h-4 w-4" />
                              <span>Details</span>
                            </button>

                            {request.status === "Accepted" && (
                              <button
                                onClick={() => handleOpenChat(request.userId)}
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-purple-800 transition-all shadow-md flex items-center space-x-2"
                              >
                                <MessageSquare className="h-4 w-4" />
                                <span>Chat with Client</span>
                              </button>
                            )}

                            {request.status !== "Accepted" && (
                              <button
                                onClick={() =>
                                  updateStatus(request._id, "Accepted")
                                }
                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all shadow-md flex items-center space-x-2"
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span>Accept</span>
                              </button>
                            )}

                            {request.status !== "Rejected" &&
                              request.status !== "Accepted" && (
                                <button
                                  onClick={() =>
                                    updateStatus(request._id, "Rejected")
                                  }
                                  className="px-4 py-2 border border-red-300 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors flex items-center space-x-2"
                                >
                                  <XCircle className="h-4 w-4" />
                                  <span>Reject</span>
                                </button>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Request Details Modal */}
      {showDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-white" />
                <h3 className="text-lg font-bold text-white">
                  Request Details
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedRequest(null);
                }}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Subject */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedRequest.subject}
                  </h2>
                  {(() => {
                    const badge = getStatusBadge(selectedRequest.status);
                    const Icon = badge.icon;
                    return (
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.textColor}`}
                      >
                        <Icon className="h-4 w-4 mr-1" />
                        {badge.text}
                      </span>
                    );
                  })()}
                </div>

                {/* Message */}
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-purple-600" />
                    Message
                  </h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedRequest.message}
                  </p>
                </div>

                {/* Client Information */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <User className="h-4 w-4 mr-2 text-purple-600" />
                    Client Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedRequest.userId?.name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm text-gray-900">
                        {selectedRequest.userId?.email || "N/A"}
                      </p>
                    </div>
                    {selectedRequest.userId?.phone && (
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm text-gray-900">
                          {selectedRequest.userId.phone}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500">User ID</p>
                      <p className="text-sm text-gray-500 font-mono">
                        {selectedRequest.userId?._id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Request Metadata */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-purple-600" />
                    Timeline
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Requested On</p>
                      <p className="text-sm text-gray-900">
                        {formatDate(selectedRequest.createdAt)}
                      </p>
                    </div>
                    {selectedRequest.updatedAt !==
                      selectedRequest.createdAt && (
                      <div>
                        <p className="text-xs text-gray-500">Last Updated</p>
                        <p className="text-sm text-gray-900">
                          {formatDate(selectedRequest.updatedAt)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Consultation Type (if available) */}
                {selectedRequest.consultationType && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Consultation Type
                    </h4>
                    <div className="flex items-center space-x-2">
                      {selectedRequest.consultationType === "video" && (
                        <Video className="h-5 w-5 text-blue-600" />
                      )}
                      {selectedRequest.consultationType === "phone" && (
                        <Phone className="h-5 w-5 text-green-600" />
                      )}
                      {selectedRequest.consultationType === "chat" && (
                        <MessageSquare className="h-5 w-5 text-purple-600" />
                      )}
                      <span className="text-sm text-gray-900 capitalize">
                        {selectedRequest.consultationType}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 p-5 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDetails(false);
                  setSelectedRequest(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              {selectedRequest.status === "Accepted" && (
                <button
                  onClick={() => {
                    handleOpenChat(selectedRequest.userId);
                    setShowDetails(false);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Chat with Client</span>
                </button>
              )}
              {selectedRequest.status !== "Accepted" && (
                <button
                  onClick={() => {
                    updateStatus(selectedRequest._id, "Accepted");
                    setShowDetails(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Accept Request
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="mt-6 bg-purple-50 border-l-4 border-purple-600 rounded-xl p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-purple-900 mb-1">
              Managing Requests
            </h3>
            <p className="text-xs text-purple-700">
              Accept requests to start chatting with clients. Once accepted, you
              can communicate directly through the chat feature. Rejected
              requests cannot be undone. Use the filters to organize your
              requests by status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
