import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Mail,
  FileText,
  AlertCircle,
  Send,
  ArrowRight,
  RefreshCw,
  IndianRupee,
  CreditCard,
  Phone,
  Video,
  Star,
  MapPin,
  Briefcase,
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

export default function MyRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [paying, setPaying] = useState(null);

  // Glassmorphism card style
  const glassCardClass = "bg-white/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(30,41,59,0.05)] border border-white/50";

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const res = await API.get("/user/my-requests");
      setRequests(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const refreshRequests = async () => {
    setRefreshing(true);
    await fetchMyRequests();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const handleOpenChat = (lawyer) => {
    if (!lawyer?._id) return alert("Lawyer not found!");
    navigate(`/chat/${lawyer._id}`, {
      state: { receiverName: lawyer.name },
    });
  };

  const handleRazorpay = async (request) => {
    try {
      setPaying(request._id);

      const res = await API.post("/payment/create-order", {
        requestId: request._id,
      });

      const { order, key } = res.data;

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "LawSetu",
        description: "Consultation Payment",
        order_id: order.id,

        handler: async function (response) {
          await API.post("/payment/verify-razorpay", {
            ...response,
            requestId: request._id,
          });

          alert("Payment successful ✅");
          fetchMyRequests();
        },

        theme: {
          color: colors.secondary.substring(1),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
      alert("Payment failed");
    } finally {
      setPaying(null);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "PAYMENT_VERIFIED":
        return {
          icon: CheckCircle,
          text: "Payment Verified",
          bg: "#4caf5015",
          textColor: "#4caf50",
        };
      case "Accepted":
        return {
          icon: CreditCard,
          text: "Payment Pending",
          bg: `${colors.tertiary}15`,
          textColor: colors.tertiary,
        };
      case "Rejected":
        return {
          icon: XCircle,
          text: "Rejected",
          bg: `${colors.error}15`,
          textColor: colors.error,
        };
      default:
        return {
          icon: Clock,
          text: "Pending",
          bg: colors.surfaceContainerHighest,
          textColor: colors.onSurfaceVariant,
        };
    }
  };

  const getStatusCounts = () => {
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === "Pending").length,
      accepted: requests.filter(r => r.status === "Accepted").length,
      paymentVerified: requests.filter(r => r.status === "PAYMENT_VERIFIED").length,
      rejected: requests.filter(r => r.status === "Rejected").length
    };
  };

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
              <FileText className="h-4 w-4 mr-2" style={{ color: colors.secondary }} />
              <span className="text-xs font-semibold tracking-wider" style={{ color: colors.secondary }}>
                REQUEST MANAGEMENT
              </span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-[1.2] tracking-[-0.02em]" style={{ color: colors.onSurface }}>
              My Requests
            </h1>
            <p className="text-xs md:text-sm mt-1" style={{ color: colors.onSurfaceVariant }}>
              Track and manage your consultation requests
            </p>
          </div>
          
          <button
            onClick={refreshRequests}
            disabled={refreshing}
            className={`flex items-center space-x-2 px-4 py-2.5 ${glassCardClass} transition-all duration-200 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)] disabled:opacity-50`}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} style={{ color: colors.onSurfaceVariant }} />
            <span className="text-sm font-medium" style={{ color: colors.onSurfaceVariant }}>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards - Glass Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className={`${glassCardClass} p-4 md:p-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)]`}>
          <p className="text-xs mb-1" style={{ color: colors.onSurfaceVariant }}>Total</p>
          <p className="text-xl md:text-2xl font-bold" style={{ color: colors.onSurface }}>{counts.total}</p>
          <p className="text-xs mt-1" style={{ color: colors.onSurfaceVariant }}>All requests</p>
        </div>
        <div className={`${glassCardClass} p-4 md:p-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)]`}>
          <p className="text-xs mb-1" style={{ color: colors.onSurfaceVariant }}>Pending</p>
          <p className="text-xl md:text-2xl font-bold" style={{ color: colors.onSurfaceVariant }}>{counts.pending}</p>
          <p className="text-xs mt-1" style={{ color: colors.onSurfaceVariant }}>Awaiting response</p>
        </div>
        <div className={`${glassCardClass} p-4 md:p-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)]`}>
          <p className="text-xs mb-1" style={{ color: colors.onSurfaceVariant }}>Payment Pending</p>
          <p className="text-xl md:text-2xl font-bold" style={{ color: colors.tertiary }}>{counts.accepted}</p>
          <p className="text-xs mt-1" style={{ color: colors.onSurfaceVariant }}>Need payment</p>
        </div>
        <div className={`${glassCardClass} p-4 md:p-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)]`}>
          <p className="text-xs mb-1" style={{ color: colors.onSurfaceVariant }}>Verified</p>
          <p className="text-xl md:text-2xl font-bold" style={{ color: "#4caf50" }}>{counts.paymentVerified}</p>
          <p className="text-xs mt-1" style={{ color: colors.onSurfaceVariant }}>Can chat now</p>
        </div>
        <div className={`${glassCardClass} p-4 md:p-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)]`}>
          <p className="text-xs mb-1" style={{ color: colors.onSurfaceVariant }}>Rejected</p>
          <p className="text-xl md:text-2xl font-bold" style={{ color: colors.error }}>{counts.rejected}</p>
          <p className="text-xs mt-1" style={{ color: colors.onSurfaceVariant }}>Not accepted</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className={`${glassCardClass} p-12 text-center`}>
          <div className="inline-flex flex-col items-center space-y-3">
            <div className="w-10 h-10 border-3 rounded-full animate-spin" style={{ borderColor: colors.secondary, borderTopColor: "transparent" }} />
            <p style={{ color: colors.onSurfaceVariant }}>Loading your requests...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && requests.length === 0 && (
        <div className={`${glassCardClass} p-12 text-center`}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: colors.surfaceContainerHighest }}>
            <Send className="h-8 w-8" style={{ color: colors.onSurfaceVariant }} />
          </div>
          <h3 className="text-lg font-medium mb-2" style={{ color: colors.onSurface }}>No requests found</h3>
          <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: colors.onSurfaceVariant }}>
            You haven't sent any consultation requests to lawyers yet.
          </p>
          <button
            onClick={() => navigate("/user/talk-to-lawyer")}
            className="px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-md inline-flex items-center space-x-2"
            style={{ backgroundColor: colors.secondary, color: "white" }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondaryContainer}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
          >
            <span>Browse Lawyers</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Requests List */}
      {!loading && requests.length > 0 && (
        <div className="space-y-4">
          {requests.map((request) => {
            const amount = request.amount || 500;
            const statusBadge = getStatusBadge(request.status);
            const StatusIcon = statusBadge.icon;
            
            return (
              <div
                key={request._id}
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
                          ID: {request._id.slice(-8)}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold mb-2" style={{ color: colors.onSurface }}>
                        {request.subject}
                      </h3>
                      
                      <p className="text-sm mb-3 leading-relaxed" style={{ color: colors.onSurfaceVariant, lineHeight: "1.6" }}>
                        {request.message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div className="p-5" style={{ backgroundColor: colors.surfaceContainerLow }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Lawyer Info */}
                    <div className={`${glassCardClass} p-4`}>
                      <p className="text-xs font-semibold mb-3 flex items-center" style={{ color: colors.onSurfaceVariant }}>
                        <User className="h-4 w-4 mr-2" style={{ color: colors.secondary }} />
                        Lawyer Details
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <User className="h-4 w-4 mr-2" style={{ color: colors.outline }} />
                          <span className="font-medium" style={{ color: colors.onSurface }}>
                            {request.lawyerId?.name || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2" style={{ color: colors.outline }} />
                          <span style={{ color: colors.onSurfaceVariant }}>
                            {request.lawyerId?.email || "N/A"}
                          </span>
                        </div>
                        {request.lawyerId?.specialization && (
                          <div className="flex items-center text-sm">
                            <Briefcase className="h-4 w-4 mr-2" style={{ color: colors.outline }} />
                            <span style={{ color: colors.onSurfaceVariant }}>
                              {request.lawyerId.specialization}
                            </span>
                          </div>
                        )}
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
                            {new Date(request.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        {request.updatedAt && request.updatedAt !== request.createdAt && (
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2" style={{ color: colors.outline }} />
                            <span style={{ color: colors.onSurfaceVariant }}>
                              Updated: {new Date(request.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {request.status === "Accepted" && (
                          <div className="flex items-center text-sm">
                            <IndianRupee className="h-4 w-4 mr-2" style={{ color: "#4caf50" }} />
                            <span className="font-medium" style={{ color: colors.onSurfaceVariant }}>
                              Amount: ₹{amount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {/* Pay Button */}
                    {request.status === "Accepted" && (
                      <button
                        onClick={() => handleRazorpay(request)}
                        disabled={paying === request._id}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-md disabled:opacity-50"
                        style={{ backgroundColor: "#4caf50", color: "white" }}
                        onMouseEnter={(e) => {
                          if (paying !== request._id) e.currentTarget.style.backgroundColor = "#45a049";
                        }}
                        onMouseLeave={(e) => {
                          if (paying !== request._id) e.currentTarget.style.backgroundColor = "#4caf50";
                        }}
                      >
                        {paying === request._id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <IndianRupee className="h-4 w-4" />
                            <span>Pay ₹{amount}</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Chat Button */}
                    {request.status === "PAYMENT_VERIFIED" && (
                      <button
                        onClick={() => handleOpenChat(request.lawyerId)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-md"
                        style={{ backgroundColor: colors.secondary, color: "white" }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondaryContainer}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Chat with Lawyer</span>
                      </button>
                    )}

                    {/* Send New Request Button */}
                    {request.status === "Rejected" && (
                      <button
                        onClick={() => navigate("/user/talk-to-lawyer")}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 shadow-md"
                        style={{ backgroundColor: colors.secondary, color: "white" }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.secondaryContainer}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
                      >
                        <Send className="h-4 w-4" />
                        <span>Send New Request</span>
                      </button>
                    )}

                    {/* Pending Status */}
                    {request.status === "Pending" && (
                      <div className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium" style={{ backgroundColor: colors.surfaceContainerHighest, color: colors.onSurfaceVariant }}>
                        <Clock className="h-4 w-4" />
                        <span>Waiting for lawyer response</span>
                      </div>
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