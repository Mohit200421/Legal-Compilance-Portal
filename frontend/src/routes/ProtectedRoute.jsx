import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ allow, children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading session...</div>;

  if (!user) return <Navigate to="/login" replace />;

  // ✅ allow can be string OR array
  if (allow) {
    const allowedRoles = Array.isArray(allow) ? allow : [allow];

    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
