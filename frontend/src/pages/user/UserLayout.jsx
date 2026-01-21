import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api/axios";
import "../../styles/usercss/userlayout.css";

const UserLayout = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await API.get("/user/discussion");

      // count unread messages from lawyer
      let totalUnread = 0;

      res.data.forEach((d) => {
        const count =
          d?.messages?.filter(
            (m) => m.senderRole === "lawyer" && m.isRead === false
          )?.length || 0;

        totalUnread += count;
      });

      setUnreadCount(totalUnread);
    } catch (err) {
      console.log("Unread count fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    // refresh unread count every 5 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="user-container">
      {/* Sidebar */}
      <aside className="user-sidebar">
        <h2 className="logo">User Panel</h2>

        <nav className="user-nav">
          <NavLink to="/user" end>
            Dashboard
          </NavLink>

          <NavLink to="/user/talk-to-lawyer">Talk To Lawyer</NavLink>

          <NavLink to="/user/articles">Articles</NavLink>

          <NavLink to="/user/my-requests">My Requests</NavLink>

          {/* ✅ Discussion with unread badge */}
          <NavLink to="/user/discussion">
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

          <NavLink to="/user/events">Events</NavLink>
          <NavLink to="/user/documents">Documents</NavLink>

          {/* Logout */}
          <button className="user-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="user-content">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
