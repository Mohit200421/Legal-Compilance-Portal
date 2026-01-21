import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import "../../styles/usercss/dashboard.css";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    acceptedRequests: 0,
    totalArticles: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);

        // ✅ You can create backend route later
        // For now this will work even if API fails
        const res = await API.get("/user/dashboard-stats");

        setStats(res.data);
      } catch (err) {
        console.log("Dashboard stats API not ready yet");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="user-dashboard">
      {/* Header */}
      <div className="ud-header">
        <div>
          <h2 className="ud-title">Welcome, {user?.name || "User"} 👋</h2>
          <p className="ud-subtitle">
            Manage your legal requests, read articles, and explore services.
          </p>
        </div>

        <div className="ud-actions">
          <Link to="/user/talk-to-lawyer" className="ud-btn primary">
            Talk to Lawyer
          </Link>
          <Link to="/user/my-requests" className="ud-btn outline">
            My Requests
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="ud-stats-grid">
        <div className="ud-card">
          <p className="ud-card-label">Total Requests</p>
          <h3 className="ud-card-value">
            {loading ? "..." : stats.totalRequests}
          </h3>
        </div>

        <div className="ud-card">
          <p className="ud-card-label">Pending</p>
          <h3 className="ud-card-value">
            {loading ? "..." : stats.pendingRequests}
          </h3>
        </div>

        <div className="ud-card">
          <p className="ud-card-label">Accepted</p>
          <h3 className="ud-card-value">
            {loading ? "..." : stats.acceptedRequests}
          </h3>
        </div>

        <div className="ud-card">
          <p className="ud-card-label">Articles Available</p>
          <h3 className="ud-card-value">
            {loading ? "..." : stats.totalArticles}
          </h3>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="ud-grid">
        <div className="ud-section">
          <h3 className="ud-section-title">Quick Actions</h3>

          <div className="ud-quick-grid">
            <Link to="/user/search-lawyer" className="ud-quick-card">
              🔍 Search Lawyer
              <span>Find lawyers by specialization & city</span>
            </Link>

            <Link to="/user/articles" className="ud-quick-card">
              📰 Read Articles
              <span>Latest legal articles & updates</span>
            </Link>

            <Link to="/user/events" className="ud-quick-card">
              📅 Events
              <span>Legal events & seminars</span>
            </Link>

            <Link to="/user/jobs" className="ud-quick-card">
              💼 Jobs
              <span>Explore law internships & jobs</span>
            </Link>

            <Link to="/user/documents" className="ud-quick-card">
              📄 Documents
              <span>View uploaded legal documents</span>
            </Link>

            <Link to="/user/feedback" className="ud-quick-card">
              ⭐ Feedback
              <span>Rate your experience & support</span>
            </Link>
          </div>
        </div>

        {/* Right Side Info */}
        <div className="ud-section">
          <h3 className="ud-section-title">Account Info</h3>

          <div className="ud-profile-card">
            <div className="ud-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div>
              <p className="ud-profile-name">{user?.name || "User"}</p>
              <p className="ud-profile-email">{user?.email || "No email"}</p>
              <p className="ud-profile-role">
                Role: <b>{user?.role || "user"}</b>
              </p>
            </div>
          </div>

          <div className="ud-note">
            ⚡ Tip: Keep your request details clear so lawyers can respond faster.
          </div>
        </div>
      </div>
    </div>
  );
}
