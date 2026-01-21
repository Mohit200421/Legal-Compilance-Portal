import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import "../../styles/admincss/managelawyer.css";

export default function PendingLawyers() {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  // View Card State
  const [selectedLawyer, setSelectedLawyer] = useState(null);

  const fetchPendingLawyers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/pending-lawyers");
      setLawyers(res.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load pending lawyers ❌");
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
      toast.success(res.data?.msg || "Lawyer approved ✅");
      setSelectedLawyer(null);
      fetchPendingLawyers();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.msg || "Approve failed ❌");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this lawyer?")) return;

    try {
      const res = await API.put(`/admin/pending-lawyers/${id}/reject`);
      toast.success(res.data?.msg || "Lawyer rejected ❌");
      setSelectedLawyer(null);
      fetchPendingLawyers();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.msg || "Reject failed ❌");
    }
  };

  // Convert key to readable format
  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  // ✅ Show only these fields in View Card (no extra backend fields)
  const allowedFields = [
    "name",
    "email",
    "username",
    "phone",
    "city",
    "state",
    "experience",
    "specialization",
    "barCouncilNumber",
    "about",
  ];

  return (
    <div className="manage-lawyers">
      <h2>Pending Lawyer Requests</h2>

      {loading ? (
        <p>Loading...</p>
      ) : lawyers.length === 0 ? (
        <p style={{ marginTop: "10px" }}>No pending lawyers found ✅</p>
      ) : (
        <>
          <table className="lawyer-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {lawyers.map((l) => (
                <tr key={l._id}>
                  <td>{l.name}</td>
                  <td>{l.email}</td>

                  <td style={{ textAlign: "right" }}>
                    <div className="pending-actions">
                      <button
                        className="view-btn"
                        onClick={() => setSelectedLawyer(l)}
                      >
                        View
                      </button>

                      <button
                        className="add-lawyer-btn"
                        onClick={() => handleApprove(l._id)}
                      >
                        Approve
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleReject(l._id)}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ VIEW CARD MODAL */}
          {selectedLawyer && (
            <div
              className="lawyer-modal-overlay"
              onClick={() => setSelectedLawyer(null)}
            >
              <div
                className="lawyer-modal-card"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="lawyer-modal-header">
                  <h3>Lawyer Full Information</h3>
                  <button
                    className="close-btn"
                    onClick={() => setSelectedLawyer(null)}
                  >
                    ✖
                  </button>
                </div>

                {/* ✅ SIMPLE DETAILS (ONLY APPLY FORM FIELDS) */}
                <div className="lawyer-details-simple">
                  {allowedFields.map((key) => (
                    <div className="lawyer-row" key={key}>
                      <span className="lawyer-key">{formatKey(key)}:</span>
                      <span className="lawyer-value">
                        {selectedLawyer?.[key]
                          ? String(selectedLawyer[key])
                          : "N/A"}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="lawyer-modal-actions">
                  <button
                    className="add-lawyer-btn"
                    onClick={() => handleApprove(selectedLawyer._id)}
                  >
                    Approve
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleReject(selectedLawyer._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
