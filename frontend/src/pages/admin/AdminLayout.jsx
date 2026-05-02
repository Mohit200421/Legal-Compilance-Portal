import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  Newspaper,
  Database,
  LogOut,
  Menu,
  Bell,
  Shield,
  ChevronRight,
  User,
  Settings,
  HelpCircle,
  Award,
  Home,
  BarChart3,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Sparkles,
  Headphones,
} from "lucide-react";

// Import the app logo
import appLogo from "../../assets/app_logo.svg";

// Lex-Modernism Color System
const colors = {
  primary: "#091426",
  primaryContainer: "#1e293b",
  onPrimaryContainer: "#8590a6",
  secondary: "#4648d4",
  secondaryContainer: "#6063ee",
  onSecondaryContainer: "#fffbff",
  surface: "#fbf8fa",
  surfaceDim: "#dcd9db",
  surfaceBright: "#fbf8fa",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f5f3f4",
  surfaceContainer: "#f0edef",
  surfaceContainerHigh: "#eae7e9",
  surfaceContainerHighest: "#e4e2e3",
  onSurface: "#1b1b1d",
  onSurfaceVariant: "#45474c",
  outline: "#75777d",
  outlineVariant: "#c5c6cd",
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
  onError: "#ffffff",
  onErrorContainer: "#93000a",
  tertiary: "#1e1200",
  tertiaryContainer: "#35260c",
  onTertiaryContainer: "#a38c6a",
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const { setUser, user } = useContext(AuthContext);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const intervalRef = useRef(null);

  // Glassmorphism styles
  const glassCardClass =
    "bg-white/80 backdrop-blur-md shadow-[0_4px_20px_rgba(30,41,59,0.05)] border border-white/50";

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.log("Logout failed:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  };

  const fetchPendingCount = async () => {
    try {
      const res = await API.get("/admin/pending-lawyers");
      setPendingCount(res.data?.length || 0);
    } catch (err) {
      console.log("Pending count fetch failed:", err);
      if (err.response?.status === 401) {
        setUser(null);
        navigate("/login", { replace: true });
      }
    }
  };

  useEffect(() => {
    fetchPendingCount();
    intervalRef.current = setInterval(() => {
      fetchPendingCount();
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("adminSidebarCollapsed");
    if (savedState !== null) {
      setIsSidebarCollapsed(savedState === "true");
    }
  }, []);

  // Save sidebar state to localStorage
  const toggleSidebarCollapse = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem("adminSidebarCollapsed", newState);
  };

  const navItems = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
    {
      to: "/admin/pending-lawyers",
      icon: Clock,
      label: "Pending Lawyers",
      badge: pendingCount,
    },
    { to: "/admin/users", icon: Users, label: "Manage Users" },
    { to: "/admin/support", icon: Headphones, label: "Support Tickets" },
  ];

  return (
    <div
      className="min-h-screen flex overflow-hidden"
      style={{ backgroundColor: colors.surface }}
    >
      {/* Mobile Header - Glassmorphism */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-40 px-4 py-3 flex items-center justify-between"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${colors.outlineVariant}`,
        }}
      >
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-xl transition-all duration-200"
          style={{ color: colors.onSurfaceVariant }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              colors.surfaceContainerHighest)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-2">
          <img
            src={appLogo}
            alt="LawSetu Logo"
            className="h-6 w-auto object-contain"
          />
          <span
            className="font-semibold text-base"
            style={{ color: colors.onSurface }}
          >
            Admin Panel
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl transition-all duration-200 relative"
            style={{ color: colors.onSurfaceVariant }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                colors.surfaceContainerHighest)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {pendingCount > 0 && (
              <span
                className="absolute top-0 right-0 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full"
                style={{ backgroundColor: colors.error }}
              >
                {pendingCount > 9 ? "9+" : pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Sidebar - Glassmorphism */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          transform transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${isSidebarCollapsed ? "md:w-16" : "md:w-64"}
          flex flex-col
        `}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(12px)",
          borderRight: `1px solid ${colors.outlineVariant}`,
          boxShadow: "0 4px 20px rgba(30, 41, 59, 0.05)",
        }}
      >
        {/* Sidebar Header - Logo Area */}
        <div
          className={`flex-shrink-0 h-16 flex items-center px-4`}
          style={{ borderBottom: `1px solid ${colors.outlineVariant}` }}
        >
          {!isSidebarCollapsed ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <img
                  src={appLogo}
                  alt="LawSetu Logo"
                  className="h-6 w-auto object-contain"
                />
                <span
                  className="text-lg font-bold"
                  style={{ color: colors.onSurface }}
                >
                  Admin Panel
                </span>
              </div>
              <button
                onClick={toggleSidebarCollapse}
                className="p-1.5 rounded-lg transition-all duration-200"
                style={{ color: colors.onSurfaceVariant }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    colors.surfaceContainerHighest;
                  e.currentTarget.style.color = colors.onSurface;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = colors.onSurfaceVariant;
                }}
                aria-label="Collapse sidebar"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <img
                src={appLogo}
                alt="LawSetu Logo"
                className="h-6 w-auto object-contain mx-auto"
              />
              <button
                onClick={toggleSidebarCollapse}
                className="p-1.5 rounded-lg transition-all duration-200"
                style={{ color: colors.onSurfaceVariant }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    colors.surfaceContainerHighest;
                  e.currentTarget.style.color = colors.onSurface;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = colors.onSurfaceVariant;
                }}
                aria-label="Expand sidebar"
              >
                <ChevronRightIcon size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3">
            {/* MAIN Section */}
            {!isSidebarCollapsed && (
              <p
                className="px-2 text-[11px] font-semibold uppercase tracking-wider mb-2"
                style={{ color: colors.onSurfaceVariant }}
              >
                MAIN
              </p>
            )}
            <div className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center ${
                      isSidebarCollapsed ? "justify-center" : "justify-start"
                    } px-2 py-2 rounded-xl text-sm transition-all duration-200 relative`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive
                      ? `${colors.secondary}10`
                      : "transparent",
                    color: isActive
                      ? colors.secondary
                      : colors.onSurfaceVariant,
                  })}
                  onClick={() => setIsSidebarOpen(false)}
                  title={isSidebarCollapsed ? item.label : ""}
                >
                  <item.icon
                    className={`h-5 w-5 flex-shrink-0 ${
                      isSidebarCollapsed ? "" : "mr-3"
                    }`}
                  />
                  {!isSidebarCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                  {!isSidebarCollapsed && item.badge > 0 && (
                    <span
                      className="ml-auto text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: colors.error }}
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                  {isSidebarCollapsed && item.badge > 0 && (
                    <span
                      className="absolute -top-1 -right-1 text-white text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full"
                      style={{ backgroundColor: colors.error }}
                    >
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* Bottom Section - Logout */}
        <div
          className="flex-shrink-0 p-3"
          style={{ borderTop: `1px solid ${colors.outlineVariant}` }}
        >
          <button
            onClick={handleLogout}
            className={`flex items-center ${
              isSidebarCollapsed ? "justify-center" : "justify-start"
            } w-full px-2 py-2 rounded-xl text-sm transition-all duration-200 group`}
            style={{ color: colors.onSurfaceVariant }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.errorContainer;
              e.currentTarget.style.color = colors.onErrorContainer;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = colors.onSurfaceVariant;
            }}
            title={isSidebarCollapsed ? "Logout" : ""}
          >
            <LogOut
              className={`h-5 w-5 flex-shrink-0 ${
                isSidebarCollapsed ? "" : "mr-3"
              } transition-transform group-hover:translate-x-0.5`}
            />
            {!isSidebarCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Overlay for mobile - Glassmorphism */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${
          isSidebarCollapsed ? "md:ml-16" : "md:ml-64"
        }`}
      >
        {/* Desktop Header */}
        <header
          className="hidden md:flex flex-shrink-0 h-16 items-center px-6 sticky top-0 z-30"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(12px)",
            borderBottom: `1px solid ${colors.outlineVariant}`,
          }}
        >
          <div className="flex items-center justify-end w-full">
            {/* Notifications - Desktop */}
            <div className="relative">
              <button
                className="relative p-2 rounded-xl transition-all duration-200"
                style={{ color: colors.onSurfaceVariant }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    colors.surfaceContainerHighest)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {pendingCount > 0 && (
                  <span
                    className="absolute top-0 right-0 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full"
                    style={{ backgroundColor: colors.error }}
                  >
                    {pendingCount > 9 ? "9+" : pendingCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown - Glass Card */}
              {showNotifications && (
                <div
                  className={`absolute right-0 mt-2 w-72 rounded-xl ${glassCardClass} z-50`}
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
                >
                  <div
                    className="p-3"
                    style={{
                      borderBottom: `1px solid ${colors.outlineVariant}`,
                    }}
                  >
                    <h3
                      className="text-xs font-semibold"
                      style={{ color: colors.onSurface }}
                    >
                      Notifications
                    </h3>
                  </div>
                  <div className="p-3 text-center text-xs">
                    {pendingCount > 0 ? (
                      <div>
                        <p
                          className="mb-1.5"
                          style={{ color: colors.onSurfaceVariant }}
                        >
                          You have {pendingCount} pending lawyer{" "}
                          {pendingCount === 1 ? "application" : "applications"}
                        </p>
                        <NavLink
                          to="/admin/pending-lawyers"
                          className="text-xs font-medium transition-colors"
                          style={{ color: colors.secondary }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color =
                              colors.secondaryContainer)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = colors.secondary)
                          }
                          onClick={() => setShowNotifications(false)}
                        >
                          View pending applications →
                        </NavLink>
                      </div>
                    ) : (
                      <p style={{ color: colors.onSurfaceVariant }}>
                        No new notifications
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Header Spacer */}
        <div className="md:hidden h-14"></div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6">
            <div className="max-w-[1280px] mx-auto">
              <Outlet />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer
          className="flex-shrink-0 py-3 px-6"
          style={{
            backgroundColor: colors.surfaceContainerLow,
            borderTop: `1px solid ${colors.outlineVariant}`,
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between text-xs space-y-2 md:space-y-0">
            <p style={{ color: colors.onSurfaceVariant }}>
              © {new Date().getFullYear()} LawSetu. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <button
                className="transition-colors"
                style={{ color: colors.onSurfaceVariant }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = colors.onSurface)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = colors.onSurfaceVariant)
                }
              >
                Privacy Policy
              </button>
              <button
                className="transition-colors"
                style={{ color: colors.onSurfaceVariant }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = colors.onSurface)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = colors.onSurfaceVariant)
                }
              >
                Terms of Service
              </button>
              <button
                className="transition-colors"
                style={{ color: colors.onSurfaceVariant }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = colors.onSurface)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = colors.onSurfaceVariant)
                }
              >
                Help Center
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
