import { useEffect, useState } from "react";
import API from "../../api/axios";
import socket from "../../api/socket";


export default function UserDiscussion() {
  const [discussions, setDiscussions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);

  const [isTyping, setIsTyping] = useState(false);

  let typingTimer;

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const res = await API.get("/user/discussion");
      setDiscussions(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load discussions");
    } finally {
      setLoading(false);
    }
  };

  const openDiscussion = async (id) => {
    try {
      const res = await API.get(`/user/discussion/${id}`);
      setSelected(res.data);

      // ✅ mark lawyer messages as read
      await API.patch(`/user/discussion/${id}/read`);

      // refresh list unread badge
      fetchDiscussions();
    } catch (err) {
      console.log(err);
      alert("Failed to open discussion");
    }
  };

  const sendReply = async () => {
    if (!replyText.trim()) return alert("Type message first");

    try {
      const res = await API.post(`/user/discussion/${selected._id}/reply`, {
        text: replyText,
      });

      setSelected(res.data.discussion);
      setReplyText("");

      // stop typing after sending
      if (selected?.lawyerId?._id) {
        socket.emit("stopTyping", {
          receiverId: selected.lawyerId._id,
          senderRole: "user",
        });
      }

      fetchDiscussions();
    } catch (err) {
      console.log(err);
      alert("Failed to send message");
    }
  };

  // ✅ Listen typing events (lawyer typing)
  useEffect(() => {
    socket.on("typing", ({ senderRole }) => {
      if (senderRole === "lawyer") setIsTyping(true);
    });

    socket.on("stopTyping", ({ senderRole }) => {
      if (senderRole === "lawyer") setIsTyping(false);
    });

    return () => {
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, []);

  useEffect(() => {
    fetchDiscussions();
  }, []);

  if (loading) return <h2>Loading discussions...</h2>;

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {/* LEFT SIDE LIST */}
      <div style={{ width: "35%", borderRight: "1px solid #ddd", paddingRight: "10px" }}>
        <h2>My Discussions</h2>

        {discussions.length === 0 ? (
          <p>No discussions found.</p>
        ) : (
          discussions.map((d) => {
            const unreadCount =
              d?.messages?.filter(
                (m) => m.senderRole === "lawyer" && m.isRead === false
              )?.length || 0;

            return (
              <div
                key={d._id}
                onClick={() => openDiscussion(d._id)}
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  marginBottom: "10px",
                  cursor: "pointer",
                  background: selected?._id === d._id ? "#f3f3f3" : "white",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <h4 style={{ margin: 0 }}>{d.title}</h4>

                  {unreadCount > 0 && (
                    <span
                      style={{
                        background: "red",
                        color: "white",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </div>

                <p style={{ margin: "5px 0", fontSize: "13px" }}>
                  Lawyer: {d.lawyerId?.name || "N/A"}
                </p>
                <p style={{ margin: 0, fontSize: "12px" }}>
                  Status: <b>{d.status}</b>
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* RIGHT SIDE CHAT */}
      <div style={{ width: "65%" }}>
        {!selected ? (
          <h3>Select a discussion to view messages</h3>
        ) : (
          <>
            <h2>{selected.title}</h2>
            <p>
              <b>Lawyer:</b> {selected.lawyerId?.name} ({selected.lawyerId?.email})
            </p>

            <p>
              <b>Status:</b> {selected.status}
            </p>

            <div
              style={{
                border: "1px solid #ddd",
                height: "350px",
                overflowY: "auto",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              {selected.messages?.length === 0 ? (
                <p>No messages yet.</p>
              ) : (
                selected.messages.map((m, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "10px",
                      textAlign: m.senderRole === "user" ? "right" : "left",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-block",
                        padding: "8px 12px",
                        borderRadius: "10px",
                        border: "1px solid #ccc",
                        maxWidth: "70%",
                      }}
                    >
                      <p style={{ margin: 0 }}>{m.text}</p>
                      <small style={{ fontSize: "11px" }}>
                        {m.senderRole} • {new Date(m.createdAt).toLocaleString()}
                      </small>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* ✅ Typing indicator */}
            {isTyping && <p style={{ color: "gray" }}>✍️ Lawyer is typing...</p>}

            {selected.status === "resolved" ? (
              <p style={{ color: "green" }}>✅ Discussion Resolved</p>
            ) : (
              <>
                <textarea
                  value={replyText}
                  onChange={(e) => {
                    setReplyText(e.target.value);

                    if (!selected?.lawyerId?._id) return;

                    socket.emit("typing", {
                      receiverId: selected.lawyerId._id,
                      senderRole: "user",
                    });

                    clearTimeout(typingTimer);

                    typingTimer = setTimeout(() => {
                      socket.emit("stopTyping", {
                        receiverId: selected.lawyerId._id,
                        senderRole: "user",
                      });
                    }, 1000);
                  }}
                  placeholder="Type message..."
                  rows={3}
                  style={{ width: "100%", padding: "10px" }}
                />

                <button onClick={sendReply}>Send</button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
