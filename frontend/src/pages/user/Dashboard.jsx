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
  Home
} from "lucide-react";

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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const res = await API.get("/user/dashboard-stats");
        setStats(res.data);
        
        // Mock recent activity - replace with actual API data when available
        setRecentActivity([
          { id: 1, type: "request", message: "Legal consultation request submitted", time: "2 hours ago", status: "pending", icon: FileText, color: "blue" },
          { id: 2, type: "article", message: "New article: 'Understanding IP Rights'", time: "5 hours ago", status: "read", icon: BookOpen, color: "purple" },
          { id: 3, type: "message", message: "Lawyer responded to your query", time: "1 day ago", status: "unread", icon: MessageSquare, color: "green" },
          { id: 4, type: "document", message: "Document uploaded: Case File", time: "2 days ago", status: "read", icon: FolderOpen, color: "orange" },
        ]);
      } catch (err) {
        console.log("Dashboard stats API not ready yet");
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
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
      lightBg: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      to: "/user/talk-to-lawyer",
      icon: MessageSquare,
      label: "Talk to Lawyer",
      desc: "Start a consultation request",
      color: "green",
      gradient: "from-green-500 to-green-600",
      lightBg: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      to: "/user/articles",
      icon: BookOpen,
      label: "Legal Articles",
      desc: "Latest legal articles & updates",
      color: "purple",
      gradient: "from-purple-500 to-purple-600",
      lightBg: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      to: "/user/events",
      icon: Calendar,
      label: "Events",
      desc: "Legal events & seminars",
      color: "orange",
      gradient: "from-orange-500 to-orange-600",
      lightBg: "bg-orange-50",
      iconColor: "text-orange-600"
    },
    {
      to: "/user/jobs",
      icon: Briefcase,
      label: "Jobs",
      desc: "Explore law internships & jobs",
      color: "teal",
      gradient: "from-teal-500 to-teal-600",
      lightBg: "bg-teal-50",
      iconColor: "text-teal-600"
    },
    {
      to: "/user/documents",
      icon: FolderOpen,
      label: "Documents",
      desc: "View uploaded legal documents",
      color: "indigo",
      gradient: "from-indigo-500 to-indigo-600",
      lightBg: "bg-indigo-50",
      iconColor: "text-indigo-600"
    },
  ];

  const statCards = [
    { 
      label: "Total Requests", 
      value: stats.totalRequests, 
      icon: FileText, 
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
      lightBg: "bg-blue-50",
      iconColor: "text-blue-600",
      trend: "+12%"
    },
    { 
      label: "Pending", 
      value: stats.pendingRequests, 
      icon: Clock, 
      color: "yellow",
      gradient: "from-yellow-500 to-yellow-600",
      lightBg: "bg-yellow-50",
      iconColor: "text-yellow-600",
      trend: "0%"
    },
    { 
      label: "Accepted", 
      value: stats.acceptedRequests, 
      icon: CheckCircle, 
      color: "green",
      gradient: "from-green-500 to-green-600",
      lightBg: "bg-green-50",
      iconColor: "text-green-600",
      trend: "+8%"
    },
    { 
      label: "Articles", 
      value: stats.totalArticles, 
      icon: BookOpen, 
      color: "purple",
      gradient: "from-purple-500 to-purple-600",
      lightBg: "bg-purple-50",
      iconColor: "text-purple-600",
      trend: "+5%"
    },
  ];

  const getActivityIcon = (type) => {
    switch(type) {
      case "request": return FileText;
      case "article": return BookOpen;
      case "message": return MessageSquare;
      case "document": return FolderOpen;
      default: return Activity;
    }
  };

  const getActivityColor = (type) => {
    switch(type) {
      case "request": return "blue";
      case "article": return "purple";
      case "message": return "green";
      case "document": return "orange";
      default: return "gray";
    }
  };

  const formatTimeAgo = (dateString) => {
    // This is a mock function - implement actual time ago logic
    return dateString;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Welcome Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg mb-3">
              <Scale className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-xs font-semibold text-blue-600 tracking-wider">USER DASHBOARD</span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
              Welcome back, <span className="text-blue-600">{user?.name?.split(' ')[0] || "User"}</span>
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Manage your legal requests, read articles, and explore services.
            </p>
          </div>
          
          {/* User Quick Info */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-900">{user?.name || "User"}</p>
              <p className="text-[10px] text-gray-500">{user?.email || "No email"}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-sm font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 ${stat.lightBg} rounded-lg group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-4 w-4 md:h-5 md:w-5 ${stat.iconColor}`} />
                </div>
                {stat.trend && (
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                    stat.trend.includes('+') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {stat.trend}
                  </span>
                )}
              </div>
              <p className="text-xs md:text-sm text-gray-500 mb-1">{stat.label}</p>
              {loading ? (
                <div className="h-7 w-16 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</p>
              )}
              <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full`} style={{ width: '70%' }}></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Quick Actions & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions Grid */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                Quick Actions
              </h2>
              <span className="text-xs text-gray-400">Frequently used</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    to={action.to}
                    className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 hover:shadow-md transition-all border border-gray-200 hover:border-blue-300"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2.5 ${action.lightBg} rounded-lg group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-4 w-4 ${action.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition">
                          {action.label}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{action.desc}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <Activity className="h-5 w-5 text-blue-600 mr-2" />
                Recent Activity
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            <div className="space-y-3">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                const color = activity.color;
                return (
                  <div key={activity.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 bg-${color}-100 rounded-lg`}>
                        <Icon className={`h-4 w-4 text-${color}-600`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                    {activity.status === 'unread' && (
                      <span className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded-full">New</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Profile & Tips */}
        <div className="space-y-6">
          {/* Account Info Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 text-purple-600 mr-2" />
              Account Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-xl font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{user?.name || "User"}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Member since 2024</p>
                  <div className="flex items-center mt-1.5">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                      Online
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-xs text-gray-600">{user?.email || "No email"}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Shield className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-xs text-gray-600">
                    Role: <span className="font-medium capitalize text-blue-600">{user?.role || "user"}</span>
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Award className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-xs text-gray-600">Verified Account</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tip Card */}
          <div className="bg-blue-50 border-l-4 border-blue-600 rounded-xl p-5">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-blue-900 mb-2">Pro Tip</h3>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Keep your request details clear and specific. Include relevant documents and deadlines to help lawyers respond faster.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
              <Target className="h-4 w-4 text-green-600 mr-2" />
              This Month
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Requests</span>
                <span className="text-sm font-bold text-gray-900">{stats.totalRequests || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-blue-700 h-1.5 rounded-full" 
                  style={{ width: `${Math.min((stats.acceptedRequests / (stats.totalRequests || 1)) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Accepted: <span className="font-medium text-gray-900">{stats.acceptedRequests || 0}</span></span>
                <span className="text-gray-500">Pending: <span className="font-medium text-gray-900">{stats.pendingRequests || 0}</span></span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
              <Sparkles className="h-4 w-4 text-yellow-500 mr-2" />
              Popular Articles
            </h3>
            <div className="space-y-2">
              <Link to="/user/articles/1" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <span className="text-xs text-gray-600">Understanding IP Rights</span>
                <ChevronRight className="h-3 w-3 text-gray-400" />
              </Link>
              <Link to="/user/articles/2" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <span className="text-xs text-gray-600">Rent Agreement Guide</span>
                <ChevronRight className="h-3 w-3 text-gray-400" />
              </Link>
              <Link to="/user/articles/3" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <span className="text-xs text-gray-600">Will & Testament Basics</span>
                <ChevronRight className="h-3 w-3 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}