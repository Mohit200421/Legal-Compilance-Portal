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
        return { icon: CheckCircle, text: "Accepted", bg: "bg-green-100", textColor: "text-green-700" };
      case "Rejected":
        return { icon: XCircle, text: "Rejected", bg: "bg-red-100", textColor: "text-red-700" };
      default:
        return { icon: Clock, text: "Pending", bg: "bg-yellow-100", textColor: "text-yellow-700" };
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg mb-3">
              <Users className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-xs font-semibold text-blue-600 tracking-wider">CLIENT REQUESTS</span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
              Client Requests
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Manage and respond to client consultation requests
            </p>
          </div>
          
          <button
            onClick={fetchRequests}
            className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
          >
            <RefreshCw className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-white rounded-xl border-l-4 border-blue-600 border border-gray-200 p-4 md:p-5 hover:shadow-lg transition-all">
          <p className="text-xs text-gray-500 mb-1">Total</p>
          <p className="text-xl md:text-2xl font-bold text-gray-900">{counts.total}</p>
          <p className="text-xs text-gray-400 mt-1">All requests</p>
        </div>
        <div className="bg-white rounded-xl border-l-4 border-yellow-500 border border-gray-200 p-4 md:p-5 hover:shadow-lg transition-all">
          <p className="text-xs text-gray-500 mb-1">Pending</p>
          <p className="text-xl md:text-2xl font-bold text-yellow-600">{counts.pending}</p>
          <p className="text-xs text-gray-400 mt-1">Awaiting response</p>
        </div>
        <div className="bg-white rounded-xl border-l-4 border-green-500 border border-gray-200 p-4 md:p-5 hover:shadow-lg transition-all">
          <p className="text-xs text-gray-500 mb-1">Accepted</p>
          <p className="text-xl md:text-2xl font-bold text-green-600">{counts.accepted}</p>
          <p className="text-xs text-gray-400 mt-1">Ready to chat</p>
        </div>
        <div className="bg-white rounded-xl border-l-4 border-red-500 border border-gray-200 p-4 md:p-5 hover:shadow-lg transition-all">
          <p className="text-xs text-gray-500 mb-1">Rejected</p>
          <p className="text-xl md:text-2xl font-bold text-red-600">{counts.rejected}</p>
          <p className="text-xs text-gray-400 mt-1">Declined</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by subject, message, or client name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 border border-gray-300 bg-white rounded-xl text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
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
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden p-2.5 bg-gray-100 rounded-xl"
            >
              <Filter className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <span className="text-sm text-gray-500 ml-auto">
              Showing {filteredRequests.length} of {requests.length} requests
            </span>
          </div>

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
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="inline-flex flex-col items-center space-y-3">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
            <p className="text-gray-600">Loading requests...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredRequests.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
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
                className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all overflow-hidden"
              >
                {/* Request Header */}
                <div className="border-b border-gray-100 p-5">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-2 mb-2">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusBadge.bg} ${statusBadge.textColor}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusBadge.text}
                        </span>
                        <span className="text-xs text-gray-400">
                          ID: {req._id.slice(-8)}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {req.subject}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                        {req.message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div className="p-5 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Client Info */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center">
                        <User className="h-4 w-4 text-blue-600 mr-2" />
                        Client Details
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900">
                            {req.userId?.name || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">
                            {req.userId?.email || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Request Metadata */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center">
                        <Clock className="h-4 w-4 text-blue-600 mr-2" />
                        Request Info
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">
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
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-all shadow-md"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Chat with Client</span>
                      </button>
                    )}

                    {req.status !== "Accepted" && (
                      <button
                        onClick={() => updateStatus(req._id, "Accepted")}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all shadow-md"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Accept Request</span>
                      </button>
                    )}

                    {req.status !== "Rejected" && req.status !== "Accepted" && (
                      <button
                        onClick={() => updateStatus(req._id, "Rejected")}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all shadow-md"
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