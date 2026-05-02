import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LawyerCard from "../../components/LawyerCard";
import API from "../../api/axios";
import socket from "../../api/socket";

import { toast } from "react-hot-toast";

import {
  Search,
  X,
  ChevronDown,
  Star,
  Briefcase,
  IndianRupee,
  Users,
  ArrowUpDown,
  Sparkles,
  MessageSquare,
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

export default function TalkToLawyer() {
  const navigate = useNavigate();

  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");

  const [requestMap, setRequestMap] = useState({});

  // Glassmorphism card style
  const glassCardClass = "bg-white/80 backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(30,41,59,0.05)] border border-white/50";

  // ================= FETCH =================

  const fetchLawyers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/user/lawyers");
      setLawyers(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load lawyers");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRequestsMap = async () => {
    try {
      const res = await API.get("/user/my-requests-map");
      setRequestMap(res.data || {});
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchLawyers();
    fetchMyRequestsMap();
  }, []);

  // ================= SOCKET =================

  useEffect(() => {
    if (!socket) return;

    const handleStatusUpdate = (data) => {
      console.log("📡 requestStatusUpdated:", data);

      setRequestMap((prev) => ({
        ...prev,
        [data.lawyerId]: data.status,
      }));

      toast.success(`Request ${data.status}!`);
    };

    socket.on("requestStatusUpdated", handleStatusUpdate);

    return () => {
      socket.off("requestStatusUpdated", handleStatusUpdate);
    };
  }, []);

  // ================= FILTER & SORT =================

  const filteredLawyers = useMemo(() => {
    let data = [...lawyers];

    if (search.trim()) {
      data = data.filter((l) =>
        `${l.name || ""} ${l.email || ""} ${l.specialization || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (sortBy === "Rating") {
      data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "Experience") {
      data.sort((a, b) => (b.experience || 0) - (a.experience || 0));
    } else if (sortBy === "Price") {
      data.sort((a, b) => (a.price || 0) - (b.price || 0));
    }

    return data;
  }, [lawyers, search, sortBy]);

  const sortOptions = [
    { value: "", label: "Sort by", icon: ArrowUpDown },
    { value: "Rating", label: "Rating (High to Low)", icon: Star },
    { value: "Experience", label: "Experience (High to Low)", icon: Briefcase },
    { value: "Price", label: "Price (Low to High)", icon: IndianRupee },
  ];

  const clearAllFilters = () => {
    setSearch("");
    setSortBy("");
  };

  // ================= UI =================

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.surface }}>
      {/* HEADER - Glass Sticky */}
      <div className="sticky top-0 z-30" >
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                style={{ background: `linear-gradient(135deg, ${colors.secondary}, ${colors.secondaryContainer})` }}
              >
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold leading-[1.2] tracking-[-0.02em]" style={{ color: colors.onSurface }}>
                  Talk to Lawyer
                </h1>
                <p className="text-xs hidden sm:block" style={{ color: colors.onSurfaceVariant }}>
                  Connect with experienced legal professionals
                </p>
              </div>
            </div>

            {/* Stats Bar - Desktop */}
            <div className="hidden sm:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1" style={{ color: colors.onSurfaceVariant }}>
                <Users className="h-4 w-4" />
                <span>{lawyers.length} Lawyers</span>
              </div>
              <div className="w-px h-4" style={{ backgroundColor: colors.outlineVariant }}></div>
              <div className="flex items-center gap-1" style={{ color: colors.onSurfaceVariant }}>
                <Sparkles className="h-4 w-4" style={{ color: colors.tertiary }} />
                <span>Verified Experts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex relative">
        {/* MAIN CONTENT */}
        <div className="flex-1 min-w-0">
          {/* Search & Sort Bar - Glass */}
          <div className="sticky top-[73px] z-20 px-4 sm:px-6 lg:px-8 py-4" style={{ 
            backgroundColor: "rgba(251, 248, 250, 0.95)",
            backdropFilter: "blur(8px)",
            borderBottom: `1px solid ${colors.outlineVariant}`
          }}>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: colors.outline }} />
                <input
                  type="text"
                  placeholder="Search by name, specialization, or keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl transition-all duration-200 focus:outline-none"
                  style={{
                    backgroundColor: colors.surfaceContainerLowest,
                    border: `1px solid ${colors.outlineVariant}`,
                    color: colors.onSurface,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.secondary;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.secondary}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.outlineVariant;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-4 w-4" style={{ color: colors.outline }} />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative sm:w-64">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl transition-all duration-200 focus:outline-none text-sm cursor-pointer"
                  style={{
                    backgroundColor: colors.surfaceContainerLowest,
                    border: `1px solid ${colors.outlineVariant}`,
                    color: colors.onSurface,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.secondary;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.secondary}20`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.outlineVariant;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: colors.outline }} />
              </div>
            </div>

            {/* Active Filters Chips */}
            {(search || sortBy) && (
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-xs" style={{ color: colors.onSurfaceVariant }}>Active filters:</span>
                {search && (
                  <span 
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full"
                    style={{ backgroundColor: `${colors.secondary}15`, color: colors.secondary }}
                  >
                    <Search className="h-3 w-3" />
                    {search.length > 20 ? `${search.substring(0, 20)}...` : search}
                    <button onClick={() => setSearch("")} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {sortBy && (
                  <span 
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full"
                    style={{ backgroundColor: colors.surfaceContainerHighest, color: colors.onSurfaceVariant }}
                  >
                    Sort: {sortBy}
                    <button onClick={() => setSortBy("")} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {(search || sortBy) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-medium transition-colors"
                    style={{ color: colors.error }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                  >
                    Clear all
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Results Area */}
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm" style={{ color: colors.onSurfaceVariant }}>
                Showing <span className="font-semibold" style={{ color: colors.onSurface }}>{filteredLawyers.length}</span>{" "}
                {filteredLawyers.length === 1 ? "lawyer" : "lawyers"}
              </p>
              {filteredLawyers.length > 0 && (
                <p className="text-xs hidden sm:block" style={{ color: colors.onSurfaceVariant }}>
                  Pay once • Chat forever
                </p>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: `${colors.secondary}30`, borderTopColor: colors.secondary }} />
                <p className="mt-4" style={{ color: colors.onSurfaceVariant }}>Loading lawyers...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredLawyers.length === 0 && (
              <div className={`${glassCardClass} flex flex-col items-center justify-center py-20 text-center`}>
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: colors.surfaceContainerHighest }}>
                  <Search className="h-10 w-10" style={{ color: colors.onSurfaceVariant }} />
                </div>
                <h3 className="text-lg font-semibold mb-1" style={{ color: colors.onSurface }}>No lawyers found</h3>
                <p className="text-sm max-w-sm" style={{ color: colors.onSurfaceVariant }}>
                  Try adjusting your search criteria to find the right legal expert.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-4 py-2 font-medium transition-colors"
                  style={{ color: colors.secondary }}
                  onMouseEnter={(e) => e.currentTarget.style.color = colors.secondaryContainer}
                  onMouseLeave={(e) => e.currentTarget.style.color = colors.secondary}
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Lawyer Cards Grid */}
            {!loading && filteredLawyers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 auto-rows-fr">
                {filteredLawyers.map((lawyer) => (
                  <LawyerCard
                    key={lawyer._id}
                    lawyer={lawyer}
                    requestStatus={requestMap[lawyer._id]}
                    refreshRequests={fetchMyRequestsMap}
                    onChat={() => navigate("/user/my-requests")}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}