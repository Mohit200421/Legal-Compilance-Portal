import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Scale, Briefcase, Newspaper, TrendingUp, Award, UserCheck, FileText, Calendar, Clock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLawyers: 0,
    activeJobs: 0,
    newsPosts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardCounts();
  }, []);

  const fetchDashboardCounts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/dashboard-counts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data);
    } catch (error) {
      console.error("Dashboard API error:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: Scale,
      label: "Total Lawyers",
      value: stats.totalLawyers,
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
      lightBg: "bg-blue-50",
      iconColor: "text-blue-600",
      trend: "+12%"
    },
    {
      icon: Users,
      label: "Total Users",
      value: stats.totalUsers,
      color: "green",
      gradient: "from-green-500 to-green-600",
      lightBg: "bg-green-50",
      iconColor: "text-green-600",
      trend: "+8%"
    },
    {
      icon: Briefcase,
      label: "Active Jobs",
      value: stats.activeJobs,
      color: "purple",
      gradient: "from-purple-500 to-purple-600",
      lightBg: "bg-purple-50",
      iconColor: "text-purple-600",
      trend: "+15%"
    },
    {
      icon: Newspaper,
      label: "News Posts",
      value: stats.newsPosts,
      color: "orange",
      gradient: "from-orange-500 to-orange-600",
      lightBg: "bg-orange-50",
      iconColor: "text-orange-600",
      trend: "+5%"
    },
  ];

  const quickActions = [
    {
      to: "/admin/add-lawyer",
      icon: UserCheck,
      label: "Add New Lawyer",
      desc: "Create a new lawyer account",
      color: "blue"
    },
    {
      to: "/admin/pending-lawyers",
      icon: AlertCircle,
      label: "Pending Lawyers",
      desc: "Review lawyer applications",
      color: "yellow"
    },
    {
      to: "/admin/news",
      icon: Newspaper,
      label: "Manage News",
      desc: "Add or edit news posts",
      color: "purple"
    },
  ];

  const recentActivities = [
    { type: "lawyer", message: "New lawyer application received", time: "5 min ago", icon: Scale, color: "blue" },
    { type: "user", message: "New user registered", time: "1 hour ago", icon: Users, color: "green" },
    { type: "job", message: "New job posting added", time: "3 hours ago", icon: Briefcase, color: "purple" },
    { type: "news", message: "News article published", time: "1 day ago", icon: Newspaper, color: "orange" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg mb-3">
              <TrendingUp className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-xs font-semibold text-blue-600 tracking-wider">ADMIN DASHBOARD</span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
              Welcome back, Admin
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              Manage your platform, users, and content from one central location.
            </p>
          </div>
          
          {/* Stats Summary */}
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-xl border border-gray-200 px-4 py-2">
              <p className="text-xs text-gray-500">Total Records</p>
              <p className="text-lg font-bold text-gray-900">
                {stats.totalLawyers + stats.totalUsers + stats.activeJobs + stats.newsPosts}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
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
                  <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">
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
        {/* Left Column - Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <Award className="h-5 w-5 text-blue-600 mr-2" />
                Quick Actions
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    to={action.to}
                    className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 hover:shadow-md transition-all border border-gray-200 hover:border-blue-300"
                  >
                    <div className={`p-3 bg-${action.color}-100 rounded-lg w-fit mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-5 w-5 text-${action.color}-600`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{action.label}</h3>
                    <p className="text-xs text-gray-500 mb-3">{action.desc}</p>
                    <div className="flex items-center text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Go to page</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <Clock className="h-5 w-5 text-purple-600 mr-2" />
                Recent Activities
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 bg-${activity.color}-100 rounded-lg`}>
                        <Icon className={`h-4 w-4 text-${activity.color}-600`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Platform Overview */}
        <div className="space-y-6">
          {/* Platform Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Award className="h-5 w-5 text-green-600 mr-2" />
              Platform Overview
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-blue-100 rounded">
                    <Scale className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-600">Lawyers</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{stats.totalLawyers}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-green-100 rounded">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-600">Users</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{stats.totalUsers}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-purple-100 rounded">
                    <Briefcase className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-600">Active Jobs</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{stats.activeJobs}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-orange-100 rounded">
                    <Newspaper className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="text-sm text-gray-600">News Posts</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{stats.newsPosts}</span>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Total Records</span>
                  <span className="text-lg font-bold text-blue-600">
                    {stats.totalLawyers + stats.totalUsers + stats.activeJobs + stats.newsPosts}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              System Status
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Status</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-xs text-gray-500">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;