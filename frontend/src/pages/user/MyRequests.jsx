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
} from "lucide-react";

export default function MyRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [paying, setPaying] = useState(null);

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
          color: "#2563eb",
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
          bg: "bg-green-100",
          textColor: "text-green-700",
          border: "border-green-200",
        };
      case "Accepted":
        return {
          icon: CreditCard,
          text: "Payment Pending",
          bg: "bg-yellow-100",
          textColor: "text-yellow-700",
          border: "border-yellow-200",
        };
      case "Rejected":
        return {
          icon: XCircle,
          text: "Rejected",
          bg: "bg-red-100",
          textColor: "text-red-700",
          border: "border-red-200",
        };
      default:
        return {
          icon: Clock,
          text: "Pending",
          bg: "bg-gray-100",
          textColor: "text-gray-700",
          border: "border-gray-200",
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Header Section */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg mb-3">
              <FileText className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-xs font-semibold text-blue-600 tracking-wider">REQUEST MANAGEMENT</span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
              My Requests
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Track and manage your consultation requests
            </p>
          </div>
          
          <button
            onClick={refreshRequests}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium text-gray-700">Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-white rounded-xl border-l-4 border-blue-600 border border-gray-200 p-4 md:p-5 hover:shadow-lg transition-all">
          <p className="text-xs text-gray-500 mb-1">Total</p>
          <p className="text-xl md:text-2xl font-bold text-gray-900">{counts.total}</p>
          <p className="text-xs text-gray-400 mt-1">All requests</p>
        </div>
        <div className="bg-white rounded-xl border-l-4 border-gray-500 border border-gray-200 p-4 md:p-5 hover:shadow-lg transition-all">
          <p className="text-xs text-gray-500 mb-1">Pending</p>
          <p className="text-xl md:text-2xl font-bold text-gray-600">{counts.pending}</p>
          <p className="text-xs text-gray-400 mt-1">Awaiting response</p>
        </div>
        <div className="bg-white rounded-xl border-l-4 border-yellow-500 border border-gray-200 p-4 md:p-5 hover:shadow-lg transition-all">
          <p className="text-xs text-gray-500 mb-1">Payment Pending</p>
          <p className="text-xl md:text-2xl font-bold text-yellow-600">{counts.accepted}</p>
          <p className="text-xs text-gray-400 mt-1">Need payment</p>
        </div>
        <div className="bg-white rounded-xl border-l-4 border-green-500 border border-gray-200 p-4 md:p-5 hover:shadow-lg transition-all">
          <p className="text-xs text-gray-500 mb-1">Verified</p>
          <p className="text-xl md:text-2xl font-bold text-green-600">{counts.paymentVerified}</p>
          <p className="text-xs text-gray-400 mt-1">Can chat now</p>
        </div>
        <div className="bg-white rounded-xl border-l-4 border-red-500 border border-gray-200 p-4 md:p-5 hover:shadow-lg transition-all">
          <p className="text-xs text-gray-500 mb-1">Rejected</p>
          <p className="text-xl md:text-2xl font-bold text-red-600">{counts.rejected}</p>
          <p className="text-xs text-gray-400 mt-1">Not accepted</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="inline-flex flex-col items-center space-y-3">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
            <p className="text-gray-600">Loading your requests...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && requests.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
            You haven't sent any consultation requests to lawyers yet.
          </p>
          <button
            onClick={() => navigate("/user/talk-to-lawyer")}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md inline-flex items-center space-x-2"
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
                          ID: {request._id.slice(-8)}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {request.subject}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                        {request.message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div className="p-5 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Lawyer Info */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center">
                        <User className="h-4 w-4 text-blue-600 mr-2" />
                        Lawyer Details
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900">
                            {request.lawyerId?.name || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">
                            {request.lawyerId?.email || "N/A"}
                          </span>
                        </div>
                        {request.lawyerId?.specialization && (
                          <div className="flex items-center text-sm">
                            <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-600">
                              {request.lawyerId.specialization}
                            </span>
                          </div>
                        )}
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
                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-600">
                              Updated: {new Date(request.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {request.status === "Accepted" && (
                          <div className="flex items-center text-sm">
                            <IndianRupee className="h-4 w-4 text-green-600 mr-2" />
                            <span className="text-gray-600 font-medium">
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
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-medium hover:from-green-700 hover:to-green-800 transition-all shadow-md disabled:opacity-50"
                      >
                        {paying === request._id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
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
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Chat with Lawyer</span>
                      </button>
                    )}

                    {/* Send New Request Button */}
                    {request.status === "Rejected" && (
                      <button
                        onClick={() => navigate("/user/talk-to-lawyer")}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
                      >
                        <Send className="h-4 w-4" />
                        <span>Send New Request</span>
                      </button>
                    )}

                    {/* Pending Status */}
                    {request.status === "Pending" && (
                      <div className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium">
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