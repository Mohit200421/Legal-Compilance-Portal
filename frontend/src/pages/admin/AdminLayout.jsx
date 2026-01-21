import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api/axios";
import "../../styles/admincss/adminlayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout"); // ✅ clear cookie session
    } catch (err) {
      console.log("Logout failed:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  };

  // ✅ Fetch Pending Lawyers Count
  const fetchPendingCount = async () => {
    try {
      const res = await API.get("/admin/pending-lawyers");
      setPendingCount(res.data?.length || 0);
    } catch (err) {
      console.log("Failed to load pending lawyers count");
    }
  };

  useEffect(() => {
    fetchPendingCount();

    const interval = setInterval(() => {
      fetchPendingCount();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2 className="logo">Admin Panel</h2>

        <nav className="admin-nav">
          <NavLink to="/admin/dashboard">Dashboard</NavLink>

          {/* ✅ Pending Lawyers with badge */}
          <NavLink to="/admin/pending-lawyers" className="pending-link">
            Pending Lawyers
            {pendingCount > 0 && (
              <span className="pending-badge">{pendingCount}</span>
            )}
          </NavLink>

          <NavLink to="/admin/add-lawyer">Add Lawyer</NavLink>
          <NavLink to="/admin/lawyers">Manage Lawyers</NavLink>

          <NavLink to="/admin/users">Manage Users</NavLink>
          <NavLink to="/admin/jobs">Manage Jobs</NavLink>
          <NavLink to="/admin/events">Manage Events</NavLink>
          <NavLink to="/admin/news">Manage News</NavLink>
          <NavLink to="/admin/master">Master Data</NavLink>

          <button className="admin-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
