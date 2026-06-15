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
  const [specializationFilter, setSpecializationFilter] = useState("");

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

  // Get unique specializations from lawyers
  const uniqueSpecializations = useMemo(() => {
    const specializations = new Set();
    lawyers.forEach(lawyer => {
      if (lawyer.specialization) {
        specializations.add(lawyer.specialization);
      }
    });
    return Array.from(specializations).sort();
  }, [lawyers]);

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

    if (specializationFilter && specializationFilter !== "All Specializations") {
      data = data.filter((l) => l.specialization === specializationFilter);
    }

    if (sortBy === "Rating") {
      data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "Experience") {
      data.sort((a, b) => (b.experience || 0) - (a.experience || 0));
    } else if (sortBy === "Price") {
      data.sort((a, b) => (a.price || 0) - (b.price || 0));
    }

    return data;
  }, [lawyers, search, sortBy, specializationFilter]);

  const sortOptions = [
    { value: "", label: "Sort by", icon: ArrowUpDown },
    { value: "Rating", label: "Rating (High to Low)", icon: Star },
    { value: "Experience", label: "Experience (High to Low)", icon: Briefcase },
    { value: "Price", label: "Price (Low to High)", icon: IndianRupee },
  ];

  const clearAllFilters = () => {
    setSearch("");
    setSortBy("");
    setSpecializationFilter("");
  };

  // ================= UI =================

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.surface }}>
      {/* HEADER - Glass Sticky - Exactly as per design */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          {/* Main Header Row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left Section: Title and Stats */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                Find the Right Lawyer for Your Case
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Search lawyers by name, specialization, experience, ratings or fees.
              </p>
            </div>

            {/* Right Section: Stats Badges */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                  <Users className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Verified Lawyers</p>
                  <p className="text-lg font-semibold text-gray-900">{lawyers.length}+</p>
                </div>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-50">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Average Rating</p>
                  <p className="text-lg font-semibold text-gray-900">4.6/5</p>
                </div>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-50">
                  <Sparkles className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Secure & Confidential</p>
                  <p className="text-sm font-medium text-gray-700">100% Guaranteed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar - Below Header */}
          <div className="mt-6 flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, keyword or specialization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Specialization Filter Dropdown */}
            <div className="relative md:w-64">
              <select
                value={specializationFilter || "All Specializations"}
                onChange={(e) => setSpecializationFilter(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 cursor-pointer"
              >
                <option value="All Specializations">All Specializations</option>
                {uniqueSpecializations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative md:w-56">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 cursor-pointer"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Clear Filters Button */}
            {(search || sortBy || specializationFilter) && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex relative">
        {/* MAIN CONTENT */}
        <div className="flex-1 min-w-0">
          {/* Results Area */}
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-900">{filteredLawyers.length}</span>{" "}
                {filteredLawyers.length === 1 ? "lawyer" : "lawyers"}
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                <p className="mt-4 text-gray-500">Loading lawyers...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredLawyers.length === 0 && (
              <div className="bg-gray-50 rounded-xl flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No lawyers found</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Try adjusting your search criteria to find the right legal expert.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-4 py-2 text-blue-600 font-medium hover:text-blue-700"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Lawyer Cards Grid */}
            {!loading && filteredLawyers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
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