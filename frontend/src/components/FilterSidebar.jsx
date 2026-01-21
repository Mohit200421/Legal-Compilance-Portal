import { MapPin } from "lucide-react";
import "./filtersidebar.css";


const problemTypes = [
  "Divorce & Child Custody",
  "Property & Real Estate",
  "Cheque Bounce & Money Recovery",
  "Employment Issues",
  "Consumer Protection",
  "Civil Matters",
  "Cyber Crime",
  "Company & Start-Ups",
  "Other Legal Problem",
  "Criminal Matter",
];

export default function FilterSidebar({
  location,
  setLocation,
  selectedProblems,
  setSelectedProblems,
}) {
  const toggleProblem = (problem) => {
    if (selectedProblems.includes(problem)) {
      setSelectedProblems(selectedProblems.filter((p) => p !== problem));
    } else {
      setSelectedProblems([...selectedProblems, problem]);
    }
  };

  const clearFilters = () => {
    setLocation("");
    setSelectedProblems([]);
  };

  return (
    <aside className="filter-sidebar">
      {/* Header */}
      <div className="filter-header">
        <h2>Filter by</h2>

        <button onClick={clearFilters} className="filter-clear-btn">
          Clear
        </button>
      </div>

      {/* Location */}
      <div className="filter-section">
        <label className="filter-label">Location</label>

        <div className="filter-location-box">
          <MapPin size={18} className="filter-location-icon" />

          <input
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="filter-location-input"
          />
        </div>
      </div>

      {/* Problem Type */}
      <div className="filter-section">
        <label className="filter-label">Problem type</label>

        <div className="filter-problem-list">
          {problemTypes.map((item, index) => (
            <label key={index} className="filter-checkbox-row">
              <input
                type="checkbox"
                checked={selectedProblems.includes(item)}
                onChange={() => toggleProblem(item)}
                className="filter-checkbox"
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
