import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FilterSidebar from "../../components/FilterSidebar";
import LawyerCard from "../../components/LawyerCard";
import API from "../../api/axios";
import socket from "../../api/socket";

import { toast } from "react-hot-toast";

import {
  Search,
  Filter,
  X,
  ChevronDown,
  Star,
  Briefcase,
  IndianRupee,
  MapPin,
  Users,
  ArrowUpDown,
  Award,
  Clock,
  MessageSquare,
  SlidersHorizontal,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default function TalkToLawyer() {
  const navigate = useNavigate();

  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");

  const [location, setLocation] = useState("");
  const [selectedProblems, setSelectedProblems] = useState([]);

  const [requestMap, setRequestMap] = useState({});

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

  // ================= FILTER =================

  const filteredLawyers = useMemo(() => {
    let data = [...lawyers];

    if (search.trim()) {
      data = data.filter((l) =>
        `${l.name || ""} ${l.email || ""} ${l.specialization || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (location.trim()) {
      data = data.filter((l) =>
        `${l.cityName || ""} ${l.stateName || ""}`
          .toLowerCase()
          .includes(location.toLowerCase())
      );
    }

    if (selectedProblems.length > 0) {
      data = data.filter((l) =>
        selectedProblems.some((p) =>
          (l.specialization || "").toLowerCase().includes(p.toLowerCase())
        )
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
  }, [lawyers, search, sortBy, location, selectedProblems]);

  const getActiveFilterCount = () => {
    let count = 0;
    if (location) count++;
    if (selectedProblems.length > 0) count++;
    return count;
  };

  const sortOptions = [
    { value: "", label: "Sort by", icon: ArrowUpDown },
    { value: "Rating", label: "Rating (High to Low)", icon: Star },
    { value: "Experience", label: "Experience (High to Low)", icon: Briefcase },
    { value: "Price", label: "Price (Low to High)", icon: IndianRupee },
  ];

  const clearAllFilters = () => {
    setLocation("");
    setSelectedProblems([]);
    setSearch("");
    setSortBy("");
  };

  // ================= UI =================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* HEADER - Premium Sticky */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Talk to Lawyer
                  </h1>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    Connect with experienced legal professionals
                  </p>
                </div>
              </div>

              {/* Mobile Filter Button with Badge */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden relative flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
              >
                <Filter size={18} />
                <span className="text-sm font-medium">Filters</span>
                {getActiveFilterCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {getActiveFilterCount()}
                  </span>
                )}
              </button>
            </div>

            {/* Stats Bar - Desktop */}
            <div className="hidden sm:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <Users className="h-4 w-4" />
                <span>{lawyers.length} Lawyers</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center gap-1 text-gray-600">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <span>Verified Experts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex relative">
        {/* SIDEBAR - Desktop */}
        <div className="hidden lg:block w-80 xl:w-96 flex-shrink-0 border-r border-gray-200 bg-white/50 backdrop-blur-sm min-h-screen">
          <div className="sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
            <FilterSidebar
              location={location}
              setLocation={setLocation}
              selectedProblems={selectedProblems}
              setSelectedProblems={setSelectedProblems}
            />
          </div>
        </div>

        {/* MOBILE FILTER SIDEBAR - Slide-in */}
        {showMobileFilters && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
            <div className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl lg:hidden animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
                <h3 className="font-bold text-lg">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="overflow-y-auto h-[calc(100%-64px)]">
                <FilterSidebar
                  location={location}
                  setLocation={setLocation}
                  selectedProblems={selectedProblems}
                  setSelectedProblems={setSelectedProblems}
                />
                <div className="p-4 border-t sticky bottom-0 bg-white">
                  <button
                    onClick={() => {
                      clearAllFilters();
                      setShowMobileFilters(false);
                    }}
                    className="w-full py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* MAIN CONTENT */}
        <div className="flex-1 min-w-0">
          {/* Search & Sort Bar - Enhanced */}
          <div className="sticky top-[73px] z-20 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Input - Full width on mobile */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, specialization, or keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown - Responsive */}
              <div className="relative sm:w-64">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 pr-10 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white text-sm cursor-pointer"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Active Filters Chips */}
            {(location || selectedProblems.length > 0 || search || sortBy) && (
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-xs text-gray-500">Active filters:</span>
                {location && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    <MapPin className="h-3 w-3" />
                    {location}
                    <button onClick={() => setLocation("")} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedProblems.map((problem) => (
                  <span
                    key={problem}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                  >
                    {problem}
                    <button
                      onClick={() =>
                        setSelectedProblems(selectedProblems.filter((p) => p !== problem))
                      }
                      className="ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {sortBy && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    Sort: {sortBy}
                    <button onClick={() => setSortBy("")} className="ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {(location || selectedProblems.length > 0 || search || sortBy) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
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
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-700">{filteredLawyers.length}</span>{" "}
                {filteredLawyers.length === 1 ? "lawyer" : "lawyers"}
              </p>
              {filteredLawyers.length > 0 && (
                <p className="text-xs text-gray-400 hidden sm:block">
                  Pay once • Chat forever
                </p>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500">Loading lawyers...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredLawyers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No lawyers found</h3>
                <p className="text-gray-500 max-w-sm">
                  Try adjusting your search or filter criteria to find the right legal expert.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-4 py-2 text-blue-600 font-medium hover:text-blue-700"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Lawyer Cards Grid - Responsive */}
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

            {/* Load More Skeleton - Optional for future pagination */}
            {!loading && filteredLawyers.length > 6 && (
              <div className="mt-8 text-center">
                <button className="px-6 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                  Load More Lawyers
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile Filters */}
      <button
        onClick={() => setShowMobileFilters(true)}
        className="lg:hidden fixed bottom-6 right-6 z-30 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <SlidersHorizontal className="h-4 w-4" />
        <span className="text-sm font-medium">Filters</span>
        {getActiveFilterCount() > 0 && (
          <span className="ml-1 w-5 h-5 bg-white text-blue-600 text-xs rounded-full flex items-center justify-center font-bold">
            {getActiveFilterCount()}
          </span>
        )}
      </button>
    </div>
  );
}