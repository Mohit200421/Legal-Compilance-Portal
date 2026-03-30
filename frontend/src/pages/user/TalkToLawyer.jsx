import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FilterSidebar from "../../components/FilterSidebar";
import LawyerCard from "../../components/LawyerCard";
import API from "../../api/axios";
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  ChevronDown,
  Star,
  Briefcase,
  IndianRupee,
  MapPin,
  Users,
  ArrowUpDown,
  Sparkles,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Shield,
  Gavel,
  Scale,
  MessageSquare,
  Phone,
  Video,
  Calendar,
  ChevronRight,
  Menu
} from "lucide-react";

export default function TalkToLawyer() {
  const navigate = useNavigate();

  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Search + Sort
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Sidebar Filters
  const [location, setLocation] = useState("");
  const [selectedProblems, setSelectedProblems] = useState([]);

  // store request status map { lawyerId : "Pending/Accepted/Rejected" }
  const [requestMap, setRequestMap] = useState({});

  const fetchLawyers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/user/lawyers");
      setLawyers(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load lawyers");
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
    { value: "", label: "Sort by" },
    { value: "Rating", label: "Rating (High to Low)", icon: Star },
    { value: "Experience", label: "Experience (High to Low)", icon: Clock },
    { value: "Price", label: "Price (Low to High)", icon: IndianRupee },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg mb-2">
                <MessageSquare className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-xs font-semibold text-blue-600 tracking-wider">CONSULTATION</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Talk to Lawyer</h1>
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                Connect with experienced legal professionals
              </p>
            </div>
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center justify-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filters</span>
              {getActiveFilterCount() > 0 && (
                <span className="ml-1 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Filter Sidebar - Desktop */}
        <div className="hidden lg:block w-80 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] p-4">
          <FilterSidebar
            location={location}
            setLocation={setLocation}
            selectedProblems={selectedProblems}
            setSelectedProblems={setSelectedProblems}
          />
        </div>

        {/* Filter Sidebar - Mobile */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between">
                <h3 className="font-bold text-white">Filters</h3>
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
              <div className="p-4">
                <FilterSidebar
                  location={location}
                  setLocation={setLocation}
                  selectedProblems={selectedProblems}
                  setSelectedProblems={setSelectedProblems}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6">
          {/* Search and Sort Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Box */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or specialization..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-300 bg-white rounded-lg text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-gray-100 p-1 rounded-full"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="md:w-64">
                <div className="relative">
                  <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 border border-gray-300 bg-white rounded-lg text-sm appearance-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(location || selectedProblems.length > 0) && (
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">Active filters:</span>
                {location && (
                  <span className="inline-flex items-center px-2 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs">
                    <MapPin className="h-3 w-3 text-blue-600 mr-1" />
                    {location}
                    <button
                      onClick={() => setLocation("")}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedProblems.map((problem) => (
                  <span key={problem} className="inline-flex items-center px-2 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs">
                    <Briefcase className="h-3 w-3 text-blue-600 mr-1" />
                    {problem}
                    <button
                      onClick={() => setSelectedProblems(selectedProblems.filter(p => p !== problem))}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => {
                    setLocation("");
                    setSelectedProblems([]);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 ml-2"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Results Stats */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium text-gray-900">{filteredLawyers.length}</span> lawyers
                {search && <span> for "<span className="font-medium">{search}</span>"</span>}
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
              <Award className="h-4 w-4 text-yellow-500" />
              <span className="text-xs text-gray-600">{lawyers.length} available</span>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="inline-flex flex-col items-center space-y-3">
                <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                <p className="text-gray-600">Loading lawyers...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredLawyers.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No lawyers found</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                Try adjusting your search or filter criteria to find the right legal professional.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setLocation("");
                  setSelectedProblems([]);
                  setSortBy("");
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Lawyer Grid */}
          {!loading && filteredLawyers.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
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
  );
}