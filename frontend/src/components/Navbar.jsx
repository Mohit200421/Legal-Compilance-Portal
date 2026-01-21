import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) return null; // optional (navbar hide during session check)

  return (
    <nav style={{ display: "flex", gap: "16px", padding: "12px" }}>
      <Link to="/">Home</Link>

      {!user ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      ) : (
        <>
          {user.role === "admin" && <Link to="/admin">Dashboard</Link>}
          {user.role === "lawyer" && <Link to="/lawyer">Dashboard</Link>}
          {user.role === "user" && <Link to="/user">Dashboard</Link>}

          <button
            onClick={handleLogout}
            style={{
              border: "none",
              background: "black",
              color: "white",
              padding: "6px 12px",
              cursor: "pointer",
              borderRadius: "6px",
            }}
          >
            Logout
          </button>
        </>
      )}
    </nav>
  );
}

export default Navbar;
