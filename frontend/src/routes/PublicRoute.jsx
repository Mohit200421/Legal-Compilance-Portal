import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  // if logged in → don't allow login/register page
  if (user?.role) {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "lawyer") return <Navigate to="/lawyer" replace />;
    return <Navigate to="/user" replace />;
  }

  return children;
}
