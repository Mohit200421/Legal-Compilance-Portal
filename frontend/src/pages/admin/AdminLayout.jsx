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
} from "lucide-react";

// Import the app logo
import appLogo from "../../assets/app_logo.png";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { setUser, user } = useContext(AuthContext);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
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
  /*  { to: "/admin/add-lawyer", icon: User, label: "Add Lawyer" },
    { to: "/admin/lawyers", icon: Users, label: "Manage Lawyers" },
    
    { to: "/admin/jobs", icon: Briefcase, label: "Manage Jobs" },
    { to: "/admin/events", icon: Calendar, label: "Manage Events" },
    { to: "/admin/news", icon: Newspaper, label: "Manage News" },
    { to: "/admin/master", icon: Database, label: "Master Data" },
    { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },*/
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-gray-700" />
        </button>

        <div className="flex items-center space-x-2">
          <img 
            src={appLogo} 
            alt="LawSetu Logo" 
            className="h-7 w-auto object-contain"
          />
          <span className="font-semibold text-base text-gray-900">
            Admin Panel
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-gray-700" />
            {pendingCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {pendingCount > 9 ? "9+" : pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 bg-white shadow-lg
          transform transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${isSidebarCollapsed ? "md:w-16" : "md:w-64"}
          flex flex-col
        `}
      >
        {/* Sidebar Header - Logo Area */}
        <div className={`flex-shrink-0 h-16 flex items-center px-4 border-b border-gray-100 bg-white`}>
          {!isSidebarCollapsed ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <img 
                  src={appLogo} 
                  alt="LawSetu Logo" 
                  className="h-8 w-auto object-contain"
                />
                <span className="text-lg font-bold text-gray-900">
                  Admin Panel
                </span>
              </div>
              <button
                onClick={toggleSidebarCollapse}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
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
                className="h-7 w-auto object-contain mx-auto"
              />
              <button
                onClick={toggleSidebarCollapse}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600 -mr-1"
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
              <p className="px-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
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
                    } px-2 py-2 rounded-lg text-sm transition-all ${
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                  title={isSidebarCollapsed ? item.label : ""}
                >
                  <item.icon className={`h-5 w-5 flex-shrink-0 ${isSidebarCollapsed ? "" : "mr-3"}`} />
                  {!isSidebarCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                  {!isSidebarCollapsed && item.badge > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                  {isSidebarCollapsed && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* Bottom Section - Logout */}
        <div className="flex-shrink-0 p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className={`flex items-center ${
              isSidebarCollapsed ? "justify-center" : "justify-start"
            } w-full px-2 py-2 rounded-lg text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all`}
            title={isSidebarCollapsed ? "Logout" : ""}
          >
            <LogOut className={`h-5 w-5 flex-shrink-0 ${isSidebarCollapsed ? "" : "mr-3"}`} />
            {!isSidebarCollapsed && (
              <span className="font-medium">Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${
        isSidebarCollapsed ? "md:ml-16" : "md:ml-64"
      }`}>
        {/* Desktop Header - Only Notifications */}
        <header className="hidden md:flex flex-shrink-0 bg-white border-b border-gray-200 h-16 items-center px-6 sticky top-0 z-30">
          <div className="flex items-center justify-end w-full">
            {/* Notifications - Desktop */}
            <div className="relative">
              <button
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-gray-700" />
                {pendingCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {pendingCount > 9 ? "9+" : pendingCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg border border-gray-200 shadow-xl z-50">
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="text-xs font-semibold text-gray-900">
                      Notifications
                    </h3>
                  </div>
                  <div className="p-3 text-center text-xs text-gray-500">
                    {pendingCount > 0 ? (
                      <div>
                        <p className="mb-1.5">
                          You have {pendingCount} pending lawyer {pendingCount === 1 ? 'application' : 'applications'}
                        </p>
                        <NavLink
                          to="/admin/pending-lawyers"
                          className="text-blue-600 hover:text-blue-700 text-[10px] font-medium"
                          onClick={() => setShowNotifications(false)}
                        >
                          View pending applications →
                        </NavLink>
                      </div>
                    ) : (
                      <p>No new notifications</p>
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
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex-shrink-0 bg-white border-t border-gray-200 py-3 px-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 space-y-2 md:space-y-0">
            <p>© {new Date().getFullYear()} LawSetu. All rights reserved.</p>
            <div className="flex items-center space-x-6">
              <button className="hover:text-gray-700 transition-colors">
                Privacy Policy
              </button>
              <button className="hover:text-gray-700 transition-colors">
                Terms of Service
              </button>
              <button className="hover:text-gray-700 transition-colors">
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