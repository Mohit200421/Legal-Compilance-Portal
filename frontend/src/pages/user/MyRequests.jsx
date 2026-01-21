import { useEffect, useState } from "react";
import API from "../../api/axios";
import ChatModal from "../../components/chat/ChatModal";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chat Modal state
  const [openChat, setOpenChat] = useState(false);
  const [chatLawyer, setChatLawyer] = useState(null);

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

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const handleOpenChat = (lawyer) => {
    if (!lawyer?._id) return alert("Lawyer not found for this request!");
    setChatLawyer(lawyer);
    setOpenChat(true);
  };

  const handleCloseChat = () => {
    setOpenChat(false);
    setChatLawyer(null);

    // ✅ optional refresh
    fetchMyRequests();
  };

  return (
    <div>
      <h1 style={{ fontSize: "26px", marginBottom: "10px" }}>
        📩 My Requests
      </h1>

      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p>No requests sent yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {requests.map((r) => (
            <div
              key={r._id}
              style={{
                background: "white",
                padding: "16px",
                borderRadius: "10px",
                boxShadow: "0 0 10px rgba(0,0,0,0.08)",
              }}
            >
              <h3 style={{ marginBottom: "6px" }}>{r.subject}</h3>

              <p style={{ marginBottom: "8px", color: "#334155" }}>
                {r.message}
              </p>

              <small style={{ color: "#64748b" }}>
                Lawyer: {r.lawyerId?.name || "N/A"} ({r.lawyerId?.email || "N/A"})
              </small>

              <p style={{ marginTop: "8px" }}>
                Status:{" "}
                <b
                  style={{
                    color:
                      r.status === "Accepted"
                        ? "green"
                        : r.status === "Rejected"
                        ? "red"
                        : "#0ea5e9",
                  }}
                >
                  {r.status}
                </b>
              </p>

              <small style={{ color: "#64748b" }}>
                Sent on: {new Date(r.createdAt).toLocaleString()}
              </small>

              {/* Chat Button only if Accepted */}
              {r.status === "Accepted" && r.lawyerId?._id && (
                <div style={{ marginTop: "12px" }}>
                  <button
                    onClick={() => handleOpenChat(r.lawyerId)}
                    style={{
                      background: "#2563eb",
                      color: "white",
                      padding: "8px 14px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    💬 Chat with Lawyer
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Chat Modal */}
      <ChatModal
        open={openChat}
        onClose={handleCloseChat}
        receiverId={chatLawyer?._id}
        receiverName={chatLawyer?.name}
      />
    </div>
  );
}
