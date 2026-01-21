import { useState } from "react";
import { Phone, Video, X, MessageCircle } from "lucide-react";
import API from "../api/axios";
import "./lawyercard.css";

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

      // ✅ refresh request status on TalkToLawyer page
      if (refreshRequests) refreshRequests();
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.msg || "Failed to send request");
    } finally {
      setSending(false);
    }
  };

  // ✅ Decide which buttons to show
  const isPending = requestStatus === "Pending";
  const isAccepted = requestStatus === "Accepted";
  const isRejected = requestStatus === "Rejected";

  return (
    <>
      <div className="lawyer-card">
        {/* Top Section */}
        <div className="lawyer-card-top">
          <div className="lawyer-avatar">
            {lawyer?.name?.charAt(0)?.toUpperCase() || "L"}
          </div>

          <div className="lawyer-info">
            <h2 className="lawyer-name">
              {lawyer?.name || "Lawyer"}{" "}
              <span className="lawyer-verified">✔</span>
            </h2>

            <p className="lawyer-status">● Available</p>
            <p className="lawyer-email">{lawyer?.email || "Not available"}</p>

            <p className="lawyer-spec">
              Specialization:{" "}
              <span>{lawyer?.specialization || "Not Added"}</span>
            </p>

            {/* ✅ Status Badge */}
            {requestStatus && (
              <p style={{ marginTop: "6px", fontSize: "13px" }}>
                Request Status:{" "}
                <b
                  style={{
                    color: isAccepted
                      ? "green"
                      : isRejected
                      ? "red"
                      : "#f59e0b",
                  }}
                >
                  {requestStatus}
                </b>
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="lawyer-card-footer">
          <p className="lawyer-role">Lawyer</p>

          <div className="lawyer-actions">
            <button className="btn-outline-green">
              <Phone size={14} /> Call
            </button>

            <button className="btn-outline-blue">
              <Video size={14} /> Internet Call
            </button>

            {/* ✅ If Accepted → show Chat */}
            {isAccepted && (
              <button
                className="btn-outline-chat"
                onClick={() => {
                  if (onChat) onChat(lawyer);
                  else alert("Chat is not connected here. Open My Requests page.");
                }}
              >
                <MessageCircle size={14} /> Chat
              </button>
            )}

            {/* ✅ If Pending → disable request */}
            {isPending ? (
              <button
                className="btn-primary"
                disabled
                style={{ opacity: 0.6, cursor: "not-allowed" }}
              >
                ⏳ Pending
              </button>
            ) : (
              <button
                onClick={() => setOpen(true)}
                className="btn-primary"
                style={{
                  background: isRejected ? "#dc2626" : undefined,
                }}
              >
                {isRejected ? "📩 Send Again" : "📩 Request"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {open && (
        <div className="request-modal-overlay" onClick={() => setOpen(false)}>
          <div className="request-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="request-modal-header">
              <div>
                <h2>Send Request</h2>
                <p>
                  To: <b>{lawyer?.name || "Lawyer"}</b>
                </p>
              </div>

              <button
                className="modal-close-btn"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="request-modal-body">
              <input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="request-input"
              />

              <textarea
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="request-textarea"
                rows={4}
              />
            </div>

            {/* Modal Footer */}
            <div className="request-modal-footer">
              <button onClick={() => setOpen(false)} className="btn-cancel">
                Cancel
              </button>

              <button
                onClick={handleSendRequest}
                disabled={sending}
                className="btn-send"
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
