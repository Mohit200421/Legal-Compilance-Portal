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
  Gavel,
  Mail,
  Shield,
} from "lucide-react";
import CallButton from "./CallButton";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────────────────────────────────────
   Tiny helpers
───────────────────────────────────────────────────────────────────────────── */
const Avatar = ({ name }) => {
  const initials = (name || "L").charAt(0).toUpperCase();
  return (
    <div className="relative flex-shrink-0">
      <div
        style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #4f46e5 100%)" }}
        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
      >
        <span className="text-xl font-bold text-white tracking-tight">{initials}</span>
      </div>
    </div>
  );
};

const StarRow = ({ rating = 4.5, reviews = 0 }) => (
  <div className="flex items-center gap-1.5 mt-1">
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3 h-3 ${
            s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200"
          }`}
        />
      ))}
    </div>
    <span className="text-[11px] font-medium text-gray-400">
      {rating} · {reviews} reviews
    </span>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   Status config
───────────────────────────────────────────────────────────────────────────── */
const STATUS = {
  PAYMENT_VERIFIED: {
    label: "Chat Unlocked",
    Icon: CheckCircle,
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-400",
  },
  Accepted: {
    label: "Pay to Chat",
    Icon: IndianRupee,
    pill: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
  },
  Pending: {
    label: "Pending Review",
    Icon: Clock,
    pill: "bg-blue-50 text-blue-600 border-blue-200",
    dot: "bg-blue-400",
  },
  Rejected: {
    label: "Rejected",
    Icon: AlertCircle,
    pill: "bg-red-50 text-red-600 border-red-200",
    dot: "bg-red-400",
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
   Info chip
───────────────────────────────────────────────────────────────────────────── */
const Chip = ({ icon: Icon, label, value, accent }) => (
  <div className="flex flex-col gap-1 bg-gray-50 rounded-xl px-3.5 py-3 border border-gray-100">
    <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{label}</span>
    <div className="flex items-center gap-1.5">
      <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${accent}`} />
      <span className="text-sm font-semibold text-gray-800 truncate">{value}</span>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   Modal input
