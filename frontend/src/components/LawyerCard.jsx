import { useState } from "react";
import {
  X,
  MessageCircle,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  MapPin,
  Briefcase,
  IndianRupee,
  Award,
  Shield,
  Gavel,
  Mail,
  Calendar,
  ChevronRight,
  ThumbsUp,
  User,
  Phone,
} from "lucide-react";
import CallButton from "./CallButton";
import API from "../api/axios";

export default function LawyerCard({
  lawyer,
  requestStatus, // "Pending" | "Accepted" | "Rejected" | undefined
  refreshRequests, // function to refresh status map
  onChat, // optional
}) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendRequest = async () => {
    if (!subject.trim() || !message.trim()) {
      return alert("Subject and message are required!");
    }

    try {
      setSending(true);

      const res = await API.post("/user/contact-lawyer", {
        lawyerId: lawyer._id,
        subject,
        message,
      });

      alert(res.data.msg || "Request sent!");

      setSubject("");
      setMessage("");
      setOpen(false);

      if (refreshRequests) refreshRequests();
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.msg || "Failed to send request");
    } finally {
      setSending(false);
    }
  };

  const isPending = requestStatus === "Pending";
  const isAccepted = requestStatus === "Accepted";
  const isRejected = requestStatus === "Rejected";

  const getStatusBadge = () => {
    if (isAccepted) {
      return {
        icon: CheckCircle,
        text: "Accepted",
        bg: "bg-green-100",
        textColor: "text-green-700",
        border: "border-green-200",
        lightBg: "bg-green-50",
      };
    }
    if (isPending) {
      return {
        icon: Clock,
        text: "Pending",
        bg: "bg-yellow-100",
        textColor: "text-yellow-700",
        border: "border-yellow-200",
        lightBg: "bg-yellow-50",
      };
    }
    if (isRejected) {
      return {
        icon: AlertCircle,
        text: "Rejected",
        bg: "bg-red-100",
        textColor: "text-red-700",
        border: "border-red-200",
        lightBg: "bg-red-50",
      };
    }
    return null;
  };

  const statusBadge = getStatusBadge();

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all overflow-hidden group h-full flex flex-col">
        {/* Header with Avatar - Responsive */}
        <div className="p-4 sm:p-5 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 gap-3 sm:gap-0">
            {/* Avatar */}
            <div className="flex items-center justify-between sm:block">
              <div className="relative">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <span className="text-xl sm:text-2xl font-bold text-white">
                    {lawyer?.name?.charAt(0)?.toUpperCase() || "L"}
                  </span>
                </div>
                {lawyer?.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                    <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                  </div>
                )}
              </div>

              {/* Status Badge - Mobile only */}
              {statusBadge && (
                <div className="sm:hidden">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${statusBadge.bg} ${statusBadge.textColor}`}
                  >
                    <statusBadge.icon className="h-3 w-3 mr-1" />
                    {statusBadge.text}
                  </span>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {lawyer?.name || "Lawyer"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {lawyer?.specialization || "Legal Professional"}
                  </p>
                </div>
                {/* Status Badge - Desktop only */}
                {statusBadge && (
                  <div className="hidden sm:block">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusBadge.bg} ${statusBadge.textColor}`}
                    >
                      <statusBadge.icon className="h-3 w-3 mr-1" />
                      {statusBadge.text}
                    </span>
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${
                        star <= Math.round(lawyer?.rating || 4.5)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-2">
                  ({lawyer?.reviews || 0} reviews)
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center mt-1.5 text-xs text-gray-500">
                <MapPin className="h-3 w-3 mr-1 text-gray-400 flex-shrink-0" />
                <span className="truncate">
                  {lawyer?.cityName || "City"}, {lawyer?.stateName || "State"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section - Improved Layout */}
        <div className="p-4 sm:p-5 space-y-3 flex-1">
          {/* Experience & Fee - Responsive Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 rounded-lg p-2.5 sm:p-3">
              <p className="text-[10px] text-gray-500 mb-1">Experience</p>
              <div className="flex items-center">
                <Briefcase className="h-3.5 w-3.5 text-blue-600 mr-1.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-gray-900">
                  {lawyer?.experience || "0"} yrs
                </span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2.5 sm:p-3">
              <p className="text-[10px] text-gray-500 mb-1">Consultation Fee</p>
              <div className="flex items-center">
                <IndianRupee className="h-3.5 w-3.5 text-green-600 mr-1.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-gray-900">
                  ₹{lawyer?.price || "500"}
                </span>
              </div>
            </div>
          </div>

          {/* Specialization */}
          <div className="bg-gray-50 rounded-lg p-2.5 sm:p-3">
            <p className="text-[10px] text-gray-500 mb-1">Specialization</p>
            <p className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2">
              {lawyer?.specialization || "General Practice"}
            </p>
          </div>

          {/* Email - Hide on very small screens if needed */}
          <div className="bg-gray-50 rounded-lg p-2.5 sm:p-3">
            <p className="text-[10px] text-gray-500 mb-1">Email</p>
            <p className="text-xs text-gray-600 truncate">
              {lawyer?.email || "Not available"}
            </p>
          </div>
        </div>

        {/* Action Buttons - Fixed Layout */}
        <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 mt-auto">
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Call Button - Full width on mobile, auto on desktop */}
            <div className="w-full sm:w-auto">
              <CallButton lawyer={lawyer} />
            </div>

            {/* Action Buttons based on status */}
            {requestStatus === "PAYMENT_VERIFIED" && (
              <button
                onClick={() => {
                  if (onChat) onChat(lawyer);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all shadow-md font-medium"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Chat Unlocked 💬</span>
              </button>
            )}

            {requestStatus === "Accepted" && !isPending && (
              <button
                onClick={() => navigate("/user/my-requests")}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all shadow-md font-medium"
              >
                <IndianRupee className="h-4 w-4" />
                <span className="text-xs sm:text-sm">Pay ₹500</span>
              </button>
            )}

            {/* Chat Button - Only when accepted (legacy) */}
            {isAccepted && (
              <button
                onClick={() => {
                  if (onChat) onChat(lawyer);
                  else
                    alert("Chat is not connected here. Open My Requests page.");
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-green-600 border border-green-600 rounded-lg hover:bg-green-700 transition-all"
              >
                <MessageCircle className="h-4 w-4 text-white" />
                <span className="text-xs sm:text-sm font-medium text-white">
                  Chat
                </span>
              </button>
            )}

            {/* Send Request / Pending Button */}
            {isPending ? (
              <button
                disabled
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-300 text-gray-600 cursor-not-allowed rounded-lg"
              >
                <Clock className="h-4 w-4" />
                <span className="text-xs sm:text-sm font-medium">Pending</span>
              </button>
            ) : (
              <button
                onClick={() => setOpen(true)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-white rounded-lg transition-all ${
                  isRejected
                    ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                } shadow-md`}
              >
                <Send className="h-4 w-4" />
                <span className="text-xs sm:text-sm font-medium">
                  {isRejected ? "Send Again" : "Send Request"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Request Modal - Improved Responsiveness */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-5 sticky top-0">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-white truncate">
                    Send Request
                  </h2>
                  <p className="text-xs sm:text-sm text-blue-100 mt-1 truncate">
                    To:{" "}
                    <span className="font-medium text-white">
                      {lawyer?.name || "Lawyer"}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Consultation for Property Dispute"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-lg text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Describe your legal issue in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-lg text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start">
                  <AlertCircle className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-700">
                    The lawyer will respond to your request within 24-48 hours.
                    You'll be notified once they accept.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 p-4 sm:p-5 border-t border-gray-200 bg-gray-50 sticky bottom-0">
              <button
                onClick={() => setOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                disabled={sending}
                className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Request</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
