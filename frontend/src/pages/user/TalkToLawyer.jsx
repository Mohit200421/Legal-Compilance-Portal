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
    { value: "", label: "Sort by" },
    { value: "Rating", label: "Rating (High to Low)" },
    { value: "Experience", label: "Experience (High to Low)" },
    { value: "Price", label: "Price (Low to High)" },
  ];

  // ================= UI =================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b p-4 sticky top-0 z-20">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Talk to Lawyer</h1>

          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden border px-3 py-2 rounded"
          >
            <Filter size={16} />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* SIDEBAR */}
        <div className="hidden lg:block w-72 p-4 border-r bg-white">
          <FilterSidebar
            location={location}
            setLocation={setLocation}
            selectedProblems={selectedProblems}
            setSelectedProblems={setSelectedProblems}
          />
        </div>

        {/* MAIN */}
        <div className="flex-1 p-4">
          {/* SEARCH */}
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Search lawyers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border p-2 rounded"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border p-2 rounded"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* RESULTS */}
          {loading ? (
            <p>Loading...</p>
          ) : filteredLawyers.length === 0 ? (
            <p>No lawyers found</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
