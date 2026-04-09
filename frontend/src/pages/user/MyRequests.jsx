import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function MyRequests() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(null);

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

  // 💳 RAZORPAY HANDLER
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

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Requests</h2>

      {loading && <p>Loading...</p>}

      {!loading && requests.length === 0 && (
        <p>No requests found</p>
      )}

      {!loading &&
        requests.map((request) => {
          const amount = request.amount || 500;

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

              {/* 💳 PAY BUTTON */}
              {request.status === "Accepted" && (
                <button
                  onClick={() => handleRazorpay(request)}
                  disabled={paying === request._id}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded w-full"
                >
                  {paying === request._id
                    ? "Processing..."
                    : `Pay ₹${amount}`}
                </button>
              )}

              {/* 💬 CHAT */}
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
            </div>
          );
        })}
    </div>
  );
}