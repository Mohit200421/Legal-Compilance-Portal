import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Scale,
  Briefcase,
  Calendar,
  Newspaper,
  Database,
  LogOut,
  Menu,
  X,
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
  AlertCircle
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { setUser, user } = useContext(AuthContext);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const navItems = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/admin/dashboard", icon: Home, label: "Main Dashboard" },
    {
      to: "/admin/pending-lawyers",
      icon: Clock,
      label: "Pending Lawyers",
      badge: pendingCount,
    },
    { to: "/admin/add-lawyer", icon: User, label: "Add Lawyer" },
    { to: "/admin/lawyers", icon: Users, label: "Manage Lawyers" },
    { to: "/admin/users", icon: Users, label: "Manage Users" },
    { to: "/admin/jobs", icon: Briefcase, label: "Manage Jobs" },
    { to: "/admin/events", icon: Calendar, label: "Manage Events" },
    { to: "/admin/news", icon: Newspaper, label: "Manage News" },
    { to: "/admin/master", icon: Database, label: "Master Data" },
    { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  ];

  const quickActions = [
    { to: "/admin/settings", label: "Settings", icon: Settings },
    { to: "/admin/help", label: "Help Center", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex overflow-hidden">
      {/* Mobile Header - Compact */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 px-3 py-2 flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-gray-700" />
        </button>
        
        <div className="flex items-center space-x-1.5">
          <Shield className="h-4 w-4 text-blue-600" />
          <span className="font-semibold text-sm text-gray-900">Admin Panel</span>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4 text-gray-700" />
            {pendingCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-3.5 h-3.5 flex items-center justify-center rounded-full">
                {pendingCount > 9 ? "9+" : pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:relative md:shadow-xl
          flex flex-col
        `}
      >
        {/* Sidebar Header - Compact */}
        <div className="flex-shrink-0 h-14 flex items-center justify-between px-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white">Admin Panel</span>
          </div>
          <button
            className="md:hidden text-white/80 hover:text-white transition-colors"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Admin Profile Card - Compact */}
        <div className="flex-shrink-0 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
              <Award className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">
                {user?.name || "Admin"}
              </p>
              <p className="text-[10px] text-gray-600 truncate">
                Administrator
              </p>
              <div className="flex items-center mt-1">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-medium bg-green-100 text-green-800">
                  ● Online
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="space-y-0.5">
            <p className="px-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Main Menu
            </p>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center justify-between px-2 py-2 rounded-lg text-xs transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <item.icon className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate font-medium">{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Quick Actions & Logout - Compact */}
        <div className="flex-shrink-0 p-3 border-t border-gray-200 bg-gray-50">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <NavLink
                key={index}
                to={action.to}
                className="flex items-center space-x-2 w-full px-2 py-2 rounded-lg text-xs text-gray-700 hover:bg-gray-200 transition-colors mb-0.5"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon className="h-3.5 w-3.5 flex-shrink-0 text-gray-500" />
                <span className="truncate font-medium">{action.label}</span>
              </NavLink>
            );
          })}

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 w-full px-2 py-2 rounded-lg text-xs text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all shadow-md mt-1"
          >
            <LogOut className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden md:ml-0">
        {/* Desktop Header - Compact */}
        <header className="hidden md:flex flex-shrink-0 bg-white border-b border-gray-200 h-14 items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center">
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-gray-500">Admin Portal</span>
              <ChevronRight className="h-3 w-3 text-gray-400" />
              <span className="text-gray-900 font-medium">Dashboard</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative">
              <button
                className="relative p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4 text-gray-700" />
                {pendingCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-3.5 h-3.5 flex items-center justify-center rounded-full">
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

            {/* User Menu - Compact */}
            <div className="flex items-center space-x-2 pl-3 border-l border-gray-200">
              <div className="text-right">
                <p className="text-xs font-semibold text-gray-900 truncate max-w-[150px]">
                  {user?.name || "Admin"}
                </p>
                <p className="text-[10px] text-gray-500 truncate max-w-[150px]">
                  Administrator
                </p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <Shield className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Header Spacer */}
        <div className="md:hidden h-12"></div>

        {/* Page Content - Scrollable */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>

        {/* Footer - Compact */}
        <footer className="flex-shrink-0 bg-white border-t border-gray-200 py-2 px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-[10px] text-gray-500 space-y-1 md:space-y-0">
            <p>
              © {new Date().getFullYear()} LawSetu
            </p>
            <div className="flex items-center space-x-4">
              <button className="hover:text-gray-700 transition-colors">
                Privacy
              </button>
              <button className="hover:text-gray-700 transition-colors">
                Terms
              </button>
              <button className="hover:text-gray-700 transition-colors">
                Help
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;