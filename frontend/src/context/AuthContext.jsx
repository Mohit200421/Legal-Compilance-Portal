import { createContext, useEffect, useState } from "react";
import API from "../api/axios"; // ✅ axios instance (withCredentials true)

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user on refresh using SESSION COOKIE
  const loadUser = async () => {
    try {
      const res = await API.get("/auth/me"); // cookie auto sent
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // ✅ login after successful login API call
  const login = async () => {
    await loadUser();
  };

  // ✅ logout destroys cookie session
  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.log("Logout failed:", err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
