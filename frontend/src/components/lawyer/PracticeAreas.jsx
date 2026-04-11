// src/components/lawyer/PracticeAreas.jsx

import {
  Scale,
  Gavel,
  Briefcase,
  Home,
  Heart,
  Car,
  Shield,
  Users,
  Landmark,
  Building,
  FileText,
  TrendingUp,
  Award,
  ChevronRight,
} from "lucide-react";

import { useState } from "react";

const PracticeAreas = ({ areas = [], lawyer, categories = [] }) => {
  const [showAll, setShowAll] = useState(false);

  // ✅ FIX: get proper name from ID or object
  const getName = (area) => {
    if (!area) return "Unknown";

    // string → find in categories
    if (typeof area === "string") {
      const found = categories.find((c) => c._id === area);
      return found?.name || "Unknown";
    }

    // object
    if (typeof area === "object") {
      if (area.name) return area.name;

      if (area._id) {
        const found = categories.find((c) => c._id === area._id);
        return found?.name || area._id;
      }
    }

    return "Unknown";
  };

  const normalizedAreas = (areas || []).filter(Boolean);

  const displayedAreas = showAll
    ? normalizedAreas
    : normalizedAreas.slice(0, 6);

  // Icon mapping
  const getAreaIcon = (name = "") => {
    const n = name.toLowerCase();

    if (n.includes("criminal")) return Gavel;
    if (n.includes("civil")) return Scale;
    if (n.includes("corporate")) return Briefcase;
    if (n.includes("family")) return Heart;
    if (n.includes("property")) return Home;
    if (n.includes("real estate")) return Building;
    if (n.includes("traffic")) return Car;
    if (n.includes("employment")) return Users;
    if (n.includes("intellectual")) return Shield;
    if (n.includes("tax")) return Landmark;
    if (n.includes("contract")) return FileText;
    if (n.includes("litigation")) return TrendingUp;

    return Scale;
  };

  if (!normalizedAreas.length) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border p-6">
        <h2 className="font-bold mb-3">Practice Areas</h2>
        <p className="text-gray-500 text-sm">No practice areas added</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border p-6">
      {/* Header */}
      <div className="flex justify-between mb-5">
        <h2 className="font-bold text-lg">Practice Areas</h2>
        <span className="text-sm text-indigo-600">
          {normalizedAreas.length} Areas
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {displayedAreas.map((area, index) => {
          const name = getName(area);
          const Icon = getAreaIcon(name);

          return (
            <div
              key={index}
              className="flex items-center gap-3 p-3 border rounded-lg hover:shadow"
            >
              <Icon className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-medium">{name}</h3>
            </div>
          );
        })}
      </div>

      {/* Show More */}
      {normalizedAreas.length > 6 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-indigo-600 text-sm"
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PracticeAreas;