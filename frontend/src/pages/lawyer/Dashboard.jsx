import { useEffect, useState } from "react";
import API from "../../api/axios";
import { getMyProfile } from "../../api/lawyerApi";

import {
  FileText,
  FolderOpen,
  Briefcase,
  Calendar,
  Users,
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
  Award,
  Shield,
  Gavel,
  BookOpen,
  Star,
  BarChart3,
  ChevronRight,
  Eye,
  Download,
  MessageSquare,
  Bell,
} from "lucide-react";

export default function LawyerDashboard() {
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [showMobilePeriodSelector, setShowMobilePeriodSelector] =
    useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await API.get("/lawyer/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();
        setProfile(res.data.data);
      } catch (err) {
        console.log("Profile load error:", err);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <Scale className="h-8 w-8 text-blue-600 absolute top-6 left-1/2 transform -translate-x-1/2 animate-pulse" />
          </div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
          <p className="text-xs text-gray-400 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Articles",
      value: stats?.totalArticles || 0,
      icon: FileText,
      gradient: "from-blue-500 to-blue-600",
      lightBg: "bg-blue-50",
      iconColor: "text-blue-600",
      trend: "+12%",
      trendUp: true,
    },
    {
      label: "Total Documents",
      value: stats?.totalDocuments || 0,
      icon: FolderOpen,
      gradient: "from-green-500 to-green-600",
      lightBg: "bg-green-50",
      iconColor: "text-green-600",
      trend: "+8%",
      trendUp: true,
    },
    {
      label: "Total Cases",
      value: stats?.totalCases || 0,
      icon: Briefcase,
      gradient: "from-purple-500 to-purple-600",
      lightBg: "bg-purple-50",
      iconColor: "text-purple-600",
      trend: "+15%",
      trendUp: true,
    },
    {
      label: "Active Cases",
      value: stats?.activeCases || 0,
      icon: Gavel,
      gradient: "from-orange-500 to-orange-600",
      lightBg: "bg-orange-50",
      iconColor: "text-orange-600",
      trend: "+5%",
      trendUp: true,
    },
  ];

  const caseStats = [
    {
      label: "Active Cases",
      value: stats?.activeCases || 0,
      color: "bg-blue-600",
      lightColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      label: "Pending",
      value: stats?.pendingCases || 0,
      color: "bg-yellow-500",
      lightColor: "bg-yellow-100",
      textColor: "text-yellow-600",
    },
    {
      label: "Completed",
      value: stats?.completedCases || 0,
      color: "bg-green-500",
      lightColor: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      label: "Urgent",
      value: stats?.urgentCases || 0,
      color: "bg-red-500",
      lightColor: "bg-red-100",
      textColor: "text-red-600",
    },
  ];

  const recentActivities = [
    {
      type: "case",
      message: "New case assigned: Smith vs. Corporation",
      time: "2 hours ago",
      icon: Briefcase,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      type: "document",
      message: "Document uploaded: Evidence A",
      time: "5 hours ago",
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      type: "message",
      message: "New message from client: John Doe",
      time: "1 day ago",
      icon: MessageSquare,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      type: "event",
      message: "Hearing scheduled for tomorrow",
      time: "1 day ago",
      icon: Calendar,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section - Mobile Optimized */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-lg mb-3">
              <Scale className="h-4 w-4 text-purple-600 mr-2" />
              <span className="text-xs font-semibold text-purple-600 tracking-wider">
                LAWYER DASHBOARD
              </span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
              Welcome back,{" "}
              <span className="text-blue-600">
                Adv. {profile?.name?.split(" ")[0] || "Lawyer"}
              </span>
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1 max-w-2xl">
              Manage your cases, documents, and legal practice from one central
              location.
            </p>
          </div>

          {/* Period Selector - Desktop */}
          <div className="hidden md:flex items-center space-x-1 bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
            {["week", "month", "year"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  selectedPeriod === period
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>

          {/* Period Selector - Mobile */}
          <div className="md:hidden">
            <button
              onClick={() =>
                setShowMobilePeriodSelector(!showMobilePeriodSelector)
              }
              className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2.5"
            >
              <span className="text-sm font-medium text-gray-700">
                Period:{" "}
                {selectedPeriod.charAt(0).toUpperCase() +
                  selectedPeriod.slice(1)}
              </span>
              <ChevronRight
                className={`h-4 w-4 text-gray-500 transition-transform ${
                  showMobilePeriodSelector ? "rotate-90" : ""
                }`}
              />
            </button>

            {showMobilePeriodSelector && (
              <div className="absolute mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {["week", "month", "year"].map((period) => (
                  <button
                    key={period}
                    onClick={() => {
                      setSelectedPeriod(period);
                      setShowMobilePeriodSelector(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm ${
                      selectedPeriod === period
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    } ${period !== "year" ? "border-b border-gray-100" : ""}`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards Grid - Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`p-2.5 ${stat.lightBg} rounded-lg group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`h-4 w-4 md:h-5 md:w-5 ${stat.iconColor}`} />
                </div>
                {stat.trend && (
                  <span
                    className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                      stat.trendUp
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {stat.trend}
                  </span>
                )}
              </div>
              <p className="text-xs md:text-sm text-gray-500 mb-1">
                {stat.label}
              </p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                {stat.value}
              </p>
              <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full`}
                  style={{ width: "70%" }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Case Distribution & Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case Distribution Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  Case Distribution
                </h2>
              </div>
              <select className="px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none">
                <option>This Month</option>
                <option>This Quarter</option>
                <option>This Year</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
              {caseStats.map((stat, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">{stat.label}</span>
                    <span className={`text-sm font-bold ${stat.textColor}`}>
                      {stat.value}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`${stat.color} h-2.5 rounded-full transition-all duration-500`}
                      style={{
                        width: `${
                          (stat.value / (stats?.totalCases || 1)) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                <p className="text-2xl md:text-3xl font-bold text-blue-600">
                  {stats?.totalClients || 0}
                </p>
                <p className="text-xs text-gray-600 mt-1">Total Clients</p>
                <div className="flex items-center justify-center mt-2 text-green-600 text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+12%</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
                <p className="text-2xl md:text-3xl font-bold text-green-600">
                  {stats?.successRate || 0}%
                </p>
                <p className="text-xs text-gray-600 mt-1">Success Rate</p>
                <div className="flex items-center justify-center mt-2 text-green-600 text-xs">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  <span>Excellent</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Cases Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Briefcase className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  Recent Cases
                </h2>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center group">
                View All
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {stats?.recentCases?.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No recent cases</p>
                <p className="text-xs text-gray-400 mt-1">
                  New cases will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.recentCases?.map((caseItem, index) => (
                  <div
                    key={caseItem._id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {caseItem.caseTitle}
                          </h4>
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              caseItem.status === "Active"
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : caseItem.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                : "bg-gray-100 text-gray-700 border border-gray-200"
                            }`}
                          >
                            {caseItem.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-500">
                          <span className="flex items-center">
                            <User className="h-3 w-3 mr-1 text-gray-400" />
                            {caseItem.clientName || "Client Name"}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                            {caseItem.filingDate
                              ? new Date(
                                  caseItem.filingDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                      <button className="sm:self-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Upcoming Events & Profile */}
        <div className="space-y-6">
          {/* Upcoming Events Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Upcoming Events
              </h2>
            </div>

            {stats?.upcomingEvents?.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No upcoming events</p>
                <p className="text-xs text-gray-400 mt-1">
                  Schedule new events to see them here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.upcomingEvents?.map((event, index) => (
                  <div
                    key={event._id}
                    className="border-l-4 border-orange-500 bg-orange-50/30 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <h4 className="font-bold text-gray-900 mb-2">
                      {event.eventTitle}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Briefcase className="h-3 w-3 mr-2 text-gray-400" />
                        <span className="text-xs">
                          Case: {event.caseId?.caseTitle || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <User className="h-3 w-3 mr-2 text-gray-400" />
                        <span className="text-xs">
                          Client: {event.caseId?.clientName || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-3 w-3 mr-2 text-gray-400" />
                        <span className="text-xs">
                          {event.eventDate
                            ? new Date(event.eventDate).toLocaleString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  Recent Activity
                </h2>
              </div>
              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className={`p-2 ${activity.bg} rounded-lg`}>
                      <Icon className={`h-3 w-3 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Profile Summary Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Profile Summary
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  {profile?.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-white">
                      {profile?.name?.charAt(0) || "L"}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900">
                    Adv. {profile?.name || "Lawyer"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Bar ID: {profile?.barCouncilId || "N/A"}
                  </p>
                  <div className="flex items-center mt-1.5">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                      Online
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-[10px] text-gray-500 mb-1">Experience</p>
                  <p className="text-sm font-bold text-gray-900">
                    {profile?.experience || 0} years
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-[10px] text-gray-500 mb-1">Cases Won</p>
                  <p className="text-sm font-bold text-green-600">
                    {stats?.casesWon || 0}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-xs text-gray-600 truncate">
                    {profile?.email || "No email"}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-xs text-gray-600">
                    {profile?.phone || "No phone"}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-xs text-gray-600 truncate">
                    {profile?.location?.city || ""},{" "}
                    {profile?.location?.state || ""}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Award className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-xs text-gray-600">
                    Rating: {stats?.rating || "4.8"} ★
                  </span>
                </div>
              </div>

              {/* Specialization Tags */}
              <div className="pt-3 border-t border-gray-100">
                <p className="text-[10px] text-gray-500 mb-2">
                  Specializations
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {stats?.specializations?.length > 0 ? (
                    stats.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-medium border border-blue-100"
                      >
                        {spec}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">
                      No specializations added
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
