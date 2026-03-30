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
  BookOpen,
  FileText,
  TrendingUp,
  Award,
  Star,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const PracticeAreas = ({ areas = [], lawyer }) => {
  const [showAll, setShowAll] = useState(false);
  // Filter out null/undefined areas
  const validAreas = (areas || []).filter((area) => area != null);
  const displayedAreas = showAll ? validAreas : validAreas.slice(0, 6);

  // Icon mapping for different practice areas
  const getAreaIcon = (areaName) => {
    const name = typeof areaName === "string" ? areaName.toLowerCase() : "";

    const iconMap = {
      criminal: Gavel,
      civil: Scale,
      corporate: Briefcase,
      family: Heart,
      property: Home,
      "real estate": Building,
      traffic: Car,
      employment: Users,
      "intellectual property": Shield,
      tax: Landmark,
      contract: FileText,
      litigation: TrendingUp,
      bankruptcy: Landmark,
      immigration: Users,
      environmental: Scale,
      healthcare: Heart,
    };

    // Find matching icon based on keywords
    for (const [keyword, icon] of Object.entries(iconMap)) {
      if (name.includes(keyword)) {
        return icon;
      }
    }

    return Scale; // default icon
  };

  if (!areas || areas.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center space-x-2 mb-6">
          <div className="p-2 bg-indigo-100 rounded-xl">
            <Scale className="h-5 w-5 text-indigo-600" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            Practice Areas
          </h2>
        </div>

        <div className="text-center py-8 px-4">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Scale className="h-8 w-8 text-indigo-400" />
          </div>
          <p className="text-gray-500 italic mb-2">No practice areas listed</p>
          <p className="text-xs text-gray-400">
            This lawyer hasn't added their practice areas yet
          </p>
        </div>

        {/* Suggestions for common practice areas */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2 text-center">
            Common practice areas:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Criminal Law", "Civil Law", "Corporate Law", "Family Law"].map(
              (area, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs border border-gray-200"
                >
                  {area}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-100 rounded-xl">
            <Scale className="h-5 w-5 text-indigo-600" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            Practice Areas
          </h2>
        </div>

        {areas.length > 0 && (
          <span className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
            <Award className="h-3 w-3 mr-1" />
            {areas.length} {areas.length === 1 ? "Area" : "Areas"}
          </span>
        )}
      </div>

      {/* Areas Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayedAreas.map((area, index) => {
          const areaName = area.name || area;
          const Icon = getAreaIcon(areaName);

          return (
            <div
              key={area.id || area._id || index}
              className="group bg-gradient-to-br from-gray-50 to-gray-100 hover:from-indigo-50 hover:to-blue-50 rounded-xl p-4 transition-all duration-300 cursor-pointer border border-gray-200 hover:border-indigo-300 hover:shadow-md"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2.5 bg-white rounded-lg shadow-sm group-hover:scale-110 group-hover:bg-indigo-50 transition-all duration-300">
                  <Icon className="h-5 w-5 text-indigo-600 group-hover:text-indigo-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors text-sm md:text-base">
                    {areaName}
                  </h3>

                  {/* Experience in this area (if available) */}
                  {area.experience && (
                    <p className="text-xs text-gray-500 mt-1">
                      {area.experience} years experience
                    </p>
                  )}

                  {/* Cases count (if available) */}
                  {area.casesCount && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {area.casesCount} cases handled
                    </p>
                  )}
                </div>
              </div>

              {/* Hover indicator */}
              <div className="mt-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-indigo-600 flex items-center">
                  View details
                  <ChevronRight className="h-3 w-3 ml-1" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show More/Less Button */}
      {areas.length > 6 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center px-6 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm font-medium transition-all duration-300 border border-indigo-200 hover:border-indigo-300"
          >
            {showAll ? (
              <>
                Show Less
                <ChevronRight className="h-4 w-4 ml-1 rotate-90" />
              </>
            ) : (
              <>
                View All {areas.length} Areas
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Additional Info */}
      {lawyer?.specializations && lawyer.specializations.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Specializations
          </h3>
          <div className="flex flex-wrap gap-2">
            {lawyer.specializations.map((spec, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium border border-indigo-200"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stats Row - Mobile */}
      <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-gray-200 md:hidden">
        <div className="text-center">
          <p className="text-xs text-gray-500">Total Areas</p>
          <p className="text-base font-bold text-indigo-600">{areas.length}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Experience</p>
          <p className="text-base font-bold text-gray-900">
            {lawyer?.experience || 15}+ yrs
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Success Rate</p>
          <p className="text-base font-bold text-green-600">
            {lawyer?.successRate || 95}%
          </p>
        </div>
      </div>

      {/* Popular Tags View - Alternative layout for many areas */}
      {areas.length > 12 && !showAll && (
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2">Popular tags:</p>
          <div className="flex flex-wrap gap-2">
            {areas.slice(0, 8).map((area, index) => {
              const areaName = area.name || area;
              return (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs border border-indigo-200 hover:bg-indigo-100 transition-colors cursor-pointer"
                >
                  {areaName}
                </span>
              );
            })}
            <span className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-full text-xs border border-gray-200">
              +{areas.length - 8} more
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeAreas;
