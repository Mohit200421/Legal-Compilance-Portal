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
  Sparkles,
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

export default function LawyerDashboard() {
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [showMobilePeriodSelector, setShowMobilePeriodSelector] = useState(false);

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

  // Glassmorphism card style
  const glassCardClass = "bg-white/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(30,41,59,0.05)] border border-white/50";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: colors.surface }}>
        <div className={`${glassCardClass} p-8 max-w-sm w-full text-center`}>
          <div className="relative">
            <div 
              className="w-20 h-20 rounded-full animate-spin mx-auto mb-4"
              style={{ 
                border: `4px solid ${colors.surfaceContainerHighest}`,
                borderTopColor: colors.secondary
              }}
            />
            <Scale className="h-8 w-8 absolute top-6 left-1/2 transform -translate-x-1/2 animate-pulse" style={{ color: colors.secondary }} />
          </div>
          <p className="font-medium" style={{ color: colors.onSurface }}>Loading your dashboard...</p>
          <p className="text-xs mt-2" style={{ color: colors.onSurfaceVariant }}>Please wait</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Articles",
      value: stats?.totalArticles || 0,
      icon: FileText,
      color: colors.secondary,
      trend: "+12%",
      trendUp: true,
    },
    {
      label: "Total Documents",
      value: stats?.totalDocuments || 0,
      icon: FolderOpen,
      color: "#4caf50",
      trend: "+8%",
      trendUp: true,
    },
    {
      label: "Total Cases",
      value: stats?.totalCases || 0,
      icon: Briefcase,
      color: colors.tertiary,
      trend: "+15%",
      trendUp: true,
    },
    {
      label: "Active Cases",
      value: stats?.activeCases || 0,
      icon: Gavel,
      color: colors.secondary,
      trend: "+5%",
      trendUp: true,
    },
  ];

  const caseStats = [
    {
      label: "Active Cases",
      value: stats?.activeCases || 0,
      color: colors.secondary,
      lightColor: `${colors.secondary}15`,
    },
    {
      label: "Pending",
      value: stats?.pendingCases || 0,
      color: colors.tertiary,
      lightColor: `${colors.tertiary}15`,
    },
    {
      label: "Completed",
      value: stats?.completedCases || 0,
      color: "#4caf50",
      lightColor: "#4caf5015",
    },
    {
      label: "Urgent",
      value: stats?.urgentCases || 0,
      color: colors.error,
      lightColor: `${colors.error}15`,
    },
  ];

  const recentActivities = [
    {
      type: "case",
      message: "New case assigned: Smith vs. Corporation",
      time: "2 hours ago",
      icon: Briefcase,
      color: colors.secondary,
    },
    {
      type: "document",
      message: "Document uploaded: Evidence A",
      time: "5 hours ago",
      icon: FileText,
      color: "#4caf50",
    },
    {
      type: "message",
      message: "New message from client: John Doe",
      time: "1 day ago",
      icon: MessageSquare,
      color: colors.tertiary,
    },
    {
      type: "event",
      message: "Hearing scheduled for tomorrow",
      time: "1 day ago",
      icon: Calendar,
      color: colors.error,
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.surface }}>
      {/* Header Section */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div 
              className="inline-flex items-center px-3 py-1.5 rounded-lg mb-3"
              style={{ 
                backgroundColor: `${colors.secondary}10`,
                border: `1px solid ${colors.secondary}20`
              }}
            >
              <Sparkles className="h-4 w-4 mr-2" style={{ color: colors.secondary }} />
              <span className="text-xs font-semibold tracking-wider" style={{ color: colors.secondary }}>
                LAWYER DASHBOARD
              </span>
            </div>
            <h1 
              className="text-xl md:text-2xl lg:text-3xl font-bold leading-[1.2] tracking-[-0.02em]"
              style={{ color: colors.onSurface }}
            >
              Welcome back,{" "}
              <span style={{ color: colors.secondary }}>
                Adv. {profile?.name?.split(" ")[0] || "Lawyer"}
              </span>
            </h1>
            <p className="text-xs md:text-sm mt-1 max-w-2xl" style={{ color: colors.onSurfaceVariant }}>
              Manage your cases, documents, and legal practice from one central location.
            </p>
          </div>

          {/* Period Selector - Desktop */}
          <div className="hidden md:flex items-center space-x-1 p-1 rounded-lg" style={{ backgroundColor: colors.surfaceContainerHighest }}>
            {["week", "month", "year"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className="px-4 py-2 text-sm font-medium rounded-md transition-all duration-200"
                style={{
                  backgroundColor: selectedPeriod === period ? colors.surfaceContainerLowest : "transparent",
                  color: selectedPeriod === period ? colors.secondary : colors.onSurfaceVariant,
                  boxShadow: selectedPeriod === period ? "0 1px 3px rgba(0,0,0,0.1)" : "none"
                }}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>

          {/* Period Selector - Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobilePeriodSelector(!showMobilePeriodSelector)}
              className="w-full flex items-center justify-between rounded-lg px-4 py-2.5"
              style={{ 
                backgroundColor: colors.surfaceContainerLowest,
                border: `1px solid ${colors.outlineVariant}`
              }}
            >
              <span className="text-sm font-medium" style={{ color: colors.onSurfaceVariant }}>
                Period: {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
              </span>
              <ChevronRight
                className={`h-4 w-4 transition-transform ${showMobilePeriodSelector ? "rotate-90" : ""}`}
                style={{ color: colors.onSurfaceVariant }}
              />
            </button>

            {showMobilePeriodSelector && (
              <div 
                className="absolute mt-1 w-48 rounded-lg shadow-lg z-10"
                style={{ 
                  backgroundColor: colors.surfaceContainerLowest,
                  border: `1px solid ${colors.outlineVariant}`
                }}
              >
                {["week", "month", "year"].map((period) => (
                  <button
                    key={period}
                    onClick={() => {
                      setSelectedPeriod(period);
                      setShowMobilePeriodSelector(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                    style={{
                      backgroundColor: selectedPeriod === period ? `${colors.secondary}10` : "transparent",
                      color: selectedPeriod === period ? colors.secondary : colors.onSurfaceVariant,
                    }}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            )}
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
              className={`${glassCardClass} p-4 md:p-5 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)] transition-all duration-300 group`}
            >
              <div className="flex items-center justify-between mb-3">
                <div 
                  className="p-2.5 rounded-lg group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <Icon className="h-4 w-4 md:h-5 md:w-5" style={{ color: stat.color }} />
                </div>
                {stat.trend && (
                  <span 
                    className="text-xs font-medium px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: stat.trendUp ? "#4caf5015" : `${colors.error}15`,
                      color: stat.trendUp ? "#4caf50" : colors.error,
                    }}
                  >
                    {stat.trend}
                  </span>
                )}
              </div>
              <p className="text-xs md:text-sm mb-1" style={{ color: colors.onSurfaceVariant }}>
                {stat.label}
              </p>
              <p className="text-xl md:text-2xl font-bold" style={{ color: colors.onSurface }}>
                {stat.value}
              </p>
              <div className="mt-2 h-1 w-full rounded-full overflow-hidden" style={{ backgroundColor: colors.surfaceContainerHighest }}>
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
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case Distribution Card */}
          <div className={`${glassCardClass} p-5 md:p-6 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)] transition-shadow`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.secondary}15` }}>
                  <BarChart3 className="h-5 w-5" style={{ color: colors.secondary }} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: colors.onSurface }}>
                  Case Distribution
                </h2>
              </div>
              <select 
                className="px-3 py-2 rounded-lg text-sm focus:outline-none transition-all duration-200"
                style={{
                  backgroundColor: colors.surfaceContainerLowest,
                  border: `1px solid ${colors.outlineVariant}`,
                  color: colors.onSurface,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = colors.secondary;
                  e.currentTarget.style.outline = `2px solid ${colors.secondary}20`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = colors.outlineVariant;
                  e.currentTarget.style.outline = "none";
                }}
              >
                <option>This Month</option>
                <option>This Quarter</option>
                <option>This Year</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
              {caseStats.map((stat, index) => (
                <div key={index} className="rounded-lg p-4" style={{ backgroundColor: colors.surfaceContainerLow }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs" style={{ color: colors.onSurfaceVariant }}>{stat.label}</span>
                    <span className="text-sm font-bold" style={{ color: stat.color }}>
                      {stat.value}
                    </span>
                  </div>
                  <div className="w-full rounded-full h-2.5 overflow-hidden" style={{ backgroundColor: colors.surfaceContainerHighest }}>
                    <div
                      className="h-2.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${(stat.value / (stats?.totalCases || 1)) * 100}%`,
                        backgroundColor: stat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg p-4 text-center" style={{ background: `linear-gradient(135deg, ${colors.secondary}10, ${colors.secondary}05)` }}>
                <p className="text-2xl md:text-3xl font-bold" style={{ color: colors.secondary }}>
                  {stats?.totalClients || 0}
                </p>
                <p className="text-xs mt-1" style={{ color: colors.onSurfaceVariant }}>Total Clients</p>
                <div className="flex items-center justify-center mt-2 text-xs" style={{ color: "#4caf50" }}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+12%</span>
                </div>
              </div>
              <div className="rounded-lg p-4 text-center" style={{ background: `linear-gradient(135deg, #4caf5010, #4caf5005)` }}>
                <p className="text-2xl md:text-3xl font-bold" style={{ color: "#4caf50" }}>
                  {stats?.successRate || 0}%
                </p>
                <p className="text-xs mt-1" style={{ color: colors.onSurfaceVariant }}>Success Rate</p>
                <div className="flex items-center justify-center mt-2 text-xs" style={{ color: "#4caf50" }}>
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  <span>Excellent</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Cases Card */}
          <div className={`${glassCardClass} p-5 md:p-6 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)] transition-shadow`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.secondary}15` }}>
                  <Briefcase className="h-5 w-5" style={{ color: colors.secondary }} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: colors.onSurface }}>
                  Recent Cases
                </h2>
              </div>
              <button className="text-sm font-medium flex items-center group transition-colors" style={{ color: colors.secondary }}>
                View All
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {stats?.recentCases?.length === 0 ? (
              <div className="text-center py-8 rounded-lg" style={{ backgroundColor: colors.surfaceContainerLow }}>
                <Briefcase className="h-12 w-12 mx-auto mb-3" style={{ color: colors.onSurfaceVariant }} />
                <p className="font-medium" style={{ color: colors.onSurfaceVariant }}>No recent cases</p>
                <p className="text-xs mt-1" style={{ color: colors.outline }}>New cases will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.recentCases?.map((caseItem) => (
                  <div
                    key={caseItem._id}
                    className="rounded-lg p-4 transition-all duration-200 cursor-pointer group hover:shadow-md"
                    style={{ 
                      border: `1px solid ${colors.outlineVariant}`,
                      backgroundColor: colors.surfaceContainerLowest
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold group-hover:transition-colors" style={{ color: colors.onSurface }}>
                            {caseItem.caseTitle}
                          </h4>
                          <span
                            className="px-2 py-0.5 text-xs rounded-full"
                            style={{
                              backgroundColor: caseItem.status === "Active" ? "#4caf5015" : `${colors.tertiary}15`,
                              color: caseItem.status === "Active" ? "#4caf50" : colors.tertiary,
                              border: `1px solid ${caseItem.status === "Active" ? "#4caf5020" : `${colors.tertiary}20`}`,
                            }}
                          >
                            {caseItem.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <span className="flex items-center" style={{ color: colors.onSurfaceVariant }}>
                            <User className="h-3 w-3 mr-1" style={{ color: colors.outline }} />
                            {caseItem.clientName || "Client Name"}
                          </span>
                          <span className="flex items-center" style={{ color: colors.onSurfaceVariant }}>
                            <Calendar className="h-3 w-3 mr-1" style={{ color: colors.outline }} />
                            {caseItem.filingDate ? new Date(caseItem.filingDate).toLocaleDateString() : "N/A"}
                          </span>
                        </div>
                      </div>
                      <button className="sm:self-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: colors.secondary }}>
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Upcoming Events Card */}
          <div className={`${glassCardClass} p-5 md:p-6 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)] transition-shadow`}>
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.error}15` }}>
                <Calendar className="h-5 w-5" style={{ color: colors.error }} />
              </div>
              <h2 className="text-lg font-bold" style={{ color: colors.onSurface }}>
                Upcoming Events
              </h2>
            </div>

            {stats?.upcomingEvents?.length === 0 ? (
              <div className="text-center py-8 rounded-lg" style={{ backgroundColor: colors.surfaceContainerLow }}>
                <Calendar className="h-12 w-12 mx-auto mb-3" style={{ color: colors.onSurfaceVariant }} />
                <p className="font-medium" style={{ color: colors.onSurfaceVariant }}>No upcoming events</p>
                <p className="text-xs mt-1" style={{ color: colors.outline }}>Schedule new events to see them here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.upcomingEvents?.map((event) => (
                  <div
                    key={event._id}
                    className="rounded-lg p-4 transition-all hover:shadow-md"
                    style={{ 
                      borderLeft: `4px solid ${colors.error}`,
                      backgroundColor: `${colors.error}05`,
                      border: `1px solid ${colors.outlineVariant}`,
                      borderLeftColor: colors.error
                    }}
                  >
                    <h4 className="font-bold mb-2" style={{ color: colors.onSurface }}>
                      {event.eventTitle}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Briefcase className="h-3 w-3 mr-2" style={{ color: colors.outline }} />
                        <span className="text-xs" style={{ color: colors.onSurfaceVariant }}>
                          Case: {event.caseId?.caseTitle || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-2" style={{ color: colors.outline }} />
                        <span className="text-xs" style={{ color: colors.onSurfaceVariant }}>
                          Client: {event.caseId?.clientName || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-2" style={{ color: colors.outline }} />
                        <span className="text-xs" style={{ color: colors.onSurfaceVariant }}>
                          {event.eventDate ? new Date(event.eventDate).toLocaleString() : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity Card */}
          <div className={`${glassCardClass} p-5 md:p-6 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)] transition-shadow`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.secondary}15` }}>
                  <Bell className="h-5 w-5" style={{ color: colors.secondary }} />
                </div>
                <h2 className="text-lg font-bold" style={{ color: colors.onSurface }}>
                  Recent Activity
                </h2>
              </div>
              <button className="text-xs font-medium transition-colors" style={{ color: colors.secondary }}>
                View All
              </button>
            </div>

            <div className="space-y-3">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-2 rounded-lg transition-colors hover:bg-surfaceContainerLow"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${activity.color}15` }}>
                      <Icon className="h-3 w-3" style={{ color: activity.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium" style={{ color: colors.onSurface }}>
                        {activity.message}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: colors.onSurfaceVariant }}>
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Profile Summary Card */}
          <div className={`${glassCardClass} p-5 md:p-6 hover:shadow-[0_8px_30px_rgba(30,41,59,0.1)] transition-shadow`}>
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.secondary}15` }}>
                <User className="h-5 w-5" style={{ color: colors.secondary }} />
              </div>
              <h2 className="text-lg font-bold" style={{ color: colors.onSurface }}>
                Profile Summary
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 pb-4" style={{ borderBottom: `1px solid ${colors.outlineVariant}` }}>
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center shadow-md"
                  style={{ background: `linear-gradient(135deg, ${colors.secondary}, ${colors.secondaryContainer})` }}
                >
                  {profile?.profileImage ? (
                    <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <span className="text-xl font-bold text-white">
                      {profile?.name?.charAt(0) || "L"}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-bold" style={{ color: colors.onSurface }}>
                    Adv. {profile?.name || "Lawyer"}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: colors.onSurfaceVariant }}>
                    Bar ID: {profile?.barCouncilId || "N/A"}
                  </p>
                  <div className="flex items-center mt-1.5">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: "#4caf5015", color: "#4caf50" }}>
                      <span className="w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: "#4caf50" }} />
                      Online
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg p-3" style={{ backgroundColor: colors.surfaceContainerLow }}>
                  <p className="text-[10px] mb-1" style={{ color: colors.onSurfaceVariant }}>Experience</p>
                  <p className="text-sm font-bold" style={{ color: colors.onSurface }}>
                    {profile?.experience || 0} years
                  </p>
                </div>
                <div className="rounded-lg p-3" style={{ backgroundColor: colors.surfaceContainerLow }}>
                  <p className="text-[10px] mb-1" style={{ color: colors.onSurfaceVariant }}>Cases Won</p>
                  <p className="text-sm font-bold" style={{ color: "#4caf50" }}>
                    {stats?.casesWon || 0}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-3" style={{ color: colors.outline }} />
                  <span className="text-xs truncate" style={{ color: colors.onSurfaceVariant }}>
                    {profile?.email || "No email"}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-3" style={{ color: colors.outline }} />
                  <span className="text-xs" style={{ color: colors.onSurfaceVariant }}>
                    {profile?.phone || "No phone"}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-3" style={{ color: colors.outline }} />
                  <span className="text-xs truncate" style={{ color: colors.onSurfaceVariant }}>
                    {profile?.location?.city || ""}, {profile?.location?.state || ""}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Award className="h-4 w-4 mr-3" style={{ color: colors.outline }} />
                  <span className="text-xs" style={{ color: colors.onSurfaceVariant }}>
                    Rating: {stats?.rating || "4.8"} ★
                  </span>
                </div>
              </div>

              {/* Specialization Tags */}
              <div className="pt-3" style={{ borderTop: `1px solid ${colors.outlineVariant}` }}>
                <p className="text-[10px] mb-2" style={{ color: colors.onSurfaceVariant }}>
                  Specializations
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {stats?.specializations?.length > 0 ? (
                    stats.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded-lg text-[10px] font-medium"
                        style={{ 
                          backgroundColor: `${colors.secondary}10`,
                          color: colors.secondary,
                          border: `1px solid ${colors.secondary}20`
                        }}
                      >
                        {spec}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs" style={{ color: colors.outline }}>
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