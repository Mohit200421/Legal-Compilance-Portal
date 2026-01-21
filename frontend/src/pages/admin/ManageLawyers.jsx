import { useEffect, useState } from "react";
import API from "../../api/axios";
import "../../styles/admincss/managelawyer.css";

export default function ManageLawyers() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingLawyers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/pending-lawyers");
      setLawyers(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load pending lawyers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingLawyers();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await API.put(`/admin/pending-lawyers/${id}/approve`);
      alert(res.data.msg || "Lawyer Approved ✅");
      setLawyers((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.msg || "Failed to approve");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await API.put(`/admin/pending-lawyers/${id}/reject`);
      alert(res.data.msg || "Lawyer Rejected ❌");
      setLawyers((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.msg || "Failed to reject");
    }
  };

  return (
    <div className="manage-lawyers">
      <h2>Pending Lawyer Approvals</h2>

      {loading ? (
        <p>Loading...</p>
      ) : lawyers.length === 0 ? (
        <p>No pending lawyer requests 🎉</p>
      ) : (
        <table className="lawyer-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {lawyers.map((l) => (
              <tr key={l._id}>
                <td>{l.name}</td>
                <td>{l.email}</td>
                <td>
                  <b style={{ color: "#f59e0b" }}>{l.lawyerApprovalStatus}</b>
                </td>

                <td style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleApprove(l._id)}
                    style={{
                      background: "#16a34a",
                      color: "white",
                      padding: "8px 14px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    ✅ Approve
                  </button>

                  <button
                    onClick={() => handleReject(l._id)}
                    style={{
                      background: "#dc2626",
                      color: "white",
                      padding: "8px 14px",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    ❌ Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
