import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import {
  FileText,
  Users,
  Calendar,
  Briefcase,
  FolderOpen,
  Star,
  Search,
  MessageSquare,
  Scale,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  BookOpen,
  Award,
  Shield,
  Gavel,
  Sparkles,
  Zap,
  Activity,
  Target,
  Eye,
  Download,
  Share2,
  ChevronRight,
  Home,
} from "lucide-react";

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

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    acceptedRequests: 0,
    totalArticles: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  // Glassmorphism card style
  const glassCardClass =
    "bg-white/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(30,41,59,0.05)] border border-white/50";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const res = await API.get("/user/dashboard-stats");

        // Map API response to frontend expected format
        const data = res.data;
        setStats({
          totalRequests: data.requestsCount || 0,
          pendingRequests:
            data.recentRequests?.filter(
              (r) => r.status === "Pending" || r.status === "Pending"
            ).length || 0,
          acceptedRequests:
            data.recentRequests?.filter(
              (r) => r.status === "Accepted" || r.status === "PAYMENT_VERIFIED"
            ).length || 0,
          totalArticles: data.articlesCount || 0,
        });

        setRecentActivity([
          {
            id: 1,
            type: "request",
            message: "Legal consultation request submitted",
            time: "2 hours ago",
            status: "pending",
            icon: FileText,
            color: colors.secondary,
          },
          {
            id: 2,
            type: "article",
            message: "New article: 'Understanding IP Rights'",
            time: "5 hours ago",
            status: "read",
            icon: BookOpen,
            color: colors.tertiary,
          },
          {
            id: 3,
            type: "message",
            message: "Lawyer responded to your query",
            time: "1 day ago",
            status: "unread",
            icon: MessageSquare,
            color: "#4caf50",
          },
          {
            id: 4,
            type: "document",
            message: "Document uploaded: Case File",
            time: "2 days ago",
            status: "read",
            icon: FolderOpen,
            color: colors.error,
          },
        ]);
      } catch (err) {
        console.log("Error fetching dashboard stats:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const quickActions = [
    {
      to: "/user/search-lawyer",
      icon: Search,
      label: "Search Lawyer",
      desc: "Find lawyers by specialization & city",
      color: colors.secondary,
    },
    {
      to: "/user/talk-to-lawyer",
      icon: MessageSquare,
      label: "Talk to Lawyer",
      desc: "Start a consultation request",
      color: "#4caf50",
    },
    {
      to: "/user/articles",
      icon: BookOpen,
      label: "Legal Articles",
      desc: "Latest legal articles & updates",
      color: colors.tertiary,
    },
    {
      to: "/user/events",
      icon: Calendar,
      label: "Events",
      desc: "Legal events & seminars",
      color: colors.error,
    },
    {
      to: "/user/jobs",
      icon: Briefcase,
      label: "Jobs",
      desc: "Explore law internships & jobs",
      color: colors.secondary,
    },
    {
      to: "/user/documents",
      icon: FolderOpen,
      label: "Documents",
      desc: "View uploaded legal documents",
      color: colors.onSurfaceVariant,
    },
  ];

  const statCards = [
    {
      label: "Total Requests",
      value: stats.totalRequests,
      icon: FileText,
      color: colors.secondary,
      trend: "+12%",
    },
    {
      label: "Pending",
      value: stats.pendingRequests,
      icon: Clock,
      color: colors.tertiary,
      trend: "0%",
    },
    {
      label: "Accepted",
      value: stats.acceptedRequests,
      icon: CheckCircle,
      color: "#4caf50",
      trend: "+8%",
    },
    {
      label: "Articles",
      value: stats.totalArticles,
      icon: BookOpen,
      color: colors.secondary,
      trend: "+5%",
    },
  ];

  return (
    <div
      className="min-h-screen p-4 md:p-6"
      style={{ backgroundColor: colors.surface }}
    >
      {/* Welcome Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div
              className="inline-flex items-center px-3 py-1.5 rounded-lg mb-3"
              style={{
                backgroundColor: `${colors.secondary}10`,
                border: `1px solid ${colors.secondary}20`,
              }}
            >
              <Scale
                className="h-4 w-4 mr-2"
                style={{ color: colors.secondary }}
              />
              <span
                className="text-xs font-semibold tracking-wider"
                style={{ color: colors.secondary }}
              >
                USER DASHBOARD
              </span>
            </div>
            <h1
              className="text-xl md:text-2xl lg:text-3xl font-bold leading-[1.2] tracking-[-0.02em]"
              style={{ color: colors.onSurface }}
            >
              Welcome back,{" "}
              <span style={{ color: colors.secondary }}>
                {user?.name?.split(" ")[0] || "User"}
              </span>
            </h1>
            <p
              className="text-xs md:text-sm mt-1"
              style={{ color: colors.onSurfaceVariant }}
            >
              Manage your legal requests, read articles, and explore services.
            </p>
          </div>

          {/* User Quick Info - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="text-right">
              <p
                className="text-xs font-semibold"
                style={{ color: colors.onSurface }}
              >
                {user?.name || "User"}
              </p>
              <p
                className="text-[10px]"
                style={{ color: colors.onSurfaceVariant }}
              >
                {user?.email || "No email"}
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
              style={{
                background: `linear-gradient(135deg, ${colors.secondary}, ${colors.secondaryContainer})`,
              }}
            >
              <span className="text-sm font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Glass Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${glassCardClass} p-4 md:p-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)] group`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="p-2.5 rounded-lg group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <Icon
                    className="h-4 w-4 md:h-5 md:w-5"
                    style={{ color: stat.color }}
                  />
                </div>
                {stat.trend && (
                  <span
                    className="text-xs font-medium px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: stat.trend.includes("+")
                        ? "#4caf5015"
                        : `${colors.error}15`,
                      color: stat.trend.includes("+")
                        ? "#4caf50"
                        : colors.error,
                    }}
                  >
                    {stat.trend}
                  </span>
                )}
              </div>
              <p
                className="text-xs md:text-sm mb-1"
                style={{ color: colors.onSurfaceVariant }}
              >
                {stat.label}
              </p>
              {loading ? (
                <div
                  className="h-7 w-16 rounded animate-pulse"
                  style={{ backgroundColor: colors.surfaceContainerHighest }}
                ></div>
              ) : (
                <p
                  className="text-xl md:text-2xl font-bold"
                  style={{ color: colors.onSurface }}
                >
                  {stat.value}
                </p>
              )}
              <div
                className="mt-2 h-1 w-full rounded-full overflow-hidden"
                style={{ backgroundColor: colors.surfaceContainerHighest }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: "70%", backgroundColor: stat.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Quick Actions & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions Grid - Glass Card */}
          <div
            className={`${glassCardClass} p-5 md:p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)]`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-lg font-bold flex items-center"
                style={{ color: colors.onSurface }}
              >
                <Zap
                  className="h-5 w-5 mr-2"
                  style={{ color: colors.tertiary }}
                />
                Quick Actions
              </h2>
              <span
                className="text-xs"
                style={{ color: colors.onSurfaceVariant }}
              >
                Frequently used
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    to={action.to}
                    className="group rounded-xl p-4 transition-all duration-300 hover:shadow-md"
                    style={{
                      backgroundColor: colors.surfaceContainerLow,
                      border: `1px solid ${colors.outlineVariant}`,
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className="p-2.5 rounded-lg group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: `${action.color}15` }}
                      >
                        <Icon
                          className="h-4 w-4"
                          style={{ color: action.color }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3
                          className="text-sm font-bold transition-colors group-hover:text-secondary"
                          style={{ color: colors.onSurface }}
                        >
                          {action.label}
                        </h3>
                        <p
                          className="text-xs mt-1 line-clamp-2"
                          style={{ color: colors.onSurfaceVariant }}
                        >
                          {action.desc}
                        </p>
                      </div>
                      <ArrowRight
                        className="h-4 w-4 transition-all group-hover:translate-x-1"
                        style={{ color: colors.outline }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Activity - Glass Card */}
          <div
            className={`${glassCardClass} p-5 md:p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)]`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-lg font-bold flex items-center"
                style={{ color: colors.onSurface }}
              >
                <Activity
                  className="h-5 w-5 mr-2"
                  style={{ color: colors.secondary }}
                />
                Recent Activity
              </h2>
              <button
                className="text-sm font-medium flex items-center transition-colors"
                style={{ color: colors.secondary }}
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            <div className="space-y-3">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-surfaceContainerLow"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${activity.color}15` }}
                      >
                        <Icon
                          className="h-4 w-4"
                          style={{ color: activity.color }}
                        />
                      </div>
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: colors.onSurface }}
                        >
                          {activity.message}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: colors.onSurfaceVariant }}
                        >
                          {activity.time}
                        </p>
                      </div>
                    </div>
                    {activity.status === "unread" && (
                      <span
                        className="text-[10px] px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: colors.secondary,
                          color: "white",
                        }}
                      >
                        New
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Profile & Tips */}
        <div className="space-y-6">
          {/* Account Info Card - Glass Card */}
          <div
            className={`${glassCardClass} p-5 md:p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)]`}
          >
            <h2
              className="text-lg font-bold mb-4 flex items-center"
              style={{ color: colors.onSurface }}
            >
              <User
                className="h-5 w-5 mr-2"
                style={{ color: colors.secondary }}
              />
              Account Information
            </h2>

            <div className="space-y-4">
              <div
                className="flex items-center space-x-3 pb-4"
                style={{ borderBottom: `1px solid ${colors.outlineVariant}` }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center shadow-md"
                  style={{
                    background: `linear-gradient(135deg, ${colors.secondary}, ${colors.secondaryContainer})`,
                  }}
                >
                  <span className="text-xl font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-bold" style={{ color: colors.onSurface }}>
                    {user?.name || "User"}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    Member since 2024
                  </p>
                  <div className="flex items-center mt-1.5">
                    <span
                      className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                      style={{ backgroundColor: "#4caf5015", color: "#4caf50" }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full mr-1"
                        style={{ backgroundColor: "#4caf50" }}
                      />
                      Online
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail
                    className="h-4 w-4 mr-3"
                    style={{ color: colors.outline }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    {user?.email || "No email"}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Shield
                    className="h-4 w-4 mr-3"
                    style={{ color: colors.outline }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    Role:{" "}
                    <span
                      className="font-medium capitalize"
                      style={{ color: colors.secondary }}
                    >
                      {user?.role || "user"}
                    </span>
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Award
                    className="h-4 w-4 mr-3"
                    style={{ color: colors.outline }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    Verified Account
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tip Card */}
          <div
            className="rounded-xl p-5"
            style={{
              backgroundColor: `${colors.secondary}10`,
              borderLeft: `4px solid ${colors.secondary}`,
            }}
          >
            <div className="flex items-start space-x-3">
              <AlertCircle
                className="h-5 w-5 flex-shrink-0 mt-0.5"
                style={{ color: colors.secondary }}
              />
              <div>
                <h3
                  className="text-sm font-bold mb-2"
                  style={{ color: colors.onSurface }}
                >
                  Pro Tip
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  Keep your request details clear and specific. Include relevant
                  documents and deadlines to help lawyers respond faster.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats - Glass Card */}
          <div
            className={`${glassCardClass} p-5 md:p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)]`}
          >
            <h3
              className="text-sm font-bold mb-3 flex items-center"
              style={{ color: colors.onSurface }}
            >
              <Target className="h-4 w-4 mr-2" style={{ color: "#4caf50" }} />
              This Month
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span
                  className="text-xs"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  Requests
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: colors.onSurface }}
                >
                  {stats.totalRequests || 0}
                </span>
              </div>
              <div
                className="w-full rounded-full h-1.5 overflow-hidden"
                style={{ backgroundColor: colors.surfaceContainerHighest }}
              >
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      (stats.acceptedRequests / (stats.totalRequests || 1)) *
                        100,
                      100
                    )}%`,
                    background: `linear-gradient(90deg, ${colors.secondary}, ${colors.secondaryContainer})`,
                  }}
                />
              </div>
              <div className="flex justify-between items-center text-xs">
                <span style={{ color: colors.onSurfaceVariant }}>
                  Accepted:{" "}
                  <span
                    className="font-medium"
                    style={{ color: colors.onSurface }}
                  >
                    {stats.acceptedRequests || 0}
                  </span>
                </span>
                <span style={{ color: colors.onSurfaceVariant }}>
                  Pending:{" "}
                  <span
                    className="font-medium"
                    style={{ color: colors.onSurface }}
                  >
                    {stats.pendingRequests || 0}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Popular Articles - Glass Card */}
          <div
            className={`${glassCardClass} p-5 md:p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)]`}
          >
            <h3
              className="text-sm font-bold mb-3 flex items-center"
              style={{ color: colors.onSurface }}
            >
              <Sparkles
                className="h-4 w-4 mr-2"
                style={{ color: colors.tertiary }}
              />
              Popular Articles
            </h3>
            <div className="space-y-2">
              <Link
                to="/user/articles/1"
                className="flex items-center justify-between p-2 rounded-lg transition-colors hover:bg-surfaceContainerLow"
              >
                <span
                  className="text-xs"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  Understanding IP Rights
                </span>
                <ChevronRight
                  className="h-3 w-3"
                  style={{ color: colors.outline }}
                />
              </Link>
              <Link
                to="/user/articles/2"
                className="flex items-center justify-between p-2 rounded-lg transition-colors hover:bg-surfaceContainerLow"
              >
                <span
                  className="text-xs"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  Rent Agreement Guide
                </span>
                <ChevronRight
                  className="h-3 w-3"
                  style={{ color: colors.outline }}
                />
              </Link>
              <Link
                to="/user/articles/3"
                className="flex items-center justify-between p-2 rounded-lg transition-colors hover:bg-surfaceContainerLow"
              >
                <span
                  className="text-xs"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  Will & Testament Basics
                </span>
                <ChevronRight
                  className="h-3 w-3"
                  style={{ color: colors.outline }}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
