import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Briefcase,
  Calendar,
  ClipboardList,
  LogOut,
  Menu,
  ChevronRight,
  User,
  Settings,
  HelpCircle,
  Shield,
  Gavel,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  UserPlus,
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

const UserLayout = () => {
  const navigate = useNavigate();
  const { setUser, user } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const intervalRef = useRef(null);

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

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("userSidebarCollapsed");
    if (savedState !== null) {
      setIsSidebarCollapsed(savedState === "true");
    }
  }, []);

  // Save sidebar state to localStorage
  const toggleSidebarCollapse = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem("userSidebarCollapsed", newState);
  };

  // Glassmorphism styles
  const glassCardClass =
    "bg-white/80 backdrop-blur-md shadow-[0_4px_20px_rgba(30,41,59,0.05)] border border-white/50";

  const navItems = [
    { to: "/user", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/user/talk-to-lawyer", icon: UserPlus, label: "Talk To Lawyer" },
    { to: "/user/articles", icon: FileText, label: "Legal Articles" },
    { to: "/user/my-requests", icon: ClipboardList, label: "My Requests" },
    { to: "/user/documents", icon: FolderOpen, label: "Documents" },
    { to: "/user/contact-support", icon: Headphones, label: "Contact Support" },
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
            alt="LegalSetu Logo"
            className="h-6 w-auto object-contain"
          />
          <span
            className="font-semibold text-base"
            style={{ color: colors.onSurface }}
          >
            Law<span style={{ color: colors.secondary }}>Setu</span>
          </span>
        </div>

        <div className="w-8"></div>
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
                  alt="LegalSetu Logo"
                  className="h-6 w-auto object-contain"
                />
                <span
                  className="text-lg font-bold"
                  style={{ color: colors.onSurface }}
                >
                  Law<span style={{ color: colors.secondary }}>Setu</span>
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
                alt="LegalSetu Logo"
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
                  end={item.to === "/user"}
                  className={({ isActive }) =>
                    `flex items-center ${
                      isSidebarCollapsed ? "justify-center" : "justify-start"
                    } px-2 py-2 rounded-xl text-sm transition-all duration-200`
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
              © {new Date().getFullYear()} LegalSetu. All rights reserved.
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

export default UserLayout;
