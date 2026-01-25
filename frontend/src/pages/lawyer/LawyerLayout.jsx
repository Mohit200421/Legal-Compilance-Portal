import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/lawyercss/lawyerlayout.css";

const LawyerLayout = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext); // ✅ IMPORTANT
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = async () => {
    try {
      // ✅ Clear backend cookie session
      await API.post("/auth/logout");
    } catch (err) {
      console.log("Logout failed:", err);
    } finally {
      // ✅ Clear frontend state + storage
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // ✅ redirect (replace history)
      navigate("/login", { replace: true });
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await API.get("/lawyer/discussion");

      let totalUnread = 0;
      res.data.forEach((d) => {
        const count =
          d?.messages?.filter(
            (m) => m.senderRole === "user" && m.isRead === false
          )?.length || 0;

        totalUnread += count;
      });

      setUnreadCount(totalUnread);
    } catch (err) {
      console.log("Unread count fetch failed:", err);

      // ✅ if session expired -> force logout
      if (err.response?.status === 401) {
        setUser(null);
        navigate("/login", { replace: true });
      }
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="lawyer-container">
      <aside className="lawyer-sidebar">
        <h2 className="logo">Lawyer Panel</h2>

        <nav className="lawyer-nav">
          <NavLink to="/lawyer" end>
            Dashboard
          </NavLink>

          <NavLink to="/lawyer/articles">Manage Articles</NavLink>
          <NavLink to="/lawyer/documents">Documents</NavLink>

          <NavLink to="/lawyer/discussion">
            Discussion{" "}
            {unreadCount > 0 && (
              <span
                style={{
                  background: "red",
                  color: "white",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  marginLeft: "8px",
                }}
              >
                {unreadCount}
              </span>
            )}
          </NavLink>

          <NavLink to="/lawyer/cases">Cases</NavLink>
          <NavLink to="/lawyer/case-events">Case Events</NavLink>
          <NavLink to="/lawyer/requests">Requests</NavLink>

          <button className="lawyer-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </aside>

      <main className="lawyer-content">
        <Outlet />
      </main>
    </div>
  );
};

export default LawyerLayout;