───────────────────────────────────────────────────────────────────────────── */
const Field = ({ label, required, children }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-gray-600 tracking-wide">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    {children}
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────────────────────── */
export default function LawyerCard({
  lawyer,
  requestStatus,
  refreshRequests,
  onChat,
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const isPending  = requestStatus === "Pending";
  const isAccepted = requestStatus === "Accepted";
  const isVerified = requestStatus === "PAYMENT_VERIFIED";
  const isRejected = requestStatus === "Rejected";

  const statusKey = isVerified
    ? "PAYMENT_VERIFIED"
    : isAccepted
    ? "Accepted"
    : isPending
    ? "Pending"
    : isRejected
    ? "Rejected"
    : null;
  const badge = statusKey ? STATUS[statusKey] : null;

  const handleSendRequest = async () => {
    if (!subject.trim() || !message.trim()) return alert("Subject and message are required!");
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
      alert(err?.response?.data?.msg || "Failed to send request");
    } finally {
      setSending(false);
    }
  };

  /* ── action button ── */
  const ActionButton = () => {
    if (isVerified)
      return (
        <button
          onClick={() => onChat?.(lawyer)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #059669, #047857)" }}
        >
          <MessageCircle className="w-4 h-4" />
          Chat Now
        </button>
      );

    if (isAccepted && !isVerified)
      return (
        <button
          onClick={() => navigate("/user/my-requests")}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #d97706, #b45309)" }}
        >
          <IndianRupee className="w-4 h-4" />
          Pay ₹{lawyer?.price || "500"} to Chat
        </button>
      );

    if (isPending)
      return (
        <button
          disabled
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed"
        >
          <Clock className="w-4 h-4" />
          Awaiting Response
        </button>
      );

    return (
      <button
        onClick={() => setOpen(true)}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
        style={{
          background: isRejected
            ? "linear-gradient(135deg, #dc2626, #b91c1c)"
            : "linear-gradient(135deg, #1d4ed8, #4338ca)",
        }}
      >
        <Send className="w-4 h-4" />
        {isRejected ? "Request Again" : "Send Request"}
      </button>
    );
  };

  return (
    <>
      {/* ═══════════════════ CARD ═══════════════════ */}
      <div className="group relative bg-white rounded-2xl border border-gray-200/80 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50 transition-all duration-300 flex flex-col h-full overflow-hidden">

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: "linear-gradient(90deg, #1d4ed8, #6366f1, #8b5cf6)" }}
        />

        {/* ── Header ── */}
        <div className="px-5 pt-6 pb-5">
          <div className="flex items-start gap-4">
            <Avatar name={lawyer?.name} />

            <div className="flex-1 min-w-0">
              {/* Name row */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-gray-900 truncate leading-tight group-hover:text-blue-700 transition-colors">
                    {lawyer?.name || "Lawyer"}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5 truncate">
                    {lawyer?.specialization || "Legal Professional"}
                  </p>
                </div>

                {/* Status badge */}
                {badge && (
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full border flex-shrink-0 ${badge.pill}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                    {badge.label}
                  </span>
                )}
              </div>

              <StarRow rating={lawyer?.rating} reviews={lawyer?.reviews} />

              {/* Location */}
              <div className="flex items-center gap-1 mt-2">
                <MapPin className="w-3 h-3 text-gray-300 flex-shrink-0" />
                <span className="text-[11px] text-gray-400 truncate">
                  {lawyer?.cityName || "City"}, {lawyer?.stateName || "State"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent mx-5" />

        {/* ── Info chips ── */}
        <div className="p-5 grid grid-cols-2 gap-2.5 flex-1">
          <Chip icon={Briefcase} label="Experience" value={`${lawyer?.experience || 0} yrs`} accent="text-blue-500" />
          <Chip icon={IndianRupee} label="Fee" value={`₹${lawyer?.price || 500}`} accent="text-emerald-500" />
          <div className="col-span-2">
            <Chip icon={Gavel} label="Specialization" value={lawyer?.specialization || "General Practice"} accent="text-violet-500" />
          </div>
          <div className="col-span-2">
            <Chip icon={Mail} label="Email" value={lawyer?.email || "Not available"} accent="text-gray-400" />
          </div>

          {/* Verified badge */}
          {lawyer?.verified && (
            <div className="col-span-2 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700">Bar Council Verified</span>
            </div>
          )}
        </div>

        {/* ── Footer actions ── */}
        <div className="px-5 pb-5 pt-3 border-t border-gray-100 space-y-3">
          <div className="flex gap-2.5">
            <div className="flex-shrink-0">
              <CallButton lawyer={lawyer} />
            </div>
            <ActionButton />
          </div>

          {/* Pay-once note */}
          {(isVerified || (isAccepted && !isVerified)) && (
            <p className="text-center text-[10px] font-medium text-gray-400">
              {isVerified ? "✓ Pay once · chat forever" : "One-time payment · unlimited chat"}
            </p>
          )}
        </div>
      </div>

      {/* ═══════════════════ MODAL ═══════════════════ */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="relative px-6 pt-6 pb-5 border-b border-gray-100">
              {/* drag pill on mobile */}
              <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-200 rounded-full" />
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-gray-900">Send a Request</h2>
                  <p className="text-sm text-gray-400 mt-0.5">
                    To{" "}
                    <span className="font-semibold text-gray-700">{lawyer?.name || "Lawyer"}</span>
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
              <Field label="Subject" required>
                <input
                  type="text"
                  placeholder="e.g. Property dispute consultation"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all placeholder-gray-300 bg-gray-50 focus:bg-white"
                />
              </Field>

              <Field label="Message" required>
                <textarea
                  placeholder="Describe your legal issue in detail…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all resize-none placeholder-gray-300 bg-gray-50 focus:bg-white"
                />
              </Field>

              {/* Info strip */}
              <div className="flex gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  The lawyer will respond within 24–48 hours. After acceptance, make a one-time payment to unlock unlimited chat.
                </p>
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/80 flex gap-2.5 sm:flex-row flex-col-reverse">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                disabled={sending}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                style={{ background: "linear-gradient(135deg, #1d4ed8, #4338ca)" }}
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Request
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