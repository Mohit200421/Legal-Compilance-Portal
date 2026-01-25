import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useContext } from "react";
import API from "../../api/axios";
import "../../styles/admincss/adminlayout.css";
import { AuthContext } from "../../context/AuthContext";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [pendingCount, setPendingCount] = useState(0);
  const intervalRef = useRef(null);

  const handleLogout = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    await logout();

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  const fetchPendingCount = async () => {
    try {
      const res = await API.get("/admin/pending-lawyers");
      setPendingCount(res.data?.length || 0);
    } catch (err) {
      if (err.response?.status === 401) {
        await logout();
        navigate("/login", { replace: true });
      }
    }
  };

  useEffect(() => {
    fetchPendingCount();

    intervalRef.current = setInterval(() => {
      fetchPendingCount();
    }, 15000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <h2 className="logo">Admin Panel</h2>

        <nav className="admin-nav">
          <NavLink to="/admin/dashboard">Dashboard</NavLink>

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
