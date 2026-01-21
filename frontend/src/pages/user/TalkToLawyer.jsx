import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/usercss/talktolawyer.css";
import FilterSidebar from "../../components/FilterSidebar";
import LawyerCard from "../../components/LawyerCard";
import API from "../../api/axios";

export default function TalkToLawyer() {
  const navigate = useNavigate();

  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search + Sort
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Sidebar Filters
  const [location, setLocation] = useState("");
  const [selectedProblems, setSelectedProblems] = useState([]);

  // ✅ store request status map { lawyerId : "Pending/Accepted/Rejected" }
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
        `${l.name || ""} ${l.email || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (location.trim()) {
      data = data.filter((l) =>
        `${l.cityName || ""} ${l.stateName || ""} ${l.email || ""}`
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

  return (
    <div className="talk-wrapper">
      <div className="talk-top">
        <h2>Talk to Lawyer</h2>
      </div>

      <div className="talk-body">
        <FilterSidebar
          location={location}
          setLocation={setLocation}
          selectedProblems={selectedProblems}
          setSelectedProblems={setSelectedProblems}
        />

        <div className="talk-right">
          <div className="search-sort-row">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search lawyer"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="button">🔍</button>
            </div>

            <div className="sort-box">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Select an option</option>
                <option value="Rating">Rating</option>
                <option value="Experience">Experience</option>
                <option value="Price">Price</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p className="talk-loading">Loading lawyers...</p>
          ) : filteredLawyers.length === 0 ? (
            <p className="talk-empty">No lawyers found.</p>
          ) : (
            <div className="lawyer-grid">
              {filteredLawyers.map((lawyer) => (
                <LawyerCard
                  key={lawyer._id}
                  lawyer={lawyer}
                  requestStatus={requestMap[lawyer._id]}
                  refreshRequests={fetchMyRequestsMap}
                  onChat={() => navigate("/user/my-requests")} // ✅ Chat redirect
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
