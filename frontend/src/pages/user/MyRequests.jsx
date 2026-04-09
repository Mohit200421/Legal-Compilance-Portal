import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { QRCodeCanvas } from "qrcode.react";

export default function MyRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(null);

  // 🧾 New states
  const [utrInputs, setUtrInputs] = useState({});
  const [screenshots, setScreenshots] = useState({});
  const [submitting, setSubmitting] = useState(null);

  const fetchMyRequests = async () => {
    try {
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
    if (!lawyer?._id) return alert("Lawyer not found!");
    navigate(`/chat/${lawyer._id}`, {
      state: { receiverName: lawyer.name },
    });
  };

  const handleSubmitPayment = async (requestId) => {
    const utr = utrInputs[requestId];
    const file = screenshots[requestId];

    if (!utr || !file) {
      return alert("Enter UTR & upload screenshot");
    }

    const formData = new FormData();
    formData.append("utr", utr);
    formData.append("requestId", requestId);
    formData.append("screenshot", file);

    try {
      setSubmitting(requestId);

      await API.post("/payment/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Payment submitted successfully ✅");
      fetchMyRequests();
    } catch (err) {
      console.log(err);
      alert("Payment submission failed");
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Requests</h2>

      {loading && <p>Loading...</p>}

      {!loading && requests.length === 0 && (
        <p>No requests found</p>
      )}

      {!loading &&
        requests.map((request) => {
          const amount = request.amount || 1;

          const upiLink = `upi://pay?pa=mohitkantilalbadgujar@axl&pn=LawSetu&am=${amount}&cu=INR`;

          return (
            <div
              key={request._id}
              className="border rounded-xl p-5 mb-5 bg-white shadow-md"
            >
              {/* INFO */}
              <h3 className="font-semibold text-lg">
                {request.subject}
              </h3>
              <p className="text-gray-600 text-sm">
                {request.message}
              </p>

              <p className="text-sm mt-2">
                Lawyer:{" "}
                <span className="font-medium">
                  {request.lawyerId?.name || "N/A"}
                </span>
              </p>

              <p className="text-sm mt-1">
                Status:{" "}
                <span className="font-semibold text-blue-600">
                  {request.status}
                </span>
              </p>

              {/* ================= ACTIONS ================= */}

              {request.status === "Accepted" && (
                <div className="mt-4 space-y-3">
                  {/* 💰 PAY BUTTON */}
                  <button
                    onClick={() => {
                      const isMobile =
                        /Android|iPhone|iPad/i.test(
                          navigator.userAgent
                        );

                      if (isMobile) {
                        window.location.href = upiLink;
                      } else {
                        setShowQR(request._id);
                      }
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded w-full"
                  >
                    Pay ₹{amount}
                  </button>

                  {/* 🧾 PAYMENT FORM */}
                  <div className="border p-3 rounded bg-gray-50 space-y-2">
                    <input
                      type="text"
                      placeholder="Enter UTR Number"
                      value={utrInputs[request._id] || ""}
                      onChange={(e) =>
                        setUtrInputs({
                          ...utrInputs,
                          [request._id]: e.target.value,
                        })
                      }
                      className="border px-3 py-2 w-full rounded"
                    />

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setScreenshots({
                          ...screenshots,
                          [request._id]: e.target.files[0],
                        })
                      }
                      className="border px-3 py-2 w-full rounded"
                    />

                    <button
                      onClick={() =>
                        handleSubmitPayment(request._id)
                      }
                      disabled={submitting === request._id}
                      className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                    >
                      {submitting === request._id
                        ? "Submitting..."
                        : "Submit Payment"}
                    </button>
                  </div>
                </div>
              )}

              {/* 🕒 WAITING STATE */}
              {request.status === "PAYMENT_SUBMITTED" && (
                <p className="mt-4 text-yellow-600 font-medium">
                  Waiting for lawyer verification ⏳
                </p>
              )}

              {/* 💬 CHAT UNLOCK */}
              {request.status === "PAYMENT_VERIFIED" && (
                <button
                  onClick={() =>
                    handleOpenChat(request.lawyerId)
                  }
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full"
                >
                  Chat with Lawyer 💬
                </button>
              )}

              {/* ❌ REJECTED */}
              {request.status === "Rejected" && (
                <button
                  onClick={() =>
                    navigate("/user/talk-to-lawyer")
                  }
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full"
                >
                  Send New Request
                </button>
              )}

              {/* 📱 QR CODE */}
              {showQR === request._id && (
                <div className="mt-4 p-4 border rounded text-center bg-gray-100">
                  <p className="text-sm font-medium mb-2">
                    Scan & Pay (GPay / PhonePe)
                  </p>

                  <QRCodeCanvas value={upiLink} size={180} />

                  <button
                    onClick={() => setShowQR(null)}
                    className="mt-3 text-red-500"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}