import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function LawyerDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await API.get("/lawyer/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <h2>Loading Dashboard...</h2>;

  return (
    <div>
      <h1 style={{ fontSize: "28px", marginBottom: "15px" }}>
        👨‍⚖️ Lawyer Dashboard
      </h1>

      {/* STATS CARDS */}
      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
        <div style={cardStyle}>
          <h3>Total Articles</h3>
          <p style={numberStyle}>{stats?.totalArticles || 0}</p>
        </div>

        <div style={cardStyle}>
          <h3>Total Documents</h3>
          <p style={numberStyle}>{stats?.totalDocuments || 0}</p>
        </div>

        <div style={cardStyle}>
          <h3>Total Cases</h3>
          <p style={numberStyle}>{stats?.totalCases || 0}</p>
        </div>
      </div>

      {/* UPCOMING EVENTS */}
      <div style={{ ...cardStyle, marginTop: "20px" }}>
        <h3 style={{ marginBottom: "10px" }}>📅 Upcoming Events (Next 7 Days)</h3>

        {stats?.upcomingEvents?.length === 0 ? (
          <p>No upcoming events</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {stats.upcomingEvents.map((e) => (
              <div
                key={e._id}
                style={{
                  border: "1px solid #eee",
                  padding: "10px",
                  borderRadius: "8px",
                }}
              >
                <h4 style={{ margin: 0 }}>{e.eventTitle}</h4>
                <small style={{ color: "#64748b" }}>
                  Case: {e.caseId?.caseTitle || "N/A"} | Client:{" "}
                  {e.caseId?.clientName || "N/A"}
                </small>
                <br />
                <small style={{ color: "#64748b" }}>
                  Date: {new Date(e.eventDate).toLocaleDateString()}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 0 10px rgba(0,0,0,0.08)",
  flex: 1,
  minWidth: "220px",
};

const numberStyle = {
  fontSize: "26px",
  fontWeight: "bold",
  marginTop: "8px",
};
