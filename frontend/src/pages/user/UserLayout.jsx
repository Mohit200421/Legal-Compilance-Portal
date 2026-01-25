import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import API from "../../api/axios";
import "../../styles/usercss/userlayout.css";
import { AuthContext } from "../../context/AuthContext";

const UserLayout = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [unreadCount, setUnreadCount] = useState(0);
  const intervalRef = useRef(null);

  const handleLogout = async () => {
    // ✅ stop background API calls first
    if (intervalRef.current) clearInterval(intervalRef.current);

    // ✅ logout from context (clears cookie + sets user null)
    await logout();

    // ✅ clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // ✅ redirect instantly
    navigate("/login", { replace: true });
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await API.get("/user/discussion");

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
      // ✅ if unauthorized → force logout + redirect
      if (err.response?.status === 401) {
        await logout();
        navigate("/login", { replace: true });
      }
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    intervalRef.current = setInterval(() => {
      fetchUnreadCount();
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="user-container">
      <aside className="user-sidebar">
        <h2 className="logo">User Panel</h2>

        <nav className="user-nav">
          <NavLink to="/user" end>
            Dashboard
          </NavLink>

          <NavLink to="/user/talk-to-lawyer">Talk To Lawyer</NavLink>
          <NavLink to="/user/articles">Articles</NavLink>
          <NavLink to="/user/my-requests">My Requests</NavLink>

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

          <button className="user-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </aside>

      <main className="user-content">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
